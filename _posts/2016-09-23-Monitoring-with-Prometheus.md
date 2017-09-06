---
layout: post
authors: [tom_verelst]
title: 'Monitoring with Prometheus'
image: /img/prometheus.jpg
tags: [Prometheus]
category: Monitoring
comments: true
---

It is needless to say the world is shifting towards DevOps and microservices.
This holy grail we aim for adds a great deal of complexity.
Monitoring included.
Rather than having to monitor one system,
we are suddenly faced with the challenge to oversee our manifold services.
There are numerous monitoring systems available,
but not all of them are fit for monitoring large, distributed systems.

Black box monitoring systems like [Nagios](https://www.nagios.org) allow you to check if an application is alive and healthy.
This is done by e.g. pinging the service,
checking if there is enough disk space,
or monitoring the CPU usage.
In a world of distributed architectures where high availability and fast response times are key,
it is not sufficient to be only aware if a service is alive.
It is crucial to know how a service is working internally as well.
How many HTTP requests is it receiving?
Are they handled correctly?
How fast are requests handled for different endpoints?
Are there many errors being logged?
How many disk IO operations is the service performing?
These are all important questions that need to be monitored to keep a service functional.

Prometheus is a **white box monitoring and alerting** system that is designed for large, scalable environments.
With Prometheus,
we can answer all these questions,
by exposing the internal state of your applications.
By monitoring this internal state,
we can throw alerts and act upon certain events.
For example,
if the average request rate per second of a service goes up,
or the [fifty percent quantile](https://en.wikipedia.org/wiki/Quantile) response time of a service suddenly passes a certain threshold,
we could act upon this by upscaling the service.

# Overview

* [The Rise of Prometheus](#rise-of-prometheus)
* [Architecture](#architecture)
* [Data Model](#data-model)
* [Slice &amp; Dice with the Query Language](#slice-dice-with-the-query-language)
* [Instrumenting Your Services](#instrumenting-your-services)
* [Exporters](#exporters)
* [Scraping the Targets](#scraping-the-targets)
* [Visualization and Analytics](#visualization-and-analytics)
* [Alert! Alert!](#alert-alert)
* [Monitoring Time!](#monitoring-time)
* [Final Words](#final-words)

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
SoundCloud's original monitoring set-up consisted of [Graphite](https://graphiteapp.org/) and [StatsD](https://github.com/etsy/statsd).
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

<img class="image fit" alt="Prometheus Github Stars" src="/img/prometheus/prometheus-github-stars.png">

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
Grafana utilizes this functionality and can be used to build dashboards.

Finally,
Prometheus servers know which targets to scrape from due to service discovery,
or static configuration.
Service discovery is more common and also recommended,
as it allows you to dynamically discover targets.

<img class="image fit" alt="Prometheus Architecture" src="/img/prometheus/prometheus-architecture.svg">


<a name="architecture" />

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

```javascript
api_http_requests_total{method="GET", endpoint="/api/posts", status="200"}
```

Now,
if we start sampling values for this metric,
we could end up with the following time series:


| Metrics                                                                    | Timestamp      | Value  |
| ---------------------------------------------------------------------------|----------------|--------|
| `api_http_requests_total{method="GET", endpoint="/api/posts", status="200"}` | `@1464623917237` |  `68856` |
| `api_http_requests_total{method="GET", endpoint="/api/posts", status="500"}` | `@1464623917237` |  `5567`  |
| `api_http_requests_total{method="GET", endpoint="/api/posts", status="200"}` | `@1464624516508` |  `76909` |
| `api_http_requests_total{method="GET", endpoint="/api/posts", status="500"}` | `@1464624516508` |  `6789`  |

<br />

One of the great aspects of time series
is the fact that the amount of generated time series is independent of the amount of events.
Even though your server might suddenly get a spike in traffic,
the amount of time series generated stays the same.
Only the outputted value of the time series is different.
This is wonderful for scalability.

Prometheus offers four metric types which can be used to generate one or multiple time series.

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

A **summary** is similar to a _histogram_,
but it also calculates configurable [quantiles](https://en.wikipedia.org/wiki/Quantile).
Depending on your requirements,
you either use a [histogram or a summary](https://prometheus.io/docs/practices/histograms/).

<a name="slice-dice-with-the-query-language" />

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

```javascript
api_http_requests_total
```

We can dive a little bit deeper by filtering these time series on their labels using curly braces (`{}`).
Let's say we want to monitor requests that failed due to an internal server error.
We can achieve this by selecting the time series of the metric `api_http_requests_total`
where the label `status` is set to `500`.

```javascript
api_http_requests_total{status="500"}
```  

We can also define a time window if we only want to have time series of a certain period.
This is done by using a **range vector selector**.
The following example selects time series of the last hour:

```javascript
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

```javascript
api_http_requests_total offset 1h
```  

We can use functions in our queries to create more useful results.
The `rate()` function calculates the per-second average rate of time series in a range vector.
Combining all the above tools,
we can get the rates of HTTP requests of a specific timeframe.
The query below will calculate the per-second rates of all HTTP requests
that occurred in the last 5 minutes an hour ago:

```javascript
rate(api_http_requests_total{status=500}[5m] offset 1h)
```

A slightly more complex example selects the top 3 endpoints which have the most HTTP requests
not being served correctly in the last hour:

```javascript
topk(
  3, sum(
    rate(api_http_requests_total{status=500}[1h])
  ) by (endpoint)
)
```

As you can see,
Prometheus can provide a lot of useful information with several simple queries that only have a few basic functions and operators.
There is also support for sorting, aggregation, interpolation and other mathematical wizardry that you can find in other query languages.

<a name="instrumenting-your-services" />

# Instrumenting Your Services

One of the requirements to be able to query data and get results,
obviously,
is the fact that there must be data that can be queried.
Generating data can be done by instrumenting your services.
Prometheus offers client libraries for
[Go](https://github.com/prometheus/client_golang),
[Java/Scala](https://github.com/prometheus/client_java),
[Python](https://github.com/prometheus/client_python) and
[Ruby](https://github.com/prometheus/client_ruby).
There is also a lengthy list of unofficial third-party clients for other languages,
including clients for Bash and Node.js.
These clients enable you to expose metrics endpoints through HTTP.

This is totally different compared to other,
more traditional,
monitoring tools.
Normally,
the application is unaware that it is being monitored.
With Prometheus,
you must instrument your code
and explicitly define the metrics you want to expose.
This allows you to generate highly granular data which you can query.
However,
this technique is not much different than logging.
Logging statements are,
most of the time,
also explicitly defined in the code,
so why not for monitoring as well?

For short-lived jobs,
like cronjobs,
scraping may be too slow to gather the metrics.
For these use cases,
Prometheus offers an alternative,
called the [Pushgateway](https://github.com/prometheus/pushgateway).
Before a job disappears,
it can push metrics to this gateway,
and Prometheus can scrape the metrics from this gateway later on.

<a name="exporters" />

# Exporters

Not everything can be instrumented.
Third-party tools that do not support Prometheus metrics natively,
can be monitored with **exporters**.
Exporters can collect statistics and existing metrics,
and convert them to Prometheus metrics.
An exporter,
just like an instrumented service,
exposes these metrics through an endpoint,
and can be scraped by Prometheus.

A [large variety of exporters](https://prometheus.io/docs/instrumenting/exporters/) is already available.
If you want to monitor third-party software that does not have an exporter publicly available,
you can write your own [custom exporter](https://prometheus.io/docs/instrumenting/writing_exporters/)

<a name="scraping-the-targets" />

# Scraping the Targets

Pulling metrics from instances is called scraping.
Scraping is done at configurable intervals by the Prometheus server.
Prometheus allows you to configure **jobs** that fetch time series from **instances**.


```yml
global:
  scrape_interval: 15s # Scrape targets every 15 seconds
  scrape_timeout: 15s # Timeout after 15 seconds

  # Attach the label monitor=dev-monitor to all scraped time series scraped by this server
  labels:
    monitor: 'dev-monitor'

scrape_configs:
  - job_name: "job-name"
    scrape_interval: 10s # Override the default global interval for this job
    scrape_timeout: 10s # Override the default global timeout for this job
    target_groups:
    # First group of scrape targets
    - targets: ['localhost:9100', 'localhost:9101']
      labels:
        group: 'first-group'

    # Second group of scrape targets
    - targets: ['localhost:9200', 'localhost:9201']
      labels:
        group: 'second-group'
```

This configuration file is pretty self-explanatory.
You can define defaults for all jobs in the `global` root element.
These defaults can then be overridden by each job,
if necessary.

A job itself has a name and a list of target groups.
In most cases,
a job has one list of targets (one target group),
but Prometheus allows you to split these between different groups,
so you can add different labels to each scraped metric of that group.
Next to your own custom labels,
Prometheus will additionally append the `job` and `instance` labels to the sampled metrics automatically.

<a name="visualization-and-analytics" />

# Visualization and Analytics

Prometheus has its own dashboard,
called **[PromDash](https://github.com/prometheus/promdash)**,
but it has been **deprecated** in favor of [Grafana](http://grafana.org).
Grafana supports Prometheus metrics out-of-the-box
and makes setting up metrics visualization effortless.
After adding a Prometheus data source,
you can immediately start creating dashboards using [PromQL](#slice-dice-with-the-query-language):

<div class="row">
  <div class="6u">
    <a href="{{ '/img/prometheus/grafana-datasource.jpg' | prepend: site.baseurl }}">
      <img class="image fit" alt="Prometheus Datasource" src="{{ '/img/prometheus/grafana-datasource.jpg' | prepend: site.baseurl }}">
      <figcaption class="align-center">Step 1: Create datasource</figcaption>
    </a>
  </div>
  <div class="6u$">
    <a href="{{ '/img/prometheus/grafana-dashboard.jpg' | prepend: site.baseurl }}">
      <img class="image fit"  alt="Grafana Dashboard" src="{{ '/img/prometheus/grafana-dashboard.jpg' | prepend: site.baseurl }}">
      <figcaption class="align-center">Step 2: Profit</figcaption>
    </a>
  </div>
</div>

<a name="alert-alert" />

# Alert! Alert!

Prometheus provides an [Alert Manager](https://github.com/prometheus/alertmanager).
This Alert Manager is highly configurable and supports many notification methods natively.
You can define **routes** and **receivers**,
so you have fine-grained control over every alert and how it is treated.
It is possible to suppress alerts and define inhibition rules,
so you can prevent getting thousands of the same alert if a many-node cluster goes down.

Alerts can be generated by defining **alerting rules**.
This is done in Prometheus and not in the Alert Manager.
Here are a few simple alerting rule examples:

```
# Alert for any instance that have a median request latency >1s.
ALERT APIHighRequestLatency
IF api_http_request_latencies_second{quantile="0.5"} > 1
FOR 1m
LABELS { severity="critical"}
ANNOTATIONS {
  summary = "High request latency on {{ $labels.instance }}",
  description = "{{ $labels.instance }} has a median request latency above 1s (current value: {{ $value }}s)",
}

ALERT CpuUsage
IF cpu_usage_total > 95
FOR 1m
LABELS { severity="critical"}
ANNOTATIONS {
  summary = "YOU MUST CONSTRUCT ADDITIONAL PYLONS"
  description = "CPU usage is above 95%"
}
```

After an alert is generated and sent to the Alert Manager,
it can be routed using **routes**.
There is one root route on which each incoming alert enters,
and you can define child routes to route alerts to the correct receiver.
These routes can be configured using a YAML configuration file:

```yml
# The root route on which each incoming alert enters.
route:
  # The default receiver
  receiver: 'team-X'
  # The child route trees.
  routes:
  # This is a regular expressiong based route
  - match_re:
      service: ^(foo|bar)$
    receiver: team-foobar
    # Another child route
    routes:
    - match:
        severity: critical
      receiver: team-critical
```

There are multiple types of [**receivers**](https://prometheus.io/docs/alerting/configuration/#receiver-receiver) to which you can push notifications to.
You can push alert notifications to SMTP,
[HipChat](https://www.hipchat.com),
[PagerDuty](https://www.pagerduty.com),
[PushOver](https://pushover.net/),
[Slack](https://slack.com) and [OpsGenie](https://www.opsgenie.com/).
Additionally,
you can use a web hook to send HTTP POST requests to a certain endpoint with the alert as JSON,
if you wish to push notifications to somewhere else.
Check out [this guy's audio alarm](http://www.robustperception.io/audio-alerting-with-prometheus/),
which alerts him when his internet goes down!

The receivers are configured in the same YAML configuration file:

```yml
receivers:
# Email receiver
- name: 'team-X'
  email_configs:
  - to: 'alerts@team-x.com'

# Slack receiver that sends alerts to the #general channel.
- name: 'team-foobar'
  slack_configs:
    api_url: 'https://foobar.slack.com/services/hooks/incoming-webhook?token=<token>'
    channel: 'general'

# Webhook receiver with a custom endpoint
- name: 'team-critical'
  webhook_configs:
    url: 'team.critical.com'
```

<a name="monitoring-time" />

# Monitoring Time!

Do you wish to get your hands dirty quickly with Prometheus?
Perfect!
I have prepared a project for demonstration purposes,
which can be found [on the Ordina JWorks GitHub repository](https://github.com/ordina-jworks/prometheus-demo).
The project can be set up using only one command,
leveraging [Docker](https://docker.com/getdocker) and [Make](https://www.gnu.org/s/make/manual/make.html).
It covers most of the features discussed in this blog post.

First clone the project with Git:

```bash
$ git clone git@github.com:ordina-jworks/prometheus-demo.git
```

After the project is cloned,
run `make` in the project directory:

```bash
$ make
```

This will compile all applications,
build or pull all necessary Docker images,
and start the complete project using Docker Compose.
The following containers are started:

```bash
$ docker ps
CONTAINER ID        IMAGE                              COMMAND                  PORTS                     NAMES
c620b49edf4c        prom/alertmanager                  "/bin/alertmanager -c"   0.0.0.0:32902->9093/tcp   prometheusdemo_alertmanager_1
67b461b6a44b        grafana/grafana                    "/run.sh"                0.0.0.0:32903->3000/tcp   prometheusdemo_grafana_1
920792d123bd        google/cadvisor                    "/usr/bin/cadvisor -l"   0.0.0.0:32900->8080/tcp   prometheusdemo_cadvisor_1
215c20eb849b        ordina-jworks/prometheus-prommer   "/bin/sh -c /entrypoi"   0.0.0.0:32901->9090/tcp   prometheusdemo_prometheus_1
f3cfc2f63f00        tomverelst/prommer                 "/bin/prommer -target"                             prometheusdemo_prommer_1
574f14998424        ordina-jworks/voting-app           "/main"                  0.0.0.0:32899->8080/tcp   prometheusdemo_voting-app_1
66f2a00fcbcb        ordina-jworks/alert-console        "/main"                  0.0.0.0:32898->8080/tcp   prometheusdemo_alert-console_1
4fd707d4e80c        ordina-jworks/voting-generator     "/main -vote=cat -max"   8080/tcp                  prometheusdemo_vote-cats_1
5b876a131ad0        ordina-jworks/voting-generator     "/main -vote=dog -max"   8080/tcp                  prometheusdemo_vote-dogs_1
```

As you can see,
a lot of containers are started!
You can view the public ports of the containers in this list,
which you need to access the applications.
The project consists of the following components:

* [**Prometheus**](https://github.com/prometheus/prometheus) which scrapes the metrics and throws alerts
* [**Grafana**](https://github.com/grafana/grafana) to visualize metrics and show fancy graphs
* [**Alert Manager**](https://github.com/prometheus/alertmanager) to collect all alerts and route them with a rule based system
* [**cAdvisor**](https://github.com/google/cadvisor) which exposes container and host metrics
* [**Prommer**](https://github.com/tomverelst/prommer), a custom Prometheus target discovery tool
* An **alert console** which displays the alerts in the console
* A **voting application** which registers and counts votes
* A **voting generator** which generates votes

The voting application exposes a custom metric called `voting_amount_total`.
This metric holds the total amount of votes and is labeled by the type of vote,
e.g. `voting_amount_total{name=dog}`.

An alerting rule is configured in Prometheus that checks for the amount of votes.
Once it passes a certain threshold,
the alert is fired.
This alert is sent to the **Alert Manager**,
which in turn routes it to the custom **alert console** through a webhook.

<img class="image fit" alt="Inactive alert" src="{{ '/img/prometheus/demo-rule-inactive.png' | prepend: site.baseurl }}">
<figcaption class="align-center">Inactive alert</figcaption>
<br />
<img class="image fit"  alt="Active alert" src="{{ '/img/prometheus/demo-rule-active.png' | prepend: site.baseurl }}">
<figcaption class="align-center">The alert is fired</figcaption>

<br />

The **alert console** logs the JSON body of the POST request from the **Alert Manager**.

We can check the output of these logs using Docker Compose:

```bash
$ docker-compose logs -f --tail="all" alert-console
Attaching to prometheusdemo_alert-console_1
alert-console_1  | {"receiver":"alert_console","status":"firing","alerts":[{"status":"firing","labels":{"alertname":"TooManyCatVotes",
"instance":"172.19.0.5:8080","job":"voting-app","name":"cat","severity":"critical"},"annotations":{"summary":"Too many votes for cats!
"},"startsAt":"2016-09-22T17:09:22.807Z","endsAt":"0001-01-01T00:00:00Z","generatorURL":"http://215c20eb849b:9090/graph#%5B%7B%22expr%
22%3A%22votes_amount_total%7Bname%3D%5C%22cat%5C%22%7D%20%3E%20100%22%2C%22tab%22%3A0%7D%5D"}],"groupLabels":{"alertname":"TooManyCatV
otes"},"commonLabels":{"alertname":"TooManyCatVotes","instance":"172.19.0.5:8080","job":"voting-app","name":"cat","severity":"critical
"},"commonAnnotations":{"summary":"Too many votes for cats!"},"externalURL":"http://c620b49edf4c:9093","version":"3","groupKey":101200
6562800295578}
```

### Grafana

The default credentials for Grafana are `admin:admin`.
After logging in,
you must first configure a **Prometheus data source**.
Prometheus is available at `http://prometheus:9090` (from within the container).

<div class="row">
  <div class="6u">
    <a href="{{ '/img/prometheus/grafana-datasource.jpg' | prepend: site.baseurl }}">
      <img class="image fit" alt="Prometheus Datasource" src="{{ '/img/prometheus/grafana-datasource.jpg' | prepend: site.baseurl }}">
      <figcaption class="align-center">Configuring the data source</figcaption>
    </a>
  </div>
  <div class="6u$">
    <a href="{{ '/img/prometheus/grafana-dashboard.jpg' | prepend: site.baseurl }}">
      <img class="image fit"  alt="Grafana Dashboard" src="{{ '/img/prometheus/grafana-dashboard.jpg' | prepend: site.baseurl }}">
      <figcaption class="align-center">Visualizing metrics</figcaption>
    </a>
  </div>
</div>

<br />

### cAdvisor

**cAdvisor** also has a simple dashboard which displays most important host and container metrics.
Since Prometheus scrapes cAdvisor,
these metrics are also available from Grafana.


<div class="row">
  <div class="6u">
    <a href="{{ '/img/prometheus/cadvisor-throughput.png' | prepend: site.baseurl }}">
      <img class="image fit" alt="Throughput" src="{{ '/img/prometheus/cadvisor-throughput.png' | prepend: site.baseurl }}">
      <figcaption class="align-center">Network Throughput</figcaption>
    </a>
  </div>
  <div class="6u$">
    <a href="{{ '/img/prometheus/cadvisor-cpu-usage.png' | prepend: site.baseurl }}">
      <img class="image fit"  alt="CPU Usage per Core" src="{{ '/img/prometheus/cadvisor-cpu-usage.png' | prepend: site.baseurl }}">
      <figcaption class="align-center">CPU Usage per Core</figcaption>
    </a>
  </div>
</div>

<a name="final-words" />

# Final Words

Just a few months ago,
the Prometheus team [joined the Cloud Native Computing Foundation](https://prometheus.io/blog/2016/05/09/prometheus-to-join-the-cloud-native-computing-foundation/).

> Today, we are excited to announce that the CNCF's Technical Oversight Committee voted unanimously to accept Prometheus as a second hosted project after Kubernetes!
> You can find more information about these plans in the [official press release](https://cncf.io/news/announcement/2016/05/cloud-native-computing-foundation-accepts-prometheus-second-hosted-project) by the CNCF.
>
> By joining the CNCF, we hope to establish a clear and sustainable project governance model, as well as benefit from the resources, infrastructure, and advice that the independent foundation provides to its members.

_Cloud Native Computing Foundation_ ([CNCF](http://cncf.io/)) is a nonprofit, open standardization organisation which commits itself to advance the development of cloud native technologies,
formed under the Linux Foundation.
It is a shared effort by the industry to create innovation for container packaged, microservices based, dynamically scheduled applications and operations.
Prometheus has proven itself to be worthy to be an industry standard in alerting and monitoring.
It offers a wide-range of features,
from instrumenting to alerting,
and is supported by many other tools.
If you are looking for a monitoring tool,
definitely give it a shot!
