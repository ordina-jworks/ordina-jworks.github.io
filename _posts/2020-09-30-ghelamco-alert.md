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
We also created a web application that controls our RPI so we can snooze alerts, create custom alerts, save custom events, ...

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
Every time we scan the website, we compare the scraped data with the data we already had. Games can get updated on the website, and our app will recognize it and update his records in the database.

#### H2 database
Since one of the prerequisites is that the RPI should be able to function on his own, we need to use a database which is located locally, on te RPI. If we would use a remote database then we can't get any info when the RPI isn't connected to a network and thus not alarming our people.
We chose to use H2-database because its an SQL database which is easy to set up for local use.
Simply add H2-dependency to your project
//FOTO pom.xml
And set the required parameters in your properties file
//FOTO Application.properties

#### Metrics

Our application generates metrics so we have some data about whats going on inside our backend. This data is about snoozing-alerts, updating alerts, creating events and also a heartbeat which indicates that our RPI is still online and able to send beat.
We gather this data for 5 minutes in our RPI and then we send this to AWS Cloudwatch, afterwhich we reset our data, and start collecting again.




##### AWS Cloudwatch
This metric data gets send to AWS Cloudwatch where can set up any dashboard we want with our data.

<div style="text-align: center;">
  <img alt="Ghelamco-alert Metrics" src="/img/2020-09-25-ghelamco-alert/all-metric-data-graph.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>


This is specificaly handy if you want to visualise the data coming from you app but also if you want to be notified whenever the RPI has not sent a heartbeat for 3 times. Whenever this happens AWS Cloudwatch generates an alarm state and send us an email about the RPI not being able to connect to the internet anymore.


<div style="text-align: center;">
  <img alt="Ghelamco-alert Cloudwatch Alarm" src="/img/2020-09-25-ghelamco-alert/ghelamco-rpi-backend-down-alert.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>


#### Connecting our RPI to the cloud

##### AWS IoT

<div style="text-align: center;">
  <img alt="Ghelamco-alert Cloudwatch Alarm" src="/img/2020-09-25-ghelamco-alert/device-to-awsiot.png" width="auto" height="auto" target="_blank" class="image fit">
</div>

The reason why we use AWS IoT is for the sake of "being connected to the cloud". When we are connected to the cloud, we are able to communicate with our device "through the cloud", meaning from anywhere we want! That is.. if we have the right certificates on our local machine. Authentication works based on the certificates that the connecting device presents to AWS IoT, afterwards AWS Iot checks which policies are attached to those certificates to grant it specific authorisations

###### Authentication: certificates
When registering "a thing" on AWS IoT, it generates some important certificates for us. These are our credentials when we try to communicate with AWS IoT to access our "thing".
When we try to make calls to our device via the SDK we need to present these certificates when we create the connection. 

* certificate file
* private Key
* Root CA

To make development on our laptop and testing our JAR on the RPI not impossible, we had to generate certificates for each device that wanted to communicate with our RPI. Using the same certificate on multiple devices is causing unwanted behaviour, like connection interupputions, which is strongly not recommended.

//FOTO certificates

###### Authorization: policies
After creating our certificates, we need to handle the autorization part, which we do by adding some policies to our certificate. This will indicate to AWS IoT who is connected, when presenting our certificates on connect and now AWS IoT also knows what services we can access within the cloud. 
An example of such a policy: 

// FOTO policy

We define which services we want to access to, like "iot:Publish", "iot:Subscribe", "iot:GetThingShadow", "iot:UpdateThingShadow", "iot:DeleteThingShadow" and then we can use these from our device.

This system of generating certificates and coupling policies is a very secure and easy way of working with these devices "on the edge". 

###### jobs
AWS IoT jobs are used to define a set of remote operations that are sent to and executed by our RPI. But this doesn't have to be "only our RPI". When working with AWS Iot we have the possibility to put multiple "things" in one group of devices, and we can send jobs to these groups, so they all execute the same jobs. These can be software updates, reboot commands, rotate certificates,... Anything you want really! 

In our case we use jobs for a multitude of processes:
- updating our backend app - over the air
- Creating new Events
- Snoozing and updating alerts

The basics to create a job are not so difficult:
1. create a job
2. add a job-document (JSON-file) which describes what the job is about 
3. push job onto queue to get processed

