---
layout: post
authors: [lander_marien, duncan_casteleyn]
title: 'Secure cloud foundation tooling'
image: /img/2023-02-16-secure-cloud-foundation/header.png # TODO - change image
tags: [aws, cloud]
category: Cloud
comments: true
---

<!-- TODO complete index -->

- [Introduction](#introduction)
- [The Warden: Open Policy Agent](#the-warden-open-policy-agent)
- [The Janitor: Cloud Custodian](#the-janitor-cloud-custodian)
- [The Watchdog: Snyk](#the-watchdog-snyk)
- [The Container Detective: Trivy](#the-container-detective-trivy)
- [The Composer: Fugue](#the-composer-fugue)

# Introduction

If you ever came in contact with an enterprise cloud environment,
you know that keeping it secure and compliant can be a challenging task.

Every company has their own security and compliance requirements,
and they should at least follow a best practice standard like CIS AWS Foundations Benchmark.

Often, you'll find that because of the segmented responsibilities across many teams and projects, gaps exist in the security and compliancy posture of the organisation. 
Add to that the rate of change that companies need to handle to stay competitive and you end up with a puzzle that no-one can oversee. 

Originally, we started investigating solutions to scan your infrastructure as code and cloud environment.
We thought we'd look at a handful of tools, evaluate them and select a clear winner.

We quickly discovered there are quite some interesting tools out their,
some that are free and some that cost you a lot of money,
and some not only do cloud, but can do much more.

We'll be summarizing the tools we found and how they can help you to secure your cloud environment or other resources.
What they can do, what they can't do, what you can use them with and for.

## The Warden: Open Policy Agent

Cloud computing has made it easy for organizations to manage their IT infrastructure on a large scale. However, with the ease of cloud computing comes the challenge of securing the environment and preventing accidental misconfigurations. This is where Open Policy Agent (OPA) comes into play.

<img src="{{ '/img/2023-02-16-secure-cloud-foundation/warden.png' | prepend: site.baseurl }}" alt="Gandalf, You shall not pass" class="image fit" style="margin:0px auto; max-width:100%">

OPA is an open-source, general-purpose policy engine that can be used to enforce policies across various systems, including cloud infrastructure.

Some of OPA's strenghts summed up:

### Policy Management
OPA provides a simple and flexible policy language used by writing [Rego](https://www.openpolicyagent.org/docs/latest/policy-language/){:target="_blank" rel="noopener noreferrer"}.  that allows organizations to define and manage policies across multiple cloud platforms. 
Policies can be created to enforce security controls, compliancy, and cost optimization rules. 
The policies can be customized to meet specific operational needs.
These policies are available as code and can be managed like any other code, including automated testing(?) in an organisation. 

### Automated Compliancy Enforcement

OPA can be integrated into the Cloud environment using various methods, such as by deploying it as a sidecar container in a Kubernetes cluster or by using Google Cloud functions, AWS Lambda or Azure Automation to run OPA policies. 
Once integrated, OPA can provide real-time policy evaluation and enforcement across the AWS environment, enabling organizations to maintain compliance and security posture.

### Integrations

OPA can integrate with various cloud native tools, including Kubernetes, Istio, and Envoy. This allows organizations to extend their policy management across various systems, helps to ensure end-to-end compliance, making it easier to enforce policies across multiple platforms and cover broad ecosystems.

## The Janitor: Cloud Custodian

Cloud Custodian is an open-source tool that helps organizations manage their cloud infrastructure in a secure and compliant way. One of the key features of Cloud Custodian is its ability to scan cloud resources across multiple cloud platforms, including Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP).

<img src="{{ '/img/2023-02-16-secure-cloud-foundation/janitor.png' | prepend: site.baseurl }}" alt="Gandalf, You shall not pass" class="image fit" style="margin:0px auto; max-width:100%">

Cloud Custodian uses a policy-driven approach to scan cloud resources. Policies are written using a simple and flexible policy language that allows organizations to define and manage policies.

The features of Cloud Custodian for a secure cloud environment:

### Automated Remediation

Cloud Custodian not only identifies policy violations but also automates the remediation process. For example, if a policy violation is identified, such as an unsecured storage bucket in AWS, Cloud Custodian can automatically take corrective actions, such as deleting the unsecured bucket or encrypting it.

### Continuous Compliance

Cloud Custodian helps organizations maintain continuous compliance by ensuring that policies are enforced at all times. The tool can detect any changes in the cloud infrastructure that may violate the policies and take corrective actions in real-time.

### Cost Optimization

Cloud Custodian also helps organizations optimize cloud costs by automating the deletion of unused resources, enforcing tagging policies to identify unused resources, and providing reports on cost savings.

## The Watchdog: Snyk

Snyk is a cloud security platform that helps you to get end-to-end insight into your security footprint.

<img src="{{ '/img/2023-02-16-secure-cloud-foundation/snyk.png' | prepend: site.baseurl }}" alt="Gandalf, You shall not pass" class="image fit" style="margin:0px auto; max-width:100%">

### Code scanning

Snyk can scan your code for vulnerabilities and compliance issues.
It can scan your code for security issues like sql injection or path traversal vulnerabilities.

You also have data flow that shows you the entry point and method invocation of the vulnerability.
Which shows you the entire stack path to the vulnerability in your source code.

To solve the vulnerability you can read the details of the vulnerability and a best practice for prevention if
available.
There is also another tab that shows 3 open source projects that had the vulnerability and how they fixed it their code.

### Licence scanning

You can configure Snyk to scan your open source dependencies for licence issues with your dependencies,
which can be useful for example if your company wants to avoid using dependencies with a certain licence,
because they want to commercialize the software in the future.

### Container scanning

Snyk can scan your container images for vulnerabilities it can do this from docker images, Amazon ECR, Docker hub, ...
You can set this up in your Kubernetes cluster, but currently Fargate is not supported.

For scanning that is linked to a git repository you have the option
to create a pull request to update to a fixed image version.

### Infrastructure as code scanning

Snyk can scan your infrastructure as code against the CIS AWS Foundations Benchmark or you can write custom policies.

### Cloud scanning

Snyk also has cloud scanning, but this service is still in closed beta and is not available for everyone.
We were not able to test this product, because it requires an enterprise licence at the time of writing.

### Custom policies

Snyk allows you to write custom policies in Rego, but only for IaC scanning and platform policies.

## The Container Detective: Trivy

Trivy is an open-source cli tool provided by Aqua Security.

<img src="{{ '/img/2023-02-16-secure-cloud-foundation/Trivy.png' | prepend: site.baseurl }}" alt="Gandalf, You shall not pass" class="image fit" style="margin:0px auto; max-width:100%">

### Container scanning

Trivy can scan container images against well known vulnerabilities.
On the [tool's homepage](https://trivy.dev/), you can enter public available docker hub images to test it out.

### Dependency scanning

Trivy can scan your dependencies for well known vulnerabilities.
It has a mode that automatically discovers, declarations files for various package managers

### CI/CD integration

Because Trivy is a cli tool it can easily be integrates in CI/CD pipelines.
Trivy also maintains a [GitHub action](https://github.com/aquasecurity/trivy-action) to integrate it in GitHub actions.
But the community has created 2 additional GitHub actions.

### AWS integration

Trivy can be run locally to scan your AWS environment using the AWS cli.
The default included check scans against AWS CIS 1.2.0 benchmark.
It shows summarizes a lists of issues, and gives description of how to resolve the issue, it won't automatically fix it.

### Secret scanning

Trivy can scan your code for secrets, it can scan for AWS access key, GCP service account, GitHub personal access token,
GitLab personal access token, Slack access token, etc.

It can do this either on the file system or inside a container image.

### Configuration issues

Trivy can scan your configuration files like Dockerfiles, Kubernetes manifests, Terraform, CloudFormation, etc.
against known configuration issues

### Custom policies

For all the mentioned functionality custom policies can be written in Rego.

## The Composer: Fugue

Fugue is a cloud security platform that helps you to secure your cloud environment,
it was bought by Snyk some time ago and after this take-over Snyk started working on Snyk Cloud.

<img src="{{ '/img/2023-02-16-secure-cloud-foundation/Fugue.png' | prepend: site.baseurl }}" alt="Gandalf, You shall not pass" class="image fit" style="margin:0px auto; max-width:100%">

### Baseline enforcement

Fugue allows you to take a snapshot of your Cloud environment and use it as baseline.

This prevents anyone from making modifications to your environment that are not compliant with your baseline.

It can't recreate or delete resources it only enforces by modifying them back to the original state of the snapshot.

### Policy scanning

Fugue allows you to write policies to scan your AWS environment for compliance,
or you can use one of the pre-defined policies like CIS AWS Foundations Benchmark.

It does not provide automatic solutions to fix the violations, but has descriptions on how to fix them.

### CI/CD integration

Fugue can be integrated with your CI/CD pipeline to scan your infrastructure as code for compliance using their cli.

They have a guide on how to set this up with CircleCI,
but it should be possible to set this up with any other CI/CD tools.

### Custom policies

Fugue allows you to write custom policies in Rego.

<!---
TO DO -- 

Add images for each section.

Enrich post with links

Check for spelling/grammar erros

Get banner image
-->