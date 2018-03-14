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

# Security model of the web - Philippe De Ryck
## Origin
One of the original security controls in the web's security model is the concept of "Origin".
The origin is derived from the url and consist of the combination of scheme, host and port.
In those days, life was easy: if the origins matched, everything was fine and you could communicate.
If the origins didn't match, interaction wasn't allowed.
This was used to protect cookies, allow communications between frames, etc.

Modern browsers protect a lot of resources based on the origin:
    - The DOM and its contents
    - Client-side storage (such as localstorage)
    - Geolocation access
    - WebRTC (Web Real Time Communications)
    - ...
    
Because of this it's really important to be aware of what's going on in your origin and not just let everyone in there.

## Browsing context
### General
[Mozilla](https://developer.mozilla.org/en-US/docs/Glossary/Browsing_context){: target="blank" rel="noopener noreferrer" } defines a browsing context as "the environment in which a browser displays a document".
For most of us, this is a browser tab.
Besides this context, there are a few other contexts you have to be aware of:
    - An auxiliary context (e.g. a popup or a new tab opened by the page)
    - A nested context (e.g. an iframe that's embedded somewhere on the page)

By default a browser will isolate different contexts from each other, throwing errors when you attempt to work outside your context.

Of course, this doesn't fully protect the end-user.
It's still possible to trick them into performing actions they didn't mean to through UI redressing or clickjacking.
In UI redressing, you present the user with a normal-looking webpage, but one of the buttons can be part of an iframe which will then perform an action you didn't expect
This is a very similar attack to clickjacking, where the action you're performing is hidden in a transparent element on top of the one you're actually clicking.

Since both these attacked are caused by an attacker putting your site in a frame, you prevent them easily.
You need to make sure that only those sites that have a legitimate need to embed your site in a frame can do so.
In the old days of the internet, that would be done using some frame-busting javascript code, but this has since proven to be ineffective.
A better solution is to use what the browser offers you:
* The `X-Frame-Options` header allows you to define how you can be framed.
  Possible values are `SAMEORIGIN`, `DENY` and `ALLOW-FROM`.
  The first 2 stand on their own, while `ALLOW-FROM` requires that you specify 1 origin that's allowed to frame you.
  Besides that, `ALLOW-FROM` is not supported by webkit browsers, which only support the Content Security Policy (CSP) option for this.
* The other alternative is to use CSP, which has a `frame-ancestors` directive.
  This directive is slightly more versatile: it supports `self` and `none`, which match `SAMEORIGIN` and `DENY`.
  It also allows you to provide a _list_ of origins which are allowed to put your site in a frame.

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
- v2, v3 will be published soon(-ish).

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

----
Day 3

# Techniques for developing and integrating secure software components (Jan Tobias Mühlberg)
## Software security for the bad guys
1. Reverse/search manually (costs brain cycles)
    - debugger, decompiler, ...
    - learn a lot
    - might not help
    - can be entertaining, or waste your time
2. Fuzzing
    - clever software, costs CPU cycles
    - you won't learn much, but you will get crashes
    - may be thwarted by anti-debugging techniques.
3. Combine the 2.
    - Helps in these cases.
    
## Fuzzing
Find an input that reproducibly leads to a crash (`SIGABRT`, `SIGILL`, `SIGSEGV`)
Crypto, only binaries shipped, obfuscation, anti-debugging => slow down fuzzing, don't make it impossible.

How to protect against this (or against reverse engineering)?
- Fuzz harder?
- Fuzz more cleverly
- Hire a bad guy for doing good stuff (aka bug bounty)
- Testing?
- Buy insurance?
- Pen testing?
- Formal verification?

### Testing
How much testing is enough?
- Sometimes you can only test in lab conditions
- concurrency?
- how do you know you've covered all critical interactions
- What about security properties?
- ...

NASA: 
* 10^-9 probability of failure for a 1 hour mission
* life-test for >114,000 years 
-> should be used for other things as well
    - (self-driving) cars
    - smart grids
    - medical devices

Critical components are usually tested quite well. 
But these components are becoming more connected to non-critical systems, which are not subjected to these tests.
Not feasible to run all these tests.

### Formal verification
Not a silver bullet -> even verified systems can contain vulnerabilities (e.g. Krack attack)
**Tries** to be exhaustive
VeriFast (created by imec-distrinet)
Normally only done on "small" (~1k LOC) pieces of code that are critical.
Verify 1 part of an application at the level of abstraction provided by Java/C
    - Layer-below attacks (e.g. different java version)
    - Buggy/malicious libs
    - Buggy OS, malware?
fbinfer.com -> static analysis tool by facebook 
    -> give it java code, produces list of potential bugs.


# Code protection through obfuscation (Pedro Fortuna - jscrambler.com)
## What is code obfuscation?
Software developer (Alice) vs Bob reverse engineer (wants key algorithms and dat structures)

Intellectual property protection:
- Legal (expensive)
- Technical
    - Encrypt the code
    - Trusted computing
    - Server-Side execution
    - Obfuscation

Obfuscation makes sense when:
- Sensitive computation on the server is not an option
    - desktop application
    - ui control
    - latency
    - cost
- Trusted computing is not an option
    - not available on all devices
    - cost
- Adversary has physical access to the system
    - mobile app
    - IoT
    - desktop applications
    
Obfuscation 
- "transform a program into a form that is *more difficult* for an adversary to understand or change than the original code."
    -   Requires more human time, money or computing power.
- Lowers code quality in terms of readability/maintainability
    - manual reversing is __**always**__ possible.

Encryption vs obfuscation
- not the same
- encrypted code van't be executed. Obfuscated code is still valid.
- Does not require/include a decrypt function.

## Use cases
- Good
    - protect IP
        - conceal data/algorithms
        - DRM
        - prevent code theft/reuse
    - enforce license agreements
    - prevent tamper/abuse
    - extra security layer
    - Test the strength of security controls (IDS/IPS/WAF/web filter)
- Evil
    - Bypass security controls (IDS/IPS/WAF/web filter)
    - Hide malicious code

## Methods
### Obfuscation transformation
P -> P' (P = source, P' = target)
- P' has the same observable behavior as P (as experienced by the user)
- P' may have side-effects (e.g. more network messages sent) that P doesn't
- P' may be slower, use more memory, be larger

## Measuring
- Quality
    - potency
    - resilience
    - cost
- stealthiness
- maintainability
- diversity

### Potency
- How much more difficult to read and understand (for a human)
- measured: low, medium, high
- Measure using software complexity metrics (aim to maximize)

### Resilience
- resistance to automated deobfuscation techniques
- potency confuses the human <=> resilience confuses an automatic deobfuscator
- is't a combination of programmer effort and deobfuscator effort
- measured on a scale: trivial, weak, strong, full, one-way

### Cost
- Execution time/space penalty due to transformation
- Measured with the scale 
    - free O(1)
    - cheap O(n)
    - costly O(n^p) p>1
    - dear (exponentially more)
- Impact on performance
- Impact on loading times
- File size increase

### Stealthiness
- How hard is it to spot?
- Obfuscated is usually not stealthy
- Avoid telltale indicators :  
    - `eval()`
    - `unescape()`
    - large blocks of meaningless text

### Maintainability
maintainability = potency ^ -1
(POV of the attacker **not** the actual developer, better term assessibility/discoverability?)
Harder to build new features on obfuscated code.

### Diversity
Dynamic obfuscation -> different obfuscation on every load/deploy
- increases attack complexity
- metamorphic & polymorphic code
- removes attack references
- precludes some automated attacks
- passive defense technique

"one of the major reasons attacks succeed is because of the static nature of defense, and the dynamic nature of attack" - Fred Cohen in "Operating System Protection Through Program Evolution", 1993

# Security enhancements in Java 9 (Jim Manico)
## DTLS (Datagram Transport Layer Security)
- Datagram apps need transport security, TLS not sufficient.
- TLS requires TCP -> UDP?
- SIP doesn't work over TLS

## ALPN (Application Layer Protocol Negotiation)
- Multiple protocols supported on the same port
- Needed for HTTP/2

## OCSP (Online Certificate Status Protocol) stapling
### OCSP 
- Revocation doesn't work well -> takes at least 10 days to fully propagate
- Browser soft-fail policy makes it ineffective (no OCSP response -> just continue), revocation ignored unless EV cert
- Some OCSP requests can be intercepted.
- Regular OCSP:
    - requests over HTTP, not HTTPS -> no privacy, no security, MitM, ...

### OCSP stapling
- Web server checks the OCSP responder (not the client)
- response can be cached and sent to the client.
- Client doesn't need to ask a 3rd party for this info (better privacy)

## DRBG (Deterministic Random Bit Generator)
- new `SecureRandom` methods for seeding, reseeding, and random-bit generation
- new `SecureRandomParameters` interface so that additional input ban be provided to the `SecureRandom` methods
- new `DrbgParameters` class implementing `SecureRandomParameters`

## SHA3
- 4 new hash functions (SHA3-224, SHA3-256, SHA3-384, SHA3-512)
- No new APIs

## Disable SHA1 certificates
- TLS benefits: confidentiality, integrity, authenticity
- SHA1 can be cracked 2000 times faster than predicted (proven in 2005)
- Some years ago, used by >90% of websites, now 4%.
- As long as it's supported, certificates can be forged.
- Cost of forgery dropped from $2.7m in 2012 to 173k in 2018

## Crypto note
- Don't use low-level API
- Use proper API:
    - Google KeyCzar (old school + battle hardened)
    - Google Tink (new + shiny)
    - LibSodium (best of breed, required native APIs)
- Bouncycastle is a crypto provider, **not** an API 

## Web plugin deprecated
- Still there, but will be removed in a later version
- `java.corba` also deprecated in Java 9
- @DrDeprecator -> Stuart Marks

## Java modularity
- Reduce JRE attack surface.
- Server JRE decreases attack surface by not including applets since 2013
- 72 levels of modularity

## Filter Incoming Serialization Data (JEP-290)
- Deserialization of untrusted data is bad.
- 2016 -> deserialization apocalypse
- Stop doing it.
- Use JSON/XML instead with **up-to-date** parsers. (older than 3 months? RCE is trivial!)
- This JEP allows you to filter what is deserialized.
    - classes
    - maxdepth, maxrefs, maxbytes, ...
- Backported down to Java 6.

jim@manicode.com

# A practical introduction to OpenID Connect & OAuth 2.0 (Dominick Baier)

- User: carbon based life form <-> client: silicon based life form
- OAuth2.0: meant for client authentication
- OpenID is successor to SAML (old protocol, designed before mobile/IoT)
- OAuth -> *not* for authentication, just abused for that (through various incompatible, proprietary extensions)

## OpenID Connect
- https://openid.net/connect
- piggy backed on OAuth 2.0 (base network protocol)
    ![OpenId Connect protocol suite](http://openid.net/wordpress-content/uploads/2014/02/OpenIDConnect-Map-4Feb2014.png){: class="image fit" style="max-width:638px"  }
    TODO: link to self-hosted copy.
- Added support for logout
- Makes key rotation possible

### Certification
- [Certification list](http://openid.net/certification/){: target="blank" rel="noopener noreferrer" }
- Guarantees spec compliance through tests.

### Endpoints
- Discovery endpoint: to discover where the other endpoints are.
- Authorize endpoint (for humans)
- Token endpoint (for machine to machine processes)


#### Discovery endpoint
- e.g. https://accounts.google.com/.well-known/openid-configuration
- Document **not** signed, relies completely on HTTPS.
- issuer name **must** be url where it's located
- plenty of other fields
- `jwks_uri` points to the keys endpoint. Use this to get the key defined in the `kid` header of the JWT to validate the signature.

#### Authorize endpoint
- Authentication for web applications
- Client makes request to authorize endpoint
    - required parameters:
        - callback url: server will verify that it's in the list of allowed callbacks
        - nonce (for client verification of server response)
        - scope=openid
- Server authenticates the user
- Consent dialog: server tells the user:
    - who you are
    - who they are
    - what access is being requested
- When allowed
    - response sent to the client (contains identity token -> JWT)
    - server sets a cookie (token service will remember the user)

##### Identity token validation
- Issuer name must match value of iss claim
- Client must validate that aud contains the client-id registered
- alg should be correct
- current time must be before exp
- iat (issued at) can be used to reject tokens that were issued too long ago 
- nonce must match what client sent
- validate signature based on `kid` field in the header.

### Session management
- /authorize starts a logon session => distribution of stable session ID to all clients
- /end_session ends it:
    - end session at OpenID provider
    - notify all clients that the session has ended
    
=> Single Sign-Out
3 specs:
- JS-based notification
    - Load iframe (source is `check_session_iframe` in discovery config)
    - iframe runs on the same origin as the ID provider and does JS call to parent page to communicate log out.
- front-channel notification (most common)
    - best-effort approach
    - Every client needs a clean-up end point
    - usually: render web page containing invisible iframes containing the cleanup endpoints (one for each client).
        Pass along the session id to prevent "signout spam" (embed image to logout endpoint to log out random users)
- back-channel notification
    - Server will call a server-endpoint on the client applications
    - more work for the clients
    - requires network connection between ID provider and the application server

# Introduction to privacy technologies (Claudia Diaz)
## What is privacy?
- Abstract and subjective concept
- Depends on
    - study discipline (lawyer vs psychiatrist, vs programmer)
    - stakeholder (company, vs customer vs lawmaker)
    - social norms/expectations
    - context
=> If someone is talking about privacy, don't assume you know what they're talking about.

Warren & Brandeis " the right to privacy" (1890)
- started in 19th century: photography + newspapers -> "information which was previously hidden and private could now be shouted from the rooftops"
- Slander and libel laws are insufficient -> only deal with damage to reputation
- privacy = "the right to be left alone"
    - prevent publication of stories/information about oneself
    - "protect the privacy of the individual from invasion either by the too enterprising press, the photographer or the possessor of modern devices to record sounds or pictures"

## GDPR
- will replace the EU Data Protection Directive from the 90s in May 2018
- Huge fines (up to 10M or 2% of global turnover)
- Purpose base access control: store purpose for collecting with the data
    when someone wants to access it, ask for which purpose -> if they don't match, no access.

## Overview of various privacy technologies focusing on
- concept of "privacy" they embed
- their goals
- trust assumptions
- challenges-limitations

| Offline world | Online world |
|---|---|
|Conversation face to face | skype/IM |
| Letters in the mail | email |
| papers in physical archive | digital archive |
| cash | credit card |
| following your movements | location tracking | 
| know who your friends are | "online" friends |
| encyclopedia | google/wikipedia |

- available data -> low cost of collection, replication, transmission, dissemination

### Nothing to hide?
- "the problem with this argument is its underlying assumption that privacy is about hiding bad things" - Solove
- Difference between "secret" and "private"

# SSL/TLS/HTTPS Best practices (Jim Manico)
## SSL - Secure Sockets Layer
Broken, dead, no longer used

## TLS - Transport Layer Security
- TLS growing ~30% annually.
- Growth even faster in recent years (after Snowden, thanks to Let's Encrypt)
- TLS 1.0 == SSL 3.1
- TLS 1.1 1999
- TLS 1.3 2017 Draft status

## TLS certificates
- X.509 certificates
- Used to authenticate the other party
- **NOT** used to help negotiate a symmetric key
- Certificate from certain CA help websites prove their authenticity.
    Certificates contain
    - Certificate holder
    - Domain that the cert was issued to
    - Signature of the CA who verified the certificate
- Can have multiple hostnames via SAN

## When and how
- Use it always and everywhere
- Includes internal network
- Lots of attacks are performed by insiders.
- Mozilla config guide
- owasp.org O-Saft
- https://www.ssllabs.com/projects/best-practices
- TLS1.0 end of life, start switching over to 1.1 (between servers, use 1.2 and prepare for 1.3)

## SSL fails
- posting sensitive data over HTTP
- mixed content
- weak version/cipher
- trust the CA system
- terminate TLS early

## POODLE
Remediation
- Disable SSL v3.0 for servers and clients
- Use TLS_FALLBACK_SCSV

## Improving HTTPS
### HSTS
- Released november 2012
- Mitigates 
    - downgrade to http
    - MitM using DNS trickery
    - browser default behavior of HTTP first
    - mixed content
- protects the **user**, not the website
 
### Perfect forward secrecy
- Older ciphers: every time anyone makes a ssl connection, that message is encrypted with (basically) the same private server key
- Past communications can be decrypted if the key ever leaks
- PFS: use a new key every time. Leaks in the future can't cause previous communications to be decrypted

# Designing GDPR compliant software (Alain Cieslik)
## Overview
- Enforced from May 25th 2018
- 2 types of personal data:
    - identified 
    - identifiable
- sensitive data (requires more protection)
    - biometric
    - health
    - political opinions
    - ...
- Purpose is required for processing.
    - requires consent
- rights of data subject
    - transparency
    - access and rectification
    - right to data portability
    - right to erasure
    - right to be informed
    - right to object
    - ...
- data breach notification (within 72 hours)
    - adequate level of data protection
    - privacy shield
    - model contractual clauses
    - binding corporate rules

## What does compliance mean?
- respect legal principles
- management of personal risks

These 2 combined means you're compliant.

### Principles
- Lawfulness, fairness, transparency (consent)
- purpose limitation (purpose)
- data minimisation -> only collect what's needed for the purpose
- Accuracy (keep up to date)
- Storage limitation (don't keep longer than necessary)
- Integrity and confidentiality -> ensure appropriate security controls.
- Accountability -> demonstrate compliance with previous principles. (audit trail)

### Challenges
- purpose is a notion that doesn't exist in computer systems
- Data controller must understand for what purpose(s) data is collected and processed
- Managing consent can become complex
    - Consent for each purpose
    - indicate what data is collected for each purpose
    - data controller must maintain an audit trail of how data was used and for what purpose
    - consent becomes a dynamic and flexible feature in an application
- Authorization mechanisms are not yet designed to manage consent

## What does security mean in the GDPR?
- Data protection by design and by default (Art. 25)
    taking into account
    - state of the art, costs of implementation
    - nature, scope, context and purposes of processing
    - the _risk_ of varying _likelihood_ and _severity_ for the rights and freedoms of natural persons
  implement appropriate technical and organisational measures.  
- Security of processing (Art. 32)
- Notification of a personal data breach to the supervisory authority (Art. 33)
- Communication of a personal data breach to the data subject (Art. 34)

## Privacy design strategies
- Data oriented strategies
    - minimize: exclude, select, strip, destroy
    - hide: restrict, mix, obfuscate, dissociate
    - separate: distribute, isolate
    - aggregate: summarize, group
- Process oriented strategies
    - inform: supply, notify, explain
    - control: consent, choose, update, retract
    - enforce: create, maintain, uphold.
    - demonstrate: log, audit, report

# GDPR: from regulation to code (Georges Ataya)
