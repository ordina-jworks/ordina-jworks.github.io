---
layout: post
authors: [tim_verte]
title: 'Kickstarter project 2016'
image: /img/kicks.png
tags: [Spring, Angular2, Unit Test, Postman, Spring Boot, Spring REST Docs]
category: Kickstarters
comments: true
---

>On August 1<sup>'st</sup> it was D-day for all the kickstarters that had recently joined Ordina. A batch of talented new people were ready to embark on a new adventure. This year around fifty people joined Ordina and participated in the Kickstarter Project. The JWorks kickstarter group consisted of seven people, all of which were eager to get started. Six people joined the JWorks unit and one joined the Security unit. The purpose of the two month long kickstarter project is to broaden the knowledge of and prepare the kickstarters for their first project.

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

The overal atmosphere is pretty loose, you can ask anyone anything and you can talk to everybody.

After a few days the kickstarters also got the chance to go on a teambuilding day in Mechelen.
During the course of this day, they had to work together as a team to complete some questions and games.
The winners were rewarded with a cup. This enabled them to learn how to communicate in a team and under stress, because some of the tests had to be completed within an certain amount of time.

Most of the kickstarters already had the chance to go to one of the Ordina events like JOIN or CC meetings, where they networked with lots of interesting people.


## August - Learning

The focus was primarily on learning during the first month of the Kickstarters project.
The first few days the kickstarters had to improve their softskills by learning how to be more assertive towards the client when necessary.
They also learned to introduce themselves properly with the emphasis on their qualities and strengths, to ensure they make a good first impression of themselves when going to the client.

The kickstarters were brought up to date with the preferred technologies, editors and best practices used by JWorks.
During the first month they received different courses in which they could improve their technical skills about:

 * backend
    * Java (7 & 8) + JavaEE
    * Spring
    * JPA
    * Webservices (REST & SOAP)
    * MongoDB

 * frontend
    * HTML & CSS
    * Javascript & Typescript
    * Angular
    * Ionic

These courses were given by the JWorks unit who tried to teach the kickstarters a much as possible with theoretical material and some exercises afterwards.
Unfortunately, these technical skills aren't enough to survive in the forever changing IT world.
This is why some extra help was provided in the form of books and courses about how to write clean code, how to work agile and learning how to work in a team while understanding and using the SCRUM principles.

By paying attention to technical development with the necessary certification processes and also focusing on the development of soft skills like communication, advising and collaboration,
Ordina commits to the personal development of these kickstarters.



## September - Dev-case

The focus during the second month was on the implementation of this year's dev-case.
Although they still had to follow a few courses along the way, like the basic priciples of security, GIT and learning how to use MongoDB.

### SensyMcSenseFace was born
-- <cite>Chosen by popular vote, who would have guessed it...</cite><br />

The kickstarters already had learned how to write clean code and how to do this in the best possible way.
The purpose of the SensyMcSenseFace project was to give the kickstarters a use case where they could develop an end-to-end IoT solution, in which they could test and use their newly acquired skills.

<img alt="SensyMcSenseFaceProject" src="{{ '/img/kickstarters/2016/IoT.jpg' | prepend: site.baseurl }}" class="image fit">

### What did the client request

The kickstarters were given the task to build an application that accepts incoming data, while being able to process this data and output it in a more user friendly way.

The data would be sent by three different sensors:
   * Temperature sensor
   * Humidity sensor
   * Motion sensor

These sensors send some data every few seconds to the backend, the backend then processes this data and sends it back to the frontend.
Here the frontend developers made sure that all the data has been received and outputted in the correct way.

The following picture depicts the two meeting rooms that are equipped with three different sensors, which send their data back to the application's backend.

<img alt="Floor Plan" src="{{ '/img/kickstarters/2016/floorplan.jpg' | prepend: site.baseurl }}" class="image fit">

Each meeting room equipped with the sensors, which have their values read by an Arduino that then sends these across the Proximus LoRa network to the backend. For the initial stages and testing the LoRa part was omitted and a simple node server instance was used to relay the sensor values to the actual backend.

This way, the client (Ordina) could figure out when they are using excessive power.
For example people leaving the TV on for too long inside of the meeting rooms.


### Used technologies - sofware

* backend              
  * Maven
  * Spring
  * Spring Boot
  * MongoDB
  * Mockito

* frontend
  * Angular 2
  * Angular Material 2

