---
layout: post
authors: [brecht_porrez, duncan_casteleyn, imad_hamroun, jasper_rosiers, lennert_peeters, lore_vanderlinden, mohammed_laghzaoui, nicholas_meyers]
title: "Kickstarter Trajectory 2019 Summer Edition"
image: /img/kicks.png
tags: [Spring, Spring Boot, Angular, Unit testing, Mocking, Microservices, Git, DevOps, Docker, TypeScript, Kickstarter, Security]
category: Kickstarters
comments: true
---

# Introduction
>65 young professionals started the Ordina kickstarter trajectory this summer, on the 1st of August. 
JWorks counted 8 kickstarters: Mohammed, Jasper, Nicholas, Lennert, Duncan, Lore, Brecht and Imad. 
All looking for a challenge and a fresh start. Most of them just graduated, Brecht on the other hand already had other work experience. 
During the Kickstarter program, we were introduced to a wide range of technologies.
Technologies that play an important role in IT. 
The courses were focused mainly on providing a very hands-on experience as to learn how the different technologies work in practice.

During the three months kickstarter trajectory, there were two main periods:
* The first six weeks were filled with various trainings: security, backend, frontend, soft skill trainings,...
* During the remaining six weeks we got split up into two teams to work on different dev cases: Chatbot Dina and Zero Plastic Rivers

This blogpost will talk about both periods separately below. The first period is further separated into technical and non-technical trainings.

