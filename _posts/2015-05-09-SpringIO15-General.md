---
layout: post
authors: [andreas_evers]
title: 'Spring I/O 2015 Barcelona'
image: /img/springio.jpg
tags: [Spring]
category: Spring
comments: true
---

>Last week Barcelona was the place to be for Spring enthusiasts. With tons of Pivotal speakers and many more community leaders it was a two-day goldmine for anyone looking to update their Spring knowledge. This is my report ranging many different topics, including quite some one on one discussions and hacking sessions with the people behind the Spring ecosystem.

<img class="image fit" src="https://www.ordina.be/~/media/images/ordinabe/blogs/andreas2.jpg?la=nl-nl&amp;h=429&amp;w=763" alt="Sergi Almar (event organizer), me and Josh Long (Spring developer advocate)" />
*Sergi Almar (event organizer), me and Josh Long (Spring developer advocate)*

### One on one talk with Juergen Hoeller:

<span class="image left"><img  class="p-image" alt="Juergen Hoeller" src="https://www.ordina.be/~/media/images/ordinabe/blogs/andreas3.jpg?la=nl-nl"></span>Groovy has now become an Apache Incubator project, as Pivotal decided Groovy isn't a core project for them. Most of the people behind Groovy are not working for Pivotal anymore but for other companies which means they can only work on it part-time. Juergen doesn't like this but it wasn't his decision. Luckily Groovy has a huge userbase and they truly love the language. That's why Juergen is not too concerned about Groovy dying, but of course the speed of new developments will be a lot slower than the past two or three years.
Gradle has strong dependencies on Groovy, as it's using a Groovy-based DSL language. The story is different here however, as Gradle is backed by Gradleware, a Silicon Valley company with its own vision. Spring is using Gradle for most of its projects, because for one the devs like to use Groovy, but foremost because it offers more flexibility compared to maven which is necessary when dealing with an open-source framework.

The Netflix stack is Amazon based as it's the most important player in the market at the moment. Of course there is support for Cloud Foundry but there are no guarantees it will work on all clouds. Especially Google App Engine is kind of a mess as the team behind it doesn't really cooperate with Pivotal or anyone else as far as Juergen knows.

Currently it's hard to find decent books about microservices but they should be coming up soon. For cloud there are some books out there but they could feel outdated already. What's written in 2013 isn't always completely valid anymore in 2015, especially in a field like Cloud computing.

### One on one hacking session with Oliver Gierke:

<span class="image left"><img  class="p-image" alt="Oliver Gierke" src="https://www.ordina.be/~/media/images/ordinabe/blogs/andreas5.png?la=nl-nl"></span>Lots of stuff can still be moved from Spring Data REST to Spring Hateoas. This afternoon I'm sitting down with Oliver Gierke to do some hacking on the subject.

It's possible to have a resource with many different embedded resources inside by nesting domain POJOs in eachother. The thing Spring Data REST is missing is the possibility to distinguish between domain model nested classes and resource model nested classes (aka embedded resources). There is no way to embed a Car resource as an embedded resource into a Person resource without actually having Car as a property of Person in the domain model. Having the possibility to manually add embedded resources to a resource would solve this.
To achieve this we should have an extension of ResourceSupport with a Set of EmbeddedWrappers inside. Using the EmbeddedWrappers class, we can add embedded resources to our resource in its Assembler. This Wrapper will take care of relation resolving, especially handy when dealing with collections which require plural-forms. The relation value can be annotated in the model or passed along as a second parameter.

