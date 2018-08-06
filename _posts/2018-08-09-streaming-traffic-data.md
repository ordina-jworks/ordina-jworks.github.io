---
layout: post
authors: [tom_van_den_bulck]
title: "Streaming Traffic Data with Spring Kafka & Apache Storm"
image: /img/2018-08-08-streaming-traffic-data/traffic.png
tags: [Spring, Storm, Streaming]
category: Streaming
comments: true
---

Earlier this year I did a workshop at Ordina in order to introduce my collegues to the wonderfull world of stream processing.


## Introduction
In this blog post we will use traffic data as it is made available by the flemish governement.

Several [Spring Boot](https://spring.io/projects/spring-boot) applications will be made which will handle this data:
* Transform the data into events with [Spring Cloud Stream](https://cloud.spring.io/spring-cloud-stream/)
* Process these events with [Kafka Streams](https://kafka.apache.org/documentation/streams/) with [Spring Kafka](https://spring.io/projects/spring-kafka)
* Do similar processing with [Apache Storm](http://storm.apache.org/)

## The Data
The traffic data is registered on fixed sensors installed in the road itself.
<img alt="Sensor " src="/img/2018-08-08-streaming-traffic-data/detectielussen%20A12.JPG" class="image fit">

General information about the sensors can be retrieved from [http://miv.opendata.belfla.be/miv/configuratie/xml](http://miv.opendata.belfla.be/miv/configuratie/xml).

{% highlight xml %}
    <meetpunt unieke_id="3640">
        <beschrijvende_id>H291L10</beschrijvende_id>
        <volledige_naam>Parking Kruibeke</volledige_naam>
        <Ident_8>A0140002</Ident_8>
        <lve_nr>437</lve_nr>
        <Kmp_Rsys>94,695</Kmp_Rsys>
        <Rijstrook>R10</Rijstrook>
        <X_coord_EPSG_31370>144477,0917</X_coord_EPSG_31370>
        <Y_coord_EPSG_31370>208290,6237</Y_coord_EPSG_31370>
        <lengtegraad_EPSG_4326>4,289767347</lengtegraad_EPSG_4326>
        <breedtegraad_EPSG_4326>51,18458196</breedtegraad_EPSG_4326>
    </meetpunt>
{% endhighlight %}

It is pretty static as these sensors do not tend to move themselves. 

Every minute latest sensor output is published on [http://miv.opendata.belfla.be/miv/verkeersdata](http://miv.opendata.belfla.be/miv/verkeersdata)

This is one big xml file containing all the aggregated data of every sensor for the last minute.
{% highlight xml %}
    <meetpunt beschrijvende_id="H211L10" unieke_id="1152">
        <lve_nr>177</lve_nr>
        <tijd_waarneming>2017-11-20T16:08:00+01:00</tijd_waarneming>
        <tijd_laatst_gewijzigd>2017-11-20T16:09:28+01:00</tijd_laatst_gewijzigd>
        <actueel_publicatie>1</actueel_publicatie>
        <beschikbaar>1</beschikbaar>
        <defect>0</defect>
        <geldig>0</geldig>
        <meetdata klasse_id="1">
            <verkeersintensiteit>0</verkeersintensiteit>
            <voertuigsnelheid_rekenkundig>0</voertuigsnelheid_rekenkundig>
            <voertuigsnelheid_harmonisch>252</voertuigsnelheid_harmonisch>
        </meetdata>
        <meetdata klasse_id="2">
            <verkeersintensiteit>6</verkeersintensiteit>
            <voertuigsnelheid_rekenkundig>116</voertuigsnelheid_rekenkundig>
            <voertuigsnelheid_harmonisch>113</voertuigsnelheid_harmonisch>
        </meetdata>
        <meetdata klasse_id="3">
            <verkeersintensiteit>1</verkeersintensiteit>
            <voertuigsnelheid_rekenkundig>118</voertuigsnelheid_rekenkundig>
            <voertuigsnelheid_harmonisch>118</voertuigsnelheid_harmonisch>
        </meetdata>
        <meetdata klasse_id="4">
            <verkeersintensiteit>3</verkeersintensiteit>
            <voertuigsnelheid_rekenkundig>84</voertuigsnelheid_rekenkundig>
            <voertuigsnelheid_harmonisch>84</voertuigsnelheid_harmonisch>
        </meetdata>
        <meetdata klasse_id="5">
            <verkeersintensiteit>5</verkeersintensiteit>
            <voertuigsnelheid_rekenkundig>84</voertuigsnelheid_rekenkundig>
            <voertuigsnelheid_harmonisch>84</voertuigsnelheid_harmonisch>
        </meetdata>
        <rekendata>
            <bezettingsgraad>9</bezettingsgraad>
            <beschikbaarheidsgraad>100</beschikbaarheidsgraad>
            <onrustigheid>366</onrustigheid>
        </rekendata>
    </meetpunt>
{% endhighlight %}

For more information about this dataset (in Dutch) can be found at [https://data.gov.be/nl/dataset/7a4c24dc-d3db-460a-b73b-cf748ecb25dc](https://data.gov.be/nl/dataset/7a4c24dc-d3db-460a-b73b-cf748ecb25dc).
Over there you can also find the xsd files describing the xml structure.

## Transform to Events
Since we are using Spring Boot, just go to [https://start.spring.io/](https://start.spring.io/) and get started.
Some handly baseline dependencies to get started are: Web, Actuator and Devtools.

Because the data is provided to us in a single xml file, we will transform it into separate events per sensor.
This brings it also inline with how true sensory events would arrive within our system.

A small Spring Cloud Stream application will be built to read in the xml, transform it to events and push these events in a Kafka topic.

You might wonder, why would we use Spring Cloud Stream for this?
As it is just very easy to read/write messages to Kafka with it.

Add the appropriate starter:
{% highlight xml %}
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-stream-binder-kafka</artifactId>
    </dependency>
{% endhighlight %}

Create a bean to read in the events.

Split the xml into multiple records.

Write to a topic.

The events will be send to Kafka as JSON messages.

## Spring Kafka

## Apache Storm

## Hints & Tips




## Conclusion


