---
layout: post
authors: [ken_coenen]
title: 'Spring Boot 2.0 Anniversary Meetup'
image: /img/spring-boot-2/051-thumb.jpg
tags: [Spring, Spring Boot]
category: Spring
comments: true
---

> On March 1st, <a href="https://spring.io/blog/2018/03/01/spring-boot-2-0-goes-ga" target="_blank">Spring Boot reached GA</a> on its second major version.
To celebrate this, we invited Spring Boot legend <a href="https://spring.io/team/snicoll" target="_blank">Stéphane Nicoll</a> to give us an in-depth view on what's new in Spring Boot 2.
He talked about the new features while migrating a Spring Boot 1.x application to Spring Boot 2.0.

# Spring Boot 2.0

Stéphane gave us an overview of the new features in Spring Boot 2.0.
It was kind of a summary of Phil Webb's announcement post <a href="https://spring.io/blog/2018/03/01/spring-boot-2-0-goes-ga" target="_blank">Spring Boot 2.0 goes GA</a>.

Code says more than a thousand words.
And like every talk I attended from Stéphane, he started live coding quite quickly.
We migrated a Spring Boot 1.x application to Spring Boot 2.0.

The migration process is **very** simple.
In short, these are the steps you have to follow:
1. Change Spring Boot parent version number in your ``pom.xml``
2. Replace deprecated property keys with the help of the ``spring-boot-properties-migrator`` module
3. If you're working with passwords, define a ``PasswordEncoder``

> When you use a lot of hookpoints and Spring Boot classes directly, eg. ``SpringBootServletInitializer``, migrating is slightly more work.
The reason behind this is that a lot of the Spring Boot API's have changed.

## Change version number

Change the Spring Boot Starter Parent version number in your ``pom.xml`` to the new Spring Boot version.

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.0.1.RELEASE</version>
</parent>
```

As from April 5th, this is the ``2.0.1.RELEASE``.
Stéphane released it on the train to the Ordina HQ in Mechelen.

<blockquote class="twitter-tweet" data-cards="hidden" data-lang="nl"><p lang="en" dir="ltr">Spring Boot 2.0.1 available now<a href="https://t.co/WpYx0Pwff8">https://t.co/WpYx0Pwff8</a><a href="https://twitter.com/springboot?ref_src=twsrc%5Etfw">@springboot</a> <a href="https://twitter.com/springcentral?ref_src=twsrc%5Etfw">@springcentral</a> <a href="https://twitter.com/ProjectReactor?ref_src=twsrc%5Etfw">@ProjectReactor</a></p>&mdash; Stéphane Nicoll (@snicoll) <a href="https://twitter.com/snicoll/status/981899920750850049?ref_src=twsrc%5Etfw">5 april 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
<br/>

## Property keys and the properties migrator

### Property key changes

When you upgrade, you will get compilation errors saying there are unknown properties in your properties files.
Some property keys have been deprecated and won't work anymore.

| Old property  | New property | 
| ------------- | -------------|
| ``spring.datasource.initialize`` | ``spring.datasource.initialization-mode`` |
| ``endpoints.health.path`` | ``management.endpoints.web.path-mapping`` |

All major IDEs, eg. IntelliJ, Netbeans and STS, will inform you about the newer property key.

### Properties migrator

You can add the ``spring-boot-properties-migrator`` module to your Maven project.

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-properties-migrator</artifactId>
  <scope>runtime</scope>
</dependency>
```

The Spring Boot Properties Migrator looks for configuration properties it can replace and provides the programmer with feedback.
For example, ``endpoints.health.path`` will automatically be replaced by the new ``management.endpoints.web.path-mapping`` property.

Spring Boot 2.0 will also tell you you’re using an old key when you provide old keys as **environment variable**.
It will not tell you the line on which you defined the property, but it will give an appropriate message.

Some properties cannot be fixed automatically:

* ``The security auto-configuration is no longer customizable``
* ``Replacement key 'spring.datasource.initialization-mode' uses an incompatible target type — String was replaced by an enumeration``

## Spring Security changes

As from Spring Security 5.x, a lot of security features were redesigned.
Some features are made more strict.

Since Spring Boot 2.x now uses Spring Security 5.x under the hood, the Spring Security autoconfiguration has been redesigned as well.

