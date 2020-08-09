---
layout: post
authors: [jeroen_meys]
title: 'Securing Angular and Spring Boot applications with Azure Active Directory'
image: /img/azure-ad.png
tags: [Azure AD, Angular, Spring Security, Web Security OAuth, OIDC, PKCE]
category: Security
comments: true
---

> Azure Active Directory (Azure AD) is Microsoft’s cloud-based identity and access management service.
> In this blogpost, we will discuss how to use it to secure web applications.
> More specifically an Angular single-page application (SPA) which makes calls to a Spring Boot backend.

## What This Article is About

We'll cover how OAuth2 and Open ID Connect (OIDC) can help us to secure an API and provide a login mechanism for a single-page application (SPA) with Azure AD.
The documentation I've encountered to set things up was inconsistent at best, which is why we'll first discuss which OAuth flow we need and why.
Then we will configure Azure AD and the applications to make everything work together.
The example Angular application can be found [here](TODO){:target="_blank" rel="noopener noreferrer"} and the Spring Boot application can be found [here](TODO){:target="_blank" rel="noopener noreferrer"}.

## Finding the perfect OAuth flow for your needs

Before diving into Azure AD and how to use it for authentication and authorization of your apps, it's important to think about the OAuth setup that you want.
Do you want your SPA to be the OAuth Client or should the Spring Boot backend fulfill that role? 
If you don't know what an OAuth Client is, don't worry, here's a small introduction.

## Basic Terminology

This is something I've seen many people get confused about.
Let's quickly go over some basic, minimalistic, OAuth terminology:

<dl>
    <dt>Resource Owner</dt>
    <dd>You: a user who interacts with the system and has some resources on a Resource Server.</dd><br>
    <dt>Resource Server</dt>
    <dd>Server where (your) protected resources are served from.</dd><br>
    <dt>Authorization Server</dt>
    <dd>Server which validates your credentials. Hands out tokens to registered clients.</dd><br>
    <dt>Client</dt>
    <dd>
    An application which uses tokens from the Authorization Server to access a Resource Server.
    It orchestrates the process to obtain these tokens.
    </dd>
</dl>

If the SPA is the OAuth Client, the Spring Boot application will be configured as a Resource Server.
This means it's up to the Angular application to orchestrate the process to obtain access tokens from the Authorization Server.
These access tokens then grant access to resources from the Spring Boot backend.

For the other scenario, where the Spring Boot backend acts as the OAuth Client, this login orchestration will be performed in the backend.
In that case, the Angular application will only maintain a session with the backend.

There are multiple advantages and disadvantages to both scenarios.
The biggest trade-off however, is:

<b>SPA</b> as OAuth <b>Client</b> / back end as resource server:  
✅ backends can be stateless: no session required  
❌ Less secure: access token in the browser  

<b>Spring Boot</b> backend as OAuth <b>Client</b>:  
❌ Has to be stateful: session required  
✅ More Secure: tokens only in the backend  

In this blogpost, we will go with the first approach where the Angular App is the OAuth Client.
This means our setup will be as follows:

| OAuth term | Concrete application |
| :--------: | :------------------: |
| Resource Owner | You |
| Resource Server | Spring Boot app |
| Authorization Server | Azure AD   |
| Client | Angular app |

## OAuth flows

