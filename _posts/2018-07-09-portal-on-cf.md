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

On the SAP Cloud Foundry environment things quickly get a bit more technical. SAP may, or may not improve this in the future by hiding away the technical details. Personally, I like the more technical aspect of CloudFoundry vs NEO. The fact that you know more in detail about what is going on gives you more to work with when something goes wrong. In this article, I'm going to explain how I deployed a couple of SAPUI5 apps on CloudFoundry, configured Portal to use them, and added destinations and security for the whole thing to work.

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

```yaml
---
applications:
- name: YourApp
  path: dist
  memory: 256MB
  instances: 1
  buildpack: nodejs_buildpack
  command: node app.js
  host: yourapp
```

Of course this app can run on less memory, as little as 64mb.

### Build & Deploy

It could be handy to deploy the app already, but we will need to change the datasource later on.
Build the project by right-clicking it and clicking Build > Build Project. You can also run Grunt if you are working with a directory on your local filesystem.
Clone the git repository locally, or download the project as a zip file from the WebIDE and unpack on your local drive.
Deploy using `cf push` when in a command shell in the root of the project folder.
When the deploy succeeds, note down the app url, we will need it later on.



## Configure and deploy Portal

### Activate Portal

First, activate the service in your **NEO** account, if not already done. 
Then, you need to create a new Fiori Launchpad site. When you are in the site admin page, note down, or copy the subdomain. 
Eg. https://**flpnwc-xxxxxxx**.dispatcher.hana.ondemand.com/sites/adminspace#siteDirectory-show

### Create the site

Next, go to your space in the CloudFoundry account where you want to deploy the Portal site.
Click 'Portal' on the left navigation menu, and then the 'New Site' button. Fill in the form and enter flpnwc-xxxxxxx in the SAP Cloud Platform subaccount details.

<img alt="Create site" src="{{ '/img/portal-on-cf/create-portal-site.jpg' | prepend: site.baseurl }}" class="image fit">
You should now get a new tile. Hit the edit icon to go to the admin space and configure the site to your likings, like you would normally do in the NEO environment.
Now, when you want to create an app tile, which path should you use? You cannot simply select an existing HTML5 app from the repository like you would normally do. 

Right now, you can choose the path, we will configure the destination later: `Component-URL: /frontend-yourapp`.

Now, we need to do a couple of things before we can deploy the site.

### Configure the site for CloudFoundry

Go to _services and tools > Implementation pack_ and download the `xs-app.json` file and `mtad.yaml` file.

The xs-app.json contains the url regex that needs to be captured, it could look something like this:

```json
{"routes":[{"localDir":"themes","source":"/themes/(.*)",
    "cacheControl":"public, max-age=31536000,must-revalidate","target":"$1"},
   
    {"source":"^/sci/(.*)","target":"$1","destination":"sci"},
    {"source":"^/frontend-yourapp/(.*)","target":"$1","destination":"frontend-yourapp"},
```

This file tells the Portal to redirect urls starting with _/sci_ to point to destination SCI.
In my case this points to my backend, using SAP Cloud Integration, you can use any name but I have only tried this with internet reachable systems. I still need to try this with on-premise systems that have to be accessed over the SAP Cloud Connector.

The second entry tells urls starting with _/frontend-yourapp_ to point to a destination with the same name. Note that I have used this url as the component url of my SAPUI5 app in the Portal admin space.

When finished upload the file using the button in the implemenation pack.

Next, open the `mtad.yaml` file. This one is a little bit more complex...

It could look like this:

```yaml

_schema-version: '2.0'
ID: portal-site-xxxxxxxxxxxxxx
version: 1.2.0
modules:
  - name: site-entry-xxxxxxxxxxxxxx
    type: javascript.nodejs
    path: site-entry/
    parameters:
      memory: 256M
    requires:
      - name: site-host-xxxxxxxxxxxxxx0
      - name: portal-uaa
      - name: reels-approuter
        group: destinations
        properties:
          name: approuter
          url: ~{url}
          forwardAuthToken: true
      - name: demo-sci
        group: destinations
        properties:
          name: sci
          url: ~{url}
          forwardAuthToken: true
      - name: demo-frontend-yourapp
        group: destinations
        properties:
          name: frontend-yourapp
          url: ~{url}
          forwardAuthToken: true
      - name: sapui5-provider
        properties:
          sapui5url: '~{url}'
      
  - name: site-content-xxxxxxxxxxxxxx
    type: com.sap.portal.site-content
    path: site-content/
    parameters:
      health-check-type: none
      memory: 128M
    requires:
      - name: site-client-xxxxxxxxxxxxxx
      - name: portal-uaa
resources:
  - name: site-host-xxxxxxxxxxxxxx
    type: org.cloudfoundry.managed-service
    parameters:
      service: portal-services
      service-plan: site-host
      config:
        siteId: xxxxxxxxxxxxxx
  - name: portal-uaa
    type: org.cloudfoundry.existing-service
    parameters:
      service-name: "my-xsuaa"
  - name: sapui5-provider
    properties:
      url: 'https://sapui5.hana.ondemand.com'
  - name: site-client-xxxxxxxxxxxxxx
    type: org.cloudfoundry.managed-service
    parameters:
      service: portal-services
      service-plan: site-content
      config:
        siteId: xxxxxxxxxxxxxx
 
  - name: demo-sci
    properties: 
      url: https://mysubdomain.cfapps.eu10.hana.ondemand.com/api/
  - name: demo-frontend-yourapp
    properties: 
      url: https://yourapp-somesubdomain.cfapps.eu10.hana.ondemand.com/
```

You can see the mapping of the destinations named before to the right urls. I have two destinations here, one for my backend connection and one for the frontend. The frontend url is the one we wrote down earlier when deploying the SAPUI5 app.
For the portal to work you also need a XSUAA service instance to bind to. If you don't already have one, this is the time to create an insance.

If all of this is done, upload the mtad.yaml file as well. Then, hit the 'Download' button below. Go back to your Portal dashboard in the **CloudFoundry space**. Click the 'deploy portal site' icon on the tile of your portal. Upload the mtar file you just downloaded and let the platform do its work.

<img alt="Deploy site" src="{{ '/img/portal-on-cf/deploy-portal-site.jpg' | prepend: site.baseurl }}" class="image fit">


## Check datasource url in the app

A last point of attention would be the datasource in the SAPUI5 app. Make sure the datasource matched the url we configured in the destinations of the portal.

Also, in my experience, the Portal acts as the AppRouter would act. So when using url's pointing to location behind an AppRouter, it won't work.