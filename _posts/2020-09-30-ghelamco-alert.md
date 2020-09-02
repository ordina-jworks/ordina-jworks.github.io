---
layout: post
authors: [kevin_govaerts, bas_moorkens]
title: 'Ghelamco alert: '
image: /img/2020-08-06-kubernetes-clients-comparison/banner.jpg
tags: [iot, rpi, aws, serverless, api-gateway, s3, lambda, greengrass, docker]
category: Cloud
comments: true
---

## Table of Contents

* [Introduction](#introduction)


## Introduction
At Ordina we have a beatiful office in the Ghelamco arena in Gent.  
The drawback of having the office in the stadium is that on matchdays we need to clear the parking spaces 3 hours before a match.  
If the parking spaces are not cleared in time, we risk fines up to 500 euros per car.  
Of course we do not want to spend our money on fines when instead we could be buying more pizzas.  
So we came up with the **ghelamco alert** solution to let us know when a game will be taking place so that the people working in the Ghelamco offices can be warned in time.  

The premise is pretty simple: we will run a Raspberry Pi device inside the office that is connected to a red light.  
On matchdays the RPI will turn on the light a couple hours before the game to warn our employees that they have to leave the parking on time.  
We also created a web application that controls our RPI so we can snooze alerts, create custom alerts, see a history of alerts, ...  


