---
layout: post
authors: [michael_vervloet]
title: 'Stairway to Health 2.0 (the Ordina version)'
image: /img/stairwaytohealth2/sth2-showcase.png
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

<p>
Here we are again, another blog post about Stairway to Health.<br>
Why? Well, we've created our own Ordina version of the Stairway to Health application.
There are quite a few interesting bells and whistles, among others, here are a few of those new features:
<ul>
    <li>New (and awesome) frontend design, with Ordina theming obviously</li>
    <li>Upgraded from Angular 4 to Angular 5</li>
    <li>Material Design</li>
    <li>NEST.js in stead of Express.js (still Express underneath, but cleaner code!)</li>
    <li>Backend e2e tests with Mockgoose</li>
    <li>Deployed on OpenShift</li>
    <li>New type of sensors</li>
    <li>Cheers feature, users can motivate and support each other</li>
</ul>
</p>

<h2>Stairway to Health @ Ordina</h2>

<p>
As you might have read in our <a href="" target="_blank">previous post</a> about Stairway to Health, the purpose of the application is to
improve worker health in a fun and engaging way. With the app we try to encourage employees to take the stairs instead of the elevator.
We've put up some sensors that can detect how much stairway usage there is on every floor and how many people take the elevator.
On the app they can see these results and thus they can do an extra effort if they are falling behind.
New in the Ordina version is that employees can now also cheer and motivate each other since we've added a chat feature to the application.
</p>

<h2>Internet of Things</h2>

<p>The Stairway to Health project is a simple yet great example to show what the Internet of Things can do:
<ul>
    <li>LoRa sensors detect door openings, these are installed on the doors of the staircases</li>
    <li>These sensors communicate via the LoRa network to report their status</li>
    <li>In our case sensor data is sent to the Proximus MyThings platform which processes the data</li>
    <li>The data gets sent to the Stairway to Health application</li>
    <li>The Stairway to Health application interprets and visualizes the data</li>
</ul>

In summary: We install sensors on the doors (things) to measure usage and we analyse the data to persuade people to move more.
The result is a good example of how IoT can influence our daily lives.

For more on this topic, check the application's <a href="" target="_blank">About page</a>
</p>


<h2>Dive into the technical details</h2>
<p>
The reason of us writing this blog post is mainly because we want to explain some of the technical changes and improvements we've made
since we've updated (pretty much rewritten) the application. So let't get started.
</p>

<h3>The API</h3>
<p>
ExpressJs to NestJs: the main difference here is that we've rewritten the application to use the new framework we chose for our application.
Migrating from Express to Nest is not that difficult, since nest is a wrapper on top of the Express framework.
It provides you with some nice typescript decorators which makes your code a lot cleaner, more compact and easier to read.
</p>


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









<!--
<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/stairwaytohealth/result1.jpg' | prepend: site.baseurl }}" data-lightbox="results" data-title="Large screen @ Proximus towers">
        <img alt="result1" src="{{ '/img/stairwaytohealth/result1.jpg' | prepend: site.baseurl }}" class="image fit" style="width: 61.45%; display: inline-block;">
    </a>
    <a href="{{ '/img/stairwaytohealth/result2.jpg' | prepend: site.baseurl }}" data-lightbox="results" data-title="Informing the employees">
        <img alt="result2" src="{{ '/img/stairwaytohealth/result2.jpg' | prepend: site.baseurl }}" class="image fit" style="width: 34.55%; display: inline-block;">
    </a>
</div>
-->