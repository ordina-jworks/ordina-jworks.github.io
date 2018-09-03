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
* Do some stream processing using just plain old native java.
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

Define a Spring Boot application - make sure to enable scheduling.
{% highlight java %}
    @SpringBootApplication
    @EnableScheduling
    @EnableBinding({Channels.class})
    public class OpenDataTrafficApplication {

        public static void main(String[] args) {
            SpringApplication.run(OpenDataTrafficApplication.class, args);
        }
    }
{% endhighlight %}

Define some input and output topics:
{% highlight java %}
    public interface Channels {

        @Input
        SubscribableChannel trafficEvents();

        @Output
        MessageChannel trafficEventsOutput();

        @Output
        MessageChannel sensorDataOutput();
    }
{% endhighlight %}


Create a bean to read in the events.
{% highlight java %}
    public List<TrafficEvent> readInData() throws Exception {
        log.info("Will read in data from " + url);

        JAXBContext jc = JAXBContext.newInstance("generated.traffic");
        Unmarshaller um = jc.createUnmarshaller();

        Miv miv = (Miv) um.unmarshal(new URL(url).openStream());

        log.info(" This data is from " + miv.getTijdPublicatie().toGregorianCalendar().getTime());
        List<TrafficEvent> trafficEventList = convertXmlToDomain.trafficMeasurements(miv.getMeetpunt());

        lastReadInDate = miv.getTijdPublicatie().toGregorianCalendar().getTime();

        log.info("retrieved {} events ", trafficEventList.size()) ;

        return trafficEventList;
    }
{% endhighlight %}

Next we will retrieve the data out of the xml and split it out in something which is more event like.
For every sensorpoint per vehicle we will extract 1 TrafficEvent.

{% highlight java %}
@Data
    public class TrafficEvent {

        private VehicleClass vehicleClass;
        private Integer trafficIntensity;

        private Integer vehicleSpeedCalculated;

        private Integer vehicleSpeedHarmonical;

        private String sensorId;
        private String sensorDescriptiveId;

        private Integer lveNumber;
        private Date timeRegistration;
        private Date lastUpdated;

        /*
        actueel_publicatie: 1 = data is minder dan 3 minuten oud.
         */
        private Boolean recentData;

        private Boolean availableMeetpunt;

        private Integer sensorDefect;
        private Integer sensorValid;

    }
{% endhighlight %}

The VehicleClass is just an enum with the vehicle type.
{% highlight java %}

{% endhighlight %}

We will also retrieve the detailed sensor information from the xml containing the sensor descriptions.
{% highlight java %}

@Data
    public class SensorData {

        private String uniekeId;

        /*
        MeetpuntId
        */
        private Integer sensorId;
        /*
        Meetpunt beschrijvende Id
         */
        private String sensorDescriptiveId;

        private String name;

        /*
        Unique road number.
            More info in the dataset of numbered roads in the "Wegenregister" (Roads registry), field: locatieide,
            http://opendata.vlaanderen.be/dataset/wegenregister-15-09-2016
            Or the dataset "De beheersegmenten van de genummerde wegen" by AWV, field ident8,
            http://www.geopunt.be/catalogus/datasetfolder/12b65bc0-8c71-447a-8285-3334ca1769d8
        */
        private String ident8;

        /*
        Reference to the lane of the measurement point.
          The character indicates the lane type.
            R: Regular lane
            B: Bus lane or similar
            TR: measurement of the traffic in the opposite direction (p.e. in or near tunnels) on the corresponding R-lane.
            P: Hard shoulder lane
            W: parking or other road
            S: Lane for hard shoulder running
            A: Hatched area

          Counting starts at R10 for the first regular lane of the main road. Lane numbers increase from right/slower to left/faster lanes.
          Lanes 09, 08, 07, ... are positioned right of this first lane, and mainly indicate access/merging lanes, deceleration lanes, recently added lanes, lanes for hard shoulder running, bus lanes
          Lanes 11, 12, 13, ... are positioned left of lane R10.
          The lane number 00 is used for measurement points on the hard shoulder (P00).
          The TR-lane is identical to the corresponding R-lane (TR10=R10,TR11=R11,TR12=R12,...), but returns the data of the "ghost traffic" instead.
          (The data for TR10 and R10 are provided by the same detection loops.)
         */
        private String trafficLane;
    }
{% endhighlight %}


Write to a topic.
{% highlight java %}
    public void sendMessage(TrafficEvent trafficEvent) {
        outputChannels.trafficEvents().send(MessageBuilder.withPayload(trafficEvent).build());


        log.info("Send message to the trafficEventOutput channel");
        outputChannels.trafficEventsOutput().send(MessageBuilder.withPayload(trafficEvent).build());
    }

    public void sendSensorData(SensorData sensorData) {
        outputChannels.sensorDataOutput().send(MessageBuilder.withPayload(sensorData).build());
    }
{% endhighlight %}

The events will be send to Kafka as JSON messages.

With the scheduled annotation Spring Boot will read in the events every 60 seconds.
{% highlight java %}
    @Scheduled(fixedRate = 60000)
    public void run() throws Exception {
        putAllEventsInKafka();
    }
{% endhighlight %}

When you are taking your data in, it is important to decide what to send in.
You do not want to remove too much information, but also you don't want that your events become too bloated.
Meaning, that they contain too much information and you need to spend a lot of time extracting data when analysing your data.
Keep them as close to the actual event as possible, only adding in data if this is required.

