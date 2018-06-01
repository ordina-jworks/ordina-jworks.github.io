---
layout: post
authors: [andreas_evers]
title: 'Automated Canary Analysis using Spinnaker - Codelab'
image: /img/spinnaker/spinnaker-logo.png
tags: [Canary, Continuous-Delivery, Cloud, Microservices, Netflix, Spring]
category: Cloud
comments: true
---

# Intro

Spinnaker is a multi-cloud, multi-region automated deployment tool.
Open sourced by Netflix and heavily contributed to by Google, it supports all major cloud providers including Kubernetes.  

Last month Kayenta was open sourced, a canary analysis engine. 
Canary analysis is a technique to reduce the risk from deploying a new version of software into production. 
A new version of the software, referred to as the canary, is deployed to a small subset of users alongside the stable running version. 
Traffic is split between these two versions such that a portion of incoming requests is diverted to the canary. 
This approach can quickly uncover any problems with the new version without impacting the majority of users.
  
The quality of the canary version is assessed by comparing key metrics that describe the behavior of the old and new versions. 
If there is a significant degradation in these metrics, the canary is aborted and all of the traffic is routed to the stable version in an effort to minimize the impact of unexpected behavior.

# Preface

Ordina helps companies through digital transformation using three main focus areas:  
Embracing a DevOps culture and corresponding practices allows teams to focus on delivering value for the business, by changing the communication structures of the organization.  
Through automation, teams are empowered and capable of delivering applications much faster to production. Having a modular decoupled architecture, our second focus area, fits well with this model.  
Making these changes to our architecture in combination with a culture of automation, results in a lot more moving parts in our application landscape.  
Naturally the next step is tackling the underlying infrastructure accomodate this new architecture and way of working. 
Cloud automation is therefore our final focus area in digital transformations.


Releasing more often doesn't only allow new features from reaching the user faster, it also fastens the feedback loops, improves reliability and availability, developer productivity and efficiency. Spinnaker plays a crucial part in all of this, as it allows more frequent and faster deployments, without sacrificing safety.

Automated canary analysis, demonstrated in this codelab, is a powerful tool in that sense.

# Overview

