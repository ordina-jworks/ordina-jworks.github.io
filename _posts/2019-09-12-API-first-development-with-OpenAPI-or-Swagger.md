---
layout: post
authors: [nick_van_hoof]
title: 'API first development with OpenAPI or Swagger'
image: /img/2019-09-12-API-first-development-with-OpenAPI-or-Swagger/featured-image.png
tags: [API]
category: Cloud
comments: true
---

# Table of content


# API first development - Why, how and what
> Great communication is key to great software engineering.

Not only between people.
Also between application or services.
If your applications cannot communicate properly, you'll never be able to expose the functionality that is key to a good product.

We also see the following trends in software engineering:
* **Shift towards the cloud.**  
Instead of big monolitic applications we are building lot's of smaller (micro)services.
All communication between those services goes though the API.
* **Multiple frontend applications use the same backend.**  
And often these applications are created by separate teams.
* **API's carry business value.**  
Yes, there is money in your API.
An API exposes the functionality of your product.
A good API allows user to integrate with your product with ease.
Thus making your product a great choice.

In all of the cases a above there is value (even money!) in good communication between services.
And that's why you should practice API first development.
Put your communication first!

***What do I need to do to practice API first development?***
* Understand that the API is the interface for your application.  
It is the intersection where multiple services join hands to couple there functionality.
* First design your API.  
The implementation comes next.
This will allow teams to develop there applications separately because they both know and understand how communication between the services will happen.
The contract between services is set.

Now that we understand the importance of and value of API first design let's see how the Swagger/OpenAPI spec can help you with that.

# Story
Suppose that we ***Ordina*** are hosting a conference where multiple technical and agile sessions will be given.
User can check session information and register for sessions.
A backend service maintains this information.
The website is exposing the information.
There is also an app for `Android` and one for `IOS`.
The API endpoint that gives you all the sessions is also publicly exposed to allow developers to have some fun with it.
So we have multiple services interacting with the backend.

<div style="text-align: center;">
  <img src="/img/2019-09-12-API-first-development-with-OpenAPI-or-Swagger/design.png" width="50%" height="50%" target="_blank">
</div>

The applications are created by different teams and they all embrace the **API first** approach.
They read this blog and realised that by agreeing on the common interface first they could develop separately without impacting each other.
So hooray for API first development. 

# API first development with OpenAPI/Swagger
The functional analysts and a couple of developers of the team are sitting together to agree on how the API should be defined.
* A client should be able to fetch all sessions via the API
* A client should be able to create a new session via the API

Designing an API is easier when you can visualise the API.
Let's bring in the OpenAPI spec.

> The OpenAPI specification allows you to define your API in a descriptive language (json or yaml) and nicely visualise it

From now on I will be speaking about OAS (OpenAPI Specification) instead of writing OpenAPI/Swagger all the time.
Let's now use OAS to help us with our API First approach and design our API.

Let me introduce you to [https://editor.swagger.io](https://editor.swagger.io).
A portal to visualise your OAS.
Easy to use and offering all the functionality we need for this example.

I'll keep it simple and create the OAS for the API exposing the endpoint where consumers of the API can fetch all sessions of the conference.
The OAS allows you to use JSON or Yaml to describe your API.

// TODO: replace by gif that switches between views

<div style="text-align: center;">
  <img src="/img/2019-09-12-API-first-development-with-OpenAPI-or-Swagger/apioverviewyml.png" width="100%" height="100%">
</div>

You can dive deeper into an endpoint by clicking it.

<div style="text-align: center;">
  <img src="/img/2019-09-12-API-first-development-with-OpenAPI-or-Swagger/apiyml.png" width="100%" height="100%">
</div>
  
Find the descriptive yaml via [this](https://gist.github.com/Nxtra/8ff9a7fd33186309e909df8f5a20cb28) gist.

As you can see from the example the OpenAPI specification is very readable.
Even if it's new to you, you should be able to deduct what is written in the yaml.
You like looking in the yaml?
Sure you don't! 
There is this great visualisation to the right of it.
This very clearly visualises what your API can do.
Clear visualisations mean clear communication. 

The example is short.
Describing a whole API, the file might become quite large.
But that's no problem.
The OpenAPI spec allows you to split your definitions over multiple files which you can reference from within other files.

> Takeaways: Easy descriptive language & great visualisations

You want to expose your beautiful visualisation to your clients.
They shouldn't have to past a `yaml` file in a window of there browser all the time.
How do we do that? 
Let's find out next.

# Hosting your visualisations
The API specifications should be easily accessible for you and your clients.
The specification on which you agreed should be hosted somewhere for everyone to see.
Sometimes companies have there own in house tools to visualise OAS.
If your company hasn't there are plenty of tools to visualize your API defined with OAS.

A couple of hosted solutions:
* swaggerhub.com: Platform for API design and hosting by `SMARTBEAR` itself
* next.stoplight.io
* readme.io

<div style="text-align: center;">
  <img src="/img/2019-09-12-API-first-development-with-OpenAPI-or-Swagger/hosted-solutions.gif" width="100%" height="100%">
</div>


* Redocly: [Generator](https://github.com/Redocly/create-openapi-repo) for a github repo that allows you to host via github pages. 

<div style="text-align: center;">
  <img src="/img/2019-09-12-API-first-development-with-OpenAPI-or-Swagger/redoc.gif" width="100%" height="100%">
</div>



# postman import
# swagger code gen: generate code via cli
# swagger code gen: generate code via maven / gradle plugin
# swagger with Spring
# swagger with API Gateway on AWS
# generate consumer driven contract testing?



