---
layout: post
authors: [jeroen_meys]
title: 'Securing Web Applications With Keycloak Using OAuth 2.0 Code Flow and PKCE'
image: /img/securing-web-applications-with-keycloak/keycloak.jpg
tags: [Security, OAuth, OIDC, PKCE, Keycloak, Resource Server, Spring Security, Angular]
category: Security
comments: true
---

> Gone are the days when we had to write our own login mechanisms and permission systems.
This article is about how we can hook up our applications to an Identity and Access Management (IAM) framework such as Keycloak in a secure way.

# Table of contents
1. [Why Keycloak as Authentication Server](#why-keycloak-as-authentication-server)
2. [Setting up a Keycloak Server](#Setting-up-a-Keycloak-Server)
* [Creating a New Realm](#Creating-a-New-Realm)
* [Creating a Client](#Creating-a-Client)
* [Creating Roles and Scopes](#Creating-Roles-and-Scopes)
* [Creating a user](#Creating-a-user)
3. [Unsecured Setup](#Unsecured-Setup)
* [Spring Boot back end](#Spring-Boot-back-end)
* [Angular app: Tour of Heroes](#angular-app-tour-of-heroes)
4. [Implementing Security](#Implementing-Security)
* [Implicit Flow versus Code Flow + PKCE](#implicit-flow-versus-code-flow--pkce)
* [Resource Server in Spring Boot](#Resource-Server-in-Spring-Boot)
* [Securing The Angular application](#Securing-The-Angular-application)

# Why Keycloak as Authentication Server
You can find several platforms that handle user logins and resource access management such as Keycloak, OKTA, OpenAM, etc. 
All those platforms have their own features and possibilities that may be useful for your use case. 
In this article, we choose [Keycloak](https://www.keycloak.org/) as [authentication](https://en.wikipedia.org/wiki/Authentication) and [authorization](https://en.wikipedia.org/wiki/Authorization) server which is an open-source identity and access management platform (IAM) from Red Hat's Jboss. 
We have chosen for Keycloak because it is [open-source](https://github.com/keycloak/keycloak) and [well-documented](https://www.keycloak.org/documentation.html).

Keycloak comes with several handy features build-in:
* Two-factor authentication
* Bruteforce detection
* Social login (Facebook, Twitter, Google…)
* LDAP/AD integration
* …

We will go over the basics to get you started.

# Setting up a Keycloak Server

Keycloak supports [multiple ways](https://www.keycloak.org/docs/latest/server_installation/index.html#_operating-mode) to be set up.
For non-production purposes, it's easiest to just [download](https://www.keycloak.org/downloads.html) and run the standalone.
At the time of writing, the latest release version was `6.0.1`.

```bash
$ curl https://downloads.jboss.org/keycloak/6.0.1/keycloak-6.0.1.zip --output keycloak-6.0.1.zip
$ unzip keycloak-6.0.1.zip
$ cd keycloak-6.0.1/bin/
$ ./standalone
```

> For Windows users, there is also a `standalone.bat` in the same folder.

The Keycloak server is now running on port 8080.

> Use `-Djboss.socket.binding.port-offset` to change the port.  
`-Djboss.socket.binding.port-offset=1000` will run the server on port 8080 + 1000 = 9080 

Go to [http://localhost:8080](http://localhost:8080) and create an administrator account.
You can now click on `Administration Console >` and log in using the account you've just created.  

You are now on the pre-defined Master realm.

> A realm manages a set of users, credentials, roles, and groups. 
A user belongs to and logs into a realm and they are isolated from one another and can only manage and authenticate the users that they control.  

The master realm is the highest level in the hierarchy. 
Admin accounts in this realm have permissions to view and manage any other realm. 
It's best to create a new realm to manage our application and users.

## Creating a New Realm

<div style="text-align: center;" >
  <img src="/img/securing-web-applications-with-keycloak/create_realm.png" width="30%">
</div>

Create a new realm by clicking on the drop-down arrow next to the realm name in the upper left corner.

<div style="text-align: center;" >
  <img src="/img/securing-web-applications-with-keycloak/create_realm_2.png" width="60%">
</div>

In this example, heroes is chosen as the name of the realm.
Feel free to change this to the name of your organisation if you have one.

## Creating a Client

Every application that interacts with Keycloak is considered to be a client.  
Let's create one for the [Single Page App](https://en.wikipedia.org/wiki/Single-page_application) or SPA.  

Look for the `Clients` tab in the menu and hit `Create`.  
Pick a name you think is suitable and choose OpenID Connect (OIDC) as protocol.  
The `Root URL` can remain blank.  

<div style="text-align: center;" >
  <img src="/img/securing-web-applications-with-keycloak/create_client.png" width="50%">
</div>

After saving, we can see all the configuration options of the client.  
* `Valid Redirect URIs` should be set to `http://localhost:4200/*` as this is the address of our SPA  
* Allow all origins for testing purposes
* Single Page apps use a `public client` because they can not securely hide client credentials
* Make sure the `Standard Flow` is enabled. All other flows can be disabled

<div style="text-align: center;" >
  <img src="/img/securing-web-applications-with-keycloak/configure_client.png" width="50%">
</div>

> Standard flow is another name for the [Authorization Code Flow](https://tools.ietf.org/html/rfc6749#section-1.3.1) as defined in [the OAuth 2.0 specification](https://tools.ietf.org/html/rfc6749).

> `Direct Access Grants Enabled` may remain enabled for now. It will be easy to test our configuration later.

Don't forget to hit `Save` at the bottom of the form!

## Creating Roles and Scopes
Roles and scopes can be used to provide fine-grained access control to resources. 
We want them to be present when handling requests with our Spring Boot application. 
This part is optional, but can provide better insight in managing access to resources down the road.
<br>
Under `Roles` > `Add Role`, enter any name you like. Some standard roles are typically user or admin.

<div style="text-align: center;" >
  <img src="/img/securing-web-applications-with-keycloak/create_role.png" width="80%">
</div>

A scope is created in a similar way under `Client Scopes` > `Create`.  
We will not show a consent screen, so you can uncheck this option.

<div style="text-align: center;" >
  <img src="/img/securing-web-applications-with-keycloak/create_scope.png" width="80%">
</div>

Now add the scope to the client we created earlier under `Clients` > `Client Scopes`.

<div style="text-align: center;" >
  <img src="/img/securing-web-applications-with-keycloak/assign_scope.png" width="80%">
</div>
<br>

## Creating a user

To use our application later, we need a user to log in with.
In most corporate environments, users are stored in Active Directory or LDAP, which Keycloak can be connected to.
For our example, however, we will simply create a user in Keycloak itself.  

Search for the `Users` tab in the menu on the left and click `Add User`.  

<div style="text-align: center;" >
  <img src="/img/securing-web-applications-with-keycloak/create_user.png" width="60%">
</div>

Check `Email Verified` as we do not have email configured on our Keycloak server.  
After creation, you still have to set a password.
Go to the Credentials tab and enter a new one.

<div style="text-align: center;" >
  <img src="/img/securing-web-applications-with-keycloak/create_user_password.png" width="40%">
</div>

> Make sure the password is not a temporary one. 

If you created a new role in the previous section, you can assign it to your user under the `Role Mappings` tab.

That's all for the Keycloak part.
Now let's look at some applications to secure.

# Unsecured Setup

The demo setup will consist of:
* an Angular SPA project 
* a Spring Boot application to serve some data.

## Spring Boot back end

You can clone the base setup [here](https://github.com/jmeys/heroes-api) and switch to the `unsecured` branch.
It is a very simple application which serves some heroes on `/api/heroes` and `/api/heroes/{id}` on port 9090.

```java
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/heroes")
public class HeroController {

    private List<Hero> someHeroes = List.of(
            new Hero(1, "Ken"),
            new Hero(2, "Yannick"),
            new Hero(3, "Pieter"));

    @GetMapping
    public List<Hero> heroes() {
        return someHeroes;
    }

    @GetMapping("/{id}")
    public Hero hero(@PathVariable("id") String id) {
        return someHeroes.stream()
                .filter(h -> Integer.toString(h.getId()).equals(id))
                .findFirst()
                .orElse(null);
    }
}

class Hero {
    private final int id;
    private final String name;

    public Hero(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() { return id; }

    public String getName() { return name; }
}
```

For this example, every application may request these resources, hence the `@CrossOrigin("*")`.
Open the project in you favourite IDE and run it. 
The application will run on port 9090.

## Angular app: Tour of Heroes

[Tour of Heroes](https://angular.io/tutorial) is the Angular tutorial application. 
It's pretty simple but has all the basic components which make up a modern Angular application. 
And most importantly, it's kept up to date with the latest version of Angular. 

Use these commands or [download](https://angular.io/generated/zips/toh-pt6/toh-pt6.zip) the latest version of the Tour Of Heroes application from [the website](https://angular.io/tutorial/toh-pt6).

```bash
$ curl -LO https://angular.io/generated/zips/toh-pt6/toh-pt6.zip
$ unzip toh-pt6.zip -d toh
$ cd toh
$ npm i
```

The example app uses an in-memory service to return some heroes. 
Since you'll want to serve them from Spring Boot instead, change the url in `hero.service.ts` from `"api/heroes"` into `"http://localhost:9090/api/heroes"`.  

```typescript
export class HeroService {

  private heroesUrl = 'http://localhost:9090/api/heroes';
  ...
}
```

It will still try to fetch preloaded heroes from memory, so delete the `HttpClientInMemoryWebApiModule` from `app.module.ts`.

Now you can run the application with

```bash
$ ng serve
```

and browse to [localhost:4200](http://localhost:4200) to see if it works.

> Please note that not all functionality of the app is working because - for brevity - we only implemented the GET functionality in the Spring Boot back end.

# Implementing Security
We will now dive into the interesting part: setting up the security of the application.
To understand this section, you should have a basic understanding of OAuth and Open ID Connect (OIDC). 
If this is not yet the case, you can fast-forward to the next section or start your journey by watching this awesome video by [Nate Barbettini](https://twitter.com/nbarbettini) from [Okta](https://www.okta.com/).

<div class="responsive-video">
    <iframe width="1164" height="655" src="https://www.youtube.com/embed/996OiexHze0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>
<br>

## Implicit Flow versus Code Flow + PKCE
In this example, we will use the authorization code grant flow with Proof Key for Code Exchange ([PKCE](https://tools.ietf.org/html/rfc7636)) to secure the Angular app. 
It's a very long name for what could be shortened to "code flow + PKCE" which is [more secure than the implicit flow](https://tools.ietf.org/html/draft-ietf-oauth-security-topics-13#section-3.1.2). 
In fact, the implicit flow was never very secure to begin with. 
This is well-explained by [Nate Barbettini](https://twitter.com/nbarbettini) and [Aaron Parecki](https://twitter.com/aaronpk
):

<div class="responsive-video">
    <iframe width="1164" height="655" src="https://www.youtube.com/embed/CHzERullHe8" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>
<br>

The implicit flow was the easiest to understand, since it required one step less than the standard code flow:

<div style="text-align: center;" >
  <img src="/img/securing-web-applications-with-keycloak/implicit_vs_code.png" width="60%">
</div>

PKCE is an addition on top of the standard code flow to make it usable for public clients. 
It is already in use for native and mobile clients. 
PKCE boils down to this: 
1. Give `hash` of random value to authorization server when logging in to ask for `code`
2. Hand over the `random value` to authorization server when exchanging `code` for `access token`
3. Authorization server returns `access token` after verifying that `hash` belongs to `random value`.

<div style="text-align: center;" >
  <img src="/img/securing-web-applications-with-keycloak/pkce.png" width="70%">
</div>

Once we have obtained an access token, we can pass it along to the back end which will be configured as a stateless OAuth Resource Server.

## Resource Server in Spring Boot
What we really want to secure is the data served by our Spring Boot app.
We don't want the villains out there to be able to access our list of heroes, do we?

Let's take care of that.

While Keycloak provides its [own libraries](https://github.com/keycloak/keycloak/tree/master/adapters/oidc) to be used with Spring Boot, I personally favour more generic libraries that are provider unaware. 
This way, when we feel like it, we can more easily switch from one authorization server (Keycloak) to another (eg. Okta), as long as they support the OIDC protocol. 
The de-facto standard for securing Spring Boot applications, is Spring Boot Security. 
It has resource server support, so this is what we'll be using.

### Resource Server Imports
Let's add the dependecies to our `build.gradle` file:

```gradle
dependencies {
	...
	implementation 'org.springframework.boot:spring-boot-starter-security'
	implementation 'org.springframework.security:spring-security-oauth2-resource-server'
	implementation 'org.springframework.security:spring-security-oauth2-jose'
}
```

* `spring-boot-starter-security`: starter dependency for Spring Security
* `spring-security-oauth2-resource-server`: dependency to use our application as a Resource Server
* `spring-security-oauth2-jose`: support for the Javascript Object Signing and Encryption framework

### Configuration of the Resource Server
Then all we have to do is some configuring.

```java
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@EnableWebSecurity
public class ResourceServerConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and()
                .authorizeRequests()
                .mvcMatchers("/api/heroes/**").hasAuthority("SCOPE_heroes")
                .anyRequest().denyAll()
                .and()
                .oauth2ResourceServer()
                .jwt();
    }

}
```

With these few lines of code, a lot is happening. We told Spring Security that all endpoints are forbidden, except for `/api/heroes/**` when the heroes scope is present. This will be checked against the JWT access token.

The `oauth2ResourceServer()` sets up the application as a resource server. It will check if there is an access token on every request and whether it is valid or not. 
In order to verify that a token hasn't been tampered with, we need some information from Keycloak, which it exposes via a REST endpoint.
<br>

We add the endpoint to our `application.properties`:

```properties
server.port=9090
spring.security.oauth2.resourceserver.jwt.jwk-set-uri=http://localhost:8080/auth/realms/heroes/protocol/openid-connect/certs
```

### Testing the setup

That's all for the resource server part.
Don't forget to restart the Spring Boot application after these changes!

We can use curl to verify if our security is working correctly.

```bash
$ curl -i http://localhost:9090/api/heroes
HTTP/1.1 401
Set-Cookie: JSESSIONID=A2268A4D12924631929BEBDA57CB2333; Path=/; HttpOnly
WWW-Authenticate: Bearer
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
X-Frame-Options: DENY
Content-Length: 0
Date: Sun, 18 Aug 2019 21:15:14 GMT
```

Without a token, the server responds with HTTP 401. 
This means we are not authorized. 
As we don't have a log in available just yet, we can use the Direct Access Grants flow to obtain a token. 
This can come in very handy for testing different scenarios as well.

```bash
$export TOKEN=$(curl -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=spa-heroes" \
  -d "username=jeroen" \
  -d "password=1234" \
  -d "grant_type=password" \
  -X POST http://localhost:8080/auth/realms/heroes/protocol/openid-connect/token | jq -r .access_token)
$echo $TOKEN
eyJhbGciOeUNvcWVJVWxNIn0.eyJqdGkiOiI......Hnz5aFdcAiB-5o-yep6rcGP_H6yQoW
```

> Make sure 'Direct Access Grants Enabled' is enabled in the Keycloak Client settings

We can now use this token to request the resource once more:

```bash
$ curl -i -X GET -H "Authorization: Bearer $TOKEN" http://localhost:9090/api/heroes
HTTP/1.1 200
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
X-Frame-Options: DENY
Content-Type: application/json;charset=UTF-8
Transfer-Encoding: chunked
Date: Sun, 18 Aug 2019 21:25:36 GMT

[{"id":1,"name":"Ken"},{"id":2,"name":"Yannick"},{"id":3,"name":"Pieter"}]
```

This time we got the requested resource back from the server!

## Securing The Angular application

When we look at our Tour Of Heroes application, we can see that it now tells us:

```
HeroService: getHeroes failed: Http failure response for http://localhost:9090/api/heroes: 401 OK
```

We didn't log in, so we can't see the content. Time to fix it!  

There are many packages we could use to secure our Angular app. An easy one to get started with, is [angular-oauth2-oidc](https://github.com/manfredsteyer/angular-oauth2-oidc) from Manfred Steyer but you could use any library, as long as it's [certified by OpenID](https://openid.net/certification/).

Add it to our dependencies:

```bash
$ npm i angular-oauth2-oidc --save
```

Then add it to the imports of `app.module.ts`

```typescript
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';

@NgModule({
  imports: [
    ...
    HttpClientModule,
    OAuthModule.forRoot({
      resourceServer: {
          allowedUrls: ['http://localhost:9090/api'],
          sendAccessToken: true
      }
  })
```

Notice how we configure `localhost:9090/api` to be the only URL where we will send our access token to.  


Next up, let's add log in and log out buttons in `app.component.html`.

```html
<button class="btn btn-default" (click)="login()">
  Login
</button>
<button class="btn btn-default" (click)="logoff()">
  Logout
</button>
```

Now all there is left to do is to configure the `OAuthService`. We do this in `app.component.ts`:

```typescript
import { Component } from '@angular/core';
import { OAuthService, NullValidationHandler, AuthConfig } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Tour of Heroes';
  
  constructor(private oauthService: OAuthService) {
    this.configure();
  }

  authConfig: AuthConfig = {
    issuer: 'http://localhost:8080/auth/realms/heroes',
    redirectUri: window.location.origin + "/heroes",
    clientId: 'spa-heroes',
    scope: 'openid profile email offline_access heroes',
    responseType: 'code',
    // at_hash is not present in JWT token
    disableAtHashCheck: true,
    showDebugInformation: true
  }
  
  public login() {
    this.oauthService.initLoginFlow();
  }
  
  public logoff() {
    this.oauthService.logOut();
  }
  
  private configure() {
    this.oauthService.configure(this.authConfig);
    // this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.tokenValidationHandler = new NullValidationHandler();
    
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }
}
```

Make sure that the name of the realm (heroes) and the client id (spa-heroes) correspond to the ones you defined in Keycloak. 
Remember how we required the heroes scope to be present in our back end? The scope property is how we fix this. 
If we omit `heroes` from the scope list, we will be getting a 403 response from our resource server.

> Keycloak is not returning the at_hash claim in the access token. For this reason, the client library would crash while parsing it.
This is why we disable it in the config but also use the `NullValidationHandler` as it would also make the application crash.

We can now try to log in and if all went well, we should see our heroes appear again when browsing to `/dashboard` or `/heroes`.

> Don't worry if you do not immediatly see the heroes appear. This is because we load the `/heroes` page before our code was exchanged for an access token.
This results in the first `/heroes` call getting a 401 response. You can create a new endpoint and use it as the redirectUri to get rid of this problem.

<div style="text-align: center;" >
  <img src="/img/securing-web-applications-with-keycloak/result.gif" width="70%">
</div>