I will go into more detail with examples as a comment on [the GitHub ticket about embedded resources](https://github.com/spring-projects/spring-hateoas/issues/270) which Oliver will try to follow up. An existing stackoverflow issue about the subject can be found here: [http://stackoverflow.com/questions/25858698/spring-hateoas-embedded-resource-support](http://stackoverflow.com/questions/25858698/spring-hateoas-embedded-resource-support)

Having different representations of the same resource with different fields (e.g. summary and full view) can be achieved using jsonViews. However, those jsonViews can be used for versioning as well, and having both at the same time could interfere. The Projection abstraction is a very nice feature of Spring Data REST that was moved to the Spring Data Commons package. This enables us to use this abstraction without the need of a persistence. We can use it in conjunction with Spring Hateoas without Spring Data REST.
The main class to use is the SpelAwareProxyProjectionFactory. This factory can be used to create projections. It's also possible to use the Page functionality and especially its page.map() function, which can link a projection interface with a domain class. This approach allows us to define an interface with the selection of fields from the domain class as getter methods. This defines the selection of fields which that projection should expose.
This pattern is applied as well in the latest Spring MVC where a UserForm is used as a parameter of a POST endpoint method. Defining the UserForm as an interface works exactly by the same principle as the Projections of Spring Data. You can even have default methods in the interface for validation of that form.

At my client I am integrating most of the stuff you can find in [foxycart's HAL browser](https://api-sandbox.foxycart.com/hal-browser/browser.html) but in a dynamic way. Exposing [a graph of resources](https://api-sandbox.foxycart.com/hal-browser/browser.html) can be done using Spring Restdocs' link documents generated in asciidoc. By parsing the results of these asciidocs and merging the results, a resulting json is aggregated and used to generate a graph of resources and their links using [d3js](http://d3js.org/). This graph is integrated in the HAL browser, and each resource links to its documentation. That documentation per resource can of course also be reached from the regular HAL browser documentation links using curies. To generate that documentation we are in turn using Spring Restdocs to show examples with their links, request and response fields and error scenarios. All of this is generated and guaranteed up-to-date (if it weren't, it would have failed the build). 
The improvement which is still possible to do here, is to have our own hook into Spring Restdocs so we wouldn't need to go through asciidoc links to generate the full relationship graph. Oliver asked me to open a ticket for Andy Wilkinson to allow hooks in the generation model.

Oliver doesn't fully agree with versioning on resource level. He prefers versioning APIs or not versioning at all, to avoid having a higher cost later due to legacy and lots of old versions we'll need to support. The initial win of versioning would be insignificant compared to the technical debt it creates. 

Implementation of the [hypertext cache pattern of HAL](https://tools.ietf.org/html/draft-kelly-json-hal-06#section-8.3) is quite straight forward according to Oliver. The client should be smart enough to search for the field it needs in the embedded resource, and if that field isn't there, he should follow the link to the full resource. Keeping track of which representation is shown in which place (embedded vs linked) becomes unnecessary using that approach.

## More on Spring I/O 2015 Barcelona ....

<span class="image left"><img  class="p-image" alt="Christoph Strobl" src="https://www.ordina.be/~/media/images/ordinabe/blogs/andreas4.png?la=nl-nl"></span>

#### Boot your Search with Spring talk:

Speaker: Christoph Strobl - [Talk & speaker description](http://www.springio.net/boot-your-search-with-spring/)

Solr feels like an old kitchen sink for anything you want to do. Not exactly a fancy 2015 tool. They are catching up though and documentation is getting better. It's scheme based. MongoDB does much more out-of-the-box which you have to do manually with xml configuration. Solr schemaless support exists but as long as it's lucene-based, there's no such thing as a schema-less index. Their type-guessing only goes so far until you try to add a record with a different type.

Spring Data Solr does just what you expect: clean to-the-point interfaces with annotations that do the DAO magic for you. Spring Data Elasticsearch does that as well for the complexity of Elasticsearch. I never really liked the query system that Elasticsearch has so having this abstraction layer could prove really useful.

<span class="image left"><img  class="p-image" alt="Brian Clozel" src="https://www.ordina.be/~/media/images/ordinabe/blogs/andreas6.jpg?la=nl-nl&h=227&w=227"></span>

#### Inside http://spring.io - a production spring reference application & one on one talk with Brian Clozel

[on this blog](http://ordina-jworks.github.io/spring/2015/05/08/SpringIO15-Sagan.html)
<p style="clear:both"></p>
<span class="image left"><img  class="p-image" alt="Sergi Almar" src="https://www.ordina.be/~/media/images/ordinabe/blogs/andreas7.jpg?la=nl-nl&h=224&w=227"></span>

#### Real-time with Spring: SSE and WebSockets talk

Speaker: Sergi Almar - [Talk & speaker description](http://www.springio.net/real-time-with-spring-sse-and-websockets/)

Spring WebSockets is better than JSR356 because: there is a fallback with SockJS, there is support for STOMP subprotocol, Spring Security can jump in, and of course flawless integration with messaging components and the Spring messaging style. Security is important because there are no URLs anymore. We have to secure at message level.
<p style="clear:both"></p>
<span class="image left"><img  class="p-image" alt="Oliver Gierke" src="https://www.ordina.be/~/media/images/ordinabe/blogs/andreas8.png?la=nl-nl&h=223&w=223"></span>

#### Spring Data REST - Repositories meet hypermedia talk

Speaker: Oliver Gierke - [Talk & speaker description](http://www.springio.net/spring-data-rest-repositories-meet-hypermedia/)

Recommended reading: Domain Driven Design. Although very boring, it introduces vital concepts in the repository world. When combining ALPS and JSON Schema, it should be possible to create a client that is smart enough to discover verbs and even fields of the payload.
<p style="clear:both"></p>
<span class="image left"><img  class="p-image" alt="Dave Syer" src="https://www.ordina.be/~/media/images/ordinabe/blogs/andreas9.jpg?la=nl-nl"></span>

#### Building Microservices with Spring Cloud and Netflix OSS talk

Speaker: Dr. Dave Syer  - [Talk & speaker description](http://www.springio.net/building-microservices-with-spring-cloud-and-netflix-oss)

Another great book is Release It!. It describes a lot of the patterns microservices use such as circuit breaker. It's definitely a great book for devops.
<p style="clear:both"></p>
<span class="image left"><img  class="p-image" alt="Stéphane Nicoll" src="https://www.ordina.be/~/media/images/ordinabe/blogs/andreas10.png?la=nl-nl"></span>

#### Master Spring Boot autoconfiguration talk

[on this blog](http://ordina-jworks.github.io/spring/2015/05/08/SpringIO15-Autoconfig.html)
<p style="clear:both"></p>
<span class="image left"><img  class="p-image" alt="Josh Long" src="https://www.ordina.be/~/media/images/ordinabe/blogs/andreas11.jpg?la=nl-nl"></span>

#### Can Your Cloud Do This? Getting started with Cloud Foundry talk & Building "Bootiful" Microservices with Spring Cloud workshop & One one one talk with Josh Long

[on this blog](http://ordina-jworks.github.io/spring/2015/05/08/SpringIO15-Microservices.html)
<p style="clear:both"></p>
<br/>
<br/>
Enjoy reading!
<br />
<br />