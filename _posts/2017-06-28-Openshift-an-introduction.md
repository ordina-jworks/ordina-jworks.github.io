---
layout: post
authors: [hans_michiels]
title: 'Openshift: An introduction'
image: /img/openshift.png
tags: [Openshift, PaaS, Cloud, Container, Devops, Kubernetes]
category: Paas
comments: true
---
<div class="col-md-2" style="width:32%">
{% include image.html img="/img/openshift-an introduction/Ease-of-PaaS.png" alt="easeofpaas" title="Paas" style="max-width: 80px;" %}</div>


# Why my first blog about Openshift
When I started as a developer, the cloud ecosystem started expanding and became the next big thing.
So obvious I wanted to see what all the fuzz was about and started taking a deeper look at it.
Soon I got introduced with so many new technologies I was not familiar with. People talked about microservices, containers, pods, kubernetes,load balancing, docker,Paas,...

To be honest, for me it was really overwhelming.
I thought myself I never have the time to become a guru of all these technologies to start with cloud native development.
So I just sat in a corner crying about why I became a dev in a time where things never looked more complicated and changed faster then ever before.
But actually it's not at all complicated, to be honest deploying your containers in the cloud and managing things are easier then ever before with PaaS and Openshift.

A couple of months ago, I got introduced to Openshift and got really excited about it!
Recently Ordina gave me the chance to visit the RedHats partner conference and my excitement for Openshift reached new heights.
My body not able to contain all that energy for Openshift, I had to ventilate it into a blogpost or otherwise I would spontaneous combust.

I do have to mention when you want to work with openshift, you still need to have a basic understanding about containers, paas and kubernetes if you want to understand some of it's magic.
If you have no idea what docker containers are or what kubernetes is, don't panic! There are some great blogposts on the jworks blog explaining more about them.

# What is Openshift

Openshift is a __PaaS__. For those who don't know what a PAAS is, stop reading now, take a timecab to the year 2017 and check it out cause PaaS is awesome.

For those who are not sure anymore, here is a quick reminder.

> __Platform as a service (PaaS)__ or application platform as a service (aPaaS) is a category of cloud computing services that provides a platform allowing customers to develop, run, and manage applications without the complexity of building and maintaining the infrastructure typically associated with developing and launching an app

There are multiple Paas providers when you want to one.
For example You got Openshift, Cloudfoundry,Heroku,Google App Engine and many more.
Most of these Platforms offer a lot of the same solutions each with their own pro and cons but today we gonna talk about openshift specific.

When I look up openshift in google(since thats the first thing we do these days) it gives me the following explanation. 

> __OpenShift Container Platform__ (formerly known as OpenShift Enterprise) is Red Hat's on-premise private platform as a service product, built around a core of application containers powered by Docker, with orchestration and management provided by Kubernetes, on a foundation of Red Hat Enterprise Linux.

Well that explains it!
Never thought writing my first blog post would be that easy!
Obviously you wouldn't be reading this blog if this was my only explanation since my my pull request would never be accepted.

If I would try to explain it with my own words to someone who never heard of Openshift I would define it like this.

> __Openshift container Platform__ is a platform as a service you can deploy on a public ,private or hybrid cloud that helps you deploy you application with the use of docker containers. It is build ontop of kubernetes and gives you tools like a webconsole and CLI to manage features like load balancing and horizontal scaling. It simplifies operations and developement for cloud native applications.

Ok I know this is still pretty vague and it can do so much, so why don't we simply start where Openshift fits in.

<p>
  <img class="image fit" alt="evolve" src="/img/openshift-an introduction/evolve.png">
</p>

As you see in the image the it landscape has evolved a lot in recent years.
We now have Devops , Microservices, Containers , Cloud and  kubernetes.
Openshift combines all of those things in one platform you can easily manage.
So it actually fits right on top of it.


# Overview

<p>
  <img class="image fit" alt="overview" src="/img/openshift-an introduction/overview.png">
</p>

