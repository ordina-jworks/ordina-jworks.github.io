---
layout: post
authors: [chris_de_bruyne, nick_van_hoof, dock]
title: "MongoDB Europe 2018"
image: /img/2018-11-08-mongodb-europe-2018/main-image-mdbe.png
tags: [Development,MongoDB,DBA,Data]
category: Development
comments: true
---

> MongoDB Europe is a yearly conference where MongoDB shows of their latest features and new products.
> This year the venue took place in Old Billingsgate Walk, London


# Table of contents
1. [Atlas](#atlas)
2. [MongoDB University](#mongodb-university)
3. [Aggregation Pipeline Builder](#compass-aggregation-pipeline-builder)
3. [Meet the experts](#meet-the-experts)
5. [Conclusion](#conclusion)

# Atlas
(MongoDB Atlas for your Enterprise, Vladislava Stevanovic & Veronica Tudor)

With Atlas MongoDB brings us DBaaS (Database As A Service).
You can run your database in the cloud with the cloud provider of your choice.
Multiple options to secure your database are build in by default.
Backups are taken automatically.

## Getting started
It is very easy to get started since a free tier is provided for everyone and you can deploy with the cloud provider of your choice (Azure , GCP, AWS).
A cluster can be started for free in just a few clicks.

<div style="text-align: center;">
  <img src="/img/2018-11-08-mongodb-europe-2018/create-mongodb-atlas-cluster.png" width="100%">
</div>

Start your own cluster: [https://cloud.mongodb.com](https://cloud.mongodb.com){:target="_blank" rel="noopener noreferrer"}

## Cloud
MongoDB Atlas is a cross-platform database. 
You can run it on Amazon Web Services, Google Cloud or Microsoft Azure. 
It provides you an availability map that shows you which users are served from where an what latency should be expected.

## Scalability
When your database grows it is easy to scale up or out.
You can scale up by increasing the size of the instance on which your database runs.
Scaling out is done by the process of sharding.
Here we are storing data of the same collection across multiple Replica Sets to decrease the size of the partition and increase read-write performance.
This way you do not run into the limitations of a single server.

To ensure that MongoDB stores data equally across shards you need the right strategy of choosing a partition key.

## High availability 
To ensure maximum uptime the procedure to recover from instance failures is completely automated.
When a primary node goes down, a new primary is chosen immediately by the system of voting.
All nodes vote on who should become the new primary. 
The node with the majority of the votes becomes the new primary.
A general guideline is to have a replica set that consists of one primary node and at least two secondary notes.


# MongoDB University
(General Session Keynote)

With MongoDB Universtity Mongo has its own platform for online courses.
A lot of them are available for free.
You can pick out courses according to your needs or profession.
There are training tracks for Developers, DBA's and everyone else...
The courses are ideal to get you started or to deepen your knowledge when you want to be more advanced.
If you want you can even get certified!
I speak from my own experience when I say that the University platform is great to work with and the courses are well taught.
Find all available resources here: [https://university.mongodb.com/](https://university.mongodb.com/){:target="_blank" rel="noopener noreferrer"}.



# Compass Aggregation Pipeline Builder
(General Session Keynote)

Recently the aggregation pipeline builder was introduced in MongoDB Compass.
This allows you to create an aggregation pipeline step by step.
And that makes it easy to debug the pipeline along the way.
Let's see an example.  
Suppose I have a collection which contains documents that represent a person.
Here are two examples of elements in the collections:

```javascript
{
	"_id" : ObjectId("5be40f6e7047ead15753d073"),
	"firstName" : "Didi",
	"lastName" : "Verhoft",
	"birthYear" : 1996
}
{
	"_id" : ObjectId("5be40f6e7047ead15753d074"),
	"firstName" : "Jonas",
	"lastName" : "Van Hoof",
	"birthYear" : 2001
}
```
A person has the fields lastName, firstName and birthYear (and of course for some people more info could be stored).
I want to build a pipeline with the following functionality:
* I want to filter out all people that share my lastname "Van Hoof"
* Then I want to count how many times these people also share the same firstname and birthyear
* Next I want to group them by birthYear so that I can for example see how many people were named "Nick van Hoof " (my fullname) in 1992.
* At last I want them sorted on year in ascending order

Filter all with last name  "Van Hoof" and group by lastName, firstName and year:
<div style="text-align: center;">
  <img src="/img/2018-11-08-mongodb-europe-2018/aggregation-pipeline-builder-compose-1.png" width="100%">
</div>

Group by year and sort in ascending order:
<div style="text-align: center;">
  <img src="/img/2018-11-08-mongodb-europe-2018/aggregation-pipeline-builder-compose-2.png" width="100%">
</div>

As you can see from the images above, Compass will show all the intermediary results. 
With one push of a button you can generate a command line query or the translation to a programming language.
Compass tells me the full aggregate will look like : 

``` 
db.people.aggregate([{$match: {
                      lastName : "Van Hoof"
                    }}, {$group: {
                      _id: { 
                        "lastName" : "$lastName",
                        "firstName": "$firstName",
                        "year" : "$birthYear"
                      },
                      count: {
                         $sum: 1 
                      }
                    }}, {$group: {
                            "_id": {
                                "year": "$_id.year",
                            },
                            "occurences": {
                              "$push" : {
                                  "identity": "$_id",
                                  "count": "$count"
                              }
                            }
                    }}, {$sort: {
                      "_id.year": 1
                    }}])
```

Which would have been a lot harder to write without the pipeline builder.

# Common query mistakes
(Tips And Tricks for Avoiding Common Query Pitfalls, Christian Kurze)

Key takeaways from this session:
* Create an index on an element you are interested in instead of scanning the whole table
* When you query on a combination of fields create one index for these fields and not separate indeces on each fields.
* Lay indeces in the background instead of making it a blocking operation
* Lookout for the usage of `$or`
* Do not index all fields. Investigate what you really need
* Use Ops Manager or Atlas and leverage the Performance Advisor
* Train you people
* Work smarter, not harder! 

# Stitch
(Ch-Ch-Ch-Ch-Changes: Taking Your MongoDB Stitch Application to the Next Level With Triggers, Andrew Morgan)
> Write less code and build apps faster! 

## Stitch Functions and Triggers
You can write JavaScript functions in the Stitch serverless platform. 
You can then couple these functions with a trigger upon which the function needs to be executed.
E.g. when a customer orders something that is out of stock. 
You can send him an automatic email when the stock get update in your database.

# Meet the experts
At the conference you had the chance to book a 20 minute session with a MongoDB experts.
This was of great help in getting to know the new MongoDB Aggregation Pipeline builder.
The expert also gave some more tips in "thinking noSQL".

> When data is shown together it is stored together -- MongoDB expert 

> Data should be stored in the same way it is used -- MongoDB expert


# Conclusion