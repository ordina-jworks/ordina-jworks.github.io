---
layout: post
authors: [pieter_vincken]
title: 'From 6 weeks to 90 minutes: let Terraform do your work'
image: /img/2020-05-30-terraform/terraform.png
tags: [Terraform, Configuration Management, Infrastructure-as-code, Cloud]
category: Cloud
comments: true
---

### Reading time: 7 minutes and 2 seconds

# Table of contents

* [How much infrastructure can you get in 6 weeks time](#how-much-infrastructure-can-you-get-in-6-weeks-time)
* [Why use Terraform to supercharge infrastructure provisioning](#why-use-terraform-to-supercharge-infrastructure-provisioning)
* [How to structure Terraform to allow for a two second tire change](#how-to-structure-terraform-to-allow-for-a-two-second-tire-change)
* [How can you beat us](#how-can-you-beat-us)
* [Where to draw a line, everything in terraform](#where-to-draw-a-line-everything-in-terraform)
* [Finally, two golden tips when using Terraform](#finally-two-golden-tips-when-using-terraform)

## How much infrastructure can you get in 6 weeks time

The landscape discussed in this post is used to host a set of applications for a large corporation to assist one of their core products.
The end-goal of this platform is to support their target market across Europe.

A single environment consists of a namespace on a shared OpenShift cluster, a database and a reverse proxy.
In order to spin up a new environment to onboard a new development team the following steps need to be executed:

1. Order resources on the shared OpenShift cluster: ticket 1 for the OpenShift team
1. Order a reverse proxy: ticket 2 for reverse proxy team
1. Order a database: ticket 3 for the database team
1. Order a DNS record for the environment to point to OpenShift routers: ticket 4 for the DNS team
1. Create a new environment in environment repository
1. Run a Jenkins job to create certificates for the environment
1. Update the credentials for the new database in online tooling
1. Update the credentials for the new database in offline password storage
1. Git-encrypt the database credentials and put them in the environment repository
1. Update the database connection details in environment repository
1. Run an Ansible playbook to create a new namespace in OpenShift and set up the base configuration for the namespace (Docker registry credentials, custom service accounts, ...)
1. Sync OpenShift service account credentials into Jenkins credential store
1. Roll out Jenkins to add the new credentials by starting a Jenkins job executing an Ansible playbook
1. Create reverse proxy configuration in reverse proxy repository
1. Use a self-service portal to request access for Jenkins to update the configuration on the reverse proxy
1. Roll out the reverse proxy configuration using a Jenkins job
1. Roll out the environment configuration and application landscape to the new namespace through a Jenkins job that runs OC process and OC applies using the configuration

This sums up the best-case scenario.
Since it requires multiple teams to perform disconnected tasks at different times, errors are frequent and slow to resolve.
Next to that, there is a lot of manual work.
This work includes copy and pasting configuration from different sources into different repositories and systems.
Since any manual action, especially involving copying data between locations, is prone to errors, this introduces even more failure points.
Combining the time it takes for tickets to be executed, copying the manual configuration to the correct locations and the debugging involved in getting the environment online results in lead times expressed in weeks.
On one occasion the lead time to set up a single environment for a new team escalated to 6 weeks.
Due to the high lead times at least 1 or 2 spare environments are provisioned in order to provide teams with at least a minimal environment to start working with.
This of course introduces additional cost.

High lead times, human errors and unnecessary operational costs were the main issues of this manual process.
Since the decision was made to migrate to the public cloud, timing was perfect.
Moving to a different infrastructure provided the perfect opportunity to optimize and automate this process.
The expectation was to reduce the lead times to hours, minimize human errors, and minimize capital and operational costs when providing a development team with a new environment.

## Why use Terraform to supercharge infrastructure provisioning

As mentioned, one of the main triggers to revisit our infrastructure setup and look into automation was the move to public cloud.
We selected Azure as the cloud provider.
The reasons why Azure was selected are beyond the scope of this blog post.
We might discuss this in a future blog post though.

The logical choice for automating the infrastructure provisioning would be ARM templates, since this is the native provided way for infrastructure as code in Azure.
Together with an external ARM expert, we attempted to set up the target infrastructure using this template technology.
Unfortunately, multiple walls were hit due to the nature of the corporate setup on Azure.
One of the limitations that were hit, was the inability for ARM to make changes to resources that were provided by a central team.
More specifically, using a VNET that wasn't managed by ARM to deploy an Azure Kubernetes Service proved to be difficult or even impossible.

Using the CLI and scripts to create the setup was attempted as well, but this didn't fit the vision of a declarative setup for provisioning infrastructure.
Re-applying the same scripts either broke the setup or created additional, unneeded resources.
A clear no-go.

As a third option, Terraform was investigated.
It adhered to the vision of declarative definitions and all the components required by the landscape were available in the Azure Terraform provider.
Some basic setups were created and it showed great potential for the required setup.
Terraform roll outs proved to be more stable and the import mechanism properly supports using components which aren't fully managed by Terraform.
So Terraform to the rescue!

## How to structure Terraform to allow for a two second tire change

One of the challenges of creating a Terraform setup is to determine a way to structure the code.
Looking online provided more questions than answers.
A lot of documentation can be found about how to structure a specific module or how to create modules, but almost no resources discuss how to structure the modules into logical, reusable components.

The setup was divided into two different categories: managed services wrappers and standardized setup modules.

The first category is quite straight forward.
For every managed service that is being used, a module is created.
This module includes all the required Terraform resources for that service to operate.
For example, the key vault module contains the Azure Key Vault Terraform resource, but also the role assignments for the different Active Directory groups that require access to that key vault.
Another example is the container registry module.
It contains the Azure Container Registry (ACR) Terraform resource, some role assignments and the Azure Monitoring Diagnostics Settings for making sure the ACR logs are shipped into the correct logs analytics bucket.
This abstraction allows for opinionated grouping of resources that are required for a managed service to operate.

The second category is a grouping of modules of the first category in order to provide a complete package of features.
This set of modules are the ones that are actually provisioned during a deployment.
Currently, only two of these modules exist: a cluster module and a namespace module.

The cluster module contains all modules required to set up the shared resources for all environments with a similar purpose.
For example, all resources shared by all development environments.
This module contains the Kubernetes cluster module, multiple resource group modules, a key vault module, networking modules and modules that configure identity and role management.
This module is used once per cluster, meaning once for development, acceptance and production respectively.

The second module is used to set up a namespace for a specific purpose: an environment for a development team, a specific testing environment or a rock-solid production environment.
This module contains the DNS zone configuration, an API gateway module, another key vault module and a database module.

These cluster and namespace modules are then used in a single Terraform module per cluster: meaning a single module for the development cluster together with all namespaces in that cluster.
This makes making changes to the infrastructure as easy as running a single Jenkins job executing that module.
We decided to version the modules and created specific modules for development, acceptance and production.
This separation, in combination with the versioning, has allowed us to test module updates and upgrades of the configuration upfront.
Similar to deploying application code to an acceptance or test environment before rolling it into production.

## Where to draw a line, everything in terraform

When we first started using Terraform, we were tempted to configure the entire landscape using it.
A good example was the API manager setup we were using.
The Terraform setup included detailed configuration of the application it was hosting.
Another example was a Kubernetes Terraform module we created, that beside infrastructure related setup for storage classes, was also creating service accounts for operators we were running.
This leakage of concerns made it hard to maintain, but it also introduced duplication of configuration towards the application deployment.

We decided to take a stricter approach, and consider two main responsibilities: orchestration and provisioning.
Orchestration could be translated to an engineer that would take a screwdriver and set up all the required infrastructure.
The outcome of this work would be the minimum needed setup to start using the services and configure them for actual use.

Provisioning is the work that comes after this, and doesn't require a screwdriver, or being near the box.
We decided that the orchestration part, setting up the infrastructure, is where we use Terraform exclusively.
The provisioning part, where we start to configure the infrastructure to work with our application, is where we use tools that are native to the application deployment.

We didn't get there immediately though.
In early iterations, we had split it into two Terraform runs: an orchestration run and a configuration run.
In later iterations we were able to replace the configuration runs with components that were closer to the application landscape, which was a combination of privileged Kustomize deployment runs and building our own Kubernetes operators.

A good rule of thumb is; if you can tie the component you are configuring to something that has meaning in the application domain, it should be managed in the application landscape.
Another good indication that the application domain leaked into the infrastructure domain is when you have to re-orchestrate your infrastructure together with application changes.

## How can you beat us

With this setup, lead-time for provisioning an environment went down from 6 weeks of ticketing magic to just a 90 minute Jenkins run.
The decision to adopt Terraform helped us to minimize human errors, and has enabled us to deploy new environments by a single push of a button.
Infrastructure upgrades have become more and more stable over the adoption period and the different modules have matured to the point where they barely change anymore.

The work being done by the Azure Terraform provider community has helped tremendously.
They release new versions of the provider every week.
They aren't at feature parity with ARM, not by a long shot, but at the pace they are adding support for features, they will catch up very fast.
The provider is also very stable and if an issue occurs (like [this](https://github.com/terraform-providers/terraform-provider-azurerm/issues/6525){:target="_blank" rel="noopener noreferrer"} AKS bug) it's fixed within the next release.

## Finally, two golden tips when using Terraform

The first is to start using remote state storage as soon as possible when using Terraform.
It provides an easy way to get an accurate Terraform plan which in turn provides an accurate overview of the actions Terraform will execute during the roll-out.

The second one is to roll out the modules often and validate their effects by running tests against them.
Test either outcome, not just the configuration.
The further up the application stack these tests run, the better.
In our current setup, the infrastructure runs are part of a nightly test which performs the following steps:

1. Completely trash the test infrastructure
1. Deploy the infrastructure based on the latest configuration
1. Deploy the application landscape on top of it
1. Run the application landscape end-to-end tests against that freshly created setup

Every morning the team smiles when the build is green or (less often now) starts figuring out which component broke and fix it immediately.

Special thanks to the amazing Unicorn team for creating this setup and to [Vincent van Dam](https://twitter.com/joyrex2001){:target="_blank" rel="noopener noreferrer"} for co-writing this post!
