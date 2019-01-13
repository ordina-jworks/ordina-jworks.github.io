---
layout: post
authors: [nick_van_hoof]
title: 'Infrastructure as code: Terraform and AWS Serverless'
image: /img/2019-01-14-Infrastructure-as-code-with-terraform-and-aws-serverless/featured-image.png
tags: [AWS,Lambda,DynamoDB,API GateWay,Serverless, IaC]
category: Cloud
comments: true
---

# Table of content
1. [Infrastructure as Code](#infrastructure-as-code)
2. [Introduction and demo](#introduction-and-demo)
3. [Creating the application](#creating-the-application)
4. [Prerequisites](#prerequisites)
6. [Terraform: the basics](#terraform-the-basics)
7. [General](#general)
8. [Database: DynamoDB](#database-dynamodb)
9. [IAM](#iam)
10. [Lambda Functions](#lambda-functions)
11. [API Gateway](#api-gateway)
12. [Endgame](#endgame)
12. [Resources and further reading](#resources-and-further-reading)

# Infrastructure as Code
Infrastructure as Code (IaC) is a way of managing your devices and servers through machine-readable definition files. 
Basically, you write down how you want your infrastructure to look like and what code should be run on that infrastructure. 
Then, with the push of a button you say "Deploy my infrastructure". 
BAM, there is your application, running on a server, against a database, available through an API, ready to be used!
And you just defined all of that infrastructure using IaC.

> IaC is a key practice of DEVOPS teams and integrates as part of the CI/CD pipeline.

A great Infrastructure as Code tool is Terraform by HashiCorp.
([https://www.terraform.io/](https://www.terraform.io/){:target="_blank" rel="noopener noreferrer"})  
Personally I use it to provide and maintain infrastructure on AWS.
And I've had a great experience doing that.

<div style="text-align: center;">
  <img src="/img/2019-01-14-Infrastructure-as-code-with-terraform-and-aws-serverless/overview.png" width="100%" height="100%">
</div>

# Introduction and demo
I will demonstrate IaC by working out an example. 
We are going to set up an application on AWS.
I provisioned the code on GitLab: [https://gitlab.com/nxtra/codingtips-blog](https://gitlab.com/nxtra/codingtips-blog){:target="_blank" rel="noopener noreferrer"}.
A user can enter a coding tip and see all the coding tips that other users have entered.
The tips are stored in a NoSQL database which is AWS DynamoDB.
Storing and retrieving these tips is done by the Lambda Functions which fetch or put the tips from and to the database.
For the application to be useful, users have to be able to call these Lambda Functions.
So we expose the Lambda Functions through AWS API Gateway. 
Here is an architectural overview of the application:

<div style="text-align: center;">
  <img src="/img/2019-01-14-Infrastructure-as-code-with-terraform-and-aws-serverless/AWS-Serverless-Architecture.png" width="100%" height="100%">
</div>

You could couple these functions to a web page where users can enter tips and see all tips that have been given.
Below you see the final result:

<div style="text-align: center;">
  <img src="/img/2019-01-14-Infrastructure-as-code-with-terraform-and-aws-serverless/demo.gif" width="80%">
</div>

Let's dive in!

# Creating the application
<div style="text-align: center;">
  <img src="/img/2019-01-14-Infrastructure-as-code-with-terraform-and-aws-serverless/icon-terraform.png" width="15%" height="15%">
</div>

I will now go over the steps to set up the application you see in the demo above.
IaC is the main focus.
I will show the code and AWS CLI commands that are necessary but I will not explain them in detail since that is not the purpose of this blog.
I'll focus on the Terraform definitions instead.
You are welcome to follow along by cloning the repository that I linked to in this blog post.

# Prerequisites
* Install Terraform
* Install AWS CLI
* Checkout the repository on GitLab: [https://gitlab.com/nxtra/codingtips-blog](https://gitlab.com/nxtra/codingtips-blog){:target="_blank" rel="noopener noreferrer"}
* Be ready to get your mind blown by IaC

# Terraform: the basics
The main things you'll be configuring with Terraform are resources.
Resources are the components of your application infrastructure.
E.g: a Lambda Function, an API Gateway Deployment, a DynamoDB database, ...
A resource is defined by using the keyword `resource` followed by the `type` and the `name`.
The name can be arbitrarily chosen.
The type is fixed.
For example:
`resource "aws_dynamodb_table" "codingtips-dynamodb-table"`

To follow along with this blog post you have to know two basic Terraform commands.

> terraform apply

Terraform apply will start provisioning all the infrastructure you defined.
Your databases will be created.
Your Lambda Functions will be set up.
The API Gateway will be set in place.

> terraform destroy

Terraform destroy will remove all the infrastructure that you have set up in the cloud.
If you are using Terraform correctly you should not have to use this command.
However should you want to start over, you can remove all the existing infrastructure with this command.
No worries, you will still have all the infrastructure neatly described on your machine because you are using Infrastructure as Code.

We'll put all infrastructure that is defined using Terraform in the same folder.
The files need to have a `.tf` extension.

# General
Let's start out by creating a file `general.tf`.

```hcl-terraform
provider "aws" {
  region = "eu-west-1"
}

# variables
variable "lambda_version"     { default = "1.0.0"}
variable "s3_bucket"          { default = "codingtips-node-bucket"}
```

The `provider` block specifies that we are deploying on AWS.
You also have the possibility to mention credentials that will be used for deploying here.
If you have correctly set up the AWS CLI on your machine there will be default credentials in your `.aws` folder.
If no credentials are specified, Terraform will use these default credentials.

Variables have a name which we can reference from anywhere in our Terraform configuration. 
For example we could reference the `s3_bucket` variable with `${var.s3_bucket)`.
This is handy when you are using the same variable in multiple places.
I will not use too many variables throughout this blog post since that will add more references to your Terraform configuration and I want it to be as clear as possible.

# Database: DynamoDB

<div style="text-align: center;">
  <img src="/img/2019-01-14-Infrastructure-as-code-with-terraform-and-aws-serverless/icon-DynamoDB.png" width="15%" height="15%">
</div>

Let's start with the basis.
Where will all our coding tips be stored? 
That's right, in the database.
This database is part of our infrastructure and will be defined in a file I named `dynamo.tf`.

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

Since Dynamo is a NoSQL database, we don't have to specify all attributes upfront.
The only thing we have to provide are the elements that AWS will use to build the partition key with.
When you provide a hash key as well as a sort key, AWS will combine these to make a unique partition key.
Mind the word UNIQUE.
Make sure this combination is unique.

> DynamoDB uses the partition key value as input to an internal hash function. 
The output from the hash function determines the partition (physical storage internal to DynamoDB) in which the item will be stored. 
All items with the same partition key value are stored together, in sorted order by sort key value.
-- from AWS docs: <a target="_blank" href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html">DynamoDB Core Components</a>

From the attribute definitions in `dynamo.tf` it is clear that `Author` (`S`) is a string and `Date` (`N`) should be a number.

# IAM
<div style="text-align: center;">
  <img src="/img/2019-01-14-Infrastructure-as-code-with-terraform-and-aws-serverless/icon-IAM.png" width="15%" height="15%">
</div>

Before specifying the Lambda Functions we have to create permissions for our functions to use.
This makes sure that our functions have permissions to access other resources (like DynamoDB).
Without going too deep into it, the AWS permission model works as follows:
* Provide a resource with a role
* Add permissions to this role
* These allow the role to access other resources:
    * permissions for triggering another resource (eg. Lambda Function forwards logs to CloudWatch)
    * permissions for being triggered by another resource (eg. Lambda Function may be triggered by API Gateway)

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
```

In the example above, the first resource that is defined is an `aws_iam_role`.
This is the role that we will later give to our Lambda Functions.

We then create the `aws_iam_role_policy` resource which we link to the `aws_iam_role`.
The first `aws_iam_role_policy` is giving this role permission to invoke any action on the specified DynamoDB resource.
The second `role_policy` allows a resource with this role to send logs to CloudWatch.

A couple of things to notice:
* The `aws_iam_role` and the `aws_iam_role_policy` are connected by the `role` argument of the `role_policy` resource
* In the `statement` attribute of the `aws_iam_role_policy` we grant (`Effect` attr.) permission to do some actions (`Action` attr.) on a certain resource (`Resource` attr.)
* A resource is referenced by its *ARN* or *Amazon Resource Name* which uniquely identifies this resource on AWS
* There are two ways to specify an `aws_iam_role_policy`: 
    * using the *until EOF* syntax (like I did here)
    * using a separate Terraform `aws_iam_policy_document` element that is coupled to the `aws_iam_role_policy`
* The `dynamodb-lambda-policy` allows all actions on the specified DynamoDB resource because under the `Action` attribute it states `dynamodb:*`
You could make this more restricted and mention actions like 

```
"dynamodb:Scan", "dynamodb:BatchWriteItem","dynamodb:PutItem"
```

# Lambda Functions

<div style="text-align: center;">
  <img src="/img/2019-01-14-Infrastructure-as-code-with-terraform-and-aws-serverless/icon-Lambda.png" width="30%" height="30%">
</div>

There are two Lambda Functions that are part of this application.
The first Lambda is used to get or retrieve the coding tips from the database further referenced as the `getLambda`.
The second Lambda is used to post or send the coding tips to the database further referenced as the `postlambda`.

I am not going to copy paste the code of the Lambda Functions in here.
You can check it out in the repository linked to this blog 
(GitLab repository: [https://gitlab.com/nxtra/codingtips-blog](https://gitlab.com/nxtra/codingtips-blog){:target="_blank" rel="noopener noreferrer"}).

Here I will demonstrate the example of the `getLambda` function.
The `postLambda` is deployed in the same way and you can find the Terraform definitions in the Git repository.
A Lambda Function is a little different from the other infrastructure we defined here.
Not only do we need a Lambda Function as infrastructure.
We also need to specify the code that runs in this Lambda Function.
But where will AWS find that specific code when deploying the Lambda Function?
They don't have access to your local machine, have they?
That is why you first need to ship your code to a S3 Bucket on AWS where it can be found when your Function is being deployed.

That also means creating an S3 Bucket, which you can do with this command when you want it in region `eu-west-1` (Ireland):
```bash
aws s3api create-bucket --bucket codingtips-node-bucket --region eu-west-1 --create-bucket-configuration LocationConstraint=eu-west-1
```

Now you have to zip the code of your Lambda Functions:
```bash
zip -r getLambda.zip index.js
```

And upload that file to s3:
```bash
aws s3 cp getLambda.zip s3://codingtips-node-bucket/v1.0.0/getLambda.zip
```

Mind that I am sending it to a bucket named `codingtips-node-bucket` in a folder `v1.0.0` with filename `getLambda.zip`.

Okay, the code is where it needs to be.
Now let's see how we specify these functions using Terraform.

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

* Notice that we tell Terraform the S3 Bucket and directory to look for the code
* We specify the runtime and memory for this Lambda Function
* `index.handler` points to the file and function where to enter the code
* The `aws_lambda_permission` resource is the permission that states that this Lambda Function may be invoked by the API Gateway that we created

# API Gateway
 
<div style="text-align: center;">
  <img src="/img/2019-01-14-Infrastructure-as-code-with-terraform-and-aws-serverless/icon-apigateway.png" width="15%" height="15%">
</div>

I kept the most difficult one for last.
On the other hand, it is also the most interesting.
I hand Terraform a *Swagger* definition of my API.
You can also do this without Swagger, but then you will have to specify a lot more resources.

The Swagger API definition looks as follows:
```
swagger: '2.0'
info:
  version: '1.0'
  title: "CodingTips"
schemes:
  - https
paths:
  "/api":
    get:
      description: "Get coding tips"
      produces:
        - application/json
      responses:
        200:
          description: "The codingtips request successful."
          schema:
            type: array
            items:
              $ref: "#/definitions/CodingTip"
      x-amazon-apigateway-integration:
        uri: ${get_lambda_arn}
        passthroughBehavior: "when_no_match"
        httpMethod: "POST"
        type: "aws_proxy"
    post:
      description: "post a coding tip"
      consumes:
        - application/json
      responses:
        200:
          description: "The codingtip was added successfully"
      x-amazon-apigateway-integration:
        uri: ${post_lambda_arn}
        passthroughBehavior: "when_no_match"
        httpMethod: "POST"
        type: "aws_proxy"

definitions:
  CodingTip:
    type: object
    description: "A coding tip"
    properties:
      tip:
        type: string
        description: "The coding tip"
      date:
        type: number
        description: "date in millis when tip was entered"
      author:
        type: string
        description: "Author of the coding tip"
      category:
        type: string
        description: "category of the coding tip"
    required:
      - tip
```

If you do not know Swagger yet, copy the above and paste it in the online ([Swagger Editor](https://editor.swagger.io/){:target="_blank" rel="noopener noreferrer"}).

This will grant you a nice visual overview of the API definition.

<div style="text-align: center;">
  <img src="/img/2019-01-14-Infrastructure-as-code-with-terraform-and-aws-serverless/swagger.png" width="60%" height="60%">
</div>

There is only one AWS specific thing in the Swagger specification above and that is `x-amazon-apigateway-integration`.
This is specifying the details of how the API is integrating with the backend. 
* Remark that this is always a `POST` even if the HTTP method of the resource path is a `GET`
* `aws_proxy` means that the request is passed to the Lambda Function without manipulation
* `when_no_match` passes the request body to the backend without tranforming it when no `requestTemplate` is specified for the `Content-Type` 
* `uri` is referencing a variable eg. `${get_lambda_arn}` that Terraform passes to the Swagger definition
We'll see this in a minute.

As I already mentioned, using Swagger to define your API Gateway has some advantages:
* It keeps your Terraform more concise
* You can use this Swagger to get a nice representation of your API

```hcl-terraform
resource "aws_api_gateway_rest_api" "codingtips-api-gateway" {
  name        = "CodingTipsAPI"
  description = "API to access codingtips application"
  body        = "${data.template_file.codingtips_api_swagger.rendered}"
}

data "template_file" codingtips_api_swagger{
  template = "${file("swagger.yaml")}"

  vars {
    get_lambda_arn = "${aws_lambda_function.get-tips-lambda.invoke_arn}"
    post_lambda_arn = "${aws_lambda_function.post-tips-lambda.invoke_arn}"
  }
}

resource "aws_api_gateway_deployment" "codingtips-api-gateway-deployment" {
  rest_api_id = "${aws_api_gateway_rest_api.codingtips-api-gateway.id}"
  stage_name  = "default"
}

output "url" {
  value = "${aws_api_gateway_deployment.codingtips-api-gateway-deployment.invoke_url}/api"
}
```

* We start by mentioning the `aws_api_gateway_rest_api` resource
It does what is says and provides an API Gateway REST API
    * body references the Swagger file
* The `template_file` datasource allows Terraform to use information that is not defined in Terraform (Swagger in our case)
    * Variables are passed to this `template_file` to fill the file
* For a given `rest-api` to be usable, it has to be deployed
    * This is done by the `aws_api_gateway_deployment` resource
    * It references the REST API
    * It needs a stage which is like a 'version' or 'snapshot' of your API
The stage name will be in the URL to invoke this API.
* At last the URL on which the API can be invoked is outputted to the terminal
`/api` is appended to have the correct resource path

# Endgame
All right, let's see it now.
Does this actually work?
Here I am running `terraform apply` within the repository linked to this blog.

<div style="text-align: center;">
  <img src="/img/2019-01-14-Infrastructure-as-code-with-terraform-and-aws-serverless/apply.gif" width="100%">
</div>

Nice, it worked.
And I only told Terraform about the infrastructure I wanted.
The whole setup process goes automatically!
You can now use the outputted URL to GET and POST coding tips.
The body of the POST should look like:
```json
{
  "author": "Nick",
  "tip": "Short sessions with frequent brakes",
  "category": "Empowerment"
}
```

When you need to couple the API endpoints to a frontend of your own design, you need to set the CORS headers correctly.
If you want this challenge, there is another branch in the repository (`cors-enabled`) where I worked this out.

Happy coding folks, Code that Infrastructure!

# Resources and further reading
* Terraform website: [Terraform.io](https://www.terraform.io/){:target="_blank" rel="noopener noreferrer"}
* Terraform-Lambda-APIGateway: [learn.hashicorp.com](https://learn.hashicorp.com/terraform/aws/lambda-api-gateway){:target="_blank" rel="noopener noreferrer"}
* Swagger editor: [editor.swagger.io](https://editor.swagger.io/){:target="_blank" rel="noopener noreferrer"}
* Swagger official website: [swagger.io](https://swagger.io/){:target="_blank" rel="noopener noreferrer"}

 
