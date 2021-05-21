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
3. [Basic example](#basic-examples)
4. [Broker options](#broker-options)
5. [Conclusion](#conclusion)
6. [Resources](#resources)

## Introduction

MQTT or Message Queuing Telemetry Transport is a very lightweight IoT messaging protocol.
It was originally designed by IBM and has become royalty free since 2010.

It is very lightweight, both on resources to send and receive messages, making it ideal for use with IoT applications as well as restrained network conditions.
The protocol is built on top of tcp/ip so both broker and client require a tcp/ip stack.
The protocol allows for reliable bi-directional communication that supports authentication and TLS encryption and uses the publish/subscribe pattern.

Using this pattern has multiple advantages:

- Space decoupling: Publisher and subscriber clients do not need to know each other.
- Time decoupling: Publisher and subscribers do not need to run at the same point in time.
- Synchronization decoupling: Operations do not need to be interrupted during publishing or receiving.

Also be reminded that MQTT is **NOT** a message queue!
By default messages will not be stored if there are no clients to consume them, and even retained messages only keep the last retained message, overwriting any previous retained message.

<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/2021-05-26-intro-to-mqtt/mqtt-publish-subscribe.png' | prepend: site.baseurl }}" data-lightbox="ui" data-title="MQTT">
        <img alt="MQTT" src="{{ '/img/2021-05-26-intro-to-mqtt/mqtt-publish-subscribe.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 100%; display: inline-block;">
    </a>
</div>

## MQTT terminology

To better understand and grasp the concepts of the MQTT protocol explained in this blog post I have listed some terminology below:

[Broker](https://www.hivemq.com/blog/mqtt-essentials-part-3-client-broker-connection-establishment/){:target="_blank" rel="noopener noreferrer"}:
The host that acts as the manager for all messages.
It is responsible for receiving messages from publishers, performing checks to see which subscribers match the topic and sending the messages to said subscribers.

[Client](https://www.hivemq.com/blog/mqtt-essentials-part-3-client-broker-connection-establishment/){:target="_blank" rel="noopener noreferrer"}:
An MQTT client, meaning any instance that implements logic to connect to a broker.
Both publishers and subscribers are clients.
Publishers send messages and subscribers consume messages.
A client can implement both sides and act as both a publisher and a subscriber.

Topics & wildcards:
A string that acts as a subject for publishing to or subscribing to.

[Quality of Service (QoS)](https://www.hivemq.com/blog/mqtt-essentials-part-6-mqtt-quality-of-service-levels/){:target="_blank" rel="noopener noreferrer"}:
Is a setting to ensure a certain level of guaranteed delivery.
In MQTT there are 3 QoS options:

- 0: At most once
  This service level only guarantees a best effort delivery of messages.
  Delivery of messages is not guaranteed so data might be lost in transit.
  No acknowledgement are sent and no data is retransmitted.
- 1: At least once
  This service level guarantees that messages are delivered at least once.
  The sender stores the message until it receives an acknowledgement from the broker.
  If the acknowledgement is not received in a timely manner the message is retransmitted.
- 2: Exactly once
  This service level guarantees that messages are delivered exactly once.
  To enable this a four-way handshake is used between the client and the broker.

<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/2021-05-26-intro-to-mqtt/qos-levels_qos0.svg' | prepend: site.baseurl }}" data-lightbox="ui" data-title="QoS level 0">
        <img alt="QoS level 0" src="{{ '/img/2021-05-26-intro-to-mqtt/qos-levels_qos0.svg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 33%; display: inline-block;">
    </a>
    <a href="{{ '/img/2021-05-26-intro-to-mqtt/qos-levels_qos1.svg' | prepend: site.baseurl }}" data-lightbox="ui" data-title="QoS level 1">
        <img alt="QoS level 1" src="{{ '/img/2021-05-26-intro-to-mqtt/qos-levels_qos1.svg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 33%; display: inline-block;">
    </a>
    <a href="{{ '/img/2021-05-26-intro-to-mqtt/qos-levels_qos2.svg' | prepend: site.baseurl }}" data-lightbox="ui" data-title="QoS level 2">
        <img alt="QoS level 2" src="{{ '/img/2021-05-26-intro-to-mqtt/qos-levels_qos2.svg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 33%; display: inline-block;">
    </a>
</div>

[Retained messages](https://www.hivemq.com/blog/mqtt-essentials-part-8-retained-messages/){:target="_blank" rel="noopener noreferrer"}:
These are messages with the retained flag set to true.
The broker will store these messages with their QoS and send it to any client that connects.
This enabled newly connected client get an update quicker since they do not need to wait for a new message to be published.
Retained messages can also be deleted easily: the client just needs to send an empty (0 byte payload) retained message.

[Last Will and Testament (LWT)](https://www.hivemq.com/blog/mqtt-essentials-part-9-last-will-and-testament/){:target="_blank" rel="noopener noreferrer"}:
Is a feature to notify clients about a client that has disconnected in an ungraceful manner.
The message is sent to the broker when a client connects so it can be sent to other clients later on if required.
If the client disconnects gracefully the broker discards the LWT message.

## Basic examples

TODO

## Broker options

As MQTT requires a broker instance to function choosing the right one is crucial.
There many different options available, both run run locally or hosted in the cloud.

There are also different versions of the MQTT protocol, not every broker supports all the different versions:

- 3.1: The older IBM based version, less used these days
- 3.1.1: OASIS standard compliant, the most used version nowadays
- 5: The newest version (2019), not yet widely used

### Eclipse Mosquitto

TODO

### Aedes

TODO

### HiveMQ

TODO

### emqttd

TODO

### VerneMQ

TODO

## Conclusion

MQTT is an ideal protocol to use for lightweight communication on ip enabled devices.
The pu/sub architecture allows for a decoupled environment of clients that can operate independently of each other.

Good support for MQTT in home automation platforms means that "dumb" devices can be enabled for use in the smart home.

## Resources

- [MQTTT](https://mqtt.org/){:target="_blank" rel="noopener noreferrer"}
- [Beginners guide](http://www.steves-internet-guide.com/mqtt/){:target="_blank" rel="noopener noreferrer"}
- [MQTT essentials](https://www.hivemq.com/mqtt-essentials/){:target="_blank" rel="noopener noreferrer"}
