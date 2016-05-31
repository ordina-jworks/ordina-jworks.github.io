---
layout: post
authors: [tom_verelst]
title: 'Monitoring with Prometheus'
image: /img/prometheus.jpg
tags: [Prometheus]
category: Monitoring
comments: true
---
# Overview

* [Introduction](#intro)
* [The Rise of Prometheus](#rise-of-prometheus)
* [Architecture](#architecture)

<a name="intro" />

# Prometheus

Prometheus works as a monitoring-and-alerting system.

TODO

<a name="rise-of-prometheus" />

# The Rise of Prometheus

As with most great technologies,
there is usually a great story hiding behind them.
Nothing is different with Prometheus.
Incubated at [SoundCloud](https://soundcloud.com/),
_the_ social platform for sharing sounds and music,
Prometheus has come a long way.

When SoundCloud was just a start-up,
they originally developed their application as a single application.
Many features later,
this resulted in one big, monolithic application called _the Mothership_.
With only a few thousand artists and users sharing music,
the application performed sufficiently.

However,
nowadays,
about 12 hours of music is uploaded _every minute_ to SoundCloud.
The platform is used by hundreds of millions of users every day.
To be able to handle this size of volume,
SoundCloud adapted a more scalable approach.
Deciding against a complete rewrite of their whole technology stack,
they stopped adding new features to the Mothership.
Instead, new features were written as microservices,
living next to the Mothership.

_If you want to know more about how SoundCloud moved from one monolithic application to a microservices architecture,
you can find a [three-part](https://developers.soundcloud.com/blog/building-products-at-soundcloud-part-1-dealing-with-the-monolith)
[blog post](https://developers.soundcloud.com/blog/building-products-at-soundcloud-part-2-breaking-the-monolith)
[series](https://developers.soundcloud.com/blog/building-products-at-soundcloud-part-3-microservices-in-scala-and-finagle)
 on their developer blog (which is an excellent read, by the way)._

Moving towards a microservices architecture paved the way for many possibilities for SoundCloud,
but it also introduced a lot of complexity.
Monitoring a single application is easy.
Monitoring hundreds of different services with thousands of instances is an entirely different story.
SoundCloud's original monitoring set-up consisted of Graphite and StatsD.
This setup did not suffice for the new, scalable microservices architecture.
The amount of generated events could not be handled in a reliable way.

SoundCloud started looking for a new monitoring tool,
while keeping the following requirements in mind:

* A **multi-dimensional data model**,
where data can be sliced and diced along multiple dimensions like host, service, endpoint and method.

* **Operational simplicity**,
so that you can setup monitoring anywhere you want,
whenever you want,
without having to have a Ph.D. in configuration management.

* **Scalable and decentralized**,
for independent and reliable monitoring.

* A **powerful query language** that utilizes the data model for meaningful alerting and visualisation.

Since no existing system combined all of these features,
Prometheus was born from a pet project at SoundCloud.

Although the project has been [open source](https://github.com/prometheus) from the beginning,
SoundCloud did not make any noise about it until the project was mature enough.
In January 2015,
after 2 years of development and internal usage,
the project was [publicly announced](https://developers.soundcloud.com/blog/prometheus-monitoring-at-soundcloud)
and a [website](https://prometheus.io) was put online.
The amount of attention it received was totally unexpected for the team at SoundCloud.
After a [post on Hacker News](https://news.ycombinator.com/item?id=8995696),
which made it all the way to the top,
things got serious.
There was a sharp rise in contributions, questions, GitHub issues, conference invites, and all that stuff.

The following image depicts the amount of stars the project received on GitHub since its inception.

<p style="text-align: center;">
  <img style="max-width: 640px;" alt="Prometheus Github Stars" src="/img/prometheus/prometheus-github-stars.png">
</p>

<a name="architecture" />

# Architecture

Prometheus' architecture is pretty straightforward.

Prometheus servers scrape (pull) metrics from _instrumented jobs_.
If a service is unable to be instrumented,
the server can scrape metrics from an intermediary _push gateway_.
There is no distributed storage.
Prometheus servers store all metrics locally.
They can run rules over this data and generate new time series,
or trigger alerts. Servers also provide an API to query the data.
PromDash utilizes this functionality and can be used to build dashboards.

Finally,
Prometheus servers know which targets to scrape from due to service discovery,
or static configuration.

<p style="text-align: center;">
  <img alt="Prometheus Architecture" src="/img/prometheus/prometheus-architecture.svg">
</p>

# Data Model

At its core,
Prometheus stores all data as **time series**.
A time series is a stream of timestamped values that belong to the same metric and the same labels.
The labels cause the metrics to be multi-dimensional.

For example,
if we wish to monitor the total amount of HTTP requests on our API,
we could create a metric named **api_http_requests_total**.
Now,
to make this metric multi-dimensional,
we can add labels.
Labels are simple key value pairs.
For HTTP requests,
we can attach a label named **method** that takes the HTTP method as value.
Other possible labels include the endpoint that is called on our API,
and the HTTP status returned by the server for that request.

The notation for a metric like that could be the following:

```
api_http_requests_total{method="GET", endpoint="/api/posts", status="200"}
```

Now,
if we start sampling values for this metric,
we could end up with the following time series:

```
Metric Name             Labels                                                Timestamp       Value
api_http_requests_total{method="GET", endpoint="/api/posts", status="200"}    @1464623917237  68856
api_http_requests_total{method="GET", endpoint="/api/posts", status="500"}    @1464623917237  5567
api_http_requests_total{method="GET", endpoint="/api/posts", status="200"}    @1464624516508  76909
api_http_requests_total{method="GET", endpoint="/api/posts", status="500"}    @1464624516508  6789
```

One of the great aspects of time series
is the fact that the amount of generated time series is independent of the amount of events.
Even though your server might suddenly get a spike in traffic,
the amount of time series generated stays the same.
Only the outputted value of the time series will be higher.
This is wonderful for scalability.

Prometheus only has four metric types.

A **counter** is a metric which is a numerical value that is only incremented,
never decremented.
Examples include the total amount of requests served,
how many exceptions that occur, etc.

A **gauge** is a metric similar to the counter. It is a numerical value that can go either up or down.
Think of memory usage, cpu usage, amount of threads, or perhaps a temperature.

A **[histogram](https://www.google.com/search?q=histogram)** is a metric that samples observations.
These observations are counted and placed into configurable buckets.
Upon being scraped,
a _histogram_ provides multiple time series,
including one for each bucket,
one for the sum of all values,
and one for the count of the events that have been observed.
A typical use case for a histogram is the measuring of response times.

A **summary** is very similar to a _histogram_,
but it also calculates configurable [quantiles](https://en.wikipedia.org/wiki/Quantile).
Depending on your requirements,
you either use a [histogram or a summary](https://prometheus.io/docs/practices/histograms/).

# Slice & Dice with the Query Language

A powerful data model needs a powerful query language.
Prometheus offers one,
and it is also one of Prometheus' key features.
The Prometheus query language,
or _promql_,
is an expressive, functional language.
One which apparently,
by the way,
is [Turing complete](http://www.robustperception.io/conways-life-in-prometheus/).

The language is easy to use.
Monitoring things like CPU usage,
memory usage, amount of HTTP request served, etc. are pretty straightforward,
and the language makes it effortless.
Using an **instant vector selector**,
you can select time series from a metric.

For example,
Continuing with our API example,
we can select all the time series of the metric `api_http_requests_total`:

```
api_http_requests_total
```

We can dive a little bit deeper by filtering these time series on their labels using curly braces (`{}`).
Let's say we want to monitor requests that failed due to an internal server error.
We can achieve that by selecting the time series of the metric `api_http_requests_total`
where the label `status` is set to `500`.

```
api_http_requests_total{status=500}
```  

We can also define a time window if we only want to have time series of a certain period.
This is done by using a **range vector selector**.
The following example selects time series of the last hour:

```
api_http_requests_total[1h]
```  

The time duration is specified as a number followed by a character depicting the time unit:

* **s** - seconds
* **m** - minutes
* **h** - hours
* **d** - days
* **w** - weeks
* **y** - years

You can go further back in time by using an `offset`.
This example selects time series that happened at least an hour ago:

```
api_http_requests_total offset 1h
```  

We can use functions in our queries to create more useful results.
The `rate()` function calculates the per-second average rate of time series in a range vector.
Combining all the above tools,
we can get the rates of HTTP requests of a very specific timeframe.
The query below will calculate the per-second rates of all HTTP requests
that occurred in the last 5 minutes an hour ago:

```
rate(api_http_requests_total{status=500}[5m] offset 1h)
```

A slightly more complex example selects the top 3 endpoints which have the most HTTP requests
not being served correctly in the last hour:

```
topk(
  3, sum(
    rate(api_http_requests_total{status=500}[1h])
  } by (endpoint)
)
```

As you can see,
Prometheus can provide a lot of useful information with several simple queries that only have a few basic functions and operators.
There is also support for sorting, aggregation, interpolation and other mathematical wizardry that you can find in other query languages.

# Instrumentation

# Exporters

# Targets

# Dashboards

# Histograms

# Alerting

# Rules

# Example application

# Prometheus joins CNCF

Just a few weeks ago,
the Prometheus team [announced](https://prometheus.io/blog/2016/05/09/prometheus-to-join-the-cloud-native-computing-foundation/)
that they were joining the Cloud Native Computing Foundation.

> Today, we are excited to announce that the CNCF's Technical Oversight Committee voted unanimously to accept Prometheus as a second hosted project after Kubernetes!
> You can find more information about these plans in the [official press release](https://cncf.io/news/announcement/2016/05/cloud-native-computing-foundation-accepts-prometheus-second-hosted-project) by the CNCF.
>
> By joining the CNCF, we hope to establish a clear and sustainable project governance model, as well as benefit from the resources, infrastructure, and advice that the independent foundation provides to its members.

# About Cloud Native Computing Foundation

_Cloud Native Computing Foundation_ ([CNCF](http://cncf.io/)) is a nonprofit, open standardization organisation which commits itself to advance the development of cloud native technologies,
formed under the Linux Foundation.
It is a shared effort by the industry to create innovation for container packaged, microservices based, dynamically scheduled applications and operations.

Founders include big names like Google, RedHat, Twitter, IBM and Cisco.
Among the founders, originating from the container world, also include Docker, Mesosphere and CoreOS.

# Conclusion
