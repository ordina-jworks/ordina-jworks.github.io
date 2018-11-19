---
layout: post
authors: [jan_van_der_veken]
title: "Transactions in MongoDB 4.0"
image: /img/2018-11-08-mongodb-europe-2018/mongodb-acid-logo.png
tags: [Development,MongoDB,DBA,Data,Transactions,ACID,Conference]
category: Development
comments: true
---

# Table of Contents
1. [Introduction](#introduction)
2. [Relational vs. document database](#Relational-vs.-document-database)
3. [When to use transactions?](#when-to-use-transactions)
4. [Technical details](#technical-details)
5. [Practical](#practical)
6. [Best Practices](#best-practices)
5. [Conclusion](#conclusion)

## Introduction
- [How and When to Use Multi-Document Distributed Transactions, Aly Cabral](https://mongodbeurope2018.sched.com/event/FmAR/how-and-when-to-use-multi-document-distributed-transactions)
- [MongoDB: Building a New Transactional Model, Keith Bostic](https://mongodbeurope2018.sched.com/event/FmAW/mongodb-building-a-new-transactional-model)

The sessions I was looking forward to the most at MongoDB Europe 2018 were the two sessions about multi-document transactions, the most talked about feature of the MongoDB 4.0 release.
In the morning I attended a session by Aly Cabral which was very practically oriented.
In the afternoon there was a more esoteric yet very interesting session by Keith Bostic who provided some insight into the inner workings of the WiredTiger storage engine and the difficulties the MongoDB team had to overcome to implement the new transaction model.

To give some background, as a longtime Oracle DBA, I always found it odd that a database would lack what I had always considered a crucial database feature, so I was naturally curious to know more about MongoDB's implementation and how it would compare to a typical relational database.

In this post we will explore how multi-document transactions are implemented in MongoDB, how the implementation is similar to a relational database system and where they differ.

## Relational vs. document database
As I learned through working with MongoDB the past two years, there is less need for multi-document transactions in document databases.
For the majority of use cases single document transactions suffice.
This is because the data model you use with a document database is quite different from what you would use with an RDBMS.

In a relational database system you typically normalize data in order to avoid duplication.
A single `entity` more often than not has data spanning multiple tables, so when you perform updates to a single entity you have to update multiple rows in multiple tables concurrently, which necessitates transactions.

In a document database like MongoDB though, you typically embed all data that represents one entity within a single document, in which case updates to that entity are also limited to a single document.
You can see that there's less need for transactions.

In essence, the RDBMS approach prioritizes disk space efficiency above everything else whereas the MongoDB approach prioritizes ease of development and simplicity.

Nevertheless, there are some scenarios where you may want to use multi-document transactions in a document database.
Let's see what some of those scenarios might be...

## When to use transactions?

### Relationships
In the case that your datamodel does have relationships between separate entitites, you may want to use transactions to update both of them at the same time.

An example of this could be a `customer` and a `car` that the customer owns.
They are distinct entities, but there is a relationship between them in the form of ownership information.
If you update the ownership information on the `customer` document, you probably need to update it on the `car` document (or documents) as well.

The only way to do this with guaranteed consistency is through a multi-document transaction.

### Event processing
Another use case of transactions is event processing.
When a certain event occurs, it may need to atomically create, update or delete several entities at the same time.

The example that was given in Aly's presentation was the creation or invalidation of a customer's account, which would require an update to all of the customer's entities.

### Event logging or auditing
Consider the case where, for logging or auditing purposes, you want to create an event trail of all changes that happen to a certain document or collection and you want to store this event trail in another collection.

The event trail should be representative of what really occurred, so events that never occurred should not be logged nor should events that actually happened be lost.

The only way to achieve this is to put the update and the logging of the update inside the same transaction.

## Technical details
Now let's explore some of the more technical features of multi-document transactions.

### Atomicity
This is pretty straightforward.
In MongoDB transactions are atomic, which means that execution of multiple changes inside a transaction is an all-or-nothing deal: either all updates get committed, or none.

### Snapshot isolation
When you start a transaction, MongoDB creates a snapshot of the current state of the database.
During your transaction you will not see any updates made by other sessions.
You are *isolated* from them.
This guarantees that throughout the transaction your session will see one consistent version of the data.

Internally MongoDB uses an update structure inside the WiredTiger cache to maintain this consistent view on the database.
This structure grows as writes occur to the database and is only evicted from the database once the transaction is committed or aborted.
The implication of this is that long running transactions or a high write volume can put pressure on the cache.
It's therefore recommended to keep the duration of any transaction as low as possible.

To minimize cache pressure, you can use the server parameter `transactionLifeTimeLimitSeconds` to set a sensible maximum transaction time.
If a transaction runs for a longer time than this value, it will be aborted.
The default value of `transactionLifeTimeLimitSeconds` is 60 seconds.

A sidenote for those DBAs or developers who are already familiar with Oracle: the update structure in the WiredTiger cache is similar to how rollback segments and undo tablespaces work in Oracle.
The differences are that the snapshot information is kept entirely in memory instead of on disk, and that you don't have to actively manage it by allocating a tablespace for it.

### Read your own writes
MongoDB guarantees that you can read any writes you make inside your transaction, even before they are committed.
It also guarantees that no other session can read your writes before they are committed.

Again, these writes are handled by the snapshot structure inside the WiredTiger cache.

### Write locks
When two sessions are trying to update the same document at the same time, you get a write conflict.
In MongoDB this conflict is handled by write locks.
There are basically two conflict scenarios:

- Before a *transaction* updates a document, it will try to acquire a write lock.
If the document is already locked the transaction will fail.

- Before a *non-transactional operation* tries to update a document, it will try to acquire a write lock.
If the document is already locked, the operation will back off and retry until [MaxTimeMS](https://docs.mongodb.com/manual/reference/method/cursor.maxTimeMS/#cursor.maxTimeMS) is reached.

Note that reads never block writes.
MongoDB is also smart enough to recognize a so called no-op write: if the document you are trying to update was not changed by the update, it will not attempt to acquire a write lock.

### Limitations
Currently you can only use multi-document transactions with replica sets.
Sharded clusters are not supported yet, though this feature is planned for a future release (4.1 perhaps?).

Due to the WiredTiger cache pressure, long running transactions can be problematic. 
The MongoDB developers are working on improving this for future releases and plan to support transactions running for several hours or even days.

## Practical
As for semantics, the MongoDB developers thankfully chose not to reinvent the wheel.
Using transactions is similar to what most developers are used to on relational database systems.
The precise syntax varies per programming language, so you will have to do some RTFM to learn it, but it always comes down to the following steps:

1. Open session
2. Start transaction
3. Update multiple documents
4. Commit or abort transaction

For example, in Mongo Shell syntax a transaction typically looks like this:

```javascript
mySession = db.getMongo().startSession();
mySession.startTransaction();
mySession.getDatabase("mydb").coll1.insert({"foo" : "bar"});
mySession.getDatabase("mydb").coll2.insert({"hello" : "world"});
mySession.commitTransaction();
```

One important thing to note here is that once we open the session on the first line, every subsequent action must use the session variable ("mySession" in this case), otherwise they will be simple update operations not belonging to the transaction.

## Best practices
Finally, here are some best practices we learned in the session:

- Don't change your data modeling rules because of transactions.
For example: don't start normalizing data
- Transactions shouldn't be the most common operation.
If they are, you're doing it wrong.
- Pass session information to all statements inside your transaction.
- Implement retry logic.
MongoDB returns errorcodes that tell you if a transaction has failed and if it failed with a retryable error or not.
- To reduce WiredTiger cache pressure, keep transactions short and don't leave them open, even read only transactions.
- Take into account that long running DDL operations (e.g. `createIndex()` ) block transactions and vice versa.

## Conclusion
Multi-document transactions are a useful and easy to use addition to MongoDB.
They make MongoDB a better general purpose database and a stronger alternative for applications where you would traditionally have to choose a relational database.