---
layout: post
authors: [kevin_van_den_abeele]
title: "Home Automation part 2: Getting started with Home Assistant"
image: /img/2021-02-10-home-automation-part-2/banner.jpg
tags: [Internet of Things, Smart Tech, Home, Smart Home, Automation, Home Automation, Home Assistant, python, yaml, plugins, devices, accessories, integrations]
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
2. [Preparations](#preparations)
3. [Installing](#installing)
4. [setting up and using Home Assistant](#setting-up-and-using-home-assistant)
5. [Automations](#automations)
6. [Development](#development)
7. [Resources](#resources)

## Introduction

After the first general post about home automation it's time to kick things into higher gear.
In this post we'll go into detail about Home Assistant.
Home Assistant is fully open source home automation platform.
It features over 1700 integrations at the time of writing and allows for full local control of your smart home without using any of the big cloud vendors.
As with many things, home assistant is relatively easy to pick up but hard to master.
Read on down below for all the details.

## Preparations

Before we get to installing home assistant it is handy to have some items at hand:

- A machine/vm to run the assistant on, can be a Raspberry Pi (3b or 4b recommended)
  - If you are using a SBC, a decent micro SD card, or even better an external ssd to install everything on at least 32 GiB in size
- The correct image of the Home Assistant OS, [download the file](https://www.home-assistant.io/hassio/installation/){:target="_blank" rel="noopener noreferrer"} best suited for your device.
  The download page also features detailed information for each specific option
  - Raspberry Pi (and other board) images
  - Intel NUC image (or any other intel based board)
  - Virtual machine
    - Virtual Box => VDI disk image
    - Hyper-V => VHDX disk image
    - KVM => QCOW2 disk image
    - VMware Workstation => VMDK disk image
    - Proxmox => QCOW2 disk image
    - VMware ESXi => OVA disk image
- An ethernet connection, WiFi can work too but ethernet might be more reliable depending on your personal WiFi setup
- Patience, don't be afraid to start over if things don't work after the first try!

## Installing

Once you have everything downloaded and prepared we can get to installing and doing the basic setup for Home Assistant.
If you have downloaded the virtual machine hard disk image, load the downloaded image in the software by creating a new VM and assigning it the downloaded disk image.
2 GiB of RAM and 1 or 2 cores are usually more than sufficient, these values can always be increased later on if needed.
Follow the instructions on [the download page](https://www.home-assistant.io/hassio/installation/){:target="_blank" rel="noopener noreferrer"} for you specific vm technology.

If you have downloaded a device image, flash it onto the micro sd card, or even better an external SSD ([Booting the Raspberry Pi from USB](https://www.raspberrypi.org/documentation/hardware/raspberrypi/bootmodes/msd.md){:target="_blank" rel="noopener noreferrer"})
An external SSD or decent USB 3.1 stick will last much longer than most SD cards, especially when writing a lot of log files.
You can use a tool like [Balena Etcher](https://www.balena.io/etcher/){:target="_blank" rel="noopener noreferrer"} (multi OS) or [Rufus](https://rufus.ie/){:target="_blank" rel="noopener noreferrer"} (Windows) to flash the image, once done insert the SD card or USB device into your Raspberry Pi.

Once you have set up your device or VM and powered it on, you should be able to visit it by entering [`http://homeassistant.local:8123`](http://homeassistant.local:8123){:target="_blank" rel="noopener noreferrer"} in the browser, this is where we will continue.
Follow the setup guide, this will let you create an account (local, no cloud shenanigans), set up the details about your home.
You can set up integrations during this wizard but we will be doing this later, click complete to exit the wizard.
You will then be greeted with your home's dashboard amd Home Assistant is ready to be used.

## Setting up and using Home Assistant

Your home has some types of objects in it, these are:

- Integrations: These are the building blocks that integrate with physical devices or services.
- Devices: Any physical device that is added through an integration has a representation here.
- Entities: A device can expose one or multiple entities.
- Blueprints: TODO
- Automations: TODO
- Scenes: A collection of predefined states for one or more devices/entities.
- Scripts: TODO
- Areas: A home can have multiple areas, think rooms.
  Each area can have zero or more devices/automations/scenes and or scripts assigned to it.

One of the advantages of Home Assistant is that is has a vast library of available integrations.
These integrations allow greater flexibility than most integrations that are made for Apple HomeKit, Amazon Alexa or Google Home.
Most integrations are maintained by the open source community and development is quite active.

In the previous section we installed the Home Assistant, now we are going to add some stuff to it.
Open the dashboard again and in the lower right side menu click on the `configuration` link.
This will open the configuration view where we can manage the home.

First select the `Areas` option.
By default some rooms have been added, you delete the existing ones if desired or add extra ones.
It's easiest to add all the rooms you want to have available in the Home Assistant web UI and app before we continue.

After we have set up the rooms we want to pick the `integrations` option.
If you have your Home Assistant installation correctly configured it probably will suggest some integrations based on the results of a network scan.
Click on the `Configure` option to add the integration, a wizard will guide you through the process.
For the devices in your home that have not been automatically detected click the `ADD INTEGRATION` button in the lower left corner and search for a device you have at home that might be supported.
Some often used integrations are:

- Sonos (speakers)
- Tuya (lights, outlets, sensors)
- Nest (thermostat, fire alarms)
- Ikea Tradfri (lights)

Like with the auto detected integrations a wizard will guide you through the setup process.
During the setup process you should be able to assign each device to a specific area, you can skip this if wanted and assign a device to an area later (By opening the device and clicking the settings icon and picking the area there).

There are integrations which do not provide a setup wizard.
To configure these integrations a more hands on approach is required.

TODO

If you go back to the dashboard you should see all available devices that have been assigned to a room.
You can manage the dashboard manually too but this requires quite a bit of config, experiment with this as you see fit.

Home Assistant has a [very extensive documentation](https://www.home-assistant.io/docs/){:target="_blank" rel="noopener noreferrer"}, consult it or the community if you get stuck!

## Automations

TODO

## Development

TODO

## Resources

- [TODO](https://google.be){:target="_blank" rel="noopener noreferrer"}
