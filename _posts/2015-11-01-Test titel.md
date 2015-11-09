---
layout: post
author: dieter_hubau
---
# Docker & Kubernetes at Google

## Docker
- Open Source
- Container Creation for applications
- Build, Ship, Run
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
- docker-machine create 
