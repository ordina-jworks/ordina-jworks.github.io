---
layout: post
authors: [peter_dekinder]
title: 'Architecture Effort in Projects'
image: /img/2020-01-24-Architecture-in-Projects/architectureeffort.jpg
tags: [Architecture]
category: Architecture
comments: true
---

An architect is someone whose job it is to link various things together in a consistent, integrated, maintainable and sustainable way dixit Tom Graves of Tetradian Consulting. It is the job of the architect to translate the requirements into an architectural model, and to keep the noses of the different stakeholders in the development process pointed in the same direction. He does this for numerous reasons:
* Guiding thought in himself
* Guiding thought in others 
* Being able to answer questions asked of the architect
* Being able to examine the results of requirement gathering

The architect doesn’t guide action, he guides thought. Normally, thought precedes action, but in real life this is by no means an absolute truth. Numerous times in software development we might dive in headfirst and see where we get without thinking of how to go about it first. The term cowboy is sometimes colloquially used for this type of software engineer.  Additionally, the role of the architect is to suggest action, as well as oversee that action to ensure that it achieves its goal (quality assurance). So, the architectural process serves to support a reasoning process (guiding thought). The architect repeatedly runs through the reasoning process, either for guidance on his own decisions or for framing into context the decisions he requires from others. The overall picture of the solution needs to be coherent over all components.

When thinking about when during a project the architect should play a role, the tried and tested methodology of the Stage Gate Process immediately pops up. This approach divides product development process into five main stages. In between these stages, a number of gates are defined as guardians of the progression to the next stage. They outline the considerations to be taken into account in the decision to move forward to the next stage in the process. These considerations range from quality checklists to budgetary assessment, resources availability, market competence and even compliance with company guidelines and policies. The list can be quite extensive. The architect alongside several other stakeholders is an essential gatekeeper. He enhances the list of quality assurances with considerations from an architectural standpoint and makes sure they are met before moving on to the next phase of the project.

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2020-01-24-Architecture-in-Projects/stage-gate-process.jpg' | prepend: site.baseurl }}" alt="Workspace" class="image" style="margin:0px auto;">
{: refdef}
{:refdef: style="text-align: center;"}
The Standard Stage-Gate process (Source: Stage-Gate International)
{: refdef}

The stages typically used in this approach are the following:

