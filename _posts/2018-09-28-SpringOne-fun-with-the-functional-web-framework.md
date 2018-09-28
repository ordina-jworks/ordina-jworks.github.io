---
layout: post
authors: [pieter_van_hees]
title: 'SpringOne Platform - Fun With The Functional Web Framework'
image: /img/2018-09-27-SpringOne-Platform/post-image.jpg
tags: [Spring One, Pivotal, Functional Programming, Functional Web Framework, Spring, WebFlux.fn, Web MVC]
category: Spring
comments: true
---

# Fun with the Functional Web Framework

### by [Arjen Poutsma](https://twitter.com/poutsma){:target="_blank"}

This talk is a follow up of a talk that Arjen Poutsma has been giving a few years now, called 'New in Spring 5: Functional Web Framework'. 
In the talk he goes more in depth in some of the features that are offered by the framework.

# What is it?

The Spring functional web framework (called WebFlux.fn) is an alternative to the annotational style web framework, Web MVC.
It was introduced in Spring 5.0 and for spring 5.1 they did some refinements in the api after feedback from developers.

# Design goals

The WebFlux.fn framework had three main goals.

The first one was to create a web framework with a functional style.
By this they mean that they wanted to leverage the new functional concepts introduced in Java 8, like Function and Stream.

The second goal was to make the framework fully reactive by using the functionality from Reactor.

The third goal was to act more like a library and less like a framework.
The reason for this is that many people don't like the "automagic" things the Web MVC (annotational style) framework does.
Web MVC does a lot of things behind the scenes that you as a client of the framework don't know about, unless you read up on how the framework works internally.
So acting more like a library instead of a framework means that a lot of things will be more explicit, so you as a client of the library will see more clearly what is going to happen. 

A fourth goal, that was more a side effect than intention, is that there is no more reflection in WebFlux.fn.
By not using annotations anymore to map HTTP requests to controller methods, there is no more reflection.
This has the great effect that your application will take less time to start up because Spring has to do less classpath scanning.
This is also useful for when you want to use GraalVM.

## How does it work
There are three main concepts in the WebFlux.fn framework:
* The HandlerFunction
* The RouterFunction
* The HandlerFilterFunction

We'll discuss these in the following sections.

### The HandlerFunction
Is a function that maps a ServerRequest to a Mono<ServerResponse>.

``` java
public Mono<ServerResponse> showPet(ServerRequest request) {
    String id = request.pathVariable("id");
    return this.petRepository.findById(id)
            .flatMap(pet -> ServerResponse.ok().contentType(APPLICATION_JSON).body(fromObject(
                    pet)))
            .switchIfEmpty(Mono.defer(() -> ServerResponse.notFound().build()));
}
```

You can see in this example that there are some differences with a Web MVC controller method.

A big difference is that we can only get a `ServerRequest` as a parameter. 
So if we want a path variable, body or anything else from the HTTP request, we have to get it from the `ServerRequest` variable.
Spring does not inject this information as method parameters in WebFlux.fn.

The second difference is that the object we return has to be a `Mono<ServerResponse>`.
In Web MVC the return type could be a lot of different things like any type of Object, a ResponseEntity, etc.


### The RouterFunction
Is a function that takes a ServerRequest and returns a HandlerFunction using a RequestPredicate.

``` java 
@Bean
public RouterFunction<ServerResponse> routerFunction(PetHandler petHandler) {
    RouterFunction<ServerResponse> html = route()
            .GET("/pets/{id}", accept(TEXT_HTML), petHandler::renderPet)
            .GET("/pets", accept(TEXT_HTML), petHandler::renderPets)
            .build();

    RouterFunction<ServerResponse> json = route()
            .GET("/pets/{id}", accept(APPLICATION_JSON), petHandler::showPet)
            .GET("/pets", accept(APPLICATION_JSON), petHandler::showPets)
            .build();

    return html.and(json);
}
```

The order in which you define these router functions matters.
The first router function's  handler that matches your HTTP request will be the one that is executed.
This makes it a lot clearer when you read the router functions to know which one will be executed, it's the first one that you define and matches.

An advantage of the RouterFunction over the annotational style is that you can map multiple endpoints to the same HandlerFunction.
This is not possible in Web MVC becuase you can only put one @RequestMapping on a controller method.
In the WebFlux.fn framework however, you can refer to one HandlerFunction in as many RouterFunction matchers as you want.

#### Improvements in the RouterFunction spring framework 5.1:

