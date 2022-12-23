---
layout: post
authors: [yolan_vloeberghs, robbe_de_proft]
title: 'Accelerating your slow Java Lambda with AWS Lambda SnapStart'
image: /img/20221009-renovate/logo.png
tags: [aws, lambda, snapstart, cloud, spring, java]
category: Cloud
comments: true
---

- [Introduction](#introduction)
- [What is SnapStart?](#what-is-snapstart)
- [Using SnapStart](#using-snapstart)
- [Conclusion](#conclusion)

## Using SnapStart
To investigate the improvement in execution speed when using Lambda SnapStart, we wrote a simple lambda function in Java using [Spring Cloud Function](https://spring.io/projects/spring-cloud-function){:target="_blank" rel="noopener noreferrer"}.
This lambda function, when invoked, will retrieve some dummy JSON data from a REST API and return it to the user.
We made use of [AWS SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html){:target="_blank" rel="noopener noreferrer"} to build and deploy our lambda function to AWS.
To enable the use of AWS SnapStart when publishing a new version of the lambda function, we need to include the following two lines in the `Properties` section of the lambda function resource in the `template.yaml` file used by SAM:
```
SnapStart:
  ApplyOn: PublishedVersions
```

When we manually invoked the $LATEST version of our lambda function, meaning SnapStart was not used, AWS provided us with the following summary:
<img src="{{ '/img/2022-12-23-aws-lambda-snapstart-spring-cloud-function/summary-cold-start.jpeg' | prepend: site.baseurl }}" alt="Summary lambda without SnapStart" class="image fit">

We can see an **Init** duration of around 2.7s.

TODO:
- Explain we published a new version using the Console
- Show new version (image)
<img src="{{ '/img/2022-12-23-aws-lambda-snapstart-spring-cloud-function/summary-snapstart.jpeg' | prepend: site.baseurl }}" alt="Summary lambda with SnapStart" class="image fit">