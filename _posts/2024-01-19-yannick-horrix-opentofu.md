---
layout: post
authors: [yannick-horrix]
title: 'Choosing Your Orchestrator: OpenTofu vs Terraform'
image: /img/2024-01-19-yannick-horrix-opentofu/banner.jpg
tags: [ cloud, automation, terraform, opentofu, iac ]
category: cloud
comments: true
---

> The power of Open Source is the power of the people. The people rule.


{:.no_toc}
- TOC
{:toc}

# Introduction & Timeline

Terraform, an industry-leading infrastructure as code (IaC) tool, has been a cornerstone of cloud provisioning and infrastructure management since its inception in 2014. 
Over the years, it has fostered a vibrant community comprising thousands of users, contributors, vendors, and an extensive ecosystem of open source modules and extensions.

August 10th 2023 markes a significant shift in Terraform’s trajectory when HashiCorp, its stewarding organization, changed the license from the Mozilla Public License (v2.0) to the Business Source License (v1.1). 
This abrupt change sent ripples across the Terraform community, sparking concerns about its future.

In response, the open source community initiated the OpenTofu project, which was adopted by the Linux Foundation on September 20th. OpenTofu, starting off as a fork from Terraform 1.5.6, aims to create a truly open source alternative to Terraform. 

On January 10, 2024, OpenTofu achieved a pivotal milestone by releasing its first production-stable version, OpenTofu 1.6.0, promising a seamless migration for current Terraform users.

In this article we'll delve into a comparative analysis of OpenTofu and Terraform. We'll also discuss the impact of the license change on future development and outline steps required to migrate between both tools. We hope this can help you make an informed decision when choosing the right tool for your orchestration needs.

# A Comparative Analysis: OpenTofu vs Terraform

## Features

In terms of functionality, both tools are currently equivalent. 
The OpenTofu community has aimed to maintain feature parity with Terraform for the time being. 
As such, both currently offer the same large set of features making them well suited tools for IaC workloads.

Some small features were added with the release of OpenTofu 1.6.0 however, including:
* An advanced testing feature for improved stability in configurations and modules
* Enhanced S3 state backend with new authentication methods
* A new provider and module registry, allowing a simpler method of publishing via pull request

The upcoming version 1.7 aims to introduce more community requested features not available in Terraform, including:
* Client-side state encryption for heightened security in regulated environments
* Parameterizable backends, providers, and modules to enable more readable, DRY code
* Third-party extensibility, with a plugin system for new state backends

On Terraform's side, version 1.6 implemented performance improvements to the 'terraform test' command, as well as changes to the S3 backend.

These changes signal the end of feature parity between both tools. As for compatibility, as both tools evolve separately, it remains to be seen whether the OpenTofu community will stay committed to incorporating Terraform's development in its own tool.

## Configuration and Syntax

OpenTofu and Terraform both use Hashicorp Configuration Language (HCL) to define their resources. HCL is declarative, describing an intended goal rather than the steps to reach that goal.

In terms of configuration options, both are also similar. 

## Licensing

Both Terraform and OpenTofu are open-source tools, providing free usage.

As said, OpenTofu uses the Mozilla Public License (MPL 2.0), which allows developers to freely use, modify, and distribute software for both commercial and non-commercial use.

Terraform has now shifted to the Business Source License (BUSL 1.1). This also permits free use of source code, including commercial use, except when it’s used to provide an offering that competes with HashiCorp.
An example of this could be running Terraform in a hosted way in CI/CD and offering this as a production service.

So while, Terraform remains free to use in your projects, there can be an issue when incorporating Terraform in a service offering.



## Pricing and Offerings

In terms of pricing, both tools are free to use, with some limitations for commercial use when it comes to Terraform.

Hashicorp does offer paid solutions, starting with Terraform Cloud, a centralized platform for managing Terraform code. Key features include version control integration, secure variable storage, remote state management, and policy enforcement, enabling organizations to efficiently maintain control over their cloud infrastructure.

