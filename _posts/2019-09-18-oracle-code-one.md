---
layout: post
authors: [glenn_vandeputte, tom_van_den_bulck]
title: 'Oracle Code One 2019'
image: /img/oracle-code-one-2019/code-one.png
tags: [Java, Agile, Conference]
category: Conference
comments: true
---

> [Oracle Code One](https://www.oracle.com/code-one//){:target="_blank"} is the successor of the well known JavaOne conference, organised each year in San Francisco, California. Although still Oracle- and Java-heavy, the rebranding (and collocation with Oracle Open World) means that there were also a lot of talks about other programming languages, developer tools, ... 
> Our colleague Tom van den Bulck and ex-colleague Tim Ysewyn were invited to give their Workshop on Kafka Streams and enjoy the rest of the coference.
> In this blog post we share our impressions and experiences.

<div style="display: flex; justify-content: center;">
<img class="image" src="{{ '/img/oracle-code-one-2019/sf-jworks.jpg' | prepend: site.baseurl }}" alt="Jworks Represent" width="60%" />
</div>

# Table of contents


* [Keynotes](#keynotes)
* [Usual Suspects](#usual-suspects)
* [GroundBreakers Hub](#groundbreakers-hub)
* [Using Istio and Kubernetes to Build a Cloud Native Service Mesh](#using-istio-and-kubernetes-to-build-a-cloud-native-service-mesh)
* [Monitor Kafka Like a Pro](#monitor-kafka-like-a-pro)
* [DevOps Theory vs. Practice: A Song of Ice and Tire Fire](#devops-theory-vs.-practice:-a-song-of-ice-and-tire-fire)
* [Conclusion](#conclusion)

## Keynotes

Next to all activity in the conference center, workshops and talks, off course there were (a few) keynotes. These took place in a separat great hall and we summarized the best ones below.

### Java Keynote: The Future of Java Is Now

<span class="image left"><img class="p-image" alt="Jessica Pointing" src="https://pbs.twimg.com/profile_images/1174071948164251648/DLMG7FWe_400x400.jpg"></span>

At the Java keynote which opened the conference on monday a few speakers were invited. These mostly dealt with outlooks on the future, firstly [Jessica Pointing](https://twitter.com/jessicapointing) talked about the current state and prospects of quantum computing. 

She gave an explanation of what Quantum Computing actually is, and how modern computers can consist of special components (equivalent to transistors in classical computers) to take advantage of the special properties of so-called qubits. 
A Qubit or quantum bit is a unit which can exist in a superposition of states, which means it can be 0 and 1 at the same time, as opposed to a classical bit. 
You can use these properties to devise really specific algorithms like Shor's or Grover's algorithm to solve certain problems like prime factorization much faster.

Keeping the title of the keynote in mind one of the most important questions is "When will we have Quantum Computers?" and as you've already guessed the answer is indeed "Now".  

A fun part of this talk was that there was a live link for the audience to answer a poll to estimate how far along the technology stands in this area. Most of the audience correctly guessed that at present 
we have quantum computers which consist of 10-100 qubits todo: verify this number. Current quantum computers do come with the caveat that they can still only keep their state for a short time.
The advances which still need to be made mostly consist of making sure the quantum properties of the qubits can be kept intact for a longer before we can really speak of sustainable quantum computers.
Nevertheless Jessica really .. the point that the age of quantum computers is in the near future if not now already. She even showed a [github repository](https://github.com/johanvos/quantumjava) which enables everybody to experiment and write
algorithms or programs which can be run on quantum computers (in Java offcourse). 


<iframe width="560" height="315" src="https://www.youtube.com/embed/81gujFcs3fU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Next Georges Saab officially announced what was already expected, namely that Java 13 was out as of that day:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Java 13 is live: <a href="https://t.co/YqCVg3CTSg">https://t.co/YqCVg3CTSg</a></p>&mdash; Brian Goetz (@BrianGoetz) <a href="https://twitter.com/BrianGoetz/status/1174008054813081600?ref_src=twsrc%5Etfw">September 17, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


And next he invited a lot of people from different backgrounds on stage (or on video) to talk about how they experienced the new, faster release cadence of the Java language, which means there is a new version of
Java out every 6 months. These were people who worked on Java at Oracle, with Java on Open Source projects, were part of the JCP, ...

The conclusion of most of these testimonials was that almost everybody was quite suspicious about the idea to do a release every 6 months but that all were pleasantly surprised by how well it seemed to work and
and that they urged everybody to upgrade to the latest versions as soon as possible because there is almost no downside to it.

Lastly it was [Brian Goetz'](https://twitter.com/BrianGoetz/) turn to talk about the future of Java, in which he demonstrated some of the new language features which have been included in the releases
since Java 10, as well as previewed some upcoming stuff. He also gave an extended version of this talk [later](https://t.co/dzzuWze3gX?amp=1)

### Code One Community Keynote: Game On

One of the less serious bet certainly entertaining talks was the community keynote, in which a lot (and we do mean A LOT) of well known people in the Java community (Java Champions, developer advocates, JCP members, ...)
came on stage and acted out a history of the Java language as it has been used in the past. The through line was the idea that Java has been used through the years to help develop video games and 
it continues to be relevant today thanks to all new projects which are springing up everywhere.

It was a bit of a silly show but it was good fun and at the same time interesting to see how far the Java community has come. At some point [Henri Tremblay](https://twitter.com/henri_tremblay) even did some live
coding on a VM running Windows '95 while chatting to his past self via a chatbot, which was truly impressive.


There was a lot of buzz on Twitter about the event:

<div style="display: flex; flex-direction: row; justify-content: space-around; flex-wrap: wrap;">

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">AN OUTSTANDINGLY HILARIOUS <a href="https://twitter.com/hashtag/CodeOne?src=hash&amp;ref_src=twsrc%5Etfw">#CodeOne</a> <a href="https://twitter.com/hashtag/community?src=hash&amp;ref_src=twsrc%5Etfw">#community</a> KEYNOTE - <a href="https://twitter.com/hashtag/JUG?src=hash&amp;ref_src=twsrc%5Etfw">#JUG</a> leaders <a href="https://twitter.com/Java_Champions?ref_src=twsrc%5Etfw">@Java_Champions</a> <a href="https://twitter.com/groundbreakers?ref_src=twsrc%5Etfw">@groundbreakers</a> celebrated the grande finale with shirts <a href="https://twitter.com/starbuxman?ref_src=twsrc%5Etfw">@starbuxman</a> <a href="https://twitter.com/venkat_s?ref_src=twsrc%5Etfw">@venkat_s</a> <a href="https://twitter.com/brjavaman?ref_src=twsrc%5Etfw">@brjavaman</a> <a href="https://twitter.com/eMalaGupta?ref_src=twsrc%5Etfw">@eMalaGupta</a> <a href="https://twitter.com/RafaDelNero?ref_src=twsrc%5Etfw">@RafaDelNero</a> <a href="https://twitter.com/_tamanm?ref_src=twsrc%5Etfw">@_tamanm</a> <a href="https://twitter.com/neugens?ref_src=twsrc%5Etfw">@neugens</a> <a href="https://twitter.com/miragemiko?ref_src=twsrc%5Etfw">@miragemiko</a> <a href="https://twitter.com/dervis_m?ref_src=twsrc%5Etfw">@dervis_m</a> <a href="https://twitter.com/nljug?ref_src=twsrc%5Etfw">@nljug</a> + <a href="https://twitter.com/hashtag/usualsuspects?src=hash&amp;ref_src=twsrc%5Etfw">#usualsuspects</a> <a href="https://twitter.com/OracleCodeOne?ref_src=twsrc%5Etfw">@OracleCodeOne</a> <a href="https://t.co/I1gCVrfVVC">pic.twitter.com/I1gCVrfVVC</a></p>&mdash; Benjamin Nothdurft (@DataDuke) <a href="https://twitter.com/DataDuke/status/1174527021034008577?ref_src=twsrc%5Etfw">September 19, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
<blockquote class="twitter-tweet"><p lang="en" dir="ltr"><a href="https://twitter.com/venkat_s?ref_src=twsrc%5Etfw">@venkat_s</a> live coding in an angry bird suit at the community keynote 😂 <a href="https://twitter.com/hashtag/CodeOne2019?src=hash&amp;ref_src=twsrc%5Etfw">#CodeOne2019</a> <a href="https://t.co/TUtVADuhCx">pic.twitter.com/TUtVADuhCx</a></p>&mdash; Billy Korando (@BillyKorando) <a href="https://twitter.com/BillyKorando/status/1174363407178297344?ref_src=twsrc%5Etfw">September 18, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Game on community keynote <a href="https://twitter.com/hashtag/codeone?src=hash&amp;ref_src=twsrc%5Etfw">#codeone</a> thanks to the participants! <a href="https://t.co/la6vOYy2Xg">pic.twitter.com/la6vOYy2Xg</a></p>&mdash; Oracle Code One (@OracleCodeOne) <a href="https://twitter.com/OracleCodeOne/status/1174369836127776768?ref_src=twsrc%5Etfw">September 18, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

## Usual Suspects

As always, there are a few speakers at every conference who are household names and who always delivery. Some of these you can also go and experience in Belgium at Devoxx or our very own [JOIN](https://ordina-jworks.github.io/join/) conference, like
[Benjamin Nothdurft](https://twitter.com/DataDuke). These talks are always very interesting and of a high standard, but we will only highlight these very briefly.

[Venkat Subramanian](https://twitter.com/venkat_s) gave no less than 6 talks at the conference, 2 of which we were able to attend. These talked about []A Dozen Cool Things You Can Do With JVM Languages](https://youtu.be/pWW8uqAPT-s)
and "Functional Programming Idioms in Java" in which Venkat shows you things which are really useful but look obvious and vanzeflsprekend when he points them out in his incomparable style.

[Mark Heckler](https://twitter.com/mkheck/status/1174413471674294272) talked about [How to Use Messaging Platforms for Scalabiliy and Performance](https://speakerdeck.com/mkheck/drinking-from-the-stream) and did an impressive live demo
in which he built an application which produced, transformed and consumed events in 3 seperate projects in less than 15 minutes, using Spring Cloud Stream.

Furthermore [Josh Long](https://twitter.com/starbuxman) talked about [The Reactive Revolution](https://youtu.be/Y-r_S2UAzGY) and "Bootiful Testing" while [Stephane Maldini](https://twitter.com/smaldini) gave us an overview of the reasons
why you should (or should not) start using reactive programming.

Reactive Performance on GraalVM @christhalinger @OlehDokuka https://twitter.com/christhalinger/status/1173734585659609088

## Groundbreakers Hub

If you wanted a break from the (literally hundreds of) talks, there was a large area called the [Groundbreakers Hub](https://www.oracle.com/code-one/hub.html) were a lot of like minded tech enthusiasts could gather and discuss
the ongoing conference (in some cases accompanied by a [Blockchain Beer](https://www.facebook.com/OracleCodeOne/photos/a.10150738878780318/10155758354410318/?type=1&theater)).

As always, there were booths of all big representatives at which you could gather information about new products, do some demo coding or collect some nice gadgets. There was also a corner
with arcade game consoles to relax, and also a [Raspberry Pi supercomputer](https://www.tomshardware.com/news/oracle-raspberry-pi-supercomputer,40412.html) on display.


A few impressions on Twitter:
<div style="display: flex; flex-direction: row; justify-content: space-around;">
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Shout out to all <a href="https://twitter.com/OracleCodeOne?ref_src=twsrc%5Etfw">@OracleCodeOne</a> <a href="https://twitter.com/oracleopenworld?ref_src=twsrc%5Etfw">@oracleopenworld</a> attendees. The real action with the fun people is in the <a href="https://twitter.com/groundbreakers?ref_src=twsrc%5Etfw">@groundbreakers</a> Hub. Come join us and remind yourself of why you got into tech in the first place 🤓 All are welcome 🤗 <a href="https://twitter.com/hashtag/CommmityFirst?src=hash&amp;ref_src=twsrc%5Etfw">#CommmityFirst</a> <a href="https://t.co/W1rQgH8oWv">pic.twitter.com/W1rQgH8oWv</a></p>&mdash; Vincent Mayers (@vincentmayers) <a href="https://twitter.com/vincentmayers/status/1174033804937187328?ref_src=twsrc%5Etfw">September 17, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">LIFE IS GOOD at the <a href="https://twitter.com/groundbreakers?ref_src=twsrc%5Etfw">@groundbreakers</a> hub at <a href="https://twitter.com/OracleCodeOne?ref_src=twsrc%5Etfw">@OracleCodeOne</a> - we have arcade machines, <a href="https://twitter.com/Hackergarten?ref_src=twsrc%5Etfw">@hackergarten</a>, a beer blockchain, a 1k <a href="https://twitter.com/hashtag/RaspberryPi?src=hash&amp;ref_src=twsrc%5Etfw">#RaspberryPi</a> cluster, escape rooms, code cards and IoT devices. Let&#39;s <a href="https://twitter.com/hashtag/BreakNewGround?src=hash&amp;ref_src=twsrc%5Etfw">#BreakNewGround</a> <a href="https://twitter.com/hashtag/CodeOne?src=hash&amp;ref_src=twsrc%5Etfw">#CodeOne</a> <a href="https://t.co/p5PI4q1XI4">pic.twitter.com/p5PI4q1XI4</a></p>&mdash; Benjamin Nothdurft (@DataDuke) <a href="https://twitter.com/DataDuke/status/1174118535565438976?ref_src=twsrc%5Etfw">September 18, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>
## Streams Workshop

Workshop nog beschrijven of gewoon linken naar hier?
https://ordina-jworks.github.io/conference/2018/12/17/Devoxx-MA.html#stream-processing-live-traffic-data-with-kafka-streams-by-tom-van-den-bulck-and-tim-ysewyn

## Using Istio and Kubernetes to Build a Cloud Native Service Mesh

Another workshop which we followed (which was guided by [Ray Tsang](https://twitter.com/saturnism)) showed us how to easily set up an Istio service mesh on a Kubernetes cluster on Google Cloud. 

[What is Istio?](https://istio.io/docs/concepts/what-is-istio/)

> Istio is an open platform-independent service mesh that provides traffic management, policy enforcement, and telemetry collection.
> 
> Open: Istio is being developed and maintained as open-source software. We encourage contributions and feedback from the community at-large.
> 
> Platform-independent: Istio is not targeted at any specific deployment environment. During the initial stages of development, Istio will support Kubernetes-based deployments. However, Istio is being built to enable rapid and easy adaptation to other environments.
> 
> Service mesh: Istio is designed to manage communications between microservices and applications. Without requiring changes to the underlying services, Istio provides automated baseline traffic resilience, service metrics collection, distributed tracing, traffic encryption, protocol upgrades, and advanced routing functionality for all service-to-service communication.

It was surprisingly easy to set up an entire K8s cluster with service mesh in less than an hour, after which there was still time to try out some of the nice features of a service mesh, like setting up
special routing rules to enable for example Canary deployments or A/B testing scenarios, fault injection / circuit breaking, tracing, ... Which can all be handled by Istio itself without making any
changes to your application (except for propagating the headers which are required for tracing). Also a lot of added on applications like Prometheus, Grafana, Jaeger, ... all worked straight out of the box.

For the workshop we received special temporary accounts but if you use your own account (which has a free trial option) you can certainly try and follow the steps in the very extensive [Slides](http://bit.ly/istio2019) and [Read-through](https://github.com/retroryan/istio-workshop)
to set this up yourselves.

## Quarkus Trivia Night

All work and no plays makes us dull boys so there was also time for some relaxation. We were invited for a Trivia Night organised by OpenShift and Quarkus
at a brewery close to the conference center, which was a nice change of pace from all serious presentations.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Good food and beer at the <a href="https://twitter.com/QuarkusIO?ref_src=twsrc%5Etfw">@QuarkusIO</a> trivia reception <a href="https://twitter.com/hashtag/CodeOne?src=hash&amp;ref_src=twsrc%5Etfw">#CodeOne</a> <a href="https://t.co/zUKamBK08L">pic.twitter.com/zUKamBK08L</a></p>&mdash; Jaap Coomans (@JaapCoomans) <a href="https://twitter.com/JaapCoomans/status/1174150552156069888?ref_src=twsrc%5Etfw">September 18, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## Monitor Kafka Like a Pro

A subject close to our own workshop was presented by [Viktor Gamov](https://twitter.com/gamussa), a developer advocate for Confluent. He talked about best practices for monitoring your Kafka clusters
in a very interesting [presentation](--). 

Presentation not available => https://speaking.gamov.io/presentations
Similar presentation: https://www.slideshare.net/ChesterChen/sfbiganalytics20190724-monitor-kafka-like-a-pro
Talk: https://www.youtube.com/watch?v=tL6DtN0zhrQ

Some basic monitoring is just to verify that your producers and consumers are able to write and read data from Kafka.
A specific topic to where you just send and consume a message from every 15 seconds, raise an error after 4 failures et voilla, basic monitoring.

Measuring latency is already more advanced, but everytime you experience performance issues always check your latency>
As it might be a waste of time to start looking into Kafka or your own service when your network connection is acting up.

In order to check if your brokers are up, just execute a 'grep java' on the brokers.

Kafka exposes a ton of [JMX metrics](https://docs.confluent.io/current/kafka/monitoring.html), which you can export with Prometheus, the Confluent cloud uses the same mechanism to acquire metrics.

The most import metrics to monitor are to verify the state of your partitions:

'kafka.controller:type=KafkaController,name=OfflinePartitionsCount' Offline partitions is an actionable metric, as this indicates that a partition has no leader and thus is no longer readable or writeable.

'kafka.server:type=ReplicaManager,name=UnderReplicatedPartitions': Under replicated partitions is the most important metric, something is cleary wrong.

'kafka.server:type=ReplicaManager,name=UnderReplicatedPartitions': Whenever there are no longer enough replicas of a partitions in sync you can no longer produce messages to that topic. This corresponds to the configured 'min.isr.partitions' of a broker.

It is also important to verify if your brokers have enough resources like; CPU, Bandwidth, Disk, ...
Always monitor your disk usage, always.

Other metrics which are pretty important:
'kafka.controller:type=KafkaController,name=ActiveControllerCount': this indicates wether an [Ative Controller](https://cwiki.apache.org/confluence/display/KAFKA/Kafka+Controller+Internals) is present, this is the most important node of your kafka cluster.
1 = OK, 0 is not ok, 2 is VERY NOT ok.

'kafka.server:type=SessionExpireListener,name=ZooKeeperDisconnectsPerSec': Zookeeper disconnects.

'kafka.controller:type=ControllerStats,name=UncleanLeaderElectionsPerSec': the rate at which unclear leader election occurs, though this option is disabled by default.

'kafka.server:type=ReplicaManager,name=IsrShrinksPerSec': When a broker goes down the Isr will shrink, when it comes back it will expand again ('kafka.server:type=ReplicaManager,name=IsrExpandsPerSec')

'kafka.server:type=KafkaRequestHandlerPool,name=RequestHandlerAvgIdlePercent' / 'kafka.network:type=SocketServer,name=NetworkProcessorAvgIdlePercent' as this verifies how often your request and processor threads are idle. 

For your consumers and important metric is 'records-lag-max', because when this is growing it will indicate that your consumers are lagging behind and can not process the same amount of messages as your producers are producing.

It is also important to set a performance baseline for your producers and consumers, this then also allows you to verify configuration changes you have made and their impact on your Kafka system.

Finally it is also important is to pay attention to old producer and consumer versions, as these forces the broker to convert messages which will have an impact on the heap memory usage.

Victor also pointed us to nice tool to use when you want to profile your java application: [async-profiler](https://github.com/jvm-profiling-tools/async-profiler)

https://github.com/jvm-profiling-tools/async-profiler/blob/master/demo/SwingSet2.svg

Besides creating cool flame graphs, this tool can inform you about what your java application is doing and where you might have a problem.

## Distributed Tracing in Kafka
https://www.youtube.com/watch?v=W0JYx7erh_0&feature=youtu.be&t=3634

https://speaking.gamov.io/Y8yrHk/bringing-observability-to-your-stream-processing#sHXi414

Book: A philosophy of software design Johan Ousterhout (https://www.amazon.com/Philosophy-Software-Design-John-Ousterhout/dp/1732102201)

Tracing with zipkin
A span is a traced task

Send zipkin to DB (by default support for either Elastic or Cassandra) or use your own DB.

Producer
kafkaTracing.Producer
tracedProducer

Consumer
kafkaTracing.consumer
tracedConsumer
then extra spans

Streams
This is still somewhat experimental

Hystrix: tracing platform
Open source
Nice UI

## DevOps Theory vs. Practice: A Song of Ice and Tire Fire

One of the last, slightly more lighthearted talks took place on the last afternoon of the conference. [Baruch Sadogursky](https://twitter.com/jbaruch) and [Viktor Gamov](https://twitter.com/gamussa) opened
their talk with a skit in which Baruch spouted well known DevOps clichés, like "Everything must be 100% automated", "We do Continuous Security well" or "You're problems are so unique, no vendor can possibly understand them"
while Viktor translated this into the harsh truth that none of these are absolute or applicable in every situation and you have to adopt your approach accordingly. While entertaining, it also laid bare the truth that none of these
devops principles act as a Silver Bullet. 

Using the analogy of the Cargo Cult, a term which originated in the story of people in Oceania who after the Second World War was over started building airplanes out of straw, believing that these
would bring the technological advancements and prosperity (cargo) which arrived on these islands at the same time as the actual airplanes. The analogy is that in modern tech, some people might believe that
by merely adopting the latest techniques and tools (Kubernetes, Docker, DevOps, ...), automatically all other problems will solve themselves. From experience, we all know this isn't true.

Instead, we should analyze were we are (as an organisation) and determine which steps to take to progress to where we want to be before just adopting something like Kafka because people at 
conferences give nice demos and workshops and tell you all will be alright. 
Before we take a decision like this we first need to be aware of the answers to The Four Questions:

<img src="/img/oracle-code-one-2019/four-questions.png" alt="" width="75%">

Answering the last 2 questions require an entirely different talk, but the first one we can try and tackly using a maturity model, popularized by [Martin Fowler](https://www.martinfowler.com/bliki/MaturityModel.html).
Maturity models have their own share of problems and critics, but Baruch and Viktor pose that, if done right, they can help your organization or team make signifant 
advancements towards being ready to tackle your business problems in a more efficient way.

Now the question is "How do you write a *good* maturity model?". Using an example, simply created in Excel, Viktor and Baruch try to explain that the most important things to
take into account for a maturity model are:

- It should describe a process, not an end goal. 
- It should be tailored specific to your case, not exactly as prescribed in "the book".
- It should focus on outcomes, not specific tools to use.
- It should constantly be evaluated and evolve, not written once and then forgotten.

<img src="/img/oracle-code-one-2019/dos-donts.png" alt="" width="75%">


The answer to the question "Is it even a good tech?" can be answered by advisory / research companies like Forrester or Gartner but because these are for-profit
companies their suggestions might be skewed towards the companies which are already established / rich or more in the limelight. A better option might be to look
at the [Thoughtworks Tech Radar](https://www.thoughtworks.com/radar) which is publicly available and provides an assesment of a whole array of modern
technologies and determines if you should Adopt, Asses, Trial or Hold these.

Moreover, you could argue that it's even better to extend the question to "Is this even a good tech *for our team*", in which case it's a good idea to [build your own tech radar](https://www.thoughtworks.com/radar/how-to-byor)
which of course at Jworks we [already did](https://ordina-jworks.github.io/tech-radar).

## Progressive Web Applications VS Native

One of the few Frontend (but still a bit Oracle) -related talks was about PWA's, a topic which we are also starting to explore at Jworks, given by Marta Hawkins.

Ionic gives a good definition of a Progressive Web Application:

> A Progressive Web App (PWA) is a web app that uses modern web capabilities to deliver an app-like experience to users. These apps meet certain requirements (see below), are deployed to servers, accessible through URLs, and indexed by search engines.

The premise of the talk was mainly about comparing the capabilities of a PWA compared to a classic native application, and in most cases refuting the arguments which could be brought against PWA's.
The first such argument is that you cannot access all native phone functionality, but recently the support for almost all of these functions, like taking pictures, watching videos, 
using location information, using gestures, ... have been made available for PWA's. 

All major browsers are now also supporting almost all PWA functionality. The next obvious argument is that if you choose to write a native application you have to maintain multiple code bases,
whereas you only need to write one application and distribute it independently of app stores in the other case. This also means you can release new functionality
without having to go through the process of getting it approved on the respective app stores, and your application will be more easily discoverable on your 
search engine of choice. All of these arguments result in the fact that PWA's are better to drive user engagement.

Next Marta talked about the preconditions you need to have your web application recognized as 'progressive', of which there are only 3:

<img src="/img/oracle-code-one-2019/pwa-conditions.png" alt="" width="75%">

A service worker is what provides the PWA with it's special capabilities. This is what enables offline functionality, installability, notifcations, request caching, ...

Google's [developer guide](https://developers.google.com/web/ilt/pwa/introduction-to-service-worker) describes it as follows:

> A service worker is a type of web worker. It's essentially a JavaScript file that runs separately from the main browser thread, intercepting network requests, caching or retrieving resources from the cache, and delivering push messages.

Of course not all is sunshine and rainbows, so next Marta also warned for some pitfalls they already encountered in the past:

- Browser support is good, but not complete. Chrome is the frontrunner and Safari is notably lagging behind.
- The same is true for the different OS's. Android treats PWA's as first class citizens, on iOS you need to really go and find the ability to install the app to your home screen.
- Developing and debugging the applications is also not trivial. Chrome is developing and delivering better debugging tools.
- Caching is never trivial, but especially in service workers it sometimes seems to behave in mysterious ways.

[Slides](https://static.rainfocus.com/oracle/oow19/sess/1552707018783001LVCE/PF/PWA_final_1568924085498001Vope.pdf)

## Sarcasm as a Service

https://youtu.be/jk-l-D5cmKY

## Conclusion


downsides:
- too many talks
- MOAR COFFEE
