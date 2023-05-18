---
layout: post
authors: [ lander_marien, duncan_casteleyn ]
title: 'Secure cloud foundation tooling'
image: /img/2023-02-16-secure-cloud-foundation/header.png
tags: [ aws, cloud ]
category: Cloud
comments: true
date: 2023-05-18
---

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

Often, you'll find that because of the segmented responsibilities across many teams and projects, gaps exist in the security and compliance posture of the organisation. 
Add to that the rate of change that companies need to handle to stay competitive and you end up with a puzzle that no-one can oversee. 

Originally, we started investigating solutions to scan your infrastructure as code and cloud environment.
We thought we'd look at a handful of tools, evaluate them and select a clear winner.

We quickly discovered there are quite some interesting tools out there.
Some that are free and some that cost you a lot of money,
some that are free and some that cost you a lot of money,
and some not only do cloud, but can do much more.

We'll be summarizing the tools we found and how they can help you to secure your cloud environment or other resources.
What they can do, what they can't do, what you can use them with and for.

## The Warden: Open Policy Agent

Cloud computing has made it easy for organizations to manage their IT infrastructure on a large scale. However, with the ease of cloud computing comes the challenge of securing the environment and preventing accidental misconfigurations. This is where [Open Policy Agent](https://www.openpolicyagent.org/){:target="_blank" rel="noopener noreferrer"} (OPA) comes into play.

<img src="{{ '/img/2023-02-16-secure-cloud-foundation/warden.png' | prepend: site.baseurl }}" alt="Gandalf, You shall not pass" class="image fit" style="margin:0px auto; max-width:100%">

OPA is an open-source, general-purpose policy engine that can be used to enforce policies across various systems, including cloud infrastructure.

Some of OPA's strengths summed up:

### Policy Management
OPA provides a simple and flexible policy language used by writing [Rego](https://www.openpolicyagent.org/docs/latest/policy-language/){:target="_blank" rel="noopener noreferrer"}.  that allows organizations to define and manage policies across multiple cloud platforms. 
Policies can be created to enforce security controls, compliancy, and cost optimization rules. 
The policies can be customized to meet specific operational needs.
These policies are available as code and can be managed like any other code, including automated testing in an organisation. 

### Automated Compliancy Enforcement

OPA can be integrated into the cloud environment using various methods, such as by deploying it as a sidecar container in a Kubernetes cluster or by using Google Cloud functions, [AWS Lambda](https://aws.amazon.com/blogs/opensource/easily-running-open-policy-agent-serverless-with-aws-lambda-and-amazon-api-gateway/){:target="_blank" rel="noopener noreferrer"} or Azure Automation to run OPA policies. 
Once integrated, OPA can provide real-time policy evaluation and enforcement across the AWS environment, enabling organizations to maintain compliance and security posture.

### Integrations

OPA can integrate with various cloud native tools, including Kubernetes, Istio, and Envoy. This allows organizations to extend their policy management across various systems, helps to ensure end-to-end compliance, making it easier to enforce policies across multiple platforms and cover broad ecosystems.

## The Janitor: Cloud Custodian

[Cloud Custodian](https://cloudcustodian.io/){:target="_blank" rel="noopener noreferrer"} is an open-source tool that helps organizations manage their cloud infrastructure in a secure and compliant way. One of the key features of Cloud Custodian is its ability to scan cloud resources across multiple cloud platforms, including Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP).

<img src="{{ '/img/2023-02-16-secure-cloud-foundation/janitor.png' | prepend: site.baseurl }}" alt="Gandalf, You shall not pass" class="image fit" style="margin:0px auto; max-width:100%; height:60%;">

Cloud Custodian uses a policy-driven approach to scan cloud resources. Policies are written using a simple and flexible policy language that allows organizations to define and manage policies.

The features of Cloud Custodian for a secure cloud environment:

### Automated Remediation

Cloud Custodian not only identifies policy violations but also automates the remediation process. For example, if a policy violation is identified, such as an unsecured storage bucket in AWS, Cloud Custodian can automatically take corrective actions, such as deleting the unsecured bucket or encrypting it.

### Continuous Compliance

Cloud Custodian helps organizations maintain continuous compliance by ensuring that policies are enforced at all times. The tool can detect any changes in the cloud infrastructure that may violate the policies and take corrective actions in real-time.

### Cost Optimization

Cloud Custodian also helps organizations optimize cloud costs by automating the deletion of unused resources, enforcing tagging policies to identify unused resources, and providing reports on cost savings.

## The Watchdog: Snyk

[Snyk](https://snyk.io/){:target="_blank" rel="noopener noreferrer"} is a cloud security platform that helps you to get end-to-end insight into your security footprint.

<img src="{{ '/img/2023-02-16-secure-cloud-foundation/snyk.png' | prepend: site.baseurl }}" alt="Gandalf, You shall not pass" class="image fit" style="margin:0px auto; max-width:100%; height:60%">

### Code scanning

Snyk can scan your code for vulnerabilities and compliance issues,
by example security issues like sql injection or path traversal vulnerabilities.

You might then ask: "How can it help me solve them?"
They have data flow windows that shows you the entry point and method invocation of the vulnerability, which shows you
the entire stack path to the vulnerability in your source code.
This helps you in assessing what the impact of a vulnerability is and how urgent you need to provide a patch for it.
This way you can for example asses if a method is publicly accessible or not.

To help you further with solving the vulnerability you can read the details of the vulnerability
and a best practice for preventing it, if available.
If you thought that would be enough they have another tab that shows 3 open source projects that had the vulnerability
and how they fixed it in their code base.

### License Scanning

You can configure Snyk to scan your open source dependencies for license issues with your dependencies,
which can be useful for example if your company wants to avoid using dependencies with a certain license,
because they want to commercialize the software in the future.
For example a library that uses patents,
but its software rights don't include that you may use their patents when using their library.
The company might for various reason not allow AGPLv3 libraries for example, because of various reasons.

### Container scanning

Snyk can scan your container images for vulnerabilities it can do this from docker images, Amazon ECR, Docker hub, ...
You can set this up in your Kubernetes cluster, but currently Fargate is not supported.

You can automate the image updating process by using container scanning on your Git repository.
By using this method, Snyk can automatically create pull requests for you that you can test and then merge if satisfied.
This reduces your effort to stay safe and up to date.

### Infrastructure as code scanning

Snyk can scan your infrastructure as code against the CIS AWS Foundations Benchmark or you can write custom policies.
To scan your IaC, you simply have to add your Git repository that contains your IaC
and the Snyk platform will start scanning if for you.
You can also use the Snyk CLI to scan your IaC if you want to make it part of your CI/CD pipelines.
By using it this way you can make this a requirement before pull requests are merged that you pass the CLI tool's scan
or even block deployment to environments.

### Custom policies

Snyk allows you to write custom policies in Rego, but only for IaC scanning and platform policies.

OPA is easy to use because applications can easily delegate police validation to OPA if needed.
Snyk IaC leverages OPA to do it's polic scanning according to one of their blogposts.
You get a preset of policies out o the box from Snyk and you can add your own custom policies writen in Rego.

## The Container Detective: Trivy

[Trivy](https://trivy.dev/){:target="_blank" rel="noopener noreferrer"} is an open-source cli tool provided by Aqua
Security.

<img src="{{ '/img/2023-02-16-secure-cloud-foundation/Trivy.png' | prepend: site.baseurl }}" alt="Gandalf, You shall not pass" class="image fit" style="margin:0px auto; max-width:100%; height:60%">

### Container scanning

Trivy can scan container images against well known vulnerabilities.
On the [tool's homepage](https://trivy.dev/), you can enter public available Docker Hub images to test it out.
Trivy will scan files inside container images and container image metadata.

Trivy scans the files inside container images for:

* Vulnerabilities
* Misconfigurations
* Secrets
* Licenses

The image metadata will be scanned for:

* Misconfigurations
* Secrets

### Dependency scanning

Trivy can scan your dependencies for well known vulnerabilities.

It has a mode that automatically discovers, declarations files for various package managers.
This dependency scanning is very powerful it scans the file system for typical files used to declare dependencies,
like a `pom.xml`, but can also scan into jar and war files.

If you thought "that's nice", that's not all it can do!
It can also scan your linux systems package managers by fetching what packages are installed,
apt and apk are supported of the box for alpine and ubuntu based images.

### CI/CD integration

Because Trivy is a CLI tool, it can easily be integrates in new or existing CI/CD pipelines.
To integrate it into GitHub you could tell trivy the run should fail (exit code 1 instead of 0) only for HIGH and
Critical issues.

Trivy also maintains a [GitHub action](https://github.com/aquasecurity/trivy-action) to integrate it in GitHub actions.
But the community has created 2 additional GitHub actions.

This action has some examples of how you can integrate this with GitHub Advanced Security.

### AWS integration

Trivy can be run locally to scan your AWS environment using the AWS CLI.
The default included check scans against AWS CIS 1.2.0 benchmark.
It shows summarizes a lists of issues, and gives description of how to resolve the issue, it won't automatically fix it.

The benefit compared to AWS security hub is that here you can stop the issue from being created before merge or deploy.
While security hub would tell you after the resource already exists in AWS.

### Secret scanning

Trivy can scan your code for secrets,
because it's not like you have ever had a developer push your precious AWS access key.
(I really wonder why we suddenly have EC2s with GPU's booting up?)
It can scan for:

* AWS access key
* GCP service account
* GitHub personal access token
* GitLab personal access token
* Slack access token
* etc.

It can do this either on the file system or inside a container image.

### Configuration issues

Trivy can scan your configuration files against known configuration issues it support files like:

* Dockerfiles
* Kubernetes manifests
* Terraform
* CloudFormation
* etc.

### Custom policies

You can add your own custom policies, but you will have to write them in Rego.
Trivy uses Defsec their cloud rules engine for Docker and Kubernetes and tfsec a static analysis scanner for terraform
code,
both of these rule engines are open-source and use OPA under the hood.

## The Composer: Fugue

[Fugue](https://www.fugue.co/){:target="_blank" rel="noopener noreferrer"} is a cloud security platform that helps you to secure your cloud environment,
it was bought by Snyk some time ago and after this take-over Snyk started working on Snyk Cloud.

<img src="{{ '/img/2023-02-16-secure-cloud-foundation/Fugue.png' | prepend: site.baseurl }}" alt="Gandalf, You shall not pass" class="image fit" style="margin:0px auto; max-width:100%; height:60%">

### Baseline enforcement

Fugue allows you to take a snapshot of your cloud environment and use it as baseline.

This prevents anyone from making modifications to your environment that are not compliant with your baseline.

It can't recreate or delete resources, it only enforces by modifying them back to the original state of the snapshot.

A snapshot captures complete cloud resource configurations, attributes, relationships, and drift.
As an added bonus, snapshots enable deep visualization and reporting capabilities.

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

## Conclusion

In conclusion, managing and securing cloud environments can be a complex and challenging task due to segmented responsibilities across different teams and projects. Open Policy Agent, Cloud Custodian, and Snyk are three tools of many that can help organizations enforce policies, maintain continuous compliance and governance, and optimize costs across multiple cloud platforms.

While these tools can be valuable additions to any organization’s cloud security and compliance toolset, it’s worth
noting that cloud providers also offer native solutions like AWS Security Hub, Azure Security Center/Sentinel that can
offer similar functionality.
However, the native solutions may lack the flexibility and customization options of third-party tools like OPA, Cloud
Custodian, and Snyk, which may be essential for meeting specific organizational requirements.

If you found this post helpful, be sure to keep an eye out for our upcoming follow-up post,
we'll be diving deeper into the practical applications of OPA and sharing some real-world use cases.
Be sure to stay tuned, so you don't miss out on valuable insights and tips.
