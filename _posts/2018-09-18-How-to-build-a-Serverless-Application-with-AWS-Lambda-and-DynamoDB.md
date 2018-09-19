---
layout: post
authors: [nick_van_hoof]
title: 'Serverless Application with AWS Lambda and DynamoDB'
image: /img/2018-09-18-How-to-Build-a-Serverless-Application/AWS-lambda-and-DynamoDB.png
tags: [AWS,Lambda,DynamoDB,Serverless]
category: Cloud
comments: true
---

# Table of content
1. [Serverless: What & Why](#serverless:-what-&-why)
2. [What we will build](#what-we-will-build)


# Serverless: What & Why
> A serverless architecture is a way to build and run your applications without having to think about infrastructure.
You no longer have to maintain servers to run your applications, databases, and storage systems.  

And most of all:  
**It is so easy!** :boom: :sparkles: 

Yes, once you get the hang of it, it really is mind-blowingly easy.

# What we will build
Let me prove it to you. 
Join me in building a Serverless application in which users can give great coding tips to eachother. 
To keep it as simple as possible, we will build everything through the aws console.
No need to deploy code from your computer to AWS.
That might be for a later blogpost.

## Demo
I could show you a frontend that uses our Serverless backend to give and get coding tips.
However I choose to give this demo with Postman, so that we see what's going on in the backend.

## Architecture
<div style="text-align: center;">
  <img src="/img/2018-09-18-How-to-Build-a-Serverless-Application/AWS-lambda-and-DynamoDB.png" width="80%">
</div>

# Prerequisites
To follow along you need:
* an AWS account.
If you do not have one already, you can create one by following these steps from the official guidelines:  
[Create an AWS account](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account){:target="_blank" rel="noopener noreferrer"}
* coding enthusiasm

# Lambda: Writing to DynamoDB
## Create database
## Create write-Lambda
## Attaching roles to Lambda
## Test write-Lambda

# Lambda: Scanning DynamoDB
## Create scan-Lambda
## Test scan-Lambda

# API GateWay: Exposing your Lambda Functions
## write-Lambda
## scan-Lambda

# Lambda: Query DynamoDB
## Querying one item
## Creating Global Secondary Indexes
## API GateWay: query-lambda

# What's next? 

# Extra resources

> Node-RED is a programming tool for wiring together hardware devices, APIs and online services in new and interesting ways." -- from docs <a target="_blank" href="https://nodered.org/">https://nodered.org/</a>

And yes, that's all true.
But we're not using Node-RED for those things.
There are two use cases for which we use Node-RED, but before we go into those, we'll take a quick look at some other Node-RED features.

* Make sure you have a Node.js (incl npm) environment
* `sudo npm install -g --unsafe-perm node-red`
* A running Docker daemon
*  `docker pull nodered/node-red-docker`

```javascript
let data = [
 {id: 1, title: "Title 1"},
 {id: 2, title: "Title 2"},
 {id: 3, title: "Title 3"},
 {id: 4, title: "Title 4"},
 {id: 5, title: "Title 5"}
];
if(msg.req.params && msg.req.params.id) { // the id
   data = data.filter((item) => {
       return item.id != msg.req.params.id;
   })
}
msg.payload = undefined;
return msg;
```

