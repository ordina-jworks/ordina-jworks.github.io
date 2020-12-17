---
layout: post
authors: [tim_verte]
title: 'An introduction into the world of Chaos Engineering'
image: /img/2020-12-14-chaos-engineering/thumbnail.jpg
tags: [Chaos Engineering, DevOps, Chaos, Backend, Netflix, Simian Army, Resiliency]
category: Cloud
comments: true
---

# Table of contents
{:.no_toc}
- TOC
{:toc}

----

# Chaos Engineering
{:.no_toc}

## Introduction

In cloud-based distributed networks we need a certain level of scalability and resilience because unpredictable events are bound to happen.
Because these networks are more complex and have built-in uncertainty,
it's essential for software developers to utilize an empirical approach to testing for vulnerabilities that's systematic and innovative.
This can be achieved through controlled experimentation that creates chaos in an effort to determine how much stress any given system can withstand.
The goal is to observe and identify systemic weaknesses.

## What is Chaos Engineering? 

Chaos Engineering is the discipline of experimenting on a software system in production in order to build confidence in the system's capability to withstand turbulent and unexpected conditions.
You can think of Chaos Engineering as an empirical approach to addressing the question: “How close is our system to the edge of chaos?” 
Another way to think about this is: “How would our system fare if we injected chaos into it?”
It is not meant to break random things without a purpose. 

However if you and your team are just starting with Chaos Engineering and you are not confident enough to work in the production environment,
you can also do the experiments in another controlled environment (TST, DEV, ...).

Building confidence is key! You do not want to break things in production without being able to find a solution.

## Why use Chaos Engineering?
{:.no_toc}

In software development, a given software system's ability to tolerate failures while still ensuring adequate quality of service,
is typically specified as a requirement (Resilience).
However, development teams often fail to meet this requirement due to factors such as short deadlines or lack of knowledge of the field.
Chaos engineering is a technique to meet the resilience requirement.

Chaos engineering can be used to achieve resilience against:
* Infrastructure failures 
* Network failures
* Application failures

## Chaos Engineering and Traditional Testing
{:.no_toc}

With traditional testing, you are only testing assumptions and not generating new knowledge about the system.
You are testing the code correctness and how functions and methods work in your application.
Chaos Engineering on the other hand will also explore the many different and unpredictable scenarios that could happen to your systems.

In this way you will be able to find new weaknesses before the actual event will take place and make sure future outages will not happen.

## Prerequisites for Chaos Engineering
{:.no_toc}

To determine whether your organization is ready to start adopting Chaos Engineering, you need to answer one question:
Is your system resilient to real-world events such as service failures and network latency spikes?
If you know the answer to that question is no, you have some work to do before using Chaos Engineering.

Chaos Engineering is great for exposing unknown weaknesses in your production system,
but if you are certain that a Chaos Engineering experiment will lead to a significant problem with the system,
there’s no sense in running that experiment.
Fix the weakness first! Then come back to Chaos Engineering to uncover more weaknesses you didn't know about.

Also, it is important that there are ways your team can analyze the results of the experiments by making sure there is a monitoring system in place to check the state of your application.

Some metrics examples:
* service metrics
  * Example: The time it normally takes to start up your application, the time it takes for a request to the service...
  * Example: a simple metric for us to determine the overall health of the system is the percentage of 200 responses from the User Service, specifically we want 100%.

* business metrics
  * Example: number of orders on your web shop. When doing an experiment where you are increasing the response times of your service by 100 ms, you see that the number of orders has decreased significantly

It's always a good idea to have some resilience already built in to your application/service before introducing Chaos.

Some key points for resilience are:
<div style="text-align: right; width: 60%; margin-left:20%">
  <img alt="Must Have" src="/img/2020-12-14-chaos-engineering/ResilienceSmall.jpg" width="auto" height="auto" target="_blank" class="image fit">
</div>

<br>

## Principles of Chaos Engineering

<div style="text-align: center;">
  <img alt="Experiment Process" src="/img/2020-12-14-chaos-engineering/chaos-engineering-process.jpg" width="auto" height="auto" target="_blank" class="image fit">
