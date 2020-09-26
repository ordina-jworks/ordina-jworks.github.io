---
layout: post
authors: [kevin_govaerts, bas_moorkens]
title: 'Ghelamco Alert: '
image: /img/2020-09-25-ghelamco-alert/rpi-front.jpg
tags: [IoT, RPi, AWS, Serverless, API Gateway, S3, Lambda, Route 53, CloudFront, Greengrass, Docker]
category: Cloud
comments: true
---

# Table of contents
{:.no_toc}

- TOC
{:toc}

----

# Introduction
At Ordina, we have a beautiful office in the Ghelamco arena in Gent.  
<div style="text-align: center;">
  <img alt="Ghelamco office" src="/img/2020-09-25-ghelamco-alert/ghelamco_arena_office.jpg" width="auto" height="auto" target="_blank" class="image fit">
</div>
The drawback of having an office in this stadium is that whenever KAA Gent plays a game in the stadium we have to make sure our parking lot is empty 3 hours before the start of the game.  
If the parking lot isn't cleared in time we risk fines up to €500,00 per car.  
Of course we don't want to spend our money on fines when instead we could be buying more pizzas.  
So we came up with a solution called **Ghelamco Alert**.  
The idea for the project is pretty straightforward.  
We will run [a Raspberry Pi](https://www.raspberrypi.org){:target="_blank" rel="noopener noreferrer"} device that is hooked up to an alert light.  
The Raspberry Pi will run an application that parses the game fixtures on the website of KAA Gent to search for any home fixtures.  
Whenever a home fixture occurs, the RPi will start turning on the alert light on a preset schedule.  
This way the employees in the office will have a visual warning on game day and they will be reminded to leave the parking lot on time.  
Since we wanted to build a user-friendly solution we added a serverless backend in the AWS cloud combined with an Angular application so that our users can also look at the web application to get some additional feedback and even manipulate the alerting schedule.  
This enables users to do some additional operations through the web application:
* Snooze alerts
* Create additional alerts
* Create custom events


# Practicalities
I received my assignment from my internship supervisor Frederick Bousson.  
Bas Moorkens was my mentor for the internship.  
He designed the high-level architecture of the solution and then helped translate it into smaller blocks of work for me.  
We decided to set up the project using these three big components:

1. An IoT module on the RPi.
2. A serverless backend that runs in the AWS cloud using Node.js.
3. A frontend application built with the Angular framework.

The architecture was tweaked several times to account for lessons learned during the internship.  
We ended up using over 10 AWS services which over the course of the internship, made me develop a real interest in everything that is AWS and cloud related.  
Once you get the hang of serverless, the speed of setting up infrastructure is absolutely mind-blowing!

# Solution design
Below you can see the high-level design of our solution.  
<div style="text-align: center;">
  <img alt="Ghelamco Alert architecture" src="/img/2020-09-25-ghelamco-alert/ghela-alert-architecture.png" width="auto" height="auto" target="_blank" class="image fit">
</div>
As you can see the architecture has lots of moving parts.
We will zoom in on these in the next sections.  

## Backend RPi
The core part of our solution consists of the Raspberry Pi device with our backend Spring Boot application that runs on it.  
This application controls the actual alert light and does most of the heavy lifting in the overall scheme.  
The RPi works with a microSD card on which you can easily install any Linux distribution.  
You install the distribution of your choosing on SD card and then plug the card into your RPi device and you're good to go.  
We used a [model 4 Raspberry Pi](https://www.raspberrypi.org/products/raspberry-pi-4-model-b/){:target="_blank" rel="noopener noreferrer"} and installed the default Raspbian Linux distribution on it.  

### Spring Boot application
The actual business logic of our solution runs as a Spring Boot project on our RPi device.  

#### Basics of the application
{:.no_toc}

The core of our application revolves around **events** which happen at the Ghelamco Arena.  
These can be of type ***GameEvent*** or ***CustomEvent***.  
* The GameEvents are all the KAA Gent home games.
* As an added feature, I also added the possibility to create custom events, which are handy for scheduling concerts or alarming a pizza party.

For each event we generate a couple of standard **alerts** based on the **event time**.  
These alerts are responsible to set off the alarm light in the office.  
This means that we will use the [GPIO](https://www.raspberrypi.org/documentation/usage/gpio/){:target="_blank" rel="noopener noreferrer"} interface of our RPi to turn on the alarm light every time an alert gets triggered in our backend application.  
To set off an alert, the GPIO interface changes the voltage on a GPIO-pin to 0V or 3.3V.  
This pin gets coupled to a relay, which acts as a regular switch, but electrically controlled.  
If we put 0V on the relay, the circuit remains open, when we put 3.3V on it, the circuit gets closed and thus starting our alarm light.  

#### WebScraper
{:.no_toc}

Our Spring backend is running a scheduler that is configured to run a service every hour that checks the website of KAA Gent for the up-to-date fixtures of the games.  
The approach I took for scraping the website is by using X-Path with a library called [HtmlUnit](https://htmlunit.sourceforge.io/){:target="_blank" rel="noopener noreferrer"}.  
In our application we fetch every game from the website, filter them on home games, attach alerts and save those games to our H2-database using Spring Data.

Every time we scan the website, we compare the scraped games' data with the games that already were saved in our database.  
Games can get updated or rescheduled on the website, but our application will recognize it and update the database records accordingly.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert CloudWatch Alarm" src="/img/2020-09-25-ghelamco-alert/scrape-games.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

#### H2 database
{:.no_toc}

One of the requirements for the project was that the RPi should be able to function on his own without constant internet connection.  
This meant that we needed to use a database that can run locally on the RPi.  
If we would use a remote database we wouldn't be able to send any data to the RPi when it is not connected to a network.  
We chose to use a H2-database because it is a SQL database which is easy to set up for local use.  
Then we configured the H2-database to be backed by a flatfile on our local filesystem.
This way the database is persistent even when the application restarts.  
As the last step we just need to add the H2 dependency to our projects pom.xml .  
```
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

Add some configuration in the `application.properties` file.  
```
### H2 Storage
spring.datasource.url=jdbc:h2:file:c:\\h2-ghela\\h2db
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=kevin
spring.datasource.password=admin
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.h2.console.enabled=true
spring.h2.console.settings.web-allow-others=false
```

This just works out of the box, it even comes with a console to check your database if enabled.

<div style="text-align: center;">
  <img alt="Ghelamco-alert CloudWatch Alarm" src="/img/2020-09-25-ghelamco-alert/h2-console.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

#### Metrics
{:.no_toc}

Our application generates metrics to provide us with some data about our backend.  
We collect data and push it into [AWS CloudWatch](https://aws.amazon.com/cloudwatch){:target="_blank" rel="noopener noreferrer"} as metrics for:
* Number of events added
* Number of events updated
* Number of events cancelled
* Number of alerts snoozed
* Number of alerts started
* Number of alerts stopped
* A basic heartbeat

When our application is running, we are constantly gathering this data which we push to Cloudwatch metrics every 5 minutes.
Afterwards we reset our data counters and start collecting again.  
This allows us to create a dashboard which has data-points every 5 minutes for all the metrics we defined.  

### Connecting our RPi to the cloud
We have two ways of connecting back to the AWS cloud.  
* Use AWS credentials and the AWS APIs.  
* Use AWS IoT MQTT protocol and the according certificates.

#### AWS Cloudwatch integration
{:.no_toc}

The CloudWatch integration is done entirely by having a set of credentials with limited permissions on our RPi device.  
We use these credentials inside our application to access the AWS SDK from our Java code.  
We integrate with CloudWatch in two different ways:
* We push custom metrics from our application to CloudWatch metrics.
* We send the logs from our application to CloudWatch logs.

##### CloudWatch metrics
{:.no_toc}

The metrics that we generate in our application should of course get sent to AWS CloudWatch, so we can actually make use of them in the AWS cloud.  
We use the metric data to build dashboards and alerts within CloudWatch for added visibility into our application.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert Metrics" src="/img/2020-09-25-ghelamco-alert/all-metric-data-graph.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

We have created an alarm that triggers when our **RPI_BACKEND_STATUS** status metric is missing for three data points in a row.  
This means that after 15 minutes of not receiving this metric, the CloudWatch alarm will trigger and notifies us via email that the RPi is either down or disconnected from the internet.  
This enables us to respond quickly and take action to restore connectivity to the device.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert CloudWatch Alarm" src="/img/2020-09-25-ghelamco-alert/ghelamco-rpi-backend-down-alert.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

##### CloudWatch logs
{:.no_toc}

The logs from our Spring Boot application get sent to CloudWatch logs. 
This allows us to check the log files in the AWS cloud without needing access to the RPi device itself.  
<div style="text-align: center;">
  <img alt="Ghelamco-alert CloudWatch Alarm" src="/img/2020-09-25-ghelamco-alert/cloudwatch-logs.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>


#### AWS IoT
{:.no_toc}

The reason for using [AWS IoT](https://aws.amazon.com/iot){:target="_blank" rel="noopener noreferrer"} is for the sake of "being connected to the cloud".  
When we are connected to the cloud, we are able to communicate with our device "through the cloud", meaning from anywhere we want!   
In our case this means that we want our RPi device to be connected to AWS IoT whenever it is up and running and has internet connectivity.  
Of course the communication between our RPi and the AWS cloud has to be secured.
AWS IoT uses authentication and authorization workflow by using certificates that you issue from AWS IoT and upload to your edge device.  
We treat our RPi as an edge device in this project.

Authentication works based on the certificates that the edge device presents to AWS IoT.  
Once the certificate authentication is successful, AWS IoT checks which policies got attached to those certificates to grant it specific authorizations within the AWS cloud.  

##### Authentication: certificates
{:.no_toc}

When you add a new edge device in AWS IoT it is called "a thing".  
When registering "a thing" it generates two keys for us: a public key and a private key.  
AWS IoT will provide a certificate signing request for the public key, which will sign the generated certificate with the root certificate's private key.  

Our thing-certificate and our private key are our credentials when we try to communicate with AWS IoT to access our edge device.  
The only additional input that we need to provide on top of the generated signing request is the root certificate to check the signing.  

* Certificates
* Private Key
* Root CA

Since these certificates get generated per thing that you register they should only be used for one device.  
When I developed the application I had to register another thing for my laptop.  
Connecting from the RPi and the laptop with the same certificates caused some unwanted behavior like connection interrupts.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert CloudWatch Alarm" src="/img/2020-09-25-ghelamco-alert/cert-aws-iot.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

##### Authorization: policies
{:.no_toc}

After creating our certificates and keys we need to handle the authorization part.  
We do this by adding some policies to our certificates.  
When presenting our certificates on connecting, AWS IoT now also knows what services we can access within the AWS cloud. 

An example of such a policy: 
```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iot:Publish",
        "iot:Subscribe",
        "iot:Connect",
        "iot:Receive"
      ],
      "Resource": [
        "*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "iot:GetThingShadow",
        "iot:UpdateThingShadow",
        "iot:DeleteThingShadow"
      ],
      "Resource": [
        "*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "greengrass:*"
      ],
      "Resource": [
        "*"
      ]
    }
  ]
}
```

We define which services we want to access:
- `iot:Publish`
- `iot:Subscribe`
- `iot:GetThingShadow`
- `iot:UpdateThingShadow`
- `iot:DeleteThingShadow` 

This system of generating certificates and coupling policies is a very secure and easy way of working with edge devices.   

##### IoT job
{:.no_toc}

A crucial part of AWS IoT is the job section. 
We can create a job by using the AWS CLI.   
```
aws iot update-job  
  --job-id 010  
  --description "updated description" 
  --timeout-config inProgressTimeoutInMinutes=100
  --job-executions-rollout-config {exponentialRate:{baseRatePerMinute: 50, incrementFactor: 2, rateIncreaseCriteria: <{numberOfNotifiedThings: 1000, numberOfSucceededThings: 1000}, maximumPerMinute: 1000}}
  --abort-config { criteriaList: [ { action: CANCEL, failureType: FAILED, minNumberOfExecutedThings: 100, thresholdPercentage: 20}, { action: CANCEL, failureType: TIMED_OUT, minNumberOfExecutedThings: 200, thresholdPercentage: 50}]}          
  --presigned-url-config {roleArn:arn:aws:iam::123456789012:role/S3DownloadRole, expiresInSec:3600}
