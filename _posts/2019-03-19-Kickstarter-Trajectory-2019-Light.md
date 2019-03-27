---
layout: post
authors: [xxx, yyy]
title: "Kickstarter Trajectory 2019 Light Edition"
image: /img/kicks.png
tags: [Spring, Spring Boot, Angular, Unit Test, Mocking, Microservices, Git, DevOps, Docker, Typescript, Kickstarter, Security]
category: Kickstarters
comments: true
---

## Introduction

We started this kickstarter trajectory with four kickstarters. Jago was freshly graduated from school, where Giel and Yolan already had working expierence in IT. Seppe had multiple years working expierence in Digital signage, but made a career change and was also new to IT.
The main goals of the kickstarter course was to give every kickstarter a knowlegdebase of the best practices within JWORKS and to introduce them to the IT world.

## First day
#### Morning

On the first day there we were welcomed by Robbe Struys and Angella Gallo. They gave us the basic information about the HR working of Ordina. After recieving the keys to our new car and our laptop they showed us how to work with Ordina Connect. We made our first CV and filled in our first timesheet entry. They toured us arround the office and introduced us to the future colleuges. They were very friendly and all said that we made the right choise, this was very nice to hear and put us a ease. We had brunch together and the we had a group picture aswel as our profile pictures. 

<img class="image fit" alt="Group picture" src="/img/2019-Kickstarter-Trajectory-2019-light/group-picture.jpg">

#### Afternoon

With our new laptop's in hand we needed an introduction to what development enviremont we needed to use, Kevind van den Abele showed us the ropes.

## Git

<img class="image right" width="35%" alt="Git spaghetti vs linear" src="/img/2019-Kickstarter-Trajectory-2019-light/git-spaghetti-vs-linear.jpg">

A tool al developers use is version control, the preferred tool at ordina is Git. We learned to use git, the best pratices to use and al this used in the terminal of course. If you woud like a program you can use Gitkraken. All allong the kickstarter traject we woud use git to get our code examples and presentations.

We went over good practices and learned by doing this hands-on on our own machines. Creating our own repository’s and when needed branching and merging them. [Yannick](/author/yannick-de-turck/) our teacher for this course was very clear to avoid spaghetti history by rebasing and squashing your commits to give a clean linear overview that is readable by your co-workers.

## Docker
<img class="image right" alt="Docker logo" src="/img/2019-Kickstarter-Trajectory-2019-light/docker.png">

On day 3 [Tom Van den Bulck](/author/tom-van-den-bulck), Competence lead in Big and Fast Data gave us a course on SQL and NoSQL database systems. As some of us were not familiar with NoSQL this was very interesting to see the difference in use and possibilities between normal SQL systems which we were all used to using before.

### SQL

#### PostgreSQL

PostgreSQL or Postgres is an open-source object-relational database management system that is increasing in popularity across bigger enterprises for reasons such as high scalability in terms of the amount of data as well as the amount of users trying to access the data at the same time. It is free to use as it is completely open-source. Has additional security features such as a robust access-control system. Can store .JSON files. Is fully indexed and very performant because of these indexes and is very extensible with additional features provided by it's open-source community. Simply put, PostgreSQL is an advanced version of SQL which provides many additional features and works cross-platform where other alternatives such as SQL Server only work on Microsoft systems.

### NoSQL

#### Redis

Redis is an open-source key-value store that runs in-memory that is often ranked the most popular key-value database system. It is often used whe consistency and durability of data is less important than the time it should take to distribute data. Redis is often used by companies such as GitHub, Twitter, StackOverflow and Snapchat where extremely high numbers of queries are being executed over small amounts of time (for example 300,000 queries per second on Twitter).

#### Cassandra

Originally developed by Facebook, later on released and picked up by Apache, Cassandra is an open-source wide column store. It is a distributed, meaning data is spread out across many different servers, these different nodes spread across different datacenters can each individually service any request meaning there are no master or slave nodes. Because the data can be spread and replicated across multiple datacenters the chance of data being lost in the case of unforseen events is extremely small and it also means nodes can be replaced without any downtime when something goes wrong in a specific datacenter. Cassandra uses it's own query language, Cassandra Query Language (CQL) which adds an abstraction layer which hides implementation details and provides syntax for collections and other encodings.

