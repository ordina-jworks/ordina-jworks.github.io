---
layout: post
authors: [yannick_de_turck]
title: "Lagom 1.4 and Kubernetes orchestration"
image: /img/lagom-kubernetes.png
tags: [Lagom, Java, Scala, Reactive, Kubernetes, Minikube]
category: Orchestration
comments: true
---

## Table of Contents

1. [Introduction](#introduction)
2. [Upgrading to Lagom 1.4](#upgrading-to-lagom-14)
3. [Lightbend's orchestration tools](#lightbends-orchestration-tools)
4. [Adding Kubernetes support to our Lagom Shop Scala application](#adding-kubernetes-support-to-our-lagom-shop-scala-application)
5. [Building and publishing Docker images](#building-and-publishing-docker-images)
6. [Locally deploying to Kubernetes using Minikube](#locally-deploying-to-kubernetes-using-minikube)
7. [Generating Kubernetes resources for production](#generating-kubernetes-resources-for-production)
8. [Conclusion](#conclusion)
9. [Extra resources](#extra-resources)

## Introduction
In this blog post we will take a closer look at the [Lightbend Orchestration tools](https://developer.lightbend.com/docs/lightbend-orchestration-kubernetes/latest/index.html){:target="_blank" rel="noopener noreferrer"}.
Tools helping you deploy your Lagom application to Kubernetes and DC/OS.
It was already possible to deploy Lagom applications to Kubernetes as [this guide](https://developer.lightbend.com/guides/lagom-kubernetes-k8s-deploy-microservices/){:target="_blank" rel="noopener noreferrer"} demonstrates but it involved more manual tasks and having to write the Kubernetes resource and configuration files yourself, as it usually goes.

As it currently stands, the tools are only supported in combination with sbt so Maven users cannot fully take advantage of it just yet.
Maven support will follow soon however as the [Maven equivalent plugin](https://github.com/lightbend/reactive-app-maven-plugin){:target="_blank" rel="noopener noreferrer"} is nearing its first release version.

If you are new to Lagom feel free to take a look at one of our earlier blog posts on Lagom:
- [Lagom: First Impressions and Initial Comparison to Spring Cloud](/microservices/2016/04/22/Lagom-First-Impressions-and-Initial-Comparison-to-Spring-Cloud.html){:target="_blank" rel="noopener noreferrer"}
- [Lagom 1.2: What's new?](/microservices/2017/02/01/Lagom-1-2.html){:target="_blank" rel="noopener noreferrer"}

Before getting to that though, we will upgrade our sample application [Lagom Shop Scala](https://github.com/yannickdeturck/lagom-shop-scala){:target="_blank" rel="noopener noreferrer"}, which was also referred to in our previous blog posts, 
from Lagom 1.2 to [Lagom 1.4](https://www.lagomframework.com/blog/lagom-1-4-0.html){:target="_blank" rel="noopener noreferrer"} to demonstrate the upgrading process.
The application consists of two Lagom microservices combined with a frontend written in Play Framework.
Afterwards we will take a closer look at how easy it is to integrate the Lightbend Orchestration tools into our project and how we can get our project up and running on Kubernetes.
Note that this blog post is not an in-depth guide on the tools themselves but more a general overview and for us to share our impressions.

## Upgrading to Lagom 1.4
In this section we will upgrade our sample application [Lagom Shop Scala](https://github.com/yannickdeturck/lagom-shop-scala){:target="_blank" rel="noopener noreferrer"}, from version 1.3.4 to 1.4.x.
Lagom 1.4 uses Play Framework's latest version, 2.6 for which we will also need to change a few things in our project.
 
Lightbend provides a migration guide for each new version they release, so in this case we followed the [Lagom 1.4 Migration Guide](https://www.lagomframework.com/documentation/1.4.x/scala/Migration14.html){:target="_blank" rel="noopener noreferrer"} and the [Play 2.6 Migration Guide](https://www.playframework.com/documentation/2.6.x/Migration26){:target="_blank" rel="noopener noreferrer"}.
When upgrading multiple minor versions, it is advised to upgrade one minor version at a time to smoothen the process.
In our case we are only limited to upgrading a single minor version so we can just use the latest migration guide right away.

Upgrade the Lagom version in `project/plugins.sbt`:
```scala
addSbtPlugin("com.lightbend.lagom" % "lagom-sbt-plugin" % "1.4.5")
```

Upgrade the sbt version in `project/build.properties`:
```scala
sbt.version=0.13.16
```

Upgrade the Scala version to `2.12.4` in `build.sbt`:
```scala
scalaVersion in ThisBuild := "2.12.4"
```

Upgrade Play JSON Derived Codecs to 4.0.0 which adds Play 2.6 support:
```scala
val playJsonDerivedCodecs = "org.julienrf" %% "play-json-derived-codecs" % "4.0.0"
```

Replace `play.api.data.validation.ValidationError` with `play.api.libs.json.JsonValidationError`.

Mix in `LagomConfigComponent`, `HttpFiltersComponents` and `AssetsComponents` and remove `lazy val assets: Assets = wire[Assets]` in the application loader class extending `BuiltInComponentsFromContext` in the Play frontend project.
```scala
abstract class Frontend(context: Context) extends BuiltInComponentsFromContext(context)
  with I18nComponents
  with AhcWSComponents
  with LagomKafkaClientComponents
  with LagomServiceClientComponents
  with LagomConfigComponent
  with HttpFiltersComponents
  with AssetsComponents {
```


Change `override def describeServices` to `override def describeService` in each Lagom project's class extending `LagomServerComponents` as the other one has become deprecated.
```scala
override def describeService = Some(readDescriptor[ItemService])
```

Implement CSRF security in the frontend project by utilising CSRF form fields (`@CSRF.formField`) or [one of the other approaches](https://www.playframework.com/documentation/2.6.x/ScalaCsrf#Protecting-against-Cross-Site-Request-Forgery){:target="_blank" rel="noopener noreferrer"}.

Note that Lagom’s development mode service locator now listens on port 9008 instead of 8000 although this can still be changed by [overriding the default port](https://www.lagomframework.com/documentation/1.4.x/scala/ServiceLocator.html#Default-port){:target="_blank" rel="noopener noreferrer"}.

To see a complete list of changes we did, refer to commit [bdf5ecff](https://github.com/yannickdeturck/lagom-shop-scala/commit/bdf5ecff50df606c2f4ed15200ce76b9d14c8f0a){:target="_blank" rel="noopener noreferrer"}.

## Lightbend's orchestration tools
As we mentioned in the introduction, Lightbend offers a developer-centric suite of tools helping you deploy your Play/Akka/Lagom applications to Kubernetes and DC/OS.
The tools help you create a Docker image of all your applications, 
help with generating Kubernetes and DC/OS resource and configuration files based on the Docker images, 
and they allow you to deploy your whole Lagom project to Kubernetes using a simple command which can be pretty convenient for development. 
The generated JSON and YAML files could be put under version control after which they can be submitted to a CI/CD integrated central repository.

The suite consists of three different tools:
- [sbt-reactive-app](https://github.com/lightbend/sbt-reactive-app){:target="_blank" rel="noopener noreferrer"}, an sbt plugin that inspects your projects and builds annotated Docker images.
The [Maven equivalent plugin](https://github.com/lightbend/reactive-app-maven-plugin){:target="_blank" rel="noopener noreferrer"} is still being worked on and is nearing its first release version.
- [reactive-cli](https://github.com/lightbend/reactive-cli){:target="_blank" rel="noopener noreferrer"}, a command-line tool with which you generate the Kubernetes and DC/OS resource and configuration files.
You need to install this on the device or environment from which you will deploy to Kubernetes.
Install guidelines are available in the [documentation](https://developer.lightbend.com/docs/lightbend-orchestration-kubernetes/latest/cli-installation.html#install-the-cli){:target="_blank" rel="noopener noreferrer"}.
For Mac for example this is easily accomplished with Homebrew: 
```sbtshell
brew tap lightbend/tools && brew install lightbend/tools/reactive-cli
```
- [reactive-lib](https://github.com/lightbend/reactive-lib/){:target="_blank" rel="noopener noreferrer"}, a library for your application that is automatically included in your application's build by the sbt-reactive-app sbt plugin.
It allows your application to perform service discovery, access secrets, define health and readiness checks, and more as it understands the conventions of the resources generated by the command-line tool.
 
## Adding Kubernetes support to our Lagom Shop Scala application
We start off with adding the `sbt-reactive-app` sbt plugin in the `project/plugins.sbt` file:
```scala
addSbtPlugin("com.lightbend.rp" % "sbt-reactive-app" % "1.1.0")
```

Now enable the plugin for each module in the `build.sbt` file:
```scala
lazy val itemImpl = (project in file("item-impl"))
  .dependsOn(itemApi)
  .settings(commonSettings: _*)
  .enablePlugins(LagomScala, SbtReactiveAppPlugin)
  
lazy val orderImpl = (project in file("order-impl"))
  .dependsOn(orderApi, itemApi)
  .settings(commonSettings: _*)
  .enablePlugins(LagomScala, SbtReactiveAppPlugin)
  .settings(
    libraryDependencies ++= Seq(
      lagomScaladslPersistenceCassandra,
      lagomScaladslTestKit,
      lagomScaladslKafkaBroker,
      cassandraDriverExtras,
      macwire,
      scalaTest
    )
  )
  .settings(lagomForkedTestSettings: _*)
  
lazy val frontend = (project in file("frontend"))
  .dependsOn(itemApi, orderApi)
  .settings(commonSettings: _*)
  .enablePlugins(PlayScala && LagomPlay, SbtReactiveAppPlugin)
  .settings(
    version := "1.0-SNAPSHOT",
    libraryDependencies ++= Seq(
      lagomScaladslServer,
      lagomScaladslKafkaClient,
      macwire,
      scalaTest,
      "org.webjars" % "foundation" % "6.2.3",
      "org.webjars" % "foundation-icon-fonts" % "d596a3cfb3"
    ),
    EclipseKeys.preTasks := Seq(compile in Compile),
    httpIngressPaths := Seq("/")
  )
```

If you also have a frontend module it is important to define the `httpIngressPaths`, as you might have seen in the code sample above, in order to have your frontend be accessible from outside the cluster.

Mix in the `LagomServiceLocatorComponents` trait in each module’s application loader:
```scala
import com.lightbend.rp.servicediscovery.lagom.scaladsl.LagomServiceLocatorComponents

class ItemApplicationLoader extends LagomApplicationLoader {
  override def load(context: LagomApplicationContext): LagomApplication =
    new ItemApplication(context) with LagomServiceLocatorComponents {
      override lazy val circuitBreakerMetricsProvider = new CircuitBreakerMetricsProviderImpl(actorSystem)
    }
}
```

## Building and publishing Docker images
The tool suite comes with an easy way to deploy all your services to Minikube for development so you will want to set that up first.
For installation instructions, consult the [Minikube documentation](https://kubernetes.io/docs/getting-started-guides/minikube/){:target="_blank" rel="noopener noreferrer"}.

Start up Minikube with a sufficient amount of memory:
```sbtshell
$ minikube start --memory 8192
Starting local Kubernetes v1.10.0 cluster...
Starting VM...
Getting VM IP address...
Moving files into cluster...
Setting up certs...
Connecting to cluster...
Setting up kubeconfig...
Starting cluster components...
Kubectl is now configured to use the cluster.
Loading cached images from config file.
```

You kind of need a decent device with a decent amount of RAM.
I have tested all of this on a MacBook Pro with 8GB RAM and I simply was not able to assign a sufficient amount of memory to comfortably run everything locally.

Execute the following command to have our Docker environment variables point to Minikube:
```sbtshell
eval $(minikube docker-env)
```

We can check if Minikube is up and running with the following command:
```sbtshell
$ kubectl get nodes
NAME       STATUS    ROLES     AGE       VERSION
minikube   Ready     <none>    1m        v1.8.0
```

To figure out your Minikube IP you can utilise the following command:
```sbtshell
$ echo "http://$(minikube ip)"
http://192.168.99.100
```

It is also important to enable the Ingress addon:
```sbtshell
minikube addons enable ingress
```

We need to launch sbt:
```sbtshell
$ sbt
```

After which we can publish the images locally (you might want to grab a coffee after executing this):
```sbtshell
docker:publishLocal
```

Underneath, [SBT Native Packager](https://github.com/sbt/sbt-native-packager){:target="_blank" rel="noopener noreferrer"} is being used.
Check out its [documentation](http://www.scala-sbt.org/sbt-native-packager/){:target="_blank" rel="noopener noreferrer"} for Docker related configurations.

Publishing to a Docker Registry is also possible by defining the `dockerRepository` sbt setting in the project and after authenticating to the registry, see [Publishing to a Docker Registry](https://developer.lightbend.com/docs/lightbend-orchestration-kubernetes/latest/building.html#publishing-to-a-docker-registry){:target="_blank" rel="noopener noreferrer"}.
After doing so you can execute the publish command:
```sbtshell
docker:publish
```

Our Docker images should then be available:
```sbtshell
$ docker images
REPOSITORY             TAG                 IMAGE ID            CREATED             SIZE
orderimpl              1.0-SNAPSHOT        e9be41c50eb2        32 seconds ago      159MB
itemimpl               1.0-SNAPSHOT        357a9d546593        9 minutes ago       159MB
frontend               1.0-SNAPSHOT        7251c13a5373        6 days ago          141MB
```

As for the [Maven equivalent plugin](https://github.com/lightbend/reactive-app-maven-plugin){:target="_blank" rel="noopener noreferrer"}, the Docker images can be build by executing:
```
$ mvn install
```

## Locally deploying to Kubernetes using Minikube
For development we can make use of an sbt task for deploying everything to Kubernetes using Minikube.
But before that, we need to do a couple of things.
We first need to set up Lightbend's [Reactive Sandbox](https://github.com/lightbend/reactive-sandbox){:target="_blank" rel="noopener noreferrer"} which is a Docker image that contains the usual components used when developing reactive applications using the Lightbend frameworks:
- Cassandra
- Elasticsearch
- Kafka
- ZooKeeper

We will use [Helm](https://www.helm.sh){:target="_blank" rel="noopener noreferrer"}, a package manager for Kubernetes, to set it up.
Install instructions of Helm are available on the [GitHub repository](https://github.com/kubernetes/helm){:target="_blank" rel="noopener noreferrer"}.
For Mac for example you can install it using brew: 
```sbtshell
$ brew install kubernetes-helm
```

With Helm we can then install the Reactive Sandbox:
```sbtshell
helm init
helm repo add lightbend-helm-charts https://lightbend.github.io/helm-charts
helm update
helm install lightbend-helm-charts/reactive-sandbox --name reactive-sandbox
```

All set up, we can now utilise an sbt command to deploy all our services to Minikube!

Start sbt in the root of your project:
```sbtshell
$ sbt
```

And deploy everything to Minikube using a sbt task that comes with the sbt-reactive-app plugin.
The task however is not yet supported on Windows unfortunately.
```sbtshell
deploy minikube
```

During the setup we encountered a connection initialisation error of Helm:
```sbtshell
Cannot initialize Kubernetes connection: Get http://localhost:8080/api: dial tcp 127.0.0.1:8080: getsockopt: connection refused
```

We found a solution for this in the following Helm GitHub issue: [Tiller pods can't connect to k8s apiserver #2464](https://github.com/kubernetes/helm/issues/2464#issuecomment-381101015){:target="_blank" rel="noopener noreferrer"}. 
```sbtshell
$ kubectl --namespace=kube-system create clusterrolebinding add-on-cluster-admin --clusterrole=cluster-admin --serviceaccount=kube-system:default
```

If all went well your application should be accessible at `https://192.168.99.100`.
You can use the Minikube dashboard to inspect everything at `http://192.168.99.100:30000`.

<p style="text-align: center;">
  <img class="image" style="width: 100%; max-width: 550px" src="/img/lagom-kubernetes/frontend.png" alt="Frontend">
</p>

Note that you can also deploy a single module instead of all of them.
For example if we only want to deploy the frontend, you simply switch to the specific project before running the command:
```sbtshell
$ sbt
[info] Loading global plugins from /Users/yannickdeturck/.sbt/0.13/plugins
[info] Loading project definition from /Users/yannickdeturck/Documents/Git-projects/lagom-shop-scala/project
[info] Set current project to lagom-shop-scala (in build file:/Users/yannickdeturck/Documents/Git-projects/lagom-shop-scala/)
> projects
[info] In file:/Users/yannickdeturck/Documents/Git-projects/lagom-shop-scala/
[info] 	   common
[info] 	   frontend
[info] 	   itemApi
[info] 	   itemImpl
[info] 	   lagom-internal-meta-project-cassandra
[info] 	   lagom-internal-meta-project-kafka
[info] 	   lagom-internal-meta-project-service-locator
[info] 	 * lagom-shop-scala
[info] 	   orderApi
[info] 	   orderImpl
> project frontend
[info] Set current project to frontend (in build file:/Users/yannickdeturck/Documents/Git-projects/lagom-shop-scala/)
[frontend] $ deploy minikube
[info] Wrote /Users/yannickdeturck/Documents/Git-projects/lagom-shop-scala/frontend/target/scala-2.12/frontend_2.12-1.0-SNAPSHOT.pom
[info] Packaging /Users/yannickdeturck/Documents/Git-projects/lagom-shop-scala/frontend/target/scala-2.12/frontend_2.12-1.0-SNAPSHOT-sources.jar ...
[info] Done packaging.
[info] Packaging /Users/yannickdeturck/Documents/Git-projects/lagom-shop-scala/frontend/target/scala-2.12/frontend_2.12-1.0-SNAPSHOT.jar ...
[info] Done packaging.
[info] Wrote /Users/yannickdeturck/Documents/Git-projects/lagom-shop-scala/common/target/scala-2.12/common_2.12-1.0-SNAPSHOT.pom
[info] Wrote /Users/yannickdeturck/Documents/Git-projects/lagom-shop-scala/item-api/target/scala-2.12/itemapi_2.12-1.0-SNAPSHOT.pom
[info] Wrote /Users/yannickdeturck/Documents/Git-projects/lagom-shop-scala/order-api/target/scala-2.12/orderapi_2.12-1.0-SNAPSHOT.pom
13:23:14.079 [pool-7-thread-1] DEBUG com.lightbend.lagom.internal.api.tools.ServiceDetector - Loading service discovery class: FrontendLoader
[info] Sending build context to Docker daemon  54.52MB
[info] Step 1/9 : FROM openjdk:8-jre-alpine
[info]  ---> b1bd879ca9b3
[info] Step 2/9 : RUN /sbin/apk add --no-cache bash
[info]  ---> Using cache
[info]  ---> 193af79a4475
[info] Step 3/9 : WORKDIR /opt/docker
[info]  ---> Using cache
[info]  ---> 741d2377c4e8
[info] Step 4/9 : ADD --chown=daemon:daemon opt /opt
[info]  ---> Using cache
[info]  ---> d7884eead001
[info] Step 5/9 : USER daemon
[info]  ---> Using cache
[info]  ---> cdedfe6fc10c
[info] Step 6/9 : ENTRYPOINT []
[info]  ---> Using cache
[info]  ---> 2db1227ffe9e
[info] Step 7/9 : CMD []
[info]  ---> Using cache
[info]  ---> bd147ead79fd
[info] Step 8/9 : COPY rp-start /rp-start
[info]  ---> Using cache
[info]  ---> 340110c7c251
[info] Step 9/9 : LABEL com.lightbend.rp.app-name="frontend" com.lightbend.rp.applications.0.name="default" com.lightbend.rp.applications.0.arguments.0="/rp-start" com.lightbend.rp.applications.0.arguments.1="bin/frontend" com.lightbend.rp.app-version="1.0-SNAPSHOT" com.lightbend.rp.app-type="lagom" com.lightbend.rp.config-resource="rp-application.conf" com.lightbend.rp.modules.akka-cluster-bootstrapping.enabled="false" com.lightbend.rp.modules.akka-management.enabled="false" com.lightbend.rp.modules.common.enabled="true" com.lightbend.rp.modules.play-http-binding.enabled="true" com.lightbend.rp.modules.secrets.enabled="false" com.lightbend.rp.modules.service-discovery.enabled="true" com.lightbend.rp.modules.status.enabled="false" com.lightbend.rp.endpoints.0.name="http" com.lightbend.rp.endpoints.0.protocol="http" com.lightbend.rp.endpoints.0.ingress.0.type="http" com.lightbend.rp.endpoints.0.ingress.0.ingress-ports.0="80" com.lightbend.rp.endpoints.0.ingress.0.ingress-ports.1="443" com.lightbend.rp.endpoints.0.ingress.0.paths.0="/" com.lightbend.rp.sbt-reactive-app-version="1.1.0"
[info]  ---> Using cache
[info]  ---> 7251c13a5373
[info] Successfully built 7251c13a5373
[info] Successfully tagged frontend:1.0-SNAPSHOT
[info] Built image frontend:1.0-SNAPSHOT
[info] deployment.apps "frontend-v1-0-snapshot" deleted
[info] service "frontend" deleted
[info] ingress.extensions "frontend" deleted
[info] deployment.apps "frontend-v1-0-snapshot" created
[info] service "frontend" created
[info] ingress.extensions "frontend" created
[success] Total time: 19 s, completed May 11, 2018 1:23:31 PM
```

We can inspect everything with `kubectl`:

```sbtshell
$ kubectl get pods
NAME                                     READY     STATUS    RESTARTS   AGE
frontend-v1-0-snapshot-cbdbdb68b-rbrrx   1/1       Running   2          6d
reactive-sandbox-74fd955ddd-cjpw8        1/1       Running   7          6d

$ kubectl get services
NAME                             TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)                         AGE
frontend                         ClusterIP   10.103.128.78    <none>        10000/TCP                       6d
item                             ClusterIP   10.109.117.169   <none>        10000/TCP,10001/TCP,10002/TCP   6d
kubernetes                       ClusterIP   10.96.0.1        <none>        443/TCP                         6d
reactive-sandbox-cassandra       ClusterIP   None             <none>        9042/TCP                        6d
reactive-sandbox-elasticsearch   ClusterIP   None             <none>        9200/TCP                        6d
reactive-sandbox-kafka           ClusterIP   None             <none>        9092/TCP                        6d
reactive-sandbox-zookeeper       ClusterIP   None             <none>        2181/TCP                        6d

$ kubectl get ing
NAME       HOSTS     ADDRESS   PORTS     AGE
frontend   *                   80        6d
item       *                   80        6d

$ kubectl get deploy
NAME                     DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
frontend-v1-0-snapshot   1         1         1            1           6d
reactive-sandbox         1         1         1            1           6d
```

There is currently no equivalent for Maven to deploy everything to Minikube in one simple command.
In the next section however, we will look at how we can utilise the reactive-cli tool for generating resource and configuration files, and deploying everything to Kubernetes which is also the way to go for development in this case.

## Generating Kubernetes resources for production
The following workflow could also be used for development but it is more suited for deploying to your production environment as the `deploy minikube` workflow in the previous section simplifies a lot of things for you.

We will make use of the [reactive-cli](https://github.com/lightbend/reactive-cli){:target="_blank" rel="noopener noreferrer"} command-line tool to have it generate the Kubernetes resource and configuration files.
Installing is easy, as described in the [documentation](https://developer.lightbend.com/docs/lightbend-orchestration-kubernetes/latest/cli-installation.html){:target="_blank" rel="noopener noreferrer"}.
For Mac for example we can do this using Homebrew:
```sbtshell
brew tap lightbend/tools && brew install lightbend/tools/reactive-cli
```

Verifying if it was installed correctly can be done by checking the version:
```sbtshell
$ rp version
rp (Reactive CLI) 1.1.1
jq support: Unavailable
```

Now we can utilise it to generate Kubernetes resources.
In the previous section we deployed our frontend and item service but we also have our order service to deploy.
Let us generate the Kubernetes resources and deploy it to Minikube.

```sbtshell
$ rp generate-kubernetes-resources "orderimpl:1.0-SNAPSHOT" --generate-services --generate-pod-controllers --pod-controller-replicas 2 --env JAVA_OPTS="-Dplay.http.secret.key=simple"
---
apiVersion: "apps/v1beta2"
kind: Deployment
metadata:
  name: "order-v1-0-snapshot"
  labels:
    appName: order
    appNameVersion: "order-v1-0-snapshot"
spec:
  replicas: 2
  selector:
    matchLabels:
      appNameVersion: "order-v1-0-snapshot"
  template:
    metadata:
      labels:
        appName: order
        appNameVersion: "order-v1-0-snapshot"
    spec:
      restartPolicy: Always
      containers:
        - name: order
          image: "orderimpl:1.0-SNAPSHOT"
          imagePullPolicy: IfNotPresent
          env:
            - name: "JAVA_OPTS"
              value: "-Dplay.http.secret.key=simple"
            - name: "RP_APP_NAME"
              value: order
            - name: "RP_APP_TYPE"
              value: lagom
            - name: "RP_APP_VERSION"
              value: "1.0-SNAPSHOT"
            - name: "RP_DYN_JAVA_OPTS"
              value: "-Dakka.discovery.kubernetes-api.pod-namespace=$RP_NAMESPACE"
            - name: "RP_ENDPOINTS"
              value: "HTTP,AKKA_REMOTE,AKKA_MGMT_HTTP"
            - name: "RP_ENDPOINTS_COUNT"
              value: "3"
            - name: "RP_ENDPOINT_0_BIND_HOST"
              valueFrom:
                fieldRef:
                  fieldPath: "status.podIP"
            - name: "RP_ENDPOINT_0_BIND_PORT"
              value: "10000"
            - name: "RP_ENDPOINT_0_HOST"
              valueFrom:
                fieldRef:
                  fieldPath: "status.podIP"
            - name: "RP_ENDPOINT_0_PORT"
              value: "10000"
            - name: "RP_ENDPOINT_1_BIND_HOST"
              valueFrom:
                fieldRef:
                  fieldPath: "status.podIP"
            - name: "RP_ENDPOINT_1_BIND_PORT"
              value: "10001"
            - name: "RP_ENDPOINT_1_HOST"
              valueFrom:
                fieldRef:
                  fieldPath: "status.podIP"
            - name: "RP_ENDPOINT_1_PORT"
              value: "10001"
            - name: "RP_ENDPOINT_2_BIND_HOST"
              valueFrom:
                fieldRef:
                  fieldPath: "status.podIP"
            - name: "RP_ENDPOINT_2_BIND_PORT"
              value: "10002"
            - name: "RP_ENDPOINT_2_HOST"
              valueFrom:
                fieldRef:
                  fieldPath: "status.podIP"
            - name: "RP_ENDPOINT_2_PORT"
              value: "10002"
            - name: "RP_ENDPOINT_AKKA_MGMT_HTTP_BIND_HOST"
              valueFrom:
                fieldRef:
                  fieldPath: "status.podIP"
            - name: "RP_ENDPOINT_AKKA_MGMT_HTTP_BIND_PORT"
              value: "10002"
            - name: "RP_ENDPOINT_AKKA_MGMT_HTTP_HOST"
              valueFrom:
                fieldRef:
                  fieldPath: "status.podIP"
            - name: "RP_ENDPOINT_AKKA_MGMT_HTTP_PORT"
              value: "10002"
            - name: "RP_ENDPOINT_AKKA_REMOTE_BIND_HOST"
              valueFrom:
                fieldRef:
                  fieldPath: "status.podIP"
            - name: "RP_ENDPOINT_AKKA_REMOTE_BIND_PORT"
              value: "10001"
            - name: "RP_ENDPOINT_AKKA_REMOTE_HOST"
              valueFrom:
                fieldRef:
                  fieldPath: "status.podIP"
            - name: "RP_ENDPOINT_AKKA_REMOTE_PORT"
              value: "10001"
            - name: "RP_ENDPOINT_HTTP_BIND_HOST"
              valueFrom:
                fieldRef:
                  fieldPath: "status.podIP"
            - name: "RP_ENDPOINT_HTTP_BIND_PORT"
              value: "10000"
            - name: "RP_ENDPOINT_HTTP_HOST"
              valueFrom:
                fieldRef:
                  fieldPath: "status.podIP"
            - name: "RP_ENDPOINT_HTTP_PORT"
              value: "10000"
            - name: "RP_JAVA_OPTS"
              value: "-Dconfig.resource=rp-application.conf -Dakka.discovery.method=kubernetes-api -Dakka.management.cluster.bootstrap.contact-point-discovery.effective-name=order -Dakka.management.cluster.bootstrap.contact-point-discovery.required-contact-point-nr=2 -Dakka.discovery.kubernetes-api.pod-label-selector=appName=%s"
            - name: "RP_KUBERNETES_POD_IP"
              valueFrom:
                fieldRef:
                  fieldPath: "status.podIP"
            - name: "RP_KUBERNETES_POD_NAME"
              valueFrom:
                fieldRef:
                  fieldPath: "metadata.name"
            - name: "RP_MODULES"
              value: "akka-cluster-bootstrapping,akka-management,common,play-http-binding,service-discovery,status"
            - name: "RP_NAMESPACE"
              valueFrom:
                fieldRef:
                  fieldPath: "metadata.namespace"
            - name: "RP_PLATFORM"
              value: kubernetes
          ports:
            - containerPort: 10000
              name: http
            - containerPort: 10001
              name: "akka-remote"
            - containerPort: 10002
              name: "akka-mgmt-http"
          volumeMounts: []
          command:
            - "/rp-start"
          args:
            - "bin/orderimpl"
          readinessProbe:
            httpGet:
              path: "/platform-tooling/ready"
              port: "akka-mgmt-http"
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: "/platform-tooling/healthy"
              port: "akka-mgmt-http"
            periodSeconds: 10
            initialDelaySeconds: 60
      volumes: []
---
apiVersion: v1
kind: Service
metadata:
  labels:
    appName: order
  name: order
spec:
  ports:
    - name: http
      port: 10000
      protocol: TCP
      targetPort: 10000
    - name: "akka-remote"
      port: 10001
      protocol: TCP
      targetPort: 10001
    - name: "akka-mgmt-http"
      port: 10002
      protocol: TCP
      targetPort: 10002
  selector:
    appName: order
```

You could store the generated resources and tune it, but it is also possible to just generate everything that is necessary and just deploy it right away by chaining `kubectl apply`:
```sbtshell
$ rp generate-kubernetes-resources "orderimpl:1.0-SNAPSHOT" --generate-services --generate-pod-controllers --pod-controller-replicas 2 --env JAVA_OPTS="-Dplay.http.secret.key=simple" | kubectl apply -f -
deployment.apps "order-v1-0-snapshot" created
service "order" created
```

We can verify whether it is up and running:
```sbtshell
$ kubectl get deployments
NAME                     DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
frontend-v1-0-snapshot   1         1         1            1           6d
order-v1-0-snapshot      2         2         2            2           6m
reactive-sandbox         1         1         1            1           6d

$ kubectl get pods
NAME                                     READY     STATUS    RESTARTS   AGE
frontend-v1-0-snapshot-cbdbdb68b-mwfqq   1/1       Running   1          50m
order-v1-0-snapshot-5884754595-65wxd     1/1       Running   0          4m
order-v1-0-snapshot-5884754595-wdbng     1/1       Running   0          4m
reactive-sandbox-74fd955ddd-cjpw8        1/1       Running   7          6d
```

## Conclusion
Upgrading to Lagom 1.4.x and Play 2.6 went pretty smooth as the migration guides of Lightbend cover mostly everything in detail as usual.

The orchestration tools make it pretty easy to test your Lagom application running in Kubernetes locally while still having the possibility to fine-tune the generated resource and configuration files.
Integrating the tool suite into our project went smoothly.
Kubernetes has gained a lot of popularity lately and with this, Lagom shows that it wants to embrace Kubernetes to deploy your applications onto next to ConductR.

The single `deploy minikube` command is not yet supported on Windows but we imagine that it will be in the near future.
Windows users can still utilise the `reactive-cli` command-line tool to generate the resource and configuration files and deploy it themselves via `kubectl` on their Minikube.
Maven users will only need to wait a little bit longer to take advantage of most things the tool suite has to offer as the plugin is nearing its first release version.

## Extra resources
- [Our Lagom Shop Scala application GitHub repository](https://github.com/yannickdeturck/lagom-shop-scala){:target="_blank" rel="noopener noreferrer"}
- [Lightbend Orchestration Documentation](https://developer.lightbend.com/docs/lightbend-orchestration-kubernetes/latest/index.html){:target="_blank" rel="noopener noreferrer"}
- [Kubernetes instructions for the Lagom online-auction-scala application](https://github.com/lagom/online-auction-scala/blob/master/KUBERNETES.md){:target="_blank" rel="noopener noreferrer"}
- [Hello-World for Lightbend Orchestration for Kubernetes for a sample Play application](https://github.com/fsat/hello-reactive-tooling){:target="_blank" rel="noopener noreferrer"}
- [Lagom: First Impressions and Initial Comparison to Spring Cloud](/microservices/2016/04/22/Lagom-First-Impressions-and-Initial-Comparison-to-Spring-Cloud.html){:target="_blank" rel="noopener noreferrer"}
- [Lagom 1.2: What's new?](/microservices/2017/02/01/Lagom-1-2.html){:target="_blank" rel="noopener noreferrer"}
- [Lagom Documentation](https://www.lagomframework.com/documentation/){:target="_blank" rel="noopener noreferrer"}
- [Kubernetes Documentation](https://kubernetes.io/docs/home/){:target="_blank" rel="noopener noreferrer"}
