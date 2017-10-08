---
layout: post
authors: [michael_vervloet, kevin_van_den_abeele, ines_van_stappen]
title: 'Stairway to Health with IoT ft. MEAN(TS)'
image: /img/stairwaytohealth/stairway-to-health.jpeg
tags: [NodeJS, MongoDB, Angular,Angular4, ExpressJS, Express, TypeScript, Angular-CLI, Gulp, Internet of Things, IoT, LoRa, Proximus]
category: IoT
comments: true
---
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.9.0/css/lightbox.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.9.0/js/lightbox.min.js"></script>

> Healthier at the office with the 'Internet of Things'.

## What is Stairway to Health
In an effort to improve worker health in a fun and engaging way, Proximus wanted to encourage their employees to choose for the stairs instead of using the elevator.
This is when they came with the idea of a little game between the three towers. On different dashboards across proximus and online employees could see which tower had the most employees that are taking the stairs.

<img alt="buildings" src="{{ '/img/stairwaytohealth/buildings.jpg' | prepend: site.baseurl }}" class="image fit">
<img alt="overview" src="{{ '/img/stairwaytohealth/overview.jpg' | prepend: site.baseurl }}" class="image fit">

They can also see a more detailed look of how many people taking the stairs in which tower of each week, day and even each hour.

<img alt="details" src="{{ '/img/stairwaytohealth/details.png' | prepend: site.baseurl }}" class="image fit">

<img alt="weekly" src="{{ '/img/stairwaytohealth/weekly.jpg' | prepend: site.baseurl }}" class="image fit">

<img alt="daily" src="{{ '/img/stairwaytohealth/daily.jpg' | prepend: site.baseurl }}" class="image fit">

## What does it do?
The stairway to health project is what the internet of things is all about:
 - LoRa sensors detect door openings, these are installed on the doors of the staircases
 - These sensors communicate via the Proximus LoRa network to report their status
 - Sensor data is sent to the Proximus MyThings platform which processes the data
 - The data gets sent to the StairwayToHealth application
 - The StairwayToHealth application interprets and visualises the data

 In summary: We install sensors on the doors (things) to measure usage and we analyse the data to persuade people to move more. The result is a good example of how IoT can influence our daily lives. Proximus  was able to provide us with all the building blocks available to offer a complete end-to-end solution!

<img alt="dataflow" src="{{ '/img/stairwaytohealth/dataflow.jpg' | prepend: site.baseurl }}" class="image fit">

## MyThings and Stairway to Health
MyThings is the Proximus IoT platform for onboarding, managing, configuring and monitoring IoT sensors. By registering (onboarding) our sensors to the platform, we can let MyThings take care of decoding the messages and set up a stream to our application so that every time a log comes in from the sensor, we get the decoded data posted to our designated endpoint.


## The Requirements
The usage of the stairways is measured and the results should be visualised on large screens in the towers. These screens should have a qr-code so that employees can easily visit the application on their mobile devices. When visiting the website, they should be able to click on the results to get a more detailed view of the data. The frontend application should be available in dutch and french and  the dashboard should switch between these languages every minute when viewing it on the large screens.
Admins should be able to manage locations (towers) and chart timespans. It should have an info page with some information about the project and it's purpose.


