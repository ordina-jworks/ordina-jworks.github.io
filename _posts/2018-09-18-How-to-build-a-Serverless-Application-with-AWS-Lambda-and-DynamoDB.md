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
3. [Lambda: Writing to DynamoDB](#lambda:-writing-to-dynamodb)


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
  <img src="/img/2018-09-18-How-to-Build-a-Serverless-Application/AWS-lambda-and-DynamoDB.png" width="100%">
</div>

# Prerequisites
To follow along you need:
* an AWS account.
If you do not have one already, you can create one by following these steps from the official guidelines:
[Create an AWS account](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account){:target="_blank" rel="noopener noreferrer"}.  
**{Creditcard    ? }**
* coding enthusiasm

# Lambda: Writing to DynamoDB
As a first step create a database to store the input from your users.

## Create database
Login to the AWS Console and under **Services** go to _**DynamoDB**_.
Click on **Create table**.  
Name the table **CodingTips**. 
As primary key choose *Partition key* choose `author`, type `String`'.
Check the **Add sort key** checkbox and choose `date`, type `Number` as a sort key for your table.
Leave the default settings checked and click  **Create table**. 
~~Explanation about primary key~~
<div style="text-align: center;">
  <img src="/img/2018-09-18-How-to-Build-a-Serverless-Application/DynamoDB-CodingTips-Created-Empty-Full.png" width="100%">
</div>
Notice the **Amazon Resource Name ARN** property.
We will use this later to point to this DynamoDB table.  
You just created the DynamoDB table that the application will use.

## Create write-Lambda
~~(split role and lambda configuration in diff parts?)~~
In the AWS Console under **Services** navigate to **Lambda**.
Click the **Create Function** button to start creating a Lambda.
Choose **Author from Scratch** and start configuring it with the following parameters:
* Name: CodingTips_Write
* Runtime: Node.js 8.10
* Role: Create a custom role

Selecting **Create a custom role** will take you to another page to create this new role.
Configure it as shown in the image below.
If everything went well you should only have to adapt the name of the role.
The rest will be automatically generated for you.
<div style="text-align: center;">
  <img src="/img/2018-09-18-How-to-Build-a-Serverless-Application/Role-lambda_dynamodb_codingtips.png" width="100%">
</div>
Click **Create role**
The configuration of your Lambda Function now looks like this:
Screen Shot 2018-09-20 at 07.37.59.png


Hit **Create function** to create the Lambda.
This will open the designer view of your Lambda Function.

<div style="text-align: center;">
  <img src="/img/2018-09-18-How-to-Build-a-Serverless-Application/Lambda-CodingTips_Write-Designer_View.png" width="100%">
</div>

One thing is missing here.
The Lambda Function has the authority to send its logs to CloudWatch.
However, it is nowhere mentioned that it has the right to access the CodingTips table.
We should arrange this too.



## Configuring the Role for the Lambda Function
Under AWS Services navigate to **IAM** (Identity and Access Management).
Under roles find the **lambda_dynamodb_codingtips** role and click it.
It has one policy (for the CloudWatch logs) attached to it already.
Click **Add inline policy** and go to the **JSON** tab. 
Add the following JSON to configure this new policy.
Add the **arn** that points to your own CodingTips table!
You can find this in the Overview tab of your table which we showed above.

```javascript
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": "dynamodb:*",
            "Resource": "arn:aws:dynamodb:eu-west-1:389795768041:table/CodingTips"
        }
    ]
}
```

Click **Review policy** and name it Lambda-CodingTips_Write-DynamoDB-CodingTips.
Hit **Create policy**.
You now attached a new policy the existing **lambda_dynamodb_codingtips** role.
The role summary looks like:

<div style="text-align: center;">
  <img src="/img/2018-09-18-How-to-Build-a-Serverless-Application/Role-lambda_dynamoDB_codingtips-summary.png" width="100%">
</div>

In the designer view of the CodingTips_Write Lambda you see that the Lambda Function is connected to the DynamoDB table.

<div style="text-align: center;">
  <img src="/img/2018-09-18-How-to-Build-a-Serverless-Application/Lambda-CodingTips_Write-Designer_View-Connected_With_DynamoDB.png" width="100%">
</div>

~~more explanation about how roles and policies work~~

## Function Code
Yeah, finally it is time for some code!  
In the configuration window of the lambda add the code in the **Function code** block.
'index.js' has to contain the following code:
```javascript
console.log('function starts')

const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({region: 'eu-west-1'})

exports.handler = function(event, context, callback){
    console.log('processing event: ' + JSON.stringify(event, null, 2))

    let currentMonth = new Date().getMonth() + 1 
    let currentYear = new Date().getFullYear()

    let params =  {
        Item: {
            Date: Date.now(),
            Author: event.author ? event.author : "Anonymous",
            Tip: event.tip,
            Category: event.category,
            MonthAttribute: currentMonth,
            YearAttribute: currentYear,
            YearMonthAttribute: currentYear + "-" + currentMonth
        },

        TableName: 'CodingTips'
    };

    docClient.put(params, function(err,data){
        if(err) {
            callback(err, null)
        }else{
            callback(null, data)
        }
    });

}
```

Save the Lambda Function to persist the changes. 

~~exports.handler = function(event, context, callback) explanation~~
~~explain functionality~~

## Test write-Lambda
Allright! Let's test this thing out..
On the Lambda Function configuration page you see a dropdown and test button in the upper right corner.
Click the dropdown and configure a new test event.
I called mine 'test' and added the following JSON attributes:
```javascript
    {
      "author": "Nick",
      "tip": "Don't hesitate to ask for help when you need it",
      "category": "General"
    }
```

Save it and you are ready to test the Lambda.  
From the dropdown select your test event and hit the test button!

If all went well this is what the result should look like:

<div style="text-align: center;">
  <img src="/img/2018-09-18-How-to-Build-a-Serverless-Application/Test-Event-Success.png" width="100%">
</div>

# API Gateway: Access the Lambda
Mmmh, fine.. We can trigger the Lambda Function with a test event.
But using an url we want to be able to trigger it from anywhere.
In the designer view of the lambda you can still see **add triggers from the left**.
Well, let's add that trigger!
To expose a Lambda Function AWS provides the API Gateway.

Under **Services** navigate to API Gateway. 
> Amazon API Gateway is a fully managed service that makes it easy for developers to create, publish, maintain, monitor, and secure APIs at any scale. 
With a few clicks in the AWS Management Console, you can create an API that acts as a “front door” for applications -- from docs <a target="_blank" href="https://aws.amazon.com/api-gateway/">https://aws.amazon.com/api-gateway/</a>

Basically this is the Service you use to create all of your API's.  
* Click **Create api** and name your api **CodingTips**
* Add a description if you like
* Leave the **Endpoint Type** to regional and **create**
 
The API is created.
Configure it by adding a resource.

* Under **Actions** click **Create Resource** and name it **tips** with **/tips** as **Resource Path**
* Check **Enable CORS** to make your API accessible from anywhere
* Hit **Create Resource**

Time to configure the HTTP GET request.

* Select the **/tips** endpoint
* Under **Actions** create the **POST** method
* Integration type is **Lambda Function**
* As Lambda Function provide the name of the lambda.
In this case that is CodingTips_Write

<div style="text-align: center;">
  <img src="/img/2018-09-18-How-to-Build-a-Serverless-Application/API-Gatewy-POST-Configuration.png" width="100%">
</div>

We want to pass parameters to this API.
The API in turn has to pass this parameters further to the Lambda.
To enable this click on **Integration Request** and under Mapping Templates check 'When there are no templates defined (recommended)'
**Add mapping template** with Content-Type application/json.
Add this template and save:
```javascript
{
  "author": $input.json('$.author'),
  "tip": $input.json('$.tip'),
  "category": $input.json('$.category'),
}
```

Only one thing left: Select the api and under **Actions** click **Deploy API**. 
You will be asked to provide a name for the **stage**. 
I choose to name it `dev`.

<div style="text-align: center;">
  <img src="/img/2018-09-18-How-to-Build-a-Serverless-Application/API_Gateway-POST-deployed.png" width="100%">
</div>
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

