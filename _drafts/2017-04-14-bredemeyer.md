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
It is critical to today's business success; yet it requires technical, business and organizational talents and skills that warrant their own path of career development, education, and research.

Earlier this month, I was lucky enough to participate in a four-day workshop organized by [Bredemeyer Consulting](http://www.bredemeyer.com/) in the Netherlands.
The [goal](http://www.bredemeyer.com/contact.htm) of the workshop: helping good architects become _great_ architects.
Bredemeyer Consulting intends to inspire and encourage architects to greatness, by helping them to visualize what is possible, and see how to get there.
They aim to achieve this by providing the tools and techniques to help architects be successful.
The training covers the essential technical tasks of architecting (architecture modeling and specification, architecture tradeoff analysis, component design and specification, etc.) as well as architectural leadership skills.

### Topics

1. [Architecture](#1-architecture)
1. [Strategy](#2-strategy)
1. [Conceptual Architecture](#3-conceptual-architecture)
1. [Logical Architecture](#4-logical-architecture)
1. [Leadership](#5-leadership)

# 1. Architecture

## What

Defining architecture is never easy, as many different definitions are used by different organizations.
[Dana Bredemeyer](https://www.cutter.com/experts/dana-bredemeyer) defines architecture as **a set of decisions that have multiple uses**.
These uses can span time, projects and places.
Of course, this makes it easy to have too much or too little architecture.
Finding the right balance, is difficult.
To illustrate this difficulty, the following properties should be kept in mind when validating architectural decisions.
An architectural description can be:
* Good
	* Technically sound (eg. having well-defined interfaces)
	* Well-documented
	* Elegant
* Right
	* A solution to the problem
* Successful
	* When the system realizes value

It is up to the architect to make sure value is realized.

## How

During the architectural process, it is of extreme importance to look both at strategy and at implementation, as an architect generally moves between these two worlds.
This process is comparable to the _elevator approach_ from [Gregor Hohpe](https://leanpub.com/u/ghohpe).
His book ["37 Things One Architect Knows About IT Transformation"](https://leanpub.com/37things) is  approachable to read and contains a large number of useful tips for aspiring and seasoned architects.
Most certainly a recommended read.

To facilitate decision-making, Dana Bredemeyer suggests using a re-reentrant discovery activity.
In this method, decisions are taken early (and written down) because at an early stage it is still cheap to change them.
However, when decisions become expensive (eg. impacting implementation), they should be taken at the last possible, responsible moment.
The re-entrant nature of this model, facilitates change, dialogue and consensus.
It is very similar to [OODA](https://en.wikipedia.org/wiki/OODA_loop) (Observe, Orient, Decide, Act) and [PDCA](https://en.wikipedia.org/wiki/PDCA) (Plan, Decide, Check, Act), also known as the Deming cycle.

## Principles

To kickstart an architectural description, it is useful to define a strong foundation with a set of [principles](http://pubs.opengroup.org/architecture/togaf8-doc/arch/chap29.html).
These principles must be clear, unambiguous and actionable.
They can not conflict with each other and must be followed.
The reason to define these principles early, is to provide confidence when solving hard problems and to constrain decisions that get made numerous times.

A couple of examples:
* [Ebay](https://www.infoq.com/presentations/shoup-ebay-architectural-principles)
* [Bredemeyer](http://www.bredemeyer.com/HotSpot/20040428EASoapBox.htm)

# 2. Strategy

For an architecture to be successful, it must support the business strategy of the system and the organization.
One might define architecture as **the translation of strategy into technology**.

An approach to achieve this is:

* Clarify the business concept(s)
* Brainstorm (with business stakeholders to look at possible and alternative business concepts)
* Define high-level requirements
* Define high-level architecture (From [Conceptual Architecture](#conceptual-architecture) to [Logical Architecture](#logical-architecture))
* Validate

An architect must [understand what business is trying to achieve](http://www.bredemeyer.com/pdf_files/Presentations/EnterpriseArchitectureAsCapabilitiesArch.pdf) and understand what an organization needs to be good at to realize success (_or what the system needs to be good at_).

## From idea to strategy

When business concepts are clear, but the strategy isn't (fully) established, shaping strategy from business concepts can be achieved by:

* Writing down business concepts as a bulleted list
* Translating this bulleted list into plain text
* Looking at the difference between the list and the text

This will, more often than not, refine the business concepts and identify what is strategically most important.
Another way to refine business concepts, is using the [Business Model Canvas](https://strategyzer.com/).


# 3. Conceptual Architecture

The goal of the [Conceptual Architecture](http://www.bredemeyer.com/ArchitectingProcess/ConceptualArchitecture.htm), is to define components (subsystems) and the interaction between these components.
The Conceptual Architecture must remain high-level, because in this phase, the architect wants to explore alternatives.
Adding too much detail to the Conceptual Architecture will become expensive.

White board sketching can be a useful method to determine to Conceptual Architecture: talking with the business users next to a white board and drawing the system together.
Dana shared a couple of tips and tricks to increase participation from business users:

* Make the diagram a bit sloppy. This will prevent participants from thinking it's finished.
* Have fun. Let the ideas flow.
* Use colors and icons. Make it visual.

Another tool to formalize components are [CRC-R Templates](http://www.bredemeyer.com/pdf_files/CRCR_Template.PDF). These are typically half a page narratives that define a component, its responsibility, its collaboration with other components and the rationale behind its responsibilities.

The Conceptual Architecture can be used to validate the feasibility of alternatives.
For example by going over use-cases or by identifying if the system can be in a state that renders the architecture invalid.

# 4. Logical Architecture

The Logical Architecture details out **full responsibilities** per component and all **the interfaces** per component.
It adds precision, providing a detailed _blueprint_ from which component developers and component users can work in relative independence.
These components ought to be derived from the Conceptual Architecture.
By selecting the core behavior of the components and defining the data that moves between components (eg. in a sequence diagram), the architecture becomes actionable and ready for implementation.
In larger systems, the sequence diagram can aid a component owner in understanding how his component lives in the bigger system.
When the state of the data (moving between components) evolves, it might also be useful to draw a state diagram.

A very interesting attention point to creating a logical architecture is that the value of a system is not the sum of its parts, but the sum of the interaction between the parts.
This is beautifully explained by [Russell Ackoff](http://ackoffcenter.blogs.com/) in this video on [YouTube](https://www.youtube.com/watch?v=waTq3bUBCgk).


# 5. Leadership

Being successful as a leader often depends on the ability to influence others: getting from a lot of (possibly good) ideas to a **shared vision**: a philosophical harmony of values.
Getting this buy-in from stakeholders only strengthens the importance of interaction and collaboration.
The activities of a leader range from inspiring, mentoring, listening and setting directions.
Settings directions means formally defining what a system must do or what a strategy wants to achieve.
When a leader empowers his (or hers) team, trust will be established and more value will be realized.

## Passion and Discipline: Don Quixote's Lessons for Leadership

Why [Don Quixote](https://en.wikipedia.org/wiki/Don_Quixote)?
What lessons can we learn from the fictional 16th-century gentleman who careered around the Spanish countryside tilting at windmills and challenging sheep to battle?

> [James G. March](https://www.gsb.stanford.edu/faculty-research/faculty/james-g-march)
>
> We live in a world that emphasizes realistic expectations and clear successes.
> Quixote had neither.
> But through failure after failure, he persists in his vision and his commitment.
> He persists because he knows who he is. The critical concerns of leadership are not technical questions of management or power, they are fundamental issues of life.
>
> -- Source: [Insights by Stanford Business](https://www.gsb.stanford.edu/insights/don-quixotes-lessons-leadership)

Believing in something can make others believe in it.
