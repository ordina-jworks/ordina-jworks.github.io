---
layout: post
authors: [tom_verelst]
title: "DockerCon 2017: Multi-Stage Builds and More"
image: /img/dockercon2017/thumbnail.jpg
tags: [DockerCon,Docker,Conference]
category: Conference
comments: true
---

DockerCon 2017 has kicked off, and Docker has changed a great deal since last year's edition.
The authors of Docker have constantly stated that they wish to make the Docker experience as simple as possible.
Nothing is less true if you look at some of the new features they released in the last few months,
which are being presented now at DockerCon.
I have compiled a list of the most useful changes and features.
These will certainly help you when building your own Docker images!


# Multi-Stage Builds

Building an image is often done in multiple stages.
First you compile your application.
Then you run your tests.
When the tests succeed, you package it into an artifact.
Finally, you add this artifact to an image.

You could put all these steps within one Dockerfile,
but that would result into an image that is bloated with stuff that is not required for the final product, like the compilation and build frameworks.
The Docker images would also be huge!

A solution to this problem is to build the application outside of Docker,
or to use multiple Dockerfiles.
You can build the artifact with one build,
extract the artifact,
and use that artifact for a final build.
However,
this whole build process is often tied together with a script that has been hacked together,
and does not truly feel like the Docker way of doing things.

Docker has often been sceptical about adding new features or making changes to the Dockerfile syntax,
but finally decided to tackle this build problem with a simple and elegant solution.
Introducing **multi-stage builds**,
it is now possible to define multiple stages by using several `FROM` statements.

```
# First stage to build the application
FROM maven:3.5.0-jdk-8-alpine AS build-env
ADD ./pom.xml pom.xml
ADD ./src src/
RUN mvn clean package

# Final stage to define our minimal runtime
FROM FROM openjdk:8-jre
COPY --from=build-env target/app.jar app.jar
RUN java -jar app.jar
```

Each time `FROM` is used,
you define which image is used for that stage,
and in subsequent stages you can use the `COPY --from=<stage>` to copy artifacts from a previous stage.

The final stage results in the image,
which can contain the minimal runtime environment and the final artifact.
Perfect!

# Using arguments in FROM

Using arguments isn't a new thing with Dockerfiles.
You could already use `ARG` statements to pass on arguments to the build process.
These arguments are not persisted in the Dockerfile,
and are frequently used to pass on versions,
or secrets like SSH keys.
Now it is also possible to use arguments in the version of the base image.

```
ARG GO_VERSION=1.8
FROM golang:${GO_VERSION}
ADD . /src
WORKDIR /src
RUN go build
CMD ["/bin/app"]
```

For above Dockerfile,
I could build an image with another Go version!

```
$ docker build --arg=GO_VERSION=1.7 .
```


# Cleaning up Docker

A comment I often hear is that Docker takes a lot of space.
This can be true,
if you never clean up!
Docker has added the `docker system` subcommand a while ago,
You can use this subcommand to check the disk usage,
and to free up space!

The following command outputs the disk usage:

```
$ docker system df
TYPE                TOTAL               ACTIVE              SIZE                RECLAIMABLE
Images              7                   5                   1.247GB             769MB (61%)
Containers          7                   2                   115.9MB             99.23MB (85%)
Local Volumes       1                   1                   85.59MB             0B (0%)
```

You can then use `prune` to clean up all resources that are no longer needed:

```
$ docker system prune
WARNING! This will remove:
	- all stopped containers
	- all volumes not used by at least one container
	- all networks not used by at least one container
	- all dangling images
Are you sure you want to continue? [y/N] y
```

It is also possible to prune certain subsystems:

```
$ docker image/container/volume/network prune
```



# Which Ports?

People often have trouble understanding or defining the published ports of a container,
since the syntax can be confusing.
Here's a list of all possible formats that you can use to define which ports are published on a container:

```
ports:
 - 3000
 - 3000-3005
 - 49100:22
 - 9090-9091:8080-8081
 - 127.0.0.1:8001:8080-8081
 - 6060:7060/udp
```

This syntax is okay when using the CLI,
but when you have to define a lot of them in a Compose file,
it is no longer readable.

To counter this issue,
you can now use a more verbose format to define ports:

```
ports:
  - target: 6060
    published: 7060
    protocol: udp
```

# This Volume Is Mounted Where?

Just like the ports,
volumes have a similar syntax.

```
volumes:
  - /var/lib/mysql
  - /opt/data:/var/lib/mysql
  - ./cache:/tmp/cached
  - datavolume:/var/lib/mysql
  - ~/configs/etc/configs/:ro
```

A verbose syntax has been added as well for volumes:

```
volumes:
  - type: bind
    source: ~/configs
    target: /etc/configs
    read_only: true
```

# To be continued

These few changes,
especially the multi-stage builds,
will certainly make your life as developer easier!

I am curious what DockerCon has to offer more today and tomorrow!
