---
layout: post
author: dieter_hubau
title: '#Devoxx Arun Gupta talks Docker'
image: /img/docker.png
tags: [docker, devoxx]
category: devoxx
---
## Docker
- Open Source
- Container creation for applications
- Build, Ship, Run your software
- DockerHub to share docker images (because sharing is caring)
- Docker engine runs on minimal operating system
- Docker app runs on the Docker engine
- This is in contrast with regular VMs, running on full-blown OS

## Docker build (docker CLI)
- Dockerfile defines list of commands to builds image
- Need to set different DOCKER environment variables to determine docker_host etc
- Union File system: Bootfs kernel > Base Image (the chosen OS) > (multiple) images
- All commands are compressed into one, customized docker image for you

## Docker machine (docker-machine CLI)
- docker-machine create --driver=virtualbox myhost
- CLI to configure Docker client,
- creates and pulls images
- start, stop, restart containers
- upgrade Docker itself
- many plugins exist for various cloud providers
- advice: don't use in production (yet!)

## Boot2Docker
- earlier version of docker-machine
- being used by docker-machine in the background
- advice: migrate to docker-machine

## Docker Toolbox
- easiest tool to get started with Docker

## Hands-on Docker
- `docker help`for all your docker needs!
- `docker ps`to check the running containers
- `docker images`to check your images
- `docker build`for quick build
- `docker run -it ubuntu sh` for quick running an image in a shell
 
> Docker images are like diapers: if they get shitty, throw'em away and take a fresh one

## Docker Compose
- defining and running multi-container applications
- new way to link containers

> Docker container linking is so passé

- docker-compose.yml (default) or docker-compose.override.yml (default)
- great for setting up Dev, Stg and CI environments
- problem with linking: no possible way to work with different hosts
- volume mapping can help with multi-host environments
- **Bridge** network span single host
- **Overlay** network spans multiple hosts
- Software defined networking is possible and preferred!
- advice: don't use in production (yet!)

## Docker Swarm
- Native clustering for Docker
- Fully integrated with Machine & Compose
- Serves standard Docker API so anything that works on Docker, will work on multi-host environments
- Version 1.0.0 is out

> They say Docker Swarm v1.0.0 is production ready: I have my doubts!

## References
- Docker Docs are the de facto standard reference: [https://docs.docker.com/](https://docs.docker.com/)
- Samples: [https://github.com/javaee-samples/docker-java](https://github.com/javaee-samples/docker-java)

## Questions or Remarks
- Contact [@arungupta](https://twitter.com/arungupta) on Twitter
- Create an issue or start a discussion on the Github repository (or on [Gitter](https://gitter.im/docker/docker))
