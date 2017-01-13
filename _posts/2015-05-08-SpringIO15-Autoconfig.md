---
layout: post
authors: [andreas_evers]
title: 'Master Spring Boot auto-configuration'
image: /img/springio.jpg
tags: [Spring]
category: Spring
comments: true
---

>Spring boot allows you to extend its convention-over-configuration approach by creating your own autoconfigurations. There are some important details you shouldn't forget.

### Master Spring Boot auto-configuration

*Speaker: Stéphane Nicoll*

<span class="image left"><img class="p-image" alt="Stéphane Nicoll" src="https://www.ordina.be/~/media/images/ordinabe/blogs/andreas10.png"></span>In order to create your own autoconfiguration, it's important to remember the **spring.factories** file in the META-INF folder of the autoconfiguration project.

The autoconfiguration class itself should have @Configuration (of course) and utilise conditional annotations as much as possible. Especially on the bean initializations the rule of thumb is the more **conditionals** the better. This enables users of your autoconfiguration to override specific elements of the autoconfiguration class. Aside from fully overriding beans, you can also expose properties under your own namespace. Together both these concepts allow small configuration-based modifications and bigger bean-overriding modifications by the user. 

Spring offers many types of Conditional annotations. The regular ConditionalOnClass or ConditionalOnMissingClass and ConditionalOnBean or ConditionalOnMissingBean are the most common, but also ConditionalOnProperty, OnResource, OnExpression and others are possible. You can even have nested conditions and for the most specific needs you can always write your own conditional annotation with whatever logic you require.  

By looking how Spring's autoconfiguration classes are built, it's easy to figure out how to do it yourself. Especially the ConfigurationProperties are pretty straight forward once you see an example. Don't forget to put the @EnableConfigurationProperties annotation on your autoconfiguration class however.
To expose your **configurationproperties** to IntelliJ, the trick is in the maven dependencies. You should add the "spring-boot-configuration-processor" dependency. This will generate metadata regarding the properties of your autoconfiguration which IntelliJ uses. Once that's done, IntelliJ will also autocomplete your properties in the property files.
Support for yml configuration autocompletion in IntelliJ is coming by the way.  

Once your autoconfiguration class is created, it's a good idea to **bundle** it into a maven module that can be used as a dependency by other projects. It's important to use the recommended naming convention for your modules - especially if you're building autoconfiguration for the community - or it might clash with the modules from spring boot itself. The recommended naming is xyz-spring-boot-autoconfigure and xyz-spring-boot-starter. The former module should contain the autoconfiguration class (and don't forget the spring.factories file), and the latter should contain the recommended dependencies to enable the autoconfiguration. That way the user can independently have the autoconfiguration and the classes that enable it. The starter is entirely optional though.
The spring.factories file should contain your configuration like this: a key being org.springframework.boot.autoconfigure.EnableAutoConfiguration with value the qualified name of your autoconfiguration class.  

To further allow the user to customize your autoconfiguration, you can expose a **customize** hook into your autoconfiguration. This should accept an xyzConfigCustomizer interface (you can create whatever interface you want basically) with a single customize method. This customize hook is executed after the autoconfiguration is executed, but before actual instantiation of the beans. The user then just has to create a bean that implements the customizer interface. [An example is available on GitHub.](https://github.com/snicoll-demos/spring-boot-master-auto-configuration/blob/master/hornetq-spring-boot-autoconfigure/src/main/java/hornetq/autoconfigure/HornetQAutoConfiguration.java)

One final concern of autoconfiguration is the **order** in which they are executed. This applies to conditions inside the autoconfiguration but also to combined autoconfigurations. Always make sure the cheapest condition comes first. So expensive SpEL expression conditions should come after conditionalOnBeans. Between autoconfigurations you can use either the annotation @AutoConfigureBefore and After on the autoconfiguration class, or the @Order annotation. When no order or before or after condition is specified, there is no guarantee when the autoconfiguration will be executed.
Conditions are being executed in two phases: PARSE_CONFIGURATION phase and REGISTER_BEAN phase. PARSE_CONFIGURATION evaluates the condition when the @Configuration-annotated class is parsed. This gives a chance to fully exclude the configuration class. REGISTER_BEAN evaluates the condition when a bean from a configuration class is registered. This does not prevent the configuration class to be added but it allows to skip a bean definition if the condition does not match (as defined by the matches method of the Condition interface).  


The slidedeck of this talk can be found here: [https://speakerdeck.com/snicoll/master-spring-boot-auto-configuration](https://speakerdeck.com/snicoll/master-spring-boot-auto-configuration)