In our current example the sensor data does not need to be part of the traffic events, as it is pretty static.
If in your situation, you have another data entry which changes every few events, it might be worthwhile to already add it to your event when taking it in.
So that later you on you do not have to spend time merging data together.

Sometimes your intake data is also too large, it is not wrong to ignore certain properties when taking in data in you stream.

In our case we ignore a lot of the properties withing the xml, as they do not serve our excample.
But getting the X_coord_EPSG_31370 property of a sensor out of a xml file which was available yesterday is going to be pretty hard, this blog is not about time travel.

Having less properties to analyze can make your life easier, but if that raw data is no longer available you have lost that information for good.

### Takeaways
* Think in events
* Keep the data structure as flat as possible
* Do not optimize your data too soon

## Native Java Stream Processing

### Do not forget
Do not forget that you can also process your events in native Java.
You will not have a lot of fancy features available, but it might get the job done.

Especially when you take into consideration the extra cost involved in introduction a streaming framework.
For both Kafka and Storm you not only need to setup a cluster of the framework itself, but also of Zookeeper.

That setup does not come for free and will need to be maintained in the future.

### Easy to get started
With Spring Cloud Stream it is easy to get going with processing your stream of data.

First define a [SubscribableChannel](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/messaging/SubscribableChannel.html)
{% highlight java %}
    @Input
    SubscribableChannel trafficEvents();
{% endhighlight %}

Then you will need to define a MessageHandler which will describe what you will do with every message you process.
{% highlight java %}
    MessageHandler messageHandler = (message -> {
            log.info("retrieved message with header " + message.getHeaders().toString());
            log.info("retrieved message " + message.getPayload().toString());

            TrafficEvent event = (TrafficEvent) message.getPayload();

            log.info(" the sensor id is " + event.getSensorId());

            if (event.getTrafficIntensity() > 0) {
                log.info("We now have {} vehicles on the road {}", event.getTrafficIntensity(), event.getSensorId());

                int vehicleCountForEvent = event.getTrafficIntensity();

                if (vehicleCount.get(event.getSensorId()) != null) {
                    vehicleCountForEvent += vehicleCount.get(event.getSensorId());
                }

                log.info("We now had total: {} vehicles", vehicleCountForEvent);

                vehicleCount.put(event.getSensorId(), vehicleCountForEvent);
            }

            if (event.getVehicleSpeedCalculated() > 0) {
                if (lowestWithTraffic.get(event.getSensorId()) == null || lowestWithTraffic.get(event.getSensorId()).getVehicleSpeedCalculated() > event.getVehicleSpeedCalculated()) {
                    lowestWithTraffic.put(event.getSensorId(), event);
                }

                if (highestWithTraffic.get(event.getSensorId()) == null || highestWithTraffic.get(event.getSensorId()).getVehicleSpeedCalculated() < event.getVehicleSpeedCalculated()) {
                    highestWithTraffic.put(event.getSensorId(), event);
                }

                messages.add(event);
            }
        });
{% endhighlight %}

Finally, link that MessageHandler to an InputChannel.
{% highlight java %}
    inputChannels.trafficEvents().subscribe(messageHandler);
{% endhighlight %}

There you go, you are now processing your stream of data in native java.

It does become obvious that doing something more fancy, like windowing and aggregation, will require you to write all of that logic yourself.

This can get out of hand pretty quickly, so, do watch out for that.
But for simple data processing, nothing beats some native Java.

### Takeaways Native Java
* Can easily handle 1000 events per second.
* Easy to get started.
* You will lack advanced features like windowing, aggregation, ...

## Spring Kafka

### Kafka

[Spring Kafka](https://spring.io/projects/spring-kafka) allows us to easily make use of [Apache Kafka](https://kafka.apache.org/).

Kafka is designed to handle large streams of data.

Messages are published into topics and can be stored for mere minute or indefinetely, by default 7 days.
It is highly scalable allowing topics to be distributed over multiple brokers 

[Kafka Streams](https://kafka.apache.org/documentation/streams/) allows us to write steam processing applications within the Kafka cluster itself.

For this reason Kafka Streams will use topics for both input and output.

### What "topics" does Kafka Streams use

[KStream](https://kafka.apache.org/10/javadoc/org/apache/kafka/streams/kstream/KStream.html)

A KStream records a stream of key/value pairs and can be defined from 1 or more topics.
It does not matter if a key exists multiple times within the KStream, when you read in the data of a KStream every record will be sent to you.

[KTable](https://kafka.apache.org/10/javadoc/org/apache/kafka/streams/kstream/KTable.html)
A KTable is a changelog stream of a primary keyed table, meaning, that whenever a key exists multiple times within the KTable you will receive only the most recent record.

[GlobalKTable](https://kafka.apache.org/10/javadoc/org/apache/kafka/streams/kstream/GlobalKTable.html)
Like a KTable, but it is replicated over all Kafka Streams instances, so do be carefull.

[KGroupedStream](https://kafka.apache.org/10/javadoc/org/apache/kafka/streams/kstream/KGroupedStream.html)


[KGroupedTable](https://kafka.apache.org/10/javadoc/org/apache/kafka/streams/kstream/KGroupedTable.html)


### Operations

Aggregate

Count

Filter

Join

Process

### Coding with Spring Kafka


### Scaling and Instances


### Takeaways Kafka Streams and Spring Kafka



## Apache Storm

### Twitter

### Spouts & Bolts

### Windowing
https://storm.apache.org/releases/1.0.6/Windowing.html

### Stream API

### Takeaways Apache Storm


## Conclusion


