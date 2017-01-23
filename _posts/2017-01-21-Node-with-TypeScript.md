---
layout: post
authors: [kevin_van_den_abeele]
title: 'Node with TypeScript'
image: /img/node-with-typescript/node-ts.jpg
tags: [Node, NodeJS, V8, JavaScript, TypeScript, IoT, Internet of Things]
category: IoT
comments: true
---

>NodeJS is a fantastic runtime to quickly and easily make projects.
However as these projects tend to grow larger and larger, the shortcomings of JavaScript become more and more visible.
This blog post will take a look at using TypeScript to write your Node application making it much more readable, introducing more OO like concepts whilst also making your code less error prone.

### NodeJS and its use cases

<p style="text-align: center;">
  <img class="image fit" style="width: 650px; margin:0px auto;" alt="NodeJS Powered by the V8 JavaScript engine" src="/img/node-with-typescript/V8-engine.jpg">
</p>

NodeJS has many use cases.
It is an easy to pickup and use runtime.
It uses Google's V8 JavaScript engine to interpret and run JavaScript code.
The user does not have to worry about threading.
This is taken care off by the runtime.
You write your code and make use of the many asynchronous operations provided by Node.
This will take care of any multithreading for you.
However, as you will read later in this blog post, making use of multiple Node instances to divide work is still possible!
More on that later!
<br/><br/>
Node can be used for a variety of tasks:
- Small yet efficient web server
- Code playground, test something quickly
- Automation and tooling, instead of using ruby/python/...
- IoT, Raspberry pi's and other devices that can run Node!

