---
layout: post
authors: [kevin_van_houtte]
title: 'Securing your cloud-native microservice architecture in Spring: part 2'
image: /img/microservices/part1/securitylogo.png
tags: [Microservices, Security, Encryption, Spring, Cloud, Config]
category: Microservices
comments: true
---

Since the rise of the digital era, most enterprises keep their data in a digital format.
But if their sensitive data lacks security, it can cause the data to be unreliable, unstable and unavailable to their business.
We have to be prepared if an attacker breaches in to our network and tries to hack our sensitive data.
Whether it is in-motion or at-rest, encrypting our data and using the proper protection mechanism, will make it worthless for the hacker to use. 

# Overview
Cryptographic Algorithms
Key Mechanics
Cloud-hosted Key management service
Spring Cloud Config Server

# Cryptographic Algorithms
When implementing our application, every programming language will provide us with a set of known libraries for cryptographic algorithms. 
A big flaw is implementing an algorithm by yourself, the known algorithms have been reviewed, patched and been known for their excellent security. 
There are two ways that you can use encryption at rest: 

## Symmetric Encryption
The key used in encrypting data at rest is used for both encrypting and decrypting the data.
This key becomes very vulnerable if anyone gets a hold on it. 
* Well known: [Advanced Encryption Standard encryption]()


## Asymmetric Encryption
In asymmetric encryption, a pair of keys are used. One public key that is exposed and encrypts your data and one private key that is only known by the owner that decrypts your data.
* Wel known:  [Rivest–Shamir–Adleman encryption]()

# Key Mechanics 
Encryption keys are another aspect of encryption, handling the keys become just as sensitive as the data itself. 
That's why we need mechanisms on how keys are stored and shared so attackers can't get a hold on them.

## Key rotation
Encryption key rotation will provide protection especially when the certificate expires, is corrupted or the key management admin is no longer part of the company. 
Lets say, you got a good eye at detecting patterns and detect that the same key is being used for encrypting data.
To avoid this, you rotate your keys, and every time the same data field is encrypted it will result in another encrypted message.

