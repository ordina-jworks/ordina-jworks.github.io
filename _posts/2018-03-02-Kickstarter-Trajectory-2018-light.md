---
layout: post
authors: [johan_silkens, nick_van_hoof, sam_schuddinck, dries_thieren, maarten_westelinck, yunus_altin, yen_mertens]
title: "Kickstarter Trajectory 2018 Light Edition"
image: /img/kicks.png
tags: [Spring, Spring Boot, Angular, Unit Test, Mocking, Microservices, Git, DevOps, Docker, Typescript, Kickstarter, Security]
category: Kickstarters
comments: true
---


The Ordina Kickstarter trajectory is a collection of courses tailored and designed by the senior consultants of Ordina.
These courses are created to give the beginning software developer a broad knowledge base while also providing an in-depth view on several technologies and best practices.

This year the Kickstarter trajectory spanned 15 days, with topics ranging far and wide: backend to frontend, Spring Data JPA to TypeScript and everything in between.
All of these courses will make sure the candidates will be able to hit the ground running on their first project as Ordina consultants.

This post will summarize the training and experiences we've had while following the Kickstarter trajectory. 

# Backlog

<img src="/img/2018-03-02-Kickstarter-Trajectory-2018-light/kanban.jpg" style="max-width:100%"/>

# What we have done

### Git
During the first days of our kickstart trajectory we've got a brief explanation about Git by [Yannick De Turck](/author/yannick-de-turck/).
He explained us that Git is an open-source, distributed version control system that keeps track of your files and history.
Basically this means Git offers us tooling to collaborate on code bases without overwriting each others changes so easily.

We saw which workflow JWorks uses in Git and which commands we can use to do so.
This way we learned how to create Git repos and create separate branches for features or different environments.
And we even saw the different ways to merge these branches.
One thing we'll definitely won't forget that fast is to rebase when pulling to keep a clean non-spaghetti like history,
something that is preferred by many co-workers at JWorks! 
At least that is what Yannick has told us ;)

### Spring and Spring boot

Those lectures were given by [wKen Coenen](/author/ken-coenen) and were spread over two days. 

During the first lecture, we got a recap of the concepts of JPA, beans, application contexts and other things that Spring uses in its core fundamentals. Next, we dug deeper into the framework and introduced ourselves with Spring Web Services and Spring Security and created a small backend application during the second lecture. 

Both lectures were rather theoretical, but very informative and elaborate with a lot of examples. So you have got everything you need to get familiar with Spring. You can find the course material on Ken's [Github](https://github.com/kencoenen/spring-course) page.

### Microservices
The workshop on microservices was lectured by [Kevin Van Houtte](/author/kevin-van-houtte/). 
It went pretty fast and at the end of the workshop, 
we had acquired a great overview of all the important aspects regarding the microservices architecture! 
The most important thing to know is that each microservice takes care of only one specific business function.

Currently, monolith architectures are still being used a lot within companies, 
but as an up-to-date IT consultant it’s essential to know about microservices and where to use it.

We learned about the 12-factor app methodology, 
which defines all the important aspects of microservices architecture: codebase, dependencies, configs, backing services, etc.

In a hands-on approach we learned how to create a microservice, how to register it in a service registry (using Eureka), 
how to externalize our configuration (using Spring Cloud), 
how to create routing logic (using Zuul) and finally how to test the implementation using the Feign HTTP client.

### Unit testing and mocking
On Thursday we got a course about testing from [Maarten Casteels](/author/maarten-casteels/), who works as a consultant for Ordina at Belfius.    
The first part of the day was a very passionate and interactive theory session about the following subjects:
- Goals of testing
- What to test
- Fixtures
- Mocks
- Assertions
  
After the lunch break we did some exercises together that showed us how to mock out dependencies and which pitfalls we should pay attention to.
This gave us a better understanding of the theory we saw that morning. 

All in all it was a great course explaining the big picture of testing but also showing us the ropes in day to day working with tests and code.
The open atmosphere enabled us to ask a lot of questions which Maarten always answered thoroughly.  

### Frontend Essentials
At the end of our first week we went over some of the frontend essentials
before diving deeper into the frontend frameworks and build tools the next week.
This workshop was given by [Yannick Vergeylen](/author/yannick-vergeylen/).
Our colleagues from the VisionWorks department accompanied us since they use the topics covered in this workshop as well.

After a theoretical recap about HTML, CSS and JavaScript we learned how to use HTML to create web pages 
and how CSS is used to style these pages and its components. 
We also used some JavaScript and learned how this is used to modify some of the HTML-components.

