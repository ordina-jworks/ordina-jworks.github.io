---
layout: post
authors: [ken_coenen]
title: 'Applying software patterns to microservices'
image: /img/jax2015_logo.jpg
tags: [Microservices, Software Patterns]
category: Microservices
comments: true
---

>During the week of October 12th, my colleagues Andreas Evers and Tim De Bruyn and me attended JAX London 2015. After attending over a dozen talks in three days, we went home with tons of insights about DevOps, microservices, Continuous Delivery, Spring Boot and much more. This is a write-up of Chris Richardson’s talk [A pattern language for microservices](https://jaxlondon.com/session/a-pattern-language-for-microservices/).


----------

<span class="image left"><img  class="p-image" alt="Chris Richardson" src="https://www.ordina.be/~/media/images/ordinabe/blogs/ken2.jpg?la=nl-nl"></span>
[Chris Richardson](http://www.chrisrichardson.net/) is the author of [POJOs in Action](https://www.manning.com/books/pojos-in-action) and is founder of the original CloudFoundry, which was later acquired by VMWare and then SpringSource. Nowadays he is constantly thinking about microservices and founded a startup that is creating a platform for aiding the development of event-driven microservices (http://eventuate.io/). He also launched http://microservices.io/, describing microservice responsibilities and commonly accepted solutions as patterns.

<p style="clear:both;"></p>

----------


Problems in software engineering
==================

Chris started his presentation by pointing out a few problems in software engineering. First, we have a lot of sucks/rocks discussions between developers. JavaScript vs. Java, Spring vs. JEE, Java vs. .NET, functional programming vs. object-oriënted programming, containers vs. virtual machines, … Sounds familiar? But these discussions are usually very subjective and shallow. Back in 1986, Fred Brooks already mentioned in a paper on software engineering that **there is no such thing as a silver bullet**. So there is no right or wrong answer to which language or framework is better, it depends on the situation.

A second problem is that we have **a lot of new technologies** these days. Typically, these technologies go through the *Gartner Hype Cycle*.

<span class="image left"><img  class="" alt="Gartner Hype Cycle" src="https://www.ordina.be/~/media/images/ordinabe/blogs/ken3v2.png?la=nl-nl"></span>

<p style="clear:both;"></p>

At first, people discover an innovative technology and everybody wants to use it, which drives the technology into the *Peak of Inflated Expectations*. Docker is a good example of a technology in this phase. Then a huge drop follows, because people didn’t really understand the technology and misused it. When we start to **understand the subject**, that’s when productivity on the market increases.

It’s clear that we need a better way to discuss and think about technology. That’s where software patterns come in.

Pattern languages
============

Patterns help us to **describe a reusable solution to a problem occurring in a particular context**. The use of pattern languages is a a great way of talking about technology in general. You can see it as an advice around a topic. Describing what you want to solve and its context is much more important than the framework or tool you choose.

A pattern description typically contains:

 - Pattern name
 - Context
 - Problem - The issue which we try to solve
 - Forces, which are a set of indicators why we want to use the pattern, eg. we need to do CD, run multiple instances, ...
 - Solution. What would a pattern be without a solution?
 - Resulting context. Set of both benefits and downsides which we achieved, but also problems which we then have to solve next.

Patterns can be **related**, they can be alternate solutions, solutions to problems that were caused by another pattern or more specific solutions to a certain problem. When you want to read more about writing and understanding patterns, you can read Martin Fowler’s blog post [Writing Software Patterns](http://www.martinfowler.com/articles/writingPatterns.html).

Patterns for the microservices world
===============

Microservices is another one of those new technologies which are in *Peak of Inflated Expectations* phase. To help us understand the complexity of implementing these kind of systems, Chris founded http://microservices.io/ . Here you can find a collection of microservices patterns.
We can group the microservices patterns into several categories:

 1. Core patterns
 2. Deployment patterns
 3. Discovery patterns

<img class="image fit" src="https://www.ordina.be/~/media/images/ordinabe/blogs/ken4.png?la=nl-nl" alt="Microservices patterns" />

Chris then elaborated on a few microservice pattern categories.

Core patterns
=========

**Monolithical applications** tend to be simple to develop, test, deploy and scale. You can just run multiple copies of your monolithical application. When the application is large however, you end up in *monolithic hell*:

 - Millions of lines of code undermine developer productivity and knowledge of the system.
 - As one change might affect other parts of the application, there’s a fear of changing and refactoring code
 - Developer productivity decreases, as your IDE gets slower, startup times of the server take very long, …
 - Long-term commitment to a technology stack

With X and Z axis scaling, you increase the number of application instancess or you increase server resources. Y axis scaling on the other hand means you break up your application into separate **microservices** which group business functionality. Some **benefits** to this are:

 - Smaller, simpler apps, which are easier to understand
 - Less classpath hell
 - Faster to build and deploy
 - Improve fault isolation
 - Eliminates the long-term commitment to a single technology stack

Of course, each solution always has some **drawbacks**, to which fortunately solutions exist.

 - Added complexity of developing a distributed system
 - We have to handle partial failures
 - Implement business transactions that span multiple databases
 - More complex testing: what do we do with transitive dependencies? Do we mock them?
 - What about managing communication for cross-service development and deployment?

Deployment patterns
==============

Forces to consider when deploying microservices are:

 - Variety of languages
 - Building and deploying must be fast
 - Isolate service instances
 - Deploying must be cost-effective

For these, you can look at the deployment patterns.

 - [Service per VM](http://microservices.io/patterns/deployment/service-per-vm.html) = [Packer.io](https://packer.io/) is a great tool for running each service
   in its own VM. Downside is you got the overhead of a whole VM per
   microservice. It is very expensive and the deployment itself is
   relatively slow. A positive thing though is that the AWS
   infrastructure is very mature and reliable.
 - [Service per container](http://microservices.io/patterns/deployment/service-per-container.html) = Each service is in its own Docker container, which is started very quickly. A drawback is that these technologies are still very immature.

Discovery patterns
=============

One problem we need to address around the area of service discovery is that we need to know the IP address of the server. Simply having configuration files with the IP’s wont work anymore. On top of that, the set of API interfaces can change. And this is just a tip of the iceberg.

There are several patterns related to service discovery:

 - [Client-side discovery](http://microservices.io/patterns/client-side-discovery.html) = The client will query the service registry,
   pick one from the load balancing configuration, and then use it.
   Netflix' [Eureka](https://github.com/Netflix/eureka) and [Ribbon](https://github.com/Netflix/ribbon) provide this functionality. Multiple
   Eureka’s can be clustered.
 - [Server-side discovery](http://microservices.io/patterns/server-side-discovery.html) = At some level it’s
   the same like client-side discovery. The difference is that the
	   client makes a request to the router, which then queries t he service registry. You can achieve this with eg. [Nginx](https://www.nginx.com/) as the router and an Elastic Load Balancer from AWS. The advantage is that the client code is much simpler. Advantage is that it’s built in in some cloud/container environments, such as AWS ELB, Google’s [Kubernetes](http://kubernetes.io/), [Marathon](https://mesosphere.github.io/marathon/), …

Conclusion
=============

Over the years, companies like Netflix, LinkedIn, Soundcloud and many others have applied the microservices architecture in their software landscape, with several tools and open-source libraries as a result. But deep down these tools have to tackle the same problems. Chris’ effort to describe these common problems and solutions in software patterns allows us to see the wood for the trees again. Because as I said earlier, knowing what you want to achieve is much more important than the framework or tool you choose.