---
layout: post
authors: [bas_moorkens, mohammed_laghzaoui, brecht_porrez, bjorn_de_craemer]
title: "Zero Plastic Rivers - explained"
image: /img/chatbot.png
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

# architecture

To build and run this modern, complex project we opted to use the AWS platform.  
At Jworks we have been investing our time and resources for more then a year now in order to build up our AWS portfolio.  
This means we work on building up the AWS skills of our people and in parallel we work on building up our portfolio of AWS enabled solutions.  
We have worked out several reference architectures that we prefer to use now.  
The advantage of these architectures is that every consultant within our unit knows how to use them and develop applications using them.  

The Zero Plastic Rivers project proved to be an excellent opportunity to put some of our reference architectures into practice.  
You can view the architecture we opted to build in the following picture.  

<div style="text-align: center;">
  <img alt="Zero Plastic Rivers" src="/img/2020-03-16-ZPR-explained/zpr_architecture.jpg" width="auto" height="40%" target="_blank">
</div>

This big architectural picture can be divided in 3 big sections:

* Backend java application
* Frontend ionic app
* IOT sensor data ingestion

We will highlight some key features of each architectural section in the following paragraphs.

## Backend application

<div style="text-align: center;">
  <img alt="Zero Plastic Rivers" src="/img/2020-03-16-ZPR-explained/zpr_arch_backend.jpg" width="auto" height="40%" target="_blank">
</div>

### The backend itself
Since we are called Jworks and we mainly focus on Java/Javacript development it should be no surprise that our backend application is written in java with the spring boot framework.  
In general we prefer to write backends in the microservices paradigm, but in this case the backend was sufficiently small that it only consists of 1 microservice.  
The application itself is a pretty standard spring boot application.  
We use a postgreSQL server hosted in RDS as our persistent datastore on the backend, supplemented with an elasticache Redis cluster to cache database queries and configurations for the IOT sensors used in the IOT sensor data ingestion part.  
Our backend service is reachable over a REST interface for the outside world, we will talk more about this interface when we discuss the frontend application.  

### Hosting of the application
The backend application is hosted on our Kubernetes cluster in the AWS cloud. This cluster is an EKS cluster that we use to run several projects for customers and is also used for some of our internal applications.  
The EKS cluster is a multi-worker node cluster setup with multiple Auto Scaling Groups so we can guarantuee almost 100% uptime on our applications that run on this cluster.  
We have been using Kubernetes in different forms ( on-premise, AKS, PKS,  ...) for a long time now which means we have a very clear image of how to use it and how to run applications on a cluster.  
We make heavy use of several key features like: secrets, configmaps, ...  
Our EKS cluster is running several plugins that allow us to quickly configure infrastructure components on the AWS cloud from within our cluster.  
For example the REST interface of the application is exposed through a Kubernetes ingress which is hooked up to the ALB controller plugin.  
This means that whenever we create a new ingress a new Application Load Balancer will be automatically provisioned in the AWS cloud to expose our deployment to the outside world. This makes it very easy to work with and allows us a lot of flexibility.  

## Frontend

<div style="text-align: center;">
  <img alt="Zero Plastic Rivers" src="/img/2020-03-16-ZPR-explained/zpr_arch_frontend.jpg" width="auto" height="40%" target="_blank">
</div>

Our frontend application consists of two parts.  
The first part is aimed at citizens who wish to help the cause, who can notify this surveillance network when they find a bottle as shown in the image below.  
This is the first way that data from the plastic bottles comes into our system. We allow the user to upload an optional image when submitting this data. These images are stored in a secured S3 bucket.  
The second part is aimed at the researchers, and could be seen as the “backend” of the project, where the data given by the GPS trackers and the citizens is visualized in a clear and orderly way.

<div style="text-align: center;">
  <img alt="Zero Plastic Rivers" src="/img/2020-03-16-ZPR-explained/zpr-frontend-application.png" width="auto" height="40%" target="_blank">
</div>

