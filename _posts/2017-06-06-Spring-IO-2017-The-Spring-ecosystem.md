---
layout: post
authors: [matthias_caryn]
title: 'Spring IO 2017: The Spring Ecosystem'
image: /img/spring-ecosystem/springEcosystemHeaderImageJPG.jpg
tags: [Spring, Ecosystem, Cloud, Conference]
category: Spring
comments: true
---


> When I was at Spring IO back in May, I was intrigued by a presentation given by Jeroen Sterkens. 
There he talked about the Spring Ecosystem in 50 minutes. 
As only having 50 minutes, he could not focus on all the projects and I wanted to get a feel what Pivotal Software has to offer in all its glory by getting to know all the main projects.

<span class="image left small"><img class="p-image" alt="Jeroen Sterken" src="/img/spring-ecosystem/jeroen-sterken.jpg"></span>

Jeroen Sterken ([@jeroensterken](https://twitter.com/jeroensterken)) is a Java and Spring consultant from Belgium. He's a certified Spring instructor. He currently works at Faros Belgium. His slides of his talk _The Spring Ecosystem in 50 minutes_ can be found [here](https://www.slideshare.net/JeroenSterken1/the-spring-ecosystem-in-50-min).

# The Spring Ecosystem

There are many ways to divide the Spring Portfolio. 
One way is a more architectural way, but Jeroen divided the Spring Ecosystem in three categories: [Classic](#classic), [popular](#popular) and [other](#other).


# Classic

The classic projects are showing a range of the many beloved portfolio projects, where Spring Security and its LDAP module will help you build your secure applications at ease. 
Or where the Spring IO platform will show you the insights in its development.

<div class="row" style="margin: 0 auto 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spring-ecosystem/spring-classic.png" alt="Classic projects" title="Classic projects"%}
</div>
</div>

## Spring Framework

<span class="image left small"><img class="p-image" alt="Spring Framework" src="/img/spring-ecosystem/spring-framework.png"></span>

The framework that started it all and currently its fifth revision is in the works. 
It provides key components for dependency injection, web apps, transaction management, testing, messaging, model-view-controller, remote access, data access and plenty more. 
Just add the modules you need and start programming. 
In the fifth version, the focus lays upon reactive programming with reactive streams, but also other features and revisions like support for JUnit 5. 
Spring 5 will require at least JDK 8 but will be built upon JDK9. 
A release is planned after the release of Java 9.

## Spring IO Platform

<span class="image right small"><img class="p-image" alt="Spring IO Platform" src="/img/spring-ecosystem/spring-io-platform.png"></span>

The Spring IO Platform is build upon Spring Boot and is mainly used in combination with a dependency management system. 
It provides dependencies that just work. 
It's basically a library on the classpath of your application which gives developers production-ready features. 
It does this by providing a bill-of-material Maven artifact. 
The libraries used in the BOM file are all curated and normalised, so they work greatly together. 
But if that is not to your liking, you can easily just use your own versions. 
The platform supports JDK 7 and 8 and is still being updated frequently.

## Spring Security

<span class="image left small"><img class="p-image" alt="Spring Security" src="/img/spring-ecosystem/spring-security.png"></span>

Nowadays you can't look anywhere or you read about problems of security failures and the importance of privacy. 
Spring Security will provide your application with authentication and authorisation. 
It will also protect your application against a hand full of possible attacks. 
Spring Security supports a lot of popular authentication protocols and services like OpenID, LDAP, HTTP, … and support is extended through the available third party modules. 
The fifth version of Spring Security will add OAuth 2.0.

## Spring LDAP

<span class="image right small"><img class="p-image" alt="Spring LDAP" src="/img/spring-ecosystem/spring-ldap.png"></span>

Spring LDAP hides a lot of the boilerplate code for LDAP interactions. 
It makes sure all the connections are created and correctly closed. 
This library helps out with the looping through the results and filtering those.
It's also possible to manage your transactions with a client-side transaction manager. 
If you're working with this Lightweight Data Access Protocol, this might definitely be worth your while.

## Spring Integration

<span class="image left small"><img class="p-image" alt="Spring Integration" src="/img/spring-ecosystem/spring-integration.png"></span>

When an architecture is focused around events or messages, you can get the help of Spring Integration. 
This resolves around the implementation of Enterprise Integration patterns. 
When you want to send something from point A to point B, there could be a lot of different network protocols or restrictions in between. 
Spring Integration minimizes the boilerplate code needed by implementing those patterns. 
It just makes it easy to send events and messages throughout different endpoints.

## Spring Batch

<span class="image right small"><img class="p-image" alt="Spring Batch" src="/img/spring-ecosystem/spring-batch.png"></span>

With Spring Batch it is possible to write an offline batch application using Java and Spring.
It makes it very convenient when you're used to the Spring Framework to execute a bunch of jobs.
It features a possibility to read and write your resource and a way of dividing data for processing and much more.
But also supports a transaction manager, job processing statistics, job status changes and much more.

## Spring Web Flow

<span class="image left small"><img class="p-image" alt="Spring Web Flow" src="/img/spring-ecosystem/spring-web-flow.png"></span>

The Spring Web Flow is created to help users to navigate through the different views of a stateful web application. 
A common example could be when shopping online. 
The process has a clear starting and finishing view, but in between it can change state or views dynamically. 
Through guided navigations, the user makes changes and it should register those changes as well as a possibility to finalise those change through a confirmation. 
All this is possible with Spring Web Flow. 
Although this project is listed with the main projects, there hasn't been any progress over the last years.

## Spring Web Services

<span class="image right small"><img class="p-image" alt="Spring Web Services" src="/img/spring-ecosystem/spring-web-services.png"></span>

There are several ways to develop a web service, and one of which is used in combination with SOAP. 
Spring Web Services helps with creating contract-first SOAP web services which are flexible by manipulating the XML contents. 
But due to the popularity of the architectural style of REST, the interest in SOAP has diminished and that is noticeable in the maintenance of this Spring project which hasn't had any significant version updates. 

# Popular

When you look at modern applications and its infrastructure, you'll see the power of the Spring portfolio coming to its use. With the easy of use of Spring Boot, you can quickly start the development of a secure application and use Spring Cloud to help you with the deployment and integration for your online service provider. 

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

Being built upon the Spring Framework, the popular Spring Boot provides an easy to use way for creating stand-alone Spring applications without code generation and configuration of XML files. 
If you want to get started quickly without to much hassle, Spring Boot is the way to go by adding the modules you need. 
Spring beans are not needed to be defined in XML, but are mostly automatically being configured by Spring Boot. 
There's also so no need to find and configure libraries for your specific Spring version, Spring Boot tries to do that for you. 
But if you wish, you can finetune it to your own needs by adding the library to the classpath of the application. 
When you want to deploy your Spring Boot application there's no need to Web Application Archive file due to an embedded servers like Jetty, Tomcat and Undertow. 
Spring Boot also features a command line tool for quick prototyping with Spring. 
The easiest way to get started with Spring Boot is to go to the [Spring Initialiser](https://start.spring.io/) and add the dependencies to the project. 
Pivotal Software is maintaining the Spring Boot project regularly and is becoming one of the popular Spring projects on the rise.

## Spring Cloud

<span class="image right small"><img class="p-image" alt="Spring Cloud" src="/img/spring-ecosystem/spring-cloud.png"></span>

An umbrella project which lets you build distributed systems by implementing many best practice patterns. 
Spring Cloud consists of many subprojects. 
With the use of Spring Cloud Config Server you can set-up a server with a repository, like Git, as its data store and view the changes made in the configuration. 
You can easily integrate this with Amazon Web Services or Cloud Foundry, through their related subprojects. 
And of course with a cloud service there's often a lot of security involved which is provided by the Spring Cloud Security. 
Spring Cloud Security is build upon OAuth2 and Spring Boot which provides single sign-on, token relay and token exchange. 
The full list of subprojects are available [here](https://cloud.spring.io/spring-cloud-aws).

## Spring Cloud Data Flow

<span class="image left small"><img class="p-image" alt="Spring Cloud Data Flow" src="/img/spring-ecosystem/spring-cloud-data-flow.png"></span>

Spring Cloud Data Flow used to be know as Spring XD and is part of Spring Cloud. 
It's an updated and revised toolkit for cloud-native message-driven microservices. 
The change was made by Pivotal Software after their experience with Spring Boot. 
Spring Cloud Data Flow is suitable for processing, analyzing and predicting data. 
Through streaming it can consume data from an HTTP endpoint and writes the payloads to a database of your choice. 
It also manages to scale the data pipelines to your liking without any interruptions. 
After development, an application can be easily executed in Cloud Foundry, Apache YARN, Kubernetes or Apache Mesos, but with the Service Provider Interface you can deploy your application to other runtimes.

## Spring Data

<span class="image right small"><img class="p-image" alt="Spring Data" src="/img/spring-ecosystem/spring-data.png"></span>

Whether you're working with relational or non-relational databases, Spring Data will soothe your needs. 
As an umbrella project it will ease your way into data access. 
Some of the related subprojects will help you develop quicker for your favorite database, like Spring Data Mongodb, Spring Data JPA, Spring Data for Apache Cassandra or Spring Data for Apache Solr. 
And through the help of some community modules this is extended to several others. 
With Spring Data REST you can expose your Spring Data repository automatically as a REST resource. 
As usual with Spring projects, they provide an excellent base but can be customised towards your own needs. 
A full list of subprojects and community projects are available [here](http://projects.spring.io/spring-data).

## Spring HATEOAS

<span class="image left small"><img class="p-image" alt="Spring HATEOAS" src="/img/spring-ecosystem/spring-hateoas.png"></span>

HATEOAS stands for Hypermedia As The Engine Of Application State. 
It enables the server to update its functionality by decoupling the server and client. 
With Spring HATEOAS it will be easy to create a REST resource implementation using the HATEOAS as an underlying principle. 
It will help the client by returning its response in combination with more information on what to do next. 
If the state of the resource changes, the information on the next steps will also vary throughout the application. 
HATEOAS requires that the RESTful service methods  GET, POST, PUT, and DELETE or subset are implemented. 
Spring Security will also help with the relational link creation.


## Spring Rest Docs 

<span class="image right small"><img class="p-image" alt="Spring REST Docs" src="/img/spring-ecosystem/spring-rest-docs.png"></span>

When you develop a RESTful service, you'll probably want to document it so it's easy for other developers to implement your API. 
Spring REST Docs helps you with the documentation process to make it more accurate and readable. 
It does this by using Asciidoctor which processes text into HTML. 
Alternatively it can be configured to use Markdown. 
There are also option for you to customize the layout of the documentation.

## Spring Social

<span class="image left small"><img class="p-image" alt="Spring Scoial" src="/img/spring-ecosystem/spring-social.png"></span>

Spring Social gives you access to connect your application with Facebook, Twitter and LinkedIn. 
But through its many community projects it's possible to connect to dozens other like Google, Instagram, Pinterest, … 
The full list is of supported third-party APIs is available [here](http://projects.spring.io/spring-social)

## Spring Session

<span class="image right small"><img class="p-image" alt="Spring Session" src="/img/spring-ecosystem/spring-session.png"></span>

When a user uses your application, you might want to consider their session, that is where Spring Session comes in. 
It supports multiple sessions at once and even can send the sessions in the header. 
Spring sessions can be used and not be specifically tied to any container. 
Although sounding very interesting with popular use, the project hasn't had any major changes over the past year.


# Other

These projects are mainly focused on one specific (niche) part of an application. Some wil help you with the development of specific front-end applications, while others will help you implement specific patterns.

<div class="row" style="margin: 0 auto 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spring-ecosystem/spring-other.png" alt="Other projects" title="Other projects"%}
</div>
</div>

## Spring AMQP

<span class="image left small"><img class="p-image" alt="Spring AMQP" src="/img/spring-ecosystem/spring-amqp.png"></span>

AMQP is an abbreviation for Advanced Messaging Query Protocol which Spring AMAP implements. 
It helps you with routing, queuing, exchanging and bindings. 
Additionally, there's a listener available when sending messages asynchronously. 
Spring AMQP also provides a template service for sending and receiving messages. 
In the upcoming second version of Spring AMQP it uses version 4.0.x version of the library which has been developed by RabbitMQ. 

## Spring Mobile

<span class="image right small"><img class="p-image" alt="Spring Mobile" src="/img/spring-ecosystem/spring-mobile.png"></span>

Spring Mobile is Pivotals try at making it easier to develop mobile web applications with the use of Spring MVC. 
Spring Mobile implements a way of detecting the type of the device used to view the url and tries to adjust its view accordingly.
Unfortunately the project isn't that well maintained as significant updates are several years ago.

## Spring for Android

<span class="image left small"><img class="p-image" alt="Spring for Android" src="/img/spring-ecosystem/spring-for-android.png"></span>

Another project that currently isn't much updated is Spring for Android.
Spring for Android brings some of the key benefits of using Spring to Google's mobile operating system, Android. 
It has a REST API client for Android with authentication support. 
For your social media authentication, you can use Spring Social in conjunction with Spring for Android. 
But there's no use of Spring's dependency injection, transaction manager or other useful Spring features.

## Spring Shell

<span class="image right small"><img class="p-image" alt="Spring Shell" src="/img/spring-ecosystem/spring-shell.png"></span>

Pivotal Software provided a way for building command-line applications. 
Through the use of Spring you could build a full-features shell application with your very own commands or just use the default commands that are already implemented. 
Or get access to an exposed REST API. 
The Spring Shell hasn't been updated with new functionality in more than 3 years.

## Spring XD

<span class="image left small"><img class="p-image" alt="Spring XD" src="/img/spring-ecosystem/spring-xd.png"></span>

Spring XD is the predecessor of Spring Cloud Data Flow and therefore hasn't been maintained. 
End of support will be in July 2017.

## Spring Flo

<span class="image right small"><img class="p-image" alt="Spring Flo" src="/img/spring-ecosystem/spring-flo.png"></span>

This JavaScript library was a foundation for the stream builder in Spring Cloud Data Flow. 
It provides a basic embeddable HTML5 visual builder. 
Especially focused on pipelines and simple graphs. 
It's built using Grunt where the commands can be run directly or indirectly through Maven. 
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
Spring Statemachine provides a framework that helps with all that. 
It provides a lot of usefull things for making complex configuration easy, but also provides listener states and much more.

## Spring Roo

Spring Roo gives you the possibility to easily build full Java applications. 
This is a tool for rapid development of Java applications that are fully written in Java. 
It is focused on using the new Spring projects, like Spring Boot and Spring Data, as well as other common Java technologies.

## Spring Scala

When developing applications in Scala, you can make use of Spring through Spring Scala, a community project. 
This brings a lot of Spring technologies to the Scala programming language.
This is one of the two presented community projects by Pivotal Software on their main project page, the other one being Spring Roo.
