---
layout: post
authors: [ken_coenen, bart_blommaerts]
title: 'First edition of the Ordina Architecture Kata'
image: /img/kata/kata-6-thumb.jpg
tags: [Architecture, Agile, OODA]
category: Architecture
comments: true
---

> On the 18th of October 2017, Ordina Belgium organized the first __Ordina Architecture Kata__.
The session was presided by Bart Blommaerts, cross-unit Competence Manager Architecture.
A group of sixteen senior consultants, with different areas of expertise, were gathered in Mechelen to practice software architecture.

## What is a Kata?

Kata is a Japanese word most commonly known for the presence in martial arts.
The English term for Kata is __form__ and it refers to the detailed choreographed patterns of movements practiced either solo or in pairs.

You might know the saying **practice makes perfect**, and Architectural Katas are exactly that: practicing.
These Katas were born out of a simple desire — Software architects need a chance to practice being software architects.

> "So how are we supposed to get great architects, if they only get the chance to architect fewer than a half-dozen times in their career?" - Ted Neward

## Pragmatic Architecture Today - Recap

In his conference talk and blog post <a href="https://ordina-jworks.github.io/architecture/2017/06/21/pragmatic-architecture-today.html" target="_blank">Pragmatic Architecture, Today</a>, Bart Blommaerts discusses the need to think about Software Architecture. 

Since this is very relevant to this Architecture Kata, we recap quickly what we learned back then.

### Why do we need an architecture?

We need to build a system.
A system is build for stakeholders.
Customers, users, developers, ... are all stakeholders of a particular system.
Those stakeholders need to have a clear view on what needs to be built.

Every system has an architecture, even those where architectural decisions weren't formally made.

An architecture is described in an Architectural Description.
This description is also particularly useful for the stakeholders.

An Architectural Description uses views, which are shaped by perspectives.

### OODA

OODA is a re-entrant feedback loop, that consists of four stages:

1. Observe: Listen to customers, gather requirements, available resources, ...
2. Orient: Assess comparable systems, use your experience to make sense of your earlier observations.
3. Decide: From the orientation stage, multiple alternatives might need to be considered. 
In the decision stage, we take a decision. 
4. Act: Act on your decision, implement.

An exercise that can help you in the different stages, is to start with some bullet points and then writing them out explicitly.
Comparing the full text with the bullet points, will often be very insightful.

To reach consensus when taking decisions, share these with customers, peers, ... and verify if they share your ideas.


## Visualization of the architecture

> "One cannot see the ocean's currents by studying drops of water" — Grady Booch.

To a certain amount, you can derive business logic from the code.
One might say that the code is the truth, but not the whole truth.

Goals of visualizing your architecture:
 - Consistency
 - Reporting — Architecture needs to be in the heads of the stakeholders
 - Checking and validating — Share the architecture with your different stakeholders
 - Share information — Other people might have experience with certain challenges

### Unified Modeling Language (UML)

Using a language like __UML__ can be useful, especially when doing model-driven development. 
Also, be very aware that this way of working can become very inefficient.
When you are not doing MDD, UML can still be used, if there is shared understanding of the created diagrams.

### Boxes and lines

__Boxes and lines__ are a possibility too, and Bart recommends this more pragmatic approach.
Don't make things more complex than they need to be, boxes and lines are fine.
Just make sure to be __consistent__ and always provide a __legend__.
Also make sure your stakeholders understand what you're drawing.
A legend will really help with getting the message across.
It's important that you can discuss a matter while speaking a common language.

Avoid fluffy diagrams and mixed abstractions.
Don't mix eg. user interaction information with data flow information.

### Decision log

Document your decisions and alternatives in a __Decision log__, also known as Architecture Decision Record (ADR).
It will prove itself useful in the future and requires you to think about a decision.

There's no need to invent the wheel here.
There are several templates for different use cases available on the internet, for example in <a href="https://github.com/joelparkerhenderson/architecture_decision_record" target="_blank">this ADR repo</a> on Github.

Only document what's useful.

## Viewpoints

Views help you to make architectural decisions.
Bart explained the different views with sharp-cut examples.

__Context View__ — Describes the relationships, dependencies and interactions between the system and its environment.
Added in the second print of the book.
Bart thinks this might be the most important view of them all.
Every component is a part of the greater system.

__Functional View__ — Defines the architectural elements that deliver the systems functionality.
It documents the systems functional structure.
You can make decisions on a functional level eg. two components are doing similar things.
Should they be separate components?

