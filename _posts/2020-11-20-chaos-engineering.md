---
layout: post
authors: [tim_verte]
title: 'Chaos Engineering'
image: /img/2020-11-19-chaos-engineering/chaos-engineering.png
tags: [Chaos Engineering, DevOps, Chaos, Backend, Netflix, Simian Army]
category: Cloud
comments: true
---

# Table of contents
{:.no_toc}

- TOC
{:toc}

----

# Chaos Engineering

## Introduction

In Cloud-based, distributed networks we need a certain level of scalability and resilience because unpredictable events are bound to happen. Because these networks are more complex and have built-in uncertainty by the nature of how they function, it's essential for software developers to utilize an empirical approach to testing for vulnerabilities that's systematic and innovative.
This can be achieved through controlled experimentation that creates chaos in an effort to determine how much stress any given system can withstand. The goal is to observe and identify systematic weaknesses.

## What is Chaos Engineering? 

Chaos Engineering is the discipline of experimenting on a software system in production in order to build confidence in the system's capability to withstand turbulent and unexpected conditions.
You can think of Chaos Engineering as an empirical approach to addressing the question: “How close is our system to the edge of chaos?” Another way to think about this is: “How would our system fare if we injected chaos into it?”
It is not meant to break random things without a purpose. 

However if you or the team is just starting with Chaos Engineering and you are not confident enough to work in the production environment, you can also do the experiments in another controlled environment (TST, DEV, ...).

Building confidence is key ! You do not want to break things in production without being able to find a solution.

## Why use Chaos Engineering?

In software development, a given software system's ability to tolerate failures while still ensuring adequate quality of service, is typically specified as a requirement (Resilience).
However, development teams often fail to meet this requirement due to factors such as short deadlines or lack of knowledge of the field.
Chaos engineering is a technique to meet the resilience requirement.

Chaos engineering can be used to achieve resilience against:
-	Infrastructure failures 
-	Network failures
-	Application failures

## Chaos Engineering and Traditional Testing

With traditional testing, you are only testing assumptions and not generating new knowledge about the system.
You are testing the code correctness and how fuctions and methods work in your application.
Chaos Engineering on the other hand will also explore the many different and upredictable scenarios that could happen to your systems.

In this way you will be able to find new weaknesses before the actual event will take place and make sure future outages will not happen.

## Prerequisites for Chaos Engineering

To determine whether your organization is ready to start adopting Chaos Engineering, you need to answer one question: Is your system resilient to real-world events such as service failures and network latency spikes?
If you know the answer to that question is no, you have some work to do before using Chaos Engineering.

Chaos Engineering is great for exposing unknown weaknesses in your production system, but if you are certain that a Chaos Engineering experiment will lead to a significant problem with the system, there’s no sense in running that experiment.
Fix the weakness first ! Then come back to Chaos Engineering to uncover more weaknesses you didn't know about.

Also it is important that there are ways your team can analyze the results of the experiments by making sure there is a monitoring system in place to check the state of your application.

Some must-have items before introducing Chaos

<div style="text-align: center;">
  <img alt="Must Have" src="/img/2020-11-19-chaos-engineering/resilience.png" width="auto" height="auto" target="_blank" class="image">
</div>

## Principles of Chaos Engineering

<div style="text-align: center;">
  <img alt="Experiment Process" src="/img/2020-11-19-chaos-engineering/chaos-engineering-process.png" width="auto" height="auto" target="_blank" class="image">
</div> 

### Steady state

Define a measurable steady state that represents normal circumstances to use as a baseline.

The reason you do this, is because after injection failure, you want to make sure you can return to a well-known state and the experiment is no longer interfering with the system's normal behavior.
The key is not to focus on internal attributes of the system like CPU, memory, etc. but to look for measurable output.
Measurements of that output over a short period of time constitute a proxy for the system’s steady state. The overall system’s throughput, error rates, latency percentiles, etc. could all be metrics of interest representing steady state behavior. 

