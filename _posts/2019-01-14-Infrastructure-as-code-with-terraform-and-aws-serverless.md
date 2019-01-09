---
layout: post
authors: [nick_van_hoof]
title: 'Infrastructure as code: Terraform and AWS Serverless'
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

# Infrastructure as code
Infrastructure as Code (IaC) is a way of managing your devices and servers that run you code through machine-readable definition files. 
Basically, you write down how you want your infrastructure to look and what code should be run on that infrastructure. 
Then with a push of a button you say "Deploy my infrastructure". 
BAM, there is your application, running on a server, against a database, available through an API, ready to be used!
And you just defined all of that infrastructure using Iac.

> Iac is a key practice of a DEVOPS team and will be part of the CI/CD pipelines.

# Introduction
I will demonstrate IaC by working out an example. 
We are going to set up an application on aws.
A user can enter a coding tip and see all the coding tips that other users have entered.
The tips are stored in a nosql database which is aws DynamoDB.
Storing and retrieving these tips is done by the Lambda Functions which fetch or put the tips from and to the database.
For the application to be useful users have to be able call these Lambda Functions.
So we expose the Lambda Functions through aws ApiGateway. 
Here is an architectural overview of the application:

<div style="text-align: center;">
  <img src="/img/2019-01-14-Infrastructure-as-code-with-terraform-and-aws-serverless/AWS-Serverless-Architecture.png" width="100%" height="100%">
</div>

You could couple these functions to a web page where users can enter tips and see all tips that have been given.
Below you see the final result:

TODO: add GIF demo of app

Let's dive in!

# Create the application

I will now go over the steps to setup the application you see in the demo above.
IaC is the main focus.
I will show the code and aws cli commands that are necessary but I will not explain them in detail since that is not the purpose of this blog.

## Prerequisites
* install terraform
* install aws cli 
* checkout the repository: TODO: reference to repository
* being ready to get your mind blown by IaC

## Terraform: the basics
The main things you'll be configuring with terraform are resources.
Resources are the components of your application infrastructure.
E.g: a Lambda Function, an Api Gateway Deployment, a DynamoDB database..
A resource is defined by using the keyword `resource` followed by the `type` and the name.
The name can be arbitrarily chosen.
The type is fixed.
For example:
`resource "aws_dynamodb_table" "codingtips-dynamodb-table"`

To follow along with this blogpost you have to know 2 basic terraform commands.

> terraform apply

Terraform apply will start provisioning all the infrastructure you defined.
Your databases will be created.
Your lambda functions will be set up.
The ApiGateway will be set in place.

> terraform destroy

Terraform destroy will remove all the infrastructure that you have set up in the cloud.
If you are using terraform correctly you should not have to use this command.
However should you want to start over, you can remove all the existing infrastructure with this command.
No worries, you will still have all the infrastructure neatly described on your machine cause you are using Infrastructure as Code.

We'll put all infrastructure that is defined using terraform in the same folder.
The files need to have a `.tf` extension.

## General
Let's start out by creating a file `general.tf`.

```hcl-terraform
provider "aws" {
  region = "eu-west-1"
}

# variables
variable "lambda_version"     { default = "1.0.0"}
variable "s3_bucket"          { default = "codingtips-node-bucket"}
```

The `provider` block specifies that we are deploying on aws.
You also have the possibility to mention credentials used for deploying here.
If you have correctly setup the aws cli on your machine there will be default credentials in your .aws folder.
If no credentials are specified terraform will use these default credentials.

Variables have a name which we can reference from anywhere in our terraform configuration. 
For example we could reference the s3_bucket variable with `${var.s3_bucket)`.
This is handy when you are using the same variable on multiple places.
I will not use too many variables through tis blogpost since that will add more references to your terraform configuration and I want it to be as clear as possible.

## Database: DynamoDB

<div style="text-align: center;">
  <img src="/img/2019-01-14-Infrastructure-as-code-with-terraform-and-aws-serverless/icon-DynamoDB.png" width="30%" height="30%">
</div>

Let's start with the basis.
Where will all our coding tips be stored? 
That's right, in the database.
This database is part of our infrastructure and will be defined in a file I named `dynamo.tf`

```hcl-terraform
resource "aws_dynamodb_table" "codingtips-dynamodb-table" {
  name = "CodingTips"
  read_capacity = 5
  write_capacity = 5
  hash_key = "Author"
  range_key = "Date"

  attribute = [
    {
      name = "Author"
      type = "S"
    },
    {
      name = "Date"
      type = "N"
    }]
}
```

Since Dynamo is a NoSql database we don't have to specify all attributes upfront.
The only thing we have to provide are the elements for aws to build the partition key with.
When you provide a hash key as well as a sort key aws will combine these to make a unique partition key.
Mind the word UNIQUE.
Make sure this combination is unique.

> DynamoDB uses the partition key value as input to an internal hash function. 
The output from the hash function determines the partition (physical storage internal to DynamoDB) in which the item will be stored. 
All items with the same partition key value are stored together, in sorted order by sort key value.
-- from AWS docs: <a target="_blank" href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html">https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html</a>

From the attribute definitions in dynamo.tf it is clear that Author (S) is a string and Date should be a number (N)

