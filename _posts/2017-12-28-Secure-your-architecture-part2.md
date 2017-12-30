---
layout: post
authors: [kevin_van_houtte]
title: 'Securing your cloud-native microservice architecture in Spring: part 2'
image: /img/microservices/part2/part2logo.jpg
tags: [Microservices, Security, Encryption, Spring, Cloud, Config]
category: Microservices
comments: true
---

Since the rise of the digital era, most enterprises keep their data in a digital format.
But if their sensitive data lacks security, it can cause the data to be unreliable, unstable and unavailable to their business.
We have to be prepared if an attacker breaches into our network and tries to hack our sensitive data.
Whether it is in motion or at rest, encrypting our data and using the proper protection mechanisms will make it worthless for the hacker to use. 

# Overview
* [Securing your cloud-native microservice architechture in Spring: Part 1](https://ordina-jworks.github.io/microservices/2017/09/26/Secure-your-architecture-part1.html)
* [Cryptographic Algorithms](#cryptographic-algorithms)
* [Key Mechanics](#key-mechanics)
* [Cloud-hosted Key management service](#cloud-hosted-key-management-service)
* [Spring Cloud Config Server](#spring-cloud-config-server)

## Cryptographic Algorithms
When implementing our application, every programming language will provide us with a set of known libraries for cryptographic algorithms. 
A big flaw is implementing an algorithm by yourself, the known algorithms have been reviewed, patched and been known for their excellent security. 
These are the most used types that you can use for encryption at rest: 

### Symmetric Encryption
The key used in encrypting data at rest is used for both encrypting and decrypting the data.
This key becomes very vulnerable if anyone gets a hold on it. 
* Well known: [Advanced Encryption Standard encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard){:target="_blank"}

//I would also mention that you can use this key pair to sign your data, so the application would know that it can trust the source of the data.

### Asymmetric Encryption
In asymmetric encryption, a pair of keys are used. A public key that is exposed and encrypts your data and a private key that is only known by the owner that decrypts your data.
This key-pair can also be used to sign your data, so the application knows that it can trust the source of the data. 
* Well known:  [Rivest–Shamir–Adleman encryption](https://en.wikipedia.org/wiki/RSA_(cryptosystem)){:target="_blank"}

## Key Mechanics 
Encryption keys are another aspect of encryption, handling the keys becomes just as sensitive as the data itself. 
That's why we need mechanisms on how keys are stored and shared so attackers can't get a hold on them.

### Key rotation
Encryption key rotation will provide protection especially when the certificate expires, is corrupted or the key management admin is no longer part of the company. 
Lets say, you got a good eye at detecting patterns and detect that the same key is being used for encrypting data.
To avoid this, you rotate your keys, and every time the same data field is encrypted it will result in a different encrypted message.

### JSON Web Key (Set)
We discussed in the [previous post](https://ordina-jworks.github.io/microservices/2017/09/26/Secure-your-architecture-part1.html) about retrieving a JWK(S) to verify our JSON Web Token in our microservice. 
A JWK is a JSON object that represents a cryptographic key that consists of information to verify a JWT. 
If you like to dive into signing JSON documents you can check out this blog post on [Digitally signing your JSON documents](https://ordina-jworks.github.io//security/2016/03/12/Digitally-signing-your-JSON-documents.html#jwk){:target="_blank"}.

JWKS example:

{% highlight json %}
{
"keys": [
  {
    "alg": "RS256",
    "kty": "RSA",
    "use": "sig",
    "x5c": [
      "MIIC+DCCAeCgAwIBAgIJBIGjYW6hFpn2MA0GCSqGSIb3DQEBBQUAMCMxITAfBgNVBAMTGGN1c3RvbWVyLWRlbW9zLmF1dGgwLmNvbTAeFw0xNjExMjIyMjIyMDVaFw0zMDA4MDEyMjIyMDVaMCMxITAfBgNVBAMTGGN1c3RvbWVyLWRlbW9zLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMnjZc5bm/eGIHq09N9HKHahM7Y31P0ul+A2wwP4lSpIwFrWHzxw88/7Dwk9QMc+orGXX95R6av4GF+Es/nG3uK45ooMVMa/hYCh0Mtx3gnSuoTavQEkLzCvSwTqVwzZ+5noukWVqJuMKNwjL77GNcPLY7Xy2/skMCT5bR8UoWaufooQvYq6SyPcRAU4BtdquZRiBT4U5f+4pwNTxSvey7ki50yc1tG49Per/0zA4O6Tlpv8x7Red6m1bCNHt7+Z5nSl3RX/QYyAEUX1a28VcYmR41Osy+o2OUCXYdUAphDaHo4/8rbKTJhlu8jEcc1KoMXAKjgaVZtG/v5ltx6AXY0CAwEAAaMvMC0wDAYDVR0TBAUwAwEB/zAdBgNVHQ4EFgQUQxFG602h1cG+pnyvJoy9pGJJoCswDQYJKoZIhvcNAQEFBQADggEBAGvtCbzGNBUJPLICth3mLsX0Z4z8T8iu4tyoiuAshP/Ry/ZBnFnXmhD8vwgMZ2lTgUWwlrvlgN+fAtYKnwFO2G3BOCFw96Nm8So9sjTda9CCZ3dhoH57F/hVMBB0K6xhklAc0b5ZxUpCIN92v/w+xZoz1XQBHe8ZbRHaP1HpRM4M7DJk2G5cgUCyu3UBvYS41sHvzrxQ3z7vIePRA4WF4bEkfX12gvny0RsPkrbVMXX1Rj9t6V7QXrbPYBAO+43JvDGYawxYVvLhz+BJ45x50GFQmHszfY3BR9TPK8xmMmQwtIvLu1PMttNCs7niCYkSiUv2sc2mlq1i3IashGkkgmo="
    ],
    "n": "yeNlzlub94YgerT030codqEztjfU_S6X4DbDA_iVKkjAWtYfPHDzz_sPCT1Axz6isZdf3lHpq_gYX4Sz-cbe4rjmigxUxr-FgKHQy3HeCdK6hNq9ASQvMK9LBOpXDNn7mei6RZWom4wo3CMvvsY1w8tjtfLb-yQwJPltHxShZq5-ihC9irpLI9xEBTgG12q5lGIFPhTl_7inA1PFK97LuSLnTJzW0bj096v_TMDg7pOWm_zHtF53qbVsI0e3v5nmdKXdFf9BjIARRfVrbxVxiZHjU6zL6jY5QJdh1QCmENoejj_ytspMmGW7yMRxzUqgxcAqOBpVm0b-_mW3HoBdjQ",
    "e": "AQAB",
    "kid": "NjVBRjY5MDlCMUIwNzU4RTA2QzZFMDQ4QzQ2MDAyQjVDNjk1RTM2Qg",
    "x5t": "NjVBRjY5MDlCMUIwNzU4RTA2QzZFMDQ4QzQ2MDAyQjVDNjk1RTM2Qg"
  }
]}
{% endhighlight %}

Explanation properties:

* `alg`: is the algorithm for the key
* `kty`: is the key type
* `use`: is how the key was meant to be used. For the example above sig represents signature.
* `x5c`: is the x.509 certificate chain
* `e`: is the exponent for a standard pem
* `n`: is the modulus for a standard pem
* `kid`: is the unique identifier for the key
* `x5t`: is the thumbprint of the x.509 cert (SHA-1 thumbprint)



## Cloud-hosted Key management service
KMS is a fully managed service that allows you to manage your encryption keys in the cloud.
Most of these KMSs offer the best way for encryption and generate, rotate and destroy your keys. 
But the KMS is vendor lock-in so all your keys will stay on the platform.
To avoid vendor lock-in, we can implement our own open source version for managing our encryption keys. 

A few examples to get an idea of KMS:
* [Google Cloud KMS](https://cloud.google.com/kms/){:target="_blank"}
* [AWS KMS](https://aws.amazon.com/kms/){:target="_blank"}
* [Azure Vault](https://azure.microsoft.com/en-us/services/key-vault/){:target="_blank"}

A few examples of open-source variants:
* [Spring Cloud Config Server](https://cloud.spring.io/spring-cloud-config/){:target="_blank"}
* [Vault](https://www.vaultproject.io/){:target="_blank"}
* [Keywhiz](https://square.github.io/keywhiz/){:target="_blank"}


## Spring Cloud Config Server
The Spring Cloud Config Server provides a centralized external configuration management backed optionally by a Git repository or database.
Using a REST API for external configuration, Config Server supports encryption and decryption of properties and yml files. 
First step is downloading the Java Cryptography Extension on our local pc.
>JCE provides a framework and implementation for encryption, key generation, key agreement and message authentication code algorithms. 
You're not installing JCE itself, because it's packaged within the Java SE binary.
However, you do need to update its policy files from time to time.
[Downloads](http://www.oracle.com/technetwork/java/javase/downloads/jce8-download-2133166.html) are available for Java 6, 7 and 8.
This will allow the config server to use the encryption tool of the JCE.

After the download, the next step will be securing the config server by adding Spring Security to the classpath and configuring your Basic/OAuth2 authentication.
{% highlight maven %}
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
{% endhighlight %}


### Key Management
The config server supports encryption and decryption with a symmetric key or an asymmetric key-pair.
The choice of which key you will need is within your security terms. 
The symmetric key is the easiest way to set up but less secure than the asymmetric one. 
To set up a symmetric key, you just assign a string to the key holder: 
`encrypt.key=<key>`

To configure these asymmetric keys, we will need a keystore created by the keytool utility from the JDK.
The public key will encrypt and the private key will decrypt your data.

To create a keystore you can do something like this in your command line:

{% highlight bash %}
$> keytool -genkeypair -alias <keyname> -keyalg RSA -keysize 4096 -sigalg SHA512withRSA \
  -dname "CN=Config Server,OU=JWorks,O=Ordina,L=Mechelen,S=State,C=BE" \
  -keypass <secret> -keystore config-server.jks -storepass <password>
{% endhighlight %}

This will generate a keystore for the config server to use. 
Place it in your repository project and configure it in your yml.


<div markdown="span" class="alert alert-danger" role="alert"><i class="fa fa-exclamation-circle"></i> <b>Warning:</b> Be aware if you package your keystore within your application jar/war file, the same encryption keys will be used across all of your environments!</div>


Example yml in the config server:

{% highlight yml %}
encrypt:
  key-store:
    location: classpath:config-server.jks // resource location
    password: <password> // to unlock the keystore
    alias: config-server-key // to identify which key in the store is to be used
    secret: <secret>
{% endhighlight %}

### Encryption
To encrypt the data, start up your config server locally and enter this in your command line.

{% highlight bash %}
$> SECRET=$(curl -X POST --data-urlencode secret http://user:password@localhost:<port>/encrypt)
$> echo "datasource.password=$SECRET" >> application-dev.yml
{% endhighlight %}

When the encryption is done, we get an encrypted piece of data in your configuration in the form of:
{% highlight yml %}
spring:
  datasource:
    username: dbuser
    password: '{cipher}FKSAJDFGYOS8F7GLHAKERGFHLSAJ'
{% endhighlight %}

### What to store where?
When designing your config server, you have different options on where and to which our config server has access. 

#### Using a Git repository
The default and most common way most of us use is via private Git repositories where we store our sensitive data where the config server can fetch it.
Be aware, never put configuration inside your code repository, it violates [the twelve-factor app](https://12factor.net/){:target="_blank"} which requires strict separation of config from code. 
Config varies substantially across deploys, code does not.

##### Health checks
You can enable the health check to the config server within the application.
If you do this, always look at which version control would be the best fit, always check when they go into maintenance. 
It could be that they host it in another timezone, which could lead to a cascading failure.
In my opinion, you can just disable the health checks with `spring.cloud.config.server.health.enabled=false` and avoid further failures. 
If you expect that the config server might go down temporarily when your client app starts, please provide a retry mechanism after a failure. 
To enable a retry, first add `spring-retry` to your classpath with `@EnableRetry` annotation and `spring.cloud.config.failFast=true`

#### Using JDBC
New to this list is the support for JDBC. This enables us to store configuration properties inside a relational database. 
By switching the active spring profile to `JDBC` and adding the dependency of `spring-jdbc` to your classpath, Spring Boot will configure the datasource you included on the classpath.
To store the data you will need to set up new tables in your database.
For more information: [using JDBC](http://cloud.spring.io/spring-cloud-static/spring-cloud-config/1.4.0.RELEASE/single/spring-cloud-config.html#_jdbc_backend){:target="_blank"}

#### Using Vault
[HashiCorp's Vault](https://www.vaultproject.io/){:target="_blank"} provides a centralized external management server. 
Vault can manage static and dynamic secrets such as username/password for remote applications/resources and provide credentials for external services such as MySQL, PostgreSQL, Apache Cassandra, MongoDB, Consul, AWS and more.
Spring supports using the [Vault as a backend](http://cloud.spring.io/spring-cloud-static/spring-cloud-config/1.4.0.RELEASE/single/spring-cloud-config.html#_vault_backend){:target="_blank"} for Spring Cloud Config.
If you are using Spring Boot, a quick way to enable Vault is to set your spring profile to `vault`. 
Spring Boot's conditionals will activate all the auto configuration for a connection with the Vault server.

#### Using File System
So when you're working locally on your machine, you can always look at the native profile to activate the file system as your "backend".
But I don't recommend it for use in a deployment environment since it comes with various problems and extra setup.
One of those problems would be high availability, unlike Eureka, the config server doesn't have the concept of peers.
The obvious option is to use a shared file system but it requires extra setup. 

# Conclusion
With the latest technologies coming up, you can expect that our data will be stored in an immutable ledger that is secured by cryptography.
But we have to be aware of the arrival of quantum computers. 
This could make the best encryption algorithms useless. 
But as always, we will find a way to protect ourselves...

# Sources
* [Advanced Encryption Standard encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard){:target="_blank"}
* [Rivest–Shamir–Adleman encryption](https://en.wikipedia.org/wiki/RSA_(cryptosystem)){:target="_blank"}
* [Google Cloud KMS](https://cloud.google.com/kms/){:target="_blank"}
* [AWS KMS](https://aws.amazon.com/kms/){:target="_blank"}
* [Azure Vault](https://azure.microsoft.com/en-us/services/key-vault/){:target="_blank"}
* [The twelve-factor app](https://12factor.net/){:target="_blank"}
* [Using JDBC](http://cloud.spring.io/spring-cloud-static/spring-cloud-config/1.4.0.RELEASE/single/spring-cloud-config.html#_jdbc_backend){:target="_blank"}
* [HashiCorp's Vault](https://www.vaultproject.io/){:target="_blank"} 
* [Vault as a backend](http://cloud.spring.io/spring-cloud-static/spring-cloud-config/1.4.0.RELEASE/single/spring-cloud-config.html#_vault_backend){:target="_blank"}