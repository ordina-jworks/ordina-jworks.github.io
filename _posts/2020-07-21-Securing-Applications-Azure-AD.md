---
layout: post
authors: [jeroen_meys]
title: 'Securing Angular and Spring Boot applications under Azure AD with PKCE'
image: /img/azure-ad.png
tags: [Azure AD, Angular, Spring Boot, OAuth, OIDC, PKCE]
category: Security
comments: true
---

> Azure is Microsoft's cloud platform. It offers great services like 
> foo bar

# Using Azure AD to secure Angular and Spring Boot applications.

When starting out with Azure AD and how to use it for authentication in your apps, it's important to think about the setup that you want.
Do you want your Angular Single Page App (SPA) to be the OAuth client or would you rather the Spring Boot back end to fulfill that role?

If the SPA is the OAuth client, the Spring Boot application will be configured as a Resource Server.
This means it's up to Angular application to orchestrate the login and obtain access tokens.
These access token then grant access to other services (resource servers) on behalf of the user.

The other scenario, where the Spring Boot back end acts as the OAuth client, this will be performed in the backend and the Angular application will only maintain a session with the backend.

There are multiple pros and cons to both scenarios:

SPA as OAuth Client / back end as resource server:
+ back ends can be stateless
+ SPA can talk to multiple back ends
- Less secure

Back end as OAuth Client
+ More Secure
- Stateful

The TL;DR here is that you trade some extra security for a lot of convenience.

Which library to use in Angular?

Azure AD has quickstart guides for different kinds of applications. 
For Angular however, they currently only provide a wrapper for a version that only supports the implicit flow.
The current best practices draft discourages the implicit flow in favor of the standard Authorization Code Grant Flow with PKCE (pronounced "pixie").
The Microsoft Authentication Library for JavaScript (MSAL) will have support for PKCE soon, but at the time of writing, this feature was still in alpha.
Even when there are Azure libraries that can solve this problem, I try to stay as vendor-neutral as possible whenever possible.
This makes it easy to switch to other OAuth providers like AWS Cognito, Keycloak or Auth0.
The only downside is that vendor-specific features will not be available.
An example of this is the [On-Behalf-Of flow (OBO)](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow){:target="_blank" rel="noopener noreferrer"}, which is only supported by the Microsoft libraries.

Since OAuth and OIDC are protocols, we should be able to use any certified library which supports these.
I say "should", as the specifications left a lot of room for tinkering and additions. 
We'll see what I mean by this during the implementation.