#### MongoDB

MongoDB is a document-oriented database system which uses JSON-like documents to store it's data. This has as advantages that data does not need to be consistent across documents and the data structure can be changed over time putting the focus on what you want to build rather than how to store it. MongoDB has support for many languages including Java but also Javascript, .NET, Python and many others. MongoDB makes extensive use of RAM, loading only the accessed data into your RAM. A goal for developers should be to fit all the frequently used data into the RAM, when this data exceeds the capacity of a single machine, sharding can be applied. This can be particularly usefull for cloud-based applications.

#### Neo4j

Neo4j is a graph database management system and concidered the most popular one of it's kind. It comes in an open-source community edition having additional features such as online backup and high availability licenced under a commercial license. The difference between graph databases and other systems is that an index is not required. Every element contains a direct pointer to it's adjacent elements. This makes it faster to analyse data with lots of relations where traditional indexing might suffer when databases get bigger and bigger.

## Reactive programming with RxJS
 
A course given by [Orjan De Smet](/author/orjan-de-smet) covering reactive programming, the advantages it brings and how and where to use it and how to use it in combination with unit testing. In short, reactive programming offers a solution to handling asycnhronous calls with multiple events. Which means it offers more than one channel of communication so multi-step events can be handled efficiently. When coding in a traditional way you will often end up with a lot more code, could run into problems when for example a promise clogs a thread or you could end up with a mess of callbacks making your code extremely hard to read.
 


## Clean Code

[Pieter Van Hees](/author/pieter-van-hees) gave us a course of clean code, this course was not foccussed an creating new code but improving the way you write the code. 
#### Improvements:
- Readability
- Maintainability
- Avoid rewrites
  
The biggest enemy of clean code is pressure so Pieter advised us to take our time to write clean code. This course only gave an introduction and he recommended us to read the book by Robert Cecil Martin.

## Databases

## Frontend Build tools, testing, package managers and more

This course was led by [Michael Vervloet](/author/michael-vervloet) who is a full stack Javascript/Typescript developer at ordina. He gave us the know how on the building process, serving your application and doing this in an optimized way. He also showed us to use generators and build tools to create a whole lot of code and files in the terminal.

The main topics of this course were Node.js, package managers and ways to build & gerenate your code (gulp, webpack and Angular CLI). We went over them one by one and got the chance to test and install them on our machine's to get a hands-on expierence. In the end we created an Angular application from scratch and played arround with the generator to make some components and serving them to look at our work.

## Frontend 
during our first week we had multiple course about front-end. First we saw 

## Java Language Features
Java is a pretty popular language in the bacekend development world, and is our preferred backend language here at JWorks. That's why [Yannick De Turck](./author/yannick-de-turck) explained us the newest features of Java versions 7, 8, 9, 10 and 11. Java 11 is the newest LTS version, so it was important for us to get a detailed explanation about its newest changes and features. 

One of the most useful features that Java 10 introduced is the 'var' keyword. How great is it that you don't have to specify the type twice during the initialization of an object!?

Other than that, there were alot of extra useful features that will certainly be nice to have once we need to use it. It was very entertaining to get a quick overview as to what is new, what is being removed or deprecated and what we can or should expect in the coming Java versions.

## Spring Framework
<img class="image left" alt="Spring logo" src="/img/2019-Kickstarter-Trajectory-2019-light/spring-logo.png">

For a framework this big and popular, we followed a three-day course given by [Ken Coenen](./author/ken-coenen). On the first day, we received a brief explanation as to how the Spring magic works behind the scenes (dependency injection, beans, ...). We saw the basic of the most common components of the full Spring Framework such as Cloud, Security, ... . 

On the second day, we dived into the magic behind Spring Boot. It's remarkable how much Spring Boot does for you without any configuration needed, although you can fully configure Spring Boot to your needs and satisfactions.


