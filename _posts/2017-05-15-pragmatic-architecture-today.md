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

Need an example or not ...


# How?

Todo

# Visual?

Todo

# Why?

Todo

# How?

Todo

> [Marissa Mayer](https://en.wikipedia.org/wiki/Marissa_Mayer)
>
> Geeks are people who love something so much that all the details matter.
