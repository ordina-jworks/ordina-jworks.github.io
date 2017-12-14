---
layout: post
authors: [bas_moorkens]
title: 'Docker basic networking'
image: /img/docker-basic-networking/docker-basic-networking.jpg
tags: [Docker, Networking, container, DevOps,]
category: Docker
comments: true
---


> Containers are all the rage at the moment so I guess everybody knows how to build and run a container by now.
**But what use is one container by itself?**
In this post, I will show how you can create networks within Docker and what they are used for.

> Afterwards, I will guide you through a step-by-step example on how to create a Docker network and add containers to it.
This way, we will end up with a multi-tier application that is running on Docker containers in a basic network.

# Table of contents
1. [Preface](#preface)
2. [Network setup](#network-setup)
3. [Database container](#database-container)
4. [REST Backend container](#backend-container)
5. [Frontend container](#frontend-container)
6. [Conclusion](#conclusion)

# Preface
In the current application landscape, we see a strong rise of distributed applications.
This is done by implementing a **microservice architecture** and deploying these applications in Docker containers.
It's important that these containers are able to communicate with each other, after all, **what good is a microservice that is isolated**?

In order to achieve this, a couple of patterns are used.
In this post I will demonstrate two of these patterns to you.

* Communication within a Docker network between containers
* Communication outside the Docker network by exposing internal ports

Our final application setup looks like this:  

<p>
    <img class="image" alt="Final docker setup" src="/img/docker-basic-networking/docker-basic-network-setup.png" />
</p>

All of our Docker applications will be deployed on **one host machine**.
We will have a custom Docker network running with **three containers** attached to that network:
* The database container is just a MySQL database running within Docker.
* The backend container is a Spring Boot application that connects to the MySQL DB container and provides a REST service to the outside world.
* The frontend container is an AngularJS application that consumes the REST service from the backend container.

You can find all the code examples on [Github](https://github.com/basmoorkens/docker-networking-demo){:target="_blank"}.
The only thing needed to complete this guide is a working Docker installation.

**Ready? Set. Go!**

# Network Setup
To start this guide, let's have a look at the Docker networks that are available on our machine:

`docker network ls`  

> When you run a Docker container and you do not provide any network settings, it is by default attached to the bridge network.

Containers that are connected to this default bridge network can communicate with each other by using their internal Docker IP address.

Docker does not support automatic service discovery on this network.

We want to be able to access our containers by using their container name instead of the internal IP address so we are going to create our own network:

`docker network create --driver bridge basic-bridge`  

This creates a user defined network with the bridge driver that is called `basic-bridge`.
If we look at the Docker network stack, we see that our user defined bridge network is added:

<p>
    <img class="image" alt="Network stack after adding basic-bridge" src="/img/docker-basic-networking/docker-network-ls-basic-bridge.png" />
</p>

You can look at more details of the network by using following command

`docker network inspect basic-bridge`

<p>
    <img class="image" alt="Basic bridge details" src="/img/docker-basic-networking/bridged-network-details.png" />
</p>

The basic-bridge network can use IP addresses from the `172.18.0.0/16` range and will use `172.18.0.1` as its default gateway.

# Database container

Now that we have created our own network, we can start attaching our containers to that network.
Let's start off by creating the MySQL database container.
The following command pulls the MySQL image from the Docker repository and starts it as a container that is attached to our network:

`docker run --name=mydb --network=basic-bridge -p 3306:3306 -e MySQL_ROOT_PASSWORD=test -d MySQL:8.0.3`

That's easy right?
This container is attached to the `basic-bridge` network that we created in the previous step.
Run the following command to look at the container in detail:

`docker inspect mydb`

<p>
    <img class="image" alt="docker inspect mydb" src="/img/docker-basic-networking/mydb-inspect.png" />
</p>

We can see in the output that it has gotten the `172.18.0.2` IP address and that it's using the default gateway of the network that we created.
Now we should set up the database in our container with the schema for our REST application.

`mysql -h 127.0.0.1 -P 3306  --user=root --password=test`

This will connect a MySQL shell onto our `localhost:3306`.
We can access this port because we exposed it when we started the container by using the -p flag.
Note that this is done for convenience only, so we can access the container from our host and set up a schema.
Now run following SQL commands in the MySQL shell.

```sql
create database greeting;
use greeting;
create table greeting (  
  id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  greetername varchar (50),
  greeting varchar (255)
);  
insert into greeting (greetername, greeting) values ('bas', 'Hello master');  
insert into greeting  (greetername, greeting) values ('Jack', 'Hello slave');  
select * from greeting;
```

Now that we have setup our MySQL container and initialized the schema we are ready to create our REST backend service.

# Backend container

You can find the code and Dockerfile for the backend container on the Github link earlier in the post under the `/backend` folder.
The backend application itself is pretty simple.
It just listens on port 8080 for requests on the path `/greeting`.
You can pass the `name` request parameter to this path to get a customized response.
The application fetches its greetings from the database container we set up earlier.
I added following properties under `src/main/resources` to connect it to our database:

<p>
    <img class="image" alt="Spring boot app db connection properties" src="/img/docker-basic-networking/application-props.png" />
</p>

The important part here is that I referred to our database by using `mydb:3306`.

We are able to do this because we will launch this backend service on the same docker network as the `mydb` container.
This way, they will be able to resolve each others name by using the basic-bridge network we created.

Next up, we will build the container from the Dockerfile I created.
To do this run the following command in the `/backend` folder:

`docker build . -t rest-backend`

Once the Docker image is built, let's run it in a container:

`docker run --name=rest-backend --network=basic-bridge -p 8090:8080 -d rest-backend`

By using the `--network=basic-bridge`, we attach the container to the `basic-bridge` network that we created earlier.

You can look at the network details of this container by using:

`docker inspect rest-backend`

<p>
    <img class="image fit" alt="Backend container docker inspect" src="/img/docker-basic-networking/backend-inspect.png" />
</p>

We can see in the output that it is attached to the `basic-bridge` network just like our mydb container.
We also used the `-p 8090:8080` flag to expose the inner 8080 port (the port our Spring Boot application uses) to the outside world via the 8090 port.

We can now curl or browse to `localhost:8090/greeting` to verify that everything is working:

<p>
    <img class="image" alt="Verify backend running" src="/img/docker-basic-networking/verify-backend.png" />
</p>

We can see that our service successfully returned a response.

# Frontend container

We can now create our frontend AngularJS application that consumes the REST service we just created.

You can find the code for this application under the `/frontend` folder in the Github repository.
Create the Docker image for the frontend container by running:

`docker build . -t angular-frontend`

Now let's run the container by using:

`docker run --name=angular-frontend --network=basic-bridge -p 8080:80 -d angular-frontend`


AngularJS renders in the browser so it's not rendered inside a Docker container.  
This means that our angular application would not be able to contact the REST backend container as that container is only known within the docker network.  
To work around this inconvenience I will explain 2 alternatives:  

* **connect it to the internal Docker IP address of the rest-backend container**  
In this case we connect the angular application to the ip address of our backend container. 
This only works because the ip address is known to our browser.  
The ip address is known because the machine on which our browser runs is also running the Docker network.  
Note that this is not very portable.  
If you would deploy the container somewhere else or you would browse to the application from another host this would break.  


<p>
    <img class="image" alt="Angular-backend call over internal docker network" src="/img/docker-basic-networking/angular-by-internal-ip.png" />
</p>


* **connect it to the public exposed port of the REST backend container.**  
When we set the application up like this the angular application can access the backend container through the publicly exposed port 8090.  
Note that in this case the application would break as well if you deploy the frontend container somewhere else or if you would access it from another host.  

<p>
    <img class="image" alt="Angular-backend call over external network" src="/img/docker-basic-networking/angular-by-external.png" />
</p>

The result in both cases is that our angular application can contact the REST backend and serves up a good response.  

<p>
    <img class="image" alt="Angular 200 response from backend" src="/img/docker-basic-networking/angular-ok.png" />
</p>

As I mentioned before both these alternatives have pretty obvious flaws in them.  
In a real world setup you would like to make your REST service publicly available on a webserver so that consuming applications would be able to connect to it by using that public URL.  
If there is interest in this kind of setup I can cover it in a later blogpost.  
Our application setup is now complete and our full setup looks like this:  

<p>
    <img class="image fit" alt="Final setup docker ps" src="/img/docker-basic-networking/docker-ps-final.png" />
</p>

# Conclusion

As we saw in this guide it is actually pretty simple to create a single host Docker network and enable containers to communicate with each other over this network.  
When we created our Angular application, we saw that this approach has its limitations.

Another limitation of this setup is that this kind of network is limited to a single host as it will not work over multiple hosts.
Of course nobody wants to run a distributed application in containers on one host.

I will make a follow-up blogpost where we look into Docker multi-host networks by using **weave.NET**.

`docker stop bas`  
