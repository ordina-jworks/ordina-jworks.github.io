---
layout: post
authors: [kevin_van_houtte]
title: 'Securing your cloud-native microservice architecture in Spring: part 1'
image: /img/microservices/part1/securitylogo.png
tags: [Microservices, Security, OAuth2, JWT, Redis, Session, Spring]
category: Microservices
comments: true
---

When developing cloud-native microservices, we need to think about securing our data that is being propagated from one service to another
and securing our data at rest. So how much security is enough to secure our architecture? Is the user who he tells he is and which data can he access?
In this blog series we will cover these questions and guide you on how to apply the security layer to your cloud-native blueprint.

# The Overview Wizard
* [Authentication & Authorization Principle](#principle)
* [Using the OAuth2 Protocol](#protocol)
* [Understanding JSON Web Tokens](#JWT)
* [Using an User Authentication & Authorization Server](#uaa)
* [Enabling Single Sign On with Spring Session & Redis](#sso)
* [Secure your microservice](#microservice)

# Our cloud-native architecture
We are using an example architecture, just to visualize how security flows through these components.
The components are crucial for building a cloud-native architecture. 
The technology can differ from project to project. 
Since we are visualized human beings, you can see where we are in our journey by looking at the topic names. 
* User Authentication & Authorization Server: [Spring Cloud Security OAuth2](https://spring.io/guides/tutorials/spring-boot-oauth2/)
* Service Registry: [Spring Cloud Eureka](https://spring.io/blog/2015/01/20/microservice-registration-and-discovery-with-spring-cloud-and-netflix-s-eureka)
* Resilience: [Spring Cloud Hystrix](https://spring.io/guides/gs/circuit-breaker/)
* Load Balancer & Routing: [Spring Cloud Zuul](https://spring.io/guides/gs/routing-and-filtering/)
* Communication client: [Spring Cloud Feign](http://projects.spring.io/spring-cloud/spring-cloud.html#spring-cloud-feign)
* Externalized Config: [Spring Cloud Config Server](https://cloud.spring.io/spring-cloud-config/)

<div class="row" style="margin: 0 auto 2.5rem auto; width: 100%;">
  <div class="col-md-offset-3 col-md-6" style="padding: 0;">
	{% include image.html img="/img/microservices/part1/cloud-architecture.png" alt="Single Sign On" title="SSO" %}
</div>
</div>

<a name="principle" />

# Where our journey begins...
When it comes to users interacting with our system, we want to verify that the person can identify who he says he is.
Most of the time this appears in a form sized box where you write down your credentials or a login page via a third party application (Facebook, Google, etc).

<div class="row" style="margin: 0 auto 2.5rem auto; width: 100%;">
  <div class="col-md-offset-3 col-md-6" style="padding: 0;">
	{% include image.html img="/img/microservices/part1/login.png" alt="Single Sign On" title="SSO" %}
</div>
</div>

>If you like more complex systems, you can add another complexity level on top of it.
Commonly used is the 2 factor-authentication, where the client will send you a text with a security code.
This security code will need to be inserted after you logged in.

## Authorization 
Authorization is the mechanism by which we look at the user's data and see what he is authorized to do so.
When a user is authenticated, the client will be given the information on what the user is authorized to do or to view. 
>For instance, when you go to permission control, you can decide who has access and what they can view, execute and edit. 

To use these two mechanisms in our architecture, we will be using a security protocol that fits our microservices architecture.
Since we don't want everyone to log in separately for different services, we aim to have a single identity that we only have to authenticate once.

<a name="protocol" />

# Using the OAuth2 Protocol
When searching for a security protocol, we didn't want to reinvent the wheel and looked at what is supported by the Spring framework.
It naturally depends from case to case which applications is in need of your resources. 
Is it a third party application like facebook or a first party like your own application? Or both? 
I will explain both OAuth2 & JSON Web Token and how they achieve these questions. 

The OAuth2 delegation protocol can assist us in the creation of scalable microservices,
it will allow us to secure the user's credentials from third and first party applications and gain access to a microservice through a JWT.
When applying the OAuth2 framework to our architecture, we will be using three grant types. 
These three grant types are different ways to obtain a JWT, some clients are more trusted than others. 

### OAuth2 Scopes
OAuth 2.0 scopes provide a way to limit the amount of access that is granted to a JWT.
If the scope is not defined, the client is not limited by scope.

> A JWT issued to a client can be granted READ or/and WRITE access to protected resources.
> If you enforce a READ scope to your API endpoint and it tries to call the endpoint with a token granted a READ scope, the call will fail

### OAuth2 Grant Types

#### Third party applications: Authorization Code grant type
This grant type is the most commonly used for third party applications,
where user's confidentiality can be maintained.
The user won't have to share his credentials with the application that is requesting resources from our backend. 
This is a redirection-based flow, which means that the application must be capable of interacting with the user's web browser
and receiving API authorization codes that are routed through the user's web browser.

* The frontend(application) makes a request to the UAA server on behalf of the user
* The UAA server pops up a permission window for the user to grant permission, the user authenticates and grants permission
* The UAA server returns an authorization code with a redirection
* The frontend uses the authorization code to exchange a JWT token from the UAA server
* The UAA verifies the authorization code and returns a JWT token

<script async class="speakerdeck-embed" data-id="57b5f3f256a3449b9b3038bc69bf2d5f" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

#### First party applications: Password grant type
This grant type is best used for first party applications,
where the user is in a trust relationship with the application.
The application authenticates on behalf of the user and receives the proper JWT.
This is also used when choosing the protocol: only JWT.

* The user provides his credentials to the frontend, commonly done with a login form
* The frontend assembles a POST request with the credentials to the UAA server
* The UAA validates the user and returns a valid JWT token

<script async class="speakerdeck-embed" data-id="1a77277934e14454bf3a66f22a31a26a" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>


#### Trusted Service to Service communication: Client Credentials grant type
The trusted service can request a JWT using only its client id and client secret
when the client is requesting access to the protected resources under its control, or those of another resource owner that have been previously arranged with the authorization server (the method of which is beyond the scope of this specification).
It is very important that the client credentials grant type MUST only be used by confidential clients.

* The zuul authenticates with his app id and secret
* The UAA validates the credentials and returns a valid JWT token

<a name="JWT" />

## JSON Web Tokens
When successfully ending one of these grant type flows, we receive a JWT from the UAA server.
JSON Web Tokens (pronounced “jot”) are compact, URL friendly and contains a JSON structure.
The structure is assembled in some standard attributes (called claims), such as issuer, subject (the user’s identity), and expiration time.

There is room available for claims to be customized, allowing additional information to be passed along.
While building your application, you will likely be told that your JWT is not valid for reasons that are not apparent.
For security and privacy reasons, it is not a good idea to expose (to the frontend) exactly what is wrong with the login.
Doing so can leak implementation or user details that could be used maliciously. <br />
[jwt.io](https://jwt.io/) provides a quick way to verify whether the encoded JWT that scrolled by in your browser console or your trace log is valid or not. 

One of the challenges in our microservice architecture is Identity propagation.
After the authentication, the identity of the user needs to be propagated to the next microservice in a trusted way. <br />
When we want to verify the identity, frequent callbacks to the UAA server is inefficient, 
especially given that communication between microservices is preferred to routing through the zuul whenever possible to minimize latency. <br />
JWT is used here to carry along a representation of information about the user.
In essence, a token should be able to:
* Know that the request was initiated from a user request
* Know the identity that the request was made on behalf of
* Know that this request is not a malicious replay of a previous request

<div class="row" style="margin: 0 auto 2.5rem auto; width: 100%;">
  <div class="col-md-offset-3 col-md-6" style="padding: 0;">
	{% include image.html img="/img/microservices/part1/jwt-example.png" alt="Single Sign On" title="SSO" %}
</div>
</div>

### Dealing with time

When propagating the identity of the user, you don’t want it to last for a infinite of time. <br />
That’s where JWTs come in place, they expire.
This triggers a refresh token of the identity that results in a new JWT.
JWTs have three fields that relate to time and expiry, all of which are optional.
Generally, include these fields and validate them when they are present as follows:
* The time the JWT was created (iat) is before the current time and is valid.
* The “not process before” claim time (nbf) is before the current time and is valid.
* The expiration time (exp) is after the current time and is valid.
All of these times are expressed as UNIX epoch timestamps.

### Signed JWTs

Signing a JWT helps establish trust between services, as the receiver can then verify the identity of the signer, and the contents of the JWT have not been modified in transit.
JWTs are being signed by a public/private key pair (SSL certificates work well with a well known public key).
Common JWT libraries all support signing.

* The user requests a resource
* The frontend assembles a request with an Authorization header and a Bearer token inside, fires off the request to the zuul
* The zuul verifies the token in communication with the UAA server
* If the token is valid, the zuul redirects the frontend to the correct resource on the proper microservice
* The microservice checks for authorization to the resource, if access granted, the correct resource is returned

For a deeper dive into JWT, check our tech post about [Digitally signing your JSON](http://ordina-jworks.github.io/security/2016/03/12/Digitally-signing-your-JSON-documents.html)

<a name="uaa" />

# Using an User Authentication Authorization Server
The UAA is a multi tenant identity management service, used as a stand alone OAuth2 server. 
It’s primary role is as an OAuth2 provider, issuing tokens for client applications to use when they act on behalf of users. 
It can also authenticate users with their credentials, and can act as an SSO service using those credentials.

For using an UAA server, there some possibilities to consider:
* Using a third party for issuing tokens (ex. Github, Facebook). [Tutorial Github social login](https://spring.io/guides/tutorials/spring-boot-oauth2/#_social_login_github)
* Using KeyCloak, an open source solution aimed to make it easy to secure your application. [Tutorial on how to use KeyCloak in Spring](https://dzone.com/articles/easily-secure-your-spring-boot-applications-with-k)
* Implementing your own UAA, not really best practice because KeyCloak covers most of it. [Explanatory video of the UAA server](https://youtu.be/EoK5a99Bmjc?t=4)
 
<a name="sso" />

## Enabling Single Sign On
Now that we got a way to achieve Authentication & Authorization by applying OAuth2 and JWT, we still have one problem.
By having multi-frontends in our architecture, the user will have to login in each of these applications.
With Single Sign On we can eradicate this problem by using only one authentication by the user.
To enable SSO, we have to implement this feature in the UAA & Zuul service. 
Since we can have multiple instances of our UAA server for high availability and load, we use Spring session & Redis to share our session between these instances.
Redis is an open source (BSD licensed), in-memory data structure store, used as a database, cache and message broker. 
To gain high availability with our redis server, we can use the [sentinel mechanism](https://redis.io/topics/sentinel).

### Enable OAuth2 SSO flow on the Zuul service
The `@EnableOAuth2Sso` annotation on the zuul will forward OAuth2 JWT tokens downstream to the services it is proxying.

### Sensitive Headers
The zuul secures your sensitive headers by blocking these headers downstream (microservice).
Since the default settings for sensitive headers blocks the Authorization header, we have to open this setting and send these headers downstream.
You can choose to set the sensitive header per route or globally.

How it works: [Sensitive Headers](https://github.com/spring-cloud/spring-cloud-netflix/blob/master/docs/src/main/asciidoc/spring-cloud-netflix.adoc#cookies-and-sensitive-headers)

#### Zuul Filter
Based on Netflix’s Zuul, the zuul brings a filter mechanism.
Filters are capable of performing a range of actions during the routing of HTTP requests and responses.
This can help you customize security on your incoming and outgoing traffic.
Review the guide from Netflix about how filters work.

How it works: [Zuul Filters](https://github.com/Netflix/zuul/wiki/How-it-Works)

#### The Token Verifier
When the frontend sends a request with a token, zuul will first contact a specific uri of the UAA server to check if the token is valid.
When the token is valid, zuul will redirect the request with token to the proper microservice.
The grant type we use is client credentials type, where the zuul will connects to the UAA server with a service id and service secret.

### Configuration Spring Session & Redis
To add Redis and Spring Session to the classpath, add the following in the pom.xml

{% highlight maven %}

<dependency>
    <groupId>org.springframework.session</groupId>
	<artifactId>spring-session-data-redis</artifactId>
	<version>(version of current release)</version>
	<type>pom</type>
</dependency>
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>

{% endhighlight %}

### Enabling Spring Session & Redis
Just one annotation is needed to enable it with default configuration on your application.
If you need to customize your Redis configuration, you can opt in one of the following configurations:
* [Sentinel configuration](http://docs.spring.io/spring-data/redis/docs/current/reference/html/#redis:sentinel)
* [Default configuration](https://docs.spring.io/spring-session/docs/current/reference/html5/guides/boot.html#boot-redis-configuration)

{% highlight java %}

@EnableRedisHttpSession
public class Application {
}
{% endhighlight %}

### Single Sign On Flow

<div class="row" style="margin: 0 auto 2.5rem auto; width: 100%;">
  <div class="col-md-offset-3 col-md-6" style="padding: 0;">
	{% include image.html img="/img/microservices/part1/SSOSecurity.jpg" alt="Single Sign On" title="SSO" %}
</div>
</div>

* The user logs into the UAA server and grant permission with frontend 1
* The UAA server creates a sessionID for this user
* The redis database confirms the creation
* After the redirect mechanism of the authorization grant, the UAA creates a cookie in the user’s browser with the user’s sessionID and returns a JWT token specific for that frontend
* The frontend 2 uses the same browser (same sessionID cookie) to visit the UAA server
* The UAA finds a sessionID in the request and consults the redis database for its existence
* The redis database confirms the existence
* The UAA directly logs in frontend 2 and returns a JWT token specific to frontend 2

<a name="microservice" />

# Secure your microservice
When enabling security in your service, the most common issues are developer-induced.
Either there is a lack of built-in or easy security controls and at the end, we make trade-offs for functionality/features over security.
Still, we have to think about who can access this functionality and what they can do with it. 
We enter the phase where we passed the authentication and retrieved a JSON Web Token from our zuul.
We are in a 'downstream service', where data is load balanced from the zuul. 
Next thing to question is, how do we decode this JWT? How can we secure our classes and methods with the help of Spring Security?

## Decoding the JWT
It is the responsibility of a microservice (Resource Server) to extract information about the user and client application from the JWT token and make an access decision based on that information.
With the help of a JWT decoder, it extracts the users information and put it in the security context.
Spring Security will assemble a principal with this information to use.
When enabling Spring Security, we want to decode the JWT at the beginning of our chain so that the rest of the chain can work with the data rested in the JWT.

After decoding the JWT, you know who the user is, what role they have, and all of that.
The Spring OAuth2 project gives us the mechanism to retrieve a JWT out of the box. 
When we added the `@EnableOAuth2SSO` annotation to the zuul and `@EnableResourceServer` to our downstream services, we activated the flow to put the token in the header.

### Account service
Let's implement this flow into our account service. 
First, we have to add two dependencies to our classpath. 

{% highlight maven %}
<dependency>
	<groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-oauth2</artifactId>
</dependency>
{% endhighlight %}

To catch the OAuth2 token we have to add the extra `@EnableResourceServer` annotation and because we are using JWT, we need an extra implementation to store and convert our JWT.
The OAuth2 starter includes the JWT dependency of Spring Security.
Secondly, we make a class to decode our incoming JWT.

{% highlight java %}

public class JwtAccessTokenConvertDecoder extends JwtAccessTokenConverter {

    private JsonParser objectMapper = JsonParserFactory.create();

    protected Map<String, Object> decode(String token) {
        try {
            Jwt jwt = JwtHelper.decode(token);
            String content = jwt.getClaims();
            Map<String, Object> map = objectMapper.parseMap(content);
            if (map.containsKey(EXP) && map.get(EXP) instanceof Integer) {
                Integer intValue = (Integer) map.get(EXP);
                map.put(EXP, Long.valueOf(intValue));
            }
            return map;
        }
        catch (Exception e) {
            throw new InvalidTokenException("Cannot convert access token to JSON", e);
        }
    }
}

{% endhighlight %}

And add these as beans to get it working. 

{% highlight java %}
@Configuration
@EnableResourceServer
public class ResourceServiceConfiguration extends ResourceServerConfigurerAdapter {

    @Bean
    public JwtAccessTokenConvertDecoder accessTokenConverter() {
        return new JwtAccessTokenConvertDecoder();
    }

    @Bean
    public TokenStore tokenStore() {
        return new JwtTokenStore(accessTokenConverter());
    }

    @Bean
    @Primary
    public DefaultTokenServices tokenServices() {
        DefaultTokenServices defaultTokenServices = new DefaultTokenServices();
        defaultTokenServices.setTokenStore(tokenStore());
        return defaultTokenServices;
  }
}

{% endhighlight %}

### Common mistakes with keys
So the UAA signs the token with a private key and verifies it with a public key. 
The problem that occurs is that every microservice would need the public key to connect with the UAA server for verification on every request.
As you can see, we don't want every microservice to be dependant of the UAA server to be available at startup, in testing or CI. 
The solution to this is to disable exposure of your microservices to the outer network and handle only incoming traffic via the reverse proxy/load balancer (Zuul).
Zuul will verify the token as a trustworthy client of the UAA server and will propagate the token to the downstreamed services.
The microservice will handle the token as trustworthy since the token is verified.


### Securing API endpoints
At last we're going to secure our resources.
Spring Security gives us a variety of tools to secure at class/method level.
Let me point you out the most used one.  <br />
To enable method security add `@EnableGlobalMethodSecurity(prePostEnabled = true)` to your configuration. 

#### Authority 
For the authorization, Spring Security provides us authorities, extracted from the JWT, the authorities are placed inside a principal.
This principal will be used throughout the existing security context of your application. 
Now these authorities can be used for authorizing methods. 
It provides us method based access control where you have the ability to use SPEL expressions as an authorization mechanism.
There is a lot of options to use for method security but for now we will see the most common ones.

For the full list: [Spring Expression Language](https://docs.spring.io/spring-security/site/docs/3.0.x/reference/el-access.html)

##### @PreAuthorize
Most commonly used, PreAuthorize will decide whether a method can actually be invoked or not.
>When a user logs in and you want the user to only access his detail information, you can use the PreAuthorize annotation to accept USER roles with a specific expression to see if it is the same user calling the endpoint.
>If you like the ADMIN role to access everyone's details, you can just add the hasRole expression.

 {% highlight java %}
@PreAuthorize("(authentication.principal.uuid == #uuid.toString()) or hasRole('ADMIN')")
User findByUuid(@Param("uuid") UUID uuid);
 {% endhighlight %}

##### @PostAuthorize
Less commonly, you may wish to perform access-control check after the method has been invoked.
The returnObject is the returned value of that method.
>A USER role can only update his own details and not from everyone else, but an ADMIN role can.
>You get the returned object from the method and compare it to the principals uuid.
 
 {% highlight java %}
@PostAuthorize("returnObject == null or hasRole('ADMIN') or hasRole('USER') and returnObject.uuid.toString() == authentication.principal.uuid")
<S extends User> S save(S user);
 {% endhighlight %}

# Next step
 In the next post we will cover how to secure your data at rest with the help of Spring Cloud Config server.
 
# Sources
 * [Spring Cloud Eureka](https://spring.io/blog/2015/01/20/microservice-registration-and-discovery-with-spring-cloud-and-netflix-s-eureka)
 * [Spring Cloud Hystrix](https://spring.io/guides/gs/circuit-breaker/)
 * [Spring Cloud Zuul](https://spring.io/guides/gs/routing-and-filtering/)
 * [Spring Cloud Feign](http://projects.spring.io/spring-cloud/spring-cloud.html#spring-cloud-feign)
 * [Spring Cloud Config Server](https://cloud.spring.io/spring-cloud-config/)
 * [Spring Cloud Security OAuth2](https://spring.io/guides/tutorials/spring-boot-oauth2/)
 * [Josh Long UAA intro](https://youtu.be/EoK5a99Bmjc?t=4)
 * [Spring OAuth2 developers guide](https://projects.spring.io/spring-security-oauth/docs/oauth2.html)
 * [Sentinel mechanism](https://redis.io/topics/sentinel)
 * [Sensitive Headers](https://github.com/spring-cloud/spring-cloud-netflix/blob/master/docs/src/main/asciidoc/spring-cloud-netflix.adoc#cookies-and-sensitive-headers)
 * [Zuul Filters](https://github.com/Netflix/zuul/wiki/How-it-Works)
 * [Sentinel configuration](http://docs.spring.io/spring-data/redis/docs/current/reference/html/#redis:sentinel)
 * [Default configuration](https://docs.spring.io/spring-session/docs/current/reference/html5/guides/boot.html#boot-redis-configuration)
 * [Spring Expression Language](https://docs.spring.io/spring-security/site/docs/3.0.x/reference/el-access.html)
 * [JWT decoder](https://jwt.io/) 