* Stage 0 – Discovery/Idea Stage: The organization assesses its opportunities and capabilities in order to determine what is possible and advisable. This can be done through marketing research, innovation management, ideation sessions, blue ocean strategic efforts and other similar activities.
* Stage 1 – Scoping Stage: The stakeholders determine the scope of the new product and assess its feasibility and potential. 
* Stage 2 – Business Case Stage: The stakeholders assess the financial aspects of costs and gains and weigh them against each other. There are numerous [business case methodologies](https://www.evolute.be/thoughts/buscase.html){:target="_blank" rel="noopener noreferrer"} to do this, such as for example the [Val IT framework](http://www.isaca.org/Knowledge-Center/Val-IT-IT-Value-Delivery-/){:target="_blank" rel="noopener noreferrer"}.
* Stage 3 – Development Stage: Once the product is fleshed out in a positive business case, the development on the new product is done by one or more project teams.
* Stage 4 – Test & Validation Stage: Often called Acceptance Testing, the various stakeholders assess the correctness and effectiveness of the newly developed product.
* Stage 5 – Launch: The final stage for the product is to be put into production to start earning value for the organization.

This approach is very much keyed on the waterfall approach of software development. In order to take this approach to the new insights gathered from iterative development and agile thinking, where there is a need for smaller iterations, greater scalability and accelerated development, the people at [Stage-Gate International](https://www.stage-gate.com/){:target="_blank" rel="noopener noreferrer"} developed a NexGen Stage Gate Model which allows for reduced stages after the initial Minimum Viable Product (MVP) launch. These smaller iterations are however also guarded by gates between each iteration.

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2020-01-24-Architecture-in-Projects/stage-gate-nexgen.png' | prepend: site.baseurl }}" alt="Workspace" class="image" style="margin:0px auto;">
{: refdef}
{:refdef: style="text-align: center;"}
The NexGen Stage-Gate process (Source: Stage-Gate International)
{: refdef}

It might seem from the different illustrations that there is no gate after the Launch Stage. This is not the case. After going live there are several checks that are typically built in during the Go Live deployment as well as during a grace period after Go Live. There are no more stages to come in this model, but that doesn’t mean there is no more work to be done. A retrospective on the past project will benefit greatly from a gate checklist performed at this time, and down the line when doing a business case verification to see whether its initial assumptions holds up might also detect indicators of success/failure in this list that can be taken up the next time a business case in this context is written up. Should the need to upgrade or decommission the new solution in the future arise, this checklist could also highlight particularities otherwise forgotten that have could have an impact on these actions.

Although the architect should and can play a role in every stage of the project, he tends to regard the project in a slightly different set of stages. It starts in the Plan phase where it aligns with the global analyses. It goes along with the entire design portion of the Build phase and extends further till the architecture is constructed, documented, validated and accepted. The effort ends when the solution enters the last step in its lifecycle and enters the Dispose phase. Its main activities do however change depending on which phase of the project is currently happening.

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2020-01-24-Architecture-in-Projects/archphases.png' | prepend: site.baseurl }}" alt="Workspace" class="image" style="margin:0px auto;">
{: refdef}
{:refdef: style="text-align: center;"}
Architectural Phases of a Project
{: refdef}

The first activities of the architecture effort focus mainly on gathering all relevant requirements that might influence the design. These requirements will also form the basis for the acceptance criteria stipulated by the gates between the phases. They can be divided into functional and non-functional requirements, where the latter can be divided into technical (such as integration, quality, and infrastructure requirements) and operational requirements (such as documentation, training, and managed services requirements).

The solution architect works together with domain specialists, both business and technical, to guide and constrain the business and technical analyses from a technical perspective and should assist the analysts by informing them of technical information and possibilities. Through this exercise business knowledge is acquired and high-level business and technical requirements are produced. The requirements should be listed as SMART statements: Specific, Measurable, Achievable, Realistic, and Timely. These requirements do not only structure the technical effort, but other disciplines such as business architecture and testing as well.

The first version of a Solution Architecture (and its corresponding document) should be drafted as early as the Plan phase, when a first set of requirements becomes known, and an attempt at setting the scope ensues. This is sometimes called the Solution Architecture Blueprint. Next, throughout the project lifecycle the architecture version matures with the architect gaining more insight and detail of the to-be situation of the solution. As with most deliverables of a project, the solution architecture document will mature well into the Operate phase and even a bit of the Dispose phase with activities to keep the documentation up to date with reality.

The Solution Architecture will be reassessed several times during the architecture effort. It should be considered a living document. Each time new requirements are detected, new insights are gathered, or new constraints are introduced, the architecture needs to go through a cycle of validation of the new requirements/constraints, which feeds into a new version of the architecture design, followed by an architecture presentation and review event. For instance, these new requirements and insights can be derived from proofs of concept (POC), which have been executed following an earlier version of the architecture and have exposed gaps in the solution. 

The following activities will be undertaken by the architect to achieve a steadily maturing architecture document:

* Based on the previous architecture version, the detailed analysis will be executed by the analysts and/or more specialized domain architects. The solution architect has further the responsibility to streamline the correlation between this detailed analysis and his architecture. The solution architect provides technical information to the analysts; influences and aids the analysts’ decision making. 
* The solution architect gathers further information concerning the business and technical requirements. The solution architect thinks together with the business analysts and technical analysts in order to make the architectural decision, which can have immediate consequence on the analyses.
* The solution architect is responsible for the validation and acceptation of the final requirements documents. The acceptation of the requirements means the solution architect agrees that the requirements documents are relevant, correct, complete and unambiguous not only for architectural decisions, but also later for design and construction phases.
* The architect is also responsible for the follow-up of any Proof of Concepts that are to be performed as validation for the decided architecture. Based on the results of these POCs, an adapted version of the Architecture Document might be written out containing the conclusions of the POC.
* The solution architect organizes the presentation and the review session for the proposed architecture. The presentation and review session can be omitted upon the agreement and decision from a technical project manager, sparring architect and project manager.

These revisitations of the solution architecture should however be limited as much as possible in order to avoid ‘scope creep’ and unhealthy amounts of rework. And if they are not avoidable, efforts should be made to detect these changes as soon as possible in order to limit the impact these changes will have on the existing solution.

In summary, an architect will have a varying workload during all phases of the project. At the beginning of the project, the architect works together with the business and technical analysts to coordinate and guide the requirements gathering and analyses, resulting in a first mature version of the architecture. Further on, the technical analysis will be based on this version of the architecture document and will consolidate all the requirements in detail under the architect’s vigil. The architect oversees the detailed technical designs and organizes any POCs that are to be performed. Recurring actualization efforts are coupled with quality assurance of the implemented designs. 