????????? System metrics en business metrics eventueel nog uitleg ?? !!!!!  Voorbeeld van number of orders daar van netflix
Nu misschien nog niet duidelijk genoeg ? ????????????????????

Voorbeeld:
a simple metric for us to determine the overall health of the system is the percentage of 200 responses from the User Service, specifically we want 100%. A secondary metric to be interested in however, is how long the requests take to complete as this can be a canary signal telling us that our system is about to fail.

???????????????????????????????????????????????
???????????????????????????????????????????/
???????????????????????????????????????????????

### Hypothesis about state

Once you have your metrics and an understanding of their steady state behavior, you can use them to define the hypotheses and preferred results for your experiment. Start small and choose only one hypothesis at a time.
When you are doing this it is important to bring everybody around the table that is involved with the project. The team, the product owner, developers, designers, etc.

It can be tempting to subject your system to different events (for example, increasing amounts of traffic) to “see what happens.” However, without having a prior hypothesis in mind, it can be difficult to draw conclusions if you don’t know what to look for in the data.
Think about how the steady state behavior will change when you inject different types of events into your system. If you add requests to a service, will the steady state be disrupted or stay the same? If disrupted, do you expect the system output to increase or decrease?

A few examples:
* What will happen if this loadbalancer breaks?
* What will happen if caching fails?
* What will happen if latency increases with 300ms?
* What will happen if we loose connection to our DB?

Make hypothesis on parts of the system you believe are resilient — after all, that’s the whole point of the experiment.

Also think about what the preferred outcome will be in one of these situations and don’t make a hypothesis that you know will break you!

Another example:
* What if the 'Shop By Category' service fails to load in our online webshop?

The Preferred Outcome:
* Should we return a 404? 
* Should the page gracefully degrade and collapse?
* What should happen on the backend? 
* Should alerts be sent?
* Should the failing dependency continue to receive requests every time a user goes to this page? 

### Vary real-world events

Every system, from simple to complex, is subject to unpredictable events and conditions if it runs long enough. Examples include increase in load, hardware malfunction, deployment of faulty software, and the introduction of invalid data (sometimes known as poison data). 

The most common ones fall under the following categories:
* Hardware failures
* Functional bugs
* State transmission errors (e.g., inconsistency of states between sender and receiver nodes)
* Network latency and partition
* Large fluctuations in input (up or down) and retry storms
* Resource exhaustion
* Unusual or unpredictable combinations of interservice communication
* Byzantine failures (e.g., a node believing it has the most current data when it actually does not)
* Race conditions
* Downstream dependencies malfunction

Real World Examples:

At Netflix, they turn off machines because instance termination happens frequently in the wild and the act of turning off a server is cheap and easy. They simulate regional failures even though to do so is costly and complex, because a regional outage has a huge impact on their customers unless they are resilient to it.

Or Consider an organization that uses a messaging app such as Slack or HipChat to communicate during an incident. The organization may have a contingency plan for handling the outage when the messaging app is down during an outage, but how well do the on-call engineers know the contingency plan? Running a chaos experiment is a great way to find out.


### Design and run the experiment

* Pick one hypothesis
* Scope your experiment (the closer you are to production the more you will learn about the results)
* Identify the relevant metrics to measure
* Notify the organization

Prioritize events either by potential impact or estimated frequency. Consider events that correspond to hardware failures like servers dying, software failures like malformed responses, and non-failure events like a spike in traffic or a scaling event.
Any event capable of disrupting steady state is a potential variable in a Chaos experiment.
 
One of the most important things during the experiment phase is understanding the potential blast radius of the experiment and the failure you’re injecting — and minimize it.
You’ll almost certainly want to start out in your test environment to do a dry run before you move into production. Once you do move to production, you’ll want to start out with experiments that impact the minimal amount of customer traffic.
For example, if you’re investigating what happens when your cache times out, you could start by calling into your production system using a test client, and just inducing the timeouts for that client.
Some good questions you can ask yourself to check the blast radius are:
* How many customers are affected?
* What functionality is impaired?
* Which locations are impacted?

