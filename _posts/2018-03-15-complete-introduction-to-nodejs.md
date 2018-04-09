---
layout: post
authors: [michael_vervloet]
title: "Complete Introduction to NodeJs"
image: /img/complete-introduction-node.png
tags: [NodeJs, tutorial, JavaScript, node]
category: NodeJs
comments: true
---

## What Is node
NodeJs is a program that lets you run JavaScript code on your machine without the need of a browser.
Underneath the surface of node is the V8 JavaScript runtime which is the engine that allows your browser to run JavaScript code.
On top of that node adds some extra functionality to create server side applications
(for example `fs` to interact with the file system, `http` or `https` to send and receive http calls, `net` for tcp streams, and many more).

## Use cases:
**Real time applications (chat, stocks, IoT)**<br>
The event based nature of NodeJs and 'keep-alive' connections makes it ideal for real time applications, whenever an event occurs,
for example a chat message being received or a stock price being updated, it can emit an event on it's connected sockets to update the client's chat screen or stocks chart.

**REST APIs**<br>
This will be a topic on it's own, but with frameworks built on top of NodeJs like Express or Nest it is really easy to get a REST API up and running in no time at all.

**Serverless:**<br>
NodeJs is supported with almost any serverless provider (Amazon Lambda, Azure functions, Google Cloud functions, ...).
So developers can focus on your code and business logic in stead of maintaining and setting up complicated server architectures.

**File uploading:** <br>
When writing applications that depend a lot on network access and accessing files on the disk we have to keep an eye on how the data is being transferred back and forward.
For ultimate efficiency, especially when dealing with large sets of data. We need to be able to access that data piece by piece.
When that happens, we can start manipulating that data as soon as it arrives at the server.
In stead of holding it in memory until all chunks have arrived and writing it to disk, node can for example create a writeable stream on the disk and write the chunks directly to the files without keeping them in memory and without blocking the entire application.
This way it can also receive multiple files at the same time.

## Benefits of Javascript across the stack
Not only does it make development quite a bit faster and easier by having a large community with lots of reusable code for your application (npm).
It also lowers the barriers between frontend and backend developers by using the same programming language over the entire stack.
So more efficiency and faster, leaner development which in turn means lower development costs.

