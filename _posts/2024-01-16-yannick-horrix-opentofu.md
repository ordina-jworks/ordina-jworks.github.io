---
layout: post
authors: [yannick-horrix]
title: 'Choosing Your Orchestrator: OpenTofu vs. Terraform'
image: /img/2023-09-18-cognito-azure-ad/banner.jpg
tags: [ cloud, automation, terraform, opentofu, iac ]
category: cloud
comments: true
---

The power of Open Source is the power of the people. The people rule.

{:.no_toc}
- TOC
{:toc}
# Introduction

Terraform, an industry-leading infrastructure as code (IaC) tool, has been a cornerstone of cloud provisioning and infrastructure management since its inception in 2014. Over the years, it has fostered a vibrant community comprising thousands of users, contributors, vendors, and an extensive ecosystem of open source modules and extensions.

However, August 10, 2023, marked a significant shift in Terraform’s trajectory when HashiCorp, its stewarding organization, changed the license from the Mozilla Public License (v2.0) to the Business Source License (v1.1). This abrupt change sent ripples across the Terraform community, sparking concerns about its future.

In response, the open source community initiated the OpenTofu project, which was adopted by the Linux Foundation on September 20th. OpenTofu, starting off as a fork from Terraform 1.5.6, aims to create a truly open source alternative to Terraform. 

On January 10, 2024, OpenTofu achieved a pivotal milestone by releasing its first production-stable version, OpenTofu 1.6.0, bringing new features and promising a seamless migration for current Terraform users.

In this article we'll delve into a comparative analysis of OpenTofu and Terraform, exploring the impact of the license change, to help you make an informed decision when choosing the right tool for your infrastructure needs.

## A Comparative Analysis: OpenTofu vs. Terraform
# The License change

First and foremost, we have to look at what exactly the change in license entails, and who is affected by it.

As said, OpenTofu uses the Mozilla Public License (MPL), which allows developers to freely use, modify, and distribute software for both commercial and non-commercial use.

Terraform has now shifted to the Business Source License (BUSL). This also permits free use of source code, including commercial use, except when it’s used to provide an offering that competes with HashiCorp.

An example of this could be running Terraform in a hosted way in CI/CD and offering this as a production service.

So while, Terraform remains free to use in your projects, there is a problem when providing a service that incorporates the software.


## Features and Offerings
OpenTofu, being a fork of Terraform, maintains feature parity with its predecessor. This means that currently, both tools are functionally equivalent.

There are some new functionalities added with the release of version 1.6.0, including:

* An advanced testing feature for improved stability in configurations and modules
* Enhanced S3 state backend with new authentication methods
* A new provider and module registry, allowing a simpler method of publishing via pull request

The upcoming version 1.7 aims to introduce more community requested features not available in Terraform, including:

* Client-side state encryption for heightened security in regulated environments
* Parameterizable backends, providers, and modules to enable more readable, DRY code
* Third-party extensibility, with a plugin system for new state backends

On Terraform's side, Hashicorp offers multiple paid services with Terraform Cloud, a platform managing Terraform code, availaible as a hosted service. Additionally, organizations with advanced security and compliance needs can purchase Terraform Enterprise. This is a self-hosted distribution of Terraform Cloud which offers a private instance that includes the advanced features available in Terraform Cloud.

Feature development does also continue. Version 1.6 implemented performance improvements to the 'terraform test' command, as well as changes to the S3 backend.

For now, both tools are functionally equivalent and compatible. The community will decide on whether this will remain the case in the future with developments occur on both sides.

## How to Migrate?
OpenTofu promises a seamless migration for Terraform users. As both OpenTofu 1.6 and Terraform 1.6 are compatible, the migration process is relatively straightforward. However, it is advised to have a disaster recovery plan in place as the migration still is a non-trivial change to the architecture.

The process is as follows:
1. Apply all changes with Terraform
2. Install OpenTofu
3. Back up your state file
4. Initialize OpenTofu
5. Inspect the Plan
6. Test out a small change

In order to rollback, it suffices to create a backup of the new state file and perform
terraform init
terraform plan

# What's next?
## OpenTofu's Future
As OpenTofu steps into the limelight, its future is laden with promises. The community's rapid growth, the Linux Foundation's stewardship, and the release of version 1.6 signal a trajectory of continuous improvement and innovation. Features like advanced testing, enhanced S3 state backend, and a new provider and module registry underscore OpenTofu's commitment to evolving alongside user needs.

The upcoming OpenTofu 1.7 holds exciting prospects, including community-requested features not available in Terraform, such as client-side state encryption, parameterizable backends, providers, and modules, and third-party extensibility through a plugin system for new state backends.

## Terraform's Trajectory
Despite the emergence of OpenTofu, Terraform remains a stalwart in the IaC realm. HashiCorp's enduring commitment to innovation, its reputation as an industry standard, and a vast user community ensure Terraform's relevance. While the licensing shift prompted reflection, HashiCorp continues to shape the IaC landscape, adapting to industry dynamics.

# Conclusion
As of yet, 

For general use in your projects, Terraform 
When providing a commercial service that incorporates Terraform, it can be worthwile to investigate switching to OpenTofu.


#### References
https://www.linuxfoundation.org/press/opentofu-announces-general-availability
https://medium.com/@zoiwrites/terraform-is-dead-long-live-opentofu-bf4c73364050
https://redblink.com/opentofu-open-source-alternative-terraform
https://www.linuxfoundation.org/press/opentofu-announces-general-availability
https://opentofu.org/docs/intro
https://developer.hashicorp.com/terraform/docs