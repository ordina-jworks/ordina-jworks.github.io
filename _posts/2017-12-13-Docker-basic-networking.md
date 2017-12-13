---
layout: post
authors: [bas_moorkens]
title: 'Docker basic networking'
image: /img/docker-basic-networking/docker-basic-networking.png
tags: [Docker, Networking, container, DevOps,]
category: Docker
comments: true
---


> Containers are all the rage at the moment so I guess everybody knows how to build and run a container by now. But what use is 1 container alone? 
In this post I will show you how you can create networks within docker and what they are used for.
Afterwards I will guide you through a step by step example on how to create a docker network and add containers to that network.
This way we will end up with a multi-tier application that is running on docker containers in a basic network.

# Table of contents
1. [Preface](#preface)
2. [Network setup](#network-setup)
3. [Db container](#db-container)
4. [Rest backend container](#backend-container)
5. [Frontend container](#frontend-container)
6. [Conclusion](#conclusion)

# preface
In the current application landscape we see a strong rise of distributed applications.  
This is enabled by using a microservice architecture and deploying these applications in docker containers.  
It`s important that these containers are able to communicate with each other, after all what good is a microservice that is isolated?  
In order to achieve this a couple of patterns are used. In this post I will demonstrate 2 of these patterns to you.  

* Communication within a docker network between containers
* Communication outside the docker network by exposing internal ports

Our final application setup looks like this:  

<p>
    <img class="image" alt="Final docker setup" src="/img/docker-basic-networking/docker-basic-network-setup.png" />
</p>

All our docker application will be deployed on 1 hostmachine.  
We will have a custom docker network running with 3 containers attached to that network:    
* The db container is just a  mysql server running within docker. 
* The backend container is a  spring boot application that connects to the mysql db container and provides a REST service to the outside world.
* The frontend container is a angularJS application that consumes the REST service from the backend container.

You can find all the code examples on [github](https://github.com/basmoorkens/docker-networking-demo){:target="_blank"}.  
The only thing needed to complete this guide is to have a working docker installation.  

Ready? Set. Go!

# network-setup
To start this guide let's have a look at the docker networks that are available on our machine.  

`docker network ls`  

When you run a docker container and you do not provide any network settings it is by default attached to the bridge network.  
Containers that are connected to this default bridge network can communicate with each other by using their internal docker ip address.  
Docker does not support automatic service discovery on this network.  
We want to be able to access our containers by using their container name instead of the internal ip address so we are going to create our own network.  

`docker network create --driver bridge basic-bridge`  

This creates a user defined network with the bridge driver that is called basic-bridge.
If we look at the docker network stack we see that our user defined bridge network is added.    
<p>
    <img class="image" alt="Network stack after adding basic-bridge" src="/img/docker-basic-networking/docker-network-ls-basic-bridge.png" />
</p>
You can look at more details of the network by using following command  

`docker network inspect basic-bridge`

<p>
    <img class="image" alt="Basic bridge details" src="/img/docker-basic-networking/bridged-network-details.png" />
</p>
The basic-bridge network can use ip addresses from the 172.18.0.0/16 range and will use 172.18.0.1 as it's default gateway.  
Now we can start creating our containers and adding them to the network we created.  

# db-container
Now that we have created our own network we can start attaching our containers to that network.  
Let's start of by creating the mysql database container.  
Following command pulls the mysql image from the docker repository and starts it as a container that is attached to our network.  

`docker run --name=mydb --network=basic-bridge -p 3306:3306 -e MYSQL_ROOT_PASSWORD=test -d mysql:8.0.3`

That's easy right? This container is attached to the basic-bridge network that we created in the previous step.  
Run the following command to look at the container in detail  

`docker inspect mydb`


<p>
    <img class="image" alt="docker inspect mydb" src="/img/docker-basic-networking/mydb-inspect.png" />
</p>
We can see in the output that it has gotten the 172.18.0.2 ip address and that it's using the default gateway of the network that we created.  
Now we should setup the database in our container with the schema for our REST application.  

`mysql -h 127.0.0.1 -P 3306  --user=root --password=test`

This will connect a mysql shell onto our localhost:3306.  
We can access this port because we exposed it when we started the container by using the -p flag.  
Note that this is only done for convenience so we can access the container from our host and setup a schema.  
Now run following SQL commands in the mysql shell.  

`create database greeting;
use greeting;  
create table greeting (  
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,  
greetername varchar (50),  
greeting varchar (255)  
);  
insert into greeting (greetername, greeting) values ('bas', 'Hello master');  
insert into greeting  (greetername, greeting) values ('Jack', 'Hello slave');  
select * from greeting;`

Now that we have setup our mysql container and initialized the schema we are ready to create our REST backend service.

# backend-container
You can find the code and Dockerfile for the backend container on the github link earlier in the post under the /backend folder.  
The backend application itself is pretty simple.  
It just listens on port 8080 for requests on the path /greeting.  
You can pass the name parameter to this service to get a customized response.  
The application fetches it's greetings from the database container we set up earlier.  
I added following properties under src/main/resources to connect it to our database.   

<p>
    <img class="image" alt="Spring boot app db connection properties" src="/img/docker-basic-networking/application-props.png" />
</p>

The important part here is that I referred to our database by using mydb:3306.  
We are able to do this because we will launch this backend service on the same docker network as the mydb container.  
This way they will be able to resolve each others name by using the basic-bridge network we created.  
Next up we will build the container from the Dockerfile I created.  
To do this run the following command in the /backend folder.  

`docker build . -t rest-backend`

Now let's run the container  

`docker run --name=rest-backend --network=basic-bridge -p 8090:8080 -d rest-backend`

By using the --network=basic-bridge we attach the container to the basic-bridge network that we created earlier.  
You can look at the network details of this container by using  

`docker inspect rest-backend`

<p>
    <img class="image" alt="Backend container docker inspect" src="/img/docker-basic-networking/backend-inspect.png" />
</p>

We can see in the output that is attached to the basic-bridge network just like our mydb container.  
We also used the -p 8090:8080 flag to expose the inner 8080 port (the port our spring boot application uses) to the outside world via the 8090 port.  
We can now curl or surf to localhost:8090/greeting to verify that everything is working.  

<p>
    <img class="image" alt="Verify backend running" src="/img/docker-basic-networking/verify-backend.png" />
</p>

We can see that our service successfully returned a response.  

# frontend-container
We can now create our frontend angularJS application that consumes the REST service we just created.  
You can find the code for this application under the /frontend folder in the github repository.  
Create the docker image for the frontend container by running  

`docker build . -t angular-frontend`

Next let's run the container by using  

`docker run --name=angular-frontend --network=basic-bridge -p 8080:80 -d angular-frontend`

To connect our angularJS application to our REST service we have 2 options in our current setup:  
* connect it to the internal docker ip address of the rest-backend container
<p>
    <img class="image" alt="Angular-backend call over internal docker network" src="/img/docker-basic-networking/angular-by-internal-ip.png" />
</p>
* connect it to the public exposed port of the rest-backend container
<p>
    <img class="image" alt="Angular-backend call over external network" src="/img/docker-basic-networking/angular-by-external.png" />
</p>

The reason we can not use the name of our backend-rest container is pretty simple.  
AngularJS renders in the browser so it's not rendered inside a docker container.  
If you would use the name of the container then our application would not know how to resolve that to an ip address as the name of the containers are only known within the docker network.  
The reason that it does work when you use the internal ip of the rest-backend is that the ip address is known so the NGINX in the angular container knows how to route this to the rest backend.  
In this case you have to use the internal port of rest-backend as this request will travel over the docker network.  

In the second case the NGINX in the angular container communicates with our rest-backend not through the docker network.  
The reason that this works is because we exposed the 8080 port of the rest-backend to the outside world on the public accessible 8090 port.  
In both scenarios our angular app will be able to contact the rest-backend so we get following result:  

<p>
    <img class="image" alt="Angular 200 response from backend" src="/img/docker-basic-networking/angular-ok.png" />
</p>


Note: in real life you would like to make your REST service public available on a webserver so that consuming applications would be able to connect to it by using that public URL.  
Our application setup is now complete and our full setup looks like this:  

<p>
    <img class="image" alt="Final setup docker ps" src="/img/docker-basic-networking/docker-ps-final.png" />
</p>

# conclusion
As we saw in the guide it is actualy pretty simple to create a single host docker network and to enable containers to communicate with each other over this network.  
When we created our angular application we saw that this approach has it's limitations.  
Another limitation of this setup is that this kind of network is limited to a single host as it will not work over multiple hosts.  
Of course nobody wants to run a distributed application in containers on 1 host.  
I will make sure to create a follow up blogpost where we look into docker multi-host networks by using weave.NET.  

`docker stop bas`  