* [Goal](#goal)
* [Introducing our Rick & Morty demo](#intro-demo)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Configuration](#configuration)
* [Running the demo scenario](#running-demo)
* [Conclusion](#conclusion)

<a name="goal" />

# Goal

The purpose of this codelab is to simplify getting up-and-running with automated canary analysis using Spinnaker on Kubernetes.

<a name="intro-demo" />

# Introducing our Rick & Morty demo

Rick & Morty

### Setup Continuous Integration



<a name="prerequisites" />

# Prerequisites

You need a GCP account.

The canary functionality we’re going to use in this setup requires the use of a specific cluster version with full rights:
- You must be an Owner of the project containing your cluster.
- You must use Kubernetes v1.10.2-gke.0 or later.

<a name="installation" />

# Installation

> Throughout this guide we refer to the official documentation for individual parts of the installation already covered by the Spinnaker team.
> However, as reference we also compiled an exhaustive list of commands to execute based on the commands found in those articles.
> This means you could skip the official documentation and simply execute those commands, however we still recommend going through the docs to get more context.
> The list of commands to execute can be found [at the end of this chapter](#commands).

Follow the guide on Spinnaker’s website: [https://www.spinnaker.io/setup/quickstart/halyard-gke](https://www.spinnaker.io/setup/quickstart/halyard-gke)

Create a cluster like mentioned here: [https://cloud.google.com/monitoring/kubernetes-engine/installing](https://cloud.google.com/monitoring/kubernetes-engine/installing)

```
gcloud components update

gcloud auth login
gcloud config set project <PROJECT_NAME>
```

Find out the latest supported cluster version with the following command:
`gcloud container get-server-config --zone=$ZONE`

Create a cluster for your specific zone (e.g. europe-west1-d) and preferred cluster version (v1.10.2-gke.0 or later):

```
CLUSTER_VERSION=1.10.2-gke.1
GCP_PROJECT=$(gcloud info --format='value(config.project)')
ZONE=europe-west1-d

CLOUDSDK_CONTAINER_USE_V1_API=false
CLOUDSDK_API_CLIENT_OVERRIDES_CONTAINER=v1beta1

gcloud beta container clusters create spinnaker \
  --zone=$ZONE \
  --project=$GCP_PROJECT \
  --cluster-version=$CLUSTER_VERSION \
  --enable-stackdriver-kubernetes \
  --enable-legacy-authorization
```
Make sure `enable-stackdriver-kubernetes` and `--enable-legacy-authorization` are passed.

### Enable APIs

Navigate to the Google Cloud Console and enable the following APIs:
- [Google Identity and Access Management (IAM) API](https://console.developers.google.com/apis/api/iam.googleapis.com/overview)
- [Google Cloud Resource Manager API](https://console.developers.google.com/apis/api/cloudresourcemanager.googleapis.com/overview)

### Halyard setup

This section complements official documentation with some recommendations and extras.
Postpone running the `hal deploy apply` command until the end of this chapter.

#### Basic Spinnaker

During the [Halyard on GKE guide on Spinnaker’s website](https://www.spinnaker.io/setup/quickstart/halyard-gke), remember to use the right zone when creating the Halyard VM.

```
gcloud compute instances create $HALYARD_HOST \
    --project=$GCP_PROJECT \
    --zone=$ZONE \
    --scopes=cloud-platform \
    --service-account=$HALYARD_SA_EMAIL \
    --image-project=ubuntu-os-cloud \
    --image-family=ubuntu-1404-lts \
    --machine-type=n1-standard-4
```

When SSH’ing into the Halyard VM, also remember to use the right zone.

```
gcloud compute ssh $HALYARD_HOST \
    --project=$GCP_PROJECT \
    --zone=$ZONE \
    --ssh-flag="-L 9000:localhost:9000" \
    --ssh-flag="-L 8084:localhost:8084"
```

Before you perform hal deploy apply, add the docker registry corresponding to your region. In case your project is located in Europe, add the eu.gcr.io registry as illustrated below.

```
hal config provider docker-registry account add gcr-eu \
    --address eu.gcr.io \
    --password-file ~/.gcp/gcp.json \
    --username _json_key

hal config provider kubernetes account edit my-k8s-account --docker-registries my-gcr-account gcr-eu
```

#### IAM Configuration

Enable Stackdriver access for Spinnaker in [GCP's IAM settings](https://console.cloud.google.com/iam-admin/iam).

Add the following roles to the member with name `gcs-service-account`:
- Logging Admin
- Monitoring Admin

#### Automated Canary Analysis

Before you perform hal deploy apply, enable automated canary analysis.
Follow the guide further down, but first of all set some variables while still SSH’d in the Halyard VM.
One of these variables is the Spinnaker bucket automatically created when installing Halyard.
Look for the right bucket identifier in the GCP GKE buckets dashboard.

```
PROJECT_ID=$(gcloud info --format='value(config.project)')
JSON_PATH=~/.gcp/gcp.json
MY_SPINNAKER_BUCKET=spin-48b89b5e-dd67-446a-ad9f-66e8783e9822
```

Follow the [official canary quickstart documentation](https://www.spinnaker.io/setup/canary/#quick-start).

Configure the default metrics store.
```
hal config canary edit --default-metrics-store stackdriver
```

And finally execute the rollout.

```
hal deploy apply
```

### Troubleshooting

#### Authentication
Sometimes an issue might occur with credentials on the Halyard VM:

```
! ERROR Unable to communicate with your Kubernetes cluster: Failure
  executing: GET at: https://35.205.113.166/api/v1/namespaces. Message: Forbidden!
  User gke_spinnaker-demo-184310_europe-west1-d_spinnaker-alpha doesn't have
  permission. namespaces is forbidden: User "client" cannot list namespaces at the
  cluster scope: Unknown user "client"..
? Unable to authenticate with your Kubernetes cluster. Try using
  kubectl to verify your credentials.
```

In this case, enable legacy authentication in the GKE UI for the cluster.

#### Cluster Debugging
You can monitor deployment locally on your own PC by running `kubectl get pods -w --all-namespaces`.
For this to work, kubectl needs permissions to talk to the cluster.
You can use gcloud to populate your kubectl config file with credentials to access the cluster.
This can help you to look into specific logs of each Spinnaker pod or follow up on deployments handled by Spinnaker.

#### Audit Logging

You can find out which commands are sent to GCP by enabling audit logging.
Turn on audit logging: https://cloud.google.com/monitoring/audit-logging & https://cloud.google.com/logging/docs/audit/configure-data-access#example

<a name="commands" />

### Comprehensive list of commands

These are all the commands we executed in order to get everything set up.
Fill in the `<PLACEHOLDER>` placeholders according to your preferences.

```
gcloud components update

gcloud auth login
gcloud config set project <PROJECT_NAME>

GCP_PROJECT=$(gcloud info --format='value(config.project)')
ZONE=<ZONE_NAME>
gcloud container get-server-config --zone=$ZONE
CLUSTER_VERSION=<CLUSTER_VERSION>

CLOUDSDK_CONTAINER_USE_V1_API=false
CLOUDSDK_API_CLIENT_OVERRIDES_CONTAINER=v1beta1

gcloud beta container clusters create spinnaker \
  --zone=$ZONE \
  --project=$GCP_PROJECT \
  --cluster-version=$CLUSTER_VERSION \
  --enable-stackdriver-kubernetes \
  --enable-legacy-authorization

HALYARD_SA=halyard-service-account

gcloud iam service-accounts create $HALYARD_SA \
    --project=$GCP_PROJECT \
    --display-name $HALYARD_SA

HALYARD_SA_EMAIL=$(gcloud iam service-accounts list \
    --project=$GCP_PROJECT \
    --filter="displayName:$HALYARD_SA" \
    --format='value(email)')

gcloud projects add-iam-policy-binding $GCP_PROJECT \
    --role roles/iam.serviceAccountKeyAdmin \
    --member serviceAccount:$HALYARD_SA_EMAIL

gcloud projects add-iam-policy-binding $GCP_PROJECT \
    --role roles/container.admin \
    --member serviceAccount:$HALYARD_SA_EMAIL

GCS_SA=gcs-service-account

gcloud iam service-accounts create $GCS_SA \
    --project=$GCP_PROJECT \
    --display-name $GCS_SA

GCS_SA_EMAIL=$(gcloud iam service-accounts list \
    --project=$GCP_PROJECT \
    --filter="displayName:$GCS_SA" \
    --format='value(email)')

gcloud projects add-iam-policy-binding $GCP_PROJECT \
    --role roles/storage.admin \
    --member serviceAccount:$GCS_SA_EMAIL

gcloud projects add-iam-policy-binding $GCP_PROJECT \
    --member serviceAccount:$GCS_SA_EMAIL \
    --role roles/browser

HALYARD_HOST=$(echo $USER-halyard-`date +%m%d` | tr '_.' '-')

gcloud compute instances create $HALYARD_HOST \
    --project=$GCP_PROJECT \
    --zone=$ZONE \
    --scopes=cloud-platform \
    --service-account=$HALYARD_SA_EMAIL \
    --image-project=ubuntu-os-cloud \
    --image-family=ubuntu-1404-lts \
    --machine-type=n1-standard-4

gcloud compute ssh $HALYARD_HOST \
    --project=$GCP_PROJECT \
    --zone=$ZONE \
    --ssh-flag="-L 9000:localhost:9000" \
    --ssh-flag="-L 8084:localhost:8084"
```

Inside the Halyard VM:

```
KUBECTL_LATEST=$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)
curl -LO https://storage.googleapis.com/kubernetes-release/release/$KUBECTL_LATEST/bin/linux/amd64/kubectl
chmod +x kubectl
sudo mv kubectl /usr/local/bin/kubectl
curl -O https://raw.githubusercontent.com/spinnaker/halyard/master/install/debian/InstallHalyard.sh
sudo bash InstallHalyard.sh
. ~/.bashrc

GKE_CLUSTER_NAME=spinnaker
GKE_CLUSTER_ZONE=europe-west1-d
PROJECT_ID=$(gcloud info --format='value(config.project)')

gcloud config set container/use_client_certificate true
gcloud container clusters get-credentials $GKE_CLUSTER_NAME \
    --zone=$GKE_CLUSTER_ZONE

GCS_SA=gcs-service-account
GCS_SA_DEST=~/.gcp/gcp.json
mkdir -p $(dirname $GCS_SA_DEST)
GCS_SA_EMAIL=$(gcloud iam service-accounts list \
    --filter="displayName:$GCS_SA" \
    --format='value(email)')
gcloud iam service-accounts keys create $GCS_SA_DEST \
    --iam-account $GCS_SA_EMAIL

hal config version edit --version $(hal version latest -q)
hal config storage gcs edit \
    --project $PROJECT_ID \
    --json-path $GCS_SA_DEST
hal config storage edit --type gcs
hal config provider docker-registry enable
hal config provider docker-registry account add my-gcr-account \
    --address gcr.io \
    --password-file $GCS_SA_DEST \
    --username _json_key
hal config provider kubernetes enable
hal config provider kubernetes account add my-k8s-account \
    --docker-registries my-gcr-account \
    --context $(kubectl config current-context)

# Only required in case you want to use eu.gcr.io
hal config provider docker-registry account add gcr-eu \
    --address eu.gcr.io \
    --password-file $GCS_SA_DEST \
    --username _json_key
hal config provider kubernetes account edit my-k8s-account --docker-registries my-gcr-account gcr-eu

hal config deploy edit --account-name my-k8s-account
hal config deploy edit --type distributed

MY_SPINNAKER_BUCKET=<SPINNAKER_BUCKET_ID>

hal config canary enable
hal config canary google enable
hal config canary google account add my-google-account \
  --project $PROJECT_ID \
  --json-path $GCS_SA_DEST \
  --bucket $MY_SPINNAKER_BUCKET
hal config canary google edit --gcs-enabled true \
  --stackdriver-enabled true
hal config canary edit --default-metrics-store stackdriver
hal deploy apply
hal deploy connect
```

<a name="configuration" />

# Configuration

### Application Configuration

This guide uses the Kubernetes V1 provider, but you can just as well use V2.  
Follow the [official documentation](https://www.spinnaker.io/setup/install/providers/kubernetes-v2/#adding-an-account) to enable the V2 provider.

Visit [localhost:9000](http://localhost:9000) to open the Spinnaker UI.  
In the applications page, create a new application:
<div class="row" style="margin: 0 25% 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 10.58.43.png" alt="New application" title="New application"%}
</div>
</div>

Under Infrastructure, the Clusters view should normally be opened automatically.
Click the Config link on the top right and enable Canary for this project.
<div class="row" style="margin: 0 auto 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 11.02.31.png" alt="Features" title="Features"%}
</div>
</div>

This should enable Canary Analysis for the project.
The result should be that the Spinnaker menu for this project should be changed.
Pipelines are now nested underneath Delivery, which also now boasts Canary Configs and Canary Reports.  
In case this is not visualised directly, you can refresh the cache by clicking on the Spinnaker logo on the top left of the page, and clicking the Refresh all caches link in the Actions drop down.
<div class="row" style="margin: 0 25% 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 16.08.20.png" alt="Top menu" title="Top menu"%}
</div>
</div>

### Initial Provisioning

Under Infrastructure, switch to the Load Balancers view and create a load balancer.  
Fill in the stack, port, target port and type `LoadBalancer`.
<div class="row" style="margin: 0 auto 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 11.12.53.png" alt="Load balancer" title="Load balancer"%}
</div>
</div>

Under Infrastructure, switch to the Clusters view and create a Server Group.
<div class="row" style="margin: 0 25% 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 11.06.00.png" alt="Server group 1" title="Server group 1"%}
</div>
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 11.06.37.png" alt="Server group 2" title="Server group 2"%}
</div>
</div>

Once the server group is created, it will show up like this:
<div class="row" style="margin: 0 25% 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 11.09.45.png" alt="Chicklet" title="Chicklet"%}
</div>
</div>

By clicking on the little load balancer icon on the right-hand side, we can now visit the Ingress IP through the load balancer view on the side of the page.
<div class="row" style="margin: 0 65% 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 11.14.39.png" alt="Ingress" title="Ingress"%}
</div>
</div>

Back in the server group section, clicking on the little green chicklet will display container information on the side of the page, including logs of the application.

Let’s do this for PROD as well.  
Follow exactly the same steps as for DEV, except use `prod` as Stack instead of `dev`.

Once the PROD load balancer and server group are deployed, we’d like to make sure we never have downtime on PROD.  
We can set up a Traffic Guard, responsible for making sure our production cluster always has active instances.  
Go to the Config link on the top right of the page, and add a Traffic Guard.
<div class="row" style="margin: 0 auto 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 15.47.35.png" alt="Traffic guards" title="Traffic guards"%}
</div>
</div>

### Staging Pipeline

Now that we’ve deployed a single version of our application to DEV and PROD, it’s time to create a pipeline. 
This will enable us to continuously deploy new versions of our application without having to manually create new server groups every time.  
Head over to the pipelines view and create a new pipeline called Deploy to DEV.  
Under the first “Configuration” stage, configure an automated trigger.
<div class="row" style="margin: 0 15% 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 11.20.11.png" alt="Trigger DEV" title="Trigger DEV"%}
</div>
</div>

Now add a stage to deploy our application.
<div class="row" style="margin: 0 15% 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 11.23.39.png" alt="Template DEV" title="Template DEV"%}
</div>
</div>

We now have to add a server group as deployment configuration.
We can reuse the existing deployment as a template.
<div class="row" style="margin: 0 auto 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 11.22.30.png" alt="Deploy DEV" title="Deploy DEV"%}
</div>
</div>

Change the strategy to `Highlander`.

It’s important to change the image being deployed, otherwise, we’d always deploy the image of our existing server group.  
Go down to the Container section and select the Image from Trigger.
<div class="row" style="margin: 0 25% 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 11.24.45.png" alt="Image from trigger DEV" title="Image from trigger DEV"%}
</div>
</div>

This will automatically change the container image at the top of the dialog box under Basic Settings.
<div class="row" style="margin: 0 25% 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 11.27.00.png" alt="Deploy basic DEV" title="Deploy basic DEV"%}
</div>
</div>

Keep all other settings as they are.  
Save the server group configuration, and save the pipeline.

When we now select the pipelines view, we can see the newly created Deploy to DEV pipeline.  
We can test this by either starting a manual execution, or committing a change to our application GIT repository.

### Production Pipeline

Create new pipeline Deploy to PROD.
<div class="row" style="margin: 0 15% 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 11.33.58.png" alt="Trigger PROD" title="Trigger PROD"%}
</div>
</div>