Previously with Spring Boot 1.x, you could have Spring Security configuration spread accross your application.
With Spring Boot 2.0, if you want to know what the security configuration of your application is, you only have to look at one file, your SecurityConfiguration class.

### No password encoder

When you haven't defined a ``PasswordEncoder`` bean, Spring will throw the ``There is no PasswordEncoder mapped for the id "null"`` error when creating your application context.

As from Spring Security 5.x, Spring Security enforces you to use a password encoder.
Spring Security enforces this by activating the default ``DelegatingPasswordEncoder``, which looks for ``PasswordEncoder`` beans.
By adding a ``BCryptPasswordEncoder``, the ``DelegatingPasswordEncoder`` will return that instance to encrypt passwords.

{% highlight java %}
@Bean
public BCryptPasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
{% endhighlight %}

> If you really want to, you can override password encoding by adding ``{noop}`` to the password value.
This will treat the password by activating the ``NoOpPasswordEncoder`` instead of the default ``DelegatingPasswordEncoder`` and will treat your password as plain text.<br/><br/>
Please note that this is **not recommended** if you deploy your app to a production environment!

### Actuator endpoints

Some Actuator security endpoint settings aren't modifyable by properties anymore.
For example, ``management.security.roles=HERO`` won't be picked up anymore.

Only two endpoints are being exposed by default, ``/info`` and ``/health``.
You can include or exclude management endpoints by using the new property ``management.endpoints.web.exposure.include``.

| Old property  | New property | 
| ------------- | -------------|
| ``endpoints.health.path`` | ``management.endpoints.web.path-mapping`` |

## Other enhancements

### Configuration processor

When you add the ``spring-boot-configuration-processor`` Maven module to your project, your IDE will be able to interpret your ``@ConfigurationProperties`` class and autocomplete the properties files.

There were some other enhancements too.
You can now use the ``Duration`` type for properties directly.

``private Duration delay = Duration.ofSeconds(3)``

The ``hello.delay`` autocompletion now also shows the unit behind the value, eg. ``hello.delay=3s``.

### Spring Boot Dev Tools enhancements

DevTools is a feature in Spring Boot which adds nice development features.

Spring created its own small LiveReload server, with a reload function.
The communication protocol of LiveReload is open source.
When you start the app, it also starts the LiveReload server.
Something in your application watches the classpath for changes.
If you change a template or a configuration property, Spring Boot will pick up the change, restart the Spring context and notify LiveReload.
The restart only takes about 1 to 3 seconds, because the JVM is still hot.

Spring Boot Dev Tools is not a new feature from Spring Boot 2, but the Spring developers have added some enhancements.
One of those new features is that you get a **delta** of what changed and what triggered the LiveReload functionality.

### Micrometer

In Spring Boot 1.x, there was a metrics system with which you could register gauges etc.
There's an Actuator endpoint with which you could view those metrics.
You could export those metrics to Prometheus or some other system.

Micrometer is comparable to what SLF4J is for logging.
You get an API for metrics that is independent of any vendor.
You can record values and expose those values with a registry system to the outside world.

```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
    <version>1.0.2</version>
</dependency>
```

For all projects that are supported by Micrometer, the metrics are exposed, eg. HikariCP.
Spring Boot detects that you use HikariCP and automatically exposes those metrics to the different registries.

## Q&A

### How should I convince my manager to upgrade?

Because of some security issues in previous versions, Pivotal will stop providing support for those version.
Another reason to upgrade is if you're going to add new features to an application, eg. add metrics.

### When will Spring Cloud be ready to support Spring Boot 2?

You can check <a href="http://start.spring.io/actuator/info" target="_blank">http://start.spring.io/actuator/info</a> in the ``spring-cloud`` section to see whether there are Spring Cloud versions which use Spring Boot 2.

