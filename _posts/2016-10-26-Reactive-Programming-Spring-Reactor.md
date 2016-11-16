---
layout: post
authors: [tom_van_den_bulck]
title: 'Reactive Programming with Spring Reactor'
image: /img/reactive/reactor_logo.png
tags: [JOIN, Spring, Reactor, Java, Reactive]
category: Conferences
comments: true
---



# Overview

* [The new normal that is not new](#the-new-normal)
* [The reactive manifesto](#the-manifesto)
* [Latency](#latency)
* [Blocking](#blocking)
* [Contract](#contract)
* [Focus on Publisher](#focus-on-publisher)
* [DIY Reactive Streams](#diy-reactive-streams)
* [3 Years to Mature](#3-years)
* [Flux vs Observable](#flux-vs-observable)
* [Mono](#mono)
* [None](#none)
* [Testing](#testing)
* [Debug](#debug)
* [ParallelFlux](#parallelflux)
* [Bridge Existing Async code](#bridge)
* [Create Gateways to Flux and Mono](#gateways)
* [Optimizations](#optimizations)
* [What is Around](#what-is-around)
* [RxJava](#rxjava)
* [Spring Framework 5](#spring-5)
* [The Future](#the-future)
* [Getting Started](#getting-started)
* [Conclusion](#conclusion)
* [Sources](#sources)


<a name="the-new-normal" />

# The new normal that is not new.

It has been around for 30-40 years and boils down to [event driven programming](https://en.wikipedia.org/wiki/Event-driven_programming)
What is new is “reactive motion bound to specification”, this means that reactive programming is based on something solid, a specification and  no longer some functional concepts.
Namely the [reactive manifesto](http://www.reactivemanifesto.org/)

Because of this specification, Spring found it the right time to start with Reactor as they could now build something which would be able to work and where it was clear what people could expect.

<a name="the-manifesto" />

# The reactive Manifesto.

<p style="text-align: center;">
  <img style="max-width:640px;" alt="Reactive Systems Traits" src="/img/reactive/reactive-traits.png">
</p>

According to the manifesto, reactive systems are
* **Responsive**: respond in a timely manner if at all possible, responsiveness means that problems can be detected quickly and dealt with accordingly.
* **Resilient**: remain responsive in the event of failure, failures are contained with each component isolating components from each other.
* **Elastic**: stay responsive under varying workload, reactive systems can react to changes in the input rate by increasing or decreasing the resources allocated to services.
* **Message Driven**: rely on asynchronous message-passing to establish a boundary between components that ensures loose coupling, isolation and location transparency.
This boundary also provides the means to delegate failures as messages.

Systems built as Reactive Systems are thus more flexible, loosely-coupled and scalable, this makes them easier to develop and change.
They are significantly more tolerant of failure and when failure does occur they meet it with elegance rather than disaster.


<a name="latency" />

# Latency

Latency is a real issue, the real physical distance of various components and services becomes more important with cloud based systems.
This is also a very random number which is difficult to predict because it can depend on network congestion.
With [zipkin](https://github.com/openzipkin/zipkin), you can measure this latency.

The same latency can also exist within an application - between the different threads - although the impact will be less severe then between various components.

Something needs to be done when latency becomes too big of an issue, especially if the receiver can not process enough.
Too much data will fill up the buffer and can result, with an unbounded queue, to the infamous [OutOfMemoryException()](https://docs.oracle.com/javase/8/docs/api/java/lang/OutOfMemoryError.html)
While with a circular buffer you will not go out of memory, but this implies that you will lose some messages as the oldest on get overwritten.

<a name="blocking" />

# Blocking

One way to prevent out of memory exceptions is to use blocking.

<p style="text-align: left;">
  <img style="max-width:120px;"  alt="poison pill" src="/img/reactive/poison-icon.png">
</p>
But this can be a real poison pill: when a queue is full it will block a thread, as more and more queues get blocked your server will die a slow death.


Blocking is faster and more performant, than reactive, but reactive will allow for more concurrency
Which is important if you have a micro-service based architecture, as there you typically need to be more careful and more exact when allocating resources between services

As in, by being more concurrent you can save a lot of money when using cloud and microservices.

<a name ="contract" />

# Contract

Reactive is non-blocking and messages will never overflow the queue, see for the standard definition [http://www.reactive-streams.org/](http://www.reactive-streams.org/).
>Created by Pivotal, Typesafe, Netflix, Oracle, Red Hat and others.

The scope of Reactive Streams is to find a minimal set of interfaces, methods and protocols that will describe the necessary operations and entities to achieve the goal—asynchronous streams of data with non-blocking back pressure.
Has been adopter for java 9.

<p style="text-align: center;">
  <img style="max-width: 640px;"  alt="reactive contract" src="/img/reactive/reactive-contract.png">
</p>

This contract defines to send data 0 .. N
[Publisher](http://www.reactive-streams.org/reactive-streams-1.0.0-javadoc/org/reactivestreams/Publisher.html) is an Interface with a subscribe() method.
Once you subscribe a [Subscriber](http://www.reactive-streams.org/reactive-streams-1.0.0-javadoc/org/reactivestreams/Subscriber.html), the subscriber has 4 call back methods:
onSubscribe(), onNext() - which can be called 0 to N times, onComplete() and onError().
The 2 last signals (complete and error) are terminal states, no further signals may occur and the subscriber's subscription is considered cancelled.

What is important is the reverse flow, back pressure.
After subscribing the subscriber gets a subscription which is a kind of 1 on 1 relationship between the subscriber and the publisher with 2 methods; 'request' and 'cancel'.
* Cancel: the subscription is being cancelled.
* Request: this is the more important one, with this method the subscriber will ask the publisher to send me x messages (and not more), a so called 'pull'.

<a name="focus-on-publisher" />

# Focus on Publisher

Spring Reactor focuses on the publisher side of the reactive streaming, as this is the hardest to implement, to get right.

Reactor Core provides a minimalist set of Reactive Streams ready generators and transformers.


More info on publisher

<a name="diy-reactive-streams" />

# DIY Reactive Streams

It is very hard to do, for Stephane Maldini this is the 4th or 5th attempt, for Davik Karnok, the theck lead of RxJava it is attempt 7 or 8.
The main difficulty is to make it side effect free.


Get examples of side effects (most of them thread- and state-related I think)


Add code sample Publisher<User> rick = userRepository.findUser(“rick”);
Note that a publisher is returned instead of directly returning the entity. By doing so it doesn’t block and the publisher will produce the user when ready.
Might produce 0,1 or N users.


You will also have to implement a subscriber to define the action to perform when the result is available.
rick.subscribe(new Subscriber<User>(){...});
Callback to start, result, error or complete.


This is not really practical to work with, as most of the time we are only interested in a single user and not a stream of multiple results.


Another issue is that you can only subscribe on the publisher, there are no other methods available like map, flatmap, … add links to map and flatmap


When designing your own API you will have to deal with the following issues:
* Should work with RS TCK (otherwise it might not work with other libraries as well)
* Address reentrance
* Address thread safety
* Address efficiency
* Address state
* For Many-To-One flows, implement your own merging operation
* For One-To-Many flows, implement your own broadcasting operation
* …


> This is all very hard to do yourself.

<a name="3-years"/>

# 3 Years to Mature

It took Spring Reactor 3 years to mature.
<p style="text-align: center;">
  <img alt="Spring Reactor Timeline" src="/img/reactive/spring-reactor-timeline.png">
</p>

2.0 was not side effect free - also existential questions were raised around the project, at the same time Spring evolved, microservices became the norm.


Spring needs to be nice with these microservices, concurrency is important, can Reactor not be used for that?


With 3.0 the team wanted to focus on microservices, take some ideas from [netflix oss](https://netflix.github.io/)
 and implement these in a pragmatic way.


Actually reactor 3 was started as 2.5, but so many new features were added that the version had to be changed as well in order to reflect this.


Since 3.0 Spring Reactor has received some extra components:
<p style="text-align: center;">
  <img alt="Spring Reactor Components" src="/img/reactive/spring-reactor-components.png">
</p>

* [Core](https://github.com/reactor/reactor-core) is the main library.


* [IPC](https://github.com/reactor/reactor-ipc): backpressure-ready components to encode, decode, send (unicast, multicast or request/response) and serve connections.
Here you will find support for kafka (https://kafka.apache.org/) and netty (http://netty.io/)


* [Addons](https://github.com/reactor/reactor-addons): Bridge to RxJava 1 or 2 Observable, Completable, Flowable, Single, Maybe, Scheduler, and also Swing/SWT Scheduler, Akka Scheduler.


* [Reactive Streams Commons](https://github.com/reactor/reactive-streams-commons ) is the research project between Spring Reactor and RxJava as both teams had a lot of ideas they wanted to implement.

Lots of effort was put in order to create real working, side-effect free operations.
Map and Filtering for example are easy, but mergings, like Flatmap are hard to implement side-effect free.
Having a proper implementation in this research project for these operations allowed the team to experiment and make it quite robust.


This project contains Reactive-Streams compliant operators, which in turn are implemented by Spring Reactor and RxJava


They are very happy with this collaboration and this is still continuing.
When a bugs gets fixed in Spring Reactor it will also be fixed in RxJava and vice versa.


Everything in Reactor is just reactive streams implementation - which is used for the reactive [story](https://spring.io/blog/2016/07/28/reactive-programming-with-spring-5-0-m1) of spring 5.



There also exists an [Reactor Core .NET](https://github.com/reactor/reactor-core-dotnet) and [Reactor Core TypeScript](https://github.com/reactor/reactor-core-js).

<a name = "flux-vs-observable" />

# Flux vs Observable
<p style="text-align: center;">
  <img alt="a Flux" src="/img/reactive/flux.png">
</p>

The Observable of RxJava contained too much noise, partly because it is currently stuck with JDK6 - while the people from Spring Reactor could go all in with java 8.

<a name="mono"/>

# Mono
<p style="text-align: center;">
  <img alt="a Mono" src="/img/reactive/mono.png">
</p>
With Mono only a single item will be returned.


<a name="none"/>

# None

Add code example of None
None is like a flux, but will return at most 1 result.
More info needed

<a name="testing"/>

# Testing

Testing (block() )
Add code examples of block()
Never use this in production - it is good for testing though.
More info needed

<a name="debug"/>

# Debug
Debug mode is provided, normal debug is hard and a pain in the ass - recursive code folly / stacktraces
You can activate debugging in code: then you will get the exact operation which failed
Hooks.onOperator(op -> op.operatorStacktrace());
Capture stack for each operator declared after

<a name="parallelflux"/>

# ParallelFlux

ParallelFlux: avoids to write flatMap, sequential() instead of flatmap() - can remain on the same indentation level - easier to read code
Can be used to Starve CPU’s
With .parallel(...) and .sequential();
Instead of using flatMap


This is very performant, with parallel Reactor is very close to the bare metal of what the JVM can do as you can see in the below comparisation:

<p style="text-align: center;">
  <img alt="benchmarks" src="/img/reactive/performance-shakespeare.jpg">
</p>
[src](https://twitter.com/akarnokd/status/780135681897197568)


<a name="bridge" />

# Bridge Existing Async code
Bridge Existing Async code with Listeners
```
Mono.create( sink -> {... sink.success() and sink.error()...})
```

If you add a Kafka call, for example, where they add this callback so one can return onSuccess and onError


Also exists for Flux of N items but it’s tougher and more dangerous.
You must explicitly indicate what to do in the case of overflow; keep the latest, keep everything with the risk of unbounded memory use.

<a name="gateways" />

# Create Gateways to Flux and Mono

<a name="optimizations" />

# Optimizations
Operation fusion: Reactor has a mission to limit the overhead in stack and message passing.
The distinguish 2 types:
Macro Fusion: Merge operators in one during assembly time, for example, if the user does .merge - .merge - .merge spring reactor is smart enough to put this in a single merge


Micro Fusion: Because of the Reactive specification and the asynchronous nature of the response queues are heavily used, but creating a queue for every request/response is very costly.
Spring Reactor will avoid to create a queues whenever possible and short circuit during the lifecycle of the request. They are going to merge the queue from downstream with the one from upstream - hence the name fusion.
If the parent is something we can pull (an Iterable or a queue) then Reactor is going to use the parent as a queue, thus avoiding to create a new queue.
This is very smart to do - but also very complicated to do yourself, but because Spring Reactor has this in place you do not have to deal with this hassle..

<a name="what-is-around" />

# What is Around

Reactor: a Simpler API.
The entire framework just fits in 1 jar: reactor-core jar.
Flux and Mono live in the reactor.com.publisher package.
Reactor.core.scheduler contains the FIFO task executor.


By default the Publisher and Subscriber will use the same thread.
With publishOn() the publisher can force the subscriber to use a different thread, while the subscriber can do the same with subscribeOn().


For Reactor 3.x there will be more focus on the [javadoc](http://projectreactor.io/core/docs/api).

<a name="rxjava" />

# RxJava

Why Reactor when there’s already RxJava2?
Java 6 vs Java 8
Do I need all the cardinality they expose?
Am I going to use a Spring 5 application
Check last two columns of Non blocking and RS types around screenshot

<a name="spring-5" />

# Spring Framework 5

Spring Framework 5
Spring Framework 5 :
Functional support
Try to have an ok learning curve
Backwards compatibility
Just upgrade, everything still works
For new stuff using Spring Web Reactive instead of Spring Web MVC, Reactive HTTP instead of Servlet API and Servlet 3.1, Netto and Undertow instead of Servlet Container
Annotations are very similar
See screenshots

<a name="the-future" />

# The Future
Reactor Ecosystem roadmap
Include screenshot of roadmap

<a name="getting-started" />

# Getting Started
Read some interesting blog posts on [spring.io](https://spring.io/)


- [reactive-programming-part-I](https://spring.io/blog/2016/06/07/notes-on-reactive-programming-part-i-the-reactive-landscape)
Providing you with a clear description of what reactive programming is about and its use cases.
But also the different ways about how people have implemented reactive programming (actor model, futures, … ) and more specifially the different frameworks which implement reactive programming in java. (Spring Reactor (https://projectreactor.io/) , Spring Framework 5 (http://projects.spring.io/spring-framework/) , RxJava (https://github.com/ReactiveX/RxJava/wiki) , Akka (http://akka.io/) , Reactive Streams (http://www.reactive-streams.org/) and Ratpack (https://ratpack.io/)  )


- [reactive-programming-part-II](https://spring.io/blog/2016/06/13/notes-on-reactive-programming-part-ii-writing-some-code)
You will learn the API by writing some code, how to control the flow of data and its processing.


- [reactive-programming-part-III](https://spring.io/blog/2016/07/20/notes-on-reactive-programming-part-iii-a-simple-http-server-application)
Here you will focus on more concrete use case and write something useful, but also on some low level features which you should learn to treat with respect.


<a name="conclusion" />

# Conclusion

<a name="sources" />

# Sources

https://spring.io/blog/2016/04/19/understanding-reactive-types
https://github.com/reactor/lite-rx-api-hands-on
https://spring.io/blog/2016/06/07/notes-on-reactive-programming-part-i-the-reactive-landscape
https://spring.io/blog/2016/06/13/notes-on-reactive-programming-part-ii-writing-some-code
https://spring.io/blog/2016/07/20/notes-on-reactive-programming-part-iii-a-simple-http-server-application
http://projectreactor.io/core/docs/api
http://www.slideshare.net/StphaneMaldini/reactor-30-a-reactive-foundation-for-java-8-and-spring

https://www.youtube.com/watch?v=RU0yQhfybDg























