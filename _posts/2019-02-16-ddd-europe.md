---
layout: post
authors: [pieter_van_hees, kristof_eekhaut]
title: 'DDD Europe 2019'
image: /img/ddd-europe.jpg
tags: [DDD, Domain Driven Design, conference]
category: Conference
comments: true
---

# Table of content

## When we lose sight of our domain by Carola Lilienthal

Carola discusses 9 traps that developers fall into, and which prevent us to focus on the important aspect of developing software, the domain.

### Trap 1: Model monopoly

> "In order for developers to learn about the domain, they have to talk to the users, in a language that the users understand."

The first thing to understand is that developers need to talk to the users, because if they don't they will lose a lot of information. 
However, in a lot of companies, it is the analyst alone who talks to users when he/she gathers requirements.
By having one or more analysts who communicate with users, they have the monopoly of the domain.

When developers do communicate with users, they should do so in a language and/or model that the users understand.

Sharing class diagrams or database models with users is counter productive.
The users will not understand this complex model and think it took a lot of effort to create.
As a consequence they either cannot give relevant feedback because they don't understand it, or they won't dare to because they don't want to discourage you.

A better way to communicate the model between users and developers is to use e.g. a schema with icons and descriptive names for actions.

//TODO insert image of model
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

> "Dont' create big business classes that serve everybody."


### Trap 7: How do we know what to build
How do we split a big elephant into pieces?

Let's say we have 4 different types of elephants in our business domain.
A common mistake would be to split elephant by different parts of the body. 
Where one component would be all 4 types of feet, another would be all 4 types of heads, etc.

This might nog necessarily be the best approach to split the 4 elephant types.
The better approach would be to build 1 small elephant that is fully functioning, and then let it grow each iteration.
This approach let's you learn from each iteration and allows for incremental growth and refactoring.


### Trap 8: The expert trap

The people who developed the elephant will start to think they are experts, and know everything there is to know about the elephant, because they built it from scratch.
This assumption is false, because even the developers who built the elephant from scratch have assumptions, and assumptions can be false.
The real experts are, and will remain the users.


### Trap 9: Everything is new, and therefore better

People tend to believe that this new system they are building will be way better than the old system they're replacing, because it looks better.

What they forget is that the users know the old system very well and are often very productive in it.
When the users will start to use the new system, they will feel like beginners again.
They will be less productive than with the old application, at least for a little while.



