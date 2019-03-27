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

As the era of containerization is rising, it only feels right to teach us the fundamentals about it and the importance of Docker in a project. That’s why they asked [Tom Verelst](/author/tom-verelst) to give us a detailed presentation about the mystical power of Docker. After the first introduction, we were soon ‘dockerizing’ our first full-stack application. We also combined everything together with Docker Compose, which made us start our whole full-stack application with just one command!

The session gave us an overview as to how Docker is used in the real world, and we couldn’t wait to use an orchestration framework to deploy our containers into the cloud!


## Databases

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
 
## DevOps and Continuous Integration
 
An introduction to DevOps & CI given by [Tim Vierbergen](/author/tim-vierbergen) explaining this way of working and how it increases the productivity of a team. We also covered some best practices concidering source control, building, testing and deploying with an example project to get a bit more familiar with the software used to do this. Software such as git for source control, Jenkins for building, Jasmine for testing and Docker/Spinnaker for deploying.

## Security Principles
 
In this presentation we went over the basics on how to protect your application and the user data it stores from malicious intent. We went over some good practices regarding the storage of data and the verification of your users. For example the hashing of passwords, enabling 2 step authentication, deciding on the amount of allowed invalid login attempts before issueing a timeout. All of these things should be decided using a mix of guidelines and common sense.


## Clean Code

[Pieter Van Hees](/author/pieter-van-hees) gave us a course of clean code, this course was not foccussed an creating new code but improving the way you write the code. 
#### Improvements:
- Readability
- Maintainability
- Avoid rewrites
  
The biggest enemy of clean code is pressure so Pieter advised us to take our time to write clean code. This course only gave an introduction and he recommended us to read the book by Robert Cecil Martin.

## Frontend Build tools, testing, package managers and more

This course was led by [Michael Vervloet](/author/michael-vervloet) who is a full stack Javascript/Typescript developer at ordina. He gave us the know how on the building process, serving your application and doing this in an optimized way. He also showed us to use generators and build tools to create a whole lot of code and files in the terminal.

The main topics of this course were Node.js, package managers and ways to build & gerenate your code (gulp, webpack and Angular CLI). We went over them one by one and got the chance to test and install them on our machine's to get a hands-on expierence. In the end we created an Angular application from scratch and played arround with the generator to make some components and serving them to look at our work.

## Frontend 
during our first week we had multiple course about front-end. First we saw 

## Java Language Features
Java is a pretty popular language in the bacekend development world, and is our preferred backend language here at JWorks. That's why [Yannick De Turck](/author/yannick-de-turck) explained us the newest features of Java versions 7, 8, 9, 10 and 11. Java 11 is the newest LTS version, so it was important for us to get a detailed explanation about its newest changes and features. 

One of the most useful features that Java 10 introduced is the 'var' keyword. How great is it that you don't have to specify the type twice during the initialization of an object!?

Other than that, there were alot of extra useful features that will certainly be nice to have once we need to use it. It was very entertaining to get a quick overview as to what is new, what is being removed or deprecated and what we can or should expect in the coming Java versions.

## Spring Framework
<img class="image left" alt="Spring logo" src="/img/2019-Kickstarter-Trajectory-2019-light/spring-logo.png">

For a framework this big and popular, we followed a three-day course given by [Ken Coenen](/author/ken-coenen). On the first day, we received a brief explanation as to how the Spring magic works behind the scenes (dependency injection, beans, ...). We saw the basic of the most common components of the full Spring Framework such as Cloud, Security, ... . 

On the second day, we dived into the magic behind Spring Boot. It's remarkable how much Spring Boot does for you without any configuration needed, although you can fully configure Spring Boot to your needs and satisfactions.


