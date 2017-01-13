---
layout: post
authors: [kevin_van_den_abeele]
title: 'Node with TypeScript'
image: /img/node-with-typescript/node-ts.jpg
tags: [Node, NodeJS, V8, JavaScript, TypeScript, IoT, Internet of Things]
category: IoT
comments: true
---

>NodeJS is a fantastic runtime to quickly and easily make projects. However as these projects tend to grow larger and larger the shortcomings of JavaScript become more and more visible.
This blog post will take a look at using TypeScript to write your Node code making it much more readable, introducing more OO like concepts whilst also making your code less error prone.

### NodeJS and its use cases

<p style="text-align: center;">
  <img alt="NodeJS Powered by the V8 JavaScript engine" src="/img/node-with-typescript/V8-engine.jpg">
</p>

NodeJS has many use cases, it is an easy to pickup and use runtime. It uses google's V8 JavaScript engine to interpret and run JavaScript code.
The user does not have to worry about threading, that is taken care off by the runtime. You write your code and make use of the many asynchronous operations provided by Node.
This will take care of any multithreading for you. However as you will read later in this blog post, making use of multiple Node instances to divide work is still possible!
More on that later!
<br/><br/>
Node can be used for a variety of tasks:
- Small yet efficient web server
- Code playground, test something out quickly
- Automation and tooling, instead of using ruby/python/...
- IoT, Raspberry pi's and other devices that can run Node!

