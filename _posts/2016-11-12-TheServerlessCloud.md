---
layout: post
authors: [bart_blommaerts]
title: 'The Serverless Cloud'
image: /img/serverless.jpg
tags: [Cloud, Serverless, AWS, Lambda, Azure, Google Cloud Platform, IBM Bluemix, OpenWhisk, Webtask]
category: Cloud
comments: true
---

>In recent years, the uprise of the cloud has brought us a lot of new and disruptive technologies. 
Everybody is talking about SaaS, PaaS, IaaS and other sorts of aaS. 
In 2014, Amazon launched AWS Lambda as the pinnacle of the cloud computing. 
It allows developers to focus on code, without spending time on managing servers.

# Part 1

## What?

While Microservices have been reigning the Cloud landscape for a couple of years, today the Serverless movement is one of the hottest trends in the industry. 
Historically, software developers have been pretty bad at naming things and Serverless is no exception. 
Disregarding what the name suggests, Serverless does not imply the complete absence of servers. 
It implies that developers who are using the Serverless architectural style, are not responsible for managing or provisioning the servers themselves, but use a vendor-supplied Cloud solution. 
Serverless means less worrying about servers. 
Although in the future, it might be possible to install this kind of service on-premise, for example with the open-source [IBM OpenWhisk](https://github.com/openwhisk/openwhisk) implementation.

In regard to this, the definition [FaaS](https://twitter.com/marak/status/736357543598002176): Functions as a Service makes a lot more sense. 
Functions are short-lived pieces of runtime functionality that don’t need a server that’s always running. 
Strictly speaking a function can have a longer execution time, but most FaaS providers will currently limit the allowed computation time. 
When an application calls a function (eg. a calculation algorithm) this function gets instantiated on request. 
After finishing it gets destroyed. 
This leads to a shorter “running” time and thus a significant financial advantage. 
As an example, you can find the AWS Lambda pricing [here](https://aws.amazon.com/lambda/pricing/). 
FaaS functions are also a great match for event-driven behaviour: when an event is dispatched, the function can be started instantly and ran only for the needed time. 
A Serverless application is a composition of event chaining. 
This makes the Serverless style a natural match for [API Economy](http://www.slideshare.net/BartBlommaerts/the-collaborative-economy-61528579).

As a result of being runtime components, FaaS functions are stateless and need to rely on a database (or file system) to store state. 
Being stateless and short-lived naturally lead to extreme horizontal scaling opportunities and all major FaaS providers support these.

## NoOps

[NoOps](http://searchcloudapplications.techtarget.com/definition/noops) (No Operations) is the concept that an IT environment can become so automated and abstracted from the underlying infrastructure that there is no need for a dedicated team to manage software in-house. 
NoOps isn’t a new concept as this [article](http://blogs.forrester.com/mike_gualtieri/11-02-07-i_dont_want_devops_i_want_noops) from 2011 proves. 
When Serverless started gaining popularity, some people claimed there was no longer a need for Operations. 
Since we already established that Serverless doesn’t mean no servers, it’s obvious it also doesn’t mean No Operations.
It might mean that Operations gets outsourced to a team with specialised skills, but we are still going to need: monitoring, security, remote debugging, … 
I am curious to see the impact on current DevOps teams though. 
A very interesting article on the NoOps topic, can be found over [here](https://charity.wtf/2016/05/31/operational-best-practices-serverless/).

## AWS

### AWS Lambda

[AWS Lambda](http://aws.amazon.com/documentation/lambda/) was the first major platform to support FaaS functions, running on the AWS infrastructure. 
Currently AWS Lambda supports three languages: Node.js, Java, and Python. 
AWS Lambda can be used both for synchronous and asynchronous services.

Currently the tooling for AWS Lambda is still relatively immature, but this is changing rapidly. 
At the time of writing, the AWS Lambda console offers the possibility to create a Lambda using blueprints. 
This is already easier then setting up a lambda by hand (using a ZIP-file). 
Blueprints are sample configurations of event sources and Lambda functions. 
Currently 45 blueprints are available. 
To give a short introduction, we’ll select the **hello-world** blueprint. 
This blueprint generates a very simple NodeJS function:

```
'use strict';
console.log('Loading function');
  
exports.handler = (event, context, callback) => {
   console.log('value1 =', event.key1);
   console.log('value2 =', event.key2);
   console.log('value3 =', event.key3);
   callback(null, event.key1); 
};
```

After creating this function, it can be immediately be tested from the console, using a test event. 
If we want to call this function synchronously, we need to create an API endpoint with the [AWS API Gateway](https://aws.amazon.com/api-gateway/). 
The API Gateway creates API’s that acts as a “front door” to your functions. 
To make this work with the events in our hello-world example, we need to select the resources of our API:

![Serverless]({{ '/img/serverless/1.png' | prepend: site.baseurl }})

In Integration Request, we add a body mapping template of type *application/json* with the following template:

```
{ "key3": "$input.params('key3')","key2": "$input.params('key2')","key1": "$input.params('key1')"}
```

In ‘Method request’ we add 3 URL String query parameters: key1, key2 and key3. 
If we then redeploy our API, hitting the Test button gives us a input form to add the 3 query parameters and the function is executed successfully:

![Serverless]({{ '/img/serverless/2.png' | prepend: site.baseurl }})

If you want to test this directly from a browser, you will need to change the Auth to NONE in the ‘Method request’ and do a new deploy of the API. 
The URL itself can be found in the ‘stage’-menu.

This example obviously is not very interesting, so let’s try another blueprint: *microservice-http-endpoint*. 
This will generate a CRUD backend, using [DynamoDB](http://aws.amazon.com/dynamodb) with a RESTful API endpoint. 
The code generated, covers all common use-cases:

```
'use strict';
letdoc = require('dynamodb-doc');
letdynamo = newdoc.DynamoDB();
exports.handler = (event, context, callback) => {
   const operation = event.operation;
   if(event.tableName) {
      event.payload.TableName = event.tableName;
   }
   switch(operation) {
   case'create':
      dynamo.putItem(event.payload, callback);
      break;
   case'read':
      dynamo.getItem(event.payload, callback);
      break;
   case'update':
      dynamo.updateItem(event.payload, callback);
      break;
   case'delete':
      dynamo.deleteItem(event.payload, callback);
      break;
   case'list':
      dynamo.scan(event.payload, callback);
      break;
   case'echo':
      callback(null, event.payload);
      break;
   case'ping':
      callback(null, 'pong');
      break;
   default:
      callback(newError(`Unrecognized operation "${operation}"`));
   }
};
```

Obviously you will need a DynamoDB instance with some data in it:

![Serverless]({{ '/img/serverless/3.png' | prepend: site.baseurl }})

You can reference your new table, from your lambda, using the following event:

```
{
"tableName": "garage-car-dev",
"operation": "list",
"payload": { }
} 
```

The only difficult part remaining, is finding out the required [payload](http://docs.aws.amazon.com/lambda/latest/dg/with-on-demand-https-example.html) for the different operations :) 
This is a good start for creating new records:

```
{
"operation": "create",
"tableName": "garage-car-dev",
"payload": {
   "Item": {
      "id": "1980b61a-f5d7-46e8-b62a-0bbb91e20706",
      "body": "Lamborghini",
      "updatedAt": "1467559284484"
      }
   }
}
```

The blueprint also generates an API in the API Gateway that we can invoke with the above events as body mapping template in integration request of the method execution, just like the first example.

### Serverless Framework

While the above approach works as expected, it’s quite cumbersome to get your first function working. 
Especially since we didn’t write any actual code in the previous examples. 
Luckily the [Serverless Framework](http://serverless.com/) (formerly JAWS) is here to make our lives easier. 
Currently the Serverless Framework only supports AWS Lambda, but support for other IaaS providers is coming. 
A pull-request for [Microsoft Azure](https://azure.microsoft.com/en-us/services/functions/) [already exists](https://github.com/serverless/serverless/pull/1426) and other providers are also working on an implementation. 
Vendor-neutral FaaS would be a true game-changer!

One problem with FaaS, is the (deliberate) mismatch between runtime unit and deploy unit. 
This is also true for other architectural patterns. 
It should be possible to deploy 1 specific function, but often functions will hang out in groups. 
I’d prefer to deploy a group of functions in one go, when it makes sense, eg. different CRUD operations on the same resource. 
This way, we benefit from the advantages of functions (scalability, cost, service independence, …) but also ease deployment. 
This is a key feature of the Serverless Framework.

![Serverless]({{ '/img/serverless/4.png' | prepend: site.baseurl }})

On June 29th, Serverless V1.0-alpha1 was announced. 
New Alphas and Betas will be released on a regular basis. 
Currently the documentation can only be found in their [v1.0 branch on GitHub](https://github.com/serverless/serverless/tree/v1.0/docs). Serverless V1.0 introduces the “Serverless Service” concept, which is a group of functions with their specific resource requirements. 
In essence Serverless V1.0 is a powerful and easy to use CLI to create, deploy and invoke functions. 
Serverless V1.0 uses [AWS CloudFormation](https://aws.amazon.com/cloudformation/) to create AWS resources. 
It uses the default [AWS profile](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html) for access to your AWS account. 
Creating, deploying and invoking a “Hello World” NodeJS function with Serverless is as easy as:

```
serverless create --name cars --provider aws 
serverless deploy 
serverless invoke --function hello --path data.json
```

This generates the following lambda:

```
'use strict'; 
module.exports.hello = (event, context, cb) => cb(null, 
   { message: 'Go Serverless v1.0! Your function executed successfully!', event } 
); 
```

The current version of the Serverless Framework (unfortunately) doesn’t use the region from the AWS config, so you might need to look for your function in a different region.

Adding an API Gateway endpoint, is also very easy and can be done by adding this http-event:

```
events:
  - http:
       path: greet
       method: get
```

The actual URL can be found in the API Gateway in the stages section, as we saw before.

# Part 2

# Part 3