On the third day, [Ken](./author/ken-coenen) did a live coding session and created a Spring Boot application from scratch and explained how to fully initialize your Spring Boot project and get the most out of it through various steps and always showing the best practices for each implementation.

#### Full House during the third day
<img class="image fit" alt="Full house" src="/img/2019-Kickstarter-Trajectory-2019-light/spring-session.jpg">

Ofcourse, afterwards we had some time to relax after three days of exploring the Spring Framework. We closed our three-day session on Friday with the best combination: pizza and beer!

#### Pizza & beer!

<img class="image fit" alt="Pizza Time" src="/img/2019-Kickstarter-Trajectory-2019-light/pizza-time.jpg">

## Unit Testing and mocking in Java

We got an introduction to Unit Testing in java from [Maarten Casteel](/author/maarten-casteels). 

#### The red line:

- Goals of Testing
- What to Test
- Fixtures
- Mocks
- Assertions

In the morning we got a very interactive theory session were we learned how important testing really is, the basics and what it all stands for. In the afternoon we learned to unit test our code, the best ways to do this, how to mock dependencies, use fixtures and a whole lot more. Maarten also showed us the most commen pitfalls to avoid, and some best practices like test-driven development(TDD) and how building test can help you with refactoring your code and lastly look at it with a different vision.

For lunch we went to a place called Mo’s were we were introduced to a whole other world of sandwiches. Once you’ve been there you will know what we mean by that, don’t go to often tough.

## Kubernetes
[Kubernetes](https://kubernetes.io/) is an open source container orchestration framework which was first introduced to us by [Tom Verelst](./author/tom-verelst) during the kickstarter traject. It is made by Google and is now maintained by the Cloud Native Computing Foundation. First they introduced us to all the features that Kubernetes possesses (service discovery, horizontal scaling, load balancing, ...). 

Soon we learned how to deploy Docker containers in the cloud by using Kubernetes, and afterwards we had an hands-on exercise where we could deploy a full-stack application to a Kubernetes cluster using [Minikube](https://github.com/kubernetes/minikube). It's wonderful how you can deploy a full-stack application through Kubernetes with just one configuration file needed. Ofcourse, it takes some time to get used to it, but once you get the hang of it, you can do outstanding stuff with this platform!

## Cloud Providers & Platforms
<img class="image left medium" alt="AWS Logo" src="/img/2019-Kickstarter-Trajectory-2019-light/aws-logo.png">
To get a bigger picture of all the cloud providers and platforms that are out there conquering the IT world, we had a dedicated session about this topic given by [Bas Moorkens](./author/bas-moorkens) and [Dieter Hubau](./author/dieter-hubau). Bas was focusing on Amazon Web Services and all its features that it has to offer.

We quickly learned that AWS was very advanced and had lots of components to facilitate the life of a developer. It was a very interesting session and made me realise that AWS was a big part of the development scene. We are eager to use it and learn more of what is has to offer. 

<img class="image right medium" alt="OpenShift Logo" src="/img/2019-Kickstarter-Trajectory-2019-light/openshift-logo.png">

As for cloud platforms, we got a very detailed explanation of how OpenShift (made by RedHat) works and what its features and options are. We also got a high-level explanation as to how an application in the cloud works and what the best practices are to achieve deploying your application in the cloud.

Overall, it was a very interesting session for cloud-enthousiasts and we definitely want to learn more about it!

## DevCase

### Introduction 

### Technology 


### The new JWorks colleagues

<div class="row">
  <div class="column">
    <img class="p-image" width="20%" height="20%" alt="Seppe Berghmans" src="/img/2019-Kickstarter-Trajectory-2019-light/seppe-berghmans.jpg" />
  </div>
  <div class="column">
    <img class="p-image" width="20%" height="20%" alt="Yolan Vloeberghs " src="/img/2019-Kickstarter-Trajectory-2019-light/yolan-vloeberghs.jpg"  />   
  </div>
</div>



