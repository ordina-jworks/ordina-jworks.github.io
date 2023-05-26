---
layout: post
authors: [ferre_vangenechten, yanko_buyens]
title: 'Tesla Project Ordina Young Professional Programme 2022'
image: /img/kicks.png
tags: [Spring, Spring Boot, Angular, Unit testing, Mocking, Microservices, Git, DevOps, Docker, TypeScript, Kickstarter, Young Professional Program, Security]
category: Young Professional Programme
comments: true
---

# Introduction

During Ordina's Young Professionals Program, we had the opportunity to work on this spectacular devcase.
As a software developer, you must face the challenge of integrating different technologies to build a functional and efficient system.
This devcase required us to use a range of tools and technologies, from Java Spring Boot to AWS and Helm.
In this blog post, we will share our experience working with these technologies, as well as the use of Spring Boot, Terraform, Google Assistant, GitHub Actions, etc. to build a scalable and reliable system that meets the project's requirements.
In addition, the main problems we encountered during the devcase and how we overcame them.  

## Our goal

Make two different applications that will use Tesla Cars.

The purpose of the first application was to play Rock-Paper-Scissors between two Tesla’s.
This will be played by two fixed users that are each connected to a Tesla.
They should select an action which was equivalent to a Tesla-command.

- Rock = Lower Windows

- Paper = Flash Lights

- Scissors = Honk Horn

The primary goal of this application was to showcase it at conferences to capture people’s attention.

The Second application involved integrating with Google Home.
Its purpose was to control the Tesla using voice commands, such as start/stop charging, checking battery level, etc.
We decided to create this app because it seemed enjoyable and allowed us to work with a third-party integration.

# Functionalities 

This section describes the basic functionalities of the applications.

## Rock-Paper-Scissors

### Step 1: Get the tokens.

<img src="{{ '/img/2023-02-06-tesla-ypp-2022-blogpost/tesla-save-credentials.png' | prepend: site.baseurl }}" alt="The refresh token is saved in AWS secret manager" class="image fit" style="margin:0px auto; max-width:100%; height:60%">

Both owners must first log in with their Tesla Account and send their tokens to our application.
The application will then store it in a secret vault.

### Step 2: Play the game.

<img src="{{ '/img/2023-02-06-tesla-ypp-2022-blogpost/tesla-execute-action.png' | prepend: site.baseurl }}" alt="The user choosen action is send to the tesla proxy api" class="image fit" style="margin:0px auto; max-width:100%; height:60%">

The game is now ready to begin.
The players select their actions, which will be translated into Tesla Commands.

### Step 3: Executions.

The commands will be executed on the vehicles.

## Google Integration

## Step 1: Add Tesla to Google Home Account

<img src="{{ '/img/2023-02-06-tesla-ypp-2022-blogpost/google-save-credentials.png' | prepend: site.baseurl }}" alt="The credentials of the user are saved in google home account" class="image fit" style="margin:0px auto; max-width:100%; height:60%">

User adds our Tesla Application to their Google Home Account.

## Step 2: Ask Google

<img src="{{ '/img/2023-02-06-tesla-ypp-2022-blogpost/google-execute-action.png' | prepend: site.baseurl }}" alt="The user choosen action is send via google to the tesla proxy api" class="image fit" style="margin:0px auto; max-width:100%; height:60%">

## PROCESS

This section is about the steps we’ve taken to accomplish our results and some challenges we faced along the way. 

