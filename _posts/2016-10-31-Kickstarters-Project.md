---
layout: post
authors: [tim_verte]
title: 'Kickstarter project 2016'
image:
tags: [Spring, Angular2, Unit Test, Postman, Spring Boot, Spring REST Docs]
category: Domain-Driven-Design
comments: true
---

>On August 1<sup>'st</sup> it was D-day for all the kickstarters that had recently joined Ordina. A batch of talented new people were ready to embark on a new adventure. This year around 50 people joined Ordina and participated in the Kickstarter Project. The JWorks kickstarter group consisted of 7 people, all of which were eager to get started. 6 people joined the JWorks unit and 1 joined the Security unit. The purpose of the two month long kickstarter protject is to broaden the knowledge of and prepare the kickstarters for their first project.

# Kickstarter project 2016

## First impressions

<q>You never get a second chance to make a first impression.</q>
<br/>
-- <cite>Harlan Hogan</cite>

And boy Ordina did a pretty good job!

The reception on the first day was really great and pretty informal.
First off the kickstarters received a tour of the company.
They introduced themselves and got to know eachother in a pretty playful way.
FINALLY the moment had arrived that everybody was waiting for !
The kickstarters received their highly anticipated company car and laptop.

In the office the overall atmosphere is pretty loose, you can ask anyone anything and you can talk to everybody.

After a few days the kickstarters also got the chance to go on a teambuilding day in Mechelen.
During the course of this day they had to work together as a team to complete some questions and games.
The winners were rewarded with a cup. Which ofcourse had a positive effect on learning how to communicate in a team and under stress, because some of the tests had to be completed within an certain amount of time.

Most of the kickstarters already had the chance to go to one of the interesting events organised by Ordina, where there are lots of interesting people to network with.
And a lot of great food ofcourse.



## August - Learning

The focus during the first month of the Kickstarters project was primarily on learning.
The first few days the kickstarters had to improve their softskills by learning how to be more assertive towards the client when needed.
They also learned to introduce themselves properly with the emphasis on their qualities and strengths, to ensure they make a good first impression themselves when going to the client.

The kickstarters were kept up to date with the preferred technologies, editors and best practices used by JWorks.
During the first month they received different courses in which they could improve their technical skills about:

 * Back-end
    * Java (7 & 8) + JavaEE
    * Spring
    * JPA
    * Webservices (REST & SOAP)
    * MongoDB

 * Front-end
    * HTML & CSS
    * Javascript & Typescript
    * Angular
    * Ionic

These courses were given by the JWorks unit who tried to teach the kickstarters a much as possible with theoretical material and some exercises afterwards.
Unfortunately these technical skills aren't enough to survive in the forever changing IT world.
This is why some extra help was provided in the shape of books and courses about how to write clean code, how to work agile and learning how to work in a team while understanding and using the SCRUM principles.

So by paying attention to technical development with the necessary certification processes and also focussing on the development of soft skills like communication, advising and collaboration,
Ordina commits to the personal development of these kickstarters.



## September - Dev-case

The focus during the second month was on the implementation of this year's dev-case.
Although they still had to follow a few courses along the way, like the basic priciples of security, the use of GIT and learning how to use MongoDB.

### SensyMcSenseFace was born
-- <cite>Chosen by popular vote, who would have guessed it...</cite></br>

The kickstarters already had learned how to write clean code and how to do this in the best possible way.
The purpose of the SensyMcSenseFace project was to give the kickstarters a use case where they could develop an end-to-end IoT solution, in which they could test and use their newly acquired skills.

<p style="text-align: center;">
  <img alt="SensyMcSenseFaceProject" src="/img/IoT.jpg">
</p>

### What did the client want

The kickstarters were supposed to build an application that accepts incoming data, while being able to process this data and output it in a more user friendly way.
The data would be send by 3 different sensors.

The sensors that are used:
   * Temperature sensor
   * Humidity sensor
   * Motion sensor

These sensors sends some data every few seconds to the back-end, where this data is being processed and send back to the front-end.
Here the front-end developers made sure all the data has been received and outputted in the correct way.

The following picture shows us the 2 meeting rooms that are equiped with 3 different sensors, which send their data back to the application's back-end.

<p style="text-align: center;">
  <img alt="Floor Plan" src="/img/kickstarters/floorplan.jpg">
</p>

Each meeting room equiped with the sensors, which have their values read by an Arduino that then sends these across the Proximus LoRa network to the backend. For the initial stages and testing the LoRa part was omitted and a simple node server instance was used to relay the sensor values to the actual backend.

