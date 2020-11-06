---
layout: post
authors: [lina_romanelli]
title: 'Spring Cloud Circuit Breaker'
image: /img/2020-11-05-spring-cloud-circuit-breaker/CircuitBreaker.png
tags: [Spring,Spring Boot]
category: Cloud, Spring, Microservices
comments: true
---

# Table of contents
{:.no_toc}

- TOC
{:toc}

----

# Introduction
When you detect that one microservice in your application is slow, this is when the Spring Cloud Circuit Breaker can be used in your application.
Its basic function is to interrupt current flow after a fault is detected. A circuit breaker can be reset (manually or automatically)  to resume normal operation.
This can be used in your microservice application when you want a service request is slow, you want it to fail fast and have some fallback functionality and have automatic recovery.
 
By making usage of the Circuit Breaker pattern you can let a microservice continue operating when a related service fails, preventing the failure from cascading and giving the failing service time to recover 

# Types of implementation
The Spring Cloud Circuit Breaker project provides an abstraction API for adding circuit breakers to your application. 
There are four supported implementations: 

Hystrix Netflix 

Resilience4J 

Sentinel 

Spring Retry 

# Configuring Circuit Breakers with Resilience4j
<div style="text-align: left;">
  <img alt="Resilience4j" src="/img/2020-11-05-spring-cloud-circuit-breaker/resilience4j.png" width="100" height="100" class="-1u(medium)">
</div>


We set up a Spring Boot application that returns a list of ingredients for making soup.
 
```
package hello;

import reactor.core.publisher.Mono;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@SpringBootApplication
public class CircuitBreakerSoupApplication {

  @RequestMapping(value = "/recommended")
  public Mono<String> ingredientsList(){
    return Mono.just("Onions, Potatoes, Celery, Carrots");
  }

  public static void main(String[] args) {
    SpringApplication.run(CircuitBreakerSoupApplication.class, args);
  }
}
```
 
We’re going to run this application locally alongside a client service application, so in src/main/resources/application.properties, 
set server.port so that the CircuitBreakerSoup application service won’t conflict with the client when we get that running.

ingredients/src/main/resources/application.properties

```
server.port=8090
```

We now configure a Ingredients service application will be our front-end to the CircuitBreakerSoup application. 
We’ll be able to view our list there at /basics, 
and that reading list will be retrieved from the CircuitBreakerIngredients application.

```
package hello;

import reactor.core.publisher.Mono;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.reactive.function.client.WebClient;

@RestController
@SpringBootApplication
public class IngredientsApplication {

  @RequestMapping("/basics")
    public Mono<String> toCook() {
      return WebClient.builder().build()
      .get().uri("http://localhost:8090/recommended").retrieve()
      .bodyToMono(String.class);
  }

  public static void main(String[] args) {
    SpringApplication.run(ReadingApplication.class, args);
  }
}
```

We also add the server.port property to src/main/resources/application.properties:
```
server.port=8080
```
We now can access, in a browser, the /basics endpoint on our Ingredients application, and see our ingredients list. 
Yet since we rely on the CircuitBreakerSoup application, if anything happens to it, 
or if Ingredients is simply unable to access CircuitBreakerSoup, we’ll have no list and our users will get a nasty HTTP 500 error message.
We want to prevent getting this error. This can be done by using the Circuit breaker.

Spring Cloud’s Circuit Breaker library provides an implementation of the Circuit Breaker pattern: when we wrap a method call in a circuit breaker, 
Spring Cloud Circuit Breaker watches for failing calls to that method, and if failures build up to a threshold,
Spring Cloud Circuit Breaker opens the circuit so that subsequent calls automatically fail.
While the circuit is open, Spring Cloud Circuit Breaker redirects calls to the method, and they’re passed on to our specified fallback method.

You need to add the Spring Cloud Circuit Breaker Resilience 4j dependency to your application. When using maven: 

```
<dependencies> 
    <dependency> 
        <groupId>org.springframework.cloud</groupId> 
        <artifactId>spring-cloud-starter-circuitbreaker-resilience4j</artifactId> 
        <version>0.0.1.BUILD-SNAPSHOT</version> 
    </dependency> 
</dependencies> 
```

Spring Cloud Circuit Breaker provides an interface called ReactiveCircuitBreakerFactory which we can use to create new circuit breakers for our application. 
An implementation of this interface will be auto-configured based on the starter that is on your application’s classpath. 
We will do this by creating a new service that uses this interface to make API calls to the CircuitBreakerSoup application.