My favourite goto library is [angular-oauth2-oidc](https://github.com/manfredsteyer/angular-oauth2-oidc){:target="_blank" rel="noopener noreferrer"} by Manfred Steyer. 
This is also the one we'll use in this example.

Azure Starters for Spring Boot

If you want to set up Spring Boot as an OAuth Client, you could use the Spring Boot starter. 
It's relatively hasle-free, given that you tweak some things left-and-right. 
But this is also where I see most people get really confused. 
What they actually want to do, is to configure their Spring Boot application as a Resource Server rather than an OAuth Client. 
For this, we will only use the `spring-boot-starter-oauth2-resource-server` dependency from Spring itself.
This further limits our dependencies on Azure. 

## The Angular Part

As an example of an Angular application, we can use the [Tour of Heroes](https://angular.io/tutorial) Angular tutorial application. 
Feel free to use your own application if you like as there should not be too many differences.

Because the Tour of Heroes application uses an in-memory API instead of a Spring Boot application, we should change this in the code.
Of course, if you are using your own application, you can skip this step.

```typescript
// app.module.ts

// REMOVE this part:

// The HttpClientInMemoryWebApiModule module intercepts HTTP requests
// and returns simulated server responses.
// Remove it when a real server is ready to receive requests.
HttpClientInMemoryWebApiModule.forRoot(
  InMemoryDataService, { dataEncapsulation: false }
)

```

and also change the url in the `HeroService`:

```typescript
// hero.service.ts

private heroesUrl = 'http://localhost:8080/api/heroes';
```

Now we're all set to go.
We start by adding the library to our project

```bash
npm i angular-oauth2-oidc --save
```

We then import the module:

```
// app.module.ts
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
// etc.

imports: [
	// etc.
    HttpClientModule,
	OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: ['http://localhost:8080/api'],
        sendAccessToken: true
      }
    }),
]
```

This is also where we define which APIs need the access token. 
In our case, this will be a Spring Boot application that's running on port 8080 and will serve from `/api`.

Next up is the oauth configuration.

```typescript
// app.component.ts

authConfig: AuthConfig = {
    issuer: 'https://login.microsoftonline.com/<<<tenant_id>>>/v2.0',
    redirectUri: 'http://localhost:4200/dashboard',
    clientId: '<<<client_id>>>',
    responseType: 'code',
    strictDiscoveryDocumentValidation: false,
    scope: 'openid profile email api://<<<client_id>>>/app',
}
```

The `issuer`, `redirectUri`, `clientId` and `responseType` are pretty straightforward. 
All you need to do is replace the placeholder with the values from Azure AD. 
You can copy the values from the overview in the [Azure Portal](https://portal.azure.com/)

// TODO: img here?

`strictDiscoveryDocumentValidation` Needs to be disabled due to the fact that not all URLs in the discovery document start with the issuer URL. 
This makes strict parsing fail, so we disable it.

INFO: To see the discovery document, simply append `/.well-known/openid-configuration` to the issuer URL.

You might have also noted the weird looking `api://<<<client_id>>>/app` scope in the list of scopes. 
The reason we do this, is explained very well in this [Medium blogpost](https://medium.com/@abhinavsonkar/making-azure-ad-oidc-compliant-5734b70c43ff) but boils down to the fact Azure AD uses a nonce in its JWT header, which breaks standard token validation.
If we include an application specific scope here, this will no longer be the case. 
Our Angular applcation won't actually care for this as it just passes access tokens to the Spring Boot back end application but there the validation will fail, resulting in a 401: Unauthorized. 
You can define this scope in the Azure Portal, under `Expose an API` > `Add a scope`.

INFO: This application specific scope can have any name, so it doesn't have to be `app`. 
Just make sure you use the same scope in the application as the one you defined in the Azure Portal.

// TODO: fix guards

# The Spring Boot part

This part is rather easy. All we have to do is to create a simple Spring Boot application and set it up as a Resource Server.
You can do this via the [Spring Boot Starter](https://start.spring.io/) or by adding the following dependencies to your project:

```gradle
// build.gradle
dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-web'
	implementation 'org.springframework.boot:spring-boot-starter-oauth2-resource-server'
	implementation 'org.springframework.security:spring-security-oauth2-jose'
}
```

or if you prefer maven:

```xml
<dependencies>
	<dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.security</groupId>
      <artifactId>spring-security-oauth2-jose</artifactId>
    </dependency>
</dependencies>
```

Next up, we tell our application where it can find the public keys to verify the JWT access tokens with. 
We either tell it what the issuer URL is, so that it can find the correct endpoint in the discovery document:

```
# application.properties
spring.security.oauth2.resourceserver.jwt.issuer-uri=https://sts.windows.net/<<<tenant_id>>>/
```

Or we can search the keys endpoint ourselves in the discovery document and provide the JSON Web Key endpoint straight away:

```
# application.properties
spring.security.oauth2.resourceserver.jwt.jwk-set-uri=https://login.windows.net/common/discovery/keys
```

All there is left to do now is the authorization part: who has access to what.

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and() // (1)
            .authorizeRequests().anyRequest().authenticated() // (2)
            .and()
            .oauth2ResourceServer().jwt(); // (3)
    }
}
```
There is a lot happening in a few lines here.
Let's break it down:
1) `http.cors()` Allows CORS preflight checks to succeed.
2) We want all requests to the application to require authentication. If no authentication is provided, a 401 status will be given.
Note that this is different if you set up the Spring Boot application as an OAuth Client. In that case, the caller would be redirected to the login page.
3) Here we tell the application to behave as a resource server. Authentication should be provided via JWT tokens.