</div> 

<br>

### Steady state

Define a measurable steady state that represents normal circumstances to use as a baseline.

The reason you do this, is because after injection failure,
you want to make sure you can return to a well-known state and the experiment is no longer interfering with the system's normal behavior.
The key is not to focus on internal attributes of the system like CPU, memory, etc. but to look for measurable output.
Measurements of that output over a short period of time constitute a proxy for the system’s steady state.
The system’s overall throughput, error rates, latency percentiles, etc. could all be metrics of interest representing steady state behavior. 

### Hypothesis about state

Once you have your metrics and an understanding of their steady state behavior,
you can use them to define the hypotheses and preferred results for your experiment.
Start small and choose only one hypothesis at a time.
When you are doing this, it is important to bring everybody around the table that is involved with the project.
The team, the product owner, developers, designers, etc.

It can be tempting to subject your system to different events (for example, increasing amounts of traffic) to “see what happens.”
However, without having a prior hypothesis in mind, it can be difficult to draw conclusions if you don’t know what to look for in the data.
Think about how the steady state behavior will change when you inject different types of events into your system.
If you add requests to a service, will the steady state be disrupted or stay the same?
If disrupted, do you expect the system output to increase or decrease?

A few examples:
* What will happen if this load balancer breaks?
* What will happen if caching fails?
* What will happen if latency increases with 300ms?
* What will happen if we lose connection to our DB?

Make hypotheses on parts of the system you believe are resilient — after all, that’s the whole point of the experiment.
Also think about what the preferred outcome will be in one of these situations and don’t make a hypothesis that you know you will break!

Example:
* What if the 'Shop By Category' service fails to load in our online webshop?

The Preferred Outcome:
* Should we return a 404? 
* Should the page gracefully degrade and collapse?
* What should happen on the backend? 
* Should alerts be sent?
* Should the failing dependency continue to receive requests every time a user goes to this page? 

### Vary real-world events

Every system, from simple to complex, is subject to unpredictable events and conditions if it runs long enough.
Examples include increase in load, hardware malfunction,
deployment of faulty software, and the introduction of invalid data (sometimes known as poison data). 

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

At Netflix, they turn off machines because instance termination happens frequently in the wild and the act of turning off a server is cheap and easy.
They simulate regional failures even though to do so is costly and complex,
because a regional outage has a huge impact on their customers unless they are resilient to it.

Consider an organization that uses a messaging app such as Slack or HipChat to communicate during an incident.
The organization may have a contingency plan for handling the outage when the messaging app is down during an outage,
but how well do the on-call engineers know the contingency plan?
Running a chaos experiment is a great way to find out.


### Design and run the experiment

* Pick one hypothesis
* Scope your experiment (the closer you are to production the more you will learn about the results)
* Identify the relevant metrics to measure
* Notify the organization

Prioritize events either by potential impact or estimated frequency.
Consider events that correspond to hardware failures like servers dying, software failures like malformed responses,
and non-failure events like a spike in traffic or a scaling event.
Any event capable of disrupting steady state is a potential variable in a Chaos experiment.
 
One of the most important things during the experiment phase is understanding the potential blast radius of the experiment and the failure you’re injecting — and minimize it.
You’ll almost certainly want to start out in your test environment to do a dry run before you move into production.
Once you do move to production, you’ll want to start out with experiments that impact the minimal amount of customer traffic.
For example, if you’re investigating what happens when your cache times out,
you could start by calling into your production system using a test client, and just inducing the timeouts for that client.

Some good questions you can ask yourself to check the blast radius are:
* How many customers are affected?
* What functionality is impaired?
* Which locations are impacted?

Also try to have some sort of 'emergency button' you can use to cancel the experiment or to return to the normal state of the system in case you cannot find a solution.
Be careful with experiments that modify the application state (cache or databases) or that can’t be rolled back easily or at all.

Eventually when you start doing Chaos Experiments in your production environment,
you want to inform members of your organization about what you're doing, why you're doing it and when.

