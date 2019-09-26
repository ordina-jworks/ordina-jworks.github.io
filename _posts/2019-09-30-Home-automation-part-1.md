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
2. [Platforms](#platforms)
3. [Example](#example)
4. [Conclusion](#conclusion)
5. [Resources](#resources)

## Introduction

In this series of blogposts we are going to take a deeper look into home automation.
Home automation is the wonderful art of automating your home so it becomes easier to do certain tasks.
It is a very wide field where there are many available options, platforms and devices.
If you are willing to get creative almost everything can be automated!

In this first blogpost we'll present some of the platforms that are available and some of the pros & cons of each one.
To close of this blogpost we'll start by looking in to Apple's Homekit and by extension HomeBridge.

## Platforms

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

<img alt="Works with Homekit" src="{{ '/img/2019-09-30-home-automation/works-with-homekit.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 250px;">

Some of these include:

- Hue
- Tadoo
- Eve
- and many others...

If your device is not supported but has its own app/api there is a big chance you can get it to work by installing homebridge and adding that to your home app in ios.
Scroll down to the example section of this blogpost if you want to learn more on how to do set this up yourself.

### Google Home

<img alt="Google Assistant" src="{{ '/img/2019-09-30-home-automation/google.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 800px;">

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

<img alt="Alexa" src="{{ '/img/2019-09-30-home-automation/alexa.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 800px;">

Amazon's home automation platform is part of it's Alexa assistant.
it can be used on Android and ios devices.

To make best use of all the features an echo device is required.
Alexa support many devices (much more than homekit), these can be added via the app.
After setup you can ask Alexa to perform certain tasks and change the state of devices.

Automations with Alexa are called routines.
These routines are like the scenes and routines that exist with homekit & google assistant.
The routines can be triggered like in homekit, by devices/sensors, coming home or leaving, time of day.

You can get very creative with the routines, a funny example below, pity the intruder that is caught up in this encounter!

<img alt="Alexa routine example" src="{{ '/img/2019-09-30-home-automation/alexa-intruder-meme.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px;">

### Home Assistant

<img alt="Home Assistant" src="{{ '/img/2019-09-30-home-automation/home-assistant.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 800px;">

Home Assistant is a fully open source home automation platform that if fully focussed on the user's privacy.
It can be used in the browser as well as on ios and Android devices.

It can be run locally with no need of any cloud service. A Raspberry Pi 3B is all you need.
Home Assistant has support for over a thousand integrations that are supported by the platform.
If you want to create your own integration, a fully documented [developer portal](https://developers.home-assistant.io/en/){:target="_blank" rel="noopener noreferrer"} will assist you.
The integrations are written in python 3.

Automations are called as what they are, automations.
They can control devices or perform actions (calling services etc.) based on triggers.
These triggers can be various things like in the previously mentioned platforms, but Home Assistant takes it one step further and allows for very fine grained and very detailed/specific triggers.

Location tracking & presence detection is also possible but requires the integration and use of [Owntracks](https://owntracks.org/){:target="_blank" rel="noopener noreferrer"}.

### OpenHAB

<img alt="OpenHAB" src="{{ '/img/2019-09-30-home-automation/openhab.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 800px;">

Like Home Assistant OpenHAB is a fully open source home automation platform.
It can be used in the browser as well as on ios and Android devices.

It can be run locally with no need of any cloud service. A Raspberry Pi 3B is all you need.
It also supports well over a thousand existing integrations and can easily be extended.
It is written in Java and can be configured with a DSL.

Automations are called rules.
These can be configured with the platform's DSL.
They can control devices or perform actions (calling services etc.) based on triggers.
These triggers can really be anything you can think of, any integration or trigger action you can think of, it can be done.

OpenHAB does require quite a bit of research.
Do not jump into this platform without doing some digging beforehand.
It's documentation is very extensive and is very well made.

## Example

### Homekit & Homebridge

<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/2019-09-30-home-automation/homekit-1.jpg' | prepend: site.baseurl }}" data-lightbox="ui" data-title="Homekit devices 1">
        <img alt="Homekit devices 1" src="{{ '/img/2019-09-30-home-automation/homekit-1.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 32%; display: inline-block;">
    </a>
    <a href="{{ '/img/2019-09-30-home-automation/homekit-2.jpg' | prepend: site.baseurl }}" data-lightbox="ui" data-title="Homekit devices 2">
        <img alt="Homekit devices 2" src="{{ '/img/2019-09-30-home-automation/homekit-2.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 32%; display: inline-block;">
    </a>
    <a href="{{ '/img/2019-09-30-home-automation/homekit-3.jpg' | prepend: site.baseurl }}" data-lightbox="ui" data-title="Homekit automations">
        <img alt="Homekit automations" src="{{ '/img/2019-09-30-home-automation/homekit-3.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 32.7%; display: inline-block;">
    </a>
</div>

Below is how my home is set up, which plugins I use (and made myself).

The only official homekit device I own is my thermostat, all other devices are exposed to Homekit through Homebridge.
Homebridge is a NodeJS server that exposes custom devices to be used inside the Homekit platform.
It can be installed and configured easily, for example on a Raspberry Pi and provides a code or QR code during startup which you can use to add the Homekit bridge to your setup.

A list of all devices I use through Homebridge with their according plugins:

- Nest protects - [homebridge-nest plugin](https://www.npmjs.com/package/homebridge-nest){:target="_blank" rel="noopener noreferrer"}, only possible now if you already have a nest developer account and the required keys.
- Unifi protect cameras [homebridge-camera-ffmpeg plugin](https://www.npmjs.com/package/homebridge-camera-ffmpeg){:target="_blank" rel="noopener noreferrer"}[homebridge-unifi-protect-motion-sensors plugin](https://www.npmjs.com/package/homebridge-unifi-protect-motion-sensors){:target="_blank" rel="noopener noreferrer"}
- Smartwares smart wifi switch & RF outlets [homebridge-homewizard-flamingo plugin](https://www.npmjs.com/package/homebridge-homewizard-flamingo){:target="_blank" rel="noopener noreferrer"}
- Somfy based shutters [homebridge-somfy](https://www.npmjs.com/package/homebridge-somfy){:target="_blank" rel="noopener noreferrer"}
- LG Airco unit [homebridge-lg-airco](https://www.npmjs.com/package/homebridge-lg-airco){:target="_blank" rel="noopener noreferrer"}

There are many many more devices and integrations available for use with Homebridge.
You can find these by looking on the [NPM plugin repository](https://www.npmjs.com/){:target="_blank" rel="noopener noreferrer"} and searching for `homebridge-PLUGINNAME`.

These plugins can be installed by installing the NPM package globally and adding said package to the `config.json` of the Homebridge instance.
The main page of the [github repo](https://github.com/nfarina/homebridge){:target="_blank" rel="noopener noreferrer"} explains in detail how to set everything up so you too can get started quickly

## Conclusion

Home automation is a wonderful thing.
It can make your live easier in various ways.
It is however required to think things through and do some research before jumping into this.
Looking into what devices are supported, out of the box, or via custom integrations/plugins is very important.
If you have some programming experience and some time to spare you can very easily make your own integrations for devices that are not supported.

In the coming months we'll be diving a bit deeper into the wonderful world of home automation with more in depth blog posts about Homekit with Homebridge and OpenHAB.

## Resources

- [Apple Homekit](https://www.apple.com/be-nl/shop/accessories/all-accessories/homekit){:target="_blank" rel="noopener noreferrer"}
- [Google Assistant/Google Home](https://assistant.google.com/explore/){:target="_blank" rel="noopener noreferrer"}
- [Amazon Alexa](https://www.amazon.com/b/ref=aeg_lp_sh_d/ref=s9_acss_bw_cg_aegflp_4b1_w?node=17934679011&pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-6&pf_rd_r=0E90B2MD8KGD1D7KVEM1&pf_rd_t=101&pf_rd_p=02147624-e148-4901-b449-773097cfa62e&pf_rd_i=17934672011){:target="_blank" rel="noopener noreferrer"}
- [Xiaomi Mi Smart Home](https://xiaomi-mi.com/mi-smart-home/){:target="_blank" rel="noopener noreferrer"}
- [Home Assistant](https://www.home-assistant.io/){:target="_blank" rel="noopener noreferrer"}
- [Home Assistant developer portal](https://developers.home-assistant.io/en/){:target="_blank" rel="noopener noreferrer"}
- [Owntracks](https://owntracks.org/){:target="_blank" rel="noopener noreferrer"}
- [OpenHAB](https://www.openhab.org/){:target="_blank" rel="noopener noreferrer"}
- [Homebridge](https://homebridge.io/)
- [Homebridge github](https://github.com/nfarina/homebridge)
- [Homekit catalog, apple](https://developer.apple.com/documentation/homekit/configuring_a_home_automation_device)
- [Homekit application protocol](https://github.com/KhaosT/HAP-NodeJS/)
- [Homebridge plugins](https://www.npmjs.com/search?q=homebridge-plugin)
