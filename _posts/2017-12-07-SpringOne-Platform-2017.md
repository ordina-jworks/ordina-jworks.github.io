---
layout: post
authors: [tim_ysewyn, dieter_hubau]
title: 'SpringOne Platform 2017'
image: /img/springone-2017/banner.png
tags: [Spring, SpringOne Platform, Microservices, Event Sourcing, Domain-Driven Design, Spring Cloud, Spring Cloud Stream, Reactor]
category: Conference
comments: true
---

## First impressions



## Announcements



## Cloud Native Batch Processing - Michael Minella



## State or Events? Which shall I keep? - Kenny Bastani & Jakub Pilimon



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
You can do this by explicitly using `@ConstructorProperties`, or they are simply inferred from the class bytecode (if you pass `-parameters` or `-debug` as compilation argument)
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