Add a new Find Image from Cluster stage.
This stage will allow us to look for the image we deployed to DEV, and pass that information on to upcoming stages.
<div class="row" style="margin: 0 15% 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 11.35.51.png" alt="Find Image PROD" title="Find Image PROD"%}
</div>
</div>

Add a new Deploy stage to deploy the new DEV version into production.  
Under deploy configuration, add a server group based on the one in DEV.  
Make sure to set the right load balancer, i.e. `spinnakedemo-prod`.
<div class="row" style="margin: 0 25% 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 11.42.31.png" alt="Deploy lb PROD" title="Deploy lb PROD"%}
</div>
</div>

Scrolling down to the Container section, select the image found in DEV by the Find Image stage.
<div class="row" style="margin: 0 25% 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 11.40.12.png" alt="Deploy container PROD" title="Deploy container PROD"%}
</div>
</div>

Since this is a new version we'd like to push to production, it would be a good idea to build in some safety measures to protect us from unexpected failure.
Using a canary release strategy allows us to limit the blast radius of potential issues that might arrise.  
In the Basic Settings section, set the stack as `prod` and the detail as `canary` to indicate that this deployment is our canary deployment. Also use the `None` strategy, since we just want to deploy this canary server group next to the one already active in production.
<div class="row" style="margin: 0 25% 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 11.41.03.png" alt="Deploy basic PROD" title="Deploy basic PROD"%}
</div>
</div>

