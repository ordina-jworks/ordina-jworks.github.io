---
layout: post
authors: [tom_verelst]
title: 'Building with Google Cloud Build'
image: /img/2019-03-28-cloudbuild/cloudbuild.png
tags: [GCP,Docker,DevOps,Git,Kubernetes]
category: Cloud
comments: false
---

In this post, 
I will give a quick overview on what is possible with Google Cloud Build.

Google Cloud Build is a fully managed solution to building containers or other artifacts.
It integrates with Google Storage, Cloud Source Repositories, GitHub or BitBucket.

## A simple YAML file

You can easily set up a build pipeline using a YAML file which you store in your source code.
Each build step is defined using a container image and passing arguments to it.
Here is an example:

```
steps:

# Build application
- name: 'gcr.io/cloud-builders/mvn'
  id: 'Build'
  args: ['mvn', 'install', '--batch-mode']

# Test Helm templates
- name: 'quay.io/helmpack/chart-testing:v2.2.0'
  id: 'Helm Lint'
  args: ['ct', 'lint', '--all', '--chart-dirs', '/workspace/helm']

# Build image
- name: 'gcr.io/cloud-builders/docker'
  id: 'Building image'
  args: ['build', '-t', 'eu.gcr.io/$PROJECT_ID/myapp:$COMMIT_SHA', '.']

# Create custom build tag and write to file _TAG
- name: 'ubuntu'
  id: 'Setup'
  args: ['bash', '-c', "echo `echo $BRANCH_NAME | sed 's,/,-,g' | awk '{print tolower($0)}'`_$(date -u +%Y%m%dT%H%M)_$SHORT_SHA > _TAG; echo $(cat _TAG)"]

# Tag image with custom tag
- name: 'gcr.io/cloud-builders/docker'
  id: 'Tagging image'
  entrypoint: '/bin/bash'
  args: ['-c', "docker tag eu.gcr.io/$PROJECT_ID/myapp:$COMMIT_SHA eu.gcr.io/$PROJECT_ID/myapp:$(cat _TAG)"]
  
# Define which images are uploaded to your project's container registry.
images: ['eu.gcr.io/$PROJECT_ID/myapp']
timeout: 15m
options:
  machineType: 'N1_HIGHCPU_8'
```

