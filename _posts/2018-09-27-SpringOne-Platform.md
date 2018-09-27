---
layout: post
authors: [tim_ysewyn]
title: 'SpringOne Platform - A birds-eye view'
image: /img/2018-09-27-SpringOne-Platform/post-image.jpg
tags: [SpringOne, S1P]
category: Spring
comments: true
---

This year we went again to SpringOne Platform to check out the latest changes and what's to come.
In this post I'll try to give an overview of everything that's just been released or coming in the future.
Because there were A LOT of sessions, I wasn't able to gather or note down everything.
All sessions except for the workshops were recorded and I'll update this post to get you directed straight to the videos on YouTube when they come online!

## Announcements

I listed some of the major announcements that were made during SpringOne.
You can find a link to the corresponding video at the end of each topic.

### AWS Service broker for PCF, open beta

Amazon will bring the AWS Service Broker to PCF, making it easier for you to connect your applications to its service catalog of over 18 services.

Watch the talk <a href="https://www.youtube.com/watch?v=1ezNJvajUU0&feature=youtu.be&t=8m42s" target="_blank">here</a>.

### Pivotal Function Service

Next to PAS (Pivotal Application Service) and PKS (Pivotal Container Service), Pivotal will expand PCF with PFS (Pivotal Function Service) which will be build on top of Knative.
Pivotal Greenplum, which is its "Postgres for Petabytes", will also be coming to PCF in the near future so that the same easy-to-use experience that developers nowadays already have with the platform will be extended to the data scientists and data engineers.

Watch the talk <a href="https://www.youtube.com/watch?v=1ezNJvajUU0&feature=youtu.be&t=9m34s" target="_blank">here</a>.

### First-timers-only issues

Because it can be daunting for people to enter a community they are creating "first-timers-only" issues on the Spring Boot project, making it easier for newcomers to get connected.
While working on these issues developers of the Spring Boot project will come alongside you to teach you to contribute back, help you and coach you.
This way you will get to become part of the Spring community.

Watch the talk <a href="https://www.youtube.com/watch?v=1ezNJvajUU0&feature=youtu.be&t=10m39s" target="_blank">here</a>.

### Pivotal Tracker: Maestro

> What happens when your organization scales, and you end up with lots of fast-moving developers?
> It's really, really easy to get misaligned.
> And when you get misaligned, it's really easy to ship the wrong thing.

That's why Pivotal has build a tool to help teams articulate and align around business outcomes to give organizations the high-level view so they can assure that everyone is aligned and delivering value.

Watch the talk <a href="https://www.youtube.com/watch?v=1ezNJvajUU0&feature=youtu.be&t=11m43s" target="_blank">here</a>.

### Pivotal Act

> "Pivotal Act is a program that partners with humanitarian organizations and charities to identify, design, and develop practical solutions to pressing challenges around the world."

Together with developers, designers, and engineers from Pivotal Labs, Pivotal is going to apply the same methodology like they use in other engagements with clients but tailored to the needs of the humanitarian and social impact sectors instead of just donating technology or funds.
This way charitable and nonprofit organisations can use the present-day technologies and put them directly to use through the partnership with Pivotal, while building up the organisation's technology capabilities so they can continue their work after the engagement end.

If you want to find out more, just visit <a href="https://pivotal.io/act" target="_blank">https://pivotal.io/act</a>.

You can watch the announcement <a href="https://pivotal.io/act" target="_blank">here</a>.

### R2DBC

When using the reactive model, people were limited to NoSQL databases because those were the only ones that had a driver which supports things like streams and backpressure.
During the keynote Oliver Gierke announced the R2DBC project.
This project currently consists out of a client, an SPI and a PostgreSQL implementation to bring the reactive capabilities to SQL databases.
It also has an adapter to support the OpenJDK incubator project "ADBA", a non-blocking database access API that Oracle is proposing as a Java standard.

### RSocket

On stage Stéphane Maldini announced the RSocket project.
RSocket is a binary application protocol that provides reactive streams semantics which is built by Facebook, Netifi and Pivotal.
This protocol is payload, transport AND language agnostic making it easy to send eg. JSON or protobuf payloads over TCP, UDP, WebSockets or HTTP/2 using Java, Kotlin, C++, JavaScript,...
Using this protocol we can eg. easily resume our stream of events where we left off in case the connection got interrupted.

To get more in-depth knowledge of the reasoning behind the protocol visit <a href="https://rsocket.io/" target="_blank">https://rsocket.io/</a> and look up the document that explains the motivation in detail.

### Spring Cloud Azure

