---
layout: post
authors: [andreas_evers]
title: 'Microservices Dashboard'
image: /img/microservices-dashboard.png
tags: [Microservices, Dashboard, Spring, Spring Boot, RxJava, Pact, Hypermedia, Hateoas]
category: Microservices
comments: true
---

<img class="image fit" alt="Architecture" src="/img/microservices-dashboard/screenshot.png">


So you’ve jumped on the hype train, built a bunch of microservices, and got your first releases under your belt. 
Now what?
Our experiences taught us this is the easy part.
With the newly obtained microservices freedom, teams easily plunge into a world of cowboys and unicorns.
The big ball of mud is just around the corner.
Panic, mayhem and chaos loom over the organisation, waiting for everything to spin out of control.
Especially for any enterprise not residing in Silicon Valley, maintaining some sort of governance and compliancy is essential.

What does a microservice architecture mean not just for the developers, but also for analysts and managers?
What can we as developers do to offer them peace of mind?

### Managers like to have a grip on things

They want to get a sense of compliancy and maturity of the components part of the ecosystem.
In theory a microservices architecture gives developers complete freedom to use whatever tools and frameworks they want inside their microservice.
In practice, managers often want to slightly restrict that freedom to avoid complete chaos.
It’s not uncommon for managers and architects to impose a set of choices developers can choose from, and goals the teams have to achieve.
In order to facilitate recruitment and knowledge transfer, developers could be forced to choose between for instance Java or Javascript.
Similarly, architects might enforce every microservice to have a quality gate in place and to have a technical debt less than five days. 

Aside from the technical aspects inside a microservice, compliancy is even more crucial at the contract level.
They should be defined according to an architectural vision and comply to standards across the organisation.
Having the ability to track these compliancy regulations and quality assurances is a key enabler for management to push for technical excellence.
Too often managers are left clueless on how much effort is required to mature the architecture and which teams they have to chase.
Having a dashboard at their disposal indicating where a lack of compliancy and maturity needs their attention can help to ensure budget and priorities are in line with the architectural goals.


Aside from compliancy and maturity, managers want some level of change management in place.
Oftentimes this is achieved through ticketing systems and cumbersome processes.
A microservice architecture goes hand in hand with devops, including full automation and decoupling.
In that respect, teams ought to be able to define their own release schedule as there is no need for a waterfall manual testing effort of months on end, and the impact on the ecosystem is contained and managed due to the decoupled nature of microservices.
Change management in a devops organisation is much more a read-model instead of a process-heavy model.
Managers want to know what is currently out there and what will be out there in the future.
This doesn’t require a manual ticketing system, simply a smart dashboard with a timeline.

### Analysts need to know what functionality is out there

In order to reuse functionality and avoid duplication, functional analysts have a strong need for an overview of the current functional landscape.
Knowing which resources are exposed by what microservices, and which events and messages are being sent back and forth between microservices and queues, can go a long way in helping analysts understand the state of the architecture. 

Furthermore, impact analysis can significantly improve when an overview of components and how they are linked together is available to the analysts.
Not only does it encourage analysts to identify and inform consumers of a changing service, it can help to avoid introducing breaking changes due to negligence or ignorance.
During troubleshooting, testers and analysts should be able to find out what services and backends are involved in a certain functional flow.

Just like managers, functional analysts are interested in upcoming features and releases.
On top of that, analysts can benefit from being able to define the future state of the ecosystem.
Especially when multiple teams are working on similar functionality, it can be notoriously difficult to avoid duplication and breaches of bounded contexts.
Using a dashboard to define what is coming up, can help to give them an unambiguous view of the current and future landscape.

### Developers can benefit from a broader view as well

In a devops organisation, developers have the responsibility to not only build but also run their services.
Knowing which versions are deployed where, can assist developers in verifying whether their deployments are successful, but also to determine the versions of their dependencies.

A graphical dashboard can go a long way in providing clarity to developers.
But most of all, it can act as a hub for other tools and documentation available.
Integrations can be made with for instance API documentation, performance tooling, service registries, in-depth instance-specific dashboards and perhaps even reactive insights.

