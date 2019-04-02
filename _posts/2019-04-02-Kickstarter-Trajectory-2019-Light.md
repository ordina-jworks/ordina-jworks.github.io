---
layout: post
authors: [yolan_vloeberghs, seppe_berghmans, giel_reynders, jago_staes]
title: "Kickstarter Trajectory 2019 Light Edition"
image: /img/kicks.png
tags: [Spring, Spring Boot, Angular, Unit Test, Mocking, Microservices, Git, DevOps, Docker, Kubernetes, OpenShift, Typescript, Kickstarter, Security]
category: Kickstarters
comments: true
---

## Introduction

We started this kickstarter trajectory with four kickstarters.
Jago was freshly graduated from school, where as Giel and Yolan already had working experience in IT.
Seppe had multiple years of working experience in Digital Signage but made a career change and was also new to IT.
The main goals of the kickstarter course was to give every kickstarter a knowledge foundation of the best practices within JWorks and to introduce them to the IT world.

## First day
#### Morning

On the first day there, we were welcomed by Robbe Struys and Angela Gallo.
They gave us the basic information about the HR working of Ordina.
After receiving the keys to our new car and our laptop they showed us how to work with Ordina Connect.
We made our first CV and filled in our first timesheet entry.
They toured us around the office and introduced us to our future colleagues.
They were very friendly and they all said that we made the right choice.
This was of course very nice to hear and put us at ease.
We had brunch together and then we had a group picture as well as our profile pictures taken. 

<img class="image fit" alt="Group picture" src="/img/2019-Kickstarter-Trajectory-2019-light/group-picture.jpg">

#### Afternoon
With every developer comes his/her personal development environment.
To help us pick the best tools to suite our needs, we had help from [Kevin Van den Abeele](/author/kevin-van-den-abeele).
He showed us the best IDEs for each language and best practices as to what we can do to improve our development experience.

## Git

<img class="image right" width="35%" alt="Git spaghetti vs linear" src="/img/2019-Kickstarter-Trajectory-2019-light/git-spaghetti-vs-linear.jpg">

