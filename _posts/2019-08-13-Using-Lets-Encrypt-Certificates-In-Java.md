---
layout: post
authors: [ken_coenen]
title: 'Using Let''s Encrypt certificates in Java applications'
image: /img/lets-encrypt.png
tags: [Security, TLS, Let's Encrypt, Keycloak]
category: Security
comments: true
---

> At some point in their career, developers come accross the need to work with security certificates.
This article describes how to setup Let's Encrypt, retrieve a certificate, renew it automatically and use the certificate in a Java application for TLS communication.

# Table of contents
1. [Certificate Authorities and Let's Encrypt](#certificate-authorities-and-lets-encrypt)
2. [Installing a Let's Encrypt certificate](#installing-a-lets-encrypt-certificate)
3. [Certificate renewal](#certificate-renewal)
4. [Automating the renewal process](#automating-the-renewal-process)
5. [Using the certificates in a Java application](#using-the-certificates-in-a-java-application)
6. [Resources](#resources)

# Certificate Authorities and Let's Encrypt

When you want to enable HTTPS on your website or need certificates for TLS communication, you'll need to request this certificate from a [Certificate Authority](https://en.wikipedia.org/wiki/Certificate_authority){:target="_blank" rel="noopener noreferrer"} (CA).
It acts as a [trusted third party](https://en.wikipedia.org/wiki/Trusted_third_party){:target="_blank" rel="noopener noreferrer"} between two parties that need to communicate with each other.
[Let's Encrypt](https://certbot.eff.org/){:target="_blank" rel="noopener noreferrer"} is such a Certificate Authority.
It is their mission to give everyone a secure and privacy-respecting web experience.
That's why they issue certificates free of charge.

# Installing a Let's Encrypt certificate

Assuming that you have shell access to your server, Let's Encrypt recommends to use [Certbot ACME Client](https://certbot.eff.org/){:target="_blank" rel="noopener noreferrer"}, since it can automate certificate issuance and installation with zero downtime.

Certbot is a free, open source software tool for automatically using Let’s Encrypt certificates on manually-administrated websites to enable HTTPS.

Clear installation instructions can be found on the Certbot website.
Select your web server software (Apache, Nginx, ...) and operating system and Certbot provides the installation instructions.

> You can check your operating system on Linux by executing `cat /etc/os-release`.

Please note that these instructions also include setting up HTTPS for your website, which for this tutorial isn't necessary.
We'll use the certificate in another way, for TLS communication in a Java application.

For Ubuntu, the following steps are required to install Certbot.
See also [Apache on Ubuntu 16.04 (xenial)](https://certbot.eff.org/lets-encrypt/ubuntuxenial-apache){:target="_blank" rel="noopener noreferrer"}.

Certbot is installed using APT (Advanced Package Tool), a tool for installing and removing applications on Debian based systems. This tool searches in its repositories for software distributions.
Before you can install Certbot, you'll need to add the Certbot PPA (Personal Package Archive) to your list of available APT repositories.

```
sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository universe
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
```

Run the following command to install Certbot.

```
sudo apt-get install certbot python-certbot-apache
```

By default, `certbot` retrieves a certificate and installs it immediately on your web server by adding an extra parameter, eg. `--apache` for [Apache HTTP Server](https://httpd.apache.org/){:target="_blank" rel="noopener noreferrer"}.
For our situation, it is enough to retrieve a certificate.
This is done by adding the `certonly` parameter to the command as follows:

```
certbot certonly
```

You can find the installed Let's Encrypt certificates in the `/etc/letsencrypt/live` folder on your file system.

# Certificate renewal

Let's Encrypt CA issues short-lived certificates of 90 days.
Therefore certificates must be renewed at least once in 3 months.

Certificate renewal is actually quite simple with Certbot.
You can renew the certificates with the following command:

```
certbot renew
```

> Add `--dry-run` to the command if you want to try it out without consequences.

Executing this command multiple times is not a problem.
When the certificate is not due for renewal, nothing will happen and you'll receive an output comparable to this:

```
Saving debug log to /var/log/letsencrypt/letsencrypt.log

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Processing /etc/letsencrypt/renewal/mydomain.be.conf
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Cert not yet due for renewal
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

The following certs are not due for renewal yet:
  /etc/letsencrypt/live/mydomain.be/fullchain.pem expires on 2019-09-14 (skipped)
No renewals were attempted.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
```

# Automating the renewal process

Certbot [automatically renews](https://certbot.eff.org/docs/using.html?highlight=hooks#automated-renewals){:target="_blank" rel="noopener noreferrer"} certificates on most operating systems now.

Check your operating system's crontab (typically in `/etc/crontab/` and `/etc/cron.*/*` and systemd timers (`systemctl list-timers`).
On our Ubuntu system we executed `systemctl list-timers` and found a `certbot.timer`.

```
NEXT                          LEFT          LAST                          PASSED       UNIT                         ACTIVATES
Wed 2019-08-14 10:47:41 CEST  1h 19min left Tue 2019-08-13 18:00:03 CEST  15h ago      certbot.timer                certbot.service
```

It basically boils down to the `certbot renew` command being executed periodically.

> If your Linux distribution package didn't install the cronjob, you can easily set this up yourself.
Since we need to automate the keystore and truststore creation as well, you can look at the section [Automate the keystore and truststore creation process](#automate-the-keystore-and-truststore-creation-process) for more information on creating cronjobs.


# Using the certificates in a Java application

All generated keys and issued Let's Encrypt certificates can be found in the `/etc/letsencrypt/live` folder on your file system.
We will now see how we can import them in Java keystore files to use them in a Java application.

## Importing certificates into `cacerts`

The first way you can use certificates in a JVM is to add them to the `cacerts` file of your Java distribution.

Every JRE has its own keystore, which contains all Certificate Authorities it trusts.
This is also referred to as a `truststore`.
This `truststore` is stored as a file called `cacerts`.
It is typically located in `$JAVA_HOME/jre/lib/security` assuming `$JAVA_HOME` is where your JRE or JDK is installed.
The default password for this keystore is `changeit`.

The following command imports the certificates into your JRE truststore.

```
keytool -import -alias mydomain.be \
	-keystore $JAVA_HOME/jre/lib/security/cacerts \
	-file /etc/letsencrypt/live/mydomain.be/cert.pem \
	-storepass changeit \
	-noprompt
```

Please note that adding certificates to `cacerts` is not always the best solution.
Although technically it is a fully functional keystore file, its purpose is mainly for determining which third-party certificates to trust.
On top of this, it is tied to your Java installation and when you install another JRE or JDK, you'll need to add the certificates again.

Our preferred approach is to add your own certificates to a keystore and the third-party certificates to a separate truststore.
Continue reading to see how you can do that.

## Creating a separate `.keystore` file

To use a certificate in a Java application, the preferred way is to add it to a separate `.keystore` file.

The Java Runtime Environment (JRE) ships with a tool called `keytool` to create certificates and manipulate key stores.
Adding certificates to a keystore can be done by using OpenSSL and the `keytool`.

You cannot import multiple public and private `.pem` certificates directly in a keystore, so you'll first need to add all `.pem` files to a [PKCS 12](https://en.wikipedia.org/wiki/PKCS_12){:target="_blank" rel="noopener noreferrer"} archive.
We do this with the OpenSSL tool with the following command.

```
openssl pkcs12 -export \
	 -in /etc/letsencrypt/live/mydomain.be/cert.pem \
	 -inkey /etc/letsencrypt/live/mydomain.be/privkey.pem \
	 -out /tmp/mydomain.be.p12 \
	 -name mydomain.be \
	 -CAfile /etc/letsencrypt/live/mydomain.be/fullchain.pem \
	 -caname "Let's Encrypt Authority X3" \
	 -password pass:changeit
```

Change `mydomain.be` with your own DNS name.

The next step is to import the certificates into a `.keystore` file.

```
keytool -importkeystore \
	-deststorepass changeit \
	-destkeypass changeit \
	-deststoretype pkcs12 \
	-srckeystore /tmp/mydomain.be.p12 \
	-srcstoretype PKCS12 \
	-srcstorepass changeit \
	-destkeystore /tmp/mydomain.be.keystore \
	-alias mydomain.be
```

You can now load the keystore at location `/tmp/mydomain.be.keystore` in your Java application.

> Please note that you not only need to create a keystore with your own certificates, but also a truststore with the trusted third-party certificates.
However, the approach is exactly the same.

## Automate the keystore and truststore creation process

Create a shell script `/home/<username>/renew-keystore.sh` with the following content:

```
#!bin/bash

# Create keystore
echo "Refreshing '~/ssl/mydomain.be.keystore'"
openssl pkcs12 -export \
	 -in /etc/letsencrypt/live/mydomain.be/cert.pem \
	 -inkey /etc/letsencrypt/live/mydomain.be/privkey.pem \
	 -out /tmp/mydomain.be.p12 \
	 -name mydomain.be \
	 -CAfile /etc/letsencrypt/live/mydomain.be/fullchain.pem \
	 -caname "Let's Encrypt Authority X3" \
	 -password pass:changeit
keytool -importkeystore \
	-deststorepass changeit \
	-destkeypass changeit \
	-deststoretype pkcs12 \
	-srckeystore /tmp/mydomain.be.p12 \
	-srcstoretype PKCS12 \
	-srcstorepass changeit \
	-destkeystore /tmp/mydomain.be.keystore \
	-alias mydomain.be
# Move certificates to other servers
echo "Copy '~/ssl/mydomain.be.keystore' to cluster servers"
cp /tmp/mydomain.be.keystore /home/admin_jworks/ssl/mydomain.be.keystore
scp  /tmp/mydomain.be.keystore cc-backend-node-02:/home/admin_jworks/ssl/mydomain.be.keystore
scp  /tmp/mydomain.be.keystore cc-frontend-node-01:/home/admin_jworks/ssl/mydomain.be.keystore

# Create truststore
echo "Refreshing '~/ssl/theirdomain.be.keystore'"
rm theirdomain.be.keystore
openssl s_client -connect theirdomain.be:443 -showcerts </dev/null 2>/dev/null|openssl x509 -outform DER >theirdomain.der
openssl x509 -inform der -in theirdomain.der -out theirdomain.pem
keytool -import \
	-alias theirdomain \
	-keystore theirdomain.be.keystore \
	-file ./theirdomain.pem \
	-storepass theirdomain \
	-noprompt
echo "Copy '~/ssl/theirdomain.be.keystore' to cluster servers"
cp theirdomain.be.keystore /home/admin_jworks/ssl/
sudo scp ssl/theirdomain.be.keystore cc-backend-node-02:/home/admin_jworks/ssl/
sudo scp ssl/theirdomain.be.keystore cc-frontend-node-01:/home/admin_jworks/ssl/
```

You might not need everything from this script.
It does more than creating a new keystore:

* It creates the keystore `mydomain.be.keystore` as described in the previous section [Creating and using a separate `.keystore` file](#creating-a-separate-keystore-file)
* It creates a truststore by connecting to the third-party server, writing their certificate to a file called `theirdomain.pem` and importing that file in `theirdomain.be.keystore`
* It also copies both keystore and truststore files to other servers in our cluster

The command to execute this shell script is installed in one of the following locations: `/etc/crontab/`, `/etc/cron.*/*` or `systemctl list-timers`.
eg. To execute the script once every hour, you can add it to `/etc/cron.hourly`.

We will edit the contents of the crontab file on the system with `crontab -e`.
The line should start with a cron expression telling the system when to execute the task followed by the command to be executed.

```
Example of job definition:
.---------------- minute (0 - 59)
| .------------- hour (0 - 23)
| | .---------- day of month (1 - 31)
| | | .------- month (1 - 12) OR jan,feb,mar,apr ...
| | | | .---- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat
| | | | |
* * * * * command to be executed
```

You can read more on cron expressions in the Baeldung blog [A Guide To Cron Expressions](https://www.baeldung.com/cron-expressions){:target="_blank" rel="noopener noreferrer"}.

The following line in crontab makes sure our script is executed every hour.

```
0 * * * * bash /home/<username>/renew-keystore.sh >> /var/log/renew-keystore.log 
```

Remember to set execute permissions on the created script to allow the system to run the script.

```
chmod +x /home/<username>/renew-keystore.sh
```

There's no need to restart something after changing the `crontab` file.
Cron will examine the modification time on all crontabs and reload those which contain changes.

## Using keystores and truststores in a Java application

### Spring Boot configuration properties

We'll be using Spring Boot to externalize our TLS configuration.
First, we add properties to point to our keystore and truststore archives on the filesystem and provide the necessary passwords.

> Please note that there are existing Spring Boot properties prefixed with `server.ssl` to configure TLS.
However, these properties are used for securing connections to your Tomcat server.
They will not configure HTTP clients used within your application.
We also need to configure more information about the service we're consuming, eg. the endpoint url.
We therefore specify our own properties.

```
myprefix:
    client:
        remote-service-endpoint-url: https://www.theirdomain.be/services/3.0
        trust-store: /ssl/theirdomain.be.jks
        trust-store-password: changeit
        key-store: /ssl/mydomain.be.keystore
        key-store-password: changeit
```

Then we load those properties in a `@ConfigurationProperties` object.

```
@Configuration
@ConfigurationProperties("myprefix.client")
public class MyClientProperties {
    private String remoteServiceEndpointUrl;
    private String keyStore;
    private String keyStorePassword;
    private String trustStore;
    private String trustStorePassword;
    // Getters and setters
}
```

This class is instantiated by Spring and can be autowired in other beans.

### Java's `SSLContext` and HTTP clients

In Java there are several frameworks you can use to establish an HTTP connection.

* Java's built-in `HttpURLConnection`
* Apache HttpComponents [HttpClient](http://hc.apache.org/httpcomponents-client-4.5.x/index.html){:target="_blank" rel="noopener noreferrer"} -- Please note that this is the successor of [Commons HttpClient](http://hc.apache.org/httpclient-legacy/index.html){:target="_blank" rel="noopener noreferrer"}.
If you'll be using this client, make sure you're importing the `org.apache.httpcomponents` version.
* [OkHttp](https://square.github.io/okhttp/){:target="_blank" rel="noopener noreferrer"}

Java supports TLS communication through its `javax.net.ssl.SSLContext` class.

We'll be using Apache's [HttpClient](http://hc.apache.org/httpcomponents-client-4.5.x/index.html){:target="_blank" rel="noopener noreferrer"} to setup TLS communication.
This library has builder classes with which you can easily create an `SSLContext`.

Add the following Maven dependencies.

```
<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>httpcore</artifactId>
    <version>${httpcore.version}</version>
</dependency>
<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>httpclient</artifactId>
    <version>${httpclient.version}</version>
</dependency>
```

Now you can use the `org.apache.http.ssl.SSLContexts` and `org.apache.http.ssl.SSLContextBuilder` to create an `javax.net.ssl.SSLContext`.

```
SSLContext sslContext = SSLContexts
    .custom()
    .loadKeyMaterial(Paths.get(properties.getKeyStore()).toFile(), properties.getKeyStorePassword().toCharArray(), properties.getKeyStorePassword().toCharArray())
    .loadTrustMaterial(Paths.get(properties.getTrustStore()).toFile(), properties.getTrustStorePassword().toCharArray())
    .build();
```

This `SSLContext` can be used to create an Apache `org.apache.http.impl.client.CloseableHttpClient`.
We create the `CloseableHttpClient` with the `org.apache.http.impl.client.HttpClients` utility class.

```
final CloseableHttpClient client = HttpClients
    .custom()
    .setSSLContext(sslContext)
    .build();
```

If you don't have the `.setSSLContext(sslContext)`, please check your `org.apache.httpcomponents:httpclient` version.

Each HTTP request executed using this client will be sent over a TLS connection.

> Please note that you also have the possibility to set the following Java system properties and ensure all communication uses TLS.
```
System.setProperty("javax.net.ssl.enabled", "true");
System.setProperty("javax.net.ssl.trustStore", properties.getTrustStore());
System.setProperty("javax.net.ssl.trustStorePassword", properties.getTrustStorePassword());
System.setProperty("javax.net.ssl.keyPassword", properties.getKeyStorePassword());
System.setProperty("javax.net.ssl.keyStore", properties.getKeyStore());
System.setProperty("javax.net.ssl.keyStorePassword", properties.getKeyStorePassword());
System.setProperty("javax.net.ssl.clientAuth", "need");
```
Although it's a valid possibility, these are settings for the entire system.
On top of that, when you need to integrate with multiple third-parties and are dealing with multiple trusted parties and multiple public/private keypairs, it can become a mess to add everything to single keystore and truststore files.

### Using the keystore with Spring REST

In the previous section we learned how to create an `javax.net.ssl.SSLContext` and an Apache HttpComponents `CloseableHttpClient`.

Calling REST endpoints with Spring REST is done by using the `org.springframework.web.client.RestTemplate` class.
This class is part of the `spring-web` module, which is automatically added by adding the `spring-boot-starter-web` dependency.

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

Spring's `RestTemplate` is an abstraction of the different HTTP clients we can use in Java.
Under the hood, when a request is executed on the `RestTemplate`, Spring uses the passed `org.springframework.web.client.ClientHttpRequestFactory` to create a `org.springframework.http.client.ClientHttpRequest`, executes the request and transforms it to a `org.springframework.http.client.ClientHttpResponse`.
There's a specific implementation of these classes for each HTTP client.

For example, for Apache's HttpComponents HttpClient, you can find classes with the prefix `HttpComponents`:

* `org.springframework.http.client.HttpComponentsClientHttpRequestFactory`
* `org.springframework.http.client.HttpComponentsClientHttpRequest`
* `org.springframework.http.client.HttpComponentsClientHttpResponse`

We'll use `HttpComponentsClientHttpRequestFactory` to customize the `RestTemplate` and we register it with the Spring context by annotating the method with `@Bean` in one of the configuration classes.

```
@Bean
public RestTemplate restTemplate() throws Exception {
    return new RestTemplate(new HttpComponentsClientHttpRequestFactory(client));
}
```

Please note that in the above code snippet, `client` must be an instance of Apache's HttpComponents HttpClient, eg. the `CloseableHttpClient` we created in the previous section.


### Using the keystore with Spring WS

From time to time you have to integrate with a SOAP web service from the customer or a third party and use TLS communication when doing so.

In the following example, we'll use [Spring Web Services](https://spring.io/projects/spring-ws){:target="_blank" rel="noopener noreferrer"} to implement this.
Spring WS defines an interface `org.springframework.ws.client.core.support.WebServiceGatewaySupport` of which you can create an instance.
It uses an attribute of the type `org.springframework.ws.transport.WebServiceMessageSender` to do the actual communication.
Like with Spring REST, there are specific implementations for each HTTP client library.
For Apache HttpComponents HttpClient, this is the `org.springframework.ws.transport.http.HttpComponentsMessageSender`.
It accepts an `org.apache.http.client.HttpClient` to use for low-level communication.

Your application must provide a bean instance of the type `WebServiceGatewaySupport`.
On this object, you can set an instance of a `WebServiceMessageSender`.


```
@Bean
public Jaxb2Marshaller marshaller() {
    Jaxb2Marshaller marshaller = new Jaxb2Marshaller();
    marshaller.setContextPath("fully.qualified.package.name.of.generated.sources");
    return marshaller;
}

@Bean
public MyClient myClientSecure(Jaxb2Marshaller marshaller) {
    MyClient client = new MyClient(properties);
    String url = properties.getRemoteServiceEndpointUrl();
    client.setDefaultUri(url);
    client.setMarshaller(marshaller);
    client.setUnmarshaller(marshaller);
    client.setMessageSender(new HttpComponentsMessageSender(client));
    return client;
}
```

Like in the Spring REST example, `client` must be an instance of Apache's HttpComponents HttpClient, eg. the `CloseableHttpClient` we created earlier.

Calling a service with the `org.springframework.ws.client.core.WebServiceTemplate` of our `MyClient` bean now uses the configured keystore and truststore.
You can call a SOAP endpoint with `getWebServiceTemplate().marshalSendAndReceive(...)`.

Please note that our `MyClient` class extends `WebServiceGatewaySupport`.
The code snippet below also includes a sample call.
`RequestType` and `ResponseType` are classes generated from the `wsdl` file and typically reside in the `target/generated-sources` directory of your project.

```
@Component
public class MyClient extends WebServiceGatewaySupport {
    public ResponseType getMonthlyAlertDetail(BigInteger alertId, String apiKey) {
        return JAXBElement<ResponseType> response = (JAXBElement<ResponseType>) getWebServiceTemplate()
                .marshalSendAndReceive(new RequestType(...), message -> ((SoapMessage) message).setSoapAction("SoapOperationName"));
    }
}
```

### Using the keystore in Keycloak

If you're using a product like eg. [Keycloak](https://www.keycloak.org/){:target="_blank" rel="noopener noreferrer"} on your server, the way of using the certificate stays the same.
It's even easier, as you don't need to write code to read the `.keystore` file.
You can point to the `.keystore` file in the configuration files for that product.

This is an example Keycloak configuration in the `standalone.xml` file:

```
<security-realm name="ApplicationRealm">
    <server-identities>
        <ssl>
            <keystore path="/tmp/mydomain.be.keystore" relative-to="jboss.server.config.dir" keystore-password="changeit" alias="mydomain.be" key-password="changeit" generate-self-signed-certificate-host="localhost"/>
        </ssl>
    </server-identities>
</security-realm>
```

# Resources

* [Let's Encrypt Getting Started](https://letsencrypt.org/getting-started/){:target="_blank" rel="noopener noreferrer"}
* [Certbot](https://certbot.eff.org/){:target="_blank" rel="noopener noreferrer"}
* [Certbot CLI Renewing certificates](https://certbot.eff.org/docs/using.html?highlight=renew#renewing-certificates){:target="_blank" rel="noopener noreferrer"}
* [OpenSSL](https://www.openssl.org/){:target="_blank" rel="noopener noreferrer"}
* [Oracle Java keytool documentation](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html){:target="_blank" rel="noopener noreferrer"}
* [PKCS 12 information](https://en.wikipedia.org/wiki/PKCS_12){:target="_blank" rel="noopener noreferrer"}
* [Spring Web Services](https://spring.io/projects/spring-ws){:target="_blank" rel="noopener noreferrer"}