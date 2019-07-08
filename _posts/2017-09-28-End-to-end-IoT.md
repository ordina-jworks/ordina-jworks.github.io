---
layout: post
authors: [kevin_van_den_abeele]
title: 'Building end-to-end IoT demos with LoRa'
image: /img/end-to-end-iot/booze-5.jpg
tags: [JavaScript, TypeScript, Internet of Things, Arduino, Prototyping, Sensors, LoRa, Booze, Node.js, Proximus, MyThings, Smart tech, Electronics, Modem]
category: IoT
comments: true
---

>To showcase end-to-end LoRa applications we built simple yet fun, real world demo applications. 
These applications show a full end-to-end implementation of the LoRa technology leveraging the Proximus MyThings Internet of Things platform.

<p style="text-align: center;">
  <img class="image fit" style="width: auto; max-height: 500px; margin:0px auto;" alt="Booze-o-meter at devoxx" src="/img/end-to-end-iot/booze-devoxx.jpg">
</p>

> The Booze-o-meter V2 at Devoxx Belgium 2016.

# Building end-to-end LoRa Iot Solutions 
Building an enterprise IoT solution is challenging. Devices need to be enrolled, monitored and maintained.
You can roll your own network and handle all of this yourself, this however will require quite the backend system to facilitate all of this.
The **Proximus LoRa network** in combination with their **MyThings platform** takes away most of this and allows us to focus on the actual applications.


## Technologies overview
For our rapid prototypes and small to medium applications we have chosen the following technical stack:
1. Proximus LoRa network for LoRa connectivity
2. Proximus MyThings platform for device management
3. NodeJS with TypeScript on the backend
4. Angular on the frontend (The older versions are still on AngularJS)

We will look into each item in full detail below:

<p style="text-align: center;">
  <img class="image fit" style="max-width: 300px; margin:0px auto;" alt="LoRa" src="/img/end-to-end-iot/lora.png">
</p>

### 1. LoRa

LoRa, short for LoRaWAN is a LPWAN (Low Power Wide Area Network) is meant for wireless battery powered devices or 'things'.
It offers a low power, low bandwidth secure network to transceive information across large distances. The network is laid out in star topology and can easily be extended by placing more base stations also called LoRa gateways.

Some network parameters:
- Range of 5 to 15 kilometers (3,1 to 9,3 miles) depending on the conditions and signal strength.
- Data rate of 0,3 kbps to 50 kbps