At the start of my project I created a way to update our spring application by writing some custom code which involves running a whole load of Linux commands to: create new folders on the RPI, downloading the new file from [AWS S3](https://aws.amazon.com/s3/) (which is an object storage service), running some commands and scripts to enable a new daemon (service) process on the RPI and then deleting the old version... It worked, but it looked.. meh! :)
Later Bas found out about [AWS IoT GreenGrass](https://docs.aws.amazon.com/greengrass/latest/developerguide/what-is-gg.html) that would be able to do this for use, without the dodgy custom code.

###### MQTT protocol
When working with AWS IoT we have basically 2 choices: work wit HTTP requests or use MQTT.
So why would we choose MQTT over the more familiar HTTP web services? Because this request and response pattern does have some severe limitations:

* HTTP is a synchronous protocol. The client waits for the server to respond. That is a requirement for web browsers, but it comes at the cost of poor scalability. In the world of IoT, the large number of devices and most likely an unreliable / high latency network have made synchronous communication problematic. An asynchronous messaging protocol is much more suitable for IoT applications. The sensors can send in readings, and let the network figure out the optimal path and timing for delivery to its destination devices and services.
* HTTP is one-way. The client must initiate the connection. In an IoT application, the devices or sensors are typically clients, which means that they cannot passively receive commands from the network.
* HTTP is a 1-1 protocol. The client makes a request, and the server responds. It is difficult and expensive to broadcast a message to all devices on the network, which is a common use case in IoT applications.
* HTTP is a heavy weight protocol with many headers and rules. It is not suitable for constrained networks.

MQTT on the otherhand defines two types of entities in the network: a message broker (AWS IoT) and a number of clients (our edge devices). The broker is a server that receives all messages from the clients and then routes those messages to relevant destination clients. A client is anything that can interact with the broker to send and receive messages. A client is in our case the RPI but it could also be an IoT sensor in the field or an application in a data center that processes IoT data.

1. The client connects to the broker. It can subscribe to any message “topic” in the broker.
2. The client publishes messages under a topic by sending the message and topic to the broker.
3. The broker then forwards the message to all clients that subscribe to that topic.

Inside of our backend code in java, we have an MQTTJobService which makes connection to AWS Iot by using the [AWS SDK](https://aws.amazon.com/sdk-for-java/) and it will subscribe to the relevant jobs-topics. Every 30 seconds we will read these topics to see if there are any new jobs to be processed.

//GIF backend processing a job in intelliJ

### AWS IOT Greengrass
//TODO

#### Getting it to work
//TODO

#### Dockerized app 
//TODO

#### CICD pipeline Backend
To make our project completly professional, we made a CICD pipeline to automatically deploy our software onto the RPI, whenever we commit to the master branch on GIT.
Since we used Azure-devops for our devops practices, we build the pipeline here. 

//FOTO azure devops

The pipeline goes through a multitude of steps:
1. We run the pipeline on a Linux agent
2. We use Maven cache to speed up the building process
3. We build our JAR file
4. We are using [AWS SSM - parameter store]() to safely store our config-file and certificates for the RPI. In this step we run some custom scripts to create the folders where these get installed, and to fetch them from the parameter store. 
5. To have access to our GPIO pins from inside our docker container, we need install wiringPi inside our docker image, and run it as a priveleged container.
6. We create the docker image and push it into [AWS ECR - Elastic Container Registry](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html)
7. Whilst creating this docker image we also create the docker-compose.yml file which we will upload to our AWS S3 bucket, named: **"ghelamco-rpi-releases"**.
8. as the last step we use the "greengrass create-deployment" cli command to alert our RPI of the new job to execute, which is downloading the docker-image, docker-compose.yml file and spin up our container!
9. In our docker-compose.yml we define how this container should be ran on the device. We run it privileged to access our RPI-GPIO pins via wiringPi, we mount our H2 database and our AWS Credentials, which are located on the filesystem of the RPI. 

This whole pipeline makes sure that whenever we commit to the master branch, that tests are being run, a JAR file gets build, config files get securely fetched, libraries get added, a docker image is being build, we notify the RPI of the new job and execute it.

Executing the job means, killing the old docker image and running the new one, which is our complete cycle.

## Frontend Webapp

### Introduction
To get some data about our Events on our webapp, we needed a way to connect to our H2 database on the RPI. Since we didn't want to expose any REST endpoints on our spring app we had to find another way to get the data.

#### AWS DynamoDb
To get an exact copy of our H2 database, we made a syncing tool on our RPI-backend which updates a remote DynamoDb.
[AWS Dynamo](https://aws.amazon.com/dynamodb/) is a key-value, document and NoSQL database, that delivers single-digit millisecond performance at any scale.
When our RPI scrapes the website of KAA Gent, it looks at all the game events, checks if any data has changed and updates the dynamo table with the most recent info from the website. This ensures that our RPI H2 database acts as the single source of thruth and the dynamo table as an exact copy, as long as the RPI remains connected to the internet.

#### Hosting our webapp
If we make a webapp, then we need some kind of hosting service. In our case we used [AWS S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/Welcome.html) again for our storage, for a domain name and DNS routing we used [AWS Route 53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html) to access our app from: [ghelamco-alert.ordina-jworks.io](https://ghelamco-alert.ordina-jworks.io). Meanwhile we also used [AWS Cloudfront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html) to speed up our content delivery to anywhere in the world. CloudFront delivers our content through a worldwide network of data centers called edge locations. When a user requests content that we're serving with CloudFront, the user is routed to the edge location that provides the lowest latency.

### Angular as frontend framework
Any framework would've worked to accomplish what we were trying to do, which is a simple webapp to communicate with our RPI. I opted for Angular, since I had already played around with it before.


#### AWS Amplify
The open-source Amplify Framework provides:
- Amplify CLI - Configure all the services needed to power your backend through a simple command line interface.
- Amplify Libraries - Use case-centric client libraries to integrate your app code with a backend using declarative interfaces.
- Amplify UI Components - UI libraries for React, React Native, Angular, Ionic and Vue.

For our project we only used the libraries and UI components from Amplify for our Webapp. The backend we needed is powered by the Serverless framework, on which we'll elaborate a bit further down the blogpost.

##### AWS Cognito
For the actual signing-in, signing-up and Access control we used [AWS Cognito](https://aws.amazon.com/cognito/), which provides us a complete service for Authentication & Authorization. 

A few of the benefits of using this AWS service :
- Secure and scalable user directory, it can easily scale up to hundreds of millions of users
- Amazon Cognito provides us solutions to control access to backend resources from our app. You can define roles and map users to different roles so your app can access only the resources that are authorized for each user.
- Easy integration with our app

//FOTO: Loginscreen webapp

###### User-pool and Identity-pool
//TODO

##### aws-exports.js

#### Ghela-alert Webapp
Here I'll go over all the features of our Webapp once we get access to the Dashboard.
***We also talk about AWS API and lambda functions in this part, but we'll explain them more thoroughly in the last section about our "serverless backend".***


##### Dashboard view
On the dashboard view we can see which events are coming up next, when we click on them we also get to see all the alerts which are set.
From here we can update alert times or we can snooze them. BUT! The way you would expect this to work is probably by manipulating our DynamoDB table, and then let our RPI sync the changes to update the H2 database, but this is not the case. 

//FOTO dashboard-view-webapp

When clicking on snooze or save, we create a job for our RPI. Just like deploying a new Docker image onto the RPI, we use IoT Jobs to make our RPI execute custom tasks.


##### Create Custom event
On this tab we can create our own custom events. The way this works is identical as snoozing and updating an alert on the dashboard view. We also create a job which gets executed, as described in the next section.

//FOTO custom-event-webapp

##### Executing jobs on the RPI 

An example of how such a cycle works for snoozing an alert :

1. We click snooze
2. We call our [AWS API](https://aws.amazon.com/api-gateway/) which has an endpoint "/alert/snooze".
3. This endpoint invokes a [AWS Lambda function](https://aws.amazon.com/lambda/), which creates a job for the RPI and also inserts a row into another dynamo table (ghela-jobs), to register the jobs we create on the frontend.
4. The RPI executes the job, meaning snoozing the alert
5. The RPI synchronizes his H2 database with the Event dynamo table (ghela-events)

For updating an alert or creating a custom game, the above would be the same exept: 
- we call another endpoint. ex. "/event" or "/alert" 
- the jobdocument that we create in our lambda function to send with our Job-creation request, will differ.

//FOTO different jobdocuments

##### Job overview
In this view the API will send a GET request to our AWS API on the endpoint "/job". The lambda function which is coupled here, will read the ghela-jobs dynamo table, and will list all jobs, of whom the status is not yet "COMPLETED". The moment this list is empty all changes from our webapp have been processed succesfully by our RPI-backend and will have updated the ghela-events and ghela-jobs dynamo tables.

Important note: When our RPI is not connected to the internet, these jobs will not get completed, thus not saving changes made remotely. We can change the amount of retries AWS IoT will fire as well as job-time-outs inside our lambda functions.

//FOTO Jobs

##### Metrics
On this tab we can see the status of the RPI backend as a graph. Remember the Metrics we talked about above? Via this API endpoint we invoke a lambda function which fetches this dynamic graph and sends it back to our frontend to be displayed.
On this graph we can easily see if the RPI is still connected to the internet.

//Foto metrics

#### CICD pipeline Frontend

Since CICD pipelines were completly new to me when starting this project, Bas created the pipeline for our RPI-backend. For the frontend CICD pipeline he wanted me to create it. He still helped me, though, he let me think about how this pipeline would run, what steps were needed and let me create the azure-pipelines.yml .
The process goes like this: 
1. We build our pipeline on a linux machine
2. Fetch our aws-exports.js from our parameterStore on [AWS SSM](), and replace it in our angular project. 
3. Then we have some steps to build our project. Installing dependencies & building our app for production.
4. We empty our S3 bucket where our Webapp gets saved
5. Upload the newly compiled webapp to this S3 bucket
6. As a last step we invalidate [AWS Cloudfront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html) cache, to make sure our website gets updated everywhere in the world, asap.

### Serverless as backend framework

#### Why do we even use serverless?

#### CICD pipeline Serverless



