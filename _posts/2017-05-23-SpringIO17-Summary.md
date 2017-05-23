---
layout: post
authors: [dieter_hubau]
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
