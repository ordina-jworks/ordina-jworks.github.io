---
layout: post
authors: [yolan_vloeberghs, nicholas_meyers]
title: 'Cognito Azure AD'
image: /img/2023-08-25-vuzix-and-how-to-use-it/glasses.png
tags: [ Cloud, AWS, Terraform, Azure, Cognito, Security, Authentication ]
category: Cloud
comments: true
---
# Introduction
In today's interconnected digital landscape, enterprises are increasingly relying on a mix of cloud solutions to meet their diverse needs.
One common challenge is efficiently managing user identities and authentication across these platforms.
But what happens when you're already invested in Azure Active Directory as your primary identity provider?

While many companies utilize Azure AD, they may not fully adopt the entire Azure ecosystem.
However, based on our experience, integrating Cognito with AWS services offers a cleaner solution, especially if your application operates on AWS.
Although an AWS Lambda function could authenticate with Azure AD, AWS Cognito provides a convenient approach to incorporate authentication within AWS services like API Gateway and CloudFront.

In this article, we'll explore how to efficiently integrate users from your Azure AD environment into AWS Cognito.
Can these two seemingly distinct systems work together to provide a unified authentication experience?
Let's delve into the details and discover how this integration can be seamlessly achieved.

To keep things straightforward, we will utilize Terraform to establish the infrastructure.
This setup can be easily replicated across various AWS and Azure accounts for convenience.