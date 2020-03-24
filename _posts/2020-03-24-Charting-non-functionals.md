---
layout: post
authors: [peter_dekinder]
title: 'Charting the Non-Functional Waters'
image: /img/2020-03-24-Charting-non-functionals/nonfunc_background.jpg
tags: [Architecture]
category: Architecture
comments: true
---
Where functional requirements are relatable to most stakeholders as they are derived from their areas of expertise, specifying the brunt of the non-functionals tends to fall to the solution architect. As these requirements are more technical in nature, the affinity of other stakeholders with them is not as pronounced. When inquiring about their relevance, the typical answer will be in very generic fashion, for example: “The application needs to be fast.” Trying to get more concrete and measurable statements is not an easy endeavor. We’ll get back to this further on in the blog post.

Once we have the appropriate numbers, we need to formalize them and get them validated. Just as the structure and formalization of the functional requirements is expressed as user stories, or in some cases even more detailed in the form of Business Processes and use cases, in a similar manner will we structure and formalize the non-functionals based on the ISO 25010 standard. Some older architecture documents could also still make a reference to the ISO 9126 standard, which is its predecessor.

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2020-03-24-Charting-non-functionals/iso25010.png' | prepend: site.baseurl }}" alt="Workspace" class="image" style="margin:0px auto; max-width:100%">
{: refdef}
{:refdef: style="text-align: center;"}
ISO 25010 Standard
{: refdef}

Since the ISO standard focuses on quality and acceptance of the delivered product, the same model should be the basis to compose requirements as well. As a result, the quality attributes can be considered as the non-functional requirements of the product focusing on expectations about functionality, usability, reliability, efficiency, maintainability and portability. However, in order to make the factors more complete and representative, each of the characteristics has been split up into its proper set of sub-characteristics.
 
Note however that not all characteristics and associated sub-characteristics are as important to each and every project. On a case-by-case basis, some of them can be given a very low priority or even entirely neglected. Hence, the priority indication is very important in the specification for every requirement. These are the tradeoffs that an architect needs to chart to arrive at the proper solution. One of the ways to weigh them was described in the [book “Software Requirements” by Karl Wiegers and Joy Beatty](https://www.amazon.co.uk/Software-Requirements-Developer-Best-Practices/dp/0735679665/ref=sr_1_1){:target="_blank" rel="noopener noreferrer"}. The idea is to chart them in a matrix which marks the requirements that take precedence over others when they have conflicting impacts on the solution. For example: When business stakeholders ask for a speed of delivery that is contradicted by security concerns demanding a mandatory waiting period for customer due diligence purposes, a decision needs to be taken on which of these requirements gets the upper hand for the implementation. 

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2020-03-24-Charting-non-functionals/nonfuncprios.png' | prepend: site.baseurl }}" alt="Workspace" class="image" style="margin:0px auto; max-width:100%">
{: refdef}
 
A reflection of this type of requirements contradiction can be found in the CAP theorem. The CAP theorem, also named Brewer's theorem after computer scientist Eric Brewer, states that it is impossible for a distributed computer system to simultaneously provide more than two out of three of the following guarantees: Consistency. Availability. Partition tolerance. Consistency is the characteristic that determines that a service will always give the same answer across multiple nodes. Availability reflects that every service request should get a response. Partition tolerance is the ability to handle the occasional failure in communication between two services. A balance matching the needs of the solution must be determined between these three requirements in order to implement a solution that fits the bill.

There are some frameworks that already have some form of priority already built in. They implement this by reducing the number of non-functional categories to only those relevant in their point of view. For example, when we take the AWS Well-Architected Framework, the determining non-functionals are reduced to five categories based on Amazon’s experiences and best practices. For each of these pillars AWS has published a white paper on how to improve and optimize them. IT also provides tooling and labs to help the architect make the proper tradeoffs. 
 
{:refdef: style="text-align: center;"}
<img src="{{ '/img/2020-03-24-Charting-non-functionals/awswellarch.png' | prepend: site.baseurl }}" alt="Workspace" class="image" style="margin:0px auto; max-width:100%">
{: refdef}
{:refdef: style="text-align: center;"}
Pillars of the AWS Well-Architected Framework
{: refdef}

When maturing the requirement list set out for the solution, it might become a difficult and complex task to get accurate numbers to quantify the requirements and make them measurable. We can gather the logs of existing systems that we are replacing to get a grip on what traffic we can expect. But this is not always an option. Suppose we are developing a solution for registering timesheets of employees in a small business that have just gotten a significant enough growth in its sales to justify the cost of such a solution. It doesn’t have numbers on how many times the services of such a system should be called and it doesn’t have an existing system from which to extract them. This is where we start to rely on deduction. We start from relevant data that we do have access to or make assumptions based on experience and we extrapolate from there. In the case of our timesheet solution, we count the number of employees (relevant data) and multiply it by the number of times a week we assume they will access the timesheet solution resulting in a quantified requirement.

Most of the requirements stipulated by the ISO 25010 standard apply to software solutions. The game changes a bit if this solution is primarily or even solely focused on the data facet. When designing a data solution such as for example a solution that gathers and evaluates the available data for a specific topic, we look at a sister standard of the one previously mentioned. The ISO 25012 is part of the same family and offers requirements fitting two categories with some these shared by both. These categories are:
* Inherent Data Quality: This category gathers all requirements that deal with the inherent data quality of the data sets that are being used in the solution.
* System-Dependent Data Quality: This category deals with the requirements that have to do with the capabilities of maintaining the quality inherent in the data sets.
 
{:refdef: style="text-align: center;"}
<img src="{{ '/img/2020-03-24-Charting-non-functionals/iso25012.png' | prepend: site.baseurl }}" alt="Workspace" class="image" style="margin:0px auto; max-width:100%">
{: refdef}
{:refdef: style="text-align: center;"}
ISO 25012 Standard
{: refdef}


When a solution finally goes live, it will have an impact on the existing way of working within the organization. Not only are its users a stakeholder, but there is also the team that will support the solution to consider as well. Therefore, a set of operational requirements is usually determined by analyzing how the managed services team will keep the solution up and running, how they will cope with bug fixing and evolutionary maintenance, and how to cope with negative impact.
 
As with non-functional requirements, so can these requirements be categorized by using an ISO standard, in this case the ISO 25022 standard, or the “Quality in Use” Model. This standard defines measures for the characteristics of the previously mentioned ISO 25010 standard and consists of a basic set of impact measures and methodologies to quantify each of them. This standard is a collection of suggested measures and is by no means an exhaustive list. A visual representation of these requirements can be seen in the illustration below.

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2020-03-24-Charting-non-functionals/iso25022.png' | prepend: site.baseurl }}" alt="Workspace" class="image" style="margin:0px auto; max-width:100%">
{: refdef}
{:refdef: style="text-align: center;"}
ISO 25022 Standard
{: refdef}

In summary, an architect needs to be able to get a handle on all the angles of the solution as soon as possible in the development process, and requirements, both functional and non-functional, allow him or her the overarching vision to guide development along. Be wary of analysis paralysis though. To quote the former US Secretary of Defence Donald Rumsfeld: “There are known unknowns, that is to say, there are things that we now know we don’t know them.” So, avoid trying to get the perfect picture of the requirements, and instead factor into your solution that new requirements can pop up and hidden ones can be revealed during the later stages of the project.