1. A router DSL with less static imports:
    ``` java
    //5.0 version
    route(GET("/people"), personHandler::getPeople)
    //5.1 version
    route()
      .GET("/people"), personHandler::getPeople)
    ```
2. And a new pattern matcher to resolve which HandlerFunction to call, which is a lot faster than the previous one.

#### RequestPredicates
Is a function that maps a ServerRequest to a boolean.

This is used to match your HandlerFunction to a HTTP request.

Spring provides a lot of default predicates for paths, accept headers, etc.
But you can also create your own very easily, with lambdas, methods, or classes.

``` java
// lambda
route().GET("/people", serverRequest -> serverRequest.path().endsWith(".json"), personHandler::getPeople)


// method
route().GET("/people", this::pathEndsWithJson, personHandler::getPeople)
private boolean pathEndsWithJson(ServerRequest request) {
    return request.path().endsWith(".json");
}

// class
route().GET("/people", new PathEndsWithJsonPredicate(), personHandler::getPeople)
public class PathEndsWithJsonPredicate implements RequestPredicate {
    @Override
    public boolean test(final ServerRequest request) {
        return request.path().endsWith(".json");
    }
}
```

#### nested RouterFunction
which is similar to the class level @RequestMapping , but a lot more powerful.

``` java
@Bean
public RouterFunction<ServerResponse> petsRouter(PetJsonHandler petJsonHandler, PetHtmlHandler petHtmlHandler) {

    RouterFunction<ServerResponse> html = route()
            .nest(accept(TEXT_HTML), builder -> { builder
                .GET("/{id}", petHtmlHandler::renderPet)
                .GET("", petHtmlHandler::renderPets);
            }).build();

    RouterFunction<ServerResponse> json = route()
            .nest(accept(APPLICATION_JSON), builder -> { builder
                .GET("/{id}", accept(APPLICATION_JSON), petJsonHandler::showPet)
                .GET("", accept(APPLICATION_JSON), petJsonHandler::showPets);
            }).build();

    return route()
            .path("/pets", () -> html.and(json))
            .build();
}
```

You can choose on what you nest, depending on the needs of your software.

In WebFlux.fn you can couple HTTP requests for the same path, but different accept headers to different classes, as in the example above.
Here you only define your path once which means no duplication, and it's easier to change the path to for example `/animals`, because there is only one place where you have to change it.

In Web MVC it would look like this.
``` java
@RestController
@RequestMapping(value = "/pets", produces = MediaType.APPLICATION_JSON_VALUE)
public class PetJsonController {
...
}
@RestController
@RequestMapping(value = "/pets", produces = MediaType.TEXT_HTML_VALUE)
public class PetHtmlController {
...
}
```

### The HandlerFilterFunction
Is a function that takes a ServerRequest and a HandlerFunction and returns a ServerResponse.

``` java
@Bean
RouterFunction<ServerResponse> mainRouter(PetHandler petHandler, OwnerHandler ownerHandler) {

    RouterFunction<ServerResponse> petsRouter = petsRouter(petHandler);
    RouterFunction<ServerResponse> ownerRouter = ownerRouter(ownerHandler);

    return petsRouter.and(ownerRouter)
            .filter(this::performanceLogging);
}

public Mono<ServerResponse> performanceLogging(ServerRequest request, HandlerFunction<ServerResponse> next) {
    Instant start = Instant.now();
    Mono<ServerResponse> response = next.handle(request);
    Duration duration = Duration.between(start, Instant.now());
    LOGGER.info("Processing request {} took {} ms ", request, duration.toMillis());
    return response;
}
```

The HandlerFilterFunction is more flexible than Servlet filters because you can put a HandlerFilterFunction on a RouterFunction.
This means that you can apply this filter to a subset of your routes instead of on all routes.

It can be used for example for security, logging, timing, etc.

### Future evolutions

Currently the functional web framework does not work with Servlets but only with Spring's self made ServerRequest and ServerResponse.
They are however looking at creating a functional web framework that works with Servlets and without Reactor.

## Conclusion
The functional web framework is a lot better
* in what properties of the HTTP request you can match on to choose a controller function.
* in reducing duplication of your matching logic
* in providing a clean way to separate controller logic and routing logic
* in explicitness of routing so you can easily see how your http request will be bound to a controller method

It is a very good alternative to the more common annotational style web framework Web MVC. 
The advantages mentioned definitely make it worth trying it out for yourself!