1. [Technical trainings](#technical-trainings)  
2. [Non-technical trainings](#non-technical-trainings)  
3. [Dev cases](#dev-cases) 

## First Day
On our first arrival at Ordina, we were warmly welcomed by Anja, our Resource Manager, and two of the Practice Managers: Ken and Yannick. 
We were introduced to the structure of Ordina and got to know some of the other kickstarters. 
After the introduction, we were given a tour of the entire building, during which we met some of the colleagues at JWorks.
Four of the kickstarters already did an internship at Ordina before coming to work officially, so they already knew a lot of the colleagues in Mechelen.
This didn't make any difference however, since everyone was very open and welcoming.
Finally, we got our laptops and the keys to our cars so that the next day we could get started with the courses focused on both technical and soft skills.

# Technical trainings

During the six weeks of trainings there were a lot of very interesting technical sessions. 
The most important ones to us are discussed below.
Other than those mentioned below, there are a lot of others, such as the course on Git, DevOps, Java,... 

## Spring Boot
During our kickstarter trajectory, the Spring Boot course was taught by [Ken Coenen](/author/ken-coenen){:target="_blank" rel="noopener noreferrer"}.
He explained what sits at the core of Spring and how Spring Boot works. 
Before taking a deep dive into Spring Boot, we were taught the ins and outs of the Spring Framework. 

<img class="image right" alt="SpringBoot" src="/img/2019-10-24-Kickstarter-Trajectory-2019-Summer-Edition/SpringBoot.png" width="20%" height="20%" target="_blank">

Spring Boot takes away a lot of configuration by providing defaults based on industry standards. 
Therefore, Spring Boot makes it easy to create stand-alone, production grade Spring based applications that need minimum configuration. 
They still allow you to take the whole configuration in your own hands and of course provide a handful of third-party libraries to get you started. 
When generating a new Spring Boot project, you get to pick between a Maven or Gradle based project.

### Day 1
On the first day, we took a first dive into the core fundamentals: Inversion Of Control (IOC), Bean Injection, and so on. 
In the afternoon, we went further and looked into Spring Web Services and Spring Security. 

### Day 2
The second day, we built a small application to test the range of possibilities Spring Boot offers. 
The app was built to provide a system to save houses with their address, the inhabitants and some of the features it has, like the type of garage.
It was a fun little project which taught us a lot of what Spring Boot can be used for. 
We've all used Spring Boot in our dev case, so it was definitely worth following.

#### [Duncan Casteleyn](/author/duncan-casteleyn)
>What I really liked about Ken's Spring Boot session was that we did a lot of hands-on live coding.
This made the course very interactive, providing possibilities for both feedback to Ken as input of our own.
I learned a lot from this session, even though I already had a lot of prior knowledge of Spring Boot.
The theoretical start on Spring was a very useful refresh to get up to speed again.

## Docker
The Docker course, given by [Tom Verelst](/author/tom-verelst){:target="_blank" rel="noopener noreferrer"}, started with a theoretical explanation about the advantages of containerization, the difference with virtual machines and how a container is built. 
The main part of the course was a hands-on session. 
We learned to create an image of our application and push it to Docker hub, spin up a Docker container and write efficient Docker compose files.

#### [Brecht Porrez](/author/brecht-porrez)
>During this training I really experienced the advantages of Docker. 
I now use it almost daily during the Zero Plastic Rivers dev case.
For example, if I need a test database, I quickly start up a Docker container.
If I have written a backend application, I quickly turn it into a container so my frontend colleagues can test with it and so on.

## Kubernetes

<img class="image right" alt="Kubernetes" src="/img/2019-10-24-Kickstarter-Trajectory-2019-Summer-Edition/Kubernetes.png" width="40%" height="40%" target="_blank">

To better understand the use of Docker, Tom also gave us an introduction to Kubernetes (K8s). 
In the K8s session, we learned to work with the commands of Kubernetes by using them on Minikube, a tool to run Kubernetes locally. 
Later that day we learned to deploy a prebuilt application to Minikube. 
We wrote our own deployment files for the frontend, backend and RabbitMQ. 
By doing this we had more insight into the possibilities of Kubernetes.

#### [Nicholas Meyers](/author/nicholas-meyers)
>I’m very interested in how applications are built and deployed, which is why I found the Kubernetes session very interesting. 
I’d love to learn more about this technology in the future. 
The hands-on way of working helped me a lot, because this was quite new to me, which made it not the easiest course to follow.

## Test-Driven Development

In the DevOps track, we received an interesting lesson about Test-Driven Development from [Pieter Van Hees](/author/pieter-van-hees){:target="_blank" rel="noopener noreferrer"}.
In school, TDD is usually not taught and testing comes after developing. 
What TDD aims to do is speeding up the development process by thinking about what exactly you want your program to do and which exact results you want.
After pouring those requirements into unit tests, you can start developing and immediately testing whatever you wrote. 
There are many advantages of working with TDD, but it mainly makes it easier later on in the development process. 
In the beginning, there's more work involved because you need to write all the tests. 
In the long run however, it saves a lot of time because you can immediately spot mistakes using your unit tests.
Another good use case is refactoring code. 
With the test already in place, you can be sure that the behaviour of the functionality is still the same and no regressions are introduced as a result of the refactoring.

#### [Lennert Peeters](/author/lennert-peeters)
>I’ll be looking more into TDD in the future and continue to develop using this philosophy. 
We’ve used the method in our Zero Plastic Rivers dev case.
It worked out great, saving us quite some time.

<div style="text-align: center;">
  <img src="/img/2019-10-24-Kickstarter-Trajectory-2019-Summer-Edition/TDD.png" width="40%" height="40%" target="_blank">
</div>

# Non-technical trainings

Ordina organised some non-technical trainings alongside the ones above. 
These were focused on Agile and Scrum, as well as some soft skills like how to present yourself in front of others.

## Agile & Scrum

The first of the courses in the soft skill department was an introduction into Agile and Scrum. 
Projects ran by Ordina teams get planned in short sprints of two weeks (or even less), making sure the Product Owner is able to give frequent feedback and the team has preplanned time slots for reflection. 
A Scrum team consists of three major parts: the developer team, the Product Owner and the Scrum Master. 
The dev team isn’t broken down into multiple roles but works as one whole. 
This is a very powerful and important part about how a Scrum Team works, since having the team work as a whole allows them to be fluent in their activities. 
This gives the project a more versatile approach with less frequent congestions and problems compared to the Waterfall methodology.

#### [Jasper Rosiers](/author/jasper-rosiers)
>What I found most interesting about the Scrum framework and the Agile way of working is that there are many moments to reflect on how the work is going and how well the team is working together. 
The daily scrum is a very powerful moment, which made us use it in our Chatbot dev case. 
Frequent meetings with the Product Owner and keeping him close to the project is another aspect I love about the Scrum framework. 
I will definitely look more into it in the future, since I'm aiming to become a Scrum Master.

<div style="text-align: center;">
  <img src="/img/2019-10-24-Kickstarter-Trajectory-2019-Summer-Edition/ScrumLayout.jpg" width="80%" height="80%" target="_blank">
</div>

## Agile Hands-On

[Michaëla Broeckx](/author/michaela-broeckx){:target="_blank" rel="noopener noreferrer"} gave us an introduction to how Agile development works in practice. 
It was a very hands-on session that helped us gain more knowledge and experience in the world of Agile development. 
First, we saw how the waterfall method worked, but then quickly noticed it wasn’t perfect and had a lot of flaws. 
This is why Michaëla introduced us to Agile which helped us to communicate and work better as a team. 

She did this by means of a productivity game.
The game worked as follows: 
* Everyone stands in a circle and the group gets one (small) ball. 
* The team was to throw around the ball during two minutes, while a metronome was ticking in the background. 
* Every time the ball got caught on a tick, one task was completed.
* After two minutes, the team got 30 seconds to decide on a new strategy, but were only allowed to change one thing at a time (an extra amount of balls, a different way of throwing, reverting back to a previous way of working,...)

Playing this game for 6 rounds, the productivity went up exponentially. The team had matters in its own hands, which made them think for themselves.
At the end we refreshed a couple of famous agile practices such as the SCRUM framework, which is a popular way of working together to quickly and reliably release new features.

<div style="text-align: center;">
  <img src="/img/2019-10-24-Kickstarter-Trajectory-2019-Summer-Edition/Agile%20game.png" width="80%" height="80%" target="_blank">
</div>

#### [Lore Vanderlinden](/author/lore-vanderlinden)
>The agile session was a very enriching experience. We learned the basic concepts of agile the right way. 
Michaëla was a very inspiring agile coach, making the learning process easier by using a hands-on way of teaching. 
She used real life examples to show us the advantages of working in an agile manner.

# Final day

On the day after the final course day, all the kickstarters gave a short presentation about themselves in front of the others and the management. 
This way, everyone present got to know the others, with both their professional interests and achievements, as well as a little on the personal side. 
Afterwards, there was a moment for networking and socializing with everyone, and an official graduation. 
The next day, the dev cases started, which we’ll explain below!

<div style="text-align: center;">
  <img src="/img/2019-10-24-Kickstarter-Trajectory-2019-Summer-Edition/FinalDay.png" width="80%" height="80%" target="_blank">
</div>

# Dev cases 

With two different dev cases, the team of 8 JWorks kickstarters was divided into two:
* Brecht, Imad, Lennert, Lore and Mohammed worked together on the Zero Plastic Rivers case for the University of Antwerp
* Duncan, Jasper and Nicholas were set on the task of designing Chatbot Dina for internal use

##  Zero Plastic Rivers

<img class="image right" alt="ZeroPlasticRivers" src="/img/2019-10-24-Kickstarter-Trajectory-2019-Summer-Edition/ZeroPlasticRivers.png" width="40%" height="40%" target="_blank">

At the end of the kickstarter trajectory, we were asked to develop a web application to monitor the plastic as it travels through the Schelde. 
For this purpose, we'd be using GPS trackers alongside QR-scanners.
This application is aimed at a PhD carried out at the University of Antwerp that consists of visualizing the plastic flow through the entire river, from the basin to the mouth. 
After visualizing it, an efficient remediation strategy could be made.

The main objective of the application is to create a monitoring network to collect plastic waste, for example, in dams, locks or water treatment plants. 
This way, plastic flows can be calculated for example in sub-basins or piers to estimate the total flow to the estuary.
To activate this system, plastic bottles in the Schelde river will be released at different strategic points with GPS trackers and personalized labels. 
These contain relevant information such as the identifier or the url to the application.

The application consists of two parts.
The first part is aimed at citizens who wish to help the cause, who can notify this surveillance network when they find a bottle as shown in the image on the right.
The second part is aimed at the researchers, and could be seen as the "backend" of the project, where the data given by the GPS trackers and the citizens is visualized in a clear and orderly way.

## Chatbot Dina

In the second DevCase, we built chatbot Dina for the Fleet department of Ordina. 
The Chatbot team set off using the Chatlayer bot framework, later to be joined by an implementation in Dialogflow. 
Since chatbots are a relatively new technology, we wanted to keep our options open and look for the best possible implementation. 

The Fleet department at Ordina gets a lot of repetitive questions on a daily basis, which often have easy to research answers. 
To reduce this workload and make possible a better layout of their time, we designed a chatbot using two different bot services. 
The chatbot is made accessible via multiple online channels, such as Microsoft Teams, Telegram and Slack. 
The implementations of these social media weren’t integrated within Chatlayer natively, so we had to build adapters to take care of the communication back and forth between the different platforms.

The bot interprets what the user says and formulates its reply depending on the subject. 
Dina can also ask questions to get more information, use API calls to look up tire centers etc. 
Using a well-designed chatbot, conversations should feel natural to the user, as if he was talking to a human. An example can be found below.

<div style="text-align: center;">
  <img src="/img/2019-10-24-Kickstarter-Trajectory-2019-Summer-Edition/Chatlayer.png" width="80%" height="80%" target="_blank">
</div>

# Conclusion

The past three months have been a really busy, but great experience. 
We met new people every day, got to learn (and teach!) new things every day and dive deeper into our interests. 
We would like to thank Ordina and the whole JWorks unit for welcoming us to the team and for giving us this opportunity!
