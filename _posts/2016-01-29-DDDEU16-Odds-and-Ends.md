---
layout: post
authors: [tom_verelst]
title: 'oDDs and enDs: Vaughn Vernon  on software projects in peril'
image: /img/DDDEurope2015.jpg
tags: [Domain-Driven Design, DDD, Software Craftmanship]
category: Domain-Driven Design
comments: true
---

> There's an interesting situation you will find in many software development projects.
> Often there is a team dedicated to keep the software alive.
> The team patches the system and deals with emergencies day after day.
> Almost every organization is dealing with this kind of situation.
> Obviously this is not the situation we want to be stuck in, but how do we alleviate ourselves from this?

Vaughn Vernon gave a presentation today at Domain-Driven Design Europe.
He started his presentation about the odd things that happen in software projects.
Then he shed some light on the (future) solutions using Domain-Driven Design,
the so called *ends* of the problems caused by the *odds*.

# oDDs
What are the odd things that happen in software development projects?

#### Cost centers

An insidious problem is that *an IT organization within a company is considered a cost center*.
The business views software as something that costs a lot of money.
You can almost say that the business almost wished they did not have to use computers,
or employ software developers.

What about the company and you?
How does the business view you?
Do they view you as a hacker?
Someone who is thrilled about technology?
If that's the case, then you may be viewed as a cost center instead of a profit center.

#### Budgets for software development projects are minimal

Often a team only contains one senior developer and a lot of juniors developers.
The senior developer must keep everything running and moving.

#### Database-Driven
Looking at the business like a database might be a problem.
How often does a developer think like this?
Data needs to go from a view into a database and out of a database to a view like this.
That is how a lot of developers think.
We must be careful to be focused so hard on technology and not on business value.

#### Shiny Objects
Software developers are always looking for shiny objects.
They want to learn about the latest technologies and work with them.
DDD, BDD, TDD, Big Data, Machine Learning, Deep Learning, AI, Reactive, ...
How do we justify those things to the business?

Big Data was a big buzzword 5 or 6 years ago.
It is still a buzzword, but if you're not saying *Machine Learning* as well, you're not cool anymore.

Are we using technology when it is appropiate?
Sometimes the latest technology isn't always the correct solution for the problem.

#### A Not-So-Ubiquitous Language

> It doesn't matter what you name it. It's just code.

It is very true for the common developer that they think it doesn't matter.
But it does matter.

The business wants to talk about something *this way*,
but the developer calls it differently anyway. *"It's just code"*.

#### Poor Collaboration

How many organizations use JIRA as a collaboration tool and fail at it?
Often someone spends days writing specifications and creating JIRA issues,
yet developers don't use them.

**Estimates are a big deal**.

Sometimes it takes longer to estimate than to fix the problem.

**Task Board Shuffle**

This is where software design is entirely comprised of moving sticky notes.
You move a sticky note from the Todo column to the In Progress column.
After we have done this, we run back to our machine and start coding.
Without thoughtful design, the code comes out of our fingertips.

If you have a team compromised of a few developers working on the same problem,
there will be multiple translations in one day of the same thing.
Using the same terms is very important, but often neglected.

#### Big Ball of Mud
Many organizations are deducing a Big Ball of Mud as software architecture.
Everything is part of the same namespace and there are no bounded contexts.
The software consists of entangled models that should be separate,
but they are all in one place.

This is the cause of many problems in the industry.
You have to recognize a situation when a Big Ball of Mud is being developed and stay out of it.

<div class="4u$">
    <img class="image fit" src="{{ '/img/odds-and-ends/ballofmud.png' | prepend: site.baseurl }}" alt="Big Ball of Mud" />
</div>

#### Business logic is escaping to everywhere

Business logic can be found in places outside of the core domain.

**Business logic in persistence logic**

You often see business logic inside of persistence logic.
Someone is ready to save an object to the backend storage and there is business logic in the persistence logic.
The persistence logic is hiding the important business logic.
You lose trace of your business logic because of this.

**Queries in business logic**

You see business logic creating decisions by querying the database.
Some part of the decision that is being made is hidden to the business logic, because it is inside that query.
These queries can also be broken.
Sometimes queries are so expensive, they shut down other operations because the tables are locked.

**Business logic in the UI**

The biggest crime against business logic is putting it inside the UI.
The business logic is put inside the view template or model instead of the domain model.

#### CRUD
CRUD does not work with complexity.
It's also an insidious problem where software developments teams think they can solve any problem with a database.

#### Anemic Domain Model

The Anemic Domain Model is one of the most widespread and adapted architectures.
Often there is a domain model with objects which are connected with relationships.
This all looks nice on paper, but there is no domain logic or any behavior inside these objects!
Services live on top of the domain model. This is often called the Service Layer or the Application Layer.
They contain most of the domain logic and use the domain objects for data.
This is very contrary to object-oriented design.
The data and the processes are combined together and it looks very much like procedural programming.
This anti-pattern is so common, because most people have not worked with a real domain model.

