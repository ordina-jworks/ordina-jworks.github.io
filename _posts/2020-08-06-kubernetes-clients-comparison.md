---
layout: post
authors: [yolan_vloeberghs,pieter_vincken]
title: 'Kubernetes clients and dashboards: a comparison'
image: /img/2020-08-06-kubernetes-clients-comparison/banner.jpg
tags: [Kubernetes,kubectl]
category: Cloud
comments: true
---

## Table of Contents

* [Introduction](#introduction)
* [K9s](#k9s)
* [Octant](#octant)
* [Lens](#lens)
* [Kubenav](#kubenav)
* [Infra.App](#infra-app)
* [Conclusion](#conclusion)

## Introduction

## K9s

[K9s](https://github.com/derailed/k9s){:target="_blank" rel="noopener noreferrer"} is a Kubernetes client built by [Fernand Galiana](https://twitter.com/kitesurfer){:target="_blank" rel="noopener noreferrer"}.
The client is fully terminal based so you'll be using only your keyboard when operating it.
For those who are familiar with Vim, you'll feel right at home in K9s.
It uses similar hotkeys to the popular editor.
There is a (quite steep) learning curve when you start using this client, but once you've read the brief readme on the projects home page and memorize the commands you'll use the most, it's an absolute joy to use.
It feels like using `kubectl` without the requirement to type all commands every time you need to get a deployment.
The tool is quite feature-rich at the time of writing.
You can port-forward, view secrets in plain text, edit resources directly, and "drill-down" from deployments into the logs of a container.

`:deploy` takes you to the pod overview, `<enter>`-ing into the deployment takes you to all pods in that deployment.
`<enter>`-ing again into a pod reveals all containers, including (completed) init-containers.
`<enter>`-ing a final time into a pod takes you straight into a view with live logs.
This hierarchical approach feels very natural and follows the architectural design of Kubernetes.
A similar approach can be used for service (`:svc`), statefulsets (`:sts`) and deamonsets(`:ds`).

Another very familiar shortcut is the usage of `/` to filter on the context you're currently in.
This works on basically any screen where you'd expect it, even in the logs view!

It feels very natural using the tool after a few days of use.
However, for those of us who rather use their mouse to navigate through resources and hate memorizing commands, this tool is not for you.

The project is still under very active development and quite some people are contributing to the codebase.
Since the project doesn't seem to be backed by a company directly, there are no real support guarantees nor is there a fixed release schedule.
The maintainer however accepts fixes quite fast and releases are very frequent, sometimes multiple a day.

Demo: go from deployment to all the way into pod logs
<img alt="k9s from deployment to pod logs" src="{{ '/img/2020-08-06-kubernetes-clients-comparison/k9s-deploy.gif' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 1000px;">

Demo: Switch between 2 Kubernetes contexts
<img alt="k9s context switch" src="{{ '/img/2020-08-06-kubernetes-clients-comparison/k9s-ctx.gif' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 1000px;">

Demo: Find out where a configmap is used
<img alt="k9s config map usage" src="{{ '/img/2020-08-06-kubernetes-clients-comparison/k9s-cm.gif' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 1000px;">

## Octant

## Lens

[Lens app](https://github.com/lensapp/lens){:target="_blank" rel="noopener noreferrer"} is a Kubernetes client with a proper GUI.
It was created by Kontena, Inc, but today it's owned Lakend Labs.
According to their website, they are a collective that wants to keep the software available in the open.

When first starting Lens, it immediately feel very easy to use.
Adding a cluster can be done by hitting the `+` and selecting a cluster from the dropdown.
Lens leverages the contents of the Kubeconfig it finds on the system to discover and authenticate with clusters.
This way no additional magic is needed to get started.

After connecting to a cluster, you're dropped into the cluster overview (see screenshot).
This view provides you with an easy overview of the resources within the cluster and (super useful) provides a list of the last seen error events in the cluster.

Navigating to the list of pods provides an overview of all pods in the cluster.
By clicking on a pod you're provided with the details of that pod (`kubectl describe`).
From here, you can directly dive into the pod logs, shell into the pod, make edits or remove the pod from the cluster.

Similar support is available for most common resources within the cluster: Statefulsets, deployment, configmaps, secrets, ...
The workflow is always the following: open the type in the sidebar on the left, click on an object to get details.
From that details view, certain actions can be performed on the object.

As with most of the tools in this comparison, Lens is quite feature-rich.
Most common types are support and common actions are available.
But Lens has another trick up it's sleeve which makes it different from the other tools: Metrics/Prometheus integration.

The integration relies on a Prometheus instance being installed in the cluster that exposes the supported metrics.
You can opt for Lens to install Prometheus (and other required components) for you, but in real scenarios you either don't have those rights or you'll already have a Prometheus installed in the cluster.
In those cases, you can just [add some configuration](https://github.com/lensapp/lens/blob/master/troubleshooting/custom-prometheus.md){:target="_blank" rel="noopener noreferrer"} to that instance and point the Lens app to that Prometheus instance.
It will use port-forwarding under the hood, so no need to expose the Prometheus instance to the outside.
The integration works nicely and instantly provides some metrics about your cluster and deployed components.
This provides good insights for developers to figure out their resource consumption without leaving their Kubernetes client.
The charts and data seem to be very rudimentary, but improvement are expected to arrive over time.

As most of the client described in this post, Lens app is an open-source project.
There seems to be a group / company behind the development, but no paid / supported version is available at this time.
There is very active development happing on the app and releases are about one month apart, so bugs and new features should be available regularly.

Screenshot: List of pods in Lens
<img alt="Lens pod list" src="{{ '/img/2020-08-06-kubernetes-clients-comparison/lens-pod-list.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 1000px;">

Screenshot: Details about a pod in Lens, including Prometheus supplied metrics
<img alt="Lens pod details" src="{{ '/img/2020-08-06-kubernetes-clients-comparison/lens-pod-details.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 1000px;">

Screenshot: Overview of a cluster in Lens, including the last error events
<img alt="Lens cluster overview" src="{{ '/img/2020-08-06-kubernetes-clients-comparison/lens-cluster-overview.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 1000px;">

## Kubenav

## Infra App
[Infra App](https://infra.app/){:target="_blank" rel="noopener noreferrer"} is a new addition to the list of Kubernetes clients. 
It is made by the people over at Docker Desktop & [Kitematic](https://kitematic.com){:target="_blank" rel="noopener noreferrer"} and is being developed behind closed doors, which has been addressed as unpleasant within the Kubernetes community.
It provides you with a clean, simplistic user interface which groups everything you need to know about a single resource together. 
Everything speaks for itself and all the information you need is within the reach of a few simple clicks.

When you open the application for the first time, they greet you by asking you to fill in your e-mail address. 
This is probably for newsletters and updates, but I wish this step was optional. 

You quickly notice that there is only basic functionality available in the application, which makes sense as the client is still in early access at the time of writing.
You can browse resources per namespace, go through application logs, read and edit YAML configuration and check the current resources used by your deployment. 
There is a metrics interface for the whole cluster aswell, which supplies you with a structured and detailed view about your nodes.

The application is still very young and right now, it is lacking some functionality that you might expect or find in other clients. 
If you want something with more than basic functionality right now, this might not be the application you are looking for. 
However, if it has what you need, you will find that it will be very easy and straight-forward to manage your Kubernetes cluster with this client.

TODO: add image(s) of Infra
## Conclusion