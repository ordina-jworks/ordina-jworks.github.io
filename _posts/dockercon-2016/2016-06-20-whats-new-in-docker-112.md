---
layout: post
authors: [tom_verelst]
title: 'DockerCon 2016 - What is new in Docker 1.12'
image: /img/dockercon/dockercon.png
tags: [DockerCon,Docker,Conference]
category: Conference
comments: true
---


<img class="image fit" src="{{ '/img/dockercon/dockercon.png' | prepend: site.baseurl }}" alt="DockerCon 2016" />

## Orchestration Made Easy

Last week,
I tried out the new orchestration tools that were [made available on GitHub](https://github.com/docker/swarmkit).
My first impressions were very positive.
The setup is easy and it works like a charm.
Today,
at DockerCon 2016,
these new orchestration tools were officially announced during the opening session.
There is also an [official blog post](https://blog.docker.com/2016/06/docker-1-12-built-in-orchestration/).

Before we start talking about orchestration,
let's take a step back and look at how easy it has become to set up a Swarm cluster.

Creating a Swarm manager can be done with one simple command:

```bash
$ docker swarm init
```

You can run this command on any Docker 1.12 host.

After we created the Swarm manager,
we can add additional nodes to the swarm by running the following command on other Docker hosts:

```bash
$ docker swarm join <IP of manager>:2377
```

That's it.
No messing around with key-value stores or certificates.
Docker will automatically configure everything you need out-of-the-box.

Under the hood,
Docker uses a [Raft](https://raft.github.io/raft.pdf) consensus.

There are two types of nodes: **manager** and **worker**.
The first initial node is a manager.
When adding more nodes to the Swarm,
these nodes will be worker nodes by default.

<img class="image fit" src="{{ '/img/dockercon/swarm-overview.png' | prepend: site.baseurl }}" alt="Overview" />

Manager nodes are responsible for managing the cluster's desired state.
They do health checks and schedule tasks to keep this desired state.

Worker nodes are responsible for executing tasks that are scheduled by the managers.
A worker node cannot change the desired state.
It can only take work and report back on the status.

The role of a node is dynamic.
We can increment or reduce the amount of managers by promoting or demoting nodes.

```bash
$ docker node promote <node-id>
$ docker node demote <node-id>
```

## Services

Docker 1.12 introduces a new `service` command.
A **service** is a set of tasks that can be easily replicated.
A **task** represents a workload and is executed by a container.
A task does not necessarily have to be a container,
but currently that is the only option.
In the future,
tasks can also be different types of workloads,
for example Unikernels.

The service command is very similar to the `run` command
and utilizes a lot of similar flags which we are used to work with.

```bash
$ docker service create --replicate 3 --name frontend --network mynet --publish 80:80/tcp frontend_image:latest
```

The above command will create a service named _frontend_,
add it to the _mynet_ network,
publish it to port 80,
and use the _frontend_image_ for this service.

This does not only create the service,
but it defines the desired state.
The cluster constantly reconciles its state.
Upon a node failure,
the cluster will automatically self heal
and converge back to the desired state by scheduling new tasks on other nodes.

You can also define a **Swarm mode**.
For example,
if you wish to create a service that runs on _every node_,
you can easily do this using the _global_ mode.
This will schedule all the tasks of a service on each node.
This is great for general services like monitoring.

```bash
$ docker service create --mode=global --name prometheus prom/prometheus
```

Just like we can put constraints on containers,
we can put constraints on services:

```bash
$ docker daemon --label com.example.storage="ssd"
$ docker service ... --constraint com.example.storage="ssd" ...
```

If we want more instances of our service,
we can scale our services up and down:

```bash
$ docker service scale frontend=10 backend=20
```

This will change the desired state of the service(s),
and the managers will schedule new tasks (or remove existing tasks) to attain this desired state.

We can also apply rolling updates to our services.
For example,
if we wish to upgrade our service to a newer version without any downtime,
we can use the `service update` command:

```
$ docker service update myservice --image myimage:2.0 --update-parallellism 2 --update-delay 10s
```

This will update our service by replacing 2 tasks at the time,
every 10 seconds.
We can also use this command to change environment variables,
ports,
etc.

As you can see,
the new `service` subcommand is very powerful and easy to use.

## Bundles

A Distributed Application Bundle (DAB) file declares a stack of services,
including the versioning and how the networking is setup.
It is a deployment artifact that can be used in your continuous integration tools,
all the way from your laptop to production.

Currently,
one way to generate a _.dab_ file is by creating the bundle using Docker Compose:

```bash
$ docker-compose bundle
```

This command will generate a _.dab_ or _.dsb_ file,
which is just a JSON text file.
Here's a partial example:

```
{
  "services": {
    "db": {
      "Env": [
        "constraint:type==backend",
        "constraint:storage==ssd"
      ],
      "Image": "postgres@sha256:f76245b04ddbcebab5bb6c28e76947f49222c99fec4aadb0bb1c24821a9e83ef",
      "Networks": [
        "back-tier"
      ]
    }
  }
}
```

This feature is still experimental in Docker 1.12
and the specification is still being updated.
Docker invites everyone to provide feedback and hopes it will become the de facto standard for deploying applications.

## Routing Mesh Networks

A problem with load balancers is the fact they are not container-aware,
but host-aware.
Load balancing containers has been hard up until now,
because you have to update the configuration of the load balancers as containers are started or stopped.
This is done by overriding the configuration file of the load balancer and restarting it,
or by updating the configuration in a distributed key-value store like etcd.

Docker now has built in load balancing in the Engine using a container-aware routing mesh.
This mesh network can transparantly reroute traffic from any host to a container.
For example,
publishing a service on port 80 will reserve a Swarm wide ingress port,
so that each node will listen to port 80.
Each node will then reroute traffic to the container using DNS based service discovery.

This is compatible with existing infrastructure.
External load balancer no longer need to know where the containers are running.
They can just point towards any node and the routing mesh will automatically redirect traffic.
Even though this introduces an extra hop,
it is still very efficient since it uses IPVS.

## Security Out Of The Box

Docker now comes with out-of-the-box, zero-configuration security.
Docker sets up automatic certificate rotation,
TLS mutual authentication
and TLS encryption between nodes.

<img class="image fit" src="{{ '/img/dockercon/swarm-tls.png' | prepend: site.baseurl }}" alt="Security" />


**There is no way to turn off security.**
One of the core principles of Docker is simplicity.
Therefor,
security must be so simple to use,
that you don't want to turn it off!

## Container Health Check in Dockerfile

A new `HEALTHCHECK` keyword is available for Dockerfiles.
This keyword can be used to define the health check of a container.

```
HEALTHCHECK --interval=5m --timeout=3s --retries 3 CMD curl -f http://localhost || exit 1
```

In the above example,
health checking is done every 5 minutes.
A container becomes unhealthy if the `curl` command fails 3 times in a row with a 3 second timeout.

## New Plugin Subcommands (experimental)

A new `plugin` subcommand has been added which allows you to easily manager Docker plugins.

```bash
$ docker plugin install <plugin-name>
$ docker plugin enable <plugin-name>
$ docker plugin disable <plugin-name>
```

Plugins also have a manifest file which describes the resources it needs.
You can compare it to how a new app on your smart phone asks for access to different resources,
like your photos or contacts.

## Try It Out!

As of today,
the Docker for Mac/Windows beta,
which is already at Docker 1.12,
is open for everyone!
You can download it at [docker.com/getdocker](http://docker.com/getdocker).
