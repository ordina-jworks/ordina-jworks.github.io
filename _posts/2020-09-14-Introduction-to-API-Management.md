---
layout: post
authors: [kris_jordens]
title: 'Introduction to API Management'
image: /img/kris_Jordens.jpg
tags: [API Management, API Gateway, Products, Responsibilities]
category: API
comments: true
---

        
# Introduction to API Management
        
## Problem description
<!--
TODO: Add introduction table
-->
       
        
In our current digital world where everyone is creating API’s for exposing data internally and for external partners, we should take a look on how we can manage and control them.
Most of us also know that we not only have to build the API, but we need to foresee additional responsibilities with   it. Some that actually shouldn’t be the responsibility of your API. Like for example Authentication, or certain routing policies, etc.
        
Well, that’s why I went out searching on the internet for the best solution and found that an API Management tool might solve a lot of those problems and even add extra value within your landscape.
        
        
You can read all about it in this post. I hope you enjoy it!
        
        
                
## Investigation
        
Before going into the details, let’s take a look on how most of the current API landscapes are build and how we can improve those with an API management tool.
Without an API manager, your landscape will look a lot like in the picture below where the API’s that are created are the direct integration point to the business domain data.
(Source : https://www.popularowl.com/blog/apis-and-api-first-design/)
	     
<img src="/img/2020-09-14-Introduction-to-API-Management/WithoutApiManagementTool.jpg" alt="API landscape without an API management tool" width="500" height="350" class="image fit">
        
Any integration of security needs to be done in your API. This sometimes leads to duplicate code and the fact that your API is not only responsible for exposing the Data, but also for implementing the right security levels.
This changes if we implement an API Management tool, so lets take a look at that.
            
<img src="/img/2020-09-14-Introduction-to-API-Management/WithApiManagementTool.jpg" lt="API landscape with an API management tool" width="400" height="350" class="image fit"/>
        
            
If the Gateway is installed in the same organizational structure, it’s not required to have your API’s implementing additional security settings.
The API gateway will do the necessary checks before allowing the clients to access the Data.
I hear you thinking already “We’re not going to install an additional tool, only for splitting out the security rules from the API’s”. But that’s not the only thing an API management tool can do.
I listed out the most important responsibilities for you, so that you can understand the power and the actual benefits of an API Management tool:

## Responsibilities of an API Management tool
        
        
     
<dl style="margin-left:2%;">
  <dt>-	Basic Authentication</dt>
  <dd>Enables HTTP BASIC Authentication on an API.</dd>
  <dt>-	Authorization</dt>
  <dd>Enables fine grained authorization to API resources based on authenticated user roles.</dd>
  <dt>-	Caching resources</dt>
  <dd>Allows caching of API responses in the Gateway to reduce overall traffic to the back-end API.</dd>
  <dt>-	Rate limiting</dt>
  <dd>Enforces rate configurable request rate limits on an API. This ensures that consumers can't overload an API with too many requests.</dd>
  <dt>-	White/Blacklisting</dt>
  <dd>Allowing or denying a specified set of IP addresses</dd>
  <dt>-	Time Restricted Access</dt>
  <dd>Requests matching the regular expression and made outside the specified time period will receive an error code.</dd>
  <dt>-	Quota’s </dt>
  <dd>Provides a way to limit the total number of requests that can be sent to an API.</dd>
  <dt>-	Transfer Quota</dt>
  <dd>Provides a way to limit the total number of bytes that can be transferred from (or to) an API.</dd>
  <dt>-	URL Rewriting </dt>
  <dd>Responses from the back-end API will be modified by fixing up any incorrect URLs found with modified ones. </dd>
</dl> 
<samp>A lot more can be added or customized, depending on the tool of course. There is a wide range of available products as you can see <a href="https://www.popularowl.com/reviews/which-api-gateway/" target="_blank">here</a>. 
I mostly focused on the Open source tools like APIMan, Kong API Gateway, WSO2 API Manager.
</samp>


## Advantages of an API Gateway

<dl style="margin-left:2%;">
<dt>- Security.</dt>
<dt>- Latency (The gateway can talk directly to the right microservice, and is able to cach the Response).</dt>
<dt>- Authentication and authorization done in one place.</dt>
<dt>- Retry/Circuit breaker possibility.</dt>
<dt>- Set throttling/limiting possibilities.</dt>
<dt>- Load balancing.</dt>
<dt>- Logging and tracing.</dt>
<dt>- Maintainability and scalability.</dt>
</dl>



## Downfalls:
As you might figured out by yourself already, if this API Gateway is placed before all you’re API’s it creates a SPOF (Single point of Failure). 
There are other ways to handle that like setting up multiple API gateways for different endpoints, but that also creates more overhead.
Example of multiple API gateways (Source: https://microservices.io/patterns/apigateway.html ):
    
<img src="/img/2020-09-14-Introduction-to-API-Management/MultipleApiGateways.png" alt="API landscape without an API management tool" width="400" height="250" class="image fit">
If in this example the Web app API Gateway gets stuck for any reason at all, the client is still able to connect to the other Gateways and request for the data he/she needs.
Which solution to choose, is of course depending on your preferences.

# Try-outs
Just to try a few things, i installed apiman (and the required server, etc) on to my laptop and used one of my already created API's to test.
It was actually quite simple to start, however I did download a few versions of it, as some didn't work from the 1st minute.
I downloaded the latest version from <a href="http://www.apiman.io" target="_blank">http://www.apiman.io</a>.>

Once it got installed I started to play around with it.
It has some pre-configured settings which makes it easy.
There is a lot of documentation available. 
And it's open source, so everything is available on the web.
<img src="/img/2020-09-14-Introduction-to-API-Management/APIMAN_Login.PNG" alt="APIMAN Login screen" width="600" height="375" class="image fit">

After i was able to run apiman, i searched on how to set it up.
I'm not going in to much dept of apiman settings, but very important was that everything in apiman starts with the Organization. 
2ndly you need to setup a plan, which is basically a collection of policies that will be applied to requests made to Services being access through it.
As last you need to setup a Service. 
A service contract is simply a link between an application and a service through a plan offered by that service. 
When a service contract is created, the system generates a unique API key specific to that contract. 
All requests made to the service through the API Gateway must include this API key.

<img src="/img/2020-09-14-Introduction-to-API-Management/APIMAN_Indexpage.PNG" alt="APIMAN start screen" width="600" height="375" class="image fit">
Setting up an organization (OrgHome) and creating services.
<img src="/img/2020-09-14-Introduction-to-API-Management/APIMAN_Organization-API.PNG" alt="APIMAN Organization and Services" width="800" height="300" class="image fit">

You can mark the service public, so that everyone can access it, or you can create a Client App and generate a required key via a plan.
in this example, i created a 'SearchCustomers' client app, where the client needs to use the API-Key in the request to get the response back from our service.
Our service didn't implement any security or authority for this.
Apiman will take the responsibility of implementing this.
Only if the client uses the right endpoint with the exact API-key, Apiman will retrieve the requested data from our backend service and send the response back to the client.
<img src="/img/2020-09-14-Introduction-to-API-Management/APIMAN_ClientApps-APIKey.PNG" alt="APIMAN Client apps and API-Key" width="800" height="400" class="image fit">

As last i tried to use the Apiman RESTapi to create a new organization, plan and services.
I had some struggles to make it work, but eventually i was able to create a new organisation.
i didn't find yet how to create a plan and client app.
TODO -> 
want to be sure that the tool also could be used in an automated way, and that we could registrate API's via the Apiman REST api.
full export and full import is possible via REST api. this way you can add API's, clients , etc.
one key note , My tomcat server does not come with integrated Keycloak authentication. so i was not able to add users via the REST api. if you're running in a WildFly server, this would be default.

Will be continued.
       
## Conclusion
If you still don’t have an API Management tool in your organization, think about the benefits and segregation of duties/responsibilities of your API’s and the API management tool.
Take the time to try out a few. 
For example  apiman has some prebuild versions that you can download and use immediately.
Even if you only have a few API’s running in your organization, you probably will benefit from using such a tool to manage your Security, Routing , or other Policies you want to implement.
