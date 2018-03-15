---
layout: post
authors: [tim_de_grande]
title: "SecAppDev 2018"
image: /img/secappdev-2018/secappdev_wide.png
tags: [SecAppDev, Security, Development]
category: Security
comments: true
permalink: conference/2018/02/18/SecAppDev-2018.html
---

> Last February I was able to attend the 2018 edition of [SecAppDev](https://www.secappdev.org/){: target="blank" rel="noopener noreferrer" }.
> It's a training/security conference in Leuven that lasts a week and which hosts top-notch speakers.
> It's organised by Philippe De Ryck of imec-DistriNet, KU Leuven.

SecAppDev for me was a week filled with learning, I'll recap a few of the sessions I attended in this post.

# Security model of the web - Philippe De Ryck
The most basic security control of the modern internet is the 'Origin'.
This was thought up over 20 years ago and, at the time, was adequate for its purpose.
Nowadays however, origin is a poor security constraint: we load scripts from CDNs, we include frames from other providers, ...
Because of this, more security controls have been bolted on in the last years.
In this talk, Philippe De Ryck explored some of these.
We learned how to use `X-Frame-Options` and Content Security Policy (CSP) settings to limit who can include our pages in a frame.
Next up he explained how to limit the power of other sites which you might need to frame in yours using the `sandbox` attribute, which was introduced in HTML5.
Once you've limited what the frame can do, you can open up communications between your page and the frame through the Web Messaging API.

Once you're past frames, we come to scripts.
Nowadays, we load scripts from all over the place, often knowing nothing more than a name.
These scripts run within the context of your page and can do everything the current user can do.
To make sure these scripts aren't tampered with you'd ideally investigate them first and then use subresource integrity (SRI) to make sure they aren't modified.
Most CDNs nowadays offer this as a service: they provide you with the correct hashes for the scripts they host.
That does mean you need to trust your CDN to host a non-malicious file at the time you include it.

After a quick look at CSP, we came to the cookies.
As we all know, cookies are not the best solution: they're sent over both HTTP and HTTPS and they can be read and modified by (malicious) scripts.
This allows for some interesting attacks like session hijacking and session fixation.
An attempt was made to fix this through `Secure` and `HttpOnly` flags.
Recently a new spec tries to restrict cookie behavior based on prefixes: `__Secure-` and `__Host-`.

Because browsers send your cookies on all requests to your domains, this opens you up to an attack called Cross Site Request Forgery (CSRF).
We discussed a few methods that can be used to mitigate this risk: hidden form tokens, "transparent" tokens, checking the origin header and samesite cookies.

The session ended with a look at JSON Web Tokens (JWT).
Contrary to popular belief, these represent data, **not** a transport mechanism.
It's perfectly fine to store a JWT in a cookie, rendering the whole cookie vs. tokens debate a bit useless.
Putting your token on an `Authorization` header, does protect against CSRF, but introduces some other complexities.

# OWASP's top 10 proactive controls (Jim Manico)
In this session we had a quick look at version 2 of the OWASP [proactive controls](https://www.owasp.org/index.php/OWASP_Proactive_Controls){: target="blank" rel="noopener noreferrer" }.
These are the things every developer should do in order to harden their code.
The full list has 10 items, but because of some very interesting discussions, we only managed to cover the first 5.

## 1. Verify for security early and often
This is not an easy thing in today's DevOps world as code is deployed to production a lot more often.
Etsy deploys more than 25 times per day, while Amazon manages a deploy every 11.6 _seconds_!
Make sure that security testing is part of the build process, doing that ensures that your security testing actually happens.
There are several tools available that can help you out here (e.g. OWASP ZAP or Nessus) and you can combine them for increased coverage.
Make sure you don't end up on the "hamster wheel of pain" where you focus on the specific bugs they reveal, rather than the _class_ of bugs.

## 2. Parameterize queries
We should all know by now that queries should **never** be built using string concatenations.
Use parameterized queries instead to prevent SQL injections.
Use parameters for *everything*: not just the user-supplied input, but configurations and hard-coded values as well.
This can give you a performance boost as well, since parameterized queries are compiled by the database only once and then reused.

## 3. Encode data before use in a parser
The best known vulnerability here is Cross Site Scripting (XSS).
Allowing someone to inject HTML tags in your HTML pages gives them nearly unlimited power over your application.
Make sure to encode all user input before feeding it to a parser (a browser is basically a very powerful HTML parser) to prevent these kinds of issues.
For java applications, you can use the [OWASP Java encoder project](https://www.owasp.org/index.php/OWASP_Java_Encoder_Project){: target="blank" rel="noopener noreferrer" } to handle your HTML encoding.
They also have tools available for other languages (.NET, PHP, ...).

## 4. Validate all inputs
And don't just do it client-side.
Client-side validations are easily bypassed, so you need to repeat them server-side as well.
If your users need to be able to post HTML, you need to sanitize it.
For that you can use the [OWASP HTML Sanitizer](https://www.owasp.org/index.php/OWASP_Java_HTML_Sanitizer_Project){: target="blank" rel="noopener noreferrer" }.
Keep in mind that even valid data can cause issues: `' OR '1'='1'; --` is a perfectly valid password, and the Irish people will be grateful that you allow the use of `'` in name fields.

### What about files?
You also need to do this if your users are allowed to upload files.
Files create even more risks: you need to make sure that the uploaded files are safe.
First validate the file name, file type and decompressed size (preferably *before* decompressing).
Run it through a virus scanner on a separate machine to protect against exploits against your antivirus.
For images, you need to enforce size limits and you'll want to verify that you're actually dealing with an image.
The easiest way to do that is to rewrite the image (e.g. using ImageMagick).
Once again, you want to do this on a separate machine to prevent malicious images to take over your application.

## 5. Establish authentication and identity controls.
1. Don't limit the password (within reason). 
   Don't enforce arbitrarily short passwords or limit the type of characters that can be used.
   You **do** want to limit the length, if only to prevent DOS attacks, but 100+ characters shouldn't be an issue.
2. Check the chosen password against a list of the 100k most common chosen passwords
3. Use a strong, unique salt.
   Each credential should have its own salt, and don't skimp on the length.
   64 or 32 characters (depending on the hashing algorithm) should be the norm.
4. Impose a difficult verification on both attacker and defender.
   Use a hashing algorithm that's appropriate, such as PBKDF2, scrypt or bcrypt.
   Alternatively, you could use `HMAC-SHA-256( [private key], [salt] + [password] )` to only make it hard on the attacker.
   However, this introduces a lot more complexity in your system.
Other authentication best practices should also be applied, such as 2 factor authentication, a proper lockout policy, ...

# A practical introduction to OpenID Connect & OAuth 2.0 (Dominick Baier)
Dominick Baier gave a very interesting talk on OpenID Connect and OAuth 2.0.
An important distinction he made at the start is the difference between a _user_ and a _client_.
Users are people (carbon based life forms) while the word "client" refers to applications (or silicon based life forms).
OAuth2.0 is a protocol meant for client authentication while OpenID is the successor to SAML (and as such meant to authenticate users).
OAuth is **not** meant for user authentication, even though it's commonly (ab)used for that through various incompatible, proprietary extensions.

## OpenID Connect
[OpenID Connect](https://openid.net/connect){: target="blank" rel="noopener noreferrer" } piggy backs on OAuth2.0.
![OpenId Connect protocol suite](/img/secappdev-2018/OpenIDConnect.png){: class="image fit" style="max-width:638px"  }
It adds support for logging out and key rotation.
More importantly, it's an _open_ standard and it publishes a list of [certified implementations](http://openid.net/certification/){: target="blank" rel="noopener noreferrer" }.
Compliance with the spec is guaranteed through a set of tests.

## Endpoints
An OpenID Connect server (or token service) has to implement a set of endpoints:
- A discovery endpoint to discover where the other endpoints are.
- An authorize endpoint (for users)
- A token endpoint (for machine to machine processes)

### Discovery endpoint
An example of a discovery endpoint is at [https://accounts.google.com/.well-known/openid-configuration](https://accounts.google.com/.well-known/openid-configuration){: target="blank" rel="noopener noreferrer" }.
It returns an **unsigned** JSON document: for security OpenID Connects relies entirely on HTTPS.
The `issuer` **must** be the URL where the document is located.

### Authorize endpoint
This endpoint handles authentication for web applications and is found in the `authorization_endpoint` field of the discovery endpoint
The client (in this case the browser) makes a request to the authorize endpoint and passes along a few required parameters:
- The callback url: the token service will verify that this url is allowed and perform a callback to this url after the user is logged on.
- A nonce (**n**umber used **once**) which will be echoed to the client so it can verify server responses.
- And a scope which needs to include `openid`.

The server will then authenticate the user and show a consent dialog.
This dialog shows the logged in user, the application that requests access and the access that's being requested.
![OpenID Connect consent dialog](/img/secappdev-2018/OAuth2Consent.png){: class="image fit" style="max-width:638px"  }

When the user allows this request, the token service sends  response to the client containing a JWT based identity token as well as a cookie.
This means that the token service will remember the user for future logon requests to other applications.

##### Identity token validation
When you use an identity token to authenticate on an application, the application needs to validate this token.
It does this by making sure that:
- the issuer name matches the value of the `iss` claim
- The `aud` must contain the client-id that was used to register the application.
- The proper signing algorithm must be defined in `alg`.
- The current time must be before `exp`
- If the token is too old (as defined in `iat` or "issued at"), it can be rejected
- `nonce` must match what client sent
- And you need to validate the signature. 
  For that you check the `kid` field in the header and use find that key in the document you find at the `jwks_uri` field from the discovery endpoint.

## Session management
Since the token service places a cookie in the user's browser, this means that you have 1 logon session active.
When you access another application that uses the same token service, it just needs to show you the consent dialog, without asking you to log in again.
This is called "Single Sign On" (SSO).
OpenID Connect also supports "Single Sign Out".
When you log out of the token service (by calling the /end_session endpoint), it will try to sign you out from all applications.
It support 3 different ways of doing this:

### Javascript based notification
In order to use this, your application should always contain a specific iframe.
The source of this iframe is defined in the `check_session_iframe` field of the discovery config.
This frame is loaded in the same origin as the token service and it will do a JS call to the parent page to log out.

### Front-channel notification
Even though the spec calls this a "best-effort approach", it's still the method that's most common.
It requires each client to implement a clean-up endpoint.
When the user logs out, the token service will render an HTML page that containing an invisible iframe for each client.
These iframes will call the clean-up endpoints.
Normally, these iframes will contain the session id in the url to prevent "signout spam".
Otherwise it would be too easy for a malicious site to add an image to their pages signing you out of your sessions, causing a DOS.
The reason this approach is "best-effort" is that the browser might not be able to call all endpoints before the user navigates away from the log out page.

### Back-channel notification
This is the safest option, as it guarantees that the user will be signed off from all applications.
Unfortunately it's also the most complicated to implement.
In this method, the token service will can a server-endpoint on all client applications.
This means that the application server will need to implement the clean up endpoint.
Besides that, you also need to be sure that a network connection is possible between the ID provider and all application servers.

