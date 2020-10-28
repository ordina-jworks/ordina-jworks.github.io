---
layout: post
authors: [Kris_Jordens]
title: 'Introduction to API Management'
image: /img/kris_Jordens.jpg
tags: [API Management, API Gateway, Products, Responsibilities]
category: API
comments: true
---

        
# Introduction to API Management

## Table of contents
* [Introduction to API Management](#Introduction-to-API-Management)
    * [Problem description](#Problem-description)
    * [Investigation](#Investigation)
        * [API Management or API Gateway?](#API-Management-or-API-Gateway)
        * [API landscape without an API management tool](#API-landscape-without-an-API-management-tool)
        * [API landscape with an API management tool](#API-landscape-with-an-API-management-tool)
        * [Responsibilities of an API Management tool](#Responsibilities-of-an-API-Management-tool)
        * [Challenges](#Challenges)
            * [Multiple API gateways configured](#Multiple-API-gateways-configured)
            * [Clustering gateways](#Clustering-gateways)            
    * [API management products](#API-management-products) 
    * [Hands-on](#Hands-on)
        * [Installation](#Installation)
        * [Setup](#Setup)
        * [Automation](#Automation)
    * [Conclusion](#Conclusion)



## Problem description

In our current digital world where everyone is creating APIs to expose data for internal usage, 
or monetizing APIs for external partners, 
we should look at how we can manage and control them.  
Most of us know that in addition to building the API, we also need to provide additional responsibilities. 
Some are just a necessary evil, like adding cross-cutting concerns.  
Keeping an overview of all available APIs can become a struggle these days.  

Well, instead of trying to reinvent the wheel, we searched for the best solution and found that 
an API Management tool can solve a lot of those problems and add extra value within your landscape.  
An API management tool helps you with setting the responsibilities on the right level for your exposed services, 
and so ensure that your services implementing all required policies and security.  
You can add a lot of extra functionality and most importantly it can be implemented in one tool!  
That’s one of the reasons it is important for your business to implement such a tool in your organization.
        
                
## Investigation

### API Management or API Gateway?
The terms API management and API gateway are often used interchangeably, which is not correct.
An API management tool refers to the general API management solution to manage your APIs.
This mostly indicates that they are talking about the management application and its features.  
An API gateway is the main component within an API management tool.
The gateway is actually middleware that is placed in front of your services and acts as a single entry point 
to administrate, route and secure your services.   
The management tool can include one or multiple API gateways, depending on the solution needed in the organization.


### API landscape without an API management tool
Before going into the details, let’s take a look on how most of the current API landscapes are build 
and how we can improve those with an API management tool.  
Without an API manager, your APIs will be the direct integration point to the business domain data.
Any integration of for example security, needs to be implemented in your API. 
This sometimes leads to duplicate code and the fact that your API is not only responsible for exposing the data, 
but also for implementing other cross-cutting functionalities.  
	     
<img src="/img/2020-09-14-Introduction-to-API-Management/WithoutApiManagementTool2.jpg" alt="API landscape without an API management tool" width="350" height="200" class="image fit">

### API landscape with an API management tool
This all changes when we implement an API Management tool.

<img src="/img/2020-09-14-Introduction-to-API-Management/WithApiManagementTool2.jpg" alt="API landscape with an API management tool" width="500" height="350" class="image fit" style="vertical-align:middle;margin-left:2%"/>       

In this situation an API gateway is deployed between the client and the APIs.  
As a single entry point, all request first have to pass the gateway before they are forwarded to the right service.
An API gateway enables to move most of the cross-cutting concerns which an API normally has to implement 
to the API gateway.
This means that if the gateway is installed in the same organizational structure, 
it’s not required for your APIs to implement additional cross-cutting functionalities.  
The API gateway will be responsible for performing the necessary checks before allowing the clients 
to access the data.
You might think it's overkill to install an additional tool, 
only for splitting out security rules from the APIs", 
but that’s not the only thing an API management tool can do.

### Responsibilities of an API Management tool
We listed out the most important responsibilities, 
to highlight the power and the actual benefits of an API Management tool:            
     
1.	Authentication 
    * Enables one of the most important parts of security on an API. 
    Validating the identity of a person, application, or system!  
    There are different kinds of authentication:   
        * Http Basic Authentication
            * Using this approach, a user agent simply provides a username and password to prove who they are.  
            This approach does not require cookies, session ID’s, or login pages 
            because it leverages the HTTP header itself. 
            While simple to use, this method of authentication is vulnerable to attacks 
            that could capture the user’s credentials in transit.
            
        * OAuth
            * OAuth 2.0 is the best choice for identifying personal user accounts and granting proper permissions.  
            With this method, the user logs in to a system. 
            That system will then request authentication, usually in the form of a token. 
            The user will then forward this request to an authentication server, 
            which will either reject or allow this authentication.
        
        * OpenID Connect & OAuth 2.0 API
            * OpenID Connect is a simple identity layer on top of the OAuth 2.0 protocol, 
            which allows computing clients to verify the identity of an end-user 
            based on the authentication performed by an authorization server, 
            as well as to obtain basic profile information about the end-user in an interoperable and REST-like manner.
        
        * API Keys
            * An API key is an identifier meant to identify the consumers identity.
            A key is generated the first time a user attempts to gain authorized access to a system through registration. 
            From there, the API key becomes associated with a secret token, 
            and is submitted alongside requests going forward. 
            When the user attempts to re-enter the system, 
            their unique key is used to prove that they are the same user as before. 
            This API authentication method is very fast and reliable but is frequently misused. 
            More importantly, this method of authentication is not a method of authorization.   
2.	Authorization 
    * Enables fine grained authorization to API resources based on authenticated user roles.  
    This involves checking resources that the user is authorized to access or modify via defined roles.
    In some situations, the API gateway verifies a token with an external authorization service 
    and propagates it to the downstream service.
3.  Caching resources
    * Allows caching of API responses in the gateway to reduce overall traffic to the back-end API.  
    Latency will be improved because the API gateway can talk directly with the back-end service. 
    Or it can use the cached resource and then it doesn't have to fetch the information multiple times.  
    With caching you also avoid that the back-end service will be overloaded by requesting the same information repeatedly.  
    Resources can be cached for a specified time-to-live (TTL) period.
    The gateway will retrieve the resource again from the back-end service once the TTL has expired.
4.  White/Blacklisting possibilities
    * Allow/Block calls to specific APIs.
    * Allow/Block all calls from a given application.
    * Allow/Block requests coming from a specific IP address.
    * Allow/Block a specific user from accessing APIs.
5.  Time Restricted Access
    * Requests matching the regular expression but made outside the specified time period will receive an error code.  
    This is used to allow access to an API only during certain times.    
6.  Quota’s 
    * Rate limiting
    	* Enables to set a rate-configurable limit to requests on an API.     	
    	If your API becomes overloaded, its performance will suffer, and all customers will be impacted.  
        Rate limiting (also called throttling) ensures that a single user cannot 
        intentionally or unintentionally overwhelm an API with too many requests.  
    	In case throttling kicks in, the user will receive a response status code 429 (meaning "Too Many Requests").
    	A Retry-After header might be included to this response indicating how long he/she must wait 
    	before making a new request will work again.
    * Transfer Quota
    	* Provides a way to limit the total number of bytes that can be transferred from or to an API.
7.  URL Rewriting 
    * Responses from the back-end API can be modified by fixing up any incorrect URLs found with modified ones.  
    In some cases, an API might return URLs to follow up action or data endpoints. 
    In these cases, the back-end API will likely be configured to return a URL pointing to the unmanaged API endpoint.  
    This policy can fix up those URL references so that they point to the managed API endpoint (the API gateway endpoint) instead. 
8.  Transformation
    * This enables you to convert between different formats, for example from JSON and XML. 
    If an API is implemented to return XML, but a client would prefer to receive JSON data, 
    this policy can be used to automatically convert both the request and response bodies. 
    This way, the client can work with JSON data even though the back-end API requires XML.
9.  Monitoring
    * Some tools let you visualize, query, route, archive, and take actions on the metrics or logs 
    like for example the Azure API management tool.  
    Others just offer basic metrics or include a third-party tool like Elasticsearch to do the job.
    
A lot more can be added or customized, depending on the tool of course. 
There is a wide range of products available, 
so please refer to the product list below if you want to know the ones used currently.  
To get hands-on experience, we mostly focused on the Open source tools like Apiman, Kong API gateway, WSO2 API Manager.



### Challenges

There are a few things to consider before you select the right tool for your organization.  
One of the most important thing is think about the high availability of the services that you provide.  
As you might notice in the previous example, 
if an API gateway is placed before all your APIs it creates a Single Point of Failure (SPOF).  
There are ways to handle that like setting up multiple API gateways for different endpoints 
or clustering your API gateways.

#### Multiple API gateways configured
<img src="/img/2020-09-14-Introduction-to-API-Management/MultipleAPIGateways2.JPG" alt="API landscape without an API management tool" width="500" height="350" class="image fit" style="vertical-align:middle;margin-left:2%" />

In this example you can see that 2 different gateways are created to separate mobile from other requests. 
The endpoint of the mobile gateway will in this case be different from the web gateway.
If for any reason at all the mobile API gateway gets stuck, 
the client will still be able to connect to the other gateway and request for the data he/she needs.


#### Clustering gateways
Another way to ensure high availability is for example to cluster your API gateways.
Combined with a scalable microservice architecture, 
a high availability API gateway cluster ensures your application can handle large volumes of traffic 
and react to unexpected spikes, while being resilient to hardware failures.  
There are big differences between products when you want to cluster an API gateway.
Most products do recommend or even require to setup a load balancer in front of the API gateway cluster. 
In fact, to avoid another single point of failure, it is recommended to be able to scale this load balancer as well. 
Or have a failover scenario in place in case the load balancer crashes. 
This way you can be sure that your services are always available.  
Some other products require you to scale additional tools like for example Elasticsearch.  
An advantage of this solution with a load balancer,  is that the client always connects to the same endpoint.

<img src="/img/2020-09-14-Introduction-to-API-Management/HA-Gateways.JPG" alt="API landscape without an API management tool" width="600" height="350" class="image fit" style="vertical-align:middle;margin-left:2%" />

This solution would be the most secure way of implementing an API gateway, 
ensuring that your services are available 24/7.  
Which solution to go for, is of course depending on your preferences 
and the level of availability that needs to be guaranteed.

## API management products

We referred to the Gartner magic quadrant to get the list of most common API management tools currently on the market.
You can find most of them here in alphabetical order.

<img src="/img/2020-09-14-Introduction-to-API-Management/GartnerMagicQuadrant.JPG" alt="Gartner Magic Quadrant" width="400" height="400" class="image fit" style="float:right    ;horzontal-align:middle;margin-left:2%;margin-right:50%;vertical-align:right" />

* Red Hat 3 Scale 
* Akamai API Gateway  
* Akana API Management
* API Man (open source)
* Apigee API Management
* AWS API Gateway
* Axway - AMPLIFY API Management
* Azure API Gateway
* Boomi
* Broadcom
* CA API Gateway
* Express API Gateway (open source)
* Fusio API Management (open source)
* IBM API Connect
* Kong API Gateway (open source)
* Loopback API Framework (open source)
* MuleSoft Anypoint API Management
* Oracle API Manager
* SAP API Manager
* Sensedia API Management Platform
* Sentinet 
* Software AG API Gateway
* TIBCO Mashery
* Tyk API Gateway (open source)
* WSO2 API Manager (open source)



## Hands-on
### Installation
Just to try a few things, we installed Apiman (and the required server) as a standalone solution on to a laptop 
and used some existing APIs to test.
It was actually quite simple, 
however we did download a few versions of it, as some didn't work immediately.  
One of the main advantages is that it has some pre-configured settings which made it easy to start.  
Apiman is an Open Source tool, 
so a lot of documentation and even source code examples are available on the web.  
If you prefer, it is also possible to dockerize it and run this in a container.  
The latest version of Apiman can be found 
<a href="http://www.apiman.io" target="_blank" rel="noopener noreferrer">here</a>, 
or in case you want to try earlier versions or want to try Apiman embedded in another server, 
you can also look in 
<a href="https://apiman.gitbooks.io/apiman-installation-guide/content/installation-guide/servlet/install.html#_installing_in_jboss_eap_7" target="_blank" rel="noopener noreferrer">this</a> link.  

Once installed, we started to play around with it.  

<img src="/img/2020-09-14-Introduction-to-API-Management/APIMAN_Login.PNG" alt="APIMAN Login screen" width="600" height="375" class="image fit" style="vertical-align:middle;margin-left:2%" />

### Setup
We did some research on how to set it up, and on the key aspects of Apiman.  
It's not our intention too go to much in depth of Apiman or the settings, 
but we want to highlight a few base principles to help you understand how easy it was to try it out and play with it.  
The first very important part in Apiman was that everything starts with an Organization.  
Secondly you need to set up a plan, 
which is basically a collection of policies that will be applied to the incoming requests.  
Finally you need to setup a service. 
A service contract is simply a link between an application and a service through a plan offered by that service. 
When a service contract is created, the system generates a unique API key specific to that contract. 
All requests made to the service through the API gateway must include this API key.  

Apiman start Screen.  
<img src="/img/2020-09-14-Introduction-to-API-Management/APIMAN_Indexpage.PNG" alt="APIMAN start screen" width="600" height="375" class="image fit" style="vertical-align:middle;margin-left:2%" />

Setting up an organization (OrgHome) and creating services.

<img src="/img/2020-09-14-Introduction-to-API-Management/APIMAN_Organization-API.PNG" alt="APIMAN Organization and Services" width="800" height="300" class="image fit" style="vertical-align:middle;margin-left:2%" />

In this example you can see a Customer API which fetches Customer information from a Spring Boot application 
running in IntelliJ.  
Every service can be marked public, so that everyone can access it, 
or you can for example secure it by creating a client app and generate a required key via a plan.   
In the screenshot below you can see that we created a 'SearchCustomers' client app, 
where the client needs to use the API-Key in the request to get the response back from our service.
Our service (Spring Boot application) didn't implement any security or authority for this.
Apiman will take the responsibility of implementing this.
Only if the client uses the right endpoint with the correct API-key, 
Apiman will retrieve the requested data from our back-end service and sends the response back to the client.
 
<img src="/img/2020-09-14-Introduction-to-API-Management/APIMAN_ClientApps-APIKey.PNG" alt="APIMAN Client apps and API-Key" width="800" height="400" class="image fit" style="vertical-align:middle;margin-left:2%" />

### Automation

Finally we wanted to be sure that we can use the tool in an automated way, 
so we tried to use the Apiman REST API to create new organizations, plans and services.
We had some struggles to make it work, but eventually we were able to create everything we wanted.
Via the REST API we have the possibility to check, add or remove anything you want.
The built in Apiman-UI is also built on these REST APIs, 
so anything you can do in the application should be possible to execute via the API service.
More on this can be found in the <a href="http://www.apiman.io/latest/api-manager-restdocs.html" target="_blank" rel="noopener noreferrer">API-manager-restdocs</a>.

One sidenote, the downloaded tomcat server does not come with an integrated Keycloak server, 
so we were not able to add users via the REST API. 
If you're running the standalone WildFly server, this would be integrated by default.  



       
## Conclusion
There are multiple reasons why you should consider implementing an API Management tool in your organization.
Think about the benefits and segregation of duties/responsibilities between your APIs and the API management tool.  

You will be able to manage and control your APIs in one tool.
You can implement and adjust security levels like authentication and authorization in one place.  
This tool makes it easy to add additional policies to different back-end services. 
It can improve current latency problems and will improve the maintainability and scalability of your API landscape.  
If you are still not convinced, take the time to try out a few. 
For example, Apiman has some prebuilt versions that you can download and use immediately.  

Even if you only have a few APIs running in your organization, 
you probably will benefit from using such a tool to manage your security, 
routing, or other policies you want to implement.  

With an API management tool you can make sure that all your APIs just do what they need to do 
(sharing business related data), 
and that the API management tool takes care of the other cross-cutting functionalities where it is required.  

  
  
  
##### Sources
<a href="https://www.frizztech.com/know-about-ekart-api-integration/" target="_blank" rel="noopener noreferrer">https://www.frizztech.com/know-about-ekart-api-integration/</a>.

<a href="https://koukia.ca/a-microservices-implementation-journey-part-4-9c19a16385e9" target="_blank" rel="noopener noreferrer">https://koukia.ca/a-microservices-implementation-journey-part-4-9c19a16385e9</a>.

<a href="https://www.popularowl.com/reviews/which-api-gateway/" target="_blank" rel="noopener noreferrer">https://www.popularowl.com/reviews/which-api-gateway/</a>.

<a href="https://www.okta.com/blog/2019/02/the-ultimate-authentication-playbook/" target="_blank" rel="noopener noreferrer">https://www.okta.com/blog/2019/02/the-ultimate-authentication-playbook/</a>.

<a href="https://blog.restcase.com/4-most-used-rest-api-authentication-methods/" target="_blank" rel="noopener noreferrer">https://blog.restcase.com/4-most-used-rest-api-authentication-methods/</a>.

<a href="https://apiman.gitbooks.io/apiman-user-guide/content/" target="_blank" rel="noopener noreferrer">https://apiman.gitbooks.io/apiman-user-guide/content/</a>.

<a href="https://docs.microsoft.com/de-de/dotnet/architecture/microservices/architect-microservice-container-applications/direct-client-to-microservice-communication-versus-the-api-gateway-pattern" target="_blank" rel="noopener noreferrer">https://docs.microsoft.com/de-de/dotnet/architecture/microservices/architect-microservice-container-applications/direct-client-to-microservice-communication-versus-the-api-gateway-pattern</a>.

<a href="https://konghq.com/learning-center/api-gateway/api-gateways-for-high-availability-clusters" target="_blank" rel="noopener noreferrer">https://konghq.com/learning-center/api-gateway/api-gateways-for-high-availability-clusters</a>.

<a href="https://docs.axway.com/bundle/APIGateway_762_AdministratorGuide_allOS_en_HTML5/page/Content/AdminGuideTopics/high_availability.htm" target="_blank" rel="noopener noreferrer">https://docs.axway.com/bundle/APIGateway_762_AdministratorGuide_allOS_en_HTML5/page/Content/AdminGuideTopics/high_availability.htm</a>.
