---
layout: post
authors: [ivar_van_hartingsveldt]
title: 'Creating a REST API with NodeJS, TypeScript and Koa.'
image: /img/nodejs-typescript-koa/koa-logo.png
tags: [NodeJS, TypeScript, JavaScript, Koa, REST, MySQL]
category: NodeJS
comments: true
---
> This article assumes you already have some knowledge of npm and JavaScript development in general. It will not be a detailed tutorial about how to write a REST API, it’s more of an extra explanation for the application I made, the libraries I used and my experience with them.

# Why?

I started this little project because I wanted to be able to quickly write backends for small personal projects with little overhead. Coming from the Java backend world, I have been writing almost only JavaScript for close to 2 years now, but only frontend. I had tried NodeJS in the past for a small project with plain old JavaScript and had a very bad time. Now however, with my new experience in JavaScript, the arrival of ES6 and TypeScript, I wanted to give it another shot. 

# What exactly did I make?

The idea was to write a backend for an application called MovieListr. It’s a simple application to track movies you have watched or want to watch. The API allows you to create, delete, update and see movies and directors. A movie also has a one-to-one relation with a director.

[You can find the code on Github.](https://github.com/ivarvh/movielistr-backend-ts-ioc)

# Setup

Setting up a node project with TypeScript doesn’t require a lot of effort, the following commands are enough to get started.

{% highlight shell %}
mkdir <project-name>
cd <project-name>
mkdir src
npm init //follow the setup
npm install --save-dev typescript tsc //install TypeScript and the TypeScript compiler
tsc --init //generates a `tsconfig.json`, a config for the TypeScript compiler
{% endhighlight %}

This is it, you still have to tinker with the tsconfig.json to get it to your liking, but after that you can just start writing code.

# Using async / await

I want to start with talking about the async / await features. They were what really made this code so fast to write and easy to read. The async keyword marks a function that will always return a promise. The await keyword will automatically unwrap the value from the promise and continue the code when the promise has been resolved. A small example:

{% highlight coffeescript %}  
    const promiseFn = (): Promise<string> => {
	    return Promise.resolve("Hello World");
    }
 
    // Old way:
 
    const asyncFn = () => {
	    promiseFn()
		    .then(value => {
			    console.log(value);
            });
    }
 
    // With async / await
 
    const asyncFn = async () => {
	    const text = await promiseFn();
	    console.log(text);
    }
{% endhighlight %}

You can see how readable it is with the async / await syntax. You can write asynchronous code in a synchronous way and I used it heavily everywhere in my code. I think this is one of the things that will really make writing JavaScript fun. No more callbacks, no more boilerplate code, just the important bits. For error handling you can rely on try catch statements to catch errors and act on them.
 
To use the async / await syntax, you can have to add `esnext.asynciterable` to the lib array in the `tsconfig.json` file.

# The libraries I used

### Koa

Koa is a small node library to create REST APIs. It was made by the guys who created Express. It takes advantage of the new ES6 feature of generator functions and it allows you to write very readable code by using the async / await features (that are based on the generator functions). For a full understanding of koa and generator functions, I suggest the [Koa course](https://www.pluralsight.com/courses/JavaScript-koa-introduction) on Pluralsight from Hammarberg. 
 
Koa relies heavily on middleware, so for every "step" of the process we need middleware. For instance [`koa-bodyparser`](https://github.com/koajs/bodyparser) middleware will parse the request body to json, the [`koa-logger`](https://github.com/koajs/logger) middleware will log all the incoming requests and the [`koa-router`](https://github.com/alexmingoia/koa-router) middleware will make it easy for us to configure the url mapping to certain actions. These middlewares are installed apart from the Koa framework or you can write them yourself.

### typescript-ioc

To make testing easy, I started looking for a dependency injection framework for TypeScript. I wanted to more or less copy the way I wrote unit tests in Java, which is using dependency injection in your actual code and just creating an instance in your unit test while passing mocks instead of the dependencies. The first dependency injection framework I found, was [Awilix](https://github.com/jeffijoe/awilix). I got Awilix to work, and it worked quite well, but there was still a lot of boilerplate code to write to actually register the services to the container and to get it working. You can also pass folder names so it will register all the services in that folder, but I didn’t find this optimal. I was also using Webpack in the beginning (which I write about later in the article) to build my application and bundle my code, by bundling the code, the paths of the folders obviously didn’t work out anymore in the compiled code, so Awilix was no good for me. I kept searching and I found the library typescript-ioc. This library was based on annotations, so there is barely any configuration overhead and it worked much more like I was used to in Java. typescript-ioc requires you to set experimentalDecorators and emitDecoratorMetadata to true in the tsconfig.json file. You can then just write code like

{% highlight coffeescript %}  
    import { Container } from "typescript-ioc";
    
    class Foo {
        doSomething(): string {
        	return "Hello World";
        }	
    }
    
    class Bar {
        constructor(@Inject private foo: Foo) {
        }	
    
    	doAnotherThing(): string {
    		this.foo.doSomething();
        }
    }
    
    const bar:Bar = Container.get(Bar);
    bar.doAnotherThing();
{% endhighlight %}

### typeorm

At first I just saved the movies and directors in the services as an in-memory array for testing purposes, but in a real application you will want persistence of some sort, so I needed a database. I decided on a regular old MySQL database and an ORM library to do the mapping between the database records and my TypeScript model classes. For ORM I used [typeorm](https://github.com/typeorm/typeorm). It’s pretty easy to use. It also uses the annotations like typescript-ioc, which makes code very readable. The experience with this library was more or less pain free, so I really recommend it. To check a real example from my repository, check the [Movie](https://github.com/ivarvh/movielistr-backend-ts-ioc/blob/master/src/models/Movie.ts) model.

# Testing

### Unit testing

For unit testing I used the classic combination of [Mocha](https://mochajs.org/), [Sinon](http://sinonjs.org/) and [Chai](http://chaijs.com/). Since I was using dependency injection, I also needed a good way of mocking my dependencies, for this I found [ts-mockito](https://github.com/NagRock/ts-mockito). Ts-mockito is more or less a clone of the [Mockito](http://site.mockito.org/) library in Java. It allows you to create mocks of classes, make functions return certain values and verify that calls have been made. This made it super easy to write tests. For examples check the tests folder in my repository. To execute the TypeScript tests, I used [ts-node](https://github.com/TypeStrong/ts-node). Ts-node compiles the TypeScript and keeps the compiled JavaScript in memory while it executes it. This way you don’t have to create an additional folder to compile the tests to and execute them. You can then easily create an npm script like this:
 
`mocha -r ts-node/register test/**/*.spec.ts`
 
This tells Mocha  to require the ts-node/register module (this is what the `-r ts-node/register`) means and then it just passes the path of the test files to it. This also worked pretty much painlessly.

### end-to-end testing

I wanted to be able to do some real end to end testing. So I wanted to be able to spin up my application, pass some HTTP requests to it and then verify the output of the requests. The first question was how to pass the requests to my application. For this I found the library [SuperTest](https://github.com/visionmedia/supertest). You can just start you Koa app and pass the HTTP server (the return value of the `app.listen` function) to the agent and it will make sure the app is started and you can do some requests and check the results. This worked pretty well.
 
The second problem was a test database. I needed a database that was as close to the real one as possible. I ran the real database in a [Docker](https://www.docker.com/) container with a volume that mapped the `/var/lib/mysql` (the configuration / data folder for MySQL) to a host directory, so I could recreate the container without losing data. I figured I could more or less copy the Docker configuration for the database for a test database, only without the volume. Without the volume, the data would just be saved to the container itself, so it would be lost every time the container was recreated, which is perfect for end-to-end tests, because we want to start the tests with the exact same dataset, so we can make sure our assertions keep working. 
 
So I created an npm script to start the Docker and to do healthchecks to the Docker container until it told me that the entire container was up and running and MySQL was ready to take connections. Then I wrote a script to start the actual end to end tests, which was simply the same mocha call I wrote earlier, only pointing to the e2e folder instead of the test folder. At last I wrote an npm script to stop the Docker container and remove it. You can check these scripts [here](https://github.com/ivarvh/movielistr-backend-ts-ioc/tree/master/scripts). I made heavy use of the [shelljs](https://github.com/shelljs/shelljs) package. This npm package allows you to execute shell commands, which I used to start Docker containers from JavaScript.
 
NOTE: this setup works well, but the starting of the Docker container takes ~30 seconds, which is quite long, considering that the tests take maybe a few seconds. In a continuous integration build, this doesn’t matter as much, but when you are trying to fix tests, it does take a lot of time if you have to wait about a minute for each test run.

# Task runner

### Webpack

When I started this project, I was looking up some best practices for node. I came across an [article](http://jlongster.com/Backend-Apps-with-Webpack--Part-I) that suggested you should use [Webpack](https://webpack.github.io/) for backend too. I already have some experience with Webpack from frontend development, so at first it seemed logical to use it for backend too. When I was trying to get the dependency injection to work with Awilix, I realized that I could not pass any paths to libraries, because when my code was bundled, the paths would be invalid. Then I started to actually wonder why I was bundling my code. In frontend you bundle your code to make it as small as possible so you don’t waste the user’s bandwidth and make you website load faster, but in backend, that does not matter, since the code does not have to be sent anywhere. At this point I decided I didn’t need Webpack at all and I could just use npm scripts' functionality to create tasks.

### npm

Npm is actually the only build tool you need. If what you want to do is more than a single line command, you can just write scripts in either TypeScript (you can execute them with ts-node), bash, JavaScript, … whatever you like. I wrote my scripts in TypeScript, because to me it makes more sense to use TypeScript for everything, but I could just as well have written them using bash. Npm also gives you pre and post task hooks. So if you write a task with the name "e2e" as I did, you can also add a task with the "pre" prefix or the "post" prefix that will automatically be executed before and after the task is executed. This way I could easily separate the starting of the Docker container, the executing of the tests and the stopping of the Docker container into different scripts. I could then just execute `npm run pree2e` to check if my script to start the Docker worked. I really like this approach and the fact that I don’t need another tool to learn like gulp or Webpack.

# Debugging

### Application code

I had some trouble at the beginning with debugging my TypeScript. For some reason in the Chrome Devtools I could not get my sourcemaps working (even though they were inline sourcemaps). Then I tried the Visual Studio Code debugger and that worked much better. To get this to work, I did the following:

[`tsconfig.json`](https://github.com/ivarvh/movielistr-backend-ts-ioc/blob/master/tsconfig.json)
{% highlight text %}  
    {
        "compilerOptions": {

            "inlineSourceMap": true,
            "inlineSources": true,

        }
    }
{% endhighlight %}

[`package.json`](https://github.com/ivarvh/movielistr-backend-ts-ioc/blob/master/package.json)
{% highlight text %}  

    "scripts": {
        
	    "start:debug": "ts-node --inspect=5858 --debug-brk --ignore false src/index.ts",
        
    }

{% endhighlight %}

[`.vscode/launch.json`](https://github.com/ivarvh/movielistr-backend-ts-ioc/blob/master/.vscode/launch.json)
{% highlight text %}  
    {
	    "configurations": [
	        {
                "type": "node",
                "request": "launch",
                "name": "Debug Application",
                "runtimeExecutable": "npm",
                "windows": {
                    "runtimeExecutable": "npm.cmd"
                },
                "runtimeArgs": [
                    "run-script",
                    "start:debug"
                ],
                "outFiles": [],
                "protocol": "inspector",
                "sourceMaps": true,
                "port": 5858
            }
        ]
    }
{% endhighlight %}

The npm script will start the execution of the `index.ts` with ts-node in debug mode on port 5858 and the `--debug-brk` tells it to break on the first line of code. The launch configuration will just execute this npm script and attach it to the debugger.

### Test code

Debugging the test code is more or less the same as the application code, there is just a small caveat. When you create breakpoints in Visual Studio Code, they will appear gray as if they cannot be reached. But when you execute the code, it will break on the breakpoints and then they will become red like a normal breakpoint.

[`package.json`](https://github.com/ivarvh/movielistr-backend-ts-ioc/blob/master/package.json)
{% highlight text %}  
    "scripts": {
	    "test:debug": "mocha --inspect --debug-brk --not-timeouts --compilers ts:ts-node/register test/**/*.spec.ts",
    }
{% endhighlight %}

[`.vscode/launch.json`](https://github.com/ivarvh/movielistr-backend-ts-ioc/blob/master/.vscode/launch.json)
{% highlight text %}  
{
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Debug Tests",
            "runtimeExecutable": "npm",
            "windows": {
                "runtimeExecutable": "npm.cmd"
            },
            "runtimeArgs": [
                "run-script",
                "test:debug"
            ],
            "outFiles": [],
            "protocol": "inspector",
            "sourceMaps": true,
            "port": 9229
        }
    ]
}
{% endhighlight %}

# Conclusion

I really had a good time making this project. I really love readable and compact code and with TypeScript and the async / await syntax, I really got what I asked for. My previous experience with node.js and regular old JavaScript was really bad, mostly because of the loose typing, which forces you to constantly write a lot of tedious checks on parameters. With TypeScript that is all in the past. Apart from that, the enormous amount of npm packages available, makes it very easy to find some package that does what you need. If for some reason you can’t find something, you can easily write it yourself and publish it to npm.
I always used to use Java for my backends, but the setup is always a bit of work and you have to write more boilerplate code than with TypeScript. If I make more small projects in the future, I will probably use TypeScript and Node, but for me at this point, it’s hard to tell if NodeJS will hold up in bigger projects. I would assume so, since the structure for me at this point, is very similar to Java, just a more concise syntax.