---
layout: post
authors: [tim_de_grande]
title: "Browser Security Features"
image: /img/security/padlock_code.jpg
tags: [Security,Browser features, Response headers]
category: Security
comments: true
permalink: conference/2017/09/18/Browser-security-features.html
---
# Browser security features
Browsers nowadays come with a ton of security features built-in.
These features are there to protect the people using your application as well as protecting your application from malicious others.
Most of these features are quite easy to implement, however for some of them (such as key-pinning) you have to be careful not to break your site.
It's this danger, combined with the lack of knowledge, that prevents people from taking full advantage of them.

## Table of contents
1. [Transport Layer Security](#transport-layer-security)
2. [HTTP Strict Transport Security](#http-strict-transport-security)
3. [Public Key Pinning](#public-key-pinning)
4. [Content Security Policy](#content-security-policy)
5. [Subresource Integrity](#subresource-integrity)
6. [Cookie Protection](#cookie-protection)
7. [Conclusion](#conclusion)

## Transport Layer Security
The first layer of defense is not a new one at all: Transport Layer Security (TLS).
TLS is sometimes (incorrectly) referred to as SSL (Secured Socket Layer). 
In reality SSL is an obsolete technology, with TLS being its successor, but the name stuck.

Having said this, why should you use TLS? 
First of all, most of the features described below *only* work when you're on a secured connection.
Besides that, it guarantees the end user that the site they're communicating with is actually the site they think it is.
It also provides the guarantee that the content they see was not tampered with while travelling over the network.

Another thing TLS brings to the table is speed: it used to be true that a secure connection was slower than an unsecured one.
Modern hardware however is more than up to the task of handling this efficiently for you.
Besides that, HTTP/2 is *only* available over a secure connection and it allows for faster page loads.
Have a look at [HTTP vs HTTPS](http://www.httpvshttps.com/){: target="_blank" } for a demo of the difference.

Since speed should no longer prevent you from switching to HTTPS, there's only cost.
Even that is no longer true: a simple [Domain Validation](https://en.wikipedia.org/wiki/Domain-validated_certificate){: target="_blank"} certificate can be obtained for free.
But even if you need more protection, an [Extended Validation](https://en.wikipedia.org/wiki/Extended_Validation_Certificate){: target="_blank"} certificate can be had for as little as $300 per year.

### How hard is it?
The main issue is that all resources you use on your site should be served over HTTPS.
This means that all third parties should use TLS as well.
Furthermore, it depends on the complexity of your site.
Nick Craver wrote an extensive [blog post](https://nickcraver.com/blog/2017/05/22/https-on-stack-overflow/){: target="_blank"} on their road to switching to HTTPS.

### Should you activate this on your site? 
Absolutely! 
Modern browsers are shifting from notifying users that a page is secure to warning them that it isn't.
On top of that, Google gives a slight ranking boost to HTTPS sites.

## HTTP Strict Transport Security
Once your server is properly configured to use TLS, your next step is to redirect your users to the secure version.
You could do this by simply adding a redirect-rule in your web server for the non-secure pages.
This means that users will still first connect to your non-secure site, allowing a potential attacker to intercept the request and do his nefarious deeds.
Wouldn't it be nice if you could tell the browser to just go straight to the secure version?
That's the thinking behind the HSTS (HTTP Strict Transport Security) header. 

HSTS simply tells the browser that you're expecting it to use HTTPS for a certain time.
As a result, the browser will *automatically* replace `http://` with `https://` **before** making the call.
This means that even following a link that explicitly defines `http://` will instead be called using a secure connection.

The configuration of HSTS is as easy as can be: you simply add the following header to your response:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

This will tell the browser that for the next 365 days, it should connect to your domain using HTTPS.
The `includesubdomains` directive tells the browser that your subdomains should also be called using https.
Setting the `max-age` to 0 tells the browser that you no longer wish your domain to be HSTS-enabled. 

### HSTS preload
Of course in this scenario, the user's first connection will still take place over an unsecured connection.
This would offer an attacker a brief period in which he can still hijack the connection.
To prevent this, most major browsers (Chrome, Firefox, Safari, Edge, IE11 and Opera) offer an HSTS preload list.
Domains on this list will automatically be loaded over HTTPS from the start, without having to go through the HTTP -> HTTPS redirect.
If you want your domain to be included in this list, you should add the `preload` directive to the HSTS header.

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

Afterwards, you can register yourself for the [HSTS Preload List](https://hstspreload.org/){: target="_blank" }.

### Are there any risks?
Activating HSTS does offer some risks:
* If you include the `includesubdomains` directive, you tell the browser that *all* subdomains need to be retrieved over HTTPS.
  If your internal applications are on a subdomain (e.g. `internal.example.com`), you'll block access to those that haven't enabled TLS yet.
* Adding the `preload` directive is even more dangerous because this tells browser makers to hardcode your HSTS settings.
  If you've made a mistake in the setup, it can take a long time to be removed from the list. 
  Since this list is *in* the browser, you'll affect both your existing and your new users.
These risks can be mitigated through extensive testing and conservative settings. 
Start with a short `max-age` and slowly increase its length, don't include subdomains if you're not 100% sure that *all* subdomains need to be included
and perhaps most importantly, **don't** activate preload unless you're 100% sure that everything works as intended.

### Should I activate HSTS?
For those (subdomains) where TLS is enabled, you should start rolling out HSTS (while keeping in mind the warnings above).

## Public key pinning
Alright, now you've secured your site with HTTPS, and you've made sure your users can't fall victim to a Man in the Middle attack.
Or have you?
It's true that HSTS will make sure that the user only connects using a secured connection, but that doesn't mean the HTTPS connection is actually made to **your** server.
Over the last couple of years, there were several incidents where malicious actors were able to generate valid certificates for domains they didn't control.
When this happens, your users will think they're safe (as their browser shows the green padlock), but the attacker can still manipulate your content.
To protect yourself against this, there's a mechanism called "HTTP Public Key Pinning" (HPKP [[1](#fn1)]).
With HPKP you "pin" the public key of your TLS certificate to the browser.
In the future, that browser will compare the public key that's actually used for the TLS connection, with the pinned one and, if they don't match, refuse the connection altogether.
![HPPK error](/img/2017-security-features/hpkp-error.png){: .image height="245px" }

An HPKP header looks like this:

```
public-key-pins:pin-sha256="YLh1...uihg=";pin-sha256="9dNi...Dwg=";pin-sha256="Vjs...eWys=";max-age=2592000;includeSubdomains;report-uri="report-uri"
```

The `max-age` directive tells the browser for how long these pins are valid. 
You can use `report-uri` to get a report when an invalid certificate is used.
`includesubdomains` makes sure that the policy also applies to your subdomains.
Finally, there are the actual pins.
You need to pin at least 2 fingerprints: 1 that should be active at the moment and 1 that isn't.

### What to pin?
First of all, you need to pin at least one of the keys in your certificate chain.
While you can pin the key of the actual certificate, that might not be the best idea.
Doing this means that you need to update the keys every time your certificate is changed or you will risk your users being unable to visit your site.
Alternatively, you could pin the key for the root certificate of your CA (Certificate Authority).
While this is a lot safer, it does mean that if your CA, or any of its intermediates is compromised, they could issue valid certificates for your site.
Finally, you have the option to pin the key to the intermediate certificate. 
Doing so limits the attack surface to that intermediate, while it also allows you to roll out new certificates whenever you need to.
Of course you can't control when your CA will change their intermediate certificate, so that's a danger in its own.

Besides that you also need to have a second key pinned that's *not* in your current certificate chain, otherwise your HPKP header will be ignored.
Fortunately, you don't have to have certificates ready for this.
It's enough to pin the public key of a CSR (Certificate Signing Request).
Obviously, you can't use the CSR of your current certificate (as that would be valid for this chain), so you'll need to create a backup CSR.
You'll need to keep this CSR and the associated private key in a secure location, because you don't want these to be compromised together with the original.

### report-uri
The `report-uri` directive is used to tell the browser where to send reports if it encounters an invalid certificate.
The browser will POST a JSON message to the URL you specify here.
If you don't want to implement your own processing of these reports, have a look at [report-uri.io](https://report-uri.io/){: target="_blank" }
It will process the reports from your site and display the results in a nice format, allowing you to take action when you see something that's wrong.

### Report-only
Besides the normal HPKP header, there's also the report-only variant: `Public-Key-Pins-Report-Only`.
This header has the exact same specifications, **but** it won't block access to your site if there's no valid pin.
As the name says, it will simply report violations to the `report-uri`.
Obviously, this header isn't meant to increase the security of your site on its own, rather it's a way to help you on your way to a full HPKP implementation.

### Dangers
HPKP is quite a dangerous header: it's quite easy to commit "pinning-suicide".
Pin the wrong certificate, have a CA change keys on you or have something else go wrong and your site is inaccessible until your users' `max-age` expires.
Be careful rolling out this one as it's way too easy to shoot yourself in the foot.

### Should I use it?
This header has some serious dangers associated with it.
It's not enough to know that the current configuration is correct, you also need to be sure that you're equipped to deal with certificate updates without breaking the site.
And then you need to be sure that you've got a backup in place in case you ever want to switch CAs.
Unless you're 100% sure that this won't be an issue, hold off for now as it's too easy to DoS your own site.

## Content Security Policy
Even though your connection is secured with TLS, that doesn't mean that the content can't be tampered with in other ways (such as cross-site scripting (XSS)).
An attacker could use these kinds of attacks to load malicious content.
The Content Security Policy (CSP) header is designed to prevent this kind of attacks.
It allows you to specify exactly what content your site is allowed to load through a load of directives.

### Fetch directives
First of all, you can define what source content can be fetched from. 
There's a specific directive for each resource type and a fallback directive `default-src`.
You define the sources where the content can be loaded from as follows:
 * `self` only load content from the same origin as the page
 * `none` don't load any content of this type
 * `unsafe-inline` lets you use inline javascript and CSS (although it's preferable to use a nonce)
 * `unsafe-eval` allows the use of `eval()`, `setTimeout(String)`, `setInterval(String)` and `new Function(String)`.
 There's a reason it has "unsafe" in its name though: these functions are typically used as attack vectors for XSS.
 * `https:` allow content loaded from anywhere, as long as it's served over HTTPS
 * `example.com` allow content loaded from anywhere on `example.com`, both HTTP and HTTPS
 * You can also use wildcards to control which origins are allowed. 
 E.g. `*://*.example.com:*` will allow resources to be loaded from all *subdomains* of `example.com`, using any scheme and port.
 Note that it won't allow you to load resources from `example.com` itself.
 * `nonce-...` Allows you to specify a [nonce](#nonce). Scripts or styles that have this nonce are then allowed to execute.
It's also important to note that you can pass multiple values to these directives: `self https://example.com` will allow resources to be loaded both from the domain itself as well as from `https://example.com`.

You can use these to define `default-src`, but CSP gives you more fine-grained control over where each type of resource can be loaded from.
For that you need to use the following properties instead:
 * `script-src` - Javascript
 * `style-src` - CSS
 * `img-src` - images
 * `font-src` - fonts
 * `object-src` - objects (e.g. `<object>`, `<embed>`, ...)
 * `media-src` - media such as `<audio>` and `<video>` elements
 * `connect-src` - where the page can connect to using `XmlHttpRequest`, `WebSocket` or `EventSource`.
 The browser will immediately return a 400 status code when your page attempts to connect to a non-valid domain.
 * `frame-src` - Specify which locations can be embedded in a `<frame>` and `<iframe>`
 * `worker-src` - Worker scripts
 * `child-src` - Is either deprecated or serves as fallback for `frame-src` and `worker-src`, depending on the browser and the CSP level implemented.
 * `manifest-src` - defines which [manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest){: target='_blank'} can be applied to the resource. (This is still experimental though).
 
### Navigation directives
These directives tell the browser what kind of navigation is allowed:
* `form-action` limits to where forms can be submitted
* `frame-ancestors` specifies who may embed pages using elements such as `<frame>`, `<iframe>`, `<embed>`, `<object>` and `<applet>` 

### Other directives
Besides these, CSP allows for quite a few other directives:
 * `report-uri` works the same way as the `report-uri` directive of HPKP
 * `require-sri-for` allows you to force the use or Subresource Integrity ((SRI)[#Subresource-integrity]) for stylesheets, scripts or both. 
 Allowed values are `script` and `style` (or both).
 * `base-uri` defines which URLs you can use in the `<base>` element
 * `sandbox` to enable a sandbox for requested resources 
 (have a look at [Mozilla's documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/sandbox){: target='_blank' } for more information)
 
### Nonce
A nonce, pronounced "/nɒns/" (nance), is a term that means "number (used) once".
It allows you to load specific inline scripts without allowing all of them. 
Only those scripts that have a nonce attribute that matches the value specified in the CSP header will get executed.
Keep in mind though that you should **never** hardcode the nonce or use a value that can be guessed.
It's best to generate a new nonce for each request and add it to those scripts you need to execute.
E.g. if you have the following CSP setting:

```
Content-Security-Policy: script-src 'nonce-randomValue'
```

will only execute scripts that have the nonce attribute defined like this:
{% highlight html %}
<script nonce="randomValue">
    // ... script contents
</script>
{% endhighlight %}

### Multiple policies
You are allowed to specify multiple CSP policies simply by specifying the header multiple times.
If you do this however, it's important to keep in mind that subsequent CSPs are not allowed to loosen the rules, only to tighten them.

### Report-only
As with HPKP, CSP also supports a report-only variant with `Content-Security-Policy-Report-Only`.
Once again the specifications are exactly the same but it won't block loading or execution of disallowed resources and simply report violations.
You can then use the reports it generates to decide what you need to allow in your actual CSP header, before you deploy it (and break your site).

### Should I use it?
CSP has some risks: it can break your site's functionality, but overall it's relatively easy to test it. 
The `report-uri` directive allows you to monitor if there are any issues and you can use the report-only version of the header to easily validate the setup you're planning in the wild.
If you have a system that relies a lot on third party content, it might not be for you.
For everyone else, try out the report-only header and see if you get any issues.

## Subresource integrity
When you're developing a web application, you'll often depend on some JavaScript frameworks such as Angular or jQuery.
Loading these files from a CDN can speed up load times from your application, since it's quite likely that the user already has a cached version of the script available.
Of course it's a good idea to be careful about the content of these scripts.
Whenever you're loading resources that aren't under your control, you're depending on someone else to make sure that they aren't tampered with.
To make sure that they aren't changed without your knowledge, you can use subresource integrity (SRI).
With SRI, you add an `integrity` attribute to your `<script>` or `<link>` tag.
This attribute contains the hash of the file you expect.
Your browser will then download the file, hash it with the same algorithm and compare the results.
If the hash matches, the resource will be used; otherwise it will be ignored and an error will be shown in the console.
{% highlight html %}
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js" 
    integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=" 
    crossorigin="anonymous"></script>
{% endhighlight %}
As you can see in the example above, the integrity of the script will be checked using a 'SHA256' hash. 
You'll also notice the `crossorigin` attribute: this attribute is required when loading SRI validated resources from a different origin.
Possible values are `use-credentials` and `anonymous`, indicating whether a request will have the credentials flag set.
If you're using a CDN, you'll probably want to use `anonymous`.
Note that you only need to add the `crossorigin` attribute if you're loading the resource from a different origin.
For resources coming from the same origin, you can omit the `crossorigin` attribute.

### Calculating the SRI value.
In order to add the `integrity` attribute, you need to know the correct hash of the file. 
The easiest way to calculate it is by simply specifying a random value and checking the resulting error in your browser.
![Chrome SRI error](/img/2017-security-features/integrity-error.png){: .image height="50px" }

### Should I use it?
Most likely. 
If you're depending on third party scripts, you should make sure that they aren't changed without your knowledge.
This does mean that you shouldn't just include the latest version of a script (e.g. `example.com/library/latest/`) as that will change whenever a new version is released.
 
## Cookie protection
Most websites nowadays use a variety of cookies for different purposes.
These too can be a source of problems: session cookies grant the user access to certain content or allow them to perform certain actions.
If this cookie can be intercepted or altered, the consequences can be enormous.
Because of this, it's a good idea to protect your cookies as much as possible.
Since you're already running your site on HTTPS, it's a good idea to make sure the cookies aren't sent on insecure requests.
You can easily do this by adding the `secure` flag to the cookies you send.

To make the cookies even more secure, you'll also need to prevent them from being read/modified by scripts running in the page.
In most cases there's no reason for a script to have access to these cookies, so you can simply mark them as `HttpOnly`. 

### Should I use this?
Yes.
Your session cookies should not be available to scripts, so the `HttpOnly` flag should be set on those.
If you're using TLS (and you should) you should definitely set the `secure` flag as well.

## Conclusion
Browsers nowadays support a wide array of security features you can use to keep your users safe.
But, as with all things, powerful tools require you to wield them carefully.
If you apply them without proper thought, you can easily make your website inaccessible or render it unusable.
Because of that, you need to be really careful when you implement (most of) these measures.
Do proper testing and (where possible) use the Report-Only variant for a while to spot possible issues before they become real problems.
Make sure you really understand what you're doing and what the consequences are of getting things wrong.
When you have all that, don't be afraid to experiment, just make sure you do so safely.

<a name="fn1"></a>[1] [Public Key Pinning with Spring Security](http://ordina-jworks.github.io/spring/2016/03/05/HTTP-Public-Key-Pinning-with-Spring-Security.html)