Now let’s test this out.  
Change the application to respond with PickleRicks if that's not already the case.
Otherwise, make an insignificant change to the application and push the changes to GIT (master branch).  
This should trigger a build, which should push a docker image to the GCR.  
That on its turn should trigger the deployment to DEV, which - if successful - should trigger a deployment to PROD.  
Once that’s done, your cluster view should look like this:
<div class="row" style="margin: 0 15% 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 15.44.18.png" alt="Infra view" title="Infra view"%}
</div>
</div>
Notice the `V001` on DEV, it has replaced the existing manual server group deployment using the highlander strategy.

Currently our canary is registered under the same load balancer as our production cluster. This means traffic is split between the canary and production.  
We could test the canary manually by going to the ingress endpoint of the load balancer as we did on DEV.
This could be sufficient for your needs, but Spinnaker offers automated canary analysis (aka. ACA), capable of automatically investigating traffic sent to the canary.  
The ACA engine Kayenta will compare certain metrics between the currently running production version, and the newly deployed canary version.  
Since comparing a fresh deployment with an old, potentially degraded deployment, could produce unwanted results, it’s advised to deploy both a canary and a current production instance labelled baseline, next to each other.

In the Deploy to PROD pipeline configure screen, add a stage in parallel with Find Image from DEV by clicking on the outer-left Configuration stage, and adding a new stage from that point on.
<div class="row" style="margin: 0 auto 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 15.57.42.png" alt="Find Image PROD" title="Find Image PROD"%}
</div>
</div>

