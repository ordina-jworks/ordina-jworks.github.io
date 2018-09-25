---
layout: post
authors: [kevin_van_houtte]
title: 'Inter-service/inter-process communication with Feign: Tips & Tricks'
image: /img/intercommunication/intercomm_header.jpg
tags: [Microservices, Security, Spring, Cloud, Feign, OpenFeign]
category: Microservices
comments: true
---

In contrast to monolithic applications, services in a distributed system are running on multiple machines. 
To let these services interact with each other, we need some kind of inter-process communication mechanism.
With the help of Feign, I will explain how we can fire off synchronous calls to another service.


# Feign
To understand the basics of inter-process communication, we need to look at what kind of interactions we can do.
Feign, a declarative HTTP client by Netflix simplifies our way of interacting with other services. 
When we decide that it is time to decompose our modulith because of numerous reasons, we would have to look for a way to handle our inter-process communication.
Feign provides support for Spring, load balancing, resilience, security and lots more and I will tell you how they work and how to use them inside your Spring application. 

# Setup
To use Feign we need to add it to our classpath

{% highlight xml %}
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-openfeign</artifactId>
    </dependency>
{% endhighlight %}

When we inspect in to the dependency module, we see that there is a lot coming out-of-the-box with the Spring Cloud Starter.
If you are providing your own resilience or load balancing library you can just add the necessary dependencies you need.
Be aware that the syntax is different between using the Spring wrapper or OpenFeign itself.
To let your Spring context know that it has to search for Feign clients, we just add `@EnableFeignClients` on top of the main configuration class. 

# Feign Clients 
After we've enabled Feign on our classpath, we can start adding Feign clients. 
When defining our clients, we have two solutions you can choose from. 
The OpenFeign library, which provides us with the basic but very customizable Feign clients and the Spring library, that adds a few extra libraries to it for cloud tooling.

## Spring

{% highlight java %}
    @FeignClient(value = "auth", fallback = FallbackAuthClient.class, configuration = FeignConfig.class)
    public interface AuthClient { 
        @RequestMapping(method = RequestMethod.GET, value = "checkToken")
        boolean isTokenValid(@RequestHeader("Authorization") String token);
    }
{% endhighlight %}

Explanation properties:

* `@FeignClient`: is the annotation for Spring to recognize Feign clients, Feign clients have to be interfaces as it is self declarative.
* `value/name`: is the name of the application you are communicating with, Service Discovery ( when used ) uses this to bind them to the correct IP
* `fallback`: is the Hystrix circuit breaker that comes out-of-the-box. Just make a new class, implement the interface and provide a proper fallback. 

{% highlight java %}
    @Component
    public class FallbackAuthClient implements AuthClient {
        @Override
        public boolean isTokenValid(@RequestHeader("Authorization") String token) {
            return false;
        }
    }
{% endhighlight %}

* `configuration`: is for extra configuration like logging, interceptors, etc... more on that below
* `@RequestMapping`: inherits the Spring way of defining a request

## OpenFeign
For these clients we need an extra configuration class to tell Spring that this is the Feign client.

{% highlight java %}

public interface AuthClient {
    @RequestLine("GET /auth")
    @Headers({"Authorization: {token}", "Accept: application/hal+json"})
    boolean isValid(@Param("token") String token);

{% endhighlight %}
* `@RequestLine`: is defining which verb and which uri path you are communicating to. 
* `@Headers`: is defining the request headers that come with the request

# Building an advanced custom Feign client
When we need more advanced tooling inside our Feign client, there is the Feign configuration class where we can build and customize our Feign client. 
To begin, we just create a new class annotated with `@Configuration`.

{% highlight java %}
@Configuration
class SapClientFeignConfig { }
{% endhighlight %}

## The builder
Feign provides us with a builder like pattern to build up our client.
When we want to customize, we just add our own custom classes to the builder. 
First off, let's create a bean of our client and return a Feign builder.
It's important to let the builder know which client he has to target for communication. 
The second parameter is most likely the base url where all the requests begin. 
Get your urls from the yml or properties file with the help of `@Value`.

{% highlight java %}

   @Value("${base.url}")
   private String baseServerUrl;
    
