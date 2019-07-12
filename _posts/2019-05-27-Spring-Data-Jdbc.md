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

## Introduction
Spring data jdbc is a new member of the spring data family. 
It is created to fill a void that sits between spring jdbc and spring data jpa.
Spring data jdbc contains a lot of features that other spring data products also possess. 
The creators also wanted to make this product more easy to understand and use than spring data jpa and they want to force you to use DDD principles in your project.
In the rest of this article the differences with spring data jpa and sping jdbc will be shown.
This will hopefully show that spring data jdbc is a very nice product with a lot of potential that is designed to help you.

## Spring jdbc vs Spring data jdbc vs Spring data jpa

### Setting up the database

#### Spring jdbc
When you use spring data jdbc, you don't create a domain model which can be mapped to the database. 
You can use spring templates to create tables and even fill them up. To do this, you need to write SQL statements and execute them with a JdbcTemplate.

##### Example:
{% highlight java %}

    SingleConnectionDataSource dataSource = new SingleConnectionDataSource();
    dataSource.setDriverClassName("org.hsqldb.jdbcDriver");
    dataSource.setUrl("jdbc:hsqldb:data/jdbcexample");
    dataSource.setUsername("sa");
    dataSource.setPassword("");
        
    JdbcTemplate template = new JdbcTemplate(ds);
    template.execute("create table car (id int, model varchar)");
    template.execute("insert into car (id, model) values (1, 'Volkswagen Beetle')");
    
    dataSource.destroy();
    
{% endhighlight %}

#### Spring data jpa
Spring data jpa helps you with setting up the database by mapping the entity structure to the database. 
So with spring data jpa you don't have to write all the sql statements yourself to create your database schema, because this can be done automatically by spring data jpa.
The only thing you need to do is create your entity structure inside your project and annotate it properly so spring data jpa can understand.
This can become rather complicated when you have a complicated structure with a lot of one-to-many, many-to-one, many-to-many ... relationships.

Instead of 1 class you need 

##### Example:


#### Spring data jdbc
DDD eerste keer aanhalen. Alleen one-to-many relationships. Verdere uitleg gaat gedaan worden in "better design".

### Querying the database

#### Spring jdbc

#### Spring data jpa

#### Spring data jdbc
@query is anders (jpql). Er is geen lazy loading. Geen caching.

### updating an instance

#### Spring jdbc

#### Spring data jpa

#### Spring data jdbc
Geen dirty tracking


## Advantages of using spring data jdbc
### Better design
I have mentioned multiple times that spring data jdbc will help you with following Domain driven design principles. A great explanation why this design can help you can be found here: https://dddcommunity.org/library/vernon_2011/
small entities, only one-to-many relationships. Otherwise you need to use id's. You can easily see what is in aggregate. When you use objects it is in aggregate. 
If it is an id, it is not part of the aggregate. 1 repository per aggregate.


### Easier to understand
No lazy loading, no caches, ... You need to do more yourself. If you want to save something, you will need to call save. If you want to update something you 


### Performance
You can write your queries yourself which will executed exactly as you specified them into the database. 
This is for example different to spring data jpa which uses jpql.

## Should I use it?
Spring data jdbc is in my opinion a very nice addition to the spring data family with lot of potential. But currently I wouldn't yet recommend to use it in a live project because it still has some "children diseases" like some bugs.
It still doesn't offer named queries and some other functionalities that are very usefull when you want to use is.
But I would recommend to already play with it a bit because I think that it will have a bright future and currently the basis is already laid so when it breaks through you will have an advantage because you looked at it.