### Learn and verify

In order to learn and verify you need to measure. Invest in measuring everything!
After the test you can use your collected metrics to check if your hypothesis is correct.

Another important metric during this phase, is the time it takes to detect the problem. 
You do not want your customers to be the ones that detect the problem. 
So, use Chaos Engineering as a way of testing your monitoring and alerting systems as well.

There are several ways that you can expand the testing in order to increase your knowledge and find potential solutions.
Once you've resolved one area of concern, reset the testing criteria or parameters and run the experiment again with a new hypothesis.
You can also expand the blast radius by increments with each test,
introducing new or more powerful stressors into the testing environment in order to gauge the limits of your system.
The idea is to introduce as much controlled chaos into the mix, one element at a time,
in order to determine the maximum limits of your system before it breaks down completely.
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

At AWS, the output from the Post Mortem is called a Correction-of-Errors document, or COE.
They use COE to learn from their mistakes, whether they’re flaws in technology, process, or even the organization.
They use this mechanism to resolve root causes and drive continuous improvement.
The key to being successful in this process is being open and transparent about what went wrong.
One of the most important guidelines for writing a good COE is to be blameless and avoid identifying individuals by name.

There are five main sections in a COE document:
* What happened? (Timeline)
* What was the impact to our customers?
* Why did the error occur? (The 5 Why’s)
* What did you learn?
* And how will you prevent it from happening again in the future?

### Improve and fix it

The most important lesson here is to prioritize fixing the findings of your chaos experiments over developing new features!
Get upper management to enforce that process and buy into the idea that fixing current issues is more important than continuing the development of new features.

## Manually VS Auto

Using Chaos Engineering may be as simple as manually running 'kill -9' on a box inside of your staging environment to simulate failure of a service.
Or it can be as sophisticated as automatically designing and carrying out experiments in a production environment against a small but statistically significant fraction of live traffic.
So, when starting out, it is a good practice to manually make your experiments and check the results,
but running experiments manually is labor-intensive and ultimately unsustainable.
So try to automate experiments and run them continuously.

## Chaos GameDays & benefits

Chaos GameDays are often known as days where a 'Master of Disaster' or a MoD, often in secret,
will decide what kind of failure or disaster will happen on the system.
He or she will generally start with something simple like the loss of capacity or the loss of connectivity.
You may find, that until you can easily and clearly see the simple cases,
doing harder or more complex failures is not a good way to build confidence or spend time. 

If you follow this process regularly, you will see a transformation in your team.
Being first on-call for Chaos GameDays builds composure under pressure when doing on-call for production outages.
Not only will all developers gain confidence in their uderstanding of the systems and how they fail,
but they also get used to the feeling of being under pressure.

There will also be a dramatic change in your systems, since developers will experience failure as a part of their job and thus, they will start designing for failure.
They consider how to make every change and every system observable and also carefully choose resilience strategies because this is now something the team knows and talks about during the experiments.

### Planned Failure
{:.no_toc}

The MoD will gather the team before the 'start of the incident' and then will start with the planned failure. 
Normally there will be one member of the team who will be 'first on-call'.
This person is strongly encouraged to contact the other members
so they can start working together and find out what failure the MoD has caused.
Ideally, the team will find and solve the issue in less than 75% of the allocated time.
When the team has a solution for the issue or the allocated time has ended,
the MoD will reverse the failure and the team will proceed to do a Post Mortem of the incident.

### Escalation
{:.no_toc}

It is also possible that the team will not be able to find a solution for the problem.
Then the MoD can escalate this failure to make it more visible,
because often full outages are the only observable failures.
Knowing this is the first step in fixing your instrumentation and visualization (FE. Dashboards with monitoring...)

### Post Mortem

A Post Mortem is the stage in which the team will analyze the failure and the solution.
This can consist of sharing perspectives, assumptions that were made, expectations that didn't reflect the behavior of the system or observability tools.
Following out of the Post Mortem,
the team should have come up with a set of actions to fix any observability issues for the scenario and some ideas about how to improve resilience to that failure.