This way the client (Ordina) could figure out when they are using exessive electricity.
For example people leaving the TV on for too long inside of the meeting rooms.
Also employees are able to see if the room is occupied or not, because right now booking a room with outlook isn't working so well as a lot of you might already have experienced.


### Used technologies - sofware

* back-end              
  * Maven
  * Spring
  * SpringBoot
  * MongoDB
  * Mockito

* front-end
  * Angular 2
  * Angular Material 2

* extra
  * Waffle
  * Cloudfoundry
  * GitHub


### process of the project

The first week went pretty well, they devided themselves up into 2 groups.
One group for the front-end and the other one for the back-end.
At first they started to create different user stories for their SCRUM board.
Using the newly acquired scrum techniques during the first month.
The kickstarters had to work in 4 short sprints of one week, during the first sprint they also decided to change their real life SCRUM board into an online version named Waffle.
This software would track the pull requests and merges automatically from Github and change the board accordingly.
Continuous Integration was pretty important during the course of the project.
This way whenever they made changes to the code and made a pull request to Github that failed to build, they had to fix their code before they could continue.
Once the build on codeship succeeded and the pull request was merged. The main development branch and master branch would have their changes (if any) deployed to their Cloudfoundry instance.

The process for the back-end was pretty simple.
They started out with around 5 people, so some of them started to pair program while others started to program on their own.
But, with paying attention to the SCRUM principles and how to write clean code.
So starting with the basic implementations of the sensor, room and notifications classes and writing the JUnit and Mockito tests was their first job.
While the back-end was pretty straight forward and relatively easy to begin with, the front-end team were confronted with some problems.
The team consisted of only 2 people who had to tackle a lot of problems with the use of Angular 2 which was still in Beta at the time.
Also the combination with the other frameworks wasn't quite that easy to work with.

Every morning the team did a stand up meeting where they would discuss their changes in eachothers code and what they were going to do next.
During these 4 weeks they tried to work in these short sprints but after a week or two it became clear this wouldn't be an easy task.
A few team members already had left the group because they were assigned to projects, which messed up their sprints completely.

During the first 2 weeks the back-end team started with using Spring Data JPA, but soon figured out Spring-boot-starter-data-MongoDB was the better alternative because of the large amount of data being pumped into the DB.
A lot of time of went into providing Rest documentation that covers all the different calls handled by the application.
This documentation was created with MockMvc tests, which create code snippets that are easy to use.

On the front-end side they didn't have test cases yet, but nobody in the entire team had ever written front-end tests before.
Which caused a little bit of a delay, also the webpages didn't seem to be responsive at all.
Luckily there were some online tutorials at hand on mocking and writing front-end tests.
The responsiveness issue was sovled by using their own components and CSS code instead of using material design.

When starting their 2 final weeks there were only 3 people left who were able to fully commit to the dev-case.
During the last week the kickstarters also had to prepare and give a proper introduction to the management of Ordina.
Showing their newly learned presentation and introduction techniques.

At the very end of the Kickstarters project the application was finished.
* You are able to watch an overview of the rooms
* You are able to check if a room is occupied or available
* You are able to check which sensors are in a room and check their last history
* You are able to check the sensor history between 2 timestamps
* You are able to get notifications on your cellphone when certain values are exceeded


### possible future changes

Because there wasn't enough time to completely finish the project, this project can still evolve in a lot of ways.

- Later on it could be possible to add roles or users.
- Easy to add more sensors or rooms
- Add predictions to the applications for every room.


### Lessons learned during the Kickstarters project

* How to be more confident
* How to introduce yourself in a professional way
* How to be more assertive
* You have to keep an eye out for possible changes in your code that encourage clean code
* How to work better and agile in a team and how to use SCRUM principles
* Pitfalls and difficulties when using and combining new technologies
* How to write proper tests (JUnit, Mockito, MvcTests)
* How to write proper Rest documentation



## The new JWorks colleagues

<img alt="Axel Bergmans" src="/img/kickstarters/2016/axel-bergmans.jpg">
<img alt="Matthias Caryn" src="/img/kickstarters/2016/matthias-caryn.jpg">
<img alt="Madi Dudaeva" src="/img/kickstarters/2016/madi-dudaeva.jpg"> Madi Dudaeva<br>
<img alt="Christophe Theyssen" src="/img/kickstarters/2016/christophe-theyssen.jpg">
<img alt="Ines Van Stappen" src="/img/kickstarters/2016/ines-vanstappen.jpg">
<img alt="Tim Verté" src="/img/kickstarters/2016/tim-verte.jpg">
