---
layout: post
authors: [kevin_govaerts, bas_moorkens]
title: 'Ghelamco alert: '
image: /img/2020-08-06-kubernetes-clients-comparison/banner.jpg
tags: [iot, rpi, aws, serverless, api-gateway, s3, lambda, route 53, cloudfront, greengrass, docker]
category: Cloud
comments: true
---

# Table Of Contents

* [Introduction](#introduction)
* [Architecture](#architecture)
  1. [Backend RPI](#backend-rpi)
  2. [Frontend app](#frontend-webapp)
  3. [Serverless](#serverless-as-backend-framework)
* [Learning Experience](#learning-experience)

# Introduction
At Ordina, we have a beautiful office in the Ghelamco arena in Gent.  
The drawback of having an office in this stadium is that whenever KAA Gent plays a game in the stadium we have to make sure our parking lot is empty 3 hours before the game starts.  
If the parking lot isn't cleared in time, we risk fines up to 500 euros per car.  
Of course, we do not want to spend our money on fines when instead we could be buying more pizzas.  
So we came up with the **ghelamco alert** solution to let us know when a game will be taking place.  
That way the people working in the Ghelamco offices can be warned in time.  

On paper, the idea for the project is pretty simple.  
We will run a Raspberry PI device that is hooked up to an alert light.  
The Raspberry PI will scan the website of KAA Gent so that it stays up to date on upcoming home games.  
Whenever a home game occurs, the RPI will start turning on the alert light on a preset schedule.  
This way our employees in the office will have a visual warning a game will be taking place that day.  
Since we want to make our solution as user-friendly as possible, we added a serverless backend in the AWS cloud combined with an angular application to see some basic output from the RPI.  
This allows us to manipulate events on the RPI like: adding events, updating alert times, snoozing alerts, etc...  

<!-- //TODO GIF Proof of working project -->

## Concept
I received my assignment from Fredrick Bousson, who was also my internship supervisor.
It consisted of 3 components to develop: 
1. an Iot module on the RPI  
2. a backend on the AWS cloud using either Java/Spring or Typescript/Node 
3. a frontend with a framework I could choose.

## Mentor
For the duration of my internship I had Bas Moorkens as my mentor. 
Bas designed the architecture of our system.  
We tweaked the design a lot during the internship and below is the final design we went for.  

We used over 10 AWS services, which over the course of the internship, made me develop a real interest in everything that is AWS and cloud related.  
Once you get the hang of serverless, the speed of setting up infrastructure is absolutely mind-blowing!

<!-- //TODO insert diagram of bigger picture -->

# Architecture
For the sake of not overloading you with the nitty gritty details of this project, I will cover only the most interesting or most innovative topics.

## Backend RPI
The Raspberry Pi we used is a model 4 with a Raspbian Linux Distro. This is the most common operating system used for an RPI. 
The RPI works with a microSD card on which you can easily install any Linux-distro from your laptop, just plug it in, and you're good to go!  
After updating the OS and installing a JRE, we were set to test and run our application on this device.  

### Spring Ghela-alert application

#### Basics of our application
The core of our application revolves around **events** which happen at the Ghelamco Arena.  
These can be of type ***GameEvent*** or ***CustomEvent***.  
* The GameEvents are all the KAA Gent home games.
* As an added feature, further down the road, I also added the possibility to create custom events, which are handy for scheduling concerts or alarming a pizza party.

On each event we generate a couple of standard **alerts** based on the **event time**.  
These alerts are responsible to set off the alarm-light in the office.  
This means that we will use the [GPIO](https://www.raspberrypi.org/documentation/usage/gpio/) interface of our RPI to turn on the alarm-light every time an alert gets triggered in our backend application.  
To set off an alert, the GPIO interface changes the voltage on a GPIO-pin to 0V or 3.3V.  
This pin gets coupled to a relay, which acts as a regular switch, but electrically controlled.  
If we put 0V on the relay, the circuit remains open, when we put 3.3V on it, the circuit gets closed and thus starting our alarm-light.  

#### WebScraper
Our spring backend is running a scheduler that is configured to run a service every hour that checks the website of KAA Gent for the up to date fixtures of the games.  
The approach I took for scraping the website, is by using X-Path with a library called [htmlunit](https://https://htmlunit.sourceforge.io/).  
In our application we fetch every game from the website, filter them on home games, attach alerts and save those games to our H2-database using spring data.

Every time we scan the website, we compare the scraped games' data with the games that already were saved in our database.  
Games can get updated or rescheduled on the website, but our application will recognize it and update the database records accordingly.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert Cloudwatch Alarm" src="/img/2020-09-25-ghelamco-alert/scrape-games.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

#### H2 database
One of the requirements for the project was that the RPI should be able to function on his own without constant internet connection.  
This meant that we needed to use a database that can run locally on the RPI.  
If we would use a remote database we wouldn't be able to send any data to the RPI when he it's not connected to a network.  
We chose to use an H2-database because it's an SQL database which is easy to set up for local use.  
Then we configured the H2-database to be backed by a flatfile on our local filesystem, this way the database is persistent even when the application restarts.  
As the last step we just need to add the H2 dependency to our projects pom.xml .  

<div style="text-align: center;">
  <img alt="Ghelamco-alert Cloudwatch Alarm" src="/img/2020-09-25-ghelamco-alert/h2-pom.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

Add some configuration in the application.properties file.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert Cloudwatch Alarm" src="/img/2020-09-25-ghelamco-alert/h2-prop.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

This just works out of the box, it even comes with a console to check your database if enabled.

<div style="text-align: center;">
  <img alt="Ghelamco-alert Cloudwatch Alarm" src="/img/2020-09-25-ghelamco-alert/h2-console.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

#### Metrics

Our application generates metrics to provide us with some data about our backend.  
We collect data and push it into AWS cloudwatch as metrics for:
* Number of events added
* Number of events update
* Number of events cancelled
* Number of alerts snoozed
* Number of alerts started
* Number of alerts stopped
* A basic heartbeat

When our application is running, we are constantly gathering this data which we push to Cloudwatch metrics, every 5 minutes.
Afterwards we reset our data counters, and start collecting again.  
This allows us to create a dashboard which has data-points every 5 minutes for all the metrics we defined.  

##### AWS Cloudwatch

The metric data gets send to AWS Cloudwatch where we can build any dashboard that we want with our data.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert Metrics" src="/img/2020-09-25-ghelamco-alert/all-metric-data-graph.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>


This is especially useful if you want to visualise the data coming from your application.  
We are also able to define cloudwatch alarms based on our custom metrics.  
We have created an alarm that triggers when our **RPI_BACKEND_STATUS** status metric is missing for 3 data points in a row.  
This means that after 15 minutes of not receiving this metric, the cloudwatch alarm will trigger and notifies us via email that the RPI is either down or disconnected from the internet.  
This enables us to respond quickly and take action to restore connectivity to the device.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert Cloudwatch Alarm" src="/img/2020-09-25-ghelamco-alert/ghelamco-rpi-backend-down-alert.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

The logs from our spring app are also available in Cloudwatch, so we can check its status remote.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert Cloudwatch Alarm" src="/img/2020-09-25-ghelamco-alert/cloudwatch-logs.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

#### Connecting our RPI to the cloud

##### AWS IoT

The reason for using AWS IoT is for the sake of "being connected to the cloud".  
When we are connected to the cloud, we are able to communicate with our device "through the cloud", meaning from anywhere we want!   
In our case this means that we want our RPI device to be connected to AWS IoT whenever it is up and running and has internet connectivity.  
Of course the communication between our RPI and the AWS cloud has to be secured.
AWS IoT uses authentication and authorization workflow by using certificates that you issue from AWS IoT and upload to your edge device.  
We treat our RPI as an edge device in this project.

Authentication works based on the certificates that the edge device presents to AWS IoT.  
Once the certificate authentication is successful, AWS IoT checks which policies got attached to those certificates to grant it specific authorizations within the AWS cloud.  

###### Authentication: certificates
When you add a new edge device in AWS IOT it is called "a thing".  
When registering "a thing" it generates 2 keys for us: a public key and a private key.  
AWS IoT will provide a certificate signing request for the public key, which will sign the generated certificate with the root certificate's private key.  

Our thing-certificate and our private key are our credentials when we try to communicate with AWS IoT to access our edge device.  
The only additional input that we need to provide on top of the generated signing request is the root certificate to check the signing.  

* certificate file
* private Key
* Root CA

Since these certificates get generated per thing that you register they should only be used for 1 device.  
When I developed the application I had to register another thing for my laptop.  
Connecting from the RPI and the laptop with the same certificates caused some unwanted behavior like connection interrupts.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert Cloudwatch Alarm" src="/img/2020-09-25-ghelamco-alert/cert-aws-iot.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

###### Authorization: policies
After creating our certificates and keys, we need to handle the authorization part.  
We do this by adding some policies to our certificates.  
When presenting our certificates on connect, AWS IoT now also knows what services we can access within the AWS cloud. 

An example of such a policy: 

<div style="text-align: center;">
  <img alt="Ghelamco-alert Cloudwatch Alarm" src="/img/2020-09-25-ghelamco-alert/aws-policy-iot.PNG" width="auto" height="50%" target="_blank" class="image fit">
</div>

We define which services we want to access like this:
- "iot:Publish"
- "iot:Subscribe
- "iot:GetThingShadow"
- "iot:UpdateThingShadow"
- "iot:DeleteThingShadow" 

This system of generating certificates and coupling policies is a very secure and easy way of working with edge devices.   

###### jobs

A crucial part of AWS IoT is the job section. 
We can create a jobs by using the AWS cli.   
```
aws iot update-job  
  --job-id 010  
  --description "updated description" 
  --timeout-config inProgressTimeoutInMinutes=100
  --job-executions-rollout-config {exponentialRate:{baseRatePerMinute: 50, incrementFactor: 2, rateIncreaseCriteria: <{numberOfNotifiedThings: 1000, numberOfSucceededThings: 1000}, maximumPerMinute: 1000}}
  --abort-config { criteriaList: [ { action: CANCEL, failureType: FAILED, minNumberOfExecutedThings: 100, thresholdPercentage: 20}, { action: CANCEL, failureType: TIMED_OUT, minNumberOfExecutedThings: 200, thresholdPercentage: 50}]}          
  --presigned-url-config {roleArn:arn:aws:iam::123456789012:role/S3DownloadRole, expiresInSec:3600}
```
We use these jobs AWS Iot to create these jobs and send them to our RPI where they get executed by our application code.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert device update" src="/img/2020-09-25-ghelamco-alert/device-update-iot.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

We have the possibility to put multiple "things" in a group of devices.  
This way we can send jobs to the entire group and the job gets executed on every device from that group.  
These jobs could be software updates, reboot commands, rotation of certificates, ...   
Anything we want really!  

In our project we used IoT jobs for a multitude of processes:  
* Update our backend application - over the air
* Create new events
* Snooze and update existing alerts

<div style="text-align: center;">
  <img alt="Ghelamco-alert Cloudwatch Alarm" src="/img/2020-09-25-ghelamco-alert/aws-iot-jobs.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

It is pretty straightforward to create an IoT job:

1. Create a job
2. Add a job document (JSON file) which defines the content of the job 
3. Push the job onto the job queue to send it to your devices

Example of a job document:  
<div style="text-align: center;">
  <img alt="Ghelamco-alert Jobdocument" src="/img/2020-09-25-ghelamco-alert/job-document.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

###### MQTT protocol
AWS IoT can communicate with it registered devices through 2 protocols: HTTP or MQTT.  
So why would we choose MQTT over the more familiar HTTP protocol?  
The HTTP protocol has some severe limitations for our use case: 

* HTTP is a synchronous protocol, the client waits for the server to respond.  
That is a requirement for web browsers, but it comes at the cost of poor scalability.  
In the world of IoT where we have numerous devices and most likely an unreliable / high latency network connection this synchronous communication is problematic.  
An asynchronous messaging protocol is much more suitable for IoT applications.  
The sensors can send in readings and let the network figure out the optimal path and timing for delivery to its destination devices and services.
* HTTP is a one-way protocol. The client must initiate the connection.  
In an IoT application, the devices or sensors are typically clients, which means that they cannot passively receive commands from the network.
* HTTP is a 1-1 protocol. The client makes a request and the server responds.  
It is difficult and expensive to broadcast a message to all devices on the network, which is a common use case in IoT applications.
* HTTP is a heavyweight protocol with many headers and rules. It is not suitable for constrained networks.

MQTT on the other hand defines two types of entities in the network: a message broker (AWS IoT) and a number of edge devices(clients).  
The broker is a server that receives all messages from the clients and then routes those messages to relevant destination clients.  
A client is anything that can interact with the broker to send and receive messages.  
Our client is the RPI but it could also be an IoT sensor in the field or an application in a data center that processes IoT data.  

In our backend java code we have an MQTTJobService which connects to AWS IoT by using the [AWS SDK](https://aws.amazon.com/sdk-for-java/) and subscribes to the relevant topics to receive and respond to AWS Iot jobs.  
Every 30 seconds we will read these topics to see if there are any new jobs to be processed.  

<!-- TODO GIF backend processing a job in intelliJ -->

### AWS IOT Greengrass
AWS greengrass is a service that extends the AWS cloud onto your edge device.  
This was fascinating for us since we had some tough problems to solve:  
* How can we deploy our application on the RPI device?  
* How can we make sure our application recovers from failures?
* How can we keep our system itself up to date?
* How do we find the network address from our device when we are not in the same network?

AWS greengrass offers solutions to all these challenges!  
Greengrass is an extension of the AWS IoT service and since we had already set up our device in AWS IoT it was easy for us to set up greengrass.  
To get started with greengrass we had to do 2 additional steps:
* Define a greengrass group. This group will contain your IoT devices and deployments.  
* Define a greengrass core. The core is the device that you will use to run the additional AWS capabilities on.  

The greengrass group allows us to push deployments to all the devices in our group.  
It also allows you to run lambda functions on your core device or install additional connectors with your own runtime of choice.  
<div style="text-align: center;">
  <img alt="Greengrass group" src="/img/2020-09-25-ghelamco-alert/gg_group.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

When you register your device as a core device in greengrass you immediately get some nice additional benefits from this.  
For example, you can immediately see all the network interfaces on your core device and what ip addresses got allocated.  
This is especially useful if you want to ssh to your device and do not have fixed ip attached to it.  
<div style="text-align: center;">
  <img alt="Greengrass core" src="/img/2020-09-25-ghelamco-alert/ggcore.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>


#### Getting it to work
Now we have greengrass installed, and we configured our RPI as a core in our greengrass group we can start making full use of the capabilities it has.  
We first installed the docker connector plugin for greengrass.  
This plugin allows you to run docker containers on your core device and makes use of **docker** and **docker compose**.  
<div style="text-align: center;">
  <img alt="Greengrass docker connector" src="/img/2020-09-25-ghelamco-alert/gg_connector_docker_cfg.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>
For this to work you have to install docker and docker compose on your core device.  
Since we are using a RPI it was a bit harder to install since the RPI uses the ARM7 chipset instead of x64/x32.  
We had no trouble installing docker itself, but for docker compose we had to clone the source code from github and compile the binaries ourself on the RPI.  
Now that we have all prerequisites installed it was only a matter of packaging our application in a docker container and creating a docker compose file for the deployment.  
We will cover this in the CICD section.  

#### CICD pipeline Backend
To make sure we did not need to bother ourselves with manual builds and installs of our code on the RPI we built a CICD pipeline to automatically deploy our software onto the RPI.  
We trigger the pipeline whenever a push to our master branch in our git repository.  
We used azure devops as our CICD system.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert Azure pipeline backend" src="/img/2020-09-25-ghelamco-alert/azure-backpipe.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

The pipeline goes through a multitude of steps:  
1. We run the pipeline on a Linux agent
2. We use a persistent maven cache to speed up the building process
3. We build our JAR file
4. We use [AWS SSM - parameter store]() to safely store our config files and certificates for the RPI.  
In this step we fetch those config files and secrets from the parameter store and store them locally for use later in the pipeline.   
5. In order to control the alert light hooked up to our RPI we need to download the wiringPi library as we used that to communicate with our alert light.  
6. We can now build our docker container and push it into [AWS ECR - Elastic Container Registry](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html)
7. We fill in the container name and version from the previous step in our template docker-compose.yml file and upload it to our s3 releases bucket.  
8. We use the "greengrass create-deployment" cli command to deploy our docker container to our RPI device.  
This deployment fetches the docker-compose.yml file from our S3 release bucket and then launches the container that we defined in that compose file.  

Some additional explanation on the more complex steps in this process.  

In our application we have defined a **Dockerfile** that is used to build our container in the cicd pipeline.  
```
FROM balenalib/am571x-evm-openjdk:11-jre-bullseye-20200901
ADD ./wiringpi-2.52.deb /tmp/wiringpi-2.52.deb
RUN apt-get update && \ 
    cd /tmp && \ 
    dpkg -i wiringpi-2.52.deb
COPY ./target/ghela-business-0.0.1-SNAPSHOT.jar /app.jar
ADD ./config /config
ADD ./certificates /certificates
ENTRYPOINT ["java","-jar","app.jar"]
```
Because we are running this container on our RPI we need to make sure it can run on the ARM7 processor.  
This is why we started from an ARM7 image that already has jre11 installed on it.  
In the next steps we add the dependencies and configuration files that we downloaded in previous steps in our cicd pipeline.  
We add all the downloaded files onto our image and of course we add our compiled jar as well.  
This pretty is all that is needed for our docker image itself.  

In our **docker-compose.yml** file we describe how the container should behave when it's running:
```
version: '3.3'
services:
  web:
    image: "${ecr.imageTag}"
    privileged: true
    ports:
      - "8080:8080"
    volumes:
      - /home/pi/.aws/:/root/.aws:ro
      - /ghela/db:/ghela/db
volumes:
  db-data:
```
Several things are happening in this file:
* We dynamically inject the image name and version in our cicd pipeline into the  **${ecr.imageTag}** field.  
* We run our container in privileged mode as this is needed to access the RPIs native interface to control our alert light through GPIO with wiringPi.
* We expose our application port 8080 to the outside world.
* We mount our AWS credentials and H2 database as volumes from the RPI host system.

This sums up all the steps we took to set up our backend project onto the RPI device.  
We now have an RPI device that is registered as an edge device and a greengrass core in AWS.  
This now ensures that our device is (semi) managed by AWS as greengrass and docker compose are in charge of orchestrating our deployments onto the device.  
It's not perfect, but it's a hell of a lot better than having nothing.  

## Frontend web application

### Introduction
To get data from our RPI into our web application we needed a way to connect to our H2 database on the RPI.  
It would be pretty complex to set up our RPI device to be accessible from the internet, so we chose to build a backend in AWS to function as a proxy for our RPI backend application.  
This allows us to use this proxy backend in AWS to access the data from our RPI device and send new commands to update existing data on the RPI.  
More about this backend in the serverless part.  
First let's take a look into our frontend application.  

#### AWS DynamoDb
We decided to use AWS DynamoDB as our datastore in the cloud.  
[AWS Dynamo](https://aws.amazon.com/dynamodb/) is a key-value, document and NoSQL database, that delivers single-digit millisecond performance at any scale.  
DynamoDB is a very cost effective and low maintenance way of storing data so it looked perfect for us.  
To get our data from the H2 database on the RPI into dynamoDB, I made a service in our backend application that syncs the local H2 database to our dynamoDB table.  
We added some triggers in our RPI backend application that allows us to sync the current state of the H2 database to the dynamoDB table.  
For example, when we are done with our website scraping process, we trigger a sync to dynamoDB if there are any updates or inserts into our H2 database.  
This ensures that our RPI H2 database acts as the single source of truth.  
The dynamoDB is just a read only copy of the data in the AWS cloud that is kept up to date by our RPI backend application.  
So as long as the backend application is running on the RPI we have access to the latest data in our web application.  

#### Hosting our web application
In order to make our web application accessible to the public, we need some kind of hosting service.  
In our case we used [AWS S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/Welcome.html) to host our website.  
Our S3 bucket is prefaced by a [AWS Cloudfront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html) that acts as our global, scalable CDN.  
CloudFront delivers our content through a worldwide network of data centers called edge locations.  
When a user requests content that we're serving with CloudFront, the user gets routed to the edge location that provides the lowest latency.  
We used [AWS Route 53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html) as our DNS service so that we can access our application on the url  [ghelamco-alert.ordina-jworks.io](https://ghelamco-alert.ordina-jworks.io).  


### Angular as frontend framework
I wanted to create a simple web application to get more insight in the data of our RPI device.  
Any modern frontend framework would be suitable for this but I decided to go with Angular since I had already had some basic experience with it.  

#### AWS Amplify
To help us build our we decided to use the AWS amplify framework to bootstrap our frontend application.  
The open-source Amplify Framework provides:  
- Amplify CLI - Configure AWS services needed to power your backend through a simple command line interface.  
- Amplify Libraries - Use case-centric client libraries to integrate your app code with a backend using declarative interfaces.  
- Amplify UI Components - UI libraries for React, React Native, Angular, Ionic and Vue.  

For our project we only used the libraries and UI components from Amplify for our web application.  
When we use the amplify cli to bootstrap our project it generated a new file in the ./src folder of our project called **aws-exports.js**.  
This file contains configuration of various backend AWS services that we will be using:
* cognito user pool id
* cognito identity pool url
* region
* api gateway url
The backend itself is build and deployed with the **serverless framework**.  
More about this in the section regarding serverless.  

##### AWS Cognito
We used [AWS Cognito](https://aws.amazon.com/cognito/) as authentication and authorization provider.  
This means that new users can sign up to our cognito user pool and login to our web application by authenticating themselves via that user pool.  

There are several really good reasons to use cognito instead of building a home grown identity solution:  
* Secure and scalable user directory.  
It scales dynamically as you would expect from AWS.  
* Fine grained access control through the use of cognito user pools and identity pools.   
You can define users and groups in a cognito user pool which can then be mapped to AWS Iam roles.  
This is a straightforward and very secure way to allow users of the web application a federated access into your AWS account.  
* Easy integration into our frontend application through components that are provided in the amplify UI library.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert login-screen frontend" src="/img/2020-09-25-ghelamco-alert/login-frontend.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

##### User pool and Identity pool
User Pools are user directories used to manage sign-up and sign-in functionality for mobile and web applications.  
Users can register directly in our **user pool** or they can register themselves through web identity federation via a well known 3th party like: facebook, amazon, google.  
Whenever a user logs in to our user pool they receive a **JWT token** that contains information about their identity and authorizations.  
To be able to use the claims in this JWT token we created an AWS **identity pool** as well.  
The identity pool allows users to exchange their valid jwt token for temporary AWS credentials.  
These temporary credentials can then be used by our application to call AWS services in our account. 
For example: call api gateway, update a dynamodb table , fetch a cloudwatch metric.  
This process is called federated access and is very powerfull to expose services from within your AWS account to your end users.  

#### Ghela-alert Webapp
In this part I will explain all the features of our web application starting from the point where we get access to the dashboard.  

##### Dashboard view
On the dashboard view we can see which events are coming up next.  
When we click on an event we also get to see all the alerts which are set for that event.  
We can update or snooze alerts from this screen, BUT...
This works a bit different then how you would probably expect it to work.  
In a normal setting you would expect us to update the records in our dynamoDB table, right?  
Since we want our H2 database on the RPI device to be the single source of truth this is not the case here.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert Dashboard frontend" src="/img/2020-09-25-ghelamco-alert/dashboard-frontend.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

When you update or snooze an alert we actually create an AWS Iot job for our RPI to process.  
The backend application on the RPI knows how to handle these events and updates his H2 database accordingly.  
And then thanks to the sync component we built in the RPI backend those changes get synced to our dynamoDB table.  

##### Create Custom event
On this tab we can create our own custom events.  
This works in the same way as snoozing or updating on alert on the dashboard view.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert create event screen" src="/img/2020-09-25-ghelamco-alert/frontend-create.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

##### Job overview
In the job overview view we query our api gateway to fetch us all the pending jobs from our dynamoDB job table.  
The lambda function that listens to this endpoit reads the ghela-jobs dynamoDB table and list all jobs that have a status of not yet "COMPLETED".  
The moment this list is empty all changes from our webapp have been processed successfully by our RPI backend application and will have updated the ghela-events and ghela-jobs dynamoDB tables.  

Important note: our RPI can only receive new jobs from aws IoT if it is connected to the internet.  
So if we do not have a working network connection jobs will stay queued within AWS iot and not get pushed to the RPI backend application.  
For this reason it is important for us to know that our RPI device is connected and functioning well to make sure that commands from our web application get processed by our RPI backend application.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert jobs screen" src="/img/2020-09-25-ghelamco-alert/frontend-jobs.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

##### Metrics
On this tab we can see the status of the RPI backend as a graph.  
Remember the Metrics we talked about before?  
Via the "/metrics" API endpoint we invoke a lambda function that fetches this dynamic graph and sends it back to our frontend as a base64 encoded stream of byte data.  
We can then render this data as an image in our frontend web application.  
By adding this graph in our web application users of the application can see that the RPI backend device is up and running and functioning well without ever having to access our AWS account itself, pretty cool huh?  

##### Distributed application flow
These update and create actions that we built in our frontend are great examples to demonstrate how our distributed application works from a to z.  
I will walk you through the full cycle for the **snooze alert** action:  

1. We click snooze alert in the frontend web application
2. This calls our [AWS API](https://aws.amazon.com/api-gateway/) endpoint "/alert/snooze".
3. This call is authorized by the userpool JWT token and identitypool temporary AWS credential.  
4. This api gateway endpoint invokes a [AWS Lambda function](https://aws.amazon.com/lambda/) which creates a job and job document in AWS iot for the RPI.
It also inserts a row into a second dynamoDB table (ghela-jobs) to register the job we created on the frontend.  
5. The job get's send to the RPI and processed by our backend application,  thus snoozing the alert in the H2 database.  
6. The RPI synchronizes his H2 database with the event dynamoDB table.  

The same workflow applies for updating an alert or creating a custom game.  
The only difference would be that we would:
* Call a different endpoint on our api gateway: "/event" or "/alert".  
* The job document that we create in our lambda function to send with our job creation request will be different.    


#### CICD pipeline Frontend

Since CICD pipelines were completely new to me when starting this project, Bas created the pipeline for our RPI-backend.  
For the frontend CICD pipeline he wanted me to create it.  
Even though he still helped me, he let me think about how this pipeline would run, what steps we needed and had me create the azure-pipelines.yml.  

Our frontend pipeline looks like this:  

1. Run our pipeline on a linux machine
2. Fetch the needed configuration file from AWS SSM parameter store and save it locally.  
In this case we download an entire aws-exports.js file SSM and inject this in the final build of our application.  
This file contains all the endpoints for wiring our frontend application to our production backend.  
3. Install npm dependencies and trigger a npm build command to build our web application.  
Once the build is done we inject the aws-exports.js file from the previous step into it.  
4. Empty the S3 bucket we are using for hosting
5. Upload the newly compiled web application to this S3 bucket
6. Invalidate the [AWS Cloudfront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html) cache to make sure our application gets updated on each AWS edge location. 
If we don't do this, our old version could be cached for up to 24h!  

<div style="text-align: center;">
  <img alt="Ghelamco-alert frontend pipeline" src="/img/2020-09-25-ghelamco-alert/azure-frontpipe.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

## Serverless framework 
Our frontend application would be pretty useless if no backend existed for it.  
Since it is difficult to access our RPI backend application directly we decided to build a proxy backend in the AWS cloud as explained before.  
We decided to use the serverless framework for its ease of use and speed of development to build this backend.  

What exactly are the requirements for our backend in the AWS cloud? We listed following list of requirements:  
1. [DynamoDB]() tables for our events and jobs.
2. [Cognito UserPool]() and a [Cognito IdentityPool]() to provide authentication and authorisation for our frontend application.  
3. [AWS API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html) to expose REST endpoints from our cloud backend to our frontend web application.  
4. [Lambda functions]() that actually implement our backend code. We used the [AWS Node.js SDK](https://aws.amazon.com/sdk-for-node-js/) to program our lambda functions.  
5. [AWS IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html) roles and permissions to perform operations inside of our Lambdas. (Connect and create jobs on AWS IoT, scan and put to our Dynamo tables, etc...)


### Why the serverless framework?
In the beginning we configured everything by hand in the console.  
This approach has several drawbacks:
* It is very time consuming to click in the AWS console
* It is an error prone and not easily repeatable process to setup 
* It does not adhere to industry best practices as we want our infrastructure to be defined as code. 

Bas then introduced me to the concept of [IaC or Infrastructure as Code](https://en.wikipedia.org/wiki/Infrastructure_as_code) and [the Serverless framework](https://www.serverless.com/).  
There are several options to do IaC on AWS but for our particular project serverless seemed the best fit.  
Our entire cloud backend is configured in our **serverless.yml** file that is versioned on github in our cloud backend project.  
This way we can setup our infrastructure through IaC in a repeatable manner.  

### Serverless.yml
This file is the heart of our serverless setup.  
Everything that is needed to run our serverless stack is described in this file or in includes of this file.  
We used the **yaml** notation as it is less convoluted then JSON but you can also use JSON or typescript to build this.   
We will explain the different parts of our serverless setup to show you in detail how everything works. 

#### Functions and Api Gateway
The essential part of our serverless setup is the functions section.  
A function is an AWS Lambda function.  
It's an independent unit of deployment like a true microservice.  
It is generally a very small piece of code that does one thing and does it well.  
In our project for example we have a lambda function **list-events** which does exactly that, list the events from our dynamoDB table.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert Cloudwatch Alarm" src="/img/2020-09-25-ghelamco-alert/sls-functions.PNG" width="auto" height="auto" target="_blank" class="image fit" />
</div>
Our api gateway is generated based on the configuration of our functions in this section.  
Everything under the **events** property is used as configuration for our api gateway.  
In this example you can see that we define a **path** of event and a **method** GET.  
We also enable **CORS** and tell api gateway to authorize calls made to this endpoint with the **AWS_IAM** authorizer.  

This results in the path **/event** is added to our api gateway which then maps to our lambda function we defined.  
This path is CORS enabled and is secured by the aws_iam authorizer.  
So you can only invoke this function if you have a valid AWS access credential from our cognito identity pool.  
If you do'nt have a valid credential you will receive a 403 denied response from the api gateway.  
<div style="text-align: center;">
  <img alt="API gw" src="/img/2020-09-25-ghelamco-alert/api-gw.PNG" width="auto" height="auto" target="_blank" class="image fit" />
</div>

Our function needs several additional pieces of configuration to be able to do it's job well.  

#### AWS IAM Roles
To allow our lambda function to have fine grained access to our AWS services we defined IAM roles in our serverless project that are attached to our lambda functions.  
The IAM roles are defined in a seperate file **lambda-iam-roles.yml** which get's included into our serverless.yml file.  
We can then freely use any roles we wish.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert Cloudwatch Alarm" src="/img/2020-09-25-ghelamco-alert/sls-iamroles.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

#### AWS DynamoDB tables
Since our lambda function accesses a dynamoDB table we pass the table name to the function as an environment variable.  
This allows us to have seperate tables for different environment like development, integration, production.  
Our 2 dynamoDB tables get created by the serverless framework as well.  
They are describe in a seperate file **dynamodb-tables.yml** and get's included in the serverless.yml file.  
Our dynamoDB tables are created by a naming policy which allows us to easily re use that naming scheme in our environemnt variables for the lambda functions.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert Cloudwatch Alarm" src="/img/2020-09-25-ghelamco-alert/sls-dynamo.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

#### AWS Lambda functions with AWS NodeJS SDK
The handler is the entry point in our lambda function.  
This is defined in our serverless stack which handler should be invoked by the api gateway.  
Following example illustrates how our lambda reads data from our dynamoDB table (using the envionment variable from our config) and returns the result to our api gateway.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert Cloudwatch Alarm" src="/img/2020-09-25-ghelamco-alert/sls-lambda.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

#### AWS API Gateway extra configuration
We needed to add some additional configuration for our api gateway that was not possible to include in the functions part of our serverless template.  
To make sure that our application does not get CORS errors when it receives a 4XX or 5XX response from the api gateway we had setup CORS for these error responses.  
As you can see below we added response headers to allow all origins and headers.  
<div style="text-align: center;">
  <img alt="Ghelamco-alert Cloudwatch Alarm" src="/img/2020-09-25-ghelamco-alert/sls-api.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

### CICD pipeline Serverless

<!-- //TODO write -->

## Learning experience

At the start of my project I created a way to update our RPI spring application by writing some custom code, which involves running a whole load of Linux commands to:  
- create new folders on the RPI
- downloading the new file from [AWS S3](https://aws.amazon.com/s3/)  
- running some commands and scripts to enable a new daemon (service) process on the RPI
- deleting the old version... 

It worked, but it looked... meh! :)  

Later Bas found out about [AWS IoT GreenGrass](https://docs.aws.amazon.com/greengrass/latest/developerguide/what-is-gg.html) that would be able to do this for us, without the dodgy custom code.   

This internship gave me such a big cover of all best practices and new technologies, that this was a real eye-opening and educational experience.  
- I've had the chance to develop an application in Spring, with different databases.
- learned how to properly test my code with unit and integration tests
- learned how to use the Java and Node AWS SDKs
- API's, connecting it all together...
- came in touch with a lot of linux, sharpening my commandline skills
- developed an Angular app from start to finish
- learned a lot about AWS: IAM, IoT Core, DynamoDB, API Gateway, SNS, SSM, EKS, S3, Cloudwatch, Cloudfront, lambdas, Route53, ...
- CICD pipelines and their best practices in the industry

I'm very thankful for being able to do this and having the chance to work with Bas on a real project.  

He always motivated me to go the extra mile !  
He could destroy a day of hard work in a few sentences... :)  

<div style="text-align: center;">
  <img alt="Ghelamco-alert Cloudwatch Alarm" src="/img/2020-09-25-ghelamco-alert/bas-smile.png" width="auto" height="auto" target="_blank" class="image fit">
</div>

But afterwards, he would always take the time to explain why, and how I should do it to make my solution comply with the industries best practices.  
Being able to have someone who makes you self-reflect on the work you did, and takes his time to give you proper feedback, is the biggest asset to provide to a junior programmer.  

Also, a big thanks to Frederick Bousson & Ordina for the opportunity and resources provided.  
This really was a great project and I enjoyed every minute of it!  