Also try to have a sort of 'emergency button' you can use to cancel the experiment or to return to the normal state of the system in case you cannot find a solution.
Be careful with experiments that modify the application state (cache or databases) or that can’t be rolled back easily or at all.

Eventually when you start doing Chaos Experiments in your production environment, you will want to inform members of you organization about what you're doing, why you're doing it and when.

### Learn and verify

In order to learn and verify you need to measure. Invest in measuring everything !
After the test you can use your collected metrics to check if your hypothesis is correct.

Another important metric during this phase, is the time it takes to detect the problem. You do not want your customers to be the ones that detect the problem. 
So use Chaos Engineering as a way of testing your monitoring and alerting systems as well.

There are several ways that you can expand the testing in order to increase your knowledge and find potential solutions. Once you've resolved one area of concern, reset the testing criteria or parameters and run the experiment again with a new hypothesis.
You can also expand the blast radius by increments with each test, introducing new or more powerful stressors into the testing environment in order to gauge the limits of your system.
The idea is to introduce as much controlled chaos into the mix, one element at a time, in order to determine the maximum limits of your system before it breaks down completely.
This can be done by introducing automation after the initial test.

Always do a Post Mortem of the experiment.
A few questions the team can ask themselves during this phase: 

* Time to detect?
* Time for notification? And escalation?
* Time to public notification?
* Time for graceful degradation to kick-in?
* Time for self-healing?
* Time to recovery — partial and full?
* Time to all-clear and stable?

At AWS, the output from the Post Mortem is called a Correction-of-Errors document, or COE. they use COE to learn from their mistakes, whether they’re flaws in technology, process, or even the organization. They use this mechanism to resolve root causes and drive continuous improvement.
The key to being successful in this process is being open and transparent about what went wrong. One of the most important guidelines for writing a good COE is to be blameless and avoid identifying individuals by name.

There are five main sections in a COE document:
* What happened? (Timeline)
* What was the impact to our customers?
* Why did the error occur? (The 5 Why’s)
* What did you learn?
* And how will you prevent it from happening again in the future?

More information about the COE documents: ????????????????????????????????????????????????? link toevoegen

### Improve and fix it

The most important lesson here is to prioritize fixing the findings of your chaos experiments over developing new features!
Get upper management to enforce that process and buy into the idea that fixing current issues is more important than continuing the development of new features.

## Manually VS Auto

Using Chaos Engineering may be as simple as manually running 'kill -9' on a box inside of your staging environment to simulate failure of a service. Or, it can be as sophisticated as automatically designing and carrying out experiments in a production enviroment against a small but statistically significant fraction of live traffic.
So when starting out, it is a good practice to manually make your experiments and check the results, but running experiments manually is labor-intensive and ultimately unsustainable. So try to automate experiments and run them continuously.



????????????????
????????????????
???????????????
??????????????

ZIE https://www.oreilly.com/content/chaos-engineering/#chapter_cmm ==> nog eens kijken bij steady state ==> Hier staat info over automatiseren, aangezien manueel veel te labour intensive is


## Chaos Gamedays & benefits

Chaos Gamedays are often known as days where a 'Master of Disaster' or a MoD, often in secret, will decide what kind of failure or disaster will happen on the system.
He or She will generally start with something simple like the loss of capacity or the loss of connectivity. You may find, that until you can easily and clearly see the simple cases, doing harder or more complex failures is not a good way to build confidence or spend time. 

If you follow this porcess regularly, you will see a transformation in your team. Being first on-call for Chaos Gamedays builds composure under pressure when doing on-call for production outages.
Not only will all developers gain confidence in their uderstanding of the systems and how they fail, but they also get used to the feeling of being under pressure.

