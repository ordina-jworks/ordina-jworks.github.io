---
layout: post
authors: [bas_moorkens, mohammed_laghzaoui, brecht_porrez, bjorn_de_craemer, frederick_bousson]
title: "Zero Plastic Rivers - explained"
image: /img/2020-03-16-ZPR-explained/zpr-banner.jpg
tags: [AWS]
category: Machine Learning
comments: true
---

# Table Of Contents

* [Introduction](#introduction)
* [Architecture](#architecture)
* [Security](#security)
* [Developer experience](#developer-experience)
* [Conclusion](#conclusion)

# Introduction

As a society we treat plastic irresponsibly. Because of us, enormous amounts of plastic waste end up in our rivers. And if we don't remove this plastic from the rivers before it reaches the estuary, this plastic will inevitably end up in the plastic soup, which in turn gets bigger.


# Zero Plastic Rivers

The Zero Plastic Rivers (ZPR) initiative ( https://zeroplasticrivers.com ) tries to solve this problem by doing three things: measure, prevent and clean up.


##Plastic Soup
Plastic pollutes our seas and oceans. Currently at least 150 million tons of plastic waste floats in our oceans, forming the infamous plastic soup. And it is getting worse: it's estimated another 8 million tons is added every year. That's about one truck of plastic per minute.

##Approach
The Zero Plastic Rivers initiative  wants to make sure that our rivers no longer bring plastic waste to the seas. And we want to do this based on a scientific and structured approach inspired by the principles of quantitative optimization as defined by Six Sigma.


## Endgoal
Our rivers are severely polluted with plastic, making them the largest source of plastic soup in our oceans, even up to 80%. We can only solve this problem by ensuring that our rivers no longer supply plastic to the sea. And that is why we are striving for Zero Plastic Rivers.


To be more effective in the fight against the plastic soup it is important to get more insight in how plastic move through the rivers.
This is where Bert Teunkens together with the University of Antwerp comes into play.
The subject of his PhD is: Quantification and characterization of the plastic fluxes in the Scheldt basin, with the ultimate goal of setting-up an efficient remediation.

To help him reach his goal of creating strategies to combat the plastic pollution he needs insights in how different kinds of plastic moves through our waterways.
Bert came up with different ways to gather this data: using citizen science and IoT.


## Citizen science

<div style="text-align: center;">
  <img alt="Zero Plastic Rivers Plastic" src="/img/2020-03-16-ZPR-explained/zpr_allplastic.jpg" width="auto" height="40%" target="_blank">
</div>


A large quantity of plastic objects were dipped in fluorescent paint and were tagged with water resistant stickers containing metadata about that object. 
These objects were released in the waterways with the assumption they would wash ashore eventually. 
Because they were brightly colored, they would be easy to spot by passers-by.
These people could then enter various information about the object such as the unique object identifier, GPS location, pictures, description, ... 

## IoT


<div style="text-align: center;">
  <img alt="Zero Plastic Rivers Sensor" src="/img/2020-03-16-ZPR-explained/zpr_tracker.jpg" width="auto" height="40%" target="_blank">
</div>

Another great way to gather datapoints was through GPS trackers. 
Various industrial grade battery powered GPS trackers were put in a waterproof casing and then deployed into the river.
Using a 2G network, these GPS trackers would travel along the river and transmit a new GPS fix every hour. 
Various measures were taken to optimize battery consumption as we expected the trackers to travel for an extended period of time. This was done by putting a specific configuration on these devices.


## Partnering

Bert approached Ordina because of our deep IoT knowledge and user centric end-to-end project approach.

Ordina helped create an application to gather the datapoints and visualise them so that he could formulate ways of setting up efficient remediation.

This was quite an exciting and important project for Ordina and the JWorks crew as it checks 2 boxes at the same time: doing a project with the latest and greatest technology while having a significant impact on society!

This project would allow us to use all our skills to build a solution that would solve a major problem for society.
With our multi-disciplinary team we were able to tackle following domains: user experience, application and cloud architecture, frontend and backend development, security and managed application hosting.


# User Experience

From the get-go it seemed very crucial to nail the user experience for the citizen science part of the application.

The success of the project depended on benevolent strangers to pick up our brightly colored plastic waste, read the instruction and input a significant amount of data into our system.
This process needed to be clear, painless and concise. 
Bad user interaction would lead to no datapoints and thus doom the project.


The initial idea was to put QR tags on all the plastic objects and have users scan them.
Altough everyone deemed this an elegant and efficient way of working, we decided to test this on "regular people".
This was done by conducting guerilla testing: talking to random people outside our office building, showing them a ZPR plastic object with a tag and seeing what they would do.

Turns out very few people instinctively know what to do with a QR code.

To counter this, we opted to add a very short url on the object: www.zpr.one
This allowed more users to reach our application and fill in all the data we needed.

Once they were in the application we had to make it straightforward for them to collect all the data we needed. Various rapid iteration of the UI were made using wireframes and mockups. These were tested and validated to create an optimal flow through the various screens as we wanted a very low threshold for users to input the data.

We opted to create a Progressive Web Application (PWA) instead of a native application as we felt that users did not want to install yet another app.
As we required access to native features such as GPS and camera a PWA seemed perfect for the job!


# Architecture

To build and run this modern and complex project we opted to use the AWS platform.  
For a considerable amount of time we at JWorks have been investing our efforts and resources to build up our AWS portfolio.  
This means we work on building up the AWS skills of our people and in parallel we work on building up our portfolio of AWS enabled solutions.  
We have worked out several reference architectures that we prefer to use now.  
The advantage of these architectures is that every consultant within our unit knows how to use them and develop applications using them.  

The Zero Plastic Rivers project proved to be an excellent opportunity to put some of these into practice.  
You can view the architecture we opted to build in the following picture.  

<div style="text-align: center;">
  <img alt="Zero Plastic Rivers" src="/img/2020-03-16-ZPR-explained/zpr_architecture.jpg" width="auto" height="40%" target="_blank">
</div>

This big architectural picture can be divided in 3 big sections:

* Backend java application
* Frontend ionic app
* IoT sensor data ingestion

We will highlight some key features of each architectural section in the following paragraphs.

## Backend application

<div style="text-align: center;">
  <img alt="Zero Plastic Rivers" src="/img/2020-03-16-ZPR-explained/zpr_arch_backend.jpg" width="auto" height="40%" target="_blank">
</div>

### The backend itself
Since we are called JWorks and we mainly focus on Java/Javacript development it should be no surprise that our backend application is written in Java with the Spring Boot framework.  
In general we prefer to write backends in the microservices paradigm, but in this case the backend was sufficiently small that it only consists of 1 microservice.  
The application itself is a pretty standard spring boot application.  
We use a postgreSQL server hosted in RDS as our persistent datastore on the backend, supplemented with an elasticache Redis cluster to cache database queries and configurations for the IoT sensors used in the IoT sensor data ingestion part.  
Our backend service is reachable over a REST interface for the outside world, we will talk more about this interface when we discuss the frontend application.  

### Hosting of the application
The backend application is hosted on our Kubernetes cluster in the AWS cloud. This cluster is an EKS cluster that we use to run several projects for customers and is also used for some of our internal applications.  
The EKS cluster is a multi-worker node cluster setup with multiple Auto Scaling Groups so we can guarantuee almost 100% uptime on our applications that run on this cluster.  
We have been using Kubernetes in different forms (on-premise, AKS, PKS,  ...) for a long time now which means we have a very clear image of how to use it and how to run applications on a cluster.  
We make heavy use of several key features like: secrets, configmaps, ...  
Our EKS cluster is running several plugins that allow us to quickly configure infrastructure components on the AWS cloud from within our cluster.  
For example the REST interface of the application is exposed through a Kubernetes ingress which is hooked up to the ALB controller plugin.  
This means that whenever we create a new ingress a new Application Load Balancer will be automatically provisioned in the AWS cloud to expose our deployment to the outside world. This makes it very easy to work with and allows us a lot of flexibility.  

## Frontend

<div style="text-align: center;">
  <img alt="Zero Plastic Rivers" src="/img/2020-03-16-ZPR-explained/zpr_arch_frontend.jpg" width="auto" height="40%" target="_blank">
</div>

Our frontend application consists of two parts.  
The first part is aimed at citizens who wish to help the cause. They can feed data in the system via the citizen science application when they find a bottle as shown in the image below.  
This is the first way that data from the plastic bottles comes into our system. We allow the user to upload an optional image when submitting this data. These images are stored in a secure S3 bucket.  
The second part is aimed at the researchers, and could be seen as the backoffice of the project, where the data given by the GPS trackers and the citizens is visualized in a clear and orderly way.

<div style="text-align: center;">
  <img alt="Zero Plastic Rivers" src="/img/2020-03-16-ZPR-explained/zpr-frontend-application.png" width="auto" height="40%" target="_blank">
</div>

To develop this application we have chosen to use Ionic. [Ionic](https://ionicframework.com/) is a free-to-use web-based framework that allows you to build hybrid mobile apps for iOS and Android, all from one codebase. In other words, Ionic is a tool for cross-platform mobile development. Ionic enables you to develop mobile apps using web technologies and languages like HTML, CSS, JavaScript, Angular, and TypeScript.

### Data visualization

<div style="text-align: center;">
  <img alt="Zero Plastic Rivers" src="/img/2020-03-16-ZPR-explained/zpr_arch_data_ingestion.jpg" width="auto" height="40%" target="_blank">
</div>

One of the most relevant components in this application is the map where the sensors and the plastic bottles in the river are visualized by means of the coordinates registered in these items as shown in the image above. For this we have chosen to use [Leaflet](https://leafletjs.com/) which is an open source JavaScript library for adding interactivity to maps. They have a ton of features and plugins to support doing pretty much anything with a map that you can think of.

Ionic offers a wide variety of ready to use plug-ins and one of them is the camera that enables users who decide to participate in this project to take pictures of the bottles to update the status and deterioration of each bottle in the river.

### Frontend Testing

In reference to software testing we have mainly used Unit Testing to reduce the number of errors that are released during deployment, which we consider critical for effective software development. 

### Frontend deployment

Originally we planned to host this application in a nginx webserver in our EKS cluster. We changed to S3 as it is an easier to maintain solution than running your own webserver on Kubernetes. We have setup a hosted zone in Route53 which serves as the entry point of users into our application. Route53 then forwards users who visit zpr.one to our Cloudfront distribution. Cloudfront serves the ionic app from our S3 bucket which has static webhosting enabled. This setup seems optimal as it is low maintenance, tightly secured and highly scalable.


#### Low maintenance
To explain why this setup is low maintenance let us take a look at the components used in this architecture.  
We are making use of Cloudfront, S3 and Route53 in this setup.  
All of these services are managed services provided by AWS.  
This means that there is no maintenance required on our part as AWS guarantees uptime and makes sure that everything is running smoothly.  
The only manual actions that have occurred on our side in this setup so far was to clear the Cloudfront cache after releasing a new version to have the new version more quickly available to users of the app.  

#### Tightly secured
Since we are using only managed services from AWS the burden of patching those services and making sure they are secured is on AWS itself.  
AWS has an excellent reputation on this regard so we feel very comfortable in this regard.  
We also make use of several additional features provided by AWS to secure our application further.  
For example the S3 bucket that is used to host the website is only accessible through the Cloudfront distribution.  
So users do not need access to the S3 resources itself, we implemented this nicely through Bucket policies and IAM access control.  

#### Highly scalable
Since we are only allowing traffic to our application from the Cloudfront distribution this means that we get all the benefits from this global CDN.  
Cloudfront operates on the AWS edge locations which are spread throughout the world.  
Because our application is mostly Belgium based this was not as important to us but the fact that Cloudfront routes its requests over the internal AWS backbone makes a huge difference in speed which is a nice feature if you are working with global applications.  
The S3 service which acts as the origin for our Cloudfront distribution is **nearly infinitely scalable** as proclaimed by AWS itself.  
The interaction between our frontend and backend happens over REST services provided by our backend in the EKS cluster which is exposed over an ALB so we are very confident that we can scale up as needed.  

## IoT sensor data ingestion


IoT is all about processing a large quantity of messages. 

What makes IoT data challenging from a developer perspective is threefold:

* Protocol
* Data format
* Message Content

Imagine you have a device that captures and delivers GPS data. 
Seems simple enough right? Guess again!

A hardware vendor can decide to mix and match these 3 components.

The vendor can those over which protocol he wants to send the data.
Some examples are: HTTP(S), TCP, UDP, MQTT, COAP, ...

He can also use different kinds of data-serialization formats to get the information across the network of choice: JSON, XML, Hex, Binary, something proprietary, ... Different kinds of parsers will be needed.
 
And last but not least: he can organise the way a message is structured. He can name fields any way he wants and use any kind of data type. Imagine two vendors reporting battery capacity. One could report it by sending a field called "battery" and reporting battery voltage.
Another could use a field called "power" and return a battery fill level percentage. 

Soon, it can become quite complex due to the number of combinations possible.


Some of our plastic containers send their location via the 2G cellular network at regular intervals.  
These messages reach us via a public network through the tcp protocol.  

As various protocols such as TCP and UDP are quite prevalent in IoT solutions, we do see that they are not yet first class citizens in the cloud.
Eventhough it is possible to modify the ingress to kubernetes on our NGINX to allow TCP data to pass through, this is not a scalable solution. Imagine having thousands upon thousands of devices starting new TCP connections. This would kill our NGINX.
To solve this problem we used a native AWS component: the network load balancer. 
This allowed limitless scaling of TCP connections. These TCP connections would then end up on an Spring Boot application hosted on AWS Beanstalk, which is basically a managed horizontally scalable Tomcat server. This application has to handle the interactions with the devices and acts as a "sensor gateway".
The sensors can receive instructions and updates, but this has to happen inside the same open tcp connection within a very short timeframe.  
This gateway consults the Elasticache for any needed instructions or updates.  
If a return message is needed, it is sent through the open tcp connection.  
The sensor detection message is then passed on to an SQS queue. From here on out, the focus of handling the message is less time-sensitive.  
A Lambda function decodes the message on the queue and then pushes it to another SQS message queue.  
A Spring Boot backend that is deployed in our kubernetes cluster handles these last events and persists them to our database.  


# Security

One key element of the security is controlling who has access to an application. To strengthen security, reduce risk and improve compliance, it is essential that only authorized users get to access specific data in an application and that authentication is required before that access is granted. This means that authentication is a critical component for most applications and in this project it was no exception, as we needed to secure the data visualization part of the application so that only researchers have access to advanced functionality.

To perform this authentication, we have chosen to use AWS Cognito as it dramatically simplifies application development by providing an authentication service that is simple to integrate into any modern application. In addition to storing login information, Cognito can store standard and custom user account settings. Learn more about AWS Cognito and its advantages [here](https://aws.amazon.com/cognito/).

Another advantage of AWS Cognito is that it supports OpenID Connect which is a simple identity layer built on top of the OAuth 2.0 protocol, which allows clients to verify the identity of an end user based on the authentication performed by an authorization server or identity provider (IdP), as well as to obtain basic profile information about the end user in an interoperable and REST-like manner. Learn more about OpenID Connect [here](https://openid.net/connect/).

### AWS Cognito and OpenID Connect

To carry out authentication using the OpenID Connect standard with Cognito we have chosen to use the Authorization Code Grant which is the preferred and most secure method for authorizing end users. Instead of directly providing user pool tokens to an end user upon authentication, an authorization code is provided. This code is then sent to a custom application that can exchange it for the desired tokens. Because the tokens are never exposed directly to an end user, they are less likely to become compromised.

The image below illustrates the flow, and, in this [blogpost](https://aws.amazon.com/blogs/mobile/understanding-amazon-cognito-user-pool-oauth-2-0-grants/), you can find more information about this approach.

<img alt="Authorization Code Grant Diagram" src="{{ '/img/2020-03-16-ZPR-explained/zpr_aws_cognito.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto;">

To secure our frontend we have used Manfred Steyer's [Angular-oauth2-oidc](https://github.com/manfredsteyer/angular-oauth2-oidc) library but you could use any library as long as it is [OpenID certified](https://openid.net/certification/). 

Our colleague Jeroen wrote a fantastic [blogpost](https://ordina-jworks.github.io/security/2019/08/22/Securing-Web-Applications-With-Keycloak.html#setting-up-the-front-end-and-back-end-applications) that was very helpful to us. Jeroen shows the necessary steps to follow to secure any web application using OpenID Connect.

# D-Day



<div style="text-align: center;">
  <img alt="Zero Plastic Rivers release" src="/img/2020-03-16-ZPR-explained/zpr_release.jpg" width="auto" height="40%" target="_blank">
</div>

<div style="text-align: center;">
  <img alt="Zero Plastic Rivers trail" src="/img/2020-03-16-ZPR-explained/zpr_plastictrail.jpg" width="auto" height="40%" target="_blank">
</div>


<div style="text-align: center;">
  <img alt="Zero Plastic Rivers trail2" src="/img/2020-03-16-ZPR-explained/zpr_plastictrail2.jpg" width="auto" height="40%" target="_blank">
</div>


Tuesday December 17th was D-day. That day the bottles and sensors were finally thrown into the water. We had a tight timing because the bottles had to be thrown in the Scheldt river at high tide, at 3 different locations. 
It was a nice dry day and our client was quite nervous. Are all the signals coming in properly, is the sensor packed waterproof, ...?  Especially because we were not able to test all that much with the sensors due to the tight timing. 
At high tide, it was time to throw the bottles in the water and register the sensor via our Ionic App. Everything runs smoothly and the signals from the sensors come in. You see the customer cheer up and leave satisfied to the next location. Everything goes as planned all day long and after just a few days the first users start registering the objects on our website.
And today, so many weeks later, we still receive new registrations. 
It was a nice ending of a fascinating and instructive project. 

# Developer-experience

For some developers on the team, Zero Plastic Rivers was the first experience with AWS and even their first cloud project.  
In the beginning it was quite intimidating because a lot of different technologies of AWS were used.  
But soon it turned out to be quite easy to configure and with some help from other colleagues (thanks guys) I got everything up and running pretty quickly.  
In the beginning I was quite sceptical about the use of lambdas in our application, I didn't immediately see the advantage of it but in the end it turned out to be the best option, especially if we want to build applications with many more sensors in the future. Although it was sometimes difficult to find the correct documentation.  
My favorite technology was definitely Cognito. In a few lines of code you have a user administration of an entire application without having to worry about possible security holes.  
In the end it was a very pleasant experience to get started with AWS.
Due to this eye-opening experience several developers are looking forward to becoming AWS certified and gaining a deeper and more complete AWS skillset.


# Conclusion

All in all we were very pleased with how we delivered this project. As this project was fully staffed with an Ordina High Performance Team, we were able to do everything by the book. We used the best methodologies for software delivery coupled with our preferred technology stack to build a true cloud native application.
We embraced the devops mindset: you build it, you run it.
Next to that we also embraced the agile mindset: respect, collaboration, improvement and learning cycles, pride in ownership, focus on delivering value, and the ability to adapt to change.

We had a great team dynamic: experienced developers coaching and mentoring younger colleagues and helping them grow.
Meanwhile the senior developers could work on their coaching and mentoring skills while discussing advanced architectures, also allowing them to grow.
Seems like a win-win, right?

This scientific project will run for at least two years and we can't wait to see what kind of insights will be revealed and the impact we will make on our environment and society!

We also ended up getting some national press coverage. As you can imagine, this made us very proud!

https://www.vrt.be/vrtnws/nl/2020/02/28/opnieuw-fluoplastic-in-schelde/
https://www.hln.be/in-de-buurt/antwerpen/wetenschappers-gooien-plastic-in-de-schelde-in-strijd-tegen-plasticvervuiling~a39b64e0/

