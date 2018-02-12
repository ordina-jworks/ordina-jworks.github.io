---
layout: post
authors: [tom_verelst]
title: 'Azure Draft'
image: /img/2018-02-15-Azure-Draft/draft-logo.png
tags: [Azure, Draft, Kubernetes, Helm, Docker, CloudFoundry, PaaS]
category: Docker
comments: true
---

# Table of contents
1. [Introduction](#introduction)
2. [Installing Draft](#installing-draft)
3. [Building with Draft](#building-with-draft)

## Introduction

[Draft](https://github.com/Azure/draft) is an open-source tool from Microsoft Azure.
It attempts to make the development for Kubernetes clusters easier, 
by getting Docker and Kubernetes out of the way.

Developers no longer require Docker,
and can just push their applications to a remote Kubernetes clusters using Draft.
Draft accomplishes this by using only two simple commands.

The first command is `draft create`.
This tool detects the application language, 
and writes out a Dockerfile and a [Kubernetes Helm](https://github.com/kubernetes/helm) chart in the source tree.
These files are generated based on Draft "packs".
These packs are simple scripts that only detect the language
and write out the Dockerfile and Helm charts.
The idea is based on some features of PaaS systems like the CloudFoundry's *buildpacks*.
The only difference is that the build and deployment descriptors are stored in the source tree.

The second command is `draft up`.
First, all source code will be uploaded to any Kubernetes cluster, 
local or remote.
Then, the application is built on the cluster using the generated Dockerfile.
Finally, the built image is deployed to a dev environment using the Helm Chart.

## Installing Draft

Before you can start using Draft,
there are quite a few components that need to be set up before you can start using it.
However, 
if you are using a remote Kubernetes cluster,
you will only need to do the setup once for multiple developers.
Other developers will only need to install the Draft client to benefit.









