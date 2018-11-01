---
layout: post
authors: [wout_meskens, sander_smets, michael_dewree, steven_deleye, ken_keymolen]
title: "Kickstarter Trajectory 2018 Summer Edition"
image: /img/kicks.png
tags: [Spring, Spring Boot, Angular, Unit Test, Mocking, Microservices, Git, DevOps, Docker, Typescript, Kickstarter, Security]
category: Kickstarters
comments: true
---

## Introduction
>54 young professionals started the Ordina kickstarter trajectory this summer, on the 1st of August. 
JWorks counted 5 kickstarters: Sander, Steven, Ken, Wout en Michaël. All looking for a challenge and a fresh start. 
Some freshly graduated from school, others having multiple years of experience, IT related or not. 
The goal was to broaden every kickstarter’s knowledge of the fast evolving IT world. 
We learned the basics of every hot topic which will definitely give us enough credits for our first project.

The kickstarter trajectory consisted of two parts: 
* One month covering all kinds of trainings: technical, non-technical, backend, frontend, DevOps...  
* After our minds were filled with all this information, there was a DevCase where we could put everything we learned into practice.

## First Day
On the first day of the kickstarter trajectory we were welcomed into Ordina and got an introduction about the structure of the company. 
After that we took a tour around the building, and we were told what the different workspaces are and where the different teams work. 
It was nice to notice that everyone we met was very friendly and helpful. 
This made us feel directly at ease.
On the first day we also received the keys of our car and a laptop, so we were equipped to begin our journey at Ordina.

## Security
In the beginning of the trajectory we got an introduction by [Tim De Grande](/author/time-de-grande){:target="_blank"} of the most important security principles like GDPR. 
This is very important to Ordina because all its consultants need to keep this information in the back of their minds when working at a customer.
We also followed a more technical security course which explained some of the most common attacks and how to avoid them.

## Backend

### Java
In this lecture given by [Yannick De Turck](/author/yannick-de-turck/){:target="_blank"}, we were introduced to all new features of Java 7, 8 and 9 aswell as Java 10.

We started off with Java 7 where we learned:
* Switch-statement with String values
* Automatic Resource Management
* Diamond Syntax
* Better exception handling with multi-catch
* Literal Enhancements
* The new IO API
* Fork Join Framework
* JVM Enhancements

Java 8 also introduced some useful new features:
* Lambda Expressions
* Extension Methods
* Functional Interfaces
* Method and Constructor References
* Streams and Bulk Data Operations for Collections
* Removal of PermGen
* New Date & Time API
* New Default API for Base64 Encoding
* Improvements for Annotations
* Performance Improvements

Java 9 introduces:
* Project Jigsaw: Modules
* Project Kulla: JShell
* Factory Methods for collections
* Diamond operator for anonymous inner classes
* Try-with-resources enhancement
* CompletableFuture API improvements
* Private methods in interfaces
* HTTP 2.0 Client
* Process API Improvements
* Reactive Streams
* Optional Improvements
* Collectors Improvements
* Stream Improvements

Last but not least we had an introduction of Java 10 which delivers:
* Local Variable Type Inference
* Unmodifiable Collections
* New Optional.orElseThrow() method
* Performance Improvements
* Container awareness
* Root CA Certificates included

In the afternoon we made a few exercises on these new features and improvements which gave us a brighter view on the possibilities within present Java development.

### Spring and Spring Boot
The lectures of Spring and Spring Boot were given by [Ken Coenen](/author/ken-coenen){:target="_blank"}. 
These were spread over two days where the first day was an overal introduction to Spring fundamentals, followed by a second day where we have put everything into practice.

#### Day 1:
The first day we got an introduction to Spring and Spring Boot about the core fundamentals and concepts of JPA, Beans and application contexts. 
After that we went further into the features of the framework where we were introduced to Spring Web Services and Spring Security.

