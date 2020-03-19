---
layout: post
authors: [bas_moorkens, mohammed_laghzaoui]
title: "Zero Plastic Rivers - explained"
image: /img/chatbot.png
tags: [AWS]
category: Machine Learning
comments: true
---

> Foreword
> Foreword
> Foreword

# Table Of Contents

* [Introduction](#introduction)
* [Architecture](#architecture)
* [Security](#security)
* [Developer experience](#developer-experience)
* [Conclusion](#conclusion)

# Introduction

# architecture

To realise this social relevant project we opted to build and run this solution on top of the AWS platform.  
At Jworks we have been working for some while now in order to build reference cases regarding frontend and backend application hosting on AWS and the ZPR project has proven to be an excellent candidate to put our reference architectures into practice.  

This is the architectural big picture overview of the ZPR solution.  
In the following sections we will zoom in on several parts of this architecture to explain certain choices we made.  

<img alt="ELIZA" src="{{ '/img/2020-03-16-ZPR-explained/zpr_architecture.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto;">

This big architectural picture can be divided in 3 big sections which we will highlight below:

* Backend java application
* Frontend ionic app
* Data ingestion

## Backend application
Since we are called Jworks and we mainly focus on Java/Javacript development it should be no surprise that our backend application is written in java with the spring boot framework.  
The spring boot application is hosted on our Kubernetes cluster in the AWS cloud. This cluster is an EKS cluster that we use to run several projects for customers and is also used for some of our internal applications.  
The EKS cluster itself is running with worker nodes in multiple ASGs so we can guarantuee almost 100% uptime on our applications that run on this cluster.  
The backend uses several other AWS services to store and retrieve it's data.  
An RDS instance is used as the persistent storage behind the application.  
And to reduce response times on our backend we put in place an elasticache Redis cluster to cache database queries and results.  
The backend application deployment is connected to a service on kubernetes and is attached to an ingress.  
The ingress controller running on our cluster is tied to the AWS Elastic Load Balancing service.  
Whenever we expose an application or our cluster it get's tied to an ALB automatically so it can be exposed to the outside world.  
This is important for our backend application as the application exposes REST service.  
These REST services are used by the frontend application to power the Ionic app. 



## Frontend 
Our frontend application is an Ionic app that is hosted on S3 and cloudfront.  
Originally the plan was to host this application in a nginx webserver in our EKS cluster.  
We changed to S3 as it is an easier to maintain solution than running your own webserver on kubernetes.  
We have setup a hosted zone in Route53 which serves as the entry point of users into our application.  
Route53 then forwards users who visit zpr.one to our Cloudfront distribution.  
Cloudfront serves the ionic app from our S3 bucket which has static webhosting enabled.  
This setup seems optimal as it is **low maintenance**, **tightly secured** and **highly scalable**.  

### Low maintenance
To explain why this setup is low maintenance let's take a look at the components used in this architecture.  
We are making use of Cloudfront, S3 and Route53 in this setup.  
All of these services are managed services provided by AWS.  
This means that there is no maintenance required on our part as AWS guarantees uptime and makes sure that everything is running smoothly.  
The only manual actions that have occurred on our side in this setup so far was to clear the Cloudfront cache after releasing a new version to have the new version more quickly available to users of the app.  

### Tightly secured
Since we are using only managed services from AWS the burden of patching those services and making sure they are secured is on AWS itself.  
AWS has an excellent reputation on this regard so we feel very comfertable in this regard.  
We also make use of several additional features provided by AWS to secure our application further.  
For example the S3 bucket that is used to host the website is only accessible through the Cloudfront distribution.  
So users do not need access to the S3 resources itself, we implemented this nicely through Bucket policies and IAM access control.  

### Highly scalable
Since we are only allowing traffic to our application from the Cloudfront distribution this means that we get all the benefits from this global CDN.  
Cloudfront operates on the AWS edge locations which are spread throughout the world.  
Since our application is mostly Belgium based this was not as important to us but the fact that Cloudfront routes its requests over the internal AWS backbone makes a huge difference in speed which is a nice feature if you are working with global applications.  
The S3 service which acts as the origin for our Cloudfront distribution is **nearly infinitely scalable** as proclaimed by AWS itself.  
The interaction between our frontend and backend happens over REST services provided by our backend in the EKS cluster which is exposed over an ALB so we are very confident that we can scale up as needed.  

## Data ingestion
Beanstalk + IOT -- Bousson interesse?

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


# developer-experience


# Conclusion
