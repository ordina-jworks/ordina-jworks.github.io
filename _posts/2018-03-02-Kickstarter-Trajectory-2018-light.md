---
layout: post
authors: [johan_silkens, nick_van_hoof, sam_schuddinck, dries_thieren, maarten_westelinck, yunus_altin, yen_mertens]
title: "Kickstarter Trajectory 2018 Light Edition"
image: /img/kicks.png
tags: []
category: Kickstarters
comments: true
---

> As a developer I want to know the IT landscape so that I can orientate and implement business value on various fields.” We do this by learning from experts and eagerly absorbing knowledge. Ordina happens to provide the perfect way of doing this by enrolling new employees in their “Kickstarter program”. During this three-week iteration we increased our value by familiarizing ourselves with the Ordina stack.

# Backlog

<img src="/img/2018-03-02-Kickstarter-Trajectory-2018-light/kanban.jpg" style="max-width:100%"/>

<!--inleiding start opleiding (Maarten) -->

The Ordina kickstarter traject is a collection of courses tailored and designed by the senior consultants of Ordina.
These courses are designed to give the beginning software developer a broad knowledge base while also providing an in-depth view on technologies and best practices that Ordina consultants use in day-to-day software development.

This year the kickstarter traject spanned 15 days, with topics ranging far and wide: backend to frontend, Spring Data JPA to TypeScript and everything in between.
All of these courses will make sure the candidates will be able to hit the ground running on their first project as Ordina consultants.

This post will summarize the training and experiences we've had while following the kickstarter traject. 

# What we have done

### Git <!-- Sam -->
During the first days of our kickstart traject we've got a brief explanation about git by [Yannick De Turk](/author/yannick-de-turck/).
He explained us that git is an open-source, distributed version control system that keeps track of your files and history.
Basicly this means git offers us tooling to collaborate on code bases without overwriting each others changes so easily.

We saw which workflow JWorks uses in git and which commands we can use to do so.
This way we learned how to create git repo's and create separate branches for features or different environments for example.
And we even saw the different ways to merge these branches.
One thing we'll definitely won't forget that fast is to rebase when pulling to keep a clean non-spaghetti like history,
something that is preferred by many co-workers at JWorks! 
At least that is what Yannick has told us ;)

### Spring and Spring boot <!-- Johan -->

Those lectures were given by [Ken Coenen](/author/ken-coenen/) and were spread over two days.  

During the first lecture, We got a recap of the concepts of JPA,Beans, Application contexts and other things that Spring uses in its core fundamentals. Next, we dug deeper into the framework and introduced ourselves with Spring Web Services and spring Security and created a small backend application during the second lecture. 