#### Day 2:
On the second day we made a small project where we created a backend application to fetch all information of different digital coins (cryptocurrencies). 
We learned how to read data from an API using DTOs and storing them into a database. 
At the end of the day we had a fully working backend application which fetched all information automatically and exposed it to different endpoints.

<img alt="SpringBoot" src="{{ '/img/2018-08-06-Kickstarter-Trajectory-2018-Summer/be-course.png' | prepend: site.baseurl }}" class="image fit">

### Microservices
[Tim Ysewyn](/author/tim-ysewyn){:target="_blank"} and [Kevin Van Houtte](/author/kevin-van-houtte){:target="_blank"} gave a brief overview of the microservices architecture. 
We learned when this is best applicable. 
This can be applied when there is a monolith that is responsible for multiple different tasks. 
It could be better in that case to split off these different tasks into multiple microservices. 
One of the advantages of doing that is the possibility to deploy the different microservices separately and the possibility to upscale the resources of the microservices that receive the biggest loads.


### Clean Code
During this course of clean code, [Pieter Van Hees](/author/pieter-van-hees){:target="_blank"} taught us the best practices of how to write clean code. 
This improves the readability and performance of our applications which is of great importance to Ordina.

## Frontend
The frontend courses started off with HTML/CSS/JavaScript given by [Yannick Vergeylen](/author/yannick-vergeylen){:target="_blank"} after which we went more in-depth of other topics. 

#### Build tools: 
In this course given by [Michael Vervloet](/author/michael-vervloet){:target="_blank"}, we started off with Node.js and its features like asynchronous programming and event emitters.
Later, we learned about NPM and other package managers and how to use them inside a project like an Angular app. 
At the end, Angular-CLI was covered, the start of one of the most important frameworks we use at JWorks.

#### Typescript: 
In the TypeScript course given by [Kevin Van Houtte](/author/kevin-van-houtte){:target="_blank"}, we built further on Node.js and NPM. 
We did an exercise about school management where we used OO-programming and CRUD in TypeScript. 
This was pretty challenging but with each other's help, we managed to get the final assessment done. 

#### Angular: 
Angular was the last frontend course given by [Ryan De Gruyter](/author/ryan-de-gruyter){:target="_blank"}. This helped us to quickly create a frontend that is connected to a backend project. Here, we went more in-depth on the SPA framework and how different components interact with each other.

## Devops
The trajectory also included courses about the DevOps culture. 
We got some introductions to Docker, Kubernetes and CI/CD given by [Tim Vierbergen](/author/tim-vierbergen){:target="_blank"}.

### Docker & Kubernetes
These courses were given by [Tom Verelst](/author/tom-verelst){:target="_blank"}. 
He explained us the basics of containerization, more specifically how this is done by Docker.
During this hands-on session we learned how to work with containers and images. 
We learned how to use, create and delete them. 
There was also an explanation of the theory behind containerization and what the advantages are of using this, especially when compared to using virtual machines.

To orchestrate the containers, we received a course on Kubernetes. There we learned about the concepts of pods, secrets, and more.
We practiced this in a small exercise where we needed to configure a Minikube and run a simple application.

### Cloud
The last technical session we followed was about different cloud technologies. This was given by [Dieter Hubau](/author/dieter-hubau/){:target="_blank"} and [Bas Moorkens](/author/bas-moorkens/){:target="_blank"}.
We learned about the advantages of running applications in the cloud and what the differences are between the different operation models.
To make this more tangible, we went into multiple cloud platforms to see what the possibilities were. 
At the end we focussed on OpenShift Origin as this is one of the preferred container management packages inside JWorks.

## Soft Skills
Besides sharpening our technical skills we worked on our soft skills as well.
In the 2-day session 'Essentials of Communication' we learned how to present ourselves by means of role playing games and cases that reflect real world scenarios.
After an additional 'Brand Yourself' session we were ready to prove and present ourselves as worthy consultants to the management of Ordina.
All these techniques are also useful in the Agile & Scrum methodologies where we learned the importance of being prepared for change.


