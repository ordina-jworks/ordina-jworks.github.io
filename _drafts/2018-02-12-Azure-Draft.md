---
layout: post
authors: [tom_verelst]
title: 'Azure Draft'
image: /img/2018-02-12-Azure-Draft/draft-logo.png
tags: [Azure, Draft, Kubernetes, Helm, Docker, CloudFoundry, PaaS]
category: Docker
comments: true
---

# Table of contents
1. [Introduction](#introduction)
2. [Installing Draft](#installing-draft)
3. [Setting Sail with Draft](#setting-sail-with-draft)
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
but it currently supports most of the popular languages like Java, Python, Golang, JavaScript, Ruby, Swift, PHP, C# and Clojure.
It also has support for Gradle and Maven projects.
You can see all packs [here](https://github.com/Azure/draft/tree/master/packs).

## Installing Draft

Before you can start using Draft,
there are quite a few components that need to be set up.
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
you can check how to install Minikube [here](https://kubernetes.io/docs/tasks/tools/install-minikube/).

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

Now we have downloaded all required dependencies,
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
Installing default plugins...
Installation of default plugins complete
Installing default pack repositories...
Installing pack repo from https://github.com/Azure/draft
Error: Unable to update checked out version: exit status 128
Error: exit status 1
```

Uh, oh! Seems like Git cannot clone the Draft pack repo.
According to [this GitHub issue](https://github.com/Azure/draft/issues/522),
this happens with Git version 2.16+.

If you have this error, the workaround currently is to manually add a specific version of the pack repo.

```
$ draft pack-repo add https://github.com/Azure/draft --version v0.10.0
Installing pack repo from https://github.com/Azure/draft
Installed pack repository github.com/Azure/draft
```

We manually installed the Draft pack repo now. 
Let's try to set up Draft again.

```
$ draft init --auto-accept
Installing default plugins...
Installation of default plugins complete
Installing default pack repositories...
Installation of default pack repositories complete
$DRAFT_HOME has been configured at /Users/tomverelst/.draft.

Draft detected that you are using minikube as your cloud provider. AWESOME!
Draftd has been installed into your Kubernetes Cluster
Happy Sailing!
```

Great.
The workaround works! 
As you can see, Draft is still in alpha and will not properly work yet. 

This setup is of course for local development.
If you want to have a production ready, RBAC enabled, Draft setup on a remote Kubernetes cluster,
you can take a look at the [Advanced Installation guide](https://github.com/Azure/draft/blob/master/docs/install-advanced.md).

## Setting Sail with Draft

If you managed to get to this point,
you either went through all the effort to set everything up,
or you skipped to this part!

We can now start drafting up some applications. 
Since I am a fan of Go, 
I will start with drafting up a Go application.
Here is a simple Go application that listens on port 8080 and returns "Hello Draft!".

```
package main

import (
    "fmt"
    "net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello Draft!")
}

func main() {
    http.HandleFunc("/", handler)
    http.ListenAndServe(":8080", nil)
}

```

Let's run it to see if it works.

```
$ go run main.go

# Open a separate terminal
$ curl localhost:8080
Hello, Draft!
```

The application works. 
Now we can let Draft create the Dockerfile and the Helm chart.

```
$ draft create
--> Draft detected Go (100.000000%)
--> Ready to sail
$ ls
Dockerfile	charts		draft.toml	main.go
$ ls charts/go
Chart.yaml	charts		templates	values.yaml
```

Draft detected that it was a Go application, 
It generated a Dockerfile and the Draft deployment descriptor,
and it also copied the Go pack to the `charts` directory.
This is great, as it enables the possibility to customize the pack for this specific application.

Let's take a look at the generated Dockerfile.

```
$ cat Dockerfile
FROM golang:onbuild
ENV PORT 8080
EXPOSE 8080
```

The official Golang *onbuild* image is used.
This image is great for development purposes,
but I would not recommend using this image for production purposes,
as it is around **700MB**, 
while the application is only a few lines of code.

For demo purposes, 
let's continue to use this generated Dockerfile,
and try to deploy our application on Kubernetes using Draft.

```
$ draft up
Draft Up Started: 'goapp'
goapp: Building Docker Image: SUCCESS ?  (60.1681s)
goapp: Pushing Docker Image: SUCCESS ?  (63.0775s)
goapp: Releasing Application: SUCCESS ?  (0.5346s)
goapp: Build ID: 01C653GK70A7SR2FMT2325TBHD
```

Building and pushing this application took around 2 minutes,
which seems pretty long,
but that is highly likely because of the 700MB base Docker image.
This image first needs to be downloaded.
Then it needs to be pushed to the registry.

We can connect to the application using `draft connect`.

```
$ draft connect
Connecting to your app...SUCCESS...Connect to your app on localhost:50066
Starting log streaming...
+ exec app
```

Let's see how the application is installed on our cluster.

```
$ kubectl get deployment
NAME       DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
goapp-go   2         2         2            2           5m

$ kubectl get svc
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
goapp-go     ClusterIP   10.103.78.13   <none>        80/TCP    4m
kubernetes   ClusterIP   10.96.0.1      <none>        443/TCP   1h

$ kubectl get pods
NAME                       READY     STATUS    RESTARTS   AGE
goapp-go-88f4b7bc7-4cltn   1/1       Running   0          4m
goapp-go-88f4b7bc7-wt7kx   1/1       Running   0          4m
```

As you can see,
our application has successfully been deployed to Kubernetes,
and is deployed using a Kubernetes *Deployment* resource.

The services are not exposed by default,
so we will need to either use `kubectl port-forward <pod> 8080`,
or SSH into our cluster.

```
$ minikube ssh
$ curl 10.103.78.13
Hello Draft! 
```

If you want to expose your applications automatically using Draft,
you can use a Kubernetes *Ingress Controller* for this.
You will need to enable an *Ingress Controller* in Kubernetes (`minikube addons enable ingress`),
and initialize draft with the `--ingress-enabled` flag.
More information about this can be found [here](https://github.com/Azure/draft/blob/master/docs/ingress.md).

**Deploying changes**

Draft is meant to be used during development,
so it is important we can push changes.
Let's make a change to our application.

```
func handler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Bye Draft!")
}
```

Now that we have made some changes,
let's try to deploy our new version.
This is done using the same command.

```
$ draft up
Draft Up Started: 'goapp'
goapp: Building Docker Image: SUCCESS ?  (12.0163s)
goapp: Pushing Docker Image: SUCCESS ?  (16.0110s)
goapp: Releasing Application: SUCCESS ?  (0.2311s)
goapp: Build ID: 01C65507WTBX5EAJKWWR53T652
```

The build time has gone down from 2 minutes, to 28 seconds.
This is because the Golang Docker image no longer needs to be downloaded and/or pushed to the Docker registry.

The deployment is updated with the new version of the application.
Old pods are taken down by Kubernetes and new ones are started.

```
$ kubectl get pods
NAME                        READY     STATUS              RESTARTS   AGE
goapp-go-6fb684d887-2kq69   0/1       ContainerCreating   0          23s
goapp-go-6fb684d887-qmth6   1/1       Running             0          23s
goapp-go-88f4b7bc7-wt7kx    0/1       Terminating         0          19m

$ minikube ssh
$ curl 10.103.78.13
Bye  Draft! 
```
Our changes are now deployed to the Kubernetes cluster!

## Conclusion

Draft is great for local development using Kubernetes.
It is meant to be used before committing and pushing your code.

Applications can be deployed to Kubernetes within minutes,
without requiring to write Dockerfiles and/or Kubernetes resource files.

Azure Draft is still experimental for now, 
but the development team is active, 
and I have not run into many issues yet.

It brings one of CloudFoundry's best features, namely build packs, to Kubernetes.
It's definitely worth a try!

## Resources
- [Draft website](https://draft.sh)
- [Draft GitHub](https://github.com/azure/draft)
- [Helm](https://helm.sh/)