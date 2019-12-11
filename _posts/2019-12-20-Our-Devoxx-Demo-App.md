---
layout: post
authors: [kevin_van_den_abeele]
title: "Our Devoxx Demo App"
image: /img/2019-12-20-devoxx-demo/banner.jpg
tags: [Internet of Things, Smart Tech, Home, AI, ML, Computer vision, object detection, electron]
category: Machine Learning
comments: true
---
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.9.0/css/lightbox.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-grid-only@1.0.0/bootstrap.css" />

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.9.0/js/lightbox.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap-grid-only@1.0.0/index.min.js"></script>

## Table of Contents

1. [Introduction](#introduction)
2. [Overview](#overview)
3. [Setup](#setup)
4. [Examples](#examples)
5. [Conclusion](#conclusion)
6. [Resources](#resources)

## Introduction

Like every year we were present with Ordina at Devoxx as a sponsor.
For this edition I had prepared a demo application with realtime object detection.
Our demo was a huge success and is the reason I'm writing this blog post.

In this blog post I'll explain how to get everything set up to make your own application that uses real time object detection!
All code is available online on our [ordina-jworks github](https://github.com/ordina-jworks/devoxx-webcam-ml){:target="_blank" rel="noopener noreferrer"} and contains a number of branches with specific implementations.

## Overview

Before we dive into the actual code I'll explain what technologies I've used and how they all come together to form this demo application.

The demo uses the following technologies:

- Electron: <br/>
  This serves as the multi-platform app container which allows us to write what is essentially a web application, and run it on a variety of operating systems.
- TensorFlow.js: <br/>
  This is the machine learning library used to run the model for object detection.
- CoCo Dataset: <br/>
  Stands for `Common Objects in Context` and is a very large, highly curated dataset of images which have been annotated with one or more or 90 classes.
  - CoCo-SSD: <br/>
    A default implementation by TensorFlow itself utilizing an SSD detector (Single Shot MultiBox Detection).
    I have downloaded the pre-trained model and it is included in the github repo
  - YoLo V3: <br/>
    Is an object detection system that look at the whole image at test time and derives its predictions based on the global context of said image.
- Node.js: <br/>
  Needed for npm and building the demo app, electron also provides the option to use bare node code/packages in the code, more on that later.
  

## Setup

The demo app uses Electron as the main 'framework'.
The setup for the application is pretty simple, there are just a few dependencies in the package.json:

```json
"engines": {
    "node": ">=12.13.0"
  },
  "dependencies": {
    "@tensorflow/tfjs-node": "^1.2.11",
    "typescript": "^3.6.4"
  },
  "devDependencies": {
    "electron": "7.0.0",
    "electron-packager": "^14.0.6"
  }
```

The main entry point for the application is just under the src folder of the root folder of the project.

The bootstrapping code is also very simple:

``` javascript
const { app, BrowserWindow } = require('electron');

function createWindow () {
    let win = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            nodeIntegration: true
        }
    });

    //win.webContents.openDevTools();
    win.loadFile('./src/devoxx/site/index.html');
}

app.on('ready', createWindow);
```

We import the `app` and `BrowserWindow` and create a function that creates a new instance of the `BrowserWindow` class.
This instance specifies the configuration for the Electron app.
We set the width & height and set the `nodeIntegration` to true so we can use the file system from within the browser code.
We also tell the `BrowserWindow` instance to load a certain html resource.
Finally we bind the `app` ready event to create the `BrowserWindow` instance.

Additionally for debugging it can be handy to uncomment the line `win.webContents.openDevTools();` as that will open a chrome devtools window when the application launches.

## Examples

TODO

## Conclusion

Making a cool demo that utilizes machine learning and pre-trained models is not at all that hard. 
Rapid prototyping with these pre-trained models allows one to quickly see if a certain strategy or desired functionality is workable and merits further development effort.
It also provides a way to get started easily in a matter that is extremely hard to master. 
Retraining or tweaking these models can be very hard and time consuming as it requires an in depth knowledge of the matter at hand (both mathematics and the actual data).
Im my opinion these pre-trained models and other machine learning 'building blocks' provide an extremely valuable toolset for developers.

## Resources

- [Demo github repo](https://github.com/ordina-jworks/devoxx-webcam-ml){:target="_blank" rel="noopener noreferrer"}
- [TensorFlow.js](https://www.tensorflow.org/js){:target="_blank" rel="noopener noreferrer"}
- [CoCo Dataset](http://cocodataset.org/#home){:target="_blank" rel="noopener noreferrer"}
- [tfjs-CoCo-SSD](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd){:target="_blank" rel="noopener noreferrer"}
- [YoLo](https://pjreddie.com/darknet/yolo/){:target="_blank" rel="noopener noreferrer"}
- [tfjs-YoLo-V3](https://github.com/zqingr/tfjs-yolov3/blob/master/README_EN.md){:target="_blank" rel="noopener noreferrer"}