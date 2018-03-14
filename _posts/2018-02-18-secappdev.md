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