The Post Mortem should follow the usual incident process if you have one in your company.

## Simian Army

<div style="text-align: center;">
  <img alt="Must Have" src="/img/2020-12-14-chaos-engineering/SimianArmySmall.jpg" width="40%" height="auto" target="_blank" class="image">
</div>
<br>

Netflix has already developed some tools which they bundled in their suite of tools named 'The Simian Army'.
These tools were made to test reliability, security and resilience of its AWS infrastructure.
The Simian Army is designed to add more capabilities beyond Chaos Monkey. 
While Chaos Monkey solely handles termination of random instances,
Netflix engineers needed additional tools able to induce other types of failure.
Some of the Simian Army tools have fallen out of favor in recent years and are deprecated,
but each of the members serves a specific purpose aimed at bolstering a system's failure resilience.

### Chaos Monkey (Still available as a standalone service)

Chaos Monkey is a tool invented to test the resilience of its IT infrastructure. 
It works by intentionally disabling virtual machine instances and containers in the production network to test how remaining systems respond to the outage. (prepares you for a random instance failure in an application managed by Spinnaker)
This tool has been in the game for a long time, so there might be better tools for your needs.

Chaos Monkey is deliberately unpredictable.
It only has one attack type: terminating virtual machine instances.
You set a general time frame for it to run, and at some point during that time it will terminate a random instance. 
This is meant to help replicate unpredictable production incidents,
but it can easily cause more harm than good if you’re not prepared to respond. 

### Janitor Monkey => replaced by new standalone service 'Swabbie' (Still available)

Identifies and disposes unused resources to avoid waste and clutter.

### Conformity Monkey => now rolled out in spinnaker services (Still available)

A tool that determines whether an instance is nonconforming by testing it against a set of rules.
If any of the rules determines that the instance is not conforming, the monkey sends an email notification to the owner of the instance.

### Chaos Kong (deprecated or not publicaly released)
{:.no_toc}

At the very top of the Simian Army hierarchy, Chaos Kong drops a full AWS "Region". 
Though rare, loss of an entire region does happen, and Chaos Kong simulates a systems response and recovery to this type of event.

### Chaos Gorilla (deprecated or not publicaly released)
{:.no_toc}

Chaos Gorilla drops a full AWS "Availability Zone" (one or more entire data centers serving a geographical region).

### Latency Monkey (deprecated or not publicaly released)
{:.no_toc}

Introduces communication delays to simulate degradation or outages in a network.
Netflix never publicly released the Latency Monkey code, and it eventually evolved into their Failure Injection Testing (FIT) service.

### FIT (Failure Injection Testing)
{:.no_toc}

FIT was built to inject microservice level failures.
Latency monkey adds a delay and/or failure on the server side of a request for a given service.
This provides us good insight into how calling applications behave when their dependency slows down — 
threads pile up, the network becomes congested, etc.
Latency monkey also impacts all calling applications — whether they want to participate or not,
and can result in customer pain if proper fallback handling, timeouts, and bulkheads don’t work as expected.
What we need is a way to limit the impact of failure testing while still breaking things in realistic ways.
This is where FIT comes in.

### Doctor Monkey (deprecated or not publicaly released)
{:.no_toc}

Performs health checks, by monitoring performance metrics such as CPU load to detect unhealthy instances,
for root-cause analysis and eventual fixing or retirement of the instance.
Doctor Monkey is not open-sourced, but most of its functionality is built into other tools like Spinnaker, 
which includes a load balancer health checker,
so instances that fail certain criteria are terminated and immediately replaced by new ones.

### Security Monkey (Still available but will be end-of-life in 2020)
{:.no_toc}

Derived from Conformity Monkey, a tool that searches for and disables instances that have known vulnerabilities or improper configurations.

### 10-18 Monkey (deprecated or not publicaly released)
{:.no_toc}

A tool that detects problems with localization and internationalization (known by the abbreviations "l10n" and "i18n")
for software serving customers across different geographic regions.

