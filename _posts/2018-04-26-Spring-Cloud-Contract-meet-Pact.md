---
layout: post
authors: [tim_ysewyn]
title: 'Spring Cloud Contract, meet Pact'
image: /img/2018-04-26-Spring-Cloud-Contract-meet-Pact/post-image.jpg
tags: [Spring, Spring Cloud, Spring Cloud Contract, SCC, Pact, CDCT]
category: Spring
comments: true
---

# CDCT, or Consumer-Driven Contract Testing

Consumer-Driven contract tests are actually integration tests that are targetting your API, whether it's REST-based or messaging-based.
They key in this setup is that the tests are driven by contracts that are defined by the consumer of your API instead of the developer that wrote the implementation of a certain functionality.
Using this kind of tests we can verify whether or not we're going to break some functionality from our consumer in case we apply some changes to our API.
With Spring Cloud Contract we could already define groovy contracts which were packaged as a jar and uploaded to your artifact repository like Nexus or Artifactory.
Great, but that meant that we could only use these contracts between JVM languages.

What if the consumer of our API is a NodeJS application, or an Angular application?

# Spring Cloud Contract, meet Pact

The first release candidate of Spring Cloud Finchley, which was released yesterday, ships also the first release candidate of Spring Cloud Contract.
Spring Cloud Contract has added the support to connect to a <a href="https://github.com/pact-foundation/pact_broker" target="_blank">Pact broker</a> to retrieve or store Pact contracts.
The Pact contracts will be converted from and to Spring Cloud Contract contracts for you, so these in turn can be used to generate stubs and tests.

Simply add the `spring-cloud-contract-pact` dependency, which will add the Pact Converter and Pact Stub Downloader, together with some configuration and you're good to go!

Currently Pact contracts up until v4 are supported, which means that both request-response and messaging contracts can be used.
Note that not all functionality is supported though.

<center><blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Our first release candidate of the Spring Cloud Finchley release train has been released.  Checkout the blog post for more information and as always feedback is welcome! <a href="https://t.co/8TK0tudkzr">https://t.co/8TK0tudkzr</a></p>&mdash; Spring Cloud (@springcloud) <a href="https://twitter.com/springcloud/status/989122422635925504?ref_src=twsrc%5Etfw">April 25, 2018</a></blockquote></center>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

# Useful links

The <a href="https://cloud.spring.io/spring-cloud-contract/single/spring-cloud-contract.html#spring-cloud-contract-verifier-intro-three-second-tour" target="_blank">three-second</a> or <a href="https://cloud.spring.io/spring-cloud-contract/single/spring-cloud-contract.html#spring-cloud-contract-verifier-intro-three-minute-tour" target="_blank">three-minute</a> tour of Spring Cloud Contract.

<a href="https://www.youtube.com/watch?v=JEmpIDiX7LU" target="_blank">Consumer Driven Contracts and Your Microservice Architecture</a> by Marcin Grzejszczak (<a href="https://twitter.com/mgrzejszczak" target="_blank">@mgrzejszczak</a>) and Adib Saikali (<a href="https://twitter.com/asaikali" target="_blank">@asaikali</a>).

<a href="https://github.com/pact-foundation/pact-js" target="_blank">Implementation of the consumer driven contract library Pact for Javascript</a>, from creating a test to generating the contract and uploading it to the Pact broker.