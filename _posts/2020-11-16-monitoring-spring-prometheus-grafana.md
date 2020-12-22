---
layout: post
authors: [kevin_govaerts]
title: 'Monitoring Spring Boot with Prometheus and Grafana'
image: /img/2020-11-16-monitoring-spring-prometheus-grafana/thumbnail.jpg
tags: [Spring, Prometheus, Grafana, Docker]
category: Monitoring
comments: true
---

# Table of contents
{:.no_toc}

- TOC
{:toc}

----

# Introduction

In a distributed landscape where we are working with microservices, serverless applications, or just event-driven architecture as a whole, observability, which comprises monitoring, logging, tracing, and alerting, is an important architectural concern.  

There are a few reasons why we want visibility in our highly distributed systems:  
- Issues will occur, even when our best employees have built it.
- Distributed systems generate distributed failures, which can be devastating when we are not prepared in advance.
- Reveal mistakes early, which is great for improvement and learning.
- It keeps us accountable.
- Reduce the mean time to resolution (MTTR).

In this blogpost I will explain the core concepts of Prometheus and Grafana.  
In the last section I set up a demo project, so you can follow along and implement monitoring in your own applications. 

# Prometheus

## What is Prometheus? 

Prometheus, originally developed by SoundCloud is an open source and community-driven project that graduated from the Cloud Native Computing Foundation.
It can aggregate data from almost everything:
- Microservices
- Multiple languages
- Linux servers
- Windows servers

## Why do we need Prometheus?

In our modern times of microservices, DevOps is becoming more and more complex and therefore needs automation.  
We have hundreds of processes running over multiple servers, and they are all interconnected.  

If we would not monitor these services then we have no clue about what is happening on hardware level or application level.  
There are many things which we want to be notified about, like:  
- Errors
- Response latency
- System overload
- Resources

When we are working with so many moving pieces, we want to be able to quickly identify a problem when something goes wrong inside one of our services.  
If we wouldn't monitor, it could be very time-consuming, since we have no idea where to look.  

### An example of a failing service
{:.no_toc}

Imagine that one server ran out of memory and therefore knocked off a running service container, which syncs two databases.  
One of those databases gets used by the authentication service, which now also stops working, because the database is unavailable.  

<div style="text-align: center;">
  <img alt="prometheus server" src="/img/2020-11-16-monitoring-spring-prometheus-grafana/failing-servers.jpg" width="auto" height="auto" target="_blank" class="image">
</div> 

How do you know what went wrong, when your application that depends on the authentication service, now can't authenticate users anymore?  
The only thing we would see is an error message: `ERROR: Authentication failed`.  
We would need to work backwards over every service, all the way back to the stopped container, to find out what is causing the problem.

A better way would be to have a tool which:
- Constantly monitors all services
- Alerts system admins when something crashes
- Identifies problems before they occur

Prometheus is exactly that tool, it can identify memory usage, CPU usage, available disk space, etc.  
We can predefine certain thresholds about which we want to get notified.  

In our example it could have been that the memory of our failing server would have reached 70% memory usage for more than one hour, and could've sent an alert to our admins before the crash happened.  

## How it works

### Prometheus server

The server does the actual monitoring work, and it consists of three main parts:  
- Storage, which is a time series database.
- Data retrieval worker, which is pulling the data from our target services.
- Webserver, which accepts [PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/){:target="_blank" rel="noopener noreferrer"} queries to get data from our DB.

<div style="text-align: center;">
  <img alt="prometheus server" src="/img/2020-11-16-monitoring-spring-prometheus-grafana/prom-server.jpg" style="max-width: 100%; height:auto" target="_blank" class="image">
</div> 

Even though Prometheus has its own UI to show graphs and metrics, we will be using Grafana as an extra layer on top of this webserver, to query and visualize our database.  

### Prometheus targets

#### What does it monitor? 
{:.no_toc}

Prometheus monitors nearly anything. It could be a Linux/windows server, Apache server, single applications, services, etc.  
It monitors **units** on those targets like:
- CPU usage
- Memory/ Disk usage
- Request count
- Request durations
- Exceptions count

The units that we monitor are called metrics, which get saved into the Prometheus time-series database.  
Prometheus' metrics are formatted like a human-readable text file.

<div style="text-align: center;">
  <img alt="Prometheus endpoint actuator" src="/img/2020-11-16-monitoring-spring-prometheus-grafana/prometheus-endpoint.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div> 

In this file we can see that there is a "HELP" comment which describes what the metric is, and we have a "TYPE" which can be one of four metric-types: 
- Counter: how many times X happened (exceptions)
- Gauge: what is the current value of X now ? (disk usage, cpu etc)
- Histogram: how long or how big?
- Summary: similar to histogram it monitors request durations and response sizes


#### Collecting metrics from targets
{:.no_toc}

