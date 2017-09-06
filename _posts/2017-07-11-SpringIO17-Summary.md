---
layout: post
authors: [dieter_hubau, gina_de_beukelaer, hans_michiels, jeff_mesens, tim_schmitte]
title: 'Spring I/O 2017 Recap'
image: /img/springio2017.jpg
tags: [Spring, IO, Pivotal, Google, Spring Boot, Java, Reactive, Reactor, DDD, CQRS, Spring Cloud, Spring Cloud Stream, Serverless]
category: Spring
comments: true
---

> On the 18th and 19th of May, we had another great edition of Spring I/O, brought to us by organizer [Sergi Almar](https://twitter.com/sergialmar){:target="_blank"}.
In this blog post, we will go over some of our favourite sessions of the conference.

> **DISCLAIMER**: we could not include **ALL** the talks from Spring IO in this blogpost. We provide an extensive summary of our favorite talks and created a curated list of all the talks and resources at the bottom of this post.

<div class="the-toc">

  <h1 class="the-toc__heading">Table Of Contents</h1>

  <ol class="the-toc__list">
    <li><a href="#1-keynote-the-only-constant-is-change" title="Keynote: The Only Constant Is Change">Keynote: The Only Constant Is Change</a></li>
    <li><a href="#2-bootiful-database-centric-applications-with-jooq" title="Bootiful Database-centric Applications with jOOQ">Bootiful Database-centric Applications with jOOQ</a></li>
    <li><a href="#3-google-spanner" title="Google Spanner">Google Spanner</a></li>
    <li><a href="#4-easily-secure-and-add-identity-management-to-your-springboot-applications-with-keycloak" title="Easily secure and add Identity Management to your Spring(Boot) applications with Keycloak">Easily secure and add Identity Management to your Spring(Boot) applications with Keycloak</a></li>
    <li><a href="#5-spring-cloud-streams-data-services" title="Spring Cloud Streams (Data Services)">Spring Cloud Streams (Data Services)</a></li>
    <li><a href="#6-the-road-to-serverless-spring-cloud-function" title="The Road To Serverless: Spring Cloud Function">The Road To Serverless: Spring Cloud Function</a></li>
    <li><a href="#7-reactive-spring-data" title="Reactive Spring Data">Reactive Spring Data</a></li>
    <li><a href="#8-the-future-of-event-driven-microservices-with-spring-cloud-stream" title="The Future Of Event Driven Microservices With Spring Cloud Stream">The Future Of Event Driven Microservices With Spring Cloud Stream</a></li>
    <li><a href="#9-new-in-spring-5-functional-web-framework" title="New in Spring 5: Functional Web Framework">New in Spring 5: Functional Web Framework</a></li>
    <li><a href="#10-spring-auto-rest-docs" title="Spring Auto REST Docs">Spring Auto REST Docs</a></li>
    <li><a href="#11-references" title="References">References</a></li>
  </ol>

</div>

**** 

# 1. Keynote: The Only Constant Is Change

### by [Andy Wilkinson](https://twitter.com/ankinson){:target="_blank"} and [Stéphane Nicoll](https://twitter.com/snicoll){:target="_blank"}

Obviously, the keynote presentation was filled with announcements, interesting tidbits and two great presenters.

<p style="text-align: center;">
  <img class="image fit" style="max-width:595px" alt="Andy Wilkinson and Stéphane Nicoll" src="/img/SpringIO2017/andy-wilkinson-stephane-nicoll.jpg">
</p>

The biggest topic revolved around how **Spring has always tried to enable developers to adapt their applications rapidly**.
This capacity of adapting to change increased dramatically when Spring Boot was released, which explains part of its success.

They also reported the release of [Spring Boot 2.0.0 M1](https://spring.io/blog/2017/05/16/spring-boot-2-0-0-m1-available-now).
This release was announced very shortly after [Spring Framework 5.0 went RC1](https://spring.io/blog/2017/05/08/spring-framework-5-0-goes-rc1) on the 8th of May.

[The keynote can be found here](https://www.youtube.com/watch?v=uJSYnqIhcIo){:target="_blank"} and the demo code [here](https://github.com/snicoll-demos/demo-webflux-streaming){:target="_blank"}.

# 2. Bootiful Database-centric applications with jOOQ

### by [Michael Simons](https://twitter.com/rotnroll666){:target="_blank"}

<span class="image left small"><img class="p-image" alt="Michael Simons" src="/img/SpringIO2017/michael-simons.jpg"></span>

As a personal fan of [@rotnroll666](https://twitter.com/rotnroll666){:target="_blank"}, I went to see his talk, fully expecting to be impressed by the level of quality and code.
As always, Michael delivered: he made me realize **there are still plenty of PL/SQL developers out there in the enterprise landscape, who hold on to their code like kids to their favorite stuffed animal before bedtime**.

Luckily for us, someone created a library called **jOOQ**:

> jOOQ generates Java code from your database and lets you build type safe SQL queries through its fluent API

<span class="image left small"><img alt="jOOQ" src="/img/SpringIO2017/jooq.png"></span>

There are many use cases where jOOQ can prove useful, but the example that Michael used described the enterprise environment at his current employer:
He was working for a **big utility company** in Germany, who developed applications on power and gas usage consisting of **lots of time-series data**.
Almost all of the data was stored in SQL databases with a **big layer of PL/SQL on top**.
They also developed some desktop GIS applications using **Oracle Spatial** to visualize the data.

So the question they asked themselves at a certain moment:

> Should we approach all of our data using plain PL/SQL? Should we use an ORM tool like Hibernate? Or can we use something in between?

Of course, as with any good question, the answer is:

> It depends. **There is no silver bullet**

There are many options in the Java space to approach this problem:

- Plain JDBC
- Using a `JDBCTemplate`
- JPA with JPQL and / or Criteria API

Michael's team solved most of their problems using Hibernate, and while that comes with several advantages, it doesn't mean you have to use it for everything.
One of the improvements they made was using **Hibernate combined with jOOQ**:

- Use Hibernate for the regular database queries and *day-to-day manipulations of your database*
- Use jOOQ for your complex queries and database migrations

To briefly summarize what jOOQ can do for you:

- jOOQ is **SQL-centric** which means jOOQ infers information from the actual database, not from the ORM model
- It exposes a **typesafe meta-model** generated from your SQL
- The Query Builder framework uses a **very legible DSL** (in a much more concise way than the `Criteria API`)
- It generates a Java-based schema (using Maven or Gradle)
- It can reverse-engineer an existing DB and generate SQL
- Spring provides **integration with Spring Boot** through the `spring-boot-starter-jooq` dependency

An ideal scenario to use jOOQ would be to:

- Run your **database migration** with Flyway or Liquibase first
- Run the **code generator** to generate the Java DSL context (this happens in the Maven `generate-sources` lifecycle phase)
- Use the DSL context to **write your typesafe queries**, for example:

{% highlight java %}

BookRecord book = create.selectFrom(BOOK).where(BOOK.ID.eq(1)).fetchOne();

{% endhighlight %}

For more information about jOOQ, [you can check out their website](https://www.jooq.org/){:target="_blank"}.

> Question: What's the difference between the jOOQ Query API and using JPA Criteria API with the Hibernate ModelGen, which is also typesafe?

- It resembles the native SQL much better
- jOOQ provides **standardization** since it performs SQL transformations that work for **any SQL dialect**
- It should make it easier to migrate existing PL/SQL applications
- There is a much more extensive collection of SQL functions and possibilities
- jOOQ provides POJO mappers which are also generated from the code generator
- As much as you hate them, it supports calling **Stored Procedures**!

The [code from Michael's talk can be found on Github](https://github.com/michael-simons/bootiful-databases){:target="_blank"}.

# 3. Google Spanner

### by [Robert Kubis](https://twitter.com/hostirosti){:target="_blank"}

Google Spanner is a **globally distributed relational database service** that provides ACID transactions and SQL semantics, without giving up horizontal scaling and high availability.

When building cloud applications, you are no longer forced to choose between traditional databases that guarantee transactional consistency, or NoSQL databases that offer simple, horizontal scaling and data distribution.
Cloud Spanner offers both of these critical capabilities in a single, fully managed service.
With Spanner, your database can scale up and down as needed, and you only pay for the amount you use.

Spanner keeps application development simple by supporting standard tools and languages in a familiar relational database environment.
It supports distributed transactions, schemas and DDL statements, SQL queries and JDBC drivers and offers client libraries for the most popular languages, including Java, Go, Python and Node.js.

As a managed service, Cloud Spanner provides key benefits to DBAs:
- **Focus on your application logic** instead of spending valuable time managing hardware and software.
- Scale out your RDBMS solutions without complex sharding or clustering.
- Gain **horizontal scaling** without migration from relational to NoSQL databases
- Maintain **high availability** and protect against disaster without needing to engineer a complex replication and failover infrastructure.
- Gain **integrated security** with data-layer encryption, identity and access management and audit logging

<p style="text-align: center;">
  <img class="image fit" alt="Google Spanner" src="/img/SpringIO2017/cloud-spanner.png">
</p>

# 4. Easily secure and add Identity Management to your Spring(Boot) applications with Keycloak

### by [Sébastien Blanc](https://twitter.com/sebi2706){:target="_blank"}

<span class="image left small"><img class="p-image" alt="Sébastien Blanc" src="/img/SpringIO2017/sebi.jpg"></span>

I must say, this was one of the funniest talks of the conference.
Sébastien knows how to entertain the crowd and he kicked off with a great quote which, of course, I immediately stole and tweeted:

<blockquote class="twitter-tweet" style="margin-top: 2em" data-lang="en"><p lang="en" dir="ltr">Similar to a quite from <a href="https://twitter.com/sebi2706">@sebi2706</a> last week at <a href="https://twitter.com/hashtag/springio17?src=hash">#springio17</a> : forget about companies, it&#39;s all about community and code! 🙌</p>&mdash; Dieter Hubau (@dhubau) <a href="https://twitter.com/dhubau/status/867999793280413698">May 26, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

First of all, let's forget that Keycloak was created by Redhat and that it is written in Java EE.
The following aspects of Keycloak are more important:

- [It's Open Source](http://www.keycloak.org/){:target="_blank"})
- Redhat provides support through their commercial fork called [Redhat SSO](https://access.redhat.com/products/red-hat-single-sign-on){:target="_blank"})
- Great **Spring Boot Integration** through the use of a [Spring Boot Starter](https://keycloak.gitbooks.io/documentation/securing_apps/topics/oidc/java/spring-boot-adapter.html){:target="_blank"})
- Seamless **Spring Security Integration**
- Supports OAuth 2.0, SAML 2.0, OpenID Connect
- Integration with Active Directory, LDAP and even Kerberos (*start drooling enterprise users!*)

It's actually quite easy to setup Keycloak:

- Download [the Keycloak standalone server](https://downloads.jboss.org/keycloak/3.2.0.Final/keycloak-3.2.0.Final.zip){:target="_blank"}
- Extract and run it
- Start the server and create an admin user
- Create a new realm
- Create a new application
- Add roles to your application
- Create a user to authenticate with
- Create a Spring Boot application at [The Happiest Place On Earth](http://start.spring.io){:target="_blank"}) and include the Keycloak starter
- Add the Keycloak properties to your application.yml:
    - server URL
    - realm
    - resource name of your application
    - security constraints for your users
- Run!

<p style="text-align: center;">
  <img class="image fit" alt="Keycloak Client configuration" src="/img/SpringIO2017/keycloak.png">
</p>

There are many additional features for power users:

- Automatic registration of applications should be possible using a one-time token (coming soon?)
- Centralized User Management
- **CORS support** for Single Page Applications
- Social Login Integration
- Registration and Forgot Password functionality, all out-of-the-box, configurable at runtime
- UI Customization of all pages is possible through theming (*start drooling designers!*)

All in all, the setup and demo went very smooth and **I genuinely feel this product is about to become very popular**, partly because of the Spring Boot integration, but also because it just seems very solid and user-friendly.

There might be a dedicated blogpost coming soon about Keycloak, so stay tuned and check our blog regularly or [subscribe to our RSS feed](https://ordina-jworks.github.io/feed.xml){:target="_blank"}!

# 5. Spring Cloud Streams (Data Services)

### by [Michael Minella](https://twitter.com/michaelminella){:target="_blank"}

Michael gave a summary about all the new projects in the Spring ecosystem that process data and / or messages very well.
He explained that there are lots of big data frameworks out there (Hadoop, Spark, ...), which can handle BIG amounts of data very well.
However, they are usually **too bulky / difficult / inappropriate for handling smaller volumes of data**.
Also, for quickly setting up something like Hadoop or Spark, the **learning curve is too high** and the effort doesn't justify the benefits.

#### Solution: data microservices

  - Developed and tested in isolation, also easier to test
  - Independently scalable depending on data processing load
  - Familiar development model, just like regular cloud-native Spring microservices
  - Easier to govern for Ops
  - So the need for data / app integration / composition arises
  - Which means the need for orchestration and operational coverage arises (lots of plumbing required)

#### [Spring Cloud Stream](https://cloud.spring.io/spring-cloud-stream/){:target="_blank"}

  - Streams are thin wrappers around Spring integration
  - Supported binder for integration between services: Kafka, RabbitMQ, ...
  - Source, Processor, Sink model is easy to comprehend

#### [Spring Cloud Task](https://cloud.spring.io/spring-cloud-task/){:target="_blank"}

  - Tasks are finite microservices, built around Spring Batch
  - "Microservices that end"
  - Contain Task repository which tracks run/start/end of the tasks
  - Has Spring Batch integration (partition steps using workers)
  - Has Spring Cloud Stream integration (eg. launch Tasks via Streams)
  - Simple annotation `@EnableTask`
  - Use cases: batch jobs, scheduled one-off processes, ETL processing, data science

#### Spring Cloud Data Flow

  - *AKA* the new and Improved Spring XD
  - Data flow orchestrator
  - Use a shell or the UI which goes over REST endpoints
  - Has custom DSL
  - All the components are regular Spring Boot apps (Data Flow server, Shell, ...)
  - Data Flow server has datastore for task repository, batch repository, configuration, ...
  - Data Flow server does **not** do any of the actual work

<p style="text-align: center;">
  <img class="image fit" alt="Keycloak Client configuration" src="/img/SpringIO2017/spring-cloud-data-flow.jpg">
</p>

We will be publishing a fun blogpost about Spring Cloud Streams soon, so stay tuned or [subscribe to the RSS feed](https://ordina-jworks.github.io/feed.xml){:target="_blank"}!

# 6. The Road to Serverless: Spring Cloud Function

### by [Dr. Dave Syer](https://twitter.com/david_syer){:target="_blank"}

#### FaaS
In recent years we've seen the emergence and evolution of following cloud abstraction layers in order of abstraction level: 
  - Virtual Machines (IaaS) 
  - Containers (CaaS)
  - Applications (PaaS)
  - Functions (FaaS)
  
The Goal of each of these is raising the value line; 
in other words, the purpose of each of these is to abstract away various concerns that are of no business value
(e.g. setting up and maintaining infrastructure, the environment the code has to run in...).
The latest and most extreme level of these is FaaS (or 'serverless').
Basically all the programmer should do in a FaaS environment is write a Function and hand it over to the platform. 

The platform takes care of:
 - Making sure the function is executed on demand 
 - **Deploying and undeploying (often on demand!)**
 - **Scaling up** the amount of instances quickly and in parallel if the need arises (is easier with functions since they are simpler in nature than applications)
 - **Managing integrations** with other systems

> The naming scheme of "serverless" is unfortunate; of course you're gonna have servers, you just don't care about them 

#### Problem
 - By now there are a lot of FaaS solutions out there; AWS Lambda, Google Cloud Function, Azure Function, IBM Openwhisk, Fission, Kubeless, ...
 - Deploying and programming functions is different for each platform because you have to use their native APIs and they have their own platform to deploy on.
 - Running and testing these functions locally

#### Enter Spring Cloud Function

The purpose of the new project called **Spring Cloud Function** is to solve these problems by: 
  - Keeping all advantages of serverless/functions, but with all the possibilities that Spring offers (DI, integration, autoconfig, build tools)
  - Providing a low entry level for Spring devs to jump on the FaaS model
  - Providing a low entry level for FaaS people without having knowledge of Spring
  - Making it possible to run the same business logic as web endpoint, stream processor or a task
  - Introduce an uniform programming model across providers and **able to run standalone** (not on a IAAS or PAAS).
  - Support a reactive programming model (Flux, Mono) as well

The project will try to achieve this by:
 
  - Supporting the familiar Java 8 Function types:

    {% highlight java %}
    
    @SpringBootApplication
    public class Application {
        @Bean
        public Function<String, String> uppercase(){
           return (value) -> value.toUpperCase();
        }

        public static void main(String[] args) {
            SpringApplication.run(Application.class, args);
        }
    }
    
    {% endhighlight %}

  - As well as the Reactive Types Flux and Mono : 

    {% highlight java %}
    
    ...
    public Function<Flux<String>, Flux<String>> uppercase() {
        return flux -> flux.map(String::toUpperCase);
    }
    ...
    
    {% endhighlight %}


  - Building/deploying the Function as a web endpoint, a task or a stream  can be done by merely altering dependencies, for example:
    - Deploying the function as a web endpoint can be done by adding the dependency spring-cloud-function-web
  
  - In a similar fashion, it will also possible to build for a platform like AWS 

#### Conclusion 

In a way the goal of FaaS is similar to the Spring framework; 
allowing the developer (or the IT department) to **focus on writing code that has real value**.

The purpose of FaaS is to help us with infrastructure, scalability etc for the functions we write while 
Spring cloud function will allow us to write and deploy these functions in an (almost) platform agnostic fashion.
At the same time, it will enable the programmer to leverage the Spring Framework with it's various features that helps the programmer 
to focus even more on his main purpose; programming things that deliver real value: business code!

PS: [Kenny Bastani](https://twitter.com/kennybastani){:target="_blank"} has just published a [**VERY** detailed blogpost about Spring Cloud Function on AWS Lambda](http://www.kennybastani.com/2017/07/microservices-to-service-blocks-spring-cloud-function-aws-lambda.html){:target="_blank"}.
It's a follow-up of his earlier [blogpost about Event-driven Microservices using CQRS and Serverless](http://www.kennybastani.com/2017/01/building-event-driven-microservices.html){:target="_blank"}.
I would highly recommend his blog!

# Spring Break

<p style="text-align: center;">
  <img class="image fit" alt="Google Spanner" src="/img/SpringIO2017/Pizza.jpg">
</p>

# 7. Reactive Spring Data

### by Christophe Strobl

#### Biggest changes of Spring Data Kay M3

- Java 8 baseline
- ID classes don't need to be Serializable anymore
- **breaking change**: No more `null` in the repositories (arguments or return values)
- **breaking change**: More consistent naming (eg. `findOne -> findOneById`)
- Composable interfaces (separate Readable / Insertable and make custom repositories as composable interface as well)
- Builder style `Template` APIs
- Kotlin extensions are coming in M4

#### Data Store specifics

- MongoDB:
  - **breaking change**: MongoDB driver baseline to 3.x
  - Introduction of `ReactiveMongoTemplate`
  - Enhanced aggregation support
  - Collation support

- Cassandra:
  - **breaking change**: Update to Cassandra 3.2
  - No reactive native driver --> mimicking reactive driver with thread pool (and blocking) underneath (with `ReactiveCassandraTemplate`)

- Redis:
  - JRedis discontinued
  - Upgraded to Lettuce 5 (not GA yet though) supports native reactive driver

- Gemfire:
  - Lucene index support
  - Off-heap, Redis Adapter, Security annotation config

- Solr:
  - Upgrade to Solr 6

- Spring Data REST:
  - CORS config mechanism
  - Improved headers
  - Improved media type support

# 8. The future of event driven microservices with Spring Cloud Stream

### by [Kenny Bastani](https://twitter.com/kennybastani){:target="_blank"}

## Evolution

### Monolith application
There are some cultural problems with monoliths.
One big application slows down the velocity of getting into production.
Everyone has to use a shared deployment pipeline.
For large code-bases it is harder for new engineers to get up to speed.
The engineers that were there from the beginning, who designed the application, are busy explaining the history of the application to new engineers joining the project. 
These developers are creating change but might get blocked by DBA and Ops teams.

### Monolith organization

Centralized authority for operations, database and change management slows progress.
These coordinated releases batch many changes together from different teams.
Usually operations drives the runtime environment of applications because they take all operation responsibility including upgrades of virtual machines.
The key problem is that everything is deployed at once or nothing at all.

### Move towards SOA

With Service-oriented Architecture the application is split up in components which can be deployed individually but now the key problem are the shared libraries.
Releasing a change in an object that is not shared can be done separate, but still a problem for the shared ones.

### Now we arrived at Microservices

There are a lot of improvements but Microservices also adds the complexity of running a distributed system.
Small, two pizza (5-8 members), teams organized around business capabilities with responsibility of running their own services.
We gain independent deployability because each team produces and consumes rest APIs to communicate.
Team also have more freedom to chose the best tool for the job they are facing.
Microservices brings the challenge of eventual consistency, in a monolith you could rollback a transaction at the database level if something went wrong. Now eventual consistency is not guaranteed, inconsistency happens all the time. 
Rolling back transactions across multiple services is not easy.

### Is it a Monolith or Microservice?

> If it takes longer than a day for an engineer to ramp up its probably a monolith

In a typical architecture the front-end teams integrate directly with the microservices.
This is an anti-pattern in distributed systems. 
Consumers should not have to worry which instance of the replicated services they have to go to.
You could use Spring Cloud, it allows you to centralize authentication with OAuth tokens and routing through an  API Gateway. The front-end does not need to be concerned with all these services, for them it looks like consuming a monolithic API.

## Splitting the monolith

The popular route from monolith to a microservice architecture is slicing off bits of functionality.
This is hard in practice, splitting up a schema is usually the complex part.
Refactoring out functionality and tables to new services can be hard because of foreign key constraints for example.

### Why we need event-driven microservices

The problem with microservices is that there are no foreign key constraints between services.
Furthermore, distributed transactions are brittle and distributed systems are hard.

> You will drown in problems you didn't know existed!

Without event-driven microservices and an audit trail you will never know why something went wrong.
This audit trail allows you to reason about what went wrong and roll back state.
    
## Rules for Event-driven microservices

A lot of these rules are from reference applications and Kenny's work with [Chris Richardson](http://microservices.io/).

*Domain events* are a first class citizen, every time you change some piece of data, domain events should be exchanged.
These events can be used as an audit trail to determine why state changed in a system.
Each domain event contains a subject with the project aggregate and a payload with immutable data.

{% highlight java %}

@Entity
@EntityListeners(AuditionEntityListener.class)
public class ProjectEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long eventId;
    
    @Enumerated(EnumType.STRING)
    private ProjectEventType type;
    
    private Project entity;
    
    private Map<String, Object> payload;

{% endhighlight %}

To make this way of working accessible to the developers, hypermedia APIs need to expose links on the aggregates.
A traversal list of command and a log of events that happened should be accessible.

**Command handlers** trigger commands on aggregate and then the command is going to generate events.
Every domain event applies a state transition to an aggregate.

**Event handlers** are going to subscribe to an event and apply changes to an aggregate to change the state.
In a graph representation, event handlers would be the nodes and events the edges.

**CQRS** is used to create materialized views from streams of events.
With CQRS you will have a command side and a query side.
For example the commands might be written to an Apache Kafka event store.
Then an event processor could be using Spring Cloud Stream to retrieve these events and create a data model.
The data model is then written to a Data Store like MySQL, where the query side reads the data.
An API gateway, like Spring Cloud Netflix Zuul, can be put in front so it looks for the consumer like a regular microservice.
For deploying this application you can combine these components together or scale them independently.

### Serverless

Changes the pricing model for the execution on a cloud provider.
With Serverless you are going to have a function in the cloud and you are going to pay for each execution.
It is an event driven model, so if data is fed to for instance a AWS Lambda function this can invoke other functions in Python for example.

Kenny concluded with a demo and recommended [Dave Syer's Talk on Spring Cloud Functions](#spring-cloud-functions) for more info about serverless.

# Spring break

<p style="text-align: center;">
  <img class="image fit" alt="Google Spanner" src="/img/SpringIO2017/terras.jpg">
</p>

# 9. New in Spring 5: Functional Web Framework

### by [Arjen Poutsma](https://twitter.com/poutsma){:target="_blank"}

In the keynote Andy Wilkinson and Stéphane Nicoll mentioned that the Spring framework and especially **Spring Boot is all about providing choices to developers**.
The framework provides us with tools to tackle problems in multiple ways. 
In the light of this, starting from Spring 5 there will be a new functional alternative to handle incoming web requests.

This new functional web library is an alternative to annotation driven approach that is broadly applied in current applications.

> Arjen Poutsma states that some people are not happy with magic that happens behind the scenes when you use annotations like `@RequestMapping` or the newer `@GetMapping`

This was one of the reasons that made Spring develop this new library.

In the next sections we show a quick introduction to what was shown at Spring IO about what this new framework has to offer.

#### Handler function example

The following UserHandler class is the replacement of the Controller class that we would have annotated in the regular web framework. 
In this new functional style the way we handle requests is a bit different.
We define functions that have a ServerRequest as parameter and we return a Mono with a ServerResponse.

The request contains all the information we need.
It contains the body of the request, pathvariables, request headers, ...
So no more injecting pathvariables and body objects, we have everything we need in this ServerRequest.

What we return is the ServerResponse in which we can easily put all the information we want to give back to the client.
And Spring provides us with an easy builder to create such a response as it already did with the ResponseEntity builder.

You can see that these new objects and builders provide us with an easy and declarative way to handle requests and create responses, without the "magic" that we used previously with the annotations.

{% highlight java %}
public class UserHandler {

    public UserHandler(UserRepository repository) {
        this.repository = repository;
    }
    
    public Mono<ServerResponse> getUser(ServerRequest request) {
        int userId = Integer.valueOf(request.pathVariable("id"));
        Mono<ServerResponse> notFound = ServerResponse.notFound().build();
        Mono<User> userMono = this.repository.getUser(personId);
        
        return userMono
                .flatMap(user -> ServerResponse.ok().contentType(APPLICATION_JSON).body(fromObject(user)))
                .switchIfEmpty(notFound);
    }
    
    public Mono<ServerResponse> createUser(ServerRequest request) {
        Mono<User> user = request.bodyToMono(User.class);
        return ServerResponse.ok().build(this.repository.saveUser(user));
    }
    
    public Mono<ServerResponse> listUsers(ServerRequest request) {
        Flux<User> people = this.repository.allUsers();
        return ServerResponse.ok().contentType(APPLICATION_JSON).body(users, User.class);
    }
}
{% endhighlight %}

We have defined how we want to handle requests and how we translate it to a response.
What we need next, is a way to say which requests will be handled by which handler function.

In Spring MVC, this was done by adding an annotation that declared some parameters, for example, to couple a request path to a controller method.
The functional web framework does this by creating `RouterFunctions`.

This RouterFunction is a function that takes a `ServerRequest` and returns a `Mono<HandlerFunction>`. 
To choose which requests get handled by which HandlerFunction, Spring again provides us with some builder functions.

That way we can easily bind the handlers we just created with a path as shown in the next code example.

#### Router example

{% highlight java %}
public RouterFunction<ServerResponse> routingFunction() {
    PersonHandler handler = new PersonHandler(userRepository);
    
    return nest(path("/person"),
            nest(accept(APPLICATION_JSON),
                    route(GET("/{id}"), handler::getPerson)
                    .andRoute(method(HttpMethod.GET), handler::listPeople)
            ).andRoute(POST("/").and(contentType(APPLICATION_JSON)), handler::createPerson));
}
{% endhighlight %}

#### Creating a Tomcat server

Now that we have declared which routes are handled by which functions we have to let our server know this.
In the next code example we show how to create a Tomcat server and how to bind the `RouterFunction` to our server.

{% highlight java %}
public void startTomcatServer() throws LifecycleException {
    RouterFunction<?> route = routingFunction();
    HttpHandler httpHandler = toHttpHandler(route);
    
    Tomcat tomcatServer = new Tomcat();
    tomcatServer.setHostname(HOST);
    tomcatServer.setPort(PORT);
    Context rootContext = tomcatServer.addContext("", System.getProperty("java.io.tmpdir"));
    ServletHttpHandlerAdapter servlet = new ServletHttpHandlerAdapter(httpHandler);
    Tomcat.addServlet(rootContext, "httpHandlerServlet", servlet);
    rootContext.addServletMapping("/", "httpHandlerServlet");
    tomcatServer.start();
}
{% endhighlight %}

And then in the main method we only have to start our Tomcat server and we're up and running:

{% highlight java %}
public static void main(String[] args) throws Exception {
    Server server = new Server();
    server.startTomcatServer();
}
{% endhighlight %}

### Conclusion
The new functional web framework gives us a more declarative and functional way to create a server and handle web requests. 
In my opinion this code is a lot clearer because you have a direct link between routing and handling requests.

This code may also be easer to test than the annotation driven web request handling because we don't necessarily need to fire up our spring context to test the routing.
We can just create a unit test for our RouterFunction and verify our routes are correct. 

What I do still wonder about is how this integrates with Spring security.
How can we define which users can access which handler.
Do we still do this with annotations or will we get a new way to do this as well?

The Spring functional web framework is an interesting new development and we will be following it closely to see how we can use it in our new projects.

# Spring break

<p style="text-align: center;">
  <img class="image fit" alt="Google Spanner" src="/img/SpringIO2017/SpringIO2017group.jpg">
</p>

# 10. Spring Auto REST Docs

### by [Florian Benz](https://twitter.com/flbenz){:target="_blank"}

Spring Auto REST Docs is an extension on Spring REST Docs (**our post on Spring REST Docs can be found [here](https://ordina-jworks.github.io/conference/2016/06/30/SpringIO16-Spring-Rest-Docs.html){:target="_blank"}**).
This extension helps you to write even less code by including your Javadoc into the Spring REST Docs. 

For a more detailed overview on what is possible and how to start using this extension, please visit the official documentation [here](https://scacap.github.io/spring-auto-restdocs/){:target="_blank"}.

Imagine you have the following method in your controller:

{% highlight java %}
@RequestMapping("users")
public Page<ItemResponse> searchItem(@RequestParam("page") Integer page, @RequestParam("per_page") Integer per_page) { ... }
{% endhighlight %}

With the following POJO:

{% highlight java %}
public class User {
    private String username;
    private String firstName;
    private String lastName;
    
    ...
}
{% endhighlight %}

And the test that generates Spring REST Docs:

{% highlight java %}
this.mockMvc.perform(get("/users?page=2&per_page=100")) 
	.andExpect(status().isOk())
	.andDo(document("users", 
    requestParameters( 
        parameterWithName("page").description("The page to retrieve"), 
        parameterWithName("per_page").description("Entries per page") 
    ),
    responseFields(
            fieldWithPath("username").description("The user's unique database identifier."),
            fieldWithPath("firstName").description("The user's first name."),
            fieldWithPath("lastName").description("The user's last name."),
    )));
{% endhighlight %}

When using Spring Auto REST Docs, this could be replaced by adding **Javadoc** to the method in the controller:

{% highlight java %}
/**
 * @param page The page to retrieve
 * @param per_page Entries per page
 */
@RequestMapping("users")
public Page<ItemResponse> searchItem(@RequestParam("page") Integer page, @RequestParam("per_page") Integer per_page) { ... }
{% endhighlight %}

And adding Javadoc to the POJO fields:

{% highlight java %}
public class User {
    /**
    * The user's unique database identifier.
    */
    @NotBlank
    private String username;
    
    /**
    * The user's first name.
    */
    @Size(max = 20)
    private String firstName;
    
    /**
    * The user's last name.
    */
    @Size(max = 50)
    private String lastName;
    
    ...
}
{% endhighlight %}

And then removing the `requestParameters` and `responseFields` from the test:

{% highlight java %}
this.mockMvc.perform(get("/users?page=2&per_page=100")) 
	.andExpect(status().isOk());
{% endhighlight %}

You notice that I added the annotations `@NotBlank` and `@Size` in the POJO, these annotations will also be reflected in the resulting documentation.
You could also create your own annotations.

Result:

Path | Type | Optional | Description
-----|-----|-----|-----
username|String|false|The user's unique database identifier.
firstName|String|true|The user's first name. Size must be between 0 and 20 inclusive.
lastName|String|true|The user's last name. Size must be between 0 and 50 inclusive.

Because the description of the POJO is now added on field level, it is guaranteed that this description will be the same everywhere this field is used, meaning less maintenance is needed.

# 11. References

### Youtube Playlist

[All the talks of Spring IO 2017 are available on Youtube](https://www.youtube.com/watch?v=uJSYnqIhcIo&list=PLe6FX2SlkJdSkg3C_H_x9jzMqh1mrbNoJ){:target="_blank"}.

### Talks: Day One

Topic | Presenter(s) | Resource(s)
--- | --- | ---
KEYNOTE - The Only Constant Is Change | Stéphane Nicoll, Andy Wilkinson | [![code](/img/SpringIO2017/icon-code.png)](https://github.com/snicoll-demos/demo-webflux-streaming){:target="_blank"}
Reactor 3, the reactive foundation for Java 8 (and Spring 5) | Simon Baslé | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://speakerdeck.com/simonbasle/reactor-3){:target="_blank"}
Architecture Deep Dive in Spring Security | Joe Grandja | 
The Spring ecosystem in 50 minutes | Jeroen Sterken | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://www.slideshare.net/JeroenSterken1/the-spring-ecosystem-in-50-min){:target="_blank"}
Bootiful Development with Spring Boot and Angular [WORKSHOP] |Matt Raible | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://speakerdeck.com/mraible/bootiful-development-with-spring-boot-and-angular-spring-io-2017){:target="_blank"}
Spring Boot at AliExpress | Juven Xu | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://www.slideshare.net/juvenxu/aliexpress-way-to-microservices-microxchg-2017){:target="_blank"}
Database centric applications with Spring Boot and jOOQ | Michael Simons | [![code](/img/SpringIO2017/icon-code.png)](https://github.com/michael-simons/bootiful-databases){:target="_blank"}
Testing for Unicorns | Alex Soto | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://www.slideshare.net/asotobu/testing-for-unicorns-77069262){:target="_blank"}
Front Ends for Back End Developers | Matt Raible | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://speakerdeck.com/mraible/front-ends-for-back-end-developers-spring-io-2017){:target="_blank"}
The Beginner’s Guide To Spring Cloud | Ryan Baxter | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://speakerdeck.com/ryanjbaxter/beginners-guide-to-spring-cloud){:target="_blank"}
Microservices, but what about the UI | Marten Deinum | 
Making the most of Spring boot: adapt to your environment! [WORKSHOP] | Arjan Jorritsma, Erwin Hoeckx
New in Spring 5: Functional Web Framework | Arjen Poutsma | [![code](/img/SpringIO2017/icon-code.png)](https://github.com/poutsma/web-function-sample){:target="_blank"}
Deep Learning with DeepLearning4J and Spring Boot | Artur Garcia, Dimas Cabré| 
Easily secure and add Identity Management to your Spring(Boot) applications | Sébastien Blanc
The Future of Event-driven Microservices with Spring Cloud Stream | Kenny Bastani | [![code](/img/SpringIO2017/icon-code.png)](https://github.com/kbastani/event-stream-processing-microservices){:target="_blank"}
Container orchestration on Apache Mesos - DC/OS for Spring Boot devs | Johannes Unterstein | 
Building Spring boot + Angular4 apps in minutes with JHipster | Deepu K Sasidharan | 
Hands-on reactive applications with Spring Framework 5 [WORKSHOP] | Brian Clozel, Violeta Georgieva | [![code](/img/SpringIO2017/icon-code.png)](https://github.com/bclozel/webflux-workshop){:target="_blank"}
DDD Strategic Design with Spring Boot | Michael Plöd | [![code](/img/SpringIO2017/icon-code.png)](https://github.com/mploed/ddd-strategic-design-spring-boot){:target="_blank"}
Awesome Tools to Level Up Your Spring Cloud Architecture | Andreas Evers | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://www.slideshare.net/AndreasEvers1/awesome-tools-to-level-up-your-spring-cloud-architecture-spring-io-2017){:target="_blank"}
Surviving in a Microservices Team | Steve Pember | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://www.slideshare.net/StevePember/surviving-in-a-microservices-environment){:target="_blank"}

## Talks: Day Two

Topic | Presenter(s) | Resource(s)
--- | --- | ---
Reactive Spring | Mark Heckler, Josh Long | [![code](/img/SpringIO2017/icon-code.png)](https://github.com/joshlong/flux-flix-service){:target="_blank"}
Spanner - a fully managed horizontally scalable relational database with ACID transactions that speaks SQL | Robert Kubis
Reactive Spring UI's for business | Risto Yrjänä
Hands-on reactive applications with Spring Framework 5 [WORKSHOP] | Brian Clozel, Violeta Georgieva | [![code](/img/SpringIO2017/icon-code.png)](https://github.com/bclozel/webflux-workshop){:target="_blank"}
Data Processing With Microservices | Michael T Minella | [![code](/img/SpringIO2017/icon-code.png)](https://github.com/mminella/data-microservices){:target="_blank"}
Protection and Verification of Security Design Flaws | Marcus Pinto, Roberto Velasco
Experiences from using discovery services in a microservice landscape | Magnus Larsson
Harnessing the Power of Spark & Cassandra within your Spring App | Steve Pember | [![code](/img/SpringIO2017/icon-code.png)](https://github.com/spember/spark-cass-spring-demo){:target="_blank"}
It's a kind of magic: under the covers of Spring Boot | Andy Wilkinson, Stéphane Nicoll
Introducing Spring Auto REST Docs | Florian Benz | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://www.slideshare.net/fbenz/introducing-spring-auto-rest-docs){:target="_blank"}
Leveraging Domain Events in your Spring Boot Microservices [WORKSHOP] | Michael Plöd | [![code](/img/SpringIO2017/icon-code.png)](https://github.com/mploed/event-driven-spring-boot){:target="_blank"}
Functional web applications with Spring and Kotlin | Sébastien Deleuze | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://speakerdeck.com/sdeleuze/functional-web-applications-with-spring-and-kotlin){:target="_blank"}
Setting up a scalable CI platform with jenkins, docker and rancher in 50 minutes | Wolfgang Brauneis, Rainer Burgstaller | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://github.com/rburgst/rancherci-presentation){:target="_blank"} [![code](/img/SpringIO2017/icon-code.png)](https://github.com/rburgst/rancherci-seedjob){:target="_blank"} [![code](/img/SpringIO2017/icon-code.png)](https://github.com/rburgst/rancherci-demoapp){:target="_blank"}
The Road to Serverless: Functions as Applications | Dave Syer | [![presentation](/img/SpringIO2017/icon-presentation.png)](http://presos.dsyer.com/decks/road-to-serverless.html){:target="_blank"} [![code](/img/SpringIO2017/icon-code.png)](https://github.com/dsyer/spring-cloud-function){:target="_blank"}
TDD with Spring Boot - Testing the Harder Stuff  | Sannidhi Jalukar | 
Splitting component containers to simplify dependencies | Eugene Petrenko | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://docs.google.com/presentation/d/1CRjAKdQEvVNi9JzuudEKlnncJffKi5k8Lw0J335IYMk/edit?usp=sharing){:target="_blank"}
Build complex Spring Boot microservices architecture using JHipster [WORKSHOP] | Deepu K Sasidharan | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://deepu.js.org/jh-slides-springio-2017/index-ms.html){:target="_blank"}
Caching Made Bootiful | Neil Stevenson | [![code](/img/SpringIO2017/icon-code.png)](https://github.com/neilstevenson/springIO2017){:target="_blank"}
Getting Thymeleaf ready for Spring 5 and Reactive | Daniel Fernández | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://speakerdeck.com/dfernandez/o-2017-getting-thymeleaf-ready-for-spring-5-and-reactive){:target="_blank"} [![code](/img/SpringIO2017/icon-code.png)](https://github.com/danielfernandez/reactive-matchday){:target="_blank"}
Developing a Spring Boot Starter for distributed logging | Carlos Barragan
Reactive Meets Data Access | Christoph Strobl | [![code](/img/SpringIO2017/icon-code.png)](https://github.com/christophstrobl/spring-data-reactive-demo){:target="_blank"}
Building on spring boot lastminute.com microservices way | Luca Viola, Michele Orsi
Growing Spring-based commons, lessons learned | Piotr Betkier | 
CQRS with Spring Cloud Stream [WORKSHOP] | Jakub Pilimon
Develop and Run your Spring Boot application on Google App Engine Flexible | Rafael Sánchez | [![code](/img/SpringIO2017/icon-code.png)](https://codelabs.developers.google.com/codelabs/cloud-app-engine-springboot/#0){:target="_blank"}
Manage distributed configuration and secrets with Spring Cloud and Vault | Andreas Falk | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://www.slideshare.net/AndreasFalk2/manage-distributed-configuration-and-secrets-with-spring-cloud-and-vault-spring-io-2017){:target="_blank"}
From Zero to Open Source Hero: Contributing to Spring projects | Vedran Pavic | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://speakerdeck.com/vpavic/from-zero-to-open-source-hero-contributing-to-spring-projects-1){:target="_blank"}