There will also be a dramatic change in your systems, since developers will experience failure as a part of their job and thus they will start designing for failure.
They consider how to make every change and every system observable. They carefully choose resilience strategies because this is now something the team knows and talks about during the experiments.


?????????????????????????????????????
????????????????????????????????????
???????????????????????????????????

good read for how to organize or plan gamedays ==> https://www.gremlin.com/community/tutorials/how-to-run-a-gameday/
### Planned Failure

The MoD will gather the team before the 'start of the incident' and then will start with the planned failure. 
Normally there will be one member of the team who will be 'first on-call'. This person is strongly encouraged to contact the other members
so they can start working together and find out what failure the MoD has caused.
Ideally, the team will find and solve the issue in less than 75% of the allocated time.
When the team has a solution for the issue or the allocated time has ended, the MoD will reverse the failure and the team will proceed to do a Post Mortem of the incident.

### Escalation

It is also possible that the team will not be able to find a solution for the problem. Then the MoD can escalate this failure to make it more visible,
because often full outages are the only observable failures. Knowing this is the first step in fixing your instrumentation and visualization (FE. Dashboards with monitoring,...)

### Post Mortem

A Post Mortem is the stage in which the team will analyze the failure and the solution.
This can consist of sharing perspectives, assumption that were made, expectations that didn't reflect the behavior of the system or observability tools.
Following out of the Post Mortem, the team should have come up with a set of actions to fix any observability issues for the scenario and some ideas about how to improve resilience to that failure.

### Best Practice
 
 ????????????????????????????????????????????????????????????????????????????????????????????????
Post Mortem should follow the usual incident process if you have one in your company.
If not you can use this example from PagerDuty :   https://response.pagerduty.com/ 

Example voor post-mortem best practice, maar dit lijkt mij vrij specifiek????????????????
https://response.pagerduty.com/after/post_mortem_process/


## Perturbation models

<div style="text-align: center;">
  <img alt="Must Have" src="/img/2020-11-19-chaos-engineering/simian-army.jpg" width="auto" height="auto" target="_blank" class="image">
</div>

Netflix has already developed some tools which they bundled in their suite of tools named 'The simian army'. These tools were made to test reliability, security and resilience of it's AWS infrastructure.
The Simian Army is designed to add more capabilities beyond Chaos Monkey. While Chaos Monkey solely handles termination of random instances, Netflix engineers needed additional tools able to induce other types of failure. Some of the Simian Army tools have fallen out of favor in recent years and are deprecated, but each of the members serves a specific purpose aimed at bolstering a system's failure resilience.

### Chaos Monkey (Still available)

Chaos Monkey is a tool invented in 2011 by Netflix to test the resilience of its IT infrastructure. It works by intentionally disabling computers in Netflix's production network to test how remaining systems respond to the outage. Chaos Monkey is now part of a larger suite of tools called the Simian Army designed to simulate and test responses to various system failures and edge cases.

### Janitor Monkey (Still available)

Identifies and disposes unused resources to avoid waste and clutter.

### Conformity Monkey (Still available)

A tool that determines whether an instance is nonconforming by testing it against a set of rules. If any of the rules determines that the instance is not conforming, the monkey sends an email notification to the owner of the instance.

### Chaos Kong (deprecated or not publicaly released)

At the very top of the Simian Army hierarchy, Chaos Kong drops a full AWS "Region". Though rare, loss of an entire region does happen and Chaos Kong simulates a systems response and recovery to this type of event.

### Chaos Gorilla (deprecated or not publicaly released)

Chaos Gorilla drops a full Amazon "Availability Zone" (one or more entire data centers serving a geographical region).

### Latency Monkey (deprecated or not publicaly released)

Introduces communication delays to simulate degradation or outages in a network.
While Netflix never publicly released the Latency Monkey code, and it eventually evolved into their Failure Injection Testing (FIT) service.

### Doctor Monkey (deprecated or not publicaly released)

