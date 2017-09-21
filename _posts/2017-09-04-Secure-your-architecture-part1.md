---
layout: post
authors: [kevin_van_houtte]
title: 'Securing your cloud-native microservice architecture in Spring: part 1'
image: /img/microservices/part1/securitylogo.png
tags: [Microservices, Security, OAuth2, JWT, Redis, Session, Spring]
category: Microservices
comments: true
---

When developing cloud-native microservices, we need to think about securing the data that is being propagated from one service to another service and securing the data at rest. 
So how much security is enough to secure our architecture? Is it the user that identifies itself and decides what data he has access to?

# Overview
* [Our cloud-native architecture](#our-cloud-native-architecture)
* [Authentication & Authorization Principle](#where-our-journey-begins)
* [Using the OAuth2 Protocol](#using-the-oauth2-protocol)
* [Understanding JSON Web Tokens](#jwt)
* [Using a User Authentication & Authorization Server](#uaa)
* [Securing your microservice](#secure-your-microservice)

# Our cloud-native architecture
In this blog series we will cover these questions and guide you in applying the security layer to your cloud-native blueprint.
With this blueprint, we are going to use the [Spring ecosystem](https://spring.io/){:target="_blank"} throughout the series.
All of these are crucial for building a cloud-native microservices architecture, but it should be technology-agnostic.
* User Authentication & Authorization Server: [Spring Cloud Security OAuth2](https://spring.io/guides/tutorials/spring-boot-oauth2/){:target="_blank"}
* Load Balancer & Routing: [Spring Cloud Zuul](https://spring.io/guides/gs/routing-and-filtering/){:target="_blank"}
* Communication client: [Spring Cloud Feign](http://projects.spring.io/spring-cloud/spring-cloud.html#spring-cloud-feign){:target="_blank"}
* Externalized Config: [Spring Cloud Config Server](https://cloud.spring.io/spring-cloud-config/){:target="_blank"}

<div class="row" style="margin: 0 auto 2.5rem auto; width: 100%;">
  <div class="col-md-offset-3 col-md-6" style="padding: 0;">
	{% include image.html img="/img/microservices/part1/cloud-architecture.png" alt="architecture" title="arch" %}
</div>
</div>

# Where our journey begins...
When it comes to users interacting with our system, we want to verify that the person can identify him- or herself.
Most of the time this appears in a login form where you enter your credentials or in a login page from a third party application (Facebook, Google, etc).

<div class="row" style="margin: 0 auto 2.5rem auto; width: 100%;">
  <div class="col-md-offset-3 col-md-6" style="padding: 0;">
	{% include image.html img="/img/microservices/part1/login.png" alt="login" title="login" %}
</div>
</div>

>If you like more secure systems, you can add another complexity level on top of it.
Commonly used is the [Two-factor-authentication](https://en.wikipedia.org/wiki/Multi-factor_authentication){:target="_blank"}, where the client will for example use a Google Authenticator app to issue a token for your registered application.

## Authorization 
Authorization is the mechanism that uses the user's data to verify what he is allowed to do.
>For instance, who has access to which resources and what the access rights are (eg. execute or edit) to those resources.

To use these two mechanisms in our system, we will be using a security protocol that fits our microservices architecture.
Since we don’t want everyone to have an account for each (micro)service, we aim to have one single identity per person so that the user needs to authenticate only once.

# Using the OAuth2 Protocol
When searching for a security protocol, we don't want to reinvent the wheel and look at what is supported by the Spring framework.
Obviously, it depends on the use case of the applications that require resources from our system.
Is it a third party application like Facebook or a first party like your own application? Or both? 
I will explain both [OAuth2](#oauth2-scopes){:target="_blank"} & [JSON Web Token](#jwt){:target="_blank"} and how they solve these requirements. 

The OAuth2 delegation protocol allows us to retrieve an access token from an idenity provider and gain access to a microservice by passing the token with subsequent requests.
When introducing the OAuth2 framework to our system, we will be using four grant types. 
These three grant types are different ways to obtain an access token, some clients are more trusted than others. 

### OAuth2 Grant Types

#### Third party applications: Authorization Code grant type & Implicit grant type
Authorization Code is the most common used grant type for third party applications, where user's confidentiality can be maintained.
The user won't have to share his credentials with the application that is requesting resources from our backend. 
This is a redirection-based flow, which means that the application must be capable of interacting with the user's web browser.

* The frontend (application) makes a request to the User Authentication & Authorization server (UAA) on behalf of the user
* The UAA server redirects to a permission window of a third party for the user to grant permission, the user authenticates and grants permission
* The UAA server returns an authorization code with a redirect url
* The frontend uses the authorization code and an application identification to request an access token from the UAA server
* The UAA verifies the authorization code and returns an access token

> Implicit grant type follows the same principle as the Authorization Code type but does not exchange an authorization code to issue an access token.

<script async class="speakerdeck-embed" data-id="57b5f3f256a3449b9b3038bc69bf2d5f" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>


<br />
<br />

#### First party applications: Password grant type
This grant type is best used for first party applications,
where the user is in a trust relationship with the application.
The application authenticates on behalf of the user and receives the proper JWT.

* The user provides his credentials to the frontend, commonly done with a login form
* The frontend assembles a POST request with the credentials to the UAA server
* The UAA validates the user and returns a valid JWT

<script async class="speakerdeck-embed" data-id="1a77277934e14454bf3a66f22a31a26a" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

<br />
<br />

#### Trusted Service to Service communication: Client Credentials grant type
The trusted service can request an access token using only its client-id and client-secret
when the client is requesting access to the protected resources under its control, 
It is very important that the client credentials grant type MUST only be used by confidential clients.

* Zuul authenticates with his client-id and client-secret
* The UAA validates the credentials and returns a valid JWT


### OAuth2 Scopes
OAuth 2.0 scopes provide a way to limit the amount of access that is granted to an access token.
If the scope is not defined, the client is not limited by scope.

> an access token issued to a client can be granted READ or/and WRITE access to protected resources.
> If you enforce a WRITE scope to your API endpoint and it tries to call the endpoint with a token granted a READ scope, the call will fail

<a name="jwt" />

## JSON Web Tokens (JWT)
[JSON Web Tokens](https://jwt.io/){:target="_blank"} (JWT) is a compact URL-safe means of representing claims to be transferred between two parties.
The claims in a JWT are encoded as a JavaScript Object Notation (JSON) object that is used as the payload of a JSON Web Signature (JWS) structure or as the plaintext of a JSON Web Encryption (JWE) structure, enabling the claims to be digitally signed or MACed and/or encrypted.
The suggested pronunciation of JWT is the same as the English word "jot".
The payload consists of some standard attributes (called claims), such as issuer, subject (the user’s identity), and expiration time.
The specification allows these claims to be customized, allowing additional information to be passed along.
Be careful when passing additional information, if you like to go deeper on this topic with a real use case, you can read [Using JWT for State Transfer](http://ordina-jworks.github.io/microservices/2016/05/01/Using-JWT-Tokens-for-State-Transfer.html)
[Jwt.io](https://jwt.io/){:target="_blank"} provides a quick way to decode your JWT. 

One of the challenges in a microservice-based architecture is identity propagation.
After the authentication, the identity of the user needs to be propagated to the next microservice in a trusted way. <br />
JWT is used here to carry along information of the user.
Based on a token, your microservice needs to be able to create a principal object. 
This principal object needs to contain all the necessary info so the system can decide whether or not the request should be executed or not.

<div class="row" style="margin: 0 auto 2.5rem auto; width: 100%;">
  <div class="col-md-offset-3 col-md-6" style="padding: 0;">
	{% include image.html img="/img/microservices/part1/jwt-example.png" alt="jwt" title="jwt" %}
</div>
</div>

### Dealing with time

When propagating the identity of the user, you don’t want it to last for a infinite amount of time. <br />
That's why JWTs have an expiration time.
When expired, the JWT will be invalid and the client needs to request a new JWT with the refresh token.
These refresh tokens carry the needed information to issue a new JWT.
Refresh tokens can also expire but are rather long-lived.
JWTs have three fields that relate to time and expiry, all of which are optional.
In most cases, you should include these fields and validate that the token:
* is not expired (exp)
* was created before the current time (iat)
* should not be used before the current time (nbf)

All of these times are expressed as UNIX epoch timestamps, and are best checked in the order as described above.

### Signed JWTs

Signing a JWT helps establish trust between services, because it gives a recipient reason to believe that the message was created by a known sender and that the message was not altered in transit.
JWTs are being signed by a public/private key pair.
Almost all of the JWT libraries support signing. To check if yours supports it, visit [JWT Libraries](https://jwt.io/#libraries-io).
For a deeper dive into signing JWT, check our tech post about [Digitally signing your JSON Documents](http://ordina-jworks.github.io/security/2016/03/12/Digitally-signing-your-JSON-documents.html){:target="_blank"}

* The user requests a resource
* The frontend assembles a request with an Authorization header and a Bearer token inside, fires off the request to Zuul
* Zuul verifies the token in communication with the UAA server
* If the token is valid, Zuul redirects the frontend to the correct resource on the proper microservice
* The microservice checks for authorization to the resource, if access granted, the correct resource is returned

### Stateless
Since we are working with cloud-native applications, we can't have any state within them.
Because we have all the necessary information and create a new principal object for each request, the token eliminates the risk of having in-memory session state in the microservice.


<a name="uaa" />

# Using a User Authentication & Authorization Server (UAA)
The UAA server is an identity provider. It adds authentication to applications and secures services with minimum fuss.
It’s primary role is as an OAuth2 provider, issuing tokens for client applications to use when they act on behalf of users. 
It can also authenticate users with their credentials, and can act as an SSO service using those credentials.

For using an UAA server, there are some options available:
* Using a third party for issuing tokens (ex. Github, Facebook). [Tutorial Github social login](https://spring.io/guides/tutorials/spring-boot-oauth2/#_social_login_github){:target="_blank"}
* Using [KeyCloak](http://www.keycloak.org/){:target="_blank"} , an open source solution aimed to make it easy to secure your application. [Tutorial on how to use KeyCloak in Spring](https://dzone.com/articles/easily-secure-your-spring-boot-applications-with-k){:target="_blank"}
* Implementing your own UAA is not really best practice because KeyCloak covers most of it. [Explanatory video of the UAA server](https://youtu.be/EoK5a99Bmjc?t=4){:target="_blank"}

## Enabling Single Sign-On
Now that we have a way to achieve Authentication & Authorization by applying OAuth2 and JWT, we still have one problem.
By having multiple frontends in our architecture, the user will have to log in to each of these applications.
With Single Sign-On (SSO) we can eradicate this problem by requesting only one authentication from the user.

### Enable OAuth2 SSO flow on Zuul service
The `@EnableOAuth2Sso` annotation on Zuul will forward OAuth2 tokens to the services it is proxying.

### Sensitive Headers
Zuul secures your sensitive headers by blocking these headers downstream (microservice).
Since the default settings for sensitive headers blocks the Authorization header, we have to open this setting and send these headers downstream.
You can choose to set the sensitive header per route or globally.

How it works: [Sensitive Headers](https://github.com/spring-cloud/spring-cloud-netflix/blob/master/docs/src/main/asciidoc/spring-cloud-netflix.adoc#cookies-and-sensitive-headers){:target="_blank"}

#### Zuul Filter
Based on [Netflix’s Zuul](https://github.com/Netflix/Zuul){:target="_blank"}, Zuul brings a filter mechanism.
Filters are capable of performing a range of actions during the routing of HTTP requests and responses.
This can help you customize security on your incoming and outgoing traffic.
Review the [Zuul filter guide](https://github.com/Netflix/Zuul/wiki/How-it-Works){:target="_blank"} from Netflix about how filters work.


#### The Token Verifier
When the frontend sends a request with a token, Zuul will first contact a specific uri of the UAA server to check the validity of the token.
When the token is valid, Zuul will redirect the request with token to the proper microservice.
The grant type we use is the `client credentials` type, where Zuul will connect to the UAA server with a service-id and service-secret.


# Securing your microservice
When enabling security in your service, the most common issues are developer-induced.
Either there is a lack of built-in or easy security controls or we make trade-offs for functionality over security.
Still, we have to think about who can access this functionality and what they can do with it. 
We enter the phase where we passed the authentication and retrieved a JWT from our Zuul.
We are in a 'downstream service', where data is load balanced from Zuul. 
Next thing to question is, how do we decode this JWT? How can we secure our classes and methods with the help of Spring Security?

## Decoding the JWT
It is the responsibility of a microservice (Resource Server) to extract information about the user and client application from the JWT and make an access decision based on that information.
Decoding the JWT allows extraction of the users information and allows putting it in the security context.
Spring Security will assemble a Principal with this information to use.
When enabling Spring Security, we want to decode the JWT at the beginning of our chain so that the rest of the chain can work with the data retrieved from the JWT.

After decoding the JWT, you know who the user is, what role they have, and all of that.
The Spring OAuth2 project gives us the mechanism to retrieve a JWT out of the box. 
To enable the mechanism, we need the `@EnableOAuth2SSO` annotation for Zuul and the `@EnableResourceServer` annotation on every microservice that needs to accept the JWT.
The mechanism goes as followed:
* Frontend requests a resource with a JWT
* Zuul accepts the JWT and verifies it with UAA
* If valid, Zuul sends the JWT to the microservice annotated with `@EnableResourceServer`

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

To catch the OAuth2 token, we have to add the extra `@EnableResourceServer` annotation and because we are using JWT, we need an extra implementation to store and convert our JWT.
The OAuth2 starter includes the JWT dependency of Spring Security.
Secondly, we make a class to decode our incoming JWT.

{% highlight java %}

public class JwtAccessTokenConvertDecoder extends JwtAccessTokenConverter {

    final String EXP = "exp";
    
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

### Common mistake with keys
The UAA signs the token with a private key and verifies it with a public key. 
The problem that might occur is that every microservice would need to connect with the UAA server for verification on every request.
Obviously, we don't want every microservice to depend on the UAA servers availability regardless of startup/testing/CI. 
The solution to this is to disable exposure of your microservices to the outer network and handle only incoming traffic via the reverse proxy or load balancer (eg. Zuul, HAProxy, Nginx,...).
Zuul will verify the token as a trustworthy client of the UAA server and will propagate the token to the downstream services.
The microservice will handle the token as trustworthy since the token has been verified.


### Securing API endpoints
At last we're going to secure our resources.
Spring Security gives us a variety of tools to secure at class and method level.
The one that's used most often enables method security, which you enable by adding `@EnableGlobalMethodSecurity(prePostEnabled = true)` to your configuration. 

#### Authority 
For the authorization, Spring Security provides us with [authorities](https://docs.spring.io/spring-security/site/docs/3.0.x/reference/authz-arch.html){:target="_blank"}, extracted from the JWT.
The authorities are placed inside a [Principal](http://www.baeldung.com/get-user-in-spring-security){:target="_blank"}, which will be used throughout the existing security context of your application.
You can then reference them using Spring Expression Language (SpEL) to secure your methods.
There are plenty of options you can use for method security, but we'll highlight the most common ones.

You can find a complete list in the [Spring documentation](https://docs.spring.io/spring-security/site/docs/3.0.x/reference/el-access.html){:target="_blank"}

##### @PreAuthorize
Most commonly used, PreAuthorize will decide whether a method can actually be invoked or not.
>When a user logs in and you want the user to only access his detail information, you can use the PreAuthorize annotation to accept USER roles with a specific expression to see if it is the same user calling the endpoint.
>If you want the ADMIN role to access everyone's details, you can just add the hasRole expression.

 {% highlight java %}
@PreAuthorize("(authentication.principal.uuid == #uuid.toString()) or hasRole('ADMIN')")
User findByUuid(@Param("uuid") UUID uuid);
 {% endhighlight %}

##### @PostAuthorize
Less commonly, you may wish to perform the access-control check after the method has been invoked.
The returnObject is the returned value of that method.
>A user can only view his own details and not those of someone else, but an administrator can.
>You validate this by checking if the user has the admin role or if the principal's UUID is the same as the one of the returned user object.
 
 {% highlight java %}
@PreAuthorize("hasAnyRole('ADMIN','USER')")
@PostAuthorize("returnObject!=null or hasRole('ADMIN') or returnObject.uuid.toString() == authentication.principal.uuid")
User findOne(@Param("uuid") UUID uuid);
 {% endhighlight %}

# Next step
In the next post we will cover how to secure your data at rest.
 
# Sources
 * [Spring Cloud Eureka](https://spring.io/blog/2015/01/20/microservice-registration-and-discovery-with-spring-cloud-and-netflix-s-eureka){:target="_blank"}
 * [Spring Cloud Hystrix](https://spring.io/guides/gs/circuit-breaker/){:target="_blank"}
 * [Spring Cloud Zuul](https://spring.io/guides/gs/routing-and-filtering/){:target="_blank"}
 * [Spring Cloud Feign](http://projects.spring.io/spring-cloud/spring-cloud.html#spring-cloud-feign){:target="_blank"}
 * [Spring Cloud Config Server](https://cloud.spring.io/spring-cloud-config/){:target="_blank"}
 * [Spring Cloud Security OAuth2](https://spring.io/guides/tutorials/spring-boot-oauth2/){:target="_blank"}
 * [Josh Long UAA intro](https://youtu.be/EoK5a99Bmjc?t=4){:target="_blank"}
 * [Spring OAuth2 developers guide](https://projects.spring.io/spring-security-oauth/docs/oauth2.html){:target="_blank"}
 * [Sentinel mechanism](https://redis.io/topics/sentinel){:target="_blank"}
 * [Sensitive Headers](https://github.com/spring-cloud/spring-cloud-netflix/blob/master/docs/src/main/asciidoc/spring-cloud-netflix.adoc#cookies-and-sensitive-headers){:target="_blank"}
 * [Zuul Filters](https://github.com/Netflix/Zuul/wiki/How-it-Works){:target="_blank"}
 * [Sentinel configuration](http://docs.spring.io/spring-data/redis/docs/current/reference/html/#redis:sentinel){:target="_blank"}
 * [Default configuration](https://docs.spring.io/spring-session/docs/current/reference/html5/guides/boot.html#boot-redis-configuration){:target="_blank"}
 * [Spring Expression Language](https://docs.spring.io/spring-security/site/docs/3.0.x/reference/el-access.html){:target="_blank"}
 * [JWT decoder](https://jwt.io/){:target="_blank"}