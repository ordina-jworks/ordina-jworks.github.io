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


## Table of contents
* [Introduction to API Management](#Introduction-to-API-Management)
    * [Problem description](#Problem-description)
    * [Investigation](#Investigation)
        * [API Management or API Gateway?](#API-Management-or-API-Gateway)
        * [API landscape without an API management tool](#API-landscape-without-an-API-management-tool)
        * [API landscape with an API management tool](#API-landscape-with-an-API-management-tool)
        * [Responsibilities of an API Management tool](#Responsibilities-of-an-API-Management-tool)
        * [Challanges](#Challanges)
    * [API management products](#API-management-products) 
    * [Hands-on](#Hands-on)
    * [Conclusion](#Conclusion)


## Problem description

In our current digital world where everyone is creating API’s for exposing data internally and for external partners, we should look on how we can manage and control them.
Most of us also know that we not only have to build the API, but we need to foresee additional responsibilities with it. Some that are just a necessary evil. Like for example Autorization, Authentication, or certain routing policies, etc.
        
Well, instead of inventing the wheel over and over again, i searched for the best solution and found that an API Management tool can solve a lot of those problems and even add extra value within your landscape.
This tool helps you in managing you APIs, setting the right responsibilities on the right level. 
You can add plenty additional functionalities, but most of all this happens in one tool!
Thats one of the reasons it is important for your business to implement the such a tool in your organisation.
        
                
## Investigation

### API Management or API Gateway?
API management and API gateway are used interchangebly.
Is it now an API manager, API management tool, or API gateway?
Lets dive into the namings.
An API management tool refers to the application/overall solution of managing APIs.
This mostly indicates that they are talking about the application and its features.
A management tool can include one or multiple API Gateways, depending on the solution needed in the organization.
An API gateway is actually a middleware that is placed in front of your services an acts as a central point to administrate, route and secure your services.


### API landscape without an API management tool
Before going into the details, let’s take a look on how most of the current API landscapes are build and how we can improve those with an API management tool.
Without an API manager, your APIs will be the direct integration point to the business domain data.
Any integration of for example security, needs to be implemented in your API. This sometimes leads to duplicate code and the fact that your API is not only responsible for exposing the Data, but also for implementing other cross cutting functionalities.
	     
<img src="/img/2020-09-14-Introduction-to-API-Management/WithoutApiManagementTool2.jpg" alt="API landscape without an API management tool" width="350" height="200" class="image fit">

### API landscape with an API management tool
This changes when we rely on an API Management tool.

<img src="/img/2020-09-14-Introduction-to-API-Management/WithApiManagementTool2.jpg" alt="API landscape with an API management tool" width="500" height="350" class="image fit" style="vertical-align:middle;margin-left:2%"/>        

In this situation an API management tool is deployed between the client and the APIs.
All request first have to pass the API managemen tool, before they are forwarded to the right service.
If the Gateway is installed in the same organizational structure, it’s not required to have your API’s implementing additional cross cutting functionalities.
The API gateway will be responsible of performing the necessary checks before allowing the clients to access the Data.
I do hear you thinking already “We’re not going to install an additional tool, only for splitting out security rules from the API’s", but that’s not the only thing an API management tool can do.

### Responsibilities of an API Management tool
I listed out the most important responsibilities for you, so that you can understand the power and the actual benefits of an API Management tool:            
     
1.	Authentication 
    * Enables one of the most important parts of security on an API. (validating the persons identity!)
    There are different kinds of Authentication:   
        * Http Basic Authentication
            * Using this approach, a user agent simply provides a username and password to prove their authentication. This approach does not require cookies, session ID’s, or login pages because it leverages the HTTP header itself. While simple to use, this method of authentication is vulnerable to attacks that could capture the user’s credentials in transit.
            
        * OAuth
            * OAuth 2.0 is the best choice for identifying personal user accounts and granting proper permissions. In this method, the user logs into a system. That system will then request authentication, usually in the form of a token. The user will then forward this request to an authentication server, which will either reject or allow this authentication.
        
        * OpenID Connect & OAuth 2.0 API
            * OpenID Connect is a simple identity layer on top of the OAuth 2.0 protocol, which allows computing clients to verify the identity of an end-user based on the authentication performed by an authorization server, as well as to obtain basic profile information about the end-user in an interoperable and REST-like manner.
        
        * API Keys
            * An API key is an identifier meant to identify the origin of web service requests (or similar types of requests). A key is generated the first time a user attempts to gain authorized access to a system through registration. From there, the API key becomes associated with a secret token, and is submitted alongside requests going forward. When the user attempts to re-enter the system, their unique key is used to prove that they’re the same user as before. This API Authentication Method is very fast and reliable, but is frequently misused. More importantly, this method of authentication is not a method of authorization.   
2.	Authorization 
    * Enables fine grained authorization to API resources based on authenticated user roles.
    This involves checking resources that the user is authorized to access or modify via defined roles.
3.  Caching resources
    * Allows caching of API responses in the Gateway to reduce overall traffic to the back-end API.
    Latency will be improved because the API gateway can talk directly with the backend service or can use the cached resource and doesn't have to fetch the information multipe times.
    With caching you also avoid that the backend service will be overloaded by requesting the same information over and over again. 
    Resources can be cashed for a specified time-to-live (TTL) period.
    The gateway will retrieve the resource again from the backend service once the time has passed, and a new request comes in.
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
        Enforces rate configurable request rate limits on an API.
        If your API becomes overloaded, its performance will suffer and this will impact all customers.
        Rate limiting (also called throttling) ensures that a single user cannot intentionally or unintentionally overwhelm an API with too many requests.
        In case throttling kicks in, the user will receive an response status code 429 (meaning "Too Many Requests").
        A Retry-After header might be included to this response indicating how long to wait before making a new request will work again.
        * Transfer Quota
        Provides a way to limit the total number of bytes that can be transferred from (or to) an API.
7.  URL Rewriting 
    * Responses from the back-end API can be modified by fixing up any incorrect URLs found with modified ones.
    In some cases an API might return URLs to followup action or data endpoints. In these cases the back-end API will likely be configured to return a URL pointing to the unmanaged API endpoint. This policy can fix up those URL references so that they point to the managed API endpoint (the API Gateway endpoint) instead. 
8.  Transformation
    Transformation enables to convert an API format between for example from JSON and XML. 
    If an API is implemented to return XML, but a client would prefer to receive JSON data, this policy can be used to automatically convert both the request and response bodies. In this way, the client can work with JSON data even though the back-end API requires XML.
9.  Monitoring
    Some tools let you visualize, query, route, archive, and take actions on the metrics or logs like for example the Azure API management tool.
    Others just foresee a basic around metrics or include a thirth party tool like elasticsearch to do the job.
    
A lot more can be added or customized, depending on the tool of course. There is a wide range of products available, so please refer to the product list below if you want to know the ones used currently.
I mostly focused on the Open source tools like Apiman, Kong API Gateway, WSO2 API Manager.



### Challanges
As you might figured out by yourself already, if this API Gateway is placed before all you’re API’s it creates a SPOF (Single point of Failure). 
There are other ways to handle that like setting up multiple API gateways for different endpoints, but that also creates more overhead.
    
<img src="/img/2020-09-14-Introduction-to-API-Management/MultipleAPIGateways2.jpg" alt="API landscape without an API management tool" width="500" height="350" class="image fit" style="vertical-align:middle;margin-left:2%" />

If in this example the Web app API Gateway gets stuck for any reason at all, the client is still able to connect to the other Gateways and request for the data he/she needs.
Which solution to choose, is of course depending on your preferences.

## API management products

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
Just to try a few things, I installed Apiman (and the required server, etc.) on to my laptop and used one of my already created API's to test.
It was actually quite simple to start, however I did download a few versions of it, as some didn't work from the 1st minute.
I downloaded the latest version from <a href="http://www.apiman.io" target="_blank" rel="noopener noreferrer">http://www.apiman.io</a>.

Once it got installed, I started to play around with it.
It has some pre-configured settings which makes it easy.
There is a lot of documentation available, and it’s open source so everything is available on the web.

<img src="/img/2020-09-14-Introduction-to-API-Management/APIMAN_Login.PNG" alt="APIMAN Login screen" width="600" height="375" class="image fit" style="vertical-align:middle;margin-left:2%" />

After I was able to run Apiman, I searched on how to set it up.
I'm not going in to much dept of Apiman settings, but very important was that everything in Apiman starts with the Organization. 
2ndly you need to setup a plan, which is basically a collection of policies that will be applied to requests made to Services being access through it.
As last you need to setup a Service. 
A service contract is simply a link between an application and a service through a plan offered by that service. 
When a service contract is created, the system generates a unique API key specific to that contract. 
All requests made to the service through the API Gateway must include this API key.

<img src="/img/2020-09-14-Introduction-to-API-Management/APIMAN_Indexpage.PNG" alt="APIMAN start screen" width="600" height="375" class="image fit" style="vertical-align:middle;margin-left:2%" />

Setting up an organization (OrgHome) and creating services.

<img src="/img/2020-09-14-Introduction-to-API-Management/APIMAN_Organization-API.PNG" alt="APIMAN Organization and Services" width="800" height="300" class="image fit" style="vertical-align:middle;margin-left:2%" />

You can mark the service public, so that everyone can access it, or you can create a Client App and generate a required key via a plan.
in this example, I created a 'SearchCustomers' client app, where the client needs to use the API-Key in the request to get the response back from our service.
Our service didn't implement any security or authority for this.
Apiman will take the responsibility of implementing this.
Only if the client uses the right endpoint with the correct API-key, Apiman will retrieve the requested data from our backend service and send the response back to the client.
 
<img src="/img/2020-09-14-Introduction-to-API-Management/APIMAN_ClientApps-APIKey.PNG" alt="APIMAN Client apps and API-Key" width="800" height="400" class="image fit" style="vertical-align:middle;margin-left:2%" />

As last I wanted to be sure that we can use the tool in an automated way, so I tried to use the Apiman REST API to create new organizations, plans and services.
I had some struggles to make it work, but eventually I was able to create everything needed.
Via the REST API we have the possibility to check, add or remove anything you want.
The build in Apiman-UI is also build on these REST API, so anything you can do in the application should be possible to execute via the API service.
More on this can be find in the <a href="http://www.apiman.io/latest/api-manager-restdocs.html" target="_blank" rel="noopener noreferrer">API-manager-restdocs</a>.

One keynote , The downloaded tomcat server does not come with integrated Keycloak server, so I was not able to add users via the REST API. If you're running in a WildFly server, this would be default.


       
## Conclusion
If you still don’t have an API Management tool in your organization, think about the benefits and segregation of duties/responsibilities of your API’s and the API management tool.
Take the time to try out a few. 
For example, Apiman has some prebuild versions that you can download and use immediately.
Even if you only have a few API’s running in your organization, you probably will benefit from using such a tool to manage your Security, Routing, or other Policies you want to implement. 
With an API management tool you can make sure that your all your APIs just do what they need to do (sharing business related data), and that the API management tool takes care of the rest where it is required.
Any changes in the policy or security can be maintained in one tool, and doesn't have to be implemented in every API individually.

TODO: include -> 
Managing APIs in one tool.
Latency improved 
Authentication and authorization done in one place.
Logging and tracing
Maintainability and scalability


##### Sources
<a href="https://www.frizztech.com/know-about-ekart-api-integration/" target="_blank" rel="noopener noreferrer">https://www.frizztech.com/know-about-ekart-api-integration/</a>.

<a href="https://koukia.ca/a-microservices-implementation-journey-part-4-9c19a16385e9" target="_blank" rel="noopener noreferrer">https://koukia.ca/a-microservices-implementation-journey-part-4-9c19a16385e9</a>.

<a href="https://www.popularowl.com/reviews/which-api-gateway/" target="_blank" rel="noopener noreferrer">https://www.popularowl.com/reviews/which-api-gateway/</a>.

<a href="https://www.okta.com/blog/2019/02/the-ultimate-authentication-playbook/" target="_blank" rel="noopener noreferrer">https://www.okta.com/blog/2019/02/the-ultimate-authentication-playbook/</a>.

<a href="https://blog.restcase.com/4-most-used-rest-api-authentication-methods/" target="_blank" rel="noopener noreferrer">https://blog.restcase.com/4-most-used-rest-api-authentication-methods/</a>.

<a href="https://apiman.gitbooks.io/apiman-user-guide/content/" target="_blank" rel="noopener noreferrer">https://apiman.gitbooks.io/apiman-user-guide/content/</a>.

<a href="https://docs.microsoft.com/de-de/dotnet/architecture/microservices/architect-microservice-container-applications/direct-client-to-microservice-communication-versus-the-api-gateway-pattern" target="_blank" rel="noopener noreferrer">https://docs.microsoft.com/de-de/dotnet/architecture/microservices/architect-microservice-container-applications/direct-client-to-microservice-communication-versus-the-api-gateway-pattern</a>.