To develop this application we have chosen to use Ionic. [Ionic](https://ionicframework.com/) is a free-to-use web-based framework that allows you to build hybrid mobile apps for iOS and Android, all from one codebase. In other words, Ionic is a tool for cross-platform mobile development. Ionic enables you to develop mobile apps using web technologies and languages like HTML, CSS, JavaScript, Angular, and TypeScript.

### Data visualization

<div style="text-align: center;">
  <img alt="Zero Plastic Rivers" src="/img/2020-03-16-ZPR-explained/zpr_arch_data_ingestion.jpg" width="auto" height="40%" target="_blank">
</div>

One of the most relevant components in this application is the map where the sensors and the plastic bottles in the river are visualized by means of the coordinates registered in these items as shown in the image above. For this we have chosen to use [Leaflet](https://leafletjs.com/) which is a JavaScript Open Source library for adding interactivity to maps. They have a ton of features and plugins to support doing pretty much anything with a map that you can think of.

Ionic offers a wide variety of ready to use plug-ins and one of them is the camera that enables users who decide to participate in this project to take pictures of the bottles to update the status and deterioration of each bottle in the river.

### Frontend Testing

In reference to software testing we have mainly used Unit Testing to reduce the number of errors that are released during deployment, which we consider critical for effective software development. 

### Frontend deployment

Originally the plan was to host this application in a nginx webserver in our EKS cluster. We changed to S3 as it is an easier to maintain solution than running your own webserver on kubernetes. We have setup a hosted zone in Route53 which serves as the entry point of users into our application. Route53 then forwards users who visit zpr.one to our Cloudfront distribution. Cloudfront serves the ionic app from our S3 bucket which has static webhosting enabled. This setup seems optimal as it is low maintenance, tightly secured and highly scalable.


#### Low maintenance
To explain why this setup is low maintenance let's take a look at the components used in this architecture.  
We are making use of Cloudfront, S3 and Route53 in this setup.  
All of these services are managed services provided by AWS.  
This means that there is no maintenance required on our part as AWS guarantees uptime and makes sure that everything is running smoothly.  
The only manual actions that have occurred on our side in this setup so far was to clear the Cloudfront cache after releasing a new version to have the new version more quickly available to users of the app.  

#### Tightly secured
Since we are using only managed services from AWS the burden of patching those services and making sure they are secured is on AWS itself.  
AWS has an excellent reputation on this regard so we feel very comfertable in this regard.  
We also make use of several additional features provided by AWS to secure our application further.  
For example the S3 bucket that is used to host the website is only accessible through the Cloudfront distribution.  
So users do not need access to the S3 resources itself, we implemented this nicely through Bucket policies and IAM access control.  

#### Highly scalable
Since we are only allowing traffic to our application from the Cloudfront distribution this means that we get all the benefits from this global CDN.  
Cloudfront operates on the AWS edge locations which are spread throughout the world.  
Since our application is mostly Belgium based this was not as important to us but the fact that Cloudfront routes its requests over the internal AWS backbone makes a huge difference in speed which is a nice feature if you are working with global applications.  
The S3 service which acts as the origin for our Cloudfront distribution is **nearly infinitely scalable** as proclaimed by AWS itself.  
The interaction between our frontend and backend happens over REST services provided by our backend in the EKS cluster which is exposed over an ALB so we are very confident that we can scale up as needed.  

## IOT sensor data ingestion
Some of our plastic containers send their location via the cellular network at regular intervals.  
These messages reach us via an external partner through the tcp protocol.  
The sensors can receive instructions and updates, but this has to happen inside the same open tcp connection within a very short timeframe.  
This is why we have chosen to develop a seperate java aplication that functions as "sensor gateway" to handle these incoming messages. This is deployed on an elastic beanstalk.  
This gateway consults the elasticache for any needed instructions or updates.  
If a return message is needed, it is sent through the open tcp connection.  
The sensor detection message is then passed on to an SQS queue. From here on, the focus of handling the message is less time-sensitive.  
A Lambda function decodes the message on the queue and then pushes it to another SQS message queue.  
A spring boot backend that is deployed in our kubernetes cluster handles these last events and persists them to our database.  


# security

One key element of the security is controlling who has access to an application. To strengthen security, reduce risk and improve compliance, it is essential that only authorized users get access specific data in an application and that authentication is required before that access is granted. This means that authentication is a critical component for most applications and in this project, it was no exception as we needed to secure the researcher's part of the application so that only researchers have access to advanced functionality.

To perform this authentication, we have chosen to use AWS Cognito as it dramatically simplifies application development by providing an authentication service that is simple to integrate into any modern application. In addition to storing password and e-mail information, Cognito can store standard and custom user account settings. Learn more about AWS Cognito and its advantages [here](https://aws.amazon.com/cognito/).

Another advantage of AWS Cognito is that it supports OpenID Connect which is a simple identity layer built on top of the OAuth 2.0 protocol, which allows clients to verify the identity of an end user based on the authentication performed by an authorization server or identity provider (IdP), as well as to obtain basic profile information about the end user in an interoperable and REST-like manner. Learn more about OpenID Connect [here](https://openid.net/connect/).

### AWS Cognito and OpenID Connect

To carry out authentication using the OpenID Connect standard with Cognito we have chosen to use the Authorization Code Grant which is the preferred and most secure method for authorizing end users. Instead of directly providing user pool tokens to an end user upon authentication, an authorization code is provided. This code is then sent to a custom application that can exchange it for the desired tokens. Because the tokens are never exposed directly to an end user, they are less likely to become compromised.

The image below illustrates the flow, and, in this [blogpost](https://aws.amazon.com/blogs/mobile/understanding-amazon-cognito-user-pool-oauth-2-0-grants/), you can find more information about this approach.

<img alt="Authorization Code Grant Diagram" src="{{ '/img/2020-03-16-ZPR-explained/zpr_aws_cognito.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto;">

To secure our frontend we have used Manfred Steyer's [Angular-oauth2-oidc](https://github.com/manfredsteyer/angular-oauth2-oidc) library but you could use any library as long as it is [OpenID certified](https://openid.net/certification/). 

Our colleague Jeroen wrote a fantastic [blogpost](https://ordina-jworks.github.io/security/2019/08/22/Securing-Web-Applications-With-Keycloak.html#setting-up-the-front-end-and-back-end-applications) that was very helpful to us. Jeroen shows the necessary steps to follow to secure any web application using OpenID Connect.

# D-Day

Tuesday December 17th was D-day. Then the bottles and sensors were finally thrown into the water. We had a tight timing because the bottles had to be thrown in the Scheldt at high tide, at 3 different locations. 
It was a nice dry day and our client was quite nervous. Are all the signals coming in properly, is the sensor packed waterproof, ...?  Especially because we were not able to test so much with the sensors due to the tight timing. 
High tide, time to throw the bottles in the water and register the sensor via our Ionic App. Everything runs smoothly and the signals from the sensors come in. You see the customer cheer up and leave satisfied to the next location. Everything goes as planned all day long and after just a few days the first users start registering the objects on our website.
And today, so many weeks later, we still receive new registrations. 
It was a nice ending of a fascinating and instructive project. 

# developer-experience

Zero Plastic Rivers was my first experience with AWS and actually my first cloud project.  
In the beginning it was quite intimidating because a lot of different technologies of AWS are used.  
But soon it turned out to be quite easy to configure and with some help from some colleagues (thanks guys) I got everything up and running pretty quickly.  
In the beginning I was quite sceptical about the use of lambdas in our application, I didn't immediately see the advantage of it but in the end it turned out to be the best option, especially if we want to build applications with many more sensors in the future. Although it was sometimes difficult to find the correct documentation.  
My favorite technology was definitely Cognito. In a few lines of code you have a user administration of an entire application without having to worry about possible security holes.  
In the end it was a very pleasant experience to get started with AWS, now I just have to find some free time to study for my AWS certificate.


# Conclusion
