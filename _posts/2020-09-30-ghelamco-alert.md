---
layout: post
authors: [kevin_govaerts, bas_moorkens]
title: 'Ghelamco alert: '
image: /img/2020-08-06-kubernetes-clients-comparison/banner.jpg
tags: [iot, rpi, aws, serverless, api-gateway, s3, lambda, greengrass, docker]
category: Cloud
comments: true
---

# Table Of Contents

* [Introduction](#introduction)
* [Architecture](#architecture)
* [Security](#security)
* [Developer experience](#developer-experience)
* [Conclusion](#conclusion)


# Introduction
At Ordina, we have a beautiful office in the Ghelamco arena in Gent.  
The drawback of having an office in this stadium is, that on match days we need to clear the parking spaces 3 hours before a match.
  
If the parking lot isn't cleared in time, we risk fines up to 500 euros per car.  
Of course we do not want to spend our money on fines when instead we could be buying more pizzas.  
So we came up with the **ghelamco alert** solution to let us know when a game will be taking place so that the people working in the Ghelamco offices can be warned in time.

The premise is pretty simple: we will run a Raspberry Pi device inside the office that is connected to an alarm.  
On matchdays the RPI will turn on the light a couple hours before the game to warn our employees that they have to leave the parking on time.  
We also created a web application that controls our RPI so we can snooze alerts, create custom alerts, sadd custom events, ...

## Concept
The assignment was to develop 3 things: an Iot module on the RPI, a backend in either java/spring or Typescript/node and a Frontend with either framework I liked.
For the duration of my internship I had Bas Moorkens as my mentor who came up with architecture of our service, as shown below. 

//TODO insert diagram of bigger picture

# Architecture
For the sake not overloading you with the nitty gritty details of this whole project, we will cover only the most interesting or most innovative topics.

## Backend RPI
The Rasberry Pi we used is a model 4 with a Raspbian Linux Distro. This is the most common used OS for a RPI. The RPI works with a microSD card on which you can easily install any Linuxdistro from you laptop, just plug it in and you're good to go!
After updating the OS and installing a JRE, we were set to test and run our applications on this device.

### Spring Ghela-alert application
#### Basics of our application
The whole essence of the app revolves around **Events** which happen at the Ghelamco arena. These can be type ***GameEvent*** or a ***CustomEvent***.
The GameEvents are all of the home games of KAA Gent and as an added feature furter down the road, I also added the possibility to create our own custom events which could be a concert for instance.

On each Event we generate a a couple of standard **Alerts**, based on the **Event** time, which are responsible to set off the Alarm in the office, which also indicate that this will control the [GPIO](https://www.raspberrypi.org/documentation/usage/gpio/) interface of our RPI. To set off an alert the GPIO interface changes the voltage on a GPIO-pin to 0V or 3.3V, which is coupled to a relay. A Relay is like a regular switch, but electricaly controlled, if there is 0V the circuit remains open, when it changes to 3.3V the circuit is closed and thus starting our Alarm-light.

#### WebScraper
We have a scheduled service in our spring-app, which is triggerd every hour and checks the website of KAA Gent for the up to date fixtures of the game. An easy approach to scraping a website is using X-Path with a library like [htmlunit](https://https://htmlunit.sourceforge.io/). In our application I fetch every game from the website, filter them on home games, attach Alerts to it and save it via with Spring data into our H2-database.
Every time we scan the website, we compare the scraped data with the data we already had. Games can get updated on the website, and our app will recognize it and update his records in the db.

#### H2 database
Since one of the prerequisites is that the RPI should be able to function on his own, we need to use a database which is located locally, on te RPI. I we would use a remote database then we can't get any info when the RPI, isn't connected to a network and thus not alarming our people.
We chose to use H2-database because its an SQL database which is easy to set up for local use.
Simply add H2-dependency to your project
//FOTO pom.xml
And set some parameters in your properties file
//FOTO Application.properties

#### Metrics

Our application generates metrics so we have some data about whats going on inside our backend. This data is about snoozing-alerts, updating alerts, creating events and also a heartbeat which indicates that our RPI is still online and able to send beat.
We gather this data for 5 minutes in our RPI and then we send this to AWS Cloudwatch, afterwhich we reset our data, and start collecting again.




##### AWS Cloudwatch
This metric data gets send to AWS Cloudwatch where can set up any dashboard we want with our data.

<div style="text-align: center;">
  <img alt="Ghelamco-alert Metrics" src="/img/2020-09-25-ghelamco-alert/all-metric-data-graph.PNG" width="auto" height="40%" target="_blank" class="image fit">
</div>


This is specificaly handy if you want to visualise the data coming from you app but also if you want to be notified whenever the RPI has not sent a heartbeat for 3 times. Whenever this happens AWS Cloudwatch generates an alarm state and send us an email about the RPI not being able to connect to the internet anymore.

<div style="text-align: center;">
  <img alt="Ghelamco-alert Cloudwatch Alarm" src="/img/2020-09-25-ghelamco-alert/ghelamco-rpi-backend-down-alert.PNG" width="auto" height="40%" target="_blank" class="image fit">
</div>


#### Connecting our RPI to the cloud
##### AWS IoT
The reason why we use AWS IoT is for the sake of "being connected to the cloud". When we are connected to the cloud, we are able to communicate with our device "through the cloud", meaning from anywhere we want! That is.. if we have the right certificates on our local machine.

###### certificates
When registering "a thing" on AWS IoT, it generates some certificates for us. These are our credentials when we try to communicate with AWS IoT to access our "thing".
When we try to make calls to our device via the SDK we need to present these certificates when we create the connection. To make developing on our laptop and testing our JAR on the RPI not impossible, we had to generate certificates for each device that wanted to communicate with our RPI. Using the same certificate on multiple devices is strongly not recommended.

###### MQTT protocol over HTTP

### Dockerized app 

### AWS IOT Greengrass

## Frontend Webapp

## Serverless



