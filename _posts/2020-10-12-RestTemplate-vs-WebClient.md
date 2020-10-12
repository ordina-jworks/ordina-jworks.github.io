---
layout: post
authors: [lowie_cuypers]
title: 'Switching from RestTemplate to WebClient: A Reactive Tale'
image: /img/2020-09-11-resttemplate-vs-webclient/banner.jpg
tags: [Spring,RestTemplate,WebClient,Reactive]
category: Rest
comments: true
---

## Table of Contents

* [Introduction](#introduction)
* [Comparison of RestTemplate and WebClient](#comparison-of-resttemplate-and-webclient)
  * [RestTemplate](#resttemplate)
  * [WebClient](#webclient)
  * [Comparison Conclusion](#comparison-conclusion)
    * [RestTemplate Summary](#resttemplate-summary)
    * [WebClient Summary](#webclient-summary)
* [Reactive Approach with WebClient](#reactive-approach-with-webclient)
  * [Introduction to Reactive Streams](#introduction-to-reactive-streams)
  * [Legacy Services in your Reactive Environment](#legacy-services-in-your-reactive-environment)
  * [Reactive Database Connections](#reactive-database-connections)
  * [R2DBC: 2 steps forward 1 step back](#r2dbc-2-steps-forward-1-step-back)
* [End-to-end Reactive example](#end-to-end-reactive-example)
  * [Recipe Service (Reactive R2DBC)](#recipe-service-reactive-r2dbc)
  * [Ingredient Service (Reactive R2DBC)](#ingredient-service-reactive-r2dbc)
  * [BestMenuEverGenerator Service (Reactive Rest)](#bestmenuevergenerator-service-reactive-rest)
  * [Angular Webapp Consumer](#angular-webapp-consumer)
* [Conclusion](#conclusion)


## Introduction

Since the REST era, most developers have become used to working with Spring’s traditional `RestTemplate` from the package `spring-boot-starter-web` for consuming Rest services. 
Spring also has a `WebClient` in its reactive package called `spring-boot-starter-webflux`. This post will help you decide whether you should make the switch from `RestTemplate` to `WebClient`. 
Since `WebClient` is supposed to be the successor of `RestTemplate`, we will be looking into it a bit deeper.


## Comparison of RestTemplate and `WebClient`

First off, let us assume we have a Recipe Rest service which we will consume in the following examples.

### RestTemplate

`RestTemplate` provides a synchronous way of consuming Rest services, which means it will block the thread until it receives a response. 
`RestTemplate` is deprecated since Spring 5 which means it's not really that future proof. 

First, we create a Spring Boot project with the `spring-boot-starter-web` dependency. 

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

We can now inject the default `RestTemplateBuilder` bean (provided by Spring) in our service and build our `RestTemplate` with a base URL, 
or we could create a configured `RestTemplate` bean in a `@Configuration` file. 
With this builder we can also configure things like: maximum data size, message converters for SOAP, etc.

```java
@Service
public class RecipeRestTemplate {

    private final RestTemplate restTemplate;

    @Autowired
    public RecipeRestTemplate(RestTemplateBuilder builder) {
        this.restTemplate = builder
                .rootUri("http://localhost:8080")
                .build();
    }
}
```

Now, let's move on to some example basic methods we can use on the `RestTemplate` class to communicate with our Recipe Rest service. 
We apply CRUD operations, specify our return object's class, some parameters, body, header, etc. 

```java
public List<Recipe> getRecipes() {
    return restTemplate.exchange("/recipe", HttpMethod.GET, null, new ParameterizedTypeReference<List<Recipe>>() {})
            .getBody();
}

public Recipe getRecipeById(int id) {
    return restTemplate.getForObject("/recipe", Recipe.class, id);
}

public Recipe createRecipe(Recipe recipe) {
    return restTemplate.postForObject("/recipe", recipe, Recipe.class);
}

public void deleteRecipe(int id) {
    restTemplate.delete("/recipe", id);
}

public Recipe getRecipeByTitle(String title) {
    Map<String, String> requestParameters = new HashMap<>();
    requestParameters.put("title", title);
    return restTemplate.getForObject("/recipe", Recipe.class, requestParameters);
}
```


### WebClient

`WebClient` exists since Spring 5 and provides an asynchronous way of consuming Rest services, which means it operates in a non-blocking way. 
`WebClient` is in the reactive WebFlux library and thus it uses the reactive streams approach. 
However, to really benefit from this, the entire throughput should be reactive end-to-end. 
Let me first show you an example before diving into more details. 

So, we create a Spring Boot project with the `spring-boot-starter-webflux` dependency.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
```

We can inject a builder similarly, configure it if necessary and build our `WebClient`.

```java
@Service
public class RecipeWebService {

    private final WebClient webClient;

    @Autowired
    public RecipeWebService(WebClient.Builder builder) {
        this.webClient = builder
                .baseUrl("http://localhost:8080")
                .build();
    }
}
```

Here is an example similar to our `RestTemplate` example. 
Note that this wraps our objects in `Mono` (a stream of 0 or 1 object) and `Flux` (a stream of 0 or multiple objects) wrappers. 
These are reactive types, and we should keep them in these wrappers if we want to keep the reactive stream open and non-blocking. 
Let’s assume for this example that our Recipe Rest service which we are consuming is reactive. 

```java
public Flux<Recipe> getRecipes() {
    return webClient.get().uri("/recipe")
            .retrieve()
            .bodyToFlux(Recipe.class);
}

public Mono<Recipe> getRecipeById(int id) {
    return webClient.get().uri("/recipe/{id}", id)
            .retrieve()
            .bodyToMono(Recipe.class);
}

public Mono<Recipe> createRecipe(Mono<Recipe> recipe) {
    return webClient.post().uri("/recipe")
            .body(recipe, Recipe.class)
            .retrieve()
            .bodyToMono(Recipe.class);
}

public Mono<Void> deleteRecipe(int id) {
    return webClient.delete().uri("/recipe/{id}", id)
            .retrieve()
            .bodyToMono(Void.class);
}

public Mono<Recipe> getRecipeByTitle(String title) {
    Map<String, String> requestParameters = new HashMap<>();
    requestParameters.put("title", title);
    return webClient.get().uri("/recipe", requestParameters)
            .retrieve()
            .bodyToMono(Recipe.class);
}
```

Another benefit of working with `Flux` and `Mono` is that you can do mappings, filtering, transformations on your data as it is passing through the stream.

```java
public Flux<String> getRecipes() {
    Flux<Recipe> recipeStream = webClient.get().uri("/recipe")
            .retrieve()
            .bodyToFlux(Recipe.class);

    Flux<String> recipeTitleStream = recipeStream
            .log()
            .filter(recipe -> !recipe.getTitle().isBlank())
            .flatMap(recipe -> Mono.just(recipe.getTitle().toUpperCase()));

    return recipeTitleStream;
}
```

Let’s say our services, databases, etc **are not reactive**, but we want to use `WebClient` anyway. 
Then `Flux` and `Mono` are not much use to us, so we will have to unwrap them. 
Since our Recipe Rest service doesn’t provide reactive streams, we receive a `List` of recipes in one response, which `WebClient` wraps in `Mono`. 
We can use `block()` to block the stream and get the data out of it. Note that this shouldn’t be used in a reactive environment.

```java
public List<Recipe> getRecipes() {
    Mono<List<Recipe>> recipeListStream = webClient.get().uri("/recipe")
            .retrieve()
            .bodyToMono(new ParameterizedTypeReference<List<Recipe>>() {});
    List<Recipe> recipeList = recipeListStream.block();
    return recipeList;
}
```

Now let’s say, the Recipe service **IS reactive** and returns a stream of Recipe objects (`Flux`) instead of a `List`, but we still want to block the reactive stream. 
Because we can only call `blockFirst()` or `blockLast()` on `Flux`, we should collect the data from the `Flux` stream into `List`. 
Now this `List` is wrapped inside a `Mono` stream. We can then block the stream to unwrap the data.

```java
public List<Recipe> getRecipes() {
    Flux<Recipe> recipeStream = webClient.get().uri("/recipe")
            .retrieve()
            .bodyToFlux(Recipe.class);
    Mono<List<Recipe>> collectedRecipesStream = recipeStream.collectList();
    List<Recipe> recipeList = collectedRecipesStream.block();
    return recipeList;
}
```


### Comparison Conclusion

We have learned that `RestTemplate` is in maintenance mode and probably will not be supported in future versions. 
Even on the official Spring documentation, they advise to use `WebClient` instead. `WebClient` can basically do what `RestTemplate` does, making synchronous blocking calls. 
But it also has asynchronous capabilities, which makes it interesting. It has a functional way of programming, which makes it easy to read as well. 
If you are working in legacy Spring (< 5.0) applications, you will have to upgrade to Spring 5.0 to be able to use `WebClient`.

Let’s list both clients' properties to have a better overview.

##### RestTemplate Summary
* In maintenance mode since Spring 5.0
* Synchronous (blocking)
* In spring-boot-starter-web library
* Built on Servlet stack

##### WebClient Summary
* Synchronous & asynchronous (non-blocking) capabilities
* Reactive streaming
* Mono and Flux: both implement CorePublisher which extends Publisher
* From Spring 5.0
* Functional programming
* In spring-boot-starter-webflux library
* Built on Reactive stack

Next, we will look more into the `WebClient`'s reactive streaming capabilities. 


## Reactive Approach with WebClient

### Introduction to Reactive Streams

Reactive streaming works a bit different under the hood than traditional request-response communication. 
Data only passes through these streams when we block or subscribe them. Calling one of these methods we saw earlier, only creates a connection to the stream. 
Data only starts passing through the entire stream when there is a 'subscription' or 'block'.  
**Note that you should never block a reactive stream if you want your services to be reactive end-to-end.**
 
In the next sections, we will see how we can consume it.


### Legacy Services in your Reactive Environment

To use `WebClient` to its full potential, you should create end-to-end reactive streams. 
This might be a problem when working with legacy services. 
If you are creating fully new services, back-to-front, and only a small portion of the services you consume are legacy. 
Then you can still create your new services reactive and wrap the responses of your legacy services in `Flux` and `Mono` wrappers as close to the source as possible. 

```java
public Flux<Recipe> getRecipes() {
    List<Recipe> recipeList = webClient.get().uri("/recipe")
            .retrieve()
            .bodyToMono(new ParameterizedTypeReference<List<Recipe>>() {
            })
            .block();
    Flux<Recipe> recipeStream = Flux.fromIterable(recipeList);
    return recipeStream;
}
```

This way, you can still partly have a reactive setup and maybe when these services will be upgraded or replaced in the future, they might become reactive as well, and you can easily implement the necessary changes on your side as well.

### Reactive Database Connections

There have been supporting libraries for reactive NoSQL connectivity for a while, which can retrieve data from the database in a reactive manner. 
Which means they start returning data as the database is querying, and not when the entire database has been queried. So you are good to go. 
But, with Relational databases (which you are probably using as well), there weren’t any in Spring until recently. 
Before, you could wrap your database response in `Flux` and `Mono` wrappers as soon as possible when calling your database, but if these databases are the major sources of your data and not just a small portion, it kind of ruins the appeal and benefit. 

### R2DBC: 2 steps forward 1 step back

Not until very recently (December 2019), `spring-data-r2dbc` dependency got released. It basically is JDBC's reactive counterpart. 
R2DBC stands for **Reactive Relational DataBase Connectivity**. This does not offer a lot of features of ORM (Object-Relational Mapping) frameworks at the moment of writing. 
For now, it is not yet capable of mapping relations (eg: `@OneToMany`, `@ManyToOne`, ...), lazy loading, etc. 
You would have to manage this yourself. However, with this connector, we can query data as streams.

## End-to-end Reactive example

We've learned about `WebClient`, reactive streams and R2DBC. Let's use these in an example to really see how it works. 
We are going to create a 2 microservices with a R2DBC connecting to MySQL databases and a Rest API. 
Then we'll create another microservice which consumes both of these Rest API's. 
Finally, an Angular frontend that consumes that microservice to display the data.

### Recipe Service (Reactive R2DBC)

Let’s dive into our Recipe Rest service and see how we can create a reactive rest service. 
We add the following dependencies.

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-webflux</artifactId>
    </dependency>
    
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-r2dbc</artifactId>
    </dependency>
    <dependency>
        <groupId>dev.miku</groupId>
        <artifactId>r2dbc-mysql</artifactId>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

We configure the database connection and enable R2DBC. The `ConnectionFactory` comes from the package `io.r2dbc.spi`. 
Since we are connecting to a MySQL database, we enter `mysql` as the Driver. This will create the following connection url `r2dbc:mysql://root:password@127.0.0.1/recipe`.

```java
import io.r2dbc.spi.ConnectionFactories;
import io.r2dbc.spi.ConnectionFactory;
import io.r2dbc.spi.ConnectionFactoryOptions;
// Other imports are omitted

@Configuration
@EnableR2dbcRepositories
public class ReactiveDatabaseConfig extends AbstractR2dbcConfiguration {
    @Bean
    @Override
    public ConnectionFactory connectionFactory() {
        return ConnectionFactories.get(ConnectionFactoryOptions
                .builder()
                .option(DRIVER, "mysql")
                .option(HOST, "127.0.0.1")
                .option(USER, "root")
                .option(PASSWORD, SUPER_SAFE_PASSWORD)
                .option(DATABASE, "recipe")
                .build());
    }
}
```

For simplicity of the example, a Recipe contains only an `id`, `title` and `description`.

```java
public class Recipe {
    @Id
    private Integer id;
    private String title;
    private String description;
/* Constructors, Getters and Setters not displayed for simplicity */
}
```

We create a Repository which extends a `ReactiveCrudRepository` with a query that retrieves all recipes in a random order.

```java
public interface RecipeRepository extends ReactiveCrudRepository<Recipe, Integer> {
    @Query("SELECT * FROM recipe ORDER BY RAND()")
    Flux<Recipe> findAllRandomized();
}
```

We add a `RestController` with a method that provides a `text/event-stream` of all the recipes. 
I have added a **delay of 1 second** between each element to give you a better visualization later.

```java
@RestController
@RequestMapping("/recipe")
public class RecipeController {

    private final RecipeRepository recipeRepository;

    @Autowired
    public RecipeController(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    @GetMapping(produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Recipe> getAllRecipesRandomized() {
        return recipeRepository.findAllRandomized().delayElements(Duration.ofSeconds(1));
    }
}
```

When we `cURL -N` our Recipe service, it displays a random recipe every second (because of the added delay).

<img alt="curl recipe service" src="{{ '/img/2020-09-11-resttemplate-vs-webclient/curl-recipe-service.gif' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 1000px;">


### Ingredient Service (Reactive R2DBC)

We create another microservice Ingredient Service, which is similar to our Recipe Service, but queries an ingredient database that provides us a stream of Ingredients in a random order.

```java
public class Ingredient {
    @Id
    private Integer id;
    private String name;
/* Constructors, Getters and Setters not displayed for simplicity */
}
```

As you can see, the Ingredient controller works almost the same, but without a delay.

```java
@RestController
@RequestMapping("/ingredient")
public class IngredientController {

    private final IngredientRepository ingredientRepository;

    @Autowired
    public IngredientController(IngredientRepository ingredientRepository) {
        this.ingredientRepository = ingredientRepository;
    }

    @GetMapping(produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Ingredient> getAllIngredientsRandomized() {
        return ingredientRepository.findAllRandomized();
    }
}
```


### BestMenuEverGenerator Service (Reactive Rest)

Our BestMenuEverGenerator service is going to put together our menu for a given amount of days. 
What makes our BestMenuEverGenerator the best, is because it adds a random special ingredient to every recipe. 

```java
public class Menu {
    private Recipe recipe;
    private Ingredient specialIngredient;
/* Constructors, Getters and Setters not displayed for simplicity */
}
```

We have a `RestController` that consumes both our services, Recipe and Ingredient. 
Even though it calls **all** Recipes, it is **not** going to retrieve and load all recipes in memory, as would be the case in a non-reactive environment. 
However, it limits the number of objects it receives, before completing the stream. 
The ´zipWith()´ method waits for one element of both streams and combines these elements in a `BiFunction` and returns its results in in new stream. 
It continues to zip until one of the streams completes. In this case, the results of the `BiFunction` are `Menu` objects. 
There are plenty of other interesting methods to use for combining or transforming streams.

```java
@RestController
@RequestMapping("/menu")
public class MenuReactiveController {

    private final RecipeWebService recipeWebService;
    private final IngredientWebService ingredientWebService;

    @Autowired
    public MenuReactiveController(RecipeWebService recipeWebService, IngredientWebService ingredientWebService) {
        this.recipeWebService = recipeWebService;
        this.ingredientWebService = ingredientWebService;
    }

    @GetMapping(produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Menu> getMenusForGivenDays(@RequestParam("amountOfDays") int amountOfDays) {
        Flux<Ingredient> ingredients = ingredientWebService.getAllIngredientsRandomized();
        Flux<Recipe> recipes = recipeWebService.getAllRecipesRandomized().take(amountOfDays);

        return recipes.zipWith(ingredients, (recipe, ingredient) -> new Menu(recipe, ingredient));
    }
}
```

### Angular Webapp Consumer

I built a simple Angular web application, which consumes our BestMenuEverGenerator service. 

<img alt="recipe web application" src="{{ '/img/2020-09-11-resttemplate-vs-webclient/recipe-webapp.png' | prepend: site.baseurl }}" class="image fit" style="max-width: 400px;">


 Instead of using a `HttpClient`, I use an `EventSource` to call our service. 
 Every time an event is received, it is parsed and pushed onto the `Observable`. 
 
 ```typescript
getMenusForGivenAmountOfDays(amountOfDays: number): Observable<Menu> {
    return new Observable<Menu>(menuSubscriber => {
      const eventSource = new EventSource('http://localhost:8081/menu?amountOfDays=' + amountOfDays);
      eventSource.addEventListener('message', (event: any) => {
        menuSubscriber.next(event.data !== null ? JSON.parse(event.data) : event.data);
      });
      eventSource.onerror = () => {
        eventSource.close();
        menuSubscriber.complete();
      };
    });
}
```
 
 We enter the amount of days we want to retrieve a menu for and when we push the button, the following method is triggered. 
 It subscribes the `Observable` we created in the previous example from the `EventSource`. 
 We push each element in an array which is displayed on our webpage.
 
 ```typescript
export class RecipesComponent implements OnInit {
  menuArray: Menu[] = [];
  amountOfDays: number;

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {}

  generateMenu() {
    if (this.amountOfDays > 0) {
      this.menuArray = [];
      this.recipeService.getMenusForGivenAmountOfDays(this.amountOfDays)
        .subscribe({
          next: menu => this.menuArray.push(menu),
          complete: () => console.log('complete')
        });
    }
  }
}
```
 
 The delay of 1 second we added in the Recipe service earlier offers us a good visualization of the data passing through the stream. 
 We immediately receive each Recipe with its special Ingredient and see it in the webpage when it arrives, even if the rest of the data has not even been processed in the controller.

<img alt="recipes streaming" src="{{ '/img/2020-09-11-resttemplate-vs-webclient/recipes-streaming.gif' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 1000px;">


## Conclusion

Hopefully, this gives you a basic understanding of `RestTemplate` and `WebClient` and its capabilities. 
To summarize, we have learned that `RestTemplate` is in maintenance mode and Spring advises us to use `WebClient` instead. 
`WebClient` offers the same synchronous way of working as `RestTemplate` does, but using functional programming. 
Besides that, it also offers asynchronous reactive streams, which works in a non-blocking way. 

We have looked into R2DBC, which supports reactive connections with relational databases. 
Bear in mind that this does not offer a lot of features of ORM frameworks at the moment.
