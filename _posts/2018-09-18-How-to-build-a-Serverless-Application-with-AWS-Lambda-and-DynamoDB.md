---
layout: post
authors: [nick_van_hoof]
title: 'Serverless Application with AWS Lambda and DynamoDB'
image: /img/2018-09-18-How-to-Build-a-Serverless-Application/AWS-Lambda-and-DynamoDB.png
tags: [AWS,Lambda,DynamoDB,API GateWay,Serverless]
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
However, first you need to know the basic infrastructure to set up a serverless application.
Let's do this!

# What we will build
Join me in building a Serverless application in which users can give great coding tips to eachother. 
To keep it as simple as possible we will build everything through the aws console and focus on the infrastructure.
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
You have to provide a credit card number to create an account.
Don't worry! 
The **AWS-Free-Tier** provides plenty of resources that widely exceed what you will use for this tutorial.
If you ask me, AWS is really offering a fantastic amount of stuff for free.
You should be grateful for this, it will give you plenty of time to get to now the AWS Services.
* coding enthusiasm


# DynamoDB
As a first step create a database to store your items.
Login to the AWS Console and under **Services** go to _**DynamoDB**_.
Click on **Create table**.  
Name the table **CodingTips**. 
As primary key choose *Partition key* choose `author`, type `String`'.
Check the **Add sort key** checkbox and choose `date`, type `Number` as a sort key for your table.
Leave the default settings checked and click  **Create table**. 

<div style="text-align: center;">
  <img src="/img/2018-09-18-How-to-Build-a-Serverless-Application/DynamoDB-CodingTips-Created-Empty-Full.png" width="100%">
</div>

Notice the **Amazon Resource Name ARN** property.
We will use this later to point to this DynamoDB table.  
You just created the DynamoDB table that the application will use.
Awesome!

## Add elements to CodingTips table
Manually add some elements to the CodingTips table.
Go to the CodingTips table, open the **Items** tab and click **Create item**.
Add a couple random items to the table as shown in the image below.
Notice that **date** is in **milliseconds**.
These are the milliseconds that have past since the Unix Epoch 1970-01-01.

<div style="text-align: center;">
  <img src="/img/2018-09-18-How-to-Build-a-Serverless-Application/DynamoDB-CodingTips-Add_Item.png" width="100%">
</div>

I added a couple of items as you see in this image:

<div style="text-align: center;">
  <img src="/img/2018-09-18-How-to-Build-a-Serverless-Application/DynamoDB-CodingTips-Random_Items_Added.png" width="100%">
</div>


## Create scan-Lambda
Let's build a Lambda that scans the DynamoDB table for our items.
In the AWS Console under **Services** navigate to **Lambda**.
Click the **Create Function** button to start creating a Lambda.
Choose **Author from Scratch** and start configuring it with the following parameters:
* Name: CodingTips_Scan
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
However, it is mentioned nowhere that it has the right to access the CodingTips table.
We should arrange this too.

## Configuring the Role for the Lambda Function
Under AWS Services navigate to **IAM** (Identity and Access Management).
Under roles find the **lambda_dynamodb_codingtips** role and click it.
It has one policy (for the CloudWatch logs) attached to it already.
Click **Add inline policy** and go to the **JSON** tab. 
Add the following JSON to configure this new policy.
Add the **arn** that points to your own CodingTips table!
You can find this in the **Overview** tab of your table which we showed above.

```javascript
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "dynamodb:*",
            "Resource": "arn:aws:dynamodb:eu-west-1:389795768041:table/CodingTips"
        }
    ]
}
```

Click **Review policy** and name it Lambda-DynamoDB-CodingTips.
Hit **Create policy**.
You now attached a new policy the existing **lambda_dynamodb_codingtips** role.
The role summary looks like:

<div style="text-align: center;">
  <img src="/img/2018-09-18-How-to-Build-a-Serverless-Application/Role-lambda_dynamodb_codingtips.png" width="100%">
</div>

Go back to the designer view of the CodingTips_Scan Lambda.
Now you see that the Lambda Function has the right to connect to the DynamoDB table.

<div style="text-align: center;">
  <img src="/img/2018-09-18-How-to-Build-a-Serverless-Application/Lambda-CodingTips_Scan-Designer_View-DynamoDB-CloudWatch.png" width="100%">
</div>

