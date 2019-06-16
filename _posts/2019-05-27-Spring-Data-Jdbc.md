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

### Restrictions
Because it is a rather new product, not all functionalities are implemented yet and some functionalities you know from other spring data products will never be implemented.