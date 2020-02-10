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
* [MongoDB and AWS Lambda: a successful marriage?](#mongodb-and-aws-lambda-a-successful-marriage)
* [MongoDB and AWS Lambda: Why?](#mongodb-and-aws-lambda-why)
* [MongoDB and AWS Lambda: Performance](#mongodb-and-aws-lambda-performance)
* [Cold start vs warm performance](#cold-start-vs-warm-performance)
* [Performce conclusions](#performance-conclusion)
* [Connect your Lambda Functions with your MongoDB Atlas Cluster](#connect-your-lambda-functions-with-your-mongodb-atlas-cluster)
* [Useful links](#useful-links)


# MongoDB and AWS Lambda: a successful marriage?
Can we use MongoDB Atlas when working with AWS Lambda?  
Yes we can!   
It's simple enough to setup and above all also performing well!  

This blog concerns mainly two things:
* Why would you use MongoDB + AWS Lambda and how does it perfom
* How to create a production grade setup with vpc-peering

# MongoDB and AWS Lambda: Why?
As I am both a fan of AWS Lambda and MongoDB Atlas it was fun for me to marry them.  
However in the real world we don't do things for fun alone.  
What could be the motives to combine MongoDB Atlas and AWS Lambda?

* In case of MongoDB you provision your cluster and you know what you'll pay for it.
* MongoDB has a rich query language to query within a collection
* MongoDB supports a join over collections.
* Support for lot's of indexes
* Large documents allowed. A MongoDB document can be up to 16 Mb.
* More metrics, more insights, but also more management. That's why it's not serverless.
* Flexible data access. Also in a NoSQL world it is important to new your data access model. 
Data modeling is an important step to take carefully before you start persisting your data.
The way your data is modelled will limit the access patterns that can be used on your data.
MongoDB offers you more flexibility to access your data in different ways after you have stored it.

# MongoDB and AWS Lambda: Performance
Suppose you have setup access from your Lambda Functions to your MongoDB Atlas Cluster (If you want to know how, read more about it in the second part of this post).

Since we are dealing with Lambda Functions we also have to deal with cold start. 
This is the case for any Lambda Function no matter what database it connects to.
MongoDB mentions on there website that there is an initial startup due to this.

I am testing using the following setup:

<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/Architecture.png">
</div>

Items are coming in via requests through the API.
The `APILambda` drops the items on a queue.  
A second Lambda Function `SaveMongoDBLambda` stores the items in the MongoDB database.

Other things important to know:
* In the above setup I limit the maximum number of concurrently running Lambda Functions instances of `SaveMongoDBLambda` to 10.
* The Lambda Functions are written in `Java` which will add time to the coldstart performance compared to `Python` or `NodeJS`.
* In this case I am reading the items from the queue one by one. 
  Also storing them one by one.
  To optimize we would do this in batch.  
  Here we want to measure performance and we don't want the batch size to vary.
  So we store them one by one.
* The lambda function runs in a VPC to be able to make a peering connection to the MongoDB Atlas Cluster.
* The items that are being stored are only a few tens of bytes large.
* In total 1000 items were inserted
  

## The results: analyzing the results using XRAY
I am using the AWS Xray SDK to trace and analyze the requests flowing through the application.

Here is a graph showing you the `Response Distribution` of the `SaveMongoDBLambda`. 
Hence, this is the time that the Lambda Function took to execute.

<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/response-distribution.png" width="60%" height="60%">
</div>

We notice two things.
* The graph is heavily balanced to the left. 
Most of the requests took very little time.
* On the right end of the spectrum we also see a couple of request. 
This are the coldstarts that occur the first time a Lambda Function is invoked.

From the XRAY service map we can see that on average the Lambda Function took 174 milliseconds to execute.
 
<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/service-map.png" width="70%" height="70%">
</div>

### Cold start vs warm performance
We can further dissect a coldstart with XRAY.

<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/coldstart.png" width="80%" height="80%">
</div>

We see that:
* Bootstrapping the runtime and code in the vpc lambda took 1.7 seconds.
* Next the initial connection is being made to the database which takes 5 seconds. 
This connection overhead is also there when using AWS native database.
Though then it will be smaller.
* Saving the actual item took 1.1 second.

That's for the first execution of the Lambda Function.
How does this compare against a Lambda function that is already "warm".

<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/warm-execution.png" width="80%" height="80%">
</div>

Now we notice:
* Total execution took only 18 ms.
* There is no longer any initialization overhead.
* Storing the item took 6 ms.

## Performance conclusions

* Storing items in the database when the Lambda Function is already warm is blazingly fast.
* Initializing the connection in case of a coldstart adds time to the coldstart.


# Connect your Lambda Functions with your MongoDB Atlas Cluster
Wanna know how to set up a VPC peering connection between your AWS VPC and MongoDB Atlas Cluster?
Read on.. 

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
If you have trouble figuring out the relation between the `CIDR block` and the `Network Range` use one of the online converters to help you. ([https://www.ipaddressguide.com/cidr](https://www.ipaddressguide.com/cidr){:target="_blank" rel="noopener noreferrer"}) )  
Give your VPC and public subnet a name.  
Make sure that `enable DNS hostnames` is enabled.

<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/3-VPC-with-single-public-subnet-2.png" width="100%" height="100%">
</div>

Your VPC has been successfully created.

<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/4-VPC-successfully-created.png" width="70%" height="70%">
</div>

You will now notice that a new subnet and two new route tables have been created.  
That is a route table for your VPC and a route table specifically for your public subnet.

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
**This has to be a dedicated cluster which means you'll need at least an M10.**

<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/Setup-m10-cluster.png" width="70%" height="70%">
</div>

Wait till your cluster is set up.

<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/m10-is-setup.png" width="70%" height="70%">
</div>

In the Atlas UI navigate to `Security` -> `Network Access`.  
Hit `+ new peering connection` and select AWS as cloud provider.  
The below screen will pop up. Here you have to specify some configuration.
* Account ID: your AWS account Id which you can find under the 'My Account' in the AWS console
* VPC-id: Fill in the VPC-id that you copied from the vpc that you just created in AWS
* VPC CIDR: specify the CIDR block that you used to configure your vpc with on AWS
* region: the region where you created the AWS vpc

<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/8-setup-peering-connection-atlas.png" width="70%" height="70%">
</div>

Hit `Instantiate peering` !


<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/9-pending-peering-connection.png" width="70%" height="70%">
</div>

Notice that MongoDB created an `Atlas CIDR` which specifies the IP range in which your Atlas cluster will reside.  
We are connecting the Atlas IP range with the IP range of our AWS VPC, hence VPC peering.

The peering connection is now pending.   

Go back to AWS.

## The AWS side (again)
In the VPC service of AWS go to `Peering Connections`.  
You will a new peering request with stats `Pending Acceptance`.
<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/10-aws-peering-connection-request.png" width="70%" height="70%">
</div>

Accept this peering request!

Now you have to update your routing tables.
AWS will also ask you `Do you want to update your routing tables` when you accept the peering request.  
We will deploy our Lambda Functions in the public subnet of our VPC.
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
This takes a couple of minutes.

<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/13-peering-available.png" width="100%" height="100%">
</div>

### Deploy your lambda functions!

Deploy your Lambda functions to your VPC and test them out!  
Deploy them into the public subnet that we just created and as security group specify the security group of your AWS VPC.  
In the Lambda User Interface of the AWS Console you will now see that the Lambda Function has been deployed in the correct subnet with the right security group.

<div style="text-align: center;" >
  <img src="/img/2019-09-27-Combining-MongoDB-Atlas-and-AWS-Lambda/14-lambda-in-vpc.png" width="70%" height="70%">
</div>



## Useful links
* [https://docs.atlas.mongodb.com/security-vpc-peering/](https://docs.atlas.mongodb.com/security-vpc-peering/)
* [https://aws.amazon.com/xray/](https://aws.amazon.com/xray/)
* [https://www.mongodb.com/compare/mongodb-dynamodb](https://www.mongodb.com/compare/mongodb-dynamodb)
* [https://www.educba.com/mongodb-vs-dynamodb/](https://www.educba.com/mongodb-vs-dynamodb/)
* [https://www.mongodb.com/blog/post/optimizing-aws-lambda-performance-with-mongodb-atlas-and-nodejs](https://www.mongodb.com/blog/post/optimizing-aws-lambda-performance-with-mongodb-atlas-and-nodejs)