{% highlight json %}
{
  "Angel.SR6": "Spring Boot >=1.2.3.RELEASE and <1.3.0.RELEASE",
  "Brixton.SR7": "Spring Boot >=1.3.0.RELEASE and <1.4.0.RELEASE",
  "Camden.SR7": "Spring Boot >=1.4.0.RELEASE and <=1.4.999.RELEASE",
  "Edgware.SR3": "Spring Boot >=1.5.0.RELEASE and <=1.5.11.RELEASE",
  "Edgware.BUILD-SNAPSHOT": "Spring Boot >=1.5.12.BUILD-SNAPSHOT and <2.0.0.M1",
  "Finchley.M2": "Spring Boot >=2.0.0.M3 and <2.0.0.M5",
  "Finchley.M3": "Spring Boot >=2.0.0.M5 and <=2.0.0.M5",
  "Finchley.M4": "Spring Boot >=2.0.0.M6 and <=2.0.0.M6",
  "Finchley.M5": "Spring Boot >=2.0.0.M7 and <=2.0.0.M7",
  "Finchley.M6": "Spring Boot >=2.0.0.RC1 and <=2.0.0.RC1",
  "Finchley.M7": "Spring Boot >=2.0.0.RC2 and <=2.0.0.RC2",
  "Finchley.M9": "Spring Boot >=2.0.0.RELEASE and <=2.0.0.RELEASE",
  "Finchley.BUILD-SNAPSHOT": "Spring Boot >=2.0.0.BUILD-SNAPSHOT"
}
{% endhighlight %}

### Does Spring Boot 2 support Java 10?

Yes.
However, the Java 10 build step for Spring Boot 2.0.1 failed after Stéphane released it on the train to Mechelen.
Eric De Witte posted a tweet about it during the meetup.

<blockquote class="twitter-tweet" data-lang="nl"><p lang="en" dir="ltr">I see <a href="https://twitter.com/concourseci?ref_src=twsrc%5Etfw">@concourseci</a> is being used pervasively at <a href="https://twitter.com/pivotal?ref_src=twsrc%5Etfw">@pivotal</a> <br><br>I.e. <a href="https://twitter.com/springboot?ref_src=twsrc%5Etfw">@springboot</a> tests against java 8, 9 and 10 <a href="https://t.co/o2Z5tqX4ka">pic.twitter.com/o2Z5tqX4ka</a></p>&mdash; Eric De Witte (@vEDW) <a href="https://twitter.com/vEDW/status/981962333189787648?ref_src=twsrc%5Etfw">5 april 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Stéphane tweets the day after that the Java 10 build was fixed.

<blockquote class="twitter-tweet" data-lang="nl"><p lang="en" dir="ltr">Does <a href="https://twitter.com/springboot?ref_src=twsrc%5Etfw">@springboot</a> 2 support Java 10?<br><br>A picture is worth a thousand words <a href="https://t.co/5jpG27gJnE">pic.twitter.com/5jpG27gJnE</a></p>&mdash; Stéphane Nicoll (@snicoll) <a href="https://twitter.com/snicoll/status/982170678920003585?ref_src=twsrc%5Etfw">6 april 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

# The meetup

The Spring Boot 2.0 Anniversary Meetup event started at 18h at the Ordina headquarters in Mechelen.
Since you cannot learn on an empty stomach, we started off with Belgian French fries.

Stéphane's presentation started at 19h.
He took us on a two hour ride through the Spring Boot landscape.

After the presentation, a huge celebration cake was carried in.
Our bakery had done its best to transform the Spring Boot logo into an immense nice looking cake.
We think he did a good job!
Check out Stéphane's tweet.

<blockquote class="twitter-tweet" data-lang="nl"><p lang="en" dir="ltr">Hey <a href="https://twitter.com/Lifeatordinabe?ref_src=twsrc%5Etfw">@Lifeatordinabe</a>, thank you so much for organizing this event and that <a href="https://twitter.com/springboot?ref_src=twsrc%5Etfw">@springboot</a> 2 celebration cake was delicious! 🤗<br><br>Looking forward to seeing the pictures <a href="https://t.co/MvNhncLneI">pic.twitter.com/MvNhncLneI</a></p>&mdash; Stéphane Nicoll (@snicoll) <a href="https://twitter.com/snicoll/status/981997476587720706?ref_src=twsrc%5Etfw">5 april 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
<br/>

A professional photographer took some atmospheric photos of the event.
You can see all pictures on <a href="http://elke.photos/album/springbootanniversaryordina">Elke.photos</a>.

<img class="image fit" alt="Spring Boot 2.0 Anniversary Meetup" src="{{ '/img/spring-boot-2/spring-boot-2-0.png' | prepend: site.baseurl }}">

# Useful links

The event was streamed <a href="https://t.co/7JuhS5iqLg" target="_blank">live on YouTube</a>.
Subscribe to our channel for more Java- and JavaScript related videos.

You can also consult the <a href="https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Migration-Guide" target="_blank">Spring Boot 2.0 Migration Guide</a> for more information.