#### Wrong abstractions

A lot of times developers are thinking too much about abstractions
instead of getting down to the business.
They form a lot of *"cool"* abstractions that will make it better in the future.

> "What if we have this sort of situation in the future?
> If we come up with this kind of abstraction, then this abstraction will take care
of the situation in the future."

We cannot predict the future.
The future of software is unknown.

#### Coupled Services

Coupled services are horrible. What if, for example, a REST controller calls a service, which calls another system.
If the other system does not respond, you have a gap in your business logic, even if you use global XA transactions.

#### What to do?

It really could be that everybody else is normal.
What if writing systems with the odd things actually is the norm?
If that is normal, then wouldn't you like to be the oddball in the crowd?

# enDs

You want to be the furthest point away from these problems.
You want to come up with solutions that work.
The business must not view you as a technologist,
but as someone who is interested in  the business.
You can't just keep throwing technologies at the problem.
You must come up with beneficial business solutions.

#### Developer maturity

If you are a cost center, then you must come up with a way to make your advances
more economical. You have to develop your maturity.

You have to seek other ways to get the rest of your team to maturity.
Urge them to go to DDD and software meetups.
Do whatever you can, because you can only benefit if those around you are more mature than you.

Passion is something we can't always teach.
But you must try to work with people who are passionate about their job.

#### Profit center

You must try to become a profit center.
An entire unit of the business is a profit center.
You can only become a profit center if you keep adding business value in a timely manner.

#### Collaborate with the business

Don't use JIRA to collaborate with the business.
You will be amazed what you can learn if you get away from the desk and into a room.
The business will tell you what they problems they have hated for years.

#### Use an ubiquitous language

Some things cannot be explained by anybody. *"Why do we call it this? Can we call it this instead?"*
You can learn those interesting and beneficial details by forming an ubiquitous language.
Make it your goal to find that ubiquitous language with a bounded context.

#### Concrete Scenario

Show concrete users in a concrete scenario and what goal that has to achieve.
As developers we have to chase after deep models as shiny objects.
It's not just technologies.
Technology matters.
Try to experience with deep modeling through an ubiquitous language.
You can use the Gherkin language to achieve this.
With these concrete scenarios you can model your domain model and test it.

```
Feature: Coffee Machine
    Scenario: Buy Coffee
        Given there is coffee left in the machine
        When I deposit 1 euro
        And I press the coffee button
        Then I should be served a coffee
```

#### Use bounded contexts

To avoid the Big Ball of Mud, you must introduce bounded contexts and separate models.

It is equally important to separate the models as it is to introduce core concepts in the core domain.

You have to learn about event storming.
You can understand what your bounded contexts are from an event storming event.
<div class="6u$">
    <img class="image fit" src="{{ '/img/odds-and-ends/event-storming.jpg' | prepend: site.baseurl }}" alt="Event Storming" />
</div>


#### Metrics-based Estimates

The artifacts that come out of an Event Storming event, you can use those as estimation units.

If you can't finish an iteration according what you've planned,
move these estimation units in a retrospective and encur modeling debt.
This modeling debt must be fixed as soon as possible.

#### Know architecture
You must know good architectures, like the hexagonal architecture or CQRS. 
These architecture solve many of the above problems.
They enforce bounded contexts and give the ability to do context mapping.
<div class="6u$">
    <img class="image fit" src="{{ '/img/odds-and-ends/hexagonal.jpg' | prepend: site.baseurl }}" alt="Hexagonal Architecture" />
</div>

#### Decoupled Services
Services have to be decoupled.
A service which calls a peer service directly, is tightly coupled.
It cannot work without the other service.
What if the other service times out?
You can use domain events and messaging systems to fix this problem.

#### Microservices

The microservices architecture is another shiny object that a lot of people are chasing.
The thing is, they are extremely similar to bounded contexts.
Every microservice is master of their own model and usually has one point of access, like an aggregate root in Domain-Driven Design.

#### Actor Model

The Actor Model is an extremely powerful tool that we need to use in the very near future
by the majority of software development teams.
CPU processing power is not increasing, but the amount of cores keeps increasing.
The Actor model is a new way to leverage this power because it fully utilizes these cores with threads.

<div class="6u$">
    <img class="image fit" src="{{ '/img/odds-and-ends/actor-model.png' | prepend: site.baseurl }}" alt="Actor Model" />
</div>

## Summary

- Many teams are in peril over poorly designed systems
- Software development culture is broken
- Developers must gain maturity and passion
- DDD can be used to make a difference
- Use the Actor model to design DDD based microservices

## One more thing

Vaughn Vernon announced an additional new book called *Domain-Driven Design Distilled*.
It is a 200 page thick book that explains all of the core concepts of DDD.
This is very light weight book, intended to rapidly not only teach your team members,
but also the business about DDD. This book will be available within a month.
