---
layout: post
authors: [dieter_hubau]
title: 'Spring Cloud Stream - A New Rick and Morty Adventure'
image: /img/spring-cloud-stream.png
tags: [Spring, Cloud, Stream, Microservices, RabbitMQ, Messaging, Reactive, Rick, Morty]
category: Spring
comments: true
---

One of the most interesting aspects of the Spring Framework and its ecosystem is **abstraction**.
The Spring project maintainers and contributors have always succeeded in hiding complexity from the application developer, by adding different layers of abstraction.

For example, the way a Spring `Bean` of a certain Interface can be autowired and how Spring will find a suitable implementation class at runtime, is a very obvious example of the [Liskov Substitution Principle](https://en.wikipedia.org/wiki/Liskov_substitution_principle){:target="_blank"} or **how to abstract away implementation from specification**.

A second, higher level example is the [Spring Data](http://projects.spring.io/spring-data/){:target="_blank"} project which offers a common programming model for SQL as well as NoSQL databases, abstracting away the specifics of the database internals.

Another great example of abstraction is one I'll be discussing in this blog post:

> Spring Cloud Stream is a framework for building message-driven microservices
> It provides an **opinionated configuration** of message brokers, introducing the concepts of persistent pub/sub semantics, consumer groups and partitions **across several middleware vendors**

That last part is what I like the most. Spring Cloud Stream abstracts away the complexity of connecting to different middleware solutions. It does this the Spring Boot way, by **autoconfiguring sensible defaults** and allowing the developer to adapt the parts he wants.

**DISCLAIMER**: this blog post will explain how Spring Cloud Stream works by using heavy references to the animated series [Rick and Morty](http://rickandmorty.wikia.com/wiki/Rickipedia){:target="_blank"}, with the intention to be hilarious and informative at the same time.
If you don't know the show, this blog post will be informative only &#128521;

