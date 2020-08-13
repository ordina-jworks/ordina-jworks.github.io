---
layout: post
authors: [jeroen_meys]
title: 'Securing Angular and Spring Boot applications with Azure AD'
image: /img/azure-ad/azure-ad.png
tags: [Azure AD, Angular, Spring Security, Web Security OAuth, OIDC, PKCE]
category: Security
comments: true
---

> Azure Active Directory (Azure AD) is Microsoft’s cloud-based identity platform.
> In this blogpost, we will discuss how to use it to secure web applications with [OAuth 2.0](https://oauth.net/2/){:target="_blank" rel="noopener noreferrer"} and [OpenID Connect (OIDC)](https://openid.net/connect/){:target="_blank" rel="noopener noreferrer"}.
> More specifically an Angular single-page application (SPA) which makes calls to a Spring Boot back-end.

# Table of contents
* [Finding the perfect OAuth flow for your needs](#finding-the-perfect-oauth-flow-for-your-needs)
  * [Basic OAuth Terminology](#basic-oauth-terminology)
  * [The OAuth Client](#the-oauth-client)
  * [OAuth flows](#oauth-flows)
* [The Azure AD part](#the-azure-ad-part)
* [The Spring Boot Part](#the-spring-boot-part)
  * [Azure Starters for Spring Boot](#azure-starters-for-spring-boot)
  * [The Spring Boot Implementation](#the-spring-boot-implementation)
* [The Angular Part](#the-angular-part)
  * [The Angular Library](#the-angular-library)
  * [Example Application: Tour of Heroes](#example-application-tour-of-heroes)
  * [The Angular Implementation](#the-angular-implementation)

# Finding the perfect OAuth flow for your needs

Before diving into Azure AD and how to use it for authentication and authorization of your apps, it's important to think about the OAuth set-up that you want.
From personal experience, the libraries and documentation provided by Microsoft can be rather inconsistent and confusing. 
To straighten things out, we'll start by discussing which OAuth set-up we need and why.
Then we'll configure Azure AD and the applications to make everything work together.
Please note that this post assumes you have some notions of OAuth. 
Don't worry if your knowledge is a little lacking as we'll recap on the necessary parts.

## Basic OAuth Terminology

<dl>
    <dt>Resource Owner</dt>
    <dd>You: a user who interacts with the system and has some resources on a (resource) server.</dd><br>
    <dt>Resource Server</dt>
    <dd>Server where (your) protected resources are served from.</dd><br>
    <dt>Authorization Server</dt>
    <dd>Server which validates your credentials. Hands out tokens to registered clients.</dd><br>
    <dt>Client</dt>
    <dd>
    An application which uses tokens from the authorization server to access the resource server on behalf of the resource owner.
    It orchestrates the process to obtain these tokens.
    </dd>
</dl>

## The OAuth Client

Do we want the single-page app to be the OAuth client or should the Spring Boot back-end fulfill that role?  
If the SPA is the OAuth client, the Spring Boot application will be configured as a resource server.
This means it's up to the Angular application to orchestrate the process of obtaining access tokens from the authorization server. 
These tokens then grant access to resources from the Spring Boot back-end. 

For the other scenario, where the Spring Boot back-end acts as the OAuth client (and resource server), this orchestration will be performed in the back-end. 
In that case, the Angular application will only maintain a session with the back-end.

There are multiple advantages and disadvantages to both scenarios.
However, the biggest trade-off for our scenario is:

<b>SPA</b> as OAuth <b>client</b> / back-end as resource server:  
✅ Back-ends can be stateless: no session required  
❌ Less secure: access token stored in the browser  

<b>Spring Boot</b> back-end as OAuth <b>client</b>:  
❌ Has to be stateful: session required  
✅ More secure: tokens only in the back-end  

Having a stateless back-end makes it very easy to create or destroy new instances of it. 
Requests can go to any of those instances without the need for sticky load balancing or distributed sessions.  
The downside is that the tokens have to be stored in the browser, which can leak more easily than from a secure back-end. 
We control the back-end but not the user's computer, network, browser or its plugins. 
On top of that, [browsers also lack a secure storage mechanism](https://auth0.com/docs/tokens/token-storage){:target="_blank" rel="noopener noreferrer"}, unlike apps on mobile devices.

In this blogpost, we will go with the first approach where the Angular app is the OAuth client.
This means our set-up will be as follows:

| OAuth term | Concrete application |
| :--------: | :------------------: |
| Resource Owner | You |
| Resource Server | Spring Boot app |
| Authorization Server | Azure AD   |
| Client | Angular app |

## OAuth flows

OAuth has multiple flows.
The flow determines how tokens will be obtained from the authorization server by the client.
The original [OAuth specification](https://tools.ietf.org/html/rfc6749){:target="_blank" rel="noopener noreferrer"} defines four flows:
* <b>Authorization Code</b>
* Implicit
* Resource Owner Password Credentials
* <b>Client Credentials</b>

The [OAuth 2.0 Security Best Current Practice](https://www.ietf.org/id/draft-ietf-oauth-security-topics-15.html){:target="_blank" rel="noopener noreferrer"} document makes it very clear: use the client credentials flow for client-to-client purposes, where a client acts on its own behalf.
In all other cases, the authorization code flow with PKCE is the way to go.  

[Proof-Key for Code Exchange or PKCE](https://tools.ietf.org/html/rfc7636){:target="_blank" rel="noopener noreferrer"} (pronounced 'pixy') is an extention to OAuth which prevents interception attacks and enables the authorization code flow for public clients. 
If you are interested in what public clients are and how PKCE works, you can learn more about it in this [blogpost](https://ordina-jworks.github.io/security/2019/08/22/Securing-Web-Applications-With-Keycloak.html){:target="_blank" rel="noopener noreferrer"}.

In our case, a user is involved, so the right flow is the authorization code flow with PKCE.

> PKCE is (nearly always) mandatory in the [current OAuth 2.1 proposal](https://tools.ietf.org/html/draft-parecki-oauth-v2-1-03#section-9.8){:target="_blank" rel="noopener noreferrer"} by [Aaron Parecki](https://aaronparecki.com/){:target="_blank" rel="noopener noreferrer"}.

# The Azure AD part

We already discussed that our Angular app will be an OAuth client.
All clients have to be registered at the authorization server, so this is what we have to configure in Azure AD.

> A client is often called app(lication) in Azure AD.

We can do this via the [Azure Portal](https://portal.azure.com/){:target="_blank" rel="noopener noreferrer"}.
Log in and then navigate to Azure AD.
You should find the `App registrations` button on the left.

<div style="text-align: center;" >
  <img class="image fit-contain" src="{{ '/img/azure-ad/app-registration.png' | prepend: site.baseurl }}" alt="" width="30%" />
</div>

Click `New registration` and fill in the form:

<div style="text-align: center;" >
  <img class="image fit-contain" src="{{ '/img/azure-ad/app-registration2.png' | prepend: site.baseurl }}" alt="" width="70%" />
</div>

Pick a name that's appropriate for your client. 
We can also set up the redirect URI here. 
This is the URI where the user will be redirected to after logging in on the authorization server. 
It's important that this matches the URL in our Angular configuration later. 
The supported account types option depends on who should be able to log in to your app.

Notice how we don't need to configure a client secret? 
Single-page apps can't keep secrets hidden very well, which is why they have to be a public client. 
The authorization code flow used to be for confidential clients only, which use a secret or certificate to authenticate with the authorization server.  
PKCE is what makes the authorization code flow possible for these kinds of clients. 

Wait.. That's it?  
Yes.
Well, kind of.
Later on, we will have to make an adjustment, so don't close the portal just yet.
Once the client has been registered, we also need the client id and tenant id values for our application configuration.
I've changed mine to `<<<client_id>>>` and `<<<tenant_id>>>` for demonstration purposes, so don't forget to change these values to yours in the configuration examples.  

<div style="text-align: center;" >
  <img class="image fit-contain" src="{{ '/img/azure-ad/app-registration3.png' | prepend: site.baseurl }}" alt="" width="90%" />
</div>

# The Spring Boot Part

Our [example Spring Boot application](https://github.com/jmeys/azure-ad-demo-backend){:target="_blank" rel="noopener noreferrer"} is a small API which serves some resources for the Angular application which we'll discuss further down.  
This is probably the easiest part to arrange, but also where I see most people get really confused.

## Azure Starters for Spring Boot

If you want to set up the Spring Boot application as an OAuth client, you could use the Azure Active Directory starter from the [Spring Initializr](https://start.spring.io/){:target="_blank" rel="noopener noreferrer"}.
It's relatively hassle-free, given that you adjust some things left and right.  
However, we want to set up our Spring Boot application as a resource server (rather than an OAuth client). 
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

or if you prefer Maven:

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
1. `http.cors()` allows [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS){:target="_blank" rel="noopener noreferrer"} [preflight checks](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Preflighted_requests){:target="_blank" rel="noopener noreferrer"} to succeed.
2. We want all requests to the application to require authentication. If no authentication is provided, a 401 status will be returned.
Note that this is different if you configure the Spring Boot application as an OAuth client. In that case, the caller would be redirected to the login page.
3. Here we tell the application to behave as a resource server. Authentication should be provided via JWT access tokens.
To learn more about JWT tokens, you can check out my other [blogpost about OAuth](https://ordina-jworks.github.io/security/2019/08/22/Securing-Web-Applications-With-Keycloak.html){:target="_blank" rel="noopener noreferrer"}.

Our JWT access tokens are signed by Azure AD and our application should check if their signature is correct.
Azure AD has an endpoint with the public key to do so, which we have to configure in our application.
A first option is to configure the issuer URI so that it can find the correct endpoint in the discovery document.
The discovery document is a convenience endpoint where a lot of the client configuration can be found, including the web keys endpoint.

> You can find the discovery document by appending `.well-known/openid-configuration` to the issuer URI.

```
# application.properties
spring.security.oauth2.resourceserver.jwt.issuer-uri=https://sts.windows.net/<<<tenant_id>>>/
```

Alternatively, we can search the keys endpoint ourselves in the discovery document and then provide this JSON web key (JWK) endpoint straight away:

```
# application.properties
spring.security.oauth2.resourceserver.jwt.jwk-set-uri=https://login.windows.net/common/discovery/keys
```

In a real production configuration, I personally prefer to use the issuer URI as it offers most configuration via a single configuration property.
This will issue a network call to the discovery document when the application starts, so when testing in an environment where Azure AD is not reachable, this will cause the application to crash.
This is where the JWK URI can save the day.

# The Angular Part

When we now browse to any back-end endpoint, we receive: HTTP 401 Unauthorized.  
Let's fix this in our [example Angular application](https://github.com/jmeys/azure-ad-demo-frontend){:target="_blank" rel="noopener noreferrer"}.

## The Angular Library

Azure AD has quickstart guides for different kinds of applications. 
For Angular, however, the [msal-angular library](https://www.npmjs.com/package/@azure/msal-angular){:target="_blank" rel="noopener noreferrer"} currently only supports the implicit flow.
Since the current best practices draft strongly discourages the implicit flow in favour of the authorization code flow with PKCE, we will look for an alternative.

> The Microsoft Authentication Library for JavaScript (MSAL) should have support for PKCE soon, but at the time of writing, this feature was still in alpha.

Even when there will be Microsoft libraries that can solve this problem, I try to stay vendor-neutral whenever possible.
This makes it relatively easy to switch from one OAuth provider to another one like [Auth0](https://auth0.com/){:target="_blank" rel="noopener noreferrer"}, [AWS Cognito](https://aws.amazon.com/cognito/){:target="_blank" rel="noopener noreferrer"}, [Okta](https://www.okta.com/){:target="_blank" rel="noopener noreferrer"}, [Keycloak](https://www.keycloak.org/){:target="_blank" rel="noopener noreferrer"}, ...
The only downside is that vendor-specific features will not be available.
An example of this is the [On-Behalf-Of flow (OBO)](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow){:target="_blank" rel="noopener noreferrer"}, which is only supported by the Microsoft libraries.

Since OAuth and OIDC are standards, we should be able to use any (certified) library which supports these.
I say "should", as the specifications left a lot of room for tinkering and additions. 
We'll see what I mean by this during the implementation.

My favourite go-to library is [angular-oauth2-oidc](https://github.com/manfredsteyer/angular-oauth2-oidc){:target="_blank" rel="noopener noreferrer"} by Manfred Steyer. 
This is also the one we'll use in this example.

> Alternatively, you can use the [msal-angular library](https://www.npmjs.com/package/@azure/msal-angular){:target="_blank" rel="noopener noreferrer"} if you are fine with the implicit flow for now.

## Example Application: Tour of Heroes

As an example of an Angular application, we can use the [Tour of Heroes](https://angular.io/tutorial) Angular tutorial application. 
Feel free to use your own application as there should not be too many differences.

Because the Tour of Heroes application uses an in-memory API instead of a Spring Boot application, we should change this in the code.
Of course, if you are using your own application, you can skip this step.

```typescript
// app.module.ts

// REMOVE this part:

// The HttpclientInMemoryWebApiModule module intercepts HTTP requests
// and returns simulated server responses.
// Remove it when a real server is ready to receive requests.
HttpclientInMemoryWebApiModule.forRoot(
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

Next, we import the `OAuthModule` module:

```
// app.module.ts
import { HttpclientModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
// etc.

imports: [
	// etc.
    HttpclientModule,
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

Next up is the OAuth configuration.

```typescript
// auth.config.ts
import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
    issuer: 'https://login.microsoftonline.com/<<<tenant_id>>>/v2.0',
    redirectUri: window.location.origin + '/dashboard',
    clientId: '<<<client_id>>>',
    responseType: 'code',
    strictDiscoveryDocumentValidation: false,
    scope: 'openid api://<<<client_id>>>/app',
}
```

The `issuer`, `redirectUri`, `clientId` and `responseType` are pretty straightforward. 
All you need to do is to fill in the placeholder with the values from Azure AD. 
You can copy the values from the overview of the app in the Azure Portal.

<div style="text-align: center;" >
  <img class="image fit-contain" src="{{ '/img/azure-ad/app-values.png' | prepend: site.baseurl }}" alt="" width="60%" />
</div>

This is where we need to tweak some configuration settings for the library to work with Azure AD.
`strictDiscoveryDocumentValidation` needs to be disabled due to the fact that not all URLs in the discovery document start with the issuer URL. 
This makes strict parsing fail, so we disable it.

You might also have noticed the weird looking `api://<<<client_id>>>/app` value in the list of scopes. 
The reason why we do this is explained very well in this [Medium blogpost](https://medium.com/@abhinavsonkar/making-azure-ad-oidc-compliant-5734b70c43ff){:target="_blank" rel="noopener noreferrer"} but boils down to the fact Azure AD uses a nonce in a special way in its JWT header.
This breaks the standard JWT validation.
If we include an application specific scope here, this will no longer be the case. 
Our Angular application won't actually care for this as it just passes access tokens to the Spring Boot back-end.
The validation there will fail, resulting in a 401: Unauthorized. 
You can define this scope in the Azure Portal, under `Expose an API` > `Add a scope`.

<div style="text-align: center;" >
  <img class="image fit-contain" src="{{ '/img/azure-ad/add-scope.png' | prepend: site.baseurl }}" alt="" width="60%" />
</div>

> This application-specific scope can have any name, so it doesn't have to be `app`. 
> Just make sure you use the same scope in the application as the one you defined in the Azure Portal.

Another requested scope we configure is `openid`.
This indicates that we also want to log in the user.
We will not only receive an access token to contact the back-end API, but also an id token with information about the logged-in user.

> Azure AD will serve an id token, regardless of the open-id scope. But we include it anyway to respect the [specification](https://openid.net/specs/openid-connect-core-1_0.html){:target="_blank" rel="noopener noreferrer"}.

The next step is to trigger the login when a user has not logged in yet:

```typescript
// app.component.ts
constructor(private oauthService: OAuthService) {
    this.oauthService.configure(authCodeFlowConfig); // (1)
    this.oauthService.loadDiscoveryDocumentAndLogin(); // (2)

    this.oauthService.set-upAutomaticSilentRefresh(); // (3)
}
```

1. We set up the OAuthService with the configuration from the previous step.
This makes sure it uses the authorization code flow + PKCE with the correct parameters.  
2. The discovery document will be loaded, which is the issuer URI plus the `.well-known/openid-configuration` suffix and then start the login process.  
3. As access tokens have a short lifespan, we want them to be automatically refreshed in the background.

We can now try out the application and should be redirected to the Microsoft login page.  
After logging in, when we browse to the heroes page, we can see the 401 is gone, and the heroes are fetched again. 
