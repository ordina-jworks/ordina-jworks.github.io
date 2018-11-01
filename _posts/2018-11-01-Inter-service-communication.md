---
layout: post
authors: [kevin_van_houtte]
title: 'Communication in a distributed system with OpenFeign: Tips & Tricks'
image: /img/intercommunication/intercomm_header.jpg
tags: [Microservices, Security, Spring, Cloud, OpenFeign]
category: Microservices
comments: true
---

In contrast to monolithic applications, services in a distributed system are running on multiple machines. 
To let these services interact with each other, we need some kind of inter-process communication mechanism.
With the help of OpenFeign, I will explain how we can fire off synchronous calls to another service.


# Table of contents
1. [Setup](#setup)
2. [Different kinds of HTTP clients](#different-kinds-of-http-clients) 
3. [Enabling Mutual SSL](#enabling-mutual-ssl)
4. [Intercepting requests](#intercepting-requests)
5. [Give it a (re)try](#give-it-a-retry) 
6. [Securing your API](#securing-your-api)
7. [Creating SOAP clients](#creating-soap-clients)
8. [Handling errors with the error decoder](#handling-errors-with-the-error-decoder)
9. [Conclusion](#conclusion)



# Communication with OpenFeign
To understand the basics of inter-process communication, we need to look at what kind of interactions we can do.
[OpenFeign](https://github.com/OpenFeign/feign){:target="_blank"}, a declarative HTTP client by Netflix simplifies our way of interacting with other services. 
When we decide that it is time to decompose our modulith because of numerous reasons, we would have to look for a way to handle our inter-process communication.

# Setup
To use OpenFeign we need to add it to our classpath

{% highlight xml %}
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-openfeign</artifactId>
    </dependency>
{% endhighlight %}

When we inspect the dependency module, we see that there is a lot coming out-of-the-box with the Spring Cloud Starter.
If you are providing your own resilience or load balancing library you can just add the necessary dependencies you need.
Be aware that the syntax is different between using the Spring wrapper or OpenFeign itself.
To let your Spring context know that it has to search for OpenFeign clients, we just add `@EnableFeignClients`. 
You can add this annotation to any class annotated with `@Configuration`, `@SpringBootApplication` or `@SpringCloudApplication`
After we've enabled OpenFeign on our classpath, we can start adding OpenFeign clients. 
When defining these clients, we have two solutions you can choose from. 
The OpenFeign library, which provides us with the basics but very customizable OpenFeign clients, and the Spring library, that adds a few extra libraries to it for cloud tooling.

## Spring

{% highlight java %}
    @FeignClient(value = "auth", fallback = FallbackAuthClient.class, configuration = FeignConfig.class)
    public interface AuthClient { 
        @RequestMapping(method = RequestMethod.GET, value = "checkToken")
        boolean isTokenValid(@RequestHeader("Authorization") String token);
    }
{% endhighlight %}

* `@FeignClient`: is the annotation for Spring to recognize OpenFeign clients, OpenFeign clients have to be interfaces as it is self-declarative.
* `value/name`: is the name of the Feign client that will be used to create a [Ribbon](https://github.com/Netflix/ribbon){:target="_blank"} load balancer which can then be linked to the target application using service discovery or a fixed list of servers. 
You could also use the url attribute to point your client to the target application when you're not using Ribbon.
* `fallback`: if [Hystrix](https://github.com/Netflix/Hystrix){:target="_blank"} is enabled, you can implement a fallback method.  

{% highlight java %}
    @Component
    public class FallbackAuthClient implements AuthClient {
        @Override
        public boolean isTokenValid(@RequestHeader("Authorization") String token) {
            return false;
        }
    }
{% endhighlight %}

* `configuration`: is for extra configuration like logging, interceptors, etc... more on that below.
* `@RequestMapping`: Spring Cloud adds support for Spring MVC annotations and for using the same `HttpMessageConverter's` used by default in Spring Web.

## OpenFeign
To create an OpenFeign client we need an interface and a Feign builder that tells the interface it is an OpenFeign client.

{% highlight java %}

public interface AuthClient {
    @RequestLine("GET /auth")
    @Headers({"Authorization: {token}", "Accept: application/hal+json"})
    boolean isValid(@Param("token") String token);
}
{% endhighlight %}
* `@RequestLine`: is defining which verb and which URI path you are communicating to. 
* `@Headers`: is defining the request headers that come with the request.

# The builder
OpenFeign provides us with a builder-like pattern for our clients.
When we want to customize, we just add our own customization to the builder. 
To see the builder at work, let's create a bean of our client and return a Feign builder.
It's important to let the builder know which interface he has to target for communication. 
The second parameter is most likely the base url where all the requests begin. 
Get your URLs from the yml or properties file with the help of `@Value`.

{% highlight java %}

   @Value("${base.url}")
   private String baseServerUrl;
    
   @Bean
   AuthClient authClient() {
        return Feign.builder()
                .target(AuthClient.class, baseServerUrl);
    }
{% endhighlight %}

# Different kinds of HTTP clients
The default HTTP client of OpenFeign uses `HttpUrlConnection` to execute its HTTP requests.
You can configure another client (`ApacheHttpClient`, `OkHttpClient`, ...) as follows:
{% highlight java %}

   @Bean
   AuthClient authClient() {
        return Feign.builder()
                .client(new ApacheHttpClient())
                .target(AuthClient.class, baseServerUrl);
    }
{% endhighlight %}

## OkHttpClient
OkHttp is an HTTP client that’s efficient by default:

* HTTP/2 support allows all requests to the same host to share a socket.
* Connection pooling reduces request latency (if HTTP/2 isn’t available).
* Transparent GZIP shrinks download sizes.
* Response caching avoids the network completely for repeat requests.

## ApacheHttpClient
The advantage of using `ApacheHttpClient` over the default client is that `ApacheHttpClient` sends more headers with the request, eg. `Content-Length`, which some servers expect.

> Aside from these clients, there are a few more to research if you want : [OpenFeign clients](https://github.com/OpenFeign/feign#ribbon){:target="_blank"}

# Enabling Mutual SSL
Mutual SSL is supported in all of these clients.
To achieve this in an `ApacheHttpClient`, we have to create an `HttpClient` that builds the SSL context.
When the SSL context is valid, we wrap this inside an `ApacheHttpClient` for being compliant with OpenFeign. 

{% highlight java %}

public ApacheHttpClient createHttpClient() throws SSLException {
        HttpClient httpClient = HttpClients.custom()
                .setSSLSocketFactory(createSSLContext())
                .build();
        return new ApacheHttpClient(httpClient);
    }
{% endhighlight %}

Add it to the builder. 

{% highlight java %}

   @Bean
   AuthClient authClient() {
        return Feign.builder()
                .client(createHttpClient())
                .target(AuthClient.class, baseServerUrl);
    }
{% endhighlight %}

# Give it a (re)try
When we want to build some resilience in our communication, we can setup a retry mechanism in our OpenFeign client. 
If the other service is unreachable, we will try again until it is healthy or until the max attempts you have set in your configuration has been reached. 
When we want to use the retryer of OpenFeign, we got three properties we can set.

* `period`: How long it takes before the retry is triggered

* `maxPeriod`: That's what the maximum is of how long it can take before a retry is triggered

* `maxAttempts`: How many retries may the client trigger before it fails

Example:
{% highlight java %}
   @Value("${retry.period:3000}")
   private int period;

   @Value("${retry.maxPeriod:30000}")
   private int maxPeriod;

   @Value("${retry.maxAttempts:5}")
   private int maxAttempts;
    
   @Bean
   AuthClient authClient() {
        return Feign.builder()
                .retryer(new Retryer.Default(period, maxPeriod, maxAttempts))
                .target(AuthClient.class, baseServerUrl);
    }
{% endhighlight %}

# Intercepting requests
If you need some basic authorization, custom headers or some extra information in every request of the client, we can use interceptors. 
This becomes very useful in situations where every request needs this extra information.
To add an interceptor, we just add an extra method that returns the OpenFeign interceptor. 

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

# Securing your API
When we want to add the security layer between our services, there are a couple solutions to look at. 
Here are a few that can be handled by OpenFeign. 

## Basic
When you want to send basic credentials you can just add an [interceptor](#intercepting-requests) for the OpenFeign client and add the username and password.

## Bearer
For only Bearer token communication, you can just pass it down in the request header of your method call. 

{% highlight java %}
   //Spring
   @Override
   public boolean isTokenValid(@RequestHeader("Authorization") String token);

   //OpenFeign
   @RequestLine("GET /auth")
   @Headers({"Authorization: {token}", "Accept: application/hal+json"})
   boolean isValid(@Param("token") String token);
{% endhighlight %}


## OAuth2
This link provides a good explanation about the use of OAuth2 with OpenFeign: 
[OAuth 2 interceptor](https://jmnarloch.wordpress.com/2015/10/14/spring-cloud-feign-oauth2-authentication/ ){:target="_blank"}.

# Creating SOAP clients
Besides JSON encoders and decoders, you can also enable support for XML.
If you ever have to integrate with SOAP third party APIs, OpenFeign supports it.
There is a very detailed explanation on how to use it in the [documentation](https://github.com/OpenFeign/feign#jaxb){:target="_blank"} of OpenFeign.


# Handling errors with the error decoder
The OpenFeign API provides an `ErrorDecoder` to handle erroneous responses from servers.
Since there are many kind of errors we can get, we want a place where we can handle each one of them accordingly. 
An OpenFeign `ErrorDecoder` must be added to the configuration of the client object as you can see in the code below.

{% highlight java %}

   @Bean
   MyClient myClient() {
       return Feign.builder()
               .errorDecoder(errorDecoder())
               .target(MyClient.class, <url>);
   }
{% endhighlight %}

Rather than throwing an exception in the `decode` method of the `ErrorDecoder`, you return an exception to Feign and Feign will throw it for you.
The default error decoder `ErrorDecoder.Default` always throws a `FeignException`.
The problem with ending up with a `FeignException` is that it does not contain a lot of structure. 
It is a plain `RuntimeException` which only contains a message with a stringified response body. 
No way of interpreting that exception to rethrow a more functional exception eg. `UserNotFoundException`.

## Error decoder
To handle the errors, we have to look at the structure of these errors. 
From that structure, we build up our own exception and throw it so the `ControllerAdvice` class can handle our exception.

{% highlight java %}

public class CustomErrorDecoder implements ErrorDecoder {
    @Override
    public Exception decode(String methodKey, Response response) {
        CustomException ex = null;
        try {
            if (response.body() != null) {
                ex = createException(response);
            }
        } catch (IOException e) {
            log.warn("Failed to decode CustomException", e);
        }
        ex = ex != null ? ex : new CustomException("Failed to decode CustomException", errorStatus(methodKey, response).getMessage());
        return ex;
    }
    private CustomExceptionException createException(Response response) throws IOException {
        String body = Util.toString(response.body().asReader());
        List<ErrorResource> errorMessages = createMessage(body);
        return createCustomException(body, errorMessages);
    }
    private List<ErrorResource> createMessage(String body) {
        return read(body, "$.errors");
    }
    private CustomException createCustomException(String body, List<ErrorResource> errors) {
        CustomException ex = new CustomException();
        ex.setErrors(errors);
        int status = read(body, "$.status");
        ex.setStatus(Integer.toString(status));
        ex.setTitle(read(body, "$.title"));
        return ex;
    }
}
{% endhighlight %}

<div markdown="span" class="alert alert-danger" role="alert"><i class="fa fa-exclamation-circle"></i> <b>Warning:</b> 
Working with checked exceptions and Feign is a bit tricky for several reasons.
Returning a checked exception is possible in the `ErrorDecoder`, but to avoid Java's `UndeclaredThrowableException`, you'll have to add it to the method signature in the Feign interface. 
Doing this however, causes Sonar to complain because there's no actual code which throws that exception.
</div>


# Conclusion 
These were my experiences with OpenFeign and I like the simplicity of it. 
If you choose for the Spring wrapper or OpenFeign, the client is an advanced tool for enabling inter-service communication.
As of now, they just released a new version that is compliant with Java 11.
So go experiment and learn on the way! 


# Sources
* [OpenFeign Documentation](https://github.com/OpenFeign/feign){:target="_blank"}
* [Spring Cloud OpenFeign Documentation](http://cloud.spring.io/spring-cloud-static/spring-cloud-openfeign/2.0.1.RELEASE/single/spring-cloud-openfeign.html){:target="_blank"}
* [OAuth 2 interceptor](https://jmnarloch.wordpress.com/2015/10/14/spring-cloud-feign-oauth2-authentication/){:target="_blank"}
* [SOAP integration](https://github.com/OpenFeign/feign#jaxb){:target="_blank"}
* [Other HTTP clients](https://github.com/OpenFeign/feign#ribbon){:target="_blank"}
* [Ribbon](https://github.com/Netflix/ribbon){:target="_blank"}
* [Hystrix](https://github.com/Netflix/Hystrix){:target="_blank"}