You are free to use any image that you like.
Cloud Build already [provides a set of base images (called Cloud Builders)](https://cloud.google.com/cloud-build/docs/cloud-builders),
including images for Maven, Git, Docker, Bazel, npm, gcloud, kubectl and so on. 

You can also customise some build options like the timeout time of the build,
or on which kind of node the build runs.
Pricing is done based on the amount of build minutes. 
However, 
if you use the default node, 
the first 120 build minutes are free every day!

If the build finishes successfully,
Cloud Build will automatically upload the built images to your project's container registry.
This is based on the images defined in the `images` array.

Data usually needs be shared in between steps.
You might want to download dependencies in one step,
and build your artifact in another step,
or run tests in a separate step.
Google has provided a simple solution for this.
Each build step has access to the `/workspace` folder, 
which is mounted on each step container.
Each build has access to its own workspace folder,
which is deleted automatically after the build finishes.

In the above example, 
a custom Docker tag is created and saved to the `/workspace/_TAG` file,
and then read from again in the next step.


## Build parameters (substitutions)

It is possible to pass in parameters (called substitutions) to your build.

You can override substitutions when submitting a build:

 ```
 $ gcloud builds submit --config=cloudbuild.yaml \
     --substitutions=TAG_NAME="test"
 ```
 
Cloud Build provides the following default substitutions:
 
 * `$PROJECT_ID`: `build.ProjectId`
 * `$BUILD_ID`: `build.BuildId`
 * `$COMMIT_SHA`: `build.SourceProvenance.ResolvedRepoSource.Revision.CommitSha` (only available for triggered builds)
 * `$SHORT_SHA` : The first seven characters of `COMMIT_SHA` (only available for triggered builds)
 * `$REPO_NAME`: `build.Source.RepoSource.RepoName` (only available for triggered builds)
 * `$BRANCH_NAME`: `build.Source.RepoSource.Revision.BranchName` (only available for triggered builds)
 * `$TAG_NAME`: `build.Source.RepoSource.Revision.TagName` (only available for triggered builds)
 * `$REVISION_ID`: `build.SourceProvenance.ResolvedRepoSource.Revision.CommitSha` (only available for triggered builds)

You can use `substitions` to define your own custom parameters.
Note that the name of the substitution must start with an underscore (`_`),
and can only use uppercase alphanumeric characters. Example:

```
substitutions:
    _CUSTOM_PARAM_1: foo # default value
    _CUSTOM_PARAM_2: bar # default value
images: [
    'gcr.io/$PROJECT_ID/myapp-${_CUSTOM_PARAM_1}',
    'gcr.io/$PROJECT_ID/myapp-${_CUSTOM_PARAM_2}'
]
```
 
## Securing your build

If you require to use credentials in your builds,
it is possible to do this securely using Google Cloud Key Management Service (KMS).
I will not go into [how to use and to setup KMS](https://cloud.google.com/kms/docs/quickstart),
but once you have set it up,
you can start encrypting your build secrets.


First, you will need to give Cloud Build access to KMS by adding the **Cloud KMS CryptoKey Decrypter** role
to your `...@cloudbuild.gserviceaccount.com` service account.


Encrypt your secret with KMS:

```
gcloud kms encrypt \
  --plaintext-file=secrets.json \
  --ciphertext-file=secrets.json.enc \
  --location=global \
  --keyring=[KEYRING-NAME] \
  --key=[KEY-NAME]
```

This will create an encrypted file which you can add to your application's source code.
Using KMS, you can decrypt this secret in your Cloud Build pipeline:

```
steps:
- name: gcr.io/cloud-builders/gcloud
  args:
  - kms
  - decrypt
  - --ciphertext-file=secrets.json.enc
  - --plaintext-file=secrets.json
  - --location=global
  - --keyring=[KEYRING-NAME]
  - --key=[KEY-NAME]
```

This will decrypt the secret into a file in your workspace folder,
which then can be used in subsequent steps.

## Build events

It is possible to trigger other actions when a build starts, finishes, or fails.
Notifications to your team's chat,
triggering a deployment pipeline,
monitoring your build. 
These are just a few examples.
Cloud Build pushes build events to Pub/Sub on the `cloud-builds` topic.
This topic is created automatically when you start using Cloud Build.

You can easily create a subscription on this topic. 
There are two kinds of subscriptions you can use.
The first one is a push subscription, 
which pushes the message to a HTTP endpoint you define.
In this case messages are delivered the moment the event is published on the topic.

```
{
  "message": {
    "attributes": {
      "buildId": "abcd-efgh...",
      "status": "SUCCESS"
    },
    "data": "SGVsbG8gQ2xvdWQgUHViL1N1YiEgSGVyZSBpcyBteSBtZXNzYWdlIQ==",
    "message_id": "136969346945"
  },
  "subscription": "projects/myproject/subscriptions/mysubscription"
}
```

Messages that are received using a pull subscription have the following format:

```
{
  "receivedMessages": [
    {
      "ackId": "dQNNHlAbEGEIBERNK0EPKVgUWQYyODM2LwgRHFEZDDsLRk1SK...",
      "message": {
        "attributes": {
          "buildId": "abcd-efgh-...",
          "status": "SUCCESS"
        },
        "data": "SGVsbG8gQ2xvdWQgUHViL1N1YiEgSGVyZSBpcyBteSBtZXNzYWdlIQ==",
        "messageId": "19917247034"
      }
    }
  ]
}
```


Each message contains the Base64 encoded event of the [Build resource](https://cloud.google.com/cloud-build/docs/api/reference/rest/v1/projects.builds).
Here is an example:


```
{
  "id": "a0e322f2-5d8d-4d56-a2b5-05cc18a350af",
  "projectId": "myproject",
  "status": "SUCCESS",
  "source": {
    "repoSource": {
      "projectId": "myproject",
      "repoName": "mygitrepo",
      "branchName": "feature/my-branch"
    }
  },
  "steps": [
    {
      "name": "gcr.io/cloud-builders/mvn",
      "args": [
        "mvn",
        "clean",
        "--batch-mode"
      ],
      "id": "Clean",
      "timing": {
        "startTime": "2019-03-23T15:01:25.421160679Z",
        "endTime": "2019-03-23T15:02:04.363792008Z"
      },
      "pullTiming": {
        "startTime": "2019-03-23T15:01:25.421160679Z",
        "endTime": "2019-03-23T15:01:59.834114283Z"
      },
      "status": "SUCCESS"
    },
    ... More steps
  ],
  "results": {
    "images": [
      {
        "name": "eu.gcr.io/myproject/myapp:d76cce6d732e6edc01e65a547997caf107411468",
        "digest": "sha256:0bb2f72d3d267c6bfebee8478d06dbf553d5932e01a0b86b7fc298c3a9b4a1f2",
        "pushTiming": {
          "startTime": "2019-03-23T15:15:58.377229824Z",
          "endTime": "2019-03-23T15:16:01.908997933Z"
        }
      }
    ],
    "buildStepImages": [
      "",
      "sha256:dbc62a5cd330fba4d092d83f64218f310ee1a61bdb49d889728091756bc38bac",
      "sha256:dbc62a5cd330fba4d092d83f64218f310ee1a61bdb49d889728091756bc38bac",
      "sha256:dbc62a5cd330fba4d092d83f64218f310ee1a61bdb49d889728091756bc38bac",
      "sha256:dbc62a5cd330fba4d092d83f64218f310ee1a61bdb49d889728091756bc38bac",
      "sha256:dbc62a5cd330fba4d092d83f64218f310ee1a61bdb49d889728091756bc38bac",
      "sha256:d30ca59f3315232f539955a6179f2b287445ec56db41e7d7a41a622c9faee575",
      "sha256:d30ca59f3315232f539955a6179f2b287445ec56db41e7d7a41a622c9faee575",
      "sha256:d30ca59f3315232f539955a6179f2b287445ec56db41e7d7a41a622c9faee575"
    ],
    "buildStepOutputs": []
  },
  "createTime": "2019-03-23T15:01:16.591984806Z",
  "startTime": "2019-03-23T15:01:17.438509785Z",
  "finishTime": "2019-03-23T15:16:02.968224Z",
  "timeout": "1800s",
  "images": [
    "eu.gcr.io/myproject/myapp:d76cce6d732e6edc01e65a547997caf107411468"
  ],
  "artifacts": {
    "images": [
      "eu.gcr.io/myproject/myapp:d76cce6d732e6edc01e65a547997caf107411468"
    ]
  },
  "logsBucket": "gs://199957373521.cloudbuild-logs.googleusercontent.com",
  "sourceProvenance": {
    "resolvedRepoSource": {
      "projectId": "mateco-map",
      "repoName": "bitbucket_matecocloud_myapp",
      "commitSha": "d76cce6d732e6edc01e65a547997caf107411468"
    }
  },
  "buildTriggerId": "9bd093c7-9de4-4eae-bfea-ce8e46afafa8",
  "options": {
    "substitutionOption": "ALLOW_LOOSE",
    "logging": "LEGACY"
  },
  "logUrl": "https://console.cloud.google.com/gcr/builds/a0e322f2-5c8d-4e56-a2b5-05cc18a350af?project=199957373521",
  "substitutions": {
    "_MOD_BRANCH_NAME": "$_tmpvar"
  },
  "tags": [
    "event-f2d96d7b-22f5-41d7-9ded-a98a2a6f43ca",
    "trigger-9bd093c7-9de4-4eae-bfea-ce8e46afafa8"
  ],
  "timing": {
    "BUILD": {
      "startTime": "2019-03-23T15:01:25.421114358Z",
      "endTime": "2019-03-23T15:15:58.377209942Z"
    },
    "FETCHSOURCE": {
      "startTime": "2019-03-23T15:01:20.519103589Z",
      "endTime": "2019-03-23T15:01:25.368505523Z"
    },
    "PUSH": {
      "startTime": "2019-03-23T15:15:58.377226850Z",
      "endTime": "2019-03-23T15:16:01.909032379Z"
    }
  }
}
```

Note that Cloud Build does not publish events in between steps, 
but only when the build is queued, starts or ends.

| Event        | Build status  | 
| ------       | -----------   | 
| The build is queued | `QUEUED`      | 
| The build starts | `WORKING`      | 
| The build is successful | `SUCCESS`  | 
| Build is cancelled | `CANCELLED` |
| Build times out | `TIMEOUT` | 
| Step times out | `TIMEOUT` |  
| Build failed | `FAILURE` |  
| Internal error by Google Cloud Build  | `INTERNAL_ERROR` |  


Using Google Cloud Function, 
we can easily trigger other actions based on these build events.

Here is a small, redacted snippet of a Google Cloud Function
which sends build updates to a Slack webhook.

It receives the build event, reads the Base64 encoded data,
converts it into a Slack message and triggers the webhook with the created message.


```
const IncomingWebhook = require('@slack/client').IncomingWebhook;
const SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/XXXXXXXXXXXXXX";
const WEBHOOK = new IncomingWebHook(SLACK_WEBHOOK_URL);

// Main function called by Cloud Functions.
module.exports.cloudBuildSlack = (event, callback) => {
    const build = eventToBuild(event.data.data);
    WEBHOOK.send(createSlackMessage(build), callback);
};
    
const createSlackMessage = (build) => {
    const app = getApplicationName(build);
    const branch = build.source.repoSource.branchName;
    const subject = createSubject(build);
    const tag = getImagetag(build);

    return {
        attachments: [{
            fallback: `${subject} - ${app} - ${branch} - <${build.logUrl}|Logs>`,
            title: subject,
            title_link: build.logUrl,
            fields: getFields(app, branch, tag),
            color: getMessageColor(build)
        }],
        mrkdwn: true
    };
};

// eventToBuild transforms pubsub event message to a build object.
const eventToBuild = (data) => {
    return JSON.parse(new Buffer(data, 'base64').toString());
};

...more functions
    
```


## Conclusion

Cloud Build offers a simple solution and utilises the power of containers to offer a lot of possibilities.
A build pipeline is set up in a few minutes, and your Docker images are uploaded automatically!

It saves you a lot of time and trouble of setting up build infrastructure, 
because, well, you do not have to!