* extra
  * Waffle
  * Cloudfoundry
  * GitHub


### Process of the project

The first week went pretty well, they divided themselves up into two groups.
One group for the frontend and the other one for the backend.
At first they started to create different user stories for their SCRUM board.
Using the newly acquired scrum techniques during the first month.
The kickstarters had to work in four short sprints of one week. During the first sprint they also decided to change their real life SCRUM board into an online version using Waffle.
This software would track the pull requests and merges automatically from Github and change the board accordingly.
Continuous Integration was pretty important during the course of the project.
This way, whenever they made changes to the code and made a pull request to Github that failed to build, they had to fix their code before they could continue.
Once the build on codeship succeeded and the pull request was merged. The main development branch and master branch would have their changes (if any) deployed to their Cloudfoundry instance.

The process for the backend was pretty simple.
They started out with around five people, so some of them started to pair program while others started to program on their own.
But, with paying attention to the SCRUM principles and how to write clean code.
Their first job was to start with the basic implementations of the sensor, room and notifications classes and writing the JUnit and Mockito tests.
While the backend was pretty straight forward and relatively easy to begin with, the frontend team were confronted with some problems.
The team consisted of only two people who had to tackle a lot of problems with the use of Angular 2 which was still in Beta at the time.
Also the combination with the other frameworks wasn't quite that easy to work with.

Every morning the team did a stand up meeting where they would discuss their changes in eachothers code and what they were going to do next.
During these four weeks they tried to work in these short sprints but after a week or two it became clear this wouldn't be an easy task.
A few team members already had left the group because they were assigned to projects, which messed up their sprints completely.

During the first two weeks the backend team started with using Spring Data JPA, but soon figured out Spring Data MongoDB was the better alternative because of the large amount of data being pumped into the DB.
A lot of time of went into providing REST documentation that covers all the different calls handled by the application.
This documentation was created with MockMvc tests, which create code snippets that were easy to use.

On the frontend side they didn't have test cases yet, but nobody in the entire team had ever written frontend tests before.
Which caused a little bit of a delay, also the webpages didn't seem to be responsive at all.
Luckily there were some online tutorials available on mocking and writing frontend tests.
The responsiveness issue was sovled by using their own components and CSS code instead of using material design.

When starting their two final weeks there were only three people left who were able to fully commit to the dev-case.
During the last week the kickstarters also had to prepare and give a proper introduction to the management of Ordina.
Showing off their newly learned presentation and introduction techniques.

At the very end the core of the application was finished.
* You are able to watch an overview of the rooms
* You are able to check if a room is occupied or available
* You are able to check which sensors are in a room and check their last history
* You are able to check the sensor history between two timestamps
* You are able to get notifications on your cellphone when certain values are exceeded


### possible future changes

Because there wasn't enough time to completely finish the project, this project can still evolve in a lot of ways.

- Later on it could be possible to add roles or users.
- Make adding sensors or rooms more user friendly.
- Add predictions to the applications for every room.
- Add user management with users and roles


### Lessons learned during the Kickstarters project

* How to be more confident
* How to introduce yourself in a professional way
* How to be more assertive
* You have to keep an eye out for possible changes in your code that encourage clean code
* How to work better and agile in a team and how to use SCRUM principles
* Pitfalls and difficulties when using and combining new technologies
* How to write proper tests (JUnit, Mockito, MvcTests)
* How to write proper REST documentation



## The new JWorks colleagues

<span class="image left "><img class="p-image" alt="Axel Bergmans" src="/img/kickstarters/2016/axel-bergmans.jpg" /></span>
<span class="image left "><img class="p-image" alt="Matthias Caryn" src="/img/kickstarters/2016/matthias-caryn.jpg" /></span>
<span class="image left "><img class="p-image" alt="Madi Dudaeva" src="/img/kickstarters/2016/madi-dudaeva.jpg" /></span>
<span class="image left "><img class="p-image" alt="Christophe Theyssen" src="/img/kickstarters/2016/christophe-theyssen.jpg" /></span>
<span class="image left "><img class="p-image" alt="Ines Verstappen" src="/img/kickstarters/2016/ines-vanstappen.jpg" /></span>
<span class="image left "><img class="p-image" alt="Tim Verté" src="/img/kickstarters/2016/tim-verte.jpg" /></span>

<br /><br /><br /><br /><br /><br />