From that point forward, add another Deploy stage, with the prod server group as template.
<div class="row" style="margin: 0 15% 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 15.58.51.png" alt="Template PROD" title="Template PROD"%}
</div>
</div>

At the bottom of the Deployment Cluster Configuration, switch the Container Image to the Find Image result for prod.
<div class="row" style="margin: 0 25% 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 16.00.03.png" alt="Deploy container baseline PROD" title="Deploy container baseline PROD"%}
</div>
</div>

Add `baseline` as detail, and keep the strategy as `None`.
<div class="row" style="margin: 0 25% 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 16.01.30.png" alt="Deploy basic baseline PROD" title="Deploy basic baseline PROD"%}
</div>
</div>

Save the pipeline.

We now have our basic setup of both a baseline and canary server group to perform canary analysis.

### Canary Analysis

Our specific demo scenario uses Meeseeks from Rick and Morty as the new version to deploy.  
As people who watched the series probably will know, Meeseeks can quickly become a threat to our way of living if we let nature run its course.
Therefore, when switching to Meeseeks, we also write Meeseeks in the logs to keep track of them.

GCP uses Stackdriver for logging and monitoring, so if we’d like to use the logs as a source of information for canary analysis, we should make a Stackdriver metric using the Meeseeks logs.  
In the GCP left-hand menu, under the Stackdriver section, you can find Logging and drill down to Logs-based metrics.  
Add a new metric using the following filter, replacing the location and project_id by your own:
`(resource.labels.cluster_name="spinnaker" AND resource.labels.location="europe-west1-d" AND resource.labels.namespace_name="default" AND resource.labels.project_id="spinnaker-demo-184310" AND textPayload:"Meeseeks”)`