Also worth noting is that JavaScript currently is THE most popular programming language [According to StackOverflow](https://insights.stackoverflow.com/survey/2018/?utm_source=Iterable&utm_medium=email&utm_campaign=dev-survey-2018-promotion#most-popular-technologies){: target="blank" rel="noopener noreferrer" },
so more developers will be able to easily understand and contribute to the application if needed.
Another important criteria: when it comes to cloud hosting,
RAM is probably the main influencing factor when it comes to pricing and since node is designed and encourages developers to write programs to use as less memory as possible it is often a cheaper alternative.

## Multithreading
This is usually a big issue/talking point when it comes to node.

In short: each NodeJs process is single threaded. if you want multiple threads,
you have to have multiple processes as well.
You could say that because of that, NodeJs encourages you to implement microservices when dealing with these larger and complicated applications,
which is a good thing since it makes not only your entire application but also each process individually very scalable.
The downside is that this might introduce some added complexity to your application.
But with Node's lively modular ecosystem (npm) you can imagine there are already solutions to make setting this up a lot easier, (I.e. moleculer, Seneca, ...).

An important characteristic of microservices is "shared nothing".
Node has a shared-nothing model:
> A shared-nothing architecture (SN) is a distributed-computing architecture in which each node is independent and self-sufficient,
and there is no single point of contention across the system. More specifically, none of the nodes share memory or disk storage.
The advantages of SN architecture versus a central entity that controls the network (a controller-based architecture) include eliminating any single point of failure,
allowing self-healing capabilities and providing an advantage with offering non-disruptive upgrade.
A shared-nothing architecture (SN) is a distributed-computing architecture in which each node is independent and self-sufficient,
and there is no single point of contention across the system. More specifically, none of the nodes share memory or disk storage.
The advantages of SN architecture versus a central entity that controls the network (a controller-based architecture) include eliminating any single point of failure,
 allowing self-healing capabilities and providing an advantage with offering non-disruptive upgrade.

(src: [Wikipedia](https://en.wikipedia.org/wiki/Shared-nothing_architecture){: target="blank" rel="noopener noreferrer" })

Additionally, node has some other features to make use of multiple cores like for example the cluster:
A single instance of NodeJs runs in a single thread. To take advantage of multi-core systems,
the user will sometimes want to launch a cluster of NodeJs processes to handle the load.
The cluster module allows easy creation of child processes that all share server ports and automatically load balances across these processes.

## Blocking vs. Non-Blocking
As we've said before, NodeJs encourages you to take advantage of non-blocking code (like JavaScript promises).
To demonstrate how this works, I'll give you an example in pseudo code for reading a file from the filesystem.

**Blocking:**
```
    read file from filesystem,
    print content
    do something else`
```

**Non-Blocking:**
 ```
    read file from filesystem
        Whenever we're complete print contents (callback)
    do something else
```

**Difference:**<br>
When reading two files, the blocking code starts reading the file, in case of a large file let's say this takes 5 seconds.
After the file has been read, it logs its content. Then starts reading the second file,
which again takes 5 or so seconds and the content gets logged.

In the non-blocking code, we tell the processor to start reading the file, and when it's done, to "let us know" (resolve promise) so that we can do more stuff with it.
At the same time since there is another file to be read, we start reading the second file and again tell the processor to notify us when it is ready so that we can do stuff with it.
Whenever a 'Promise' of reading a file resolves, it's callback (in case of our pseudo code: `print contents`) gets executed.
(This also means that when file 2 takes less time to be read, it will be resolved and printed first, something you might want to keep in mind).

<img src="/img/non-blocking.png" alt="Blocking vs Non-blocking" width="100%">

## V8 Runtime Engine
Node uses google chrome's V8 runtime engine to run JavaScript code, we've shown this video in one of our previous blogposts before,
but since it might be useful to know how it works under the hood I'll add it here once again. When it comes to node development there are some differences, since we don't get events from the DOM.
In node we can get them from the NodeJs event emitter but the way it works stays the same.
It has some useful tips like avoiding to block the call stack.
<iframe src="https://player.vimeo.com/video/96425312" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

[Philip Roberts: Help, I&#039;m stuck in an event-loop.](https://vimeo.com/96425312){: target="blank" rel="noopener noreferrer" }

## Installing NodeJs
Download the installer for your OS at [https://nodejs.org/en/download/](https://nodejs.org/en/download/){: target="blank" rel="noopener noreferrer" }

or if you are a Mac user and have brew installed you can install it with brew.

Open a terminal and run the following commands:

Install node<br>
`brew install node`

Verify if node was successfully installed (should output your node's version number)<br>
`node -v `

## Node Modules
Previously I talked about one of the benefits of node being its vast ecosystem of open source code that you can exploit.
To avoid having to write the same common logic over and over again, node's greatest feature is probably its modularity.
You can put common logic in a node module that you can reuse over and over again in different components of your projects or even reuse them in other projects.

## NPM
NPM or 'Node Package Manager' is an online registry for node modules. When you've written a useful module, why not share it with the world.
Whenever you've implemented some common logic that can be reused across projects, it is a common practice in the world of JavaScript development to make it Open Source and share it with other developers who might want to implement the same logic.
This way they don't have to write it themselves which saves times and headaches. Just like using other people's modules might do for you.

Here are som useful npm commands to get you started:

`npm init ` <br>Start a new project. This creates a `package.json` file that keeps track of the installed modules (if you save them).

`npm install <module_name>` <br>Downloads a module that is registered (by name) on the npm registry.
To see which modules modules are available, simply visit [npmjs.com](https://www.npmjs.com){: target="blank" rel="noopener noreferrer" } and search for whatever you need.
The downloaded code will be saved in the `node_modules` directory. (Unless global install)

`npm install <module_name> —save` <br> installs and also updates your project's dependencies in `package.json`

`npm install <module_name> —save-dev` <br> installs and update's your project's development dependencies in `package.json` (dependencies that you don't need at runtime, I.e. testing frameworks like jasmin or karma, build frameworks like gulp or webpack, ...)

`npm install <module_name> --global` <br> installs the package globally, packages with command line interfaces like gulp-cli, angular-cli are installed globally.

`npm uninstall` <br> uninstalls packages from your project

`npm update` <br> updates your packages

For a full overview of npm commands and further documentation of npm, check out this page: [https://docs.npmjs.com/](https://docs.npmjs.com/){: target="blank" rel="noopener noreferrer" }

## Node REPL
Once you have installed node you can open a terminal window and run node.
This will return a node REPL where you can run JavaScript code.   For example:<br>
`function add(a, b){ return a + b } <enter>`<br>
`add(4, 7) <enter>`<br>
`// Returns 11`<br>
To terminate the REPL hit ctrl + c

## Hello World
Using the REPL can be useful sometimes, but when we want to make some persistent programs,
we might want to write our code in a file and run the content of that file.

In this example we'll create a `helloworld.js` file.
Create it in your favourite IDE or run `touch helloworld.js` and open it in your IDE or vim/nano/...

To keep it simple for this first project, we'll simply make a program that logs 'hello' and 'world' in your terminal,
 we'll log them separately just to show you that there's different ways to log data with node.

`helloworld.js`<br>

```JavaScript
// process is a global variable that refers to the current node process you are running,
// it has a stdout property that has a write method which we can call to output data.
process.stdout.write('hello\n'); // the \n creates a new line in the terminal

// or a bit simpler, the one we are used to from the browser, console.log
console.log('world');
```

## Hello World Async

An example of non-blocking code

```JavaScript
// after 2 secs, print world
setTimeout( ()=> { console.log('world'); }, 2000);

console.log('hello\n');
// prints  'hello' first, then 'world'
```

When you've watched the video about how the V8 Engine works, you'll know why 'hello' gets logged first and 'world' second:
What happens is:
- `setTimeout` is added to the call stack,
- `setTimeout` has a timer and a callback, this fire's up  V8's timer Web API,
- now that the Web API is taking care of the setTimeout, it get's removed from the call stack,
- `console.log` is added to the call stack, it logs 'hello', and removes console.log from the call stack,
- once the timer has completed, it pushes the callback to the task queue,
- since there are no more function calls on the call stack, the event loop adds the callback to the call stack
- 'world' is printed.

There's no need for an additional thread to pause the program for 2 seconds and after that log 'world',
the V8 Engine handles this for us just like it does with any other async functionality in the browser.
So this is a very simple example of how non-blocking code works in NodeJs, the timeout didn't block our code, 'hello' got logged right away.

## Hello Module
Now lets give you an example how to create a node module (a very simple and not very useful one) but just to give you an idea of how you can export your code and use it in other files.

We're going to create a module that has a log function which takes a parameter (name) and logs 'hello <name>'
to the console. Then we'll import it in another file and call the function from there.

`log.js`

 ```JavaScript
// Create our custom hello function
const hello = function(name){ console.log(`Hello ${name}`); } 
// export this functionality 
module.exports = log;
```

`hello.js`

```JavaScript
// the way we import another module into our file is by using require(), require is a global module for node
// when requiring local modules (not the ones we install with npm), we give it the path relative to the current file,
// no need for extensions, since node looks for a .js file
var log = require('./log');

// now that we have our functionality available in the log variable, we can use it
log('Mike'); 
// logs 'hello Mike' to the console
```

To import modules that you've installed with npm, don't specify a path, but give it the package's name.
For example:
```
// this imports the express module from the express package if we installed it`
require('express');
```

To learn more about how to use `require` go check out this useful url: [https://medium.freecodecamp.org/requiring-modules-in-node-js-everything-you-need-to-know-e7fbd119be8](https://medium.freecodecamp.org/requiring-modules-in-node-js-everything-you-need-to-know-e7fbd119be8){: target="blank" rel="noopener noreferrer" }

## Hello Server
Now that we know how to require other modules, lets create a basic server application.
 We're not going to install any server frameworks (like Express) yet, instead we'll require a module that comes with node.
Node has some built-in modules that you can use like `http` (http server), `https`, `fs` (file system), `net` (tcp sockets), ... <br>
( a list can be found here:[https://www.w3schools.com/nodejs/ref_modules.asp](https://www.w3schools.com/nodejs/ref_modules.asp){: target="blank" rel="noopener noreferrer" } )

For this program, we'll use node's `http` module.

`hello-server.js`

```JavaScript
// import the http module (docs: https://nodejs.org/api/http.html)
const http = require('http');

// we create a server that will send plaintext 'Hello World' back to the client and put it in a variable server
const server = http.createServer((req, res)=> {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello world\n');
});

// we tell the server to start listening on port 3000
server.listen(3000, ()=>{
    // once the server has successfully started listening (if the port isn't already in use) on port 3000, we'll log this in the console
    console.log('Server running at localhost:3000/');
});

```
You can now open our browser, visit [localhost:3000](localhost:3000){: target="blank" rel="noopener noreferrer" } and should see our 'Hello world' response from the server.

## Event Emitter
Another great feature that comes with NodeJs is the event emitter.
The event emitter allows us to emit and listen for named events,
 whenever the EventEmitter emits an event all the functions attached to the named event are called synchronously.

It's real simple, let us show you with an example:

```JavaScript
// first we require the 'events' module that comes with node
const events = require('events');
// next we'll create a new instance of the events module's event emitter
const eventEmitter = new events.EventEmitter();

// we'll tell the event emitter that we are going to listen for the 'hello' event
// and give it a callback function that gets called when the event is triggered.
eventEmitter.on('hello', (data)=>{
    // as you can see, our callback function accepts a data parameter,
    // we'll check if the event was emitted with data and has a 'name' property. If so we log 'Hello name'
    if(data.name){
        console.log('Hello ${data.name}');
    } else {
	    // if no data was passed to the callback, we'll simply log 'Hello world'
	    console.log('Hello world');
    }
});

// now that we are listening for the 'hello' event, we'll emit the event, once with data, and once without data.
eventEmitter.emit('hello', {name: 'Mike'}); // logs 'Hello Mike'
eventEmitter.emit('hello'); // logs 'Hello world'
```

## Streams
There are many ways that you can utilise readable/writable streams with NodeJs, for example the file system to read/write to files.
But to give you a simple example, let's reuse our code from our hello server.
Since the request object is a readable stream and the response object is a write-able stream,
we can create an application that pipes the data from the request, back to the response.
Let's see it in action with an example:

`streams.js`

```JavaScript
const http = require('http');

const server = http.createServer((request, response)=> {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  // the request is a readable stream, this means that the connection isn't immediately closed,
  // the connection stays open for as long as the client keeps sending data.
  // Streams inherit from the event emitter, so we can listen for the request stream's 'readable' and 'end' events
  // the readable event is triggered whenever the request has sent a chunk of data that can be read.
  req.on('readable', ()=>{
      let chunk = null;
      // as long as we can read chunks from the request, we write those chunks to the response.
      while(null !== (chunk = request.read())){
         // we can keep writing to the writable response stream as long as the connection is open,
         // so we keep piping the readable data to the response
          response.write(chunk);
      }
      // you can test it with curl from the terminal by sending a 'hello' string as data,
      // simply run: curl -d 'hello' http://localhost:3000
      // the 'hello' string is being sent back to the client
  });

  req.on('end', ()=>{
      // once the request stream is closed, we also close the response stream
      response.end();
  });

  /*
	I've written it out completely to show you what is does,
	but in fact we can use the pipe method to refactor the request's 'on readable' in some much simpler code
	req.on('readable', ()=>{
             request.pipe(response)
        })
   */
});

server.listen(3000, ()=>{
    console.log('Server running at localhost:3000/');
});
```

## Cluster
A single instance of Node.js runs in a single thread.
To take advantage of multi-core systems, the user will sometimes want to launch a cluster of Node.js processes to handle the load.

```JavaScript
// require the cluster module
const cluster = require('cluster');
// we'll set up a http server on all cpus and load balance between them
const http = require('http');
// we need to know the amount of cpus our machine has available,
// so we do this with the 'os' module's cpus method which returns an array of cpus, to get the amount we get the array's length
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // the cluster will first start up a master process that forks itself onto the other cpus and handles the load balancing between these workers
  console.log(`Master ${process.pid} is running`);

  // fork this process to a worker for every cpu that is left (not the < and not <=)
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // when a worker dies, it emits an exit event
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // if the cluster is not master, it (in this case) sets up our http server,
  // Workers can share any TCP connection

  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}

```
More information on clusters on [https://nodejs.org/api/cluster.html](https://nodejs.org/api/cluster.html)


Finally
So that's it for this blogpost. I hope it will be useful for you.
If you have any suggestions or feel like I've forgotten to mention some important stuff, feel free to comment below.
I'm currently working on some follow-up tutorials:
- Building REST APIs with NestJs (TypeScript),
- Microservices with NodeJs (Moleculer),
- Serverless with NodeJs

Once these are finished I'll add the links below, so stay tuned!
