---
layout: post
authors: [kevin_van_den_abeele]
title: "Our Devoxx Demo App with realtime object detection"
image: /img/2019-12-16-devoxx-demo/banner.jpg
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
4. [Code](#code)
5. [Conclusion](#conclusion)
6. [Resources](#resources)

## Introduction

Like every year we were present with Ordina at Devoxx as a sponsor.
For this edition I had prepared a demo application with realtime object detection.
Our demo was a huge success and is the reason I'm writing this blog post.

In this blog post I'll explain how to get everything set up to make your own application that uses realtime object detection!
All code is available online on our [ordina-jworks Github](https://github.com/ordina-jworks/devoxx-webcam-ml){:target="_blank" rel="noopener noreferrer"} and contains a number of branches with specific implementations.

## Overview

Before we dive into the actual code, I'll explain what technologies I've used and how they all come together to form this demo application.

The demo uses the following technologies:

- Electron: <br/>
  This serves as the multi-platform app container which allows us to write what is essentially a web application, and run it on a variety of operating systems.
- TensorFlow.js: <br/>
  This is the machine learning library used to run the model for object detection.
- CoCo Dataset: <br/>
  Stands for `Common Objects in Context` and is a very large, highly curated dataset of images which have been annotated with one or more of 90 classes.
  - CoCo-SSD: <br/>
    A default implementation by TensorFlow itself utilizing an SSD detector (Single Shot MultiBox Detection).
    I have downloaded the pre-trained model and it is included in the Github repo
  - YoLo V3: <br/>
    Is an object detection system that looks at the whole image at test time and derives its predictions based on the global context of said image.
- Node.js: <br/>
  Needed for npm and building the demo app, Electron also provides the option to use bare Node code/packages in the code.
  

## Setup

The demo app uses Electron as the main 'framework'.
The setup for the application is pretty simple, there are just a few dependencies in the `package.json`:

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

The main entry point for the application is just under the `src` folder of the root folder of the project.

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
We set the `width` and `height` and set the `nodeIntegration` to `true` so we can use the file system from within the browser code.
We also tell the `BrowserWindow` instance to load a certain html resource.
Finally we bind the `app` ready event to create the `BrowserWindow` instance.

Additionally for debugging it can be handy to uncomment the line `win.webContents.openDevTools();` as that will open a Chrome DevTools window when the application launches.

<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/2019-12-16-devoxx-demo/demo.jpg' | prepend: site.baseurl }}" data-lightbox="ui" data-title="Devoxx Demo">
        <img alt="Devoxx Demo" src="{{ '/img/2019-12-16-devoxx-demo/demo.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 55%; display: inline-block;">
    </a>
    <a href="{{ '/img/2019-12-16-devoxx-demo/devoxx-demo.jpg' | prepend: site.baseurl }}" data-lightbox="ui" data-title="Devoxx Demo in action">
        <img alt="Devoxx Demo in action" src="{{ '/img/2019-12-16-devoxx-demo/devoxx-demo.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 43%; display: inline-block;">
    </a>
</div>

## Code

The basic code is not too difficult:

``` javascript
window.onload = async () => {
    const detector = await Loader.loadCoco(false, path.resolve(__dirname, '../../../'));
    const stream = await navigator.mediaDevices
        .getUserMedia({
            video: {
                width: 1280,
                height: 720,
                frameRate: framerate
            }
        });

    let video = document.querySelector('video');
    video.srcObject = stream;
    video.onloadedmetadata = () => {
        video.play();
    };

    const canvas = document.querySelector('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    await update(video, canvas, context, detector);
};
```

Once the page is loaded we create our detector instance.
This will be used to feed in the image data from the webcam.
We also need to fetch a video stream from the webcam, in this example at 720P, as that's the max resolution for my webcam.
Please note that a higher resolution will require considerably more processing power.
After we have a stream, we fetch the `video` tag from the page, assign the stream to it and let it play.
We also get our canvas in which we will display the actual video output, the video tag itself is hidden.
The canvas allows us to annotate the image with a bounding box and some extra information about the detected objects.
Finally we call the `update` method which will be called for each update.

``` javascript
async function update(video, canvas, context, detector) {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const detectedClasses = await detector.detect(canvas);
    Loader.anotateCanvas(canvas, detectedClasses);
    updateList(detectedClasses);

    if (enableLiveUpdate) {
        setTimeout(update, 1000 / framerate, video, canvas, context, detector);
    }
}
```
This function will function as our update loop/tick.
We draw the image to the canvas, just as it was seen by the webcam.
We then pass the canvas into the detector which will detect any objects in the image data contained in the canvas.
This returns an array of detected classes which contain the type of objects, the score and a bounding box.
That information is fed to a utility method that will annotate the canvas with a red rectangle with the coordinates of the bounding and the type of object with its score.
The update function will be called again with a very basic (and very limited) framerate timeout.

There is other code, mainly in the `coco` folder which is mostly taken from the [default google implementation](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd){:target="_blank" rel="noopener noreferrer"} and modified to match the needs of this application.
One thing worth noting is the changes required to a small piece of code to make the model work faster by allowing it to work asynchronously:
```typescript
    const [maxScores, classes] = this.calculateMaxScores(scores, result[0].shape[1], result[0].shape[2]);

    const indexTensor = tf.tidy(() => {
        const boxes2 = tf.tensor2d(boxes, [result[1].shape[1], result[1].shape[3]]);
        return tf.image.nonMaxSuppression(boxes2, maxScores, maxNumBoxes, 0.5, 0.5);
    });

    const indexes = indexTensor.dataSync() as Float32Array;
    indexTensor.dispose();
```

Needs to be changed into:

```typescript
    const [maxScores, classes] = this.calculateMaxScores(scores, result[0].shape[1], result[0].shape[2]);

    const boxes2 = tf.tensor2d(boxes, [result[1].shape[1], result[1].shape[3]]);
    const temp = await tf.image.nonMaxSuppressionAsync(boxes2, maxScores, maxNumBoxes, 0.5, 0.5);
    const indexTensor = tf.tidy(() => {
        return temp;
    });

    const indexes = indexTensor.dataSync() as Float32Array;
    indexTensor.dispose();
```

Because the `tf.image.nonMaxSuppressionAsync`returns a `Promise` the replacement is not as simple as just replacing the method call to the async variant.
This however is the only big change that needs to be done (apart from changing some dependencies) to get the application working with full WebGL acceleration.

The application is actually really simple and very easy to understand and tinker with. I strongly encourage you to check out the repo and have a go at getting it up and running by yourself.
The other branches contain different solutions with some tweaked code, be sure to also check those out!

## Conclusion

Making a cool demo that utilizes machine learning and pre-trained models is not at all that hard. 
Rapid prototyping with these pre-trained models allows one to quickly see if a certain strategy or desired functionality is workable and merits further development effort.
It also provides a way to get started easily in a matter that is extremely hard to master. 
Retraining or tweaking these models can be very hard and time consuming as it requires an in-depth knowledge of the matter at hand (both mathematics and the actual data).
Im my opinion these pre-trained models and other machine learning 'building blocks' provide an extremely valuable toolset for developers.

## Resources

- [Demo Github repo](https://github.com/ordina-jworks/devoxx-webcam-ml){:target="_blank" rel="noopener noreferrer"}
- [TensorFlow.js](https://www.tensorflow.org/js){:target="_blank" rel="noopener noreferrer"}
- [CoCo Dataset](http://cocodataset.org/#home){:target="_blank" rel="noopener noreferrer"}
- [tfjs-CoCo-SSD](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd){:target="_blank" rel="noopener noreferrer"}
- [YoLo](https://pjreddie.com/darknet/yolo/){:target="_blank" rel="noopener noreferrer"}
- [tfjs-YoLo-V3](https://github.com/zqingr/tfjs-yolov3/blob/master/README_EN.md){:target="_blank" rel="noopener noreferrer"}