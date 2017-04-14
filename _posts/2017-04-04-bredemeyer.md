---
layout: post
authors: [bart_blommaerts]
title: "Bredemeyer: Architects Architecting Architecture"
image: /img/bredemeyer.jpg
tags: [Architecture]
category: Architecture
comments: true
---

Software architecture is getting a lot of attention. 
It looks beyond the details of today’s technologies to the underlying trends, techniques, and principles that underpin lasting success in our fast-moving field.
It is critical to today's business success, yet it requires technical, business and organizational talents and skills that warrant their own path of career development, education, and research.

A couple of weeks ago, I participated in a four-day workshop organised by [Bredemeyer Consulting](http://www.bredemeyer.com/) in the Netherlands. 
The [goal](http://www.bredemeyer.com/contact.htm) of the workshop: Helping good architects become _great_ architects. 
Bredemeyer Consulting intends to inspire and encourage architects to greatness, by helping them to visualize what is possible, and see how to get there.
They achieved this by providing the tools and techniques to help architects be successful. 
The training covers the essential technical tasks of architecting (architecture modeling and specification, architecture tradeoff analysis, component design and specification, etc.) as well as architectural leadership skills.

### Topics

1. [Architecture](#1-architecture)
1. [Strategy)](#2-strategy)
1. [Conceptual Architecture](#3-conceptual-architecture)
1. [Logical Architecture](#4-logical-architecture)
1. [Leadership](#5-leadership)

# 1. Architecture

## What

Defining architecture is never easy, as many different definitions are used by different organisations.
Dana Bredemeyer defines architecture as **a set of decisions that have multiple uses**.
These uses can span time, projects and places.
Of course, this makes it easy to have too much or too little architecture.
Finding the right balance, is difficult. 
To illustrate this difficulty, the following properties should be kept in mind when validatin architectural decisions.
An architectural description can be:

* Good
** Technically sound (eg. having well-defined interfaces)
** Well-documented
** Elegant
* Right
** A solution to the problem
* Successful
** When the system realizes value

It is up to the architect to make sure value is realized.

## How

During the architectural process, it is of extreme importance to look both ways: strategy and implementation, as an architect generally moves between these two worlds.
This process is comparable to the "elevator approach" from [Gregor Hohpe](https://leanpub.com/u/ghohpe).
His book ["37 Things One Architect Knows About IT Transformation"](https://leanpub.com/37things) is very approachable to read and contains a large number of useful tips for aspiring and seasoned architects.

To facilitate decision-making, Dana Bredemeyer suggests using a re-rentrant discovery activity. 
In this method, decisions are taken early (and written down) because it is still cheap to change them.
However when decisions become expensive (eg. changing implementation), they should be taken at the last possible, responsible moment. 
The re-entrant nature of this model, facilitates change, dialogue and concensus.
It is very similar to [OODA](https://en.wikipedia.org/wiki/OODA_loop) (Observe, Orient, Decide, Act) and [PDCA](https://en.wikipedia.org/wiki/PDCA) (Plan, Decide, Check, Act).

## Principles

To kickstart an archictural description, it is useful to define a strong foundation with a set of [principles](http://pubs.opengroup.org/architecture/togaf8-doc/arch/chap29.html).
These principles must be clear, unambiguous and actionnable.
They can not conflict with each other and must be followed.
The reason to define these principles early, is to provide confidence when solving hard problems and to constrain decisions that get made numerous times.

A couple of examples:

* [Ebay](https://www.infoq.com/presentations/shoup-ebay-architectural-principles)
* [Bredemeyer](http://www.bredemeyer.com/HotSpot/20040428EASoapBox.htm)

# 2. Strategy

For an architecture to be successful, it must support the business strategy of the organisation and the system.
One might define architecture as the translation of strategy into technology.

An approach to achieve this is:

* Clarify business concept
* Brainstorm (with business stakeholders to look at possible / alternative business concepts)
* Define high-level requirements
* Define high-level architecture (From Conceptual architecture to Logical architecture)
* Validate

An architect must [understand what business is trying to achieve](http://www.bredemeyer.com/pdf_files/Presentations/EnterpriseArchitectureAsCapabilitiesArch.pdf), understand what an organization needs to be good at to realize succes (or what the system needs to be good at).

## From idea to strategy

When business concepts are clear, but the strategy isn't (fully) established, shaping strategy from business concepts can be achieved by:

* Write down business concepts as a bulleted list
* Translate this bulleted list into plain text
* Look at the difference between the list and the text

This will, more often than not, refine the concepts and identiy what is strategically most important.
Another way to refine business concepts, is using the [Business Model Canvas](https://strategyzer.com/).


# 3. Conceptual Architecture

The goal of the Conceptual Architecture, is to define components (subsystems) and the interation between these components. 
The Conceptual Architecture must remain high-level, because in this phase, the architect wants to explore alternatives and adding too much detail to the Conceptual Architecture will become expensive.

White board sketching can be a useful method to determine to Conceptual Architecture: talking with the business users by a white board and drawing the system together.
Dana shared a couple of tips and tricks to increase participation from business users:

* It is allowed to make the diagram a bit sloppy. Participants will not think it is finished.
* Have fun. Let the ideas flow.
* Use colors and icons. Make it visual.

Another tool to define components are [CRC-R Templates](http://www.bredemeyer.com/pdf_files/CRCR_Template.PDF). These are typically half a page narratives that define a component, its responsibility, its collaboration with other components and the rationale behind its responsibilities.

The Conceptual Architecture can be used to validate the feasibility of alternatives.


# 4. Logical Architecture

details full responsibilties per component
interaction diagram
data that moves between components

ackoff

# 5. Leadership

what do you do
- trust
- listen
- get the team to do more
what do you know : "i know me"
who are you: integrity

define reality, serve, say thanks
Passion and Discipline: Don Quixote's Lessons for Leadership

liminal thinking
