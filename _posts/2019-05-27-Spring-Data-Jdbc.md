---
layout: post
authors: [wout_meskens]
title: 'An Introduction to Spring Data Jdbc'
image: /img/spring-ecosystem/spring-data.png
tags: [Java, Spring, Data, Jdbc]
category: Java
comments: true
---

> A new member is added to the spring data family. Spring data jdbc is positioned between Spring data jpa and Spring jdbc.
> This post will describe the current state and the future of this product. It will also explain what problems this product is trying to solve.

# Table of content

* [Spring jdbc vs Spring data jdbc vs Spring data jpa](#product-comparison)
* [Current state](#current-state)
* [DDD principles](#ddd-principles)

## Spring jdbc vs Spring data jdbc vs Spring data jpa

Before Spring data jdbc there were already Spring jdbc and Spring data jpa. 
If you would position Spring data jdbc, then you could put it between these two. 
It combines the usability of the spring data family with the flexibility of of Spring jdbc.

### Spring jdbc
Spring jdbc is the way previously used to work with jdbc directly. 
This is currently used when you need the full control of the data storage and retrieval process.
One of the major disadvantages of this product is that it is very verbose and it can be quite complicated. 
It can be quite complicated because you need to manage the entire jdbc process yourself. 
Spring helps you a bit by providing the Jdbc Templates which makes it a little bit easier.

### Spring data jpa
Spring data jpa is a frequently used persistence framework. 
It is very useful because it helps with keeping the state of entities persisted inside a database.
Programs that use spring data jpa have an entity context which spring data jpa manages.
This makes sure that when an entity is changed, this change will be saved into the database.
Spring data jpa is a framework with many capabilities. This makes it also rather complex. 
It is rather hard to understand what processes are done "under the hood" of spring data jpa.
Because spring data jpa manages the entity context, you lose some control. 
For example because changes in entities are saved automatically, you don't have control if and when you want to save this.

### Spring data jdbc
Spring data jdbc is created to help you with managing your persistence with jdbc but with less boiler plate code.
The result is that now, instead of writing a lot of code, this can be replaced by annotations and a lot less code.
This makes it a lot easier to work with and a new contender as a persistence framework. 
Because you use jdbc almost directly this makes it much easier to understand when compared with spring data jpa and also gives you more control.

## Current state
### Annotations
Spring data jdbc is managed mostly by annotations. The most important annotations are similar to other spring data packages.
For example @OneToMany is also used in spring data jdbc.

### Mybatis

### custom namingstrategy

### Restrictions
Because it is a rather new product, not all functionalities are implemented yet and some functionalities you know from other spring data products will never be implemented.

#### What can be expected
Some functionalities are said to be implemented in a later date. 
I haven't found a timeline so I don't know when certain functionalities will be implemented.
##### Named queries
Currently only a very small set of queries are added to the repositories. Some queries like findById are already added. 
It is currently not possible to use power of the named queries like we know them from other spring data projects. 
When you need a query that is not provided in the standard set than instead of defining the query inside the name of a method in the repository, you need to use the @Query annotation.

## Why is it good
### DDD principles
Spring data jdbc uses the system of aggregates coming from DDD to help with modularisation of the application.
Spring data jdbc only supports, and will only support, on-to-many relationships. This means that classes that are connected by many-to-many or many-to-one relationships can't be connected direcly.
When you only use on-to-many relationships you will create some kind of tree with at top one class. 
This class is called the aggregate root and because this it the only entrypoint to get to the other classes, this means that this class manages the entire tree. The tree is called an aggregate.
It also means that when the aggregate root disappears the entire aggregate will disappear. If you want that some objects keep existing after that the aggregate root disappears, then this objects shouldn't be part of the aggregate.
Of cource it is necessary to be able to represent such relations. But this is solved by not connecting the classes directly, so the classes aren't referenced direcly but instead, id's need to be used.

### Advantages of these principles
By using aggregates there will be modularisation of your application because only the classes that really depend on each other, which can't exist without each other, are connected directly.
It makes it also more simple to understand how and when entities will be persisted. Because the aggregate root manages the entire aggregate, when the aggregate root gets persisted, the entire tree will be persisted. 
So when he gets created, updated or deleted, the rest of the aggregate will follow. Because there is modularisation, only the necessary classes are in the aggregate.
Because we use id's to represent connections to classes that are not parts of the aggregate, this helps with separating it from the aggregate and makes sure that it won't be changed when to aggregate changes.

## Should I use it?
Spring data jdbc is in my opinion a very nice addition to the spring data family with lot of potential. But currently I wouldn't yet recemmend to use it in a live project because it still has some "children diseases" like some bugs.
It still doesn't offer named queries and some other functionalities that are very usefull when you want to use is.
But I would recommend to already play with it a bit because I think that it will have a bright future and currently the basis is already laid so when it breaks through you will have an advantage because you looked at it.