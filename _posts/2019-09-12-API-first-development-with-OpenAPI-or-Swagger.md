---
layout: post
authors: [nick_van_hoof]
title: 'API first development with OpenAPI or Swagger'
image: /img/2019-09-12-API-first-development-with-OpenAPI-or-Swagger/featured-image.png
tags: [API]
category: Cloud
comments: true
---

# Table of content


# API first development - Why, how and what
> Great communication is key to great software engineering.

Not only between people.
Also between application or services.
If your applications cannot communicate properly, you'll never be able to expose the functionality that is key to a good product.

We also see the following trends in software engineering:
* **Shift towards the cloud.**  
Instead of big monolitic applications we are building lot's of smaller (micro)services.
All communication between those services goes though the API.
* **Multiple frontend applications use the same backend.**  
And often these applications are created by separate teams.
* **API's carry business value.**  
Yes, there is money in your API.
An API exposes the functionality of your product.
A good API allows user to integrate with your product with ease.
Thus making your product a great choice.

In all of the cases a above there is value (even money!) in good communication between services.
And that's why you should practice API first development.
Put your communication first!

***What do I need to do to practice API first development?***
* Understand that the API is the interface for your application.  
It is the intersection where multiple services join hands to couple there functionality.
* First design your API.  
The implementation comes next.
This will allow teams to develop there applications separately because they both know and understand how communication between the services will happen.
The contract between services is set.

Now that we understand the importance of and value of API first design let's see how the Swagger/OpenAPI spec can help you with that.

# Story
Suppose that we ***Ordina*** are hosting a conference where multiple technical and agile sessions will be given.
User can check session information and register for sessions.
A backend service maintains this information.
The website is exposing the information.
There is also an app for `Android` and one for `IOS`.
The API endpoint that gives you all the sessions is also publicly exposed to allow developers to have some fun with it.
So we have multiple services interacting with the backend.
<div style="text-align: center;">
  <img src="/img/2019-09-12-API-first-development-with-OpenAPI-or-Swagger/design.png" width="50%" height="50%" target="_blank">
</div>
 
From now on I will be speaking about OAS (OpenAPI Specification) instead of writing OpenAPI/Swagger all the time.
Let's now use OAS to help us with our API First approach.

# API first development with OpenAPI/Swagger
Let me introduce you to [https://editor.swagger.io](https://editor.swagger.io).
A portal to visualise your OAS.
Easy to use and offering all the functionality we need for this example.

I'll keep it simple and create the OAS for the API exposing the endpoint where consumers of the API can fetch all sessions of the conference.
The OAS allows you to use JSON or Yaml to describe your API.

// TODO: replace by gif that switches between views

<div style="text-align: center;">
  <img src="/img/2019-09-12-API-first-development-with-OpenAPI-or-Swagger/apioverviewyml.png" width="100%" height="100%">
</div>

You can dive deeper into an endpoint by clicking it.

<div style="text-align: center;">
  <img src="/img/2019-09-12-API-first-development-with-OpenAPI-or-Swagger/apiyml.png" width="100%" height="100%">
</div>
  
Find the descriptive yaml via [this](https://gist.github.com/Nxtra/8ff9a7fd33186309e909df8f5a20cb28) gist.

As you can see from the example the OpenAPI specification is very readable.
Even if it's new to you, you should be able to deduct what is written in the yaml.
You like looking in the yaml?
Sure you don't! 
There is this great visualisation to the right of it.
This very clearly visualises what your API can do.
Clear visualisations mean clear communication. 

The example is quite short.
Describing a whole API, the file might become large.
But that's no problem.
The OpenAPI spec allows you to split your definitions over multiple files which you can reference from within other files.

> Takeaways: Easy descriptive language & great visualisations

You want to expose your beautiful visualisation to your clients.
They shouldn't have to past a `yaml` file in a window of there browser all the time.
How do we do that? 
Let's find out next.

# Hosting your visualisations
# swagger code gen: generate code via cli
# swagger code gen: generate code via maven / gradle plugin
# swagger with Spring
# swagger with API Gateway on AWS
# generate consumer driven contract testing?







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
