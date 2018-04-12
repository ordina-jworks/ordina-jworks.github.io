---
layout: post
authors: [ken_coenen]
title: 'Eric Evans about the evolution of Domain-Driven Design'
image: /img/DDDEurope2015.jpg
tags: [Domain-Driven Design, DDD, Software Craftmanship]
category: Domain-Driven Design
comments: true
---

> Why is it that DDD only has its own conference after 13 years? Why is this becoming a sudden hype? Why does it gain popularity and is it mentioned so many times in microservices presentations? Eric Evans talks on [DDDEurope](http://dddeurope.com/2016/eric-evans.html) about the core idea behind Domain-Driven Design and its evolution over the last few years.

----------

### But what is DDD?

The subtitle of Evans’ book, *Tackling Complexity in the Heart of Software*, bundles two core principles of Domain-Driven Design:

 1. It describes the process of translating complex real-life problems into software
 2. The heart of software entails the domain that we’re working on

Key in this activity is finding the core complexity in the critical part of the domain and focus on this and only this piece of complexity. **Software developers and domain experts collaborate** to develop models, simplified representations of the real-life problem. The written software should eventually explicitly reflect the model. Whenever a brainstorm session occurs, it almost always results in an adaptation of the models within the software.

When we encounter multiple complex problems, we must think about them separately. Each problem requires its own model representation.

When discussing with others about the domain, we must speak a **ubiquitous language**. You should use the **same vocabulary** for describing the problem you’re solving. However, when somebody asks you the meaning of a word, in many cases you have to ask the person: *“In what context is it used?"*. That’s why the language only means something within a **well-defined bounded context**.

Domain-Driven Design is more like an attitude. Although it gives us principles and terminology to enable talking about it and have discussions, different people will do things differently. Each approach will be slightly different.

### Bounded contexts?

A bounded context is an important principle when applying Domain-Driven Design. As i said earlier, language in itself doesn’t mean anything. It only means something when it’s used within a certain context. eg. Item can be a Stock Item, Sale Item, …

Bounded contexts have the following characteristics:

 - Within a bounded context certain **rules** apply, eg. validation rules
 - It needs to be **tangible in the software**, eg. use packages for each context

Another benefit of working with separate bounded contexts is that separate teams could take responsibility on separate bounded contexts.

### Conclusion

When [Erics book](http://www.amazon.com/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215) was released in 2003, only Java 5 and J2EE were used as a programming language for implementing projects. We only had EJB’s to solve problems and there was no other way of storing data but with SQL. If the technology is so complex and limited to implement something, you can’t focus on the real problem of software design.

Nowadays, we have a lot of new tools available to implement a project: We can store data with a NoSQL database or not store it at all and keep it in-memory. We can explore other ways of approaching data with eg. **event sourcing**. On certain levels, **Spring** makes the technical aspect of writing software components a breeze. With the upcoming of **microservices** and each microservice having its own database, bounded contexts are much clearer to the teams working on the software. And there are probably tons of other examples on how today’s tools can help us achieving our goal: write good software.

Better tools and a vivid community which masters these tools cause Domain-Driven Design to become more and more popular in ways of designing software. So maybe we can do better now than back in 2003. Maybe… Or maybe we’re not there yet. Fact is that everyday we are learning from mistakes in the past to do better in the future.