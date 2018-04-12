---
layout: post
authors: [tim_ysewyn]
title: 'HTTP Public Key Pinning with Spring Security'
image: /img/spring-security-logo.png
tags: [Spring, Security, Spring Security, HPKP, Public Key Pinning]
category: Spring
comments: true
---
## What kind of sorcery is this?

HTTP Public Key Pinning, or short HPKP, is a security mechanism which allows HTTPS websites to resist impersonation by attackers using mis-issued or otherwise fraudulent certificates.
This was standardized in [RFC 7469](http://tools.ietf.org/html/rfc7469) and creates a new opportunity for server validation. Instead of using static certificate pinning, where public key hashes are hardcoded within an application, we can now use a more dynamic way of providing this public key hashes.
One caveat to remember is that HPKP uses a Trust On First Use ([TOFU](https://en.wikipedia.org/wiki/Trust_on_first_use)) technique.

<br />

## How does this work?

A list of public key hashes will be served to the client via a special HTTP header by the web server, so clients can store this information for a given period of time.
On subsequent connections within previous given period of time, the client expects a certificate containing a public key whose fingerprint is already known via HPKP.
I **strongly** encourage you to read [this article](https://timtaubert.de/blog/2014/10/http-public-key-pinning-explained/) by Tim Taubert, where he explains what keys you should pin and what the different tradeoffs are.

<br />

Imagine you want to terminate the connection between the client and a malicious server for your main domain and all of your subdomains, but also want to be notified when such events happen.
In the next paragraph you can find the implementation details.

<br />

The web server needs to send following header to the connecting client with the first response

{% highlight bash %}
    Public-Key-Pins:
        max-age=5184000;
        pin-sha256="d6qzRu9zOECb90Uez27xWltNsj0e1Md7GkYYkVoZWmM=";
        pin-sha256="E9CZ9INDbd+2eRQozYqqbQ2yXLVKB9+xcprMF+44U1g=";
        report-uri="https://example.net/hpkp-report";
        includeSubdomains
{% endhighlight %}

By specifying the **Public-Key-Pins** header the client MUST terminate the connection without allowing the user to proceed anyway. In this example, **pin-sha256="d6qzRu9zOECb90Uez27xWltNsj0e1Md7GkYYkVoZWmM="** pins the server's public key used in production. The second pin declaration **pin-sha256="E9CZ9INDbd+2eRQozYqqbQ2yXLVKB9+xcprMF+44U1g="** also pins the backup key. **max-age=5184000** tells the client to store this information for two month, which is a reasonable time limit according to the IETF RFC. This key pinning is also valid for all subdomains, which is told by the **includeSubdomains** declaration. Finally, **report-uri="https://www.example.net/hpkp-report"** explains where to report pin validation failures.
<br /><br />

## So how can we implement this with Spring Security?

### Retrieving  the list of public key hashes
We first need to get a list of public key hashes. Currently the standard only supports the SHA256 hashing algorithm. The following commands will help you extract the Base64 encoded information:

##### From a key file

{% highlight bash %}
	openssl rsa -in my-key-file.key -outform der -pubout | openssl dgst -sha256 -binary | openssl enc -base64
{% endhighlight %}

##### From a Certificate Signing Request (CSR)

{% highlight bash %}
	openssl req -in my-signing-request.csr -pubkey -noout | openssl rsa -pubin -outform der | openssl dgst -sha256 -binary | openssl enc -base64
{% endhighlight %}

##### From a certificate

{% highlight bash %}
	openssl x509 -in my-certificate.crt -pubkey -noout | openssl rsa -pubin -outform der | openssl dgst -sha256 -binary | openssl enc -base64
{% endhighlight %}

##### From a running web server

{% highlight bash %}
	openssl s_client -servername www.example.com -connect www.example.com:443 | openssl x509 -pubkey -noout | openssl rsa -pubin -outform der | openssl dgst -sha256 -binary | openssl enc -base64
{% endhighlight %}

<br />
For now we will assume we got 2 public keys:

* Our active production certificate: `d6qzRu9zOECb90Uez27xWltNsj0e1Md7GkYYkVoZWmM=`
* Our backup production certificate: `E9CZ9INDbd+2eRQozYqqbQ2yXLVKB9+xcprMF+44U1g=`

### Configuring Spring Security
As of version **4.1.0.RC1**, which will be released March 24th 2016, the `HpkpHeaderWriter` has been added to the security module. The 2 easiest ways to implement this feature is either by **Java configuration** or by using the older, but still supported, **XML configuration**. Below you can find both solutions:

##### Java config
{% highlight java %}

	@EnableWebSecurity
	public class HpkpConfig extends WebSecurityConfigurerAdapter {
		@Override
		protected void configure(HttpSecurity http) throws Exception {
			http.httpPublicKeyPinning()
				.addSha256Pins("d6qzRu9zOECb90Uez27xWltNsj0e1Md7GkYYkVoZWmM=", "E9CZ9INDbd+2eRQozYqqbQ2yXLVKB9+xcprMF+44U1g=")
				.reportOnly(false)
				.reportUri("http://example.net/hpkp-report")
				.includeSubDomains(true);
		}
	}

{% endhighlight %}

##### XML config

{% highlight xml %}

	<http>
		<!-- ... -->

		<headers>
			<hpkp
				report-only="false"
				report-uri="http://example.net/hpkp-report"
				include-subdomains="true">
				<pins>
					<pin>d6qzRu9zOECb90Uez27xWltNsj0e1Md7GkYYkVoZWmM=</pin>
					<pin>E9CZ9INDbd+2eRQozYqqbQ2yXLVKB9+xcprMF+44U1g=</pin>
				</pins>
			</hpkp>
		</headers>
	</http>

{% endhighlight %}