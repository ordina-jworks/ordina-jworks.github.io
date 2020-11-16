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

# Configuring Circuit Breakers with Resilience4j for non-reactive applications
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

Spring Cloud Circuit Breaker provides an interface called Resilience4JCircuitBreakerFactory which we can use to create new circuit breakers for our application. 
An implementation of this interface will be auto-configured based on the starter that is on your application’s classpath. 
We will do this by creating a new service that uses this interface to make API calls to the CircuitBreakerSoup application.

```
package hello;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Mono;

import org.springframework.cloud.client.circuitbreaker.ReactiveCircuitBreaker;
import org.springframework.cloud.client.circuitbreaker.Resilience4JCircuitBreakerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class IngredientsService {

  private static final Logger LOG = LoggerFactory.getLogger(IngredientsService.class);


  private final WebClient webClient;
  private final ReactiveCircuitBreaker readingListCircuitBreaker;

  public BookService(Resilience4JCircuitBreakerFactory circuitBreakerFactory) {
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

The Resilience4JCircuitBreakerFactory has a single method called create we can use to create new circuit breakers. 
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

# Configuring Circuit Breakers with Resilience4j for reactive applications

You need to add the Spring Cloud Circuit Breaker Reactor Resilience 4j dependency to your application. When using maven: 

```
<dependencies> 
    <dependency> 
        <groupId>org.springframework.cloud</groupId> 
        <artifactId>spring-cloud-starter-circuitbreaker-reactor-resilience4j</artifactId> 
        <version>0.0.1.BUILD-SNAPSHOT</version> 
    </dependency> 
</dependencies> 
```

We can now use the same application as in the previous example.

Spring Cloud Circuit Breaker provides an interface called ReactiveResilience4JCircuitBreakerFactory which we can use to create new circuit breakers for our application. 
An implementation of this interface will be auto-configured based on the starter that is on your application’s classpath. 
We will do this by creating a new service that uses this interface to make API calls to the CircuitBreakerSoup application.

```
package hello;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Mono;

