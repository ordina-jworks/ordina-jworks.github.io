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

### 