<br/><br/>
However, you should not use node for computationally heavy tasks!
While the V8 engine is highly performant, there are other much more performant options available for computationally heavy operations!
<br/><br/>
This blog post is not meant for people who have no NodeJS experience!
Below are some resources for those that are new to the platform:
- [The main NodeJS website](https://nodejs.org/en/)
- [The Node Package Manager](https://docs.npmjs.com/)
- [Code school intro to NodeJS](https://www.codeschool.com/courses/real-time-web-with-node-js)

### The old way, using plain JavaScript

<p style="text-align: center;">
  <img class="image fit" alt="JavaScript" src="/img/node-with-typescript/javascript.jpg">
</p>

Since NodeJS uses Google's V8 JavaScript engine, it speaks for itself that node interprets and runs regular JavaScript code.
This has some pros and cons.
While it is an easy language to pick up, it can be hard to master.
Javascript has always had some quirks and getting to know and how to avoid these can be tricky!
It also does not require any compilation, which makes running your code very easy.
However, this also removes any help from the compiler as no compile time checks are performed.
No type checking, no checking for illogical structures or things that will just not work.
<br/><br/>
Code for Node can be run by simple opening a command prompt or terminal window and typing     
    {% highlight shell %}

    node

    {% endhighlight %}
This will start a Node instance and present you with an interpreter.
You can now type commands and press return to execute them.
This can be handy to test something quickly.
<br/><br/>
It is also possible to run a JavaScript file directly.
This can be done via:
    {% highlight shell %}

    node path/to/javascript-file.js

    {% endhighlight %}
<br/>
However, most of the time you will not be using this way of running code.
Most of the time you will use npm to install your dependencies and start the node instance:
    {% highlight shell %}

    npm install
    npm start

    {% endhighlight %}
This reads the package.json file and executes the scripts contained inside it.

> Extensive documentation about the package.json file can be found on the [NPM website](https://docs.npmjs.com/files/package.json)

### TypeScript you say!?

<p style="text-align: center;">
  <img class="image fit" alt="TypeScript" src="/img/node-with-typescript/typescript.jpg">
</p>

TypeScript has been around for some years now.
TypeScript is a superset of JavaScript.
It uses the same syntax but adds among other things compile time type checking.
It also adds a more Object Oriented model.
A detailed explanation of the differences of the prototype based JavaScript and a more Object Oriented language can be found on the
[Mozilla Developer website](https://developer.mozilla.org/nl/docs/Web/JavaScript/Guide/Details_of_the_Object_Model)
<br/><br/>

[TypeScript developed mainly by Microsoft](https://www.typescriptlang.org/) and is completely open source!
This means developers can make suggestions and report bugs (and even fix these bugs if they want).
> TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.
 Any browser. Any host. Any OS. Open source.

<br/><br/>
[TypeScript is very well documented](https://www.typescriptlang.org/docs/tutorial.html) and getting started with the language is fairly easy.
A lot of common development tools have support for TypeScript syntax checking.
These include, but are not limited to:
- Intellij
- Webstorm
- Atom
- Visual Studio Code
- ...

<br/><br/>
As Node applications regularly use other NPM dependencies it is required for the TypeScript compiler to know about these dependencies and what types they use.
You could make or generate these typings yourself.
However, you can easily find these typings on [TypeSearch](https://microsoft.github.io/TypeSearch/) website.
The most commonly used dependencies have their typings available here!
<br/>

You can add the typings to the dependencies in the package.json file.

    {% highlight coffeescript %}

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

A few years back I started working on my own server application to host some web content and provide REST services.
The code was written in JavaScript and ran on a Raspberry Pi 2 (by now a pi 3).
For those of you that are interested the old code can be found on the following Github repositories:
- [WeatherGenie](https://github.com/beele/WeatherGenie) This was the initial implementation, a simple weather web application for checking the weather conditions for any city in Belgium
- [LoRa-IoT-Demo](https://github.com/ordina-jworks/lora-iot-demo) The second, extended iteration, based on the code from the WeatherGenie application.
Because with the advent of IoT we needed a simple to extend/run/maintain solution to create IoT demos for clients.
- [NodeSimpleServer](https://github.com/ordina-jworks/NodeSimpleServer) The third and current iteration. Written from the ground up in TypeScript and completely reworked to work better and be more maintainable.
This is the application that will be detailed below!

## Node Simple Server: High level architecture

<p style="text-align: center;">
  <img class="image fit" alt="High level architecture" src="/img/node-with-typescript/high-level-arch.png">
</p>

The Application starts in app.ts under the main src folder.
This is the entry point for the application.
This file contains the actual master instance code.
The master instance is in charge of forking the workers and reviving them if they die.
The master is also used to pass messages between the workers For this a specialized `MessageHandler` singleton is used.
This `MessageHandler` instance (one per worker) is used to relay messages.
The master instance itself will not execute any application logic.
Its purpose is to manage the other workers and be the message bridge.
<br/><br/>

    {% highlight coffeescript %}

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
- `HttpWorker`: Each `HttpWorker` is an endpoint for requests to be received.
There will always be a minimum of two HttpWorkers created.
If more CPU cores are available, more HttpWorkers are created.
- `DataBroker`: For the application there is one `DataBroker` worker instance.
This worker handles CRUD operations for data (for now in memory only).
- `IntervalWorker`: For the application there is one `IntervalWorker` instance.
This worker can run code periodically and is used to connect to other devices such as Arduino's and the Raspberry Pi I/O pins.
<br/>
These workers are created by a `WorkerFactory`, as the master forks new Node instances, a process variable is set, the factory uses this to see which type the node instance should become.
Each type of worker instance implements the basic `NodeWorker` interface.
Each implementation will be detailed below.

## Handling HTTP requests: The HttpWorker
Each `HttpWorker` instance will create a `Server` instance.
This instance will be used to receive HTTP requests.
Node will automatically load balance requests between all instances that register a server on the same port.
Simply put all HttpWorkers compete for the next request, the least burdened process (depending on OS/CPU process affinity) will be given the next Http request to handle.

The `Server` class will also register the endpoints that are known to the application and can be handled.
The `EndpointManager` is used to register endpoints.
An `EndPoint` has a path, a method to execute and optional parameters.
A `Parameter` is provided with a Generic type for compile time type checking, a name which should be used in the url, a description that provides information what the parameter should contain and an optional `ParameterValidator`.
A `ParameterValidator` is used to validate the `Parameter` at runtime.
If the check fails an error is shown to the user.

    {% highlight coffeescript %}

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

The `Server` instance forwards all requests to the `Router` instance.
As the name suggests this will perform the routing.
It will see if a resource is requested or and endpoint has been called.
If a resource is requested it will be served if found.
If an endpoint has been called, that endpoint will be executed and passed the parameters that were entered, but only after the correct amount of parameters has been passed and they are all valid.

## Handling data: The DataBroker
The `DataBroker` is the Node instance in the application that will save and retrieve data.
For the time being it is sufficient to only have in memory 'caches' on which basic CRUD operations can be performed.
All methods on the `DataBroker` are called by sending an `IPCRequest` with the data that needs to be saved of the instruction for what data should be retrieved.
The `DataBroker` will reply to the original worker by sending an `IPCReply` with the result of the operation.

The `DataBroker` for now only has a concept of caches.
A cache has a name, type and values (of said type).
Values can be retrieved, added, updated and deleted from the caches.
Caches can be retrieved, added and deleted at runtime.

## Handling asynchronous tasks: The IntervalWorker
The `IntervalWorker` as its name suggest performs tasks at a certain interval.
It is also used for other asynchronous workloads, such as connecting to an Arduino and running Arduino/Raspberry pi Johhny-Five scenarios.
The `IntervalWorker` is handy when you need for example to update the content of a cache every so often.
<br/><br/>
It can also run Arduino scenarios.
These are Implementations that contain logic to perform actions on the Arduino or in response to something that happens on the Arduino.
The `IntervalWorker` picks up what type of Arduino `Scenario` you want to run and starts the logic.

    {% highlight coffeescript %}

    /**
     * Sets up the connection to the Arduino and starts the desired Arduino Scenario.
     */
    private setupArduino = (): void => {
        if(this.config.arduino.enableArduino) {

            if(this.config.arduino.useSerialOverJohnnyFive) {
                this.arduino = new ArduinoSerial(
                    this.config.arduino.serialPortName,
                    this.config.arduino.serialPortBaudRate,
                    new PingScenario()
                );
            } else {
                this.arduino = new ArduinoJohnny(new BlinkScenario());
            }
            this.arduino.init();
        } else {
            console.log('Skipping arduino setup, disabled in settings!');
        }
    };

    {% endhighlight %}

There are two Arduino implementations available.
Both can execute a `Scenario`.
The first and simplest implementation is the Johnny-Five Arduino implementation.
This allows you to make use of the Johnny-Five framework to write dynamic code for the Arduino that can change at runtime.
This is possible because it uses the StandardFirmata firmware.
Johnny-Five supports a lot of components and peripherals.
[Their website](http://johnny-five.io/api/) has extensive documentation and very clear examples.
Johnny-Five also supports the Raspberry PI I/O pins.
This allows it to be used on a Raspberry pi also.
<br/>
The second Arduino implementation uses no framework and communication is done via regular serial.
In the type of scenarios you have to handle all the serial communication yourself.
You also have to write Arduino firmware and thus it cannot be dynamically updated at runtime.
Use this Arduino implementation if some component is incompatible or not supported by Johnny-Five.

## Inter Process Messaging: Communicating between different Node instances
Having all these different worker instances is quite handy.
However they are of not much use if there cannot be any communication between them.
Each Node instance has its own allocated memory and cannot access variables or call methods on other instances.
The Node cluster and process framework provide the option to send messages between Node instances.
<br/><br/>
The `IPCMessage` instances that are sent exist in two forms.
- `IPCRequest`: This is the initial message that is sent to a target.
- `IPCReply`: This is the response (if any) from the target back to the original caller.
<br/><br/>

This allows for easy two way communication and identification whether the message was a reply to an earlier message.
Messages can be sent with or without a callback.
The callback is executed when a reply to the original message is received.
Because only basic data types can be sent across Node instances the `MessageManager` instance of the caller stores the callback reference and generates an unique id for said callback.
This allows the application to send the callback ID across Node instances and execute it when it arrives back at the caller.

    {% highlight coffeescript %}

    /**
         * MessageManager singleton class.
         * This class has an array of tuples of string and Function.
         * The string field is the callbackId and the Function is the actual callback.
         * The message manager is a per worker instance that can only execute callbacks on the same worker.
         * The integration with the IPC framework allows messages to be sent to other workers and replies to be sent back to the original worker.
         * It is important that the original worker is called to execute the callback since a function cannot cross a node instance!
         *
         * This singleton can be used to manage IPC messages.
         */
        export class MessageManager {

            private static instance: MessageManager         = null;
            private callbacks: Array<[string, Function]>    = null;
            private workerId: string                        = null;

            /**
             * Private constructor for the singleton.
             */
            private constructor() {
                this.callbacks = [];
                this.workerId = cluster.worker.id;
            }

            /**
             * Use this method to get the instance of this singleton class.
             *
             * @returns {MessageManager} The instance of this singleton class.
             */
            public static getInstance(): MessageManager {
                if(!MessageManager.instance) {
                    MessageManager.instance = new MessageManager();
                }
                return MessageManager.instance;
            }

            /**
             * Sends an IPCMessage of the subtype IPCRequest to the given MessageTarget (one of the three worker types).
             * A target function is also given and contains the name of the function that will be executed on the target.
             * The target should implement a specific handler or switch statement to handle these different target function names.
             * This message is sent without a callback. This means that when the target function has finished no reply will be sent to inform the caller.
             *
             * @param payload The payload for the target, can be of any kind.
             * @param messageTarget The MessageTarget, being one of the three types of workers.
             * @param targetFunctionName The name of the function to be executed on the target. This value is NOT evaluated by eval for security reasons.
             */
            public sendMessage(payload: any, messageTarget: MessageTarget, targetFunctionName: string): void {
                let message: IPCMessage = new IPCRequest(this.workerId, null, payload, messageTarget, targetFunctionName);
                process.send(message);
            }

            /**
             * Sends an IPCMessage of the subtype IPCRequest to the given MessageTarget (one of the three worker types).
             * A target function is also given and contains the name of the function that will be executed on the target.
             * The target should implement a specific handler or switch statement to handle these different target function names.
             * This message is sent with a callback. The callee sends a new IPCMessage of the subtype IPCReply to inform the caller and provide it with new information if needed.
             * A reply can be sent by using the sendReply method on this class.
             *
             * @param payload The payload for the target, can be of any kind.
             * @param callback The function that should be called when a reply has been received.
             * @param messageTarget The MessageTarget, being one of the three types of workers.
             * @param targetFunctionName The name of the function to be executed on the target. This value is NOT evaluated by eval for security reasons.
             */
            public sendMessageWithCallback(payload: any, callback: Function, messageTarget: MessageTarget, targetFunctionName: string): void {
                let callbackId: string = process.hrtime()  + "--" + (Math.random() * 6);
                this.callbacks.push([callbackId, callback]);

                let message: IPCMessage = new IPCRequest(this.workerId, callbackId, payload, messageTarget, targetFunctionName);
                process.send(message);
            }

            /**
             * Sends and IPCMessage of the subtype IPCReply to the sender of the original message.
             *
             * @param payload A new payload to provide to the original sender.
             * @param originalMessage The message the sender originally sent.
             */
            public sendReply(payload: any, originalMessage: IPCRequest): void {
                let reply: IPCMessage = new IPCReply(this.workerId, payload, originalMessage);
                process.send(reply);
            }

            /**
             * For a given callbackId execute the callback function.
             *
             * @param callbackId The callbackId for which to execute the callback function.
             */
            public executeCallbackForId(callbackId: string) :void {
                for (let callbackEntry of this.callbacks) {
                    if(callbackEntry[0] == callbackId) {
                        callbackEntry[1]();
                        return;
                    }
                }
            }
        }

    {% endhighlight %}

    <br/> <br/>

    {% highlight coffeescript %}

    /**
     * MessageHandler singleton class.
     *
     * This singleton can be used to handle IPC messages.
     */
    export class MessageHandler {

        private static instance: MessageHandler         = null;
        private dataBroker : cluster.Worker             = null;
        private intervalWorker : cluster.Worker         = null;
        private httpWorkers : Array<cluster.Worker>     = null;
        public emitter: EventEmitter                    = null;

        /**
         * Private constructor for the singleton.
         */
        private constructor() {

        }

        /**
         * Use this method to get the instance of this singleton class.
         *
         * @returns {MessageHandler} The instance of this singleton class.
         */
        public static getInstance(): MessageHandler {
            if(!MessageHandler.instance) {
                MessageHandler.instance = new MessageHandler();
            }
            return MessageHandler.instance;
        }

        /**
         * Initialises the MessageHandler for being a handler for the master NodeJS process.
         *
         * @param dataBroker The DataBroker worker instance.
         * @param intervalWorker The IntervalWorker worker instance.
         * @param httpWorkers The HTTPWorker worker instance.
         */
        public initForMaster = (dataBroker: cluster.Worker, intervalWorker: cluster.Worker, httpWorkers: Array<cluster.Worker>): void => {
            this.dataBroker     = dataBroker;
            this.intervalWorker = intervalWorker;
            this.httpWorkers    = httpWorkers;

            this.emitter        = new EventEmitter();
        };

        /**
         * Initialises the MessageHandler for being a handler for a slave (worker) NodeJS process.
         */
        public initForSlave = (): void => {
            this.emitter        = new EventEmitter();
        };

        /*-----------------------------------------------------------------------------
         ------------------------------------------------------------------------------
         --                         MASTER MESSAGE HANDLING                          --
         ------------------------------------------------------------------------------
         ----------------------------------------------------------------------------*/
        //TODO: Separate master and slave message handling?

        /**
         * Handler function for messages sent by HTTPWorkers.
         * Forwards the message to the target.
         *
         * @param msg The IPCMessage as sent by an HTTPWorker.
         */
        public onServerWorkerMessageReceived = (msg: IPCMessage): void => {
            console.log('Message received from server worker');
            this.targetHandler(msg);
        };

        /**
         * Handler function for the messages sent by the IntervalWorker.
         * Forwards the message to the target.
         *
         * @param msg The IPCMessage as sent by the IntervalWorker.
         */
        public onIntervalWorkerMessageReceived = (msg: IPCMessage): void => {
            console.log('Message received from interval worker');
            this.targetHandler(msg);
        };

        /**
         * Handler function for the messages sent by the DataBroker.
         * Forwards the message to the target.
         *
         * @param msg The IPCMessage as sent by the DataBroker.
         */
        public onDataBrokerMessageReceived = (msg: IPCMessage): void => {
            console.log('Message received from data broker');
            cluster.workers[msg.workerId].send(msg);
        };

        /**
         * This method is used to direct the IPCMessage to the correct target as specified in the message.
         * This handler makes a distinction between messages of the types IPCRequest and IPCReply.
         *
         * @param msg The IPCMessage that is to be forwarded to the correct target.
         */
        private targetHandler = (msg: IPCMessage) => {
            if(msg.type == IPCMessage.TYPE_REQUEST) {
                let m: IPCRequest = <IPCRequest> msg;
                console.log('Master received request');

                switch (m.target){
                    case MessageTarget.DATA_BROKER:
                        this.dataBroker.send(msg);
                        break;
                    case MessageTarget.INTERVAL_WORKER:
                        this.intervalWorker.send(msg);
                        break;
                    case MessageTarget.HTTP_WORKER:
                        let index: number = Math.round(Math.random() * this.httpWorkers.length) - 1;
                        index = index === -1 ? 0 : index;
                        this.httpWorkers[index].send(msg);
                        break;
                    default:
                        console.error('Cannot find message target: ' + m.target);
                }

            } else if(msg.type == IPCMessage.TYPE_REPLY) {
                let m: IPCReply = <IPCReply>msg;
                console.log('Master received reply!');

                cluster.workers[m.originalMessage.workerId].send(msg);
            }
        };

        /*-----------------------------------------------------------------------------
         ------------------------------------------------------------------------------
         --                          SLAVE MESSAGE HANDLING                          --
         ------------------------------------------------------------------------------
         ----------------------------------------------------------------------------*/

        /**
         * Handler function for the messages sent by the Master NodeJS process.
         * This handler makes a distinction between messages of the types IPCRequest and IPCReply.
         *
         * @param msg The IPCMessage as passed on by the master process.
         */
        public onMessageFromMasterReceived = (msg: IPCMessage): void => {
            if(msg.type == IPCMessage.TYPE_REQUEST) {
                let m: IPCRequest = <IPCRequest>msg;

                console.log('[id:' + cluster.worker.id  + '] Received request from master: routing to: ' + MessageTarget[m.target] + '.' + m.targetFunction);
                this.emitter.emit(MessageTarget[m.target] + '', m);

            } else if(msg.type == IPCMessage.TYPE_REPLY) {
                let m: IPCReply = <IPCReply>msg;
                console.log('Slave received reply!');

                MessageManager.getInstance().executeCallbackForId(m.originalMessage.callbackId);
            }
        };
    }

    {% endhighlight %}    

Every worker has an instance of the `MessageHandler`, it in its turn has an event emitter on which events from the messages are broadcast.
The actual worker implementations register themselves on the emitter to receive said events.
In a future version the message handling should be split up, because now a single file (with an instance on each Node instance) handles both master and slave messages.

### Final words
In conclusion; It is perfectly possible to make a more complex application for NodeJS with TypeScript.
By using TypeScript you gain compile time type checking and a more robust and better readable codebase.
Fewer errors and strange bugs are encountered because TypeScript 'forces' you to write better code.
<br/><br/>
The Node Simple Server application was a great way to learn the 'new' TypeScript language.
The project is not finished, as some parts could use some more work, but it should stand as a solid starting point.
Feel free to fork the codebase, submit issues or start some discussion.