import org.springframework.cloud.client.circuitbreaker.ReactiveCircuitBreaker;
import org.springframework.cloud.client.circuitbreaker.ReactiveResilience4JCircuitBreakerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class IngredientsService {

  private static final Logger LOG = LoggerFactory.getLogger(IngredientsService.class);


  private final WebClient webClient;
  private final ReactiveCircuitBreaker readingListCircuitBreaker;

  public BookService(ReactiveResilience4JCircuitBreakerFactory circuitBreakerFactory) {
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

The ReactiveResilience4JCircuitBreakerFactory has a single method called create we can use to create new circuit breakers. 
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

# Configuring Circuit Breakers with Spring Retry
Spring-retry depends on Aspectj which is not included in the skeleton project, so we will add below dependency in the pom.xml file.
```
<dependency>
    <groupId>org.springframework.retry</groupId>
    <artifactId>spring-retry</artifactId>
    <version>${version}</version>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-aspects</artifactId>
    <version>${version}</version>
</dependency>
```
Create one  Rest controller which will call the backend service class where we will simulate the exception and spring-retry module will automatically retry.
In the Rest Api we will add two optional request parameters.

simulateretry – parameter to simulate the exception scenario, so that spring can retry.
simulateretryfallback – as we are simulating the exception, after retry certain times we can either expect a successful backend call or all retry falls. 
In this case we will go to the fall back method to get hard-coded/error response. Now this parameter will ensure all the retry will fail and we will go to fall back path only
```
package com.example.springretry;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
 
@RestController
public class MyRestController {
 
    @Autowired
    BackendAdapter backendAdapter;
 
    @GetMapping("/retry")
    @ExceptionHandler({ Exception.class })
    public String validateSPringRetryCapability(@RequestParam(required = false) boolean simulateretry,
                                @RequestParam(required = false) boolean simulateretryfallback) 
    {
        System.out.println("===============================");
        System.out.println("Inside RestController method..");
 
        return backendAdapter.getBackendResponse(simulateretry, simulateretryfallback);
    }
}
```

To enable spring-retry we need to put one annotation in the Spring Boot Application class. So open SpringRetryApplication class and add @EnableRetry in class level.
```
package com.example.springretry;
 
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.retry.annotation.EnableRetry;
 
@EnableRetry
@SpringBootApplication
public class SpringRetryApplication {
 
    public static void main(String[] args) {
        SpringApplication.run(SpringRetryApplication.class, args);
    }
}
```
Now we will create one interface/implementation for calling the external service. 
Here we will not actually call any external service call, rather will simulate the success/failure scenarios by adding some random logic, as below.
```
package com.example.springretry;
 
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
 
public interface BackendAdapter {
 
    @Retryable(value = { RemoteServiceNotAvailableException.class }, maxAttempts = 3, backoff = @Backoff(delay = 1000))
    public String getBackendResponse(boolean simulateretry, boolean simulateretryfallback);
 
    @Recover
    public String getBackendResponseFallback(RuntimeException e);
 
}

```
@Retryable – This is the main annotation after @EnableRetry. 
This annotation tells that if we get RemoteServiceNotAvailableException from the method then retry maximum 3 times before sending the response. 
Also we are introducing delay of 1 second in each retry.
@Recover – in the fallback method indicates that if we don’t get any success response after 3 retry, response will come from this fallback method. 
Make sure you pass expected exception as parameter, else spring will have hard time finding the exact method.
```
package com.example.springretry;
 
import java.util.Random;
import org.springframework.stereotype.Service;
 
@Service
public class BackendAdapterImpl implements BackendAdapter {
 
    @Override
    public String getBackendResponse(boolean simulateretry, boolean simulateretryfallback) {
 
        if (simulateretry) {
            System.out.println("Simulateretry is true, so try to simulate exception scenario.");
 
            if (simulateretryfallback) {
                throw new RemoteServiceNotAvailableException(
                        "Don't worry!! Just Simulated for Spring-retry..Must fallback as all retry will get exception!!!");
            }
            int random = new Random().nextInt(4);
 
            System.out.println("Random Number : " + random);
            if (random % 2 == 0) {
                throw new RemoteServiceNotAvailableException("Don't worry!! Just Simulated for Spring-retry..");
            }
        }
 
        return "Hello from Remote Backend!!!";
    }
 
    @Override
    public String getBackendResponseFallback(RuntimeException e) {
        System.out.println("All retries completed, so Fallback method called!!!");
        return "All retries completed, so Fallback method called!!!";
    }
}
```

Testing the retry methods from Spring Retry
Start with 'http://localhost:8080/retry?simulateretry=true&simulateretryfallback=false' in your browser. Based on the parameter, we are expecting exception in the backend service call and at the same time as simulateretryfallback=false, we are depending on the random logic (random % 2 == 0 –> even random number) we can expect a success response while retry.
So once we hit the request in browser, we might get exception in backend and spring will retry the same method multiple times. The outcome could be the Success response from backend. Here are the few lines of log from one of my request where spring is trying retry.
```
Console logging
===============================
Inside RestController method..
Simulateretry is true, so try to simulate exception scenario.
Random Number : 1
 
===============================
Inside RestController mathod..
Simulateretry is true, so try to simulate exception scenario.
Random Number : 2
Simulateretry is true, so try to simulate exception scenario.
Random Number : 2
Simulateretry is true, so try to simulate exception scenario.
Random Number : 0
All retries completed, so Fallback method called!!!
```

Now try with 'http://localhost:8080/retry?simulateretry=true&simulateretryfallback=true', you will get fallback response after retry limit as from code everytime we are throwing RuntimeException. 
Here are my last few lines of code, it tried 3 times before sending the response.
```
Console logging
===============================
Inside RestController method..
Simulateretry is true, so try to simulate exception scenario.
Simulateretry is true, so try to simulate exception scenario.
Simulateretry is true, so try to simulate exception scenario.
All retries completed, so Fallback method called!!!
```

Spring Retry provides declarative retry support for Spring applications. A subset of the project includes the ability to implement circuit breaker functionality. 
Spring Retry provides a circuit breaker implementation via a combination of it’s CircuitBreakerRetryPolicy and a stateful retry. 
All circuit breakers created using Spring Retry will be created using the CircuitBreakerRetryPolicy and a DefaultRetryState. 
Both of these classes can be configured using SpringRetryConfigBuilder.
To provide a default configuration for all of your circuit breakers create a Customize bean that is passed a SpringRetryCircuitBreakerFactory. 
The configureDefault method can be used to provide a default configuration.


```
@Bean
public Customizer<SpringRetryCircuitBreakerFactory> defaultCustomizer() {
    return factory -> factory.configureDefault(id -> new SpringRetryConfigBuilder(id)
        .retryPolicy(new TimeoutRetryPolicy()).build());
}
```

Similarly to providing a default configuration, you can create a Customize bean this is passed a SpringRetryCircuitBreakerFactory.
```
@Bean
public Customizer<SpringRetryCircuitBreakerFactory> slowCustomizer() {
    return factory -> factory.configure(builder -> builder.retryPolicy(new SimpleRetryPolicy(1)).build(), "slow");
}
```
In addition to configuring the circuit breaker that is created you can also customize the circuit breaker after it has been created but before it is returned to the caller. 
To do this you can use the addRetryTemplateCustomizers method. This can be useful for adding event handlers to the RetryTemplate.
```
@Bean
public Customizer<SpringRetryCircuitBreakerFactory> slowCustomizer() {
    return factory -> factory.addRetryTemplateCustomizers(retryTemplate -> retryTemplate.registerListener(new RetryListener() {

        @Override
        public <T, E extends Throwable> boolean open(RetryContext context, RetryCallback<T, E> callback) {
            return false;
        }

        @Override
        public <T, E extends Throwable> void close(RetryContext context, RetryCallback<T, E> callback, Throwable throwable) {

        }

        @Override
        public <T, E extends Throwable> void onError(RetryContext context, RetryCallback<T, E> callback, Throwable throwable) {

        }
    }));
}
```

## Differences Resilience4j with Netflix Hystrix and Spring Retry
Although Resilience4j is inspired by Netflix Hystrix it is more lightweight and you don’t have to go all-in.
Quoting the official page “Resilience4j is a lightweight fault tolerance library inspired by Netflix Hystrix, but designed for functional programming.”

<div style="text-align: center;">
  <img alt="Hystrix" src="/img/2020-11-05-spring-cloud-circuit-breaker/differences.png" width="auto" height="auto" class="image fit">
</div>

Since 2019 when Spring announced that Hystrix Dashboard would be removed from Spring Cloud 3.1, one year after Netflix announces that they were putting this project into maintenance mode.

Resilience4J provides the following core components:
RateLimiter
TimeLimiter
CircuitBreaker
Retry
Bulkhead