   @Bean
   AuthClient authClient() {
        return Feign.builder()
                .target(AuthClient.class, baseServerUrl);
    }
{% endhighlight %}

### Interceptor
If you need some basic authorization, custom headers or some extra information in every request of the client, we can use interceptors. 
This becomes very useful in situations where every request needs this extra information.
To add an interceptor, we just add an extra method that returns the Feign interceptor. 

{% highlight java %}
 private RequestInterceptor requestInterceptor() {
        return requestTemplate -> {
            requestTemplate.header("user", username);
            requestTemplate.header("password", password);
            requestTemplate.header("Accept", ContentType.APPLICATION_JSON.getMimeType());
        };
    }
{% endhighlight %}

To enable the customization, we add the interceptor to the builder. 

{% highlight java %}

   @Bean
   AuthClient authClient() {
        return Feign.builder()
                .requestInterceptor(requestInterceptor())
                .target(AuthClient.class, baseServerUrl);
    }
{% endhighlight %}

### Client
By default, the default HTTP client of Feign uses `HttpUrlConnection` to execute its HTTP requests.
You can configure another client (`ApacheHttpClient`, `OkHttpClient`, ...) as follows:
{% highlight java %}

   @Bean
   AuthClient authClient() {
        return Feign.builder()
                .client(new ApacheHttpClient())
                .target(AuthClient.class, baseServerUrl);
    }
{% endhighlight %}

#### OkHttpClient
OkHttp is an HTTP client that’s efficient by default:

* HTTP/2 support allows all requests to the same host to share a socket.
* Connection pooling reduces request latency (if HTTP/2 isn’t available).
* Transparent GZIP shrinks download sizes.
* Response caching avoids the network completely for repeat requests.

#### Mutual SSL with ApacheHttpClient
The advantage of using `ApacheHttpClient` over the default client is that `ApacheHttpClient` sends more headers with the request, eg. `Content-Length`, which some servers expect.
Aside, Apache brings support for mutual SSL, where we can safely store our key and trust-store into transit.
To achieve this, you have to create a custom `ApacheHttpClient` and insert it into our Feign client. 


### Retry mechanism
When we want to build some resilience in our communication, we can setup a retry mechanism in our Feign client. 
If the other service is unreachable, we will try again until it is healthy or until our configuration has been set. 
When we want to use the retryer of Feign, we got three properties we can set.

* Period: How long it takes before the retry is triggered

* MaxPeriod: That's what the maximum is of how long it can take before a retry is triggered

* MaxAttempts: How many retries may the client trigger before it fails

Example:
{% highlight java %}

   @Bean
   AuthClient authClient() {
        return Feign.builder()
                .retryer(new Retryer.Default(period, maxPeriod, maxAttempts))
                .target(AuthClient.class, baseServerUrl);
    }
{% endhighlight %}

### Encoder / Decoder
Besides JSON encoders and decoders, you can also enable support for XML.
If you ever have to integrate with SOAP third party API's, Feign supports it.
There is a very detailed explanation on how to use it in the [documentation](https://github.com/OpenFeign/feign){:target="_blank"} of OpenFeign.

# Security
Security itself is very important in the structure of your platform, that's why we have to enable what mechanisms we can apply to the Feign client. 
Implementations are give above in the examples. 

## Basic
>When you want to send basic credentials you can just add an interceptor for the Feign client and add the username and password.

## JWT
>For only JWT communication you can just pass it down the parameters of your method call. 

## OAuth2
>This link provides a good explanation about the use of OAuth2 with Feign. 
[OAuth 2 interceptor](https://jmnarloch.wordpress.com/2015/10/14/spring-cloud-feign-oauth2-authentication/ ){:target="_blank"}

# Conclusion 
If you choose for the Spring wrapper or OpenFeign, the client is an advanced tool for enabling inter service communication.


# Sources
* [OpenFeign Documentation](https://github.com/OpenFeign/feign){:target="_blank"}
* [Spring Cloud OpenFeign Documentation](http://cloud.spring.io/spring-cloud-static/spring-cloud-openfeign/2.0.1.RELEASE/single/spring-cloud-openfeign.html){:target="_blank"}
* [OAuth 2 interceptor](https://jmnarloch.wordpress.com/2015/10/14/spring-cloud-feign-oauth2-authentication/ ){:target="_blank"}