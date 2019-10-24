---
layout: post
authors: [tim_de_grande]
title: "HPKP is deprecated. What now?"
image: /img/security/padlock_code.jpg
tags: [Security, Browser features, Response headers, HPKP, CAA, Expect-CT]
category: Security
comments: true
permalink: security/2018/02/12/HPKP-deprecated-what-now.html
---

# HPKP is deprecated. What now?

> Recently Google announced their intent to [deprecate support](https://groups.google.com/a/chromium.org/forum/#!msg/blink-dev/he9tr7p3rZ8/eNMwKPmUBAAJ){: target="blank" rel="noopener noreferrer" } for Public Key Pinning (HPKP).
Let's have a look at the reasons for this and what technologies we can use to replace it.

## Deprecated? Why?
As mentioned in the [previous blog post](/conference/2017/09/18/Browser-security-features.html), HPKP carries some very strong risks.
It only takes a small mistake to render your site completely inaccessible, but that's only 1 of the reasons Google mentions for deprecating support for HPKP.
The other risks they call out are that it's hard to build a pin-set that's guaranteed to work and the risk of hostile pinning.
Hostile pinning hasn't been observed _yet_, but it's an attack that allows someone to take your site hostage should they somehow be able to obtain a valid certificate for your domain.

Because of the first 2 reasons, adoption rates of HPKP have remained very low and browser vendors have been looking for a viable replacement.

## Expect-CT
One of the new headers thought up to replace HPKP is `Expect-CT` (Expect Certificate Transparency).
This tells the browser to check the [Certificate Transparency](https://www.certificate-transparency.org/){: target="blank" rel="noopener noreferrer" } (CT) logs to make sure the presented certificate is properly logged.

### Certificate Transparency
CT is a project by Google that provides a framework for monitoring and auditing SSL certificates in (almost) real-time.
One of the reasons for its existence is the 2011 hack of the Dutch CA Diginotar. 
This resulted in the hackers being able to issue more than 500 fake SSL certificates (including for sites like facebook.com and google.com).
In turn, these certificates could then be used by the attacker to perform a Man-in-the-middle (MitM) attack against these sites, without alerting the user that anything fishy was going on.

CT is a tool that allows you to detect when a fake certificate has been issued. 
When a CA participates in the program, it has to log all certificates they issue in a publicly searchable log.
These logs are monitored by applications which can report to you whenever a new certificate for one of your domains is issued.
If the certificate was issued in error (or maliciously), you can immediately take steps to have it revoked.

### How does Expect-CT help me out here?
Expect-CT tells the browser that you only want it to trust certificates signed by CAs that have Certificate Transparency enabled.
When the server presents a certificate that's not issued by such a CA, the browser will reject it and display a warning to the user.

![Expect CT error message](/img/2018-hpkp-deprecation/expect-ct-error.png){: class="image fit" style="max-width:638px"  }

If you combine these 2 points, you can see how this protects your users:
 * By monitoring the CT logs, you can quickly identify any fraudulent or misissued certificates for yur domains and have them revoked.
 * If the certificate is issued by a CT that doesn't pop up in these logs, it's simply rejected by the browser.
 
### How to monitor CT logs
Of course the whole premise of this solution is that you actually monitor the CT logs for your domains.
If you don't do this, you're still at risk of someone obtaining a fraudulent certificate and impersonating you.
Fortunately, there are plenty of companies and tools out there that can help you out with this.
 * SSLMate offers an open source tool called [Certspotter](https://github.com/SSLMate/certspotter){: target="blank" rel="noopener noreferrer" }
 * If you don't want to run it yourself, you can [pay them](https://sslmate.com/certspotter/){: target="blank" rel="noopener noreferrer" } to do it for you.
 * For smaller (personal) projects, you can use [Facebook](https://developers.facebook.com/tools/ct/){: target="blank" rel="noopener noreferrer" }'s monitor.
 * Or you use one of the other APIs or services that are available.

What's important is that you get the reports quickly so you can immediately take action.

### Use the header
Since (to my knowledge) browsers don't have psychic powers (yet?), you still need to tell it that you expect the CA to have CT enabled.
For that you'll need to add the `Expect-CT` header on your responses.
Obviously it will only look for these on an HTTPS URL, since on a simple HTTP connection it can easily be added or removed by a MitM.

The header looks like this:

```http request
Expect-CT: enforce, max-age=31536000, report-uri="https://example.com"
```

This tells the browser to **enforce** the CT rule and to do so for the next year.
Any infractions will be sent to the `report-uri` you mentioned.
As with all headers that contain a `report-uri`, you can also use [report-uri.io](https://report-uri.io){: target="blank" rel="noopener noreferrer" } to aggregate these logs.

As with most things that stand a chance of rendering your site inaccessible, it pays to be cautious when adding this header.
Typically you don't want to start by adding this header as defined above.
Instead, you want to deploy it first _without_ the `enforce` directive (and preferably a very low `max-age` such as 0)
Doing so will tell the browser that you don't want it to **block** connections with a bad certificate, but just to send the error to the `report-uri`.
This setup allows you to test without impacting your users: you can now monitor this for a while to see if everything still works as expected.
After that, enable the `enforce` directive and slowly increase the `max-age` to the point you want it to be.

### Risks
The risk of adding this header is quite low, if you follow the procedure above.
You should only make sure that your CA actually uses CT.
However, since October 2017 Chrome has made this a requirement in order for CAs to be in the trust-store.
The main risk lies in not monitoring the CT logs properly. 
If you don't monitor the alerts or don't have a procedure to deal with misissued certificates, you're still at risk of impersonation.

### Caveats
Unfortunately, there's one major caveat to using this header.
At the time of writing, only Chrome fully supports Expect-CT.
Mozilla has also indicated that they will support it, but Microsoft so far doesn't seem to be following suit.

### Should you use it?
Yes. The risk is minimal, the only downside at the moment is the lack of browser support.
At the very least, a large percentage of your users enjoys added protection against MitM attacks.

## Certificate Authority Authorization
The downside of Expect-CT compared to Public Key Pinning (HPKP) is that you need to make sure that your monitoring is handled correctly.
If you don't notice on time that a certificate has been issued, an attacker may be able to impersonate you for some time.
You can make this a lot harder on the attacker by using Certificate Authority Authorization (CAA).
CAA is a way for you to indicate exactly who is allowed to issue certificates for your domain.

### How to implement?
Since the issuance of certificates is not limited to websites, CAA is not implemented through HTTPS response headers, instead it's a record that you need to put in your DNS settings.
You simply add the correct record to your DNS like this:

| Name           | Type   | Value         |
| -------------- | ------ | ------------- |
| `example.com.` | `CAA`  | `0 issue ";"` |

> Note: the example above prevents all CAs from issuing certificates for your site. 
Don't just copy-paste this.

You can have multiple CAA records and the value of these tells the CA exactly what you want.
Since this is a bit cryptic, lets look a bit more in detail at what's happening here.

The value above consists of 3 parts:
 * the flag (`0`)
 * the tag (`issue`)
 * the value (`";"`)
 
The combination of tag and value can be referred to as "the property".
The whole of CAA is governed by [RFC 6844](https://tools.ietf.org/html/rfc6844){: target="blank" rel="noopener noreferrer" }

#### Flags
Currently, flags can have 2 values: `0` or `128`.
A value of `0` means the property is non-critical, while a value of `128` means that is is critical.
If a property is marked as critical, the CA must completely understand it before it proceeds.
Generally it's correct to use `0`, so it's advised to always use that value.
There is support for customized flags in the RFC, but that's beyond the scope of this post.

#### Tags
The current specification has 3 tags you can define:
 * `issue` specifies which CA is authorized to issue certificates
 * `issuewild` indicates which CA is authorized to issue **wildcard** certificates (e.g. for `*.example.com`)
 * `iodef` similar to report-uri you can use this to get reports on invalid requests (either to an email address or to an http endpoint)
 
##### `issue`
This tag specifies which CA is allowed to issue certificates for the domain and its subdomains.
This includes the wildcard subdomain (meaning that the certificate would be valid for _all_ subdomains).
A value of ";" indicates that no issuance is allowed.
You're allowed to define multiple CAs, but you'll need to use a new DNS record for each one:

| Name           | Type   | Value         |
| -------------- | ------ | ------------- |
| `example.com.` | `CAA`  | `0 issue "ca1.com"` |
| `example.com.` | `CAA`  | `0 issue "otherca.net"` |

##### `issuewild`
This one is used explicitly for wildcard certificates.
If `issuewild` is present, any values in `issue` may not be used in the issuance of a wildcard certificate.
You can use this in case you never want a wildcard certificate to be issued or when the list of CAs that are allowed to issue wildcard certificates differs from the original list.

##### `iodef`
You can use this tag to report invalid certificate requests:

| Name           | Type   | Value         |
| -------------- | ------ | ------------- |
| `example.com.` | `CAA`  | `0 iodef "mailto:certificates@example.com"` |
| `example.com.` | `CAA`  | `0 iodef "https://certificate.example.com/endpoint"` |

As you can see, you can either have these reports sent by email, of have them delivered to an HTTP endpoint.
The report is sent in the IODEF format, which also means that your endpoint needs to be [RFC 6546](https://www.ietf.org/rfc/rfc6546.txt){: target="blank" rel="noopener noreferrer" } compliant.

### The easy way
To help you in creating your CAA, SSL Mate has released a useful tool: [CAA Record Helper](https://sslmate.com/caa/){: target="blank" rel="noopener noreferrer" }.
It can help you create a CAA record and will tell you how to set it up in your DNS service.
![CAA Record Helper](/img/2018-hpkp-deprecation/sslmate.png){: class="image fit" style="max-width:881px" }

### Risks
A badly implemented CAA record can mean that your CA is not allowed to issue your certificate.
The other risk is that it relies on DNS: DNS records can be spoofed and this might allow an attacker to trick a CA into issuing a fraudulent certificate.
Because of this, the RFC recommends implementing DNSSEC (Domain Name Security Extensions).

### Should I use it?
I'd suggest you do. 
While having an incorrect policy can prevent the CA from issuing a certificate, this situation can be rectified quickly and shouldn't put your users at risk.
It will make it a lot harder for an attacker to obtain a certificate.