Performs health checks, by monitoring performance metrics such as CPU load to detect unhealthy instances, for root-cause analysis and eventual fixing or retirement of the instance.
Doctor Monkey is not open-sourced, but most of its functionality is built into other tools like Spinnaker, which includes a load balancer health checker, so instances that fail certain criteria are terminated and immediately replaced by new ones.

### Security Monkey (Still available but will be end-of-life in 2020)

Derived from Conformity Monkey, a tool that searches for and disables instances that have known vulnerabilities or improper configurations.

### 10-18 Monkey (deprecated or not publicaly released)

A tool that detects problems with localization and internationalization (known by the abbreviations "l10n" and "i18n") for software serving customers across different geographic regions.


Other Tools:

### Byte-Monkey

A small Java library for testing failure scenarios in JVM applications. It works by instrumenting application code on the fly to deliberately introduce faults such as exceptions and latency.

### Chaos Machine

ChaosMachine is a tool that does chaos engineering at the application level in the JVM. It concentrates on analyzing the error-handling capability of each try-catch block involved in the application by injecting exceptions.

### Proofdock Chaos Engineering Platform

A chaos engineering platform that focuses on and leverages the Microsoft Azure platform and the Azure DevOps services. Users can inject failures on the infrastructure, platform and application level.

### Gremlin

A "failure-as-a-service" platform built to make the Internet more reliable. It turns failure into resilience by offering engineers a fully hosted solution to safely experiment on complex systems, in order to identify weaknesses before they impact customers and cause revenue loss.

### Facebook Storm

To prepare for the loss of a datacenter, Facebook regularly tests the resistance of its infrastructures to extreme events. Known as the Storm Project, the program simulates massive data center failures.

### ChaoSlingr

ChaoSlingr is the first Open Source application of Chaos Engineering to Cyber Security. ChaoSlingr is focused primarily on performing security experimentation on AWS Infrastructure to proactively discover system security weaknesses in complex distributed system environments. Published on Github in September 2017.

### Chaos Toolkit

The Chaos Toolkit was born from the desire to simplify access to the discipline of chaos engineering and demonstrate that the experimentation approach can be done at different levels: infrastructure, platform but also application. The Chaos Toolkit is an open-source tool, licensed under Apache 2, published in October 2017.

### Mangle

Mangle enables you to run chaos engineering experiments seamlessly against applications and infrastructure components to assess resiliency and fault tolerance. It is designed to introduce faults with very little pre-configuration and can support any infrastructure that you might have including K8S, Docker, vCenter or any Remote Machine with ssh enabled. With its powerful plugin model, you can define a custom fault of your choice based on a template and run it without building your code from scratch.

### Chaos Mesh

Chaos Mesh is an open-source cloud-native Chaos Engineering platform that orchestrates chaos experiments in Kubernetes environments. It supports comprehensive types of failure simulation, including Pod failures, container failures, network failures, file system failures, system time failures, and kernel failures.  

### Litmus Chaos

LitmusChaos Litmus is a toolset to do cloud-native chaos engineering. Litmus provides tools to orchestrate chaos on Kubernetes to help SREs find weaknesses in their deployments. SREs use Litmus to run chaos experiments initially in the staging environment and eventually in production to find bugs, vulnerabilities. Fixing the weaknesses leads to increased resilience of the system.

## Conclusion

Any organization that builds and operates a distributed system and wishes to achieve a high rate of development velocity will want to add Chaos Engineering to their collection of approaches for improving resiliency.

Chaos Engineering is still a very young field, and the techniques and associated tooling are still evolving.




Bronnen ==> nog verwerken
CHAOS Gamedays: teams.microsoft.com/go#
o'reilly paper (more in depth guide): https://www.oreilly.com/content/chaos-engineering/#chapter_cmm   ==> Zoeken bij Steady Sate
https://adhorn.medium.com/chaos-engineering-ab0cc9fbd12a
https://en.wikipedia.org/wiki/Chaos_engineering#History

