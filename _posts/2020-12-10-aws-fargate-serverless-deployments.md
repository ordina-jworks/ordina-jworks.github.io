---
layout: post
authors: [yolan_vloeberghs]
title: "Serverless Kubernetes deployments with AWS Fargate"
image: /img/2020-12-10-aws-fargate-serverless-deployments.jpg
tags: [AWS, Fargate, Kubernetes]
category: Cloud
comments: true
---
# Prerequisites
 - An AWS account
 - kubectl, aws-cli & eksctl installed
 - Some Kubernetes knowledge

# Introduction
Introduced in late 2017, AWS Fargate is a compute engine for serverless container deployments. 
The engine allows you to run containers without worrying about your infrastructure.   
Node scaling and configuration is done by AWS, which means that you only have to worry about the health of your own resources, not of your Kubernetes infrastructure.  

Fargate eliminates the struggle of configuring, scaling and initializing nodes on its own.
Because as we know, managing clusters / servers / nodes can be a challenging and expensive task.

Pricing is based on the CPU and RAM that is allocated to your pod.
Instead of paying for compute nodes you pay for resources allocated to your pods which could drastically decrease computing costs.

# Setup
AWS Fargate was initially introduced for ECS in 2017. Later in 2019 they added support for EKS.
You can configure your current cluster to integrate Fargate. 
This requires a Fargate pod execution role (to communicate with different Amazon services), and a Fargate profile to specify which pods should use Fargate.
You can also create a new cluster with instant Fargate support. 
For simplicity, I will initialize a new cluster.
 
`eksctl create cluster --name <cluster-name> --region eu-west-1 --fargate`

The initialization process takes a while, so don't wait around for it and find something else to do in the meantime.
It shouldn't take more than 15 minutes.

# Fargate in action
After your cluster has been created, you should see two Fargate nodes already running.
```
$> kubectl get nodes 
NAME                                                    STATUS    ROLES     AGE       VERSION
fargate-ip-192-168-124-46.eu-west-1.compute.internal    Ready     <none>    5m       v1.18.8-eks-7c9bda
fargate-ip-192-168-97-139.eu-west-1.compute.internal    Ready     <none>    5m       v1.18.8-eks-7c9bda
```
This is because of the two CoreDNS pods that get spun up after the setup of the cluster.
```
$> kubectl get pods -n kube-system
NAME                     READY     STATUS    RESTARTS   AGE
coredns-58c89c64-pmjh4   1/1       Running   0          12m
coredns-58c89c64-rm4dr   1/1       Running   0          12m
```

Each pod gets its own Fargate node and represents the resources that the pods get in order to successfully function. 
When you create a new deployment, you will notice that you have a pod in the status pending creation.

```
$> kubectl create deployment spring-boot-docker --image springio/gs-spring-boot-docker
deployment.apps/spring-boot-docker created

$> kubectl get pods
NAME                                  READY     STATUS    RESTARTS   AGE
spring-boot-docker-6656b9d9fb-h82pk   0/1       Pending   0          5s
```

This is because Fargate has yet to create a virtual node for the Pod to run in.
After a few seconds you can see that a new node has been added to your cluster.

```
$> kubectl get nodes 
NAME                                                    STATUS    ROLES     AGE       VERSION
fargate-ip-192-168-113-246.eu-west-1.compute.internal   Ready     <none>    16s       v1.18.8-eks-7c9bda
fargate-ip-192-168-124-46.eu-west-1.compute.internal    Ready     <none>    52m       v1.18.8-eks-7c9bda
fargate-ip-192-168-97-139.eu-west-1.compute.internal    Ready     <none>    52m       v1.18.8-eks-7c9bda
```
Now that your virtual node has been added you can see that your pod is starting up.

```
$> kubectl get pods
NAME                                  READY     STATUS    RESTARTS   AGE
spring-boot-docker-6656b9d9fb-h82pk   1/1       Running   0          2m26s
```

# Conclusion
So right now we have a fully functioning Kubernetes cluster without having to touch or set up any nodes or configuration.
Fargate takes away all the stress of maintaining and scaling worker nodes, so you can concentrate on the actual deployment of your application(s) and not worry about cluster resources.
Of course, you would still need additional resources to access your application from outside the cluster, but it's not covered in this post as this does not fall under the Fargate scope. 
