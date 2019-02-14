---
layout: post
authors: [tom_van_den_bulck]
title: "Streaming Traffic Data with Spring Kafka & Apache Storm"
image: /img/2018-08-08-streaming-traffic-data/traffic.png
tags: [Spring, Storm, Streaming]
category: Streaming
comments: true
---

Earlier I did a workshop at Ordina in order to introduce my collegues to the wonderfull world of stream processing, for that workshop I used traffic data.
Since, especially in Belgium, traffic data is something everybody can easily relate to as we all have to endure it every workday.

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

``` java
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
```

It is pretty static as these sensors do not tend to move themselves. 

Every minute latest sensor output is published on [http://miv.opendata.belfla.be/miv/verkeersdata](http://miv.opendata.belfla.be/miv/verkeersdata)

This is one big xml file containing all the aggregated data of every sensor for the last minute.
``` java
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
```

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
``` java
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-stream-binder-kafka</artifactId>
    </dependency>
```

Define a Spring Boot application - make sure to enable scheduling.
``` java
    @SpringBootApplication
    @EnableScheduling
    @EnableBinding({Channels.class})
    public class OpenDataTrafficApplication {

        public static void main(String[] args) {
            SpringApplication.run(OpenDataTrafficApplication.class, args);
        }
    }
```

Define some input and output topics:
``` java
    public interface Channels {

        @Input
        SubscribableChannel trafficEvents();

        @Output
        MessageChannel trafficEventsOutput();

        @Output
        MessageChannel sensorDataOutput();
    }
```


Create a bean to read in the events.
``` java
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
```

Next we will retrieve the data out of the xml and split it out in something which is more event like.
For every sensorpoint per vehicle we will extract 1 TrafficEvent.

``` java
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
``` java

The VehicleClass is just an enum with the vehicle type.
``` java
    MOTO(1),
    CAR(2),
    CAMIONET(3),
    RIGGID_LORRIES(4),
    TRUCK_OR_BUS(5),
    UNKNOWN(0);

```

We will also retrieve the detailed sensor information from the xml containing the sensor descriptions.
``` java

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
```


Write to a topic.
``` java
    public void sendMessage(TrafficEvent trafficEvent) {
        outputChannels.trafficEvents().send(MessageBuilder.withPayload(trafficEvent).build());


        log.info("Send message to the trafficEventOutput channel");
        outputChannels.trafficEventsOutput().send(MessageBuilder.withPayload(trafficEvent).build());
    }

    public void sendSensorData(SensorData sensorData) {
        outputChannels.sensorDataOutput().send(MessageBuilder.withPayload(sensorData).build());
    }
```

The events will be send to Kafka as JSON messages.

With the scheduled annotation Spring Boot will read in the events every 60 seconds.
``` java
    @Scheduled(fixedRate = 60000)
    public void run() throws Exception {
        putAllEventsInKafka();
    }
```

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
``` java
    @Input
    SubscribableChannel trafficEvents();
```

Then you will need to define a MessageHandler which will describe what you will do with every message you process.
``` java
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
```

Finally, link that MessageHandler to an InputChannel.
``` java
    inputChannels.trafficEvents().subscribe(messageHandler);
```

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
This is an intermediate format based on a re-grouped stream of records based on a KStream, with usually, a different key then the original primary key.

It is derived from a groupBy() or a groupByKey() on a Kstream.
Via aggregate(), count() or reduce() it can be converted to a KTable.

[KGroupedTable](https://kafka.apache.org/10/javadoc/org/apache/kafka/streams/kstream/KGroupedTable.html)
This is pretty similar to a KGroupedStream, but a KGroupedTable is derived from a KTable via groupBy().

It can be reconverted to a KTable via aggregate(), count() or reduce().


### Coding with Spring Kafka

We still have the Sprint Cloud Stream topics to which we send in some data, let's use these but now with Kafka.

First we are going to take in the static data of the sensors into a KTable.

``` java
    KStream<String, SensorData> sensorDescriptionsStream =
        streamsBuilder.stream("sensorDataOutput", Consumed.with(Serdes.String(), new SensorDataSerde()));

    KStream<String, SensorData> sensorDescriptionsWithKey =
        sensorDescriptionsStream.selectKey((key, value) -> value.getUniekeId());
    sensorDescriptionsWithKey.to("dummy-topic");

    KTable<String, SensorData> sensorDataKTable =
        streamsBuilder.table("dummy-topic", Consumed.with(Serdes.String(), new SensorDataSerde()));
```

The main reason we are using a `KTable` is it makes it easy to be sure to only get the most recent state of that sensor, as a KTable will only return 1 result per key.
Dummy-topic is just the name I chose, for my example it is not that important.
But do realize that Kafka Streams will persist the state of a Ktable within Kafka topics.

Subsequently we are going to enrich the traffic event with the sensor data.
``` java
    KStream<String, TrafficEvent> stream =
            streamsBuilder.stream("trafficEventsOutput", Consumed.with(Serdes.String()
                    , new TrafficEventSerde()));
    stream.selectKey((key,value) -> value.getSensorId())
            .join(sensorDataKTable,((TrafficEvent trafficEvent, SensorData sensorData) -> {
                trafficEvent.setSensorData(sensorData);
                return trafficEvent;
            }), Joined.with(Serdes.String(), new TrafficEventSerde(), null))
            .to("enriched-trafficEventsOutput");
```

Resulting in a new `KStream` with enriched TrafficEvents.

The `.stream(String topic, Consumed<K,V> consumed)` will consume all entries from a topic and transform these into a stream. 
Mapping these to topic records with a Key and a Value.
In our case the key is just a String, while the body of the topic will be a json message which gets converted into a `TrafficEvent`.

With `join()`, full definition `<VT, VR> KStream<K, VR> join(final KTable<K, VT> table,
                                 final ValueJoiner<? super V, ? super VT, ? extends VR> joiner,
                                 final Joined<K, V, VT> joined);`
we join our `KTable` with our `TrafficEvent` records using the `ValueJoiner` we pass along which will result in a new `Joined` result.
The ValueJoiner is just a function in which we indicate what needs to be done with both records the function receives. 
In our case a `TrafficEvent` and a `SensorData`.
The `Joined` describes the new record structure we will write towards Kafka using `.to(String topic)` sending the newly generated records to that Kafka topic.

Once this stream has started, it will continue processing these events whenever a new record is inserted on the intake topic.


For some of our further processing we do not care for all traffic events, so lets filter out some.

``` java
    KStream<String, TrafficEvent> streamToProcessData = 
        streamsBuilder.stream("enriched-trafficEventsOutput", Consumed.with(Serdes.String(), new TrafficEventSerde()));

    streamToProcessData.selectKey((key,value) -> value.getSensorId())
        .filter((key, value) -> canProcessSensor(key));
```

Filtering happens on the key of the records, so first we will use `selectKey()` passing along a `KeyMapper` to map to the new key.
The `KeyMapper` is a function to which you pass along the field which you want to become the new key.

Then we will use `filter()` to filter out the keys we want to retain which match the given `Predicate`.
In our case the Predicate just verifies if a key appears within a `List`:
``` java
    private boolean canProcessSensor(String key) {
        return this.sensorIdsToProcess.contains(key);
    }
```


For every record we will now do some simple processing:
``` java
    streamToProcessData
        .selectKey((key,value) -> value.getSensorId())
        .filter((key, value) -> canProcessSensor(key))
        .foreach((key, value) -> updateStats(value));
```

The `updateStats()` method just updates some basic counters to track how much traffic has been processed since we started with the data intake.
So that we know how many vehicles have passed, which was the highest speed detected, ... 



### Windowing

In an ideal world all events arrive in a perfect and timely fashion within our Kafka system.

In an ideal world we can also process all the events we want to process.

In the real world however, this does not compute.
Events tend to arrive out of order and too late.

If you want to get a count of all the vehicles which ran over your road network from 21:00h to 21:05h but one of your sensors sent its events too late the count you have generated will not be correct.

Windowing allows you to mitigate these risk by 
* Limiting the scope of your stream processing
* Allowing you to catch some "late" events within a window.



``` java
    private void createWindowStreamForAverageSpeedPerSensor(KStream<String, TrafficEvent> streamToProcessData) {
        Initializer initializer = () -> new SensorCount();

        streamToProcessData
            .groupByKey()
            .windowedBy(TimeWindows.of(300000).advanceBy(60000))
            .aggregate(initializer, (key, value, aggregate) -> aggregate.addValue(value.getVehicleSpeedCalculated()),
                    Materialized.with(Serdes.String(), new JsonSerde<>(SensorCount.class)))
                    .mapValues(SensorCount::average, Materialized.with(new WindowedSerde<>(Serdes.String()), Serdes.Double()))
                    .toStream()
                    .map(((key, average) -> new KeyValue<>(key.key(), average)))
                    .through("average-speed-per-sensor", Produced.with(Serdes.String(), Serdes.Double()))
                    .foreach((key, average) -> log.info((String.format(" =======> average speed for the sensor %s is now %s", key, average))));
    }
```

``` java
    streamToProcessData.filter((key, value) -> canProcessSensor(key))
                .selectKey((key,value) -> value.getSensorData().getName().replaceAll("\\s","").replaceAll("-", ""))
        .to("traffic-per-lane");

        KStream<String, TrafficEvent> streamPerHighwayLaneToProcess = 
                streamsBuilder.stream("traffic-per-lane", Consumed.with(Serdes.String(), new TrafficEventSerde()));

        this.createWindowStreamForAverageSpeedPerHighwaySection(streamPerHighwayLaneToProcess);
```

### Takeaways Kafka Streams and Spring Kafka

* When you have a Kafka cluster lying around, using Kafka Streams is a no-brainer.
* Excellent support within Spring.
* Easy to get started.
* Using the [Kafka Streams DSL](https://docs.confluent.io/current/streams/developer-guide/dsl-api.html) feels quite natural.


## Apache Storm

### Twitter

It was first created at [Twitter](https://twitter.com/) who open sourced it as an Apache [Project](http://storm.apache.org/).

One of the first streaming frameworks which got widely adopted.

### Spouts & Bolts

<div style="text-align: center;">
  <img src="/img/streaming-traffic/storm-spout-bolts.png" width="100%" height="100%">
</div>

When you work with Storm you need to think in `Spouts`, `Bolts` and `Tuples`.

A `Spout` is the origin of your streams.
It will read in `Tuples` from an external source and can be either reliable or unreliable.

Reliable just means that when something goes wrong within your stream processing, the spout can replay the `Tuple`.
While an unrealiable Spout will go for the good old fire-and-forget approach.

Spouts can also emmit to more then 1 stream.

Spouts will generate `Tuples`, a `Tuple` is the main data structure within Storm.
A Tuple is a named list of values, where a value can be of any type.
It is however important that Storm can serialize all the values within a Tuple, so for a more exotic type you will need to implement a serializer yourselves.

`Bolts` do all the processing of your streams.
A `Bolt` can send out to more then 1 stream.
It is also possible to define a Stream Grouping on your Bolts allowing you to tailor the distribution of your workload over the various Bolts of your Storm topology.

Multiple instances of a Bolt will run as tasks.

You have the following Stream Groupings:
* Shuffle Grouping: completely random
* Fields Grouping: based on the value of certain fields, storm will make sure that all the Tuples with the same "key" will be processed by the same Bolt, handy for word counts for example - great business value.
* Partial Key Grouping: pretty similar to fields grouping, but with some extra load balancing.
* All grouping: the entire stream will go to all the tasks of a Bolt, use this with care.
* None Grouping: implies that you don't care how it gets processed - which corresponds with a shuffle grouping.
* Direct Grouping: here the producer of the Tuple will decide which task of the Bolt will receive the Tuple for processing.
* Local or Shuffle Grouping: this will also take a look at the worker processes running the Bolts tasks, this in order to make the flow somewhat more efficient.


Now lets get started with some code.

The idea is to get to a Storm topology with 1 Spout and 2 Bolts.
``` java
    final TopologyBuilder tp = new TopologyBuilder();
        tp.setSpout("kafka_spout", new KafkaSpout<>(spoutConfig), 1).setDebug(false);
        tp.setBolt("trafficEvent_Bolt", new TrafficEventBolt(sensorIdsToProcess)).setDebug(false)
                .globalGrouping("kafka_spout");
        tp.setBolt("updateTrafficEventStats_bolt", new TrafficCountBolt()).setDebug(true)
                .fieldsGrouping("trafficEvent_Bolt", new Fields("sensorId"));
        return tp.createTopology();
``` 

First we will define a KafkaSpout which will take in the data of a Kafka topic.


``` java
    protected KafkaSpoutConfig<String, String> getKafkaSpoutConfig(String bootstrapServers) {
        ByTopicRecordTranslator<String, String> trans = new ByTopicRecordTranslator<>(
                (r) -> new Values(r.topic(), r.partition(), r.offset(), r.key(), r.value()),
                new Fields("topic", "partition", "offset", "key", "value"));
        trans.forTopic("trafficEventsOutput",
                (r) -> new Values(r.topic(), r.partition(), r.offset(), r.key(), r.value()),
                new Fields("topic", "partition", "offset", "key", "value"));
        return KafkaSpoutConfig.builder(bootstrapServers, new String[]{"trafficEventsOutput"})
                .setProp(ConsumerConfig.GROUP_ID_CONFIG, "kafkaSpoutTestGroup")
                .setRetry(getRetryService())
                .setRecordTranslator(trans)
                .setOffsetCommitPeriodMs(10_000)
                .setFirstPollOffsetStrategy(EARLIEST)
                .setMaxUncommittedOffsets(1050)
                .build();
    }
``` 

For completeness this is the `retryService` which just handles some retrying whenever your Kafka cluster is behaving naughty:
``` java
    protected KafkaSpoutRetryService getRetryService() {
            return new KafkaSpoutRetryExponentialBackoff(KafkaSpoutRetryExponentialBackoff.TimeInterval.microSeconds(500),
                    KafkaSpoutRetryExponentialBackoff.TimeInterval.milliSeconds(2), Integer.MAX_VALUE, KafkaSpoutRetryExponentialBackoff.TimeInterval.seconds(10));
    }
``` 


Then we will emmit that data to a TrafficEventBolt which will filter out the events we want to process further.

``` java
    public class TrafficEventBolt extends BaseRichBolt {
        private OutputCollector collector;


        private final List<String> sensorIds;

        public TrafficEventBolt(List<String> sensorIdsToProcess) {
            this.sensorIds = sensorIdsToProcess;
        }

        @Override
        public void prepare(Map map, TopologyContext topologyContext, OutputCollector outputCollector) {
            this.collector = outputCollector;
        }

        @Override
        public void execute(Tuple input) {
            log.info("input = [" + input + "]");

            input.getValues();

            TrafficEvent trafficEvent = new Gson().fromJson((String)input.getValueByField("value"), TrafficEvent.class);
            //TrafficEvent trafficEvent = (TrafficEvent) input.getValueByField("value");

            if (sensorIds.contains(trafficEvent.getSensorId())) {
                collector.emit(input, new Values(trafficEvent.getSensorId(), trafficEvent.getVehicleSpeedCalculated(), trafficEvent.getTrafficIntensity()));
            } else {
                collector.ack(input);
            }

        }

        @Override
        public void declareOutputFields(OutputFieldsDeclarer declarer) {
            declarer.declare(new Fields("sensorId", "speed", "trafficIntensity"));
        }
    }
``` 

Finally we will send out the Tuples to a `TrafficCountBolt` which will gather some general statistics.

``` java
    public class TrafficCountBolt extends BaseRichBolt {
        private OutputCollector collector;


        private final HashMap<String, Integer> countPerSensors = new HashMap<>();


        @Override
        public void prepare(Map map, TopologyContext topologyContext, OutputCollector outputCollector) {
            this.collector = outputCollector;
        }

        @Override
        public void execute(Tuple input) {
            log.info("input = [" + input + "]");

            Integer count = countPerSensors.get((String)input.getValueByField("sensorId"));
            if (count == null) {
                count = 0;
            }
            count = count+ (Integer) input.getValueByField("trafficIntensity");
            countPerSensors.put(input.getString(0), count);

            collector.emit(new Values(input.getString(0), count));

            collector.ack(input);
        }

        @Override
        public void declareOutputFields(OutputFieldsDeclarer declarer) {
            declarer.declare(new Fields("sensorId", "count"));
        }
    }
```

### Windowing
Storm also knows about the concept of [windowing](https://storm.apache.org/releases/1.2.2/Windowing.html). 

``` java
    public class CountPerSensorIdBolt extends BaseWindowedBolt {
    
        private OutputCollector collector;

        private final HashMap<String, Integer> countPerSensors = new HashMap<>();

        @Override
        public void execute(TupleWindow tupleWindow) {

            for (Tuple input : tupleWindow.get()) {
                Integer count = countPerSensors.get((String)input.getValueByField("sensorId"));
                if (count == null) {
                    count = 0;
                }
                count = count+ (Integer) input.getValueByField("trafficIntensity");
                countPerSensors.put(input.getString(0), count);

                collector.emit(new Values(input.getString(0), count));

                collector.ack(input);
            }
        }
    }

```

Subsequently you can define this bolt within a topology, at which moment you will also define the size or duration of the window:

In this example we are just using windows with a fixed duration of five seconds.

``` java
    private StormTopology getTopologyKafkaSpout(KafkaSpoutConfig<String, String> spoutConfig) {
        final TopologyBuilder tp = new TopologyBuilder();
        tp.setSpout("kafka_spout", new KafkaSpout<>(spoutConfig), 1).setDebug(false);
        tp.setBolt("trafficEvent_Bolt", new TrafficEventBolt(sensorIdsToProcess)).setDebug(false)
                .globalGrouping("kafka_spout");
        tp.setBolt("updateTrafficEventStats_bolt", new TrafficCountBolt()).setDebug(true)
                .fieldsGrouping("trafficEvent_Bolt", new Fields("sensorId"));
        tp.setBolt("windowedProcessBolt", new CountPerSensorIdBolt().withWindow(BaseWindowedBolt.Duration.seconds(5)))
                .setDebug(true)
                .globalGrouping("trafficEvent_Bolt");
        return tp.createTopology();
    }
```

You can also pass in extra ab parameter slidingInterval to define a sliding window.

``` java
    withWindow(Duration windowLength, Duration slidingInterval)
```

Both the windowLength and the slidingInterval can also be represented by a Count, which is based on the tuples being processed.
Either determining the length of the window by the tuples, or when to slide.
``` java
    withWindow(Count windowLength, Duration slidingInterval)

    withWindow(Duration windowLength, Count slidingInterval)
```


Even tumbling windows are possible: 

``` java
    withTumblingWindow(BaseWindowedBolt.Count count)

    withTumblingWindow(BaseWindowedBolt.Duration duration)
```

Please note that a tuple belongs to only one of the tumbling windows, while with a sliding window it is very much possible that a single tuple is processed within multiple windows.

### Stream API
The [Storm Streams API](http://storm.apache.org/releases/2.0.0-SNAPSHOT/Stream-API.html#streambuilder) is pretty new.

It tends to provide a DSL which corresponds more with other streaming DSL's, making your data processing feel more natural and less clunky, as compare to be thinking in Spouts and Bolts.

In the background it will convert the DSL to Spouts and Bolts though, so knowing how Storm works internally is still pretty important.

### Takeaways Apache Storm

* It is pretty mature.
* Low latency / high throughput.
* It does tend to feel pretty clunky thinking in Spouts and Bolts - for a developper not that big of a hassle, but for a data scientist I can imagine that at times it will be harder to wrap your head around it.




