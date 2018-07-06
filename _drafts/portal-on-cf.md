---
layout: post
authors: [gert_vermeersch]
title: 'Deploying Fiori apps and Portal on SAP Cloud Foundry'
image: /img/portal-on-cf/launchpad.png
tags: [SAP Cloud,Cloud Foundry,Portal,SAPUI5,Fiori]
category: SAP Cloud
comments: false
---

# Deploying your Fiori apps and Fiori Launchpad on SAP Cloud Foundry

Building and deploying Fiori apps and installing SAP Portal is easy on the SAP Cloud Platform NEO environment. Since everything is automated and done for you.
On the SAP Cloud Foundry environment things quickly get a bit more technical. SAP may, or may not improve this by hiding away the technical details. Personally, I like the more technical aspect of CloudFoundry vs NEO. The fact that you know more in detail about what is going on gives you more to work with when something goes wrong. In this article, I'm going to explain how I deployed a couple of SAPUI5 apps on CloudFoundry, configured Portal to use them, and added destinations and security for the whole thing to work.

## Table of contents
1. [What do you need?](#what-do-you-need)
2. [Create a manifest](#create-a-manifest)
3. [Configure and deploy Portal](#configure-and-deploy-portal)
4. [Build and deploy app](#build-and-deploy-app)


## What do you need?

- A text editor of your choice (I really like Visual Studio Code)
- The [CloudFoundry CLI](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html)
- Some kind of SAPUI5 application you want to deploy
- SAP Cloud Platform Cloud Foundry account, this can be a trial or productive account

## Create a manifest

If you have experience with developping SAPUI5 apps, you are probably familiar with the `neo-app.json` file. This basically tells the NEO HTML5 service what to do with authentication, destinations, where to find the index file... The container we are going to create is not aware of this file and will ignore it. This means that we have to handle everything in the neo-app.json in some other way. The first step is the manifest.yaml. The manifest that we are going to create is not to be confused with the existing manifest.json, which is used by the SAPUI5 bootstrapping process. 

`manifest.yaml` has to be created in the root of your project directory. It tells CloudFoundry what kind of buildpack to use, the name, memory limit, host and how to start the application.
Since a SAPUI5 app is nothing more than a collection of HTML, CSS and JS files to be served, we can use a simple webserver like nginx to host our files.

This is a working example of a manifest of one of my apps:

``
---
applications:
- name: YourApp
  memory: 256MB
  instances: 1
  buildpack: nodejs_buildpack
  command: node app.js
  host: yourapp
``


## Configure and deploy Portal


## Build and deploy app