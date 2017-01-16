---
layout: post
authors: [andreas_evers]
title: '"Bootiful" Microservices in CloudFoundry & One on One with Josh Long'
image: /img/springio.jpg
tags: [Spring]
category: Spring
comments: true
---

>Spring Boot, Spring Cloud and CloudFoundry: a perfect match. Josh Long explains how to build Spring Boot microservices, deploy them in CloudFoundry and manage them using the Netflix OSS stack through Spring Cloud. Including a One on One talk.

<img class="image fit" alt="Sagan: The Spring.io website" src="https://www.ordina.be/~/media/images/ordinabe/blogs/hystrix-sample.png">

### Can Your Cloud Do This - CloudFoundry talk

*Speaker: Josh Long - [Talk & speaker description](http://www.springio.net/can-your-cloud-do-this-getting-started-with-cloud-foundry/)*

In Amazon there's a good chance you'll encounter "AMIs". These are basically virtualizations with an operating system, and is perceived as a container. These containers need to be disposable. The moment you remove one, another should be ready to jump in. The idea is to treat your servers as cattle, not as pets. The moment you know the name of a specific server, it's as if it's your pet. And you don't want pets because they're not disposable. 

When choosing a cloud platform, it's important to avoid vendor lock-in. At Google AppEngine, there was a huge community developing applications for the platform before it was even in GA. Once they got there, Google raised the prices significantly. The problem was however that all those applications were using Google-specific APIs and were really tightly coupled to the Google infrastructure. For most companies it was no longer viable to use Google's platform without incurring debts and were unable to quickly move to another platform. Josh compares it nicely with Hotel California: "You can always check-in, but you can never leave". 

It's possible to deploy a jar to Cloud Foundry, but also a war. The war will be automatically wrapped in a container (using Warden, the linux container, which makes it similar to a docker image), but you can also push your own docker image with your war inside. 

Once you pushed your application into Cloud Foundry, you have to link it to backend services, such as a database. Doing this is child's play. One cool backend service in particular is the logging service. You can use Splunk or Papertrail, which you can bind to e.g. your own account on the Papertrail site. 

An older version of the slidedeck of this talk can be found here: [https://speakerdeck.com/joshlong/scaling-with-spring-and-cloud-foundry](https://speakerdeck.com/joshlong/scaling-with-spring-and-cloud-foundry)

### Building “Bootiful” Microservices with Spring Cloud (Workshop)

<span class="image left"><img  class="p-image" alt="Josh Long" src="https://www.ordina.be/~/media/images/ordinabe/blogs/andreas11.jpg?la=nl-nl"/></span>The configprops actuator endpoint is especially useful to figure out what properties are available for certain functionalities. It beats debugging and is a pretty useful form of documentation. For more information check this out: [http://docs.spring.io/spring-boot/docs/current/reference/html/howto-properties-and-configuration.html#howto-discover-build-in-options-for-external-properties](http://docs.spring.io/spring-boot/docs/current/reference/html/howto-properties-and-configuration.html#howto-discover-build-in-options-for-external-properties)

The configuration server supports configuration which is common to all microservices. If the configuration.yml is inside the resources folder of the configuration server itself, it's used only as configuration for the configuration server. But if the server finds an application.yml inside the distributed configuration location (e.g. Git), then those configurations are shared for all other yml files, albeit with lowest priority.

The Cloud Configuration Bus is interesting if you would like to have a distributed refresh of the configuration of your microservices. Basically instead of POSTing to http://yourmicroservice/refresh, you'd call http://yourmicroservice/bus/refresh on any clone and Spring Cloud Configuration Bus will forward the refresh using AMQP to all the other clones. This way you don't need to call a refresh on each node separately.
It's also possible to poll for changes instead of pushing them. Simply inject the refresh endpoint as a bean and annotate it with the @Scheduled annotation.
Since the 1.0.1 release of Spring Cloud, it's now even possible to have the client microservice wait and retry until a configuration server is registered. ([https://GitHub.com/spring-cloud/spring-cloud-config/issues/129](https://GitHub.com/spring-cloud/spring-cloud-config/issues/129))

A cool new annotation is @SpringCloudApplication. It groups the following annotations: @SpringBootApplication, @EnableDiscoveryClient and @EnableCircuitBreaker.

The high availability principle in Eureka is considered fulfilled when at least two Eureka instances are registered and peer aware in each zone.

Ribbon, the client-side load balancer of Netflix, is integrated nicely into Spring's RestTemplate. When EurekaClient is enabled on the microservice, Ribbon will be able to resolve the following command: restTemplate.exchange("http://myservice/books", ...). It will look into Eureka for an application called myservice, and route to the appropriate server.

The slidedeck of this talk can be found here: [https://speakerdeck.com/joshlong/the-bootiful-microservice](https://speakerdeck.com/joshlong/the-bootiful-microservice)

 
### One on One talk with Josh Long

<span class="image left"><img  class="p-image" alt="Josh Long" src="https://www.ordina.be/~/media/images/ordinabe/blogs/andreas11.jpg?la=nl-nl"/></span>In many cases there are different access rules for different environments. This applies in a great deal on configuration as well. Most guides showcase one configuration server with all properties for all environments into a single repository. When facing more strict policies, there is no reason why you can't have a configuration server per environment, or at least for production a dedicated one. That server could have different access rules. It's an easy solution worth trying out.

When you have both public and private microservices, Josh prefers to do the extra security for the private ones on the microservice level instead of in the gateway. It's important to trust the developers, especially in a devops culture which is a requirement in a microservices architecture.
At the company I work, management fears that the developers will introduce security issues, so the enterprise architects are looking into more governance-minded solutions. One of those solutions is having a full blown ESB as the gateway. Such an ESB would require you to register new endpoints - in case of REST these would be resources with their allowed verbs - and different types of handlers and interceptors. This is a very process-heavy solution where the microservice would have to request access through the ESB for every new resource, or verb on a resource, probably to another team in charge of the ESB.

This goes completely against the microservices principles. The ESB becomes a bottleneck and increases the time-to-market. It also becomes a heavy single point of failure with lots of logic inside. Josh makes a fitting comparison with conductor versus choreographer. If your gateway is an ESB it acts as an conductor. When the conductor goes offline, the entire orchestra fails. When a choreographer drops out, the dancers can still independently continue. The power lies in the individual units, instead of one governing entity. Microservices need to be in charge of their own decision-making instead of an ESB and its separate team.

We're also facing strong opposition from the infrastructure team against the embedded-container approach. It's probably not surprising they're trying to push JEE standards as they're heavily invested in a certain application server. Josh argues the battle between Spring and JEE was won a long time ago, and by a big margin. Case in point is the new exciting feature of JEE 8: to marshal and unmarshal data between POJOs and JSON. Spring had support for this via Jackson integration already three years ago. Currently there are almost no application servers that implemented JEE 7. It will probably take another five years or so until JEE 8 will be adopted in application servers. That means basic JSON binding on POJO support will only be available eight years after Spring started supporting it. Do you really want to wait that long for such a vital feature? Or should we still use XML-only?

Cloud Foundry can be pretty expensive since it's primarily aimed towards big enterprises. For other purposes, definitely check out the free OSS stack.

Pivotal has a division called Pivotal Labs. It's a super agile company that only takes clients that align with their agile views. They have a proven trackrecord that is pretty much unmatched and allows them to stick to their values. Although super expensive, they're fast and deliver quality. Aside from taking projects on, the also help companies become more agile.  

Aside from Eureka, Spring Cloud also supports other registries such as Zookeeper and Consul. The difference between for example Eureka and Zookeeper is that Zookeeper is a shared hierarchical name space of data registers (also called registers znodes). It can be used very well as a service registry, but it offers a lot more features on top of that. One easy example is leader election. Due to the Spring Cloud annotation abstractions it's possible to switch out Eureka with any other supported service registry.