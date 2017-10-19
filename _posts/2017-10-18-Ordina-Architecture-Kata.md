---
layout: post
authors: [bart_blommaerts, ken_coenen]
title: 'First edition of the Ordina Architecture Kata'
image: /img/kata/kata-1-thumb.jpg
tags: [Architecture, Agile, OODA]
category: Architecture
comments: true
---

> On the 18th of October 2017, Ordina Belgium organized the first __Ordina Architecture Kata__.
The session was presided by Bart Blommaerts, cross-unit Competence Manager Architecture.
A group of sixteen senior consultants with different areas of expertise were gathered in Mechelen to practice software architecture.

## What is a Kata?

You might know the saying **practice makes perfect**, and Architectural Katas are exactly that: practicing.
These Katas were born out of a simple desire — Software architects need a chance to practice being software architects.

> "So how are we supposed to get great architects, if they only get the chance to architect fewer than a half-dozen times in their career?" - Ted Neward

## Pragmatic Architecture Today - Recap

In his conference talk and blog post <a href="https://ordina-jworks.github.io/architecture/2017/06/21/pragmatic-architecture-today.html" target="_blank">Pragmatic Architecture, Today</a>, Bart Blommaerts discusses the need to think about Software Architecture. 

Since this is very relevant to this Architecture Kata, we recap quickly what we learnt back then.

### Why do we need an architecture?

We build a system for a stakeholder, the customer.
That stakeholder needs to have a clear view on what needs to be built.

Every system has an architecture, even those where architectural decisions weren't made.

An architecture is described in an Architectural Description.
This description is also particularly useful for the stakeholder.

An Architectural Description uses views, which are shaped by perspectives.

### OODA

Observe — Orient — Decide — Act
1. Listen to customers, gather requirements, available resources, …
2. Assess comparable systems, question your experience
3. Take decisions
4. Implementation

To reach consensus when taking decisions, you can make a list of data, listen to the customers' explanation, compare and see if they fit.
This is also a good practice when making presentations.
Make a list of what you want to say, do the presentation and compare.

Depending on the question of the customer, your decisions will vary.

## Visualization of the architecture

> "One cannot see the ocean's currents by studying drops of water" — Grady Booch.

To a certain amount, you can derive business logic from the code.
One might say that the code is the truth, but not the whole truth.

Goals of visualizing your architecture:
 - Consistency
 - Reporting — Architecture also needs to be in the heads of the stakeholders
 - Checking and validating — Share the architecture with your team
 - Share information — Other people might have experience with a topic/technology

### Unified Modeling Language (UML)

Using a language like __UML__ can be useful, but then you should look at model-driven development. Also, be very aware that this way of working can become very inefficient.

### Boxes and lines

__Boxes and lines__ are a possibility too, and Bart recommends this pragmatic approach.
Don't make things more complex than they need to be, boxes and lines are fine.
Just make sure to be __consistent__, provide a __legend__.
Also make sure your stakeholders understand what you're drawing.
It's important that you can discuss a matter while speaking the same language.

Avoid fluffy diagrams and mixed abstractions.
Don't mix eg. user interaction information with data flow information.

### Decision log

Document your decisions and alternatives in a __Decision log__, also known as Architecture Decision Record (ADR).
It will prove itself useful in the near future and you oblige yourself to think more about the decision.

There's no need to invent the wheel here.
There are several templates for different use cases available on the internet, for example in <a hreaf="https://github.com/joelparkerhenderson/architecture_decision_record" target="_blank">this ADR repo</a> on Github.

Only document what's useful.

## Viewpoints

Views help you to make architectural decisions.

__Context View__ — Describes the relationships, dependencies and interactions between the system and its environment.
Added in the second print of the book.
Bart thinks this is the most important view of all.
Every component is a part of the greater system.

__Functional View__ — Defines the architectural elements that deliver the systems functionality.
It documents the systems functional structure.
You can make decisions on a functional level eg. Two components are doing similar things.
Should they be separate components?

