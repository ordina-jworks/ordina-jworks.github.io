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

K9s is a Kubernetes client built by [Fernand Galiana](https://twitter.com/kitesurfer){:target="_blank" rel="noopener noreferrer"}.
The client is fully terminal based so you'll be using only your keyboard when operating it.
For those who are familiar with Vim, you'll feel right at home in K9s.
It uses similar hotkeys to the popular editor.
There is a (quite steep) learning curve when you start using this client, but once you've read the brief readme on the projects home page and memorize the commands you'll use the most, it's a absolute joy to use.
It feels like using `kubectl` without the requirement to type all commands every time you need to get a deployment.
The tool is quite feature rich at the time of writing.
You can port-forward, view secrets in plain text, edit resources directly and "drill-down" from deployments into the logs of a container.

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
Since the project doesn't seem to be really backed by a company directly, there are no real support guarantees nor is there a fixed release schedule.

//TODO insert screenshot of K9S, maybe a gif with the keys used in some common scenarios.

## Octant

## Lens

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