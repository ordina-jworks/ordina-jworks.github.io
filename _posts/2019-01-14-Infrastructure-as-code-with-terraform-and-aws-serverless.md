---
layout: post
authors: [nick_van_hoof]
title: 'Infrastructure as code: Terraform and AWS Serverless'
image: /img/2018-10-01-How-to-Build-a-Serverless-Application/AWS-Lambda-and-DynamoDB.png
tags: [AWS,Lambda,DynamoDB,API GateWay,Serverless]
category: Cloud
comments: true
---

# Table of content
1. [Introduction](#introduction)
2. [Serverless: What & Why](#serverless-what--why)
3. [What we will build](#what-we-will-build)
4. [Prerequisites](#prerequisites)
6. [DynamoDB](#dynamodb)
7. [Lambda: scan DynamoDB](#lambda-scan-dynamodb)
8. [API Gateway: Access the scan Lambda](#api-gateway-access-the-scan-lambda)
9. [Lambda: Write to DynamoDB](#lambda-write-to-dynamodb)
10. [API Gateway: Access the write Lambda](#api-gateway-access-the-write-lambda)
11. [What is next?](#what-is-next)
12. [Extra resources](#extra-resources)

# Infrastructure as code
Infrastructure as Code (IaC) is a way of managing your devices and servers that run you code through machine-readable definition files. 
Basically, you write down how you want your infrastructure to look and what code should be run on that infrastructure. 
Then with a push of a button you say "Deploy my infrastructure". 
BAM, there is your application, running on a server, against a database, available through an API, ready to be used!