## JSON Web Key (Set)
We discussed in the previous post about retrieving a JWK(S) to verify our JSON Web Token in our microservice. 
A JWK is a JSON object that represents a cryptographic key that consists of information to verify a JWT. 
If you like to dive into Signing JSON documents your can check out this [post](http://localhost:4000/security/2016/03/12/Digitally-signing-your-JSON-documents.html#jwk)

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

* alg: is the algorithm for the key
* kty: is the key type
* use: is how the key was meant to be used. For the example above sig represents signature.
* x5c: is the x509 certificate chain
* e: is the exponent for a standard pem
* n: is the modulus for a standard pem
* kid: is the unique identifier for the key
* x5t: is the thumbprint of the x.509 cert (SHA-1 thumbprint)



# Cloud-hosted Key management service
KMS is a fully managed service that lets you manage encryption for your sensitive data on the cloud.
Most of these KMS's offer the best way for encryption and use rotate and destroy your keys. 
But the KMS is vendor locking so all your keys will stay on the platform.
To avoid vendor locking, we can implement our own open source version for managing our encryption and keys. 

A few examples to get an idea of KMS:
* [Google Cloud KMS](https://cloud.google.com/kms/)
* [AWS KMS](https://aws.amazon.com/kms/)
* [Azure Vault](https://azure.microsoft.com/en-us/services/key-vault/)


<a name="config" />

# Spring Cloud Config Server
The Spring Cloud Config Server provides a centralized external configuration management backed optionally by a git repository or database.
Using a REST API for external configuration, Config Server supports encryption of properties and yml files. 
First step is installing the Java Cryptography Extension on our local pc.
>JCE provides a framework and implementation for encryption, key generation, key agreement and message authentication code algorithms. 
Downloads are available for Java 6, 7 and 8.
This will allow the config server to use the encryption tool of the JCE.

After the installation, the next step will be securing the config server by adding Spring security to the classpath and configuring your Basic/OAuth2 authentication.
{% highlight maven %}
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
{% endhighlight %}


## Key Management
The config server is enabled to encrypt with a symmetric or an asymmetric master key.
The choice of which key you will need is within your security terms. 
The symmetric key is the easiest to set up but less secure than the asymmetric one. 
To set up a symmetric key, you just assign a string to the key holder. 
`encrypt.key=<key>`

I can only recommend to use the asymmetric key with the RSA key-pair.
To configure this asymmetric master key, we will need a keystore created by the keytool utility from the JDK.
The public key will encrypt and the private key will decrypt your data.

To create a keystore you can do something like this in your commandline:

{% highlight bash %}
$> keytool -genkeypair -alias <keyname> -keyalg RSA -keysize 4096 -sigalg SHA512withRSA \
  -dname "CN=Config Server,OU=JWorks,O=Ordina,L=Mechelen,S=State,C=BE" \
  -keypass <secret> -keystore config-server.jks -storepass <password>
{% endhighlight %}

This will generate a keystore for the config server to use. 
Place it in your repository project and configure it in your yml.

Example yml in the config server:

{% highlight yml %}
encrypt:
  key-store:
    location: classpath:config-server.jks // resource location
    password: <password> // to unlock the keystore
    alias: config-server-key // to identify which key in the store is to be used
    secret: <secret>
{% endhighlight %}

## Encryption
Next up is encrypting our data!
To encrypt the data, start up your config server locally and enter this in your command line.

{% highlight bash %}
$> export SECRET=$(curl -X POST --data-urlencode secret http://user:password@localhost:<port>/encrypt)
$> echo "datasource.password=$SECRET" >> application-dev.yml
{% endhighlight %}

When the encryption is done, we get a encrypted piece of data in your configuration in the form of:
{% highlight yml %}
spring:
  datasource:
    username: dbuser
    password: '{cipher}FKSAJDFGYOS8F7GLHAKERGFHLSAJ'
{% endhighlight %}


## What to store where?
When designing your config server, you have different options on where to store and fetch your sensitive data. 

### Using a Git repository
The default and most common way most of us use it is via private git repositories where we store our sensitive data where the config server can fetch it.
Be aware, never put configuration inside your code repository, it violates [the twelve-factor app](https://12factor.net/) which requires strict separation of config from code. 
Config varies substantially across deploys, code does not.

#### Health checks
You can enable your Config Server to health check your repositories by the minute.
If you do this, always look at which version control would be the best fit, always check when they go in to maintenance. 
It could be that they host it in another timezone, which could lead to a cascading failure.
In my opinion, you can just disable the health checks and avoid any failures. 

### Using JDBC
New to this list is the support for JDBC. This enables us to store configuration properties inside a relation database. 
By switching the active spring profile to jdbc and adding the dependency of spring-jdbc to your classpath, Spring Boot will configure the datasource you included on the classpath.
To store the data you will need to set up new tables to your database.
For more information: [using JDBC](http://cloud.spring.io/spring-cloud-static/spring-cloud-config/1.4.0.RELEASE/single/spring-cloud-config.html#_jdbc_backend)


### Using Vault
[HashiCorp's Vault]() provides a centralized external management server. 
Spring supports using the [Vault as a backend](http://cloud.spring.io/spring-cloud-static/spring-cloud-config/1.4.0.RELEASE/single/spring-cloud-config.html#_vault_backend) for Spring Cloud Config.
If you are using Spring Boot, a quick way to enable vault is to set your spring profile to vault. 
Spring Boot's conditionals will activate all the auto configuration for a connection with the Vault server
Vault can manage static and dynamic secrets such as username/password for remote applications/resources and provide credentials for external services such as MySQL, PostgreSQL, Apache Cassandra, MongoDB, Consul, AWS and more.
