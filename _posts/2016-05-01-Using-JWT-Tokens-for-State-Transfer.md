---
layout: post
authors: [andreas_evers]
title: 'Using JWT for state transfer'
image: /img/JWT/jwt-logo.png
tags: [JWT,State,Cache]
category: Microservices
comments: true
---

At one of our clients, we have been using Json Web Tokens quite extensively.
We even use it to persist state on the client.

## Why persist state on the client?

When building microservices, we need to build so-called "cloud native" applications.
One of the key tenets of cloud native application design is keeping your services stateless.
The benefit of having stateless applications is foremost the ability to respond to events by adding or removing instances without needing to significantly reconfigure or change the application.
More stateless services can easily be added when load suddenly increases, or if an existing stateless service fails, it can simply be replaced with another.
Hence, resilience and agility, are easier to achieve with stateless services.

Keeping your services stateless means we need to persist our state somewhere else.
Since we are transferring state in a REST architectural style, we can use the client to retain our state.
For scaling purposes this is a great solution, as the client will only ever have to store its own state, and the server will be relieved of the state of all its clients.

At our client we have chosen to use JWT for this state transfer to the client.
While JWT is primarily intended for authentication and authorization purposes, the specification allows us to add any data we'd like to verify later on.

## Looking good

Imagine the following scenario:

A list of products is fetched from the "products microservice".
The user isn't allowed to view all products, so only those products the user has access to are returned.
When the user wants to order a product, he sends an order request to the "orders microservice" with the id of the product he wants to order.
At that moment the "orders microservice" needs to know whether or not the user is allowed to access this product, let alone order it.
Since the rights to access and order are the same, we'd like to reuse the information returned from the first call to the "products microservice".
This flow is illustrated below.

<img class="image left" src="{{ '/img/JWT/jwt-for-state-tranfer.png' | prepend: site.baseurl }}" alt="JWT state transfer" />

We could call the "products microservice" from the "orders microservice" and rely on caching, but that would still be an extra network hop and the cache could potentially be invalidated by the time the user orders the product.
Using the JWT approach, state is given to the client (the list of product ids the user is allowed to access), and being passed to the server again the moment an order is placed.
The signature of the token guarantees us that the state has not been tampered with, while residing on the client.

## Too good to be true

This solution prevents the server from having to care about state.
It allows the client to store its own state and send it to the server whenever the server requires it - while being guaranteed the data isn't tampered with.
While this might seem like a good idea, it can backfire quickly.

### Coupling

In distributed systems such as microservices, it's very important to manage the way we talk between components over the network.
Using protocols such as HTTP and especially with the REST architectural style, great care needs to go in defining the contracts between these components.
While we can use content-negotiation to version our resources, and JSON for instance as content type, we can build our clients as tolerant readers.
Headers don't have any of these benefits.
A header is basically just a key and a value, and in case of JWT, the value is encoded.
Therefore it's hard to do versioning or any kind of content management on the data transferred inside these tokens.

In the aforementioned example, the token couples the "products microservice" with the "orders microservice".
If the "products microservice" changes the structure of the token, the "orders microservice" will no longer be able to read it.
While this coupling would exist as well when the "orders microservice" would call the "products microservice" directly, we would manage that coupling as part of the contract between these two microservices.
In our case we don't know there is a link between the two microservices since they don't call each other directly.
Yet by transferring the token from one microservice over the client to the other microservice, we are creating a hidden dependency.
It's also hard to have versioning on headers unless we put the version inside the name of the header.

### Scaling

Adding versions to the headernames, documenting which microservices expect which versions of tokens of other microservices, and making sure we implement the tolerant-reader principle when reading the tokens might be a step in the right direction to avoid mass hysteria when tokens have to be adjusted.
But what is simply impossible to get around, is the size restriction of headers in HTTP requests and responses.
The HTTP specification doesn't put any restriction on header size (singular or combined).
But web servers, reverse proxies, CDNs and other network components do.
Why they do this is not entirely clear as the spec allows any size, but the fact of the matter is that these restrictions exist.
Putting a list of ids in a header like in our products example, will eventually break as the list could get too long.
It's not even clear how long is too long.

## Alternatives

We see three possible alternatives to this failed approach to manage state.

Instead of passing the state from one microservice over a client to another microservice, we could pass the state as part of the body of the request and response.
The downside of this approach is that we can no longer use GET methods for the calls where we need to pass the previously fetched state.

The second alternative is to persist the state in a key value datastore on the server.
We could asynchronously fetch products data and store it inside a datastore owned by the "orders microservice".
This could get stale, but so could a cache on the "products microservice".
This approach seems most common in the industry and could be well be the most preferable.

And when all else fails, we can still simply make a call from the "orders microservice" to the "products microservice" and count on caching.

## Conclusion

Using Json Web Tokens as a means to transfer state to and from microservices via the client seemed like a good idea, but in the end turned out to be quite an anti-pattern.
It introduces hidden coupling which is hard to manage, and can outright fail completely when headers become too big.
Transferring state through the body of requests and responses could be a better approach.
Using key value datastores to cache data of other microservices on your own microservice feels like the best way to go.
