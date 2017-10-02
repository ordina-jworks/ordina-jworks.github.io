---
layout: post
authors: [dieter_hubau]
title: 'Spring Cloud Stream - A New Rick and Morty Adventure'
image: /img/spring-cloud-stream.png
tags: [Spring, Cloud, Stream, Microservices, RabbitMQ, Messaging, Reactive, Rick, Morty]
category: Spring
comments: true
---

# Introduction

One of the most interesting aspects of the Spring Framework and its ecosystem is **abstraction**.
The Spring project maintainers and contributors have always succeeded in hiding complexity from the application developer, by adding different layers of abstraction.

For example, the way a Spring `Bean` of a certain Interface can be autowired and how Spring will find a suitable implementation class at runtime, is a very obvious example of the [Liskov Substitution Principle](https://en.wikipedia.org/wiki/Liskov_substitution_principle){:target="_blank"} or **how to abstract away implementation from specification**.

A second, higher level example is the [Spring Data](http://projects.spring.io/spring-data/){:target="_blank"} project which offers a common programming model for SQL as well as NoSQL databases, abstracting away the specifics of the database internals.

Another great example of abstraction is the one I'll be discussing in this blog post.

**DISCLAIMER**: a big part of this blog post will explain how Spring Cloud Stream works by using heavy references to the animated series [Rick and Morty](http://rickandmorty.wikia.com/wiki/Rickipedia){:target="_blank"}, with the intention to be hilarious and informative at the same time.
If you don't know the show or have no sense of humor, this blog post will be informative only &#128521;

I will ignore the obvious third option: *this blog post might not be funny at all*.

# Spring Cloud Stream

I just can't start explaining something without a definition, that would be cruel and irresponsible:

> Spring Cloud Stream is a framework for building message-driven microservices
> It provides an **opinionated configuration** of message brokers, introducing the concepts of persistent pub/sub semantics, consumer groups and partitions **across several middleware vendors**

The last part is what I like the most.
Spring Cloud Stream abstracts away the complexity of connecting to different middleware solutions.
It does this *the Spring Boot way*: by **automatically configuring sensible defaults** and allowing the developer to adapt the parts he wants.

It might be surprising, but [Spring Cloud Stream](https://cloud.spring.io/spring-cloud-stream/){:target="_blank"} is not *that* new in the Spring Cloud ecosystem.
The project was called `spring-bus` during its prototype phase and the first real commit was on May 28th 2015.
[Dave Syer](https://twitter.com/david_syer){:target="_blank"} performed the commit that changed it to its current name on **July 8th 2015**, so I will call that **the birth of Spring Cloud Stream**!

The most active contributor up until now is probably [Marius Bogoevici](https://twitter.com/mariusbogoevici){:target="_blank"}.
Questions about the project can be directed to the community in the [Spring Cloud Stream Gitter channel](https://gitter.im/spring-cloud/spring-cloud-stream){:target="_blank"}.

## Application Model

As is described in the [very detailed documentation](https://docs.spring.io/spring-cloud-stream/docs/current-SNAPSHOT/reference/htmlsingle/){:target="_blank"}, the following image details how a typical Spring Cloud Stream application is structured:

<img alt="Spring Cloud Stream application model" style="max-width: 367px" src="{{ '/img/spring-cloud-stream/application-core.png' | prepend: site.baseurl }}" class="image fit"/>

An application defines `Input` and `Output` channels which are injected by Spring Cloud Stream at runtime.
Through the use of so-called `Binder` implementations, the system connects these channels to external brokers.

So once again, the difficult parts are abstracted away by Spring, leaving it up to the developer to simply define the inputs and outputs of the application.
How messages are being transformed, directed, transported, received and ingested are all up to the binder implementations.

## Binder Implementations

Currently, there are official Binder implementations supported by Spring for RabbitMQ and Kafka.
Next to those, there are **several community binder implementations** available:

<img alt="Spring Cloud Stream Binders implementations" style="max-width: 367px" src="{{ '/img/spring-cloud-stream/binders.png' | prepend: site.baseurl }}" class="image fit"/>

The current - non-exhaustive - list:

* [JMS (ActiveMQ, HornetQ, IBM MQ,...)](https://github.com/spring-cloud/spring-cloud-stream-binder-jms){:target="_blank"}
* [AWS Kinesis](https://github.com/spring-cloud/spring-cloud-stream-binder-aws-kinesis){:target="_blank"}
* [Google Cloud Pub Sub](https://github.com/spring-cloud/spring-cloud-stream-binder-google-pubsub){:target="_blank"}
* [Redis](https://github.com/spring-cloud/spring-cloud-stream-binder-redis){:target="_blank"}
* [Gemfire](https://github.com/spring-cloud/spring-cloud-stream-binder-gemfire){:target="_blank"}

# Rick and Morty

As I have said earlier in the post, I will explain Spring Cloud Stream using a somewhat different approach, but I feel it helps to capture the power of the project.

**Behold**, our first character appears on stage:

## Rick

<img alt="Rick Sanchez" style="max-width: 259px" src="{{ '/img/spring-cloud-stream/rick.png' | prepend: site.baseurl }}" class="image fit"/>

This is [Rick Sanchez](http://rickandmorty.wikia.com/wiki/Rick_Sanchez){:target="_blank"}.
He is Morty's grandfather, a genius mastermind, inventor of inter-dimensional travel, the Microverse, a butter-passing robot and much, much more.

He is also an **asshole**.

<img alt="Rick Sanchez" style="max-width: 480px" src="{{ '/img/spring-cloud-stream/purpose.gif' | prepend: site.baseurl }}" class="image fit"/>

## Rick's Obsession

In the first episode of Season 3, Rick expressed his obsession with the [1998 Mulan Szechuan Sauce](http://mcdonalds.wikia.com/wiki/Szechuan_Sauce){:target="_blank"}.
The saying goes that a picture is worth a thousand words, so that means this video below will explain, like, a bajillion words or something:

<iframe width="560" height="315" src="https://www.youtube.com/embed/xilkhMtZD20" frameborder="0" allowfullscreen></iframe>


So now we know that Rick really wants this Szechuan sauce.

Now, we have a purpose:

> We will create a Spring Cloud Stream application, called *Rick*, which sole purpose is to retrieve Szechuan sauce from McDonalds!

As with every Spring based application these days, it's as easy as going to the happiest place on earth (next to **production**): [https://start.spring.io](https://start.spring.io){:target="_blank"}.
As our dependencies, we pick **Spring Web MVC** to create some handy web endpoints and **Stream Rabbit** since we want to send our messages over a RabbitMQ broker.
We end up with the following dependencies:

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-stream-rabbit</artifactId>
    </dependency>
</dependencies>
```

So how does a basic Spring Cloud Stream application look like? Well, it's actually not that different from a regular Spring Boot application:

```java
@SpringBootApplication
@EnableBinding({ InputChannels.class, OutputChannels.class })
public class RickApplication {

	public static void main(String[] args) {
		SpringApplication.run(RickApplication.class, args);
	}
}
```

Looks pretty familiar, doesn't it? That's because the only new thing in the snippet above is the `@EnableBinding` annotation, which automagically converts your application into a **full-fledged messaging beast**!
The `InputChannels` and `OutputChannels` interfaces are specific to my application.

Very simply explained, we can describe the Rick microservice with the following diagram:

<img alt="Rick Microservice" style="max-width: 640px" src="{{ '/img/spring-cloud-stream/diagram/rick.png' | prepend: site.baseurl }}" class="image fit"/>

As you can see, we have defined one input channel called `rick` and one output channel called `microverse`.
These are implemented in a Spring Cloud Stream application like this:

```java
public interface InputChannels {
	@Input
	SubscribableChannel rick();
}
```

```java
public interface OutputChannels {
	@Output
	MessageChannel microverse();
}
```

> Holy sh*t Rick, this almost seems like it's too easy!

Well Morty, erm dear reader, that's because it is!
Didn't I tell you that Spring is awesome at abstraction?
Yeah, this is why.
The only thing that is left for us to do, is write our "business logic", or in our case: the part where we try to find our beloved Szechuan sauce!

Since Rick is very lazy and an arrogant genius, he's not gonna look for the sauce himself.
I mean, he's got adventures to go on, inventions to invent and generally be a pain in the ass of the [Galactic Federation](http://rickandmorty.wikia.com/wiki/Galactic_Federation){:target="_blank"}.

Let's add another output channel to our interface:

```java
public interface OutputChannels {
	@Output
	MessageChannel meeseeks();

	@Output
	MessageChannel microverse();
}
```

Meeseeks?! What the hell is a meeseeks?
Patience my dear reader, all will be explained shortly.
First, let me show you the evil, brilliant piece of code which is gonna get us the Szechuan sauce:

```java
@Component
public class SzechuanSauceFinder {

    private static final String C_137 = "C-137";
    private static final int minimumRequestIntervalInMillis = 50;
    private static boolean SEARCHING = false;

	void findThatSauce() throws InterruptedException {
		if (!SEARCHING) {
			SEARCHING = true;
			int requestIntervalInMillis = 5000;

			while (SEARCHING) {
				this.outputChannels.meeseeks().send(buildMessage(I_WANT_MY_SZECHUAN_SAUCE, C_137));

				Thread.sleep(requestIntervalInMillis);

				requestIntervalInMillis = Math.max(minimumRequestIntervalInMillis, requestIntervalInMillis - 200);
			}

			SEARCHING = false;
		}
	}

	void stopSearching() {
		SEARCHING = false;
	}
}
```

Isn't that some of the most evil code you've ever seen?
Nothing more evil than static variables controlling the state in your logic, or precisely placed `Thread.sleep()` commands.

Okay, we've got a messaging microservice, pumping out messages at an increasing rate (up until 20 per second).
How will we know if our *meeseeks*, whatever that is, has found the szechuan sauce?

The rest of the code in this Component will illustrate **how an input channel can handle incoming messages**:

```java
@Autowired
public SzechuanSauceFinder(InputChannels inputChannels, OutputChannels outputChannels) {
    this.outputChannels = outputChannels;
    inputChannels.rick().subscribe((message -> {
        GlipGlop glipGlop = (GlipGlop) message.getPayload();
        if (glipGlop.getQuote() == ALL_DONE) {
            stopSearching();
            this.outputChannels.microverse().send(buildMessage(WUBBA_LUBBA_DUB_DUB, C_137));
        }
    }));
}

private Message<?> buildMessage(RickAndMortyQuote quote, String instanceId) {
    return MessageBuilder.withPayload(new GlipGlop(quote, instanceId)).build();
}
```

Since the `rick` input channel is a `SubscribableChannel`, we can subscribe to it.
Well [duh](http://pa1.narvii.com/6422/b662846ee28e630dd9661ecca86bd9c4ee0275ef_hq.gif){:target="_blank"}!
A `message` can be of any type but we do need to cast it to our own format, a [GlipGlop](https://www.youtube.com/watch?v=G9Ebl9vEKx0&t=28s){:target="_blank"}, but Spring has [ways to make this easier](https://docs.spring.io/spring-cloud-stream/docs/Elmhurst.BUILD-SNAPSHOT/reference/htmlsingle/#_using_streamlistener_for_automatic_content_type_handling){:target="_blank"} for us.
We could have created a method annotated with the new `@StreamListener` annotation, which would look like this:

```java
@StreamListener(InputChannels.RICK)
public void handle(GlipGlop glipGlop) {
    ...
}
```

## The Microverse

Everything that will be transpiring in this post, will be contained to the miniature dimension called **The Microverse**:
<img alt="The Microverse Battery" style="max-width: 367px" src="{{ '/img/spring-cloud-stream/Microverse_Battery.png' | prepend: site.baseurl }}" class="image fit"/>
[*the Microverse Battery*](http://rickandmorty.wikia.com/wiki/Microverse_Battery){:target="_blank"}
