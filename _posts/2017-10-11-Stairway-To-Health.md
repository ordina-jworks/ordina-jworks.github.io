---
layout: post
authors: [Michael Vervloet, Ines Van Stappen, Kevin van den Abeele]
title: 'Stairway to Health with IoT ft. MEAN(TS)'
image: /img/stairway-to-health/stairway-to-health.jpg
tags: [NodeJS, MongoDB, Angular,Angular4, ExpressJS, Express, TypeScript, Angular-CLI, Gulp, Internet of Things, IoT, LoRa, Proximus]
category: IoT
comments: true
---

> Healthier at the office with the 'Internet of Things'.

## What is Stairway to Health
In an effort to improve worker health in a fun and engaging way, Proximus wanted to encourage their employees to choose for the stairs instead of using the elevator. 
This is when they came with the idea of a little game between the three towers. 
On different dashboards across proximus and online employees could see which tower had the most employees that are taking the stairs. 

<p style="text-align: center;">
  <img class="image fit" style="max-width: 600px; margin:0px auto;" alt="Dashboard" src="/img/stairway-to-health/dashboard1.jpg">
</p>

They can also see a more detailed look of how many people taking the stairs in which tower of each week, day and even each hour.

<p style="text-align: center;">
  <img class="image fit" style="max-width: 600px; margin:0px auto;" alt="Graph" src="/img/stairway-to-health/graph1.jpg">
</p>

## What does it do?
The stairway to health project is what the internet of things is all about:
 - LoRa sensors detect door openings, these are installed on the doors of the staircases 
 - These sensors communicate via the Proximus LoRa network to report their status
 - Sensor data is sent to the Proximus MyThings platform which processes the data
 - The data gets sent to the StairwayToHealth application
 - The StairwayToHealth application interprets and visualizes the data
 
 In summary: 
 We install sensors on the doors (things) to measure usage and we analyse the data to persuade people to move more. 
 The result is a good example of how IoT can influence our daily lives. 
 Proximus  was able to provide us with all the building blocks available to offer a complete end-to-end solution!

## Why we chose the MEAN(TS) stack
**Typescript**: 
Typings, you just can't (shouldn't) do without when creating a backend application. 
Definitely adding some more 'good parts' to the javascript story.

**JavaScript across the stack**: 
Giving us  a great ease of development, work with the json objects you create on the backend in the frontend and vice versa. 
It also breaks the boundaries between frontend and backend developers. Even if they are not familiar with the other frameworks, it's easy to take a look and get an idea what's going on.

**MongoDB**: 
Again, awesome to work with when dealing with JavaScript Objects. 
Good driver support with mongoose for NodeJs. Document based structure, which makes it really flexible when it comes to structure and extremely scalable. 
We also took advantage of the very performant aggregation capabilities for dealing with large amounts of data.

**ExpressJS**: 
Not reinventing the wheel, Express is a great Node server framework that makes it really easy to get started creating routes, middleware and Express itself has a lot of great add-on packages in the npm registry.

**npm**:  
Take advantage of the great support that comes from the npm community.  
Like I've said before, no need to reinvent the wheel. 
Thousands of developers have contributed their work for us to use in our own projects.

**NodeJS**: 
Write event driven applications with asynchronous I/O powered by the ultra fast Google V8 Engine, really easy to set up sockets with socket.io.

**Angular**: 
A TypeScript-based open-source front-end web application platform led by the Angular Team at Google and by a community of individuals and corporations to address all of the parts of the developer's workflow while building complex web applications. 

**Angular-CLI**: 
Command line tool for creating Angular applications with the latest Angular version and creating components, services, interfaces, ... within the application.

**Highcharts**: 
Interactive JavaScript library for creating dynamic charts. 
Highcharts is based on native browser technologies and no extra plugins needed to make it work. 
Also backwards compatible for IE.


 