__Information View__ — Models the system data and its state.
The purpose of many applications today is capturing data.

> Sidenote: Data modeling can be a long and complex process.
As an architect, you need to do data modeling at an architecturally significant level of detail.
Go to the level of detail that is needed for your team of developers.

__Concurrency View__ — Describes the concurrency structure of the system, mapping functional elements to concurrency units to clearly identify the parts of the system that can execute concurrently. eg. process a file in blocks
You can solve a lot with asynchronous messaging.
If you want to dig deeper and want to know the nitty gritty details of messaging, a must read is the book <a href="https://www.goodreads.com/book/show/85012.Enterprise_Integration_Patterns" target="_blank">Enterprise Integration Patterns</a> by Gregor Hohpe.

__Development view__ — Describe the architecture that supports the software development process.
When you have an experiences development team, this can be very high-level.
Make sure you include the senior developers in the team.
They have the experience and on top of that... they will be more motivated as you asked for their advice.

__Deployment view__ — Describes the physical environment into which the system will be deployed, including the system dependencies on its runtime environment.
Make sure you include all information relevant for deploying the application, eg. OS, Apache HTTPD, Tomcat, etc.

__Operational view__ — Describe how the system will be operated, administered, and supported when it is running in its production environment.
You can use a state chart to describe the operations process.

## Perspectives

Perspectives shape the views for non-functional requirements.

When you introduce perspectives, you'll have to make tradeoffs.
An architectural decision will favor certain perspectives and at the same time hinder other perspectives.
For example, strong encryption favors security but hinders performance.

Here's a list of very plausible non-functional requirements:
 - __Accessibility__ — Ability of the system to be used by people with disabilities.
 - __Evolution__ — Ability of the system to be flexible in the face of the inevitable change that all systems experience after deployment, balanced against the cost of providing such flexibility.
 - __Location__ — Ability of your system to overcome problems brought about by the absolute location of your system's components.
 - __Performance and scalability__ — Ability of the system to predictably execute within its mandatory performance profile and to handle increased processing volumes.
 - __Regulation__ — Ability of the system to conform to local and international laws, quasi-legal regulations, company policies, and other rules and standards.
 - __Security__ — Ability of the system to reliably control, monitor, and audit who can perform what actions on what resources and to detect and recover from failures in security mechanisms.
 - __Usability__ — The ease with which people who interact with the system can work effectively.

## The Kata

Our kata for today — AM.I.SCK
 - Nurses that answer questions from patients via a chat platform.
 - 250+ nurses
 - Access to medical histories
 - Assist nurses in providing medical diagnosis
 - Reach local medical staff, even ahead of time
 - Enable parts of the system for direct patient usage
 - Conversations are not considered medical records

 The sixteen attendees were divided in groups of four.
 We had to draw the different architectural views for the AM.I.SCK platform.

<img alt="Ordina Architectural Kata" src="{{ '/img/kata/banner-small.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto;">

## Takeaways

The different views complement each other.
When drawing a view, you'll notice that you'll be able to add more information to another view and the other way around.

When drawing a context view, focus on the interactions with other systems.
Don't be tempted in drawing eg. a frontend and a backend component for your system.
That granularity is not important for the context view.

One view can contain several diagrams, eg. you can have multiple state diagrams in the Information View.

Use the experience of every team member to draw the diagrams.
Think of similar projects and previous professional experiences.

## Links and resources

- Recommended reading: 
<a href="https://www.goodreads.com/book/show/11686849-software-systems-architecture" target="_blank">Software Systems Architecture</a> by Eoin Woods and Nick Rozanski.
In this book, they discuss Viewpoints and Perspectives
- <a href="http://nealford.com/katas/about.html" target="_blank">Architectural Katas</a> on neilford.com
- <a href="https://archkatas.herokuapp.com/" target="_blank">https://archkatas.herokuapp.com/</a>
- <a href="https://groups.google.com/forum/#!forum/architecturalkatas" target="_blank">ArchitecturalKatas</a> Google User Group


