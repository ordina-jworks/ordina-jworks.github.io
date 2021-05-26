---
layout: post
authors: [kevin_van_den_abeele]
title: "Intro to mqtt"
image: /img/2021-05-26-intro-to-mqtt/banner.jpg
tags: [Internet of Things, Smart Tech, Home, Smart Home, Automation, Home Automation, Home Assistant, mqtt, publish, subscribe, message broker, transport protocol]
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
2. [MQTT terminology](#mqtt-terminology)
3. [Broker options](#broker-options)
4. [Basic example](#basic-examples)
5. [Conclusion](#conclusion)
6. [Resources](#resources)

## Introduction

[MQTT](https://mqtt.org/mqtt-specification/){:target="_blank" rel="noopener noreferrer"} or Message Queuing Telemetry Transport is a very lightweight IoT messaging protocol.
It was originally designed by IBM and has become royalty free since 2010.

It is very lightweight, both on computational and network resources to send and receive messages, making it ideal for use with IoT applications as well as restrained network conditions.
The protocol is built on top of tcp/ip so both broker and client require a tcp/ip stack.
This allows for reliable bi-directional communication that supports authentication and TLS encryption and uses the publish/subscribe pattern.

Using this pattern has multiple advantages:

- Space decoupling: Publisher and subscriber clients do not need to know each other.
- Time decoupling: Publisher and subscribers do not need to run at the same point in time.
- Synchronization decoupling: Operations do not need to be interrupted during publishing or receiving.

Also be reminded that MQTT is **NOT** a message queue!
By default, messages will not be stored if there are no clients to consume them, and even retained messages only keep the last retained message, overwriting any previous retained message.

<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/2021-05-26-intro-to-mqtt/mqtt-publish-subscribe.png' | prepend: site.baseurl }}" data-lightbox="ui" data-title="MQTT">
        <img alt="MQTT" src="{{ '/img/2021-05-26-intro-to-mqtt/mqtt-publish-subscribe.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 100%; display: inline-block;">
    </a>
</div>

## MQTT terminology

Let's go over some terminology to better understand and grasp the concepts of the MQTT protocol:

[Broker](https://www.hivemq.com/blog/mqtt-essentials-part-3-client-broker-connection-establishment/){:target="_blank" rel="noopener noreferrer"}:
The host that acts as the manager for all messages.
It is responsible for receiving messages from publishers, performing checks to see which subscribers match the topic and sending the messages to those subscribers.

[Client](https://www.hivemq.com/blog/mqtt-essentials-part-3-client-broker-connection-establishment/){:target="_blank" rel="noopener noreferrer"}:
An MQTT client, meaning any instance that implements logic to connect to a broker.
Clients can be a publisher, a subscriber, or both.
A client who is a publisher sends messages, while a client whom is a subscriber receives and consumes messages.
It is perfectly possible, and often used, that a client is both a publisher and a subscriber at the same time.

Topics & wildcards:
A string that acts as a subject for publishing to or subscribing to.

[Quality of Service (QoS)](https://www.hivemq.com/blog/mqtt-essentials-part-6-mqtt-quality-of-service-levels/){:target="_blank" rel="noopener noreferrer"}:
Is a setting to ensure a certain level of guaranteed delivery.
In MQTT there are 3 QoS options:

<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/2021-05-26-intro-to-mqtt/qos-levels_qos0.svg' | prepend: site.baseurl }}" data-lightbox="ui" data-title="QoS level 0">
        <img alt="QoS level 0" src="{{ '/img/2021-05-26-intro-to-mqtt/qos-levels_qos0.svg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 100%; display: inline-block;">
    </a>
</div>
- 0: At most once
  This service level only guarantees a best effort delivery of messages.
  Delivery of messages is not guaranteed so data might be lost in transit.
  No acknowledgements are sent and no data is retransmitted.

<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/2021-05-26-intro-to-mqtt/qos-levels_qos1.svg' | prepend: site.baseurl }}" data-lightbox="ui" data-title="QoS level 1">
        <img alt="QoS level 1" src="{{ '/img/2021-05-26-intro-to-mqtt/qos-levels_qos1.svg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 100%; display: inline-block;">
    </a>
</div>
- 1: At least once
  This service level guarantees that messages are delivered at least once.
  The sender stores the message until it receives an acknowledgement from the broker.
  If the acknowledgement is not received in a timely manner the message is retransmitted.


<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/2021-05-26-intro-to-mqtt/qos-levels_qos2.svg' | prepend: site.baseurl }}" data-lightbox="ui" data-title="QoS level 2">
        <img alt="QoS level 2" src="{{ '/img/2021-05-26-intro-to-mqtt/qos-levels_qos2.svg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 100%; display: inline-block;">
    </a>
</div>
- 2: Exactly once
  This service level guarantees that messages are delivered exactly once.
  To enable this a [four-way handshake](https://bytesofgigabytes.com/mqtt/mqtt-protocol-handshake/){:target="_blank" rel="noopener noreferrer"} is used between the client and the broker.

[Retained messages](https://www.hivemq.com/blog/mqtt-essentials-part-8-retained-messages/){:target="_blank" rel="noopener noreferrer"}:
These are messages with the retained flag set to true.
The broker will store these messages with their QoS and send it to any client that connects.
This enables newly connected client get an update quicker since they do not need to wait for a new message to be published.
Retained messages can also be deleted easily: the client just needs to send an empty (0 byte payload) retained message.

[Last Will and Testament (LWT)](https://www.hivemq.com/blog/mqtt-essentials-part-9-last-will-and-testament/){:target="_blank" rel="noopener noreferrer"}:
Is a feature to notify clients about a client that has disconnected in an ungraceful manner.
The message is sent to the broker when a client connects so it can be sent to other clients later on if required.
If the client disconnects gracefully the broker discards the LWT message.

## Broker options

As MQTT requires a broker instance to function, choosing the right one is crucial.
There many different options available, both can run locally or hosted in the cloud.

There are also different versions of the MQTT protocol and not every broker supports all the different versions:

- 3.1: The older IBM based version, less used these days
- 3.1.1: OASIS standard compliant, the most used version nowadays
- 5: The newest version (2019), not yet widely used

### Eclipse Mosquitto

[Eclipse Mosquitto](https://mosquitto.org/){:target="_blank" rel="noopener noreferrer"} is an open source implementation of an MQTT message broker.
It supports all three major versions of the protocol.
The broker supports all three major versions and can run on low-powered devices like the Raspberry Pi.
I use this one at home for my home automation projects.

It is very easy to install on a Debian based distro:

```shell
wget http://repo.mosquitto.org/debian/mosquitto-repo.gpg.key
sudo apt-key add mosquitto-repo.gpg.key
cd /etc/apt/sources.list.d/

# Pick the correct URL for your flavour of Debian (we pick buster as the default):
# sudo wget http://repo.mosquitto.org/debian/mosquitto-wheezy.list
# sudo wget http://repo.mosquitto.org/debian/mosquitto-jessie.list
sudo wget http://repo.mosquitto.org/debian/mosquitto-buster.list

sudo apt-get update
apt-get install mosquitto

# We will add username/password auth for connections to the auth (anonymous is allowed by default, we don't want this, skip this section if you do)
# username: myuser, password: enter into the mosquitto_passwd tool (enter any valid password)
sudo mosquitto_passwd -c /etc/mosquitto/credentials myuser
sudo nano /etc/mosquitto/mosquitto.conf
# At the end of the file add:
# allow_anonymous false
# password_file /etc/mosquitto/credentials
sudo service mosquitto restart
```

### Aedes

[Aedes](https://github.com/moscajs/aedes){:target="_blank" rel="noopener noreferrer"} is the follow up/split from [Mosca](https://github.com/moscajs/mosca){:target="_blank" rel="noopener noreferrer"} and is fully open source.
It is a node based MQTT broker that is scalable and lightweight.
The broker only has support for the 3.1 and 3.1.1 protocol versions, 5.0 is not supported yet.

Installing is very simple, just make sure you have node installed and simply install it by using npm: `npm install aedes`.
You are responsible for creating the server instance from code.
A very basic implementation of the broker is:

```js
const aedes = require('aedes')();
const server = require('net').createServer(aedes.handle);
const port = 1883;

server.listen(port, () => {
  console.log('Server started and listening on port ', port);
});
```

### HiveMQ

[HiveMQ](https://www.hivemq.com/){:target="_blank" rel="noopener noreferrer"} is an MQTT-based platform that includes a broker.
It has the option to be hosted in the cloud (with a free trial tier) or to be run locally.
The broker has support for all three major versions of the protocol.

It does require you to create an account before you can use the cloud tier or even download the zip package for local installation.

### Emqttd

[Emqttd](https://emqtt.io/docs/v1/index.html){:target="_blank" rel="noopener noreferrer"} is another fully open source broker.
The project is written in Erlang and is fully compatible with the 3.1 and 3.1.1 versions of the protocol.

### VerneMQ

[VerneMQ](https://vernemq.com/){:target="_blank" rel="noopener noreferrer"} is another well-known broker that is also fully open-source and written in Erlang.
It has the ability to scale very well, both vertically and horizontally.
The broker has support for all three major versions of the protocol.

In addition to the free-to-use broker, they also have paid tiers of support.

## Basic examples

Basic C example (for use on an ESP-01):

```cpp
#include "EspMQTTClient.h"

EspMQTTClient *client;

void setup()
{
  client = new EspMQTTClient("SSID", "SSID_PASS", "BROKER_URL", "MQTT_USERNAME", "MQTT_PASSWORD", "CLIENT_NAME", 1883);
  //client->enableDebuggingMessages(true);

  client->enableLastWillMessage("LAST_WILL_TOPIC", "LAST_WILL_MESSAGE");
}

void onConnectionEstablished()
{
    Serial.println("MQTT: Connected");
    client->publish("TOPIC", "connected");

    client.subscribe(actionTopic, [](const String & payload) {
        Serial.println(payload);
    });
}

void loop()
{
  client->publish("TOPIC", "DATA");
  sleep(1000);
}
```

This example uses the [EspMQTTClient](https://github.com/plapointe6/EspMQTTClient){:target="_blank" rel="noopener noreferrer"} library to enable low powered IoT devices with WiFi connectivity to connect to an SSID and broker.
The library handles both the WiFi and broker connections.

Basic node example:

```js
import mqtt, {Client} from "mqtt";
import {ISubscriptionGrant} from "mqtt/types/lib/client";
import {Packet} from "mqtt-packet";

export class Main {

    private readonly client: Client;

    constructor() {
        this.client = this.connectMqtt();
        this.receive();
    }

    private connectMqtt(): any {
        const client: Client = mqtt.connect('mqtt://broker-url:1883', {username: 'username', password: 'password'});

        client.on('connect', () => {
            console.log('Connected to MQTT broker!');
        });

        return client;
    }

    private receive(): void {
        this.client.subscribe('topic', {qos: 0}, (err: Error, granted: ISubscriptionGrant[]) => {
            console.log(granted);

            if (granted && granted.length === 1) {
               this.client.on('message', (topic: string, payload: Buffer, packet: Packet) => {
                    console.log(payload.toString());
               });
            }
        })
    }
}

const main = new Main();
```

The node code is a bit more complex but allows you to create more complex applications.
It uses the [MQTT.js](https://www.npmjs.com/package/mqtt){:target="_blank" rel="noopener noreferrer"} library which has very good and extensive documentation.
This is not meant to run on the IoT device but on a separate device that reacts to messages from the IoT devices.
Please note that this will not manage the WiFi/ethernet connection of the device that it is running on, which is left to the OS/User.

## Conclusion

MQTT is an ideal protocol to use for lightweight communication on ip enabled devices.
The pub/sub architecture allows for a decoupled environment of clients that can operate independently of each other.

Thanks to the protocol and its implementations being very lightweight, it is very handy to use in combination with IoT and home automation projects.
Getting started with some simple setup is relatively easy and does not require difficult programming to wire things up.

In a future blog post, I will go a bit more in depth and show off a project which makes use of MQTT to wire devices together.

## Resources

- [MQTTT](https://mqtt.org/){:target="_blank" rel="noopener noreferrer"}
- [MQTT specifications](https://mqtt.org/mqtt-specification/){:target="_blank" rel="noopener noreferrer"}
- [Beginners guide](http://www.steves-internet-guide.com/mqtt/){:target="_blank" rel="noopener noreferrer"}
- [MQTT essentials](https://www.hivemq.com/mqtt-essentials/){:target="_blank" rel="noopener noreferrer"}
- [Broker](https://www.hivemq.com/blog/mqtt-essentials-part-3-client-broker-connection-establishment/){:target="_blank" rel="noopener noreferrer"}
- [Client](https://www.hivemq.com/blog/mqtt-essentials-part-3-client-broker-connection-establishment/){:target="_blank" rel="noopener noreferrer"}
- [Quality of Service (QoS)](https://www.hivemq.com/blog/mqtt-essentials-part-6-mqtt-quality-of-service-levels/){:target="_blank" rel="noopener noreferrer"}
- [four-way handshake](https://bytesofgigabytes.com/mqtt/mqtt-protocol-handshake/){:target="_blank" rel="noopener noreferrer"}
- [Retained messages](https://www.hivemq.com/blog/mqtt-essentials-part-8-retained-messages/){:target="_blank" rel="noopener noreferrer"}
- [Last Will and Testament (LWT)](https://www.hivemq.com/blog/mqtt-essentials-part-9-last-will-and-testament/){:target="_blank" rel="noopener noreferrer"}
- [Eclipse Mosquitto](https://mosquitto.org/){:target="_blank" rel="noopener noreferrer"}
- [Aedes](https://github.com/moscajs/aedes){:target="_blank" rel="noopener noreferrer"}
- [Mosca](https://github.com/moscajs/mosca){:target="_blank" rel="noopener noreferrer"}
- [HiveMQ](https://www.hivemq.com/){:target="_blank" rel="noopener noreferrer"}
- [Emqttd](https://emqtt.io/docs/v1/index.html){:target="_blank" rel="noopener noreferrer"}
- [VerneMQ](https://vernemq.com/){:target="_blank" rel="noopener noreferrer"}
- [EspMQTTClient](https://github.com/plapointe6/EspMQTTClient){:target="_blank" rel="noopener noreferrer"}
- [MQTT.js](https://www.npmjs.com/package/mqtt){:target="_blank" rel="noopener noreferrer"}
