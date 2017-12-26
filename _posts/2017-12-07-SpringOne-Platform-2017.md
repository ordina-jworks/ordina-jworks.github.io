---
layout: post
authors: [tim_ysewyn, dieter_hubau]
title: 'SpringOne Platform 2017'
image: /img/springone-2017/banner.png
tags: [Spring, SpringOne Platform, Microservices, Event Sourcing, Domain-Driven Design, Spring Cloud, Spring Cloud Stream, Reactor]
category: Conference
comments: true
---

> It was a pretty last minute decision, but when my colleague Tim Ysewyn and myself got the green light to attend **Spring One Platform in sunny San Francisco**, we couldn't wait to get our hands on all the tickets and hotel reservations!
The always helpful Pieter Humphrey made sure we got conference tickets and our lovely office staff took care of the hotel. We booked our plane tickets only three weeks in advance and probably got the deal of the year at around 470 euros round-trip!

> In this blog post, we will go over some of the (major) **announcements** made at the conference and a couple of our **favorite talks**.

> **DISCLAIMER**: due to a **very** busy conference schedule, we could not include **ALL** the talks in this blogpost, not even a fraction, since there was so much good stuff to be seen. We'll provide an extensive summary of our favorite talks and create a curated list of as many talks and resources at the bottom of this post. Everything we could get our hands on!

## First impressions

As it was my first time in **San Francisco and California**, I immediately noticed the sunny weather upon arrival.
Sure feels good to walk around in a T-shirt in December, I knew this was gonna be a great trip!

**INSERT SUNNY SAN FRAN PIC HERE**

After getting to the hotel, we had to check out the downtown area.
We were staying somewhere around 7th street (*sketchy* neighbourhoods ftw!) so it was a short 10-minute walk to the **Moscone Center**.
The venue itself is very well-known and is the stage for major conferences such as Google I/O, Apple's WWDC, Oracle's OpenWorld and JavaOne conferences and also, Salesforce's Dreamforce.

So although these other conferences often have over 5000 attendees (Salesforce talks about 171,000 attendees!), one might think that the attendance of around 3000 people at SpringOnePlatform is small.
However, **SpringOnePlatform's attendance has increased to 3000 from 2000 compared to 2016**, that's simply quite amazing and shows the amount of traction Spring Boot, Spring Cloud and Pivotal Cloud Foundry are getting!

