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
3. [Setting sail with Draft](#setting-sail-with-draft)
3. [Conclusion](#conclusion)

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

Draft does not support many languages yet, 
but it currently supports like Java, Python, Golang, JavaScript, Ruby, Swift, PHP, C# and Clojure.
It also has support for Gradle projects.
You can see all packs [here](https://github.com/Azure/draft/tree/master/packs).

## Installing Draft

Before you can start using Draft,
there are quite a few components that need to be set up before you can start using it.
However, 
if you are using a remote Kubernetes cluster,
you will only need to do the setup once for multiple developers.
Other developers will only need to install the Draft client to benefit.
For this example, we will be using Minikube, 
a local Kubernetes cluster.

The total list of tools required is the following:

- Minikube: a local Kubernetes cluster
- kubectl: the CLI tool for working with Kubernetes
- Tiller: the Helm agent running on the Kubernetes cluster which manages installations of your charts. 
- Helm: the Helm client
- Draftd: the Draft agent running on the Kubernetes cluster

Let's get started!
  
**Downloading all dependencies**
  
We will start by installing the latest release of Minikube using [Homebrew](https://github.com/Homebrew/brew).
If you do not have Homebrew,
you can check how to install it [here](https://kubernetes.io/docs/tasks/tools/install-minikube/)

```
$ brew cask install minikube
==> Satisfying dependencies
All Formula dependencies satisfied.
==> Downloading https://storage.googleapis.com/minikube/releases/v0.25.0/minikube-darwin-amd64
==> Verifying checksum for Cask minikube
==> Installing Cask minikube
==> Linking Binary 'minikube-darwin-amd64' to '/usr/local/bin/minikube'.
minikube was successfully installed!
```

After Minikube has been installed,
we can install Azure Draft!
First, we add the Azure Draft repository by adding a Homebrew tap.

```
$ brew tap azure/draft
```

Now that we have added the repository,
we can install Draft!

```
$ brew install draft
==> Installing draft from azure/draft
==> Downloading https://azuredraft.blob.core.windows.net/draft/draft-v0.10.1-darwin-amd64.tar.gz
/usr/local/Cellar/draft/0.10.1: 5 files, 45.9MB, built in 1 second
```

If you do not use Homebrew,
you can download the latest release of Draft [here](https://github.com/Azure/draft/releases).
You will have to unzip the download and add it to your PATH manually.

**Starting Minikube**

We now have downloaded all required dependencies,
we can start setting up our cluster.
Let's start our Kubernetes cluster.

```
$ minikube start
Starting local Kubernetes v1.9.0 cluster...
Starting VM...
Downloading Minikube ISO
Getting VM IP address...
Moving files into cluster...
Downloading localkube binary
Connecting to cluster...
Setting up kubeconfig...
Starting cluster components...
Kubectl is now configured to use the cluster.
Loading cached images from config file.
```

The cluster is up and ready. 
As you can see from the output,
Minikube also configured our kubectl client by automatically creating a .kubeconfig file.

```
$ kubectl cluster-info
Kubernetes master is running at https://192.168.99.100:8443

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```

**Enabling the Docker Registry**

To be able to use our Draft agent on the server,
we will need to enable the embedded Docker registry on the cluster.
Minikube makes this straightforward using an addon.
We only need to enable it!

```
$ minikube addons enable registry
registry was successfully enabled
```

**Installing Helm**

Now that we have our Minikube up and running,
we can install the Helm server agent (Tiller) and the Helm client.

```
$ helm init
$HELM_HOME has been configured at /Users/tomverelst/.helm.

Tiller (the Helm server-side component) has been installed into your Kubernetes Cluster.
Happy Helming!
```

Even though Tiller is installed now,
you must wait for it to be deployed.
Wait until there is one instance ready!

```
$ kubectl -n kube-system get deploy tiller-deploy --watch
NAME            DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
tiller-deploy   1         1         1            1           4m
```

**Installing Draft**

All requirements are set up now for Draft.
Let's install the final component: Draft!

```
$ draft init --auto-accept
```


