---
layout: post
authors: [lina_romanelli]
title: 'Spring Cloud Circuit Breaker'
image: /img/2020-10-02-spring-cloud-circuit-breaker/CircuitBreaker.png
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

 

Spring Cloud Circuit Breaker auto-configures an implementation of CircuitBreakerFactory, based on the starter on your application’s classpath. You can then inject this interface into any class you want. The following example shows how to do so 

 
```
@Service 
public static class DemoControllerService { 
    private RestTemplate rest; 

    private CircuitBreakerFactory cbFactory;   

    public DemoControllerService(RestTemplate rest, CircuitBreakerFactory cbFactory) { 
        this.rest = rest; 
        this.cbFactory = cbFactory; 
    }   

    public String slow() { 
        return cbFactory.create("slow").run(() -> rest.getForObject("/slow", String.class), throwable -> "fallback"); 
    } 

} 
```
 

If you want to wrap some reactive code in a circuit breaker ,you need to use ReactiveCircuitBreakerFactory. The following example shows how to do so: 

```
@Service 
public static class DemoControllerService { 

    private ReactiveCircuitBreakerFactory cbFactory; 
    private WebClient webClient;   

    public DemoControllerService(WebClient webClient, ReactiveCircuitBreakerFactory cbFactory) { 
        this.webClient = webClient; 
        this.cbFactory = cbFactory; 
    }  

    public Mono<String> slow() { 
        return webClient.get().uri("/slow").retrieve().bodyToMono(String.class).transform(it -> { 
            CircuitBreaker cb = cbFactory.create("slow"); 
            return cb.run(it, throwable ->  Mono.just("fallback")); 
                }); 
    } 
} 
```

## Configuring Circuit Breakers
In most cases, you are going to want to configure the behavior of your circuit breakers. 
To do so, you can create beans of type Customizer. Spring Cloud Circuit Breaker lets you provide a default configuration for all circuit breakers as well as configuration for specific circuit breakers. For example, to provide a default configuration for all circuit breakers when using Resilience4J you could add the following bean to a configuration class: 
```
@Bean 
public Customizer<Resilience4JCircuitBreakerFactory> defaultCustomizer() { 
    return factory -> factory.configureDefault(
            id -> new Resilience4JConfigBuilder(id)
            .timeLimiterConfig(TimeLimiterConfig.custom() 
                .timeoutDuration(Duration.ofSeconds(4)).build()) 
            .circuitBreakerConfig(CircuitBreakerConfig.ofDefaults())
            .build()); 
} 
```

The code to configure an individual circuit breaker would look very similar, except you would provide a circuit breaker ID in your Customizer, as follows: 

```
@Bean 
public Customizer<Resilience4JCircuitBreakerFactory> slowCustomizer() { 
    return factory -> factory.configure(builder -> {
        return builder.timeLimiterConfig(TimeLimiterConfig.custom()
                            .timeoutDuration(Duration.ofSeconds(2)).build()) 
                            .circuitBreakerConfig(
                            CircuitBreakerConfig.ofDefaults()); 
    }, "slow"); 
} 
```

## Configuring Circuit Breakers with Netflix Hystrix
<div style="text-align: center;">
  <img alt="Hystrix" src="/img/2020-10-02-spring-cloud-circuit-breaker/hystrix.png" width="auto" height="auto" class="image fit">
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
public class CircuitBreakerIngredientsApplication {

  @RequestMapping(value = "/recommended")
  public String ingredientsList(){
	return "Onions, Potatoes, Celery, Carrots";
  }

  public static void main(String[] args) {
	SpringApplication.run(CircuitBreakerIngredientsApplication.class, args);
  }
}
```
This is the IngredientsService that calls the CircuitBreakerIngredientsApplication for knowing which ingredients 
are necessary for making soup.
When the CircuitBreakerIngredientsApplication is running you will see "Onions, Potatoes, Celery, Carrots".
If we stop the CircuitBreakerIngredientsApplication we don't want to wait or see an error.
No you will get the output "Onions" because we annotated the ingredientsList method 
with @HystrixCommand(fallbackMethod = "reliable") when calling the CircuitBreakerIngredientsApplication.

```
@Service
public class IngredientService {

  private final RestTemplate restTemplate;

  public IngredientService(RestTemplate rest) {
	this.restTemplate = rest;
  }

  @HystrixCommand(fallbackMethod = "reliable")
  public String ingredientsList() {
	URI uri = URI.create("http://localhost:8090/recommended");

	return this.restTemplate.getForObject(uri, String.class);
  }

  public String reliable() {
	return "Onions";
  }
```