On the third day, [Ken](/author/ken-coenen) did a live coding session and created a Spring Boot application from scratch and explained how to fully initialize your Spring Boot project and get the most out of it through various steps and always showing the best practices for each implementation.

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
[Kubernetes](https://kubernetes.io/) is an open source container orchestration framework which was first introduced to us by [Tom Verelst](/author/tom-verelst) during the kickstarter traject. It is made by Google and is now maintained by the Cloud Native Computing Foundation. First they introduced us to all the features that Kubernetes possesses (service discovery, horizontal scaling, load balancing, ...). 

Soon we learned how to deploy Docker containers in the cloud by using Kubernetes, and afterwards we had an hands-on exercise where we could deploy a full-stack application to a Kubernetes cluster using [Minikube](https://github.com/kubernetes/minikube). It's wonderful how you can deploy a full-stack application through Kubernetes with just one configuration file needed. Ofcourse, it takes some time to get used to it, but once you get the hang of it, you can do outstanding stuff with this platform!

## Cloud Providers & Platforms
<img class="image left medium" alt="AWS Logo" src="/img/2019-Kickstarter-Trajectory-2019-light/aws-logo.png">
To get a bigger picture of all the cloud providers and platforms that are out there conquering the IT world, we had a dedicated session about this topic given by [Bas Moorkens](/author/bas-moorkens) and [Dieter Hubau](/author/dieter-hubau). Bas was focusing on Amazon Web Services and all its features that it has to offer.

We quickly learned that AWS was very advanced and had lots of components to facilitate the life of a developer. It was a very interesting session and made me realise that AWS was a big part of the development scene. We are eager to use it and learn more of what is has to offer. 

<img class="image right medium" alt="OpenShift Logo" src="/img/2019-Kickstarter-Trajectory-2019-light/openshift-logo.png">

As for cloud platforms, we got a very detailed explanation of how OpenShift (made by RedHat) works and what its features and options are. We also got a high-level explanation as to how an application in the cloud works and what the best practices are to achieve deploying your application in the cloud.

Overall, it was a very interesting session for cloud-enthousiasts and we definitely want to learn more about it!

## TypeScript
After the session HTLML5, CSS, JavaScript. [Dimitri De Kerf](/author/dimitri-de-kerf) learned us the benefits of TypeScript. 
He told us some benefits of using TypeScript instead of JavaScript. This means that TypeScript is a wrapper around JavaScrip, 
which means it has more methods to use to develop a application which you otherwise would not be possible.

Like declaring declaring a colon and a type after the variable.

[Dimitri De Kerf](/author/dimitri-de-kerf) showed how to configure our project to use TypeScript and to use these features.
He explained us that it is important to know how to use TypeScript because it is used in popular frameworks Like Angular and React.


## Angular
[Ryan De Gruyter](/autor/Ryan-De-Gruyter) was our teacher for today, He quickly introduced us to Angular a platform that is designed to easily create browser applications build by Google. 
The first version of Angular was AngularJS, it was very popular and used in by many companies. Google decided to update Angular and created Angular 2 which was not welcomed by the industry at that time
because it removed all the AngularJS concepts. 

It took some time for the industry to adapt and see the positive stuff of Angular2: Open Source Community, Improved Dependency injection, better performance, enc..
Angular2 is not the holy grail of frameworks it still has some downsides like lot's of ceremony and boilerplate thanks to the use of Angular CLI.

After the information session he showed us how easy it was to create an Angular project, were we learned how to create an Angular application using small reusable pieces called components.

## Frontend hands-ondf

Today [Jan De Wilde](/autor/Jan-De-Wilde) asked if we still had question about the last Angular session. 
Because in this session we would create a Angular application using all the techniques we learned form the previous course and he wanted to be sure we understood everything before we started
So he went a bit deeper on some topics and showed us on how to write an API and to structure the project properly.

After the lunchbreach (we went ot the MUZ) when we were still digesting our food, we started to write a complete Angular application. 
[Jan De Wilde](/autor/Jan-De-Wilde) guided us through the process showing us possible issues we could encounter and explained how we could solve those issues.
 
 
## Intro to Cloud-Friendly Development
The first things we learn is the goal of a cloud friendly platform:
* Minimise time and cost for new developers joining the project.
* Offer maximum portability between execution environments.
* Enable continuous deployment for maximum agility.
* Obviate the need for servers and systems administration.
* Can scale up without significant changes in tooling, arch or development.

[Kevin Van Houtte](/autor/Kevin-Van-Houtte) introduced us to contract testing. It is a tool to write a exact input en output of a API call, after we run our project our contract will generate tests for our controller checking if the controller output is the same as we expected in the contract.
We can create 

## agile
We started flow to agile. First we saw different approaches to work as a team. Like the waterfall system that has some downsides, which doesn't give allot of feedback. The feedback is only in the end of life cycle of the project or when the project got tested. It also has more handouts which is when a team passes the product to another team.
When something needed to be changed because the testers found a bug the process started again form the top or a client was not happy with the product and wanted to change some stuff.

Another way of working was with Agile this has more benefits:
* Quicker risk reduction
* limit handovers
* shorter term plans
  * to improve predicable, accuracy & reliability.
  *to redone stress and unleash innovative emergent ideas
* Fit for complex challenges
* Tackling emergent changes
* Building on emergent insight

Next she wanted to show us what difference between a push and pull system was. By giving a live example, 4 people were chosen to work in a factory which everybody had is own task.
When we started the process using the push system we noticed that one of the person was the bottleneck of the system. Everything piled up next to him and the process slowed down. 
Next we could see the flow was faster because the people had less stress and could work continuously. Because of this the product flow was faster which would make the client more happy at the end. 

After this we learned some Agile practices, we got introduced into the SCRUM framework were the roles are split in to three roles: product owner, development team, scrum master.

product owner: is the person that talks to to client or is the client. His responsibility is to communicate about the product, how it should look and what it should do.
The scrum master: is the middle man between the product owner and the development team. He takes away the load of manager the tasks from the developers but also keeps track that the developers keep improving
The developers: Build the product and if need be try to convince the product owner some ideas are not realistic for their needs.

The next framework we got introduced into was Extreme programming.
The main focus on extreme programming is on reviewing each other. That's why it uses pair programming allot, but many clients think pair programming is a bad investment but this is proven wrong.
By working with pair programming:
* Superior quality, less lines of code (better design)
* Only 15% extra time ( after initiation phase)
* Also 15% fewer defects

 
## DevCase

### Introduction 

### Technology 


### The new JWorks colleagues

<div class="row">
  <div class="column">
    <img class="p-image" width="20%" height="20%" alt="Seppe Berghmans" src="/img/2019-Kickstarter-Trajectory-2019-light/seppe-berghmans.jpg" />
  </div>
   <div class="column">
          <img class="p-image" width="20%" height="20%" alt="Jago Staes" src="/img/2019-Kickstarter-Trajectory-2019-light/jago-staes.jpg"  />   
   </div>
  <div class="column">
    <img class="p-image" width="20%" height="20%" alt="Yolan Vloeberghs " src="/img/2019-Kickstarter-Trajectory-2019-light/yolan-vloeberghs.jpg"  />   
  </div>
  <div class="column">
        <img class="p-image" width="20%" height="20%" alt="Giel Reynders" src="/img/2019-Kickstarter-Trajectory-2019-light/giel-reynders.jpg"  />   
   </div>    
</div>