[Pricing](https://www.hashicorp.com/products/terraform/pricing?product_intent=terraform){:target="_blank" rel="noopener noreferrer"} for Terraform Cloud follows a Resources Under Management (RUM) model, where Terraform counts the amount of objects it manages and calculates cost accordingly. 
The Standard Tier offering is billed at $0.00014 per hour per resource. For the Plus and Enterprise tiers, pricing is negotiated directly with Hashicorp sales.

Let's take the example for Terraform Enterprise. 
This is a self-hosted solution offered as a private installation rather than a SaaS solution.
Judging from the AWS Marketplace and Azure Marketplace offerings of Terraform Enterprise, pricing starts from $15,000/year. 
This includes just five workspaces, likely to be insufficieint for a large enterprise.

## Community and Support

Terraform currently holds the advantage when it comes to community support. 
Backed by Hashicorp and benefiting from years of community-wide support as an open-source project pre-license change), it can offer a large breadth of resources for user to take advantage of.
The impact of the license changes is starting to show however, with community contributions to Terraform [drying up almost completely in the last couple of months](https://thenewstack.io/open-source-in-numbers-the-terraform-license-change-impact-on-contribution/){:target="_blank" rel="noopener noreferrer"}. Time will tell what the final impact of this shift in community support will mean for users.

OpenTofu, on the other hand, is a growing tool with an expanding community. 
Although not as large as Terraform's, its community is rapidly expanding as more users move to OpenTofu.
It is backed by the Linux Foundation as well as companies such as Gruntwork, env0, Scalr and our very own Sopra Steria AS.
This growing support will provide ever increasing resources for users of the tool in the future.

## Maturity and Stability

Terraform is proven as a mature, stable and extremely popular orchestration tool capable of handling enterprise-grade infrastructure deployments.
OpenTofu is a new tool. However, as a fork of Terraform, it stems from the same code base and thus is expected to perform similarly in terms of stability.

## Summary

To summarize, the following table captures the comparison between the two tools.

| Feature | OpenTofu | Terraform |
|----------|----------|----------|
| Features | Similar to Terraform, with some improvements | Large featureset |
| Configuration | Declarative, easier to use | Declarative but more complex |
| Ownership | Part of Linux Foundation | Owned by Hashicorp |
| Open Source | Yes | Source-available |
| Licensing | Mozilla Public License (MPL 2.0), open-source | Business Software License (BUSL 1.1), source-avalaible |
| Pricing | Free to use | Free to use, with restrictive commercial use. Paid offerings available. |
| Community | Smaller, but expanding | Large, but support is shrinking due to sentiment  |
| Stability | Similar to Terraform | Proven stability and robustness |

# How to Migrate?

OpenTofu promises a seamless migration for Terraform users. 
As both OpenTofu 1.6 and Terraform 1.6 are compatible, the migration process is relatively straightforward. 
However, it is advised to have a disaster recovery plan in place as the migration still poses a non-trivial change to the architecture. 
The migration process is detailed in the [OpenTofu Migration Guide](https://opentofu.org/docs/intro/migration/){:target="_blank" rel="noopener noreferrer"}.

In summary, the process looks like this:
1. Apply all changes with Terraform

   `terraform apply`
2. [Install OpenTofu](https://opentofu.org/docs/install/){:target="_blank" rel="noopener noreferrer"}
   
    Test if you can successfully execute the `tofu` command:

    `tofu --version`
3. Back up your state file
   
   If you are using a local state file, you can simply make a copy of your `terraform.tfstate` file in your project directory.

   If you are using a remote backend such as an S3 bucket, make sure that you follow the backup procedures for the backend and that you exercise the restore procedure at least once.
   The `terraform state pull` command can be used to easily backup remote states to local machines.
4. Initialize OpenTofu

   `tofu init`
5. Inspect the Plan

   `tofu plan`
6. Test out a small change

   `tofu apply`

And that's it.
Migration complete!

In order to rollback, it suffices to create a backup of the new state file and perform

`terraform init`

`terraform plan`

to verify that everything is working correctly. Do note that a rollback is only possible between compatible versions (1.6.0).

# Conclusion

Despite the emergence of OpenTofu, Terraform remains a stalwart in the IaC realm, with a vast user community ensuring its relevance. 
HashiCorp's reputation however, has taken a hit with the sudden shift in its licensing policy and it remains to be seen how this strategic shift will affect users long-term.

For OpenTofu, at least for now, the future looks bright. 
The community's rapid growth, the Linux Foundation's stewardship, and the release of version 1.6.0 are signals of the community's commitment to keeping orchestration truly open-source. 
New features like advanced testing, enhanced S3 state backend and the prospect of a host of other community-requested features being added show that OpenTofu is capable of delivering on its promise and evolve according to its user's needs.

When you are a service provider looking to incorporate Terraform in one of your offerings, it can be worthwhile to look at OpenTofu as a truly open-source alternative to avoid licensing costs or legal trouble.

For regular users, not much has changed on the surface. 
Terraform still is a very robust and well supported too capable of handling your orchestration needs. 
OpenTofu does offer some benefits in ease of use and configuration, and as both tools are currently compatible and functionally equivalent it may be interesting to take try out OpenTofu and see what it has to offer. 

The open-source community supporting OpenTofu will decide the future of the project. 
While the early signs are positive, it remains to be seen whether the tool can keep up in functionality and compatibility with Terraform, or even surpass it in some areas. 
At Jworks, We are certainly interested in its future development.

# What's next?

In a follow-up post, we will attempt to migrate some of our projects from Terraform to OpenTofu. 
Here will we go through the migration process step-by-step and compare the performance of the two tools in a production setting.

Stay tuned for more!