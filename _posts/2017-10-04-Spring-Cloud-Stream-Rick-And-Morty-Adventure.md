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
Questions about the project can be directed to the most active contributors and community in the [Spring Cloud Stream Gitter channel](https://gitter.im/spring-cloud/spring-cloud-stream){:target="_blank"}.

## Application Model

As is described in the [very detailed documentation](https://docs.spring.io/spring-cloud-stream/docs/current-SNAPSHOT/reference/htmlsingle/){:target="_blank"}, the following image details how a typical Spring Cloud Stream application is structured:

<img alt="Spring Cloud Stream application model" style="max-width: 367px" src="{{ '/img/spring-cloud-stream/application-core.png' | prepend: site.baseurl }}" class="image fit"/>

An application defines `Input` and `Output` channels which are injected by Spring Cloud Stream at runtime.
Through the use of so-called `Binder` implementations, the system connects these channels to external brokers.

So once again, the difficult parts are abstracted away by Spring, leaving it up to the developer to simply define the inputs and outputs of the application.
How messages are being transformed, directed, transported, received and ingested are all up to the binder implementations.

## Binder Implementations

Currently, there are two official Binder implementations supported by Spring, for RabbitMQ and Kafka.
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
Nothing more evil than static variables controlling state of an application, or precisely placed `Thread.sleep()` commands.

Okay, we've got a messaging microservice, pumping out messages at an increasing rate (up until 20 per second).
How will we know if our *meeseeks*, whatever that is, has found the szechuan sauce?

The rest of the code in this class will illustrate **how an input channel can handle incoming messages**:

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
Well [duh](http://pa1.narvii.com/6422/b662846ee28e630dd9661ecca86bd9c4ee0275ef_hq.gif){:target="_blank"} Sherlock!
A `message` can be of any type but we do need to cast it to our own format, a [GlipGlop](https://www.youtube.com/watch?v=G9Ebl9vEKx0&t=28s){:target="_blank"}, but Spring has [ways to make this easier](https://docs.spring.io/spring-cloud-stream/docs/Elmhurst.BUILD-SNAPSHOT/reference/htmlsingle/#_using_streamlistener_for_automatic_content_type_handling){:target="_blank"} for us.
We could have created a method annotated with the new `@StreamListener` annotation, which would look like this:

```java
@StreamListener(InputChannels.RICK)
public void handle(GlipGlop glipGlop) {
    ...
}
```

Alright, so now we know what Rick wants, and how he intends to get it, we move to the next piece of the puzzle:

# Mr Meeseeks

Rick is such a genius, he invented a box that can spawn as many "Aladdin's genies" as you want.
Use with caution though, you have been warned!
[Meeseeks](http://rickandmorty.wikia.com/wiki/Mr._Meeseeks){:target="_blank"} are creatures created to serve a singular purpose for which they will go to any length to fulfill:

<iframe width="560" height="315" src="https://www.youtube.com/embed/qUYvIAP3qQk" frameborder="0" allowfullscreen></iframe>

## Finding the sauce

So our next task will be to create a **Mr Meeseeks microservice**.
If I were to draw a very simple diagram of this application, it would look something like this:

<img alt="Mr Meeseeks Microservice" style="max-width: 640px" src="{{ '/img/spring-cloud-stream/diagram/meeseeks.png' | prepend: site.baseurl }}" class="image fit"/>

Same story as with the Rick microservice.
We need a very simple Spring Cloud Stream application with one input channel called `meeseeks`.
In this case, we want to send GlipGlops to McDonalds, Rick and the Microverse, so we're gonna need three output channels.

The only thing we really need to put some effort in - *if you can even call it effort, I've had more effort tying my velcro shoes the other day* - is the **business logic**:

```java
@Component
public class MrMeeseekRoutine {

	private final OutputChannels outputChannels;

	@Value("${INSTANCE_INDEX:${CF_INSTANCE_INDEX:0}}")
	private String instanceId;

	@Autowired
	public MrMeeseekRoutine(InputChannels inputChannels, OutputChannels outputChannels) {
		this.outputChannels = outputChannels;

		inputChannels.meeseeks().subscribe(message -> {
			GlipGlop glipGlop = (GlipGlop) message.getPayload();
			if (glipGlop.getQuote() == I_WANT_MY_SZECHUAN_SAUCE) {
				this.outputChannels.microverse().send(MessageBuilder
					.withPayload(new GlipGlop(RickAndMortyQuote.OOOH_YEAH_CAN_DO, instanceId))
					.build());
				this.outputChannels.mcdonalds().send(MessageBuilder
					.withPayload(new GlipGlop(RickAndMortyQuote.PLEASE_GIVE_ME_SOME_SZECHUAN_SAUCE, instanceId))
					.build());
			} else if (glipGlop.getQuote() == YOU_ARE_A_WINNER) {
				this.outputChannels.rick().send(
					MessageBuilder.withPayload(new GlipGlop(RickAndMortyQuote.ALL_DONE, instanceId)).build());
			}
		});
	}
}
```

It's getting quite boring already, this is child's play.
What I'm [*obviously*](http://1.media.dorkly.cvcdn.com/23/26/c8f59cfc0bef4b6f164072daa2727e71.jpg){:target="_blank"} doing here, is:

* subscribe to the `meeseeks` input channel
* fetch the incoming GlipGlop
* if its from Rick, comply and send a GlipGlop to the McDonalds channel requesting some Szechuan sauce
* if its from McDonalds and a confirmation that we have just won some sauce, we let Rick know our task has been fulfilled

Let's see what our McDonalds microservice looks like.

# McDonalds: where the sauce is

<img alt="Szechuan Sauce" style="max-width: 600px" src="{{ '/img/spring-cloud-stream/szechuan-poster.jpg' | prepend: site.baseurl }}" class="image fit"/>

More recently, to my surprise, [McDonalds announced they were actually bringing back the now infamous 1998 Mulan Szechuan Sauce](http://www.ign.com/articles/2017/10/02/rick-and-morty-mcdonalds-is-bringing-back-szechuan-sauce-for-one-day-only){:target="_blank"}.
So I guess my demo just got a bit more relevant and my powers of clairvoyance are proven once again.

At this point, it's just more of the same. Let me show you the diagram:

<img alt="McDonalds Microservice" style="max-width: 640px" src="{{ '/img/spring-cloud-stream/diagram/mcdonalds.png' | prepend: site.baseurl }}" class="image fit"/>

* Spring Cloud Stream application
* one input channel `mcdonalds`
* one output channel `meeseeks`

You get it by now.

Here's the code **yawn**:

```java
@Component
public class McdonaldsCashier {

	private static final int ODDS_AT_FINDING_SZECHUAN_SAUCE = 500;
	private static final Random RAND = new Random();

	@Value("${INSTANCE_INDEX:${CF_INSTANCE_INDEX:0}}")
	private String instanceId;

	private int luckyNumber;

	@Autowired
	public McdonaldsCashier(InputChannels inputChannels, OutputChannels outputChannels) {
		this.luckyNumber = RAND.nextInt(ODDS_AT_FINDING_SZECHUAN_SAUCE);

		inputChannels.mcdonalds().subscribe(message -> {
			GlipGlop glipGlop = (GlipGlop) message.getPayload();
			if (glipGlop.getQuote() == RickAndMortyQuote.PLEASE_GIVE_ME_SOME_SZECHUAN_SAUCE) {
				int randomInt = RAND.nextInt(ODDS_AT_FINDING_SZECHUAN_SAUCE);
				if (randomInt == luckyNumber) {
					outputChannels.meeseeks().send(
						MessageBuilder.withPayload(new GlipGlop(RickAndMortyQuote.YOU_ARE_A_WINNER, instanceId))
							.build());
				} else {
					outputChannels.meeseeks().send(
						MessageBuilder.withPayload(new GlipGlop(RickAndMortyQuote.SORRY_NO_LUCK, instanceId)).build());
				}
			}
		});
	}
}
```

Oh man, I think I'm getting bored even writing this.
Stick with me, the demo is gonna be worth it.
Don't scroll to the bottom just yet!
There's only one piece of the puzzle left.

# Morty

> "Aw djeez" - Morty

<img alt="Morty" style="max-width: 167px" src="{{ '/img/spring-cloud-stream/morty.png' | prepend: site.baseurl }}" class="image fit"/>

Morty is a young teenage boy.
He has short brown hair that he wears straight and neatly combed around his head.
He wears a yellow shirt, blue pants, and white shoes.

He's cute and adorable and is always along for the ride.
He gets to see all the incredible things that happen in the universe - *and microverse* - so he's the perfect character to represent our frontend.

<img alt="Morty Microservice" style="max-width: 640px" src="{{ '/img/spring-cloud-stream/diagram/morty.png' | prepend: site.baseurl }}" class="image fit"/>

I just want to clarify that I'm in no way a great frontend developer.
I dabble in HTML, CSS and the occasional JavaScript, but my designer skills are abysmal.

That's why I love a framework like **Bootstrap**: easy, intuitive and fast to create a semi decent web application.

So *that's* why I choose to work with [**Bulma**](http://bulma.io/){:target="_blank"}: the even easier, *more* intuitive version of Bootstrap.
You can check out my horrible frontend code [in the Git repository](https://github.com/Turbots/szechuan/tree/master/morty/frontend){:target="_blank"}.

The Morty microservice is a bit different than the others, since it needs to collect all the input messages and transfer them to a browser.
We do this using [**server-sent events** or **SSE**](https://www.w3schools.com/html/html5_serversentevents.asp){:target="_blank"}.

Spring MVC has had support for SSE for a while and it's actually very easy to use:

```java
@GetMapping(produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public SseEmitter events() {
    SseEmitter emitter = new SseEmitter();

    return emitter;
}
```

As you can see, even [Jerry](http://rickandmorty.wikia.com/wiki/Jerry_Smith){:target="_blank"} could figure this stuff out.
In the example above, nothing is actually being emitted.
When someone browses to the endpoint, it opens an HTTP connection and waits for messages.
It's up to the server to actually start sending data messages from this emitter, which will trigger an `onMessage` JavaScript event at client-side.

Let's see how we implemented this for our Morty microservice:

```java
@Slf4j
@RestController
@RequestMapping("/events")
public class EventController {

	private final List<SseEmitter> emitters = new ArrayList<>();

	@Autowired
	public EventController(InputChannels inputChannels) {
		GlipGlopHandler glipGlopHandler = new GlipGlopHandler();
		inputChannels.rick().subscribe(glipGlopHandler);
		inputChannels.meeseeks().subscribe(glipGlopHandler);
		inputChannels.mcdonalds().subscribe(glipGlopHandler);
		inputChannels.microverse().subscribe(glipGlopHandler);
	}

	@GetMapping(produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public SseEmitter events() {
		SseEmitter emitter = new SseEmitter();
		emitters.add(emitter);
		emitter.onCompletion(() -> emitters.remove(emitter));
		emitter.onError(throwable -> emitters.remove(emitter));
		emitter.onTimeout(() -> emitters.remove(emitter));

		return emitter;
	}

	class GlipGlopHandler implements MessageHandler {

		@Override public void handleMessage(Message<?> m) throws MessagingException {
			GlipGlop glipGlop = (GlipGlop) m.getPayload();
			emitters.forEach(emitter -> {
				try {
					emitter.send(glipGlop);
				} catch (IOException e) {
					emitter.complete();
					emitters.remove(emitter);
					log.error("IOException when trying to send event");
				}
			});
		}
	}
}
```

**DISCLAIMER**: this code is not production-ready and can probably cause instant brain damage when observed.
This code is for demo purposes only.

A quick explanation of the code:

* we subscribe to the four input channels and attach the same message handler since we want to handle all the GlipGlops equally
* when a client performs a GET request to the `/events` endpoint, it is assigned an `SseEmitter` which is added to a list
* whenever a GlipGlop on any of the four input channels is received, it is sent to all the registered SseEmitters
* exactly nothing is done when errors occur - totally *intentional*

## The Microverse

Everything that is described in this post, is transpiring inside the miniature dimension called **The Microverse**:

<img alt="The Microverse" style="max-width: 367px" src="{{ '/img/spring-cloud-stream/Microverse_Battery.png' | prepend: site.baseurl }}" class="image fit"/>

[*the Microverse*](http://rickandmorty.wikia.com/wiki/Microverse_Battery){:target="_blank"}

In all seriousness - yeah, seriously - we are deploying our microservices on the [Pivotal Cloud Foundry](https://pivotal.io/platform){:target="_blank"} (PCF) platform.
In this case, I'm using a paid account on [Pivotal Web Services](https://run.pivotal.io/){:target="_blank"}, their online version of PCF.
Inside this powerful Platform as a Service (PaaS) offering, there's this concept of **organizations and spaces**.

Inside of our Ordina JWorks organization, I have created a space called `microverse` to house all of the applications in my demo.
This way, my wacky adventures cannot interfere with any of our actually useful applications.

Through the powerful **service broker** mechanism, I provisioned a RabbitMQ service and bound it to my applications.
This means the freshly created RabbitMQ instance's connection details are automatically shared inside of my application's containers as system properties.

Since Spring Boot kicks ass at taking system properties and ramming them inside some auto-configuration, we don't have to worry about anything remotely resembling boilerplate code.

# Summary

Before I go over to the demo, I wanted to share my **grand clarification of the Microverse and all things which lie within**:

<img alt="Grand Clarification" style="max-width: 640px" src="{{ '/img/spring-cloud-stream/diagram/clarification.png' | prepend: site.baseurl }}" class="image fit"/>

As you can see, I have drawn **multiple Meeseeks instances** in this diagram.
That's because I want to spawn multiple Meeseeks to perform my task.

Without any extra configuration, **every Meeseeks instance will pick up every GlipGlop** posted to the `meeseeks` input channel.
This means adding additional Meeseeks instances won't help us very much (it will increase the total number of GlipGlops in the system and probably overload the server even faster).
We want every separate Meeseeks instance to pick up a unique message on that input channel.

This can be accomplished by putting the Meeseeks application inside of a [**consumer group**](https://docs.spring.io/spring-cloud-stream/docs/current/reference/htmlsingle/#consumer-groups){:target="_blank"}.
Only *one* property is required to do this:

```bash
spring:
  cloud:
    stream:
      bindings:
        meeseeks:
          group: szechuan-finder
```

This indicates we want the `meeseeks` message channel to be part of a consumer group called `szechuan-finder`.

# Demo

This could be quite anti-climactic, but you're gonna have to **touch Pickle Rick to see the demo**.
Go on... Touch him...

<a href="https://rnm-morty.cfapps.io" target="_blank">
    <img alt="Grand Clarification" style="max-width: 275px" src="{{ '/img/spring-cloud-stream/pickle-rick.jpg' | prepend: site.baseurl }}" class="image fit"/>
</a>

**Press the Rick and Meeseeks image in the demo and enjoy the show!**

# Resources

* Github Repository with all the code: [https://github.com/Turbots/szechuan](https://github.com/Turbots/szechuan){:target="_blank"}
* Slides about this topic: [http://slides.com/turbots/spring-cloud-stream-rick-morty](http://slides.com/turbots/spring-cloud-stream-rick-morty){:target="_blank"}
* Spring Cloud Stream documentation: [https://docs.spring.io/spring-cloud-stream/docs/current/reference/htmlsingle/](https://docs.spring.io/spring-cloud-stream/docs/current/reference/htmlsingle/){:target="_blank"}
* My presentation on our yearly JOIN event: [https://www.youtube.com/watch?v=Nl9OIuNRYwI](https://www.youtube.com/watch?v=Nl9OIuNRYwI){:target="_blank"}
* Try out Pivotal Cloud Foundry on your local workstation: [https://pivotal.io/platform/pcf-tutorials/getting-started-with-pivotal-cloud-foundry-dev/introduction](https://pivotal.io/platform/pcf-tutorials/getting-started-with-pivotal-cloud-foundry-dev/introduction){:target="_blank"}

# Improvements

* Better error handling on Morty - too many browser connections when sending 150 messages a second over event streams is quite demanding apparently
* Addition of Spring Cloud Data Flow in the mix - registering the applications and dragging around inputs and outputs should be fun - also, scaling!
* Improved UI - obviously
* Complete event-based demo instead of endpoints to force certain operations (spawning/killing Meeseeks, waking up Rick, ...)
