---
layout: post
authors: [nick_van_hoof]
outbound: [tech_blog_how-to-build-a-serverless-application-with-aws-lambda-and-dynamodb]
title: 'Monitoring serverless apss on AWS'
image: /img/2019-08-31-Monitoring-serverless-apps-on-AWS/featured-image.png
tags: [AWS, Serverless, Lambda, DynamoDB, API Gateway, CloudWatch]
category: Cloud
comments: true
---

# Table of content
[Challenges of Serverless applications](#challenges-of-serverless-applications)
[Optional solutions](#optional-solutions)
[CloudWatch logs](#cloudwatch-logs)
[Monitoring with AWS CloudWatch Dashboards](#monitoring-with-aws-cloudwatch-dashboards-metrics-dashboards-alerting)
[Xray Distributed Tracing](#xray-distributed-tracing)
[Monitoring your serverless environment](#monitoring-your-serverless-environment)
[Third Party Tools](#third-party-tools)
[Conclusion](#conclusion)
[Resources](#resources)

# What about?
Serverless is a great technology that comes with the advantage of being scalable, durable and high availability.  
It allows you to decouple functionality into multiple serverless Functions.  
You'll read about these advantages everywhere.  
What you'll read less about is the challenges that come with it.
Having an application that exist of a lot of decoupled lambda functions means that your serverless landscape will be heavily distributed.  
I mean that a lot of stuff happens in a lot of different places.  
We still want to be able to monitor our landscape though.  
This means that a distributed serverless landscape has to be observable.  
Let's see some of the best practices on how to make your serverless landscape observable. 

# Challenges of Serverless applications
What does a typical serverless application look like?  
Let's look at an app that was build for a conference. 
Speakers can create a session that they want to speak about. 
People can also retrieve all sessions that have already been submitted


<div style="text-align: center;">
  <img src="/img/2019-08-31-Monitoring-serverless-apps-on-AWS/simpler-architecture.png" width="100%" height="100%">
</div>

The serverless architecture above is actually quite small.
I've seen architectures containing tens of Lambda Functions and other AWS services.

* heavily distributed landscape
* each service is producing there own logs
* each service is running concurrently
* how do you relate all these logs
* how do you trace it back, find out which function executions make up one transaction
* What if it goes wrong? Where did it go wrong? Can you find the culprit(s)? 
* How can I be alerted in case in case it goes wrong? 

All these questions trace back to having a landscape that is observable.
Thus allowing you to monitor it which gives you visibility on what happened in your landscape.

I can do this myself. I know my technical landscape!
Yes, but!?
When crossing the 5 or 10 functions range, most teams quickly discover challenges in understanding their systems, and some even refer to it has “log hell"

# Optional solutions
* Optimize the information in your logs
* Get the maximum out of your logs
  * Structuring
  * Querying

* Know your metrics
* Monitoring via dashboards
* Alerting

* Distributed tracing
  * link function executions by transaction

* Monitoring custom metrics
* Solution: A solid design with eye for monitoring, distributed tracing and logging

* third party tools

We are going to talk a lot about CloudWatch today.
Anyhow, what's in a word? 
It's literally the service to Watch what happens in your Cloud environment.
And that is exactly the environment we want to monitor.

# CloudWatch logs
* CloudWatch logs in general
* Lambda has a build in agent for logging
* Default start end log -> report logs

## Serverless logging:
During the execution of a Lambda function you can write logs to standard out.
The CloudWatch logs agent will forward them asynchronously to CloudWatch without adding any execution time.

* Cloudwatch:
* * LogGroup: one per function
* * LogStreams: one per container instance
* * retention period
* * subscription

* Lambda
At the end of every invocation, Lambda publishes a REPORT log message with detail about the max amount of memory used by your function during this invocation, and how much time is billed.
To cut costs you can monitor billed duration vs duration and memory vs memory used.
You could even create a custom metric for this and visualise it.

## Logging: Structured logging
**Why**  
Normal writes to stout are unstructured text data. 
This makes them unsuited for querying.
That in turn makes it harder to get the right information out of them.
You could parse a normal log to get some info out of them (I'll show you how further down).
Still, that is error prone and will be break once someone changes the log statement.

As a developer, it would be nice to be able to filter all logs by a certain functional key # or transaction #.
The goal of structured logging is to solve these sorts of problems and allow additional analytics.

**What is structured logging**  
* add contextual information (2)
[comment]: <> (TODO: example of normal log vs structured log)

* filter log messages, searching log files (4)
* structured format (3): This makes it possible for you to analyze your logs like you would analyse data. 
A log is no longer just text, it became kind of like a database entry that can be queried. 
This allows summaries and analytics to take place and help you monitor your application and troubleshoot issues faster.
* Process log files for further analytics or BI applications
* Use an other lambda that subscribes to the logGroup to process this data into a metric 

**why do you need structured logging in serverless applications**
* Highly distributed applications
* a lot of functions processing the flow that was initialised by the same request.
Correlate them via a field that marks the transaction.
This can be something like a traceId or correlationId.
More about that later in the post.
* * add traceId -> correlate logs corresponding to the same request

* How do you implement structured logging?
This is language specific.
In Java we're talking about configureing Logback, slf4j2..
In JavaScript you'd have to overload the log function.

## CloudWatch Log Insights
* What? Querying your log data
* AWS has it's own query language for Log Insights.  
The language will feel familiar to most of you since it has some touchpoints with SQL and other third party monitoring tools.
* Examples and visualisations: 
[comment]: <> (TODO: example of queries and visualisations)
* Exporting these dashboards?
* No centrilisation!
But recently: query over multiple log groups!
[comment]: <> (TODO: visualize)



# Monitoring with AWS CloudWatch Dashboards: Metrics, Dashboards, Alerting
CloudWatch has this metrics tab.
Out of the box AWS provides four lambda metrics: Errors, Duration, Throttles and Invocations.
[comment]: <> (TODO: visualize the metrics )

These are the standard Metrics for a serverless application.
CloudWatch metrics for AWS services are only granular down to 1 minute interval (custom metrics can be granular down to 1 second)
They can be a few minutes behind (for custom metrics you can have less lag because you can record them at 1 second interval)
CloudWatch Logs are usually more than 10s behind (not precise measurement, but based on personal observation)


* Creating CloudWatch dashboards: You can add these metric visualisations to a dashboard that gives you a visual overview.
In these dashboards you can also add the visualisations from your Log Insight queries.
And custom metrics that you created (more further on in the post)
[comment]: <> (TODO: example of a dashboard)


* Alarms and alerting: eg. slack and email.
The alarm an action based on the value of the metric relative to the threshold over a period of time.
That means that you can configure the threshold at which you want to be notified.
And the length of the period that the metric is above this threshold before the alarm goes of.
The alarm will publish an event to an sns topic.
You can then listen on these events and send out an email or a slack notification.

# Xray: distributed tracing
Serverless architectures are like microservices: distributed systems.
Remember the schema of the technical landscape I showed above?
You need ID which you can use to correlate requests in different services and thereby trace a full transaction that started with an incoming event.
A function can receive an http request and put a message on a SNS topic.
A second function listens on this topic and puts an item in a database.
The database stream triggers an other function.
This third function asynchronously calls a fourth function.
I can go on like this for quite a while. 
The point is that a single incoming http request might trigger functions all over in the landscape.
Luckily AWS has a service that can help us out: XRay.
* explain the problem:
Searching for a needle in a haystack. For example a problem with a sales number but the log you search for does not contain the sales number
**concepts**
*sampling
* querying: Xray query language
* Visualitation
[comment]: <> (TODO: demonstrate by example)
* segments

**shortcomings**
*Always 200
*You cannot trace asynchronous requests: no tracing over DynamoDB Streams, SQS, SNS topics.
AWS is working on this however I heard.

Xray is all about behavior.
It makes it easy to analyze the behavior of your distributed serverless applications. 
AWS X-Ray is a great tool which allows you to trace and instrument your code to gain extra visibility into what’s going on.
 It also enables you to zoom in on different parts of your code and identify the parts that are lacking.
 [comment]: <> (TODO: example of a trace with slow subsegments)

# Implement your own tracing solution
Since Xray is not tracing async requests, you could implement your own tracing solution.
However, is that really what you want to be doing?
I always here all this fuzz about focusing on the business value. 
Plus, implementing your own tracing solution is hard.
You'll find enough battle stories online.
On this point I'm agreeing with the third party monitoring solutions.
If you want to have this capability, outsource it, use a third party tool.

# Monitoring your serverless environment
[comment]: <> (TODO: work out example of a custom metric)
* custom cloudwatch metrics
You can send custom metrics to CloudWatch by making an additional network call.
But this will add time to your lambda function's execution time and thereby impacting your user.
It is also possible to create a custom REPORT log (like the START and END log of AWS remember).
These logs are send async to CloudWatch anyway.
There they will be picked up as a custom metric.

Two custom metrics that I recommend are.
These are not about health monitoring.
They're about monitoring your budget.
* execution time vs billed duration
[comment]: <> (TODO: HowTo)
* provisioned memory vs memory used
[comment]: <> (TODO: HowTo)

### Third Party Tools
**lumigo**: 
* demo movie
**Splunk**:
* story about my experience
**New Relic**: short mention


### Conclusion
Monitoring does not have to be difficult.
It is important to know whay your doing.
And if you do, you'll slay the monitoring monster.


# Resources
1. https://theburningmonk.com/2017/09/tips-and-tricks-for-logging-and-monitoring-aws-lambda-functions/
2. https://theburningmonk.com/2018/01/you-need-to-use-structured-logging-with-aws-lambda/
3. https://www.loggly.com/blog/why-json-is-the-best-application-log-format-and-how-to-switch/
4. https://stackify.com/what-is-structured-logging-and-why-developers-need-it/

7. custom connect traces: https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-nodejs-subsegments.html
8. slidehare on monitoring: https://www.slideshare.net/AmazonWebServices/monitoring-and-troubleshooting-in-a-serverless-world-srv303-reinvent-2017



NOTES

XRAY service graph
```shell script
EPOCH=$(date +%s)
aws xray get-service-graph --start-time $(($EPOCH-600)) --end-time $EPOCH
```

Search on annotation
(service(id(name: "conference-create-session-lambda", type: "AWS::Lambda"))) AND Annotation.StoreInDatabase = "DynamoDB"