---
layout: post
authors: [mohammed_laghzaoui]
title: 'Using Augmented Reality to create an indoor navigation system with ViroReact'
image: /img/virtualreality/banner.jpg 
tags: [React, React Native, ViroReact, Virtual Reality, Augmented Reality, Mixed Reality]
category: IoT
comments: true
---
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.9.0/css/lightbox.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.9.0/js/lightbox.min.js"></script>

## Table of Contents

1. [Introduction](#introduction)
2. [Context](#context)
4. [How it works](#how-it-works)
4. [Used technologies](#used-technologies)
5. [Conclusion](#conclusion)
5. [Resources](#resources)

## Introduction

Mobile applications based on GPS such as Waze or Google Maps have proven to be very useful in guiding us to our destination. With such applications, it's easy to find your way to a destination, even in an unfamiliar city. However, it is still easy to get lost indoors, where GPS satellite signals are not accurately trackable for navigation applications.

In this blogpost, I will introduce the concept of using **augmented reality** and **Indoor Positioning System** with the aim of creating a navigation system that can help people orient themselves and navigate within large buildings as shown in the following video.

<div style="position: relative; width: 100%; height: 0; padding-bottom: 55%;">
    <iframe src="https://www.youtube.com/embed/Gmcl8uDneng" width="100%" height="100%;" style="position: absolute; left: 0; top: 0; bottom: 0; right: 0;"></iframe>
</div>

## Context 

Before beginning to explain the workings of this project, let me introduce the two main concepts, which are augmented reality and Indoor Positioning Systems, to give a little context to better understand the overall functioning of this project.

### Augmented reality

**Augmented reality (AR)** allows us to add layers of visual information about the real world around us, using technology, devices such as our own smartphones. This helps us to generate experiences that provide relevant knowledge about our environment, and we also receive that information in real time.

Through augmented reality the virtual world is intermixed with the real world, in a contextualized way, and always with the aim of better understanding everything around us. In 2017, [Kevin Van Den Abeele](https://ordina-jworks.github.io/author/kevin-van-den-abeele/) together with [Michael Vandendriessche](https://ordina-jworks.github.io/author/michael-vandendriessche/) wrote a fantastic [blogpost](https://ordina-jworks.github.io/iot/2017/12/20/Virtual-Reality.html) that introduces the concept of Augmented Reality in an understandable way.

### Indoor Positioning System

Positioning systems are mechanisms that allow us to detect the position of objects or events in a context (in a coordinate system).

We can differentiate between global and local:

* Global Positioning Systems (GPS) consist of a series of satellites located around the Earth that send signals that allow the receiver to calculate the distance at which these satellites are located and thus be able to calculate their position.

* Local Positioning Systems (LPS) allow us to reach the same objective in a similar way but using local mechanisms instead of satellites (telephone towers, wifi access points, ...) and calculating the position locally.

**Indoor Positioning Systems (IPS)** are specific cases of LPS whose particularity is that they aim to position objects or events within a space not exposed to the open air. The principles are similar in all cases, but their particularities make them different.

<!-- TODO -->

## How it works


## Used technologies

### Frontend

#### React 

#### React Native

#### ViroReact

### Backend

#### NestJs

### Database

#### Neo4j

## Conclusion

## Resources

<!-- TODO -->
