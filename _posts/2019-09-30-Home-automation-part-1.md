---
layout: post
authors: [kevin_van_den_abeele]
title: "Home Automation part 1"
image: /img/2019-09-30-home-automation/banner.jpg
tags: [Internet of Things, Smart tech, Home, smart home, automation, home automation, siri, apple, google assistant, amazon, alexa, homekit, home assistant, openHab]
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
2. [Different platforms](#platforms)
3. [Example: Homekit & Homebridge](#apple)
4. [Resources](#resources)

## Introduction

In this series of blogposts we are going to take a deeper look into home automation.
Home automation is the wonderful art of automating your home so it becomes easier to do certain tasks.
It is a very wide field where there are many available options, platforms and devices.
If you are willing to get creative almost everything can be automated!

In this first blogpost we'll present some of the platforms that are available and some of the pros & cons of each one.
To close of this blogpost we'll start by looking in to Apple's Homekit and by extension HomeBridge.

## Different platforms

In the world of home automation there are many ways to automate stuff.
We will be focussing on either cloud-enabled platforms or those that you can run on premise.
The hardware vender based platforms (e.g.: niko) will not be included!

The platforms can be split up into two main parts:

- Cloud enabled, mainly from manufactures and larger phone companies
- On premise platforms (that do not require internet/cloud access)

Security is a very important aspect in the home automation world!
The best way one would go about to automating one's home would be completely independent from any cloud based services/APIs
Internet access can be intermittent, cloud based API's can be down or event be shut down permanently.
Even worse, accounts could be breached giving unknown third parties access to your home's devices!

However, most people already have some smart devices and most of these have their own app, so ditching any cloud based systems is going to be a lot harder/more expensive.
As with any online service please, for the love of god, use strong unique password for each different service and enable multi factor authentication wherever possible!
Using all these different apps can be very cumbersome, using app A to turn on the lights, using app B to turn on the TV, using app C to change the thermostat, you get the picture.
Some of these smart devices support home automation platforms, some do not.
As we will see later on, even those that do not support a home automation platform out of the box can mostly be made to do so!

The platforms:

- Cloud enabled (more well known):
  - [Apple Homekit](https://www.apple.com/be-nl/shop/accessories/all-accessories/homekit){:target="_blank" rel="noopener noreferrer"}
  - [Google Assistant/Google Home](https://assistant.google.com/explore/){:target="_blank" rel="noopener noreferrer"}
  - [Amazon Alexa](https://www.amazon.com/b/ref=aeg_lp_sh_d/ref=s9_acss_bw_cg_aegflp_4b1_w?node=17934679011&pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-6&pf_rd_r=0E90B2MD8KGD1D7KVEM1&pf_rd_t=101&pf_rd_p=02147624-e148-4901-b449-773097cfa62e&pf_rd_i=17934672011){:target="_blank" rel="noopener noreferrer"}
  - [Xiaomi Mi Smart Home](https://xiaomi-mi.com/mi-smart-home/){:target="_blank" rel="noopener noreferrer"}
- On premise solutions (lesser known, but safer)
  - [Home Assistant](https://www.home-assistant.io/){:target="_blank" rel="noopener noreferrer"}
  - [OpenHAB](https://www.openhab.org/){:target="_blank" rel="noopener noreferrer"}

### Apple Homekit

<img alt="Homekit" src="{{ '/img/2019-09-30-home-automation/homekit.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 800px;">

Apple's home automation platform is called Homekit.
It can be used on alles ios and osx devices, giving you access to it from everywhere.
By default homekit control is limited to your local network only.
If you add an apple TV/homepod/ipad as a hub you can allow remote access through icloud.
For best results I would recommend to use an apple TV (gen 4 or later) connected through ethernet.

Automations can be made using the app (some special automations require a hub though).
These automations can be be based on a number of different triggers & conditions (sensors/state change/people coming home or leaving/time of day/...)
An automation can change the state of a device, or change change the state of multiple devices if they have been grouped into a scene.

Homekit supports many devices, which can be identified by 'works with apple homekit' logo.

<img alt="Works with Homekit" src="{{ '/img/2019-09-30-home-automation/works-with-homekit.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 800px;">

Some of these include:

- Hue
- Tadoo
- Eve
- and many others...

If your device is not supported but has its own app/api there is a big chance you can get it to work by installing homebridge and adding that to your home app in ios.
Scroll down to the example section of this blogpost if you want to learn more on how to do set this up yourself.

### Google Home

<img alt="Google Assistant" src="{{ '/img/2019-09-30-home-automation/google.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 800px;">

Google's home automation platform is called Google Assistant / Google Home. Both assistant and home are used to control smart devices.
it can be used on Android and ios devices.

To make best use of all the features a google home hub or a google home (mini) is required.
Google Assistant support many devices (much more than homekit), these can be added via the app.
After setup you can ask the assistant to perform certain tasks and change the state of devices.

Automations with google assistant are called [routines](https://support.google.com/googlenest/answer/7029585){:target="_blank" rel="noopener noreferrer"}.
For the time being these are not quite as extensive as homekit or Home Assistant/OpenHAB.
You can make routines that are based on a time of day event or people coming home/leaving.
Triggering routines based on state changes of the smart devices is not supported for now, this is supposedly to be added in the future.

### Amazon Alexa

<img alt="Alexa" src="{{ '/img/2019-09-30-home-automation/alexa.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 800px;">

Amazon's home automation platform is part of it's Alexa assistant.

To make best use of all the features an echo device is required.
Alexa support many devices (much more than homekit), these can be added via the app.
After setup you can ask Alexa to perform certain tasks and change the state of devices.

Automations with Alexa are called routines.
These routines are like the scenes and routines that exist with homekit & google assistant.
The routines can be triggered like in homekit, by devices/sensors, coming home or leaving, time of day.

### Home Assistant

<img alt="Home Assistant" src="{{ '/img/2019-09-30-home-automation/home-assistant.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 800px;">

TODO

### OpenHAB

<img alt="OpenHAB" src="{{ '/img/2019-09-30-home-automation/openhab.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 800px;">

TODO

## Example: Homekit & Homebridge

TODO

<img alt="altname" src="{{ '/img/2019-09-30-home-automation/image.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 800px;">

<div class="responsive-video">
    <iframe width="1164" height="655" src="https://www.youtube.com/embed/vq2nnJ4g6N0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>
<br/>

## Resources

- [Apple Homekit](https://www.apple.com/be-nl/shop/accessories/all-accessories/homekit){:target="_blank" rel="noopener noreferrer"}
- [Google Assistant/Google Home](https://assistant.google.com/explore/){:target="_blank" rel="noopener noreferrer"}
- [Amazon Alexa](https://www.amazon.com/b/ref=aeg_lp_sh_d/ref=s9_acss_bw_cg_aegflp_4b1_w?node=17934679011&pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-6&pf_rd_r=0E90B2MD8KGD1D7KVEM1&pf_rd_t=101&pf_rd_p=02147624-e148-4901-b449-773097cfa62e&pf_rd_i=17934672011){:target="_blank" rel="noopener noreferrer"}
- [Xiaomi Mi Smart Home](https://xiaomi-mi.com/mi-smart-home/){:target="_blank" rel="noopener noreferrer"}
- [Home Assistant](https://www.home-assistant.io/){:target="_blank" rel="noopener noreferrer"}
- [OpenHAB](https://www.openhab.org/){:target="_blank" rel="noopener noreferrer"}

- [Homebridge](https://homebridge.io/)
- [Homebridge github](https://github.com/nfarina/homebridge)
- [Homekit catalog, apple](https://developer.apple.com/documentation/homekit/configuring_a_home_automation_device)
- [Homekit application protocol](https://github.com/KhaosT/HAP-NodeJS/)
- [Homebridge plugins](https://www.npmjs.com/search?q=homebridge-plugin)
