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

We came across the Vuzix Blade on their website and looked through the details and videos posted.
After acquiring the required budget, thanks Ordina, we preordered one unit.

<div class="responsive-video">
    <iframe width="1164" height="655" src="https://www.youtube.com/embed/V-OxzjsB2s0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>
It was a video like this one that had won us over to give the Vuzix Blade a try since the displayed features look very nice, if they all worked as promised...

After a very long wait, with several delays and a lot of mailing back and forth we got ourselves a preproduction hand built Vuzix Blade.
we got these glasses to analyze the wearers experience and see how we could integrate it into the numerous business cases we could see it being used for:

- Assistance for field technicians
- Order picking
- Communications platforms

In this blogpost we'll go a bit into detail what makes the Vuzix Blade tick and how our experience with it has been so far.
Read on ahead for all the juicy details!

## The hardware

<img alt="Vuzix Blade hardware overview" src="{{ '/img/2019-03-30-vuzix/vuzix-hardware-overview.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 800px;">

The Vuzix Blade is essentially an Android smartphone you can wear on your face.
Well actually, it's really more like an Android Smartwatch you can strap to your face, but you get the idea.

The device we received was a pre production build, which was assembled by hand.
This means we can't really say much about what the final hardware will look like, if there will be any changes or if the build quality, which was very solid, will change.
During our testing it has been through some light and heavy action, like daily office use, running, biking, etc, and still hasn't shown any faults.

We've have always found the idea of computing devices in the form factor of glasses quite intriguing as I, and other colleagues have been cursed with nearsightedness and wear we have to wear prescription glasses constantly.
If we have to wear the bloody things every day, might as well put some intelligence into them.

Below you can find some specs about the device, but for us these are quite irrelevant for the moment.
This device is all about showcasing innovation in two areas: form factor & display technology.

And boy are we impressed.
The glasses actually feel comfortable enough to wear for longer periods and the display technology is quite amazing!
It's not HoloLens levels of crazy but still very very good!

But let's get down the mandatory spec overview!
The internals inside the glasses are alright, maybe a bit underwhelming
But it's always a fine line to balance between power consumption and battery life.

- Projected display resolution of 480 by 853 pixels
- Quad core ARM A53 cpu
- WiFi, Bluetooth
- 8MP camera up to 1080p video recording
- 470mAh battery

The amount of RAM is not specified but seems to be just the right amount to get the job done.
Overall the device works but the speed and fluidity could be better, although this was improved significantly with the latest software update.
There is no audio on the device as no regular or bone conducting speaker is present.
Audio can be provided through either Bluetooth or USB audio, but an included speaker would have been nicer.
Initially the video recording only supported up to 720P at a lower frame rate, which with the lack of OIS was not very usable in high motion scenarios.
However the latest software update added support for 1080P recording and as you can see in one of the videos down below is actually acceptable.

All of this is actually quite irrelevant to us.
There is no innovation in fitting a better camera or having oodles of computing power on the device.
The technological marvel in this device is the display technology, named the `Cobra Display Engine`.

It's difficult to explain how well this works.
So we'll just rip off the movie "Contact" and say:
> No words to describe, they should have sent a poet.
> So beautiful! I had no idea.

The best description we could think of so far is:
It's like someone is following you from behind with a projector and is projecting the user interface on an invisible screen in front of you.
Hold a smartwatch right in front of you in a readable position.
It's kinda like that, but transparent and without losing the functionality of one of your arms.

So instead of describing it to people, we just put it on their face and they just are immediately captivated by what they're experiencing.
It takes a moment to learn how to switch your eyes's focus on the heads up display and back to your surroundings.
Once you master this it becomes very natural to interact with the display.
Seeing that transparent interface is something a lot of people really have to take time to wrap their heads around.
After this we show them some pretty pictures with a variety of colors.
Really brings everything to life and show off the unexpectedly good visual qualities of the display.

For a concept device it really shows what the technology is capable of.
It's capable of running basic android apps.
The same ones you would expect to run on a Smartwatch.
Enough computing power to handle the video calling.
Running TensorFlow lite to do object detection and classification proved to be a bit too challenging.

## The software

The Vuzix Blade runs on Android 5.1.
Due to the limited screen real estate of the device, the look and feel of the apps reminds me a lot of smart watch apps.

There aren't many out of the box apps on the device installed:

- Welcome dashboard
- Camera
- Gallery
- Music control
- Settings

One of the most important features of wearables is notification mirroring, which works out of the box.

With the Vuzix Blade also comes a companion app for your Android or iOS Smartphone.
This companion app allows you to configure settings, fetch images and videos from the device, manage installed apps and explore the Blade app store.