A tool all developers use is Version Control.
At Ordina we prefer to use [Git](https://git-scm.com/){:target="_blank" rel="noopener noreferrer"} (this is preferred almost everywhere, who even uses SVN anymore?).
So we learned to use Git, the best practices to get the best out of it and all this is done in the terminal of course.
If you want to use a GUI for Git, they recommended GitKraken.
Over the whole kickstarter traject, we would use Git to get our code examples and presentations.

We went over good practices and learned by doing this hands-on on our own machines.
Creating our own repositories, branching, merging, ... .[Yannick](/author/yannick-de-turck/),
our teacher for this course, was very clear to avoid spaghetti history by rebasing and squashing your commits to give a clean linear overview that is readable by your co-workers.

## Docker
<img class="image right" alt="Docker logo" src="/img/2019-Kickstarter-Trajectory-2019-light/docker.png">

As the era of containerization is rising, it only feels right to teach us the fundamentals about it and the importance of Docker in a project.
That’s why they asked [Tom Verelst](/author/tom-verelst) to give us a detailed presentation about the mystical power of Docker.
After the first introduction, we were soon ‘dockerizing’ our first full-stack application.
We also combined everything together with Docker Compose, which made us start our whole full-stack application with just one command!

The session gave us an overview as to how Docker is used in the real world, and we couldn’t wait to use an orchestration framework to deploy our containers into the cloud!


## Databases

On day 3, [Tom Van den Bulck](/author/tom-van-den-bulck), Competence Lead in Big and Fast Data, gave us a course on SQL and NoSQL database systems.
As some of us were not familiar with NoSQL, this was very interesting to see the difference in usage and possibilities between normal SQL systems which we were all used to using before.

### SQL

For SQL database systems we had a look at PostgreSQL, an open-source object-relational database management system that is increasing in popularity across bigger enterprises for reasons such as high scalability, extensive features and as it works cross-platform.

### NoSQL

* #### Redis
Redis is an open-source key-value store that runs in-memory.
Used where consistency and durability is less important than speed.

* #### Cassandra
Cassandra is an open-source wide column store.
Distributed across different nodes for high accessibility and low chance of downtime.

* #### MongoDB

MongoDB is a document-oriented database system. Data in MongoDB does not need to be consistent and the data structure can change over time.

* #### Neo4j

Neo4j is a graph database management system. No index is required and data with a lot of relations to other data can be accessed faster when dealing with higher amounts.


## Reactive programming with RxJS

<img class="image right medium" alt="RxJs logo" src="/img/2019-Kickstarter-Trajectory-2019-light/rxjs.jpg">

A course given by [Orjan De Smet](/author/orjan-de-smet) covering reactive programming, the advantages it brings and how and where to use it and how to use it in combination with unit testing.
In short, reactive programming offers a solution to handling asynchronous calls with multiple events.
Which means it offers more than one channel of communication so multi-step events can be handled efficiently.
When coding in a traditional way you will often end up with a lot more code, could run into problems when for example a promise clogs a thread or you could end up with a mess of callbacks making your code extremely hard to read.
 
## DevOps and Continuous Integration
 
<img class="image left medium" alt="devops logo" src="/img/2019-Kickstarter-Trajectory-2019-light/devops.png">

An introduction to DevOps & CI given by [Tim Vierbergen](/author/tim-vierbergen) explaining this way of working and how it increases the productivity of a team.
We also covered some best practices considering version control, building, testing and deploying with an example project to get a bit more familiar with the software used to do this.
Software such as Git for version control, Jenkins for building, Jasmine for testing and Docker/Spinnaker for deploying.

<br/><br/>

## Security Principles
 
In this presentation we went over the basics on how to protect your application and the user data it stores from malicious intent.
We went over some good practices regarding the storage of data and the verification of your users.
For example the hashing of passwords, enabling 2-factor authentication and deciding on the amount of allowed invalid login attempts before issuing a timeout.
All of these things should be decided using a mix of guidelines and common sense.


## Clean Code

[Pieter Van Hees](/author/pieter-van-hees) gave us a course of clean code, this course was not focussed on writing new code but improving the way you write the code. 

#### Improvements:
- Readability
- Maintainability
- Avoid rewrites
  
The biggest enemy of clean code is pressure, so Pieter advised us to take our time to write clean code.
During this course we also did some exercises through public code katas available on the internet.
This course only gave an introduction and he recommended us to read the book Clean Code by Robert Cecil Martin.

## Frontend Build tools, testing, package managers and more

This course was led by [Michael Vervloet](/author/michael-vervloet), who is a full stack JavaScript/TypeScript developer at Ordina.
He gave us the know-how on the building process, serving your application and doing this in an optimized way.
He also showed us to use generators and build tools to create a whole lot of code and files in the terminal.

The main topics of this course were Node.js, package managers and ways to build & generate your code (gulp, webpack and Angular CLI).
We went over them one by one and got the chance to test and install them on our machines to get a hands-on experience.
In the end, we created an Angular application from scratch and played around with the generator to make some components and serving them to look at our work.

## Java Language Features
Java is a pretty popular language in the backend development world, and is our preferred backend language here at JWorks.
That's why [Yannick De Turck](/author/yannick-de-turck) explained us the newest features of Java versions 7, 8, 9, 10 and 11.
Java 8 is currently the most used Java version.
[Yannick](/author/yannick-de-turck) prepared some exercises for us so we could focus on the newest Java 8 features (lambdas, streams, optionals, ...).

One of the most useful features that Java 10 introduced is the 'var' keyword.
How great is it that you don't have to specify the type twice during the initialization of an object!?

Java 11 is the newest LTS version, so it was important for us to get a detailed explanation about its newest changes and features.

Other than that, there were a lot of extra useful features that will certainly be nice to have once we can use them.
It was very entertaining to get a quick overview as to what is new, what is being removed or deprecated and what we can or should expect in the coming Java versions.

## Spring Framework
<img class="image left" alt="Spring logo" src="/img/2019-Kickstarter-Trajectory-2019-light/spring-logo.png">

For a framework this big and popular, we followed a three-day course given by [Ken Coenen](/author/ken-coenen).
On the first day, we received a brief explanation as to how the Spring magic works behind the scenes (dependency injection, beans, ...).
We saw the basics of the most common components of the full Spring Framework such as Cloud, Security, ... . 

On the second day, we dived into the magic behind Spring Boot.
It's remarkable how much Spring Boot does for you without any configuration needed, although you can fully configure Spring Boot to your needs and satisfactions.

On the third day, [Ken](/author/ken-coenen) did a live coding session and created a Spring Boot application from scratch and explained how to fully initialize your Spring Boot project and get the most out of it through various steps and always showing the best practices for each implementation.

#### Full House during the third day
<img class="image fit" alt="Full house" src="/img/2019-Kickstarter-Trajectory-2019-light/spring-session.jpg">

Of course, afterwards we had some time to relax after three days of exploring the Spring Framework.
We closed our three-day session on Friday with the best combination: pizza and beer!

#### Pizza & beer!

<img class="image fit" alt="Pizza Time" src="/img/2019-Kickstarter-Trajectory-2019-light/pizza-time.jpg">

## Unit Testing and mocking in Java

<img class="image right" alt="Junit + Java Image" src="/img/2019-Kickstarter-Trajectory-2019-light/unit-testing.jpg" />

We got an introduction to Unit Testing in Java from [Maarten Casteels](/author/maarten-casteels).

#### The red line:

- Goals of Testing
- What to test
- Fixtures
- Mocks
- Assertions

In the morning we got a very interactive theory session where we learned how important testing really is, the basics and what it all stands for.
In the afternoon we learned to unit test our code, the best way to do this, how to mock dependencies, use fixtures and a whole lot more.
Maarten also showed us the most common pitfalls to avoid, and some best practices like test-driven development (TDD) and how writing tests can help you with refactoring your code and lastly look at it with a different vision.

For lunch we went to a place called Meals On Wheels were we were introduced to a whole other world of sandwiches.
Once you’ve been there you will know what we mean by that, don’t go too often though.

## Kubernetes
<img class="image left medium" alt="Kubernetes Logo" src="/img/2019-Kickstarter-Trajectory-2019-light/kubernetes-logo.png" />

[Kubernetes](https://kubernetes.io/){:target="_blank" rel="noopener noreferrer"} is an open source container orchestration framework which was first introduced to us by [Tom Verelst](/author/tom-verelst) during the kickstarter traject.
It is made by Google and is now maintained by the Cloud Native Computing Foundation.
First they introduced us to all the features that Kubernetes possesses (service discovery, horizontal scaling, load balancing, ...). 

Soon we learned how to deploy Docker containers in the cloud by using Kubernetes, and afterwards we had an hands-on exercise where we could deploy a full-stack application to a Kubernetes cluster using [Minikube](https://github.com/kubernetes/minikube){:target="_blank" rel="noopener noreferrer"}.
It's wonderful how you can deploy a full-stack application through Kubernetes with just one configuration file needed.
Of course, it takes some time to get used to it, but once you get the hang of it, you can do outstanding stuff with this platform!

## Cloud Providers & Platforms
<img class="image left medium" alt="AWS Logo" src="/img/2019-Kickstarter-Trajectory-2019-light/aws-logo.png">
To get a bigger picture of all the cloud providers and platforms that are out there conquering the IT world, 
we had a dedicated session about this topic given by [Bas Moorkens](/author/bas-moorkens) and [Dieter Hubau](/author/dieter-hubau).
Bas was focusing on Amazon Web Services and all its features that it has to offer.

We quickly learned that AWS was very advanced and had lots of components to facilitate the life of a developer.
It was a very interesting session and made me realise that AWS was a big part of the development scene.
We are eager to use it and learn more of what is has to offer. 

<img class="image right medium" alt="OpenShift Logo" src="/img/2019-Kickstarter-Trajectory-2019-light/openshift-logo.png">

As for cloud platforms, we got a very detailed explanation of how OpenShift (made by RedHat) works and what its features and options are.
We also got a high-level explanation as to how an application in the cloud works and what the best practices are to achieve deploying your application in the cloud.

Overall, it was a very interesting session for cloud-enthusiasts and we definitely want to learn more about it!

## TypeScript
After the session HTLML5, CSS3, JavaScript, [Dimitri De Kerf](/author/dimitri-de-kerf) learned us the benefits of TypeScript. 
He told us some benefits of using TypeScript instead of JavaScript.
TypeScript is a wrapper around JavaScript, 
which means it has more methods to make your daily programming more pleasant.

It also adds optional static typing for richer IDE autocomplete support.

[Dimitri De Kerf](/author/dimitri-de-kerf) showed us how to configure our project to use TypeScript and to use these features.
He explained us that it is important to know how to use TypeScript because it is used in popular frameworks like Angular and React.


## Angular

<img class="image right" width="300" alt="Angular logo" src="/img/2019-Kickstarter-Trajectory-2019-light/angular.png">

[Ryan De Gruyter](/author/ryan-de-gruyter) was our teacher for today.
He quickly introduced us to Angular, a platform that is designed to easily create browser applications built by Google. 
The first version of Angular was AngularJS.
It was very popular and used by many companies.
Google decided to update Angular and created Angular 2 which was not welcomed by the industry at that time because it removed all the AngularJS concepts. 

It took some time for the industry to adapt and see the positive stuff of Angular 2: Open Source community, improved dependency injection, better performance, etc..
Angular 2 is not the holy grail of frameworks. It still has some downsides like lots of ceremony and boilerplate thanks to the use of Angular CLI.

After the information session, he showed us how easy it was to create an Angular project where we learned how to create an Angular application using small reusable pieces called components.

## Frontend hands-on

[Jan De Wilde](/author/jan-de-wilde) asked if we still had question about the Angular session. 
Because in this session we would create an Angular application using all the techniques we learned from the previous course and he wanted to be sure we understood everything before we started.
So he went a bit deeper on some topics and showed us on how to execute calls to an API and to structure the project properly.

After the lunch break, when we were still digesting our food, we started to write a complete Angular application. 
[Jan De Wilde](/author/jan-de-wilde) guided us through the process, showing us possible issues we could encounter and explained how we could solve those issues.
 
## Intro to Cloud-Friendly Development

[Kevin Van Houtte](/author/kevin-van-houtte) introduced us to contract testing.
It is a tool to write an exact input and output of an API call.
After we run our project, our contract will generate tests for our controller, checking if the controller output is the same as we expected in the contract.
The files, generated by the contract, can be imported into Javadoc for documentation. 

Afterwards we had some exercises where we could use all the skills we had learned in these courses.
* API driven programming with contract tests.
* Loading the API docs into our Java docs
* Attaching a database to our Spring Boot application
* Creating migration scripts and using these to populate the database with FlyWay
* Creating a config server and connecting our Spring Boot application to it
* Enabling actuator and using it to generate metrics data

All these exercises help us prepare for a real project in the future.

## Agile Development 
Together with [Michaëla Broeckx](/author/michaela-broeckx), Practice Manager Agile, we saw different approaches to work as a non-agile team.
Like the waterfall system that has some downsides such as getting late feedback from the business or end user.
The feedback is only in the end of the life cycle of the project or when the project got tested. 

<img class="image right" alt="Agile Methodology" src="/img/2019-Kickstarter-Trajectory-2019-light/agile-methodology.png">

Applying an Agile approach offers a lot of benefits:
* Quicker risk reduction
* limit handovers
* shorter term plans
  * to improve predictability, accuracy & reliability.
  * to redone stress and unleash innovative emergent ideas
* and so on!

She proved her theory by doing a live exercise which involved folding paper airplanes as a team.
At the end we would analyze the outcome.

After this we learned some other Agile practices: we got introduced into the SCRUM framework and the practice of Extreme Programming, plus its benefits. 


## The new JWorks colleagues

<img class="p-image" width="300" height="300" alt="Seppe Berghmans" src="/img/2019-Kickstarter-Trajectory-2019-light/seppe-berghmans.jpg" />
<img class="p-image" width="300" height="300" alt="Jago Staes" src="/img/2019-Kickstarter-Trajectory-2019-light/jago-staes.jpg"  />   
<img class="p-image" width="300" height="300" alt="Yolan Vloeberghs " src="/img/2019-Kickstarter-Trajectory-2019-light/yolan-vloeberghs.jpg"  /> 
<img class="p-image" width="300" height="300" alt="Giel Reynders" src="/img/2019-Kickstarter-Trajectory-2019-light/giel-reynders.jpg"  />  