## Function Code
Yeah, finally it is time for some code!  
In the configuration window of the lambda add the code in the **Function code** block.
'index.js' has to contain the following code:
```javascript
console.log('function starts');

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'eu-west-1'});

exports.handler = function(event, context, callback){
    console.log('processing event: %j', event);

    let scanningParameters = {
        TableName: 'CodingTips',
        Limit: 100 //maximum result of 100 items
    };

    //In dynamoDB scan looks through your entire table and fetches all data
    docClient.scan(scanningParameters, function(err,data){
        if(err){
            callback(err, null);
        }else{
            callback(null,data);
        }
    });
}
```

Save the Lambda Function to persist the changes.  
What happens in this Lambda Function:
* The handler function is the function where the Lambda execution starts when the Lambda is triggered.
* The event parameter contains the data from the event that triggered the function.
* The `scanningParameters` are used to configure the scan of the table.
* This function scans the DynamoDB table for the first 100 items it finds.
* `docClient.scan(scanningParameters, function(err,data)` executes the scan and returns either the result or the error that occured.

## Test write-Lambda
Allright! Let's test this thing out..
On the Lambda Function configuration page you see a dropdown and test button in the upper right corner.
Click the dropdown and configure a new test event.
I called mine 'Test' and added an empty test event.

<div style="text-align: center;">
  <img src="/img/2018-09-18-How-to-Build-a-Serverless-Application/Lambda-CodingTips_Scan-Created_Empty_Test_Event.png" width="100%">
</div>

Save it and you are ready to test the Lambda.  
From the dropdown select your test event and hit the test button!

This returns the items in your table:

<div style="text-align: center;">
  <img src="/img/2018-09-18-How-to-Build-a-Serverless-Application/Lambda-CodingTips_Scan-Execution_Result_Succeeded.png" width="100%">
</div>


# API Gateway: Access the Lambda
Mmmh, fine.. We can trigger the Lambda Function with a test event.
But we want to be able to trigger it from anywhere using a URL.
In the designer view of the lambda you can still see **add triggers from the left**.
Well, let's add that trigger!
To expose a Lambda Function AWS provides the **API Gateway**.

Under **Services** navigate to **API Gateway**. 
> Amazon API Gateway is a fully managed service that makes it easy for developers to create, publish, maintain, monitor, and secure APIs at any scale. 
With a few clicks in the AWS Management Console, you can create an API that acts as a “front door” for applications -- from aws docs: <a target="_blank" href="https://aws.amazon.com/api-gateway/">https://aws.amazon.com/api-gateway</a>

Basically this is the Service you use to create all of your API's.  
* Click **Create api** and name your api **CodingTips**
* Add a description if you like
* Leave the **Endpoint Type** to regional and **create**

<div style="text-align: center;">
  <img src="/img/2018-09-18-How-to-Build-a-Serverless-Application/API_Gateway-GET-Create_API.png" width="100%">
</div>
 
The API has been created.
Configure it by adding a resource.

* Under **Actions** click **Create Resource** and name it **tips** with **/tips** as **Resource Path**
* Check **Enable CORS** to make your API accessible from anywhere
* Hit **Create Resource**

Time to configure the HTTP GET request.

* Select the **/tips** endpoint
* Under **Actions** create the **GET** method
* Integration type is **Lambda Function**
* As Lambda Function provide the name of the lambda.
In this case that is Codingtips_Scan.
* Save the configuration.

<div style="text-align: center;">
  <img src="/img/2018-09-18-How-to-Build-a-Serverless-Application/API_Gateway-GET-Configuration.png" width="100%">
</div>

Only one thing left: Select the api and under **Actions** click **Deploy API**. 
You will be asked to provide a name for the **stage**. 
Name it `default`.

In the **Stages** tab click the **GET** method and copy the **Invoke URL**. 
This is your gateway to trigger the lambda.
Since we just created a HTTP GET request you can use either your **browser**, **Curl** or **Postman** to do this.
In a browser tab past the **Invoke URL**. 

<div style="text-align: center;">
  <img src="/img/2018-09-18-How-to-Build-a-Serverless-Application/API_Gateway-GET-Invoke_Browser.png" width="100%">
</div>

From the command line with Curl execute this command with your own **Invoke URL**:

