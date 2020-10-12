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
Hystrix  is an example of a library that implements this pattern 

Resilience4J 

Sentinel 

Spring Retry 

# How can we use it 
You need to add the Spring Cloud Circuit Breaker dependency to your application. When using maven: 

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



