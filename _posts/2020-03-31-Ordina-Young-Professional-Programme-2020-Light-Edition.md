---
layout: post
authors: [hannelore_verbraekel, pieter_van_overbeke, eduard_tsatourov, youri_vermeir]
title: "Ordina Young Professional Programme 2020 Light Edition"
image: /img/kicks.png
tags: [Spring, Spring Boot, Angular, Unit testing, Mocking, Cloud-Native, Git, DevOps, Docker, TypeScript, Kickstarter, Young Professional Program, Security]
category: Young Professional Programme
comments: true
---
<style>
    p {
        display: flex;
    }

    img {
        object-fit: contain;
    }
</style>

# Introduction
The Young Professional Programme is made for starting developers who want to take their skills to the next level. This year, the light edition started on the 9th of March 2020 and lasted for about 3 months. 
We started with 4 junior developers. Youri was freshly graduated from school, while Eduard, Pieter and Hannelore had professional experience in IT.
Every one of us is mainly interested in front end web development by sheer coincidence.
In the first month of the Young Professional Programme we followed different workshops about the preferred stack used at Ordina. Sadly, about a week in, our sessions were held remotely due to the coronavirus. This made things more complicated, but because of the flexibility and effort of the mentors, the sessions were still clear and educational. 

# Setup
The first few days of our training were centered around building a base for the upcoming weeks. Since we all just got our laptops the day before we didn't have anything installed on them so that was the focus on the first training day.
We got the chance to install all programs and tools required for the rest of our training, like Docker, Visual Studio Code, IntelliJ, Git,...
A variety of different editors and IDEs were shown and we were allowed to pick the ones we preferred.

# Git
We also had a session about Git which is obviously an essential tool to understand for any modern developer. We saw the ins and outs of most of the Git commands and we practiced the most common ones. We didn't just see Git but also how it came to be and it's predecessors. Overall, it was an interesting session giving us a decent understanding of Git.

# Back end
### Java
Java is a general-purpose programming language that was released in 1995, which means it has been around for 25 years. It has become very popular over these years. In 2019, Java was one of the most used programming languages according to Github.
Java is also the preferred back end language of JWorks. Yannick de Turck gave us a workshop around this programming language. We talked about the new features that were released with each version from Java 7 until 14. In between the theory lessons we made some hands-on exercises on the new features like lambda streams and optionals. 
This was also the last day before the corona outbreak in Belgium. This meant the rest of the Young Professionals Programme was given remotely. 
 
### Spring
The Spring framework is an application framework and inversion of control container for the Java platform. It has become wildly popular in organizations and the Java community. We followed a three-day self study course, where we read the book 'Spring in action' by Craig Walls. This book gives you a general understanding of the Spring framework. On the second day there was a short Spring Presentation by Ken Coenen. Ken explained how all the Spring magic works behind the scenes and talked about the common components of the full Spring framework.
 
### Unit Testing
We also had a course about testing. We had an interactive hands-on session about multiple subjects like Test Driven Development, goals of testing, what to test, fixtures, mocks and assertions.

### Databases
<img class="image" style="max-width: 200px; margin: 0;" alt="HtmlCssJs logo" src="/img/2020-03-31-Young-Professional-2020-Light/postgre-sql.png">
Databases are integral to the development of applications, you will almost always need some form of data storage. So we followed a session with Tom Van Bulck who showed us all kinds of databases. First we saw a traditional relational database, in this case PostgreSQL, a database which is widely known and used in many different projects around the world. 

<p style="flex-direction: row-reverse;">
    <img class="image" style="max-width: 200px; margin: 0;" alt="HtmlCssJs logo" src="/img/2020-03-31-Young-Professional-2020-Light/mongodb.png">
    Then we stepped away from relational databases to look at other kinds. More specifically MongoDb which is a non relational database, otherwise known as a noSQL database, in mongoDb's case it's a document store. Here you don't have a fixed schema, you upload json documents which you can then easily query using an SQL style query syntax. Apart from mongoDb we also learned about Cassandra, which is a noSQL column store and we touched on Redis as well, which is a key value store. Last but not least we saw a graph database, namely Neo4J. 