OAuth has multiple flows.
The flow determines how tokens should be obtained from the Authorization Server by the Client.
The original [OAuth specification](https://tools.ietf.org/html/rfc6749){:target="_blank" rel="noopener noreferrer"} defines four flows:
* <b>Authorization Code</b>
* Implicit
* Resource Owner Password Credentials
* <b>Client Credentials</b>

The [current OAuth best practices](https://www.ietf.org/id/draft-ietf-oauth-security-topics-15.html){:target="_blank" rel="noopener noreferrer"} make it very clear: use the Client Credentials flow for machine to machine purposes.
In all other cases, the Authorization Code flow with PKCE is the way to go.  
[PKCE](https://tools.ietf.org/html/rfc7636){:target="_blank" rel="noopener noreferrer"} (pronounced 'pixy') is a small extention to OAuth which prevents interception attacks and enables the Authorization Code flow for public clients. 
If you are interested in what public clients are and how PKCE works, you can learn more about it in this [blogpost](https://ordina-jworks.github.io/security/2019/08/22/Securing-Web-Applications-With-Keycloak.html){:target="_blank" rel="noopener noreferrer"}
As we will ask a user to enter his credentials (which is not machine to machine), the right flow for us is the Authorization Code flow with PKCE.

> PKCE will be made (mostly) mandatory in the [current OAuth 2.1 proposition](https://tools.ietf.org/html/draft-parecki-oauth-v2-1-03#section-9.8){:target="_blank" rel="noopener noreferrer"} by Aaron Parecki.

## The Azure AD part

We already discussed that our Angular app will be an OAuth Client.
All Clients have to be registered at the Authorization Server, so this is what we have to configure in Azure AD.
We can do this via the [Azure Portal](https://portal.azure.com/){:target="_blank" rel="noopener noreferrer"}.
Log in and then navigate to Azure AD.

TODO

# The Spring Boot Part

Our Spring Boot application is small API which serves some heroes for the Angular application which we'll discuss further down.  
This is probably the easiest part to set up. 
But this is also where I see most people get really confused.

## Azure Starters for Spring Boot

If you want to set up Spring Boot as an OAuth Client, you could use the Azure Active Directory starter from the [Spring Initializr](https://start.spring.io/){:target="_blank" rel="noopener noreferrer"}.
It's relatively hasle-free, given that you tweak some things left-and-right.  
However, we want to set up our Spring Boot application as a Resource Server (rather than an OAuth Client). 
For this, we will only use the `spring-boot-starter-oauth2-resource-server` dependency from Spring itself.
This further limits our dependencies on the Microsoft libraries. 

## The Spring Boot Implementation

We start by adding some extra libraries to the existing application.
Note that there are no versions defined as these should come from the Bill Of Materials (BOM).

```gradle
// build.gradle
dependencies {
	...
	implementation 'org.springframework.boot:spring-boot-starter-oauth2-resource-server'
	implementation 'org.springframework.security:spring-security-oauth2-jose'
}
```

or if you prefer maven:

```xml
<dependencies>
    ...
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

We can now set up the authorization part: who has access to what.

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
1. `http.cors()` Allows [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS){:target="_blank" rel="noopener noreferrer"} [preflight checks](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Preflighted_requests){:target="_blank" rel="noopener noreferrer"} to succeed.
2. We want all requests to the application to require authentication. If no authentication is provided, a 401 status will be returned.
Note that this is different if you set up the Spring Boot application as an OAuth Client. In that case, the caller would be redirected to the login page.
3. Here we tell the application to behave as a Resource Server. Authentication should be provided via JWT tokens.
To learn more about JWT token, you can check out my other [blogpost about OAuth](https://ordina-jworks.github.io/security/2019/08/22/Securing-Web-Applications-With-Keycloak.html){:target="_blank" rel="noopener noreferrer"}.

These JWT tokens were signed by Azure AD and Spring should check if their signature is correct.
Azure AD serves the public key to do so, for which we have configure the endpoint in our application.
A first option is to tell it what the issuer URI is, so that it can find the correct endpoint in the discovery document.
This is a convenience endpoint where a lot of the client configuration can be found, including the web keys endpoint.

> You can locate the discovery document by appending `.well-known/openid-configuration` to the issuer URI.

```
# application.properties
spring.security.oauth2.resourceserver.jwt.issuer-uri=https://sts.windows.net/<<<tenant_id>>>/
```

Alternatively, we can search the keys endpoint ourselves in the discovery document and then provide this JSON web key (JWK) endpoint straight away:

```
# application.properties
spring.security.oauth2.resourceserver.jwt.jwk-set-uri=https://login.windows.net/common/discovery/keys
```

In a real production configuration, I personally prefer to use the issuer URI as it offers most configuration in a single config line.
this will issue a network call to the discovery document at start up, so when testing in an environment where Azure AD is not reachable, this will cause the application to crash.
This is where the jwk URI can save the day.

# The Angular Part

When we now browse to any backend endpoint, we receive: HTTP 401 Unauthorized.  
Let's fix this in our Angular application.

## The Angular Library

Azure AD has quickstart guides for different kinds of applications. 
For Angular however, the [msal-angular library](https://www.npmjs.com/package/@azure/msal-angular){:target="_blank" rel="noopener noreferrer"} currently only supports the implicit flow.
Since the current best practices draft strongly discourages the implicit flow in favor of the Authorization Code flow with PKCE, we will look for an alternative.

> The Microsoft Authentication Library for JavaScript (MSAL) should have support for PKCE soon, but at the time of writing, this feature was still in alpha.

Even when there will be Microsoft libraries that can solve this problem, I try to stay vendor-neutral whenever possible.
This makes it relatively easy to switch from one OAuth provider to another one like [Auth0](https://auth0.com/){:target="_blank" rel="noopener noreferrer"}, [AWS Cognito](https://aws.amazon.com/cognito/){:target="_blank" rel="noopener noreferrer"}, [Okta](https://www.okta.com/){:target="_blank" rel="noopener noreferrer"}, [Keycloak](https://www.keycloak.org/){:target="_blank" rel="noopener noreferrer"}, ...
The only downside is that vendor-specific features will not be available.
An example of this is the [On-Behalf-Of flow (OBO)](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow){:target="_blank" rel="noopener noreferrer"}, which is only supported by the Microsoft libraries.

Since OAuth and OIDC are protocols, we should be able to use any (certified) library which supports these.
I say "should", as the specifications left a lot of room for tinkering and additions. 
We'll see what I mean by this during the implementation.

My favourite goto library is [angular-oauth2-oidc](https://github.com/manfredsteyer/angular-oauth2-oidc){:target="_blank" rel="noopener noreferrer"} by Manfred Steyer. 
This is also the one we'll use in this example.

> Alternatively, you can use the [msal-angular library](https://www.npmjs.com/package/@azure/msal-angular){:target="_blank" rel="noopener noreferrer"} if you are fine with the implicit flow for now.

## Example Application: Tour of Heroes

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

## The Angular Implementation

We start by installing the `angular-auth2-oidc` library:

```bash
npm i angular-oauth2-oidc --save
```

We then import the `OAuthModule` module:

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
// auth.config.ts
import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
    issuer: 'https://login.microsoftonline.com/<<<tenant_id>>>/v2.0',
    redirectUri: window.location.origin + '/dashboard',
    clientId: '<<<client_id>>>',
    responseType: 'code',
    strictDiscoveryDocumentValidation: false,
    scope: 'openid profile email api://<<<client_id>>>/app',
}
```

The `issuer`, `redirectUri`, `clientId` and `responseType` are pretty straightforward. 
All you need to do is to fill in the placeholder with the values from Azure AD. 
You can copy the values from the overview in the Azure Portal.

// TODO: img here?

This is where we need to tweak some configuration settings for the library to work with Azure AD.
`strictDiscoveryDocumentValidation` Needs to be disabled due to the fact that not all URLs in the discovery document start with the issuer URL. 
This makes strict parsing fail, so we disable it.

You might have also noted the weird looking `api://<<<client_id>>>/app` scope in the list of scopes. 
The reason we do this, is explained very well in this [Medium blogpost](https://medium.com/@abhinavsonkar/making-azure-ad-oidc-compliant-5734b70c43ff) but boils down to the fact Azure AD uses a nonce in a special way in its JWT header.
This breaks standard token validation.
If we include an application specific scope here, this will no longer be the case. 
Our Angular application won't actually care for this as it just passes access tokens to the Spring Boot back end.
The validation there will fail, resulting in a 401: Unauthorized. 
You can define this scope in the Azure Portal, under `Expose an API` > `Add a scope`.

> This application specific scope can have any name, so it doesn't have to be `app`. 
> Just make sure you use the same scope in the application as the one you defined in the Azure Portal.

Another requested scope we configure is `openid`.
This indicates we also want to log in the user.
We will receive not only an access token to contact the backend API, but also an id token with information about the logged in user. 

The next step is to trigger the login when a user isn't logged in yest:

```typescript
// app.component.ts
constructor(private oauthService: OAuthService) {
    this.oauthService.configure(authCodeFlowConfig); // (1)
    this.oauthService.loadDiscoveryDocumentAndLogin(); // (2)

    this.oauthService.setupAutomaticSilentRefresh(); // (3)
}
```

1. We setup the OAuthService with the configuration from the previous step.
This tells it to use the authorization code flow + PKCE with the correct parameters.  
2. The discovery document will we loaded, which is the issuer URI plus the `.well-known/openid-configuration` suffix and then start the login process.  
3. As access tokens have a short lifespan, we want them to be automatically refreshed in the background.

We can now try out the application and should be redirected to the Microsoft login page.  
After logging in, we can see the 401 is gone, and the heroes are fetched again.

// TODO Gif here

## Conclusion

We discussed which OAuth setup we wanted for our Angular app with Spring Boot backend.
In Azure AD we then configured a Client/application.
We then added and configured libraries to end up with a working example where we can log in and obtain access tokens to fetch resources from the protected backend.