## DevCase
<img alt="DevCase" src="{{ '/img/2018-08-06-Kickstarter-Trajectory-2018-Summer/fe-preview1.png' | prepend: site.baseurl }}" class="image fit">

####  Introduction
During the second month of the kickstarter trajectory we were assigned to develop an event planner.
The purpose was to have more of an overview and control of the upcoming JWorks events.
In short, JWorks employees can create and approve events depending on their rights.
In addition, a weekly digest of the events is sent to the JWorks Telegram chat group and a Telegram bot is made available with some defined commands.

#### Technology & Methodologies
Together with our coaches [Orjan De Smet](/author/orjan-de-smet){:target="_blank"}, [Axel Bergmans](/author/axel-bergmans){:target="_blank"} and Haroun Pacquée we started off with an introduction to the project.
The user stories were presented on the Scrum board.
After defining the sprint goal for the first upcoming two weeks we divided ourselves into a frontend and a backend group. 
Using Scrum methodology we held our daily stand-up meetings and as soon as a new functionality was developed a pull request was made and reviewed by our coaches.
Every two weeks, at the end of the sprint, a demo was shown to our coaches followed by a retrospective and a sprint planning.
By making use of Continuous Integration, code changes in Github were automatically deployed to OpenShift where a Jenkins pipeline went through different stages ranging from testing the code and code quality, to building the Docker image.

Frontend tools that were used in the project:
 * Angular
 * Angular-CLI
 * Angular Material
 * Jest 
 
In the backend we made use of the following technologies:
 * Java 8
 * Spring Boot
 * Mockito and JUnit
 * Telegram API
 * Keycloak Security
 
For more technical details of the used tools and technologies of the DevCase, a separate blog post will follow!

<img alt="DevCase" src="{{ '/img/2018-08-06-Kickstarter-Trajectory-2018-Summer/fe-preview2.png' | prepend: site.baseurl }}" class="image fit">

### Personal Experiences
#### [Ken Keymolen](/author/ken-keymolen){:target="_blank"}
>The kickstarter trajectory provides the means to learn new evolutions & technologies within the IT world.
The DevCase gave us a good understanding on how to incorporate new technologies within an IT project. 
These trainings provide a solid base to continue to build our skills & expertise in the different areas IT has to offer,
making sure we are positioned to provide the best solutions for our customers.     
 
#### [Sander Smets](/author/sander-smets){:target="_blank"}
>Before the kickstarter trajectory, I did not really have an in-depth view on deployment and cloud automation. 
Our DevCase and trainings made sure that all of us have a complete understanding of frontend and backend technologies, cloud automation and new architecture strategies like DDD and microservices. 
Now I feel like a more complete developer and ready to tackle day-to-day problems at customers.

#### [Wout Meskens](/author/wout-meskens){:target="_blank"}
>I am very happy that I have been given the opportunity to follow the kickstarter trajectory. 
The first month updated my knowledge about a lot of interesting topics. 
It was especially interesting to learn about the DevOps technologies. 
The DevCase was very helpful to put all this new knowledge into practice. 
It was fun to see that we could make an exciting application with all these technologies. 
The kickstarter trajectory made me excited to use these technologies to help customers.

#### [Steven Deleye](/author/steven-deleye){:target="_blank"}
>The kickstarter trajectory was the chance for me to learn a lot about new technologies in a short amount of time.
Putting this information into practice during the DevCase gave me more understanding in how and when we use these technologies.


#### [Michael De Wree](/author/michael-de-wree){:target="_blank"}
>The kickstarter trajectory was not easy, but achievable. 
This made me so much more excited. 
Especially the DevCase was a good way to gain technical experience. 
Besides the possibility to learn and grow, Ordina makes me feel at home. 
I look forward to the next couple of years!

