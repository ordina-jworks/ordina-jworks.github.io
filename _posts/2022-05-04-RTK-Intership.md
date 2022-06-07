---
layout: post
authors: [cisse_tsyen]
title: 'RTK Internship'
image: /img/2022-05-04-RTK-Internship/DiagramRTKrsz.jpg
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
- [Conclusion](#conclusion)

## Introduction
GPS and GNSS are not really accurate on their own, this can lead to crucial errors when one needs accurate positioning, such as with surveyors. 
For this, systems  such as Real-Time Kinematic (RTK) have been developed that will improve this inaccurate positioning.

## What is GNSS?
Global Navigation Satellite System (GNSS) refers to a group of satellites that broadcast signals from space that relay positioning and timing data to GNSS receivers. 
The receivers then use this data to determine the location, GNSS provides worldwide coverage.

GNSS performance is evaluated against four criteria:
1.	Accuracy: the difference between a receiver's measured and actual position, time or speed.
2.	Integrity: the ability of a system to provide a confidence threshold and, in the event of an anomaly in the positional data, to provide an alarm signal.
3.	Continuity: the ability of a system to operate without interruption.
4.	Availability: the percentage of time that a signal meets the above criteria for accuracy, integrity and continuity.



<div class="responsive-video">
    <iframe width="900" height="506" src="https://www.youtube.com/embed/gffG5sTegT4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
<br/>


### Examples of GNSS
- Galileo of Europe
- NAVSTAR Global Positioning System (GPS) of USA
- Global'naya Navigatsionnaya Sputnikovaya Sistema (GLONASS) of Russia
- Beidou of China

### GPS
I'm going to explain GPS because it is by far the most known GNSS system.
There are about 32 GPS satellites in space. 
This is a relatively large system that works through careful planning and calibration.
The location is calculated by the receiver, this by means of the distance and time between him and the satellite.
This is calculated as follows, the speed of the signal (speed of light) is multiplied by the atomic clock time of the satellite.
The location can already be determined from three satellites, but this is not accurate.
A total of four satellites is needed to get an accurate location determination.
The first three satellites are used to determine the location in three dimensions x, y and z coordinates.
The fourth satellite is used to determine the time it takes for the signal to travel from the satellite to the receiver, as shown in the figure below.

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2022-05-04-RTK-Internship/GPSDiagram.jpg' | prepend: site.baseurl }}" alt="GPSDiagram" class="image center" style="margin:0px auto; max-width:100%">
{: refdef}
<figcaption>&copy;Sparkfun</figcaption>

### Improving GNSS Accuracy
GNSS accuracy is affected by numerous factors, the most important of which is atmospheric interference, as signals travel through space and into the Earth's atmosphere. 
Without taking these errors into account, we will see inaccuracies in the positions transmitted.
The chart below shows a number of different methods that can improve GNSS performance. 
We are going to focus on Real Time Kinematics (RTK) and Satellite Based Augmentation System (SBAS) because RTK is the most accurate and SBAS is one of the best known.

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2022-05-04-RTK-Internship/MethodsAccuracy.png' | prepend: site.baseurl }}" alt="InputStream" class="image center" style="margin:0px auto; max-width:100%">
{: refdef}

### What is SBAS?
The performance of global satellite navigation systems (GNSSs) can be enhanced by regional Satellite Based Augmentation System (SBAS). 
SBAS enhances the accuracy and reliability of GNSS information by correcting signal measurement errors and providing information about the accuracy, integrity, continuity and availability of its signals.

SBAS uses GNSS measurements from precisely located reference stations spread over a continent.
All measured GNSS errors are sent to a central computer centre, where differential corrections and integrity messages are calculated. 
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
{: refdef}
<figcaption> &copy; EUSPA 2021</figcaption>

### Testing with SBAS
For certain applications, SBAS is already accurate enough. 
This can be seen in the video below where I attached the antenna to my car and did a test drive.
In this video you can see that the accuracy is already pretty good with SBAS, the pointer stays on the road pretty well.
The video is sped up because it was too long otherwise.
<div class="responsive-video">
    <iframe width="900" height="506" src="https://www.youtube.com/embed/kG72kCYS0KY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
<br/>

The images below shows the setup:
{:refdef: style="text-align: center;"}
<img src="{{ '/img/2022-05-04-RTK-Internship/TestingSBAS.JPG' | prepend: site.baseurl }}" alt="TestingSBAS" class="image center" style="margin:0px auto; max-width:100%">
{: refdef}

## What is RTK?
RTK stands for Real-Time Kinematic and is a technique that uses carrier-based distance determination. 
It takes the normal signals from GNSS together with a correction data stream and calculates the exact location. 
This allows us to achieve an accuracy of up to 1cm.
{:refdef: style="text-align: center;"}
<img src="{{ '/img/2022-05-04-RTK-Internship/RTK.jpg' | prepend: site.baseurl }}" alt="RTK" class="image center" style="margin:0px auto; max-width:100%">
{: refdef}
### Calculation of the range
On a basic conceptual level, the range is calculated by determining the amount of carrier waves between the satellite and the rover, which is then multiplied by the length of the carrier.

In this range there are still errors, these errors are caused by satellite clock and ephemeris, but also by ionospheric and tropospheric delays. 
We can solve this by sending correction data from the base station to the rover over a mobile network or another type of wireless communication such as LoRa.
### Network RTK
Network RTK is based on the use of several fixed reference stations spread out over the network. 
Depending on the application, the rover sends its location to the reference stations, so the rover is not dependent on one base station but can connect to several reference stations. 
This allows for a greater range than a single fixed base station, which is about 10 km.
### How to receive correction data?
There are a few ways to receive this correction data. You can build your own base station or use a service. 
Not all services are free, for example Skylark, this service has coverage over 3 continents but is paying. 
Fortunately, the Flemish government has set up a service called FLEPOS. 

## What is FLEPOS?
Flemish Positioning Service (FLEPOS) is a service of Digital Flanders, where correction streams from navigation satellites are distributed via a mobile network, using the NTRIP protocol. 
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

### FLEPOS mountpoint
To receive the correction data, it is necessary to connect to a mountpoint of FLEPOS. 
The figure below shows all available mountpoints. 
The most commonly used data streams are FLEPOSVRS31GR and FLEPOSVRS32GREC. 
The user is free to take one of the other available data streams for the GNSS receiver. 
Data stream FLEPOSMARIVRS31GR is recommended only for measurement in the North Sea because this data stream uses the 2 overseas stations ALDB and SHOE and the station BLIG located on the Bligh sandbank.

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2022-05-04-RTK-Internship/Mounpoints.png' | prepend: site.baseurl }}" alt="FLEPOS" class="image center" style="margin:0px auto; max-width:100%">
{: refdef}

## RTK module and antenna
### SparkFun GPS-RTK Board - NEO-M8P-2
The Sparkfun GPS-RTK Board is a powerful breakout board for the NEO-M8P-2 module from u-blox.
The NEO-M8P-2 is a highly accurate module for the use of GNSS and GPS location solutions such as RTK.
The module is unique in that it can be configured as a rover as well as a base station.
There are 4 different methods to connect with this board: USB, I²C, UART or SPI.
I'm using a combination with I²C and USB.
{:refdef: style="text-align: center;"}
<img src="{{ '/img/2022-05-04-RTK-Internship/RTKBoard.jpg' | prepend: site.baseurl }}" alt="RTKBoard" class="image center" style="margin:0px auto; max-width:100%">
{: refdef}

### Antenna
First, I had a cheap antenna that was laying around at the office.
With this cheap antenna the signals were weak, inaccurate and it took a long time to receive them.
Therefore the testing was quite challenging and hard to do.
That's why a good, accurate antenna,  like the  ANN-MB-00 GNSS multiband antenna, is necessary.

### ANN-MB-00 GNSS multiband antenna
The ANN-MB-00 GNSS multiband antenna is unique from other GNSS/GPS antennas in that it is designed to receive both the classic L1 GPS band and the fairly newly launched L2 GPS band. 
Furthermore, the u-blox ANN-MB-00 is well constructed with a magnetic base with mounting holes for additional anchoring for the toughest environments.
It is suitable for use with any GPS/GNSS receiver with dual L1/L2 reception and supports GPS, GLONASS, Galileo and BeiDou.
{:refdef: style="text-align: center;"}
<img src="{{ '/img/2022-05-04-RTK-Internship/antenna.jpg' | prepend: site.baseurl }}" alt="ANN-MB-00 antenna" class="image center" style="margin:0px auto; max-width:100%">
{: refdef}

### Testing of the antennas
I tested both antennas side by side for 5 minutes while outside on the table, using SBAS as the correction method.
These are the results (the more compact the data points the more accurate):

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2022-05-04-RTK-Internship/TestingAntennasOutside.JPG' | prepend: site.baseurl }}" alt="TestingAntennasOutside" class="image center" style="margin:0px auto; max-width:100%">
{: refdef}


u-blox ANN-MB-00-00 (new antenne):
{:refdef: style="text-align: center;"}
<img src="{{ '/img/2022-05-04-RTK-Internship/newantenna.png' | prepend: site.baseurl }}" alt="newantenna" class="image center" style="margin:0px auto; max-width:100%">
{: refdef}

You can see that the antenna stays within a range of max 2.5m when stationary. 
It got a connection to the signal immediately when I started the module.

Unknown first cheap antenna:
{:refdef: style="text-align: center;"}
<img src="{{ '/img/2022-05-04-RTK-Internship/Cheapantenna.png' | prepend: site.baseurl }}" alt="Cheapantenna" class="image center" style="margin:0px auto; max-width:100%">
{: refdef}

First of all it took way longer to establish a connection, a couple of minutes. 
The data points are further apart from each other. 
Whereas you can see with the other antenna that they are much closer together. 
So that means that there is a lot of play between each data point. 
This means that the new antenna is more accurate. 
At last you can also see that the range of the antenna went over the 2.5 meter mark.


From this we can conclude that it is necessary to have a good antenna when we want to work precisely.

### Testing with RTK
There were a couple of problems with the SparkFun GPS-RTK Board during my internship, it didn't calculate the accurate positioning altho it did receive the correction data correctly from FLEPOS.
The Sparkfun RTK-board is supposed to calculate this automatically, but it didn't and I could not change the configuration to the right settings.
That is why I don't have a video which shows the use of RTK on the SparkFun GPS-RTK Board like in the section with SBAS.


## Sending data to the cloud
As an extra you can send the data to the cloud, during my internship at Ordina I did this as follows:
- I received the positioning data with a Raspberry Pi and sent it to the Azure IoT Hub
- Then through Azure functions the data got stored in a Mongodb with Azure Cosmos DB-API
- After that, the data got handled with springboot and visualized.

In the image below you can see the diagram that visualizes this process:
{:refdef: style="text-align: center;"}
<img src="{{ '/img/2022-05-04-RTK-Internship/DiagramRTK.png' | prepend: site.baseurl }}" alt="DiagramRTK" class="image center" style="margin:0px auto; max-width:100%">
{: refdef}

## Conclusion
Real-Time Kinematic (RTK) can be very accurate and handy in some situations where needed.
For certain applications, Satellite Based Augmentation System (SBAS) is accurate enough and RTK should not be used.
It is very interesting to what extent technologies have been developed, that it is possible to achieve such accuracy with a relatively low cost.