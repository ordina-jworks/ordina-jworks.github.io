---
layout: post
authors: [dieter_hubau, gina_de_beukelaer, hans_michiels]
title: 'Spring I/O 2017 Recap'
image: /img/springio2017.jpg
tags: [Spring, IO, Pivotal, Google, Spring Boot, Java, Reactive, Reactor]
category: Spring
comments: true
---

> Last week, we had another great edition of Spring I/O, brought to us by organizer [Sergi Almar](https://twitter.com/sergialmar).
In this blogpost, we will go over some of our favourite sessions of the conference.

> **DISCLAIMER**: this is obviously a very opinionated list of talks. This does not mean that the other talks were of lower quality, it just means we weren't able to attend or did not take extensive notes.

# Keynote

### by [Andy Wilkinson](https://twitter.com/ankinson) and [Stéphane Nicoll](https://twitter.com/snicoll)

Obviously, the keynote presentation was filled with announcements, interesting tidbits and two great presenters. They report the [Spring Boot 2.0.0 M1 release](https://spring.io/blog/2017/05/16/spring-boot-2-0-0-m1-available-now).
This release was announced very shortly after [Spring Framework 5.0 went RC1](https://spring.io/blog/2017/05/08/spring-framework-5-0-goes-rc1) on the 8th of May.

# Bootiful Database-centric applications with JOOQ

### by Michael Simons

- use case: power and gas usage, time-series data, SQL databases, PL/SQL
- Desktop GIS using Oracle Spatial
- question: SQL, ORM or something in between / something else?
- many options: JDBCTemplate, JDBC, JPA, JPQL, Criteria API, ... and JOOQ... again, there is no **silver bullet**
- just becuase you use HIbernate, doesnt mean you need to use it for everything
- JOOQ:
  - exposes a legible DSL
  - is typesafe
  - query builder Framework
  - generates java-based schema (gradle, maven integration)
  - can reverse-engineer existing DB
  - generates SQL
- integration with Spring Boot:
  - spring boot starter called spring-boot-starter-jooq
- using maven:
  - runs database migration with Flyway or Liquibase first!
  - then runs code generator to generate java DSL context (in generate-sources build step)
  - this way, database is always up-to-date with DSL context
- difference between Query API and Hibernate ModelGen:
  - much more similar to the native SQL
  - easier to migrate existing PL/SQL applications?
  - much more extensive collection of SQL functions and possibilities

# Google Spanner

### by [Robert Kubis](https://twitter.com/hostirosti)

Google Spanner is a  globally distributed relational database service that provides ACID transactions and SQL semantics, without giving up horizontal scaling and high availability.
When building cloud applications, you are no longer forced to choose between  traditional databases that guarantee transactional consistency, or NoSQL databases that offer simple, horizontal scaling and data distribution.
Cloud Spanner offers both of these critical capabilities in a single, fully managed service.
With Spanner, your database can scale up and down as needed, and you only pay for the amount you use.
Spanner keeps application development simple by supporting standard tools and languages in a familiar relational database environment.
It supports distributed transactions, schemas and DDL statements, SQL queries and JDBC drivers and offers client libraries for the most popular languages, including Java, Go, Python and Node.js.
As a managed service, Cloud Spanner provides key benefits to DBAs:
- Focus on your application logic instead of spending valuable time managing hardware and software.
- Scale out your RDBMS solutions without complex sharding or clustering
Gain horizontal scaling without migration from relational to NoSQL databases.
- Maintain high availability and protect against disaster without needing to engineer a complex replication and failover infrastructure.
- Gain integrated security with data-layer encryption, identity and access management and audit logging
<p style="text-align: center;">
  <img class="image fit" alt="Google Spanner" src="/img/SpringIO2017/cloud-spanner.png">
</p>


# Keycloak

### by [Sébastien Blanc](https://twitter.com/sebi2706)

- Download Keycloak server
- Extract and run Keycloak server
- Create Spring Boot application
- Add keycloak Maven/Gradle dependency
- Add keycloak server URL property, the project name registered in Keycloak and the user role required
- Run!
- Integration with Spring Boot
- Integration with Spring Security
- Automatic registration of application possible using one-time tokens
- Supports openID connect, SAML, Kerberos, ...
- User mgmt, social integration, registration page, forgot password functionality, all out-of-the-box, configurable at runtime
- All Keycloak logon pages are stylable through templates

# Spring Cloud Streams (Data Services)

### by [Michael Minella](https://twitter.com/michaelminella)

- Lots of Big Data frameworks out there (Hadoop, Spark, ...)
- They can handle BIG amounts of data very well
- They are too bulky/difficult/inappropriate for smaller volumes of data
- Learning curve too high
- Use case: data microservices:
  - developed and tested in isolation, also easier to test
  - independently scalable depending on data processing load
  - familiar development model, just like regular cloud-native Spring microservices
  - easier to govern for Ops
  - the need for data/app integration/composition arises
  - the need for orchestration and operational coverage arises (lots of plumbing required)
- Spring Cloud Stream
  - Streams are thin wrappers around Spring integration
  - Supported binder for integration between services: Kafka, RabbitMQ, ...
  - Source, Processor, Sink
- Spring Cloud Task
  - Tasks are finite microservices, built around Spring Batch
  - "Microservices that end"
  - contains Task repository which tracks run/start/end of the tasks
  - has Spring Batch integration (partition steps using workers)
  - has Spring Cloud Stream integration (eg. launch Tasks via Streams)
  - simple annotation `@EnableTask`
  - use cases: batch jobs, scheduled one-off processes, ETL processing, data science
- Spring Cloud Data Flow
  - New and Improved Spring XD
  - Data flow orchestrator
  - Use a shell or the UI which goes over REST endpoints
  - Has custom DSL
  - Everything is Spring Boot (Data Flow server, Shell, ...)
  - Data Flow server has datastore for task repository, batch repository, configuration, ...
  - Data Flow server does **not** do any of the actual work

# Spring Cloud Functions

### by Dr. Dave Syer

- Cloud abstraction layers:
  - Virtual Machines (IaaS)
  - Containers (CaaS)
  - Applications (PaaS)
  - Functions (FaaS)

- Goal: raising the value line, going up the abstraction layers

- There are still other problems to be solved: service discovery, datastore connections, messaging systems

- Functions: a way of expressing business logic without having these others issues, small unit of work, a single deployment unit

- Compared to Spring as an application framework: Spring allows us to write business logic

> "Serverless" is just ridiculous, of course you're gonna have servers, you just don't care about them

- Functions:
  - Event driven
  - Dynamic resource utilization
  - Billing per message (changes the way we design software, has implications on how we think about software)
  - Prototypes become production code really quickly (going from idea to product in days or weeks)
  - Focus on business logic

  > Visual Basic was a tool we gave to idiots, since it was easy to create a program quickly - doesn't mean it was a good thing - so we have to be careful!

- Get out of the business of infra and automation, aka "undifferentiated heavy lifting" does not deliver business value
- Functions make this possible
- Comparable: AWS Lambda, Google Cloud Function, Azure Function, IBM Openwhisk, Fission, Kubeless, ...

- Spring Cloud Functions:
  - All advantages of serverless/functions, but with all the possibilities that Spring offers (DI, integration, autoconfig, build tools)
  - Easy for Spring devs to jump on the FaaS model
  - Easy for FaaS people without having knowledge of Spring
  - Run the same business logic as web endpoint, stream processor or a task
  - uniform programming model across providers and able to run standalone (not on a IAAS or PAAS).
  - Supports reactive programming model (Flux, Mono) as well
````
@Bean
public Function<Flux<String>, Flux<String>> uppercase() {
  return flux -> flux.filter(this::isNotRude).map(String::toUpperCase);
}
````

# Spring Break
What have Barcelona and a trampoline have common ?

Spring-time !!!

<p style="text-align: center;">
  <img class="image fit" alt="Google Spanner" src="/img/SpringIO2017/pizza.jpg">
</p>


# Reactive Spring Data

### by Christophe Strobl

#### Biggest changes of M3

- Java 8 baseline
- ID classes don't need to be Serializable anymore
- **breaking change**: No more `null`s in the repositories (arguments or return  values)
- **breaking change**: More consistent naming (eg. `findOne -> findOneById`)
- Composable interfaces (separate Readable / Insertable and make custom repositories as composable interface as well)
- Builder style `Template` APIs
- Kotlin extensions in M4

#### Store specifics

- MongoDB:
  - **breaking change**: MongoDB driver baseline to 3.x
  - Introduction of ReactiveMongoTemplate
  - Enhanced aggregation support
  - Collation support

- Cassandra:
  - **breaking change**: Update to Cassandra 3.2
  - no reactive native driver --> mimicking reactive driver with threadpool (and blocking) underneath (with ReactiveCassandraTemplate)

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
  - improved headers
  - improved media type support

# The future of event driven microservices with spring cloud stream

### by [Kenny Bastani](https://twitter.com/kennybastani)

## Evolution

### Monolith application
* Slows our velocity getting into production
* Not as easy to add new engineers to a project
* To large for any one person to fully comprehend

### Monolith organization
* Centralized authority for operations, database and change management slows progress
* Coordinated releases batch many changes together from different teams
* Operations drives the runtime environment of applications
* Operations take all operation responsibility including upgrades of virtual machines
* Deploy everything at once or nothing at all

### Move towards SOA
Independent services: 
Key problem => shared libraries

### Microservices
Small teams organized around business capabilities with responsibility of running
Use rest api to communicates
Developers can choose tools

### Is it a Monolith or Microservice? 
If it takes longer than a day for an engineer to ramp up its probably a monolith

Antipattern to have frontend communicate directly to microservices
Instead use edge service 

## Splitting the monolith
-> Slice off (hard in practice) service migration

### Why we need event-driven microservices
Problems:
* No foreign key constraints between services
* Distributed transactions are brittle
* Distributed systems are hard

Without event-driven microservices

    You will drown in problems you didn't know that existed!
    
### Event-driven microservices
Domain events as a first class citizen 

(based on eventuate from Chris..)

* Use domain events for audit trails
* Each domain events contains subject and imutable data
* Every domain event applies a state transition to aggregate
* Event handler generate commands, commands generate events
...
* Regenerate state of aggregate by processing events 

Terminal state -> eventual consistency (order failed or succeeded)

Build hypermedia api's that attach:
* Event logs 
* Commands 
* Commits
as a link to an aggregate

### Event Handlers
Subscribe to an event an apply state changes to an aggregate.
...

CQRS is used to create materialized views from streams of events

Command side
Update Status

Query side


Command service writes events into kafka event store
Event processor loads events from store and update data store (mysql) 
Query side reads from the data stores

Serverless event handlers

# Spring break
What did the tree say to spring...?

What a re-leaf. 

<p style="text-align: center;">
  <img class="image fit" alt="Google Spanner" src="/img/SpringIO2017/terras.jpg">
</p>


# New in Spring 5: Functional Web Framework

### by [Arjen Poutsma](https://twitter.com/poutsma)

In the keynote Andy Wilkinson and Stéphane Nicoll mentioned that the Spring framework and especially Spring boot is all about providing choices to developers.
The framework provides us with tools to tackle problems in multiple ways. 
In the light of this, starting from Spring 5 there will be a new functional alternative to handle incoming web requests.

This new functional web framework is an alternative to annotation driven approach that is broadly applied in current applications.
Arjen Poutsma states that some people are not happy with magic that happens behind the scenes when you use annotations like @RequestMapping or the newer @GetMapping.
This was one of the reasons that made Spring develop this new framework.

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

You can see that these new objects and builders provide us with an easy and declarative way to handle request and create responses, without the "magic" that we used previously with the annotations.
```Java
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
```

Now we have defined how we want to handle request and how we translate it to a response.
What we need next is a way to say which requests will be handled by which handler function.

In the old way this was done by defining an annotation that defined some parameters to couple for example a path to a method.
The functional web framework does this by creating RouterFunctions.

This RouterFunction is a function that takes a ServerRequest and returns a `Mono<HandlerFunction>`. 
To choose which requests get handled by which HandlerFunction Spring again provides us with some builder functions.

That way we can easily bind the handlers we just created with a path as shown in the next code example.

#### Router example


```Java
public RouterFunction<ServerResponse> routingFunction() {
    PersonHandler handler = new PersonHandler(userRepository);
    
    return nest(path("/person"),
            nest(accept(APPLICATION_JSON),
                    route(GET("/{id}"), handler::getPerson)
                    .andRoute(method(HttpMethod.GET), handler::listPeople)
            ).andRoute(POST("/").and(contentType(APPLICATION_JSON)), handler::createPerson));
}
```

#### Create tomcat server

Now that we have declared which routes are handled by which functions we have to let our server know this.
In the next code example we show how to create a Tomcat server and how to bind the RouterFunction to our server.

```Java
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
```

And then in the main method we only have to start our Tomcat server and we're up and running.

```Java
public static void main(String[] args) throws Exception {
    Server server = new Server();
    server.startTomcatServer();
}
```

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

What did summer say to spring .. ?

Help! I'm going to fall.

<p style="text-align: center;">
  <img class="image fit" alt="Google Spanner" src="/img/SpringIO2017/SpringIO2017group.jpg">
</p>

# Spring Auto REST Docs
### by [Florian Benz](https://twitter.com/flbenz)

Spring Auto REST Docs is an extension on Spring REST Docs (our post on Spring REST Docs can be found [here](https://ordina-jworks.github.io/conference/2016/06/30/SpringIO16-Spring-Rest-Docs.html)).
This extension helps you to write even less code by including your Javadoc into the Spring REST Docs. 

#### Small usage example

_For a more detailed overview on what is possible and how to start using this extension, please visit the official documentation [here](https://scacap.github.io/spring-auto-restdocs/)._

Imagine you have the following method in your controller:
```Java
@RequestMapping("users")
public Page<ItemResponse> searchItem(@RequestParam("page") Integer page, @RequestParam("per_page") Integer per_page) { ... }
```

With the following POJO:
```Java
public class User {
    private String username;
    private String firstName;
    private String lastName;
    
    ...
}
```

And the test that generates Spring REST Docs:
```Java
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
```

##### Now using Spring Auto REST Docs, this could be replaced by 

Adding Javadoc to the method in the controller:
```Java
/**
 * @param page The page to retrieve
 * @param per_page Entries per page
 */
@RequestMapping("users")
public Page<ItemResponse> searchItem(@RequestParam("page") Integer page, @RequestParam("per_page") Integer per_page) { ... }
```

And adding Javadoc to the POJO fields:
```Java
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
```

And then removing the requestParameters and responseFields from the test:
```Java
this.mockMvc.perform(get("/users?page=2&per_page=100")) 
	.andExpect(status().isOk());
```

You notice that I added the annotations @NotBlank and @Size in the POJO, these annotations will also be reflected in the resulting documentation. You could also create your own annotations.

Result:

Path | Type | Optional | Description
-----|-----|-----|-----
username|String|false|The user's unique database identifier.
firstName|String|true|The user's first name. Size must be between 0 and 20 inclusive.
lastName|String|true|The user's last name. Size must be between 0 and 50 inclusive.

Because the description of the POJO is now added on field level, it is guaranteed that this description will be the same everywhere this field is used => less maintenance.

# References
### Day 1

Topic | Presenter(s) | Resource(s)
--- | --- | ---
KEYNOTE - The Only Constant Is Change | Stéphane Nicoll, Andy Wilkinson | [![code](/img/SpringIO2017/icon-code.png)](https://github.com/snicoll-demos/demo-webflux-streaming)
Reactor 3, the reactive foundation for Java 8 (and Spring 5) | Simon Baslé | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://speakerdeck.com/simonbasle/reactor-3)
Architecture Deep Dive in Spring Security | Joe Grandja | 
The Spring ecosystem in 50 minutes | Jeroen Sterken | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://www.slideshare.net/JeroenSterken1/the-spring-ecosystem-in-50-min)
Bootiful Development with Spring Boot and Angular [WORKSHOP] |Matt Raible | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://speakerdeck.com/mraible/bootiful-development-with-spring-boot-and-angular-spring-io-2017)
Spring Boot at AliExpress | Juven Xu | 
Database centric applications with Spring Boot and jOOQ | Michael Simons | 
Testing for Unicorns | Alex Soto | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://www.slideshare.net/asotobu/testing-for-unicorns-77069262)
Front Ends for Back End Developers | Matt Raible | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://speakerdeck.com/mraible/front-ends-for-back-end-developers-spring-io-2017)
The Beginner’s Guide To Spring Cloud | Ryan Baxter | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://speakerdeck.com/ryanjbaxter/beginners-guide-to-spring-cloud)
Microservices, but what about the UI | Marten Deinum | 
Making the most of Spring boot: adapt to your environment! [WORKSHOP] | Arjan Jorritsma, Erwin Hoeckx
New in Spring 5: Functional Web Framework | Arjen Poutsma | [![code](/img/SpringIO2017/icon-code.png)](https://github.com/poutsma/web-function-sample)
Deep Learning with DeepLearning4J and Spring Boot | Artur Garcia, Dimas Cabré| 
Easily secure and add Identity Management to your Spring(Boot) applications | Sébastien Blanc
The Future of Event-driven Microservices with Spring Cloud Stream | Kenny Bastani | [![code](/img/SpringIO2017/icon-code.png)](https://github.com/kbastani/event-stream-processing-microservices)
Container orchestration on Apache Mesos - DC/OS for Spring Boot devs | Johannes Unterstein | 
Building Spring boot + Angular4 apps in minutes with JHipster | Deepu K Sasidharan | 
Hands-on reactive applications with Spring Framework 5 [WORKSHOP] | Brian Clozel, Violeta Georgieva | [![code](/img/SpringIO2017/icon-code.png)](https://github.com/bclozel/webflux-workshop)
DDD Strategic Design with Spring Boot | Michael Plöd | [![code](/img/SpringIO2017/icon-code.png)](https://github.com/mploed/ddd-strategic-design-spring-boot)
Awesome Tools to Level Up Your Spring Cloud Architecture | Andreas Evers | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://www.slideshare.net/AndreasEvers1/awesome-tools-to-level-up-your-spring-cloud-architecture-spring-io-2017)
Surviving in a Microservices Team | Steve Pember | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://www.slideshare.net/StevePember/surviving-in-a-microservices-environment)

## Day 2

Topic | Presenter(s) | Resource(s)
--- | --- | ---
Reactive Spring | Mark Heckler, Josh Long | [![code](/img/SpringIO2017/icon-code.png)](https://github.com/joshlong/flux-flix-service)
Spanner - a fully managed horizontally scalable relational database with ACID transactions that speaks SQL | Robert Kubis
Reactive Spring UI's for business | Risto Yrjänä
Hands-on reactive applications with Spring Framework 5 [WORKSHOP] | Brian Clozel, Violeta Georgieva | [![code](/img/SpringIO2017/icon-code.png)](https://github.com/bclozel/webflux-workshop)
Data Processing With Microservices | Michael T Minella | [![code](/img/SpringIO2017/icon-code.png)](https://github.com/mminella/data-microservices)
Protection and Verification of Security Design Flaws | Marcus Pinto, Roberto Velasco
Experiences from using discovery services in a microservice landscape | Magnus Larsson
Harnessing the Power of Spark & Cassandra within your Spring App | Steve Pember | [![code](/img/SpringIO2017/icon-code.png)](https://github.com/spember/spark-cass-spring-demo)
It's a kind of magic: under the covers of Spring Boot | Andy Wilkinson, Stéphane Nicoll
Introducing Spring Auto REST Docs | Florian Benz | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://www.slideshare.net/fbenz/introducing-spring-auto-rest-docs)
Leveraging Domain Events in your Spring Boot Microservices [WORKSHOP] | Michael Plöd | [![code](/img/SpringIO2017/icon-code.png)](https://github.com/mploed/event-driven-spring-boot)
Functional web applications with Spring and Kotlin | Sébastien Deleuze | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://speakerdeck.com/sdeleuze/functional-web-applications-with-spring-and-kotlin)
Setting up a scalable CI platform with jenkins, docker and rancher in 50 minutes | Wolfgang Brauneis, Rainer Burgstaller | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://github.com/rburgst/rancherci-presentation) [![code](/img/SpringIO2017/icon-code.png)](https://github.com/rburgst/rancherci-seedjob) [![code](/img/SpringIO2017/icon-code.png)](https://github.com/rburgst/rancherci-demoapp)
The Road to Serverless: Functions as Applications | Dave Syer | [![presentation](/img/SpringIO2017/icon-presentation.png)](http://presos.dsyer.com/decks/road-to-serverless.html) [![code](/img/SpringIO2017/icon-code.png)](https://github.com/dsyer/spring-cloud-function)
TDD with Spring Boot - Testing the Harder Stuff  | Sannidhi Jalukar | 
Splitting component containers to simplify dependencies | Eugene Petrenko | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://docs.google.com/presentation/d/1CRjAKdQEvVNi9JzuudEKlnncJffKi5k8Lw0J335IYMk/edit?usp=sharing)
Build complex Spring Boot microservices architecture using JHipster [WORKSHOP] | Deepu K Sasidharan | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://deepu.js.org/jh-slides-springio-2017/index-ms.html)
Caching Made Bootiful | Neil Stevenson | [![code](/img/SpringIO2017/icon-code.png)](https://github.com/neilstevenson/springIO2017)
Getting Thymeleaf ready for Spring 5 and Reactive | Daniel Fernández | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://speakerdeck.com/dfernandez/o-2017-getting-thymeleaf-ready-for-spring-5-and-reactive) [![code](/img/SpringIO2017/icon-code.png)](https://github.com/danielfernandez/reactive-matchday)
Developing a Spring Boot Starter for distributed logging | Carlos Barragan
Reactive Meets Data Access | Christoph Strobl | [![code](/img/SpringIO2017/icon-code.png)](https://github.com/christophstrobl/spring-data-reactive-demo)
Building on spring boot lastminute.com microservices way | Luca Viola, Michele Orsi
Growing Spring-based commons, lessons learned | Piotr Betkier | 
CQRS with Spring Cloud Stream [WORKSHOP] | Jakub Pilimon
Develop and Run your Spring Boot application on Google App Engine Flexible | Rafael Sánchez | [![code](/img/SpringIO2017/icon-code.png)](https://codelabs.developers.google.com/codelabs/cloud-app-engine-springboot/#0)
Manage distributed configuration and secrets with Spring Cloud and Vault | Andreas Falk | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://www.slideshare.net/AndreasFalk2/manage-distributed-configuration-and-secrets-with-spring-cloud-and-vault-spring-io-2017)
From Zero to Open Source Hero: Contributing to Spring projects | Vedran Pavic | [![presentation](/img/SpringIO2017/icon-presentation.png)](https://speakerdeck.com/vpavic/from-zero-to-open-source-hero-contributing-to-spring-projects-1)
