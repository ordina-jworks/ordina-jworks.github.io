---
layout: post
authors: [bart_blommaerts]
title: "Pragmatic Architecture, Today"
image: /img/prag-arch/arch.png
tags: [Pragmatic, Architecture, Agile, OODA]
category: Architecture
comments: true
---

Intro

### Topics

1. [What](#1-what)
1. [How](#2-how)
1. [Visual](#3-visual)
1. [Why](#4-why)
1. [How](#5-how)

# What?

<p style="text-align: center;">
  <img class="image fit" alt="What" src="/img/prag-arch/what.png">
</p>

Architecture exists, because we want to create a **system**. 
A system is the combination of all the different components that together define an application.
These components can be loosely coupled, eg. using Microservices; it can be a monolithic application or any other combination of runtime components that fullfill certain business needs.
This is a different scope than a system of systems.
That would be the goal of Enterprise Architecture where the focus is on the strategic vision of an enterprise.

A system is built for its stakeholders. 
And stakeholders are diverse: the customer (who is paying for the system), the users, the developers, ... 
I believe, sharing a crystal-clear vision with these stakeholders and getting buy-in from them, is necessary to create a successful system.

Every system has an architecture, even when it's not formally defined. 
The architecture of a system is typically described in an **Architectural Description**.
The architectural description documents the system for the stakeholders and needs to make architectural decisions **explicit**.
The goal of the architectural description is to help in understandig how the system will behave.

<p style="text-align: center;">
  <img class="image fit" alt="Views and Perspecives" src="/img/prag-arch/views-and-perspectives.png">
</p>

Following the approach in the book [Software Systems Architecture](http://www.viewpoints-and-perspectives.info/) by [Nick Rozanski](https://twitter.com/nickrozanski) and [Eoin Woods](https://twitter.com/eoinwoodz) an architectural description is composed of a number views.
These views describe what it is architecturally significant: info that is worth writing down because the system can not be successful without it or because stakeholders say it's significant.
Deciding what to put in these views, means making decisions.
Woods and Rozanski identified the following viewpoints:

* Context View
* Functional View
* Information View
* Concurrency View
* Development View
* Deployment View
* Operational View

These viewpoints will assist in the writing of an architectural description.
The [website](http://www.viewpoints-and-perspectives.info/) of the book contains a nice summary of these viewpoints.

The views are shaped by _perspectives_. 
These are the cross-cutting concerns that have an impact on the views. 
Sometimes perspectives are also called quality properties or non-functional requirements:

* Accessibility
* Availability and Resilience
* Development resource
* **Evolution**
* Internationalisation
* Location
* Performance and Scalability
* Regulation
* Security 
* Usability

Again, summaries are available on the website of the book.
If you want a more in-depth explanation, I really recommened reading the book.
In todays, agile world, I believe the **Evolution perspective** is a key differentiator in any architectural description.
Generally, perspectives shape the architecture and deserve the necessary attention.

### Example

<p style="text-align: center;">
  <img class="image fit" alt="Example" src="/img/prag-arch/f1.png">
</p>

This is the 2017 Mercedes F1 W08 Hybrid. 
It weights 702kg and has between 750 and 850 horse power. 
It is made out of approximately 80 000 different components. 
The price of the car is an estimated 10 million Eur. 
That’s just for the car, not for the R &amp; D that made the car possible.

Looking back at the viewpoints from above, it is easy to identify how these relate to the construction of the car:

* A Formule One car needs a very specific factory (_Development View_).
It's not built in the same factory Mercedes builds its trucks.
* The cars need to be transported all around the world (all the Formule One cars travel over 100 000 miles in the air).
This can be documented in the _Deployment view_.
* Maintaining a Formule One car during a race has a huge operational cost and requires a lot of coordination (_Operational View_).
Just count the number of engineers during a pitstop.
* ...

In the 2015 and 2016, the predecessors of this car won the Formule One World Championship.
At the moment of writing, the 2017 car is also leading the championship.
This pattern is quite common in Formule One.
The older cars however, are currently up for display in a museum.
They are rarely used anymore.
This _throw-away_ approach can also be noticed when comparing to other industries like smartphones or smartwatches.
A lot of the success of the car, must be its architecture then.
More specifically, its **ability to change**: to adopt to new rules, competitors and market change.
If the architecture of a system, has the ability to change, it immediately has a competitive advange.
This is especially true in agile projects.

> [Grady Booch](https://nl.wikipedia.org/wiki/Grady_Booch)
>
> Architecture represents the significant design decisions that shape a system, where significant is measured by cost of change.

Often it is very difficult to get a system right from the beginning.
That's why creating a system that has the ability to evolve is important.
Things are changing all the time: **known** change and **unknown** change.
Within this evolving system, it's the responsibility of the software architect to make sure the system remains consistent.
Multiple architectural patterns exist to support this:
In the past many systems were built with a configurable metamodel. 
Nowadays loosely coupled, replaceable services are favoured.

<p style="text-align: center;">
  <img class="image fit" alt="System Integrity" src="/img/prag-arch/engine.png">
</p>

When creating a 10 million Eur car, many teams (with different responsibilies) are involved.
The people who design the engine are different from the people who design the brakes.
Creating the best engine, creating the best brakes, ... does not imply you will have the best car.
Everything needs to work together.
**The integrity of the system is very important.**
This point is again proven by Formule One: other teams can buy the current Mercedes engine.
They might win some races, but they haven't won the world championship

> [Russell L. Ackoff](https://en.wikipedia.org/wiki/Russell_L._Ackoff)
>
> A system is more than the sum of its parts; it is an indivisible whole. 
> It loses its essential properties when it is taken apart.

To ensure system integrity, the software architect needs to be part of the project team.
He must make sure he enables the right people to collaborate on the system architecture.
Being part of the team does not mean not taking **responsibility**.
It's great to give **ownership** to members of the team, but in the end the architect needs to stay accountable.
When collaborating, an architect should not enforce all technnical decisions.
Part of working as a team, is accepting to be challenged and embracing this challenge.
When team members have spirited discussions, it shows they are passionate enough about their craft to care.
Disagreeing and discussing alternatives is a great way to come to a better solution and to learn from each other.
Being part of the team, as an architect, will lead to a system with a consistent vision, where the implementation matches the architectural description.
This also implies that an architect should be involved in the codebase of the system: writing code, performing code-reviews, doing proof-of-concepts, supporting others, ...
By being involved in the codebase, you can make sure that the architectual description is understood by the developers.

# Visual?

Todo

# How?

Todo

# Why?

Todo

# How?

Todo


