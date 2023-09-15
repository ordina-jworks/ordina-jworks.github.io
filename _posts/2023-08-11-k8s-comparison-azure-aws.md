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

<!-- //What is k8s? -->

<!-- //Why is k8s important? -->
Kubernetes has been the de-facto standard for cloud-native container orchestration for some years now.
Organizations that rely on a microservices architecture, often rely on Kubernetes to be their platform to deploy to. 
One of the biggest selling points, especially in recent years, is that Kubernetes can provide a very similar user experience for developers across different on-premise and cloud environments.
It can provide a common abstraction from the underlying infrastructure through its API. 
This also allows solutions build on top of Kubernetes to be easily portable across different environments.
Or at least, that's the promise that is being made by Kubernetes platform teams across the industry.

<!-- //why mgd k8s? -->

Running Kubernetes yourself can be very hard to do properly.
Managing all the moving parts, especially when the workloads are changing frequently can be challenging, to say the least.
Mix in the usage of more advanced features like a service mesh, custom operators or multi-cloud cluster and it can become a real challenge to maintain.
All hyper-scale (and more and more smaller scale) providers have managed Kubernetes offerings for customers that do want to leverage the power of Kubernetes, but don't want the hassle of managing all the different pieces of the solution. 
Google has its Google Kubernetes Engine, GKE for short, Azure has its Azure Kubernetes Service, AKS, and lastly, Amazon has its Elastic Kubernetes Service, EKS for short. 
Although all of these services deliver a Kubernetes cluster, they aren't all created equally as will become clear further in this blog post.

<!-- //why k8s just one part of the story/not the complete picture? -->
For most deployments of Kubernetes, Kubernetes itself is only part of the software stack of a software project. 
A plethora of extensions, add-ons and so-called operators are used to extend the default functionality and integrate external services into Kubernetes for easier management of those resources. 
Some common examples are the `external-dns` operator, `certmanager` and the `cluster auto scaler` projects. 
These all add additional functionality, DNS management, Certificate Management and auto-scaling capabilities respectively, to the cluster. 

Many articles have been written about how the different offerings compare w.r.t. speed, scaling and default feature set. 
This blog post aims to provide a comparison from a practical, end-user perspective when installing all the bells and whistles needed to use the platform to host all required components to build and run a web application in a cloud-native way. 

# The use-case

This section will go into detail about the software stack used for the comparison and how that stack was selected. 
If you're just interested in the comparison, feel free to skip this section.

The platform used in the comparison is based on a real-world use case for a customer in the financial services sector. 
They operate the platform to build and host their core application, a microservices architecture consisting of 35+ services including third-party services like Apache Kafka, PostgreSQL and Elasticsearch just to name a few. 

The design principles can be summarized into the following:

- The main deployable artifact is a (Docker) container image
- Provide a uniform experience to the developers, regardless of the underlying cloud provider
- Automate as much as possible
- Use managed services where possible and integrate them into the Kubernetes cluster
- Reduce maintenance efforts where possible
- Buy before build, prioritize Free Open Source Software (FOSS) from the Cloud-Native Computing Foundation (CNCF) over Commercial Of The Shelf (COTS) solutions.

This has led to the following architecture: 

<!-- TODO create summary diagram -->

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
- Tons of operators to manage all of the 3rd-party integrations and tools deployed on the cluster
    - Prometheus operator
    - Tekton operator
    - ECK operator
    - External secrets operator
    - Zalando PostgreSQL operator
    - ...

