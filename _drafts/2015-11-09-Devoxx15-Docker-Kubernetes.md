---
layout: post
authors: [dieter_hubau]
title: '#Devoxx Arun Gupta talks Docker'
image: /img/docker.png
tags: [Docker, Devoxx]
category: Devoxx
comments: true
---
## Docker
Docker is a tool used for container creation for software applications. We have all been aware of the existence of containers for some time, but Docker creates a standard for describing these packages.
Docker is used for three things: Build, Ship & Run your software.

### Build
Creation of a predefined container in a standardized way using the **Docker CLI**.
Use a `dockerfile` containing a list of commands. The `FROM` command specifies an OS and additional software packages, eg. `FROM jboss/wildfly`. All  commands are compressed into one, customized image using the **Docker CLI**.

### Ship
Share the container via DockerHub or your private repository.

> Sharing = caring!

### Run
Docker runs on a minimal operating system and uses the Union File System. On the bottom level, there's the Bootfs kernel, on which the chosen base image or OS runs and finally, the user images ontop of that.
Hosts running Docker are very environment variables oriented, so by using variables in the commands or on the machine itself you configure your application. Any other communication is usually done over **HTTP/REST**. The Docker images are stored on the Docker host so the actual client is very thin. A Docker app runs on the Docker engine; this is in contrast with regular VMs, running on full-blown operating systems.

## Docker Machine
Docker Machine allows you to get started with Docker on Mac or Windows. It features the `docker-machine` CLI and uses the `boot2docker` image (32Mb small) under the hood.

> Docker Machine is preferred over boot2docker for development purposes, but it is not production-ready (yet!)

Easy way to set up a Docker host with docker-machine:
`docker-machine create --driver=virtualbox myhost`

Listing all the installed Docker images:
`docker-machine ls`

Listing all the environment variables of a newly created Docker container:
`docker-machine env myhost`

Docker Machine is also used to start, stop or restart containers. It even allows to update Docker itself.
Many existing plugins provide support for various cloud platforms.

## Boot2Docker
An earlier version of docker-machine. As said above, it is being used by `docker-machine` under the hood.

> My advice: migrate to docker-machine, at least for development purposes.

## Docker Toolbox
Easily the best tool to get started with Docker.

- [Windows](http://docs.docker.com/windows/started/)
- [MacOS](http://docs.docker.com/mac/started/)

## Hands-on Docker
- `docker help`for all your docker needs!
- `docker ps`to check the running containers
- `docker images`to check your images
- `docker build`for quick build
- `docker run -it ubuntu sh` for quick running an image in a shell
 
> Docker images are like diapers: if they get shitty, throw'em away and take a fresh one.

## Docker Compose
Allows you to define and run multi-container applications. It has all the commands the regular Docker has **and more**.
It provides a new way to link containers.

Configuration is defined in one or more `docker-compose.yml` (default) or `docker-compose.override.yml` (default) files.
It is a great tool for setting up Development, Staging and Continuous Integration (CI) environments.

> Docker container linking is so passé

A problem with container linking was that there was no possible way to work with different hosts. Docker Compose solves this by using volume mapping.
It can help with running multi-host environments:

- **Bridge** network span single host
- **Overlay** network spans multiple hosts

> Software defined networking is possible and preferred! Docker Compose solves this problem but it should still be used cautiously in production!

Starting a set of Docker images using Docker Compose is easy:
`docker-compose up -f docker-compose.yml -f production.yml -d`

## Docker Swarm
Docker Swarm provides native clustering for Docker, fully integrated with Machine & Compose. It either uses Etcd, Consul, Zookeeper or other solutions to store the cluster ID.
Whenever you create a Docker Machine, you can add it to the cluster. It also serves the standard Docker API so anything that works on Docker, will work on multi-host environments.

> They say the new Docker Swarm v1.0.0 release is production ready: I still have my doubts!

## References
- Docker Docs are the de facto standard reference and are very well documented. They contain information on [Docker](https://docs.docker.com), [Machine](https://docs.docker.com/machine), [Compose](https://docs.docker.com/compose) & [Swarm](https://docs.docker.com/swarm): [https://docs.docker.com/](https://docs.docker.com/)
- Samples: [https://github.com/javaee-samples/docker-java](https://github.com/javaee-samples/docker-java)

## Questions or Remarks
- Contact [@arungupta](https://twitter.com/arungupta)  or [@Turbots](https://twitter.com/dhubau) on Twitter
- Create an issue or start a discussion on the Github repository (or on [Gitter](https://gitter.im/docker/docker))
