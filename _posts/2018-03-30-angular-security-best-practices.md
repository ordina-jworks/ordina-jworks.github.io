---
layout: post
authors: [frederic_ghijselinck]
title: 'Angular Security Best Practices'
image: /img/angular-security-best-practices.png
tags: [Angular,TypeScript,JavaScript,Security,XSS,CSP,XSRF,XSSI]
category: Angular
comments: true
---

# Angular Security Best Practices

> Software security is a hot topic nowadays.
We, web developers, need to be up-to-date with all latest security issues that we could encounter when developing a web application.
In this blog we'll check what kind of best practices we should have in mind when building an Angular app so we limit the amount of security issues we could have.


## 1. Up-to-date Angular libraries

The angular team is doing releases at regular intervals for feature enhancements, bug fixes and security patches as appropriate.
So, it is recommended to update the Angular libraries at regular intervals.
Not doing so may allow attackers to attack the app using known security vulnerabilities present with older releases.


# Preventing cross-site scripting (XSS)

XSS enables attackers to inject client-side scripts into web pages viewed by other users.
Such code can then, for example, steal user data or perform actions to impersonate the user.
This is one of the **most common attacks** on the web.


## 2. Sanitization and security contexts

To systematically block XSS bugs, Angular treats all values as **untrusted by default**.
When a value is inserted into the DOM from a template, via property, attribute, style, class binding, or interpolation, Angular _sanitizes_ and _escapes_ untrusted values.

This is the declaration of the sanitization providers in the BrowserModule:
{% highlight typescript %}
export const BROWSER_SANITIZATION_PROVIDERS: Array<any> = [
  {provide: Sanitizer, useExisting: DomSanitizer},
  {provide: DomSanitizer, useClass: DomSanitizerImpl},
];

@NgModule({
  providers: [
    BROWSER_SANITIZATION_PROVIDERS
    ...
  ],
  exports: [CommonModule, ApplicationModule]
})
export class BrowserModule {}
{% endhighlight %}


### The DOM sanitization service
The goal of the DomSanitizer is to clean untrusted parts of values.

The skeleton of the class looks like:
{% highlight typescript %}
export enum SecurityContext { NONE, HTML, STYLE, SCRIPT, URL, RESOURCE_URL }

export abstract class DomSanitizer implements Sanitizer {
  abstract sanitize(context: SecurityContext, value: SafeValue|string|null): string|null;
  abstract bypassSecurityTrustHtml(value: string): SafeHtml;
  abstract bypassSecurityTrustStyle(value: string): SafeStyle;
  abstract bypassSecurityTrustScript(value: string): SafeScript;
  abstract bypassSecurityTrustUrl(value: string): SafeUrl;
  abstract bypassSecurityTrustResourceUrl(value: string): SafeResourceUrl;
}
{% endhighlight %}

As you can see, there are two kinds of method patterns.
The first one is the `sanitize` method, which gets the _context_ and an _untrusted value_ and returns a trusted value.
The other ones are the `bypassSecurityTrustX` methods which are getting the _untrusted value_ according to the value usage and are returning a trusted object.

#### The sanitize method
If a value is trusted for the context, this sanitize method will (in case of a SafeValue) unwrap the contained safe value and use it directly.
Otherwise, the value will be sanitized to be safe according to the security context.

There are three main helper functions for sanitizing the values.
The `sanitizeHtml` function sanitizes the untrusted HTML value by parsing the value and checks its tokens.
The `sanitizeStyle` and `sanitizeUrl` functions sanitize the untrusted style or URL value by regular expressions.

#### How can we disable the sanitization logic?
In specific situations, it might be necessary to disable sanitization.
Users can bypass security by constructing a value with one of the `bypassSecurityTrustX` methods, and then binding to that value from the template.

> Be careful: If you trust a value that might be malicious, you are introducing a security vulnerability into your application!


## 3. Content security policy (CSP)

Content Security Policy is a defense-in-depth technique to prevent XSS.
To enable CSP, configure your web server to return an appropriate `Content-Security-Policy` HTTP header.
More info about specifying your CSP can be found on [Google Developers Page about Content Security Policy](https://developers.google.com/web/fundamentals/security/csp/){:target="blank" rel="noopener noreferrer"}.
To check if your CSP is valid you can use the [CSP evaluator from google](https://csp-evaluator.withgoogle.com){:target="blank" rel="noopener noreferrer"}.


## 4. Use the offline template compiler

_Angular templates_ are the same as executable code: HTML, attributes, and binding expressions (but not the values bound) in templates are trusted to be safe.
This means that if an attacker can control a value that is being parsed by the template we have a security leak.
Never generate template source code by concatenating user input and templates.
To prevent these vulnerabilities, use the **offline template compiler**, also known as _template injection_.


## 5. Avoid direct use of the DOM APIs

The built-in browser DOM APIs don't automatically protect you from security vulnerabilities.
For example, _document_, the node available through _ElementRef_, and many _third-party APIs_ contain unsafe methods.
Avoid interacting with the DOM directly and instead use **Angular templates** where possible.


## 6. Server-side XSS protection

Injecting template code into an Angular application is the same as injecting executable code into the application.
So, validate all data on server-side code and escape appropriately to prevent XSS vulnerabilities on the server.
Also, Angular recommends _not to generate Angular templates on the server side_ using a templating language.


# HTTP-level vulnerabilities

Angular has built-in support to help prevent two common HTTP vulnerabilities, cross-site request forgery (CSRF or XSRF) and cross-site script inclusion (XSSI).
Both of these must be mitigated primarily on the server side, but Angular provides helpers to make integration on the client side easier.


## 7. Cross-site request forgery (XSRF)

Cross-site request forgery (also known as _one-click attack_ or _session riding_) is abbreviated as CSRF or XSRF.
It is a type of malicious exploit of a website where unauthorized commands are transmitted from a user that the web application trusts.

In a common anti-XSRF technique, the application server sends a randomly generated authentication token in a cookie.
The client code reads the cookie and adds a custom request header with the token in all subsequent requests.
The server compares the received cookie value to the request header value and rejects the request if the values are missing or don't match.

This technique is effective because all browsers implement the same origin policy.
Only code from the website on which cookies are set can read the cookies from that site and set custom headers on requests to that site.
That means only your application can read this cookie token and set the custom header.

Angular HttpClient provides built-in support for doing checks on the client side. Read further details on [Angular XSRF Support](https://angular.io/guide/http#security-xsrf-protection){:target="blank" rel="noopener noreferrer"}.


## 8. Cross-site script inclusion (XSSI)

Cross-site script inclusion (also known as **JSON vulnerability**) can allow an attacker's website to read data from a JSON API.
The attack works on older browsers by overriding native JavaScript object constructors, and then including an API URL using a <script> tag.
This attack is only successful if the returned JSON is executable as JavaScript.

Servers can prevent an attack by prefixing all JSON responses to make them non-executable, by convention, using the well-known string `")]}',\n"`.
Angular's HttpClient library recognizes this convention and automatically strips the string `")]}',\n"` from all responses before further parsing.

