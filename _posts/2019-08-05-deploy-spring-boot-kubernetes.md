---
layout: post
authors: [yolan_vloeberghs]
title: 'Deploying your Spring Boot application with Kubernetes'
image: /img/2019-07-11-deploy-spring-boot-kubernetes/banner.jpg
tags: [Kubernetes,Spring,Spring Boot,Docker,AWS,EKS,Google,GKE,DigitalOcean,Azure,AKS,kubectl,Minikube]
category: Cloud
comments: true
---

## Introduction

Today we are going to look at the features and benefits of using a Kubernetes cluster to deploy your application. As I am mostly focused on Java development, we will use a standard Spring Boot application as an example. 

Assuming you have already heard of Kubernetes, you are probably aware of the continuing growth of this platform. More and more Kubernetes based platforms are growing in popularity because of the proven record of Kubernetes. Examples are OpenShift, Cloud Foundry, PKS, ....

As adaptation is growing, many developers are wondering how to effectively use these platforms to deploy their application in the cloud on a Kubernetes cluster and make full use of its benefits.

Many big providers have already picked up Kubernetes and are providing their own (semi) managed implementations. A couple of examples are [Amazon Web Services (EKS)](https://aws.amazon.com/eks/){:target="_blank" rel="noopener noreferrer"}, [Google Cloud Platform (GKE)](https://cloud.google.com/kubernetes-engine/){:target="_blank" rel="noopener noreferrer"}, [Azure (AKS)](https://azure.microsoft.com/nl-nl/services/kubernetes-service/){:target="_blank" rel="noopener noreferrer"}, [DigitalOcean](https://www.digitalocean.com/products/kubernetes/){:target="_blank" rel="noopener noreferrer"}, .... 

In this post we will take a look at how you can use Kubernetes to deploy a Spring Boot application.

## Prerequisites
* [Docker](https://www.docker.com){:target="_blank" rel="noopener noreferrer"}
* [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/){:target="_blank" rel="noopener noreferrer"}
* [A Spring Boot project](https://www.github.com/yolanv/kubernetesdemo){:target="_blank" rel="noopener noreferrer"}
* A Kubernetes cluster.
This can be a cluster in the cloud, in an on-premise datacenter or you can use [minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/){:target="_blank" rel="noopener noreferrer"} if you want to try this on your local machine.

You can use the project from the prerequisites if you want to try it out with a sample project. This blog post will be based on this project. If you are using an other project, then change the names and labels where necessary. 

## First things first: creating a Docker image

Kubernetes works with Docker images. This means that your application needs to be dockerized so it can be pushed to a Docker registry. You can find a sample Dockerfile below.

```
FROM openjdk:8-jre-alpine
WORKDIR /tmp
COPY target/kubernetesdemo-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```
This is a very basic Dockerfile but it will do for our example. 

<img class="image right" alt="Docker" src="/img/2019-07-11-deploy-spring-boot-kubernetes/docker.png">

The first line tells us to use the **8-jre-alpine** image from the openJDK repository as our base image.
The second line tells the image that it should work from the `/tmp` directory.
The third line copies the compiled JAR (which is compiled with the `mvn clean install` command) file from your `target` folder to the Docker image (you might have to rename the file depending on the name of your project).

Finally, we tell our image to use the `java` command as entry point, meaning that once the Docker image starts running, it has to execute that command.

You can now push this image to your favourite Docker registry, as Kubernetes will need to pull this image from the registry later.
If you do not have a Docker registry, I suggest using [Docker Hub](https://hub.docker.com){:target="_blank" rel="noopener noreferrer"}.
If you are using Docker Hub, you can use the following commands to build and push your application to the registry:

```
docker build -t DOCKER_HUB_USERNAME/APPLICATION_NAME .
docker push DOCKER_HUB_USERNAME/APPLICATION_NAME
````

## Where the magic happens: deploying your application on the Kubernetes cluster

All Kubernetes configurations are written in YAML. The reason for this is that Kubernetes configuration files are meant to be easily readable by the human eye and the Kubernetes team decided to use YAML instead of JSON.

### Deployment

Now that the Docker image is created, we can now deploy it on the Kubernetes cluster. 
First we need to create a deployment configuration file. This file contains the configuration on how the application should run.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kubernetesdemo
  labels:
    app: kubernetesdemo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: kubernetesdemo
    spec:
      containers:
        - name: kubernetesdemo
          image: yolanv/kubernetesdemo
          ports:
            - containerPort: 8080
```
There's a lot going on here which I will be explaining step by step.
The first two lines are telling which Kubernetes API version is being used and what kind of Kubernetes [object](https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/){:target="_blank" rel="noopener noreferrer"} is being applied. As we want to create a new Deployment, we use the Deployment object (easy, right?).

Lines 3 to 6 are just basic metadata tags so the developer knows which application (s)he is working with. This does not affect the behaviour of the application in any way.

Lines 7 to 21 are specifying how the container should be made and which image it has to run. This is the image that we created with the Dockerfile earlier in this post. After that, it describes the port that the container should listen to, which is 8080 in this case. The replica value specifies how many 'instances' (also called [Pods](https://kubernetes.io/docs/concepts/workloads/pods/pod/){:target="_blank" rel="noopener noreferrer"}) that should be running. If the application is expecting a lot of requests, it might be useful to declare a higher number of replicas instead of only one.
Lines 13 to EOF are specifying the environment variables that the container uses. They can either be hard-coded like `SPRING_PROFILES_ACTIVE` or a [Secret](https://kubernetes.io/docs/concepts/configuration/secret/){:target="_blank" rel="noopener noreferrer"} or [ConfigMap](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/){:target="_blank" rel="noopener noreferrer"} can be created, which can then be used in a Deployment configuration, as in the example above.

### Service
The Deployment is up and running, but we need some way to access our pod from the outside world. This is where a [Service](https://kubernetes.io/docs/concepts/services-networking/service/){:target="_blank" rel="noopener noreferrer"} comes in. 
A Service provides external access to a set of Pods and decides which pod should handle the request.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: kubernetesdemo
spec:
  type: NodePort
  selector:
    app: kubernetesdemo
  ports:
    - protocol: TCP
      port: 8080
      nodePort: 30011
```
The first four lines should be familiar.
Instead of a Deployment, we are now declaring a Service.

There are three types of services you can declare: ClusterIP, NodePort and LoadBalancer. It is not recommended to use NodePort in a production environment because of the limited options. Instead you might want to use a LoadBalancer. Most big cloud providers can provide a LoadBalancer for you. Another option is to use an [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/){:target="_blank" rel="noopener noreferrer"}, which is a recommended and popular option. If you want to learn more about this, I suggest you consult the [official Kubernetes documentation](https://v1-13.docs.kubernetes.io/docs/concepts/services-networking/service/#nodeport){:target="_blank" rel="noopener noreferrer"}.
The `nodePort` value can be left out if you want Kubernetes to assign a random NodePort to your service. 

The selector value is meant to find the Pods with the same value as `spec.selector.matchLabels` from the Deployment configuration. This is how the Service is able to find our Pods.
### Applying the configuration

Now that we have our YAML files, we can apply them to the cluster. You can even combine the two configurations into one file and separate them with `---`.
You can use this separator to prevent having too many YAML configuration files.

You can apply the configuration by using the following command: 

```
kubectl apply -f k8s/kubernetesdemo-deployment.yaml
```

The output will be something like:
```
deployment.apps/kubernetesdemo created
service/kubernetesdemo created
```

The application is now accessible through `http://IP_ADDRESS:NODE_PORT`. So if you are using Minikube, the IP should be `http://192.168.99.100:30080/`. 

## Conclusion
There is a lot of documentation available on the internet if you want to learn more about the power of Kubernetes. Think about the options and features that are available when using this platform. You can integrate it with your CI / CD tools (automated deployments!), autoscaling, ... . The options are endless. 
If you have any questions or feedback, I would love to hear them from you.