## The introduction of the Microservices Dashboard

Visualising the state of the architecture and dependencies in the system can be a huge benefit to all stakeholders in the IT organisation.
The Microservices Dashboard is a brand new open source project, which officially launched its first major release at Spring One Platform.
Building on top of Spring Boot and Spring Cloud, it visualises your microservice architecture and integrates with tools every microservice architecture benefits from.
This ranges from consumer-driven-contract testing over service discovery to hypermedia traversal and more.

Microservices Dashboard is a simple application to visualize links between microservices and the encompassing ecosystem.
This AngularJS application consumes endpoints exposed by its server component.
It displays four columns: UI, Resources, Microservices and Backends.
Each of these columns show nodes and links between them.
The information for these links come from Spring Boot Actuator health endpoints, Pact consumer-driven-contract tests and hypermedia indexes, which are aggregated in the microservices-dashboard-server project.

## The architecture

<img class="image left" alt="Architecture" src="/img/microservices-dashboard/architecture.png" >

The dashboard currently consists out of an AngularJS 1.x application which communicates over HTTP to a Spring Boot application.
The frontend uses D3.js to visualise the nodes in the four columns.
We are currently in the process of completely rebuilding the frontend stack.
Next version will be running on Angular 2, Typescript and EcmaScript 6.
Most of D3.js will be taken care of by Angular 2 itself.

Thanks to this refactor we’ll see the introduction of RxJS, making the frontend much more reactive in nature.
This aligns our frontend and backend components goals, since the backend is already running RxJava.
Our efforts currently focus on replicating all functionalities currently available in the dashboard, albeit with much more attention to quality and testing.
Subsequently new features and enhancements will be built on top of a much more mature and extendible frontend application.


