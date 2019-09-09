---
layout: post
authors: [pieter_vincken]
title: 'Kustomize: Kubernetes configuration management, the easy way'
image: /img/2019-09-09-kustomize/banner.png
tags: [Kustomize, Configuration Management, Kubernetes, Cloud]
category: Cloud
comments: true
---

# Table of contents

* [What problem do we have?](#what-problem-do-we-have)
* [What alternatives are available to solve this problem?](#what-alternatives-are-available-to-solve-this-problem)
* [What is Kustomize and how to use it](#what-is-Kustomize-and-how-to-use-it)
* [Conclusion](#conclusion)

## TODO

* DONE What problem do we have?
    * Configuration management for different environments
* DONE What alternatives are available to solve this problem?
    * Compare it with Helm 2, 3 and OpenShift Template
* What is Kustomize and how to use it. 
* Show base + overlay setup for environments
* Show variant approach
* Conclusion

## What problem do we have?

Deploying components to a Kubernetes cluster should be as easy as running `kubectl apply -f folder-with-deployment-manifests`. 
This approach works very well for a single environment, but quickly become very hard to do properly when managing multiple environment (Dev, Staging, ..., Production). 
The reason for this is due to the configuration differences on these environments.
Every environment needs different configuration to: connect to different databases, use other secret values, use different deployment configuration (number of replicas for example), ...
Managing these differences can be very hard to do in a single set of manifests.

## What alternatives are available to solve this problem?

Luckily this problem exists in many organisations and the community already created multiple tools to help solve the problem. 
In the scope configuration management for Kubernetes the following tools are in scope:

* [OpenShift Templates](https://docs.openshift.com/container-platform/4.1/welcome/index.html)
* [Helm 2](https://helm.sh/)
* [Helm 3](https://v3.helm.sh/)
* [Kustomize](https://kustomize.io/)

OpenShift Templates are part of the OpenShift platform and can be used both to template manifests in a repository and to provide a off-the-shelve experience in the OpenShift platform itself.
For example, a cluster administrator can install a template for a Apache Kafka setup.
By provisioning this template (through the online UI or the CLI) and providing the required template values, the service can be provisioned like the administrator provides it. 
This is a very powerfull approach to allow developers to provision supporting systems directly in the platform. 

Helm 2 is a templating and deployment management tool. 
In Helm 2 a server side component needs to be installed in the cluster named Tiller. 
Tiller is the central entrypoint and management component for all deployments using Helm 2.
It keeps the state of all deployed manifests and groups them together as a single `release`.
//TODO keep? The main disadvantage of Helm 2 is the lack of proper authorization / RBAC support as Tiller will run with almost root level priviliges on the cluster.
//TODO keep? Another issue in the scope of this blogpost is that is does more than just configuration management, it actually provides very basic release management.

Helm 3 is currently still in beta, but the reworked version should resolve a lot of the issues with Helm 2.
Like Helm 2 it's still a templating engine which also manages releases. 
Unlike Helm 2, it doesn't use the Tiller component anymore to manage all the state connected to the release.
More information about Helm can be found in other blogpost ([Links](#useful-links))

Kustomize is a Kubernetes configuration management tool that is provided as part of the `kubectl` command, behind the `-k` flag.
Kustomize allows a user to use standard Kubernetes manifests and overlay any changes that they want to make using an overlay manifest.
Unlike Helm, Kustomize only provides the configuration management and doesn't manage any state about the manifests it adapts.
Unlike Helm and OpenShift Templates, the main goal of Kustomize is to allow users to adapt their existing manifests in any thinkable way, instead of templating some parts of the manifest that can be edited.

## What is Kustomize and how to use it

As briefly discussed, Kustomize is a configuration management tool that has been embedded into `kubectl`.
Originally it was a seperate tool and some functionality is still only available in the Kustomize binary and not in Kubectl.
The documentation of Kustomize is therefore available in two parts, the core docs and the Kubectl docs ([Links](#useful-links)).

As discussed on the Kustomize projects [readme](https://github.com/kubernetes-sigs/kustomize/) a Kustomize manifest exists out of two main structures: a base manifest and overlays.

### Base manifest

A base manifest is in essence a set of bare bones Kubernetes manifests.
For the scope of this blogpost a single base manifest will contain all configuration to deploy a single service.

Let's assume the following set of Kubernetes manifests:
```
├── deployment.yaml
├── ingress.yaml
└── service.yaml
```

These manifests can deploy one of our apps to a cluster.
It will create a deployment, a service exposing the app to the cluster and an ingress object that will allow connections from outside of the cluster to be setup.
Managing a set of these manifests in separate files or even in one file, can be a bit challenging and ofter results into violating the Don't-Repeat-Yourself (DRY) principle.
Kustomize can assist in preventing this and allows the user to more generally manage their manifests.

Adding Kustomize to a set of manifests is as easy as creating a `kustomization.yaml` file and running `kustomize build`.

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

# Add labels to all objects created by this kustomize manifest.
commonLabels:
    app: task-service

resources:
- deployment.yaml
- service.yaml
- ingress.yaml
```

In this example only a single feature of Kustomize is used, namely the `commonLabels` option. 
This option makes Kustomize add the label to all managed manifests at build time (when running `kubectl apply -k` or `kustomize build`). 

Other options like image overrides, namespaces overrides and name prefixing are also available. 
For more information on these features check out the documentation [here](https://kubectl.docs.kubernetes.io/pages/app_management/introduction.html). 

## Overlay manifest



## Conclusion

## Useful links

* [Kubectl-Kustomize docs](https://kubectl.docs.kubernetes.io/pages/app_management/introduction.html)
* [Kustomize core docs](https://github.com/kubernetes-sigs/kustomize/tree/master/docs)
* [Helm blogpost](//TBD)