```bash
curl -X GET https://k5p4u1y2we.execute-api.eu-west-1.amazonaws.com/default/tips
```

Either of the above actions will return the items in CodingTips table!

**Congratulations**, you just create your first serverless app! :boom: :sparkles:

Did you know:
* performing a scan on a DynamoDB table will return the items in a random order
* you just joined the club of serverless application developers
* you should be proud of yourself

## Common errors
* **Missing Authentication Token**:
    * Check the URL you are trying to invoke.
    Does it have the format 'https://{domain}/{stage}/{method}'.
    **Stage** and **method** were set when creating the API Gateway.
    * **Enable CORS** for your API Gateway
    * Made changes to the API Gateway? Make sure to redeploy the API.
* **Lambda Exceptions**:
    * Check CloudWatch for logs.
    Under **Services** go to **CloudWatch**.
    In the **Logs** tab access the **Log Group** `/aws/lambda/CodingTips_Scan` to view the logs of the Lambda.
* **API Gateway**:
    * [Enable API Gateway logging](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-logging.html)


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

**Execution result: succeeded**? 
Go to the CodingTips table and you will see a new item that was added in your table.

# API Gateway: Access the Lambda
Mmmh, fine.. We can trigger the Lambda Function with a test event.
But using an url we want to be able to trigger it from anywhere.
In the designer view of the lambda you can still see **add triggers from the left**.
Well, let's add that trigger!
To expose a Lambda Function AWS provides the API Gateway.

Under **Services** navigate to API Gateway. 
> Amazon API Gateway is a fully managed service that makes it easy for developers to create, publish, maintain, monitor, and secure APIs at any scale. 
With a few clicks in the AWS Management Console, you can create an API that acts as a “front door” for applications -- from aws docs: <a target="_blank" href="https://aws.amazon.com/api-gateway/">https://aws.amazon.com/api-gateway</a>

Basically this is the Service you use to create all of your API's.  
* Click **Create api** and name your api **CodingTips**
* Add a description if you like
* Leave the **Endpoint Type** to regional and **create**
 
The API is created.
Configure it by adding a resource.

* Under **Actions** click **Create Resource** and name it **tips** with **/tips** as **Resource Path**
* Check **Enable CORS** to make your API accessible from anywhere
* Hit **Create Resource**

Time to configure the HTTP POST request.

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
  "category": $input.json('$.category')
}
```

Only one thing left: Select the api and under **Actions** click **Deploy API**. 
You will be asked to provide a name for the **stage**. 
I choose to name it `dev`.

<div style="text-align: center;">
  <img src="/img/2018-09-18-How-to-Build-a-Serverless-Application/API_Gateway-POST-deployed.png" width="100%">
</div>

In the **Stages** tab there is an **Invoke URL**. 
This is your gateway to trigger the lambda.
Since we just created a HTTP POST request you can use either **Curl** or **Postman** to do this.
From the command line with Curl execute this command with your own **Invoke URL**:

```bash
curl -X POST \
  https://6pwsc1tv9g.execute-api.eu-west-1.amazonaws.com/dev/tips \
  -H 'Content-Type: application/json' \
  -d '{
  "author": "TestAuthor",
  "tip": "Learn by doing",
  "category": "General"
}'
```

## Common errors
* **Missing Authentication Token**:
    * Check if the **Mapping Template** under the Integration Request of your API Gateway is correct
    * Check the URL you are trying to invoke.
    Doest it have the format 'https://{domain}/{stage}/{method}'.
    **Stage** and **method** were set when creating the API Gateway.
    * **Enable CORS** for your API Gateway
    * Made changes to the API Gateway? Make sure to redeploy the API.
* **Lambda Exceptions**:
    * Check CloudWatch for logs.
    Under **Services** go to **CloudWatch**.
    In the **Logs** tab access the **Log Group** `/aws/lambda/CodingTips_Write` to view the logs of the Lambda.
* **API Gateway**:
    * [Enable API Gateway logging](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-logging.html)

# Lambda: Scanning DynamoDB
## Create scan-Lambda
## Test scan-Lambda
## API Gateway: access scan-Lambda

# API GateWay: Exposing your Lambda Functions
## write-Lambda
## scan-Lambda

# Lambda: Query DynamoDB
## Querying one item
## Creating Global Secondary Indexes
## API GateWay: query-lambda

# What's next? 

# Extra resources


