---
layout: post
authors: [yannick_de_turck, andreas_evers]
title: 'Lagom: First Impressions and Initial Comparison to Spring Cloud'
image: /img/lagom.png
tags: [Lagom, Java, Reactive, Domain-Driven Design, CQRS, Event Sourcing]
category: Microservices
comments: true
---
> "It’s open source. It’s highly opinionated.
   Build greenfield microservices and decompose your Java EE monolith like a boss." - Lightbend

----------

## Table of Contents
1. [Just the right amount](#just-the-right-amount)
2. [Design philosophy](#design-philosophy)
3. [Building blocks](#building-blocks)
4. [Getting started with Lagom](#getting-started-with-lagom)
5. [Anatomy of a Lagom project](#anatomy-of-a-lagom-project)
6. [Example of a microservice](#example-of-a-microservice)
7. [CQRS and Event Sourcing](#cqrs-and-event-sourcing)
8. [Lightbend Q&A at the CodeStar launch event](#lightbend-qa-at-the-codestar-launch-event)
9. [Comparison with Spring](#comparison-with-spring)
10. [Our advice](#our-advice)
11. [Conclusion](#conclusion)
12. [Useful links](#useful-links)

## Just the right amount
Meet [Lagom](https://www.lightbend.com/lagom), [Lightbend](https://www.lightbend.com)'s (formerly Typesafe) new open source framework for architecting microservices in **Java**.
On the 10th of March, Lightbend released the first **MVP version** of Lagom which is the current version at the time of writing.
Although there is currently only a **Java API**, Scala enthusiasts should not fret because a **Scala API** is a main priority and [well on its way](https://github.com/lagom/lagom/issues/1).

Lagom is a Swedish word meaning "just the right amount".
Microservices have often been categorised as small services.
However, Lightbend wants to emphasize that finding the right boundaries between services, aligning them with bounded contexts, business capabilities, and isolation requirements are the most important aspects when architecting a microservice-based system.
Therefore, it fits very well in a **Domain-Driven Design** focused mindset.

Following this will help in building a scalable and resilient system that is easy to deploy and manage.
According to Lightbend the focus should not be on how small the services are, but instead they should be *just the right size*, "Lagom" size services.
Lagom, being an opinionated framework, provides a "golden path" from which the developer can deviate if necessary.
Being based on the reactive principles as defined in the [Reactive Manifesto](http://www.reactivemanifesto.org/), Lagom provides the developer a guard-railed approach with good defaults while also allowing to deviate if necessary.

This blogpost will cover our initial impression on the framework together with our opinion on the choices made while architecting the framework.
Note that we won't go too deep into detail in all the different aspects of the framework, for more details refer to Lagom's extensive [documentation](http://www.lagomframework.com/documentation/1.0.x/java/Home.html).
As Lightbend is entering the microservices market with Lagom, we feel obliged to make a fair comparison with existing frameworks out there.
In the Java world this is predominantly the **Spring stack** with Spring Boot and Spring Cloud, standing on the shoulders of giants such as the **Netflix OSS**.
In this current stage, it would be a bit too early to make an in-depth comparison between the two, seeing as you would be comparing a mature project to an MVP.
What we can share though, are our initial observations.

## Design philosophy
Lagom's design rests on the following principles:

- **Message-Driven and Asynchronous**: Built upon Akka Stream for asynchronous streaming and the JDK8 CompletionStage API.
Streaming is a first-class concept.
- **Distributed persistence**: Lagom favours distributed persistence patterns using Event Sourcing with Command Query Responsibility Segregation (CQRS).
- **Developer productivity**: Starting all microservices with a single command, code hot reloading and expressive service interface declarations are some examples of Lagom's high emphasis on developer productivity.

## Building blocks
The Lagom framework acts as an abstraction layer upon several Lightbend frameworks and consists of the following core technologies and frameworks:

- [Scala](http://www.scala-lang.org)
- [Java](https://www.java.com)
- [Play Framework](https://www.playframework.com)
- [Akka](http://akka.io) and [Akka Persistence](http://doc.akka.io/docs/akka/snapshot/scala/persistence.html)
- [sbt](http://www.scala-sbt.org)
- [Cassandra](http://cassandra.apache.org)
- [Guice](https://github.com/google/guice)
- [ConductR](https://www.lightbend.com/products/conductr)

Seeing as it acts as an abstraction layer the developer doesn't need to hold any knowledge of Play Framework and Akka in order to successfully use Lagom.
Sbt has been chosen as the build tool because it also acts as a development environment.
Lagom relies heavily on the following sbt features:

- Fine-grained tasks
- Each task may return a value
- The value returned by a task may be consumed by other tasks

According to Lightbend, **Scala's build tool 'sbt'** offers many handy features to Lagom such as fast incremental recompilation, hot code reloading, starting and stopping services in parallel and automatic injection of configuration defaults.
Sbt might be seen as a hurdle by most Java developers since it is **Maven** and **Gradle** (and to a lesser extent **Ant**) that rule most Java projects.
Moving towards a microservices framework such as Lagom would already constitute quite a transition so we think that this might hold back Java developers from adopting the framework.
Lightbend's rebranding could be interpreted as a move away from a Scala-oriented company towards a more Java-minded company.
In that regard it would make sense to lower the initial learning curve especially for a rather trivial component such as a building tool.
After all, the most important thing to achieve adoption is allowing people to easily get started with the new technology. 
We think that providing integration for Maven or Gradle would have a positive effect on the adoption rate and although it may not be trivial to implement, it should help convince Java developers to give Lagom a go.

**Google's Guice** has been chosen for dependency injection since it is a lightweight framework.
What is remarkable is that Guice is used as well for intermicroservices calls.
Lagom acts as a communication abstraction layer and it does so by adding a dependency on the interfaces of remote microservices.
Just like a shared domain model and shared datastores being antipatterns for microservices, having code dependencies from one service in another is as well.
Changing the code of one microservice should not have an immediate cascading effect on other microservices.
This is the very essence of the microservices architecture.
In a monolith, having code changes in one component can result in immediate breaking changes in other components of the system.
While this may be desired in order to keep technical debt low, this is an inherent characteristic of monolithic systems.
One of the reasons microservices were introduced, is to decouple components on all levels, especially binary coupling.
Using protocols between components instead of actual binary dependencies allows us to implement the tolerant reader principle and versioning through for instance content negotiation.
Lightbend argues that sharing interfaces as code will increase productivity and performance, but we fear the result of this is a distributed monolith instead of an actual decoupled microservices architecture.
While we question the default way of communicating between microservices in Lagom, we are enthusiastic that more ways of making intermicroservices calls are becoming available.
Using HTTP is possible as well, and one of the upcoming features is a [Lagom Service Client](https://gitter.im/lagom/lagom?at=56efe42c0d69dfd122218ddc).
The Guice approach might also be quite favorable for people migrating from monolithic applications to microservices.
In the end it is a trade-off, but one that shouldn't be taken lightly.

As a default persistence solution, **Apache Cassandra** is used due to how well it integrates with **CQRS** and **Event Sourcing**.
Lagom has support for Cassandra as datastore, both for the reading and writing data.
It is possible to use other datastore solutions but this comes at the cost of not being able to take advantage of the persistence module in Lagom.

**ConductR** is an orchestration tool for managing Lightbend Reactive Platform applications across a cluster of machines and is Lightbend's solution for running Lagom systems in production.
Note that ConductR comes with a license fee and is majorly targeted at enterprises.
The other option we currently have in order to run our Lagom system in production is to write our [own service locator](http://www.lagomframework.com/documentation/1.0.x/java/Overview.html#production) compatible with Lagom.
At the time of writing someone already started working on [Kubernetes support](https://github.com/lagom/lagom/issues/59) and we are sure that, given more time, more options will become available.
For now though, Lagom is still in an early stage where we either have to pay for the ConductR license, build our own service locator, or wait until someone does the work for us.

## Getting started with Lagom

In order to start using Lagom, [Activator](https://www.lightbend.com/community/core-tools/activator-and-sbt) must be correctly set up.
Currently [two Lagom templates](https://www.lightbend.com/activator/templates#filter:lagom) exist that can be used for creating a new Lagom application.
The [Lagom Java Seed template](https://www.lightbend.com/activator/template/lagom-java) should be the template of choice, the [Lagom Java Chirper template](https://www.lightbend.com/activator/template/lagom-java-chirper) is an example of a Twitter-like app created in Lagom.

Creating a new Lagom application is as simple as using the following command:

`$ activator new my-first-system lagom-java`

Afterwards the project can be imported in any of the prominent IDEs as an sbt project.

In order to boot the system, we first need to navigate to the root of the project and start the Activator console:

`$ activator`

After which we can start all our services using a single simple command:

`$ runAll`

{% highlight bash %}
> runAll
[info] Starting embedded Cassandra server
.......
[info] Cassandra server running at 127.0.0.1:4000
[info] Service locator is running at http://localhost:8000
[info] Service gateway is running at http://localhost:9000
[info] application - Signalled start to ConductR
[info] application - Signalled start to ConductR
[info] application - Signalled start to ConductR
[info] Service helloworld-impl listening for HTTP on 0:0:0:0:0:0:0:0:24266
[info] Service hellostream-impl listening for HTTP on 0:0:0:0:0:0:0:0:26230
[info] (Services started, use Ctrl+D to stop and go back to the console...)
{% endhighlight %}

This command starts a **Cassandra server**, **service locator** and **service gateway**.
Each of our microservices is started in parallel while also registering them in the service locator.
Additionally, a `run` command to individually start services is available as well.
Note that the ports are assigned to each microservice by an [algorithm](http://www.lagomframework.com/documentation/1.0.x/java/ServicePort.html#How-are-ports-assigned-to-services?) and are consistent even on different machines.
The possibility to assign a specific port is available though.

Similar to Play Framework, Lagom also supports code hot reloading allowing you to make changes in the code and immediately seeing these changes live without having to restart anything.
A feature we're very fond of.
In general, a restart is only required when adding a new microservice API and implementation module in the project.

## Anatomy of a Lagom project

```
helloworld-api           → Microservice API submodule
 └ src/main/java         → Java source code interfaces with model objects
helloworld-impl          → Microservice implementation submodule
 └ logs                  → Logs of the microservice
 └ src/main/java         → Java source code implementation of the API submodule
 └ src/main/resources    → Contains the microservice application config
 └ src/test/java         → Java source code unit tests
logs                     → Logs of the Lagom system
project                  → Sbt configuration files
 └ build.properties      → Marker for sbt project
 └ plugins.sbt           → Sbt plugins including the declaration for Lagom itself
.gitignore               → Git ignore file
build.sbt                → Application build script
```

## Example of a microservice
In order to write a new microservice you create a new API and implementation project.
In the API project you define the interface of your microservice:

`HelloService.java`
{% highlight java %}
public interface HelloService extends Service {
  ServiceCall<String, NotUsed, String> hello();
  
  ServiceCall<String, GreetingMessage, String> useGreeting();

  @Override
  default Descriptor descriptor() {
    return named("helloservice").with(
        restCall(Method.GET,  "/api/hello/:id",       hello()),
        restCall(Method.POST, "/api/hello/:id",       useGreeting())
      ).withAutoAcl(true);
  }
}
{% endhighlight %}
A `Descriptor` defines the service name and the endpoints offered by a service. 
In our case we define two REST endpoints, a GET and a POST.

`GreetingMessage` is basically an immutable class with a single String `message` instance variable.
On the subject of immutability the [Lagom documentation](http://www.lagomframework.com/documentation/1.0.x/java/ImmutablesInIDEs.html#Set-up-Immutables-in-your-IDE) mentions [Immutables](https://immutables.github.io), a Java library that helps you create immutable objects via annotation processing.
Definitely worth a look seeing as it helps you get rid of boilerplate code.

In the implementation submodule we implement our API's interface.

`HelloServiceImpl.java`
{% highlight java %}
public class HelloServiceImpl implements HelloService {
  @Override
  public ServiceCall<String, NotUsed, String> hello() {
    return (id, request) -> {
      CompletableFuture.completedFuture("Hello, " + id);
    };
  }

  @Override
  public ServiceCall<String, GreetingMessage, String> useGreeting() {
    return (id, request) -> {
      CompletableFuture.completedFuture(request.message + id);
    };
  }
}
{% endhighlight %}

You'll immediately notice that the service calls are non-blocking by default using [CompletableFutures](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CompletableFuture.html) introduced in JDK8.
Interesting to know is that Lagom also provides support for the [Publish-subscribe pattern](http://www.lagomframework.com/documentation/1.0.x/java/PubSub.html#Publish-Subscribe) out of the box.
We also need to implement the module that binds the HelloService so that it can be served.

`HelloServiceModule.java`
{% highlight java %}
public class HelloServiceModule extends AbstractModule implements ServiceGuiceSupport {
  @Override
  protected void configure() {
    bindServices(serviceBinding(HelloService.class, HelloServiceImpl.class));
  }
}
{% endhighlight %}

We define our module in the `application.config`:
{% highlight scala %}
play.modules.enabled += sample.helloworld.impl.HelloServiceModule
{% endhighlight %}

And finally register our microservice in `build.sbt` with its dependencies and settings:
{% highlight scala %}
lazy val helloworldApi = project("helloworld-api")
  .settings(
    version := "1.0-SNAPSHOT",
    libraryDependencies += lagomJavadslApi
  )

lazy val helloworldImpl = project("helloworld-impl")
  .enablePlugins(LagomJava)
  .settings(
    version := "1.0-SNAPSHOT",
    libraryDependencies ++= Seq(
      lagomJavadslPersistence,
      lagomJavadslTestKit
    )
  )
  .settings(lagomForkedTestSettings: _*)
  .dependsOn(helloworldApi)
{% endhighlight %}

We can then test our endpoint:
{% highlight bash %}
$ curl localhost:24266/api/hello/World
Hello, World!

$ curl -H "Content-Type: application/json" -X POST -d '{"message": "Hello "}' http://localhost:24266/api/hello/World
Hello World
{% endhighlight %}

Seeing as any good developer writes unit tests for his/her code so should we!

{% highlight java %}
public class HelloServiceTest {
  private static ServiceTest.TestServer server;

  @BeforeClass
  public static void setUp() {
    server = ServiceTest.startServer(ServiceTest.defaultSetup());
  }

  @AfterClass
  public static void tearDown() {
    if (server != null) {
      server.stop();
      server = null;
    }
  }

  @Test
  public void shouldRespondHello() throws Exception {
    // given
    HelloService service = server.client(HelloService.class);

    // when
    String hello = service.hello().invoke("Yannick", NotUsed.getInstance()).toCompletableFuture().get(5, SECONDS);

    // then
    assertEquals("Hello, Yannick", hello);
  }

  @Test
  public void shouldRespondGreeting() throws Exception {
    // given
    HelloService service = server.client(HelloService.class);

    // when
    String greeting = service.useGreeting().invoke("Yannick", new GreetingMessage("Hi there, ")).toCompletableFuture().get(5, SECONDS);

    // then
    assertEquals("Hi there, Yannick", greeting);
  }
}
{% endhighlight %}

Tests can be executed in Activator via the following command:
`$ test`
 
{% highlight bash %}
> test
[info] Test run started
[info] Test sample.helloworld.impl.HelloServiceTest.testHello started
[info] Test sample.helloworld.impl.HelloServiceTest.testGreeting started
[info] Test run finished: 0 failed, 0 ignored, 2 total, 16.759s
[info] Passed: Total 2, Failed 0, Errors 0, Passed 2
[success] Total time: 21 s, completed Apr 14, 2016 10:06:41 AM
{% endhighlight %}

## CQRS and Event Sourcing
Being an opinionated framework Lagom suggests to use **CQRS** and **Event Sourcing** seeing as it fits well within the reactive paradigm.
In this blogpost we are not going to explain CQRS and Event Sourcing in detail seeing as it is very well documented in the [documentation](http://www.lagomframework.com/documentation/1.0.x/java/ES_CQRS.html#Event-Sourcing-and-CQRS) of Lagom.
The gist of it is that each service should own its own data and only the service itself should have direct access to the database.
Other services need to use the service's API in order to interact with its data.
Sharing the database across different services would result in tight coupling.
Ideally we want to work with [Bounded Contexts](http://martinfowler.com/bliki/BoundedContext.html) following the core principles of Domain-Driven Design where each service defines a Bounded Context.
Using **Event Sourcing** gives us many advantages such as not only storing the current state of data but having an entire journal of events that tell us how the data achieved its current state.
With event sourcing we only perform reads and writes, there are no updates nor deletes.
All this makes it easy to test and debug and allows us to easily reproduce scenarios that happened in production by replaying the event log from that environment.

Note that just because Lagom encourages us to use CQRS and Event Sourcing it isn't forcing us to use it as it is not always applicable to every use case.
It is perfectly possible to, for example, plug in a PostgreSQL database for our persistence layer.
Someone has already set up [PostgreSQL integration using Revenj persistence](https://github.com/dsl-platform/lagom-postgres).
However, Lightbend suggests that for best scalability preference must be given to asynchronous APIs because using blocking APIs like JDBC and JPA will have an impact on that.

By default, when launching our development environment, a Cassandra server will be booted without having to do any setup ourselves besides adding the `lagomJavadslPersistence` dependency to our implementation in our `build.sbt`.

Regarding the code, a **persistent entity** needs to be defined, combined with a related **command**, **event** and **state**.
Note that the following code samples are mainly here to give an idea of the work needed for implementing all this.
For more information and a detailed explanation, consult the [excellent documentation](http://www.lagomframework.com/documentation/1.0.x/java/PersistentEntity.html#Persistent-Entity) on the subject.

In the persistent entity we define the behaviour of our entity.
In order to interact with event sourced entities, commands need to be sent.
We therefore need to specify a command handler for each command class that the entity can receive.
Commands are then translated into events which will get persisted by the entity.
Each event has its own event handler registered.

Example of a PersistentEntity:

`HelloWorld.java`

{% highlight java %}
public class HelloWorld extends PersistentEntity<HelloCommand, HelloEvent, WorldState> {
  @Override
  public Behavior initialBehavior(Optional<WorldState> snapshotState) {
    BehaviorBuilder b = newBehaviorBuilder(
        snapshotState.orElse(new WorldState("Hello", LocalDateTime.now().toString())));
    b.setCommandHandler(UseGreetingMessage.class, (cmd, ctx) ->
      ctx.thenPersist(new GreetingMessageChanged(cmd.message),
        evt -> ctx.reply(Done.getInstance())));

    b.setEventHandler(GreetingMessageChanged.class,
        evt -> new WorldState(evt.message, LocalDateTime.now().toString()));

    b.setReadOnlyCommandHandler(Hello.class,
        (cmd, ctx) -> ctx.reply(state().message + ", " + cmd.name + "!"));

    return b.build();
  }
}
{% endhighlight %}

Our PersistentEntity requires a state to be defined:

`WorldState.java`
{% highlight java %}
@Immutable
@JsonDeserialize
public final class WorldState implements CompressedJsonable {
  public final String message;
  public final String timestamp;

  @JsonCreator
  public WorldState(String message, String timestamp) {
    this.message = Preconditions.checkNotNull(message, "message");
    this.timestamp = Preconditions.checkNotNull(timestamp, "timestamp");
  }

  @Override
  public boolean equals(@Nullable Object another) {
    if (this == another)
      return true;
    return another instanceof WorldState && equalTo((WorldState) another);
  }

  private boolean equalTo(WorldState another) {
    return message.equals(another.message) && timestamp.equals(another.timestamp);
  }

  @Override
  public int hashCode() {
    int h = 31;
    h = h * 17 + message.hashCode();
    h = h * 17 + timestamp.hashCode();
    return h;
  }

  @Override
  public String toString() {
    return MoreObjects.toStringHelper("WorldState").add("message", message).add("timestamp", timestamp).toString();
  }
{% endhighlight %}

In our command interface we define all the commands that our entity supports.
In order to get a complete picture of the commands an entity supports, it is the convention to specify all supported commands as inner classes of the interface.

`HelloCommand.java`

{% highlight java %}
public interface HelloCommand extends Jsonable {
  @Immutable
  @JsonDeserialize
  public final class UseGreetingMessage implements HelloCommand, CompressedJsonable, PersistentEntity.ReplyType<Done> {
    public final String message;

    @JsonCreator
    public UseGreetingMessage(String message) {
      this.message = Preconditions.checkNotNull(message, "message");
    }

    @Override
    public boolean equals(@Nullable Object another) {
      if (this == another)
        return true;
      return another instanceof UseGreetingMessage && equalTo((UseGreetingMessage) another);
    }

    private boolean equalTo(UseGreetingMessage another) {
      return message.equals(another.message);
    }

    @Override
    public int hashCode() {
      int h = 31;
      h = h * 17 + message.hashCode();
      return h;
    }

    @Override
    public String toString() {
      return MoreObjects.toStringHelper("UseGreetingMessage").add("message", message).toString();
    }
  }

  @Immutable
  @JsonDeserialize
  public final class Hello implements HelloCommand, PersistentEntity.ReplyType<String> {
    public final String name;
    public final Optional<String> organization;

    @JsonCreator
    public Hello(String name, Optional<String> organization) {
      this.name = Preconditions.checkNotNull(name, "name");
      this.organization = Preconditions.checkNotNull(organization, "organization");
    }

    @Override
    public boolean equals(@Nullable Object another) {
      if (this == another)
        return true;
      return another instanceof Hello && equalTo((Hello) another);
    }

    private boolean equalTo(Hello another) {
      return name.equals(another.name) && organization.equals(another.organization);
    }

    @Override
    public int hashCode() {
      int h = 31;
      h = h * 17 + name.hashCode();
      h = h * 17 + organization.hashCode();
      return h;
    }

    @Override
    public String toString() {
      return MoreObjects.toStringHelper("Hello").add("name", name).add("organization", organization).toString();
    }
  }
}
{% endhighlight %}

And finally we want to define all events that the entity supports in an event interface.
It follows the same convention as with commands, specifying all events as inner classes of the interface.

`HelloEvent.java`

{% highlight java %}
public interface HelloEvent extends Jsonable {
  @Immutable
  @JsonDeserialize
  public final class GreetingMessageChanged implements HelloEvent {
    public final String message;

    @JsonCreator
    public GreetingMessageChanged(String message) {
      this.message = Preconditions.checkNotNull(message, "message");
    }

    @Override
    public boolean equals(@Nullable Object another) {
      if (this == another)
        return true;
      return another instanceof GreetingMessageChanged && equalTo((GreetingMessageChanged) another);
    }

    private boolean equalTo(GreetingMessageChanged another) {
      return message.equals(another.message);
    }

    @Override
    public int hashCode() {
      int h = 31;
      h = h * 17 + message.hashCode();
      return h;
    }

    @Override
    public String toString() {
      return MoreObjects.toStringHelper("GreetingMessageChanged").add("message", message).toString();
    }
  }
}
{% endhighlight %}

The `HelloServiceImpl.java` class will look like the following:

{% highlight java %}
public class HelloServiceImpl implements HelloService {
  private final PersistentEntityRegistry persistentEntityRegistry;

  @Inject
  public HelloServiceImpl(PersistentEntityRegistry persistentEntityRegistry) {
    this.persistentEntityRegistry = persistentEntityRegistry;
    persistentEntityRegistry.register(HelloWorld.class);
  }

  @Override
  public ServiceCall<String, NotUsed, String> hello() {
    return (id, request) -> {
      PersistentEntityRef<HelloCommand> ref = persistentEntityRegistry.refFor(HelloWorld.class, id);
      return ref.ask(new Hello(id, Optional.empty()));
    };
  }

  @Override
  public ServiceCall<String, GreetingMessage, Done> useGreeting() {
    return (id, request) -> {
       PersistentEntityRef<HelloCommand> ref = persistentEntityRegistry.refFor(HelloWorld.class, id);
       return ref.ask(new UseGreetingMessage(request.message));
    };
  }
}
{% endhighlight %}

## Lightbend Q&A at the CodeStar launch event
On the 24th of March we attended the launch event of [CodeStar](http://www.codestar.nl), the new unit from our Dutch Ordina colleagues focused on Full Stack Scala and Big Data solutions.
CodeStar also hold a Lightbend partnership.
One of the presentations was [an introduction to Lagom](https://www.youtube.com/watch?v=POKZ1TRJ4G4) by [Markus Eisele](https://twitter.com/myfear), Developer Advocate at Lightbend.
After his talk we had the opportunity to ask Markus and his colleague, [Lutz Hühnken](https://twitter.com/lutzhuehnken), Solutions Architect at Lightbend, several questions regarding Lagom.

- What do you guys consider to be the major competitor for Lagom?
Spring Cloud and Netflix OSS?

    > Yes, we would consider that stack to be Lagom's main competitor. 
    > But we believe that with Lagom we have a number of unique features that makes us shine (because otherwise we wouldn’t have built it):
    > <br/>1) Lagom’s development environment, in my humble opinion a major productivity boost
    > <br/>2) Fostering good practices for building reactive services seeing as Lagom is opinionated, e.g. async communication by default, ES/CQRS, ...
    > <br/>3) Batteries-included, from development to production
    > <br/>4) Streaming is first-class

- Lagom suggests that Event Sourcing and CQRS should be used as the default solution for persistence but is it really applicable in the majority of the scenarios?

    > Lagom is an opinionated framework and will try to suggest using ES & CQRS as the primary solution to use since it fits very well with the reactive mindset.
    > Of course it also depends on the use case.

- Don’t you think you encourage code coupling by having microservices depend on the interface of another microservice?

    > It is true that the default way to do service calls between Lagom services is to use binary dependencies, though of course it is not enforced. We have taken great care to ensure that service calls map down to idiomatic REST and/or websockets. We do have plans in the future to allow simple removal of the binary coupling. To make service interfaces go through a non-binary specification such as Swagger, where Swagger specs will be generated and interfaces will be generated from the Swagger specs.

- Does Lagom support REST level 3? Is there support for hypermedia?

    > Currently not supported but we are open to it. Feel free to create a suggestions ticket at the [GitHub project](https://github.com/lagom/lagom).

- Don't you think it is a bad idea to only support ConductR for production deployments?
What about pet projects of single developers? This makes it less appealing to motivate people to pick up Lagom compared to for example Spring Cloud and Netflix OSS.
    
    > It is in the strategic planning of Lightbend to push ConductR forward as the main solution for your production environment.
    > Do note that it’s perfectly possible to deploy your Lagom services elsewhere as long as you implement your own [service locator](http://www.lagomframework.com/documentation/1.0.x/java/ServiceLocator.html#Service-Locator) (as an example, the integration needed to support Lagom in ConductR is available on [GitHub](https://github.com/typesafehub/conductr-lib/tree/master/lagom10-conductr-bundle-lib)).
    > Looking at our [Open Source Position Statement](https://www.lightbend.com/open-source-position-statement) you will notice that one of the differentiators we see between our open source offerings and the commercial products is Time. 
    > Open source users tend to invest their time rather than their money. 
    > ConductR integration into Lagom could be seen as an example for this. 
    > If you would rather spend the money than invest time, buy ConductR. 
    > If you would rather invest time instead of money, build your own ServiceLocator implementation and use a different infrastructure.
    > An example of this is the [GitHub issue](https://github.com/lagom/lagom/issues/59) for implementing Kubernetes support.

- How do you integrate with other non-Lagom microservices?

    > Currently you would call them via REST URLs. 
    > In the near future the [Lagom Service Client](https://gitter.im/lagom/lagom?at=56efe42c0d69dfd122218ddc) could also be used to consume them. 
    > Additionally it should also be possible to integrate [Eureka](https://github.com/Netflix/eureka) in Lagom.

- What is the deployment procedure exactly? How do I prepare my Lagom application for deployment into production?

    > The deployment unit in ConductR is a bundle which is an abstract term that can mean a Docker image or a zip file with a certain structure.
    > By default, when you have multiple services in one project, it will create multiple bundles. You call `bundle:dist` once on the top level and it will create a separate bundle for each service which can then be deployed to ConductR.
    > You can put multiple components in one bundle so you could have multiple services in one bundle, but we think that it is unusual.
    > Ideally, each service needs to be its own bundle managed in isolation by ConductR, for it to be able to be able to be developed, rolled out, upgraded and failed in isolation. 

- What about API versioning?

    > Currently there is no versioning for your services besides the "default" way to do it, e.g. via the header or by versioning your urls.

- What do you think about the so-called serverless architectures like AWS Lambda or Google Cloud Functions?
    
    > We think that those architectures are part of the future. 
    > Lagom can be seen as a step in that direction since it decouples the stateless part of the service (the behavior) from the stateful (persistent entity), allowing the stateless part to be scaled out independently, and automatically by the runtime, in a similar fashion to AWS Lambda. 
    > A hosted version of Lagom could give a very similar experience.
    
- About sbt, will you also support a more widely adopted tool such as Maven or Gradle?

    > Lagom relies on some sbt features, so supporting other build tools is not trivial. 
    > While it is probably doable to support Maven, we’d need to do build a proof-of-concept to verify this. 
    > This is currently not prioritized. We’ll be watching the community's feedback on this.

- Does the Lagom circuit breaker have a dashboard such as the Hystrix dashboard? Does Lagom in general have operational dashboards?

    > You could integrate the circuit breaker data with monitoring tools such as Graphite and Grafana.
    > In addition, with Lightbend Monitoring you do get a suite of tools for monitoring your microservices. 
    > Lightbend Monitoring is included in the ConductR license.
    
- Is it true that Typesafe rebranded to Lightbend to get a broader adoption than what was possible with a more Scala-orientated reputation attached to Typesafe?

    > That is correct.
    > This doesn't mean that we are giving up on Scala, it is still core to all of our technologies.

## Comparison with Spring

Spring has been out there for more than 10 years and with Spring Boot and Spring Cloud a trend has been set to move to self-contained applications as a basis for microservices development.
Spring reaps the fruits of the Netflix OSS while offering Spring's own components such as Spring Cloud Config and Spring Security as well.
The Netflix and Spring stack comes with all the necessary tools to build and run microservices in production.

Externalized configuration, out-of-the-box free dashboards for service registries, circuit breaker monitoring and distributed tracing, integration with service registries such as Eureka, Consul and Zookeeper, production-ready monitoring and metrics features with Actuator endpoints, integration with build tools such as Maven and Gradle and extensive security features including upcoming integration with [Vault](https://www.vaultproject.io) are only a subset of the features Spring has to offer.

Seeing as Lagom is still in its early days, it wouldn't be fair to Lightbend to make an in-depth comparison with the Spring stack.
We hope that Lagom will continue to grow towards a more mature framework and a true alternative to Spring on all levels.
The first steps we currently see look promising and we hope that they will consider our remarks for how they want to further evolve the framework.
It is great to see more microservices frameworks become available and we applaud Lightbend for taking up the competition with Spring.

## Our advice

Our advice is to keep track of Lagom's progress closely.

If you are currently looking for a mature framework with integration capabilities for just about anything, go with Spring.

If you want to use Event Sourcing, Lagom should be a great fit. 
Additionally, Lagom’s focus on CQRS and its reactive core are truly differentiators with other frameworks.
Lagom has great potential and is eager to get community involvement. 
If you are willing to join forces with Lightbend, Lagom might already be a viable candidate for you.

## Conclusion
We think that Lagom looks very promising and we will definitely follow it up.
Due to Lagom being an opinionated framework everything glues together well.
Lagom is just a thin layer on top of Akka and Play, which is very mature and hardened over the years.
It might be a bit too early to do an in-depth comparison between Lagom and Spring Cloud since we would be comparing an MVP against a mature technology.

We do think that using sbt might be a hurdle for Java developers and it would ease adoption if there would be other ways to use Lagom in production besides ConductR.
As it stands right now you would need to write a custom service locator yourself.
It would close the gap with Spring if support would already be available for service discovery via for example Eureka or Consul.

It is clear that Lagom puts a lot of focus on reactiveness and gaining the best performance. 
This could come at the cost of binary coupling, seeing as the default way to do service calls between Lagom services is to use binary dependencies. 
We are looking forward to Lightbend’s plans to go through non-binary specifications in order to reduce coupling on a binary level as well.

Given that it is currently an MVP version we are interested in seeing how Lagom matures. 
Since it is all new and shiny, you will be able to give back to the community by helping to develop parts of this new and exciting framework yourself.
Contributing to the framework is easy via pull requests and are actively reviewed by Lightbend developers.
The developers are very active on their [Gitter](https://gitter.im/lagom/lagom) channel and they are quick to answer questions. 
We are also very excited to the release of the Scala API.

Our colleague [Andreas Evers](https://twitter.com/andreasevers), who has extensive knowledge on Spring Cloud and Netflix OSS, will soon be participating in a podcast with Markus Eisele hosted by Lightbend to discuss Lagom and microservices trends.
The date should be announced soon.
Be sure to follow Andreas and Lightbend to catch it!

## Useful links

- [Lagom](https://www.lightbend.com/lagom)
- [Lagom documentation](http://www.lagomframework.com/documentation/1.0.x/java/Home.html)
- [Lagom Twitter](https://twitter.com/lagom)
- [Lagom GitHub](https://github.com/lagom/lagom)
- [Lagom Gitter](https://gitter.im/lagom/lagom)
- [Lightbend](https://www.lightbend.com)
- [Lightbend Twitter](https://twitter.com/lightbend)
- [Markus Eisele Twitter](https://twitter.com/myfear)
- [Lutz Hühnken Twitter](https://twitter.com/lutzhuehnken)
