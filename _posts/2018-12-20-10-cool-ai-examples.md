---
layout: post
authors: [kevin_van_den_abeele]
title: "10 Cool AI/ML Examples"
image: /img/2018-12-20-AI10EX/banner.jpg
tags: [AI, ML, DL, Example, neural networks, deep learning, machine learning, artificial intelligence, two minute papers, 2 minute papers, intelligence, robotics, self driving cars, automation]
category: IoT, Machine learning
comments: true
---
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.9.0/css/lightbox.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-grid-only@1.0.0/bootstrap.css" />

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.9.0/js/lightbox.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap-grid-only@1.0.0/index.min.js"></script>

## Table of Contents

1. [Introduction](#introduction)
2. [10 Cool examples](#10-cool-examples)
3. [Resources](#resources)

## Introduction

To end the year on a lighter more inspirational note we'll go into 10 cool examples achieved with artificial intelligence.
These are all short videos with some additional information, most of these already have or will soon have an impact on our lives one way or another.

The 10 examples can be divided in to three categories:

### How the models work and perceive the world

1. [How neural networks see the world](#Example_1_-_How_neural_networks_see_the_world)
2. [Attack on human vision system](#Example_2_-_Attack_on_human_vision_system)

### Audiovisual models for rendering, photography and impersonation

1. [Style transfer for videos](#Example_3_-_Style_transfer_for_videos)
2. [Amazing night time photographs](#Example_4_-_Amazing_night_time_photographs)
3. [Nvidia AI based image restoration](#Example_5_-_Nvidia_AI_based_image_restoration)
4. [Noise reduction for path traced GI](#Example_6_-_Noise_reduction_for_path_traced_GI)
5. [Isolate speech signals](#Example_7_-_Isolate_speech_signals)
6. [Impersonate anyone](#Example_8_-_Impersonate_anyone)

### Models used for and helped by gaming

1. [Deepmind becomes superhuman in quake 3](#Example_9_-_Deepmind_becomes_superhuman_in_quake_3)
2. [Using games for deep learning research](#Example_10_-_Using_games_for_deep_learning_research)

For now there is still no need to fear Skynet becoming a reality.
While progress in the artificial intelligence world proceeds at a staggering pace, we are no where near having a general 'super' AI.
This however does not mean precautions do not need to be taken to prevent this from happening in the long run.
Some people, like Elon Musk, are very vocal about this and question if we should even pursue the goal to create a 'super' AI.

<img alt="stack" src="{{ '/img/2018-12-20-AI10EX/intro.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 500px;">


## 10 Cool examples

Below are the ten selected examples we think you should see!
In the resources section underneath all of them you can find more useful resources to use and watch about AI/ML.

### Example 1 - How neural networks see the world

<div class="responsive-video">
    <iframe width="1164" height="655" src="https://www.youtube.com/embed/1zvohULpe_0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>
Understanding a neural network is difficult, we don't actually know what is happening inside of it.
We need ways of visualizing and understanding what happens inside to help debug and improve these networks.
For convolutional neural networks this helps us see what the network sees and how it identifies and uses parts of the input to get to the desired output.


### Example 2 - Attack on human vision system

<div class="responsive-video">
    <iframe width="1164" height="655" src="https://www.youtube.com/embed/AbxPbfODGcs" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>
Not only artificial neural networks are vulnerable to attacks to fool them.
Our very own brain, you know also a neural network, is also able to be tricked by some of these techniques.
This video shows how such an attack works.

<div class="responsive-video">
    <iframe width="1164" height="655" src="https://www.youtube.com/embed/SA4YEAWVpbk" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>
This video shows how neural networks can be fooled by changes to the input as small as a single pixel!
It shows that caution needs to be taken in neural network based image recognition because a sufficiently witty/crafty attacker could fool the system by employing such an attack.


### Example 3 - Style transfer for videos

<div class="responsive-video">
    <iframe width="1164" height="655" src="https://www.youtube.com/embed/Uxax5EKg0zA" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>
Style transfer is when the style of a given input image is transferred to a secondary input image while maintaining the content of that image but with the style of the first input.
This gives you the option to apply the style of certain great works of art to regular images or even works with a totally different style.
In this video the technique is applied to video content, but it is not just as simple as running the earlier technique on each frame of the video since it does not provide a result that is temporally coherent.
The video is styled based on a given input and produces quite amazing results.


### Example 4 - Amazing night time photographs

<div class="responsive-video">
    <iframe width="1164" height="655" src="https://www.youtube.com/embed/bcZFQ3f26pA" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>
Very noisy night time images might soon be a thing of the past.
The technique in this video can turn unusably noisy photos into perfectly viewable photos.
Something like this has been [implemented in the google pixel phones](https://www.theverge.com/2018/10/25/18021944/google-night-sight-pixel-3-camera-samples) recently.
In a few years all cameras will have a mode like this implemented making unusable night shots a thing of the past!


### Example 5 - Nvidia AI based image restoration

<div class="responsive-video">
    <iframe width="1164" height="655" src="https://www.youtube.com/embed/P0fMwA3X5KI" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>
Like the example above this is about denoising and is similar yet different.
This AI has been trained without ever having been shown what noise is, so no before vs after comparison.
It can remove noise from images, restore images that are almost only visible noise and even remove lots of text from a given image.
This technique will make cleaning up images much easier and allow us to preserve and restore imagery that might otherwise be lost or unusable!


### Example 6 - Noise reduction for path traced GI

<div class="responsive-video">
    <iframe width="1164" height="655" src="https://www.youtube.com/embed/HSmm_vEVs10" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>
This video shows that denoising techniques can have other great benefits in the visual/gaming industry.
Path traced global illumination (casting light in a 3D scene to determine lighting from a global source like the sun) is a very resource intensive task.
Current solutions use all sorts of tricks to mimic this but they are not the real deal.
This technique allows for path traced GI with a very low sample count and denoises the output whilst being temporally stable.
Something like the [new cards from Nvidia](https://www.youtube.com/watch?v=Ms7d-3Dprio) are now capable of!


### Example 7 - Isolate speech signals

<div class="responsive-video">
    <iframe width="1164" height="655" src="https://www.youtube.com/embed/zL6ltnSKf9k" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>
Having an audio or video file with multiple people speaking at once or when there is a lot of background noise can be annoying for various reasons.
It makes it harder to understand any of the speaking parties.
This technique allows each speaker's audio to be isolated an listened to without hearing the other sources of interference.
It is helpful to clean up conversations or remove background noise.


### Example 8 - Impersonate anyone

<div class="responsive-video">
    <iframe width="1164" height="655" src="https://www.youtube.com/embed/EQX1wsL2TSs" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>
Soon you will not be able to tell that what you see is actually what happened.
This advanced technique improves on older versions, and allows you to transfer your facial and torso movements onto a target.
Techniques like this make it clear that fake news and fake sources of media will become an even bigger problem in the future as this technology becomes even better.
It might not be such a bad idea to invest in that blockchain backed media repository after all so the validity of media files can be tracked...


### Example 9 - Deepmind becomes superhuman in quake 3

<div class="responsive-video">
    <iframe width="1164" height="655" src="https://www.youtube.com/embed/MvFABFWPBrw" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>
In games you normally play against the AI.
These AI's are mostly cheaters though, they know more because they are fed insider information from the game itself.
The AI's in this video are actual players that only get the video output of the game and learn to play accordingly.
This in the long run will allow games to have decent real AI in-game.
Other sectors can also benefit from this as it can be applied to different fields where complex behavior with tactics and long term planning is required.


### Example 10 - Using games for deep learning research

<div class="responsive-video">
    <iframe width="1164" height="655" src="https://www.youtube.com/embed/QkqNzrsaxYc" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>
Self driving cars are all the rage these days.
Getting cars to drive themselves is an immensely complex task, requiring truly vast amounts of correctly classified data in a dataset.
Classifying this data is a very time consuming process.
This technique can use games like GTAV to create a dataset with imagery from the game.
The game already knows what all the types of objects are in the scene, so classification can be simplified and automated.
It also provides an easy way to simulate hard to recreate situations in real life.
Time of day and scene composition can be easily changed which results in a vastly more extensive dataset.


## Resources

A very good video to watch is [How machines learn](https://www.youtube.com/watch?v=R9OHn5ZF4Uo) by CGP Gray.
It explains (generally) how machine learning works and what some of the implied dangers are.

All the videos used in this blogpost are from the the [Two minute papers](https://www.youtube.com/user/keeroyz/videos) YouTube channel.
This channel has short videos that showcase some scientific research in a visual and compelling way whilst not going too technical but still providing all the technical resources for those who want it.

Lastly is the [playlist about neural networks](https://www.youtube.com/watch?v=aircAruvnKk&list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi) by 3Blue1Brown.
It goes into how neural networks work and is very visual which helps greatly with understanding the subject matter.

- [How machines learn - CGP Gray](https://www.youtube.com/watch?v=R9OHn5ZF4Uo)
- [Two minute papers youtube channel](https://www.youtube.com/user/keeroyz/videos)
- [Neural networks playlist - 3blue1brown](https://www.youtube.com/watch?v=aircAruvnKk&list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi)

All these videos and the accompanying channels on YouTube are from amazing content creators, all rights for the content goes to them.
Do like I do and subscribe to these awesome channels to support them!