---
layout: post
authors: [michael_vervloet, ines_van_stappen, kevin_van_den_abeele]
title: 'Stairway to Health with IoT and the MEAN stack'
image: /img/stairwaytohealth/stairway-to-health.jpg
tags: [NodeJS, MongoDB, Angular,Angular4, ExpressJS, Express, TypeScript, Angular-CLI, Gulp, Internet of Things, IoT, LoRa, Proximus]
category: IoT
comments: true
---
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.9.0/css/lightbox.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.9.0/js/lightbox.min.js"></script>

> Healthier at the office with the 'Internet of Things'.

## What is Stairway to Health
In an effort to improve worker health in a fun and engaging way, Proximus wanted to encourage their employees to take the stairs instead of the elevator.
This is when the idea of a little game between the three towers came along. 
On different dashboards across Proximus and on the Stairway to Health website, the employees could see which tower had the most employees taking the stairs.

<img alt="buildings" src="{{ '/img/stairwaytohealth/buildings.jpg' | prepend: site.baseurl }}" class="image fit">
<img alt="overview" src="{{ '/img/stairwaytohealth/overview.jpg' | prepend: site.baseurl }}" class="image fit">

They can also get a more detailed look of how many people taking the stairs where and when, with drilldown views for monthly, weekly, daily, and even hourly statistics.

<img alt="details" src="{{ '/img/stairwaytohealth/details.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto;">

<img alt="weekly" src="{{ '/img/stairwaytohealth/weekly.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto;">

<img alt="daily" src="{{ '/img/stairwaytohealth/daily.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto;">


## What does it do?
The Stairway to Health project is a simple yet great example to show what the Internet of Things can do:
 - LoRa sensors detect door openings, these are installed on the doors of the staircases
 - These sensors communicate via the Proximus LoRa network to report their status
 - Sensor data is sent to the Proximus MyThings platform which processes the data
 - The data gets sent to the Stairway to Health application
 - The Stairway to Health application interprets and visualizes the data

In summary: 
We install sensors on the doors (things) to measure usage and we analyse the data to persuade people to move more. 
The result is a good example of how IoT can influence our daily lives. 
Proximus was able to provide us with all the necessary building blocks to offer a complete end-to-end solution!

<img alt="dataflow" src="{{ '/img/stairwaytohealth/dataflow.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto;">


## MyThings and Stairway to Health
MyThings is the Proximus IoT platform for onboarding, managing, configuring and monitoring IoT sensors. By registering (onboarding) our sensors to the platform, we can let MyThings take care of decoding the messages and set up a stream to our application.
This way every time a log comes in from the sensor, we get the decoded data posted to our designated endpoint.


## The Requirements
- The usage of the stairways is measured and the results should be visualized on large screens in the towers. 
- These screens should have a QR code so that employees can easily visit the application on their mobile devices. 
- When visiting the website, they should be able to click on the results to get a more detailed view of the data. 
- The frontend application should be available in Dutch and French and the dashboard should switch between these languages every minute when viewing it on the large screens.
- Admins should be able to manage locations (towers) and chart timespans. 
- It should have an info page with some information about the project and its purpose.