During the workshop we were given an exercise in which we had to recreate a given example page with the above technologies.
This way we had some hands-on experience straight away!
### Build Tools
We've started the second week with a solid introduction of frontend build tools. 
The topics of this workshop (given by [Michael Vervloet](/author/michael-vervloet/)) were [Node.js](https://nodejs.org/en/), package managers and build systems & generators ([gulp](https://gulpjs.com), [webpack](https://webpack.js.org) and [Angular CLI](https://cli.angular.io)). 
After every topic we got the chance to put this newly acquired knowledge into practice. 
This started from scratch by installing Node.js and at the end we created an Angular project. 
### Angular 
One of the must see frontend frameworks is [Angular](https://www.angular.io) of course.
We've been introduced to it by [Ryan De Gruyter](/author/ryan-de-gruyter/).
Ryan did a very good job and gave us a good base to get started with Angular.

He taught us what Angular components are and how we can display data inside these components with the different types of data-binding.
We also saw how we can let these components communicate with each other
and pass data from child components to its parent component and vice versa.
On top of that, we saw how Angular directives are used to loop over objects to show multiple elements. 
And how we can use the *ngIf directive to hide/show elements and many more of these directives.
But that's not all, he also taught us about modules, services, dependency injection and much more.

It was a very educational session for sure.
Ryan did a good job on giving us some theoretical information about the different parts of Angular.
After each theoretical part we made some exercises.  
And the cool thing about it?  
All these parts combined we made ourselves a small crypto currency listing application with real data!
<p>
    <img style="max-width: 100%;" src="/img/2018-03-02-Kickstarter-Trajectory-2018-light/angular-crypto-app.jpg"/>
</p>
## DevOps & CI/CD
We learned that developers should share the responsibility of looking after the system they build. 
And not just hand the release over to operations. 
The development team can also simplify the deployment and maintenance for the operation team. 
This could be done by introducing a DevOps culture. 
Yes, it’s not a role. It’s a culture. 
We have learned that DevOps aims to remove the isolation between operations and software developers by encouraging collaboration. 
It should also be easier to change your code and push it to production by using Continuous Delivery (CD).

Continuous Integration (CI) is the process of automating the build and testing of code every time a team member commits changes to version control. 
We have learned how we can configure a CI tool. 
We had the chance to have some hands-on experience with [GoCD](https://www.gocd.org).  

This workshop was given by [Tim Vierbergen](/author/tim-vierbergen/).
## Security
<img src="/img/2018-03-02-Kickstarter-Trajectory-2018-light/security.jpg" style="max-width:100%" align="right"/>
Nowadays, security is a hot topic and it's important to handle sensitive (personal) information in a secure manner.
Because it's not only a PR nightmare for your business, 
it's also a financial disaster because of [GDPR](https://www.eugdpr.org/) that will take effect this May 2018. 
This fascinating lecture was presented by [Tim De Grande](/author/tim-de-grande) on our last day of the Kickstarter trajectory. 
 
We discussed basic security fundamentals, common web vulnerabilities and tips and tricks on how to secure your own applications.

<br/>
### Docker
We started with a recap of the theory behind creating images and spinning up containers.
Soon we were creating our own images and learned how to run our applications in a container. 
On the way we experienced the advantages of Docker and how it fits nicely in the process
of CI/CD. Thanks [Tom Verelst](/author/tom-verelst/) for guiding us into the Docker world.

# Recap

Nick: *"Ordina has given me the chance to increase my knowledge by involving me in the Kickstarter program. 
        It was great to learn about the top-notch Ordina stack from our own experts.
        This is exactly what I was looking for. 
        The Kickstarter program just ended and I'm eager to start using my knowledge in an enterprise environment again.
        Ordina also provides plenty of other learning opportunities. 
        Since I arrived, I could join an interesting seminar or workshop every week."*

Sam: *"The opportunity you get at Ordina to learn from experienced developers is something you can't miss.
        The Ordina Kickstarter trajectory is the perfect example of how it should be.
        You're presented some of the newest technologies from really kind, helpful and experienced developers.
        It's the perfect program to get you started in your career as developer!"*
        
Dries: *"As a backend developer with a few years experience I followed the program to see where I had gaps in my knowledge.
         Thanks to the great atmosphere and experienced teachers, I was able to fill those gaps.
         The sessions were very interactive which enabled me to ask any question, they were always met with well-founded answers.
         The courses on JS and Angular also sparked my interest in frontend work, which will be very useful in my further career."*
         
Maarten: *"The courses were tons of fun and taught me a lot.
          All of our teachers were competent individuals who made sure we learned as much as we could during the time we had.
          I didn't have any experience in frontend development, so the frontend courses were an eye-opening experience.
          To anyone that's having doubts about this Kickstarter trajectory: go for it!
          I can definitely recommend it!"*

Johan:  *"I'm really eager to learn more about new technologies and the Kickstarter course suited my needs. 
It challenged me in a good way on both a personal and technical level. 
Ordina really knows how to kick start newcomers into the astonishing world of technology."*

Yunus: *"Ordina gave me the opportunity to put my academic knowledge in practice and learn about the latest technologies. 
I’ve learned the best practices from our seniors during this intensive Kickstarter trajectory. 
Every graduate needs to have participated in a kickstart trajectory like Ordina's, it’s the best way to start your career."*


Yen: *"The Kickstarter program at Ordina really got me fast on track with the latest technologies being used in the field. 
I’m fresh out of school where I had a focus on backend and here at Ordina this got greatly improved upon. 
It was also interesting to get in depth on frontend tech! 
You notice all the coaches are experienced programmers and it was a privilege to learn from them. 
And if you need any help after a workshop, they are always quick to help. 
To summarize, I really recommend this Kickstarter program to accelerate your career!"*
