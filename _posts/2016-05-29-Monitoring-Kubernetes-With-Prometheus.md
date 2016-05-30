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

# The origin of Prometheus

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
SoundCloud's original monitoring set-up consisted of Graphite for gathering metrics,
and StatsD for aggregation.
This setup did not suffice the monitoring needs for the new microservices architecture.

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
The project has been [open-source](https://github.com/prometheus) from the beginning.

# Data Model

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
