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

<img class="image fit" href="//img/springone-2017/pcf2.jpg"></img>

But here's a quick *&tldr;* for the lazy:

- Pivotal Elastic Runtime will now be called **Pivotal Application Service**
- They are now offering *managed Kubernetes as a service* in its **Pivotal Container Service or PKS**. This is running ontop of Bosh and is obviously the commercial version of Kubo, which is now officially called [Cloud Foundry Container Runtime](https://www.cloudfoundry.org/container-runtime/).
- There is a new Function-as-a-Service offering in town: [**Riff**](https://projectriff.io/) (*riff* is for functions). Workloads run on Kubernetes as containers, it has an integrated Zookeeper and Kafka to buffer and route messages to specific functions and **can scale the functions** from `0 to n` or `1 to n` (the former leaving no function instances running while the latter keeps at least one active). Pivotal will start offering this commercially as part of their platform under the clever name of **Pivotal Function Service**. We'll talk about Riff later in this post.
- Pivotal has **partnered** with a lot of big companies once again to widen their portfolio of managed services including IBM (Open Liberty, Websphere, MQ, DB2, Watson), Virtustream Enterprise Cloud and Github Enterprise to name a few.

## Cloud Native Batch Processing - Michael Minella

**INSERT MICHAEL MINELLA BIO HERE**

usecase: take files from amazon s3, import them to database
spring batch processing model, contains basic batch functionality
Spring batch 4.0
	GA monday 04/12/17, 4 years between 3 & 4
	rebased for java 8
	upgraded all the things
	spring 5.0 as baseline
	hibernate 5
	added builders for configuration ease
	documentation upgraded: docbook -> asccidoc & XML + java examples with toggle on top of the pages

S3JDBC job, single step load, 3 components: FlatFileItemReader, JdbcBatchItemWriter, EnrichmentItemProcessor + REST service outside application

@EnableBatchProcessing

circuit breaker pattern out of the box, spring retry
@Recover on fallback method + @CircuitBreaker on implementation method

multiple approaches for config
	Spring Cloud Config (application)
	Spring Cloud Eureka (REST service): @EnableDiscoveryClient(autoRegister = false) + @LoadBalanced on custom RestTemplate bean

How do we scale the batch processing?

1. parallel steps
2. multithreaded steps (chunks)
3. partitioning
4. remote chunking

partitioning via spring cloud task
spring cloud task allows you to launch batches dynamically
1 master, multiple workers
master stores job in database, worker reads job from database
stepbuilder -> partitioner understand the data, partitionhandler comes from spring cloud task
DeployerPartitionHandler starts worker dynamically on platform (local, PCF, Kubernetes,... implementations)

DeployerStepExecutionHandler

select * from cloud_native_batch.batch_step_execution -> track step executions completion
define job in master, so that the job isn’t executed again when the worker is started

upcoming versions: single partition at a time isn’t that resource friendly -> multiple partitions per worker

large files? chop files in multiple parts, or use a staging table
if a worker fails, step execution status is saved to database -> only restart failed executions
direct access to database is an anti-pattern, but spring batch resides in the grey zone

how do we orchestrate this?
spring cloud data flow -> cloud native orchestration tool for microservices
	launch via REST, streams or on-demand

only 1 minor change -> @EnableTask
	track status: started, ended, failed,... (not spring batch specific)

spring cloud data flow server = spring boot application
spring cloud data flow shell = interactive CLI

spring batch admin is going to the attic, spring cloud data flow is the way forward
scheduling within dataflow -> spring cloud task launch, PCF, Kubernetes

restart vs relaunch?

no dependency on spring cloud data flow server: spring batch will launch the workers & will be visualised by spring cloud data flow server

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