### SELF-SERVICE
<span class="image left small"><img class="p-image" alt="Self-service" src="/img/openshift-an introduction/self-service.png"></span>
Developers can quickly and easily create applications and deploy them.
With [S2I (Source to image)](#Benefits-for-developpers) a developer can even deploy his code without needing to create a container first.
Operators can leverage placement and policy to orchestrate environments that meet their best practices.
It makes your development en operations work fluently together  when combining them in a single platform.

### POLYGLOT, MULTI-LANGUAGE
<span class="image left small"><img class="p-image" alt="multilanguage" src="/img/openshift-an introduction/multilanguage.png"></span>
Since it deploys docker containers, it gives you the ability to run multiple languages, frameworks and databases on the same platform. You can easily deploy a microservice written in Java, python and many more languages.

### AUTOMATION
<span class="image left small"><img class="p-image" alt="automation" src="/img/openshift-an introduction/automation.png"></span>
__Build automation:__
OpenShift automates the process of building new container images for all of your users. It can run standard docker builds based on the dockerfiles you provide and it also provides a “source-to-image” feature which allows you to specify the source from which to generate your images. This allows administrators to control a set of base or “builder images” and then users can layer on top of. The build source could be a GIT location,It could also be a binary like a WAR/JAR file.Users can also customize the build process and create their own S2I images. 

__Deployment automation:__
OpenShift automated the deployment of application containers. It supports rolling deployments for multi-containers apps and allows you to roll back to an older version.

__Continuous integration:__
It provides built-on continuous integration capabilities with Jenkins and can also tie into your existing CI solutions.The OpenShift’s Jenkins image can also be used to run your Jenkins masters and slaves on openshift.

### Scale
<span class="image left small"><img class="p-image" alt="scale" src="/img/openshift-an introduction/scale.png"></span>
When you want to start scaling your application wheter it's from 1 replica to 2 or scale it to 2000 replicas a lot of complexity is added.
OpenShift leverages the power of containers and a incredibly powerful orchestration engine to make that happen. Containers make sure that applications are packed up in their own space and are independent from the OS, this makes applications incredibly portable and hyper scalable. OpenShift’s orchestration layer, Google’s Kubernetes, automates the scheduling and replication of these containers meaning that they’re highly available and able to accommodate whatever your users can throw at it.
This means that your team spends less time in the weeds and keeping the lights on, and more time being innovative and productive. 

### Opensource
<span class="image left small"><img class="p-image" alt="opensource" src="/img/openshift-an introduction/opensource.png"></span>
There are multiple versions of openshift (Spoiler: it's gonna be the next topic in this blog post) but they are all based on Openshift Origin.
Origin provides an open source application container platform. All source code for the Origin project is available under the Apache License (Version 2.0) on [GitHub](https://github.com/openshift)

# Openshift landscape

There are a few different openshift releases depending what you need.
As of this writing the openshift landscape looks like this.

<p>
  <img class="image fit" alt="openshiftlandscape" src="/img/openshift-an introduction/openshiftlandscape.png">
</p>

### Openshift origin
It's the upstream community project used in openshift Online, Openshift dedicated and Openshift container Platform.
It's build around docker and kubernetes cluster management.
Origin is augmented by application lifecycle management functionality and DevOps tooling.
Origin updates as often as open source developers contribute via git sometimes as often as several times per week. Here you get the new feature the quickest but at the cost of stability.

### Openshift container platform
Formaly known as openshift enterprise.
It's the  platform software  to deploy and manage openshift on your own  infrastructure of choice.
It integrates with Red Hat Enterprise Linux 6 and is tested via Red Hat's QA process in order to offer a stable, supportable product with may be important for enterprises.

### Openshift dedicated
Openshift dedicated is the latest offering of openshift.
It's OpenShift 3 hosted on AWS and maintained by Red Hat but it is dedicated to you

### Openshift online
OpenShift Online is managed by Red Hat’s OpenShift operations team, and quickstart templates enable developers to push code with one click, helping to avoid the intricacies of application provisioning.
You can view it as openshift delivered as a SAAS(software as a service)

# Benefits for developers
Before I show you how easy openshift is for a developer, let me quickly explain Source to image (S2I) to make life even more easier.


Let's show how easy your life can be with the following image

> __source to image__ is a toolkit and workflow that creates a deployable docker image based on your source code and add it to the image registry. You don't even need a docker file anymore.It combines source code with a corresponding builder image from the integrated docker registry

So now you know S2I let's take a look at the next picture
<p>
  <img class="image fit" alt="devopsoverview" src="/img/openshift-an introduction/devopsoverview.jpg">
</p>
* __code:__
If your a developer I assume you know how to code and push it to git, so nothing new here ..

* __Build:__
The developer can push code to be built and run on OpenShift through their software version control solution or OpenShift can be integrated with a developer's own automated build and continuous integration/continuous deployment system. Here is were S2I can get usefull.

* __deploy:__
OpenShift then orchestrates where application containers will run and manages the the application to ensure it's available for end users.

* __manage:__
With your app running in the cloud you can monitor, debug, and tune on the fly.
Scale your application automatically or allocate capacity ahead of time


# A deeper look 
Time to get a little bit more technical and take a deeper look how it works.
I already talked about the developer part of the picture below, so let's focus on the rest!

<p>
  <img class="image fit" alt="deeperlook" src="/img/openshift-an introduction/deeperlook.svg">
</p>


### Infrastructure
Openshift runs on your choice of infrastructure (Physical, Virtual,Private, Public)

### Nodes
A node provides the runtime environments for containers.
Each node in a Kubernetes cluster has the required services to be managed by the master. 
OpenShift creates nodes from a cloud provider, physical systems, or virtual systems.
Kubernetes interacts with node objects that are a representation of those nodes.
A node is ignored until it passes the health checks, and the master continues checking nodes until they are valid.
In Openshift nodes are instances of RHEL(Redhat enterprise linux)

### Pods
<span class="image right"><img  alt="pods" src="/img/openshift-an introduction/pods.png"></span>
OpenShift leverages the Kubernetes concept of a pod, which is one or more containers deployed together on one host, and the smallest compute unit that can be defined, deployed, and managed.
Each pod is allocated its own internal IP address, therefore owning its entire port space, and containers within pods can share their local storage and networking.
Pods have a lifecycle; they are defined, then they are assigned to run on a node, then they run until their container(s) exit or they are removed for some other reason.
OpenShift treats pods as largely immutable,changes cannot be made to a pod definition while it is running.
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
The __Management/Replication controler__ manages the lifecycle of pods.
For instance when you deploy a new version of your application and create a new pod, Openshift can wait till the new pod is fully functional before downscaling the old pod leading to no downtime.
__But what if the master node goes down? That's no high availability ...__ 
You can optionally configure your masters for high availability to ensure that the cluster has no single point of failure.

### Service layer
On top of the domain and persistence layer sits the service layer of the application.
A Kubernetes service serves as an internal load balancer.
It identifies a set of replicated pods in order to proxy the connections it receives to them.
Backing pods can be added to or removed from a service arbitrarily while the service remains consistently available, enabling anything that depends on the service to refer to it at a consistent internal address.

### Persistant storage
Managing storage is a distinct problem from managing compute resources. OpenShift Origin leverages the __Kubernetes persistent volume (PV)__ framework to allow administrators to provision persistent storage for a cluster.
Using __persistent volume claims (PVCs)__, developers can request PV resources without having specific knowledge of the underlying storage infrastructure.
PVCs are specific to a project and are created and used by developers as a means to use a PV.
PV resources on their own are not scoped to any single project; they can be shared across the entire OpenShift Origin cluster and claimed from any project.
After a PV has been bound to a PVC, however, that PV cannot then be bound to additional PVCs. This has the effect of scoping a bound PV to a single namespace (that of the binding project).

# Openshift.io
So before I end this blog i have to quicly mention [Openshift.io](https://openshift.io/)
As of this moment it's not yet available but you can try to register for the preview.
I didn't had the change yet to play with it yet since i have not yet recieved my access.
Basically it's an online development environment for planning, creating and deploying hybrid cloud services.

It provides following futures:

* Hosted, integrated toolchain
* Planning tools for managing and prioritizing work
* Code editing and debugging tools built on Eclipse Che
* Integrated and automated CI/CD pipelines
* Dashboards and reporting tools

# Conclusion

For the people who never heared of openshift or had no idea what it is , I hope you can now at least pretend to know something about it and not look like a complete fool like I did when someone asked me about openshift.
Ofcourse there is so much more to tell you and show about paas and openshift, So stay tuned cause I intend to write another blogpost later this year comparing multiple PaaS solutions to each other.

