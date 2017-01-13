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
</br></br>
Node can be used for a variety of tasks:
- Small yet efficient web server
- Code playground, test something out quickly
- Automation and tooling, instead of using ruby/python/...
- IoT, Raspberry pi's and other devices that can run Node!

</br></br>
However you should not use node for computationally heavy tasks! While the V8 engine is highly performant, there are other much more performant options available for computationally heavy operations!
</br></br>
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
</br></br>
Code for Node can be run by simple opening a command prompt or terminal window and typing     
    {% highlight shell %}
    
    node
       
    {% endhighlight %}
This will start a Node instance and present you with an interpreter. You can now type commands and press return to execute them.
This can be handy to test something quickly.
</br></br>
It is also possible to run a JavaScript file directly. This can be done via:
    {% highlight shell %}
    
    node path/to/javascript-file.js 
       
    {% endhighlight %}
</br>
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
</br></br>

[TypeScript developed mainly by Microsoft](https://www.typescriptlang.org/) and is completely open source! This means developers can make suggestion and report bugs (and even fix these bugs if they want).
> TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. Any browser. Any host. Any OS. Open source.

</br></br>
[TypeScript is very well documented](https://www.typescriptlang.org/docs/tutorial.html) and getting started with the language is fairly easy. 
A lot of common development tools have support for TypeScript syntax checking. These include but are not limited to:
- Intellij
- Webstorm
- Atom
- Visual Studio Code
- ...

### Making it all work: An example

A few years back I started working on my own server application to host some web content and provide REST services. The code was written in JavaScript and ran on a Raspberry Pi 2 (by now a pi 3).
For those of you that are interested the old code can be found on the following Github repositories:
- [WeatherGenie](https://github.com/beele/WeatherGenie) This was the initial implementation, a simple weather web application for checking the weather conditions for any city in Belgium
- [LoRa-IoT-Demo](https://github.com/ordina-jworks/lora-iot-demo) The second, extended iteration, based on the code from the WeatherGenie application. 
Because with the advent of IoT we needed a simple to extend/run/maintain solution to create IoT demos for clients.
- [NodeSimpleServer](https://github.com/ordina-jworks/NodeSimpleServer) The third and current iteration. Written from the ground up in TypeScript and completely reworked to work better and be more maintainable.
This is the application that will be detailed below!

## Node Simple Server: High level architecture