More detailed information and the full specifications can be found on the [LoRa Alliance website](https://www.lora-alliance.org/technology){:target="_blank"}.

<p style="text-align: center;">
  <img class="image fit" style="max-width: 300px; margin:0px auto;" alt="Proximus MyThings" src="/img/end-to-end-iot/mythings.png">
</p>

### 2. Proximus MyThings 

[Proximus MyThings](https://mythings.proximus.be/#/login/){:target="_blank"} is a LoRa device onboarding and management platform. 
It is used to enroll devices and sensors, to map their data to specific endpoints and provide tools for device management.

The platform consists of three main parts:
- MyThings Builder: Charts and sensor values (containers)
- Mythings Manager: Online device onboarding and user management
- MyThings Scanner: Offline (in the field) device onboarding

<p style="text-align: center;">
  <img class="image fit" style="max-width: 250px; margin:0px auto;" alt="NodeJS" src="/img/end-to-end-iot/node.png">
</p>

### 3. Node.js &amp; TypeScript

Most people should be familiar with [Node](https://nodejs.org/en/){:target="_blank"}.
It is the JavaScript runtime built upon the V8 engine that Google Chrome uses.
It is a lightweight and efficient runtime that uses an event-driven, non-blocking I/O model.
This combined with the added type safety that TypeScript provides makes this an excellent choice for rapid prototyping.

Some of our own demo applications make use of the Node Simple Server (NSS) application, while others just use [Express](https://expressjs.com){:target="_blank"}. This depends on the needs of the project.
If you are interested in the NSS project, we have a blog post about it [here](http://ordina-jworks.github.io/iot/2017/01/21/Node-with-TypeScript.html){:target="_blank"} and it is [on GitHub](https://github.com/ordina-jworks/NodeSimpleServer){:target="_blank"} too!

<p style="text-align: center;">
  <img class="image fit" style="max-width: 200px; margin:0px auto;" alt="Angular" src="/img/end-to-end-iot/angular.png">
</p>

### 4. Angular

Like with Node, most people should be familiar with [Angular](https://angular.io){:target="_blank"} (or the older AngularJS).
Angular is a development platform for building modern single page web applications.
It is a complete rewrite of the older AngularJS and therefor has some big changes in how things work.
Angular is easy to set up and use, it also is fully cross platform/browser compatible.


## Our demo applications
All our demo applications are publicly available in the [GitHub project of NSS](https://github.com/ordina-jworks/NodeSimpleServer){:target="_blank"}.
These demo applications are ever evolving as we are currently porting them from the older AngularJS to Angular with TypeScript.

Our demo applications have been showcased and used at several events including internal Proximus events as well as conferences like [Devoxx](https://devoxx.be){:target="_blank"}, [Techorama](https://techorama.be){:target="_blank"} and [The Belgian IoT convention](https://iot-convention.eu/en/home/){:target="_blank"} in Mechelen.

Below we will go into detail about each application and how it came to be, as well as the iterations they went through.

Aside from the **Slotmachine** and the **Booze-o-meter** we've also developed the **Stairway to Health** application for Proximus. 
A blog post about this will be available in October.
For the impatient, the IoT talk at the annual JWorks JOIN event covered this topic already and can be viewed on YouTube.

<div style="position: relative; width: 100%; height: 0; padding-bottom: 55%;">
<iframe src="https://www.youtube.com/embed/BbnwrvfozUs?rel=0" width="100%" height="100%;" style="position: absolute; left: 0; top: 0; bottom: 0; right: 0;"></iframe>
</div>

<hr />

### 1. The Slotmachine
The Slotmachine application does mostly what its name suggests, but with a twist.

The idea is simple:
If required, the player registers him or herself in the application.
A simple push button sends a signal to the backend application. 
The application dispatches an event via a websocket to the frontend application which turns the Slotmachine. 
The Slotmachine can either result in a win or a loss. 
A maximum of three attempts are possible per player, after which a new player registration is required to play again.
The player registration can be disabled depending on the requirements of the event/conference.

The light effects are also controlled by the application.
If the user has registered the gentle fading switches to a running light effect and if the user wins, the effect changes to a carrousel of different colors.
The effects are controlled the same way the button is controlled but in the opposite direction. 
The frontend application sends a websocket event to the backend application which controls the Arduino and the LEDs.

<div style="text-align:center; margin:0px auto;">
  <img class="image fit" style="width: 48%; display: inline-block;" alt="Slotmachine application" src="/img/end-to-end-iot/slotmachine-1.jpg">
  <img class="image fit" style="width: 48%; display: inline-block;" alt="Slotmachine application" src="/img/end-to-end-iot/slotmachine-2.jpg">
</div>

> The Slotmachine V1 test setup.

#### V1
The first version was not LoRa enabled and used a push button and Arduino integration via Johnny-Five to allow interaction. This meant that an Arduino always needed to be connected to the server or laptop that was used as a server.

<p style="text-align: center;">
  <img class="image fit" style="max-width: 650px; margin:0px auto;" alt="Slotmachine application at devoxx 2015" src="/img/end-to-end-iot/slotmachine-devoxx.jpg">
</p>

> The Slotmachine V1 at Devoxx Belgium 2015.

#### V2
The second version of the Slotmachine application swapped out the Arduino and the required wired connection with a **LoRa enabled push button.**

This allowed us to demonstrate the capabilities of the LoRa network in a fun and engaging way.
The application remained unchanged for the user, and was adapted to be more configurable:
Setting a win chance (up to 100%) and different images/styling for different events.

<hr />

### 2. The Booze-o-meter
The Booze-o-meter application is a drink dispenser that relays liquid fill level in the dispenser.
It is a fun example to demonstrate how measuring the fill level of a container can be achieved.
This idea can be applied to container in a whole range of different industries and use cases. 
From oil tanks to garbage cans and to containers.

The application setup is extremely similar to the Slotmachine application. 
The sensors relay their data via the MyThings platform to our backend, which in turns dispatches an event on a websocket so the frontend application can display the change.

<div style="text-align:center; margin:0px auto;">
  <img class="image fit" style="width: 48%; display: inline-block;" alt="Booze-o-meter application" src="/img/end-to-end-iot/booze-1.jpg">
  <img class="image fit" style="width: 48%; display: inline-block;" alt="Booze-o-meter application" src="/img/end-to-end-iot/booze-2.jpg">
</div>

> The Booze-o-meter V1 test setup with regular water.

<hr />

#### V1
The first version of the Booze-o-meter used three sensors that can detect a liquid through a thin plastic container. This allowed us to represent the level in the container in a coarse way: 
- FULL (initial state)
- HIGH (sensor)
- MEDIUM (sensor)
- LOW (sensor)

The sensors have a simple binary readout, `true` if liquid is detected, `false` if not.
This data gets represented on the frontend application as the four states as mentioned above.

<hr />

#### V2
<div style="text-align:center; margin:0px auto;">
  <img class="image fit" style="width: 48%; display: inline-block;" alt="Booze-o-meter application" src="/img/end-to-end-iot/booze-3.jpg">
  <img class="image fit" style="width: 48%; display: inline-block;" alt="Booze-o-meter application" src="/img/end-to-end-iot/booze-4.jpg">
</div>

> The Booze-o-meter V2 at Devoxx Belgium 2016 with actual liquor!

The second version of the Booze-o-meter application allowed us to get a more detailed reading of the remaining fluid level in the container thanks to the addition of an ultrasonic sensor.
This sensor can measure the distance between itself and a surface, in this case the surface of the liquid in the container.

The application was updated to support this more granular approach that is able to show the level in the container accurately to 1%.

## Conclusion

Our demo applications have served us well in bringing across the idea of LoRa to customers and other interested developers. 
We will continue to evolve our demo applications by adding new features, technologies and keeping them up to date.

### Useful links &amp; further reading
- [LoRa Alliance](https://www.lora-alliance.org/technology){:target="_blank"}
- [Proximus MyThings](https://mythings.proximus.be/#/login/){:target="_blank"}
- [Node Simple Server on GitHub](https://github.com/ordina-jworks/NodeSimpleServer){:target="_blank"}
- [StairWay to Health JOIN Presentation](https://www.youtube.com/watch?v=BbnwrvfozUs&t=21s){:target="_blank"}
- [Angular](https://angular.io){:target="_blank"}
- [NodeJS](https://nodejs.org/en/){:target="_blank"}
- [Express](https://expressjs.com){:target="_blank"}