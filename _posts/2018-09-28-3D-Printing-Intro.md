---
layout: post
authors: [kevin_van_den_abeele]
title: "3D Printing: An introduction"
image: /img/2018-09-28-3D-Printing/banner.jpg
tags: [3D printing, printing, building, technology, iot, internet of things]
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
2. [What is 3D printing](#what-is-3d-printing)
3. [Types of 3D printing](#types-of-3d-printing)
4. [Getting started with 3D printing](#getting-started-with-3d-printing)
5. [Personal experience](#personal-experience)
6. [The future](#the-future)

## Introduction

3D printing is a term that has been hyped for a long time.
It's a technology that is in essence not that new, but now more than ever is getting better and accessible to everyone.
Today we take a dive into the world of 3D printing and what is really has in store for us and the worlds in the coming years.

<img alt="stack" src="{{ '/img/2018-09-28-3D-Printing/sla-glow.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 500px;">


## What is 3D printing

Basically 3D printing can be described as: Producing 3D modeled objects by printing them with a 3D printer.
It offers a new way to do fast prototyping without the need to create very expensive molds or stencils.

It has long been hyped to be the next big thing:
- Everyday use, recreating objects, replacing broken parts
- Medical use, create patient specific casts or prostheses that fit better
- Weapons (in the news), 3D print a gun, can pass through metal detector

Although 3D printing has changed how prototyping works a lot of misconceptions exist:
- 3D printing is slow, very slow
    - Thus not usable to create batches of the same object
- Limited available materials (for hobby use)
- 3D printed parts are strong but not as strong as molded or cast parts (mainly for plastics)


## Types of 3D printing

3D printing is not one technology, there are many different methods a 3D print can be created.
Wherein the method the print is created varies depending on the technology used.

Different technologies use different method and materials, each with their distinct advantages and disadvantages.

Some of these methods include (bot are not limited to):
- Fused deposition modeling (FDM)
- Stereolithography (SLA)
- Digital Light Processing (DLP)
- Masked Stereolithography (MSLA)
- Direct Metal Laser Sintering (DMLS)
- Selective laser melting (SLM)
- Electronic Beam Melting (EBM)

Below we will go into detail for some of the more used types:
- FDM
- SLA, DLP & MSLA
- SLS & SLM


### Different methods

#### FDM: Fused Deposition Modeling

<img alt="stack" src="{{ '/img/2018-09-28-3D-Printing/fdm.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 500px;">

With `Fused Deposition Modeling` the printed model is created by melting a compound, this being mostly PLA/ABS/PETG, and tracing the model layer by layer, each layer thickening the model as the printer deposits more material on the model.

In the image above all the main pieces for an FDM printer are visible. 
The nozzle is moved on the Z-axis, and the build plate is moved on the X/Y-axes by stepper motors which control the movement up to one tenth or even one twentieth of a millimeter.
A spool of material is fed into the nozzle which melts it and deposits it onto the model by use of extrusion wheels/stepper motors.

FDM printers are widely available both ready to use and as kits that require assembly, these are also the most affordable type of printers on the market.
Some even require you to print more components for the printer with the printer itself.

<a href="{{ '/img/2018-09-28-3D-Printing/fdm-print1.jpg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="FDM printers & prints">
    <img alt="stack" src="{{ '/img/2018-09-28-3D-Printing/fdm-print1.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 500px;">
</a>
<a href="{{ '/img/2018-09-28-3D-Printing/fdm-print2.jpg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="FDM printers & prints">
    <img alt="stack" src="{{ '/img/2018-09-28-3D-Printing/fdm-print2.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 500px;">
</a>


#### SLA & DLP: Stereolithography & Digital Light Processing

<img alt="stack" src="{{ '/img/2018-09-28-3D-Printing/sla-dlp.jpeg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 800px;">

These types of printers work by using either a laser or a projected image to cure a UV-reactive resin.

With SLA a powerful UV laser traces the object layer by layer, like the FDM printer does, however it does not deposit material itself, rather it cures the resin in the tank at the point where the laser is.
Because SLA uses a laser that is moved by mirrors, it can have a very high resolution, the disadvantage is that it is as slow as an FDM printer since each layer needs to be traced.

With DLP an UV projector is used, it projects the an entire layer at once, the results in a lower printable resolution for the object, but yields a significant speed increase since an entire layer is printed at once, there is no need to trace the entire layer.
MSLA is a cheaper version of the DLP method where a LCD based photomask is used in front of an UV-LED array instead of an UV based projector.

The image above can show the distinct difference between these two (three) methods.

<a href="{{ '/img/2018-09-28-3D-Printing/sla-print1.jpg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="SLA printers & prints">
    <img alt="stack" src="{{ '/img/2018-09-28-3D-Printing/sla-print1.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 500px;">
</a>
<a href="{{ '/img/2018-09-28-3D-Printing/sla-print2.jpg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="SLA printers & prints">
    <img alt="stack" src="{{ '/img/2018-09-28-3D-Printing/sla-print2.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 500px;">
</a>


#### DMLS & SLM: Direct Metal Laser Sintering & Selective Laser Melting


### Different materials

#### Polymers

TODO


#### Metal

TODO


#### Concrete/construction

<div class="responsive-video">
    <iframe width="1164" height="655" src="https://www.youtube.com/embed/GUdnrtnjT5Q" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>

TODO


#### FOOD

TODO


## Getting started with 3D printing

TODO


## Personal experience

TODO: Photo gallery
<a href="{{ '/img/2018-09-28-3D-Printing/fdm.png' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="fdm">
    <img alt="stack" src="{{ '/img/2018-09-28-3D-Printing/fdm.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 500px;">
</a>

## The future

TODO


## Resources

- [SLA vs DLP vs MSLA](https://theorthocosmos.com/laser-sla-vs-dlp-vs-masked-sla-3d-printing-technology-compared/)
- [DMLS vs SLM](https://www.element.com/nucleus/2016/06/29/dmls-vs-slm-3d-printing-for-metal-manufacturing)