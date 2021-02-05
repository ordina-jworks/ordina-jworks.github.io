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
4. [Setting up and using Home Assistant](#setting-up-and-using-home-assistant)
5. [Automations](#automations)
6. [Development](#development)
7. [Conclusion](#conclusion)
8. [Resources](#resources)

## Introduction

<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/2021-02-10-home-automation-part-2/logo.jpg' | prepend: site.baseurl }}" data-lightbox="ui" data-title="Logo">
        <img alt="HomeKit devices 1" src="{{ '/img/2021-02-10-home-automation-part-2/logo.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 100%; display: inline-block;">
    </a>
</div>

After the [first general post](/iot/2019/09/30/Home-automation-part-1.html){:target="_blank" rel="noopener noreferrer"} about home automation it's time to kick things into higher gear.
In this post we'll go into detail about Home Assistant.
Home Assistant is a fully open source home automation platform.
It has a web interface as well as apps for Android and iOS.
It features over 1.700 integrations at the time of writing and allows for full local control of your smart home without using any of the big cloud vendors.
As with many things, Home Assistant is relatively easy to pick up but hard to master.
Read on down below for more the details.

## Preparations

Before we get to installing Home Assistant it is handy to have some items at hand:

- A machine/VM to run the assistant on, can be a Raspberry Pi (3b or 4b recommended)
  - If you are using a SBC, a decent micro SD card, or even better, an external ssd to install everything on at least 32 GiB in size
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
2GiB of RAM and 1 or 2 cores are usually more than sufficient, these values can always be increased later on if needed.
Follow the instructions on [the download page](https://www.home-assistant.io/hassio/installation/){:target="_blank" rel="noopener noreferrer"} for you specific VM technology.

If you have downloaded a device image, flash it onto the micro sd card, or even better an external SSD ([Booting the Raspberry Pi from USB](https://www.raspberrypi.org/documentation/hardware/raspberrypi/bootmodes/msd.md){:target="_blank" rel="noopener noreferrer"}).
An external SSD or decent USB 3.1 stick will last much longer than most SD cards, especially when writing a lot of log files.
You can use a tool like [Balena Etcher](https://www.balena.io/etcher/){:target="_blank" rel="noopener noreferrer"} (multi OS) or [Rufus](https://rufus.ie/){:target="_blank" rel="noopener noreferrer"} (Windows) to flash the image.
Once done, insert the SD card or USB device into your Raspberry Pi.
Once you have set up your device or VM and powered it on, you should be able to visit it by entering [`http://homeassistant.local:8123`](http://homeassistant.local:8123){:target="_blank" rel="noopener noreferrer"} in the browser, this is where we will continue.
Follow the setup guide, this will let you create an account (local, no cloud shenanigans) and set up the details about your home.
You can set up integrations during this wizard but we will be doing this later.
Click complete to exit the wizard.
You will then be greeted with your home's dashboard amd Home Assistant is ready to be used.

<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/2021-02-10-home-automation-part-2/setup-1.jpeg' | prepend: site.baseurl }}" data-lightbox="ui" data-title="Setting up a new home">
        <img alt="HomeKit devices 1" src="{{ '/img/2021-02-10-home-automation-part-2/setup-1.jpeg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 23%; display: inline-block;">
    </a>
    <a href="{{ '/img/2021-02-10-home-automation-part-2/setup-2.jpeg' | prepend: site.baseurl }}" data-lightbox="ui" data-title="Setting home details">
        <img alt="HomeKit devices 2" src="{{ '/img/2021-02-10-home-automation-part-2/setup-2.jpeg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 17%; display: inline-block;">
    </a>
    <a href="{{ '/img/2021-02-10-home-automation-part-2/dashboard-1.jpeg' | prepend: site.baseurl }}" data-lightbox="ui" data-title="Home Assistant dashboard">
        <img alt="HomeKit devices 2" src="{{ '/img/2021-02-10-home-automation-part-2/dashboard-1.jpeg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 55%; display: inline-block;">
    </a>
</div>

## Setting up and using Home Assistant

Your home has some types of objects in it, these are:

- Integrations: These are the building blocks that integrate with physical devices or services.
- Devices: Any physical device that is added through an integration has a representation here.
- Entities: A device can expose one or multiple entities.
- [Automations](https://www.home-assistant.io/docs/automation){:target="_blank" rel="noopener noreferrer"}: An automation is an action that is activated by a trigger and when an optional condition is met.
- [Blueprints](https://www.home-assistant.io/docs/automation/using_blueprints/){:target="_blank" rel="noopener noreferrer"}: An automation instance that is re-usable.
- Scenes: A collection of predefined states for one or more devices/entities.
- [Scripts](https://www.home-assistant.io/integrations/script/){:target="_blank" rel="noopener noreferrer"}: Is what it says it is, a sequence of commands and/or actions to execute.
- Areas: A home can have multiple areas, think rooms.
  Each area can have zero or more devices/automations/scenes and or scripts assigned to it.

One of the advantages of Home Assistant is that is has a vast library of available integrations.
These integrations allow greater flexibility than most integrations that are made for Apple HomeKit, Amazon Alexa or Google Home.
Most integrations are maintained by the open source community and development is quite active.

In the previous section we installed the Home Assistant, now we are going to add some stuff to it.
Open the dashboard again and in the lower right side menu click on the `Configuration` link.
This will open the configuration view where we can manage the home.

First select the `Areas` option.
By default some rooms have been added, you can delete the existing ones if desired or add extra ones.
It's easiest to add all the rooms you want to have available in the Home Assistant web UI and app before we continue.

<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/2021-02-10-home-automation-part-2/areas-1.jpeg' | prepend: site.baseurl }}" data-lightbox="ui" data-title="Setting up a areas">
        <img alt="HomeKit devices 1" src="{{ '/img/2021-02-10-home-automation-part-2/areas-1.jpeg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 100%; display: inline-block;">
    </a>
</div>

After we have set up the rooms, we want to pick the `Integrations` option.
If you have your Home Assistant installation correctly configured, it probably will suggest some integrations based on the results of a network scan.
Click on the `Configure` option to add the integration, a wizard will guide you through the process.
For the devices in your home that have not been automatically detected, click the `Add Integration` button in the lower left corner and search for a device you have at home that might be supported.
Some often used integrations are:

- Sonos (speakers)
- Tuya (lights, outlets, sensors)
- Nest (thermostat, fire alarms)
- Ikea Tradfri (lights)

Like with the auto detected integrations, a wizard will guide you through the setup process.
The Home Assistant website has a [collection of all published integrations](https://www.home-assistant.io/integrations/){:target="_blank" rel="noopener noreferrer"}, you can browse through and search the list.
Each plugin on the site also has all the info to configure it correctly.
During the setup process you should be able to assign each device to a specific area.
You can skip this if wanted and assign a device to an area later (By opening the device and clicking the settings icon and picking the area there).

<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/2021-02-10-home-automation-part-2/integrations-1.jpeg' | prepend: site.baseurl }}" data-lightbox="ui" data-title="Integrations overview">
        <img alt="HomeKit devices 1" src="{{ '/img/2021-02-10-home-automation-part-2/integrations-1.jpeg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 23%; display: inline-block;">
    </a>
    <a href="{{ '/img/2021-02-10-home-automation-part-2/devices-1.jpeg' | prepend: site.baseurl }}" data-lightbox="ui" data-title="Devices overview">
        <img alt="HomeKit devices 2" src="{{ '/img/2021-02-10-home-automation-part-2/devices-1.jpeg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 19%; display: inline-block;">
    </a>
    <a href="{{ '/img/2021-02-10-home-automation-part-2/device-info-1.jpeg' | prepend: site.baseurl }}" data-lightbox="ui" data-title="Device details">
        <img alt="HomeKit devices 2" src="{{ '/img/2021-02-10-home-automation-part-2/device-info-1.jpeg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 34%; display: inline-block;">
    </a>
     <a href="{{ '/img/2021-02-10-home-automation-part-2/entities-1.jpeg' | prepend: site.baseurl }}" data-lightbox="ui" data-title="Entities overview">
        <img alt="HomeKit devices 2" src="{{ '/img/2021-02-10-home-automation-part-2/entities-1.jpeg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 20%; display: inline-block;">
    </a>
</div>

There are integrations which do not provide a setup wizard.
To configure these integrations, a more hands on approach is required:

- First click on the `Supervisor` link in the left bottom sidebar.
  This will open a section.
  In there select the `Add-on Store` in the top menu.
- In the search field, type `File editor`, select the one add-on (it's an official one) and click `install`.
  This will install a file editor so we can edit the configuration.yaml file without needing the login on the Home Assistant server itself via SSH.
  Once the add-on has been installed, you can find it in the supervisor UI under the `Dashboard` section.
- Click on the add-on and click on `start`, then select `open web ui`.
  This will open the file editor.
- In the top control bar of the editor, click on the folder icon and select `configuration.yaml`.
  Home Assistant uses the YAML format for its configuration.
  This is a well known format for most developers and has a very basic indentation based syntax.
  A plugin which does not provide a wizard-based setup will probably describe the configuration that needs to be added manually in the documentation.
  For more detailed information about editing files and changing the `configuration.yaml`, see [the online documentation](https://www.home-assistant.io/getting-started/configuration/){:target="_blank" rel="noopener noreferrer"} of Home Assistant

<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/2021-02-10-home-automation-part-2/file-editor-1.jpeg' | prepend: site.baseurl }}" data-lightbox="ui" data-title="File editor">
        <img alt="HomeKit devices 1" src="{{ '/img/2021-02-10-home-automation-part-2/file-editor-1.jpeg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 100%; display: inline-block;">
    </a>
</div>

If you go back to the dashboard, you should see all available devices that have been assigned to a room.
You can manage the dashboard manually too but this requires quite a bit of config.
Experiment with this as you see fit.
You can now control any device that is exposed and visible on the dashboard.

It might also be handy to create a number of scenes.
A scene is a predefined set of states for one or multiple devices.
For example a `Good night` and `Good morning` scene could be created to turn on/off lights, lower/raise any blinds or shutters and set any other device to a desired state.
The scenes can then be used in automations to simplify the setup.
To create a new scene:

- Click the `Configuration` link in the left sidebar
- Select the `Scenes` entry
- Click on `Add Scene`
- Give the scene a name and one or multiple devices with it
  You set the state of each device when adding it as you want it to be when the scene is activated

Home Assistant has a [very extensive documentation](https://www.home-assistant.io/docs/){:target="_blank" rel="noopener noreferrer"}.
Consult it or the community if you get stuck!

## Automations

While having all the devices visible is nice, a smart home wouldn't be a smart home if it didn't involve some automation.
We want to make life easier and having to spend less time controlling our smart devices is one good way to do so.
As with most things that involve automation, it will take some initial time investment to get things right.
Don't give up if it doesn't work from the first time!

Home Assistant has an extensive automation framework that has multiple entities to its disposal for automating things.

To create a basic automation:

- Click the `Configuration` link in the left sidebar
- Select the `Automations` entry
- Click `Add Automation` and select `Start with an empty automation`
- Give the automation a name and description that tells you what it will do
- Set the execution mode, `single` is a good default.
  This is mostly used for longer running automations
- Select a trigger type, for example when another device is controlled, an event is sent
- If desired add a condition
  This will be evaluated after the trigger is fired and before any actions are executed
- Select one or multiple actions or scenes to control or activate
- Click the `Save` button

It is also possible to edit the automation using the yaml format.
In the top right click on the three dots and select `Edit as YAML`. 
This will give you an editor to edit the automation in its raw yaml formatting.
You can always test the automation by clicking the `execute button`.
This will ignore the trigger but test any of the given conditions and execute the specified actions.

<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/2021-02-10-home-automation-part-2/automation-1.jpeg' | prepend: site.baseurl }}" data-lightbox="ui" data-title="New automation dialog">
        <img alt="HomeKit devices 1" src="{{ '/img/2021-02-10-home-automation-part-2/automation-1.jpeg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 21%; display: inline-block;">
    </a>
    <a href="{{ '/img/2021-02-10-home-automation-part-2/automation-2.jpeg' | prepend: site.baseurl }}" data-lightbox="ui" data-title="Automation setup triggers">
        <img alt="HomeKit devices 2" src="{{ '/img/2021-02-10-home-automation-part-2/automation-2.jpeg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 19%; display: inline-block;">
    </a>
    <a href="{{ '/img/2021-02-10-home-automation-part-2/automation-3.jpeg' | prepend: site.baseurl }}" data-lightbox="ui" data-title="Automation conditions and actions">
        <img alt="HomeKit automations" src="{{ '/img/2021-02-10-home-automation-part-2/automation-3.jpeg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 24%; display: inline-block;">
    </a>
    <a href="{{ '/img/2021-02-10-home-automation-part-2/automation-4.jpeg' | prepend: site.baseurl }}" data-lightbox="ui" data-title="Automation edit as yaml">
        <img alt="HomeKit automations" src="{{ '/img/2021-02-10-home-automation-part-2/automation-4.jpeg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 11%; display: inline-block;">
    </a>
    <a href="{{ '/img/2021-02-10-home-automation-part-2/automation-5.jpeg' | prepend: site.baseurl }}" data-lightbox="ui" data-title="Automation yaml editor">
        <img alt="HomeKit automations" src="{{ '/img/2021-02-10-home-automation-part-2/automation-5.jpeg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 19%; display: inline-block;">
    </a>
</div>

## Development

Whilst there are plenty of integrations available for Home Assistant, some might be missing, or you have a very specific use case that is not available yet.
By supporting web hooks, scripts, MQTT,... you can sometimes work around devices and platforms that have no ready to use integration, but sometimes you cannot.

It is possible by developing your own integrations for Home Assistant.
[A special website](https://developers.home-assistant.io/){:target="_blank" rel="noopener noreferrer"} dedicated to developers is available to get started.

To start building a custom integration:

- Have experience with Python, YAML and JSON
- Set up the Home Assistant [dev environment](https://developers.home-assistant.io/docs/development_environment){:target="_blank" rel="noopener noreferrer"}
- Read through [the documentation](https://developers.home-assistant.io/docs/creating_integration_file_structure){:target="_blank" rel="noopener noreferrer"} first, to prevent any RTFM situations later on.
  Everything you need is laid out in separate topics to read through.
- From the dev environment, execute: `python3 -m script.scaffold integration`.
  This will create a new basic integration
- Look at the [example integrations](https://github.com/home-assistant/example-custom-config/tree/master/custom_components/){:target="_blank" rel="noopener noreferrer"}
- Test your integration locally by adding an entry to your integrations `__init__.py` file to the `configuration.yaml` file: `<config_dir>/custom_components/custom_integration/__init__.py`

## Conclusion

Home Assistant is a very extensive home automation platform that is relatively easy to set up.
Basic automations are fast to set up and use, while also providing very extensive options for advanced users.
The extensive documentation and lively community make sure that most questions can be answered.
If you are willing to get your hands dirty, creating your own integrations is also an option.
A valid alternative to the home automation systems from Google and Amazon whilst not giving them access to all your home data!

## Resources

- [Home Assistant](https://www.home-assistant.io/){:target="_blank" rel="noopener noreferrer"}
- [Downloads](https://www.home-assistant.io/hassio/installation/){:target="_blank" rel="noopener noreferrer"}
- [Raspberry Pi USB Boot](https://www.raspberrypi.org/documentation/hardware/raspberrypi/bootmodes/msd.md){:target="_blank" rel="noopener noreferrer"}
- [Balena Etcher image burning tool](https://www.balena.io/etcher/){:target="_blank" rel="noopener noreferrer"}
- [Rufus image burning tool](https://rufus.ie/){:target="_blank" rel="noopener noreferrer"}
- [HA Available Integrations](https://www.home-assistant.io/integrations/){:target="_blank" rel="noopener noreferrer"}
- [HA Automations](https://www.home-assistant.io/docs/automation){:target="_blank" rel="noopener noreferrer"}
- [HA Blueprints](https://www.home-assistant.io/docs/automation/using_blueprints/){:target="_blank" rel="noopener noreferrer"}
- [HA Scripts](https://www.home-assistant.io/integrations/script/){:target="_blank" rel="noopener noreferrer"}
- [HA YAML Config](https://www.home-assistant.io/getting-started/configuration/){:target="_blank" rel="noopener noreferrer"}
- [HA General Docs](https://www.home-assistant.io/docs/){:target="_blank" rel="noopener noreferrer"}
- [HA Developer sections](https://developers.home-assistant.io/){:target="_blank" rel="noopener noreferrer"}
- [HA Dev Environment](https://developers.home-assistant.io/docs/development_environment){:target="_blank" rel="noopener noreferrer"}
- [HA Custom Integration File Structure](https://developers.home-assistant.io/docs/creating_integration_file_structure){:target="_blank" rel="noopener noreferrer"}
- [HA Example Integrations Source Code](https://github.com/home-assistant/example-custom-config/tree/master/custom_components/){:target="_blank" rel="noopener noreferrer"}
