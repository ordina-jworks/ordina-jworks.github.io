---
layout: post
authors: [lander_marien]
title: 'Snitching On Your Colleagues Using Cloud Magic'
image: /img/2022-06-01-snitching-on-your-colleagues-using-cloud-magic/Betrayal.jpg
tags: [Spring, Spring Boot, Git, DevOps, Docker, Kubernetes, Terraform, Helm, Azure, Internet Of Things, RaspberryPi, Javascript, Node.js, AWS, DynamoDB, RDS, Postgres]
category: Internship
comments: true
---



# Table Of Contents

* [Introduction](#introduction)
  
* [The Task At Hand](#the-task-at-hand)
* [Exploring The Environment](#exploring-the-environment)
  * [Azure Repos](#azure-repos)
  * [Pipeline](#pipeline)
  * [Library](#library)
  * [Service Connections](#service-connections)
* [Into The Rabbit-Hole : Setting Up The Pipeline](#into-the-rabbit-hole-setting-up-the-pipeline)
  * [Before We Dive In](#before-we-dive-in)
  * [Basic Tasks](#basic-tasks)
    * [Maven Test](#maven-test)
    * [Maven Build](#maven-build)
    * [Copying And Creating An Artifact](#copying-and-creating-an-artifact)
  * [Containerization](#containerization)
    * [Fetching Our Artifact](#fetching-our-artifact)
    * [Creating An Image](#creating-an-image)
  * [Setting Up A Cloud Database](#setting-up-a-cloud-database)
    * [Terraform Install](#installing-terraform)
    * [Terraform Init](#initializing-terraform)
    * [Terraform Plan](#terraform-plan)
    * [Terraform Apply](#terraform-apply)
  * [Provisioning A Cloud Cluster](#provisioning-a-cloud-cluster)
    * [HELM](#helm-deploy)
  * [Giving A Signal](#giving-a-signal)
    * [Creating Our Bot](#creating-our-bot)
    * [Sending Out Notifications](#sending-out-notifications)
  * [A Visual Representation](#a-visual-representation)
* [Out Of The Frying Pan And Into The Fire: Creating Our Own Task](#out-of-the-frying-pan-and-into-the-fire-creating-our-own-task)
  * [Requirements](#requirements)
  * [Getting The Logs](#getting-the-logs)
  * [Filtering And Saving Failures](#filtering-and-saving-failures)
  * [Factory Fresh](#factory-fresh)
* [The Berry On Top: Our Physical Feedback](#the-berry-on-top--our-physical-feedback)
  * [Dollar Store Google Assistant](#dollar-store-google-assistant)
* [The Good, The Bad & ... The Ugly?](#the-good-the-bad---the-ugly--summary)
  

# Introduction

7 weeks ago I started my internship at Ordina Mechelen.
I had several project options available all looking to touch new and unknown tech that might be relevant for future operations.

My inner Judas spoke to me when I saw a listing about a project that would shoot rockets at developers if they broke a build, and it would provide a great opportunity to pull myself out of my comfort zone focusing more on Devops and Cloud platforms rather than pure programming.
Sadly due to a global hardware shortage the rocket launcher was not available for delivery anymore, so I decided to use a raspberry pi to fetch the build logs and convert them into audio using google text to speech.


# The Task At Hand

The project described a ci-cd pipeline that would trigger a raspberry pi once a build fails, then in response the pi would operate a rocket launcher unit that would target the developer responsible for breaking the build.
As such I broke the final project can be broken down into these steps:

- Create a sacrificial bare-bones spring boot project to put through the ringer
- Create a pipeline which performs some cookie cutter tasks
- Expand pipeline to setup AWS infrastructure
- Expand pipeline to provision said infrastructure
- Create a custom pipeline task to fetch and push build logs
- Configure raspberry pi to host a node.js server
- Listen for new log files
- If new log files have been found, search for error messages and convert those via TTS
- Broadcast the failures of your colleagues

# Exploring The Environment
I'm going to dive right into the meat and potatoes of this project and write about the pipeline since the spring boot application does nothing more than display some basic html and runs a couple of unit tests.
The devops environment that was used consisted of a couple of things.
### Azure Repos
A simple git instance on the Azure platform used for version control of our spring boot project.

<img class="p-image" src="{{ '/img/2022-06-01-snitching-on-your-colleagues-using-cloud-magic/RepoPosition.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 100%;">

### Pipeline
The bread and butter of our operation. Using a data serialization language called yaml we are able to define each individual task we want applied to our code.

<img class="p-image" src="{{ '/img/2022-06-01-snitching-on-your-colleagues-using-cloud-magic/PipelinePosition.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 100%;">

### Library
A place to store key value pairs that we can group and later reference in our yaml file.

<img class="p-image" src="{{ '/img/2022-06-01-snitching-on-your-colleagues-using-cloud-magic/LibraryPosition.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 100%;">

### Service Connections
Predefined connections to internal (Azure) or external services from which we can later extract credentials to gain access in the pipeline.

<img class="p-image" src="{{ '/img/2022-06-01-snitching-on-your-colleagues-using-cloud-magic/ServiceConnectionPosition.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 100%;">

# Into The Rabbit-Hole: Setting Up The Pipeline
In this section I will initially explain how to set up some basic tasks within our yaml file for building and testing then move on to containerizing our build and finally explain how I have used IaC (Infrastructure as Code) to firstly erect an RDS (AWS) instance based on Postgres and secondly use HELM to provision an EKS (AWS) cluster owned by Jworks.
### Before We Dive In
Before we dive in there are some nice to know things about the inner workings and structure of a pipeline defined in a yaml file.
I'll briefly go over some key definitions, so you can follow along nicely when each individual task gets explained.
- Triggers :
  - Triggers are (like the word implies) what sets off your pipeline
  - These can be changes in a branch like ***master*** or ***develop*** but could also be specific events happening in another pipeline such as failed jobs/stages or a specific variable value
- Variables :
  - A hardcoded variable defined at the start of your pipeline
  - A variable group containing secret values like tokens that can not be acquired using service connections
  - Both of these options can be defined at the same time or individually and used anywhere in the pipeline including in additional task commands if the task allows it.
- Stages : 
  - Defines what steps your pipeline should take in what order.
  - Encapsulation of ***stage*** sections
- Stage :
  - A "section" of your pipeline
  - Can be given a name of your choosing eg: Test,Docker,CloudSetup ...
  - Encapsulation for ***jobs***
- Jobs : 
  - Encapsulation of ***job*** sections
- Job :
  - Can be given a name of your choosing just like the ***stage*** section
  - Can be given a ***pool*** attribute to define which agent OS has to run this job
  - Encapsulation of one or more ***task*** sections
- Task :
  - A pre-built or custom-made task to be performed on your pipeline run.
  - has a variety of attributes that can be manually filled up such as credentials or dictating your preferred working directories
- Agents :
  - A machine hosted by the cloud provider (Azure in our case) that runs on a specific OS
  - Defined in the ***pool*** attribute of a ***job*** or at the start of a pipeline.
  - Mostly a clean slate with only some essential software pre-installed eg: Docker
  - Gets wiped after use in order to accommodate the next job.

All of the above gets combined into a structure that resembles the image below.

<img class="p-image" src="{{ '/img/2022-06-01-snitching-on-your-colleagues-using-cloud-magic/ExampleStructure.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 50%;">

### Basic Tasks
Following are the pipeline tasks used to test our java project, generate a test rapport and then build it using Maven.
#### Maven Test
To test our application we will be using JUnit because of the pre-existing support given by Azure. This will also generate a test rapport during each pipeline run based on the unit tests defined in our project.

<img class="p-image" src="{{ '/img/2022-06-01-snitching-on-your-colleagues-using-cloud-magic/MavenTest.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 50%;">

#### Maven Build
A standard task using the Maven goal of 'package' which returns a JAR file that can later be used by Docker.

<img class="p-image" src="{{ '/img/2022-06-01-snitching-on-your-colleagues-using-cloud-magic/MavenBuild.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 50%;">

#### Copying And Creating An Artifact
In order to use our build across multiple agents we need to create an artifact out of the build that then gets stored within the pipeline and can get called upon whenever we please.
We do this by first copying our build to a directory on our agent that functions as the default staging directory for artifacts, then with another task we take that build and publish it to our pipeline storage.

<img class="p-image" src="{{ '/img/2022-06-01-snitching-on-your-colleagues-using-cloud-magic/CopyAndPublish.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 50%;">

### Containerization
Here we use the artifact we created during our last job to create an image and push it to Dockerhub.
#### Fetching Our Artifact
First we have to fetch the artifact that we uploaded to our pipeline and place it in the appropriate directory on our new agent.

<img class="p-image" src="{{ '/img/2022-06-01-snitching-on-your-colleagues-using-cloud-magic/DownloadArtifact.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 50%;">

#### Creating An Image
Then we use said artifact together with a Dockerfile that was previously placed within our java project to create and upload an image to Dockerhub.

<img class="p-image" src="{{ '/img/2022-06-01-snitching-on-your-colleagues-using-cloud-magic/DockerTask.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 50%;">

### Setting Up A Cloud Database
In this job we will use Terraform to set up an RDS (AWS) database based on Postgres for our containerized java application.
Our Terraform files are stored in the java project under a folder called infrastructure and can be called upon directly, alternatively a remote Terraform can be specified if you want or need to split up your files.
Credentials needed to get access to AWS services come from a manually pre-defined service connection.
#### Installing Terraform
In order to use Terraform on our agent we have to first install it to our agent since it is not supplied by default.

<img class="p-image" src="{{ '/img/2022-06-01-snitching-on-your-colleagues-using-cloud-magic/TerraformInstallTask.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 50%;">

#### Initializing Terraform
This task performs several initialization steps in order to prepare the current working directory for use with Terraform.

<img class="p-image" src="{{ '/img/2022-06-01-snitching-on-your-colleagues-using-cloud-magic/TerraformInit.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 75%;">

#### Terraform Plan
Plans out what configurations and steps will be made once the apply command is given.

<img class="p-image" src="{{ '/img/2022-06-01-snitching-on-your-colleagues-using-cloud-magic/TerraformPlanTask.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 75%;">

#### Terraform Apply
Finally our Terraform file gets executed and our Postgres database is configured and launched.

<img class="p-image" src="{{ '/img/2022-06-01-snitching-on-your-colleagues-using-cloud-magic/TerraformApply.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 75%;">

### Provisioning A Cloud Cluster
Now that we have an image of our app and place to store data to only one crucial step remains, launching our application.
Our application gets deployed to EKS (Elastic Kubernetes Service) which is another AWS service designed for running cloud based Kubernetes.
In order to do so a HELM chart has been made which like the Terraform files is stored under the infrastructure directory of our project.
These charts are (much like our pipeline) defined in a yaml format where specifications crucial to Kubernetes are being made eg: Name of the app, Kind , Amount of replicas, Image to use ...

#### HELM Deploy
Using our HELM chart and a service connection giving us authorization to supply the Jworks cluster we deploy our application (which gets pulled from Dockerhub) to the "stage-thomas-more" namespace within EKS.

<img class="p-image" src="{{ '/img/2022-06-01-snitching-on-your-colleagues-using-cloud-magic/HelmTask.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 75%;">

### Giving A Signal
Now that everything has been set up and all the services are up and running it's time to give our developers a heads-up.
I did this using a Telegram bot that will broadcast a message for every build that has run.
The bot token was stored in the **library** as a secret key-value pair.
#### Creating Our Bot
This is a prerequisite if you want to work with Telegram since a bot token and a chat id are required to function.
Telegram has a neat tutorial on how to create your own bot using the "Botfather" which you can find here : [The Botfather](https://core.telegram.org/bots)
#### Sending Out Notifications
Now that we have our bot token and a chat id we can define a message that gets sent everytime the task is reached.

<img class="p-image" src="{{ '/img/2022-06-01-snitching-on-your-colleagues-using-cloud-magic/TelegramTask.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 50%;">

### A Visual Representation
Displayed below you will find two images representing the pipeline and the goals they accomplish on the Cloud.

For now pay no attention to the little logo displaying Eric Cartman, this is the image I used to represent my custom task which we will get to in the following section. 

<img class="p-image" src="{{ '/img/2022-06-01-snitching-on-your-colleagues-using-cloud-magic/PipelineFlow.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 75%;">

<img class="p-image" src="{{ '/img/2022-06-01-snitching-on-your-colleagues-using-cloud-magic/AWS_diagram_final_image.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 75%;">

# Out Of The Frying Pan And Into The Fire: Creating Our Own Task
During week 5 all of the above was learned, implemented and configured to a working state so a question was asked by Frederick Bousson the solutions lead at the Jworks Ordina Unit if it was possible to create a custom task for use in the pipeline.

Up for another challenge I stepped into the pretty unexplored (And not fully documented) lands of developing a task for a pipeline.
The main objective of the task is to get the pipeline logs from a predefined pipeline run or from the current one as default.
Those logs get filtered and send to a DynamoDB instance hosted on AWS.

#### Requirements
- Node.js
- TFX : A packaging tool
- Microsoft VSS Web Extension SDK package
- Some experience writing in Javascript or Typescript
- A Visual Studio publisher account (free)

#### Getting The Logs
This was done using the Azure Devops REST API: [Documentation](https://docs.microsoft.com/en-us/rest/api/azure/devops/?view=azure-devops-rest-7.1) 

To get builds a couple of things are required:
- The Azure Devops organization name
- The project name
- The build number
- Authorization

While the values for point one and two were pretty straightforward gaining access to the **build logs** required a **build id** instead of a **build number** , and since the **build id** can not be traced through the UI of Azure Devops some nested API requests were required.

The Authorization was gained through the creation of a PAT token that can be used as a header in the GET Request.
#### Filtering And Saving Failures
Now that we have our desired logs all that remains is filtering, formatting and sending those logs to DynamoDB.
In order to complete this operation the following steps were taken:
- Set up authorization in a way that allows developers to use their AWS service connection.
- Use the AWS SDK combined with the credentials from the service connection to authorize the user.
- Filter the received logs that which had a format of plain text using regex to find possible error messages
- Format the error messages together with the developer responsible for the build and the time of build.
- Push our formatted object to DynamoDB

#### Factory Fresh
Eh Voilà!
Our extension does everything we hoped it would do, so it's time implement it in our pipeline.

First we compile our Typescript to Javascript since the index.js file is the default node entry point, Then we package our extension, and finally we upload it using the management portal where we share it with our organizations of choice.

The result:

In my publisher account:
<img class="p-image" src="{{ '/img/2022-06-01-snitching-on-your-colleagues-using-cloud-magic/CustomTaskInMarketplace.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 100%;">

In the pipeline:
<img class="p-image" src="{{ '/img/2022-06-01-snitching-on-your-colleagues-using-cloud-magic/CustomExtensionTask.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 50%;">

# The Berry On Top : Our Physical Feedback
Almost there!
Finally it is time for the actual dirty work namely snitching on our dear colleagues.
To do this I only needed two things, a raspberry pi and a bluetooth speaker.

### Dollar Store Google Assistant
Initially we had planned to use a rocket launcher as our physical feedback machine.
That idea was scrapped however because of a global shortage (or tremendous price increase) for all hardware components.

Next up the Google Assistant came to mind which is embedded in android devices or a Google home speaker(And probably a lot of other devices).
The problem with this idea unfortunately was that the Google Assistant was never designed to take in text input through an API because devices running Google Assistant had no direct endpoints.
Now we could in fact work around this and set up a Home automation system like Home Assistant or Node Red but this would mean that our speaker could never change location without reconfiguring access to its new network.

A final solution I came up with in secret while my mentor was away on a conference in Valencia, was to run a Node.js server on a Raspberry Pi that after booting takes a reference log from our DynamoDB database.
Every minute it would get the latest log available and compare it to the log it had stored, this way when a difference in logs had been found it knew it was time to call out the developer.

Through a nifty npm package we are able to send our text message that we want converted to an audio file and get an url in return where the audio file is stored.
Using Node file system I programmatically created a text file where each audio url sporadically alternated with a path to a local audio file gets written to a line in the previously created text file.
What I had just created was some sort of playlist which dictated the order of audio files to be played.
All I had to do now was hook it up to a media player.

***note***: By all means was this not the ideal solution, but it allowed the Pi and speaker to be portable to any location as long as we could connect it to wi-fi.

A succesfull pipeline run broadcast(Sound up):

<figure class="video_container">
  <iframe src="https://www.youtube.com/embed/W4LZsEbTRF4" frameborder="0" allowfullscreen="true"> </iframe>
</figure>

A failed pipeline run broadcast(Sound up):

<figure class="video_container">
  <iframe src="https://www.youtube.com/embed/6PS0K2zdW-o" frameborder="0" allowfullscreen="true"> </iframe>
</figure>

# The Good, The Bad & ... The Ugly? : Summary

Like I mentioned at the start of this blog, there were a number of different project options to choose fun as an internship topic.
The reason I went with the ci-cd route is that I knew it would pull me straight out of my comfort zone and at the very least broaden my view on development in general.

Feeling comfortable just "writing" code all day and maybe a SQL Query here and there the thought of mainly working on a CLI or configuration files quite frankly scared the bejeebers out of me.
While having touched on basic CLI environments like Docker or Bash it always felt kind of cryptic seeing all sort of flags and if you messed up the error messages weren't all that clear compared to a stack trace with Java or an error with a web framework like React.

Well, I'm happy to say that after 7 weeks of submerging myself mostly in configuration files like .yaml and .tf(Terraform) combined with CLI tools such as kubectl for Kubernetes, psql for Postgres and AWS CLI for AWS Configuration I feel a lot more at home touching on tools not necessarily meant for pure programming.

For a total recap I put together the following image to show you every single tool or software that was used during the project.

<img class="p-image" src="{{ '/img/2022-06-01-snitching-on-your-colleagues-using-cloud-magic/techSummary.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 75%;">


As a final sendoff I want to say a quick thank you to my mentor Nick Geudens for guiding me through the jungle of DevOps and AWS and to Frederick Bousson for coming up with the project and allowing me the opportunity to execute it.





