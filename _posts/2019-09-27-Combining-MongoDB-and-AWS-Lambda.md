---
layout: post
authors: [nick_van_hoof]
title: 'Marrying MongoDB Atlas and AWS Lambda'
image: /img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/featured-image.png
tags: [MongoDB, Cloud, AWS, AWS Lambda, Serverless]
category: Cloud
comments: false
---

### Reading time: 10 min 30 sec

# Table of contents


# MongoDB and AWS Lambda: a successful marriage.
Can we use MongoDB Atlas when working with AWS Lambda?  
Yes we can!   
It's simple enough to setup and above all very performant!  

This blog concerns mainly two things:
* How to setup a production like structure
* Comparing MongoDB performance with AWS native solutions

# Connect your Lambda Functions with your MongoDB Atlas Cluster
We want to deploy a production grade setup.  
This means we won't connect over the open internet.
We'll setup a VPC peering connection between our Atlas Cluster and our AWS VPC.  

## The AWS side
Let's setup a new VPC.
In this VPC we will create a public subnet.
A route table will be associated with that subnet.
In the route table we'll define that we want to route all database traffic through the VPC peering connection towards the Atlas cluster.

In the AWS User Interface navigate to the VPC dashboard and click `Launch VPC Wizard`.

<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/1-VPC-dashboard.png" width="70%" height="70%">
</div>

Select that you want to create a VPC with a single public subnet.

<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/2-VPC-with-single-public-subnet.png" width="70%" height="70%">
</div>

Specify how big you want the IP range of this VPC to be.
If you have trouble figuring out the relation between the `CIDR block` and the `Network Range` use one of the online converters to help you. ([https://www.ipaddressguide.com/cidr](https://www.ipaddressguide.com/cidr))  
Give your VPC and public subnet a name.  
Make sure that `enable DNS hostnames` is enabled.

<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/3-VPC-with-single-public-subnet-2.png" width="70%" height="70%">
</div>

Your VPC has been successfully created.

<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/4-VPC-successfully-created.png" width="70%" height="70%">
</div>

You will now notice that a new subnet and two new route tables have been created.  
That is a route table for your VPC and a route table specifically for you public subnet.

<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/5-new-subnet.png" width="70%" height="70%">
</div>

<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/6-new-route-tables.png" width="70%" height="70%">
</div>

Before we go to MongoDB Atlas get some specific data about your VPC:
* Write down the VPC-id
* Write down the IPv4 CIDR of your VPC
* Write down the security group associated with this vpc.
Under security groups fetch the id of the security group that is associated with your vpc.

<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/7-security-group.png" width="70%" height="70%">
</div>


## The MongoDB side

Setup the MongoDB cluster.
This has to be a dedicated cluster which means you'll need at least an M10.

<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/Setup-m10-cluster.png" width="70%" height="70%">
</div>

Wait till your cluster is set up.

<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/m10-is-setup.png" width="70%" height="70%">
</div>

In the Atlas UI navigate to `Security` -> `Network Access`.
Fill in the VPC-id that you just found.

<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/8-setup-peering-connection-atlas.png" width="70%" height="70%">
</div>

Hit `Instantiate peering` !


<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/9-pending-peering-connection.png" width="70%" height="70%">
</div>

Notice that AWS created and `Atlas CIDR` which specifies the IP range in which your Atlas cluster will reside.  
We are connecting the Atlas IP range with the IP range of our AWS VPC, hence VPC peering.

The peering connection is pending.

Go back to AWS.

## The AWS side (again)
In the VPC service of AWS go to `Peering Connections`.

<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/10-aws-peering-connection-request.png" width="70%" height="70%">
</div>

Accept this peering request!

Now you have to update your routing tables.
AWS will also ask you `Do you want to update your routing tables` when you accept the peering request.
Our Lambda Functions will be deployed in the public subnet of our VPC.
So we want to modify the route table that is associated with that subnet.
You can recognize that route table because it has an **explicit subnet association**.

<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/11-modify-route-table.png" width="100%" height="100%">
</div>

Click `edit routes` and add a route towards your Atlas cluster.
What we are actually saying here is that we want to route all traffic to our Atlas cluster through the VPC peering connection.  
As `Destination` choose the Atlas CIDR and under `Target` choose your VPC peering connection.

<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/12-edit-routes.png" width="100%" height="100%">
</div>

Updating the route table will update the status of the peering connection to **available** in the Atlas UI.

<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/13-peering-available.png" width="100%" height="100%">
</div>

### Deploy your lambda functions!

Deploy your Lambda functions to your VPC and test it out!
Deploy them into the public subnet that we just created and as security group specify the security group of your AWS VPC.
In the Lambda User Interface of the AWS Console you will now see that the Lambda Function has been deployed in the correct subnet with the right security group.

<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/14-lambda-in-vpc.png" width="70%" height="70%">
</div>


# Performance: MongoDB vs DynamoDB
Can MongoDB be a great alternative for DynamoDB?
In the serverless AWS world DynamoDB is often the database of choice.  
DynamoDB is a key-value store which is suitable for usecases of storing smaller documents for shorter periods. 
There certainly are a lot of use cases where you want more functionality then what Dynamo offers you.  
At that moment you start looking at MongoDB for a solution.

Below I did a performance comparison between DynamoDB and AWS Lambda.

## Test Scenario

In the application below people can creat sessions that they want to give on a conference for software developers.  
The request to create a sessions is accepted and processed asynchronously.
The request arrives on a `SNS` topic which fans out towars 2 `SQS` queues.  
Both of these queues trigger a Lambda Function:
* one Lambda Function saves in a DynamoDB table
* one Lambda Function saves in a MongoDB Atlas collection

I will hit the application with a bunch of sessions that have to be persisted.
During one minute I will increase the load of incoming sessions from 1/second to 10/second.

<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/a-architecture-test.png" width="100%" height="100%">
</div>

## Performance Results




## Useful links
[https://docs.atlas.mongodb.com/security-vpc-peering/](https://docs.atlas.mongodb.com/security-vpc-peering/)
[https://www.mongodb.com/blog/post/introducing-vpc-peering-for-mongodb-atlas](https://www.mongodb.com/blog/post/introducing-vpc-peering-for-mongodb-atlas)