</p>

# Front end

### HTML, CSS, Javascript
<p style="flex-direction: row-reverse;">
    <img class="image" style="max-width: 150px; margin: 0;" alt="HtmlCssJs logo" src="/img/2020-03-31-Young-Professional-2020-Light/html-css-js.png">
    Since the Young Professional programme teaches a wide array of technologies we had saw quite a few front end technologies.
    Starting off with the basics of almost every front end technology, HTML5, CSS and Javascript. 
    In the first part of this session we took a dive into the basics of HTML and CSS, and after this we learned about the more recent features of HTML5 and CSS3. The remainder of the session was mainly about JavaScript. Throughout the session we had some exercises to have a bit of a hands-on approach.
</p>

### Typescript
<img class="image" style="max-width: 200px; margin: 0;" alt="Typescript logo" src="/img/2020-03-31-Young-Professional-2020-Light/typescript.png">
Building on the basics we learned prior, we had a session about Typescript, a derivative of Javascript that is becoming more and more popular amongst most front end frameworks because of it's similarity to Javascript but also having types allowing stricter rules to be enforced and less random unexplainable errors. Similarly to the previous session we got an explanation on the basics of Typescript which was then used in some exercises.

### Angular
<p style="flex-direction: row-reverse;">
    <img class="image" style="max-width: 200px; margin: 0;" alt="Angular logo" src="/img/2020-03-31-Young-Professional-2020-Light/angular.png">
    Eventually we reached the end of our front end training with a 2-day Angular course. Everything we learnt the previous days was now being poured into a framework. In this course we, again, saw the basics of this massive Typescript framework. We saw everything from dependency injection to property binding. Angular is a framework built by Google so there are lots of features, because of this we didn't have enough time in those 2 days to really explore Angular in-depth. This is  the preferred front end technology in JWorks. We were also going to use it in the dev case, so we would have enough time to understand it on a deeper level.
</p>

# Cloud

### Docker

### DevOps & CI

### Kubernetes

### Cloud IAAS/PAAS/CAAS

### Security Principles

# Clean Code
Today, one of the most important skills of a developer is Clean Code. 
To explore this complex topic, we read the book 'Clean Code' by Robert C. Martin, which is one of the must reads for every programmer.
To be able to write clean code, an understanding of what bad code is is needed. This is also explained in the first chapter of the book.
Some examples of topics in the book we still use everyday are: 
- Avoiding comments but using descriptive names
- Functions should be small and do one thing
- Use one word per concept
- ...

# Dev case
### Introduction
For our dev case, our task was to make a fully functional web application for MFC Combo. MFC Combo is an organization in youth care who guide families and children with a difficult situation at home. They use the "Combobox" in their meetings with the families. This is used to make communication easier and more fun.
Right now, they have physical stickers and papers to let the child express their feelings, but they want it to become digital so that it's easier to follow-up a child. 

We worked Agile in two-weekly sprints with all the Scrum Ceremonies. Azure DevOps made this process easy and made sure our code was always clean and working as expected using CI/CD. 
For the front end, we used the Angular Framework to develop the application, combined with Jasmine and Karma for testing. Authentication was done using AWS Amplify, which is a development platform. This allowed us to quickly set up the authentication and authorization of our app. Sentry.io was used for front end logging and monitoring after deployment. This way, we had full control over our code, from development to deployment and even after deployment.
For the back end, we used Java Spring Boot 2.3.1. Our Database was a noSQL DynamoDb, for user management we used Cognito and finally for our file storage we used and S3 bucket. All of these services were set up in aws. This means we used the AWS Java SDK to manipulate these services in an easy and structured way. For the logging and monitoring side we used an ELK stack to easily visualize and interpret our logs.

### Back end

### Front end

### Result