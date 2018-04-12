---
layout: post
authors: [bart_blommaerts]
title: "Pragmatic Architecture, Today"
image: /img/prag-arch/arch.png
tags: [Pragmatic, Architecture, Agile, OODA]
category: Architecture
comments: true
---

Software development has evolved. 
Agile is now the de facto standard. 
The role of an architect in an agile project is very different from the typical role in a more classic waterfall approach. 
This article presents an updated interpretation of _viewpoints and perspectives_ and will demonstrate how to make rapid, agile delivery sustainable in a constantly changing world. 
These viewpoints and perspectives can be linked to easy-to-produce models that can be used immediately. 
A good agile architect needs to strive for consensus and buy-in.

### Content

1. [What?](#1-what)
1. [Why?](#2-why)
1. [How?](#3-how)

# What?

<p style="text-align: center;"
>  <img class="image fit" alt="What" src="/img/prag-arch/what.jpg">
</p>

Architecture exists, because we want to create a **system**. 
A system is the combination of all the different components that together define an application.
These components can be loosely coupled, eg. using Microservices; it can be a monolithic application or any other combination of runtime components that fulfill certain business needs.
This is a different scope than a system of systems.
That would be the goal of Enterprise Architecture where the focus is on the strategic vision of an enterprise.

A system is built for its stakeholders. 
And stakeholders are diverse: the customer (who is paying for the system), the users, the developers, ... 
I believe, sharing a crystal-clear vision with these stakeholders and getting buy-in from them, is necessary to create a successful system.

Every system has an architecture, even when it is not formally defined. 
The architecture of a system is typically described in an **Architectural Description**.
The architectural description documents the system for the stakeholders and needs to make architectural decisions **explicit**.
The goal of the architectural description is to help in understanding how the system will behave.

<p style="text-align: center;">
  <img class="image fit" alt="Views and Perspecives" src="/img/prag-arch/views-and-perspectives.png">
</p>

Following the approach in the book [Software Systems Architecture](http://www.viewpoints-and-perspectives.info/) by [Nick Rozanski](https://twitter.com/nickrozanski) and [Eoin Woods](https://twitter.com/eoinwoodz), an architectural description is composed of a number views.
These _views_ describe what is architecturally significant: info that is worth writing down because the system can not be successful without it or because stakeholders say it is significant.
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
If you want a more in-depth explanation, I really recommend reading the book.
In today's agile world, I believe the **Evolution perspective** is a key differentiator in any architectural description.
Generally, perspectives shape the architecture and deserve the necessary attention.

## Example

<p style="text-align: center;">
  <img class="image fit" alt="Example" src="/img/prag-arch/f1.jpg">
</p>

This is the 2017 Mercedes F1 W08 Hybrid. 
It weights 702kg and has between 750 and 850 horsepower. 
It is made out of approximately 80.000 different components. 
The price of the car is an estimated 10 million Euro. 
That is just for the car, not for the R&amp;D that made the car possible.

Looking back at the viewpoints from above, it is easy to identify how these relate to the construction of the car:

* A Formula One car needs a very specific factory (_Development View_).
It is not built in the same factory Mercedes builds its trucks.
* The cars need to be transported all around the world (all the Formula One cars travel over 100.000 miles in the air).
This can be documented in the _Deployment view_.
* Maintaining a Formula One car during a race has a huge operational cost and requires a lot of coordination (_Operational View_).
Just count the number of engineers during a pitstop.
* ...

In the 2015 and 2016 season, the predecessors of this car won the Formula One World Championship.
At the moment of writing, the 2017 car is also leading the championship.
This pattern is quite common in Formula One.
The older cars however, are currently up for display in a museum.
They are rarely used anymore.
This _throw-away_ approach can also be noticed when comparing to other industries like smartphones or smartwatches.
A lot of the success of the car, must be its architecture then.
More specifically, its **ability to change**: to adapt to new rules, competitors and market change.
If the architecture of a system, has the ability to change, it immediately has a competitive advantage.
This is especially true in agile projects.

> [Grady Booch](https://nl.wikipedia.org/wiki/Grady_Booch)
>
> Architecture represents the significant design decisions that shape a system, where significant is measured by cost of change.

Often, it is very difficult to get a system right from the beginning.
That is why creating a system, that has the ability to evolve, is important.
Things are changing all the time: **known** change and **unknown** change.
Within this evolving system, it is the responsibility of the software architect to make sure the system remains consistent.
Multiple architectural patterns exist to support this:
In the past, many systems were built with a configurable metamodel. 
Nowadays, loosely coupled, replaceable services are favoured.

<p style="text-align: center;">
  <img class="image fit" alt="System Integrity" src="/img/prag-arch/engine.jpg">
</p>

When creating a 10 million Euro car, many teams (with different responsibilities) are involved.
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
He must make sure that he enables the right people to collaborate on the system architecture.
Being part of the team does not mean not taking **responsibility**.
It is great to give **ownership** to members of the team, but in the end, the architect needs to stay accountable.
When collaborating, an architect should not enforce all technical decisions.
Part of working as a team, is accepting to be challenged and embracing this challenge.
When team members have spirited discussions, it shows they are passionate enough about their craft to care.
Disagreeing and discussing alternatives is a great way to come to a better solution and to learn from each other.
Being part of the team, as an architect, will lead to a system with a consistent vision, where the implementation matches the architectural description.
This also implies that **an architect should be involved in the codebase of the system**: writing code, performing code-reviews, doing proof-of-concepts, supporting others, ...
By being involved in the codebase, you can make sure that the architectual description is understood by the developers.

## Visual?

<p style="text-align: center;">
  <img class="image fit" alt="Visual" src="/img/prag-arch/visual.jpg">
</p>

While code is a very important asset of a working system, code alone is not enough to have an accurate and lasting description of a system.

> [Grady Booch](https://nl.wikipedia.org/wiki/Grady_Booch)
>
> One cannot see the ocean's currents by studying drops of water.

The goal of visually representing a system, through the architectural description, is to make sure the architecture of the system is in the stakeholders' heads.
The visual representation can be used to check for consistency, reporting, validation and **sharing information**.

### Some ground rules

While UML has its merits, often it is not necessary to create an extensive UML model for the architecture.
It will be time-consuming and, unfortunately, it is often the case that UML is not correctly understood by stakeholders.
An alternative to UML is to use plain _boxes and lines_.
However, when using boxes and lines:

* Be consistent (especially when collaborating on the architecture).
Try to be consistent over multiple projects. 
Templates offer a good start, but not every architecture needs the same viewpoints.
* Avoid mixed responsibilities.
* Avoid fluffy diagrams. Documents should not be vague. They should be about one abstraction.
* **Always** provide a legend.
Explain what a certain line or box means. 
Don't make stakeholders guess.
* Don't be afraid to add text to a diagram.
* Don't model what nobody needs. 
Eg. if you are not using a data store, do not create an _Information View_.
* Make sure your stakeholders understand what you are documenting.

Whatever your preferred visualisation approach is, keep a **decision log**.
Document your decisions, the considered alternatives and the timing a decision was made.
Since the system will (very likely) evolve, a decision log will keep track of the reasoning behind a certain decisions.
Decisions might need to change, so keeping track of the rationale behind a decision is valuable.

# Why?

<p style="text-align: center;">
  <img class="image fit" alt="Why" src="/img/prag-arch/why.jpg">
</p>

### Up-front design

Some up-front design is necessary to start efficiently and to prevent too much rework.
This means thinking about the big picture:

* Used technology
* Automation
* Architectural patterns
* Layering
* Evolution
* ...

> [Simon Brown](http://www.codingthearchitecture.com/authors/sbrown/)
>
> Just enough up-front design to create firm foundations for the software product and its delivery. 

But what does _just enough_ mean?
Just enough depends on a lot of variables like budget, scope, team, ... 
The approach will also be different for greenfield projects or for existing projects.
When you are working on a **greenfield project**, it is important to start with a **high-level view** of all components in the application.
These components are all the pieces necessary for a system to operate.
Other components and details can be added later.
Working with **existing systems** benefits from a slightly different approach, where you can start with an accurate high-level diagram of the **current** architecture of the existing application.
Once this diagram is available, identify the **domain-of-change** of the architecture: the reason people are working on the system.
On top of that, adding **extension points** will enable evolvability.

### Communication

* In the inception phase of a project, you will need to talk to all the different stakeholders and make sure that their desired product will be built.
Aligning requirements from different stakeholders, will often be a challenge.
* In the implementation phase, it is important for the team to share a technical vision.
All team members need to collaborate to the same end-goal, which requires strong communication skills.
Including team members in defining the technical vision is useful to make sure everybody knows how they, individually, are contributing to the technical vision on a day-to-day basis. 

### Politics

The architecture of a system will have a large impact on the implementation, delivery and usage of the system.
Systems generally consist of multiple parts and it is the responsibility of the architect to focus on system integrity, creating a system that has a built-in ability to respond to change.
When the system lacks integrity, it will rapidly become _a system nobody wants to touch_.
Unfortunately many enterprises have this fear of change embedded in their culture and it will take strategy and sound people skills to prevent this from happening.
Influence Maps present an interesting way to map relationships between people and to visualise who influences who, in an enterprise.
Being aware of these relationships might be a game-changer.

# How?

<p style="text-align: center;">
  <img class="image fit" alt="How" src="/img/prag-arch/how.jpg">
</p>

One way of creating an architectural description is **OODA**: Observe, Orient, Decide, Act.
OODA can be compared with PDCA, also known as the [_Deming Cycle_](https://www.isixsigma.com/dictionary/deming-cycle-pdca/) or with Discovery Activities.

<p style="text-align: center;">
  <img class="image fit" alt="OODA" src="/img/prag-arch/ooda.png">
</p>

Any architectural model introduces abstraction and removes noise.
This model should be well-understood and feedback loops can help with this.
As an example, comparing a written down version with bullet points of a certain idea, will help in verifying that the message hasn't changed.
This insight should be mapped on the model.

* **Observe**: Observing both external and internal circumstances or dependencies of your systems.
	* Collect up-to-date information from different sources: stakeholders, competitors, similar systems, other viewpoints,...
* **Orient**: Using your past experience to make sense of these observations.
	* Analyse the observed information and use it to update your current reality. View events, filtered through your own experiences and perceptions.
* **Decide**: Deciding on a response, because there might be multiple alternative solutions.
	* Determine a course of actions.
* **Act**: Execute the selected decision.
	* Follow through on your decision.

This is not a linear process. 
This process benefits from **continuous feedback loops**.
Feedback loops imply that certain decisions may lead to new observations etc.
The OODA process can be used as a means of creating an architectural description.
Consequently, significant decisions will become part of it.
Since the creation of (significant parts of) the architectural description, starts with _(runtime)_ observations, capturing data and measuring stakeholder value will help to achieve better observations of the system.
