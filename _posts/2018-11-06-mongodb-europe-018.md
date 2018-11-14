---
layout: post
authors: [chris_de_bruyne, nick_van_hoof, jan_van_der_veken, dock]
title: "MongoDB Europe 2018"
image: /img/2018-11-08-mongodb-europe-2018/main-image-mdbe.png
tags: [Development,MongoDB,DBA,Data,Kubernetes,Conference]
category: Development
comments: true
---

> MongoDB Europe is a yearly conference where MongoDB shows of their latest features and new products.
> This year the venue took place in Old Billingsgate Walk, London.
> This blog post summarizes several of the given sessions.


# Table of contents
1. [Atlas](#atlas)
2. [MongoDB University](#mongodb-university)
3. [Compass Aggregation Pipeline Builder](#compass-aggregation-pipeline-builder)
4. [Common query mistakes](#common-query-mistakes)
5. [Stitch](#stitch)
6. [Meet the experts](#meet-the-experts)
7. [Streaming data pipelines with MongoDB and Kafka at AO](#streaming-data-pipelines-with-mongodb-and-kafka-at-ao)
8. [MongoDB Enterprise Operator for Kubernetes at Amadeus](#mongodb-enterprise-operator-for-kubernetes-at-amadeus)
9. [Conclusion](#conclusion)

# Atlas
([MongoDB Atlas for your Enterprise](https://sched.co/FmAF){:target="_blank" rel="noopener noreferrer"}, Vladislava Stevanovic & Veronica Tudor)

With Atlas MongoDB brings us DBaaS (Database As A Service).
You can run your database in the cloud with the cloud provider of your choice.
Multiple options to secure your database are build in by default.
Backups are taken automatically.

### Getting started
It is very easy to get started since a free tier is provided for everyone and you can deploy with the cloud provider of your choice (Azure , GCP, AWS).
A cluster can be started for free in just a few clicks.

<div style="text-align: center;">
  <img src="/img/2018-11-08-mongodb-europe-2018/create-mongodb-atlas-cluster.png" width="100%">
</div>

Start your own cluster: [https://cloud.mongodb.com](https://cloud.mongodb.com){:target="_blank" rel="noopener noreferrer"}

### Cloud
MongoDB Atlas is a cross-platform database. 
You can run it on Amazon Web Services, Google Cloud or Microsoft Azure. 
It provides you an availability map that shows you which users are served from where an what latency should be expected.

### Scalability
When your database grows it is easy to scale up or out.
You can scale up by increasing the size of the instance on which your database runs.
Scaling out is done by the process of sharding.
Here we are storing data of the same collection across multiple Replica Sets to decrease the size of the partition and increase read-write performance.
This way you do not run into the limitations of a single server.

To ensure that MongoDB stores data equally across shards you need the right strategy of choosing a partition key.

### High availability 
To ensure maximum uptime the procedure to recover from instance failures is completely automated.
When a primary node goes down, a new primary is chosen immediately by the system of voting.
All nodes vote on who should become the new primary. 
The node with the majority of the votes becomes the new primary.
A general guideline is to have a replica set that consists of one primary node and at least two secondary nodes.


# MongoDB University
(General Session Keynote)

With [MongoDB University](https://university.mongodb.com/){:target="_blank" rel="noopener noreferrer"}, Mongo has its own platform for online courses.
A lot of them are available for free.
You can pick out courses according to your needs or profession.
There are training tracks for Developers, DBA's and everyone else...
The courses are ideal to get you started or to deepen your knowledge when you want to be more advanced.
If you want you can even get certified!
I speak from my own experience when I say that the University platform is great to work with and the courses are well taught.
Find all available resources here: [https://university.mongodb.com/](https://university.mongodb.com/){:target="_blank" rel="noopener noreferrer"}.



# Compass Aggregation Pipeline Builder
(General Session Keynote)

Recently the aggregation pipeline builder was introduced in [MongoDB Compass](https://www.mongodb.com/products/compass){:target="_blank" rel="noopener noreferrer"}.
This allows you to create an aggregation pipeline step by step.
And that makes it easy to debug the pipeline along the way.
Let's see an example.  
Suppose I have a collection which contains documents that represent a person.
Here are two examples of elements in the collections:

```json
{
	"_id" : ObjectId("5be40f6e7047ead15753d073"),
	"firstName" : "Didi",
	"lastName" : "Verhoft",
	"birthYear" : 1996
},
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

```javascript
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
([Tips And Tricks for Avoiding Common Query Pitfalls, Christian Kurze](https://sched.co/FmAd){:target="_blank" rel="noopener noreferrer"})

### Key takeaways from this session

Generally speaking, there are three major causes of query slowness:
- Blocking operations
- Using the `$or` operator
- Case insensitive searches

It's not uncommon that a properly tuned query delivers a factor 1000 speed-up, so it's definitely worth investigating.

### Problem 1: blocking operations
This happens when you use an operator that needs all the data before producing results, so results can't be streamed.
This is most common with aggregation operators such as `$sort`, `$group`, `$bucket`, `$count` and `$facet`.

Possible solutions:
- Create a compound index to support your query, and make sure that the sort order in the index is the same as in your query.
- Offload the query to a secondary member.
- Work around the issue by using a precalculated count.

### Problem 2: `$and` is fast, `$or` is slow
Sometimes a query is fast when you use the `$and` operator but slow when you use the `$or` operator.

Solution:
- Use a compound index to support `$and` queries.
- Use separate single field indexes to support `$or` queries.

### Problem 3: case insensitive searches are slow!
It is much harder for MongoDB to perform case insensitive searches because it has to match all possible permutations of the search string. 
For example, if you do a case insensitive search for the string "ace", it has to match "ace","Ace","aCe","ACe", and so on...

Solution:
- (3.4 and higher) Support the query with a case insensitive index.
- Alternatively, store a toLower() copy of the string in another field and index and query that field instead.

### General tips and tricks
* Create an index on an element you are interested in instead of scanning the whole table.
* When you query on a combination of fields create a compound index for these fields and not separate indices on each field.
* ...but be careful with the usage of `$or`!
* Build indices in the background instead of making it a blocking operation.
* Do not index all fields as this will negatively impact write performance. Investigate what you really need!
* Use .explain() to analyze queries.
* Ops Manager and Atlas have a Performance Advisor to help you identify problematic queries.
* Train your people.
* Work smarter, not harder!

# Stitch
([Ch-Ch-Ch-Ch-Changes: Taking Your MongoDB Stitch Application to the Next Level With Triggers, Andrew Morgan](https://sched.co/FmAJ){:target="_blank" rel="noopener noreferrer"})
> Write less code and build apps faster! 

### Stitch Functions and Triggers
You can write JavaScript functions in the Stitch serverless platform. 
You can then couple these functions with a trigger upon which the function needs to be executed.
E.g. when a customer orders something that is out of stock, you can send him an automatic email when the stock get update in your database.

Stitch provides a very easy way to implement new functionality without having to write lots of code in a separated application

# Meet the experts
At the conference you had the chance to book a 20 minute session with a MongoDB experts.
This was of great help in getting to know the new MongoDB Aggregation Pipeline builder.
The expert also gave some more tips in "thinking noSQL".

> When data is shown together it is stored together -- MongoDB expert 

> Data should be stored in the same way it is used -- MongoDB expert

# [Streaming data pipelines with MongoDB and Kafka at AO](https://sched.co/FmAp){:target="_blank" rel="noopener noreferrer"}
[A.O.](https://ao.com/){:target="_blank" rel="noopener noreferrer"}


AO wanted to solve the issue of having data locked in different places so they wanted a [Single Customer View](https://en.wikipedia.org/wiki/Single_customer_view/){:target="_blank" rel="noopener noreferrer"}.
The idea was to get data from all places like legacy databases and queues about customer data and phone calls with customer care till the parcels moving through the warehouse and up until the doorstep.
They wanted to get the data while it's hot, not in hourly or daily (or worse...) batches.
They decided to use MongoDB for the materialised view of all different data streams and Atlas to be able to focus on the application and not the db administration.

The vast majority of the data resides in MsSql databases.
Extraction happens with Kafka Connect SQL CDC to generate a stream of all create, update and delete operations into a stream and push it to Kafka.
All with a simple piece of configuration like this : 

```json
{
  "name" : "msSqlSourceConnector1",
  "config" : {
    "connector.class" : "io.confluent.connect.cdc.mssql.MsSqlSourceConnector",
    "tasks.max" : "1",
    "initial.database" : "testing",
    "username" : "cdc",
    "password" : "secret",
    "server.name" : "db-01.example.com",
    "server.port" : "1433"
  }
}
```

They use Avro for the schema definition in combination with a schema-registry.
Interested clients can then read the data of the topics and do there single-view-thing on the data and save it to MongoDB.
The view is being build up, message per message.
The view in MongoDB is then pushed back to Kafka as another stream to provide this data to interested parties.
This avoids locking the data in one place.

To finish it of they shared some lessons learned :
* Watch out for frameworks generating queries.  
   They can create bad performing aggregations or queries.  
   For them it was better to write some queries explicitly.  
* Use custom _id for unique determination of your model, it saves an index and RAM
* Watch out for unbounded document growth.


# [MongoDB Enterprise Operator for Kubernetes at Amadeus](https://sched.co/FmAc){:target="_blank" rel="noopener noreferrer"}

Amadeus is the worlds, largest technology company dedicated to the travel industry.
They have developed an impressive MongoDB farm - a large environment with 100 clusters, some of which run more than 100 shards, some of which run 100TB MongoDB databases.
Amadeus processes more than 1 trillion availability requests per day. 
For each single search you do on a website they receive 500.000 availability requests.
So search responsibly ;-)
The number of requests per day grows by 50% each year.
Worst day is january 2th due to new years resolutions!
If this day is in the weekend, all systems are pushed to there limits.
The fair database for one of their big clients, Kayak, is 100 Tb in size and changes daily.
That's some pretty big numbers there.
No wonder that Amadeus is a happy user of the MongoDB Enterprise Operator for Kubernetes.

Starting with the MongoDB Ops Manager v4.0, MongoDB officially supports the management and deployment of MongoDB in Kubernetes with Backup, Automation, Alerting and, Monitoring.
An operator has app-specific awareness about stateful applications, so it knows how to deploy them.
This operator helps automating scripted tasks and enables MongoDB as a service for developers.
This operator talks to Ops Manager and delegates the creation of clusters, shards, backups and automation to Ops Manager.
The underlying necessary Kubernetes infrastructure is orchestrated by the operator itself and so they work in conjunction.
This provides for clusters to be setup, scaled up/down/out/in, with a single simple yaml file.
And kubernetes provides the self healing capabilities, how nice is that.

The following yaml file is all you need to spin up a 3 node replica set :

```yaml
apiVersion: mongodb.com/v1
kind: MongoDbReplicaSet
metadata:
  name: myReplicaSet
  namespace: mongodb
spec:
  members: 3
  version: 4.0.1

  project: projectName
  credentials: myUberSecretCredentials
```

I kid you not, that's it.

Scale out or back in with a simple change in the config yaml and 
```bash
cubectl apply -f file.yaml
```