The conference content was looking very promising again, ranging from keynote sessions by various thought leaders, CxOs, vendors, partners and technology evangelists to in-depth technology sessions, workshops and success stories.
There were a crazy amount of parallel tracks so it was quite hard to see everything you wanted, but luckily, all the talks were recorded and shared on [Youtube](https://www.youtube.com/watch?v=_uB5bBsMZIk&list=PLAdzTan_eSPQ2uPeB0bByiIUMLVAhrPHL) *very* quickly.

So to kick off our recap of SpringOnePlatform, let's talk about the various, some major, announcements that were made during those four days.

## Announcements

### Pivotal Cloud Foundry 2.0

The announcement of [Pivotal Cloud Foundry 2.0](https://content.pivotal.io/announcements/pivotal-unveils-expansion-of-pivotal-cloud-foundry-and-announces-serverless-computing-product) in [Onsi Fakhouri's talk](https://youtu.be/_uB5bBsMZIk?list=PLAdzTan_eSPQ2uPeB0bByiIUMLVAhrPHL) mentioned so many new products and naming updates, it's more convenient to just link their own article than to repeat ourselves (and risk making mistakes).

<img class="image fit" src="/img/springone-2017/pcf2.jpg"/>

But here's a quick *&tldr;* for the lazy:

- Pivotal Elastic Runtime will now be called **Pivotal Application Service**
- They are now offering *managed Kubernetes as a service* in its **Pivotal Container Service or PKS**. This is running ontop of Bosh and is obviously the commercial version of Kubo, which is now officially called [Cloud Foundry Container Runtime](https://www.cloudfoundry.org/container-runtime/).
- There is a new Function-as-a-Service offering in town: [**Riff**](https://projectriff.io/) (*riff* is for functions). Workloads run on Kubernetes as containers, it has an integrated Zookeeper and Kafka to buffer and route messages to specific functions and **can scale the functions** from `0 to n` or `1 to n` (the former leaving no function instances running while the latter keeps at least one active). Pivotal will start offering this commercially as part of their platform under the clever name of **Pivotal Function Service**. We'll talk about Riff later in this post.
- Pivotal has **partnered** with a lot of big companies once again to widen their portfolio of managed services including IBM (Open Liberty, Websphere, MQ, DB2, Watson), Virtustream Enterprise Cloud and Github Enterprise to name a few.

## Cloud Native Batch Processing - Michael Minella

<span class="image left small"><img class="p-image" alt="Michael Minella" src="/img/springone-2017/michael-minella.jpg"></span>

Michael Minella ([@michaelminella](https://twitter.com/michaelminella)) is the lead of Spring Batch and a member of the Spring team.

We'll quickly go over the list of **updates in Spring Batch 4** and then we'll go over the Spring Batch processing model and we can apply it for that use case:

- Spring Batch 4.0 went **GA** on Monday 4th of December, **four years after Spring Batch 3** was released
- It has been rebased to fit in Java 8 internally (although it could be used with Java 8 before already)
- All the baselines and dependencies have been upgraded to fit together with Spring Boot 2 (no more Castor for example)
- It has **Spring 5.0 as its baseline**
- Since Spring 5 requires support for Hibernate 5, so does Spring Batch
- Many builders have been added for configuration ease
- The documentation has been upgraded a lot: they switched from Docbook to Asciidoc. Very handy feature: **every page contains a toggle to switch between Java or XML examples**

Michael had a very simple **use case** to demonstrate all the relevant capabilities Spring Batch 4 has to offer:

> Pull files from Amazon an S3 bucket and import them into a database

The application:

<img class="image fit" src="/img/springone-2017/spring-batch-usecase.png"/>

We'll highlight some of the cloud native patterns that are used in this application:

### Circuit Breaker

We don't need Netflix for a circuit breaker, there is a circuit breaker available out-of-the-box in Spring Batch, through a dependency on **Spring Retry**.
To enable it, we need to annotate our Spring Boot application with `@EnableBatchProcessing` and annotate the relevant methods with `@CircuitBreaker`.
We also have a fallback mechanism in place, we can enable these by annotating the fallback method with `@Recover`.

For very complicated error and fallback scenarios, we can obviously still use Hystrix.

### Service Discovery

We will simply use Spring Cloud Eureka

### Config Server

There are multiple approaches to using a Config Server in Spring Batch applications:

- Set the location of the Spring Cloud Config server directly in your application
- Use Spring Cloud Eureka to find different instances of the REST service + add `@LoadBalanced` on our custom `RestTemplate` bean

### Scalability

There are multiple ways to scale batch processing jobs in Spring Batch 4:

- Parallel steps
- Multithreaded steps (through chunks)
- Partitioning
- Remote chunking

In this use case, **partitioning with Spring Cloud Task** is the ideal solution.

> Spring cloud task allows you to launch batches dynamically

It usually has **one master with multiple workers**. The master stores the job in a database and the worker reads the job information from the database:

<img class="image fit" src="/img/springone-2017/spring-batch-partitioning.png"/>

In the master profile of the batch app, the StepBuilder defines the step to run, together with a `Partioner` and a `PartitionHandler`.
So it's important to define the job only in the master profile, so that the job isn’t executed again when the app is started under the worker profile.

The Partitioner understands the data and chops up the data into neat partitions.
The Partitionhandler comes from Spring Cloud Task and does the actual
In this case, the `DeployerPartitionHandler` is the part that does the magic of starting workers dynamically on the platform of choice (localhost, PCF, Kubernetes, etc) and runs them as tasks.

In the worker profile of the batch app, the configuration is almost completely identical as before, except for the added `DeployerStepExecutionHandler` which checks which step to run, and the `DownloadingStepExecutionListener` which performs the download of its specific S3 file.

There is a way to track the step execution completion of the workers:

````sql
select * from cloud_native_batch.batch_step_execution
````

Upcoming versions will support multiple partitions per worker since processing a single partition at a time isn’t that resource friendly at the moment.

### Orchestration

How do we orchestrate this kind of workflow?

**Spring Cloud Data Flow** is the de factor choice as cloud native orchestration tool for Spring microservices.
Tasks can be launched via REST, streams or on-demand.
The only minor change is to use the `@EnableTask` annotation.
The status can be tracked and will be "started", "ended", "failed", so very understandable and not Spring Batch specific.

Spring Cloud Data Flow Server is itself also a Spring Boot application.
Spring Cloud Data Flow Shell is an interactive CLI created with Spring Shell.

> Spring Batch Admin is going to the attic, Spring Cloud Data Flow is the way forward

Check out the entire [video of the talk](https://www.youtube.com/watch?v=-Icd-s2JoAw) here.

## State or Events? Which shall I keep? - Kenny Bastani & Jakub Pilimon

modeling
	Find the methods that change state
	state change -> fire event
	Use past tense to name events (eg. LimitAssigned)
	event contains subject (UUID) + changed data + timestamp

event sourcing

	dirty context: events that are pending/haven’t been saved

	functional programming: javaslang foldLeft to replay events

	recreation of state/event sourcing

	Pattern matching on different types of events

	return this after state changed, allows for easy handling of all events

kafka

	writer -> send event to topic (@EnableKafka)

	KafkaTemplate<String, DomainEvent>
	ProducerFactory<String, DomainEvent>

	ProducerConfig.BOOTSTRAP_SERVERS_CONFIG
	ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG
	ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG

	reader -> get stream of events (@EnableKafkaStreams)

	KTable (aggregate) vs KStream (stream)

	Serde<DomainEvent> domainEventSerde
	KStreamBuilder.stream(Serdes.String(), domainEventSerde, <stream_topic>)
			.group((s, domainEvent) -> )
			.aggregate(<new domainobject>, (s, domainEvent, domainObject) -> <handle domain event & return new domain object>, <snapshot_topic>)

	StreamsConfig.BOOTSTRAP_SERVERS_CONFIG
	StreamsConfig.APPLICATION_ID_CONFIG

unit testing with events

	check handling of domain event
	check if last domain event is expected

SQL correction script, what with events?

## Kafka Streams - From The Ground Up to the Cloud - Marius Bogoevici



## Spring Security 5: The Reactive Bits - Rob Winch



## Enable Authentication and Authorization with Azure Active Directory and Spring Security - Yawei Wang



## Cloud Event Driven Architectures with Spring Cloud Stream 2.0 - Oleg Zhurakousky



## Project Reactor - Now and Tomorrow - Stéphane Maldini & Simon Baslé



## What's New in Spring AMQP 2.0 - Gary Russell



## Serverless Spring - Mark Fisher & Dave Syer



## Spring Framework 5 - Hidden Gems - Juergen Hoeller

Since almost every feature was backported to 4.3, most of them are already known to the general public.
Though there are 7 areas of refinement within 5.0 that aren’t widely known to the public.

### Commons Logging Bridge

So the Spring team came up with a new dependency called spring-jcl which is actually a reimplementation of a logging bridge.
It is a required dependency and is here to help streamline the logging functionality.
The main difference with this way of working is that you don’t need to go through a dependency hell where you would manually add exclusions to ignore certain logging dependencies.
Just add the logging library to your classpath and everything will switch to the logging implementation of your choice.
It now has first class support for Log4J 2 (version 1 has reached its end of life), SLF4J and JUL.

### Build-Time Components Indexer

The file system traversal for classpath scanning of all packages within the specified base packages using either `<context:component-scan>` or `@ComponentScan` might be slow on startup.
This is especially true if your application is started for a small period of time or where I/O is very expensive.
Think short-running batch processes and functions, or applications being started and stopped on Google App Engine every 2 minutes.
The common solution was to narrow your base packages, or even to fully enumerate your component classes so you would skip scanning all together.
Starting with 5.0 there is a new build-time annotation processor that will generate a META-INF/spring.components file per jar containing all the classes which in turn will be used automatically at runtime for compatible component-scan declarations.

### Nullability

The new version contains comprehensive nullability declarations across the codebase.
Fields, method parameters and method return values are still by default non-null, but now there are individual `@Nullable` declarations for actually nullable return values for example.
For Java this means that we have nullability validation in IntelliJ IDEA and Eclipse.
This allows the Spring Team to find subtle bugs or gaps within the framework's codebase.
It will also allow us as developers to validate our interactions with the Spring APIs.
When you're writing code in Kotlin it will give you straightforward assignments to non-null variables because the Kotlin compiler will only allow assignments for APIs with clear nullability.

### Data Class Binding

Spring Data can now work with immutable classes.
No need for setters anymore since it can work with named constructor arguments!
The property names are matched against the constructor parameter names.
You can do this by explicitly using `@ConstructorProperties`, or they are simply inferred from the class bytecode (if you pass `-parameters` or `-debug` as compilation argument).
This is a perfect match with Kotlin and Lombok data classes where the getter and setters are generated at compile time.

### Programmatic Lookup via ObjectProvider

The `ObjectProvider` is a variant of `ObjectFactory`, which is designed specifically for injection points, allowing for programmatic optionality and lenient not-unique handling.
This class had the following original methods: `@Nullable getIfAvailable()` and `@Nullable getIfUnique()`.
With the new version of Spring these methods have been overloaded with `java.util.function` callbacks which empowers the developer to return a default value instead of returning `null`.

### Refined Resource Interaction

Spring's `Resource` abstraction in core.io has been overhauled to expose the NIO.2 API at application level, eg. `Resource.getReadableChannel()` or `WritableResource.getWritableChannel()`.
They are also using the NIO.2 API internally wherever possible, eg. `FileSystemResource.getInput/OutputStream()` or `FileCopyUtils.copy(File, File)`.

### Asynchronous Execution

Spring 5.0 comes with a couple of interface changes that will help you with asynchrous execution:
- The `ListenableFuture` now has a `completable()` method which exposes the instance as a JDK `CompletableFuture`.
- The `TaskScheduler` interface has new methods as an alternative to `Date` and `long` arguments: `scheduleAtFixedRate(Runnable, Instant, Duration)` and `scheduleWithFixedDelay(Runnable, Instant, Duration)`.
- The new `ScheduledTaskHolder` interface for monitoring the current tasks, eg. `ScheduledTaskRegistrar.getScheduledTasks()` and `ScheduledAnnotationBeanPostProcessor.getScheduledTasks()`.

## Continuous Deployment Made Easy with Skipper - Mark Pollack



## Breaking down monoliths into system of systems - Oliver Gierke

monolith -> microlith

monolith -> modulith -> system of systems (using messages, REST)

github.com/olivergierke/sos

- design patterns and strategies
  - in the monolith:
    - reflect bounded contexts in the packages of your app
    - inter-context interaction is process local (easy so tempting to keep doing)
    - domain classes reference each other across bounded contexts
    - order context calls inventory context directly
    - services become centers of gravity
    - it is easy to refactor
    - strong consistency across bounded contexts (eg. thanks to transactions)
    - order mgmt becomes central hub across all contexts
  - microlith: splitting up the system into smaller systems:
    - you need HTTP calls to update each other
    - unsafe, not foolproof, not easily repeatable, more error scenarios
    - marshalling / unmarshalling, networking, ...
    - add more technology to solve issues: bulkheads, retries, circuit breaker, asynchronous calls, scatter gather, ...
    - simple, local consistency is gone
    - local method invocation is transformed into RPC-ish HTTP call
    - all systems need to know all other invoked systems -> more technology (Eureka, config, ...)
    - strong focus on API contracts (REST docs, cruddy APIs, lack of hypermedia, breaking API changes)
  - modulith (restructuring your monolith):
    - let your bounded contexts fire events
    - invert the dependency between bounded contexts (dont do method invocation on other contexts, send out events)
    - you can use Spring Core ApplicationEvent or Spring Data DomainEvents with `@EventListener`
    - differences with monolith:
      - focus of domain logic has moved to aggregate
      - integration between bounded contexts is event based
      - inverted dependency between bounded contexts
  - system of systems:
    - integration options: messaging or REST
    - events are published as messages in a central message broker (Kafka, RabbitMQ)
      - this is shared infrastructure
      - needs to be built for scale
      - knows everything about all the systems
      - just like with REST, you are coupled via message serialization format
      - PRO TIP: `@JsonPath("$.product.id")` annotation for message payload
    - when using REST only (to avoid central message broker):
      - publish local events in your local API
      - client of that API polls the API for changes in events (using offsets or timestamps)
      - we consider events as part of the state of the system (HTTP resources for events)
      - collections of events should be filterable by: event type, publication time, pagination, caching, ...
      - media types: JSON, HAL, Atom Feeds even (XML)
      - the client is totally under control of the size of the consistency gap (they decide how frequently they poll)
      - events from a given bounded context stays locally in that context
      - disadvantages: bigger concistency gap, doesnt scale as good
      - testability becomes much easier, easily debuggable
    - so discussion becomes question of distributed system vs decentralized system
- bounded contexts interaction
- what kind of consistency do we require
- how do apps behave in error situations
- how can apps evolve independently