<div class="row" style="margin: 0 65% 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 16.34.16.png" alt="Meeseeks log metric" title="Meeseeks log metric"%}
</div>
</div>
<div class="row" style="margin: 0 auto 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 16.36.00.png" alt="User-defined metrics" title="User-defined metrics"%}
</div>
</div>

Back in Spinnaker, head over to the Canary Configs view under Delivery.  
Create a new Canary Config called Demo-config, and add a filter template.  
The template will filter based on the replication controller of the server group:  
`resource.labels.pod_name:"${scope}"`
<div class="row" style="margin: 0 25% 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 16.17.57.png" alt="Filter template" title="Filter template"%}
</div>
</div>

Now we can add actual metrics to analyse.  
Create a new Metrics Group called Meeseeks, with one metric underneath.
<div class="row" style="margin: 0 25% 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 16.37.01.png" alt="Meeseeks metric" title="Meeseeks metric"%}
</div>
</div>

Since we’d also like to know whether our CPU or memory consumption has increased, let’s add some system metrics as well.
We can investigate which filters we can construct by using the [GCP REST API](https://cloud.google.com/monitoring/api/ref_v3/rest/v3/projects.timeSeries/list).  
Add a new group called Boring System Metrics, and add the following two metrics.
<div class="row" style="margin: 0 25% 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 19.26.55.png" alt="CPU metric" title="CPU metric"%}
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 19.27.34.png" alt="RAM metric" title="RAM metric"%}
</div>
</div>