So technically this translates to build an application that:
 - Has an endpoint to receive logs from the MyThings Application,
 - Stores the data to its own database,
 - Show the data in charts that have multiple layers to see more/less details,
 - Shows the ratio of the results per tower,
 - The frontend dashboard data has to reload automatically (since it is shown on some big screens @ Proximus),
 - Add multi-language (automatically switch languages when viewing on tower's large screens),
 - Is performant (able to handle many logs coming in and calculate the data to be displayed in the graphs),
 - CRUDs for managing timespans and locations,
 - Use the timespans / locations when displaying data.

Oh, and did we mention we were only given four weeks to complete this mission...


## The Ingredients
So given all the requirements listed above and the fact we didn't have a lot of time to waste, 
we chose to use a **MEAN (TypeScript)** stack. 
MEAN stands for MongoDB Express Angular and NodeJS. 
It's possible to use the mean stack with plain JavaScript, 
we chose to implement it with TypeScript since we wanted some strong typings on the backend application and we were going to use Angular 4 on the frontend which comes with TypeScript as well.

### NodeJs:
Write event driven applications with asynchronous I/O powered by the ultra fast Google V8 Engine. 
Mostly known for running your local dev environment and automating build tasks for frontend developers. 
NodeJS is probably one of the best and easiest options out there for real-time applications (with socket.io), 
which is exactly what we needed for our application.

### MongoDB:
Great to work with when dealing with JavaScript Objects. Good driver support with Mongoose for NodeJs. 
Document based structure, which makes it really flexible when it comes to modelling and it's extremely scalable. 
We also took advantage of the very performant aggregation functionality for dealing with large amounts of data.

### ExpressJS:
A node framework that comes with some great functionality for setting up your node server and makes it easy to create routes, 
middleware, handeling requests/responses, serving files from the filesystem, configuring static files, easy connections to the database, 
and much more.

### Angular(4):
A TypeScript-based open-source frontend web application platform led by the Angular Team at Google and by a community of individuals and corporations to address all of the parts of the developer's workflow while building complex web applications.

### Socket.IO:
Socket.IO enables real-time bidirectional event-based communication. It works on every platform, browser or device, focusing equally on reliability and speed. To trigger events on our frontend application we used this great library to be able to detect when new data has been received and refresh the dashboard.

### Highcharts:
Interactive JavaScript library for creating dynamic charts. Highcharts is based on native browser technologies and not reinvent the wheel. Thousands of developers have contributed their work for us to use in our own projects. Also backwards compatible for IE.


## JavaScript across the stack
Not only does it make development quite a bit faster and easier by having a large community with lots of reusable code for your application (npm), it also lowers the barriers between frontend and backend developers by using the same programming language over the entire stack, so more efficiency and faster, leaner development which in turn means lower development costs. 
Also worth noting is that JavaScript currently is THE most popular programming language, so more developers will be able to easily understand and contribute to the application if needed. 
And probably the most important criteria: when it comes to cloud hosting, RAM is probably the main influencing factor when it comes to pricing. NodeJs uses less RAM than comparable Java applications.

<img alt="performance" src="{{ '/img/stairwaytohealth/performance.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width:800px;">
<small style="font-size: 70%;"><a target="_blank" href="https://www.ibm.com/developerworks/library/mo-nodejs-1/index.html">Source and more about these tests</a></small>

Now that I've listed some of the pros of full-stack JS, I should also mention that it might not be the best solution for computation-heavy backend applications.
For projects like machine learning or heavy mathematical calculations the single CPU core and having only one thread that processes one request at a time might be easily blocked by a single compute-intensive task. 
Yet, there are numerous ways to overcome this limitation. 
By simply creating child processes or breaking complex tasks into smaller independent microservices.

Let me just note that the comparison with Java above here is not because we are claiming that one is better than the other, it's just to demonstrate that they both have their use cases and can be equally worth considering when choosing a technology for your application.

Some great use cases for JavaScript across the stack are:
- real-time chat,
- Internet of Things,
- real-time finance (stocks),
- monitoring applications,
- event-driven applications,
- server-side proxies,
- many more...

### Blocking vs. Non-Blocking
In NodeJs you can take advantage of JavaScript promises. 
One of the benefits of this is that we can write non-blocking code.
To demonstrate how this works, I'll give you an example in pseudo code for reading a file from the filesystem.

### Blocking:
<code>read file from filesystem, set equal to "contents"</code><br> 
<code>print content</code><br> 
<code>do something else</code> 

### Non-Blocking:
<code>read file from filesystem</code><br> 
<code>&nbsp;&nbsp;&nbsp;&nbsp;Whenever we're complete print contents <span style="color:#e7904b;">(callback)</span> 
</code> 
<br> 
<code>do something else</code>

<img alt="blocking-vs-non-blocking" src="{{ '/img/stairwaytohealth/blocking-vs-non-blocking.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width:800px;">


## Setting up our dev environment / build
The frontend part of this was really easy. 
We used angular-cli to generate a new project. 
In the future this also gave us the advantage of generating new components, services, pipes, testing and much more. 
Also for the charts and translations we choose for easy to use libraries like Highcharts and ngx-translate (previous ng2-translate).
 
For the backend we decided to go with gulp. 
We added some tasks to transpile our server site TypeScript files to JavaScript so that node can execute it. 
For local serving we created a sequence task that combines running `ng build` from the angular-cli and a gulp task to use `nodemon` for running our server and restarting on changes. 
When working on the frontend, doing an 'ng build' was a bit too slow, therefore we added a `--standalone` flag, to the serve task so that we could just build the backend application and do the frontend serve with `ng serve` which is a lot more performant than having to do a 'ng build' on every change.
Since we are using TypeScript throughout the application, it only felt right to use the TypeScript version of gulp as well. 
It takes a little effort to get used to, but once you get the hang of it, it makes writing gulp tasks a lot more fun and less error prone.
Using the provided decorators, our gulp tasks look something like the following:
```typescript
@Task()
    public environment(cb) {
        return gulp.src('./dist/app/server/config/mongo.connection.js')
                   .pipe($.if((yargs.env === 'prod'), $.replace('mongodb://localhost:27017/stairway', require('./secrets').mongoUrl)))
                   .pipe(gulp.dest('./dist/app/server/config'));
    }
```

and create sequence tasks with:
```typescript
@SequenceTask()
    public mocha() {
        return ['buildApp', 'runMochaTests'];
    }
```
Now that we have a `gulpfile.ts` file, we need to ensure that the gulpfile gets transpiled as well, we did this by adding an npm script, so that we can use TypeScript compiler with the `tsc` command to transpile the file and make sure we are using the latest changes every time we use gulp.
(to get the tsc command, install typescript globally with npm)

## Building Stairway to Health
After setting up our dev environment, database and getting a simple application up and running it's time to start implementing our first features.

**Receiving data from MyThings**<br>
So first things first, on MyThings we took a look at how we were going to structure the data that was going to be streamed to the Stairway to Health application.

<img alt="stream.png" src="{{ '/img/stairwaytohealth/stream.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width:800px;">

In the MyThings application every sensor can have a `friendlyName1` and `friendlyName2`, we used these to specify which tower and which floor they represent. 
The sensors send a lot more data than just the magnetic pulse counts, therefore we needed the `container` field, to be able to filter on `counter` logs only (however, we store the other messages as well, maybe for future use). 
The `value` field is the amount of times the sensor was triggered, in other words, the actual counts. And of course a `timestamp` since we will show the data in time based graphs.

The `timestamp` represents the time that the sensor has sent its message to the MyThings application, we also wanted to keep track of when our application has received the log, so before saving we added one extra field to store this in our database.

After we defined our model/schema of our logs, it was simply adding an endpoint to our express router and our first feature was ready. 
Well not exactly, we needed to trigger an event to refresh the data on our dashboard, but we'll get back to this later.

**The Dashboard**<br>
Since we created an Angular(4) application, we took advantage of the great features of angular-cli which makes it really easy to get a new project up and running and generate new components, services, tests and much more. 
We started by adding all the components needed for the application and adding the Proximus styling to the project. 
After that we imported the Highcharts library from npm to first make the charts on the homepage and later making the charts for the detailed views. 
All the charts were first made with mock data so that we could perfectly say from the backend what data we needed and in which format. 
From now on we knew how our JSON for the charts had to be made and we could implement the api endpoints for the dashboard and the details page. 
Finally after adding all the charts we started on adding the different languages to the application. Here we got our biggest 'lesson learned', it is much faster to start with I18N then to end with it, this is because you have to find all the normal text in the HTML files and copy them to the JSON-files. 
ALso we had to quickly create a translation list that the business could translate for us. 


**Mongo Aggregates**<br>
As for displaying the daily, weekly and total counts below the buildings, we had to get this data from the database, keeping in mind that we would have to iterate over millions of sensor logs (at the time of writing this blog post, 1.4 million over 4 months). We had to make sure it was performant. This is where the Mongo aggregates come in handy. Instead of looping over the results and adding them up, we let Mongo take care of this with the `$sum` operator which in code looks like the following:
```typescript
this.sensorLogModel.aggregate([
                {$match: {container: 'counter', value: {$ne: 0}}},
                // group them by fn1 (tower) and add up all 'value' fields
                {$group: {_id: '$friendlyName1', total: {$sum: '$value'}}}
            ]);
```
*Remember, we store all the logs, but we only need counter logs. So for a little more performance, we leave out the ones with value 0 (a lot of them in the weekends), that's what the `$match` is for*
The result: an array with objects that have an `_id` field with `friendlyName1` as value and a `total` field with the sum of all (counter) values per tower. We repeat this for daily and weekly, but add a start and end date (which we simply create with TypeScript). `$match` then looks something like this:
```typescript
{$match: {container: 'counter', value: {$ne: 0}, timestamp: {$gt: start, $lt: end}}}
```
Later on we added some more calls to get the data by time span and location for the more detailed chart data, but you get the idea, we simply edit the timestamps or `friendlyName1` (also by `friendlyName2` on the hourly chart, which displays the hourly data per floor).

**Socket.IO**<br>
Now that we have data that can be retrieved and displayed on the frontend, time to implement some way to let our frontend application know when we receive some new data, so that it in turn can do a request for that new data.

For this one to be clear we're going to skip ahead in time and show a high level scheme of how the application is made up.

<a href="{{ '/img/stairwaytohealth/folder-structure.png' | prepend: site.baseurl }}" data-lightbox="structure" data-title="Structure">
    <img alt="folder-structure" src="{{ '/img/stairwaytohealth/folder-structure.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width:800px;">
</a>

The bin (js) file is where we create our http, https and socket servers. To communicate between them, we use the node event emitter. 
The `server.ts` file (let's call it the app) gets bootstrapped onto these servers and when creating the app, we pass the created event emitter to it. 
This enables us to listen and broadcast events back and forward. 
The event emitter emits events between the backend services and the socket.io server emits events to our frontend application.

So in our case, to let the frontend know when the sensor-log endpoint has received a message, we emit a `log-received` event on the node event emitter. 
In the socket IO server we are listening on this event and we broadcast a `data` event to every connected frontend application. 
The frontend applications are listening for this `data` event and refresh their data by calling the dashboard endpoints.
However, since we have about 60 sensors sending data, this event was triggering quite a lot and with the chart rendering animations on our frontend application we had to wrap the `log-received` in a timeout so that we would only refresh it once every 30 seconds (if a log was received).

I've picked a few lines of code from our bin file to demonstrate how we pass the `eventEmitter` when bootstrapping our application on to the http and https services from node.

```typescript
const server = require('../dist/app/server');
const http = require('http');
const https = require('https');
const events = require('events');
const eventEmitter = new events.EventEmitter();

const httpServer = http.createServer(server.Server.bootstrap(eventEmitter).app);
const httpsServer = https.createServer(options, server.Server.bootstrap(eventEmitter).app);
```

After that, we bootstrap the created https server on to the socket.io application. It too gets the same `EventEmitter` instance passed into its constructor.

```typescript
const io = require('socket.io')(httpsServer);
const sockets = require('../dist/app/sockets');
const ioApp = sockets.Sockets.bootstrap(io, eventEmitter).io;
```

In our sockets file, the method that gets executed will listen on the `logsReceived` from our passed EventEmitter, and emits a `data` event on our `io` instance. 
```typescript
public sockets(eventEmitter, io){
    eventEmitter.on('logsReceived', (logs) => {
        io.of('/socket/').emit('data', logs);
    });
}
```

## Configuration CRUD
Since we did not want our configuration to be hard coded, we added some configuration screens to be able to change the time spans and entities (towers).

<div style="text-align: center; margin:0px auto;">
    <a href="{{ '/img/stairwaytohealth/crud1.png' | prepend: site.baseurl }}" data-lightbox="crud" data-title="Entities CRUD">
        <img alt="crud1" src="{{ '/img/stairwaytohealth/crud1.png' | prepend: site.baseurl }}" class="image fit" style="width: 48%; display: inline-block;">
    </a>
    <a href="{{ '/img/stairwaytohealth/crud2.png' | prepend: site.baseurl }}" data-lightbox="crud" data-title="Timespans CRUD">
        <img alt="crud2" src="{{ '/img/stairwaytohealth/crud2.png' | prepend: site.baseurl }}" class="image fit" style="width: 48%; display: inline-block;">
    </a>
    <br>
</div>

By the way, 'gewicht' in the first image stands for weight. 
To make sure the ratios are fair, we made sure that every tower has a 'weight' to multiply its log values by. 
These weights are calculated by the amount of employees/tower, with the largest tower having a weight of 1.

Let's take a look at how we set up our backend structure for creating crud endpoints.
In our `/routes` directory we keep all files that define the urls and methods of every endpoint, and tell it which controller and method to use:<br>
*timespan.route.ts*
```typescript
router.get('/timespan/', (req: Request, res: Response, next: NextFunction) => {
    this.timespanController.getTimespanList(req, res, next);
});
router.post(('/timespan/', this.authenticate, (req: Request, res: Response, next: NextFunction) => {
    this.timespanController.createTimespan(req, res, next);
});
```

next under our `/controllers` directory we have our controllers where all our functionality/logic is<br>
*timespan.controller.ts*
```typescript
public getTimespanList(req: Request, res: Response, next: NextFunction) {
    return this.timespanModel.find({}, [], {sort: {start: 1}})
    .then((result) => {
        res.json(result).status(200);
    }, (err)=>{
        res.statusCode = 500;
        res.statusMessage = err;
        res.send();
    });
}
```

## Authentication
To prevent everyone from changing these configurations of course we had to add some authentication functionality. 
As you can see in the router code above, we created an authentication middleware so that on every route that we want the user to be authenticated, we can simply add `this.authenticate()` to the route. 
This checks a JWT token in the headers. 
We check the token to be valid. 
If it's not valid, we send an `unauthorized` response, and if it is valid, we decode it and add it as a user object on the request. 
This way we can access it in the controller and do some logic depending on its role, etc.
`this.authenticate` is a method we added to the `core.route.ts`.
Every route extends this super class so that we can put common code and middleware in this file.

JWT stands for JSON Web Token and is a JSON-based open standard for creating access tokens that assert some number of claims. 
For example, a server could generate a token that has the claim `logged in as admin` and provide that to a client. 
The client could then use that token to prove that he is logged in as admin.

## Deploy
Finally we deployed it to the Proximus data center and watched the Proximus employees take on the challenge.

<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/stairwaytohealth/result1.jpg' | prepend: site.baseurl }}" data-lightbox="results" data-title="Large screen @ Proximus towers">
        <img alt="result1" src="{{ '/img/stairwaytohealth/result1.jpg' | prepend: site.baseurl }}" class="image fit" style="width: 61.45%; display: inline-block;">
    </a>
    <a href="{{ '/img/stairwaytohealth/result2.jpg' | prepend: site.baseurl }}" data-lightbox="results" data-title="Informing the employees">
        <img alt="result2" src="{{ '/img/stairwaytohealth/result2.jpg' | prepend: site.baseurl }}" class="image fit" style="width: 34.55%; display: inline-block;">
    </a>
</div>


## Conclusion
After four hard weeks of working and writing many lines of code, we delivered our project to Proximus and the contest could start.
 Things we would have done differently:
 - Use mongo indexes and aggregation for large amounts of data
 - Use javascript date in stead of timestamps in mongo, easier to create aggregate with dates
 - Dockerize! So far, the most work has gone into getting the application deployed
 - Implement I18N translations at the beginning, as it is better to add translations while working on the component
 - Also we learned how complicated it can be to have one component with multiple switching charts. Instead of switching components.

