---
layout: post
authors: [wouter_nivelle]
title: 'Waterfall vs Agile'
image: /img/2022-10-19-waterfall-vs-agile/header.jpg
tags: [Agile, Project Management, Waterfall]
category: Agile
comments: true
---

> Waterfall or agile for a new project? Benefits or disadvantages?

# Table of contents

* [Introduction](#introduction)
* [Software Development Life Cycle](#software-development-life-cycle)
  * [Waterfall](#waterfall)
  * [Agile](#agile)
  * [Scrumfall/Waterscrum/Agilefall/Watergile](#scrumfallwaterscrumagilefallwatergile)

# Introduction
After my graduation until now, about 10 years, I have worked in many different teams and project, for various clients in various sectors.
During those years, many different styles of project management were used but they always came down to
* the more traditional type of project management, also known as waterfall
* a more modern type known as agile
* something in between those 2

It is widely known that agile is a big buzzword in more recent years, but what is it exactly?
What is the difference between agile and waterfall?
Which one can be used in which situation?
What are the benefits and disadvantages?

# Software Development Life Cycle
It is important to know the purpose of a software development life cycle (SDLC). 
The usual explanation for this cycle is
> A process that produces software with the highest quality and lowest cost in the shortest time possible. 
> It typically provides a well-structured flow of phases that help an organization to quickly produce high-quality software 
> which is well-tested and ready for production use.

A mouthful for saying that it provides guidance for delivering software as efficiently as possible, with high quality.

In a SDLC there is a focus on the following 6 phases:
* Planning
* Analysis
* Design
* Implementation
* Testing & Integration
* Maintenance

<img alt="SDLC order" src="{{ '/img/2022-10-19-waterfall-vs-agile/sdlc_order.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 750px;">

There are multiple models of SDLC's, but the most known are the *waterfall* and *agile* model.

## Waterfall
The waterfall model is the most traditional type of a SDLC. It has been around since 1970.
It divides the effort into a number of steps and defines that only one step can be active at the same time.
While it usually follows the 6 phases as described above, there's no limit on it.

From where does it get its name?

<img alt="Waterfall order" src="{{ '/img/2022-10-19-waterfall-vs-agile/waterfall_order.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 750px;">

As you can see, it looks like a waterfall. Each step can only start after the previous one is done and thus it cascades down like a waterfall.

Now, when is a step done? Only when the specified artifacts that were defined at the beginning of the step are delivered and accepted.
For the implementation step, this can be a collection of software artifacts that satisfy the design.
For the testing step, it can be a test plan that demonstrates that all the requirements and design are working as intended.

A common mistake is that people think that you can not go back to a previous step. 
It is allowed, but it requires that you stop all work on the current step until the errors in the previous step have been resolved.

### Pro's
* It has detailed documentation and metrics
* The requirements are agreed upon and signed off
* There are less defects as there is rigorous planning and testing
* Defined start and end point which allows for easy measuring

### Con's
* It starts slow as the requirements need to be defined in detail
* Changing those requirements takes a lot of effort
* The software is not visible until most of the development work is finished
* Less focus on the client because the requirements are the most important item

### Examples
When do we use the waterfall model today?
* When requirements can be reliably, quickly and thoroughly defined up front
* For very large teams where common understanding must be put in writing to avoid confusion and miscommunication
* When there is a defined budget and schedule given by the customer
* When there is not much involvement from the customer

Building a bridge across a river is a good example of a project that is best done with a waterfall model.
That is a project where a clear schedule is needed and where the requirements need to be defined as soon as possible.
Saying "We will start with the first part of the bridge, evaluate that part and then decide if and how to continue with the remaining parts" is not a possibility here.

## Agile
The agile model has been created in direct response to the waterfall model.
It puts the focus on adaptive, simultaneous workflows which is the opposite from the linear flow of the waterfall model.

Instead of beginning with a complete knowledge of the requirements, the team develops a product in small cycles where small parts are build in a evolutionary way.
Each cycle contains the same steps as defined in the SDLC, but they can all be done at the same time, depending on the experience and skills of the team.
Contrary to the waterfall model, the customer can quickly see and evaluate how the project is advancing at the end of each cycle.
Needed changes to the requirements, based on this evaluation, can be done faster and implemented more easily.
This constant feedback from the client allows the team to adjust to the challenges as they arise and not when it is too late.

<img alt="Agile order" src="{{ '/img/2022-10-19-waterfall-vs-agile/agile_order.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 750px;">

The main idea behind the agile model is delivering business value early in the process to lower the risk associated with the development.

The most known implementations of the agile model are Scrum and Kanban, but they all share the same characteristics.

* Simultaneous, incremental work
* Adaptability
* Faster and multiple deliverables

### Process
During agile development, the process usually looks like this:
1. Define a few initial requirements
2. Design
3. Develop
4. Test
5. Deploy
6. Evaluate the result of the iteration
7. Collect feedback from the various stakeholders
8. Start the cycle again with new requirements and the feedback

<img alt="Agile cycle" src="{{ '/img/2022-10-19-waterfall-vs-agile/agile_cycle.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 750px;">

### Pro's
* More project visibility at the end of each cycle
* It is a collaborative and practical approach for executing complex software development projects
* The client and stakeholders have frequent and early opportunities to evaluate the product
* Constant communication between team members so issues can be resolved proactively

### Con's
* There is a risk for scope creep as agile projects generally have no set end date and thus additional features may be requested
* A multi-skilled resource pool is needed to deliver the project as all knowledge needs to be in the team
* Less detailed documentation as it is considered less important
* Fragmented output can be a problem as multiple teams may work on different components that then need to be put together

### Examples
When do we use the agile model today?
* If there are little to no requirements at the start of the project
* If your organization does not have strict processes to follow and the existing processes are lenient
* If the client or product owner can be highly available to follow the process
* When you're trying to create something innovative that does not exist yet and needs to go to market quickly
* When the timeline is short and flexible
* When the budget has some wiggle room so that features can be prioritized

Agile wins when the requirements are unclear from the beginning or still need to be discovered during the initial development.
More features will be produced in a shorter time frame and the team can be more flexible throughout the process.

A good example would be the development of a social media app. While the initial requirements are clear, further development depends heavily on the demands of the user.
So a start can be made with some basic features that can go quickly to market. Other features will then be implemented after the feedback of the business and most importantly the reactions of the users.

## Scrumfall/Waterscrum/Agilefall/Watergile
This model might be known under even more names than the ones above. But it's basically a software delivery lifecycle that tries to combine the best of both worlds in waterfall and agile.
It usually starts with an up-front design phase and ends with a legacy deployment mechanism, with agile development in between.

<img alt="Scrumfall diagram" src="{{ '/img/2022-10-19-waterfall-vs-agile/scrumfall_diagram.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 750px;">

But the name doesn't matter. Everyone that knows a bit about agile knows that it's a bad idea to do the entire design up-front and only then start developing. While that might work in a full waterfall model, it doesn't in agile. 
Waterfall and agile are 2 fundamental different models with conflicts in interest as explained in the previous chapters.

### Why?
So even though it's not the best idea to mix these models, how does it happen that organizations use them?
The results may not be ideal, but it might be enough for some organizations. The agile model mentions all the time that there is not one solution that fits everyone. Every organization must find an approach that is effective for them and which enables them to deliver value.

Who doesn't know an organization that follows Scrum to the letter, only to find out that it's not the best approach for them?

Agile is for a large part about discovering new ways of working. As a result, the scrumfall model can be a temporary step towards a full agile transformation.
Now why would organizations keep using this hybrid form?
* The IT department is agile and uses Scrum, but the other business departments have never been convinced. And so the organization is divided.
* The organization is stuck with an incomplete transformation and doesn't know how to continue
* Or they're in the middle of such a transformation and will finish it shortly
* The organization's structure is made in such a way that deployment and operations cannot be done by the development teams

### Impact
Now, how can this hybrid model impact your organization?
Let's look at the following image:

<img alt="Scrumfall time" src="{{ '/img/2022-10-19-waterfall-vs-agile/scrumfall_time.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 750px;">

The first phase starts with the design as in every model. However, it's waterfall design, so it takes a while to get everything designed in detail.
This means that during this phase, the development team has nothing to do. They're just idle.
Once that phase is done and the developers can finally start working, they accelerate and can start delivering. But since the deployment process is still traditional waterfall, it takes a while to get it done. Which means that the feedback loop is going to be a lot slower than in modern agile models.

Slow feedback loops and long release cycles have a high negative impact on the value of the project as everything takes longer and results of various experimentations are harder to see.

### Problems
What are the major problems when you use this model?
* Risk and waste: when using agile models, you get feedback by interacting with the business and the end-users. When designing up-front, you can't anticipate changes in the demands. So when you're not using a tight feedback loop, you might be creating the wrong thing. Which results in waste when you need to restart.
* Delayed feedback: since the development team is not doing the releases, it will take more time. Time that could be used to find out how the market responds to the new features.
* Long-term damage: the waste that is created has construction and maintenance costs, not to mention decrease in the team's motivation. All these things have a long-term impact on the organization.

### Way out?
The goal of any organization is to meet the goals of the corporate vision and mission. These goals should be achieved with the greatest efficiency and effect.
If that is done with waterfall or agile is less important. Even scrumfall might work for some organization, be it less effective than a "pure" model.

As with any model, experimentation must be done and improvements must be made. As in agile, this depends from organization to organization how it can be done. There is no one answer that fits for everyone.µ
The most important to keep in mind is that every organization needs to shift its approach to one that decreases waste while increasing quality and predictability.