```
package hello;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Mono;

import org.springframework.cloud.client.circuitbreaker.ReactiveCircuitBreaker;
import org.springframework.cloud.client.circuitbreaker.ReactiveCircuitBreakerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class IngredientsService {

  private static final Logger LOG = LoggerFactory.getLogger(IngredientsService.class);


  private final WebClient webClient;
  private final ReactiveCircuitBreaker readingListCircuitBreaker;

  public BookService(ReactiveCircuitBreakerFactory circuitBreakerFactory) {
    this.webClient = WebClient.builder().baseUrl("http://localhost:8090").build();
    this.readingListCircuitBreaker = circuitBreakerFactory.create("recommended");
  }

  public Mono<String> ingredientsList() {
    return readingListCircuitBreaker.run(webClient.get().uri("/recommended").retrieve().bodyToMono(String.class), throwable -> {
      LOG.warn("Error making request to ingredients service", throwable);
      return Mono.just("Onions");
    });
  }
}
```

The ReactiveCircuitBreakerFactory has a single method called create we can use to create new circuit breakers. 
Once we have our circuit breaker all we have to do is call run. Run takes a Mono or Flux and an optional Function. 
The optional Function parameter acts as our fallback if anything goes wrong. 
In our sample here the fallback will just return a Mono containing the Onions.

With our new service in place, we can update the code in IngredientsApplication to use this new service.

```
package hello;

import reactor.core.publisher.Mono;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.reactive.function.client.WebClient;

@RestController
@SpringBootApplication
public class IngredientsApplication {

  @Autowired
  private IngredientsService ingredientsService;

  @RequestMapping("/basics")
  public Mono<String> toCook() {
    return ingredientsService.ingredientsList();
  }

  public static void main(String[] args) {
    SpringApplication.run(ReadingApplication.class, args);
  }
}
```

When we run both the Ingredients service and the Soup application, and then open a browser to the Ingredients service, at localhost:8080/basics. 
You should see the complete recommended ingredients list:

Onions, Potatoes, Celery, Carrots

Now shut down the Soup application. Our list source is gone, but thanks to Resilience4J 
we have a reliable list to stand in,you should see:

Onions

## Configuring Circuit Breakers with Netflix Hystrix
<div style="text-align: center;">
  <img alt="Hystrix" src="/img/2020-11-05-spring-cloud-circuit-breaker/hystrix.png" width="auto" height="auto" class="image fit">
</div>

You need to add the Spring Cloud Circuit Breaker netflix hystrix dependency to your application. When using maven: 

```
    <dependency>
			<groupId>org.springframework.cloud</groupId>
			<artifactId>spring-cloud-starter-netflix-hystrix</artifactId>
	</dependency>
```


You have a SpringBootApplication that returns a list of ingredients for making soup.

```
@RestController
@SpringBootApplication
public class CircuitBreakerSoupApplication {

  @RequestMapping(value = "/basics")
  public String ingredientsList(){
	return "Onions, Potatoes, Celery, Carrots";
  }

  public static void main(String[] args) {
	SpringApplication.run(CircuitBreakerSoupApplication.class, args);
  }
}
```
This is the IngredientsService that calls the CircuitBreakerSoup application for knowing which ingredients 
are necessary for making soup.
When the CircuitBreakerSoup application is running you will see "Onions, Potatoes, Celery, Carrots".
If we stop the CircuitBreakerSoup application we don't want to wait or see an error.
No you will get the output "Onions" because we annotated the ingredientsList method 
with @HystrixCommand(fallbackMethod = "reliable") when calling the CircuitBreakerSoup application.

```
@Service
public class IngredientService {

  private final RestTemplate restTemplate;

  public IngredientService(RestTemplate rest) {
	this.restTemplate = rest;
  }

  @HystrixCommand(fallbackMethod = "reliable")
  public String ingredientsList() {
	URI uri = URI.create("http://localhost:8090/basics");

	return this.restTemplate.getForObject(uri, String.class);
  }

  public String reliable() {
	return "Onions";
  }
```

## Differences Resilience4j with Netflix Hystrix
Although Resilience4j is inspired by Netflix Hystrix it is more lightweight and you don’t have to go all-in.
Quoting the official page “Resilience4j is a lightweight fault tolerance library inspired by Netflix Hystrix, but designed for functional programming.”

<div style="text-align: center;">
  <img alt="Hystrix" src="/img/2020-11-05-spring-cloud-circuit-breaker/differences.png" width="auto" height="auto" class="image fit">
</div>