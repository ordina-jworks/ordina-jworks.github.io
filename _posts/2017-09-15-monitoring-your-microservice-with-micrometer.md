---
layout: post
authors: [tim_ysewyn]
title: "Monitoring your microservices using Micrometer.io"
image: /img/2017-devoxx-pl/devoxx-poland.jpg
tags: [microservices, monitoring]
category: Microservices
comments: true
---
# Monitoring your microservices using Micrometer.io

When we want to instrument our application, we don't want to worry about which monitoring system we want to use now or in the future.
Nor do we want to change a lot of code throughout our microservice because we need to change from system X to system Y.

## Meet Micrometer!

So what is Micrometer you ask?

Basically, it comes down to this line:
> Think SLF4J, but for metrics.

[Micrometer](https://micrometer.io) provides a simple facade over the instrumentation clients for the most popular monitoring systems.
It allows you to instrument your code with dimensional metrics with a vendor-neutral interface and decide on the monitoring system as a last step.
Using this interface, we can support multiple monitoring systems and switch easily to an other system with little to no hassle.
It already contains built-in support for [**Prometheus**](https://prometheus.io), Netflix [**Atlas**](https://github.com/Netflix/atlas), and [**Datadog**](https://www.datadoghq.com), while [InfluxDB](https://www.influxdata.com), [statsd](https://github.com/etsy/statsd), and [Graphite](https://graphiteapp.org) are on their way!


## Using Micrometer in your application

Starting with Spring Boot 2, Micrometer becomes the defacto instrumentation library that will be powering the delivery of application metrics from Spring.
Luckily for us, they also backported this functionality to Spring Boot 1.x through an additional library dependency!
Just add the `micrometer-spring-legacy` module together with the additional monitoring system module, and you're good to go!

In Gradle:

``` gradle
compile 'io.micrometer:micrometer-spring-legacy:latest.release'
```

Or in Maven:

``` maven
<dependency>
  <groupId>io.micrometer</groupId>
  <artifactId>micrometer-spring-legacy</artifactId>
  <version>${micrometer.version}</version>
</dependency>
```

## Creating metrics

There are a couple of ways to create meters.
We will cover all different types, when to use them, and furthermore how to implement them.

### Dimensions/Tags

A meter is uniquely identified by its name and dimensions (also called tags).
Dimensions are a way of adding dimensions to metrics, so they can be sliced, diced, aggregated and compared.
For example, we have a meter named `http.requests` with a tag `uri`.
With this meter we could see the overall amount of HTTP request, but also have the option to drill down and see the amount of HTTP requests for a specific URI.

### Counters

Counters are a cumulative metric that represents a single numerical value that only ever goes up.
They are typically used to count requests served, tasks completed, errors occurred, etc.
Counters should not be used to expose current counts of items whose number can also go down, gauges are a better fit for this use case.

### Gauges

A gauge is a metric that represents a single numerical value that can arbitrarily go up and down.
Gauges are typically used for measured values like current memory usage, but also "counts" that can go up and down, like the number of messages in a queue.

### Timers

Timers measure both the rate that a particular piece of code is called and the distribution of its duration.
They do not record the duration until the task is complete.
These are useful for measuring short-duration latencies and the frequency of such events.

### Long task timers

The long task timer is a special type of timer that lets you measure time while an event being measured is **still running**.

### Distribution summaries

A distribution summary is used to track the distribution of events.
It is similar to a timer but more general in that the size does not have to be a period of time.

## Summary statistics

Micrometer provides quantile statistics computed at **instrumentation time** and histograms for use in calculating quantile statistics at **query time** for monitoring systems that support this.

### Quantiles

Quantiles are cutpoints dividing the range of a probability distribution into contiguous intervals with equal probabilities, or dividing the observations in a sample in the same way.
Timers and distribution summaries can be enriched with quantiles computed in your app prior to shipping to a monitoring backend.
Depending on the size of your deployments, computing quantiles at instrumentation time may or may not be useful.
It is **not possible** to aggregate quantiles across a cluster.

Four quantile algorithms are provided out of the box with different tradeoffs:

- `WindowSketchQuantiles` - The importance of an observation is decayed as it ages. This is the most computationally costly algorithm.
- `Frugal2UQuantiles` - Successive approximation algorithm that converges towards the true quantile with enough observations. This is by least costly algorithm, but exhibits a higher error ratio in early observations.
- `CKMSQuantiles` - Lets you trade computational complexity for error ratio on a per-quantile basis. Often, it is desirable for higher quantiles to have a lower error ratio (e.g. 0.99 at 1% error vs. 0.5 at 5% error). This algorithm is still more computationally expensive than Frugal.
- `GKQuantiles` - Lets you trade computational complexity for error ratio across all quantiles. This is used inside of WindowSketchQuantiles.

### Histograms

A histogram measures the statistical distribution of values in a stream of data.
It samples observations, like HTTP request durations or database transaction durations, and counts them in buckets.
They can be used to compute quantiles or other summary statistics like min, max, average or median.
Because histograms buckets are exposed as individual counters to the monitoring backend, it is possible to aggregate observations across a distributed system and compute summary statistics like quantiles for an entire cluster.
Naturally, the error rate of the computed summary statistic will be higher because of the lossy nature of putting data in buckets.