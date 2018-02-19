---
layout: post
authors: [tim_de_grande]
title: "Secappdev 2018 - Day 1"
image: /img/security/padlock_code.jpg
tags: [SecuAppDev, Security, Development]
category: Security
comments: true
permalink: conference/2018/02/18/Secappdev-2018-day-1.html
---

# Security model of the web - Philippe De Ryck

Basics - groundwork for other sessions

## Origin
Derived from url
Origin - scheme + host + port
Same origin policy : same origin ok, different -> no interaction
* same origin -> same data store
* different origin -> different data store, no cross access

protected resources:
dom, client-side storage, permissions (e.g. location), XHR, webrtc (video + audio)

=> control your origin!

important: basis security model as well  knowledge needed to fix


## Browsing context

### General
* auxiliary context -> e.g. popup, new tab
* nested context -> (i)frame (origin hidden)

SOP: isolate context -> browser error
Doesn't prevent everything:
* UI redressing attacks: mislead the user (show iframe with malicious button)
* clickjacking (transparent frame above actual page)

=> can be prevented: mostly caused by framing.
whitelist who is allowed to frame you.
* X-Frame-Options
    * `SAMEORIGIN`, `DENY`, `ALLOW-FROM`
    * `ALLOW-FROM` not supported everywhere (webkit), combine with `frame-ancestors` (CSP).
* CSP:
    * `self`, `none`, list of origins
    
### Tabnabbing
-> change existing tab to something malicious
-> users trained not to check the url after the page has been opened
-> auxiliary browsing context -> `window.opener` -> navigate opener to a new page (e.g. password phish)
-> Fix: `rel="noopener"` op `a` tag.
-> limited support (no edge/ie) 

### restrict framed content
- html5: `sandbox` (default: no js)
    - separate unique origin 
    - no script exec
    - no form submission
    - no external navigation
    - no popups
    - no fullscreen
    - no autoplay
    => not usable.
- `sandbox="allow-scripts"` loosen restrictions.
    - except plugins
    - except arbitrary context
    - never `allow-scripts` + `allow-same-origin` => script can break out of the sandbox.
- supported by *all* browsers
- powerful when combined by srcdoc
    -> embed content in tag instead of loading from src. Use both for older browsers.

### communication between contexts
- Web Messaging API
- Send cloneable objects
- When receiving messages: 
    - check the origin. Don't just trust anything that comes in.
    - sanitize data
- Send messages to specific contexts.
- sandbox -> unique + separate origin => use wildcard (`"*"`) to send there (only public data, as it's everywhere)

## script contexts
- come from everywhere
- documents: own context; all scripts share that one context.
- results in security issues
    - XSS
    - Require full trust in 3rd party provider
    - common to embed 3rd party scripts without checks.
### XSS
- Can be anything, not just scripts.
    - Javascript, CSS, HTML
    - Check out BeEF (great for demos!)
- you are what you include
    - malicious ads
    - speakaloud -> mine crypto
    - Google analytics
- you only have a name when you load a script.
    - malicious actor can take it over
    - ...
- Subresource Integrity (SRI)
    - add integrity hash to script
    - no match -> not loaded
    - fine for libraries -> should never change
    - fine for your own scripts in a CDN
    - You should still check the scripts!
- data leakage: `<script src="..." integrity="..." cross-origin="use-credentials">`
    - uses CORS
    - anonymous -> no cookies
    - authenticated -> send cookies
- CDNs make it easy
- browser support relatively ok.

## Leverage context for privilege separation
- Different browsing context -> different privilege
- requires effort
- e.g. 
    - include chat widget through iframe on different origin.
        - communicate through messages (web messaging api)
    - different origin after auth

## CSP
- Defense in depth against injection
- _Not a replacement for traditional XSS mitigation techniques_
- disables dangerous feature (e.g. inline scripts, inline styles, eval)
- only loads whitelisted resources
- not just javascript

## Sessions, cookies, and tokens
- cookie based session-management
    - cookies are *domain* based, not *origin* based
    - read+set through headers + javascript
- patches to make more secure (band aids):
    - `Secure` flag
    - `HttpOnly` flag
    - Flags not sent back to the server
    - cookie prefixes
        - Add prefix to the name
            - `__Secure-` prefix: only secure connections, and `Secure` flag needs to be active
            - `__Host-` prefix: cookie will not be sent to different subdomains. Must be set for root path `/` and with the `Secure` flag
        - Supported in modern browsers
        
### CSRF (sea surf)
- cookies are attached automatically.
- defending requires explicit action by the developer.
- common vulnerability (OWASP #8)
- e.g. ebay account hijack (change phone # through CSRF, then get call to reset password)
- e.g. hack home router. + change DNS server
- Defense:
    - Hidden form tokens (random nonce!)
    - Transparent tokens (copy CSRF cookie to header: both need to be present and identical, otherwise server rejects.) But: JS required
        - Automatically present in angular (Cookie: `XSRF-Token`  to header `X-XSRF-Token`) Backend needs to verify!!
        - copy to form is also possible (still needs js).
    -  Check origin header. => not always present (e.g. `GET`/`HEAD`) => only in case of CORS
    - SameSite cookies: only sent on requests from the same site (`SameSite=Strict` flag) (Chrome only, FF soon)
        - breaks OAuth 2 logins badly -> don't apply on everything.
- Some server side frameworks handle `GET` and `POST` the same way (careful!)

### JWT
- JWT can also be in a cookie, not just in the Auth header
- Choice determines the need for JS support and CSRF defenses
- Headers not automatically added to DOM requests (e.g. images, form post)

