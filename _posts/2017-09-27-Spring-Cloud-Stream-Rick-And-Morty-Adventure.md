---
layout: post
authors: [dieter_hubau]
title: 'Spring Cloud Stream - A New Rick and Morty Adventure'
image: /img/spring-cloud-stream.png
tags: [Spring, Cloud, Stream, Microservices, RabbitMQ, Messaging, Reactive, Rick, Morty]
category: Spring
comments: true
---

# Introduction

One of the most interesting aspects of the Spring Framework and its ecosystem is **abstraction**.
The Spring project maintainers and contributors have always succeeded in hiding complexity from the application developer, by adding different layers of abstraction.

For example, the way a Spring `Bean` of a certain Interface can be autowired and how Spring will find a suitable implementation class at runtime, is a very obvious example of the [Liskov Substitution Principle](https://en.wikipedia.org/wiki/Liskov_substitution_principle){:target="_blank"} or **how to abstract away implementation from specification**.

A second, higher level example is the [Spring Data](http://projects.spring.io/spring-data/){:target="_blank"} project which offers a common programming model for SQL as well as NoSQL databases, abstracting away the specifics of the database internals.

Another great example of abstraction is one I'll be discussing in this blog post.

**DISCLAIMER**: a big part of this blog post will explain how Spring Cloud Stream works by using heavy references to the animated series [Rick and Morty](http://rickandmorty.wikia.com/wiki/Rickipedia){:target="_blank"}, with the intention to be hilarious and informative at the same time.
If you don't know the show or have no sense of humor, this blog post will be informative only &#128521;

I will ignore the obvious third option: *this blog post might not be funny at all*.

# Spring Cloud Stream

I just can't start explaining something without a definition, that would be cruel and irresponsible:

> Spring Cloud Stream is a framework for building message-driven microservices
> It provides an **opinionated configuration** of message brokers, introducing the concepts of persistent pub/sub semantics, consumer groups and partitions **across several middleware vendors**

The last part is what I like the most.
Spring Cloud Stream abstracts away the complexity of connecting to different middleware solutions.
It does this *the Spring Boot way*: by **automatically configuring sensible defaults** and allowing the developer to adapt the parts he wants.

[Spring Cloud Stream](https://cloud.spring.io/spring-cloud-stream/){:target="_blank"} is a rather new project in the Spring Cloud ecosystem (first real commit was on May 28th 2015) and was initially called `spring-bus` during its prototype phase.
Dave Syer performed the commit that changed it to its current name on **July 8th 2015**, so I will call that **the birth of Spring Cloud Stream**!

The most active contributor up until now is probably Marius Bogoevici; you can follow him on [Twitter](https://twitter.com/mariusbogoevici){:target="_blank"} or ask the community in the [Spring Cloud Stream Gitter channel](https://gitter.im/spring-cloud/spring-cloud-stream){:target="_blank"}.

## Application Model

As is described in the [very detailed documentation](https://docs.spring.io/spring-cloud-stream/docs/current-SNAPSHOT/reference/htmlsingle/){:target="_blank"}, the following image details how a typical Spring Cloud Stream application is structured:

<img alt="Spring Cloud Stream application model" style="max-width: 367px" src="{{ '/img/spring-cloud-stream/application-core.png' | prepend: site.baseurl }}" class="image fit">

An application defines `Input` and `Output` channels which are injected by Spring Cloud Stream at runtime.
Through the use of so-called `Binder` implementations, the system connects these channels to external brokers.

So once again, the difficult parts are abstracted away by Spring, leaving it up to the developer to simply define the inputs and outputs of the application.
How messages are being transformed, directed, transported, received and ingested are all up to the binder implementations.

## Binder Implementations

Currently, there are official Binder implementations supported by Spring for RabbitMQ and Kafka.
Next to those, there are **several community binder implementations** available:

<img alt="Spring Cloud Stream Binders implementations" style="max-width: 367px" src="{{ '/img/spring-cloud-stream/binders.png' | prepend: site.baseurl }}" class="image fit">

The current non-exhaustive list:

* [JMS (ActiveMQ, HornetQ, IBM MQ,...)](https://github.com/spring-cloud/spring-cloud-stream-binder-jms){:target="_blank"}
* [AWS Kinesis](https://github.com/spring-cloud/spring-cloud-stream-binder-aws-kinesis){:target="_blank"}
* [Google Cloud Pub Sub](https://github.com/spring-cloud/spring-cloud-stream-binder-google-pubsub){:target="_blank"}
* [Redis](https://github.com/spring-cloud/spring-cloud-stream-binder-redis){:target="_blank"}
* [Gemfire](https://github.com/spring-cloud/spring-cloud-stream-binder-gemfire){:target="_blank"}

