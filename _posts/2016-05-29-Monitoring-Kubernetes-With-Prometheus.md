---
layout: post
authors: [tom_verelst]
title: 'Monitoring with Prometheus'
image: /img/prometheus.jpg
tags: [Prometheus]
category: Monitoring
comments: true
---

# Prometheus

Prometheus works as a monitoring-and-alerting system.

TODO

# The rise of Prometheus

As with most great technologies,
there is always a great story hiding behind these gems.
Technology is created to provide an answer to a certain question.
Nothing is different with Prometheus.
Incubated at [SoundCloud](https://soundcloud.com/),
which is _the_ social platform for sharing sounds and music,
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
To be able to handle this amount of volume,
SoundCloud moved to a more scalable approach.
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
SoundCloud's original monitoring set-up consisted of Graphite and StatsD,
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
SoundCloud did not make any noise until the project was mature enough.
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

# Overview

Let's take a look at Prometheus' architecture.
It is pretty straightforward.

The Prometheus server scrapes (pulls) metrics from _instrumented services_.
If a service is unable to be instrumented, ...

<p style="text-align: center;">
  <img alt="Prometheus Architecture" src="/img/prometheus/prometheus-architecture.svg">
</p>

Prometheus's main features are:

* A multi-dimensional data model.
* A flexible query language to leverage this dimensionality.
* No reliance on distributed storage; single server nodes are autonomous.
* Time series collection happens via a pull model over HTTP.
* Pushing time series is supported via an intermediary gateway.
* Targets are discovered via service discovery or static configuration.
* Multiple modes of graphing and dashboarding support.

TODO

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

The notation for a time series like that could be the following:

```
api_http_requests_total{method="GET", endpoint="/api/posts", status="200"}
```

Now,
if we start sampling values for this metric,
we would end up with the following time series:

|Metric name    | Labels    | Timestamp    | Values |
|-----------------------|---------------------------------------------------|---------------|--------|
| api_http_requests_total | {method="GET", endpoint="/api/posts", status="200"} | @1464623917237 | 1234124 |
| api_http_requests_total | {method="GET", endpoint="/api/posts", status="500"} | @1464623917237 | 1234 |
| api_http_requests_total | {method="POST", endpoint="/api/posts", status="201"} | @146462479219 | 5 |
| api_http_requests_total | {method="POST", endpoint="/api/posts", status="500"} | @146462479219 | 1 |


# Time Series

# Metrics

# Query Language

# Instrumentation

# Exporters

# Dashboards

# Histograms

# Alerting

# Rules

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

Founders include big names like Google, Redhat, Twitter, IBM and Cisco.
Among the founders, originating from the container world, also include Docker, Mesosphere and CoreOS.

# Conlusion
