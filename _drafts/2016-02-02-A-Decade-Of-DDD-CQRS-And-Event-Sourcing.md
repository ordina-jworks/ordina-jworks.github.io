---
layout: post
authors: [ken_coenen]
title: 'A decade of DDD, CQRS and Event Sourcing'
image: /img/DDDEurope2015.jpg
tags: [Domain-Driven Design, DDD, CQRS, Event Sourcing, Software Craftmanship]
category: Domain-Driven Design
comments: true
---

> Command and Query Responsibility Segregation is the **most misinterpreted pattern** in software design. CQRS doesn’t mean eventual consistency, it’s not about eventing and messaging. It’s not even what most people believe about having separate models for reading and writing.
>
> In his talk [A decade of DDD, CQRS and Event Sourcing](http://dddeurope.com/2016/greg-young.html) on DDDEurope 2016, Greg Young gives us a retrospective over the last ten years practicing CQRS and event sourcing.

----------

### CQRS?

Before I go any further, let's start explaining what CQRS really is. It’s all about **applying a design pattern** when you notice that your class contains both query- and command methods. It’s not a new principle. Bertrand Meyer described **Command-Query Separation** in his book Object-oriented Software Construction as follows:

> "Every method should either be a command that performs an action, or a query that returns data to the caller, but not both. In other words, Asking a question should not change the answer."

We can apply CQRS principles in many levels of our application, but when people talk about CQRS they are really speaking about applying the CQRS pattern to the object that represents the service boundary of the application. The following example illustrates this.

<img class="image fit" src="{{ '/img/cqrs/customerservice.png' | prepend: site.baseurl }}" alt="CQRS" />

Although this doesn’t seem very interesting to do at first, architecturally we can do many interesting things by applying this pattern:

 - One example is that the separation is more explicit and programmers will not find it odd to use **different data models** which use the same data. Reading records from the database must be fast and there’s no problem at all if you can achieve this by using multiple representations of the same data.
 - CQRS is also an **enabler for event-based programming models**. It's common to see CQRS system split into separate services communicating with Event Collaboration. This allows these services to easily take advantage of Event Sourcing.

You should be cautious however not to use it everywhere and only in some **Bounded Contexts** that need it, as everyone agrees that applying the CQRS principle adds complexity.

### History

> "When you searched CQRS on Google a decade ago, it thought it was just Cars misspelled."

CQRS is not a new concept. You might even say that event sourcing has been around for thousands of years. The ancient Sumerians wrote accounting info on **clay tablets** and baked them. That document stored events in time. Immutable events. And documents are built up of this event information.

As I said earlier, Meyer talked about the principle in his book which was released in 1988.

It's QCon San Francisco in 2006 which really gave a boost to the popularity of CQRS and event sourcing. Martin Fowler picked up [CommandQuerySeparation in his Bliki](http://martinfowler.com/bliki/CommandQuerySeparation.html) and after that, things began to grow.

CQRS is more of a **stepping stone** and you have to put it in its historical context. It was a **natural consequence of what was happening with Domain-Driven Design** at that time. CQRS is not an end goal, it should be seen as a stepping stone for going to an event sourced system.

### Good things

The community around CQRS and event sourcing is growing to about **3000 people**. More and more domains are involved with event sourcing. In other domains, other added values were discovered. These people had breakthroughs by practicing CQRS, eg. in a warehouse system, instead of denying a user’s request because the system couldn’t handle the requests anymore, it accepts an event and processes it a later time.

Another good thing about event sourcing, once you model events, you are forced to think about the **temporality of systems**: what happens at a specific time? how will this object behave in this situation?

**Event Storming** exercises help you to figure out which domains you have in your system and give you a clear view on the different events. You can then formalize events and commands.

Ideas about Event Sourcing have been spreading. Functional programming gained popularity in parallel with event sourcing. Event sourcing is a **natural functional model**. Every state is a left fold of your previous history.

A lot of other things also pushed Event Sourcing forward:

 - Cloud computing
 - Popularity of Actor Models
 - Microservices

### Bad things

Some people see CQRS as a full-blown architecture, but it’s not. This is wrong. CQRS and event sourcing is not a top level architecture. You cannot build an Event Sourced system. Instead, you end up into building a monolith which is event sourced internally. Event sourcing is simply not a good solution to every problem. For example, once you deal with immutable events, you need to think about corrections to data. Whenever a user corrects a value and hits the save button again, you would need to have an event for that and it would be too complex to handle.

A lot of little things are misinterpreted by the community and this caused **dogmas** to pop up:

 - *"Value objects can be mutable in some use cases”* - It’s not because Eric Evans once said "Value objects are normally immutable” that you have to think that in some situations, you can justify mutable objects. There is never an excuse to create mutable objects and they should be avoided at all times.
 - *"The Write side cannot query the Read side”* - There are times that you have to. When you have an invariant that crosses thousands of aggregates, you cannot avoid it.
 - *"Inputs should always equal Outputs” eg. if i have an order command, an order event should be the result* - This is not always the case and there are situations where input and output aren’t one on one.
 - *"Must use one-way commands”* There’s no such way as fire your command, put it on a queue and forget. One way commands don’t exist! They happened in the real world. They cannot be rolled back. Using commands gives you the opportunity to respond to it. One-way commands can however be changed in events in an event sourced system.

Over the years some CQRS frameworks have been created. Greg’s advice is... **Don’t write a CQRS framework**! It will guaranteed be abandoned after a year. It’s not a framework, it’s more like a reference implementation. We also need to pull back away from **Process Manager frameworks**. You can probably solve your problem with an **Actor Model**.

A **queue of messages** doesn’t work for all kinds of systems. You can probably linearize in 90% of the use cases, it will also probably be cheaper. For the other 10%, interesting things are happening. We’re gonna see a push to **occasionally connected systems**. When you choose availability and high throughput, you’ll have to move to message-driven architectures and linearization is not an option.

### Future things

A lot of interesting things are happening in the software world. We’re growing to **N-Temporal systems**, where multiple things happen at multiple timeframes.

Greg concluded with a quote of Ernest Hemingway.

>"We are all apprentices in a craft where no one ever becomes a master.”

### Recommended reading

<img class="image left" src="{{ '/img/cqrs/event-centric.png' | prepend: site.baseurl }}" alt="Event Centric" />
Greg wrote a book about this matter, called [Event Centric - Finding Simplicity in Complex Systems](http://www.amazon.com/Event-Centric-Simplicity-Addison-Wesley-Signature/dp/0321768221). In this book, he explains how to use DDD with Command-Query Responsibility Separation to select the right design solutions and make them work in the real world.


<br/>
<br/>

### Other sources

 - Martin Fowler on CQRS: [http://martinfowler.com/bliki/CQRS.html](http://martinfowler.com/bliki/CQRS.html)
 - Greg Young on CQRS: [http://codebetter.com/gregyoung/2010/02/16/cqrs-task-based-uis-event-sourcing-agh/](http://codebetter.com/gregyoung/2010/02/16/cqrs-task-based-uis-event-sourcing-agh/) and [http://www.squarewidget.com/greg-young-on-cqrs](http://www.squarewidget.com/greg-young-on-cqrs)