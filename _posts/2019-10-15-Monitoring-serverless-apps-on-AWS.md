---
layout: post
authors: [nick_van_hoof]
outbound: [tech_blog_how-to-build-a-serverless-application-with-aws-lambda-and-dynamodb]
title: 'Monitoring serverless apss on AWS'
image: /img/2019-10-15-Monitoring-serverless-apps-on-AWS/featured-image.png
tags: [AWS, Serverless, Lambda, DynamoDB, API Gateway, CloudWatch]
category: Cloud
comments: false
---

# Table of content
* [What about](#what-about)

* [Challenges of Serverless applications](#challenges-of-serverless-applications)
* [Challenge 1: Finding the error in a distributed serverless landscape](#challenge-1-finding-the-error-in-a-distributed-serverless-landscape)
* [Solution 1: Structured logging](#solution-1-structured-logging)

* [Challenge 2: Finding performance bottlenecks](#challenge-2-finding-performance-bottlenecks)
* [Solution 2: Distributed tracing with Xray](#solution-2-distributed-tracing-with-aws-xray)

* [Challenge 3: Testing whether our application still behaves as expected](#challenge-3-testing-whether-our-application-still-behaves-as-expected)
* [Solution 3a: Smoke Testing](#solution-3a-smoke-testing)
* [Solution 3b: Load Testing](#solution-3b-load-testing)

* [Side note on CloudWatch Dashboards](#side-note-on-cloudwatch-dashboards)
* [Conclusion](#conclusion)
* [Resources](#resources)

# What about?
Serverless is a great technology that comes with the advantage of being scalable, durable and high available.  
It allows you to decouple functionality into multiple serverless Functions.  

Of course with new technologies come also new challenges.
Having an application that exist of a lot of decoupled lambda functions means that your serverless landscape will be heavily distributed.  
I mean that a lot of stuff happens in a lot of different places.  

We still want to be able to monitor our landscape though.  
This means that a distributed serverless landscape has to be observable.  
Let's see some of the best practices on how to make your serverless landscape observable. 

# Challenges of Serverless applications
What does a typical serverless application look like?  

Let's look at an app that was build for a conference. 
Speakers can create a session that they want to speak about. 
People can also retrieve all sessions that have already been submitted.  
When a new session is created a slack notification is sent out.


<div style="text-align: center;">
  <img src="/img/2019-10-15-Monitoring-serverless-apps-on-AWS/simpler-architecture.png" width="100%" height="100%">
</div>

We can identify certain milestones that indicate that a request has passed this milestone.

<div style="text-align: center;">
  <img src="/img/2019-10-15-Monitoring-serverless-apps-on-AWS/simpler-architecture-with-milestones.png" width="100%" height="100%">
</div>

The serverless architecture above is actually quite small.
I've seen architectures containing tens of Lambda Functions and other AWS services.

Some of the challenges that come with a serverless architecture are:
1. It might wrong somewhere in my distributed landscape.
if it does, where did it go wrong?
2. Which part of my flow is performing poorly. 
Let's find the performance bottlenecks.
3. I cannot run all cloud services at my computer.
So I can't run my system locally anymore.
How do I test whether my system is behaving as it is supposed to?
 
In the next part we'll focus on solving these challenges.

# Challenge 1: Finding the error in a distributed serverless landscape
What do we do when stuff goes south?  
We check the logs!

Right, logging tells us the story of what happened in our application.
The logs contain information about this story.  
Only now the logs are not coming from one place. 
The story is told in multiple Lambda functions.

On top of that the logging might tell multiple stories at once.
Multiple execution environments of the same Lambda function can run at the same time.
This is that scalability of the cloud.
Lambda functions can run concurrently.

We need two things: 
1. We need to correlate the logs coming from different places.
2. We need to get the valuable information out of our logs.

## Solution 1: structured logging
Structured logging to the rescue!

Below you see a normal log versus a structured log.

Normal plain text log:
<div style="text-align: center;">
  <img src="/img/2019-10-15-Monitoring-serverless-apps-on-AWS/normal-log.png" width="100%" height="100%">
</div>  


Structured log:
<div style="text-align: center;">
  <img src="/img/2019-10-15-Monitoring-serverless-apps-on-AWS/structured-log.png" width="100%" height="100%">
</div>

Yes, the structured log is a lot more bloated.
But it is also a lot more machine readable and contains much more information.

You recognize the `JSON` format.  
* It contains contextual information like `functionName` which is the function that created the log and `AWSRequestId` which is the identifier for the invocation of the lambda function.
* We see the `milestone` key which refers to a certain milestone that the request passed while processing.
* We still recognize the `message` and `timestamp`
* The logs contain a `traceId` which we can use to correlate logs.

AWS offers us a service to get insights in our logs, `CloudWatch Logs Insights`. (What's in a name right?)

Since we used structured logging CloudWatch will pick up all `JSON` fields from our logs automatically.

Now we can use these logs to query the milestones that a request passed.
We can correlate these milestones since we have the traceId correlating logs over multiple functions.
Our logs are generated by multiple functions.
`CloudWatch Logs Insights` allows you to query over multiple logGroups related to these functions.

Suppose that something went wrong for session with sessionId: `a2db023e-6565-4a5c-b7dc-b53a420898e7`.  
We now can lookup the traceId to track the concerning request in our landscape.

```bash
fields traceId
| filter sessionId="865ccaad-ced0-4de5-aec3-b3692b2e06a0"
| limit 1
```
<div style="text-align: center;">
  <img src="/img/2019-10-15-Monitoring-serverless-apps-on-AWS/traceId-by-sessionId.png" width="100%" height="100%">
</div>

Then we can use this traceId to find the milestones that the request has already passed.

```bash
fields milestone, functionName, timestamp
| filter traceId="bf769e94-4d48-4994-8c04-ebd00b51ecbd" and ispresent(milestone)
| sort timestamp asc
```

<div style="text-align: center;">
  <img src="/img/2019-10-15-Monitoring-serverless-apps-on-AWS/milestones.png" width="100%" height="100%">
</div>

We see that we never got the milestone `SAVED_IN_DATABASE`.
So it went wrong somewhere in the `conference-save-session-dynamodb-lambda`.

We can checkout the logs of this faulty execution using the `traceId`.

```bash
fields @message
| filter traceId="bf769e94-4d48-4994-8c04-ebd00b51ecbd" and functionName="conference-save-session-dynamodb-lambda"
```

Or we could check for an exception that occurred.

```bash
fields exception, traceId, functionName
| filter traceId="bf769e94-4d48-4994-8c04-ebd00b51ecbd"
| limit 1
```

Both will lead us to the exception.

<div style="text-align: center;">
  <img src="/img/2019-10-15-Monitoring-serverless-apps-on-AWS/exception-found-by-looking-for-exception.png" width="100%" height="100%">
</div>

The outcome of this queries can be visualized and added to a `CloudWatch Dashboard`.
More on that later.

Structured logging helped us querying our logs for information and finding the error in our flow.  
Challenge 1 completed!

<div style="text-align: center;">
  <img src="/img/2019-10-15-Monitoring-serverless-apps-on-AWS/completed.png" width="10%" height="10%">
</div>

# Challenge 2: Finding performance bottlenecks
I wrote a `Logs Insights` query that allows me to check how long it took for a request to pass through the whole landscape.
That means from the moment the creation request arrived till the moment we send out a slack notification for it.

```bash
fields @timestamp, @message
| filter  milestone="CREATE_REQUEST_RECEIVED" or milestone="SLACK_NOTIFICATION_NEW_SESSION_SENT"
| stats (latest(@timestamp) - earliest(@timestamp))/1000 as LeadTimeInSeconds by traceId
| filter LeadTimeInSeconds!=0
| sort LeadTimeInSeconds desc
| limit 20
```
    
<div style="text-align: center;">
  <img src="/img/2019-10-15-Monitoring-serverless-apps-on-AWS/slack-notification-lead-time.png" width="100%" height="100%">
</div>

We see that even when the system is warm, it takes us up to 10 seconds to send out a slack notification.
We need to dig into the performance of our lambda functions using `AWS Xray`.

## Solution 2: distributed tracing with AWS Xray

<div style="text-align: center;">
  <img src="/img/2019-10-15-Monitoring-serverless-apps-on-AWS/xray.png" width="10%" height="10%">
</div>

Xray helps us understand the behaviour of our system and thus allows us to analyze the performance of specific parts.
It does this by visualizing the flow and dividing the flow into traces and segments.
A trace is actually build up from multiple segments.

It does this by:
* Sampling your requests. 
By default Xray will trace 5% of your requests.
* Tracing calls made by ths AWS SDK.
This happens automatically when you use Xray as a dependency for your project.
* Creating custom segments.
You can create your own segments as you see below.

```java
Subsegment subsegment = AWSXRay.beginSubsegment("Sessions.saveSessionDynamoDB");

subsegment.putAnnotation("storeInDatabase", "DynamoDB");
subsegment.putMetadata("company", "Ordina");

mockingIssues(sessionDynamoDao);

repository.saveSession(sessionDynamoDao);

AWSXRay.endSubsegment();
```


Here is an example of the Xray service map.

<div style="text-align: center;">
  <img src="/img/2019-10-15-Monitoring-serverless-apps-on-AWS/xray-service-map.png" width="100%" height="100%">
</div>

Xray doesn't trace async requests (yet).
That means that publishing on an `SNS` topic or going via a `DynamoDB Stream` is not part of the full trace but will show up as a new client in the service map.
Recently tracing over `SQS` was added.

When we click the lambda service we can see the response distribution.
This visualizes how quickly this lambda function responded.

<div style="text-align: center;">
  <img src="/img/2019-10-15-Monitoring-serverless-apps-on-AWS/xray-response-distribution.png" width="100%" height="100%">
</div>

Something is definitely wrong here since even the quickest executions take more than 3 seconds.
We can dig deeper by clicking `view traces`.

<div style="text-align: center;">
  <img src="/img/2019-10-15-Monitoring-serverless-apps-on-AWS/xray-overview-traces.png" width="100%" height="100%">
</div> 

Digging even deeper into one of these traces we can see how long every segment of this trace took.

<div style="text-align: center;">
  <img src="/img/2019-10-15-Monitoring-serverless-apps-on-AWS/xray-segments-of-trace.png" width="100%" height="100%">
</div> 

Below we see that first some data was saved to the `caching table`.
This happened blazingly quick in 8.0 ms.  

We see however that the `Sessions.saveSessionDynamoDB` segment took over 3.0 seconds.
Of these 3 seconds only 8 ms where spend actually saving the request.
We found our performance bottleneck.
Something is waiting around in the `Sessions.saveSessionDynamoDB` segment.
In this case it was me introducing an artificial `Thread.sleep()`.

Hooray, we found the performance bottleneck.  
Challenge 2 completed.

<div style="text-align: center;">
  <img src="/img/2019-10-15-Monitoring-serverless-apps-on-AWS/completed.png" width="10%" height="10%">
</div>


# Challenge 3: Testing whether our application still behaves as expected
We can't run our complete cloud infrastructure on our local machine.  
So when we change an redeploy, we should test if our system is still behaving as it should.

This includes:
* Running smoke tests to detect hazards.
* Running load tests to view if the system can still handle the load.

## Solution 3a: smoke testing
You should automate testing your system.
In the image below you see how I automate a test to check if a new session that is entered via the API is still forwarded.

<div style="text-align: center;">
  <img src="/img/2019-10-15-Monitoring-serverless-apps-on-AWS/smoke-test.png" width="100%" height="100%">
</div>

I create this test using `JUnit` and mocked the http endpoints with [wiremock](http://wiremock.org/).
`Wiremock` is a great tool to mock http endpoints that I personally use a lot.  
You can ask Wiremock to create certain endpoints and configure the response for it.  
Below you see me creating the `/sessions/forward` endpoint.

```bash
curl -X POST \
  $wiremock_url \
  -H 'Content-Type: application/json' \
  -d '{
    "request": {
        "method": "POST",
        "url": "/session/forward"
    },
    "response": {
        "status": 200,
        "body": "I have received the session correctly",
         "delayDistribution": {
                    "type": "lognormal",
                    "median": 100,
                    "sigma": 0.1
           },
        "headers": {
            "Content-Type": "text/plain"
        }
    }
}'
```

## Solution 3b: load testing
Yes, serverless scales automatically.
But things might not always behave as expected.
Listening on events of a `Kinesis` stream for example is only possible with one Lambda function per `Shard`.
Thus limiting your throughput if you don't watch out.

To run my loaddtest I use [artillery](https://artillery.io). 
Below you find the file that I use to configure this load test.
It ramps up the amount of request per second from 1 to 10 during 2 minutes.

```yaml
config:
  target: 'https://your-own-url.com'
  phases:
    - duration: 120
      arrivalRate: 1
      rampTo: 10
      name: "Ramp up to warm up the application"
  payload:
    path: "sessions.csv"
    fields:
      - "subject"
      - "firstName"
      - "lastName"
      - "companyName"
      - "companyCity"
scenarios:
  - flow:
      - post:
          url: "/sessions"
          json:
            subject: "{{ subject }}"
            duration: 20
            timestamp: "1570202335000"
            speaker:
              firstName: "{{ firstName }}"
              lastName: "{{ lastName }}"
              company:
                companyName: "{{ companyName }}"
                companyCity: "{{ companyCity }}"
              questionPhrase: "{{ question }}"
```

Again I checked the lead time (time between incoming request and sending out the notification) and found these huge numbers.

<div style="text-align: center;">
  <img src="/img/2019-10-15-Monitoring-serverless-apps-on-AWS/huge-lead-time.png" width="70%" height="70%">
</div>

Using structured logging and `CloudWatch Logs Insights` we could start looking deeper into the cause of this delay.
I already showed you how to work with `Logs Insights`, so I'll get straight to the cause here.  

The reason it takes so much time to send out all slack notifications is that the Lambda function which listens on the `DynamoDB stream` is sending out these requests one by one.
It takes about 1 second for every request.  
But the requests come in much faster. This means that they are queueing up in front of the `conference-slack-notification-lambda` to be send out.

<div style="text-align: center;">
  <img src="/img/2019-10-15-Monitoring-serverless-apps-on-AWS/simpler-architecture-with-milestones.png" width="100%" height="100%">
</div>

We reached our goal.
We found another bottleneck in our system by running the load tests.
Challenge 3 completed!

<div style="text-align: center;">
  <img src="/img/2019-10-15-Monitoring-serverless-apps-on-AWS/completed.png" width="10%" height="10%">
</div>

# Side note on CloudWatch Dashboards
Along the way we wrote a lot of `Logs Insights` queries.  
AWS allows you to bundle the results of these queries into dashboards via `CloudWatch Dashboards`.

Below you see how I made a dashboard that visualizes the number of invocations and associated costs per lambda function.

<div style="text-align: center;">
  <img src="/img/2019-10-15-Monitoring-serverless-apps-on-AWS/billing-overview.png" width="100%" height="100%">
</div>

To find the total cost I used the following query:
```bash
filter @type = "REPORT"
| fields @memorySize/1000000 as MemorySetInMB, @billedDuration/1000*MemorySetInMB/1024 as BilledDurationInGBSeconds, @logStream
| stats sum(BilledDurationInGBSeconds) as TotalBilledDurationInGBSeconds, sum(BilledDurationInGBSeconds) * 0.00001667 as TotalCostInDollar
```

To get the stats per Lambda function I did:
```bash
filter @type="REPORT"
| fields @memorySize/1000000 as MemorySetInMB, @billedDuration/1000*MemorySetInMB/1024 as BilledDurationInGBSeconds
| stats 
count(@billedDuration) as NumberOfInvocations,
ceil(avg(@duration)) as AverageExecutionTime,
max(@duration) as MaxExecutionTime,
sum(BilledDurationInGBSeconds) * 0.00001667 as TotalCostInDollar
```

# Conclusion

We improved the observability of our system by implementing structured logs and using appropriate testing and tooling.
By doing this it becomes way easier to monitor your system and create visibility on it's behavior.

Remember that:
* you need structured logging to get the maximum out of your logs.
* CloudWatch Logs Insights allows you to query your logs and analyze them for errors.
* distributed tracing with AWS Xray helps you identifying bottlenecks in your system.
* you can create smoke tests and load tests to check if your system is behaving as it is supposed to.
 
# Resources
1. https://theburningmonk.com/2017/09/tips-and-tricks-for-logging-and-monitoring-aws-lambda-functions/
2. https://theburningmonk.com/2018/01/you-need-to-use-structured-logging-with-aws-lambda/
3. https://www.loggly.com/blog/why-json-is-the-best-application-log-format-and-how-to-switch/
4. https://stackify.com/what-is-structured-logging-and-why-developers-need-it/
6. https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html
7. https://docs.aws.amazon.com/xray/latest/devguide/xray-concepts.html
8. https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-nodejs-subsegments.html
9. https://www.slideshare.net/AmazonWebServices/monitoring-and-troubleshooting-in-a-serverless-world-srv303-reinvent-2017