__Information View__ — Models the system data and its state.
The purpose of many applications today is capturing data.

> Sidenote: Data modeling can be a long and complex process.
As an architect, you need to do data modeling at an architecturally significant level of detail.
Go to the level of detail that is needed for your team of developers.

__Concurrency View__ — Describes the concurrency structure of the system, mapping functional elements to concurrency units to clearly identify the parts of the system that can execute concurrently eg. process a file in blocks.
You can solve a lot with specific language constructs and asynchronous messaging.
If you want to dig deeper and want to know the nitty gritty details of messaging, a must-read is the book <a href="https://www.goodreads.com/book/show/85012.Enterprise_Integration_Patterns" target="_blank">Enterprise Integration Patterns</a> by Gregor Hohpe and Bobby Woolf.

__Development view__ — Describes the architecture that supports the software development process.
When you have an experienced development team, this can be very high-level.
Make sure you include the senior developers in the team, when constructing the development view.
They have the experience and on top of that... they will be more motivated to be part of the decision making process and technical vision.

__Deployment view__ — Describes the physical environment into which the system will be deployed, including the system dependencies on its runtime environment.
Make sure you include all information relevant for deploying the application, eg. OS, Apache HTTPD, Tomcat, etc.

__Operational view__ — Describe how the system will be operated, administered, and supported when it is running in its production environment.
You can use a state chart to describe the operations process.

## Perspectives

Perspectives shape the views for non-functional requirements.

When you introduce perspectives, you'll have to make trade-offs.
An architectural decision will favour certain perspectives and at the same time, hinder other perspectives.
For example, strong encryption favours security but hinders performance.

Here's a list of very plausible non-functional requirements:
 - __Accessibility__ — Ability of the system to be used by people with disabilities.
 - __Evolution__ — Ability of the system to be flexible in the face of the inevitable change that all systems experience after deployment, balanced against the cost of providing such flexibility.
 - __Location__ — Ability of your system to overcome problems brought about by the absolute location of your system's components.
 - __Performance and scalability__ — Ability of the system to predictably execute within its mandatory performance profile and to handle increased processing volumes.
 - __Regulation__ — Ability of the system to conform to local and international laws, quasi-legal regulations, company policies, and other rules and standards.
 - __Security__ — Ability of the system to reliably control, monitor and audit who can perform what actions on what resources and to detect and recover from failures in security mechanisms.
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

Each team had fifteen to twenty minutes to brainstorm about the case and create the first four views on a whiteboard together.
Afterwards, each team had to present their views to the entire group.
Bart challenged our opinions and gave practical tips on how to improve our thinking.

After a second theoretical deep dive about how perspectives can have an effect on your views, we did the same excercise for the last three views.

<img alt="Ordina Architectural Kata" src="{{ '/img/kata/banner-small.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto;">

## Takeaways

The different viewpoints really complement each other.
When drawing a view, you'll notice that you might be able to add more information to another view and vice versa.

When drawing a context view, focus on the interactions with other systems.
Don't be tempted in drawing eg. a frontend and a backend component for your system, unless these are separated by external systems.
That granularity is not important for the context view.

One view can contain several diagrams (eg. you can have multiple state diagrams in the Information View), additional text, tables containing data, etc.

Use the experience of every team member to draw the diagrams.
Think of similar projects and previous professional experiences.

## Ordina Accelerator 2018

This course was part of the <a href="https://ordina-accelerator.be/" target="_blank">Ordina Accelerator program</a>.
With Accelerator, Ordina offers its employees the necessary tools to develop themselves further.
Not only technical-, but also social- and organizational skills are included in the program.

Medior and Senior experts get the chance to literally __accelerate their career__ by extensively following courses and workshops over a period of two years.

## Links and resources

- Recommended reading: 
<a href="https://www.goodreads.com/book/show/11686849-software-systems-architecture" target="_blank">Software Systems Architecture</a> by Eoin Woods and Nick Rozanski.
In this book, they discuss Viewpoints and Perspectives
- <a href="http://nealford.com/katas/about.html" target="_blank">Architectural Katas</a> on neilford.com
- <a href="https://archkatas.herokuapp.com/" target="_blank">https://archkatas.herokuapp.com/</a>
- <a href="https://groups.google.com/forum/#!forum/architecturalkatas" target="_blank">ArchitecturalKatas</a> Google User Group
- <a href="http://liminalthinking.com/" target="_blank">Liminal Thinking</a>
- <a href="http://www.enterpriseintegrationpatterns.com/" target="_blank">Enterprise Integration Patterns</a>