The only thing left to do for this Canary Config, is to configure thresholds for the Metric Groups.  
The marginal is treated as a lower bound.
If an interval analysis fails to reach the marginal limit, the entire canary release will be halted and no further intervals will be analysed.
The pass limit is the upper bound, qualifying the analysis as a success.
Anything in between will be recorded and next intervals will be analysed.
<div class="row" style="margin: 0 15% 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 16.43.21.png" alt="Thresholds" title="Thresholds"%}
</div>
</div>

Save the Canary Config, and go back to the Deploy to PROD pipeline configuration.

Join both canary and baseline deployments into the Canary Analysis stage, by using the Depends On configuration.
<div class="row" style="margin: 0 auto 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 16.03.21.png" alt="ACA stage" title="ACA stage"%}
</div>
</div>

Configure the canary analysis stage as follows.
<div class="row" style="margin: 0 15% 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 19.09.07.png" alt="Canary config 1" title="Canary config 1"%}
</div>
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 19.09.57.png" alt="Canary config 2" title="Canary config 2"%}
</div>
</div>

### Rollout or Rollback

After the Canary Analysis has run, the new version can safely replace the existing production server group.  
Add a stage called Deploy to PROD, copying the production server group as template, and use the red/black (aka. blue/green) deployment strategy to avoid any downtime.
<div class="row" style="margin: 0 15% 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 15.58.51.png" alt="Template PROD" title="Template PROD"%}
</div>
</div>

At the bottom of the Deployment Cluster Configuration, switch the Container Image to the Find Image result for DEV.
<div class="row" style="margin: 0 25% 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 11.40.12.png" alt="Deploy container PROD" title="Deploy container PROD"%}
</div>
</div>

<div class="row" style="margin: 0 25% 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 17.03.46.png" alt="Deploy basic PROD" title="Deploy basic PROD"%}
</div>
</div>

Regardless whether this pipeline actually succeeds or not, we need to make sure to clean up afterwards.
Add a new pipeline called Tear Down Canary, with the following trigger.
<div class="row" style="margin: 0 15% 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 16.51.42.png" alt="Trigger Cleanup" title="Trigger Cleanup"%}
</div>
</div>

Add two Destroy Server Group stages in parallel.
<div class="row" style="margin: 0 auto 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 16.53.56.png" alt="Pipeline Cleanup" title="Pipeline Cleanup"%}
</div>
</div>

Configure the first one to destroy our baseline server group.
<div class="row" style="margin: 0 15% 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 16.54.22.png" alt="Destroy baseline" title="Destroy baseline"%}
</div>
</div>

And finally also destroy the canary server group.
<div class="row" style="margin: 0 15% 2.5rem auto;">
<div class="col-md-offset-3 col-md-6">
{% include image.html img="/img/spinnaker/Screen Shot 2018-05-28 at 16.54.08.png" alt="Destroy canary" title="Destroy canary"%}
</div>
</div>

<a name="running-demo" />

# Running the demo scenario

<a name="conclusion" />

# Conclusion