Before we started the project, we conducted research on the mobile Tesla App and the corresponding API.
For this we made use of an Unofficial [Tesla API Documentation](https://tesla-api.timdorr.com/){:target="_blank" rel="noopener noreferrer"}.  

As direct requests to the authentic Tesla API are not always feasible, we opted to create a Stub API that emulates the functionality of the real API but with dummy-data.
This enabled us to locally test all components, systematically implement features and receive better error messages. 

We then developed a Proxy API that can be used by any of our applications that interact with Tesla’s.
The proxy is responsible for manipulating all incoming requests in a way acceptable to Tesla.
This includes the addition of tokens, object alterations, parameters additions, etc.  

<img src="{{ '/img/2023-02-06-tesla-ypp-2022-blogpost/dummyproxy.png' | prepend: site.baseurl }}" alt="Client send request to dummy proxy api" class="image fit" style="margin:0px auto; max-width:100%; height:60%">

<img src="{{ '/img/2023-02-06-tesla-ypp-2022-blogpost/stubproxy-to-stubapi.png' | prepend: site.baseurl }}" alt="Client send request to stub proxy api, that forward request to stub tesla api" class="image fit" style="margin:0px auto; max-width:100%; height:60%">
<img src="{{ '/img/2023-02-06-tesla-ypp-2022-blogpost/proxy-to-api.png' | prepend: site.baseurl }}" alt="Client send request to proxy api, that forward request to tesla api" class="image fit" style="margin:0px auto; max-width:100%; height:60%">

To simplify our development process, we worked with three separate profiles within the proxy: one that interacts directly with the authentic Tesla API, another that interacts with our own Stub API, and a final profile that returns dummy data without using an external service.
This way we could switch easily and validate our code quickly.  

A Tesla vehicle will go in a sleeping state at random moments.
This means it could take several seconds before the vehicle is online and ready to receive commands.
To wake up the vehicle, we need to call an endpoint.
It could take a few seconds, so we created a retry mechanism with a timeout.  

<img src="{{ '/img/2023-02-06-tesla-ypp-2022-blogpost/wake-up-mechanisme.png' | prepend: site.baseurl }}" alt="Client send request to proxy api, that forward request to tesla api. When received a 408 error, the proxy send a wake up request" class="image fit" style="margin:0px auto; max-width:100%; height:60%">

Diagram Explanation: When the vehicle is in sleeping mode, the Tesla API returns a 408-error while trying to execute a command.
Our proxy will catch this error, send a wake-up request and try to execute the command again after 10 seconds.
This will be done maximum five times.  

Another challenge we faced developing the Proxy API was authentication.
Because someone must trust us with his Tesla-vehicle (and tokens), our aim was to use an identity management solution that we have full control over, like AWS Cognito, to link users to a Tesla-account and manage access.
This way, there are no Tesla tokens on the client-side, and we can manage the tokens in a secret vault on the server-side.

Tesla-tokens expire every eight hours, which means we need to refresh them automatically to keep using the vehicles in our applications.
We managed to do this on AWS using the Secrets Manager and Lambda services. 

<img src="{{ '/img/2023-02-06-tesla-ypp-2022-blogpost/refresh-tokens.png' | prepend: site.baseurl }}" alt="Every 7 hours the lambda to refresh the acess token is triggered" class="image fit" style="margin:0px auto; max-width:100%; height:60%">

Diagram Explanation: The owner of the Tesla must log in with his own credentials and send his tokens directly to our Proxy application, which will save it into AWS Secrets Manager.
A lambda will be executed every seven hours that will refresh the Access Token.

Now our “foundation” was ready, we started with the creation of our rock-paper-scissors application where we wanted to implement the business logic to play it between two Tesla’s.  

Finally, we added the Google Home integration consulting [its own documentation](https://developers.home.google.com/cloud-to-cloud/guides){:target="_blank" rel="noopener noreferrer"}.
For this, we wanted to use Tesla Authentication directly so that Google could manage the tokens.
The only problem was that we couldn’t set the redirect-url from the Tesla-client to our Google Application directly.  

To resolve this issue, we developed a Custom Auth API that involved a simple process.  
Firstly, to add a device in the Google Home App, users must log in through our Auth API, which then redirected them to the Tesla login page.
After logging in, they needed to copy the authorization code and send it to our application.
The rest was handled by our Auth API, and the user were successfully logged in. 

To summarize, we conducted research on the Tesla App and API, created a Stub API, developed a Proxy API, implemented the rock-paper-scissors game, and integrated Google Home.
Despite challenges, we successfully completed the project.

## ARCHITECTURE

This section is about the architecture that is used.
Starting with more information about the global architecture.
Later, there will be zoomed in on the architecture used for the two different applications that are built: Rock-Paper-Scissors and Google Integration.
<img src="{{ '/img/2023-02-06-tesla-ypp-2022-blogpost/tesla-architecture.png' | prepend: site.baseurl }}" alt="It shows every resource used to create the whole tesla application" class="image fit" style="margin:0px auto; max-width:100%; height:60%">

Above, you can see a complete diagram of the architecture we've used to accomplish our results.
Everything within the black-lined square represents services running on AWS.
The purple square represents our applications running on Kubernetes in the AWS EKS-Cluster.

We’ve used GitHub and GitHub actions combined with Terraform, Helm and Docker for deploying and CI/CD.  

In the context of testing, we’ve used Postman to test REST and Gatling for performance testing. 

## ROCK PAPER SCISSORS ARCHITECTURE  

<img src="{{ '/img/2023-02-06-tesla-ypp-2022-blogpost/rock-paper-scissors-architecture.png' | prepend: site.baseurl }}" alt="It shows every resource used to create the whole rock paper scissors application" class="image fit" style="margin:0px auto; max-width:100%; height:60%">

A user will first need to authenticate themselves using Cognito before sending requests.  

The use of an API Gateway was not necessary, but was added for educational purposes.
As a result, we needed to link it to our RPS(Rock-Paper-Scissors)-application via a VPC link to our Network Load Balancer (NLB) next to an Application Load Balancer (ALB) that will be connected to our RPS-application. 

The RPS-application then communicates with our Proxy-API that will (based on the active profile) communicate with one of the Tesla-APIs.  

Finally, the Key-Rotation mentioned in the previous section is also included in the diagram.  

## GOOGLE HOME ARCHITECTURE  

<img src="{{ '/img/2023-02-06-tesla-ypp-2022-blogpost/google-architecture.png' | prepend: site.baseurl }}" alt="It shows every resource used to create the whole google application" class="image fit" style="margin:0px auto; max-width:100%; height:60%">

The applications are deployed on Kubernetes and made accessible through an Ingress and Route53.
The Google box is linked to a Google Home account, which in turn is connected to our applications.
The Proxy API is communicating with the Tesla APIs. 

## Used Technologies

The development of our project required the use of a variety of technologies to ensure a successful outcome.
Here's a brief overview of each technology and why it was chosen.

1. AWS: AWS was chosen as the cloud platform for our project because of its scalability, efficiency, and security benefits.
By leveraging the resources offered by AWS, we were able to take advantage of the many benefits of cloud computing.

2. Terraform: Terraform is an open-source tool used for infrastructure as code.
This tool allowed us to automate the provisioning and management of our infrastructure on AWS, making it easier for us to manage and maintain our infrastructure over time.
The whole infrastructure will be deployed on Monday in the morning and destroyed on Friday night using a cronjob.

3. GitHub + GitHub Actions: GitHub is a version control platform that we used to store and manage our code.
GitHub Actions is a continuous integration and deployment (CI/CD) platform that allowed us to automate the build, test, and deployment of our application.
The CI/CD will run every time a pull request is made.
This to validate that the application can be build using maven.
Another trigger for the CI/CD to run is when code is pushed to the develop branch.

4. Java Spring Boot: Java Spring Boot is a framework used for building microservices and web applications.
In our project, we utilized the power of Java Spring Boot to build the back-end of our application.
Our project consisted of several different microservices, including the RPS proxy, RPS backend, stub Tesla API, Google application, and Tesla authenticator.
Each of these microservices played a crucial role in the functionality and performance of our overall application.

5. Google Actions: Google Actions is a platform for building conversational experiences for Google Assistant.
We used Google Actions to build and integrate conversational interfaces into our application.
For authenticating our users, google action is linked to our Cognito.
Google actions send different request, like for instance a synchronization, to the webhook of our Google Application.

6. Docker: Docker is a containerization technology used for deploying and managing applications.
We used Docker to containerize our application, which allowed us to easily deploy and manage our application.

7. Kubernetes + Helm: Kubernetes is a container orchestration platform used for automating the deployment, scaling, and management of containerized applications.
We used Kubernetes to manage our Docker containers and Helm to simplify the deployment and management of our application.

8. Renovate: Renovate is a tool used for automating the updating of dependencies in our application.
We used Renovate to ensure that our dependencies were always up-to-date and secure.
It automatically makes a pull request when a new version of a dependency is found.
We’ve set a limit at 2 pull requests made by renovate, so that we can maintain a good overview.

9. Postman: Postman is a tool used for testing and documenting APIs.
We used Postman to test our APIs, which allowed us to ensure that our APIs were working correctly and that they were easy to use for other developers.

10. Gatling: Gatling is a load testing tool used to test the performance of our application.
We used Gatling to ensure that our application could handle high volumes of traffic and remain performant under heavy load.

## Final Product

Our final product consists of two applications, each designed to offer a unique and engaging user experience.
The first application is a fun and interactive game that allows users to play the classic game of rock paper scissors with a tesla.

The second application is a Google Home app that enables users to control a Tesla car using Google Assistant.
With this application, users
can easily check the temperature and battery level of their car, as well as start and stop charging with just a few simple voice commands.
Users can connect Google Assistant to their Tesla car quickly and easily, offering a fun solution to manage their car.

## Developer Experience

Developing an application can be a complex process, especially when dealing with unfamiliar technologies.
In our project, we encountered several challenges, but our biggest achievement was learning and growing our skills.

Communication was one of the major challenges we faced during the project.
It was not always clear who was responsible for which task.
This resulted in duplicated functions and conflicting efforts.
To address this issue, we had to improve our communication, agile working, and ensure that all team members were aware of each other's progress.

Deploying a complex application in the cloud can also present several challenges, especially when dealing with unfamiliar platforms like AWS.
To set up all the necessary resources in AWS, we had to learn how to work with terraform, which required attending workshops, consulting documentation, and utilizing tutorials to learn the necessary skills.

Furthermore, deploying the application using Kubernetes proved to be especially challenging, as we had no prior experience with this technology.
This required us to explore various solutions, test different approaches, and collaborate closely with our team members to overcome this challenge.

In the end, the challenges we faced proved to be valuable lessons.
By improving our communication and acquiring new skills, we were able to successfully complete our project, which took longer than initially thought.
Our experience has taught us the importance of collaboration and adaptability when working with unfamiliar technologies.
We believe that these lessons will prove beneficial in future projects and enable us to tackle even more complex challenges in the field of application development.