<br>

## Other Tools for Chaos Engineering

### ChAP (Chaos Automation Platform)
{:.no_toc}

ChAP was built to overcome the limitations of FIT so we can increase the safety, cadence, and breadth of experimentation.

### Byte-Monkey
{:.no_toc}

A small Java library for testing failure scenarios in JVM applications.
It works by instrumenting application code on the fly to deliberately introduce faults such as exceptions and latency.

### ChaosBlade By Alibaba
{:.no_toc}

ChaosBlade is a versatile tool supporting a wide range of experiment types and target platforms.
However, it lacks some useful features such as centralized reporting, experiment scheduling, target randomization, and health checks. 
It’s a great tool if you’re new to Chaos Engineering and want to experiment with different attacks.

### Chaos Machine
{:.no_toc}

ChaosMachine is a tool that does chaos engineering at the application level in the JVM.
It concentrates on analyzing the error-handling capability of each try-catch block involved in the application by injecting exceptions.

### Proofdock Chaos Engineering Platform
{:.no_toc}

A chaos engineering platform that focuses on and leverages the Microsoft Azure platform and the Azure DevOps services.
Users can inject failures on the infrastructure, platform and application level.

### Gremlin platform
{:.no_toc}

A "failure-as-a-service" platform built to make the Internet more reliable.
It turns failure into resilience by offering engineers a fully hosted solution to safely experiment on complex systems,
in order to identify weaknesses before they impact customers and cause revenue loss.
Unlike Chaos Monkey, tools like FIT and Gremlin are able to test for a wide range of failure states beyond simple instance destruction.
In addition to killing instances, Gremlin can fill available disk space,
hog CPU and memory, overload IO, perform advanced network traffic manipulation, terminate processes, and much more.

### Facebook Storm
{:.no_toc}

To prepare for the loss of a datacenter, Facebook regularly tests the resistance of its infrastructures to extreme events.
Known as the Storm Project, the program simulates massive data center failures.

### ChaoSlingr
{:.no_toc}

ChaoSlingr is the first Open Source application of Chaos Engineering to Cyber Security.
ChaoSlingr is focused primarily on performing security experimentation on AWS Infrastructure to proactively discover system security weaknesses in complex distributed system environments.
Published on Github in September 2017.

### Chaos Toolkit by ChaosIQ
{:.no_toc}

The Chaos Toolkit was born from the desire to simplify access to the discipline of chaos engineering and demonstrate that the experimentation approach can be done at different levels: infrastructure, platform but also application. The Chaos Toolkit is an open-source tool.
Few tools are as flexible in how they let you design chaos experiments.
Chaos Toolkit gives you full control over how your experiments operate, right down to the commands executed on the target system.
But because of this DIY approach, Chaos Toolkit is more of a framework that you need to build on than a ready-to-go Chaos Engineering solution

### Mangle
{:.no_toc}

Mangle enables you to run chaos engineering experiments seamlessly against applications and infrastructure components to assess resiliency and fault tolerance.
It is designed to introduce faults with very little pre-configuration and can support any infrastructure that you might have including K8S,
Docker, vCenter or any Remote Machine with ssh enabled.
With its powerful plugin model,
you can define a custom fault of your choice based on a template and run it without building your code from scratch.

### Chaos Mesh by PingCAP
{:.no_toc}

Chaos Mesh is an open-source cloud-native Chaos Engineering platform that orchestrates chaos experiments in Kubernetes environments.
It supports comprehensive types of failure simulation, including Pod failures, container failures,
network failures, file system failures, system time failures, and kernel failures.  
Chaos Mesh is one of the few open source tools to include a fully-featured web user interface (UI) called the Chaos Dashboard.
However, its biggest limitations are its lack of node-level experiments,
lack of native scheduling, and lack of time limits on ad-hoc experiments.

### Litmus Chaos
{:.no_toc}

LitmusChaos is a toolset to do cloud-native chaos engineering.
Litmus provides tools to orchestrate chaos on Kubernetes to help SREs find weaknesses in their deployments.
SREs use Litmus to run chaos experiments initially in the staging environment and eventually in production to find bugs,
vulnerabilities. Fixing the weaknesses leads to increased resilience of the system.