Our server component is powered by Spring Boot’s auto configuration.
It’s a library which, once on the classpath of a regular Spring Boot application, will automatically transform the Spring Boot application into a JSON graph-serving engine.
It does so by using aforementioned RxJava.
The idea of the server application is that it will fetch information from the microservices ecosystem, with for instance Spring Cloud's integration of service registries, and collect details of components and their relation within said ecosystem.
Needless to say collecting this information requires a lot of outbound calls, and can pose a serious performance burden in case the landscape gets bigger.
Making intelligent use of the system’s resources is absolutely necessary, and RxJava does just that.
In the future we might migrate to [Spring’s Reactor](https://projectreactor.io/) which has a more formal integration of the ReactiveX specification and better integration with Spring itself.
Once the frontend’s revamp is completed, the last step towards an end-to-end reactive flow is the HTTP connection between both components.
Currently the server still converts the Observable to blocking, undoing a lot of the performance gains we could achieve.
Yet even while eventually blocking, we’ve benchmarked a thirty percent performance gain in switching from CompletableFutures to Observables thanks to the more sustained async handling.

Aside from its reactive nature, the server component of the dashboard is also built in a very pluggable way.
Information is retrieved from the ecosystem through so-called aggregators.
Currently four aggregators are provided: the health-indicators aggregator, the index aggregator, the mappings aggregator and the Pact aggregator.
We’re looking into supporting Spring Cloud’s recent addition, Spring Cloud Contract, as a source for aggregation.
New aggregators can be easily added, and all existing aggregators can be overridden, extended, turned on and off.
In the next section we’ll go through these aggregators and their purpose.

## Collecting information from the ecosystem

The dashboard on its own doesn’t really make a lot of sense when it’s not connected to the architecture it’s supposed to visualise.
Aggregators pull in information which eventually gets translated into nodes and links on the dashboard.

#### Health-indicators aggregator

Spring Boot exposes production-ready endpoints through its Actuator module.
The health endpoint returns information regarding the current health status of the application.
The source of this information is a bunch of health indicators, describing various components and dependencies of the application.
For instance, an application can have a dependency on a database, for which a health indicator will usually provide health information to the health endpoint, indicating whether the database is up and the connection pool hasn't been depleted.

Hence, health indicators describe an up-to-date relationship between the application they run on and its dependencies.
Spring Cloud ensures health indicators are automatically enabled when you are using service discovery, circuit breakers, a config server or other Spring Cloud services. However, health indicators don’t automatically describe a relationship between an application and another application it calls.
Luckily Spring Boot has a very easy way of adding custom health indicators.
As such, developers can add a health indicator the moment a remote service call is added to the application.


> **What about real-time?**
> 
> Using health indicators we are certain the application calls another application programmatically.
> This provides clarity in terms of the calls in the code and therefore the dependencies that exist across the applications.
> However, using this method we aren’t sure whether this remote call is actually being executed at runtime.
> These concerns are currently provided by other tools such as Twitter’s Zipkin.
> In the future we will integrate the dashboard with real-time traffic information from Zipkin or similar tooling.

#### Index aggregator

REST over HTTP is arguably the most popular communicational style in microservices architectures.
Therefore, gathering information on where and how REST is used can be quite useful.
Index and mappings aggregators perform this specific task, albeit each in a different way.

The index aggregator relies on a subconstraint of REST called HATEOAS.
It stands for Hypermedia As The Engine Of Application State, and describes the idea of adding links in the payload of responses to other resources.
This enables discovery of resources, much like we are using the world wide web from its inception.
It prevents the need to bookmark URIs to resources, decoupling implementations and enabling independent evolution of the service.

Similarly to a regular website, REST APIs using HATEOAS require a homepage or index from which the resource discovery starts.
Simply creating an index resource with links to the other resources the service provides, and exposing this index resource at the root of the application takes care of this.
Spring HATEOAS provides useful tools to add links to resources.

Once every microservice has an index resource, we can use service discovery to discover all the services, and fetch all the index resources to map out the landscape of resources.
This is an excellent source for the dashboard, as it shows the relation between microservices and the RESTful resources they expose.

#### Mappings aggregator

Oftentimes, RESTful resources are exposed in a more traditional way (using REST level 2) without the added complexity of HATEOAS.
While this is not fully REST compliant, it is most common among APIs using JSON over HTTP.
Spring Boot offers a handy endpoint in their Actuator module, called the mappings endpoint.
It describes all the resources exposed by the application when Spring MVC REST is used.
While also describing Spring’s own resources, a simple filter allows us to deduct node and link information from these endpoints to visualise in the dashboard.

#### Pact aggregator

In a microservices architecture, testing is absolutely crucial.
As the primary benefit of microservices is faster time-to-market, changes happen all the time.
Not only unit and integration testing is required, but also more advanced contract testing to act as a safety net.
Consumer-driven-contract testing allows the consumer (the client) to define what he expects from the producer (the service), and ensure the producer validates that definition every time a change is made to the service.
This allows the consumer to rest at ease, knowing the producer will remain backwards compatible or version accordingly, and gives the producer knowledge of who uses exactly which parts of its service.
The latter gives the producer the chance to request consumers to update their service in case they are causing too much complexity on the producer’s side due to backwards compatibility.

Tests like these document with guaranteed certainty relations between clients and services or services and services.
Querying the contracts that define these relations offer a great source of information for the dashboard’s nodes and links between them.
When working with the consumer-driven-contract testing framework Pact, a repository called the Pact-broker holds all the available contracts and exposes them through a REST interface.
Our Pact aggregator makes use of this interface to pull the information into the dashboard.

Spring Cloud recently added the Spring Cloud Contract module to their portfolio, based on Accurest.
We’re planning to integrate the Microservices Dashboard with Spring Cloud Contract in the near future as well.

## Conclusion

The Microservices Dashboard gives managers, analysts and developers peace of mind when working in a microservices architecture.
Not only does it map relations between components in a visually attractive manner, it can also be a great tool for compliancy, change management, functional analysis and troubleshooting.

The dashboard is currently at version 1.0.1, and can be downloaded through maven central.
To quickly get up and running, make sure to check out the [reference documentation](http://ordina-jworks.github.io/microservices-dashboard/1.0.1/).

Since the project is still fairly new, any feedback is greatly appreciated.
You can reach us through [Gitter](https://gitter.im/ordina-jworks/microservices-dashboard) or [GitHub](https://github.com/ordina-jworks/microservices-dashboard).
