---
layout: post
authors: [yolan_vloeberghs, robbe_de_proft]
title: 'Accelerating your slow Java Lambda with AWS Lambda SnapStart'
image: /img/2022-12-23-aws-lambda-snapstart-spring-cloud-function/header.png
tags: [aws, lambda, snapstart, cloud, spring, java]
category: Cloud
comments: true
---

- [Introduction](#introduction)
- [What is SnapStart?](#what-is-snapstart)
  - [Versions](#versions)
  - [Pricing](#pricing)
  - [Limitations](#limitations)
    - [Uniqueness](#uniqueness)
    - [Networking](#networking)
    - [Ephemeral data](#ephemeral-data)
- [Using SnapStart](#using-snapstart)
- [Conclusion](#conclusion)

## Introduction
If you use [AWS Lambda](https://aws.amazon.com/lambda/){:target="_blank" rel="noopener noreferrer"} in combination with Java runtimes, you will notice (or probably have already noticed) that one of the main setbacks is the cold start time.
A cold start refers to the process where a Lambda is invoked for the first time and the Lambda has to be initialized.
AWS needs to create a new function instance and spin it up with every [initialization](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html#runtimes-lifecycle-ib){:target="_blank" rel="noopener noreferrer"}.

Depending on your environment and application size, it can take up to 10 seconds to complete the init phase.
Especially when using frameworks such as Spring Boot where features like dependency injection and component scanning can take a lot of time to initialize.
This is a delay that most, if not all consumers and customers want to avoid as it significantly slows down your application flow in some situations.
**Do mind** that this is only during the init phase; once the Lambda instance is running, the cold start process is over until the next time your Lambda needs to be instantiated again.

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2022-12-23-aws-lambda-snapstart-spring-cloud-function/lambda-execution-lifecycle.png' | prepend: site.baseurl }}" alt="Lambda execution lifecycle" class="image center" style="margin:0px auto; max-width:100%">
_Lambda execution environment lifecycle - without SnapStart - [Best practices of advanced serverless developers (AWS re:Invent 2021)](https://www.youtube.com/watch?v=dnFm6MlPnco){:target="_blank" rel="noopener noreferrer"}_
{: refdef}

AWS has always recognized the problem and now comes with a solution called [Lambda SnapStart](https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html){:target="_blank" rel="noopener noreferrer"}.

## What is SnapStart?
Introduced at AWS re:Invent 2022, AWS [Lambda SnapStart](https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html){:target="_blank" rel="noopener noreferrer"} is the newest feature to eliminate the cold start problem by initializing the function when you publish a new version of a Lambda.
It takes a snapshot, through [Firecracker](https://firecracker-microvm.github.io/){:target="_blank" rel="noopener noreferrer"} which AWS uses to run Lambda and Fargate, encrypts and caches it so it can be instantly accessed whenever it is required.
When a Lambda is invoked and needs to set up a new instance, it will simply use the cached snapshot, which greatly improves startup times (officially up to 10x).

### Versions
By default, SnapStart is disabled.
You can enable it, but only for published Lambda versions.
This means that it only works for versions that are published on the AWS account and that it is not implemented on the $[LATEST] tag. If you want to make use of Lambda SnapStart, be sure to do so on a published version.
The snapshot of your Lambda is created upon the version publishing process.

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2022-12-23-aws-lambda-snapstart-spring-cloud-function/snapstart-overview.png' | prepend: site.baseurl }}" alt="SnapStart overview" class="image center" style="margin:0px auto; max-width:100%">
_SnapStart overview - snapshot gets created during version publishing - [AWS Lambda SnapStart (AWS re:Invent 2022)](https://www.youtube.com/watch?v=ZbnAithBNYY){:target="_blank" rel="noopener noreferrer"}_
{: refdef}

### Pricing
The SnapStart feature comes with AWS Lambda and has no additional pricing.

### Limitations
While SnapStart is a great feature and can save time in Lambda cold starts, it also comes with its limitations.
SnapStart currently does not support the following features and services:
- [provisioned concurrency](https://docs.aws.amazon.com/lambda/latest/dg/provisioned-concurrency.html){:target="_blank" rel="noopener noreferrer"}
- arm64 architecture
- the [Lambda Extensions API](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-extensions-api.html){:target="_blank" rel="noopener noreferrer"}
- [EFS](https://aws.amazon.com/efs/){:target="_blank" rel="noopener noreferrer"}
- [X-Ray](https://aws.amazon.com/xray/){:target="_blank" rel="noopener noreferrer"}
- Ephemeral storage up to 512 MB
- Limited to Java 11 runtime

#### Uniqueness
SnapStart always requires your snapshot to be unique. 
This means that if you have initialization code that generates unique content, it might not always be unique in the snapshot once it is restored in other Lambda invocations.
The goal is to generate this content after the initialization process, so it is not part of the snapshot.
Luckily, AWS has provided a [documentation page](https://docs.aws.amazon.com/lambda/latest/dg/snapstart-uniqueness.html){:target="_blank" rel="noopener noreferrer"} in which they provide best practices on how to tackle that problem.
They even came up with a [SpotBugs plugin](https://github.com/aws/aws-lambda-snapstart-java-rules){:target="_blank" rel="noopener noreferrer"}  which finds potential issues in your code that could prevent SnapStart from working correctly.

#### Networking
Network connections are not being shared across different environments.
Thus, if network connections (for example, to other AWS services such as an RDS or SQS) are instantiated in the initialization phase, they will not be shared and will most likely fail when the snapshot is being used later again.
Although most popular frameworks have automatic database connection retries, it is worth the time to make sure that it works correctly.

#### Ephemeral data
Data that is fetched or temporary (for example a password or secret) should be fetched after the initialization phase.
Otherwise, it will save the secret in the snapshot, meaning that authentication failures (and security risks) might occur once the initial secret value has expired or has been changed.

## Using SnapStart
To investigate the improvement in cold start execution time when using AWS Lambda SnapStart, we wrote a simple Lambda function in Java 11 using [Spring Cloud Function](https://spring.io/projects/spring-cloud-function){:target="_blank" rel="noopener noreferrer"}.
This Lambda function, when invoked, will retrieve some JSON data from a [dummy REST API](https://dummyjson.com/){:target="_blank" rel="noopener noreferrer"} and return it to the user.
The code can be found on [Github](https://github.com/ordina-jworks/aws-lambda-snapstart-spring-boot){:target="_blank" rel="noopener noreferrer"}.

We made use of the [AWS Serverless Application Model (SAM)](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html){:target="_blank" rel="noopener noreferrer"} to build our Lambda function and deploy it to AWS.
Enabling the SnapStart feature can be easily done by adding the following two lines to the `Properties` section of the Lambda function resource in the `template.yaml` file used by AWS SAM:
```
SnapStart:
  ApplyOn: PublishedVersions
```

We started by invoking our Lambda function's unpublished version ($LATEST), in which case SnapStart is not used, and received the following summary from AWS:

<img src="{{ '/img/2022-12-23-aws-lambda-snapstart-spring-cloud-function/lambda-cold-start.png' | prepend: site.baseurl }}" alt="Summary lambda without SnapStart" class="image fit">

We can observe an **Init duration** of around 2.7s, i.e. the time that is spent initializing the execution environment for our Lambda function.

Next, we manually published a new version of our Lambda function using the AWS Console.
This can be done by navigating to the _Versions_ tab of our Lamdba function and pressing the _Publish new version_ button.

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2022-12-23-aws-lambda-snapstart-spring-cloud-function/lambda-versions.png' | prepend: site.baseurl }}" alt="Lambda function verions" class="image fit">_Versions tab listing all published versions of a Lambda function._
{: refdef} 

Invoking this newly published version provides us with the following summary:

<img src="{{ '/img/2022-12-23-aws-lambda-snapstart-spring-cloud-function/lambda-snapstart.png' | prepend: site.baseurl }}" alt="Summary lambda with SnapStart" class="image fit">

In this case, we can see SnapStart is used.
The initialization of the execution environment, represented by the **Init duration** we saw earlier, now happens when publishing the new version.
Only the restoration of the snapshot, represented by the **Restore duration**, is performed now.

It is quite clear that using Lambda SnapStart is advantageous in most cases.
We managed to decrease the cold start execution time of our Lambda function from almost 5s (**Init duration** + **duration**) to around 2.6s (**Restore duration** + **duration**), just by enabling this feature.

## Conclusion
SnapStart is a great feature and can save a lot of time in your application flow.
It's a feature that should have been present already as it comes a bit too late. 
But now that it is here, Java developers should take measures in order to implement this as it can save a lot of time in cold-starting their Java Lambdas.
We would have liked to see it implemented by default when you create a version, but sadly, this is not the case (yet).
It comes only for Java, which is understandable as Java Lambdas face this obstacle the most. 
Still, we certainly won't be surprised if AWS decides to release this feature for other languages and/or frameworks.

Altogether we can definitely recommend using this new feature for your Java Lambdas.