This setup can be reviewed in the demo repository for this blog post (link below #TODO).

The platform was originally built to run on top of Azure AKS, with the mindset that it should be easy to migrate to another cloud provider at some point. 
For this comparison, the setup was re-platformed on top of AWS EKS with the same design principles in mind.
Although careful thought has gone into making the comparison as fair as possible, some decisions might have been influenced due to this history, so keep that in mind when reading the comparison later in this post. 
This comparison will only consider AWS and Azure cloud platforms.

# Comparison

This post will provide a high-level comparison between the two cloud providers AWS and Azure. 
The stack that was described above will be deployed to both clouds according to the design principles. 
In line with the design principles, choices were made to integrate with different managed services, as long as the same developer experience in the cluster is maintained. 

## Architectural components for kuberentes setup

From an architectural perspective, both setups are very similar and highly specific to the cloud of choice at the same time.

Let's start with the Kubernetes control plane. 
This is very similar for both AWS and Azure as these are both fully managed services that are deployed and maintained by the provider.
In both cases, no access to the actual control plane nodes is available, nor are they even visible. 
The etcd is not exposed to the customer in either of the provider's managed services. 
They both support public (default) and private control plane deployments. 

W.r.t. the data plane, the setups are similar as well. 
On AWS, the data plane runs on AWS EC2 nodes using Auto-Scaling Groups (ASG).
On Azure, it runs on top of Azure Virtual Machines using VM Scale-Sets.
Out of the box, these nodes are deployed into their equivalent of a private network, VPC or VNET, and a group of nodes is assigned to a subnet of that network. 

AWS has the option to not run directly on top of EC2 instances, but use AWS Fargate instead. 
This service allows EKS to deploy containers without having to spin up and maintain nodes.
A similar option is available on Azure, namely Azure Container Instances. 
Due to some caveats with the integrations which cause bad portability, these options were excluded from this comparison.

## How managed is the managed service?



## Out of the box support

### Auto-scaling cluster nodes

One of the big advantages of using a public cloud provider is that your "hardware" footprint can easily scale up and down, so call elasticity of the cloud. 
It's such a big selling point for public cloud that AWS used it for their service naming scheme. 

It's no wonder that it's also a key feature for the managed Kubernetes offerings for the different cloud providers.
Both AWS and Azure support using the standard Kubernetes autoscaler project to automatically provision and destroy additional capacity for the data plane.
However, their support and documentation is significantly different. 

Enabling autoscaling on AKS is as easy as enabling the option during cluster creation.
When adding the default (or any other) nodepool, the autoscaling option can be enabled. 
This option will make sure that all required components, resources and configuration is created to support autoscaling of the data plane nodes.
This includes installing the cluster auto scaler component into the cluster and setting up the required roles and rights for it to manage the node pool(s).
The [Azure AKS documentation](https://learn.microsoft.com/en-us/azure/aks/cluster-autoscaler) shows how it can be enabled.
There is some configuration possible, but the cluster auto scaling configuration will be managed by Azure and isn't available to user to change.

On EKS, the journey is a bit more hands-on.
[AWS EKS documentation](https://docs.aws.amazon.com/eks/latest/userguide/autoscaling.html) lists two default options to enable auto scaling of the data plane nodes: Karpenter and cluster auto scaler. 
Enabling these options is completely up to the infrastructure maintainer and the resources required to enable the integration need to be deployed by the infrastructure maintainer, it's not a single "add-on" that can be enabled.
Installing the cluster auto scaler into EKS required setting up an IAM role for the auto scaler to access the AWS EC2 Auto Scaling Groups, a deployment of the cluster auto scaler itself into the cluster and making sure it's configured correctly to update the correct cluster (some auto discovery is possible). 
There are Helm charts, Terraform modules and good documentation available to set all of it up easily. 
The advantage of this approach is that it's highly configurable, but it's more work to configure.

### Disk Storage

This blogpost won't go into the discussion whether running stateful workloads on Kubernetes is a good or bad idea.
It will however discuss how persistent storage can be used and integrated in the Kubernetes clusters. 
For the use-case discussed earlier, persistent storage is needed for the CI tool: Tekton. 
For disk integration, only integrations with Kubernetes Persistent Volumes are considered.

Both AWS and Azure have support for integrating the disk based storage solutions directly into the cluster: Elastic Block Storage (EBS) for AWS and Managed Disks for Azure.
This allows a developer to specify a [Kubernetes Persistent Volume Claim](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) and the cloud provider will automatically provision the required disks, attach it to the node running the workload and make it available to the pod. 
For both cloud providers, most of their disk types are supported.

Support for persistent volumes is enabled by default for AKS cluster. 
A standard deployment of an AKS cluster includes the deployment of the required Azure Disks CSI driver into cluster. 
The Azure Disks CSI driver is the default storage class used in the cluster. 
Disks created through storage classes enabled by this driver, will be backed by Azure Managed Disks automatically. 

On AWS's EKS, persistent storage support needs to be explicitly enabled.
AWS provides an add-on that can be enabled to provide support for EBS on EKS. 
The EBS CSI driver add-on provides support for using EBS volumes in the cluster.
Any persistent volumes created in the cluster will trigger the creation of an EBS volume and the required actions to make the volume available to the pod.

From an application developer's perspective, both solutions are identical and provide similar level of support.
As of the time of writing, both support more advanced features like encryption, snapshotting and resizing of the volumes as part of the CSI driver implementation.

Other storage solutions are available on both providers: Azure Files, AWS EFS, AWS FSx, AWS File Cache. 
Since these aren't needed to support the use case, they are not included in the comparison and only mentioned for completeness.

### Encryption

Encryption for a cluster needs to be considered in multiple locations: (node) disk encryption, ETCD (secrets) encryption and API access encryption. 
By default, all Kubernetes API access uses TLS in-flight on both AKS and EKS. 

[ETCD secrets encryption](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/) is available on both EKS and AKS, but not enabled by default. 

For EKS, option can be enabled by [providing a Key Management Service (KMS) Key](https://docs.aws.amazon.com/eks/latest/userguide/enable-kms.html).
A key has to be created up front and passed to the EKS service during cluster creation or during an update after the cluster is created.
The role associated with the cluster needs to have the appopriate rights to access the key.
The action of encrypting the secrets is irreversible once enabled.
Rotation of the key is done automatically by AWS in the KMS service, yearly by default.

For AKS, [a similar setup is available](https://learn.microsoft.com/en-us/azure/aks/use-kms-etcd-encryption). 
A key needs to be created in an Azure Key Vault and access to the key needs to be provided to the identity associated with the AKS cluster.
Rotation of the keys is supported, but is a [manual activity on AKS](https://learn.microsoft.com/en-us/azure/aks/use-kms-etcd-encryption#rotate-the-existing-keys).
All secrets need to be updated during the rollout of a new key. 
AKS does support disabling the encryption if that's ever desired.

Encryption of persistent volume disks is enabled by default on EKS.
A custom key can be used if desired by providing a reference to the key during the volume creation (through PV or PVCs) or adding it to the configuration of a storage class.
If no key is specified, the default EBS encryption key for the account is used for encryption the volume. 
EKS supports using different keys for different disks.
The root disks attached to the data plane EKS nodes aren't encrypted by default. 
A custom launch template is needed to enable this or encryption needs to be [enabled across the entire AWS account](https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html#managed-node-group-concepts)

On AKS, all volumes, both persistent volumes and data plane node root volumes are encrypted by [default using Microsoft-managed keys](https://learn.microsoft.com/en-us/azure/virtual-machines/disk-encryption).
AKS supports customer provided keys through the usage of a Disk Encryption Set backed by an Azure Key Vault key. 
Enabling root volume encryption can be configured in the cluster configuration by providing the required references to the disk encryption set.
To encrypt persistent volumes automatically using a customer provided key, [the storage class can be adapted](https://learn.microsoft.com/en-us/azure/aks/azure-disk-customer-managed-keys#encrypt-your-aks-cluster-data-disk).
This means that all disks created using that storage class, will have the same encryption key associated with it.

### Miscellaneous

The following topics are very similar across both services or don't have a fundamental impact on the experience, but are included for completeness. 

Supported by both services: 

- Public and Private API endpoints
- Egress networking
- Custom networking: Azure CNI, AWS CNI. For the use case, (standard) kubenet is used.
- Usage of reserved and spot instances
- Creation of load balancers and public endpoints based on Kubernetes (Service) objects.

Unique on AWS:

- AWS provided EKS module
- Web Identity implementation [IRSA](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html)

Unique on Azure:

- Azure Files integration (Storage account integration)
- Free tier cluster

[AWS EKS](https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html) and [Azure AKS](https://learn.microsoft.com/en-us/azure/aks/integrations) both provide a set of add-ons on top of their standard Kubernetes offering. 
Both add-on lists are focussed on integrating their own services into the cluster. 
A few add-ons worth investigating are AWS Distro for OpenTelemetry (EKS), Open Service Mesh (AKS) and KEDA (AKS).

### Conclusion

The out-of-the-box experience for both services is quite different, but in line with the general experience on both platforms. 

AWS's EKS implementation feels focussed on providing the right building blocks to create a great platform. 
It supports a high level of customization and provides many integration points with other AWS services. 
The integration with Key Management Service for the encryption of disks is a good example. 
The fact that they automatically rotate the keys makes it that you can configure this once and forget about it.
Another point where the customization helps is the ability to encrypt the node pool disks. 
It's possible, but the necessity to provide a complete launch template just to enable encryption on the nodes, feels a bit overkill.
The freedom to configure almost anything comes at the cost of an easy getting started.
Getting all the I's dotted and T's crossed can be tricky and debugging it can be hard.

Azure's AKS feels focussed around a decent "end-user" experience. 
There are a lot of sane defaults that make sense for most standard deployments.
Customization is possible is some locations, but if it's not supported out of the box, there is no way to work around it like on AWS.
The integration with other Azure services is also a hit or miss. 
If it's natively integrated, it tends to work well. 
If not, don't hold your breath for the AKS team to implement support for it any time soon.


Both [AWS](https://github.com/aws/containers-roadmap/projects/1) and [Azure](https://github.com/Azure/AKS/projects/1) are quite public about their roadmap and suggestions can be raised by customers easily through their respective GitHub projects. 
From experience, it also doesn't hurt to raise requests through support or your representatives for Azure or AWS.

## Identity

## Basic integrations

## Monitoring

## Logging

- Architectural components for k8s setup
- Iac Complexity
- Out-of-the-box comparison
    - Encryption
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

# Conclusion
- Not all caveats are mentioned in this post (e.g. limitations w.r.t. windows support for EFS on AWS)

# Further in series



- In-depth comparison for Logging (ECK, LGTM and cloud specific)
- In-depth comparison for Monitoring (CNCF stack and cloud specific)
- Secret management opions (cloud specific, external secrets operator, Hashicorp Vault)
- CI/CD options: ArgoCD, ArgoWorkflow, Azure DevOps, AWS DevOps
- How k8s operators can make your life easy with just enough magic

If you want help with cloud adoption in your company or want to provide feedback, feel free to contact [Pieter](https://be.linkedin.com/in/pieter-vincken-a94b5153){:target="_blank" rel="noopener noreferrer"} on LinkedIn!