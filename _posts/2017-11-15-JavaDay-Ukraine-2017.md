---
layout: post
authors: [yannick_de_turck, dieter_hubau, derya_duru]
title: 'JavaDay Ukraine 2017'
image: /img/javaday-ukraine-2017/javaday-ukraine-2017.png
tags: [JavaDay, Java, Kotlin, Spring, CQRS, Event Sourcing, Microservices, Reactive, Spinnaker, Reactor, WebFlux, Kubernetes]
category: Conference
comments: true
---

> [JavaDay Ukraine](http://javaday.org.ua){:target="_blank"} is an annual international two-day conference in Kyiv with more than 60 global speakers with various topics on Java, software architecture, machine learning, data science, and more.
In this blog post we will go over some of the talks that we have attended.

<div class="the-toc">

  <h1 class="the-toc__heading">Table Of Contents</h1>

  <ol class="the-toc__list">
    <li><a href="#developing-microservices-with-kotlin---haim-yadid" title="Developing Microservices With Kotlin">Developing Microservices with Kotlin</a></li>
    <li><a href="#going-reactive-with-spring-data---christoph-strobl" title="Going Reactive with Spring Data - Christoph Strobl">Going Reactive with Spring Data - Christoph Strobl</a></li>
    <li><a href="#spring-boot-20-web---stéphane-nicoll" title="Spring Boot 2.0 Web - Stéphane Nicoll">Spring Boot 2.0 Web - Stéphane Nicoll</a></li>
    <li><a href="#the-api-gateway-is-dead-long-live-the-api-gateway---spencer-gibb" title="The API Gateway is dead! Long Live the API Gateway! - Spencer Gibb">The API Gateway is dead! Long Live the API Gateway! - Spencer Gibb</a></li>
    <li><a href="#continuous-deployment-to-the-cloud-using-spinnaker---andreas-evers" title="Continuous Deployment to the Cloud using Spinnaker - Andreas Evers">Continuous Deployment to the Cloud using Spinnaker - Andreas Evers</a></li>
    <li><a href="#10-tips-to-become-an-awesome-technical-lead---bart-blommaerts" title="10 tips to become an awesome Technical Lead - Bart Blommaerts">10 tips to become an awesome Technical Lead - Bart Blommaerts</a></li>
    <li><a href="#hands-on-introduction-to-cqrs-and-event-sourcing-with-axon-framework---steven-van-beelen" title="Hands-on introduction to CQRS and Event Sourcing with Axon Framework - Steven Van Beelen">Hands-on introduction to CQRS and Event Sourcing with Axon Framework - Steven Van Beelen</a></li>
    <li><a href="#spring-cloud-stream--a-new-rick-and-morty-adventure---dieter-hubau" title="Spring Cloud Stream — a new Rick and Morty adventure - Dieter Hubau">Spring Cloud Stream — a new Rick and Morty adventure - Dieter Hubau</a></li>
    <li><a href="#8-steps-to-becoming-awesome-with-kubernetes---burr-sutter" title="8 Steps To Becoming Awesome With Kubernetes - Burr Sutter">8 Steps To Becoming Awesome With Kubernetes - Burr Sutter</a></li>
  </ol>

</div>

****

### Developing Microservices with Kotlin - Haim Yadid

<span class="image left"><img class="p-image" alt="Haim Yadid" src="/img/javaday-ukraine-2017/haim-yadid.jpg"></span>
[Haim Yadid](https://twitter.com/lifeyx){:target="_blank"} is a developer, architect and group manager currently working as head of backend engineering in Next Insurance.
In his search for a better programming language, he compared different strongly and loosely typed JVM languages such as **Scala, Ceylon, Groovy, JRuby, Clojure and Kotlin**.

The chosen language would have to be concise, safe, versatile, practical and interoperable.
Being a fan of strongly typed languages, Groovy and JRuby were no option.
Scala was a good option but due to the complexity of the language, the long compilation times and lack of backwards compatibility assurance, it was also dropped.

Kotlin proved to be the winner as it contained all of the above listed characteristics.
It is also able to make use of the huge Java ecosystem and, being backed by Jetbrains, was very assuring.
It also helped that Google made Kotlin the official language for Android Development. Not to mention it was the subject of 9 different talks at JavaOne 2017.

In his talk, he wanted to share his findings and experiences when developing in Kotlin which he labeled as a huge success.
The project he worked on contains a microservices backend over DropWizard deployed to AWS together with serverless endpoints in AWS Lambda.
Used technologies, frameworks and libraries are amongst others Maven, DropWizard, AWS Lambda, PDFBox, XMPBox, Flyway, Stripe and Mockito Kotlin.
Building the project was done via the Kotlin Maven plugin.

He started with version 1.0.2 and immediately upgraded to every release which always went very smooth; even the migration to 1.1.0, which included Java 8 support, went without any issues.
Onboarding new Java developers is never a hassle as they are capable of developing in Kotlin by the time they get to know the architecture.

Haim really liked extension methods, which allow you to add functionality to an existing class or interface.
The null safety, which is very similar to the null safety of Apple's Swift - where nullability is part of the type of an defined object - was also well-appreciated.
He also pointed out to us that Java open source libraries work extremely well with Kotlin. All you need to do is add the dependency to your build file and you are good to go.

Data classes, similar to case classes in Scala, offering a concise way to define simple classes for holding data, were used for all their DTOs.
Also worth mentioning is that IntelliJ has a converter functionality for converting a Java class to Kotlin.
Obviously it's mostly used as a starting point when migrating existing Java classes.
We really liked Haim's talk as we are very eager to try out Kotlin in a project.

Haim's presentation is available on SlideShare:
<iframe src="//www.slideshare.net/slideshow/embed_code/key/4D8BpGT2UiMu8A" width="100%" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/haimyadid/building-microservices-with-kotlin" title="Building microservices with Kotlin" target="_blank">Building microservices with Kotlin</a> </strong> from <strong><a href="https://www.slideshare.net/haimyadid" target="_blank">Haim Yadid</a></strong> </div>
<br/>

### Going Reactive with Spring Data - Christoph Strobl

<span class="image left"><img class="p-image" alt="Christoph Strobl" src="/img/javaday-ukraine-2017/christoph-strobl.jpg"></span>
[Christoph Strobl](https://twitter.com/stroblchristoph){:target="_blank"} is a developer at Pivotal and is part of the Spring Data team.
Starting from Spring Framework 5, reactive support was added to all the core Spring Framework projects.
In a reactive architecture, it is important that your system is reactive from top to bottom in order to take advantage of the full performance gain, the persistence layer is no exception to this.

During the talk, Christoph went over the classic imperative approach of a Spring application where Spring MVC is used and the performance problems that can arise when all threads are in use.
A reactive architecture makes better use of server resources but in turn adds more complexity to your architecture.
The publish-subscribe mechanism is heavily used in this architecture where, how can you guess it, publishers publish messages to which subscribers can subscribe.
The mechanism also comes with back pressure for the subscribers, allowing them to define how many messages they want to handle next in order to avoid being overrun.
It is important to note here that the reactive publish-subscribe mechanism is based on the push model. The subscriber will not actively fetch the data but will instead receive the data from the publisher who pushes the new messages to the subscriber when they're available.

In the other part of the session, Christoph went over several features of Spring's Project Reactor, Spring Data Kay and Spring WebFlux.
The publish-subscribe mechanism in Reactor is based on the [Reactive Streams specification](http://www.reactive-streams.org){:target="_blank"} and there are two reactive types: `Flux`, an Asynchronous Sequence of 0-N items, and `Mono`, an Asynchronous 0-1 result.
Spring WebFlux is the reactive brother of Spring MVC and uses Project Reactor under the hood for building reactive endpoints.
Spring Data Kay is the newest version of Spring Data which now contains reactive repositories and reactive templates.
At the time of writing this is only usable for MongoDB, Redis, Couchbase and Cassandra as the other databases lack a reactive JDBC driver.

In the final part of the talk, Christoph held a demo of a Spring Boot 2 reactive application showcasing all the reactive features.
All in all, a very interesting talk about building a reactive application using Spring.

The demo code is available on [GitHub](https://github.com/christophstrobl/going-reactive-with-spring-data){:target="_blank"}.
The presentation is available on Speaker Deck:
<script async class="speakerdeck-embed" data-id="be5af757d97042b09c873aedbf8ac81a" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

### Spring Boot 2.0 Web - Stéphane Nicoll

<span class="image left"><img class="p-image" alt="Stéphane Nicoll" src="/img/javaday-ukraine-2017/stephane-nicoll.png"></span>

[Stéphane Nicoll](https://twitter.com/snicoll){:target="_blank"} joined the core Spring Framework development team early 2014, being one of the main contributors to both Spring Framework and Spring Boot since.
Stéphane's session was all about Spring Framework 5 and Spring Boot 2.0.
Spring 5 comes with Spring WebFlux which is the reactive brother of Spring MVC allowing you to build non-blocking APIs.
He explained that there is always the issue of supporting all the different clients like desktops, laptops, smartphones and tablets, and their different internet speeds.
Smartphones often have access to the slowest internet speeds and thus require the most optimal solution regarding bandwidth and performance.

All the different concepts of building a reactive application with Spring Framework 5 and Spring Boot 2.0 were explained with a demo application called [Smart Meter](https://github.com/snicoll-demos/smart-meter){:target="_blank"}.
Basically, you have all these different data inputs via sensors being gathered by an aggregator and then streamed to a dashboard.
The frontend is written in Thymeleaf 3.0 which is the version in which reactive support was added.
Besides the frontend needing reactive support, the persistence layer of the backend also needs it.
In Spring Data Kay, reactive support exists for Redis, MongoDB, Couchbase and Cassandra.
The other main databases such as Oracle, PostgreSQL and MySQL aren't there just yet as they lack a reactive JDBC driver.
In the demo, MongoDB is used.

Stéphane also demonstrated some new additions to Spring Boot Actuator such as a unified way to implement custom endpoints, better output format,
separate status endpoints (you now have `/status` and `/health`) and a simplified security model to specify who has access to (for example) status and info as users with a certain role may be allowed to see more.
Properties in Actuator now also display the properties file in which they have been declared and the exact position.

Stéphane concluded the talk by announcing that the release candidate was foreseen somewhere at the end of November.
However, a recent tweet of his announced a small change to the release schedule:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Spring Boot is having an extra milestone and RC1 is scheduled early December now.<br><br>See <a href="https://t.co/6kOGdPMtfp">https://t.co/6kOGdPMtfp</a></p>&mdash; Stéphane Nicoll (@snicoll) <a href="https://twitter.com/snicoll/status/928546114512588800?ref_src=twsrc%5Etfw">November 9, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


The demo code is available on [GitHub](https://github.com/snicoll-demos/smart-meter){:target="_blank"}.
The presentation is available on Speaker Deck:
<script async class="speakerdeck-embed" data-id="8be69db43f1741e6b796add45273ee65" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

### The API Gateway is dead! Long Live the API Gateway! - Spencer Gibb

<span class="image left"><img class="p-image" alt="Spencer Gibb" src="/img/javaday-ukraine-2017/spencer-gibb.jpg"></span>

[Spencer Gibb](https://twitter.com/spencerbgibb){:target="_blank"}, Spring Cloud co-founder and co-lead, started by talking about the responsibilities of an API gateway.
He started by revisiting Netflix's Zuul which is servlet based and thus has blocking APIs, and referred to Mikey Cohen's presentation on [Netflix's Edge Gateway Using Zuul](https://www.youtube.com/watch?v=mHHHpxJuTAo){:target="_blank"} in which Zuul 2 is also mentioned.
Zuul 2 was supposed to be integrated in Spring Cloud but as it still hadn't been released, Pivotal went with their own solution: Spring Cloud Gateway.
It is built upon Spring 5, Reactor and Spring Boot 2.
In order to have the gateway be non-blocking, there is a single event loop similar to how it is in Node.js.

In another section, Spencer talked about the internals of Spring Cloud Gateway and the Spring Reactor features it uses.
This involves the usage of classes such as `HandlerMapping`, `WebFilter`, `Predicate`, `ServerWebExchange`, `PathPatternMatcher`, `RoutePredicateHandlerMapping` and many more.
As a filter to rewrite paths was commonly requested before, this was the first filter that they have written when implementing the Spring Cloud Gateway.
Spencer also mentioned that they were also focusing on providing a simple API to write filters.
Also neat to mention is that route configuration is now possible in YAML.

In the final part, Spencer demonstrated an implementation of a Gateway showcasing the different ways of how to use the API to define different `byhost`, `rewrite`, `hystrix` and `limited` routes.
He started off by visiting the legendary [Spring Initializr webpage](http://start.spring.io){:target="_blank"} and created a Spring Boot 2 application with the Gateway dependency.
[httpbin](https://httpbin.org){:target="_blank"} is something that he is a big fan of, as it is really useful for testing whether for example the correct rerouting is happening and the right headers are being added to the requests.

The presentation is available right [here](https://spencer.gibb.us/preso/pivotal-toronto-api-gateway-2017-02/#/){:target="_blank"}.

### Continuous Deployment to the Cloud using Spinnaker - Andreas Evers

<span class="image left"><img class="p-image" alt="Andreas Evers" src="/img/javaday-ukraine-2017/andreas-evers.jpg"></span>

[Andreas Evers](https://twitter.com/andreasevers){:target="_blank"}, principal Java consultant and Solution Expert at Ordina Belgium, held a session on [Spinnaker](https://www.spinnaker.io){:target="_blank"} for doing Continuous Deployment to the Cloud.
Digital transformations usually require embracing a devops culture and adopting microservice architectures since without microservices, it is harder to go faster to the market.
Moving your infrastructure to the cloud is possible via either IaaS or PaaS.

With microservices, your deployment frequency explodes as it is way more flexible.
Netflix for example deploys over 4.000 times per day and that number is still increasing.
Andreas explained that cloud deployments are complex and that it is important to be able to do easy rollbacks.
There is also the fact that we want to plan our deploy at the right time frame, preferably when traffic is lowest to have the least amount of users impacted.

Andreas talked about a couple of other principles such as making sure that infrastructure is immutable, repeatable and predictable across the different environments through baking images or building containers by using for example Docker.
Equally important are the deployment strategies like (rolling) blue/green (or red/black if that's how you roll (pun intented). Looking at you, Netflix!).
Using the blue/green deployment strategy you can deploy the new version right next to the old version. What happens next depends on how the strategy has been configured.
Either the load balancer will reroute all traffic from the old version to the new version, or (if the rolling strategy has been configured) the traffic will gradually get rerouted to the new version. The last option is great for canary testing or smoke tests.
A third principle is doing automatic deployments by defining a pipeline which is always possible by just scripting all of this yourself but this is usually rather brittle.

This is where Spinnaker comes in to help you out with all of that.
The internal structure of Spinnaker consists of a couple of microservices written in Spring Boot.
Spinnaker fulfills all the principles we have just summed up and more:

- It allows you to specify the pipelines together with all the different environments
- It allows you to plan your deployments
- You can configure and tune your deployment strategies
- It has support for [Chaos Monkey](https://github.com/Netflix/chaosmonkey){:target="_blank"} which allows you to test your system on how resilient and recoverable it is as VMs get taken out
- It has canary analysis
- Configuring, installing, and updating Spinnaker is done via [Halyard](https://github.com/spinnaker/halyard){:target="_blank"}

Spinnaker is still heavily being worked on and there are a couple of nice features coming up:

- Canary strategies
- Rolling blue/green strategies
- Declarative Continuous Deployment (config as code)
- Operation monitoring

Finally Andreas did a demo of Spinnaker using a simple application based on Rick &amp; Morty which is also available on [GitHub](https://github.com/andreasevers/spinnaker-demo){:target="_blank"}.
During the demo he demonstrated how you can set up pipelines, the deployment strategy, the traffic guard and canary testing in Spinnaker.
People attending the talk were able to participate by going to the url to which the application was deployed in order to show how only a part of the traffic was routed to the new version.

The slides of Andreas' talk are available on Speaker Deck:
<script async class="speakerdeck-embed" data-id="8b92a507c0af49399311db741a49166c" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

### 10 tips to become an awesome Technical Lead - Bart Blommaerts

<span class="image left"><img class="p-image" alt="Bart Blommaerts" src="/img/javaday-ukraine-2017/bart-blommaerts.jpg"></span>

[Bart Blommaerts](https://twitter.com/daggiebe){:target="_blank"}, Application Architect at Ordina Belgium, presented a talk with tips on how to become a better and more awesome technical lead.
Spoiler alert, there were actually 12 tips instead of 10!

1. **Advocate for change:**
You should experience the same pain as your team.
Try to work together more closely with the people in your team to see if there are any pain points or issues that your team members are experiencing.
2. **Work through failure and success:**
It is inevitable that some things will fail now and then.
It is important to prepare for failure and to take responsibility.
Don't finger point!
Failing is an opportunity to learn and should be embraced.
Success on the other hand, should be celebrated as early and as often as possible, and not only after the end of a project.
You should celebrate for example the successful delivery of a sprint or when a feature has been completed.
Congratulate your team and individuals often as it is good for the moral.
3. **Stay technical:**
Reserve the right amount of time to code and review code.
It is important to hold on to that technical vision and to see how your project's code base evolves.
At the same time it is important that you still grasp the technical aspect of your project as it will help you to make the right decisions for your project and your team.
4. **Always available:**
You should always be available and easily approachable for your team members.
According to Bart, your time should be spent about 35% on technical design, 25% with the business, 15% on project management and 25% on code.
5. **Be a mentor of your team:**
As you have a key position in your team you should avoid being a strict ruler and decision maker, and try to make the best decisions for your team.
Instead, try to be a mediator and a mentor for your team members.
Effective delegation is important and try to hand out responsibilities to your team.
Know when to give input, when to make decisions and when to step back.
6. **Surround yourself with other technical leads:**
Each person is different and everybody has a different way to approach things.
There is a lot to be gained by making use of cross-pollination and learning from other technical leads about how they approach and deal with things.
It is important to be open for other approaches and to widen your vision.
7. **Think big, bias for action:**
You should think big and differently.
Try to focus on opportunities and to create a bold direction.
Don't be afraid to undertake action as actions are reversible.
You don't always need to do that time-consuming, extensive study before undertaking action as speed matters.
8. **Interviewing potential new team members:**
Be prepared for interviewing potential new team members and be sure to go through the resumes.
The mindset of a potential team member is more important than their knowledge of the tooling.
You want the person to be eager to learn and to fit in your team.
As for actually taking the interview, don't blatantly copy questions from StackOverflow and expect the interviewee to come up with the exact same solution.
Instead, first comfort the interviewee, offer them different options during the interview and try to build upon the responses they are giving.
Show interest in the person and be sure to offer them a bonus question.
9. **Embrace cultural differences:**
Everybody is different and diversity is invaluable.
Have respect for everybody's opinion and try to surround yourself with them as they offer you different points of view.
Don't forget that everybody in your team has the same shared end goal.
If you are working with an offshore team, take the time difference into account.
You can try to change your work hours to be more available to them.
Focus on good communication and be sure to document the work and tasks well.
10. **Estimating is hard:**
Bart quoted Hofstadter's Law: "It always takes longer than you expect, even when you take into account Hofstadter's Law".
In order to make more educated guesses, doing a planning poker can be useful.
Define a sequence, set a baseline and allow reasoning.
Don't be afraid of uncertainty as it is inevitable.
Bart suggests using the following formula: `(O + 4*BG + P) / 6` where `O` is the optimistic estimate, `BG` the best guess estimate and `P` the pessimistic estimate.
You should add 20% to the guess for properly testing, debugging, polishing, documenting and random wtf moments.
Don't forget, any estimate is better than no estimate, and make sure to share and review estimates.
11. **Interfacing with the outside world:**
Adapt the way and the language when you communicate with non-technical people.
Try to be the go-to-guy/girl for the management, the customer and other stakeholders.
And very important: don't be afraid to say "no"!
12. **Facilitate (agile) team work:**
Be agile, use a prioritised backlog.
Plan your sprints, use burn down charts and do sprint retrospectives.
Your team's strength is not a function of the talent of individual members but rather of their collaboration, tenacity and mutual respect.

In short, facilitate an awesome team.

The slides of Bart's talk are available on SlideShare:
<iframe src="//www.slideshare.net/slideshow/embed_code/key/3YL49tucTjYZo6" width="100%" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/BartBlommaerts/javaday-2017-10-tips-to-become-an-awesome-technical-lead-v4" title="JavaDay 2017: 10 tips to become an awesome technical lead (v4)" target="_blank">JavaDay 2017: 10 tips to become an awesome technical lead (v4)</a> </strong> from <strong><a href="//www.slideshare.net/BartBlommaerts" target="_blank">Bart Blommaerts</a></strong> </div>
<br/>

### Hands-on introduction to CQRS and Event Sourcing with Axon Framework - Steven Van Beelen

<span class="image left"><img class="p-image" alt="Steven Van Beelen" src="/img/javaday-ukraine-2017/steven-van-beelen.jpg"></span>

[Steven Van Beelen](https://twitter.com/smcvbeelen){:target="_blank"}, Software Engineer at AxonIQ, held a hands-on session on CQRS and Event Sourcing using the [Axon Framework](http://www.axonframework.org){:target="_blank"} which helps developers to focus on application functionality rather than the non-functional requirements of an application.

The main advantage of event sourcing is that there is less info loss as you are storing all the different events, leading to the final state of records whereas in a classical example you only hold on to the final state of a record.
By using event sourcing you also get a reliable audit log right out of the box.
At the same time there is also a performance increase as events are processed in the background asynchronously, leading to faster response times.
With event sourcing you mostly make use of a cache, as replaying events when looking up records can be time consuming.
This is further compensated by making use of snapshots every 100 events for example.

Some of the cons are that events are readable forever and that it is a lot of work if you decide to rewrite the event model and that you also have to think of versioning your model.
Sourcing the model from lots and lots of events takes time but this is also resolved by making use of snapshots.

The Axon Framework is open source (Apache 2 license) and supports concepts like DDD (Domain-Driven Design), CQRS (Command and Query Responsibility Segregation) and EDA (Event Driven Architecture).
The framework helps you to focus on the business functionality as it takes care of the plumbing for you.

The majority of the time was spent with live coding.
Steven created a Spring Boot app with Kotlin.
Useful to mention is that Axon has support for Spring Boot AutoConfiguration by adding the `axon-spring-boot-starter` dependency to your project.
Axon will automatically configure the basic infrastructure components (Command and Event Bus) as well as any component required to run and store Aggregates and Sagas.
Kotlin was chosen as it provides a concise way to write code, the data classes especially are very useful for writing commands and events as these are immutable POJOs.
The application was about creating conferences and talks in order to demonstrate the framework.

For the command model, it came down to marking aggregate classes using the `@Aggregate` annotation.
In the aggregate classes, the identifier gets annotated with `AggregateIdentifier`.
Your command handler gets annotated with `@CommandHandler`.
This is the class where all the logic resides on how to handle all the different commands for the specified aggregate, usually resolving into events.
Similar to the command handler, there is also an event sourcing handler annotated with `@EventSourcingHandler` containing the logic for processing the created events of the specified aggregate.
Furthermore you have a controller and a command gateway.
As for the query model, there is an `@EventHandler` that processes any events, updating your query models.

The demo application is available on [GitHub](https://github.com/smcvb/javaday17){:target="_blank"}.
For more information on the framework, be sure to consult the well-written [reference guide](https://docs.axonframework.org){:target="_blank"}.

### Spring Cloud Stream — a new Rick and Morty adventure - Dieter Hubau

<span class="image left"><img class="p-image" alt="Dieter Hubau" src="/img/javaday-ukraine-2017/dieter-hubau.jpg"></span>

[Dieter Hubau](https://twitter.com/dhubau){:target="_blank"}, principal Java consultant and competence lead Cloud & PaaS at Ordina Belgium, presented his cool Spring Cloud Stream application featuring Rick and Morty.
Spring Cloud Stream allows you to create message driven microservices and is based upon Spring Integration and builds upon Spring Boot.

Briefly summarising the talk wouldn't do it justice so instead we will link you to the blog post he has written on the topic available right [here](/spring/2017/10/04/Spring-Cloud-Stream-Rick-And-Morty-Adventure.html){:target="_blank"}.
The presentation is available right here:
<iframe width="100%" height="420" src="//slides.com/turbots/spring-cloud-stream-rick-morty/embed" scrolling="no" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

There is also a recorded video available on our [JWorks YouTube channel](https://www.youtube.com/channel/UCsebfWdqV7LqNNDMDvCESIA){:target="_blank"}, be sure to check it out!

<div class="responsive-embed-youtube">
	<iframe src="https://www.youtube.com/embed/Nl9OIuNRYwI?rel=0" frameborder="0" allowfullscreen></iframe>
</div>
<br/>

### 8 Steps To Becoming Awesome With Kubernetes - Burr Sutter

<span class="image left"><img class="p-image" alt="Burr Sutter" src="/img/javaday-ukraine-2017/burr-sutter.jpg"></span>

[Butter Sutter](https://twitter.com/burrsutter){:target="_blank"}, Director for Developer Experience at Red Hat, gave a cool presentation about Kubernetes.

After a lengthy introduction to DevOps, the challenges of creating and running microservice architectures and Kubernetes, we could dive into some of the more technical features Kubernetes has to offer.

Burr introduced us to **his eight step program to become awesome at Kubernetes**:

## Step 1: Installation

Burr showed us the many ways you could setup a Kubernetes cluster, including [Minikube](https://github.com/kubernetes/minikube/releases){:target="_blank"} or [Minishift](https://github.com/minishift/minishift/releases){:target="_blank"}.
There are plenty of guides on the web for deploying Kubernetes on any of the major infrastructure providers (AWS, Azure or Google Cloud), but there's also the Kubernetes-as-a-service offerings from Google and Microsoft which can get you going very quickly.
Running Openshift can be as easy as running `oc cluster up` on your local workstation, which sets up [a local Openshift cluster for you using Docker](https://github.com/openshift/origin/blob/master/docs/cluster_up_down.md){:target="_blank"}.

## Step 2: Building images

There are several ways to build Docker images for Kubernetes or Openshift. We like the following ones:

- The classical way would be to `docker build` a Docker image, push it to your local Docker registry and run it on a Kubernetes cluster using `kubectl run ...` or by creating a Kubernetes deployment using `kubectl create -f deployment.yml`
- For Java applications, the Fabric8 Maven plugin can be used to build, run and debug Docker images on a Kubernetes cluster
- You can use [Helm Charts](https://docs.helm.sh/using_helm/#quickstart-guide){:target="_blank"} - think of Helm as yum/apt/brew for Kubernetes
- If you're used to Docker Compose and you have a lot of those config files lying around, you can use [Kompose](https://github.com/kubernetes/kompose){:target="_blank"} to convert them to Kubernetes config files
- Openshift provides a way to create an image straight from your source code called [Source to Image](https://github.com/openshift/source-to-image){:target="_blank"}

## Step 3: `kubectl exec` or `oc exec`

If you want to find out what is going on inside of these black-box containers, you really should use the `exec` command which allows you to SSH into them so you can snoop around and learn about the internals of your applications.
It's very handy to debug applications, to figure out issues you might be having and to identify bugs or problems in advance.

## Step 4: Logs

Looking at logs can make troubleshooting so much easier.
Kubernetes allows the user to look at console logs for any pod in the cluster using `kubectl log <name-of-the-pod>` but it gets quite tiresome rather quickly.
Luckily for us, the community has come up with another handy tool called [KubeTail](https://github.com/johanhaleby/kubetail/){:target="_blank"} which allows us to tail multiple pods at the same time, with colorized output.

## Step 5: Service Discovery and Load Balancing

In Kubernetes, pods can be exposed as services, which are internal to the cluster but are really handy in inter-service communication.
Inside of the cluster, services can address each other through DNS via their service names. A service called `producer` running on port 8080 can be called with the following URL: `http://producer:8080`.
When creating a deployment containing a service inside of Kubernetes with two replicas, a ReplicaSet will be created for you, and all traffic to that deployed service will be load balanced automatically over those two replicas.
For more specialized load balancing (for example when doing [Canary Deployments](https://kubernetes.io/docs/concepts/cluster-administration/manage-deployment/#canary-deployments){:target="_blank"}) you can make use of multiple deployments.

## Step 6: Live and Ready

This step is really helpful when just starting with Kubernetes, especially when you can't figure out why your app keeps restarting over and over.
Burr taught us about the existence of and differences between [the **liveness** and **readiness** probes in Kubernetes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/){:target="_blank"}.

Many applications running for long periods of time eventually transition to broken states, and cannot recover except by being restarted. Kubernetes provides **liveness probes** to detect and remedy such situations.

Sometimes, applications are temporarily unable to serve traffic.
For example, an application might need to load large data or configuration files during startup.
In such cases, you don’t want to kill the application, but you don’t want to send it requests either.
Kubernetes provides **readiness probes** to detect and mitigate these situations.
*A pod with containers reporting that they are not ready does not receive traffic through Kubernetes Services.*

## Step 7: Rolling updates and Blue/Green deployments

As mentioned above for Canary Deployments, Kubernetes offers the possibility to balance load over different versions of your application.
This makes it a great tool to manage rolling updates of new versions of your application, as well as Blue/Green deployments.
Although I like the possibilities of the framework, I prefer to use other tools for this like Spinnaker or a service mesh like [Istio](https://istio.io){:target="_blank"}.
These tools will use Kubernetes for us, so that we don't have to worry about changing and updating configuration files all the time.

## Step 8: Debugging

As we've said before, debugging in Kubernetes is completely viable and there are several possibilities here.

- Using `kubectl exec` to get inside of the container and live debug the application
- Using the [Fabric8 Maven plugin](https://github.com/fabric8io/fabric8-maven-plugin){:target="_blank"} to debug the application
- Even Visual Studio Code now has the possibility to [live debug a running Java application](https://code.visualstudio.com/blogs/2017/09/28/java-debug){:target="_blank"}
- [Red Hat JBoss Developer Studio](https://github.com/VeerMuchandi/openshift-local/blob/master/DebuggingUsingIDE.md){:target="_blank"} can be used to debug Kubernetes or Openshift applications

As a bonus for his talk, Burr also explained one of the new service meshes out there called [Istio](https://istio.io/){:target="_blank"}.
It promises to deliver **an open platform to connect, manage, and secure microservices**.
Using a sidecar proxy inside each pod called **Envoy** and some governing tools such as Istio Pilot and Mixer, it solves many of the problems that microservice architectures pose, such as secure inter-service communication, service discovery, circuit breaking, intelligent routing and load balancing, etc...
This seems like a very promising technology inside of the Kubernetes and Openshift world and we will keep a close eye on it.

There was [a talk from **Ray Tsang** at Devoxx about Istio](https://www.youtube.com/watch?v=AGztKw580yQ){:target="_blank"} which was very interesting and entertaining, as always.

You can find Burr's presentation right here on [Google Docs](https://docs.google.com/presentation/d/1ij64THksTygvifW5BD-n0ipc6MDF4cGBRQcV3BRYaoM/edit#slide=id.g12c8aac1e6_0_0){:target="_blank"}.
