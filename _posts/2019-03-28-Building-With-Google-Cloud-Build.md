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
we will have a quick overview on what is possible with Google Cloud Build.

Google Cloud Build is a fully managed solution for building containers or other artifacts.
It can integrate with Google Storage, Cloud Source Repositories, GitHub and BitBucket.

## A simple YAML file

We can easily set up a build pipeline using a YAML file which you store in your source code.
Each build step is defined using a container image and passing arguments to it.
Here is an example:

```
steps:
  # Test Helm templates
  - name: 'quay.io/helmpack/chart-testing:v2.2.0'
    id: 'Helm Lint'
    args: ['ct', 'lint', '--all', '--chart-dirs', '/workspace/helm', '--validate-maintainers=false']

  # Build image
  - name: 'gcr.io/cloud-builders/docker'
    id: 'Building image'
    args: ['build', '-t', 'eu.gcr.io/$PROJECT_ID/cloud-build-demo:$COMMIT_SHA', '.']

  # Create custom image tag and write to file /workspace/_TAG
  - name: 'ubuntu'
    id: 'Setup'
    args: ['bash', '-c', "echo `echo $BRANCH_NAME | sed 's,/,-,g' | awk '{print tolower($0)}'`_$(date -u +%Y%m%dT%H%M)_$SHORT_SHA > _TAG; echo $(cat _TAG)"]

  # Tag image with custom tag
  - name: 'gcr.io/cloud-builders/docker'
    id: 'Tagging image'
    entrypoint: '/bin/bash'
    args: ['-c', "docker tag eu.gcr.io/$PROJECT_ID/cloud-build-demo:$COMMIT_SHA eu.gcr.io/$PROJECT_ID/ms-map-report:$(cat _TAG)"]
images: ['eu.gcr.io/$PROJECT_ID/cloud-build-demo']
timeout: 15m
options:
  machineType: 'N1_HIGHCPU_8'
```

We are free to use any image that we like.
Cloud Build already [provides a set of base images (called Cloud Builders)](https://cloud.google.com/cloud-build/docs/cloud-builders),
including images for Maven, Git, Docker, Bazel, npm, gcloud, kubectl, etc. 

We can also customise some build options like the timeout of the build,
or on which kind of node the build runs.
Pricing is done based on the amount of build minutes. 
However, 
if we use the default node, 
the first 120 build minutes are free every day!

If the build finishes successfully,
Cloud Build will automatically upload the built images to the container registry.
This is based on the images defined in the `images` array.

Data usually needs be shared in between steps.
We might want to download dependencies in one step,
and build your artifact in another step,
or run tests in a separate step.
Google has provided a simple solution for this.
Each build step has access to the `/workspace` folder, 
which is mounted on the container of each step.
Each build has access to its own workspace folder,
which is deleted automatically after the build finishes.

In the above example, 
a custom Docker tag is created and saved to the `/workspace/_TAG` file,
and then read from again in the next step.

To start the build, 
we can use the `gcloud builds submit` command,
or create an automatic trigger on the Google Cloud console that triggers the build on new commits in the Git repository.
After adding a trigger, 
we can also trigger the build manually in the Google Cloud console.


## Build parameters (substitutions)

It is possible to pass in parameters (called substitutions) to our build.

We can override substitutions when submitting a build:

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

We can use `substitions` to define our own custom parameters.
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

If we require to use credentials in our builds,
it is possible to do this securely using Google Cloud Key Management Service (KMS).
We will not go into [how to use and to setup KMS](https://cloud.google.com/kms/docs/quickstart),
but once we have set it up,
we can start encrypting our build secrets.


First, we will need to give Cloud Build access to KMS by adding the **Cloud KMS CryptoKey Decrypter** role
to our `...@cloudbuild.gserviceaccount.com` service account.


Encrypt our secret with KMS:

```
$ gcloud kms encrypt \
  --plaintext-file=secrets.json \
  --ciphertext-file=secrets.json.enc \
  --location=global \
  --keyring=[KEYRING-NAME] \
  --key=[KEY-NAME]
```

This will create an encrypted file which we can add to our application's source code.
Using KMS, we can decrypt this secret in our Cloud Build pipeline:

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

This will decrypt the secret into a file in our workspace folder,
which then can be used in subsequent steps.

## Debugging and running your build locally

When creating a build pipeline, 
we do not need to keep pushing our code to the source repository to trigger a build.
We can use the `cloud-build-local` tool to run our build locally,
using the Google Cloud SDK and Docker.

If we are using the Cloud Builder images (`gcr.io/cloud-builders/...`),
we must first configure our Google Cloud SDK to be able to pull the images:

```
# Configure Docker
$ gcloud components install docker-credential-gcr
$ docker-credential-gcr configure-docker
```

Then install the `cloud-build-local` tool:

```
$ gcloud components install cloud-build-local
```

Now we can use the tool to test our build pipeline locally!

To build locally, we run the following command:

```
$ cloud-build-local --config=[CONFIG FILE] \
  --dryrun=false \
  --push \
  [SOURCE_CODE]
```

* `CONFIG FILE` is our Cloud Build YAML config file
* `SOURCE_CODE` is the path to our source code
* `--dryrun=false` will cause our build to actually run. 
This is `true` by default and we must enable this explicitly to cause the containers to execute.
* `--push` will cause the built images defined in `images` to be pushed to the registry.

If we use some of the default substitions like `$COMMIT_SHA` in our build,
we must pass these in with the `--substitions` flag in key=value pairs,
separated by commas.
Example:

 ```
 $ cloud-build-local --config=cloud-build.yaml \
   --dryrun=false \
   --substitutions COMMIT_SHA=$(git rev-parse HEAD),BRANCH_NAME=$(git rev-parse  --abbrev-ref HEAD) \ 
   /path/to/source
 ```
 
Cloud Build stores intermediary artifacts in the workspace folder.
This workspace folder, 
as mentioned before,
will be removed after the build finishes.
If we want to debug our build and check what happened in the workspace folder,
then we can copy the artifacts to a path on our computer,
using the `--write-workspace` flag.
Note that this path must reside outside of our source folder!

```
$ cloud-build-local --config=cloud-build.yaml \
   --dryrun=false \
   --write-workspace=/path/on/computer \
   /path/to/source
```

## Build events

It is possible to trigger other actions when a build starts, finishes, or fails.
Notifications to our team's chat,
triggering a deployment pipeline,
monitoring our build. 
These are just a few examples.
Cloud Build pushes build events to Pub/Sub on the `cloud-builds` topic.
This topic is created automatically when Cloud Build is used.

We can easily create a subscription on this topic. 
There are two kinds of subscriptions we can use.
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

Note that Cloud Build does not publish events between steps, 
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

It saves you a lot of time and trouble in setting up build infrastructure, 
because, well, you do not have to!

If you wish to try it yourself,
we have provided [a demo application on GitHub](https://github.com/tomverelst/cloud-build-demo).
Enjoy Cloud Building!