There are basically two ways of ingesting metrics into a monitoring system.   
We can either push the data from our clients to our monitoring system, or we pull the data from the monitoring system.

Prometheus is a service which polls a set of configured targets to intermittently fetch their metric values.  
In Prometheus terminology, this polling is called scraping.  

There is no clear-cut answer about which one is the best, they both have their pros and cons, but some big disadvantages for pushing data are:
- possibility of flooding the network.
- risk of package loss.

<div style="text-align: center;">
  <img alt="pull data image" src="/img/2020-11-16-monitoring-spring-prometheus-grafana/pull-data.jpg" style="max-width: 100%; height:auto" target="_blank" class="image">
</div> 

The data which gets exposed on the endpoint needs to be in the correct format, one which Prometheus can understand.  

As stated before, Prometheus can monitor a lot of different things, servers, services, databases, etc.  
Some servers even have a metrics endpoint enabled by default, so for those we don't have to change anything.  
For the ones who don't have an endpoint enabled by default, we need an exporter.  

#### Exporters
{:.no_toc}

There are a number of libraries and servers which help in exporting existing metrics from third-party systems as Prometheus metrics.
You can have a look at the [exporters and integration tools](https://prometheus.io/docs/instrumenting/exporters/){:target="_blank" rel="noopener noreferrer"} here.  

On a side note, these tools are also available as Docker images, so we can use them inside Kubernetes clusters.  
We can run an exporter docker image for a MySQL database as a side container inside the MySQL pod, connect to it and start translating data, to expose it on the metrics endpoint.  

#### Monitoring our own application
{:.no_toc}

If we want to add our own instrumentation to our code, to know how many server resources our own application is using, how many requests it is handling or how many exceptions occurred, then we need to use one of the [client libraries](https://prometheus.io/docs/instrumenting/clientlibs/){:target="_blank" rel="noopener noreferrer"}.
These libraries will enable us to declare all the metrics we deem important in our application, and expose them on the metrics endpoint.

### Micrometer

To monitor our Spring Boot application we will be using an exporter named Micrometer.  
Micrometer is an open-source project and provides a metric facade that exposes metric data in a vendor-neutral format which Prometheus can ingest.  

> Micrometer provides a simple facade over the instrumentation clients for the most popular monitoring systems, allowing you to instrument your JVM-based application code without vendor lock-in. Think SLF4J, but for metrics.  

Micrometer is not part of the Spring ecosystem and needs to be added as a dependency. In our demo application we will add this to our `pom.xml` file.
For a deeper understanding, check out our [blog post](https://ordina-jworks.github.io/microservices/2017/09/17/monitoring-your-microservices-with-micrometer.html){:target="_blank" rel="noopener noreferrer"} about Micrometer.

## Configuring Prometheus

To instruct Prometheus on what it needs to scrape, we create a **prometheus.yml** configuration file.  

<div style="text-align: center;">
  <img alt="Prometheus configuration file" src="/img/2020-11-16-monitoring-spring-prometheus-grafana/promyml.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div> 

In this configuration file we declare a few things:  
1. global configs, like how often it will scrape its targets.
2. we can declare [rule files](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/){:target="_blank" rel="noopener noreferrer"}, so when we meet a certain condition, we get an alert.
3. which services it needs to monitor.

In this example you can see that Prometheus will monitor two things: 
- Our Spring Boot application
- Its own health

Prometheus expects the data of our targets to be exposed on the `/metrics` endpoint, unless otherwise declared in the `metrics_path` field.  

### Alerts
{:.no_toc}

With Prometheus, we have the possibility to get notified when metrics have reached a certain point, which we can declare in the `.rules` files. 
Prometheus has a component which is called the "Alertmanager", and it can send notifications over various channels like emails, Slack, PagerDuty, etc.  

### Querying our data
{:.no_toc}

Since Prometheus saves all our data in a time series database, which is located on disk in a custom timeseries format, we need to use PromQL query language, if we want to query this database.  

We can do this via the Prometheus WebUI, or we can use some more powerful visualization tools like Grafana.

# Grafana

## What is Grafana

Grafana is an open-source metric analytics & visualization application.  
- It is used for visualizing time series data for infrastructure and application analytics.  
- It is also a web application which can be deployed anywhere users want. 
- It can target a data source from Prometheus and use its customizable panels to give users powerful visualization of the data from any infrastructure under management.

## Why Grafana

One of the significant advantages of Grafana are its customization possibilities.  
It’s effortless to customize the visualization for vast amounts of data.  
We can choose a linear graph, a single number panel, a gauge, a table, or a heatmap to display our data.  
We can also sort all our data with various labels so data with different labels will go to different panels.  

Last but not least, there are a ton of [premade dashboard-templates](https://grafana.com/grafana/dashboards){:target="_blank" rel="noopener noreferrer"} ready to be imported, so we don't have to create everything manually.    

# Demo project 

## Setup Spring Boot

To demonstrate how to implement Prometheus and Grafana in your own projects, I will go through the steps to set up a basic Spring Boot application which we monitor by using Docker images of Prometheus and Grafana. 

1. Set up a regular Spring Boot application by using [Spring Initializr](https://start.spring.io/){:target="_blank" rel="noopener noreferrer"}.

2. Add dependency for Actuator
```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
```

3. Add dependency for Micrometer  
```xml
        <dependency>
            <groupId>io.micrometer</groupId>
            <artifactId>micrometer-registry-prometheus</artifactId>
            <version>1.5.5</version>
        </dependency>
```

4. Expose our needed Prometheus endpoint in the application.properties file  
```
management.endpoints.web.exposure.include=prometheus
management.endpoint.health.show-details=always
management.metrics.tags.application= MonitoringSpringDemoProject
```

5. After this we can run the application and browse to `localhost:8080/actuator`, where we can see all the available endpoints. The one we need and will use to monitor this application, is `localhost:8080/actuator/prometheus`.

<div style="text-align: center;">
  <img alt="Prometheus endpoint actuator" src="/img/2020-11-16-monitoring-spring-prometheus-grafana/prometheus-endpoint.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div> 

### Adding our own custom metrics

We can also define some custom metrics, which I will briefly demonstrate in this section.  

To be able to monitor custom metrics we need to import `MeterRegistry` from the Micrometer library and inject it into our class. 
This gives us the possibility to use [counters](https://github.com/micrometer-metrics/micrometer/blob/master/micrometer-core/src/main/java/io/micrometer/core/instrument/Counter.java#L25){:target="_blank" rel="noopener noreferrer"}, [gauges](https://github.com/micrometer-metrics/micrometer/blob/master/micrometer-core/src/main/java/io/micrometer/core/instrument/Gauge.java#L23){:target="_blank" rel="noopener noreferrer"}, [timers](https://github.com/micrometer-metrics/micrometer/blob/master/micrometer-core/src/main/java/io/micrometer/core/instrument/Timer.java#L34){:target="_blank" rel="noopener noreferrer"} and more.

To demonstrate how we can use this, I added two classes in our basic Spring application.  
DemoMetrics has a custom Counter and Gauge, which will get updated every second through our DemoMetricsScheduler class.  
The counter gets incremented by one, and the gauge will get a random number between 1 and 100.

##### DemoMetrics class

``` java
@Component
public class DemoMetrics {
    private final Counter demoCounter;
    private final AtomicInteger demoGauge;

    public DemoMetrics(MeterRegistry meterRegistry) {
        this.demoCounter = meterRegistry.counter("demo_counter");
        this.demoGauge = meterRegistry.gauge("demo_gauge", new AtomicInteger(0));
    }

    public void getRandomMetricsData() {
        demoGauge.set(getRandomNumberInRange(0, 100));
        demoCounter.increment();
    }

    private static int getRandomNumberInRange(int min, int max) {
        if (min >= max) {
            throw new IllegalArgumentException("max must be greater than min");
        }

        Random r = new Random();
        return r.nextInt((max - min) + 1) + min;
    }
}
```

##### DemoMetricsScheduler class

``` java
@Component
public class DemoMetricsScheduler {

    private final DemoMetrics demoMetrics;

    public DemoMetricsScheduler(DemoMetrics demoMetrics) {
        this.demoMetrics = demoMetrics;
    }

    @Scheduled(fixedRate = 1000)
    public void triggerCustomMetrics() {
        demoMetrics.getRandomMetricsData();
    }
}
```

Now we are able to see our custom metrics on the `/actuator/prometheus` endpoint, as you can see below.  

<div style="text-align: center;">
  <img alt="Prometheus custom metrics text" src="/img/2020-11-16-monitoring-spring-prometheus-grafana/custom_metrics.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div> 

## Setup Prometheus

The easiest way to run Prometheus is via a Docker image which we can get by running: 
```
docker pull prom/prometheus
```

After we download the image, we need to configure our `prometheus.yml` file. 
Since I want to demonstrate how to monitor a Spring Boot application, as well as Prometheus itself, it should look like this: 

```yaml
global:
    scrape_interval:     15s

scrape_configs:
- job_name: 'prometheus'
  scrape_interval: 5s

  static_configs:
    - targets: ['localhost:9090']

- job_name: 'spring-actuator'
  metrics_path: '/actuator/prometheus'
  scrape_interval: 5s
  static_configs:
    - targets: ['192.168.0.9:8080']
```
We define two targets which it needs to monitor, our Spring application and Prometheus.  
Since we run Prometheus from inside Docker we need to enter the host-ip which is in my case `192.168.0.9`.

Afterwards we can run the Prometheus image by running the following command: 

```
docker run -d -p 9090:9090 -v <PATH_TO_prometheus.yml_FILE>:/etc/prometheus/prometheus.yml prom/prometheus 
```
We mount the `prometheus.yml` config file into the Prometheus image and expose port 9090, to the outside of Docker.

When this is up and running we can access the Prometheus webUI on `localhost:9090`.  

<div style="text-align: center;">
  <img alt="Prometheus UI" src="/img/2020-11-16-monitoring-spring-prometheus-grafana/prometheusUI.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div> 

When we navigate to Status > Targets, we can check if our connections are up and are correctly configured.

<div style="text-align: center;">
  <img alt="Prometheus target tab" src="/img/2020-11-16-monitoring-spring-prometheus-grafana/prometheus-target.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div> 

Yet again, we can check our custom metrics in the Prometheus UI, by selecting the `demo_gauge` and inspecting our graph.

<div style="text-align: center;">
  <img alt="Prometheus custom metrics graph" src="/img/2020-11-16-monitoring-spring-prometheus-grafana/custom-graph.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div> 

## Setup Grafana

To run Grafana we will use the same approach as with Prometheus. 

We download and run the image from Docker Hub.  
```
docker run -d -p 3000:3000 grafana/grafana
```

Now we can access the Grafana UI from `localhost:3000`, where you can enter "admin" as login and password.  
<div style="text-align: center;">
  <img alt="Grafana UI" src="/img/2020-11-16-monitoring-spring-prometheus-grafana/grafana-ui.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div> 

After we arrive at the landing page, we need to set up a data source for Grafana.  
Navigate to Configuration > Data Sources, add a Prometheus data source and configure it like the example below.  

<div style="text-align: center;">
  <img alt="Grafana data source" src="/img/2020-11-16-monitoring-spring-prometheus-grafana/grafana-datasource.PNG" width="auto" height="auto" target="_blank" class="image fit">
</div>  

For this example I used one of the premade dashboards which you can find on the [Grafana Dashboards](https://grafana.com/grafana/dashboards){:target="_blank" rel="noopener noreferrer"} page.  
The dashboard I used to monitor our application is the JVM Micrometer dashboard with import id: 4701.  

<div style="text-align: center;">
  <img alt="Grafana data source" src="/img/2020-11-16-monitoring-spring-prometheus-grafana/grafana-import.PNG" width="650" height="auto" target="_blank" class="image fit">
</div> 

Give your dashboard a custom name and select the prometheus data source we configured in step 3.  
Now we have a fully pre-configured dashboard, with some important metrics showcased, out of the box.  

<div style="text-align: center;">
  <img alt="Grafana dashboard" src="/img/2020-11-16-monitoring-spring-prometheus-grafana/graf-done.png" width="650" height="auto" target="_blank" class="image fit">
</div> 

### Adding a custom metric panel

To demonstrate how we can create a panel for one of our own custom metrics, I will list the required steps below. 

First we need to add a panel by clicking on "add panel" on the top of the page, and yet again on "add new panel" in the center.

 <div style="text-align: center;">
   <img alt="Grafana add extra panel" src="/img/2020-11-16-monitoring-spring-prometheus-grafana/graf-add-panel.PNG" width="auto" height="auto" target="_blank" class="image fit">
 </div> 
 
Then we need to configure our panel, which we do by selecting `demo_gauge` in the metrics field.  
To display our graph in a prettier way, we can choose the "stat" type under the visualization tab.

 <div style="text-align: center;">
   <img alt="Grafana add extra panel" src="/img/2020-11-16-monitoring-spring-prometheus-grafana/graf-custom-panel-gauge.PNG" width="auto" height="auto" target="_blank" class="image fit">
 </div> 
 
When we click on `Apply` in the top right corner, our new panel gets added to the dashboard.  
 
Afterwards, we can do the same thing for our `demo_counter` metric. 

 <div style="text-align: center;">
   <img alt="Grafana add another extra panel" src="/img/2020-11-16-monitoring-spring-prometheus-grafana/graf-custom-panel-counter.PNG" width="auto" height="auto" target="_blank" class="image fit">
 </div> 

After going through all of these steps, we now have an operational dashboard which monitors our Spring Boot application, with our own custom metrics.  

<div style="text-align: center;">
  <img alt="Grafana data source" src="/img/2020-11-16-monitoring-spring-prometheus-grafana/graf-dash.png" width="auto" height="auto" target="_blank" class="image fit">
</div> 
 
# Conclusion

After reading this blogpost I hope you can see that using Prometheus as a data aggregator in a distributed system is not really all that hard.  
It has a lot of client libraries which integrate seamlessly with our infrastructure, services and applications.  

Using Grafana on top of his to visualize our data, feels like a breeze when we use pre-existing dashboards to quickly get things up and running.  
