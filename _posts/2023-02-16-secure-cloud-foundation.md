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

## Introduction

If you have ever come in to contact with an enterprise cloud environment,
you know that keeping it secure and compliant can be a cumbersome task.

Many companies have their own security and compliance requirements,
and they should at least follow a best practice standard like CIS AWS Foundations Benchmark.

You'll find out that because access to the cloud is splintered over so many teams and projects,
that there will be so many violations to the security and compliance requirements,
that you can not keep up with all the changes in your enterprise cloud environment.

Originally when we started investigating solutions to scan your infrastructure as code, cloud environment,
container images, ... We thought it would be short document for internal use only.

We quickly discovered there are actually quite some interesting tools out their,
some that are free and some that cost you a lot of money.

We'll be summarizing the tools we found and how they can help you to secure your cloud environment.
What they can do and what they can't do.
