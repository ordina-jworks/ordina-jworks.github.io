---
layout: post
authors: [kevin_van_den_abeele]
title: "3D Printing During Times of Corona"
image: /img/2020-06-15-3D-Printing-during-corona/banner.jpg
tags: [3D printing, Printing, Building, Technology, Smart Technology, FDM, PLA, TPU, corona, masks, ventilator, respirator, corona, covid, covid-19, sars-cov-2, FFP2, FFP3, N95, Surgical mask]
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
2. [Shortage in equipment](#shortage-in-equipment)
3. [Can 3D printing help](#can-3d-printing-help)
4. [Experimenting with TPU](#experimenting-with-tpu)
5. [Gallery](#gallery)
6. [Resources](#resources)

## Introduction

These are trying times we are living in.  
Since the outbreak of the Corona virus we have been living in some form of lockdown.
We are limited in out ability to go out and do thing, and when we do it is recommended to take the necessary precautions like keeping a safe distance and wearing a mask.
The masks are among the things we didn't have enough of, certainly in the beginning of the outbreak.  
In this blog post I'll dig a little deeper in using 3D printing tech to make masks and other equipment/material that can be of use.

<img alt="stack" src="{{ '/img/2020-06-15-3D-Printing-during-corona/sla-glow.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 500px;">

## Shortage in equipment

The strain on our healthcare system and the supplies has been massive.
Masks were kept for healthcare workers even if they were just surgical masks and not the FFP2/3 masks.
Masks are slowly becoming more widely available for the general population again, however the government relied on people to make their own masks in the beginning.  

Luckily our country was spared the overwhelming load on the hospitals like in Italy.
While the situation was very serious in the hospitals we never had a lack of ventilators or had to turn people away because the hospitals were at or already beyond their capacity.

## Can 3D printing help

3D printing is a very handy technology.
It allows for rapid prototyping and small scale production without the need to set up a full production line.
The 3D printing community is a very large one, and also a very active one.

Very soon after reports about a lack of components for ventilators there were people in Italy who designed the valve required for the respirator

TODO: Pictures of valve design and printed valved
<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/2020-06-15-3D-Printing-during-corona/sla-print1.jpeg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="Multiple eiffel towers printed at once with DLP/MSLA">
        <img alt="stack" src="{{ '/img/2020-06-15-3D-Printing-during-corona/sla-print1.jpeg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 35%; display: inline-block;">
    </a>
    <a href="{{ '/img/2020-06-15-3D-Printing-during-corona/sla-print2.gif' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="Vase print with SLA">
        <img alt="stack" src="{{ '/img/2020-06-15-3D-Printing-during-corona/sla-print2.gif' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 42%; display: inline-block;">
    </a>
</div>
<br/>

Masks designs were also popping up in the online communities, at first very basic and rudimentary designs but over the following days/weeks the designs became more specialized and optimized.

TODO: Pictures of valve design and printed valved
<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/2020-06-15-3D-Printing-during-corona/sla-print1.jpeg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="Multiple eiffel towers printed at once with DLP/MSLA">
        <img alt="stack" src="{{ '/img/2020-06-15-3D-Printing-during-corona/sla-print1.jpeg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 35%; display: inline-block;">
    </a>
    <a href="{{ '/img/2020-06-15-3D-Printing-during-corona/sla-print2.gif' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="Vase print with SLA">
        <img alt="stack" src="{{ '/img/2020-06-15-3D-Printing-during-corona/sla-print2.gif' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 42%; display: inline-block;">
    </a>
</div>
<br/>

Note: These masks are not the real deal, they are not meant to be used in hospitals, they are meant to provide a means to protect oneself when not better materials/equipment is at hand.

## Experimenting with TPU

One of the disadvantages of regular materials like PLA, ABS or PETG is that they are fairly rigid, they do net flex very much or at all.
When printing masks or devices that need to be worn on the head some form of flexibility is advisable to make the printed object conform to the shape of the head/face.

Enter TPU or Thermoplastic Polyurethane.
This material is flexible and can also be 3D printed.

TODO: Video showing flexible material

The flexibility of the material is denoted on a scale ... TODO ...

TODO: Pictures A & D flexibility scale for TPU

TPU is harder to print than regular PLA or ABS.
It is recommended to print TPU on a direct extruder at a lower than normal printing speed.
However it can also be printed on bowden fed extruders, but the printing speed needs to be lowered even further, this to prevent the filament from spooling of or clogging in the bowden tube.
Retraction distance also needs to be lowered to prevent the extruder from clogging up, this will increase stringing to some degree though.

TODO: Pictures of direct drive and bowden extruders

## Gallery

TODO

The lid:
<iframe id="vs_iframe" src="https://www.viewstl.com/?embedded&url=https://ordina-jworks.github.io/img/meeseeks/lid.stl" style="border:0;margin:0;width:100%;height:100%;"></iframe>
You can download the file <a href="/img/meeseeks/lid.stl">here.</a>

## Resources

- [Venturi valves design article 1](https://www.3dprintingmedia.network/covid-19-3d-printed-valve-for-reanimation-device/){:target="_blank"}
- [Venturi valves design article 2](https://www.fastcompany.com/90477940/these-good-samaritans-with-a-3d-printer-are-saving-lives-by-making-new-respirator-valves-for-free){:target="_blank"}
- [Venturi Valve STL files](https://cults3d.com/en/3d-model/tool/venturi-valvula-pedrovo13){:target="_blank"}
- [Custom Fitted Respirator Filter Mask - COVID-19: Files](https://www.thingiverse.com/thing:4239615){:target="_blank"}
- [Custom Fitted Respirator Filter Mask - COVID-19: YouTube](https://www.youtube.com/watch?v=kBQcNBPRkh0){:target="_blank"}
- [Universal Respirator / Face Mask w/ Mold for a Silicone Seal: Files](https://www.thingiverse.com/thing:4292905){:target="_blank"}
- [Universal Respirator / Face Mask w/ Mold for a Silicone Seal: YouTube](https://www.youtube.com/watch?v=gwOZ_gwkojg){:target="_blank"}
