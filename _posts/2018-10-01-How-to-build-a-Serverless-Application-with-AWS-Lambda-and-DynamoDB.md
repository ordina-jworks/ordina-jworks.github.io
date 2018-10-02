---
layout: post
authors: [nick_van_hoof]
title: 'Create a Serverless Application with AWS Lambda and DynamoDB'
image: /img/2018-10-01-How-to-Build-a-Serverless-Application/AWS-Lambda-and-DynamoDB.png
tags: [AWS,Lambda,DynamoDB,API GateWay,Serverless]
category: Cloud
comments: true
---

# Table of content
1. [Introduction](#introduction)
2. [Serverless: What & Why](#serverless-what--why)
3. [What we will build](#what-we-will-build)
4. [Prerequisites](#prerequisites)
6. [DynamoDB](#dynamodb)
7. [Lambda: scan DynamoDB](#lambda-scan-dynamodb)
8. [API Gateway: Access the scan Lambda](#api-gateway-access-the-scan-lambda)
9. [Lambda: Write to DynamoDB](#lambda-write-to-dynamodb)
10. [API Gateway: Access the write Lambda](#api-gateway-access-the-write-lambda)
11. [What is next?](#what-is-next)
12. [Extra resources](#extra-resources)

# Introduction
Ready to create a serverless application?  
New to AWS and curious to learn more?  
Read on and learn more about the AWS services by building a serverless app!

<div style="text-align: center;">
  <img src="/img/2018-10-01-How-to-Build-a-Serverless-Application/Introduction-Components.png" width="100%" height="100%">
</div>

# Serverless: What & Why
> A serverless architecture is a way to build and run your applications without having to think about infrastructure.
You no longer have to maintain servers to run your applications, databases and storage systems.  

And most of all, **it is so easy!**  ![boom-sparkles](/img/2018-10-01-How-to-Build-a-Serverless-Application/Boom-Sparkles.png)

Yes, once you get the hang of it, it really is mind-blowingly easy.
However, first you need to know the basic infrastructure to set up a serverless application.
Let's do this!

# What we will build
Join me in building a serverless application in which users can give great coding tips to each other. 
To keep it as simple as possible we will build everything through the **AWS Console** and focus on the infrastructure.
No need to deploy any code from your computer to AWS.

## Demo
I could show you a frontend that uses our serverless backend to give and get coding tips.
But that would be an extra layer between you and our serverless application.
Here, I am triggering the app with **Curl**.

Post a new Coding Tip to the database:
```bash
curl -X POST \
    https://k5p4u1y2we.execute-api.eu-west-1.amazonaws.com/default/tips \
    -H 'Content-Type: application/json' \
    -d '{
    "author": "Nick",
    "tip": "Learn by doing",
    "category": "General"
  }'
```
A new item was added to the CodingTips database.
I added a few already and can retrieve them too.
View all the Coding Tips that are currently in the database:
```bash
curl -X GET https://k5p4u1y2we.execute-api.eu-west-1.amazonaws.com/default/tips
```
<div style="text-align: center;">
  <img src="/img/2018-10-01-How-to-Build-a-Serverless-Application/Check_Item_Is_Added_To_Table.png" width="60%" height="60%">
</div>


## Architecture
<div style="text-align: center;">
  <img src="/img/2018-10-01-How-to-Build-a-Serverless-Application/AWS-Lambda-and-DynamoDB-Architecture.png" width="100%">
</div>

The coding tip items are stored in a NoSQL database AWS **DynamoDB**.
There are two **Lambda Function** in play.
One to **GET** the coding tip items from the database and one to **POST** a new coding tip item to the database.
The user can access these Lambda Functions through an API provided by the AWS **API Gateway** service.
This Gateway will redirect to the right Lambda Function based on the HTTP method (POST or GET).
Both Lambda Functions are connected to **CloudWatch** where you can view the logs of your functions.
**AWS IAM** is used to give the services the right permissions to connect to each other.


# Prerequisites
To follow along you need:
* an AWS account.
If you do not have one already, you can create one by following these steps from the official guidelines:
[Create an AWS account](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account){:target="_blank" rel="noopener noreferrer"}.  
You have to provide a credit card number to create an account.
Don't worry! 
The **AWS-Free-Tier** provides plenty of resources that widely exceed what you will use for this tutorial.
If you ask me, AWS is really offering a fantastic amount of stuff for free.
You should be grateful for this, it will give you plenty of time to get to know the AWS Services.
* coding enthusiasm

# DynamoDB
> Amazon DynamoDB is a fully managed NoSQL database service that provides fast and predictable performance with seamless scalability.
-- from AWS docs: <a target="_blank" href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html">https://docs.aws.amazon.com/amazondynamodb</a>

Create a database to store your items.
Login to the AWS Console and under **Services** go to _**DynamoDB**_.
Click on **Create table**.  
Name the table **CodingTips**. 
As primary key make a *Partition key*  `author`, type `String`'.
Check the **Add sort key** checkbox and choose `date`, type `Number` as a sort key for your table.
Leave the default settings checked and hit **Create**. 

<div style="text-align: center;">
  <img src="/img/2018-10-01-How-to-Build-a-Serverless-Application/DynamoDB-CodingTips-Created-Empty-Full.png" width="100%">
</div>

Notice the **Amazon Resource Name ARN** property.
We will use this later to point to this DynamoDB table.  
You just created the DynamoDB table that the application will use.
Awesome!

## Add elements to CodingTips table
Manually add some elements to the CodingTips table.
Go to the CodingTips table, open the **Items** tab and click **Create item**.
Add a couple of random items to the table as shown in the image below.
Notice that **date** is in **milliseconds**.
These are the milliseconds that have past since the Unix Epoch 1970-01-01.
For example, `1538368878527` equals Mon 1 October 2018 06:41:18.
Hit **Save** to store the item in the database.

<div style="text-align: center;">
  <img src="/img/2018-10-01-How-to-Build-a-Serverless-Application/DynamoDB-CodingTips-Add_Item.png" width="100%">
</div>

I added a couple of items as you see in the image below.

<div style="text-align: center;">
  <img src="/img/2018-10-01-How-to-Build-a-Serverless-Application/DynamoDB-CodingTips-Random_Items_Added.png" width="100%">
</div>  

Notice that I did not add a coding tip yet.
We will do this later by using a Lambda Function!

# Lambda: Scan DynamoDB
> AWS Lambda is a compute service that lets you run code without provisioning or managing servers. 
AWS Lambda executes your code only when needed and scales automatically, from a few requests per day to thousands per second.
-- from AWS docs: <a target="_blank" href="https://docs.aws.amazon.com/lambda/latest/dg/welcome.html">https://docs.aws.amazon.com/lambda</a>

Let's build a Lambda that scans the DynamoDB table for our items.
In the AWS Console under **Services** navigate to **Lambda**.
Click the **Create Function** button to start creating a Lambda.
Choose **Author from Scratch** and start configuring it with the following parameters:
* Name: CodingTips_Scan
* Runtime: Node.js 8.10
* Role: Create a custom role

<div style="text-align: center;">
  <img src="/img/2018-10-01-How-to-Build-a-Serverless-Application/Lambda-CodingTips_Scan-Create_From_Scratch.png" width="100%">
</div>  

Selecting **Create a custom role** will take you to another page to create this new role.
The role is used to give the Lambda Function the right permissions.
Configure the role as shown in the image below.
If everything went well you should only have to adapt the name of the role.
Name it `lambda_dynamodb_codingtips`.
The rest will be automatically generated for you.
<div style="text-align: center;">
  <img src="/img/2018-10-01-How-to-Build-a-Serverless-Application/Role-Create_New_Role.png" width="100%">
</div>
Click **Allow**.

Hit **Create function** to create the Lambda.
This will open the designer view of your Lambda Function.

<div style="text-align: center;">
  <img src="/img/2018-10-01-How-to-Build-a-Serverless-Application/Lambda-CodingTips_Scan-Designer_View-Initial.png" width="100%">
</div>

One thing is missing here.
The Lambda Function has the authority to send its logs to CloudWatch.
This authority is given by the role we just gave it.
However, it is mentioned nowhere that it has the right to access the CodingTips table.
We should arrange this too.

## Configuring the Role for the Lambda Function
> AWS Identity and Access Management (IAM) is a web service that helps you securely control access to AWS resources. 
You use IAM to control who is authenticated (signed in) and authorized (has permissions) to use resources.
-- from AWS docs: <a target="_blank" href="https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html">https://docs.aws.amazon.com/IAM</a>

Under AWS Services navigate to **IAM** (Identity and Access Management).
Under roles find the **lambda_dynamodb_codingtips** role and click it.
It has one policy (for the CloudWatch logs) attached to it already.
Click **Add inline policy** and go to the **JSON** tab. 
In the JSON tab add the following JSON to configure this new policy.
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

Click **Review policy** and name it `Lambda-DynamoDB-CodingTips-Access`.
Hit **Create policy**.
You now attached a new policy to the existing **lambda_dynamodb_codingtips** role.
The role summary looks like this:

<div style="text-align: center;">
  <img src="/img/2018-10-01-How-to-Build-a-Serverless-Application/Role-lambda_dynamodb_codingtips_access.png" width="100%">
</div>

Go back to the designer view of the CodingTips_Scan Lambda.
Now you see that the Lambda Function has the right to connect to the DynamoDB table.

<div style="text-align: center;">
  <img src="/img/2018-10-01-How-to-Build-a-Serverless-Application/Lambda-CodingTips_Scan-Designer_View-DynamoDB-CloudWatch.png" width="100%">
</div>    

## Function Code
Yeah, finally it is time for some code!  
In the configuration window of the lambda add the code in the **Function code** block.
'`index.js` has to contain the following code:
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

**Save** the Lambda Function to persist the changes.  

* The `handler` function is the function where the Lambda execution starts when the Lambda is triggered.
* The `event` parameter contains the data from the event that triggered the function.
* The `scanningParameters` are used to configure the scan of the table.
* This function scans the DynamoDB table for the first 100 items it finds.
* `docClient.scan(scanningParameters, function(err,data)` executes the scan and returns either the result or the error that occurred.

## Test write-Lambda
All right! Let's test this thing..
On the Lambda Function configuration page you see a dropdown and test button in the upper right corner.
Click the dropdown and configure a new test event.
I called mine `Test` and added an empty test event `{}`.

<div style="text-align: center;">
  <img src="/img/2018-10-01-How-to-Build-a-Serverless-Application/Lambda-CodingTips_Scan-Created_Empty_Test_Event.png" width="60%" height="60%">
</div>  

**Save** it and you are ready to test the Lambda.  
From the dropdown select your test event and hit the **Test** button!
Nice one, this returns the items in your table:

<div style="text-align: center;">
  <img src="/img/2018-10-01-How-to-Build-a-Serverless-Application/Lambda-CodingTips_Scan-Execution_Result_Succeeded.png" width="100%">
</div>

# API Gateway: Access the scan Lambda
Mmmh, fine.. We can trigger the Lambda Function with a test event.
But we want to be able to trigger it from anywhere using a URL.
In the designer view of the lambda you can still see **add triggers from the left**.
Well, let's add that trigger!
To expose a Lambda Function AWS provides the **API Gateway**.

Under **Services** navigate to **API Gateway**. 
> Amazon API Gateway is a fully managed service that makes it easy for developers to create, publish, maintain, monitor, and secure APIs at any scale. 
With a few clicks in the AWS Management Console, you can create an API that acts as a “front door” for applications -- from AWS docs: <a target="_blank" href="https://aws.amazon.com/api-gateway/">https://aws.amazon.com/api-gateway</a>

Basically this is the Service you use to create all of your API's.  
* Click **Create API** and name your api **CodingTips**
* Add a description if you like
* Leave the **Endpoint Type** to regional and **Create API**

<div style="text-align: center;">
  <img src="/img/2018-10-01-How-to-Build-a-Serverless-Application/API_Gateway-GET-Create_API.png" width="100%">
</div>
 
The API has been created.
Configure it by adding a resource.

* Under **Actions** click **Create Resource** and name it **tips** with **/tips** as **Resource Path**
* Check **Enable CORS** to make your API accessible from anywhere
* Hit **Create Resource**

Time to configure the HTTP GET request.

* Select the **/tips** endpoint
* Under **Actions** select **Create Method** and select **GET**.
* Integration type is **Lambda Function**
* As **Lambda Function** provide the name of the lambda.
In this case that is Codingtips_Scan.
* Save the configuration.

<div style="text-align: center;">
  <img src="/img/2018-10-01-How-to-Build-a-Serverless-Application/API_Gateway-GET-Configuration.png" width="100%">
</div>

Only one thing left: select the API and under **Actions** click **Deploy API**. 
You will be asked to provide a name for the **stage**. 
Name it `default`.

In the **Stages** tab click the **GET** method and copy the **Invoke URL**.

<div style="text-align: center;">
  <img src="/img/2018-10-01-How-to-Build-a-Serverless-Application/API_Gateway-GET-Invoke_URL.png" width="100%" width="100%">
</div>

This is your gateway to trigger the lambda.
Since we just created a HTTP GET request you can use either your **browser**, **Curl** or **Postman** to do this.
In a browser tab past the **Invoke URL**. 

<div style="text-align: center;">
  <img src="/img/2018-10-01-How-to-Build-a-Serverless-Application/API_Gateway-GET-Invoke_Browser.png" width="60%" width="60%">
</div>

From the command line with Curl execute this command with your own **Invoke URL**:

```bash
curl -X GET https://k5p4u1y2we.execute-api.eu-west-1.amazonaws.com/default/tips
```

Either of the above actions will return the items in the CodingTips table!

**Congratulations**, you just created your first serverless app!  
![party](/img/2018-10-01-How-to-Build-a-Serverless-Application/Party.png)


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
* Trouble with **API Gateway**:
    * [Enable API Gateway logging](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-logging.html){:target="_blank" rel="noopener noreferrer"}

# Lambda: Write to DynamoDB
Users should be able to **POST** new items to the table.
This is possible when we create a **Lambda Function** to **write** to the database.


## Create write-Lambda
In the AWS Console under **Services** navigate to **Lambda**.
Click the **Create Function** button to start creating a Lambda.
Choose **Author from Scratch** and start configuring it with the following parameters:
* Name: CodingTips_Write
* Runtime: Node.js 8.10
* Role: Choose an existing role
* Existing role: lambda_dynamodb_codingtips

**Create** the function.
The **CodingTips_Write** Lambda Function already has access to **CloudWatch** and **DynamoDB**.
This is because we gave it the existing **lambda_dynamodb_codingtips** role that has policies which allow these access.
The designer view of the Lambda Function now looks like this:

<div style="text-align: center;">
  <img src="/img/2018-10-01-How-to-Build-a-Serverless-Application/Lambda-CodingTips_Write-Designer_View-Connected_With_DynamoDB.png" width="100%">
</div>

## Function Code
Let's add the code of this function!  
In the configuration window of the lambda add the code in the **Function code** block.
Enter the following code in the `index.js` file:

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

What happens in this Lambda Function:
* The `event` parameter of the `handler` function contains the data from the event that triggered the function.
* The `params` are used to configure the scan of the table.
* The `Item` object contains the data that has to be put into the table.
* The `Item` not only contains the **Date** and **Author**, but also other attributes like the `Tip` itself and `Category`..
That's allowed because it is a NoSQL database. 
The `MonthAtrribute`, `YearAttribute` and `YearMonthAttribute` are added automatically.
* `docClient.put(params, function(err,data)` executes the write and returns either the result or the error that occurred.


## Test write-Lambda
Configure a new test event called **test** and add the following JSON attributes:
```javascript
    {
      "author": "Nick",
      "tip": "Don't hesitate to ask for help when you need it",
      "category": "General"
    }
```

Save it and test the lambda by hitting the test button.

**Execution result: succeeded**? 
Go to the CodingTips table and you will see a new item that was added into your table.

<div style="text-align: center;">
  <img src="/img/2018-10-01-How-to-Build-a-Serverless-Application/DynamoDB-CodingTips-Input_Item_Via_Write_Lambda.png" width="100%">
</div>

# API Gateway: Access the write Lambda
Again we need to expose our Lambda Function via an **API Gateway** so that users can post messages to it.
* Under **Services** navigate to **API Gateway**. 
* Click the **CodingTips** API that we created already for the GET Request.
* You need to add a **HTTP POST Method** to this API.
Under **Resources** click `/tips`, **Actions**, **Create Method** and select **POST**.
The **Integration Type** is Lambda Function.
The name of that Lambda function is **CodingTips_Write**, which we just created.

<div style="text-align: center;">
  <img src="/img/2018-10-01-How-to-Build-a-Serverless-Application/API_Gateway-POST-configuration.png" width="100%">
</div>

* Hit **Save** to create the new method.
* When AWS asks you, add the permission to the Lambda Function

We want to pass a JSON object to this API.
The API in turn has to pass on the JSON to the Lambda.
To enable this, click on **Integration Request** and under Mapping Templates check **When there are no templates defined (recommended)**

<div style="text-align: center;">
  <img src="/img/2018-10-01-How-to-Build-a-Serverless-Application/API_Gateway-POST-Method_Execution.png" width="100%">
</div>

**Add mapping template** with Content-Type **application/json**.
Add this template and **save**:
```javascript
{
  "author": $input.json('$.author'),
  "tip": $input.json('$.tip'),
  "category": $input.json('$.category')
}
```

<div style="text-align: center;">
  <img src="/img/2018-10-01-How-to-Build-a-Serverless-Application/API_Gateway-POST-Mapping_Template.png" width="100%">
</div>

Under **Actions** click **Deploy API**. 
You will be asked to provide a name for the **stage**. 
Select the `default` stage and **Deploy**.
In the **Stages** tab there is an **Invoke URL**.

<div style="text-align: center;">
  <img src="/img/2018-10-01-How-to-Build-a-Serverless-Application/API_Gateway-POST-Deployed.png" width="100%">
</div>

This is your gateway to trigger the lambda.
Since we just created a HTTP POST request you can use either **Curl** or **Postman** to do this.
From the command line with Curl execute this command with your own **Invoke URL**:

```bash
curl -X POST \
    https://k5p4u1y2we.execute-api.eu-west-1.amazonaws.com/default/tips \
    -H 'Content-Type: application/json' \
    -d '{
    "author": "Nick",
    "tip": "Learn by doing",
    "category": "General"
  }'
```

You just added a tip to the CodingTips table!
This can be checked by invoking the GET method of the API Gateway we designed in the beginning of this article.
Use your browser or curl to check the items in the table.
```bash
curl -X GET https://k5p4u1y2we.execute-api.eu-west-1.amazonaws.com/default/tips
```
<div style="text-align: center;">
  <img src="/img/2018-10-01-How-to-Build-a-Serverless-Application/Check_Item_Is_Added_To_Table.png" width="60%" height="60%">
</div>

## Common errors
* **Missing Authentication Token**:
    * Check whether the **Mapping Template** under the Integration Request of your API Gateway is correct
    * Check the URL you are trying to invoke.
    * Made changes to the API Gateway? Make sure to redeploy the API.
* **Lambda Exceptions**:
    * Check CloudWatch for logs.
    Under **Services** go to **CloudWatch**.
    In the **Logs** tab access the **Log Group** `/aws/lambda/CodingTips_Write` to view the logs of the Lambda.
* Trouble with **API Gateway**:
    * [Enable API Gateway logging](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-logging.html){:target="_blank" rel="noopener noreferrer"}

# What is next
Some suggestions to keep you busy:
* Query DynamoDB instead of scanning
* Create GSI (Global Secondary Index) to query and sort
* Create a frontend that uses this serverless infrastructure as backend
* Deploy this infrastructure with **AWS Cloudformation**
* Deploy using a Jenkins pipeline
* Run locally with **SAM Local**

# Extra resources
* AWS Lambda: [AWS Lambda Introduction](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html){:target="_blank" rel="noopener noreferrer"}
* AWS DynamoDB: [AWS DynamoDB Introduction](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html){:target="_blank" rel="noopener noreferrer"}
* AWS API Gateway: [AWS API Gateway](https://aws.amazon.com/api-gateway){:target="_blank" rel="noopener noreferrer"}
* AWS IAM: [AWS IAM Introduction](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html){:target="_blank" rel="noopener noreferrer"}
* AWS CloudWatch: [Getting started with AWS CloudWatch](https://aws.amazon.com/cloudwatch/getting-started/){:target="_blank" rel="noopener noreferrer"}
* Using the DynamoDB docClient: [AWS DocClient Example](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-document-client.html){:target="_blank" rel="noopener noreferrer"}