```
We use AWS IoT to create these jobs and send them to our RPi where they get executed by our application code.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert device update" src="/img/2020-09-25-ghelamco-alert/device-update-iot.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

We have the possibility to put multiple "things" in a group of devices.  
This way we can send jobs to the entire group and these jobs get executed on every device from that group.  
These jobs could be software updates, reboot commands, rotation of certificates, ...   
Anything we want really!  

In our project we used IoT jobs for a multitude of processes:  
* Update our backend application - over the air
* Create new events
* Snooze and update existing alerts

<div style="text-align: center;">
  <img alt="Ghelamco-alert CloudWatch Alarm" src="/img/2020-09-25-ghelamco-alert/aws-iot-jobs.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

It is pretty straightforward to create an IoT job:

1. Create a job
2. Add a job document (JSON file) which defines the content of the job 
3. Push the job onto the job queue to send it to your devices

Example job document:  
```
{
    "operation": "snoozeAlert",
    "local_alert_id": 31,
    "event_title": "test from lambda snooze alert"
}
```

##### MQTT protocol
{:.no_toc}

AWS IoT can communicate with its registered devices through two protocols: HTTP or MQTT.  
So why would we choose MQTT over the more familiar HTTP protocol?  
The HTTP protocol has some severe limitations for our use case: 

* HTTP is a synchronous protocol, the client waits for the server to respond.  
That is a requirement for web browsers, but it comes at the cost of poor scalability.  
In the world of IoT where we have numerous devices and most likely an unreliable / high-latency network connection this synchronous communication is problematic.  
An asynchronous messaging protocol is much more suitable for IoT applications.  
The sensors can send in readings and let the network figure out the optimal path and timing for delivery to its destination devices and services.
* HTTP is a one-way protocol. The client must initiate the connection.  
In an IoT application, the devices or sensors are typically clients, which means that they cannot passively receive commands from the network.
* HTTP is a 1-1 protocol. The client makes a request and the server responds.  
It is difficult and expensive to broadcast a message to all devices on the network, which is a common use case in IoT applications.
* HTTP is a heavyweight protocol with many headers and rules. It is not suitable for constrained networks.

MQTT on the other hand defines two types of entities in the network: a message broker (AWS IoT) and a number of edge devices (clients).  
The broker is a server that receives all messages from the clients and then routes those messages to relevant destination clients.  
A client is anything that can interact with the broker to send and receive messages.  
Our client is the RPi but it could also be an IoT sensor in the field or an application in a data center that processes IoT data.  

In our backend Java code we have an MQTTJobService which connects to AWS IoT by using the [AWS SDK](https://aws.amazon.com/sdk-for-java/){:target="_blank" rel="noopener noreferrer"} and subscribes to the relevant topics to receive and respond to AWS IoT jobs.  
Every 30 seconds we will read these topics to see if there are any new jobs to be processed.  

### AWS IoT Greengrass

[AWS Greengrass](https://aws.amazon.com/greengrass){:target="_blank" rel="noopener noreferrer"} is a service that extends the AWS cloud onto your edge device.  
This was fascinating for us since we had some tough problems to solve:  
* How can we deploy our application on the RPi device?  
* How can we make sure our application recovers from failures?
* How can we make sure that our system keeps itself up to date?
* How do we find the network address from our device when we are not in the same network?

AWS Greengrass offers solutions to all these challenges!  
Greengrass is an extension of the AWS IoT service and since we had already set up our device in AWS IoT it was easy for us to set up Greengrass.  
To get started with Greengrass we had to do 2 additional steps:
* Define a Greengrass group. This group will contain your IoT devices and deployments.  
* Define a Greengrass core. The core is the device that you will use to run the additional AWS capabilities on.  

The Greengrass group allows us to push deployments to all the devices in our group.  
It also allows you to run lambda functions on your core device or install additional connectors with your own runtime of choice.  
<div style="text-align: center;">
  <img alt="Greengrass group" src="/img/2020-09-25-ghelamco-alert/gg_group.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

When you register your device as a core device in Greengrass you immediately get some nice additional benefits from this.  
For example, you can immediately see all the network interfaces on your core device and what IP addresses got allocated.  
This is especially useful if you want to ssh to your device and do not have a fixed IP attached to it.  
<div style="text-align: center;">
  <img alt="Greengrass core" src="/img/2020-09-25-ghelamco-alert/gg_core.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

Now we that Greengrass is installed and our RPi is configured as a core device our Greengrass group we can start making full use of the capabilities that Greengrass offers.  
We decided that we wanted our application to run as a Docker container, so we installed and configured the [Docker connector](https://docs.aws.amazon.com/greengrass/latest/developerguide/docker-app-connector.html){:target="_blank" rel="noopener noreferrer"} for Greengrass.   
This plugin allows you to run Docker containers on your core device and makes use of **Docker** and **Docker Compose**.  
<div style="text-align: center;">
  <img alt="Greengrass Docker connector" src="/img/2020-09-25-ghelamco-alert/gg_connector_docker_cfg.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>
For this to work you have to install Docker and Docker Compose on your core device.  
Since we are using a RPi it was a bit harder to install since the RPi uses the ARM7 chipset instead of x64/x32.  
We had no trouble installing Docker itself, but for Docker Compose we had to clone the source code from GitHub and compile the binaries ourself on the RPi.  
After all the setup was done we could just create a Docker container in our CICD pipeline and tell Greengrass to run that container on RPi.  

### CICD pipeline RPi Backend

To make sure we did not need to bother ourselves with manual builds and installs of our code on the RPi we built a CICD pipeline to automatically deploy our software onto the RPi.  
We trigger the pipeline whenever a push to our master branch hapens in our Git repository.  
We used [Azure DevOps](https://azure.microsoft.com/en-us/services/devops/){:target="_blank" rel="noopener noreferrer"} as our CICD system.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert Azure pipeline backend" src="/img/2020-09-25-ghelamco-alert/azure-backpipe.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

The pipeline has a lot of pipeline steps defined and integrates with several AWS services as well.  
We drew up a chart to provide additional insight into how this pipeline works:
<div style="text-align: center;">
  <img alt="Ghelamco-alert Azure pipeline backend" src="/img/2020-09-25-ghelamco-alert/ghela-alert-cicd-rpi.png" width="auto" height="auto" target="_blank" class="image fit">
</div>

As you can see there are two major parts of this pipeline: 
* the Azure DevOps pipeline
* the Greengrass deployment process.  

#### Azure devops pipeline
{:.no_toc}

* Build and test our Java code.  
We use Maven to build and test our code.   
* We use [AWS SSM - Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html){:target="_blank" rel="noopener noreferrer"} to safely store our config files and certificates for the RPi.  
In step 2 and 3 we fetch those config files and secrets from the parameter store and store them locally for use later in the pipeline.  
* In order to control the alert light hooked up to our RPi we need to download the [WiringPi library](http://wiringpi.com/){:target="_blank" rel="noopener noreferrer"} as we used that to communicate with our alert light. 
We stored this library in our release S3 bucket.  
* We have to register an ARM hardware emulator as our Docker image has to be run in the pipeline to install additional software.  
Without the emulator our pipeline would just crash as Azure DevOps would have no way to run the ARM7 Docker image.   
* We build our Docker image.  
We install all the config, certificates and dependencies into our container in this step.  
* We push the container into [AWS ECR - Elastic Container Registry](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html){:target="_blank" rel="noopener noreferrer"}.
* We fill in the container name and version from the previous step in our template `docker-compose.yml` file and upload it to our S3 releases bucket.  
* We use the `greengrass create-deployment` CLI command to deploy our Docker container to our RPi device.  
This deployment fetches the `docker-compose.yml` file from our S3 release bucket and then launches the container that we defined in that compose file.  

Some additional explanation on the Docker image and running containers on ARM7 processor architectures.  

Our application's `Dockerfile` looks like this:
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
Because we are running this container on our RPi we need to make sure it can run on the ARM7 processor.  
This is why we started from an ARM7 image that already has JRE11 installed on it.  
As you can see we need to run `apt-get update`**` and some other commands in our container to get it fully functioning.  
This means that our container will be actually executed during the build phase.  
This is the reason why we need to register the ARM7 emulator in our pipeline.  
Otherwise, Azure DevOps would have no way of running our Docker image since it cannot interpret the ARM7 processor instruction set natively.  