## IAM
<div style="text-align: center;">
  <img src="/img/2019-01-14-Infrastructure-as-code-with-terraform-and-aws-serverless/icon-IAM.png" width="30%" height="30%">
</div>

Before specifying the Lambda Functions we create all the permissions for our functions.
Basically, this is making sure that our functions have permissions to access other resources (like DynamoDB).
Without going to deep into it the aws permission model works as follows:
* you give a resource a role
* to this role you add permissions
* these permissions give it access to other resources:
** either permission for triggering an other resource (eg. Lambda Function forwards logs to CloudWatch)
** or permission for being triggered by an other resource (eg. Lambda Function may be triggered by ApiGateway)

```hcl-terraform
# ROLES
# IAM role which dictates what other AWS services the Lambda function
# may access.
resource "aws_iam_role" "lambda-iam-role" {
  name = "codingtips_lambda_role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

# POLICIES
resource "aws_iam_role_policy" "dynamodb-lambda-policy"{
  name = "dynamodb_lambda_policy"
  role = "${aws_iam_role.lambda-iam-role.id}"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:*"
      ],
      "Resource": "${aws_dynamodb_table.codingtips-dynamodb-table.arn}"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "cloudwatch-lambda-policy"{
  name = "cloudwatch-lambda-policy"
  role = "${aws_iam_role.lambda-iam-role.id}"
  policy = "${data.aws_iam_policy_document.api_gateway_logs_policy_document.json}"
}

data "aws_iam_policy_document" "api_gateway_logs_policy_document" {
  statement {
    actions = [
      "logs:CreateLogStream",
      "logs:CreateLogGroup",
      "logs:PutLogEvents"
    ],
    resources = [
      "arn:aws:logs:*:*:*"
    ]
  }
}

```

In the example above the first resource that is defined is an `aws_iam_role`.
This is the role that we will later give to our Lambda Functions.

Then, we create `aws_iam_role_policy` resources to attach the role.
The first `aws_iam_role_policy` is giving this role permission to invoke any action on the specified DynamoDB resource.
The second role_policy allows a resource with this role to send logs to CloudWatch.

A couple of thins to notice:
* The `aws_iam_role` and the `aws_iam_role_policy` are connected by the `role` argument of the role_policy resource
* In the `statement` attribute of the `aws_iam_role_policy` we grant (Effect attr.) permission to do some actions (Action attr.) on a certain Resource (Resource attr.)
* A resource is referenced by its `arn` or *Amazon Resource Name* which uniquely identifies this resource on aws
* There are two ways to specify an `aws_iam_role_policy`: 
** the first using the `untill EOF` syntax
** the second using a separate terraform `data` element.

## Lambda Functions

<div style="text-align: center;">
  <img src="/img/2019-01-14-Infrastructure-as-code-with-terraform-and-aws-serverless/icon-Lambda.png" width="30%" height="30%">
</div>

There are two Lambda Functions that are part of this application.
One Lambda Function to get or retrieve the coding tips from the database further referenced as the `getLambda`.
One Lambda Function to post or send the coding tips to the database further referenced as the `postlambda`.

I am not going to copy paste the code of the Lambda Functions in here.
You can check it out in the repository linked to this blog (TODO: add link to repository)

Here I give the example for the getLambda.
The postLambda is deployed in the same way and you can the IaC definitions in the repo.
A Lambda Function is a little different from the other infrastructure we define here.
Not only do we need a Lambda Function as infrastructure.
We also need to specify the code that runs in this Lambda Function.
But where will aws find that code when deploying the Lambda Function.
They don't have access to your local machine, haven't they?
That is why you first need to ship your code to a `S3 Bucket` in the cloud where it can be found when your Function is being deployed.

That also means creating an S3 Bucket, which you can do with this command when you want it in region eu-west-1 (Ireland):
`aws s3api create-bucket --bucket codingtips-node-bucket --region eu-west-1 --create-bucket-configuration LocationConstraint=eu-west-1`

Now you have to zip the code of your Lambda Functions:
`zip -r getLambda.zip index.js`
And upload that file to s3:
`aws s3 cp getLambda.zip s3://codingtips-node-bucket/v1.0.0/getLambda.zip`
Mind that I am sending it to a bucket named *codingtips-node-bucket* in a folder *v1.0.0* with filename *getLambda.zip*

Okay, the code is where it needs to be.
Now let's see how we specify these functions using terraform.

```hcl-terraform
resource "aws_lambda_function" "get-tips-lambda" {
  function_name = "codingTips-get"

  # The bucket name as created earlier with "aws s3api create-bucket"
  s3_bucket = "${var.s3_bucket}"
  s3_key = "v${var.lambda_version}/getLambda.zip"

  # "main" is the filename within the zip file (index.js) and "handler"
  # is the name of the property under which the handler function was
  # exported in that file.
  handler = "index.handler"
  runtime = "nodejs8.10"
  memory_size = 128

  role = "${aws_iam_role.lambda-iam-role.arn}"
}

resource "aws_lambda_permission" "api-gateway-invoke-get-lambda" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.get-tips-lambda.arn}"
  principal     = "apigateway.amazonaws.com"

  # The /*/* portion grants access from any method on any resource
  # within the specified API Gateway.
  source_arn = "${aws_api_gateway_deployment.codingtips-api-gateway-deployment.execution_arn}/*/*"
}
```

