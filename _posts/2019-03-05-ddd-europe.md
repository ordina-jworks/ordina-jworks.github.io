---
layout: post
authors: [pieter_van_hees, kristof_eekhaut]
title: 'DDD Europe 2019'
image: /img/2019-02-16-ddd-europe/ddd-europe.jpg
tags: [DDD, Domain-Driven Design, conference]
category: Conference
comments: true
---

> This year, Pieter Van Hees and Kristof Eekhaut attended the [Domain-Driven Design Europe](https://dddeurope.com/){:target="_blank" rel="noopener noreferrer"}  conference in Amsterdam.
> The conference was all about Domain-Driven Design and related topics, with loads of interesting talks from beginners and experts in their field.
> In this post you can read about some of the talks and workshops we attended.

# Table of content

* [When we lose sight of our domain by Carola Lilienthal](#when-we-lose-sight-of-our-domain-by-carola-lilienthal)
* [Make your tests tell the story of your domain by Anne Landro and Mads Opheim](#make-your-tests-tell-the-story-of-your-domain-by-anne-landro-and-mads-opheim)
* [Domain modelling towards First Principles by Cyrille Martaire](#domain-modelling-towards-first-principles-by-cyrille-martraire)
* [Collaborative Modelling hands on session by Marijn Huizendveld](#collaborative-modelling-hands-on-session-by-marijn-huizendveld)
* [Lost in transaction? Strategies to manage consistency across boundaries by Bernd Ruecker](#lost-in-transaction-strategies-to-manage-consistency-across-boundaries-by-bernd-ruecker)
* [Estimates or No Estimates, Let's explore the possibilities by Woody Zuill](#estimates-or-no-estimates-lets-explore-the-possibilities-by-woody-zuill)

## When we lose sight of our domain by [Carola Lilienthal](https://twitter.com/Cairolali){:target="_blank" rel="noopener noreferrer"}

<span class="image left"><img class="p-image" alt="Carola Lilienthal" src="/img/2019-02-16-ddd-europe/carola-lilienthal.jpg"></span>
Carola discusses nine traps that developers fall into, and which prevent us to focus on the important aspect of developing software, the domain.

### Trap 1: Model monopoly

> "In order for developers to learn about the domain, they have to talk to the users, in a language that the users understand."

The first thing to understand is that developers need to talk to the users, because if they don't they will lose a lot of information. 
However, in a lot of companies, it is the analyst alone who talks to users when he/she gathers requirements.
By having one or more analysts who communicate with users, they have the monopoly of the domain.

When developers do communicate with users, they should do so in a language and/or model that the users understand.

Sharing class diagrams or database models with users is counterproductive.
The users will not understand this complex model and think it took a lot of effort to create.
As a consequence they either cannot give relevant feedback because they don't understand it, or they won't dare to because they don't want to discourage you.

A better way to communicate the model between users and developers is to use e.g. a schema with icons and descriptive names for actions.

<img class="image fit" src="{{ '/img/2019-02-16-ddd-europe/model-with-icons.jpg' | prepend: site.baseurl }}" alt="model with icons" />

### Trap 2: Only look at the future without taking into account the present
 
Look at how they are working today instead of only looking what you want to achieve in the future.
 
Ask yourself: "Who is doing what wherewith and what for?"
 
Avoid using requirements documents without concrete examples.

### Trap 3: Forget about reuse in your domain

First think about something being usable, and then see if it can be reused.

The Don't Repeat Yourself (DRY) principle should not be applied rigorously and blindly. 
If you apply DRY too often and too soon it often leads to leaky abstractions.

### Trap 4: Don't try to be too generic, DDD is about being as concrete as possible

By being concrete in your domain and your code you will have explicit and understandable code.

### Trap 5: if your components are too dependent on each other, you cannot scale them independently

High coupling between components prevents you from splitting them into different services that could scale separately.

Another disadvantage of high coupling is that it becomes difficult to let you software evolve, because changes in one component force changes in others.

### Trap 6: Large business classes

For example when modeling containers that move through different stages in a harbour.
The large business class could be the container that manages all stages the container goes through.
It would be better to model these stage as separate components.
This is called functional decomposition.

> "Don't create big business classes that serve everybody."


### Trap 7: How do we know what to build
How do we split a big elephant into pieces?

Let's say we have four different types of elephants in our business domain.
A common mistake would be to split elephant by different parts of the body. 
Where one component would be all four types of feet, another would be all four types of heads, etc.

This might not necessarily be the best approach to split the four elephant types.
The better approach would be to build one small elephant that is fully functioning, and then let it grow each iteration.
This approach lets you learn from each iteration and allows for incremental growth and refactoring.


### Trap 8: The expert trap

The people who developed the elephant will start to think they are experts, and know everything there is to know about the elephant, because they built it from scratch.
This assumption is false, because even the developers who built the elephant from scratch have assumptions, and assumptions can be false.
The real experts are, and will remain, the users.


### Trap 9: Everything is new, and therefore better

People tend to believe that this new system they are building will be way better than the old system they're replacing, because it looks better.

What they forget is that the users know the old system very well and are often very productive in it.
When the users will start to use the new system, they will feel like beginners again.
They will be less productive than with the old application, at least for a little while.


## Make your tests tell the story of your domain by [Anne Landro](https://twitter.com/annelandro){:target="_blank" rel="noopener noreferrer"} and Mads Opheim

<span class="image left"><img class="p-image" alt="Anne Landro" src="/img/2019-02-16-ddd-europe/anne-landro.png"></span>
Anne and Mads tell us how they drastically reformed the testing approach for the Norwegian Court Case Management system from constant repetitive manual verification to automated testing.

They explain that Value Chain tests have helped their team document the domain:
``` java
PersonIsRegisteredAsDeadAfterStartOfACaseOfDeath {
   createACaseOfDeath()
   registerTheDiseased()
   registerTheHeirs()
   notifyTheNationalRegistrtyOfTheDeath()

   assertThatThePersionIsRegisteredAsDead()
}
```
Each of these tests runs through a workflow of the domain and verifies the state at the end of it. 
They are high level tests that can be understood by all stakeholders, so that anyone - including domain experts and users - can look at a test and verify whether the result is what they expect.

From a  quick glance at this code you can learn a lot about how the domain works. 
Their team also uses this technique to document special cases that they discover in the domain, so that bugs caused by these quirks don’t happen again.


## Domain modelling towards First Principles by [Cyrille Martraire](https://twitter.com/cyriux){:target="_blank" rel="noopener noreferrer"}

<span class="image left"><img class="p-image" alt="Cyrille Martraire" src="/img/2019-02-16-ddd-europe/cyrille-martraire.jpg"></span>
In this great talk Cyrille explains us why he thinks that the Domain-Driven mind set of most teams is _"too gentile"_ and we aim to _“raise the waterline”_.  

With DDD we learned to immerse ourselves in the domain, use our domain-driven skills to understand the domain and conceptualise the domain into conceptual models. 
But we should go further by defining theories for our models and spot the First Principles that the theory consists of. 
Then we can challenge them, so that we can suggest changes to the business instead of reproducing the domain as it is. 
This way we get more involved and get to the next step, which is:  **Innovation!**

He points out a number of common problems that many teams have and suggest how we can improve them:

### The Human Compiler effect
One thing we often see is that we are given requirements piece by piece: the first sprint we get one case, then the next sprint another case and so on.  
But most of the time it turns out that all of these cases are actually special cases of some general case that we haven't been told about.
The reason for this is what Cyrill calls the Human Compiler effect:  someone behaving like a compiler, by taking the general problem and splitting it up and dumbing it down in separate simple solutions for every single consequence, so that a developer can implement them.

<img alt="tech-depth" src="{{ '/img/2019-02-16-ddd-europe/business_rules_for_dummies.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 750px;">

This is obviously a bad approach, because by dumbing down the domain for the developers, we keep them "dumb" and unaware of how the domain actually works. This leads to a dumb - and often wrong - implementation of the domain.
We should instead first describe the problem to the entire team. Then the team should build a theory upon it and challenge it by asking critical questions (Why? Why? Why? ...).  
This leads to a better understanding of the domain and thus to building better solutions.

### Technical complexity
On the other hand, sometimes we are given an explanation about a problem and some developers turn it in something even more laborious.  

<img alt="tech-depth" src="{{ '/img/2019-02-16-ddd-europe/tech-depth.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 750px;">

This increases technical depth and make the code unmaintainable.

The solution for this: refactoring and using Test-Driven Development.

### Theory vs Residual Mess
When we start creating theories about the regular world of our domain, often someone from the teams asks: "But what about ALL the other business rules?". 
We have an obsession for the "big bag of business rules". As if every business is a bunch of data with a bunch of if-statements on top.
We should realize that there is always some order in this mess and that a lot of things are more regular that irregular. 
We have to find out these regularities, find out the theories behind them and then we can create our domain model.

Of course any business also has irregularities that do not fit into our theories and we can not just ignore these. We call this the _Residual Mess_.
However we should not allow this mess to affect our beautiful theories. Instead we should - as Eric Evans explained before - define a _Spill Zone_ in the application where we can put all the messy parts of the application.

### Conclusion
Cyrill advices us to:
- Raise the waterline
- Expect untold regularities
- Practice TDD
- Practice DDD
- Build theories, not just lists of business rules
- Learn to think based on First Principles. Disrupt and become innovative!


## Collaborative Modelling hands-on session by [Marijn Huizendveld](https://twitter.com/huizendveld){:target="_blank" rel="noopener noreferrer"}
 
<span class="image left"><img class="p-image" alt="Marijn Huizendveld" src="/img/2019-02-16-ddd-europe/marijn-huizendveld.jpg"></span>
We are divided in groups of five with one team leader.
The goal: to model an application for the maintenance team of a car rental company in Amsterdam.
The application must determine when a car is due and available for maintenance.
   
New requirements are provided step by step on “requirement” cards, so that we have to adapt and reshape our model each time we discover a bit more about the domain. 
We learn the importance of visualising the solution (model) and talking about the problem based on what we have visualized in front of us. 
Putting notes on the board with the different concepts that we identify, sparks interesting discussions that make use think further about the problem:  Is the given name correct and clear?  Do we mean the same thing when we talk about ...?  Do two words on the board actually mean the same thing?
   
After each requirement card follows a card for the team leader to consider making changes to the way we work.
One card tells the leader to look for someone who has been a bit quiet or outside of the discussion and move the group around so that he is next to the board.
This immediately make this person more involved in the discussion and we also start paying attention to his view.  
Another card suggests to let someone go through the entire process that is modelled on the board and explain it step by step.
We immediately find out that some definitions on the board are hard to explain and not as clear as we thought they were.

With this excellent workshop Marijn shows us how easy it can be to come up with a great domain model that is understood and agreed upon by everyone involved.


## Lost in transaction? Strategies to manage consistency across boundaries by [Bernd Ruecker](https://twitter.com/berndruecker){:target="_blank" rel="noopener noreferrer"}

<span class="image left"><img class="p-image" alt="Bernd Ruecker" src="/img/2019-02-16-ddd-europe/bernd-ruecker.jpg"></span>
In this talk Bernd explains the challenges we face when using transactions in big applications and distributed systems.

He starts by reminding us that our Aggregates in DDD are usually our transactional/consistency boundaries. 
Meaning that within an Aggregate, you have an ACID transaction.

If you were to have a transaction over multiple Aggregates, you would have a stronger coupling between them.
For example you can't split them easily into multiple separate microservices.

What you could do is use two-phase commits to have you transaction over multiple Aggregates in separate services.
But the problem is that two-phase commits don't scale.

> Grown ups don't use distributed transactions

An alternative solution is the alternative to ACID: BASE.
* Basically
* Available
* Soft-state
* Eventual consistency

By applying Eventual Consistency you update one aggregate in one transaction and the other in a different transaction.
This means that the system will be in an inconsistent state for a short time, but eventually it will be consistent.

After that, Bernd explains different strategies how to implement this eventual consistency with an example.

Let's say that we have an credit card payment aggregate that charges a credit card aggregate, and that this communication happens through an asynchronous message. 
This communication can go wrong in multiple ways: the message might never arrive at the credit card service, it might arrive but the payment service doesn't receive the feedback, etc. 

### Strategy 1: Cleanup

If the payment service can't send the message, or if it doesn't receive feedback that the message was received, it can send a payment failed event.
The problem with this strategy is that this 'payment failed' event also might not arrive at the credit card service. 
Which means that it won't be able to do his cleanup.

### Strategy 2: Keep state

#### Stateful retry

By using a stateful retry the payment service would keep the state of whether or not the message was delivered to the credit card service.
As long as the credit card service does not acknowledge that it processed the message, the payment service will keep sending the message.

#### Stateful retry and cleanup

With this strategy the payment service keeps retrying to send the message until a timeout has passed or after X retries.
After that it will send a payment failed event for which the retry policy might also apply.

### Strategy 3: Compensation/Sagas

#### Choreography

Compensation means that if something in the asynchronous process fails, a compensating process will be triggered.
A classic example is a system where you book a hotel in one service which will trigger a car booking.
If the car booking fails, it will emit an event that will be picked up by the hotel service which will cancel the hotel room related to the car booking.

This system of services responding on events from each other is called orchestration. 
We don't define in one place how the whole process works, but services know themselves on what to react on.

However, this compensation saga implemented with choreography might become complex because it could be a trainwreck of cascading cancellations.
E.g. a hotel booking triggers a car booking, which triggers a flight booking.
If you have complex processes with a lot of services involved, this might become chaotic.

<img class="image fit" src="{{ '/img/2019-02-16-ddd-europe/event-driven-choreography.jpg' | prepend: site.baseurl }}" alt="event driven choreography" />

#### Orchestration

By using an orchestration approach there would be one service responsible for managing the whole process.
In the hotel/car/flight example a trip service could be this orchestrating service that calls the other services and tells them to book or cancel.

Bernd then argues that if you choose an orchestration strategy that BPMN tools and libraries can help a lot in defining these processes.
You could for example define your business process and all compensating activities.

Some libraries even provide quite nice DSLs where you can make your business process quite explicit.
And the good thing is that this business process or saga is even part of your domain logic.

<img class="image fit" src="{{ '/img/2019-02-16-ddd-europe/orchestration.jpg' | prepend: site.baseurl }}" alt="orchestration" />

## Estimates or No Estimates, Let's explore the possibilities by [Woody Zuill](https://twitter.com/WoodyZuill){:target="_blank" rel="noopener noreferrer"}

<span class="image left"><img class="p-image" alt="Woody Zuill" src="/img/2019-02-16-ddd-europe/woody-zuill.png"></span>
Woody starts by pointing out that his workshop does not give answers, but does ask critical questions.
His goal is to share some experiences he had, and he realizes that what works in some companies, does not work in others.


After this disclaimer he talks about a big project he worked on where they experienced sprint after sprint that their estimates were always plain wrong.
Every retrospective this frustration was mentioned and every time the solution management came up with was that they just had to get better at making estimations.

> "Trying the same thing over and over again expecting different results is the definition of insanity" - Einstein

In fact, Woody said, a constant in his 35 year career was that estimations were always off, and people were always trying to solve this by "getting better at estimates".

Wrong estimates are often not the problem itself, but a symptom of something else.
It could be that they are off because the requirements were unclear, or that requirements keep changing.


### #NoEstimates

\#NoEstimates was originally used to refer to reference a blog post Woody had written on a project where they did not use or make estimates.
But actually 'No estimates' is a placeholder for a larger conversation.

Woody mentions that for some things in life we want estimates, but we never do because we know it's impossible.
E.g. how long will this clinical trial take?
How long till we find a cure for cancer?
How long till you finish this work of art?
In fact if we have enough data to definitively say how long something will take to develop, we already built it and we don't need to do it again.

Next he asked the audience to explain in a single word what an estimate means. 
Quite some different answers were given, but in general it came down to this list:
* Guess
* Expectation
* Lies
* Misunderstanding
* Approximation

From these answers the following working definition could be extracted:
> An estimate is a guess of the amount of work time to create a project, a feature or some bit of work in developing software.

### Why do we estimate?

Some reasons why we make estimates:
* Planning / budget
* Which approach do we choose / in what order do we do things
* Dependencies on other teams

In software development, estimates are often used to attempt to predict the future.
When will it be done?
How much will it cost?
What can we get done this sprint?
What can we get done for this amount of money?

Basically we use estimates to help us make decisions.

If we have to choose between making project A or project B, we would make an estimation of how long it would take to do either of them.
But do we really want to choose between project A or B based on a guess?
Wouldn't it be better to do an MVP of both and see which is working best?

Is on time or on budget a good measure of the results of our decision?
No, because you cut features, make it unmaintainable, etc.
Isn't it better to measure customer satisfaction as a metric for success?

### Conclusion
After this workshop the audience was left with even more questions.
But what we did realize is that often people make estimations without any good reason. 
And sometimes it would be better to reflect on why we do estimations, and see if it really provides us value, and if there is no alternative solution for the problem we're actually trying to solve with estimations.


## Summing it all up

Domain-Driven Design Europe was a great conference where we got to learn more about software design and techniques that help us do what we love to do the most: creating great software for users.
The organizers did an excellent job in creating a conference with great speakers.
Next year's conference will take place in Amsterdam on the 6th and 7th of February 2020.

