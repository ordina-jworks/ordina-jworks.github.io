---
layout: post
authors: [matthias_caryn]
title: 'Spring IO 2017: The Spring Ecosystem'
image: /img/spring.png
tags: [Spring, Ecosystem, Cloud, Conference]
category: Spring
comments: true
---


> When I was at Spring IO back in May, I was intrigued by a presentation given by Jeroen Sterken.
There he talked about the Spring Ecosystem in 50 minutes.
Since he only had 50 minutes, he could not focus on all the projects Spring boasts.
I wanted to get a feel of what the Spring team has to offer in all its glory, by getting to know all of the main projects.

<span class="image left small"><img class="p-image" alt="Jeroen Sterken" src="/img/spring-ecosystem/jeroen-sterken.jpg"></span>

Jeroen Sterken ([@jeroensterken](https://twitter.com/jeroensterken)) is a Java and Spring consultant from Belgium. He's a certified Spring instructor and currently employed at Faros Belgium. His slides of his talk _The Spring Ecosystem in 50 minutes_ can be found [here](https://www.slideshare.net/JeroenSterken1/the-spring-ecosystem-in-50-min).

# The Spring Ecosystem

There are many ways to divide the Spring portfolio.
One way could be based on architecture, another way could be based on popularity. Jeroen divided the Spring Ecosystem in three categories: [classic](#classic), [popular](#popular) and [other](#other).

Before we dive into the Spring ecosystem, let's take a look at which projects our own JWorks unit have been using the most over the past two years. Here's the JWorks top 10, beside the Spring Framework.
<div class="row" style="margin: 0 auto 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spring-ecosystem/spring-top-10.png" alt="JWorks Top 10 projects" title="JWorks Top 10 projects"%}
</div>
</div>

Spring Boot is currently at the top. Other notable mentions are Spring Session, Spring Social and Spring Cloud Data Flow.
But what's even more interesting are the Spring projects that aren't that widely used: Spring Mobile, Spring for Android, Spring Kafka, Spring Statemachine, Spring Shell, Spring Flo and Spring XD.

# Classic

The classic projects are showing a range of the many beloved portfolio projects, where for instance Spring Security and its LDAP module will help you build your secure applications at ease.
Or where the Spring IO platform will show you the insights in its development.

<div class="row" style="margin: 0 auto 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spring-ecosystem/spring-classic.png" alt="Classic projects" title="Classic projects"%}
</div>
</div>

## Spring Framework

<span class="image left small"><img class="p-image" alt="Spring Framework" src="/img/spring-ecosystem/spring-framework.png"></span>

The core of Spring, currently at its fifth revision.
It provides key components for dependency injection, web apps, transaction management, testing, messaging, model-view-controller, remote access, data access and more.
Just add the modules you need and start programming.
In the fifth version, the focus lays on reactive programming with reactive streams, as well as other features and revisions like support for JUnit 5.
Spring 5 will require at least JDK 8 but is already being built continuously on JDK 9.
The release is planned for the end of the year, regardless whether Java 9 is released or not.

## Spring IO Platform

<span class="image right small"><img class="p-image" alt="Spring IO Platform" src="/img/spring-ecosystem/spring-io-platform.png"></span>

The Spring IO Platform is built on Spring Boot and is mainly used in combination with a dependency management system.
It provides dependencies that work well together.
It's basically a library on the classpath of your application which gives developers production-ready features.
It does this by providing a bill-of-material Maven artifact.
The libraries used in the BOM file are all curated and normalized, so they work greatly together.
But if that is not to your liking, you can easily just use your own versions.
The platform supports JDK 7 and 8 and is still being updated frequently.

## Spring Security

<span class="image left small"><img class="p-image" alt="Spring Security" src="/img/spring-ecosystem/spring-security.png"></span>

Nowadays you can't ignore problems of security failures and the importance of privacy.
Spring Security provides your application with authentication and authorization.
It will also protect your application against a handful of possible attacks.
Spring Security supports many popular authentication protocols and services like OpenID, LDAP, HTTP, … and support is extended through the available third party modules.
The fifth version of Spring Security will add OAuth 2.0 support.

## Spring LDAP

<span class="image right small"><img class="p-image" alt="Spring LDAP" src="/img/spring-ecosystem/spring-ldap.png"></span>

Spring LDAP hides a lot of the boilerplate code for LDAP interactions.
It makes sure all the connections are created and correctly closed.
This library helps out with the looping through the results and filtering those.
It's also possible to manage your transactions with a client-side transaction manager.
If you're working with this Lightweight Data Access Protocol, this might definitely be worth your while.

## Spring Integration

<span class="image left small"><img class="p-image" alt="Spring Integration" src="/img/spring-ecosystem/spring-integration.png"></span>

When an architecture revolves around events or messages, you can get the help of Spring Integration.
This project focuses on the implementation of Enterprise Integration patterns.
When you want to send something from point A to point B, there could be a lot of different network protocols or restrictions in between.
Spring Integration minimizes the boilerplate code needed by implementing those patterns.
It just makes it easy to send events and messages throughout different endpoints.

## Spring Batch

<span class="image right small"><img class="p-image" alt="Spring Batch" src="/img/spring-ecosystem/spring-batch.png"></span>

With Spring Batch it is possible to write an offline batch application using Java and Spring.
It makes it very convenient when you're used to the Spring Framework to execute a bunch of jobs.
It features a possibility to read and write your resource and a way of dividing data for processing and much more.
There is also support for a transaction manager, job processing statistics, job status changes and much more.

## Spring Web Flow

<span class="image left small"><img class="p-image" alt="Spring Web Flow" src="/img/spring-ecosystem/spring-web-flow.png"></span>

The Spring Web Flow was created to help users navigate through the different views of a stateful web application.
A common example could be when shopping online.
The process has a clear starting and finishing view, but in between, it can change state or views dynamically.
Through guided navigations, the user makes changes and it should register those changes as well as the possibility to finalize those changes through a confirmation.
All this is possible with Spring Web Flow.
Although this project is listed with the main projects, there hasn't been any progress over the last years, and will be removed when Spring 5 hits the shelves.

## Spring Web Services

<span class="image right small"><img class="p-image" alt="Spring Web Services" src="/img/spring-ecosystem/spring-web-services.png"></span>

There are several ways to develop a web service, one of which is used in combination with SOAP.
Spring Web Services helps with creating contract-first SOAP web services which are flexible by manipulating the XML contents.
But due to the popularity of the architectural style of REST, the interest in SOAP has diminished.
This is noticeable in the maintenance of this Spring project which hasn't had any significant version updates.
Version 2.4.0 was released on August 26th 2016 and only brought some CI jobs that are built for every commit for Spring 4.2, 4.3, and 5.0.

# Popular

When you look at modern applications and their infrastructure, you'll see the power of the Spring portfolio coming to its use.
With the easy of use of Spring Boot, you can quickly start the development of a secure application and use Spring Cloud to help you with the deployment and integration for your online service provider.

<div class="row" style="margin: 0 auto 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spring-ecosystem/spring-popular.png" alt="Popular projects" title="Popular projects"%}
</div>
</div>

