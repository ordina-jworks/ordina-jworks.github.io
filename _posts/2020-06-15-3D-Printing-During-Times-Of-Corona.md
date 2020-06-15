---
layout: post
authors: [kevin_van_den_abeele]
title: "3D Printing During Times of Corona"
image: /img/2020-06-15-3D-Printing-during-corona/banner.jpg
tags: [3D printing, Printing, Building, Technology, Smart Technology, FDM, PLA, TPU, masks, ventilator, respirator, corona, covid, covid-19, sars-cov-2, FFP2, FFP3, N95, Surgical mask]
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
3. [3D printing to the rescue](#3d-printing-to-the-rescue)
4. [Experimenting with TPU](#experimenting-with-tpu)
5. [Resources](#resources)

## Introduction

These are trying times we are living in.  
Since the outbreak of the Corona virus we have been living in some form of lockdown.
We are limited in our ability to go out and do anything, and when we do, it is recommended to take the necessary precautions like keeping a safe distance and wearing a mask.
The masks are among the things we didn't have enough of, certainly in the beginning of the outbreak.  
In this blog post I'll dig a little deeper in using 3D printing tech to make masks and other equipment/material that can be of use.

<img alt="stack" src="{{ '/img/2020-06-15-3D-Printing-during-corona/covid-19-corona-virus.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 500px;">

## Shortage in equipment

The strain on our healthcare system and the supplies has been massive.
Masks were kept for healthcare workers even if they were just surgical masks and not the FFP2/3 masks.
Masks are slowly becoming more widely available for the general population again, however the government relied on people to make their own masks in the beginning.  

Luckily our country was spared from the overwhelming load on the hospitals like in Italy.
While the situation was very serious in the hospitals, we never had a lack of ventilators or had to turn people away because the hospitals were at or already beyond their capacity.

## 3D printing to the rescue

3D printing is a very handy technology.
It allows for rapid prototyping and small-scale production without the need to set up a full production line.
The 3D printing community is a very large one, and also a very active one.  

Because of the high load on the intensive care units in Italy with many people requiring to be put on a ventilator for life support, it became clear that the supply line could not meet the demand.
Because the hospitals were in need of these valves and the supplier could not provide them, the 3D printing community jumped in, and soon after the first version was designed and 3D printed.
However the valve design is patented and this hindered individuals and companies from stepping in and helping with printing extra valves.
The hospitals can request production of these masks, sidestepping the patent in times of emergency, but they have to be present and patient consent is also needed (depending on local laws).  

The pictures below show the masks.
The first picture shows the real valve (left) versus a 3D printed one using filament printing technologies.
The second picture shows later iterations of the 3D printed valves printed using polymer material that is laser fused.  

<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/2020-06-15-3D-Printing-during-corona/venturi-valve-real-vs-printed.jpg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="A real Venturi valve vs a 3D printed one">
        <img alt="stack" src="{{ '/img/2020-06-15-3D-Printing-during-corona/venturi-valve-real-vs-printed.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 22%; display: inline-block;">
    </a>
    <a href="{{ '/img/2020-06-15-3D-Printing-during-corona/venturi-valve-laser-printed.jpg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="Many laser printed Venturi valves">
        <img alt="stack" src="{{ '/img/2020-06-15-3D-Printing-during-corona/venturi-valve-laser-printed.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 37.4%; display: inline-block;">
    </a>
     <a href="{{ '/img/2020-06-15-3D-Printing-during-corona/3D-printed-valves.jpg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="3D printed Venturi valves that have been prepared for use">
        <img alt="stack" src="{{ '/img/2020-06-15-3D-Printing-during-corona/3D-printed-valves.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 39%; display: inline-block;">
    </a>
</div>
<br/>

These valves are not officially approved for use in medical devices, but since "necessity knows no law" it might be better to use these 3D printed valves and saving lives instead of letting people die.
The STL files have not been shared publicly, except for some imitations, [linked for educational purposes only!](https://cults3d.com/en/3d-model/tool/venturi-valvula-pedrovo13){:target="_blank"}
The manufacturers have not taken any legal action against this 3D printed design.
Using the original valves is still recommended and once the supply from the manufacturers can meet the demand these will once again be used as some of the intricate details of the valve are hard to mimic with current 3D printing technologies.

<iframe src="https://www.viewstl.com/?embedded&url=https://ordina-jworks.github.io/img/2020-06-15-3D-Printing-during-corona/venturi-valve.stl" style="border:0;margin:0;width:100%;height:350px;"></iframe>

But not only valves are being 3D printed.
Since there is also a great demand for face masks, and they were, certainly in the beginning, in very short supply.
So mask designs started popping up in the online communities, at first very basic and rudimentary designs but over the following days/weeks the designs became more specialized and optimized.  

These masks are not meant to replace the actual FFP2/3 or N95 masks but can offer people at least protection, if not for themselves, at least for others by preventing particles from the nose or mouth to spread as far as without wearing a mask.
3D printing materials are also (usually) not medically certified so precautions have to be taken.
Especially when printing masks with [FDM technology](https://nl.wikipedia.org/wiki/Fused_deposition_modeling){:target="_blank"}.  

It might be possible for contaminants to get in between the layers and in microscopic cavities in the printed material.
Therefor it is highly recommended to either disinfect the masks after use, and even more preferred to do this in addition to also sealing the mask with a sealant.
This sealant can be varnish or any other material which does not cause irritation when touching human skin.

Below are some of the designs I experimented with and my personal findings of each mask in terms of fabrication easy and wearing comfort.

This was one of the first masks I printed, [designed by The 3D Handyman on YouTube and Thingiverse.](https://www.thingiverse.com/thing:4239615){:target="_blank"}
<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/2020-06-15-3D-Printing-during-corona/v1-mask.stl' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="">
        <iframe src="https://www.viewstl.com/?embedded&url=https://ordina-jworks.github.io/img/2020-06-15-3D-Printing-during-corona/v1-mask.stl" class="image fit" style="margin:0px auto; width: 49%; height: 350px; display: inline-block;"></iframe>
    </a>
    <a href="{{ '/img/2020-06-15-3D-Printing-during-corona/v1-cap.stl' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="">
        <iframe src="https://www.viewstl.com/?embedded&url=https://ordina-jworks.github.io/img/2020-06-15-3D-Printing-during-corona/v1-cap.stl" class="image fit" style="margin:0px auto; width: 49%; height: 350px; display: inline-block;"></iframe>
    </a>
</div>
<br/>

The mask is modelled to the face of the creator, as can be seen in the instructional video:
<div style="position: relative; width: 100%; height: 0; padding-bottom: 55%;">
    <iframe src="https://www.youtube.com/embed/kBQcNBPRkh0" width="100%" height="100%;" style="position: absolute; left: 0; top: 0; bottom: 0; right: 0;"></iframe>
</div>
<br/>

It fits rather well, but when printed in PLA (or ABS) the edge can be rather uncomfortable.
I tried and succeeded in printing this mask in TPU which greatly improves the comfort when wearing it.
The TPU printed version does rely quite a bit more on the elastic strap to keep the lid with the filter pinned to the mask as the clips do not work that well when printed in this material.
I also designed an inlay for the cap/mask to hold the filter in place so that the filter cannot be blown out or sucked inside the mask.

<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/2020-06-15-3D-Printing-during-corona/IMG_0434.jpg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="First attempt at making masks">
        <img alt="stack" src="{{ '/img/2020-06-15-3D-Printing-during-corona/IMG_0434.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 15.3%; display: inline-block;">
    </a>
    <a href="{{ '/img/2020-06-15-3D-Printing-during-corona/IMG_0580.jpg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="Mask, inlays, filter and filter cap">
        <img alt="stack" src="{{ '/img/2020-06-15-3D-Printing-during-corona/IMG_0580.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 27%; display: inline-block;">
    </a>
     <a href="{{ '/img/2020-06-15-3D-Printing-during-corona/IMG_0581.jpg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="Assembled masks">
        <img alt="stack" src="{{ '/img/2020-06-15-3D-Printing-during-corona/IMG_0581.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 27%; display: inline-block;">
    </a>
    <a href="{{ '/img/2020-06-15-3D-Printing-during-corona/IMG_0443.jpg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="Overview of all the V1 masks I printed">
        <img alt="stack" src="{{ '/img/2020-06-15-3D-Printing-during-corona/IMG_0443.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 27%; display: inline-block;">
    </a>
</div>
<br/>

This was the second mask design I printed, [also designed by The 3D Handyman on YouTube and Thingiverse.](https://www.thingiverse.com/thing:4292905){:target="_blank"}
<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/2020-06-15-3D-Printing-during-corona/v2-mask.stl' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="">
        <iframe src="https://www.viewstl.com/?embedded&url=https://ordina-jworks.github.io/img/2020-06-15-3D-Printing-during-corona/v2-mask.stl" class="image fit" style="margin:0px auto; width: 32%; height: 350px; display: inline-block;"></iframe>
    </a>
    <a href="{{ '/img/2020-06-15-3D-Printing-during-corona/v2-cap.stl' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="">
        <iframe src="https://www.viewstl.com/?embedded&url=https://ordina-jworks.github.io/img/2020-06-15-3D-Printing-during-corona/v2-cap.stl" class="image fit" style="margin:0px auto; width: 32%; height: 350px; display: inline-block;"></iframe>
    </a>
     <a href="{{ '/img/2020-06-15-3D-Printing-during-corona/v2-mold.stl' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="">
        <iframe src="https://www.viewstl.com/?embedded&url=https://ordina-jworks.github.io/img/2020-06-15-3D-Printing-during-corona/v2-mold.stl" class="image fit" style="margin:0px auto; width: 32%; height: 350px; display: inline-block;"></iframe>
    </a>
</div>
<br/>

This mask is much more complex, not modelled to one specific face and requires additional steps after printing.
It comes with a mold on which silicone caulk should be applied to create a comfortable seal with the wearers face.
The instructional video explains it all in great detail:
<div style="position: relative; width: 100%; height: 0; padding-bottom: 55%;">
    <iframe src="https://www.youtube.com/embed/gwOZ_gwkojg" width="100%" height="100%;" style="position: absolute; left: 0; top: 0; bottom: 0; right: 0;"></iframe>
</div>
<br/>

This mask fits very well and although it requires quite a bit of extra work, I prefer it over the first version!
It sits very comfortable and does not require printing with TPU.
The silicone molding process does take some trial an error but the mask shown in the pictures is from the first attempt!

<div style="text-align: center; margin: 0px auto;">
     <a href="{{ '/img/2020-06-15-3D-Printing-during-corona/IMG_0584.jpg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="Printed mask & Silicone mold">
        <img alt="stack" src="{{ '/img/2020-06-15-3D-Printing-during-corona/IMG_0584.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 20.5%; display: inline-block;">
    </a>
    <a href="{{ '/img/2020-06-15-3D-Printing-during-corona/IMG_0486.jpg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="Mask with silicone seal 1">
        <img alt="stack" src="{{ '/img/2020-06-15-3D-Printing-during-corona/IMG_0486.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 11.5%; display: inline-block;">
    </a>
    <a href="{{ '/img/2020-06-15-3D-Printing-during-corona/IMG_0487.jpg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="Mask with silicone seal 2">
        <img alt="stack" src="{{ '/img/2020-06-15-3D-Printing-during-corona/IMG_0487.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 11.5%; display: inline-block;">
    </a>
     <a href="{{ '/img/2020-06-15-3D-Printing-during-corona/IMG_0488.jpg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="Mask with silicone seal 3">
        <img alt="stack" src="{{ '/img/2020-06-15-3D-Printing-during-corona/IMG_0488.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 11.5%; display: inline-block;">
    </a>
    <a href="{{ '/img/2020-06-15-3D-Printing-during-corona/IMG_0582.jpg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="Mask, filter and filter cap">
        <img alt="stack" src="{{ '/img/2020-06-15-3D-Printing-during-corona/IMG_0582.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 20.5%; display: inline-block;">
    </a>
     <a href="{{ '/img/2020-06-15-3D-Printing-during-corona/IMG_0583.jpg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="Assembled mask">
        <img alt="stack" src="{{ '/img/2020-06-15-3D-Printing-during-corona/IMG_0583.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 11.5%; display: inline-block;">
    </a>
</div>
<br/>

There are many, many more mask designs online.
You can always design a custom mask or look on [thingiverse](https://www.thingiverse.com/){:target="_blank"} or any other 3D modelling site for designs from other people.
The community is very large and very engaged when it comes to prototyping.
A lot of trial and error is involved before getting a mask design right, and even when printing before the print is just right so it can be worn.
Printing with different materials like TPU can also be tricky and time consuming to get right, in the section below I talk a bit more about what TPU is and why it's harder to print with.

Disclaimer: These masks are not the real deal, they are not meant to be used in hospitals, they are meant to provide a means to protect oneself when not better materials/equipment is at hand.
They also only offer an additional protection at best, and it is recommended to maintain all social distancing measures, even when wearing a mask!
All the masks shown here have been sealed with varnish or paint to allow for safer use and easier disinfection.

In addition to masks there are also tools/adapters being printed to more easily hold masks or holder for plastic face shield, to use in combination with a mask.

The straps are a very small piece that can hold the bands of a mask, this allows the mask tightness to be adjusted and provides greater comfort for the wearer.
<div style="position: relative; width: 100%; height: 0; padding-bottom: 55%;">
    <iframe src="https://www.viewstl.com/?embedded&url=https://ordina-jworks.github.io/img/2020-06-15-3D-Printing-during-corona/strap.stl" class="image fit" style="margin:0px auto; width: 100%; height: 350px; display: inline-block;"></iframe>
</div>
These can be printed quite fast on a very rough quality setting.

The second much printed item are the holders for face shields.
These face shields provide an additional layer of protection to the wearer, usually this is combined with wearing a regular face mask.
The holders fit around the wearer's head and the plastic face shield clicks onto the holder by the pins.

<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/2020-06-15-3D-Printing-during-corona/shield1.jpg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="Printed holder and plastic sheet">
        <img alt="stack" src="{{ '/img/2020-06-15-3D-Printing-during-corona/shield1.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 49%; display: inline-block;">
    </a>
    <a href="{{ '/img/2020-06-15-3D-Printing-during-corona/shield2.jpg' | prepend: site.baseurl }}" data-lightbox="fdm" data-title="Assembled face shield">
        <img alt="stack" src="{{ '/img/2020-06-15-3D-Printing-during-corona/shield2.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 49%; display: inline-block;">
    </a>
</div>
<br/>
<div style="position: relative; width: 100%; height: 0; padding-bottom: 55%;">
    <iframe src="https://www.viewstl.com/?embedded&url=https://ordina-jworks.github.io/img/2020-06-15-3D-Printing-during-corona/shield-holder.stl" class="image fit" style="margin:0px auto; width: 100%; height: 350px; display: inline-block;"></iframe>
</div>

## Experimenting with TPU

One of the disadvantages of regular materials like [PLA](https://en.wikipedia.org/wiki/Polylactic_acid){:target="_blank"}, [ABS](https://en.wikipedia.org/wiki/Acrylonitrile_butadiene_styrene){:target="_blank"} or [PETG](https://en.wikipedia.org/wiki/Polyethylene_terephthalate){:target="_blank"} is that they are fairly rigid, they do not flex very much or at all.
When printing masks or devices that need to be worn on the head, some form of flexibility is advisable to make the printed object conform to the shape of the head/face.

Enter [TPU or Thermoplastic Polyurethane](https://en.wikipedia.org/wiki/Thermoplastic_polyurethane){:target="_blank"}.
This material is flexible and can also be 3D printed.
This makes the material suitable for use in designs that need to be able to conform to the contours of a human face.

<div style="text-align: center; margin: 0px auto;">
    <video width="270" height="480" autoplay muted loop>
        <source src="/img/2020-06-15-3D-Printing-during-corona/IMG_0440.MOV" type="video/mp4">
    </video>
</div>
<br/>

The flexibility of the material is denoted on a hardness scale: The Shore hardness scale.

<img alt="Shore hardness scale" src="{{ '/img/2020-06-15-3D-Printing-during-corona/shore-hardness.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 600px;">

This scale has three scales:

- Scale 00
- Scale A: Soft rubber types
- Scale D: Hard rubber types

As you can see, these scales do somewhat overlap.
For 3D printing the harder the TPU material is, the easier it is to print.
The lower the A or D scale value of the TPU material, the lower the printing speed and the shorter the retraction distance/speed has to be!

TPU is harder to print than regular PLA or ABS.
It is recommended to print TPU on a direct extruder at a lower than normal printing speed.
However, it can also be printed on bowden fed extruders, but the printing speed needs to be lowered even further to prevent the filament from spooling up or clogging in the bowden tube.
Retraction distance also needs to be lowered to prevent the extruder from clogging up.
This will increase stringing to some degree though.

3D printing is already trial and error, but for printing flexibles like TPU this is even more so.
The material is a lot more unforgiving than PLA or even ABS and the settings need to be fine-tuned for each different printer and TPU material before prints will come out looking somewhat decent.

The image below shows the difference between a bowden extruder (left), which has a guiding tube made of teflon and a direct drive extruder (right).
<img alt="Bowden versus Direct drive extruder" src="{{ '/img/2020-06-15-3D-Printing-during-corona/bowden-vs-direct.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 600px;">

Below is a video of my 3D printer with a bowden type extruder printing TPU just fine, albeit very slowly.
<div style="text-align: center; margin: 0px auto;">
    <video width="480" height="270" autoplay muted loop>
        <source src="/img/2020-06-15-3D-Printing-during-corona/IMG_0442.MOV" type="video/mp4">
    </video>
</div>
<br/>

## Resources

- [Italian hospital saves Covid-19 patients lives by 3D printing valves for reanimation devices](https://www.3dprintingmedia.network/covid-19-3d-printed-valve-for-reanimation-device/){:target="_blank"}
- [These Good Samaritans with a 3D printer are saving lives by making new respirator valves for free](https://www.fastcompany.com/90477940/these-good-samaritans-with-a-3d-printer-are-saving-lives-by-making-new-respirator-valves-for-free){:target="_blank"}
- [Venturi Valve STL files](https://cults3d.com/en/3d-model/tool/venturi-valvula-pedrovo13){:target="_blank"}
- [Custom Fitted Respirator Filter Mask - COVID-19: Files](https://www.thingiverse.com/thing:4239615){:target="_blank"}
- [Custom Fitted Respirator Filter Mask - COVID-19: YouTube](https://www.youtube.com/watch?v=kBQcNBPRkh0){:target="_blank"}
- [Universal Respirator / Face Mask w/ Mold for a Silicone Seal: Files](https://www.thingiverse.com/thing:4292905){:target="_blank"}
- [Universal Respirator / Face Mask w/ Mold for a Silicone Seal: YouTube](https://www.youtube.com/watch?v=gwOZ_gwkojg){:target="_blank"}
- [Surgical mask strap](https://www.thingiverse.com/thing:4249113){:target="_blank"}
- [Face shield holder](https://3dverkstan.se/protective-visor/){:target="_blank"}
- [Shore hardness](https://www.x3d.com.au/blog/best-tpu-filaments-according-to-shore-hardness){:target="_blank"}
- [Direct drive vs Bowden](https://all3dp.com/2/direct-vs-bowden-extruder-technology-shootout/){:target="_blank"}
