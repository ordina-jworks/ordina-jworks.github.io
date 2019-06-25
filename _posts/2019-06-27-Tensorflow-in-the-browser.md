---
layout: post
authors: [kevin_van_den_abeele]
title: "Getting started with Tensorflow in the browser"
image: /img/2019-06-27-tensorflowjs/banner.jpg
tags: [internet of things, iot, smart things, smart tech, machine learning, artificial intelligence, tensorflow, javascript, js, browser, node]
category: IoT, Smart tech, machine learning
comments: true
---
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.9.0/css/lightbox.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-grid-only@1.0.0/bootstrap.css" />

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.9.0/js/lightbox.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap-grid-only@1.0.0/index.min.js"></script>

## Table of Contents

1. [Introduction](#introduction)
2. [TensorFlow](#tensorflow)
4. [TensorFlow.js](#tensorflowjs)
5. [Making it easier](#ml5)
6. [Resources](#resources)

## Introduction

Machine learning is a hot topic right now, and rightfully so!
It is also something that is very very hard to do.
If you're trying to do it right, that is.
Since AI/ML is here to stay and not everyone has the time and resources to study every aspect of ML, we need something to help us.
We already have TensorFlow which runs in python, again nice if you know python.
But what if you want to experiment with ML in your latest web application?
The answer is here! [TensorFlow.js](https://www.tensorflow.org/js){:target="_blank" rel="noopener noreferrer"}

This blogpost serves as a quick introduction to TensorFlow.js and ML5 so you too can get started with some cool AI/ML examples in your webapps!

## Tensorflow

<img alt="Tensorflow" src="{{ '/img/2019-06-27-tensorflowjs/tensor.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 800px;">

If we are going to implement machine learning into an application TensorFlow is one of the most used libraries that provides everything we need to get started.
It has been around from quite some time and is really mature.
It is fully open source and a well adopted industry standard with great tooling and lots of reference materials.

The full documentation on TensorFlow can be found [here](https://www.tensorflow.org/guide){:target="_blank" rel="noopener noreferrer"}.
Learning TensorFlow is a long process that requires dedication and a lot of trial and error.
Experimentation is key!

There also a lot of very good online courses to get started with machine learning that can greatly aid your progress in understanding the key principles and concepts.

<div class="responsive-video">
    <iframe width="1164" height="655" src="https://www.youtube.com/watch?v=vq2nnJ4g6N0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>
<br/>
<div class="responsive-video">
    <iframe width="1164" height="655" src="https://www.youtube.com/watch?v=tYYVSEHq-io" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>
<br/>

There are many more videos about getting started, and there are also some very good courses on online educational websites like Coursera and Pluralsight.
They are a great place to start, but always remember that only with extended trail and error and experimentation you will fully grasp the logic behind it all!

## TensorFlowjs

<img alt="TensorFlow.js" src="{{ '/img/2019-06-27-tensorflowjs/tensorflowjs.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 800px;">

Enter TensorFlow.js.
This 'new' addition to the TensorFlow lineup allows developers to utilize the power of machine learning in the browser or in Node.
The biggest advantage of this is that models written in Python can be converted and reused.
This allows for some very cool use cases we will go into a bit later.

TensorFlow.js is nice because:

- GPU accelerated (in the browser), thanks to WebGL/OpenCL, and this even on non Cuda cards!
- Lower barrier of entry, no prior Python knowledge required (but can be handy)
- Convert/retrain/reuse existing models with your own data
- Quickly prototype into existing applications without having to setup a full ML pipeline
- In the browser we have direct access to various input devices/sensors like the camera/accelerometer/location/...

This sound almost too good to be true!
But there are a few limitations though.
Browsers are a lot more memory constrained than when training a model 'offline' with python.
This means that super complex models pose an issue when training in the browser, keep this in mind!
You can however always train a model offline and only use TensorFlow.js to run the model in the browser and make predictions.

### A small example

TODO

## ML5

<img alt="ML5" src="{{ '/img/2019-06-27-tensorflowjs/ml5-examples.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 800px;">

TODO

<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/2019-06-27-tensorflowjs/todo.jpg' | prepend: site.baseurl }}" data-lightbox="ui" data-title="TODO">
        <img alt="stack" src="{{ '/img/2019-06-27-tensorflowjs/todo.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 49%; display: inline-block;">
    </a>
     <a href="{{ '/img/2019-06-27-tensorflowjs/todo.jpg' | prepend: site.baseurl }}" data-lightbox="ui" data-title="TODO">
        <img alt="stack" src="{{ '/img/2019-06-27-tensorflowjs/todo.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 49%; display: inline-block;">
    </a>
</div>

### Some examples

TODO

## Resources

- [TensorFlow.js](https://www.tensorflow.org/js){:target="_blank" rel="noopener noreferrer"}
- [ML5](https://ml5js.org/){:target="_blank" rel="noopener noreferrer"}
- [ML5 Examples](https://github.com/ordina-jworks/TensorFlow.js){:target="_blank" rel="noopener noreferrer"}