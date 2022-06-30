---
layout: post
authors: [laura_prevost]
title: 'Clean Agile - Back to Basics'
image: /img/2022-06-30-clean-agile/clean_agile_home.png
tags: [Leadership, Agile, Clean]
category: Leadership
comments: true
---

> Collective Intelligence - The Best of Synergy.

# Table of contents
* [Introduction](#introduction)
* [The Reasons for Agile](#the-reasons-for-agile)
* [Business Practices] (#business-practices)
* [Team Practices] (#team-practices)
* [Technical Practices] (#technical-practices)
* [Conclusion](#conclusion)

# Introduction

Coming from a non-programming background, I was always interested to hear or learn about Agile methodology but with a fear that Agile vocabulary would be too techy for me. This book helped me to get rid out of my fears once and for all. In addition, having been in a High Performance Team using Agile Methodologies at Ordina for 5 years, "Uncle Bob"(Robert C. Martin) helped me via his _Back to Basics_ book to restructure what I experienced and helped me to create my own lessons learned.

This book is for programmers and non-programmers alike. It aims not to go into technical details but focusses more on explaining what the fundamentals of Agile are.

Agile's ideology and values emerge from a group of 17 programming experts during the fall of 2000 who were willing to create an alternative of what is called the Scientific Management (which inspired the idea of "Waterfall" development).

Four basic values came out of this gathering and are the central idea of the Agile Manifesto that emerged from that moment:

- **Individuals and interactions** over processed and tools
- **Working software** over comprehensive documentation
- **Customer collaboration** over contract negotiation
- **Responding to change** over following a plan

Uncle Bob then gives as an introduction an Agile overview.
 He does this by responding to the question : "how do you manage a software project".
 Therefore, he uses the metaphor of the Iron Cross, a management trade-off that needs to be done in all projects. One has to pick three out of the four goals : Good, Fast, Cheap, Done , in order to manage a project. Reaching all of these in the project is not possible.

<img class="p-image" src="{{ '/img/2022-06-30-clean-agile/clean-agile-1.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 100%;">

In this context, he warns that Agile is not the Holy Grail, but only a framework that helps managers and developers to execute the goals they decide to take on _by providing real data_. This data is needed to make good decisions. Without data, no project can be well managed.

This way he introduces some Agile tools (known from everyone that already worked with one of the Agile methodologies) : burn-down charts, story points, business value, iterations. These have only one goal : every stakeholder of the project has a constant feedback on how it evolutes. These are thus created not to control the team but to make appropriate adjustments to correctly manage the project.

# The Reasons for Agile

If you have to read only one chapter of this book, it should be this one. In it, Uncle Bob reminds us that even if many of the Agile tools have been proliferating since 20 years (Scrum, Kanban, XP, SAFe, etc.), it makes no sense to use them without keeping in mind the essence of Agility.

There are the two evanescent reasons of using Agile methodologies : **professionalism** and **reasonable expectations** of our customer.

- Professionalism in the sense that developers are those who design todays' world (software is everywhere). And as the quote of the first Spiderman movie warns : "With great power comes great responsibility";.

<img class="p-image" src="{{ '/img/2022-06-30-clean-agile/clean-agile-2.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 100%;">

- Customers have the right to have Reasonable expectations :
  - Continuous technical readiness: in order to counter artificial delays, the system should be technically deployable at the end of each iteration (Clean Code, Automated Testing)
  - Stable productivity and inexpensive adaptability: customers and managers don't expect the project to slow down with time (Continuous Refactoring, Architecture Design, Clean Code)
  - Continuous improvement : early problems must fade away and the system should get better and better with time (Pair Programming, TDD, Refactoring, Simple Design)
  - Fearless competence: developers do not have to fear touching an ugly code (Clean Code)
  - QA should find nothing and Test Automation : If QA finds a problem, development team should figure out what went wrong in his process so that QA finds nothing next time (TDD, Continuous Integration, Acceptance Testing
  - We cover for each other: it is your responsibility to make sure that at least one other team member can cover for you (Pair Programming, Whole Team, Collective Ownership)
  - Honest estimates: developers need to provide estimates based on what they do and don't know (Planning Game, Whole Team)
  - You need to say "no" : no matter which pressure is on you, you have to say "no"; if the answer is really no (Whole Team)
  - Mentoring and continuous aggressive learning : as the industry changes quickly, you should follow this flow and learn to teach (Whole Team).

In this state of mind, he concludes this chapter with the XP Customer and Developer Bill of Rights:

**Customer Bill of Rights**

- You have the right to an overall plan, to know what can be accomplished when and at what cost.
- You have the right to get the most possible value out of every programming week.
- You have the right to see progress in a running system, proven to work by passing repeatable tests that you specify.
- You have the right to change your mind, to substitute functionality, and to change priorities without paying exorbitant costs.
- You have the right to be informed of schedule changes, in time to choose how to reduce the scope to restore the original date. You can cancel at any time and be left with a useful working system reflecting investment to date.

**Developer Bill of Rights**

- You have the right to know what is needed, with clear declarations of priority.
- You have the right to produce quality work at all times.
- You have the right to ask for and receive help from peers, managers, and customers.
- You have the right to make and update your own estimates.
- You have the right to accept your responsibilities instead of having them assigned to you.

<img class="p-image" src="{{ '/img/2022-06-30-clean-agile/clean-agile-3.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 100%;">

Based on those fundamental reasons, the next 3 chapters aim to explain the practices of XP (Business, Team and Technical wise) - keeping in mind that Agile is the foundation of an **ethical** standard of software. Nothing else.

# Business Practices

As Uncle Bob reminds, XP Business-facing-practices are including the concepts of Planning, Small Releases, Acceptance Tests and Whole Team.

- **Planning** and day-to-day management are handled through story points. The concept behind SP is that those points are not estimated time, but estimated effort. The aim for using story points is to give a day-to-day estimation of the workload. Each iteration will help the next iteration to estimate more precisely what still needs to be developed. But, as he highlights : "that estimate is not a promise, and the team has not failed if the velocity is lower. The aim is thus only to produce data necessary to manage the project correctly
- **Small releases** practices are handled through the concept of _Continuous Delivery_. He mentions that nowadays, the best Source Code Control used is Git thanks to some of its characteristics (no checkout time, no conflicts of committing, tiny decoupled modules, rapid commit frequency, fast-running test suite…)
- **Acceptance Tests** practices are handled through the concept of _Behavior-Driven Development_ (BDD): The business writes formal tests (Given…, When…, Then…) describing the behavior of each story, and Developers automate those tests, which become the _Definition of Done_
- **Whole Team** practice has been conceptualized to cancel the mental separation between the customer and the developers. "A development team is composed of many roles including managers, testers, technical writers, etc."

Business practices have thus one aim : to increase and facilitate communication between business and developers. "That communication breeds trust".

# Team Practices

Team practices are aimed at governing the relationship between all team members for the sake of the project they work on. These are composed by : Metaphor, Sustainable Pace, Collective Ownership and Continuous Integration.

- **Metaphor** practice is the fact that a model (with its own vocabulary) is created to explain the problem domain in order to get **everyone** agreed on it (developers as well as management or customers or..)
- **Sustainable Pace** practices remind to keep workload at a life equilibrium, through diminishing as much a possible overtime or "marathons", and keeping in mind that "sleep is the most precious ingredient in the life of a programmer"
- **Collective ownership** practices defines the fact that even if sometimes a developer needs to specialize in a particular domain, he should also generalize, obligating himself to work on other areas of the code, less known for him
- **Continuous Integration** practices is the fact that the continuous build should never break

For Uncle Bob, these practices "help small teams to behave like true teams".

# Technical Practices

While these practices are less used by programmers, Uncle Bob pinpoints that they are the very core of Agile and not using them is creating an "ineffective flaccid shell of what it was intended to be".
 These practices are the following : Test-Driven Development (TDD), Refactoring, Simple Design and Pair Programming.

- **TDD** practice are for developers what double-entry bookkeeping is for accountants. Uncle Bob reminds the [three rules of TDD](http://butunclebob.com/ArticleS.UncleBob.TheThreeRulesOfTdd){:target="_blank" rel="noopener noreferrer"} but, more important, he explains by an example of how courageous it is to keep the code clean and orderly. Thanks to that, we can act like professionals. 
- **Refactoring** is the "practice of improving the structure of the code without altering the behavior, as defined by the tests". In order to do so, he suggests the Red/Green/Refactor cycle, insisting on the 2 separated dimensions that are writing a code that works versus writing a code that is clean.

<img class="p-image" src="{{ '/img/2022-06-30-clean-agile/clean-agile-4.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 100%;">

- **Simple design** is the practice based on the 4 Kent Beck's rules:
  - Pass all the tests
  - Reveal the intent : being expressive, easy to read
  - Remove duplication : the code shouldn't say the same thing more than once
  - Decrease elements (classes, functions, variables, etc)
- **Pair programming** practice has one goal : to "share and exchange knowledge, not concentrate it"

# Conclusion

As a conclusion for the book, the 4 core values of Agile are summarized :

- **Courage** : to say no, to rewrite a code, to document well, to test well, to take a step aside, etc. "The belief that quality and discipline increase speed"
- **Communication** : whatever form it takes (face-to-face, informal, interpersonal), direct and frequent communication is a must to create a team looking at the same direction
- **Feedback** : giving or receiving feedback is what makes a team working efficiently
- **Simplicity** , through being direct, with the idea of acknowledging a problem when you know there is one.

The next pages and last chapter are designed to give ideas on how Agile values are implemented concretely ( how Agile works in small versus big companies, how to transform a non-Agile company to an Agile company, Coaching, Certification, Agile tools) as well as the next direction Uncle Bob thinks Agile should take (Synergy between Agility and Craftmanship). But for me, at this point we divert from the original purpose of this book, which is to highlight the core values of what Agility is.

I will thus finish this article with one of his sentences that illustrated to me his mindset while reading the book : "**Agile is a small idea about the small problems of small programming teams doing small things**".

