---
layout: post
authors: [cisse_tsyen]
title: 'RTK Internship'
image: /img/2022-05-04-RTK-Internship/DiagramRTK.png
tags: [Internet of Things, RTK, cloud, testing]
category: IoT
comments: true
---

- [Introduction](#introduction)
- [What is GNSS?](#what-is-gnss)
- [What is RTK?](#what-is-rtk)
- [What is FLEPOS?](#what-is-flepos)
- [RTK module and antenna](#rtk-module-and-antenna)
- [Sending data to the cloud](#sending-data-to-the-cloud)

## Introduction
Whats the problem?

## What is GNSS?
Global Navigation Satellite System (GNSS) refers to a group of satellites that broadcast signals from space that relay positioning and timing data to GNSS receivers. 
The receivers then use this data to determine the location, GNSS provides worldwide coverage.

GNSS performance is evaluated against four criteria:
1.	Accuracy: the difference between a receiver's measured and actual position, speed, or time.
2.	Integrity: the ability of a system to provide a confidence threshold and, in the event of an anomaly in the positioning data, to provide an alarm signal.
3.	Continuity: the ability of a system to operate without interruption.
4.	Availability: the percentage of time that a signal meets the above criteria for accuracy, integrity and continuity.



<div class="responsive-video">
    <iframe width="900" height="506" src="https://www.youtube.com/embed/gffG5sTegT4" title="YouTube video player"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
<br/>


### Examples of GNSS
- Galileo of Europe
- NAVSTAR Global Positioning System (GPS) of USA
- Global'naya Navigatsionnaya Sputnikovaya Sistema (GLONASS) of Russia
- Beidou of China

### GPS
### Galileo
### Improving GNSS Accuracy
GNSS accuracy is affected by numerous factors, the most important of which is atmospheric interference, as signals travel through space and into the Earth's atmosphere. 
Without taking these errors into account, we will see inaccuracies in the positions transmitted.
The chart below shows a number of different methods that can improve GNSS performance. 
We are going to focus on Real Time Kinematics (RTK) and Satellite Based Augmentation System (SBAS) because RTK is the most accurate and SBAS is one of the best known.

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2022-05-04-RTK-Internship/MethodsAccuracy.png' | prepend: site.baseurl }}" alt="InputStream" class="image center" style="margin:0px auto; max-width:100%">
{: refdef}

### What is SBAS?
The performance of global satellite navigation systems (GNSSs) can be improved by regional Satellite Based Augmentation System (SBAS). 
SBAS improves the accuracy and reliability of GNSS information by correcting signal measurement errors and providing information on the accuracy, integrity, continuity and availability of its signals.

SBAS uses GNSS measurements made by accurately located reference stations distributed across a continent. 
All measured GNSS errors are transmitted to a central computing center, where differential corrections and integrity messages are calculated. 
These calculations are then broadcast over the covered area using geostationary satellites (satellite always located over the same place on earth) that serve as a supplement, or overlay, to the original GNSS message. 
SBAS can be accurate to within about 2m.
### Existing SBAS
Several countries have adopted their own Satellite Based Augmentation System. 
In Europe, for example, EGNOS reaches most of the European Union (EU), along with a number of neighboring countries and regions.

Other national SBASs :

- Europe: European overlay service for geostationary navigation (EGNOS)
- USA: Wide Area Augmentation System (WAAS)
- Japan: Michibiki Satellite Augmentation System (MSAS)
- India: GPS-assisted GEO navigation (GAGAN)
- China: BeiDou SBAS (BDSBAS) (under development)
- South Korea: Korea Augmentation Satellite System (KASS) (under development)
- Russia: System for Differential Corrections and Monitoring (SDCM) (under development)
- ASECNA: African and Indian Ocean SBAS (A-SBAS) (under development)
- Australia and New Zealand: Southern Positioning Augmentation Network (SPAN) (in development)
  
{:refdef: style="text-align: center;"}
<img src="{{ '/img/2022-05-04-RTK-Internship/Sbas.png' | prepend: site.baseurl }}" alt="InputStream" class="image center" style="margin:0px auto; max-width:100%">
<figcaption> &copy; EUSPA 2021</figcaption>
{: refdef}

### Testing with SBAS
For certain applications, SBAS is already accurate enough. 
This can be seen in the video below where I attached the antenna to my car and made a test drive.
In this video you can see that the accuracy is already pretty good with SBAS, the pointer stays on the road pretty well.
The video is sped up because it was too long otherwise.

VIDEO TESTEN AUTO!!!!!!


## What is RTK?
RTK stands for Real-Time Kinematic and is a technique that uses carrier-based distance determination. 
It takes the normal signals from GNSS together with a correction data stream and calculates the exact location. 
This allows us to achieve an accuracy of up to 1cm.
{:refdef: style="text-align: center;"}
<img src="{{ '/img/2022-05-04-RTK-Internship/RTK.jpg' | prepend: site.baseurl }}" alt="InputStream" class="image center" style="margin:0px auto; max-width:100%">
{: refdef}
### Calculation of the range
On a basic conceptual level, the range is calculated by determining the amount of carrier waves between the satellite and the rover, which is then multiplied by the length of the carrier.

In this range there are still errors, these errors are caused by satellite clock and ephemeris but also by ionospheric and tropospheric delays. 
We can solve this by sending correction data from the base station to the rover over a mobile network or another type of wireless communication such as LoRa.
### Network RTK
Network RTK is based on the use of several fixed reference stations spread out over the network. 
Depending on the application, the rover sends its location to the reference stations, so the rover is not dependent on one base station but can connect to several reference stations. 
This allows for a greater range than a single fixed base station which is about 10 km.
### How to receive correction data?
There are a few ways to receive this correction data. You can build your own base station or use a service. 
Not all services are free, for example Skylark, this service has coverage over 3 continents but is paying. 
Fortunately, the Flemish government has set up a service called FLEPOS. 

## What is FLEPOS?
Flemish Positioning Service (FLEPOS) is a service of Digital Flanders where correction streams from navigation satellites are distributed via a mobile network, using the NTRIP protocol. 
These correction streams make it possible to determine an accurate position anywhere in Flanders. 
Using FLEPOS services is completely free, the connection costs over mobile networks, such as 4G, are not free.
{:refdef: style="text-align: center;"}
<img src="{{ '/img/2022-05-04-RTK-Internship/FLEPOS.png' | prepend: site.baseurl }}" alt="FLEPOS" class="image center" style="margin:0px auto; max-width:100%">
{: refdef}

### Usage of FLEPOS
FLEPOS is used within various markets that require accurate positioning:

- Surveying, photogrammetry
- Precision agriculture
- GIS inventory
- Hydrography
- Machine tool control
- Dredging
- ...

A specific RTK service has been set up for each of these markets. 
FLEPOS also offers data for scientific research. 
Before FLEPOS can be used, the registration form must be completed and approved on the website of Digitaal Vlaanderen.

### FLEPOS mounpoint
To receive the correction data, it is necessary to connect to a mountpoint of FLEPOS. 
The figure below shows all available mountpoints. 
The most commonly used data streams are FLEPOSVRS31GR and FLEPOSVRS32GREC. 
The user is free to take one of the other available data streams for the GNSS receiver. 
Data stream FLEPOSMARIVRS31GR is recommended only for measurement in the North Sea because this data stream uses the 2 overseas stations ALDB and SHOE and the station BLIG located on the Bligh sandbank.

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2022-05-04-RTK-Internship/Mounpoints.png' | prepend: site.baseurl }}" alt="FLEPOS" class="image center" style="margin:0px auto; max-width:100%">
{: refdef}

## RTK module and antenna
### EXPLAIN




## Sending data to the cloud
### EXPLAIN