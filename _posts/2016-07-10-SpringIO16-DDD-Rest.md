---
layout: post
authors: [martin_kwee]
title: 'Spring I/O 16: Bridging the worlds of DDD & REST'
image: /img/springio.jpg
tags: [Spring IO,Spring,Conference]
category: Conference
comments: true
---

[SpringIO 2016 in Barcelona](http://www.springio.net) was loaded with tons of interesting talks and workshops about Spring Cloud, Spring Boot, Spring Data, Microservices, REST & HATEOAS, Reactive programming, and many many more.
In this blogpost I will highlight Oliver Gierke's 2 hour presentation about bridging the world of Domain Driven Design (DDD) and the world of Representational State Transfer (REST).

<span class="image left small"><img class="p-image" alt="Oliver Gierke" src="/img/ddd-rest/oliver-gierke.png"></span>

Oliver Gierke ([@olivergierke](https://twitter.com/olivergierke)) is the lead of the Spring Data project at Pivotal and member of the JPA 2.1 expert group. He has been into developing enterprise applications and open source projects for over 10 years. His working focus is centered around software architecture, DDD, REST, and persistence technologies.

## Domain Driven Design
DDD is an approach to developing software that meets core business objectives by providing on the one hand tactical modeling tools which include well founded patterns and concepts such as entities, repositories and factories. On the other hand DDD also facilitates strategic principles and methodologies for analyzing and modeling domains such as Bounded Contexts and Context Maps.

For an in depth understanding of DDD I highly recommend reading ["Domain Driven Design - Tackling Complexity in the Heart of Software"](http://dddcommunity.org/book/evans_2003/) by Eric Evans ([@ericevans0](https://twitter.com/ericevans)). There's also a [short, quick-readable summary and introduction](https://www.infoq.com/minibooks/domain-driven-design-quickly) to the fundamentals of DDD made available by InfoQ.

Oliver's talk at SpringIO 2016 highlighted a few basic DDD concepts like Entities, Value Objects, Repositories, Aggregates and Bounded Contexts.

### Value Objects

> Avoid Stringly typed code

**Value Objects** are vital building blocks of DDD. They are small immutable objects that encapsulate value, validation and behaviour. You can use them to group related values together and provide functionality related to what they represent, making implicit concepts explicit.
Some common use cases for VOs are: EmailAddress, Money, ZIPCode, Status, ... avoid writing these as just plain Strings!

Writing VOs can be a cumbersome task but there are some source code generator frameworks out there like [Project Lombok](https://projectlombok.org/) and [Google's AutoValue](https://github.com/google/auto) which can handle all the boilerplate code.

### Entities & Repositories
In contrast to Value Objects which are identified by the attributes they carry, **Entities** are distinguished by their identity. Entity objects have a life cycle because their identity defines their responsibilities and associations. It is this unique identity and their mutability that sets Entities apart from Value Objects. This means that two Value Objects with the same properties should be considered the same whereas two Entities differ even if their properties match.

> Aggregates form nice representation boundaries and become the key things to refer to.

An **Aggregate** is a cluster of closely related entities that can be treated as a single unit. The common parent of that cluster is called an **Aggregate Root**. An example can be an Order and its Line Items, these will be separate objects but it is useful to treat the Order (the Aggregate Root) together with its Line Items as a single Aggregate.

When trying to discover Aggregates, we should understand the model's invariants. An invariant is a business rule that must always be consistent and usually refers to **transactional consistency**. When a transaction commits then everything inside the Aggregate should be consistent and any subsequent access by any client should return the updated value. In most cases it is a best practice to modify only one Aggregate in a single transaction. For updating multiple aggregates **eventual consistency** can be used. There will be an inconsistency window during which an access may return either the old or the new value but eventually all accesses will return the last updated value. The duration of the inconsistency window can be calculated based on factors like network delays, number of copies of the object, and the system load.

A **Repository** is an abstraction over a persistence store for Aggregates. It acts like a collection by exposing methods to add and remove objects which encapsulate the actual interaction with the underlying data store. It also has elaborate query capabilities which return fully instantiated Aggregates whose attributes values meet the criteria.

### Bounded Context
DDD aims to create software models based on the underlying domain. A **Bounded Context** is the boundary that surrounds a part of a particular domain. This boundary isolates the model and language from other models and therefore helps reducing ambiguity and clarifying the meaning. When the boundaries are chosen well, greater decoupling between systems can be achieved which allows to easily change or replace the internals of a BC. Avoid having transactions across multiple BCs.

The language that is structured around the domain model is called the **Ubiquitous Language**. It is important that this language is used by all team members (developers, analysts, business stakeholders, ...) to connect all the activities of the team with the software. The vocabulary on its own does not have any relevance, it only has meaning inside a certain context. For example, an Item has a different meaning in the Orders BC than in the Products BC.

### Domain Events
A **Domain Event** is an extremely powerful tool in DDD. It is a type of message that describes something that has happened in the past and that is of interest to the business. (e.g. OrderShipped, CustomerBecamePreferred, ...). It is important to model Event names and its properties according to the Ubiquitous Language of the BC where they originated. When Events need to be delivered to interested parties in either a local BC or broadcasted across BCs eventually consistency is generally used.

### Maturity Level
The maturity level of the use of Domain Events can be categorized into 4 levels:

+ **Level 0**: no events at all
  - procedural code with just getters and setters
  - data just goes in and out
+ **Level 1**: explicit operations
+ **Level 2**: some operations as events
  - domain events are used as state transition
  - important domain events are exposed to interested parties via feeds
+ **Level 3**: event sourcing - all changes to application state are stored as a sequence of events
  - only event logs and snapshots are kept (Event Store)
  - separation of read and write operations (CQRS)

## REST

> REST &ne; CRUD via HTTP. Representation design matters.

### Resources
Just like an Aggregate, a well designed **Resource** should be identifiable, referable and should have a clear scope of consistency.

Exposing the core domain model directly via RESTful HTTP can lead to brittle REST interfaces because each change in the domain model will be reflected in the interface. Decoupling the core domain from the REST interface has the advantage that we can make changes to the domain and then decide in each individual case whether a change is needed in the REST interface and how to map it.

Also avoid using HTTP PATCH or PUT for (complex) state transitions of your business domain because you are missing out on a lot of information regarding the real business domain event that triggered this update. For example, changing a customer’s mailing address is a POST to a new “ChangeOfAddress” resource, not a PATCH or PUT of a “Customer” resource with a different mailing address field value.
This goes hand in hand with DDD's concept of **Event Sourcing** because those state transitions are domain relevant events, not just some changes to the state of some object.

### HATEOAS
A RESTful HTTP client can navigate from resource to resource in two different ways. Firstly by being redirected as a result of sending data for processing to the server, and secondly by following links contained in the response of the server. The latter technique is called **Hypermedia as the Engine of Application State** or HATEOAS.

The goal of Hypermedia is to serve not only data but also navigation information at the same time. This has a great impact on the client architecture because now we're trading domain knowledge with protocol complexity. The client becomes dumber because it no longer needs to know business rules in a sense that its decisions are reduced to checking whether a link is present or not, e.g. whenever there's a cancel link in the HTTP response, then display the Cancel button. This will make the client's behavior more dynamic.
On the other hand, the client becomes smarter because it needs to handle a smarter and more comprehensive protocol.

### Maturity level
In analogy to the maturity level of Aggregates described earlier, **Leonard Richardson's model** can be used to determine the maturity or our REST services.

+ **Level 0**: Swamp of POX
  - the HTTP protocol is used to make RPC calls without indication of the application state
+ **Level 1**: Resources
  - exposure of multiple URIs and each one is an entry point to a specific resource, e.g. http://example.org/orders, http://example.org/order/1, http://example.org/order/2
  - use of only one single method like POST.
+ **Level 2**: HTTP verbs
  - use of HTTP protocol properties (POST, GET, DELETE, ...)
  - use of HTTP response codes, e.g. HTTP 200 (OK)
+ **Level 3**: Hypermedia controls
  - refer to description earlier in this blog post.

### Translating domain concepts into web appropriate ones

| DDD                           | REST                        |
| ---------------------------   |---------------------------- |
| Aggregate Root / Repository   | Collection / Item Resource  |
| Relations                     | Links                       |
| IDs                           | URIs                        |
| @Version                      | ETags                       |
| Last Modified Property        | Last Modified Header        |
{:.table .table-striped}

### Sample implementation
Oliver also prepared a small sample implementation using Spring Boot, Spring Data and Lombok. The project is called [Spring RESTBucks](https://github.com/olivergierke/spring-restbucks) and is definitely worth checking out!

## Resources
- ["DDD & REST"](https://speakerdeck.com/olivergierke/domain-driven-design-and-rest-1) (slide deck used at SpringIO 2016) by Oliver Gierke
- ["Spring RESTBucks"](https://github.com/olivergierke/spring-restbucks) (sample project used at SpringIO 2016) by Oliver Gierke
- ["Benefits of hypermedia"](http://olivergierke.de/2016/04/benefits-of-hypermedia/) by Oliver Gierke
- ["Domain Driven Design - Tackling Complexity in the Heart of Software"](http://dddcommunity.org/book/evans_2003/) by Eric Evans
- ["Implementing Domain Driven Design"](http://dddcommunity.org/book/implementing-domain-driven-design-by-vaughn-vernon/) by Vaughn Vernon
- ["Domain Driven Design Quickly"](https://www.infoq.com/minibooks/domain-driven-design-quickly) by InfoQ
