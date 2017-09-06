---
layout: post
authors: [hans_michiels]
title: 'OpenShift: An introduction'
image: /img/Openshift.png
tags: [OpenShift, PaaS, Cloud, Container, DevOps, Kubernetes, CaaS]
category: PaaS
comments: true
---
<div class="col-md-2" style="width:32%">
{% include image.html img="/img/openshift-an-introduction/Ease-of-PaaS.png" alt="easeofpaas" title="PaaS" style="max-width: 80px;" %}</div>


# Why my first blog about OpenShift
When I started as a developer, the cloud ecosystem started expanding and became the next big thing.
So obviously I wanted to see what all the fuzz was about and started taking a deeper look at it.
Soon, I got introduced with so many new technologies I was not familiar with: microservices, containers, pods, Kubernetes, load balancing, Docker, PaaS,...

To be honest, for me it was really overwhelming.
I told myself, I would never have the time to become a guru in all these technologies to start with cloud native development.
So I just sat in a corner crying about why I became a dev in a time where things never looked more complicated and changed faster than ever before.
But actually it's not all that complicated.
To be honest, deploying your containers in the cloud and managing things are easier than ever before with PaaS and OpenShift.

A couple of months ago, I got introduced to OpenShift and got really excited about it!
Recently, Ordina gave me the chance to visit the [Red Hat's partner conference](https://www.redhat.com/en/about/events/red-hat-partner-conference-emea-2017) and my excitement for OpenShift reached new heights.
With my body being unable to contain all that excitement for OpenShift, I had to funnel it into a blog post or otherwise I would spontaneously combust.

I do have to mention that if you want to work with OpenShift, you still need to have a basic understanding about containers, PaaS and Kubernetes if you want to understand some of its magic.
If you have no idea what Docker containers are or what Kubernetes is, don't panic! There are some great blogposts on the JWorks blog explaining more about them.

# What is OpenShift

OpenShift is a __PaaS__. For those who don't know what a PAAS is, stop reading now, take a timecab to the year 2011 and check it out because PaaS is awesome.

Gartner calls OpenShift a __Cloud Enabled Application Platform (CEAP)__.

For those who are not sure anymore, here is a quick reminder.

> __Platform as a service (PaaS)__ or application platform as a service (aPaaS) is a category of cloud computing services that provides a platform allowing customers to develop, run, and manage applications without the complexity of building and maintaining the infrastructure typically associated with developing and launching an app

There are multiple PaaS providers available.
For example, you have OpenShift, Cloudfoundry, Heroku, Google App Engine and more.
Most of these platforms offer a lot of the same solutions, each with their own pros and cons, but today we are going talk about OpenShift specifically.

When I look up OpenShift in Google (since that's the first thing we do these days), it gives me the following explanation: 

> __OpenShift Container Platform__ (formerly known as OpenShift Enterprise) is Red Hat's on-premise private platform as a service product, built around a core of application containers powered by Docker, with orchestration and management provided by Kubernetes, on a foundation of Red Hat Enterprise Linux.

Well that explains it!
I never thought writing my first blog post would be that easy!
Obviously you wouldn't be reading this blog post if this was my only explanation since my pull request would never be accepted.

If I would try to explain it with my own words to someone who never heard of OpenShift, I would define it like this.

> __OpenShift container Platform__ is a platform as a service you can deploy on a public, private or hybrid cloud that helps you deploy your applications with the use of Docker containers.
It is build on top of Kubernetes and gives you tools like a webconsole and CLI to manage features like load balancing and horizontal scaling. It simplifies operations and development for cloud native applications.

Okay, I know this is still pretty vague and it can do so much, so why don't we simply start with seeing where OpenShift fits in.

<p>
  <img class="image fit" alt="evolve" src="/img/openshift-an-introduction/evolve.png">
</p>

As you can see in the image, the IT landscape has evolved a lot in recent years.
We now have DevOps, Microservices, Containers, Cloud and Kubernetes.
OpenShift combines all of those things in one platform you can easily manage.
So it actually fits right on top of all of that.


# Overview

<p>
  <img class="image fit" alt="overview" src="/img/openshift-an-introduction/overview.png">
</p>

### SELF-SERVICE
<span class="image left small"><img class="p-image" alt="Self-service" src="/img/openshift-an-introduction/self-service.png"></span>
Developers can quickly and easily create applications and deploy them.
With [S2I (Source-to-Image)](#benefits-for-developers), a developer can even deploy his code without needing to create a container first.
Operators can leverage placement and policy to orchestrate environments that meet their best practices.
It makes your development and operations work fluently together when combining them in a single platform.

### POLYGLOT, MULTI-LANGUAGE
<span class="image left small"><img class="p-image" alt="multilanguage" src="/img/openshift-an-introduction/multilanguage.png"></span>
Since it deploys Docker containers, it gives you the ability to run multiple languages, frameworks and databases on the same platform.
You can easily deploy microservices written in Java, Python or other languages.

### AUTOMATION
<span class="image left small"><img class="p-image" alt="automation" src="/img/openshift-an-introduction/automation.png"></span>
__Build automation:__
OpenShift automates the process of building new container images for all of your users.
It can run standard Docker builds based on the Dockerfiles you provide and it also provides a "Source-to-Image" feature which allows you to specify the source from which to generate your images.
This allows administrators to control a set of base or "builder images" and then users can layer on top of these.
The build source could be a Git location, it could also be a binary like a WAR/JAR file.
Users can also customize the build process and create their own S2I images. 

__Deployment automation:__
OpenShift automates the deployment of application containers. It supports rolling deployments for multi-containers apps and allows you to roll back to an older version.

__Continuous integration:__
It provides built-in continuous integration capabilities with Jenkins and can also tie into your existing CI solutions.The OpenShift Jenkins image can also be used to run your Jenkins masters and slaves on OpenShift.

### Scale
<span class="image left small"><img class="p-image" alt="scale" src="/img/openshift-an-introduction/scale.png"></span>
When you want to start scaling your application, whether it's from one replica to two or scale it to 2000 replicas, a lot of complexity is added.
OpenShift leverages the power of containers and an incredibly powerful orchestration engine to make that happen. Containers make sure that applications are packed up in their own space and are independent from the OS, this makes applications incredibly portable and hyper scalable. OpenShift's orchestration layer, Google's Kubernetes, automates the scheduling and replication of these containers meaning that they're highly available and able to accommodate whatever your users can throw at it.
This means that your team spends less time in the weeds and keeping the lights on, and more time being innovative and productive. 

### Opensource
<span class="image left small"><img class="p-image" alt="opensource" src="/img/openshift-an-introduction/opensource.png"></span>
There are multiple versions of OpenShift (spoiler: it's going to be the next topic in this blog post) but they are all based on OpenShift Origin.
Origin provides an open source application container platform. 
All source code for the Origin project is available under the Apache License (Version 2.0) on [GitHub](https://Github.com/OpenShift)

# OpenShift landscape

There are a few different OpenShift releases depending on what you need.
As of this writing, the OpenShift landscape looks like this:

<p>
  <img class="image fit" alt="OpenShiftlandscape" src="/img/openshift-an-introduction/openshiftlandscape.png">
</p>

### OpenShift Origin
It's the upstream community project used in OpenShift Online, OpenShift dedicated and OpenShift container Platform.
It's build around Docker and Kubernetes cluster management.
Origin is augmented by application lifecycle management functionality and DevOps tooling.
Origin updates as often as open source developers contribute via Git.
Sometimes as often as several times per week.
Here you get the new feature the quickest but at the cost of stability.

### OpenShift container platform
Formerly known as OpenShift Enterprise.
It's the platform software to deploy and manage OpenShift on your own infrastructure of choice.
It integrates with Red Hat Enterprise Linux 6 and is tested via Red Hat's QA process in order to offer a stable, supportable product with may be important for enterprises.

### OpenShift dedicated
OpenShift dedicated is the latest offering of OpenShift.
It's OpenShift 3 hosted on AWS and maintained by Red Hat but it is dedicated to you

### OpenShift online
OpenShift Online is managed by Red Hat's OpenShift operations team, and quickstart templates enable developers to push code with one click, helping to avoid the intricacies of application provisioning.
You can view it as OpenShift delivered as a SaaS (Software as a Service)

# Benefits for developers

Before I show you how easy OpenShift is for a developer, let me quickly explain Source-to-Image (S2I).

Let's see how easy your life can be with the following image:

> __Source-to-Image (S2I)__ is a toolkit and workflow that creates a deployable Docker image based on your source code and add it to the image registry. You don't even need a Docker file anymore.It combines source code with a corresponding builder image from the integrated Docker registry

So now that you know S2I, let's take a look at the next picture
<p>
  <img class="image fit" alt="devopsoverview" src="/img/openshift-an-introduction/devopsoverview.jpg">
</p>
* __Code:__
If you're a developer I assume you know how to code and push it to Git, so nothing new here...

* __Build:__
The developer can push code to be built and run on OpenShift through their software version control solution or OpenShift can be integrated with a developer's own automated build and continuous integration/continuous deployment system. Here is were S2I can get useful.

* __Deploy:__
OpenShift orchestrates where application containers will run and manages the application to ensure it's available for end users.

* __Manage:__
With your app running in the cloud you can monitor, debug, and tune on the fly.
Scale your application automatically or allocate capacity ahead of time
.

# A deeper look 
Time to get a little bit more technical and take a deeper look at how it works.
I already talked about the developer part of the picture below, so let's focus on the rest!

<p>
  <img class="image fit" alt="deeperlook" src="/img/openshift-an-introduction/deeperlook.svg">
</p>


### Infrastructure
OpenShift runs on your choice of infrastructure (Physical, Virtual, Private, Public).
OpenShift uses a __Software-Defined Networking (SDN)__ approach to provide a unified cluster network that enables communication between pods across the OpenShift cluster.
This pod network is established and maintained by the OpenShift SDN, which configures an overlay network using __Open vSwitch (OVS)__.

* The __OVS-subnet__ plug-in is the original plug-in which provides a "flat" pod network where every pod can communicate with every other pod and service.
* __The OVS-multitenant__ plug-in provides OpenShift Enterprise project level isolation for pods and services. Each project receives a unique Virtual Network ID (VNID) that identifies traffic from pods assigned to the project. 
Pods from different projects cannot send packets to or receive packets from pods and services of a different project.
However, projects which receive VNID 0 are more privileged in that they are allowed to communicate with all other pods, and all other pods can communicate with them.
In OpenShift Enterprise clusters, the default project has VNID 0.
This facilitates certain services to communicate with all other pods in the cluster and vice versa.

### Nodes
A node provides the runtime environment for containers.
Each node in a Kubernetes cluster has the required services to be managed by the master. 
OpenShift creates nodes from a cloud provider, physical systems, or virtual systems.
Kubernetes interacts with node objects that are a representation of those nodes.
A node is ignored until it passes the health checks, and the master continues checking nodes until they are valid.
In OpenShift nodes are instances of RHEL (Redhat Enterprise Linux).

### Pods
<span class="image right"><img  alt="pods" src="/img/openshift-an-introduction/pods.png"></span>
OpenShift leverages the Kubernetes concept of a pod, which is one or more containers deployed together on one host, and the smallest compute unit that can be defined, deployed, and managed.
Each pod is allocated its own internal IP address, therefore owning its entire port space, and containers within pods can share their local storage and networking.
Pods have a lifecycle; they are defined, then they are assigned to run on a node, then they run until their container(s) exit or they are removed for some other reason.
OpenShift treats pods as largely immutable, changes cannot be made to a pod definition while it is running.
It implements changes by terminating an existing pod and recreating it with modified configuration, base image(s), or both. Pods are also treated as expendable, and do not maintain state when recreated.

### Registry

__Integrated OpenShift Container Registry:__
OpenShift Origin provides an integrated container registry called OpenShift Container Registry (OCR) that adds the ability to automatically provision new image repositories on demand.
This provides users with a built-in location for their application builds to push the resulting images.
Whenever a new image is pushed to OCR, the registry notifies OpenShift about the new image, passing along all the information about it, such as the namespace, name, and image metadata.
Different pieces of OpenShift react to new images, creating new builds and deployments.

__Third Party Registries:__
OpenShift Origin can create containers using images from third party registries, but it is unlikely that these registries offer the same image notification support as the integrated OpenShift Origin registry.
In this situation OpenShift Origin will fetch tags from the remote registry upon imagestream creation.

### Master
Managing __data storage__ is a distinct problem from managing compute resources.
OpenShift leverages the Kubernetes PersistentVolume subsystem, which provides an __API__ for users and administrators that abstracts details of how storage is provided from how it is consumed.
The Kubernetes pod __scheduler__ is responsible for determining placement of new pods onto nodes within the cluster.
It reads data from the pod and tries to find a node that is a good fit based on configured policies.
The __Management/Replication controller__ manages the lifecycle of pods.
For instance when you deploy a new version of your application and create a new pod, OpenShift can wait until the new pod is fully functional before downscaling the old pod leading to no downtime.
__But what if the master node goes down? That's no high availability ...__ 
You can optionally configure your masters for high availability to ensure that the cluster has no single point of failure.

### Service layer
On top of the domain and persistence layer sits the service layer of the application.
A Kubernetes service can serve as an internal load balancer.
It identifies a set of replicated pods in order to proxy the connections it receives to them.
Backing pods can be added to or removed from a service arbitrarily while the service remains consistently available, enabling anything that depends on the service to refer to it at a consistent internal address.

### Persistant storage
Managing storage is a distinct problem from managing compute resources. 
OpenShift Origin leverages the __Kubernetes Persistent Volume (PV)__ framework to allow administrators to provision persistent storage for a cluster.
Using __Persistent Volume Claims (PVCs)__, developers can request PV resources without having specific knowledge of the underlying storage infrastructure.
PVCs are specific to a project and are created and used by developers as a means to use a PV.
PV resources on their own are not scoped to any single project; they can be shared across the entire OpenShift Origin cluster and claimed from any project.
After a PV has been bound to a PVC, however, that PV cannot then be bound to additional PVCs. 
This has the effect of scoping a bound PV to a single namespace (that of the binding project).

# OpenShift.io
So before ending this blog post, I have to quickly mention [OpenShift.io](https://OpenShift.io/).
As of this moment, it's not yet available but you can try to register for the preview.
I haven't had the chance to play with it, as I haven't received my access just yet.
Basically it's an online development environment for planning, creating and deploying hybrid cloud services.

It provides the following features:

* Hosted, integrated toolchain
* Planning tools for managing and prioritizing work
* Code editing and debugging tools built on Eclipse Che
* Integrated and automated CI/CD pipelines
* Dashboards and reporting tools

# Conclusion
Of course there is so much more to tell you and show about PaaS and OpenShift.
I hope that with this post you got a nice introduction to OpenShift itself and some of the benefits it offers.
If you enjoyed the post, I intend to write another post later this year about OpenShift, so make sure to regularly check our JWorks blog!

May the PaaS be with you.