While Litmus is a comprehensive tool with many useful attacks and monitoring features, it comes with a steep learning curve.
Simply running an experiment is a multi-step process that involves setting permissions and annotating deployments.
Workflows help with this, especially when used through the Litmus Portal, but they still add an extra layer of complexity.
This isn’t helped by the fact that some features—like the Litmus Portal itself—don’t appear in the documentation and are only available through the project’s GitHub repository.


## Which tool is right for me?
{:.no_toc}

Ultimately, the goal of any Chaos Engineering tool is to help you achieve greater reliability.
The question is: which tool will help you achieve that goal faster and more easily? 
This question of course depends on your tech stack, the experience and expertise of your engineering team,
and how much time you can dedicate to testing and evaluating each tool.

The following table are just a handful of tools which are interesting for our preferred stack.

| Tool | platform | Attack types | App Attacks | Container / Pod attacks | GUI ? | CLI ? | Metrics | Attack Sharing | Attack Halting | Attack Scheduling |
|------------|  ---------|-------------|------|------|------|------|------|------|------|------|
| Chaos Monkey | Spinnaker | 1 | true | false | true | false | false | false | false | true |
| Gremlin | SaaS | 11 | false | true | true | true | true | true | true | true |
| Chaos Blade | K8S, Docker, Cloud, Bare metal | 40 | true | true | false | true | false | false | true | false |
| Chaos Toolkit | K8S, Docker, Cloud, Bare metal | depends on driver | false | true | false | true | true | false | false | false |
| Chaos Mesh | K8S | 17 | false | true | true | true | true | false | true | true |
| Litmus | K8S | 39 | false | true | true | true | true | true | true | true |

!! Chaos Toolkit is the only tool you can use to create Custom Attacks with !!

## Conclusion

Any organization that builds and operates a distributed system and wishes to achieve a high rate of development velocity will want to add Chaos Engineering to their collection of approaches for improving resiliency.

Chaos Engineering is still a very young field, and the techniques and associated tooling are still evolving.

## Resources

- [Principles of Chaos](https://principlesofchaos.org/){:target="_blank" rel="noopener noreferrer"}
- [O'Reilly Chaos Engineering paper](https://www.oreilly.com/content/chaos-engineering/#chapter_cmm){:target="_blank" rel="noopener noreferrer"}
- [Wikipedia](https://en.wikipedia.org/wiki/Chaos_engineering#History){:target="_blank" rel="noopener noreferrer"}
- [Chaos Monkey](https://www.bmc.com/blogs/chaos-monkey/){:target="_blank" rel="noopener noreferrer"}
- [Simian Army](https://github.com/Netflix/SimianArmy){:target="_blank" rel="noopener noreferrer"}
- [FIT by Netflix](https://netflixtechblog.com/fit-failure-injection-testing-35d8e2a9bb2){:target="_blank" rel="noopener noreferrer"}
- [Chaos Automation Platform](https://netflixtechblog.com/chap-chaos-automation-platform-53e6d528371f){:target="_blank" rel="noopener noreferrer"}
- [How to run a Chaos GameDay](https://www.gremlin.com/community/tutorials/how-to-run-a-gameday/){:target="_blank" rel="noopener noreferrer"}
- [Chaos Engineering post](https://adhorn.medium.com/chaos-engineering-ab0cc9fbd12a){:target="_blank" rel="noopener noreferrer"}
- [Gremlin - Chaos Engineering](https://www.gremlin.com/chaos-monkey/the-simian-army/){:target="_blank" rel="noopener noreferrer"}
- [Gremlin - Chaos Engineering tools](https://www.gremlin.com/community/tutorials/chaos-engineering-tools-comparison/){:target="_blank" rel="noopener noreferrer"}
- [PagerDuty - Post Mortem](https://response.pagerduty.com/){:target="_blank" rel="noopener noreferrer"}