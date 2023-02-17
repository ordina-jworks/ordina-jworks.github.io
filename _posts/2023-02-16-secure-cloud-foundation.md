---
layout: post
authors: [lander_marien, duncan_casteleyn]
title: 'Secure cloud foundation tooling'
image: /img/2023-02-16-secure-cloud-foundation/header.png # TODO - change image
tags: [aws, cloud]
category: Cloud
comments: true
---

- [Introduction](#introduction)

# Introduction

If you have ever come in to contact with an enterprise cloud environment,
you know that keeping it secure and compliant can be a cumbersome task.

Many companies have their own security and compliance requirements,
and they should at least follow a best practice standard like CIS AWS Foundations Benchmark.

You'll find out that because access to the cloud is splintered over so many teams and projects,
that there will be so many violations to the security and compliance requirements,
that you can not keep up with all the changes in your enterprise cloud environment.

Originally when we started investigating solutions to scan your infrastructure as code and cloud environment.
We thought it would be short document for internal use only.

We quickly discovered there are actually quite some interesting tools out their,
some that are free and some that cost you a lot of money,
and some that can not just do cloud, but much more.

We'll be summarizing the tools we found and how they can help you to secure your cloud environment or other resources.
What they can do, what they can't do, what you can use them with and for.

## Snyk

Lorem ipsum

## Trivy

Trivy Ipsum

## Fugue

Fugue is a cloud security platform that helps you to secure your cloud environment,
it was bought by Snyk some time ago and after this take-over Snyk started working on Snyk Cloud.

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