So technically this translates to build an application that:
 - has an endpoint to receive logs from the MyThings Application,
 - stores the data to it's own database,
 - show the data in charts that have multiple layers to see more/less details
 - shows the ratio of the results per tower
 - the frontend dashboard data has to reload automatically (since it is shown on some big screens @ Proximus)
 - add multi-language (automatically switch languages when viewing on tower's large screens)
 - is performant (able to handle many logs coming in and calculate the data to be displayed in the graphs)
 - CRUD's for managing timespans and locations.
 - use the timespans / locations when displaying data

oh, and did I mention we were given 4 weeks to complete this mission...

## The Ingredients
So given all the requirements listed above and the fact we didn't have a lot of time to waste, we chose to use a **MEAN(TS)** stack. MEAN stands for MongoDB Express Angular and NodeJS. It's possible to use the mean stack with plain JavaScript, we chose to implement it with TypeScript since we wanted some strong typings on the backend application and we were going to use Angular 4 on the front-end which comes with TypeScript as well.

**NodeJs:**
write event driven applications with asynchronous I/O powered by the ultra fast Google V8 Engine. Mostly known for running your local dev environment and automating build tasks for front-end developers. NodeJS is probably one of the best and easiest options out there for real-time applications (with socket.io), which is exactly what we needed for our application.

**MongoDB:**
Great to work with when dealing with JavaScript Objects. Good driver support with mongoose for NodeJs. Document based structure, which makes it really flexible when it comes to modelling and it's extremely scalable. We also took advantage of the very performant aggregation functionality for dealing with large amounts of data.

**ExpressJS:**
A node frameworkt that comes with some great functionality for setting up your node server and makes it easy to create routes, middleware, handeling requests/responses, serving files from the filesystem, configuring static files, easy connections to the database, and much more.

**Angular(4):**
A TypeScript-based open-source front-end web application platform led by the Angular Team at Google and by a community of individuals and corporations to address all of the parts of the developer's workflow while building complex web applications.

**Socket.IO**
Socket.IO enables real-time bidirectional event-based communication. It works on every platform, browser or device, focusing equally on reliability and speed. To trigger events on our front-end application we used this great library to be able to detect when new data has been received and refresh the dashboard.

**Highcharts:**
Interactive JavaScript library for creating dynamic charts. Highcharts is based on native browser technologies and tno reinvent the wheel. Thousands of developers have contributed their work for us to use in our own projects. Also backwards compatible for IE.

## JavaScript across the stack
Not only does it make development a lot faster and easier by having a large community with lots of reusable code for your application (npm), It also lowers the barriers between front-end and backend developers by using the same programming language over the entire stack, so more efficiency and faster, leaner development which in turn means lower development costs. Also worth noting is that JavaScript currently is THE most popular programming language, so more developers will be able to easily understand and contribute to the application if needed. And probably the most important criteria: when it comes to cloud hosting, RAM is probably the main influencing factor when it comes to pricing. NodeJs uses less RAM than comparable Java applications.

<img alt="performance" src="{{ '/img/stairwaytohealth/performance.png' | prepend: site.baseurl }}" class="image fit" style="width: 70%;">
<small style="font-size: 70%;"><a target="_blank" href="https://www.ibm.com/developerworks/library/mo-nodejs-1/index.html">Source and more about these tests</a></small>

Now that I've listed some of the pro's of full-stack JS, I should also mention that it might not be the best solution for computation-heavy backend applications.  For projects like machine learning or heavy mathematical calculations the single CPU core and having only one thread that processes one request at a time might be easily blocked by a single compute-intensive task. Yet, there are numerous ways to overcome this limitation. By simply creating child processes or breaking complex tasks into smaller independent microservices.

Let me just note that the comparison with Java above here is not because we are claiming that one is better than the other, it's just to demonstrate that they both have their use cases and can be equally worth considering when choosing a technology for your application.

Some great use cases for JavaScript across the stack are:
- real-time chat,
- Internet of Things,
- real-time finance (stocks),
- monitoring applications,
-  event-driven applications
- server-side proxies
- many more...

**Blocking vs. Non-Blocking**<br>
In NodeJs you can take advantage of JavaScript promises. One of the benefits of this is that we can write non-blocking code.
To demonstrate how this works, I'll give you an example in psuedo code for reading a file from the filesystem.

Blocking:<br> 
<code>read file from filesystem, set equal to "contents"</code><br> 
<code>print content</code><br> 
<code>do something else</code> 

Non-Blocking<br>
<code>read file from filesystem</code><br> 
<code>&nbsp;&nbsp;&nbsp;&nbsp;Whenever we're complete print contents <span style="color:#e7904b;">(callback)</span> 
</code> 
<br> 
<code>do something else</code>

<img alt="blocking-vs-non-blocking" src="{{ '/img/stairwaytohealth/blocking-vs-non-blocking.png' | prepend: site.baseurl }}" class="image fit">

## Setting up our dev environment / build
The front-end part of this was really easy. We used angular-cli to generate a new project. In the future this also gave us the advantage of generating new components, services, pipes and much more.
For the backend we decided to go with gulp. We added some tasks to transpile our server site TypeScript files to javascript so that node can execute it. For local serving we created a sequence task that combines running 'ng build' from the angular-cli and a gulp task to use 'nodemon' for running our server and restarting on changes. When working on the frontend, doing an 'ng build' was a bit too slow, therefore we added a --standalone flag, to the serve task so that we could just build the backend application and do the frontend serve with 'ng serve' which is a lot more performant than having to do a 'ng build' on every change.
Since we are using TypeScript throughout the application, it only felt right to use the TypeScript version of gulp as well. It takes a little effort to get used to, but once you get the hang of it it makes writing gulp tasks a lot more fun and less error prone.
Using the provided decorators our gulp tasks look something like the following:
```typescript
@Task()
    public environment(cb) {
        return gulp.src('./dist/app/api/config/mongo.connection.js')
                   .pipe($.if((yargs.env === 'dev'), $.replace('mongodb://localhost:27017/stairway', require('./secrets').mongoUrl)))
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
Now that we have a gulpfile.ts file, we need to ensure that the gulpfile gets transpiled as well, we did this by adding an npm script, so that we can use 'tsc' to transpile the file and make sure we are using the latest changes every time we use gulp. (to get the tsc command, install typescript globally with npm)

## Building Stairway to Health
After setting up our dev environment, database and getting a simple application up and running it's time to start implementing our first features.

**Receiving data from MyThings**<br>
So first things first, on MyThings we took a look at how we were going to structure the data that was going to be streamed to the Stairway to Health application.
<img alt="stream" src="{{ '/img/stairwaytohealth/stream.jpg' | prepend: site.baseurl }}" style="width: 50%;">
In the MyThings application every sensor can have a friendlyName1 and 2, we used these to specify which tower and which floor they represent. The sensors send a lot more data than just the magnetic pulse counts, therefore we needed the container field, to be able to filter on 'counter' logs only (however, we store the other messages as well, maybe for future use). The 'value' field is the amount of times the sensor was triggered, in other words, the actual counts. And ofcourse a timestamp since we will show the data in time based graph's.

The timestamp represents the time that the sensor has sent it's message to the MyThings application, we also wanted to keep track of when our (Stairway applicaition) has received the log, so before saving we added one extra field to store this in our database.

After we defined our model / schema of our logs, it was simply adding an endpoint to our express router and our first feature was ready. Well not exactly, we needed to trigger an event to refresh the data on our dashboard, but we'll get back to this later.

**The Dashboard**<br>
Since we created an angular(4) application, we took advantage of the great features of angular-cli which makes it really easy to get a new project up and running and generate new components, services and much more. We started working on our dashboard that shows some building icons with the total counts per day, week and total, added a nice graph below to show an overview of the competition during the event.After adding the Proximus styles and importing the highcharts library from npm, the most important part of the application started to take shape.

In the mean time we started to get an idea on how to model our data to display it in the charts, since we got it running with some mock data in the frontend. Thus we were able to start implementing our dashboard api endpoints.

**Mongo Aggregates**<br>
So for displaying the daily, weekly and total counts below the buildings, we had to get this data from the database, keeping in mind that we would have to iterate over millions of sensor logs (at the time of writing this blogpost 1.4 million over 4 months). We had to make sure it was performant. This is where the mongo aggregates come in handy. In stead of (say) looping over the results and adding them up, we let mongo take care of this with the '$sum' operator which in code looks like the following:
```typescript
this.sensorLogModel.aggregate([
                {$match: {container: 'counter', value: {$ne: 0}}},
                // group them by fn1 (tower) and add up all 'value' fields
                {$group: {_id: '$friendlyName1', total: {$sum: '$value'}}}
            ]);
```
*Remember, we store all the logs, but we only need counter logs. So for a little more performance, we leave out the ones with value 0 (a lot of them in the weekends), that's what the $match is for*
The result: an array with objects that have a '_id' field with 'friendlyName1' as value and a 'total' field with the sum of all (counter) values per tower. We repeat this for daily and weekly, but add a start and end date (which we simply create with TypeScript). $match then looks something like this:
```typescript
{$match: {container: 'counter', value: {$ne: 0}, timestamp: {$gt: start, $lt: end}}}
```
Later on we added some more calls to get the data by timespan and location for the more detailed chart data, but you get the idea, we simply edit the timestamps or friendlyName1 (also by friendlyName2 on the hourly chart, wich displays the hourly data per floor).

**Socket.IO**<br>
Now that we have data that can be retrieved and displayed on the frontend, time to implement some way to let our frontend application know when we receive some new data, so that it in turn can do a request for that new data.

For this one to be clear we're going to skip ahead in time and show a high level scheme of how the application is made up.

<a href="{{ '/img/stairwaytohealth/folder-structure.png' | prepend: site.baseurl }}" data-lightbox="structure" data-title="Structure">
    <img alt="folder-structure" src="{{ '/img/stairwaytohealth/folder-structure.png' | prepend: site.baseurl }}" class="image fit" style="width: 70%;">
</a>

The bin (js) file is where we create our http, https and socket servers. To communicate between them, we use the node event emitter. The server.ts file (let's call it the app) gets bootstrapped on to these servers and when creating the app, we pass the created event emitter to it. This enables us to listen and broadcast events back and forward. The event emitter emits events between the backend services and the socket.io server emits events to our front-end application.

So in our case, to let the frontend know when the sensor-log endpoint has received a message, we emit a 'log-received' event on the node event emitter. In the socket IO server we are listening on this event and we broadcast a 'data' event to every connected frontend application. The frontend applications are listening for this 'data' event and refresh their data by calling the dashboard endpoints.
However, since we have about 60 sensors sending data, this event was triggering quite a lot and with the chart rendering animations on our frontend application we had to wrap the 'log-received' in a timeout so that we would only refresh it once every 30 seconds (if a log was received).

## Configuration CRUD
Since didn't want our configuration to be hard coded, we added some configuration screens to be able to change the timespans and entities (towers).

<a href="{{ '/img/stairwaytohealth/crud1.png' | prepend: site.baseurl }}" data-lightbox="crud" data-title="Entities CRUD">
    <img alt="crud1" src="{{ '/img/stairwaytohealth/crud1.png' | prepend: site.baseurl }}" class="image fit" style="width: 48%; display: inline-block;">
</a>
<a href="{{ '/img/stairwaytohealth/crud2.png' | prepend: site.baseurl }}" data-lightbox="crud" data-title="Timespans CRUD">
    <img alt="crud2" src="{{ '/img/stairwaytohealth/crud2.png' | prepend: site.baseurl }}" class="image fit" style="width: 48%; display: inline-block;">
</a>

The way we've set up our server code, this was really easy to do, let's take a look at how.
In our '/routes' directory we keep all files that define the urls and methods of every endpoint, and tell it which controller to use:
*timespan.route.ts*
```typescript
router.get('/timespan/', (req: Request, res: Response, next: NextFunction) => {
    this.timespanController.getTimespanList(req, res, next);
});
router.post(('/timespan/', this.authenticate, (req: Request, res: Response, next: NextFunction) => {
    this.timespanController.createTimespan(req, res, next);
});
```

next under our '/controllers' directory we have our controllers where all our functionality/logic is
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
To prevent everyone from changing these configurations of course we had to add some authentication functionality. As you can see in the router code above, we created some authentication middleware so that on every route that we want the user to be authenticated, we can simply add 'this.authenticate()' to the route. This checks a JWT token in the headers. We check the token to be valid. If it's not valid, we send an 'unauthorised' response, and if it is valid, we decode it and add it as a user object on the request. This way we can access it in the controller and do some logic depending on it's role, etc.
'this.authenticate'  is a method we added to the 'core.route.ts' every route extends this superclass so that we can put common code and middleware in this file.

JWT stands for JSON Web Token and is a JSON-based open standard for creating access tokens that assert some number of claims. For example, a server could generate a token that has the claim "logged in as admin" and provide that to a client. The client could then use that token to prove that it is logged in as admin.

## Deploy
Finally we deployed it to the Proximus Datacenter and watched the Proximus employees take on the challenge.
<a href="{{ '/img/stairwaytohealth/result1.jpg' | prepend: site.baseurl }}" data-lightbox="results" data-title="Large screen @ Proximus towers"><img alt="result1" src="{{ '/img/stairwaytohealth/result1.jpg' | prepend: site.baseurl }}" style="max-height: 300px; max-width: 100%; display: inline-block;"></a>
<a href="{{ '/img/stairwaytohealth/result2.jpg' | prepend: site.baseurl }}" data-lightbox="results" data-title="Informing the employees"><img alt="result2" src="{{ '/img/stairwaytohealth/result2.jpg' | prepend: site.baseurl }}" style="max-height: 300px; max-width: 100%; display: inline-block;"></a>
