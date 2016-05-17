---
layout: post
authors: [tim_ysewyn]
title: 'Digitally signing your JSON documents'
image: /img/digitally-signing-your-json-documents.png
tags: [Security, JOSE, JWS, JSON Web Signature]
category: Security
comments: true
---
## What is a digital signature?

A digital signature is a mathematical scheme for demonstrating the authenticity of a digital message or documents.
A valid digital signature gives a recipient reason to believe that the message was created by a known sender, that the sender cannot deny having sent the message (**authentication** and **non-repudiation**), and that the message was not altered in transit (**integrity**).

Digital signatures are a standard element of most cryptographic protocol suites.
They are commonly used for software distribution, financial transactions, and in other cases where it is important to detect forgery or tampering.

Non-repudiation refers to a state of affairs where the author of a statement will not be able to successfully challenge the authorship of the statement or validity of an associated contract.
The term is often seen in a legal setting wherein the authenticity of a signature is being challenged.
In such an instance, the authenticity is being "repudiated".

<br />

## Meet JOSE

[JOSE](https://www.iana.org/assignments/jose/jose.xhtml) is a framework intended to provide a method to securely transfer claims (such as authorisation information) between parties.
The JOSE framework consists of several specifications to serve this purpose:

- [JWK](#jwk) – JSON Web Key, describes format and handling of cryptographic keys in JOSE
- [JWS](#jws) – JSON Web Signature, describes producing and handling signed messages
- [JWE](#jwe) – JSON Web Encryption, describes producing and handling encrypted messages
- [JWA](#jwa) – JSON Web Algorithms, describes cryptographic algorithms used in JOSE
- [JWT](#jwt) – JSON Web Token, describes representation of claims encoded in JSON and protected by JWS or JWE

<br />

## JWK

A JSON Web Key ([RFC7517](https://tools.ietf.org/html/rfc7517)) is a JavaScript Object Notation (JSON) data structure that represents a cryptographic key.

{% highlight json %}
    { 
        "kty": "EC",
        "crv": "P-256",
        "x": "f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU",
        "y": "x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0",
        "use": "sig",
        "kid": "Public key used to sign our messages"
    }
{% endhighlight %}

In this example you can see a couple of parameters.
The first of them "kty" defines the key type, which is a mandatory field.
Depending on the type you've chosen other parameters can be set, like you see above.
As our type is EC, or Elliptic Curve, we want to specify the type of curve and our point.
Next to these parameters we also have the optional “use” to denote intended usage of the key and “kid” as key ID.
At the time of writing there are three supported key types: "EC", "RSA" and "oct".
While "EC" and "RSA" are used for asymmetric encryption, "oct" is used for symmetric encryption

<br />

## JWS

The JSON Web Signature ([RFC7515](https://tools.ietf.org/html/rfc7515)) standard describes the process of creation and validation of a data structure representing a signed payload.
Assume someone wants to transfer an amount of money to his savings account.
This action could be represented like the following JSON:

{% highlight json %}
    { 
        "from": {
            "name": "Tim Ysewyn",
            "account": "Checking account"
        },
        "to": {
            "name": "Tim Ysewyn",
            "account": "Savings account"
        },
        "amount": 250,
        "currency": "EUR"
    }
{% endhighlight %}

In this example we are using a JSON document, but this is not relevant for the signing procedure.
Before we can sign this we need to convert this to base64url encoding, which will be our payload.
So actually we might be using any type of data!
The result of the base64url encoding of above transaction is:

{% highlight text %}
eyAKICAgICAgICAiZnJvbSI6ewogICAgICAgICAgICAibmFtZSI6ICJUaW0gWXNld3luIiwKICAgICAgICAgICAgImFjY291bnQiOiAiQ2hlY2tpbmcgYWNjb3VudCIKICAgICAgICB9LAogICAgICAgICJ0byI6ewogICAgICAgICAgICAibmFtZSI6ICJUaW0gWXNld3luIiwKICAgICAgICAgICAgImFjY291bnQiOiAiU2F2aW5ncyBhY2NvdW50IgogICAgICAgIH0sCiAgICAgICAgImFtb3VudCI6IDI1MAogICAgICAgICJjdXJyZW5jeSI6ICJFVVIiCiAgICB9
{% endhighlight %}

Additional parameters are associated with each payload.
One of those is the required "alg" parameter, which indicates what algorithm needs to be used to generate a signature.
Here we can also specify "none" to send unprotected messages.
All parameters are included in the final JWS.
These can either be sent as a protected or unprotected header.
The data in the unprotected header is human readable associated data, whereas data in the protected header is integrity protected and base64url encoded.
Assume we want to sign our payload using a key like we generated in the previous section.
Our data structure would look like this:

{% highlight json %}
    { 
        "alg": "ES256"
    }
{% endhighlight %}

and base64url encoded this would be:

{% highlight text %}
eyAKICAgICAgICAiYWxnIjogIlJTMjU2IgogICAgfQ==
{% endhighlight %}

The base64url encoded payload and protected header are concatenated with a ‘.’ to form raw data, which is fed to the signature algorithm to produce the final signature.
Finally all of this output will be serialized using one the JSON or Compact serialisations.
Compact serialisation is simple concatenation of dot separated base64url encoded protected header, payload and signature.
JSON serialisation is a human readable JSON object, which for the example in this section would look like this:

{% highlight json %}
    {
        "payload": "eyAKICAgICAgICAiZnJvbSI6ewogICAgICAgICAgICAibmFtZSI6ICJUaW0gWXNld3luIiwKICAgICAgICAgICAgImFjY291bnQiOiAiQ2hlY2tpbmcgYWNjb3VudCIKICAgICAgICB9LAogICAgICAgICJ0byI6ewogICAgICAgICAgICAibmFtZSI6ICJUaW0gWXNld3luIiwKICAgICAgICAgICAgImFjY291bnQiOiAiU2F2aW5ncyBhY2NvdW50IgogICAgICAgIH0sCiAgICAgICAgImFtb3VudCI6IDI1MAogICAgICAgICJjdXJyZW5jeSI6ICJFVVIiCiAgICB9",
        "protected": "eyAKICAgICAgICAiYWxnIjogIlJTMjU2IgogICAgfQ==",
        "header": {
            "signature": "DtEhU3ljbEg8L38VWAfUAqOyKAM6-Xx-F4GawxaepmXFCgfTjDxw5djxLa8ISlSApmWQxfKTUJqPP3-Kg6NU01Q"
        }
    }
{% endhighlight %}

Before we conclude this section, there is one more thing I would like to share with you.
Because we want to sign and protect our messages, we always want to use asymmetric encryption.
But, once our private key has been captured, anyone who has this can forge transactions.
One way that **COULD** counter this is to generate a new key pair every session, or even per transaction.
Including the public key in the **protected** header would not only give the server the ability the validate the signature, we will also be sure that it is the correct one since the protected header is integrity protected!

<br />

## JWE

JSON Web Encryption ([RFC7516](https://tools.ietf.org/html/rfc7516)) follows the same logic as JWS with a few differences:

- by default, for each message a new content encryption key (CEK) should be generated.
This key is used to encrypt the plaintext and is attached to the final message.
Public key of recipient or a shared key is used only to encrypt the CEK (unless direct encryption is used).
- only AEAD (Authenticated Encryption with Associated Data) algorithms are defined in the standard, so users do not have to think about how to combine JWE with JWS.

To keep it short: While JWS can be read by everyone because of the simple base64url encoding, we could use JWE to encrypt some or all of our fields.

<br />

## JWA

JSON Web Algorithms ([RFC7518](https://tools.ietf.org/html/rfc7518)) defines algorithms and their identifiers to be used in JWS and JWE.
The three parameters that specify algorithms are “alg” for JWS, “alg” and “enc” for JWE.
Visit following links to view the list of supported algorithms for [JWS](https://tools.ietf.org/html/rfc7518#section-3) and [JWE](https://tools.ietf.org/html/rfc7518#section-5)


<br />

## JWT

JSON Web Token ([RFC7519](https://tools.ietf.org/html/rfc7519)) is used for passing claims between parties in a web application environment.
Because the tokens are designed to be compact and URL-safe they are especially usable in a web browser [single sign-on](https://en.wikipedia.org/wiki/Single_sign-on) (SSO) context.
JWT claims can be typically used to pass the identity of authenticated users between an [identity provider](https://en.wikipedia.org/wiki/Identity_provider) and a [service provider](https://en.wikipedia.org/wiki/Service_provider).
JWT relies on all previously mentioned JSON standards.

The JWT standard defines claims - key/value pairs asserting information about a subject.
The claims include

- "iss" identifies the principal that issued the token
- "sub" identifies the principal that is the subject of the token
- "aud" (audience) identifies the intended recipients
- "exp" identifies the expiration time on or after which the token **MUST NOT** be accepted for processing
- "nbf" (not before) identifies the time before which the token **MUST NOT** be accepted for processing
- "iat" (issued at) identifies the time at which the token was issued
- "jti" (JWT ID) provides a unique identifier for the token

These claims are not mandatory to be used or implement in all cases, but they rather provide a starting point for a set of useful, interoperable claims. 

<br />

## So, how do we sign this JSON document in code?

Ranging from Java and .NET to Node.js, there are already a lot of libraries available on the [internet](https://jwt.io/#libraries-io).
And even JavaScript has its own implementation of the standard!

Because of its fluent API, we are using the Java JWT implementation in this post.
Since not all algorithms are implemented in Java, we are also going to use Bouncy Castle as our [JCA](https://en.wikipedia.org/wiki/Java_Cryptography_Architecture) provider.

In our maven configuration we just add following two dependencies:

{% highlight xml %}
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt</artifactId>
        <version>0.6.0</version>
    </dependency>
    <dependency>
        <groupId>org.bouncycastle</groupId>
        <artifactId>bcprov-jdk15on</artifactId>
        <version>1.54</version>
    </dependency>
{% endhighlight %}

If you are working with a gradle project it would be:

{% highlight gradle %}
    runtime 'io.jsonwebtoken:jjwt:0.6.0',
            'org.bouncycastle:bcprov-jdk15on:1.54'
{% endhighlight %}

If we were to implement the examples from the previous sections, we would start of with generating a new public-private key pair.

{% highlight java %}
    KeyPair keyPair = EllipticCurveProvider.generateKeyPair(SignatureAlgorithm.ES256);
{% endhighlight %}

It's as easy as that!
We want to have a key of type "EC" so we use the `EllipticCurveProvider`, and by specifying `SignatureAlgorithm.ES256` we use the P-256 bit curve with SHA-256 hashing.


Next we want to sign our base64url encoded payload

{% highlight java %}
    Jwts.builder()
                .setPayload("eyAKICAgICAgICAiZnJvbSI6ewogICAgICAgICAgICAibmFtZSI6ICJUaW0gWXNld3luIiwKICAgICAgICAgICAgImFjY291bnQiOiAiQ2hlY2tpbmcgYWNjb3VudCIKICAgICAgICB9LAogICAgICAgICJ0byI6ewogICAgICAgICAgICAibmFtZSI6ICJUaW0gWXNld3luIiwKICAgICAgICAgICAgImFjY291bnQiOiAiU2F2aW5ncyBhY2NvdW50IgogICAgICAgIH0sCiAgICAgICAgImFtb3VudCI6IDI1MAogICAgICAgICJjdXJyZW5jeSI6ICJFVVIiCiAgICB9")
                .signWith(SignatureAlgorithm.ES256, keyPair.getPrivate())
                .compact();
{% endhighlight %}

Since we already encoded our original message in the [JWS section](#jws), I'm not getting here into detail again.
`signWith(SignatureAlgorithm.ES256, keyPair.getPrivate())` does a couple of things.
First it is going the create a header if not already present and it will add the "alg" key with the value of "ES256".
After that it will base64url encode that header and will append this with a ‘.’ and the encoded payload.
This whole blob of data will then be signed using the private key of the previously generated key pair.
Last, but not least, is the `compact` method.
This will just output the base64url encoded header and payload with the generated signature, and all parts are separated with a dot.
An outcome would be something like:

{% highlight text %}
eyJhbGciOiJFUzI1NiJ9
.
ZXlBS0lDQWdJQ0FnSUNBaVpuSnZiU0k2ZXdvZ0lDQWdJQ0FnSUNBZ0lDQWlibUZ0WlNJNklDSlVhVzBnV1hObGQzbHVJaXdLSUNBZ0lDQWdJQ0FnSUNBZ0ltRmpZMjkxYm5RaU9pQWlRMmhsWTJ0cGJtY2dZV05qYjNWdWRDSUtJQ0FnSUNBZ0lDQjlMQW9nSUNBZ0lDQWdJQ0owYnlJNmV3b2dJQ0FnSUNBZ0lDQWdJQ0FpYm1GdFpTSTZJQ0pVYVcwZ1dYTmxkM2x1SWl3S0lDQWdJQ0FnSUNBZ0lDQWdJbUZqWTI5MWJuUWlPaUFpVTJGMmFXNW5jeUJoWTJOdmRXNTBJZ29nSUNBZ0lDQWdJSDBzQ2lBZ0lDQWdJQ0FnSW1GdGIzVnVkQ0k2SURJMU1Bb2dJQ0FnSUNBZ0lDSmpkWEp5Wlc1amVTSTZJQ0pGVlZJaUNpQWdJQ0I5
.
MEYCIQCcwunLBiuHu2z_SlDVJyZuQv0NU8X4VYoOFN1EuIvObQIhAJeZuTeZw9k5uhpBc60iT13s3yb01ItSB2MhEd5pUSqC
{% endhighlight %}

We split the three parts for better visualisation, the JWS would be one large `String`

<br />

## Validating the signature

First we will check if the JWS was actually signed.
This can be accomplished by executing following line of code.

{% highlight java %}
    Jwts.parser().isSigned(jws);
{% endhighlight %}

To parse the JWS, we use the `parse()` method.

{% highlight java %}
    Jwts.parser()
        .setSigningKey(publicKey)
        .parse(jws);
{% endhighlight %}

Depending wether it is signed or not we might need to set the key for validation.
In our case we need to specify the public key of our asymmetric key pair.
If we would try to parse the JWS without a key an `IllegalArgumentException` will be thrown.
Should a wrong public key have been provided a `SignatureException` would be thrown, telling us to **not** trust this JWS.

If we were to pass our public key in the protected header like we said in the [JWS section](#jws), we should use the `setSigningKeyResolver()` method.
This custom resolver would read out the "jwk" field from the protected header and return a public key based on the data that was provided.

Our own `SigningKeyResolver` implementation could look like this:

{% highlight java %}
    public class ECPublicSigningKeyResolver implements SigningKeyResolver {
        public Key resolveSigningKey(JwsHeader header, Claims claims) {
            return getPublicKey(header);
        }

        public Key resolveSigningKey(JwsHeader header, String plaintext) {
            return getPublicKey(header);
        }

        private Key getPublicKey(JwsHeader header) {
            try {
                HashMap<String, String> jwk = new ObjectMapper().readValue(header.get("jwk").toString(), HashMap.class);
            
                String curve = jwk.get("crv");
                BigInteger x = new BigInteger(jwk.get("x"), 16);
                BigInteger y = new BigInteger(jwk.get("y"), 16);
                String keyType = jwk.get("kty");

                ECNamedCurveParameterSpec ecNamedCurveParameterSpec = ECNamedCurveTable.getParameterSpec(crv);
            
                ECCurve curve = ecNamedCurveParameterSpec.getCurve();
                ECPoint g = ecNamedCurveParameterSpec.getG();
                BigInteger n = ecNamedCurveParameterSpec.getN();
                BigInteger h = ecNamedCurveParameterSpec.getH();

                ECParameterSpec ecParameterSpec = new ECParameterSpec(curve, g, n, h);
                ECPoint ecPoint = curve.createPoint(x, y);

                ECPublicKeySpec ecPublicKeySpec = new ECPublicKeySpec(ecPoint, ecParameterSpec);

                KeyFactory keyFactory = KeyFactory.getInstance(kty);

                return keyFactory.generatePublic(ecPublicKeySpec);
            } catch (IOException e) {
                e.printStackTrace();
            } catch (NoSuchAlgorithmException e) {
                e.printStackTrace();
            } catch (InvalidKeySpecException e) {
                e.printStackTrace();
            }
            return null;
        }
    }
{% endhighlight %}

First we read all our data from the "jwk" field.
Next we retrieve the `ECNamedCurveParameterSpec` based on the "crv" field and assemble a new `ECParameterSpec`.
After that we create a new `ECPublicKeySpec` with the `ECParameterSpec` and an `ECPoint` out of the x and y coordinates.
Finally we get a `KeyFactory` instance for our key type "kty" and generate the public key with our `ECPublicKeySpec`.

<br />

## Conclusion

JOSE is a simple, compact and lightweight framework to sign and encrypt your payload messages.
Because of the combination of base64url encoded messages and JSON data structures it is web friendly.
With the wide range of libraries this can be used across platforms with native and hybrid applications, even web applications can use this!
One particular disadvantage with the use of the compact dot notation is that you can't send unprotected header data anymore.

<br />

## Final note

Above examples should only be used as reference. In a production environment we need to use both JWS and JWE.
One could embed a public key of an asymmetric key pair in the application.
During login a new symmetric key will be generated, encrypted with that public key and sent to the server.
This symmetric key can only be decrypted by the server with the private key, and should then be stored in the session.
Every time we need to sign a JSON document, we would use the symmetric key to encrypt the JWS using JWE.

It doesn't matter how you encrypt your messages, and which algorithms you use.
Once your application has been hacked, the whole system is vulnerable.