<br/><br/>
However you should not use node for computationally heavy tasks! While the V8 engine is highly performant, there are other much more performant options available for computationally heavy operations!
<br/><br/>
This blog post is not meant for people who have no NodeJS experience! Below are some resources for those that are new to the platform:
- [The main NodeJS website](https://nodejs.org/en/)
- [The Node Package Manager](https://docs.npmjs.com/)
- [Code school intro to NodeJS](https://www.codeschool.com/courses/real-time-web-with-node-js)

### The old way, using plain JavaScript

<p style="text-align: center;">
  <img alt="JavaScript" src="/img/node-with-typescript/javascript.jpg">
</p>

Since NodeJS uses Google's V8 JavaScript engine, it speaks for itself that node interprets and runs regular JavaScript code. This has some pro and cons.
While it is an easy language to pick up, it can be hard to master, javascript has always had some quirks and getting to know and how to avoid these can be tricky!
It also does not require any compilation, which makes running your code very easy. However this also removes any help from the compiler as no compile time checks are performed.
No type checking, no checking for illogical structures or things that will just not work.
<br/><br/>
Code for Node can be run by simple opening a command prompt or terminal window and typing     
    {% highlight shell %}
    
    node
       
    {% endhighlight %}
This will start a Node instance and present you with an interpreter. You can now type commands and press return to execute them.
This can be handy to test something quickly.
<br/><br/>
It is also possible to run a JavaScript file directly. This can be done via:
    {% highlight shell %}
    
    node path/to/javascript-file.js 
       
    {% endhighlight %}
<br/>
However most of the time you will not be using this way of running code. Most of the time you will use npm to install your dependencies and start the node instance:
    {% highlight shell %}
    
    npm install
    npm start
       
    {% endhighlight %}
This reads the package.json file and executes the scripts contained inside it.

> Extensive documentation about the package.json file can be found on the [NPM website](https://docs.npmjs.com/files/package.json)

### TypeScript you say!?

<p style="text-align: center;">
  <img alt="TypeScript" src="/img/node-with-typescript/typescript.jpg">
</p>

TypeScript has been around for some years now. It can be seen as a superset of JavaScript. It uses the same syntax but adds among other things compile time type checking. 
It also adds a more Object Oriented model. A detailed explenation of the differences of the prototype based JavaScript and a more Object Oriented language can be found on the 
[Mozilla Developer website](https://developer.mozilla.org/nl/docs/Web/JavaScript/Guide/Details_of_the_Object_Model)
<br/><br/>

[TypeScript developed mainly by Microsoft](https://www.typescriptlang.org/) and is completely open source! This means developers can make suggestion and report bugs (and even fix these bugs if they want).
> TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. Any browser. Any host. Any OS. Open source.

<br/><br/>
[TypeScript is very well documented](https://www.typescriptlang.org/docs/tutorial.html) and getting started with the language is fairly easy. 
A lot of common development tools have support for TypeScript syntax checking. These include but are not limited to:
- Intellij
- Webstorm
- Atom
- Visual Studio Code
- ...

<br/><br/>
As Node applications regularly use other NPM dependencies it is required for the TypeScript compiler to know about these dependencies and what types they use.
You could make or generate these typings yourself, however you can easily find these typings on [TypeSearch](https://microsoft.github.io/TypeSearch/) website. 
The most commonly used dependencies have their typings available here!
<br/>

You can add the typings to the dependencies in the package.json file.
    {% highlight json %}
    
    "dependencies": {
        "typescript": "2.0.8",
    
        "@types/node": "0.0.2",
        "@types/mime": "0.0.29",
        "@types/johnny-five": "0.0.30",
        "@types/serialport": "4.0.6",
    
        "mime": "1.3.4",
        "johnny-five": "0.10.6",
        "serialport": "4.0.7"
    }
       
    {% endhighlight %}

### Making it all work: An example

A few years back I started working on my own server application to host some web content and provide REST services. The code was written in JavaScript and ran on a Raspberry Pi 2 (by now a pi 3).
For those of you that are interested the old code can be found on the following Github repositories:
- [WeatherGenie](https://github.com/beele/WeatherGenie) This was the initial implementation, a simple weather web application for checking the weather conditions for any city in Belgium
- [LoRa-IoT-Demo](https://github.com/ordina-jworks/lora-iot-demo) The second, extended iteration, based on the code from the WeatherGenie application. 
Because with the advent of IoT we needed a simple to extend/run/maintain solution to create IoT demos for clients.
- [NodeSimpleServer](https://github.com/ordina-jworks/NodeSimpleServer) The third and current iteration. Written from the ground up in TypeScript and completely reworked to work better and be more maintainable.
This is the application that will be detailed below!

## Node Simple Server: High level architecture

<p style="text-align: center;">
  <img alt="High level architecture" src="/img/node-with-typescript/high-level-arch.png">
</p>

The Application starts in app.ts under the main src folder. This is the entry point for the application. This file contains the actual master instance code.
The master instance is in charge of forking the workers and reviving them if they die. The master is also used to pass messages between the workers For this a specialized MessageHandler singleton is used.
This MessageHandler instance (one per worker) is used to relay messages. The master instance itself will not execute any application logic. Its purpose is to manage the other workers and be the message bridge.
<br/><br/>

    {% highlight typescript %}
    
    /**
     * Forks the workers, there will always be one DataBroker and one IntervalWorker.
     * HTTPWorker will be created based on the number of cpu cores. If less than two cores are available
     * two http workers will be created.
     */
    private forkWorkers = (): void =>{
        //Fork data broker.
        this.databroker = cluster.fork({name: 'broker', debug: this.isDebug});

        //Fork interval worker.
        this.intervalWorker = cluster.fork({name: 'interval', debug: this.isDebug});

        //Fork normal server worker instances. These will handle all HTTP requests.
        let cores:number                = os.cpus().length;
        let numberOfHttpWorkers:number  = cores - 2 > 0 ? cores - 2 : 1;
        console.log('There are ' + cores + ' cores available, starting ' + numberOfHttpWorkers + ' HTTP workers...');

        for (let i:number = 0; i < numberOfHttpWorkers; i++) {
            let worker = cluster.fork({name: 'http', debug: this.isDebug});
            this.httpWorkers.push(worker);
        }

        //Revive workers if they die!
        if(!this.isDebug) {
            cluster.on('exit', this.reviveWorker);
        }
    };

    {% endhighlight %}

The master will create a number of workers:
- HttpWorker: Each HttpWorker is an endpoint for requests to be received. There will always be a minimum of two HttpWorkers created. If more CPU cores are available, more HttpWorkers are created.
- DataBroker: For the application there is one DataBroker worker instance. This worker handles CRUD operations for data (for now in memory only).
- IntervalWorker: For the application there is one IntervalWorker instance. This worker can run code periodically and is used to connect to other devices such as Arduino's and the Raspberry Pi I/O pins.
<br/>
These workers are created by a WorkerFactory, as the master forks new Node instances, a process variable is set, the factory uses this to see which type the node instance should become.
Each type of worker instance implements the basic NoeWorker interface. Each implementation will be detailed below.

## Handling HTTP requests: The HttpWorker
Each HttpWorker instance will create a Server instance. This instance will be used to receive HTTP requests. Node will automatically load balance requests between all instances that register a server on the same port.
Simply put all HttpWorkers compete for the next request, the least burdened process (depending on OS/CPU process affinity) will be given the next Http request to handle.

The Server class will also register the endpoints that are known to the application and can be handled. 
The EndpointManager is used to register endpoints. An EndPoint has a path, a method to execute and optional parameters.
A Parameter is provided with a Generic type for compile time type checking, a name which should be used in the url, a description that provides information what the parameter should contain and an optional ParameterValidator.
A ParameterValidator is used to validate the parameter at runtime. If the check fails an error is shown to the user.

    {% highlight typescript %}
    
    /**
     * Maps the default endpoints.
     * Endpoints can always be added at any other location and point in time.
     * This can be done by getting the instance of the EndPointManager and calling the registerEndpoint method.
     */
    private mapRestEndpoints = (): void => {
        this.endpointManager.registerEndpoint(
            new EndPoint(
                '/',
                GenericEndpoints.index,
                null
            )
        );
        this.endpointManager.registerEndpoint(
            new EndPoint(
                '/endpoints',
                GenericEndpoints.listEndpoints,
                null
            )
        );
        this.endpointManager.registerEndpoint(
            new EndPoint(
                '/helloworld',
                GenericEndpoints.helloworld,
                [new Parameter<string, null, null>('name', 'string field containing the name', new HelloWorldValidatorImpl())]
            )
        );

        this.endpointManager.registerEndpoint(
            new EndPoint(
                '/arduino/setArduinoMethod',
                ArduinoEndpoint.setArduinoMethod,
                [new Parameter<string, null, null>('method', 'string field that contains the method used for adruino implementations', new ArduinoMethodValidatorImpl())]
            )
        );
    };

    {% endhighlight %}
    
<br/><br/>
The Server instance forwards all requests to the Router instance. As the name suggests this will perform the routing. It will see if a resource is requested or and endpoint has been called.
If a resource is requested it will be served if found. If an endpoint has been called, that endpoint will be executed and passed the parameters that were entered, but only after the correct amount of parameters has been passed and they are all valid.

## Handling HTTP requests: The DataBroker

## Handling HTTP requests: The IntervalWorker

## Inter Process Messaging: Communicating between different Node instances

### Final words
In conclusion; It is perfectly possible to make a more complex application for NodeJS with TypeScript. By using TypeScript you gain compile time type checking and a more robust and better readable codebase.
Fewer errors and strange bugs are encountered because TypeScript 'forces' you to write better code.
<br/><br/>
The Node Simple Server application was a great way to learn the 'new' TypeScript language. The project is not finished, as some parts could use some more work, but it should stand as a solid starting point.
Feel free to fork the codebase, submit issues or start some discussion.