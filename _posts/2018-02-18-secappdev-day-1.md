---
layout: post
authors: [tim_de_grande]
title: "SecAppDev 2018 - Day 1"
image: /img/security/padlock_code.jpg
tags: [SecAppDev, Security, Development]
category: Security
comments: true
permalink: conference/2018/02/18/SecAppDev-2018-day-1.html
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

# OWASP's top 10 proactive controls (Jim Manico)
- v2, v3 komt binnenkort uit.

## C1: Verify for security early and often
- not really tested
- need to be integral part of software engineering practice
- ASVS and testing guide. -> define security requirements and testing methodologies
- Convert scanning output into proactive controls to avoid classes of problems
    -> don't focus on the bug itself, look for the class (root cause).
    -> "Hamster wheel of pain"
- continuous deployment -> normal pen-test impossible
- automated security testing (part of continuous integration)

## C2: parameterize queries
Prevent SQL injection.
Some things can't be parameterized (e.g. table name, order by clause )
Parameterize everything, even "fixed" values (e.g. config, hard-coded value)
Improves performance.

## C3: encode data before inputting to a parser
- Owasp has libraries to sanitize input or output for java
- Open source
- **Very** difficult to get right.

## C4: Validate all inputs
### HTML
OWASP HTML Sanitizer (open source, donated by Google's AppSec team) -> CAJA
Even valid data can cause injection -> Irish last names e.g. O'Donnell

### File upload
- Filename + size validation + antivirus (on separate system)
- Only trusted filenames + serve from separate domain
- Beware of "special" files
- Image upload verification
    - Enforce size limits
    - Use image rewrite libs (don't just check the header) 
        -> on a separate system (to capture attacks against e.g. ImageMagick)
    - Set the extension to a valid image extension
    - Ensure the detected content type is safe.
- Generic upload
    - Ensure decompressed size < max size
    - Ensure uploaded archive matches the expected type
    - Ensure structured uploads follow proper standard.

## C5: Establish authentication and identity controls
- What is authentication? Verify that an entity is who _it_ claims to be.
- hash + salt is not enough.
    - memory hardened function bcrypt
    - time hardened function scrypt
    - PBKDF2
    - thread hardened argon2i (brand new)
- don't limit length/characters => doomed to failure (too long can cause DoS; 1k is long enough)
    - NIST guidelines
    - don't allow common passwords (e.g. top 100k) -> exactly how attacks happen.
- use modern password policy
- Password storage:
    - SHA512 
    - credential specific salt
    - bcrypt/scrypt/PBKDF2 (workfactor as high as possible)
    - (Optional) HMAC round => store keys in a "vault" e.g. hashicorp or amazon KMS
=> dropbox (blog post)

## C6 access control
Stop using role based access control
```java
if (user.hasAccess("deleteUser")) {
    user.delete();
}
```

## C7: Encrypt data at rest
Google Tink https://github.com/google/tink
https://www.ssllabs.com/projects/documentation

## C8: Logging
honeypots 
fake entry in robots.txt -> fake login, sounds alarm
price in hidden field of e-commerce site. -> detect tampering

## C9 3rd party libraries
OWASP dependency check
retire.js

## C10 Error and Exception handling
owasp.org/index.php/Cheat_Sheets

# Cryptographic algorithms (Bart Preneel)
