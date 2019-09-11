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
* [Conclusion](#conclusion-when-to-use-kustomize)

## TODO

* DONE What problem do we have?
    * Configuration management for different environments
* DONE What alternatives are available to solve this problem?
    * Compare it with Helm 2, 3 and OpenShift Template
* DONE What is Kustomize and how to use it. 
    * Show base + overlay setup for environments
    * Show variant approach
* Real world example
* DONE Conclusion

## What problem do we have?

Deploying components to a Kubernetes cluster should be as easy as running `kubectl apply -f folder-with-deployment-manifests`. 
This approach works very well for a single environment, but quickly become very hard to do properly when managing multiple environment (Dev, Staging, ..., Production). 
The reason for this is due to the configuration differences in these environments.
Every environment needs different configuration to: connect to different databases, use other secret values, use different deployment configurations (number of replicas for example), ...
Managing these differences can be very hard to do in a single set of manifests.

## What alternatives are available to solve this problem?

Luckily this problem exists in many organizations and the community already created multiple tools to help solve the problem. 
In the scope configuration management for Kubernetes the following tools are in scope:

* [OpenShift Templates](https://docs.openshift.com/container-platform/4.1/welcome/index.html)
* [Helm 2](https://helm.sh/)
* [Helm 3](https://v3.helm.sh/)
* [Kustomize](https://kustomize.io/)

OpenShift Templates are part of the OpenShift platform and can be used both to template manifests in a repository and to provide an off-the-shelve experience in the OpenShift platform itself.
For example, a cluster administrator can install a template for an Apache Kafka setup.
By provisioning this template (through the online UI or the CLI) and providing the required template values, the service can be provisioned like the administrator provides it. 
This is a very powerful approach to allow developers to provision supporting systems directly in the platform. 

Helm 2 is a templating and deployment management tool. 
In Helm 2 a server-side component needs to be installed in the cluster named Tiller. 
Tiller is the central entry point and management component for all deployments using Helm 2.
It keeps the state of all deployed manifests and groups them together as a single `release`.
//TODO keep? The main disadvantage of Helm 2 is the lack of proper authorization / RBAC support as Tiller will run with almost root-level privileges on the cluster.
//TODO keep? Another issue in the scope of this blog post is that it does more than just configuration management, it provides very basic release management.

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
Originally it was a separate tool and some functionality is still only available in the Kustomize binary and not in Kubectl.
The documentation of Kustomize is therefore available in two parts, the core docs and the Kubectl docs ([Links](#useful-links)).

As discussed in the Kustomize projects [readme](https://github.com/kubernetes-sigs/kustomize/) a Kustomize manifest exists out of two main structures: a base manifest and overlays.

Important to note, especially when considering the usage of this tool, is what it doesn't do:
* It doesn't manage deployments
* It doesn't package applications in deployable artifacts
* It doesn't manage secrets securly

### Base manifest

A base manifest is, in essence, a set of bare-bones Kubernetes manifests.
For the scope of this blog post, a single base manifest will contain all configuration to deploy a single service.
//TODO keep? Kustomize doesn't require this, but it seems like a good fit.

Let's assume the following set of Kubernetes manifests:
```
├── deployment.yaml
├── ingress.yaml
└── service.yaml
```

These manifests can deploy one of our apps to a cluster.
It will create a deployment, a service exposing the app to the cluster and an ingress object that will allow connections from outside of the cluster to be setup.
Managing a set of these manifests in separate files or even in one file, can be a bit challenging and ofter results in violating the Don't-Repeat-Yourself (DRY) principle.
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

In this example, only a single feature of Kustomize is used, namely the `commonLabels` option. 
This option makes Kustomize add the label to all managed manifests at build time (when running `kubectl apply -k` or `kustomize build`). 
Other options like image overrides, namespaces overrides and name prefixing are also available. 
For more information on these features check out the documentation [here](https://kubectl.docs.kubernetes.io/pages/app_management/introduction.html). 

### Overlay manifest

The second half of the cake in Kustomize are the overlays. 
Overlays are yaml snippets, Kustomize configuration and/or even full manifests that can be used to adapt a base manifest.

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

bases:
- ../../base
- git::ssh://git@some-git-provider:some-repo-path.git//folder-in-repo-with-kustomize-config?ref=branch
- github.com/project/repo//folder-in-repo?ref=branch
...
```

In the default setup on the Kustomize homepage, the bases are always local folders. 
However, a really useful feature is referencing remote locations, including git repositories, as bases to be used in an overlay. 
The git endpoints need to be specified as described in the [hashicorp/go-getter URL format](https://github.com/hashicorp/go-getter#url-format). 
Important to not here is that when using the git references, the machine that is executing kustomize build needs a valid SSH or git configuration to access the referenced repositories.
As the kustomization file is checked into version control, adding credentials into the link is not recommended.
Kustomize support referencing multiple bases, which again allows for a lot of flexibility. 
The references works recursively, so multiple levels of manifests are supported.

The way Kustomize builds a template is the following:

1. Download the remote bases to a temporary folder
1. Executed `kustomize build` on all of the bases
    1. This will include executing any generators that are configured in the bases.
1. Add any manifests that are listed in the resources section.
1. Apply the patches, generators to the (generated) manifests of the bases. 

This order of execution is important to remember when creating setups, especially when using overrides for generators in the base. 
E.g. when using a config map generator in the overlay, a config map generator needs to be used in the base as well, otherwise Kustomize will not allow the override to be executed. 
This is because the config map generator adds a random ID to the name of each generated config map and cannot determine whether to change the config maps in the base template as well.

## Real world example

In the last section of this post, a simple example setup will be shown and dicussed.
Consider the following scenario: 

//TODO

## Conclusion: When to use Kustomize?

Kustomize great tool to have in Kubernetes toolbox to simplify configuration management in Kubernetes.
DRY principles can be adhered to and managing configuration code can be done in a structured and unified way.
Kustomize is a great fit when different environments require different configuration for a microservice. 
Especially when sensible defaults can be added to the base template and only a small amount of overrides are required per environment. 
When compared to Helm, both version 2 and 3, Kustomize doesn't polute the original manifests with templating code.

Kustomize is a configuration management tool for Kubernetes. 

* Have a lot of configuration code being duplicated across environments?
* Have a complex CD setup with manual steps to deploy configuration to a specific environment?
* Hate using templating engines?
* Really really really like using Kubernetes?

If all of the above are true for you, start using Kustomize today and experience it yourself!

## Useful links

* [Kubectl-Kustomize docs](https://kubectl.docs.kubernetes.io/pages/app_management/introduction.html)
* [Kustomize core docs](https://github.com/kubernetes-sigs/kustomize/tree/master/docs)
* [Helm blogpost](//TBD)
