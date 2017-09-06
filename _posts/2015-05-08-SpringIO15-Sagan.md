---
layout: post
authors: [andreas_evers]
title: 'A production Spring reference application & One on One talk with Brian Clozel'
image: /img/springio.jpg
tags: [Spring]
category: Spring
comments: true
---

>Sagan is the name of the Spring.io website. It's built by Pivotal Labs and maintained and extended by Brian Clozel. The project uses a best-of-breed set of tools. In Brian Clozel's talk he sheds a light on which tools are used for which reasons. After the talk I sit down with Brian to discuss some more details.

<img class="image fit" alt="Sagan: The Spring.io website" src="https://www.ordina.be/~/media/images/ordinabe/blogs/sagan.png">

### Sagan: A production Spring reference application

*Speaker: Brian Clozel - [Talk & speaker description](http://www.springio.net/inside-spring-io-a-production-spring-reference-application/)*

Sagan is the name of the Spring.io website. It's built by Pivotal Labs and maintained and extended by Brian Clozel. The project uses a best-of-breed set of tools. Of course it uses GitHub as code repository and issue tracking. But GitHub can become a bit confusing and unclear when a lot of issues need to be tackled and tracked. Sagan uses [Waffle](https://waffle.io/) to link GitHub issues and commits to scrum & kanban practices. Formal communication goes through GitHub issues, and informal conversations are held through [HipChat](http://www.hipchat.com/). [Travis](https://travis-ci.org/) is used for continuous deployments. Asciidoctor is used for the guides on the website. They are stored in a GitHub repository, fetched by the website and rendered appropriately.  

Sagan is using a Gradle plugin which is triggering Green-Blue deployment. It calls Cloud Foundry to see which clone is active (green or blue) and deploys on the non-active one. Once deployment is done, the routing is switched automatically to the newly deployed one. In the short moment where the switch occurs, both clones are being routed to avoid a brief moment of downtime.

Cloud Foundry takes the console log output of each application and aggregates everything. Either the result is exposed using webockets or it's bound using a service that can show the logs as well as persist them. 
Redis is used in conjunction with Spring Session. This creates distributed session management for the cloud. 
Whenever the database needs to be updated, versioned FlyWayDB scripts are used. The upgrades could be small changes where local tests are sufficient, or a staging environment is used for testing.  

The slidedeck of this talk can be found here: [https://speakerdeck.com/bclozel/spring-dot-io-1](https://speakerdeck.com/bclozel/spring-dot-io-1)

### One on one talk with Brian Clozel

<span class="image left"><img  class="p-image" alt="Brian Clozel" src="https://www.ordina.be/~/media/images/ordinabe/blogs/andreas6.jpg?la=nl-nl"/></span>The Netflix guys have a strong implementation of Conway's law. The organisation mimics the architecture and vice versa. This closely relates to the microservices pattern, where each microservice can have the best tools for the job, and those can definitely be different for each microservice. In Netflix this applies to teams as well, resulting in different approaches suggested by different people. 

Regarding database evolution Brian suggests the Netflix guys could have some good ideas about handling backwards-compatibility breaking evolution in a green-blue deployment with zero downtime. In any case there are many cases where teams use feature-switches to make certain user interactions read-only for a short time during migration. This avoids having transactions that have to be forcibly destroyed. After successful deployment the feature is turned on again ensuring the user has a seamless experience.
Brian will check with the Netflix guys and let me know what they do for database migration