---
layout: post
authors: [kevin_van_den_abeele]
title: "Building a custom YOLOv5 Ordina logo detector"
image: /img/2020-12-17-ordina-logo-detector/banner.jpeg
tags: [Ordina, JWorks, AI, ML, Machine Learning, Artificial Intelligence, YOLO, YOLOv5, image detection, object detection, cuda, nvidia, training, coco, dataset, image recognition]
category: IoT
comments: true
---
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.9.0/css/lightbox.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-grid-only@1.0.0/bootstrap.css" />

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.9.0/js/lightbox.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap-grid-only@1.0.0/index.min.js"></script>

## Table of Contents

1. [Introduction](#introduction)
2. [YoloV5](#yolo-V5)
3. [Creating a dataset](#creating-a-dataset)
4. [RoboFlow](#roboflow)
5. [Training the model](#training-the-model)
6. [Testing the model](#testing-the-model)
7. [Resources](#resources)

## Introduction

Machine learning is here to stay.
It's also a must look into type of thing for a lot of people.
However making a fully custom model to do a specific task is very hard.
This blog post will go into detail on how to take a prebuilt/trained model and use it for our own purpose.
We will take the YOLOv5 model and retrain it with a fully custom dataset to detect the company logo.
Read on down below and follow along for the ride.

Please note that if you want to test this by yourself it is advised to have a decent computer with an NVidia CUDA capable GPU or use an online platform like Google [Colab](https://colab.research.google.com/){:target="_blank" rel="noopener noreferrer"} which will give you a free cloud GPU to test things with.

## Yolo V5

[YOLOv5](https://github.com/ultralytics/yolov5){:target="_blank" rel="noopener noreferrer"} is the fifth mayor iteration for the `You Only Look Once` model.
It's a very high performing and popular model for performing object detection.
The model is fully open source and is trained on the CoCo dataset and can perform detections of about 80 classes of objects.
It's also relatively easy to retrain the model with custom data so it can perform detection on other things than the [CoCo dataset](https://cocodataset.org/#home){:target="_blank" rel="noopener noreferrer"} & objects.

For iOS users there is an app available [on the app store](https://apps.apple.com/app/id1452689527){:target="_blank" rel="noopener noreferrer"} that allows you to use the YoloV5 model in realtime with the camera your device.
The speed and accuracy is quite impressive, make sure to give it a try!

The model has different sizes that can be used, each specific size has pros and cons.
The larger models will perform better but require a lot more compute power.

<img alt="YoloV5 model sizes" src="{{ '/img/2020-12-17-ordina-logo-detector/v5-model-sizes.jpeg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 800px;">

For this example we will be retraining the large model, since I have a decent NVidia GPU I can use.

## Creating a dataset

A good dataset is extremely important when (re)training a model.
It has an immense effect on the training process.

For our custom logo detection I've made about 100 photos of the Ordina logo in different forms and under different conditions.
It's very important that there are a lot of different images and most single images should have different versions with slight alterations.
This can be a very time consuming thing to do!
As we will later see there are tools to help with this!

Making and gathering photos with the logo is only one part of the preparations that need to be done.
The second part can be even more tedious but is quintessential to the training process.
The photos need to be labelled.
This means creating a file that defines where the logos are located in the photo.

This can be done by hand, but it's easier to use a decent tool, one of the tools that can do this is [LabelImg](https://github.com/tzutalin/labelImg){:target="_blank" rel="noopener noreferrer"}.
An open source tool for annotating images.
It is a python program that can be run on most operating systems.

Annotating is simple yet time consuming.
We run the program, select the folder where all the images are stored and manually go over each photo, drawing a bounding box over each Ordina logo and saving the data before moving on to the next photo.

<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/2020-12-17-ordina-logo-detector/label-img.jpeg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="Logo detected 1">
        <img alt="stack" src="{{ '/img/2020-12-17-ordina-logo-detector/label-img.jpeg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 42%; display: inline-block;">
    </a>
    <a href="{{ '/img/2020-12-17-ordina-logo-detector/labelimg-done.jpeg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="Logo detected 2">
        <img alt="stack" src="{{ '/img/2020-12-17-ordina-logo-detector/labelimg-done.jpeg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 46%; display: inline-block;">
    </a>
</div>

## RoboFlow

Once the data is labelled we want to use it to our advantage.
A single photo can be skewed, blurred, pixelation added, hue moved (preferably a combination of all).
This allows a single photo to become many more versions.

The manual method for doing this could involve using Photoshop macros on all the photos, then adding the annotations for the newly generated files.
There are however tools that manage this for us.
One of these tools is [RoboFlow](https://app.roboflow.com/){:target="_blank" rel="noopener noreferrer"}, an online dataset management system.
RoboFlow allows you to upload images and add "augmentations" to the images.
These augmentations are combined and like in our example we can create 226 images out of 94 base images, not bad.
This is greatly beneficial in preventing the model from [overfitting](https://en.wikipedia.org/wiki/Overfitting){:target="_blank" rel="noopener noreferrer"} when used correctly.
The free tier only allows a maximum of 3 augmentations per image so a large starting set of images is recommended.
The pictures in the dataset are subdivided into three categories:

- Training: Used for training the model
- Validation: Used for hyperparameter tuning during the training process
- Testing: Used to evaluate the model in each epoch

<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/2020-12-17-ordina-logo-detector/roboflow-upload-dataset.jpeg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="Logo detected 1">
        <img alt="stack" src="{{ '/img/2020-12-17-ordina-logo-detector/roboflow-upload-dataset.jpeg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 27%; display: inline-block;">
    </a>
    <a href="{{ '/img/2020-12-17-ordina-logo-detector/roboflow-test-split.jpeg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="Logo detected 2">
        <img alt="stack" src="{{ '/img/2020-12-17-ordina-logo-detector/roboflow-test-split.jpeg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 21%; display: inline-block;">
    </a>
     <a href="{{ '/img/2020-12-17-ordina-logo-detector/add_augmentation.jpeg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="Logo detected 3">
        <img alt="stack" src="{{ '/img/2020-12-17-ordina-logo-detector/add_augmentation.jpeg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 13%; display: inline-block;">
    </a>
     <a href="{{ '/img/2020-12-17-ordina-logo-detector/dataset-overview.jpeg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="Logo detected 3">
        <img alt="stack" src="{{ '/img/2020-12-17-ordina-logo-detector/dataset-overview.jpeg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 26%; display: inline-block;">
    </a>
</div>

Once we have added the photos and the augmentations we can generate a version of the dataset and use the link to the dataset zip file to retrain the model.
It's very important to select the correct export format, being YOLOv5 PyTorch.

<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/2020-12-17-ordina-logo-detector/download-dataset.jpeg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="Logo detected 1">
        <img alt="stack" src="{{ '/img/2020-12-17-ordina-logo-detector/download-dataset.jpeg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 50%; display: inline-block;">
    </a>
    <a href="{{ '/img/2020-12-17-ordina-logo-detector/link-to-dataset.jpeg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="Logo detected 2">
        <img alt="stack" src="{{ '/img/2020-12-17-ordina-logo-detector/link-to-dataset.jpeg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 42%; display: inline-block;">
    </a>
</div>

## Training the model

For training the model I used the [excellent blog post](https://blog.roboflow.com/how-to-train-yolov5-on-a-custom-dataset/){:target="_blank" rel="noopener noreferrer"} on the RoboFlow blog as a starting point, combined with the "Train-Custom-Data" section on the YoloV5 github wiki.
I did use Google Colab for the first try and it does work, be it slower than on my personal machine.

Doing the training locally requires python3 and pip to be installed, virtualenv to be setup and the correct NVidia drivers to be loaded (at least on Debian).
I created a new folder in which I cloned the YOLOv5 repo and created a new python virtual environment and started Jupyter notebook.
The [RoboFlow Google Colab](https://colab.research.google.com/drive/1gDZ2xcTOgR39tGGs-EZ6i3RTs16wmzZQ){:target="_blank" rel="noopener noreferrer"} is a great place to start.
I copied all the steps over, making edits to allow it to run on my local machine.
If you want to test this too, just copy the Google Colab file to your own Google Drive and start it from there.
Google will even give you a cloud based GPU to use, for free!

The retraining process contains these main steps:

- Clone the YoloV5 repo, install any dependencies
- Download the dataset zip file and extract its contents
- Process the data generated in the dataset, choosing the size of the Yolo model to retrain and setting the number of classes that are in the dataset
- Retrain the model by using the 'train.py' file in the YOLOv5 repo
- Evaluate the training progress by using TensorBoard
- Save the best & latest model weights to a folder for later use
- Perform some own detection on previously unseen images

## Testing the model

The last step after the model has been trained is to see how well it does when presented some new photos which were not in the dataset.
Performing the detection is simple.
We use the `detect.py` file in the YOLOv5 repo.

An example to perform detection on all files in a folder:

```python
!python detect.py --weights runs/train/{today}/weights/best.pt --img 416 --conf 0.5 --source ../custom-test --name custom --exist-ok --save-txt --save-conf
```

The used parameters do the following:

- weights: This points to the weights file that has been created and saved by the retraining process
- img: Specified the size of the image, it will automatically resize any image input to match this number, has to be 416 this model
- conf: The minimum confidence level that should be reached to count as a detection
- source: A media file, being an image(or a folder containing multiple)/video/stream/
- name: Name of the folder to output the results to (will be stored under `yolov5/runs/detect/NAME`)
- exist-ok: Overwrite existing output instead of incrementing the name
- save-txt: Save the detection data to a text file (bounding box)
- save-conf: Add the confidence level to the text file

The result will be a folder named custom where all the images and text files reside.
Each image will have a bounding box drawn around the detected logo, if any, with a confidence level.
Each text file will contain the box coordinates in normalized WHXY format.

Example of text output
```
Class W H X Y Conf
0 0.503968 0.540551 0.207672 0.0691964 0.791504
```

<img alt="Box coordinates" src="{{ '/img/2020-12-17-ordina-logo-detector/bbox.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 800px;">

The text file contains all the basic info that is needed to further process the detection result:

- Class: Class that has been detected
- W: The width of the detected object/bounding box, to be divided by 2 and extended from the X-Coordinate in both directions
- H: The height of the detected object, to be divided by 2 and extended from the Y-Coordinate in both directions
- X: The X-coordinate of the center of the detected object
- Y: The Y-coordinate of the center of the detected object
- Conf: (Optional) The confidence level, between 1 and 0.000001 (or between 1 and the minimum specified during detection), 1 being 100% certain, 0.000001 being the least certain possible

As you can see below one of my retrained models was able to detect the logo in all three never before seen images!

<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/2020-12-17-ordina-logo-detector/1.jpg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="Logo detected 1 - 79%">
        <img alt="stack" src="{{ '/img/2020-12-17-ordina-logo-detector/1.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 23%; display: inline-block;">
    </a>
    <a href="{{ '/img/2020-12-17-ordina-logo-detector/2.jpg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="Logo detected 2 - 91%">
        <img alt="stack" src="{{ '/img/2020-12-17-ordina-logo-detector/2.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 23%; display: inline-block;">
    </a>
     <a href="{{ '/img/2020-12-17-ordina-logo-detector/3.jpg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="Logo detected 3 - 73%">
        <img alt="stack" src="{{ '/img/2020-12-17-ordina-logo-detector/3.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 41%; display: inline-block;">
    </a>
</div>

## Resources

- [YOLOv5](https://github.com/ultralytics/yolov5){:target="_blank" rel="noopener noreferrer"}
- [YOLOv5 IOS app](https://apps.apple.com/app/id1452689527){:target="_blank" rel="noopener noreferrer"}
- [CoCo dataset](https://cocodataset.org/#home){:target="_blank" rel="noopener noreferrer"}
- [LabelImg](https://github.com/tzutalin/labelImg){:target="_blank" rel="noopener noreferrer"}
- [RoboFlow](https://app.roboflow.com/){:target="_blank" rel="noopener noreferrer"}
- [Train YOLOv5 with custom data 1](https://github.com/ultralytics/yolov5/wiki/Train-Custom-Data){:target="_blank" rel="noopener noreferrer"}
- [Train YOLOv5 with custom data 2](https://blog.roboflow.com/how-to-train-yolov5-on-a-custom-dataset/){:target="_blank" rel="noopener noreferrer"}
- [Google Colab document](https://colab.research.google.com/drive/1gDZ2xcTOgR39tGGs-EZ6i3RTs16wmzZQ#scrollTo=1NcFxRcFdJ_O){:target="_blank" rel="noopener noreferrer"}
- [Overfitting](https://en.wikipedia.org/wiki/Overfitting){:target="_blank" rel="noopener noreferrer"}
- [Train/Test/Validate](https://en.wikipedia.org/wiki/Training,_validation,_and_test_sets){:target="_blank" rel="noopener noreferrer"}