As this device doesn't run the Google Play Store, a specific app store is needed.
[This app store](https://www.vuzix.com/appstore?deviceFilter=blade) allows Vuzix specific apps to be installed on the device.

TODO: Some screenshots of the software?

## Using the Vuzix

TODO: Using the Vuzix, add photos & videos

The thing we like about the Blade is how comfortable it is to wear compared to other head mounted wearable solutions like the HoloLens.
The HoloLens is quite heavy and in our opinion not meant to be worn all day long, the Blade however is light enough to stay comfortable for long time wearing.
Although Vuzix targets the Blade partially at the consumer market, we believe that there is much more potential in the enterprise market.
Let's hope they don't make the same mistake Google made with Google Glass!

But because they also target the consumer market, they thought about very important things like ergonomics and making for non tech people.

<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/2019-03-30-vuzix/wear1.jpg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="Wearing the Vuzix Blade 1">
        <img alt="stack" src="{{ '/img/2019-03-30-vuzix/wear1.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 55%; display: inline-block;">
    </a>
    <a href="{{ '/img/2019-03-30-vuzix/wear2.jpg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="Wearing the Vuzix Blade 2">
        <img alt="stack" src="{{ '/img/2019-03-30-vuzix/wear2.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 24%; display: inline-block;">
    </a>
    <a href="{{ '/img/2019-03-30-vuzix/wear3.jpg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="Wearing the Vuzix Blade 3">
        <img alt="stack" src="{{ '/img/2019-03-30-vuzix/wear3.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 17.5%; display: inline-block;">
    </a>
</div>
<br/>

Frederick tested the devices for a longer period of time:
>
> Sometimes I wear this device for a full day to get deeply immersed in the experience, as it is comfortable to wear this wasn't much of an issue.
>
> My first experiment was to check how many people look at me funny during my morning commute.
> The good news is that during my train ride and walk around the office, not many people were / kept staring at me.
> However the people that knew me asked what I had on my face.

<div class="responsive-video">
    <iframe width="1164" height="655" src="https://www.youtube.com/embed/lAiAl370BA8" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>
<br/>

The interaction models are quite straightforward.
It's a good platform to consume push content.
Your screen lights up, you get your info, the screen dims.

If you want to actually interact with the app, you can use the touchpad located near your right temple.
Using gestures like:

- Swipes
  - Up
  - Down
  - Left
  - Right
- Two finger swipes
- Tap
- Double tap
- Long tap
- etc
Again, very similar to smart watches.

Support for Amazon Alexa is currently in a Beta program for which we've signed up.
Really wondering how natural this voice interaction will be.

As we said before, some of us wear glasses and the Blade display is readable as when you have only minor nearsightedness, but the display is much sharper when you put the Blade on top of your regular glasses.
For an additional markup it is possible to get prescription lenses with the Blade so people who wear glasses on daily basis can also use this device.

Battery life is very much inline with smartwatches, It all depends on the usage.
We can easily keep an app running with the screen being on for about two hours.
If you are only consuming (push) notifications it's possible to stretch this to a full day.
For longer and more intensive usage an external battery pack is a must.
Luckily it's quite non intrusive to equip a battery pack by using the usb port located on the side.
Once you do this, battery life is not an issue anymore.
We did some testing and actually went running and cycling while wearing an external battery pack and did not experience any hinder at all.

## Developing for the Vuzix

The Vuzix Blade is currently running Android 5.1.
This means they can leverage the huge amounts of Android devs out there.
As an Android developer, we found the learning curve to be relatively low.

Having already developed
TODO: Developing for the Vuzix: show work in progress on the heart rate app.

<div class="responsive-video">
    <iframe width="1164" height="655" src="https://www.youtube.com/embed/FzUgWBVQCS8" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>
<br/>

## Looking forward

What we got with the Vuzix Blade looks already very promising even though there are a few small rough edges.
Vuzix rolled out a big software update for the device that included new features like Alexa support and improved camera performance.

If and when better battery technology is available these devices can have a definite positive influence on certain business cases.
With the introduction of the second generation HoloLens from Microsoft it is clear what can be possible with these devices.
Although the HoloLens is a much much more complicated product than the Vuzix Blade. Both serve a different market population.
For now we believe that devices like the Blade have the upper hand over other like the HoloLens, in price, wearer comfort, and day to day usability.

## Resources

- [Vuzix Blade Smart Glasses](https://www.vuzix.com/products/blade-smart-glasses)
- [Vuzix product videos](https://www.vuzix.com/products/Videos)
- [Vuzix app store](https://www.vuzix.com/appstore?deviceFilter=blade)
- [Microsoft HoloLens 2](https://www.microsoft.com/en-us/hololens/buy)