A modern application might look like this:

<div class="row" style="margin: 0 auto 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spring-ecosystem/modern-application.png" alt="Modern application" title="Modern application"%}
</div>
</div>

## Spring Boot

<span class="image left small"><img class="p-image" alt="Spring Boot" src="/img/spring-ecosystem/spring-boot.png"></span>

Being built onto the Spring Framework, the popular Spring Boot project provides an easy to use way for creating stand-alone Spring applications without code generation and configuration of XML files.
If you want to get started quickly without too much hassle, Spring Boot is the way to go by adding the dependencies you need.
Spring Beans don't need to be defined in XML or Java, as they are mostly configured automatically by Spring Boot.
This way, there is no need to find and configure libraries for your specific Spring version, Spring Boot tries to do that for you.
However, if you wish, you can fine-tune the auto-configuration to your own needs by adding the library to the classpath of the application, setting some properties, or adding some annotations.
When you want to deploy your Spring Boot application, there's no need to build a WAR file, since you can build self-contained JAR files with an embedded servlet container such as Jetty, Tomcat or Undertow.
Spring Boot also features a command line tool for quick prototyping with Spring.
The easiest way to get started with Spring Boot is to go to the [Spring Initializr](https://start.spring.io/) and add the dependencies to the project.
The Spring team is maintaining the Spring Boot project regularly as it's becoming the de facto way of using Spring.

## Spring Cloud

<span class="image right small"><img class="p-image" alt="Spring Cloud" src="/img/spring-ecosystem/spring-cloud.png"></span>

Spring Cloud is an umbrella project which lets you build distributed systems by implementing many best practice patterns.
It consists out of many sub-projects.
With the use of Spring Cloud Config Server you can setup a server with a repository, like Git, as its data store and view the changes made in the configuration.
Spring Cloud Contract allows you to write Consumer Driven Contract Tests with ease.
Many of the Netflix OSS components are wrapped into Spring Cloud, which makes it a lot easier to deal with the complexity of microservice architectures.
And of course with a cloud service there's often a lot of security involved which is provided by the Spring Cloud Security.
You can easily integrate this with Amazon Web Services or Cloud Foundry, through their related subprojects.
Spring Cloud Security is build on OAuth2 and Spring Boot which provides single sign-on, token relay and token exchange.
One of the latest projects in the Spring Cloud umbrella is Spring Cloud Function.
It offers an extreme convention-over-configuration approach which can leverage all of Spring Boot's capabilities while writing only a single function.
The full list of sub-projects are available [here](https://cloud.spring.io/spring-cloud-aws).

## Spring Cloud Data Flow

<span class="image left small"><img class="p-image" alt="Spring Cloud Data Flow" src="/img/spring-ecosystem/spring-cloud-data-flow.png"></span>

Spring Cloud Data Flow used to be know as Spring XD and is part of Spring Cloud.
It's an updated and revised toolkit for cloud-native message-driven microservices.
The change was made by the Spring team after their experience with Spring Boot.
Spring Cloud Data Flow is suitable for processing, analyzing and predicting data.
Through streaming it can consume data from an HTTP endpoint and writes the payloads to a database of your choice.
It also manages to scale the data pipelines to your liking without any interruptions.
After development, an application can be easily executed in Cloud Foundry, Apache YARN, Kubernetes or Apache Mesos, but with the Service Provider Interface you can deploy your application to other runtimes.

## Spring Data

<span class="image right small"><img class="p-image" alt="Spring Data" src="/img/spring-ecosystem/spring-data.png"></span>

Whether you're working with relational or non-relational databases, Spring Data will soothe your needs.
As an umbrella project it will ease your way into data access.
It abstracts the complexity of data access layers by allowing the developer to simply extend an interface.
Some of the related sub-projects will help you develop quicker for your favorite database, like Spring Data Mongodb, Spring Data JPA, Spring Data for Apache Cassandra or Spring Data for Apache Solr.
And through the help of some community modules this is extended to several others.
With Spring Data REST you can expose your Spring Data repository automatically as a REST resource.
As usual with Spring projects, they provide an excellent base but can be customised to your own needs.
A full list of sub-projects and community projects are available [here](http://projects.spring.io/spring-data).

## Spring HATEOAS

<span class="image left small"><img class="p-image" alt="Spring HATEOAS" src="/img/spring-ecosystem/spring-hateoas.png"></span>

HATEOAS stands for Hypermedia As The Engine Of Application State.
It enables the server to update its functionality by decoupling the server and client.
With Spring HATEOAS it's easy to create a REST resource implementation using the HATEOAS as an underlying principle.
It helps the client by returning a response in combination with more information on what to do next.
If the state of the resource changes, the information on the next steps will also vary throughout the application.
As this is a subconstraint one of the core principles of REST, the uniform interface, using Spring HATEOAS you can achieve 'the glory of REST'.


## Spring REST Docs

<span class="image right small"><img class="p-image" alt="Spring REST Docs" src="/img/spring-ecosystem/spring-rest-docs.png"></span>

When you develop a RESTful service, you'll probably want to document it so it's easy for other developers to implement your API.
Spring REST Docs helps you with the documentation process to make it more accurate and readable.
It does this by running integration tests, which generate guaranteed up-to-date request and response snippets when those tests succeed.
Those snippets can be included in Asciidoctor templates, which are then converted to HTML output.
Alternatively it can be configured to use Markdown.
The advantage here is that the documentation is always up-to-date with your code, since the integration tests will fail otherwise.
There are also options for you to customize the layout of the documentation.
A more in-depth look at Spring REST Docs was presented at Spring IO 2016 by JWorks colleague Andreas Evers: [_Writing Comprehensive and Guaranteed Up-to-date REST API Documentation_](https://speakerdeck.com/andreasevers/writing-comprehensive-and-guaranteed-up-to-date-rest-api-documentation-springone-platform-2016).


## Spring Social

<span class="image left small"><img class="p-image" alt="Spring Social" src="/img/spring-ecosystem/spring-social.png"></span>

Spring Social lets you connect your application with Facebook, Twitter and LinkedIn.
But through its many community projects it's possible to connect to dozens other like Google, Instagram, Pinterest, …
The full list is of supported third-party APIs is available [here](http://projects.spring.io/spring-social)

## Spring Session

<span class="image right small"><img class="p-image" alt="Spring Session" src="/img/spring-ecosystem/spring-session.png"></span>

When someone uses your web application, they will be using an HTTP session underneath.
Spring Session allows you to manage those sessions separately, outside of the servlet container.
It supports multiple sessions at once and can even send the sessions in the header.
Spring sessions isn't specifically tied to any container.
Although the project is quite popular and has very interesting features, the project hasn't had any major changes over the past year.


# Other

These projects are mainly focused on one specific (niche) part of an application.
Some wil help you with the development of specific front-end applications, while others will help you implement specific patterns.

<div class="row" style="margin: 0 auto 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spring-ecosystem/spring-other.png" alt="Other projects" title="Other projects"%}
</div>
</div>

## Spring AMQP

<span class="image left small"><img class="p-image" alt="Spring AMQP" src="/img/spring-ecosystem/spring-amqp.png"></span>

AMQP is an abbreviation for Advanced Messaging Query Protocol which Spring AMQP implements.
It helps you with routing, queuing, exchanging and bindings.
Additionally, there's a listener available when sending messages asynchronously.
Spring AMQP also provides a template service for sending and receiving messages.
In the upcoming second version of Spring AMQP it uses version 4.0.x of the library which has been developed by RabbitMQ.

## Spring Mobile

<span class="image right small"><img class="p-image" alt="Spring Mobile" src="/img/spring-ecosystem/spring-mobile.png"></span>

Spring Mobile is the Spring team's attempt at making it easier to develop mobile web applications with the use of Spring MVC.
Spring Mobile implements a way of detecting the type of the device used to view the url and tries to adjust its view accordingly.
Unfortunately the project isn't that well maintained as significant updates are several years ago.

## Spring for Android

<span class="image left small"><img class="p-image" alt="Spring for Android" src="/img/spring-ecosystem/spring-for-android.png"></span>

Another project without any recent updates is Spring for Android
Spring for Android brings some of the key benefits of using Spring to Google's mobile operating system, Android.
It has a REST API client for Android with authentication support.
For your social media authentication, you can use Spring Social in conjunction with Spring for Android.
But there's no use of Spring's dependency injection, transaction manager or some other useful Spring features.

## Spring Shell

<span class="image right small"><img class="p-image" alt="Spring Shell" src="/img/spring-ecosystem/spring-shell.png"></span>

The Spring team provided a way for building command-line applications.
Through the use of Spring you could build a full-featured shell application with your very own commands or just use the default commands that are already implemented.
Or you could get access to an exposed REST API.
The Spring Shell hasn't been updated with new functionality in more than 3 years.

## Spring XD

<span class="image left small"><img class="p-image" alt="Spring XD" src="/img/spring-ecosystem/spring-xd.png"></span>

Spring XD is the predecessor of Spring Cloud Data Flow and therefore hasn't been maintained.
End of support will be in July 2017.

## Spring Flo

<span class="image right small"><img class="p-image" alt="Spring Flo" src="/img/spring-ecosystem/spring-flo.png"></span>

This JavaScript library was a foundation for the stream builder in Spring Cloud Data Flow.
It provides a basic embeddable HTML5 visual builder.
Spring Flo is especially focused on pipelines and simple graphs.
It's built using Grunt where the commands can be ran directly or indirectly through Maven.
With the use of a drag and drop interface it's easy to create real-time streaming and batch pipelines.
Additionally you can also choose to use the shell instead of the GUI interface.

## Spring Kafka

<span class="image left small"><img class="p-image" alt="Spring Kafka" src="/img/spring-ecosystem/spring-kafka.png"></span>

This is Spring for Apache Kafka, an open-source streaming processing platform.
Spring Kafka provides an interface for sending messages for Kafka-based applications.
It also supports a listener container and a way of sending message-driven POJOs.

## Spring Statemachine

<span class="image right small"><img class="p-image" alt="Spring Statemachine" src="/img/spring-ecosystem/spring-statemachine.png"></span>

Some applications may require state machine concepts being implemented.
Spring Statemachine provides a framework that helps with that.
It provides a lot of useful things for making complex configuration easy, but also provides listener states and much more.

## Spring Roo

Spring Roo gives you the possibility to easily build full Java applications.
This is a tool for rapid development of Java applications that are fully written in Java.
It is focused on using the new Spring projects, like Spring Boot and Spring Data, as well as other common Java technologies.
However, since the introduction of Spring Boot, Spring Roo has become less of a necessity, as Spring Boot hides a lot of the boilerplate code Spring Roo was designed to generate.

## Spring Scala

When developing applications in Scala, you can make use of Spring through Spring Scala, a community project.
This brings a lot of Spring technologies to the Scala programming language.
This is one of the two presented community projects by the Spring team on their main project page, the other one being Spring Roo.
