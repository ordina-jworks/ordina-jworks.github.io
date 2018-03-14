---
layout: post
authors: [michael_vervloet, axel_bergmans]
title: 'Stairway to Health 2.0 (the Ordina version)'
image: /img/stairwaytohealth2/banner.jpg
tags: [NodeJS, nestJs, MongoDB, Angular, ExpressJS, Express, TypeScript, Angular-CLI, Internet of Things, IoT, LoRa]
category: IoT
comments: true
---
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.9.0/css/lightbox.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-grid-only@1.0.0/bootstrap.css" />

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.9.0/js/lightbox.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap-grid-only@1.0.0/index.min.js"></script>


<h2>Harder, Better, Faster, Stronger</h2>
Here we are again, another blog post about [Stairway to Health](http://sth2-fe-prod-ordina-stairway-to-health.origin.ordina-jworks.io/dashboard).


Why? Well, we've created our own Ordina version of the [Stairway to Health](http://sth2-fe-prod-ordina-stairway-to-health.origin.ordina-jworks.io/dashboard) application.
There are quite a few interesting bells and whistles, among others, here are a few of the new features:
- New (and awesome) frontend design, with Ordina theming obviously
- Upgraded from Angular 4 to Angular 5
- Material Design
- NEST.js in stead of Express.js (still Express underneath, but cleaner code!)
- Backend e2e tests with Mockgoose
- Deployed on OpenShift
- New type of sensors
- Cheers feature, users can motivate and support each other


<h2>Stairway to Health @ Ordina</h2>
As you might have read in our [previous post](https://ordina-jworks.github.io/iot/2017/10/12/Stairway-To-Health.html) about Stairway to Health, the purpose of the application is to improve worker health in a fun and engaging way. 
With the app we try to encourage employees to take the stairs instead of the elevator.
We've put up some sensors that can detect how much the stairs are used on a per floor basis and how many people take the elevator.
In the app they can see the results and thus they can do an extra effort if they are falling behind.
New in the Ordina version is that employees can now also cheer and motivate each other since we've added a chat feature to the application.


<h2>Internet of Things</h2>
The [Stairway to Health](http://sth2-fe-prod-ordina-stairway-to-health.origin.ordina-jworks.io/dashboard) project is a simple yet great example to show what the Internet of Things can do:
- LoRa sensors detect door openings, these are installed on the doors of the staircases
- These sensors communicate via the LoRa network to report their status
- In our case sensor data is sent to the Proximus MyThings platform which processes the data
- The data gets sent to the Stairway to Health application
- The Stairway to Health application interprets and visualises the data

In summary: We install sensors on the doors (things) to measure usage and we analyse the data to persuade people to move more.
The result is a good example of how IoT can influence our daily lives.

For more on this topic, check the application's [About page](http://sth2-fe-prod-ordina-stairway-to-health.origin.ordina-jworks.io/about)</a>


<h2>Dive into the technical details</h2>
The reason of us writing this blog post is mainly because we want to explain some of the technical changes and improvements we've made
since we've updated (pretty much rewritten) the application. 
So let's get started.


<h3>The API</h3>
ExpressJs to NestJs: The main difference here is that we've rewritten the application to use the new framework inf favour of the old implementation with ExpressJs.
Migrating from Express to Nest is not that difficult, since nest is a wrapper on top of the Express framework.
It provides you with some nice TypeScript decorators which makes your code a lot cleaner, more compact and easier to read.


<h4>ExpressJs example</h4>
```typescript
export class EntityApi extends CoreApi {
    private entityController: EntityController = new EntityController();
    constructor() {
        super();
    }

    // the create function would that have to be executed by the main server while bootstrapping the application
    public create(router: Router) {
        router.get( '/auth/entities',
                    this.authenticate,
                    this.requireAdmin,
                    (req: Request, res: Response, next: NextFunction) => {
                        this.entityController.getEntityList(req, res, next);
                    });
    }
}
```


<h4>NestJs example</h4>
```typescript
// automatically registered to the server by nest
// all /auth routes require user to be logged in (doesn't come standard with Nest)
@Controller('/auth/entities')
@UseGuards(RolesGuard)
export class EntitiesController {
    constructor(private readonly entitiesService: EntitiesService) {}
    @Get('/')
    @Roles('admin')
    async findAll(): Promise<IEntity[]> {
        return await this.entitiesService.findAll();
    }
}
```


<h3>Websockets with NestJs</h3>
Working with sockets is also a lot easier and cleaner when using Nest.
We can utilise the `@WebSocketGateway` to create a new route/gateway, `@SubscribeMessage` to listen for certain events and `@OnGatewayConnection` or `@OnGatewayDisconnect` to know when users connect or disconnect to the server.
There wasn't any straight forward solution for broadcasting to all clients. 
Once a user sends a message, we want to update the messages for everyone that has the client open. 
So we solved this by pushing all connected clients to an array and when we receive a 'cheer-created' event, we loop over the array of clients and emit an event to them one by one.

```typescript
import {
	WebSocketGateway, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect,
	WsResponse
} from '@nestjs/websockets';

@WebSocketGateway({namespace: 'events/cheers'})
export class CheerEventsComponent implements OnGatewayConnection, OnGatewayDisconnect {
	public clients = [];

	constructor() {

	}

	handleConnection(client: any) {
		this.clients.push(client);
	}

	handleDisconnect(client) {
		for (let i = 0; i < this.clients.length; i++) {
			if (this.clients[i].id === client.id) {
				this.clients.splice(i, 1);
				break;
			}
		}
	}

	@SubscribeMessage('cheer-created')
	onEvent(): WsResponse<void> {
		this.broadcast('cheer');
		return;
	}

	private broadcast(message: string) {
		for (let c of this.clients) {
			c.emit(message);
		}
	}
}
```


<h3>Optimising chart data and counts</h3>
On Stairway to Health we used mongo aggregations to get our chart data from the database. 
Once we hit 1.5 million logs, these calls put a lot of stress on our servers and took a long time to load, so in stead we now keep track of daily, weekly, monthly, yearly and total logs in their own collection.
Whenever we receive a log from the MyThings stream we update all these collections. 
For example the daily logs collection contains documents that look like this:

```json
{
"date": {
    "$date": "2017-12-20T21:49:15.532Z"
},
"friendlyName1": "C",
"friendlyName2": "1",
"hour": 22,
"identifier": "20-12-2017",
"counts": 55
}
```

So when we want the hourly data from a certain day, we query the collection for the date we want and and simply return an array with all the different hours, if an hour doesn't exist, we assume it didn't send any logs/counts.
When we receive a log, we check if there is an entry that has "date" and "hour" equal to the log's date. 
If so, we update, otherwise we create a new entry (upsert).
We still store the log in a "logs" collection, so that if ever our daily, weekly, ... collections get corrupted, we can run a script that populates these collections with the correct data.

```typescript
async create(log: ILog, stream?: boolean): Promise<ILog> {
    try {

        // We insert the log into our logs collection
        let item = await this.logModel.create(log);

        // the identifiers so we can easily query for them
        let dailyIdentifier = `${item.day}-${item.month}-${item.year}`;
        let weeklyIdentifier = `${item.week}-${item.year}`;
        let monthlyIdentifier = `${item.month}-${item.year}`;
        let yearlyIdentifier = `${item.year}`;

        // sensors send all their containers to us, we only need to update the collections
        // if they are 'counters' and they have a numeric value
        if (item.container === 'counter' && item.numericValue) {

            // update all collections
            // by putting them in a variable, they all get executed without having to wait for each one to complete,
            // and we have no 'callback hell', below te do a Promise.all so that we know when they are all done.

            let dailyCountPromise = this.dailyCountsModel.update({
                identifier: dailyIdentifier,
                friendlyName1: item.friendlyName1,
                friendlyName2: item.friendlyName2,
                hour: item.hour
            }, {
                // increment, not overwrite the counts
                $inc: {counts: item.numericValue}
            }, {
                // upsert makes sure that if the entry we try to update doesn't exist, we create one
                upsert: true
            });
            let weeklyCountPromise = this.weeklyCountsModel.update({
                identifier: weeklyIdentifier,
                friendlyName1: item.friendlyName1,
                friendlyName2: item.friendlyName2,
                day: item.day
            }, {
                $inc: {counts: item.numericValue}
            }, {upsert: true});
            let totalCountPromise = this.totalCountsModel.update({
                friendlyName1: item.friendlyName1,
                friendlyName2: item.friendlyName2
            }, {
                $inc: {counts: item.numericValue}
            }, {upsert: true});
            let yearlyCountPromise = this.yearlyCountsModel.update({
                friendlyName1: item.friendlyName1,
                friendlyName2: item.friendlyName2,
                month: item.month,
                identifier: yearlyIdentifier
            }, {
                $inc: {counts: item.numericValue}
            }, {upsert: true});
            let monthlyCountPromise = this.monthlyCountsModel.update({
                friendlyName1: item.friendlyName1,
                friendlyName2: item.friendlyName2,
                week: item.week,
                identifier: monthlyIdentifier
            }, {
                $inc: {counts: item.numericValue}
            }, {upsert: true});

            // once all collections are updated, we emit a 'stream-received' event,
            // which will reload the charts on the client application
            Promise.all([ dailyCountPromise,
                          weeklyCountPromise,
                          totalCountPromise,
                          yearlyCountPromise,
                          monthlyCountPromise]).then(() => {
                              if (stream) {
                                  socket.emit('stream-received');
                              }
                          }, (err) => {
                            console.log(err);
                          });
        }
        return item;
    } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
}
```

<h3>The Visible parts</h3>
The main changes we've made on the frontend are:
- Changing the colours, we created a dark theme with Ordina branding
- Used material design for a smoother user experience
- Replaced Highcharts library with `@swimlane/ngx-charts`
- Migrated to Angular 5

<div class="row">
    <div class="col-md-4">
        <a href="{{ '/img/stairwaytohealth2/frontend1.png' | prepend: site.baseurl }}" data-lightbox="results" data-title="">
            <img alt="frontend 1" src="{{ '/img/stairwaytohealth2/frontend1.png' | prepend: site.baseurl }}" class="image fit">
        </a>
    </div>
    <div class="col-md-4">
        <a href="{{ '/img/stairwaytohealth2/frontend2.png' | prepend: site.baseurl }}" data-lightbox="results" data-title="">
            <img alt="frontend 2" src="{{ '/img/stairwaytohealth2/frontend2.png' | prepend: site.baseurl }}" class="image fit">
        </a>
    </div>
    <div class="col-md-4">
        <a href="{{ '/img/stairwaytohealth2/frontend3.png' | prepend: site.baseurl }}" data-lightbox="results" data-title="">
            <img alt="frontend 3" src="{{ '/img/stairwaytohealth2/frontend3.png' | prepend: site.baseurl }}" class="image fit">
        </a>
    </div>
</div>

Since users should now be able to register to the application to cheer for and motivate each other we added these new screens and functionality.

<div class="row">
    <div class="col-md-6">
        <a href="{{ '/img/stairwaytohealth2/register.png' | prepend: site.baseurl }}" data-lightbox="results" data-title="">
            <img alt="register" src="{{ '/img/stairwaytohealth2/register.png' | prepend: site.baseurl }}" class="image fit">
        </a>
    </div>
    <div class="col-md-6">
        <a href="{{ '/img/stairwaytohealth2/cheer.png' | prepend: site.baseurl }}" data-lightbox="results" data-title="">
            <img alt="cheers" src="{{ '/img/stairwaytohealth2/cheer.png' | prepend: site.baseurl }}" class="image fit">
        </a>
    </div>
</div>


<h3>Deploy on OpenShift</h3>
Since we've separated our frontend and backend code we used 2 separate git repositories. 
The nice thing about deploying to OpenShift is that we can add a webhook to github so that every time we merge a pull request from our develop branch to our
master branch to our git remote, it builds and deploys the new code immediately.

<a href="{{ '/img/stairwaytohealth2/stack.png' | prepend: site.baseurl }}" data-lightbox="results" data-title="">
    <img alt="stack" src="{{ '/img/stairwaytohealth2/stack.png' | prepend: site.baseurl }}" class="image fit">
</a>


<h3>The new sensors: Proximus MySense</h3>
For the previous version of Stairway to Health we used Magnetic door sensors,
these use a magnet mounted on the door frame and the sensor mounted on the door itself, when the door is closed the magnet
makes contact with the sensor and the sensor detects the door is closed. This means you need to mount at two places,
and it needs to be carefully placed to align. This makes it not an ideal solution.

A solution for this is the MySense sensor. This is a lora sensor programmable with javascript.

The MySense is a small Lora device containing multiple sensors.
It contains a temperature sensor, a button, ...
But the most important sensor for our case is the accelerometer.
Using the accelerometer we can detect when the door is moving. After detecting a motion we will blackout the sensor
for 30 seconds to allow the door to be closed again and not count multiple motions.

To save battery we do not send on every motion,
but count the amount of motions for 15 minutes and then send the counter,
also when the counter is 0 we will not send to save battery.


<h3>Conclusion</h3>
We made some major improvements when it comes to performance, maintainability and functionality.
By deploying our application to OpenShift, we also improved our workflow and made it a lot easier to deploy our changes.
By using the MySense as our sensor we only have to mount one piece per door. An extra advantage is that this sensor is a lot cheaper.


<h3>Interesting Links</h3>
- [Stairway to Health 2.0](http://sth2-fe-prod-ordina-stairway-to-health.origin.ordina-jworks.io/dashboard)
- [Blogpost Stairway to Health 1](https://ordina-jworks.github.io/iot/2017/10/12/Stairway-To-Health.html)
- [NestJs](https://nestjs.com/)
- [OpenShift](https://www.openshift.com/)