To quickly integrate with Azure services, Microsoft has already created a couple of starters to easily connect to eg. Azure Active Directory or Azure Key Vault.
Not all starters can be found on <a href="https://start.spring.io/" target="_blank">start.spring.io</a>, to get a complete overview of all their starters and modules visit their <a href="https://github.com/Microsoft/spring-cloud-azure" target="_blank">GitHub repository</a>.

Watch the talk <a href="https://www.youtube.com/watch?v=P9ahKTFPx-A&feature=youtu.be&t=9m23s" target="_blank">here</a>.

### Cloud Native Buildpacks

Cloud Native Buildpacks is a new effort initiated by Pivotal and Heroku which aims to unify the buildpack ecosystems with a platform-to-buildpack contract.
They embrace modern container standards, such as the OCI image format and take advantage of the latest capabilities of these standards.
This way buildpacks can be used cross-platform.

You can watch the announcement <a href="https://www.youtube.com/watch?v=wU5n7Sv8JL8" target="_blank">here</a>.

## Releases

### Spring Framework 5.1

The highlights of this release are the support for JDK 11, initial refinements for GraalVM compatibility and Reactor & Hibernate got an upgrade to respectively Californium and 5.3.
Improved startup times and less heap memory consumption are also some benefits you get when upgrading to this release.

Check out <a href="https://spring.io/blog/2018/09/21/spring-framework-5-1-goes-ga" target="_blank">this post</a> by Juergen Hoeller to find out more!

### Spring Boot 2.1.0.M4

The fourth milestone of Spring Boot 2.1 got released to incorporate the 5.1 release of the Spring framework and closes over 40 issues and pull requests.

Madhura Bhave wrote <a href="https://spring.io/blog/2018/09/25/spring-boot-2-1-m4-available-now" target="_blank">this post</a> announcing the milestone release and added some usefull links to the release notes and updated reference documentation.
Make sure to check them out!

### Spring Batch 4.1.0.RC1

Mahmoud Ben Hassine <a href="https://spring.io/blog/2018/09/26/spring-batch-4-1-0-rc1-is-now-available" target="_blank">announced</a> yesterday the first release candidate of 4.1.0.
This release was mainly focused on running Spring Batch correctly on Java 8, 9, 10 and 11.
Their plan is to release this version by the end of October so it can be shipped with Spring Boot 2.1.

### Spring Data Lovelace

With the release of Spring Framework 5.1 comes a new release of Spring Data.
This release notable topics are:
- Support for immutable objects
- Deferred JPA repository initialization
- Support for MongoDB 4.0 Client Sessions and Transactions
- New Spring Data JDBC module
- Apache Cassandra mapping improvements for Map and tuple types, Lifecycle Callbacks, and Kotlin Extensions
- Replica Reads with Spring Data Redis

To see what else has changed, check out <a href="https://spring.io/blog/2018/09/21/spring-data-lovelace-ga-released" target="_blank">this post</a> by Mark Paluch.

### Spring Security 5.1

In this new release a lot has been added regarding WebFlux support: OAuth 2, CORS and HTTPS redirection  are just a few to sum up.
More than <a href="https://github.com/spring-projects/spring-security/milestone/107?closed=1" target="_blank">50 issues</a> have been resolved too!

To see what else has been added, check out <a href="https://docs.spring.io/spring-security/site/docs/5.1.0.RELEASE/reference/htmlsingle/#new" target="_blank">what's new</a> in the reference documentation.

### Spring Fu 0.0.1

Spring Fu is an experimental micro-framework that makes it easy to create lightweight Spring-powered applications with functional APIs instead of annotations.
It introduces Kofu (*Ko*tlin and *fu*nctional) and Jafu (*Ja*va and *fu*nctional, still a proof of concept) configuration for configuring Spring Boot in a functional way and makes use of the functional bean registration.
It also ships with coroutines support, GraalVM native images support and various other features.

To learn more about this interesting project, visit this <a href="https://github.com/spring-projects/spring-fu" target="_blank">link</a>!

### Spring Tools 4

Spring Tools 4 is completely re-built from scatch after a decade of updates and improvements of Spring Tool Suite (STS).
It's a new set of IDE agnostic tools that can be installed in your favorite IDEs and editors.
Currently they support Eclipse, Visual Studio Code and Atom IDE.
With this release also comes the end of Spring Tools 3, but not until mid 2019!
STS 3.9.x will still receive updates and will be shipped as a full distribution, and the distribution will be updated to the upcoming Eclipse releases (2018-09, 2018-12, and beyond).
After mid 2019, it will not receive any maintenance updates anymore.