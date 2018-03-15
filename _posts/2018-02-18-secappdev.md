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
In this session we had a quick look at version 2 of the OWASP [proactive controls](https://www.owasp.org/index.php/OWASP_Proactive_Controls){: target="blank" rel="noopener noreferrer" }.
These are the things every developer should do in order to harden their code.
The full list has 10 items, but because of some very interesting discussions, we only managed to cover the first 5.

<ol>
    <li>
        Verify for security early and often:
        this is not an easy thing in today's DevOps world as code is deployed to production a lot more often.
        Etsy deploys more than 25 times per day, while Amazon manages a deploy every 11.6 <em>seconds</em>!
        Make sure that security testing is part of the build process, doing that ensures that your security testing actually happens.
        There are several tools available that can help you out here (e.g. OWASP ZAP or Nessus) and you can combine them for increased coverage.
    </li>
    <li>
        Parameterize queries:
        we should all know by now that queries should <strong>never</strong> be built using string concatenations.
        Use parameterized queries instead to prevent SQL injections.
    </li>
    <li>
        Encode data before use in a parser:
        the best known vulnerability here is Cross Site Scripting (XSS).
        Allowing someone to inject HTML tags in your HTML pages gives them nearly unlimited power over your application.
        Make sure to encode all user input before feeding it to a parser (a browser is basically a very powerful HTML parser) to prevent these kinds of issues.
        For java applications, you can use the <a href="https://www.owasp.org/index.php/OWASP_Java_Encoder_Project" target="blank" rel="noopener noreferrer">OWASP Java encode project</a> to handle your HTML encoding.
        They also have tools available for other languages (.NET, PHP, ...).
    </li>
    <li>
        Validate all inputs:
        and don't just do it client-side.
        Client-side validations are easily bypassed, so you need to repeat them server-side as well.
        If your users need to be able to post HTML, you need to sanitize it.
        For that you can use the <a href="https://www.owasp.org/index.php/OWASP_Java_HTML_Sanitizer_Project" target="blank" rel="noopener noreferrer">OWASP HTML Sanitizer</a>.
        But that's not all, you also need to do this if your users are allowed to upload files (make sure they don't upload Bad Stuff or files that are simply way too big).
    </li>
    <li>
        Establish authentication and identity controls.
        <ol>
            <li>
                Don't limit the password (within reason). 
                Don't enforce arbitrarily short passwords or limit the type of characters that can be used.
                You <strong>do</strong> want to limit the length, if only to prevent DOS attacks, but 100+ characters shouldn't be an issue.
            </li>
            <li>
                Use a strong, unique salt.
                Each credential should have its own salt, and don't skimp on the length.
                64 or 32 characters (depending on the hashing algorithm) should be the norm.
            </li>
            <li>
                Impose a difficult verification on both attacker and defender.
                Use a hashing algorithm that's appropriate, such as PBKDF2, scrypt or bcrypt.
                Alternatively, you could use <code class="highlighter-rouge" style="white-space:nowrap">HMAC-SHA-256( [private key], [salt] + [password] )</code> to only make it hard on the attacker.
                However, this introduces a lot more complexity in your system.
            </li>
        </ol>
        Other authentication best practices should also be applied, such as 2 factor authentication, a proper lockout policy, ...
    </li>
</ol>
