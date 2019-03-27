---
layout: post
authors: [kevin_van_den_abeele, frederick_bousson]
title: "The Vuzix Blade"
image: /img/2019-03-30-vuzix/banner.jpg
tags: [internet of things, iot, AR, VR, MR, Augmented reality, smart tech, smart glasses, glasses, android, vuzix, blade, vuzix blade, CES, Consumer Technology Association]
category: IoT, Smart tech, Smart glasses, Augmented reality
comments: true
---
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.9.0/css/lightbox.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-grid-only@1.0.0/bootstrap.css" />

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.9.0/js/lightbox.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap-grid-only@1.0.0/index.min.js"></script>

## Table of Contents

1. [Introduction](#introduction)
2. [The hardware](#the-hardware)
3. [The software](#the-software)
4. [Using the Vuzix](#using-the-vuzix)
5. [Developing for the Vuzix](#developing-for-the-vuzix)
6. [Looking forward](#looking-forward)
7. [Resources](#resources)

## Introduction

As we are strong believers in the potential that Augmented Reality has to offer in terms of business cases we were wanting to get our hands on some actual hardware.
We acquired some budget and went looking for 'affordable' smart glasses to experiment with.

We came across the Vuzix Blade on the Vuzix website and looked through the details and videos posted.
After acquiring the required budget, thanks Ordina, we preordered one unit.

<div class="responsive-video">
    <iframe width="1164" height="655" src="https://www.youtube.com/embed/V-OxzjsB2s0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>
It was a video like this one that had won us over to give the Vuzix Blade a try since the displayed features look very nice, if they all worked as promised...

After a very long wait, with several delays and a lot of mailing back and forth we got ourselves a preproduction hand built Vuzix Blade.
We got these glasses to analyze the wearers experience and see how we could integrate it into the numerous business cases we can see it being used for:

- Assistance for field technicians
- Order picking
- Communications platforms

In this blogpost we'll go a bit into detail what makes the Vuzix Blade tick and how our experience with it has been so far.
Read on ahead for all the juicy details!

## The hardware

<img alt="Vuzix Blade hardware overview" src="{{ '/img/2019-03-30-vuzix/vuzix-hardware-overview.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 800px;">

The Vuzix Blade is an Android smartphone you can wear on your face. Well, it's more like an Android Smartwatch you can strap to your face.

The device I received was a pre production build, which was hand assembled. So I can't really say much about what the final hardware will look like. 

I have always found the idea of computing devices in the form factor of glasses quite intriguing as I have been cursed with nearsightedness and wear my glasses on a daily basis. 
If I have to wear the bloody things every day, might as well put some intelligence into them.

Below you can find some specs about the device, but for me these are quite irrelevant for the moment. 
This device is all about showcasing innovation in 2 areas: form factor, display technology.

And boy am I impressed. 
The glasses actually feel comfortable enough to wear for longer periods. 
The display technology made my jaw drop to the floor. Had to pick it up several times. 


The Vuzix Blade is well built for a manually assembled device.
It has been through some action like daily use as an office worker, running, biking, ... and still hasn't shown any faults. 

But let's get down the mandatory spec overview!


The internals inside the glasses are alright, maybe a bit underwhelming. But it's always a fine line to balance between power consumption and battery life. 

- Projected display resolution of 480 by 853 pixels
- Quad core ARM A53 cpu
- WiFi, Bluetooth
- 8MP camera up to 1080p video recording
- 470mAh

The amount of RAM is not specified but seems to be just the right amount to get the job done.
Overall the device works but the speed and fluidity could be better, although this was improved significantly with the latest software update. 
There is no audio on the device as no regular or bone conducting speaker is present.
Audio can be provided through either Bluetooth or USB audio, but an included speaker would have been nicer.
Video recording works but is barely usable because there is no OIS and the frame rate, even at only 720P. The new software brings 1080p support, which I still need to test. TODO


All of this is actually quite irrelevant to me. There is no innovation in fitting a better camera or having oodles of computing power on the device. 
The technological marvel in this device is the display technology, named Cobra Display Engine. 

It's difficult to explain how well this works. I'll just rip off the movie "Contact" and say: No words to describte, they should have sent a poet. So beautiful! I had no idea. 	

The best description I could think of so far is: it's like someone is following behind you with a projector and is projecting the user interface on an invisible screen in front of you.
Hold a smartwatch right in front of you in a readable position. It's kinda like that, but transparant and without you losing the functionality of 1 arm.


So instead of describing it to people, I just put it on their face and they just are immediatly captivated by what they're are experiencing. It takes a moment to learn how to focus on the heads up display and back to your surroundings. Once you master this, it becomes very natural to interact with the display. 
Seeing that transparent interface is something a lot of people really have to take time to wrap their heads around. 
After this, I show them some pretty pictures with a variety of colors. Really brings everything to life and show off the unexpectedly good visual qualities of the display. 



For a concept device it really shows what the technology is capable of.
It's capable of running basic android apps. The same ones you would expect to run on a Smartwatch. Enough computing power to handle the video calling. 
Running Tensorflow lite to do object detection and classification proved to be a bit too challenging.




## The software

The Vuzix Blade runs on Android 5.1. Due to the limited screen real estate of the device, the look and feel of the apps reminds me a lot of smart watch apps.

There aren't many out of the box apps on the device installed: welcome dashboard, camera, gallery, music control, settings.

One of the most important features of wearables is notification mirroring, which works out of the box.


https://www.vuzix.com/products/Videos


With the Vuzix Blade also comes a companion app for your Android or iOS Smartphone.
This companion app allows you to configure settings, fetch images and videos from the device, manage installed apps and explore the Blade app store.

As this device doesn't run the Google play store, a specific app store is needed.

https://www.vuzix.com/appstore?deviceFilter=blade




## Using the Vuzix

TODO: Using the Vuzix, add photos & videos

The thing I like about the Blade is how comfortable it is to wear compared to other head mounted wearable solutions like for example the Hololens.
Although Vuzix targets the Blade partially at the consumer market, I believe that there is much more potential in the enterprise market.
Let's not make the same mistake Google Glass made! 

However, because they target the consumer market, they thought about things like  ergonomics and making it work for normal people. 

Sometimes I wear this device for a full day to get deeply immersed in the experience. As it is comfortable to wear this wasn't much of an issue.

My first experiment was to check how many people look at me funny during my morning commute. The good news is that during my train ride and walk around the office, not many people were / kept staring at me. 
However the people that knew me asked what I had on my face. 

The interaction models are quite straightforward. 
It's a good platform to consume push content. Your screen lights up, you get your info, the screen dims.

If you want to actually interact with the app, you can use the touchpad located near your right temple. Using gestures like: swipes (up, down, left right),double finger swipes, tap, double finger tap, long taps, etc you can interact. Again, very similar to smart watches.

Support for Amazon Alexa is currently in a Beta program for which I've signed up. 
Really wondering how natural this voice interaction will be. 


As I said before, I wear glasses. The Blade display is readable as I have only minor nearsightedness, but the display much sharper when I put the Blade on top of my regular glasses.
For an additional markup it is possible to get prescription lenses with these glasses so people who wear glasses on daily basis can also use this device.


Battery life is very much inline with smartwatches. It all depends on usage.

I can easily keep an app running while keeping the screen on for about an hour or 2.
If you work more in a notification mode with occasional use rather than "always on" mode, you can probably stretch it to a full day.

It's quite non intrusive to equip a battery pack by using the usb port located on the side. Once you do this, battery life is not an issue at all anymore. 

I actually went running and cycling while wearing an external battery pack and did not experience any hinder at all.

## Developing for the Vuzix

TODO: Developing for the Vuzix: show work in progress on the heart rate app.

The Vuzix Blade is currently running Android 5.1. This means they can leverage the huge amounts of Android devs out there. 
As an Android developer, I found the learning curve very low. 
Having already developed 

## Looking forward

What we have looks already promising even though a little rough right now.
Vuzix rolled out a big software update for the device that included new features like Alexa support and improved camera performance, but we think it can still be improved upon a lot!

If and when better battery technology is available these devices can have a definite positive influence on certain business cases.
With the introduction of the second generation HoloLens from Microsoft it is clear what can be possible with these devices.
Although the HoloLens is a much much more complicated product than the Vuzix Blade.

TODO: Extend & finish up the blogpost with a nice conclusion

## Resources

- [Vuzix Blade Smart Glasses](https://www.vuzix.com/products/blade-smart-glasses)
- [Microsoft HoloLens 2](https://www.microsoft.com/en-us/hololens/buy)