Both lectures where rather theoretical, but very informative  and elaborate with a lot of examples. So you got everything you need to get familiar with Spring. You can find the course material on his [Github](https://github.com/kencoenen/spring-course) page.

### Microservices <!-- Yen -->
The workshop on microservices was lectured by Kevin Van Houtte. It went pretty fast paced but at the end of the workshop, we had acquired a great overview of all the important aspects regarding microservices architecture! The most important thing to know is that each microservice takes care of only one specific business function.

Currently, monolith architectures are still being used a lot within companies, but as an up-to-date IT consultant it’s essentially to know about microservices and where to use it. It’s also our role to persuade clients to use microservices when we see fit.

We learned about the 12-factor app methodology, which defines all the important aspects of microservices architecture: regarding codebase, dependencies, configs, backing services, etc.

Over the course of 5 exercises, we got our hands on how to create a microservice, how to register it in a service registry (using Eureka), how to externalize our configuration (using Spring Cloud), how to create routing logic (using Zuul) and finally, how to test the implementation using the Feign HTTP client.

### Unit testing and mocking <!-- Dries -->
On Thursday we got a course about testing from Maarten Casteels, who works as a consultant for Ordina at Belfius.    
The first part of the day was a very passionate and interactive theory session about following subjects:
- Goals of testing
- What to test
- Fixtures
- Mocks
- Assertions
  
After the lunch break we did some exercises together that showed us how to mock out dependencies and which pitfalls we should have attention for.
This gave us a better understanding of the theory we saw that morning. 

All in all it was a great course explaining the big picture of testing but also showing us the ropes in day to day working with tests and code.
The open atmosphere enabled us to ask a lot of questions which Maarten always answered very thoroughly.  

### Frontend Essentials <!-- Sam --> 
At the end of our first week we went over some of the frontend essentials
before diving deeper into the frontend frameworks and build tools the next week.
This workshop was given by [Yannick Vergeylen](/author/yannick-vergeylen/).
Our colleagues from the Vision Works department accompanied us since they use the topics covered in this workshop as well.

After a theoretical recap about HTML, CSS and Javascript we learned how to use HTML to create web pages 
and how CSS is used to style these pages and its components. 
We also used some Javascript and learned how this is used to modify some of the HTML-components.

During the workshop we were given an exercise in which we had to recreate a given example page with the above technologies.
This way we had some hands-on experience straight away!
### Build Tools <!-- Yunus -->
We've started the second week with a solid introduction of front-end build tools. The topics of this workshop were Node.js, package managers and build systems & generators (gulp, webpack and angular-cli). After every topic we got the chance to have some hands-on experience. This started from scratch by installing node.js to creating a new project a new angular project and testing the application.
### Angular <!-- Sam --> 
One of the must see frontend frameworks is [Angular](https://www.angular.io) of course.
We've been introduced to it by [Ryan De Gruyter](/author/ryan-de-gruyter/).
Ryan did a very good job at it and gave us a good base to get started with Angular.

He taught us what Angular components are and how we can display data inside these components with the different types of data-binding.
We also saw how we can let these components communicate with each other
and pass data from child components to its parent component and vice versa.
On top of that we saw how Angular directives are used to loop over objects to show multiple elements 
or how we can use the *ngIf directive to hide/show elements and many more of these directives.
But that's not all, he also learned us about modules, services and how dependency injection works within Angular.
And much more of course!

One thing was for sure this was a very educational session.
Ryan did a good job on giving us some theoretical information about the different parts of Angular.
After each theoretical part we made some exercises on that part.  
And the cool thing about it?  
All these parts combined together we made ourselves a small crypto currency listing application with real data!
<p>
    <img style="max-width: 100%;" src="/img/2018-03-02-Kickstarter-Trajectory-2018-light/angular-crypto-app.jpg"/>
</p>
### DevOps & CI/CD
We have learned that the developers should share the responsibility of looking after the system they build. And not just handover the release to operations. The development team can also simplify the deployment and maintenance for the operation team. This could be done by introducing a DevOps culture. Yes, it’s not a role. It’s a culture. We have learned that DevOps aims to remove the isolation between operations and software development team by encouraging collaboration. It should also be easier to have changes in code and put it in production by using Continuous Delivery (CD). The code should always be in a deployable state. 

Continuous Integration (CI) is the process of automating the build and testing of code every time a team member commits changes to version control. We have learned how we can configure a CI tool. We had to chance to have some hands-on experience with the tool Go CD.
### Security <!-- Johan --> 

Security is nowadays a hot topic in the IT sector and it's important to handle sensitive (personal) information in a secure manner. Because it's not only a PR nightmare for your business, it's also a financial disaster as well because of the GDPR law that will take effect this May. This fascinating lecture was presented by  [Tim De Grande](/author/tim-de-grande/) on our last day of the Kickstarter trajectory. 

We discussed about the basic security fundamentals as well as how common web vulnerabilities work and tips and tricks on how to secure your own application.

<img src="/img/2018-03-02-Kickstarter-Trajectory-2018-light/security.jpg" style="max-width:100%"/>

### Docker <!-- Nick --> 
We started with a recap of the theory behind creating images and spinning up containers.
Soon we were setting up our own images and learned how to run our applications in a container. 
On the way we experienced hands-on the advantages of docker like faster configuration and how it fits nicely in the process
of CI/CD. Thanks [Tom Verelst](/author/tom-verelst/) for guiding us in the docker world.


# Recap <!--Everyone -->

Nu we klaar zijn met al deze onderwerpen, ieder van ons heeft er uit geleerd:

Per persoon (richtlijn 3 à 4 lijnen):

Nick: *“Ordina has given me the chance to further increase my knowledge by involving me in this 'Kickstarter' program. 
      It was great to learn about their top-notch stack from our own experts. This is exactly what I was looking for. 
      The kickstarter program just ended and I'm eager to start using my knowledge in an enterprise environment again“*

Sam: *“The opportunity you get at Ordina to learn from experienced developers is something you can't miss.
        The Ordina Kickstarter Traject is the perfect example of how it should be.
        You're presented some of the newest technologies from really kind, helpful and experienced developers.
        It's the perfect program to get you started in your career as developer!“*
        
Dries: *“As a backend developer with a few years experience I followed the program to see where I had gaps in my knowledge.
         Thanks to the great atmosphere and experienced teachers, I was able to fill those gaps.  
         The sessions were very interactive which enabled me to ask any question, they were always met with well-founded answers.
         The courses on JS and Angular also sparked my interest in frontend work, which will be very useful in my further career.“*
         
Maarten: *“The courses were tons of fun and taught me a lot.
          All of our teachers were competent individuals who made sure we learned as much as we could in the time that we had.
          I didn't have any experience in frontend development, so the frontend courses were eye-opening for me.
          To anyone that's having doubts about this kickstarter traject: go for it!
          I can definitely recommend it!“*

Johan: *"I'm really eager to learn more about new technologies and this Kickstarter course I followed suits my needs. It had challenged me in a good way on both a personal and technical level. Ordina really knows how to kick start newcomers into the astonishing world of technology."*  

Yunus: *“Ordina gave me the opportunity to put my academic knowledge in practice and to learn about the latest technology. I’ve learned the best practices from our seniors during this intensive kickstarter program. Every graduate needs to have participated a kickstart program like Ordina's, it’s the best way to start your career.“*

Yen: *"The Kickstarter program at Ordina really got me fast on track with the latest technologies being using in the field. I’m fresh out of school where I had a focus on back-end and here at Ordina, this background on back-end got greatly improved upon and it was interesting to get in touch with front-end tech! You notice all the coaches are experienced programmers and it was a privilege to learn from them. And if you need any help after a workshop, they are always quick to help. To summarize, I really recommend this Kickstarter program to accelerate your career!"*

**Someone else * ... *
