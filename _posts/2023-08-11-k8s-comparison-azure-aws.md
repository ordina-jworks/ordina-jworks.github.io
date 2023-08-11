---
layout: post
authors: [pieter_vincken]
title: 'Are all Kubernetes clusters created equally?'
image: /img/2023-08-11-k8s-comparison-azure-aws/header.png
tags: [cloud, automation, cicd, terraform, iac, azure, aws]
category: Cloud
comments: false
---

> Like stars in the night sky, managed Kubernetes services vary in brilliance; not all shine equally, but the right one can illuminate your journey to cloud-native excellence. - ChatGPT 2023

- [Introduction](#introduction)
- [Journey](#journey)

# Introduction

//What is k8s?

//Why is k8s important?
Kubernetes has been the de-facto standard for cloud-native container orchestration for some years now. 

//why mgd k8s?

Running Kubernetes yourself can be very hard to do properly.
Managing all the moving parts, especially when the workloads running are changing frequently and use more advanced features, can be challenging, to say the least. All hyper-scale (and more and more smaller scale) providers have managed Kubernetes offerings for customers that do want to leverage the power of Kubernetes, but don't want the hassle of managing all the different pieces of the solution. 
Google has its Google Kubernetes Engine, GKE for short, Azure has its Azure Kubernetes Service, AKS, and lastly, Amazon has its Elastic Kubernetes Service, EKS for short. 
Although all of these services deliver a Kubernetes cluster, they aren't all created equally as we'll see further in this blog post.

//why k8s just one part of the story/not the complete picture?
For most deployments of Kubernetes, Kubernetes itself is only part of the software stack of a software project. 
A plethora of extensions, add-ons and so-called operators are used to extend the default functionality and integrate external services into Kubernetes for easier management of those resources. 
Some common examples are the `external-dns` operator, `certmanager` and the `cluster auto scaler` projects. 
These all add additional functionality, DNS management, Certificate Management and auto-scaling capabilities respectively, to the cluster. 

Many articles have been written about how the different offerings compare w.r.t. speed, scaling and default feature set. 
This blog post aims to provide a comparison from a practical, end-user perspective when installing all the bells and whistles needed to use the platform to host all required components to build and run a simple web application in a cloud-native way. 

# Journey

This section discusses will go into detail about the software stack used for the comparison and how that stack was selected. 
If you're just interested in the comparison, feel free to skip this section.

The platform used in the comparison is based on a real-world use case for a customer in the financial services sector. 
They operate the platform to build and host their core application, a microservices architecture consisting of 35+ services including third-party services like Apache Kafka, PostgreSQL and Elasticsearch just to name a few. 

The design principles can be summarized into the following:

- Provide a uniform experience to the developers, regardless of the underlying cloud provider
- Automate as much as possible
- Use managed services where possible and integrate them into the cluster
- Reduce maintenance efforts where possible
- Buy before build, prioritize Free OpenSource Software (FOSS) from the Cloud-Native Computing Foundation (CNCF) over Commercial Of The Shelf (COTS) solutions.

This has led to the following architecture: 

- Azure Kubernetes Service (AKS) for the cluster.
- Azure Key Vault for secrets, keys and certificate management and storage.
- Azure Storage Accounts for any blob storage (archival of logs, long-term metrics storage, Terraform state files, backups, ...)
- Azure Virtual Machine Scale Sets to host the Kubernetes data plane
- Azure Container Registry for (Docker) container image storage
- ArgoCD to manage deployments through a GitOps workflow
- Tekton CI/CD for all workflow automation
- Elastic Cloud on Kubernetes for managing all logs and exposing them to developers
- Prometheus for all monitoring-related activities including Alertmanager for alerting and Thanos for easy federation and long-term storage
- Grafana for all operational dashboarding
- Tons of operators to manage all of the 3rd-party integrations and tools deployed on the cluster (Prometheus operator, Tekton operator, ECK operator, external secrets operator, ...).

This setup can be reviewed in the demo repository for this blog post (link below #TODO).

The platform was originally built to run on top of Azure AKS, with the mindset that it should be easy to migrate to another cloud provider at some point. 
For this comparison, the setup was re-platformed on top of AWS EKS with the same design principles in mind.
Although careful thought has gone into making the comparison as fair as possible, some decisions might have been influenced due to this history, so keep that in mind when reading the comparison later in this post. 

<!-- - Platform backstory (CI/CD + Web application)
- Real world cluster on Azure
- Ported to AWS -->

# Comparison

- Architectural components for k8s setup
- Iac Complexity
- Out-of-the-box comparison
    - Auto-scaling
    - (Disk) storage
    - Load balancers
- Identity
- Basic integrations
    - Secrets
    - DNS
    - Ingress
- Monitoring
- Logging

# Further in series

- In-depth comparison for Logging (ECK, LGTM and cloud specific)
- In-depth comparison for Monitoring (CNCF stack and cloud specific)
- Secret management opions (cloud specific, external secrets operator, Hashicorp Vault)
- How k8s operators can make your life easy with just enough magic
- CI/CD options: ArgoCD, ArgoWorkflow, Azure DevOps, AWS DevOps

If you want help with cloud adoption in your company or want to provide feedback, feel free to contact [Pieter](https://be.linkedin.com/in/pieter-vincken-a94b5153){:target="_blank" rel="noopener noreferrer"} on LinkedIn!