In our `docker-compose.yml` file we describe how the container should behave when it's running:
```yaml
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
* We dynamically inject the image name and version in our CICD pipeline into the  `${ecr.imageTag}` field.  
* We run our container in privileged mode as this is needed to access the RPis native interface to control our alert light through GPIO with wiringPi.
* We expose our application port 8080 to the outside world.
* We mount our AWS credentials and H2 database as volumes from the RPi host system.

#### Greengrass deployment process
{:.no_toc}

For the Greengrass deployment process we did not have to create any code.  
This works out of the box when you set up Greengrass.  
However, for full transparency I will briefly describe the process here:
* AWS Greengrass receives a new deployment (this is the last step of our Azure DevOps pipeline).
* Greengrass sends the new deployment to the Greengrass agent on our device.
* Download the Docker Compose file from S3 which is associated with our deployment.
* Download the Docker image and version from ECR that is defined in the Docker Compose file.
* Terminate the current running container.
* Start the new container.
* Set up the mounted volumes defined in our Docker Compose file.
* Start the Spring Boot application in the container.

All these steps get done automatically for us by the Greengrass agent running on our RPi device.  
As you can see this CICD pipeline makes it incredibly easy for us to deploy new software to our RPi device.  

## Frontend web application

To get data from our RPi into our web application we needed a way to connect to our H2 database on the RPi.  
It would be pretty complex to set up our RPi device to be accessible from the internet, so we chose to build a backend in AWS to function as a proxy for our RPi backend application.  
This allows us to use this proxy backend in AWS to access the data from our RPi device and send new commands to update existing data on the RPi.  
More about this backend in the serverless part.  
First let's take a look into our frontend application.  

### Angular
I wanted to create a simple web application to get more insight in the data of our RPi device.  
Any modern frontend framework would be suitable for this but I decided to go with Angular since I had already had some basic experience with it.  
We did however use some extra frameworks and AWS services to make it easier to build our frontend application.  

### AWS Amplify

To help us bootstrap our web application, we decided to use the [AWS Amplify framework](https://aws.amazon.com/amplify/){:target="_blank" rel="noopener noreferrer"}.  
The open-source Amplify Framework provides:  
- Amplify CLI - Configure AWS services needed to power your backend through a simple command line interface.  
- Amplify Libraries - Use case-centric client libraries to integrate your app code with a backend using declarative interfaces.  
- Amplify UI Components - UI libraries for React, React Native, Angular, Ionic and Vue.  

For our project we only used the libraries and UI components from Amplify for our web application.  
When we use the Amplify CLI to bootstrap our project it generated a new file in the `./src` folder of our project called `aws-exports.js`.  
This file contains configuration of various backend AWS services that we will be using:
* Cognito user pool id
* Cognito identity pool url
* Region
* API gateway url

The backend itself is build and deployed with the **serverless framework**.  
More about this in the section regarding serverless.  

### AWS Cognito

We used [AWS Cognito](https://aws.amazon.com/cognito/){:target="_blank" rel="noopener noreferrer"} as authentication and authorization provider.  
This means that new users can sign up to our Cogito user pool and login to our web application by authenticating themselves via that user pool.  

There are several excellent reasons to use Cogito instead of building a home-grown identity solution:  
* Secure and scalable user directory.  
It scales dynamically as you would expect from AWS.  
* Fine grained access control through the use of Cogito user pools and identity pools.   
You can define users and groups in a Cogito user pool which you then can map to AWS IAM roles.  
This is a straightforward and very secure way to allow users of the web application a federated access into your AWS account.  
* Easy integration into our frontend application through components that are provided in the Amplify UI library.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert login-screen frontend" src="/img/2020-09-25-ghelamco-alert/login-frontend.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

##### Cognito User pool
{:.no_toc}
User Pools are user directories used to manage sign-up and sign-in functionality for mobile and web applications.  
Users can register directly in our **user pool** or they can register themselves through web identity federation via a well-known 3rd party like: Facebook, Amazon, Google.  
Whenever a user logs in to our user pool they receive a **JWT token** that contains information about their identity and authorizations.  
We call this information JWT claims.  

##### Cognito identity pool
{:.no_toc}

To be able to use the claims in this JWT token we created an AWS **identity pool** as well.  
The identity pool allows users to exchange their valid JWT token for temporary AWS credentials.  
These temporary credentials then get used by our application, to call AWS services in our account. 
For example: call API gateway, update a dynamodb table , fetch a CloudWatch metric.  
This process is called federated access and is very powerful to expose services from within your AWS account to your end users.  

### The application itself
Now I covered all the technologies that I used for the web application, I will walk you through the application itself.  

#### Dashboard view
{:.no_toc}

On the dashboard view we can see which events are coming up next.  
When we click on an event we also get to see all the alerts which are set for that event.  
We can update or snooze alerts from this screen, BUT...
This works a bit different from how you would expect it to work.  
In a normal setting you would expect us to update the records in our DynamoDB table, right?  
Since we want our H2 database on the RPi device to be the single source of truth this is not the case here.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert Dashboard frontend" src="/img/2020-09-25-ghelamco-alert/dashboard-frontend.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

When you update or snooze an alert we actually create an AWS IoT job for our RPi to process.  
The backend application on the RPi knows how to handle these events and updates his H2 database accordingly.  
Together with our sync component we built on the RPi backend, those changes get updated directly to our DynamoDB table.  

#### Create Custom event
{:.no_toc}

On this tab we can create our own custom events.  
This works in the same way as snoozing or updating on alert on the dashboard view.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert create event screen" src="/img/2020-09-25-ghelamco-alert/frontend-create.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

#### Job overview
{:.no_toc}

In the job overview view we query our API gateway to fetch us all the pending jobs from our DynamoDB job table.  
The lambda function that listens to this endpoint reads the ghela-jobs DynamoDB table and list all jobs that have a status of not yet "COMPLETED".  
The moment this list is empty all changes from our webapp have been processed successfully by our RPi backend application and will have updated the ghela-events and ghela-jobs DynamoDB tables.  

Important note: our RPi can only receive new jobs from AWS IoT if it is connected to the internet.  
So if we do not have a working network connection, jobs will stay queued within AWS IoT and not get pushed to the RPi backend application.  
For the same reason it is important to know that our RPi device is connected and functioning well, to make sure our commands from our web application get processed by our RPi backend application.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert jobs screen" src="/img/2020-09-25-ghelamco-alert/frontend-jobs.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

#### Metrics
{:.no_toc}

On this tab we can see the status of the RPi backend as a graph.  
Remember the metrics we talked about before?  
Via the `/metrics` API endpoint we invoke a lambda function that fetches this dynamic graph and sends it back to our frontend as a Base64 encoded stream of byte data.  
We can then render this data as an image in our frontend web application.  
By adding this graph in our web application users of the application can see that the RPi backend device is up and running and functioning well without ever having to access our AWS account itself, pretty cool huh?  

### Hosting the application

In order to make our web application accessible to the public we needed some kind of hosting service.  
In our case we used [AWS S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/Welcome.html){:target="_blank" rel="noopener noreferrer"} to host our website.  
Our S3 bucket is prefaced by a [AWS CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html){:target="_blank" rel="noopener noreferrer"} that acts as our global, scalable CDN.  
CloudFront delivers our content through a worldwide network of data centers called edge locations.  
When a user requests content that we're serving with CloudFront, the user gets routed to the edge location that provides the lowest latency.  
We used [AWS Route 53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html){:target="_blank" rel="noopener noreferrer"} as our DNS service so that we can access our application on the url  [ghelamco-alert.ordina-jworks.io](https://ghelamco-alert.ordina-jworks.io){:target="_blank" rel="noopener noreferrer"}.  


### CICD pipeline Frontend

Since CICD pipelines were completely new to me when starting this project, Bas created the pipeline for our RPi backend.  
For the frontend CICD pipeline he wanted me to create it.  
Even though he still helped me, he let me think about how this pipeline would run, what steps we needed and had me create the `azure-pipelines.yml`.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert frontend pipeline" src="/img/2020-09-25-ghelamco-alert/azure-frontpipe.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

The pipeline is less complex than the pipeline to build and deploy our backend on our RPi device.  
We created a diagram of all the steps and interactions with AWS services for this pipeline as well.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert frontend pipeline" src="/img/2020-09-25-ghelamco-alert/ghela-alert-cicd-frontend.png" width="auto" height="auto" target="_blank" class="image fit">
</div>

* Install Node.js.
* Download the needed configuration files from AWS SSM parameter store and save it locally.  
In this case we download an entire `aws-exports.js` file from SSM and inject this in the final build of our application.  
This file contains all the endpoints for wiring our frontend application to our production backend.  
* Install npm dependencies.
* Build our Angular application. We use the `npm build` command to do this.  
* Override the configuration file in the application we just built with the configuration file we downloaded from SSM.  
* Empty the S3 bucket we are using for hosting.
* Upload the newly compiled web application to this S3 bucket.
* Invalidate the [AWS CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html){:target="_blank" rel="noopener noreferrer"} cache to make sure our application gets updated on each AWS edge location. 
If we don't do this, our old version could be cached for up to 24h!  

## Serverless framework 
Our frontend application would be pretty useless if no backend existed for it.  
Since it is difficult to access our RPi backend application directly we decided to build a proxy backend in the AWS cloud as explained before.  
We decided to use the serverless framework for its ease of use and speed of development to build this backend.  

What exactly are the requirements for our backend in the AWS cloud? We listed following list of requirements:  
1. [DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html){:target="_blank" rel="noopener noreferrer"} tables for our events and jobs.
2. [Cognito UserPool](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html){:target="_blank" rel="noopener noreferrer"} and a [Cognito IdentityPool](https://docs.aws.amazon.com/cognito/latest/developerguide/identity-pools.html) to provide authentication and authorisation for our frontend application.  
3. [AWS API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html){:target="_blank" rel="noopener noreferrer"} to expose REST endpoints from our cloud backend to our frontend web application.  
4. [Lambda functions](https://aws.amazon.com/lambda/){:target="_blank" rel="noopener noreferrer"} that actually implement our backend code. We used the [AWS Node.js SDK](https://aws.amazon.com/sdk-for-node-js/) to program our lambda functions.  
5. [AWS IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html){:target="_blank" rel="noopener noreferrer"} roles and permissions to perform operations inside of our Lambdas (connect and create jobs on AWS IoT, scan and put to our DynamoDB tables, etc...).


### Why the serverless framework?

In the beginning we configured everything by hand in the console.  
This approach has several drawbacks:
* It is very time-consuming to click in the AWS console
* It is an error prone and not easily repeatable process to set up 
* It does not adhere to industry best practices as we want our infrastructure to be defined as code 

Bas then introduced me to the concept of [IaC or Infrastructure as Code](https://en.wikipedia.org/wiki/Infrastructure_as_code){:target="_blank" rel="noopener noreferrer"} and [the Serverless framework](https://www.serverless.com/){:target="_blank" rel="noopener noreferrer"}.  
There are several options to do IaC on AWS but for our particular project serverless seemed the best fit.  
Our entire cloud backend gets configured in our `serverless.yml` file, that is versioned on GitHub in our cloud backend project.  
This way we can set up our infrastructure through IaC in a repeatable manner.  

### Serverless.yml

This file is the heart of our serverless setup.  
Everything that is needed to run our serverless stack got described in this file.  
We used the **yaml** notation as it is less convoluted than JSON, but you can also use JSON or TypeScript to build this.   
We will explain the different parts of our serverless setup to show you in detail how everything works. 

#### Functions and Api Gateway
{:.no_toc}

The essential part of our serverless setup is the functions section.  
A function is an AWS Lambda function.  
It's an independent unit of deployment like a true microservice.  
It is generally a very small piece of code that does one thing and does it well.  
In our project, for example, we have a lambda function **list-events** which does exactly that, list the events from our DynamoDB table.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert CloudWatch Alarm" src="/img/2020-09-25-ghelamco-alert/sls-functions.PNG" width="auto" height="auto" target="_blank" class="image fit" />
</div>
Our API gateway is generated based on the configuration of our functions in this section.  
Everything under the **events** property is used as configuration for our API gateway.  
In this example you can see that we define a **path** of event and a **method** GET.  
We also enable **CORS** and tell the API gateway to authorize calls made to this endpoint with the **AWS_IAM** authorizer.  

This results in the path `/event` getting added to our API gateway which then maps to our lambda function we defined.  
This path is CORS enabled and is secured by the aws_iam authorizer.  
So you can only invoke this function if you have a valid AWS access credential from our Cogito identity pool.  
If you don't have a valid credential you will receive a 403 denied response from the API gateway.  
<div style="text-align: center;">
  <img alt="API gw" src="/img/2020-09-25-ghelamco-alert/api-gw.PNG"  target="_blank"  />
</div>

Our function needs several additional pieces of configuration to be able to do its job well.  

#### AWS IAM Roles
{:.no_toc}

To allow our lambda function to have fine-grained access to our AWS services we defined IAM roles in our serverless project that are attached to our lambda functions.  
We defined the IAM roles in a separate file `lambda-iam-roles.yml` which gets included into our `serverless.yml` file.  
We can then freely use any roles we wish.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert CloudWatch Alarm" src="/img/2020-09-25-ghelamco-alert/sls-iamroles.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

#### AWS DynamoDB 
{:.no_toc}

We decided to use AWS DynamoDB as our datastore in the cloud.  
[AWS DynamoDB](https://aws.amazon.com/dynamodb/){:target="_blank" rel="noopener noreferrer"} is a key-value, document and NoSQL database, that delivers single-digit millisecond performance at any scale.  
DynamoDB is a very cost effective and low maintenance way of storing data so it looked perfect for us.  
Since our lambda function relies on these DynamoDB tables for its data we pass the table name to the function as an environment variable.  
This allows us to have separate tables for different environment like development, integration, production.  
Our DynamoDB tables get created by the serverless framework as well.  
They are described in a separate file `dynamodb-tables.yml` and gets included in the `serverless.yml` file.  
Our DynamoDB tables get created by a naming policy which allows us to easily reuse that naming scheme in our environment variables for the lambda functions.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert CloudWatch Alarm" src="/img/2020-09-25-ghelamco-alert/sls-dynamo.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

##### Data sync
{:.no_toc}

Our data gets pushed from our RPi backend into DynamoDB tables so that our web application has access to the latest data.  
To achieve this push mechanism I made a service in our backend application that syncs the local H2 database to our DynamoDB table.  
We added some triggers in our RPi backend application that allows us to sync the current state of the H2 database to the DynamoDB table.  
For example, when we are done with our website scraping process, we trigger a sync to DynamoDB if there are any updates or inserts into our H2 database.  
This ensures that our RPi H2 database acts as the single source of truth.  
The DynamoDB is just a read-only copy of the data in the AWS cloud that is kept up to date by our RPi backend application.  
So as long as the backend application is running on the RPi we have access to the latest data in our web application.  

#### AWS Lambda functions with AWS Node.js SDK
{:.no_toc}

The handler is the entry point in our lambda function.  
This is defined in our serverless stack which handler should be invoked by the API gateway.  
Following example illustrates how our lambda reads data from our DynamoDB table (using the environment variable from our config) and returns the result to our API gateway.  

<div style="text-align: center;">
  <img alt="Ghelamco-alert CloudWatch Alarm" src="/img/2020-09-25-ghelamco-alert/sls-lambda.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

#### AWS API Gateway additional configuration
{:.no_toc}

We needed to add some additional configuration for our API gateway that was not possible to include in the functions part of our serverless template.  
To make sure our application does not get CORS errors when it receives a 4XX or 5XX response from the API gateway we had set up CORS for these error responses.  
As you can see below we added response headers to allow all origins and headers.  
<div style="text-align: center;">
  <img alt="Ghelamco-alert CloudWatch Alarm" src="/img/2020-09-25-ghelamco-alert/sls-api.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>

### CICD pipeline Serverless

Since the serverless framework is so easy to use, and we only had one environment available, we decided not to build a CICD pipeline for this part.  
Instead, we just use the **serverless CLI** to deploy and update our stack from our local development machines.  

# Application flow
To finish off the technical part of this blogpost I would like to show you the end-to-end workflow of the application.  
For example let's say the user logs in to the web application and wants to **snooze an alert**.  

1. We click snooze alert in the frontend web application.
2. This calls our API gateway endpoint `/alert/snooze`.
3. This call is authorized by the **userpool JWT token** and **identitypool temporary AWS credential**.  
4. This API gateway endpoint invokes an **AWS Lambda function** which creates a job and **job document in AWS IoT** for the RPi.
It also inserts a row into a second **DynamoDB table** (ghela-jobs) to register the job we created on the frontend.  
5. The job gets send to the RPi and processed by our backend application, thus snoozing the alert in the **H2 database**.
This will effectively turn the alert light off.    
6. The RPi **synchronizes** its H2 database with the event **DynamoDB table**. Thus updating the status of the alert in the DynamoDB table.  
7. This new status will then be reflected in the **frontend web application** so our user can see the result of his action.  

This same workflow applies to all commands that can be sent from the frontend application to our RPi device.  
This is a prime example of how a distributed system works and operates.  

# Conclusion
This internship gave me such a big overview of all best practices and new technologies, that this was a real eye-opener and educational experience.  
- I've had the chance to develop an application in Spring, with different databases;
- learned how to properly test my code with unit and integration tests;
- learned how to use the Java and Node AWS SDKs;
- APIs, connecting it all together...;
- came in touch with a lot of Linux, sharpening my command-line skills;
- developed an Angular app from start to finish;
- learned a lot about AWS: IAM, IoT Core, DynamoDB, API Gateway, SNS, SSM, EKS, S3, CloudWatch, CloudFront, lambdas, Route53, ...;
- CICD pipelines and their best practices in the industry

I'm very thankful for being able to do this and having the chance to work with Bas on a real project.  

He always motivated me to go the extra mile !  
And he could destroy a day of hard work in a few sentences ... :)  

<div style="text-align: center;">
  <img alt="Ghelamco-alert CloudWatch Alarm" src="/img/2020-09-25-ghelamco-alert/bas-smile.png" width="auto" height="auto" target="_blank" >
</div>

But afterwards he would always take the time to explain why, and how, I should do it to make my solution comply with the industry best practices.  
Being able to have someone who makes you self-reflect on the work you did and takes his time to give you proper feedback.
That is the biggest asset to provide to a junior programmer.  

Also, a big thanks to Frederick Bousson & Ordina for the opportunity and resources provided.  
This really was a great project and I enjoyed every minute of it!  
