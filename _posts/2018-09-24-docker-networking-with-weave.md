---
layout: post
authors: [bas_moorkens]
title: 'Docker multihost networking with weave'
image: /img/docker-basic-networking/docker-basic-networking.png
tags: [Docker, Weave, Networking, Kubernetes]
category: docker
comments: true
redirect_from:
  - /docker/2018/09/15/docker-networking-with-weave.html
---


> In my last blogpost we talked about setting up a Docker network on a single host. We talked about a very basic 3 tier application which was packaged into 3 containers.
An Angular frontend, a spring boot backend and a mysql database container.

> No person in their right mind would ever run an application on a single host in production. ( If you are doing this please give us a call and we will gladly come help you out ;-) )
So today I will talk you through the process of setting up multi host networks with the help of Weave.

# Table of contents
1. [Why multihost networking?](#why-multihost-networking)
2. [Weave](#weave)
3. [Basic example](#basic-example)
4. [Application example](#application-example)
5. [Onprem cloud application example](#onprem-cloud-application-example)
6. [Conclusion](#conclusion)

# Why multihost networking?

In my [last blogpost](/docker/2017/12/15/Docker-basic-networking.html){: target="blank" rel="noopener noreferrer" } we ran our three containers on one single host network. This has a few obvious disadvantages which I will address first:

* If you would run all your applications as Docker containers on one machine, your environment would still be very prone to outages.
If something happens to the physical machine that you use, then you are pretty much done for and you have an outage.
Depending on how critical your applications are, this could have disastrous results.
That's why in practice you want to spread your applications over several hosts and connect them to each other over a network.

* Not every application that you package in a Docker container is the same.
In our example we have a web frontend, a Spring Boot backend and a MySQL database server.
A database server has fundamental different needs than a webserver.
For example, you want to make sure your database container is running on a system with large hard disks with much faster access times.
On the other side, a webserver has little use for large hard drives and has much more benefit from increased memory to allow for many concurrent connections.

* If you use a microservice architecture and you want to scale up a certain microservice, it is recommended to run the new instance of that microservice on a different machine than the first instance.
This is done for resilience of the application but also to spread the application workload over several different physical machines.
This improves the scalability of your system.

So in short: multihost networking is pretty important to build **resilient**, **robust** applications that **scale well**.
It also allows you to deploy your containers on hardware that makes most sense for each container.

Now that you are convinced that we need multi host networks, at least for our production environments, let's talk about what we can do to set this up with Docker and Weave.

# Weave

There are several options to do multihost networking with Docker.
Nowadays Docker itself even supports a basic form of this but we want to use all the good stuff like DNS lookups and service discovery.
That's why we are going to use Weave.NET.

Now, **what is Weave.NET?**

Weave.NET is software that is build by the company **[Weaveworks](https://weave.works "Weaveworks")**.
It allows you to create a virtual network across multiple hosts and enables automatic discovery of hosts and containers within the network.
The following features are the most important and useful to me:

* It's **easy** to setup. As I will show in the hands-on part of this post, the setup of Weave is done within minutes and is pretty straightforward.

* It provides a **virtual network** on top of your existing network.
In big organisations, the network setup can be quite complex with multiple VLANs and firewalls.
Using Weave, your network people only need to open one port.
Everything that stays within the Weave virtual network can communicate over that same port.

* The virtual network is very **flexible**.
You can use Weave to build one virtual network between your on-prem and cloud environment.
Within this network, all your containers can communicate with each other as if they were living on the same machine.

* An added benefit of the virtual network is that it's pretty easy to **secure**.
You can encrypt all the traffic on the Weave virtual network which adds a layer of security ontop of the existing security you have in place.
This is especially useful if you wish to build a network which spans your on-prem and cloud environment.
Since all traffic is encrypted you are not at risk when containers in the cloud communicate with containers in your on-prem environment.

* The Weave network comes with its own DNS server.
This allows you to do **service discovery** within the Weave network.
This has huge benefits over addressing applications with their IP addresses.
Service discovery allows you to do easy **loadbalancing** and provides your applications with **high availablity**. 

* Last but not least I feel obligated to point out that Weave works very well with **Kubernetes**.
Kubernetes is basically the orchestration tool you want to be using to run your containers.
A deeper tour of Kubernetes is for another time, but for now I'd like to point out that the default network provider within Kubernetes is `flanel` but you can replace that with Weave if you want.
You then get all the benefits of Weave plus the added value that you can make a virtual network that spans several Kubernetes clusters and/or your regular Docker applications.

The main point I'm trying to make here, is that Weave.NET takes care of a lot of low level networking stuff for you.
This allows you to build a more robust and scalable environment to run your applications on without having to worry much about the lower levels in the networking stack.

# Basic example

In this example, I will be using Ubuntu machines on which I have already installed Docker.
Following picture shows the setup we will be build in this example:

<p>
    <img class="image fit" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/weave_basic_diagram.png" />
</p>

### Installing Weave

To install Weave on an Ubuntu system you can run the following commands:

~~~~
sudo curl -L git.io/weave -o /usr/local/bin/weave
sudo chmod a+x /usr/local/bin/weave
~~~~

If you want to install Weave on another system take a look on the **[weave install page](https://www.weave.works/docs/net/latest/install/installing-weave/ "weave install page")**.
On systems which don't support native Docker, you will have to set up something like Docker-machine to get everything to work.

We will need to run the Weave install on both of the machines that we are going to use in this example.

### Launching Weave

Now that we have installed Weave on both machines, let's start it up.

#### Setting up host 1

On the first host, type the following commands:

~~~~
weave launch
eval $(weave env)
~~~~

The first command launches Weave. Weave runs as a set of Docker containers on your system, you can see this when you run the launch command:

<p>
    <img class="image fit" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/install_weave_result.png" />
</p>

If you run the `docker images` command you can take a look at all the images that Weave downloaded:

<p>
    <img class="image fit" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/weave_images.png" />
</p>

The second command configures the Weave environment so that containers that get launched will automatically attach to the Weave network.
This means that you have to provide no additional arguments to your Docker run commands to use the Weave network.
Behind the scenes Weave has setup a Docker network for you on your machine, you can take a look at this with the command:

~~~~
docker network ls 
~~~~
<p>
    <img class="image fit" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-Docker-networking-with-weave/docker_network.png" />
</p>

You can recognise the Weave network by the name **Weave** and as you can see it uses the **weavemesh** driver instead of one of the standard Docker network options.
When our network setup is done we will test it out with a test container.
So for now let's start this container on the first host:

~~~~
docker run -d --name app_on_host1 weaveworks/ubuntu
~~~~

This is just a stripped down Ubuntu Docker image.
We will use it later to test our network setup.

If you look at your machine's network stack you will see that Weave has setup several different networks on your host machine in order to make it's magic work.
When I run the:

~~~~
ifconfig
~~~~

command on my machine, I can see that Weave added following network stacks to my machine:

<p>
    <img class="image fit" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/weave_network_stack.png" />
</p>

What all these networks do is out of scope for this post as that operates on a pretty low level in the TCP/IP stack and we are not really interested in it in our usecase.
We just want it to work, right?

#### Setting up host 2

In the last screenshot of the previous section we looked at the network stack of host 1.
This is important because we need the **physical IP address** from that host to tell our second host to connect to host 1.
Host 1 has IP address 192.168.1.18. This gives us following command to run on host 2:

~~~~
weave launch 192.168.1.18
eval $(weave env)
~~~~

The syntax of this command is pretty straightforward.
You tell Weave to launch and to connect to every IP you supply as an argument to the launch command.
We will also setup a test container on this host:

~~~~
docker run -d --name app_on_host2 weaveworks/ubuntu
~~~~

These are all the setup steps you need to do in order to setup a simple Weave network.
Now let's see how we can verify that everything is working.

#### Verifying our setup

There are a few things we can do to verify that our setup is working.
To start off let's look at the status off our Weave service:

~~~~
weave status
~~~~

This produces following result:

<p>
    <img class="image fit" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/weave_status.png" />
</p>

You can run this command on either host, it will provide you with basically the same results.
All sorts of useful stuff is available in the status overview including the range of your Weave subnet, the connected peers, the connections.
As a first step to verify that our network is working, let us examine the connections and peers in more detail with following commands:

~~~~
weave status peers
weave status connections
~~~~

<p>
    <img class="image fit" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/weave_status_details.png" />
</p>

As you can see from the output of the commands there are now two hosts in our network and there is one connection between them.
So far everything is looking good!
Now let's do the real test and see if the containers can find each other by the name we gave each container.
SSH into the container on host 1 and ping the application on the other host:

~~~~
docker exec -ti app_on_host1 bash
ping app_on_host2
~~~~

<p>
    <img class="image fit" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/ping_test_app_1.png" />
</p>

As we can see from the results, our container was able to resolve the other container over the Weave network by making use of the Weave DNS service and the Weavemesh network.
If we reverse our test and run it on host 2 we get this result:

~~~~
docker exec -ti app_on_host2 bash
ping app_on_host1
~~~~

As you can see from the example outputs, both hosts are now connected, and thanks to the Weave network and DNS service, they are able to resolve each other by hostname.
Another noteworthy thing is that Weave has setup a class A network (10.xxx.xxx.xxx) range for us.
These are all IP addresses within the Weave network so you don't have to worry about any IP conflicts with your existing network.
If you would have the need for a specific subnet you can force Weave to use whatever subnet you like (192,168.1.XXX for example).

# Application example

For this example we will use the Weave setup we created in the previous example.
I will be running the application from the basic Docker networking blogpost on our two hosts in the Weave network.
You can checkout the code for this example at **[my github account](https://github.com/basmoorkens/docker-networking-demo "weave install page")**.
For this example I will be using the **weave-basic-example** branch.

### Setup database

In the first step, we setup our database container on one of the Weave hosts.
I will be using my desktop to run the database container.
First we will run the **run_db.sh** script to start up a new MySQL container and assign a root password to it.
When that container is up and running we can initialise it with a database and some data.
To initialise the database run the **init-db.sh** script.
We can run following commands to verify that our database is up and running in the Weave network:

~~~~
docker ps
weave ps
~~~~

This should give you a similar output to the screenshot below:

<p>
    <img class="image" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/db_setup.png" />
</p>

As you can see the mydb container was automatically added to the Weave network because of the **eval $(weave env)** command we ran earlier in this demo.
Note that the Weave ps command shows you the container id and the IP address it has allocated to that container.
Now that our database is up and running, let's switch over to our other machine and start the other services over there.

### Setup backend application

Let's install our backend service on our second host.
In the **backend** folder we will run the following commands to compile our application and start up our Docker container.
Let's start our backend container with the **test_run_backend.sh** script.
This script runs the container and exposes its webservice to the outside world through port 8080.
We can then use our browser on our host to verify that the service is running correctly:

~~~~
mvn clean install
docker build -t rest-backend .
./test_run_backend.sh
~~~~

To verify that out application has started successfully we can run the following commands:

~~~~
docker ps
weave ps
~~~~

This shows us that the container wass started correctly and it got an IP addresss within the Weave network.

<p>
    <img class="image" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/backend_setup.png" />
</p>

Now that we know our backend and our database are running within the Weave network, we can query our REST service and see if everything is working as expected:

<p>
    <img class="image" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/backend_verification.png" />
</p>

When I do an HTTP GET to my REST backend, it comes back with a greeting it got from the database container on the other host.
Now that we have verified that our backend runs fine, we will stop it and start it up again without exposing a port to the outside world:

~~~~
docker stop rest-backend
docker rm rest-backend
./run_backend.sh
~~~~

The Docker ps command on the backend now runs without exposing a port.
Since our frontend application is calling our REST backend through the Weave network, we don't have to expose a port to the outside world:

<p>
    <img class="image" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/rest-backend-without-port-exposed.png" />
</p>

### Setup frontend application

Our frontend application is a bit different from the one I used in my previous demo.

In the previous demo we used an Angular frontend, but I replaced it with a simple webserver I wrote in **Golang**.
I want to demonstrate that applications can access each other through the internal Weave network by their container name.
I could not demonstrate this last time with Angular code since that's rendered on the browser at client side.
Our client's browser is not inside the Weave network so it has no way to resolve the webservice call from our frontend application to our REST service.

In this example, our Go frontend app renders the HTML response on the server side.
This means the code that calls the REST service is running inside the Docker container and is thus a part of the Weave network.
We can also access our REST backend via following url:

<p>
    <img class="image" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/frontend-call-to-backend.png" />
</p>

The source code of the Go application is on Github in the **frontend** folder.
Please note: I also included a compiled binary so that you can use the program even if you don't have a working Golang installation.
To start our frontend container, run following commands inside the frontend folder.
Only execute the first command if you wish to compile the Go program yourself:

~~~~
go build
docker build -t frontend .
./run_frontend.sh
~~~~

Our Go frontend application should be up and running now so let's check if everything is working as expected:

<p>
    <img class="image" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/final-result.png" />
</p>

We can access our frontend application through port 8080 (which we exposed to the outside world with the Docker run command).
In this example I gave the name "john" which has no entry in our database so our REST backend returned the standard hardcoded message "hello friend".

<p>
    <img class="image" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/final-result-2.png" />
</p>

In this example I gave "bas" as a parameter and since we have a message in our database for this name, we got the message "hello master" as a result.
Since no Docker ports are exposed to the outside world (except for our frontend application to make it accessible from our host), this is definitive proof that our Go application can access our REST backend application through the Weave network.
Likewise, our REST backend application accesses our mydb container through the Weave network as well.

Oh, and by the way: You can run your containers on any host which is connected to our Weave network. Cool, huh?
Now, let's take this one step further. In this next example we will extend our Weave network from our home network into the cloud.

# Onprem cloud application example
In the final example of this blogpost I will show a setup where we have 1 Weave network that spans our onprem environment and connects to a cloud environment (AWS).
In this example we will run each application container on a different host. It looks like this.
<p>
    <img class="image" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/onprem_aws_setup.png" />
</p>
In the end result I will be running the **mydb** container on my desktop (database server). The **rest-backend** will run on my laptop (backend server) and our **frontend** container will run on an EC2 instance on AWS.
Everything will be connected through the Weave network that we will reconfigure to encrypt our data between the cloud and onprem environment.
Let's get started.

### Setup EC2 server
The first thing we have to do is create a new EC2 server on AWS that we can use for this demonstration.
I'm not going to go into full detail here about how you can do that but it's quite easy and there are a lot of tutorials out there.
After our EC2 server is up and running we can login to it via ssh and install docker and weave.
We will start up Weave on our EC2 server with encryption enabled. 
~~~~
weave launch --password weavetest
eval $(weave env)
~~~~

The **password weavetest** part enables the encryption for this peer. 
If another peer wants to connect to this peer it has to provide this password before a connection can be established.
After the connection is established all traffic over the connection will be encrypted.

Another thing we have to take care of is make sure that Weave on the EC2 server can connect to it's peers.
Remember, an EC2 is running in a VPC behind a firewall so we have to open certain ports for this to work.
In the case of Weave we have to open the port 6783 -- which is the control port.
And we also have to open the port 6784 -- which is the data port.
You can do this by editing the launch group of your EC2 and add following inbound rules to it.
<p>
    <img class="image" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/aws-inbound-rules.png" />
</p>
As you can see I added rules to allow TCP and UDP traffic on port 6783 from all sources. This enables the Weave control process to connect to its peers.
Afterwards I added a rule to allow UDP traffic on port 6784 from all sources. This port is used by Weave to send it's data.
Note, I also opened port 8080 because our frontend uses this port to listen for web requests. 
<p>
    <img class="image" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/ec2.png" />
</p>
We will use the public ip4 address and DNS name later in this demo.

### Reconfigure the existing onprem hosts
Before you can connect Weave from your homenetwork to the cloud you have to make sure that your router ports 6783(TCP/UDP) and 6784(UDP) are opened.
First lets reconfigure our database host.
~~~~
weave reset
weave launch --password weavetest
eval $(weave env)
~~~~
The **weave status** command on this host now shows that encryption is enabled.
<p>
    <img class="image" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/db_encrypted.png" />
</p>
As you can see Weave is now reporting that encryption is turned on but this Weave peer is not yet connected to any others.
Let's take care off that now. Switch over to the backend host.
Now let's run the magic Weave command that will make our setup run.
~~~~
weave launch 34.247.178.145 192.168.1.99 --password weavetest
~~~~
This command launches Weave on our backend host and tells it to connect to our EC2 instance in the cloud and to our database server onprem.
<p>
    <img class="image" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/backend_host_encrypted.png" />
</p>
As you can see our backend host is now connected to both our EC2 server and our database server. 
Let's check our EC2 server as well.
<p>
    <img class="image" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/ec2-encrypted-connected.png" />
</p>
As you can see our EC2 server now also has encrypted connections to both the backend server and the database server.
Weave will automatically connect hosts on your network as long as they can be connected though 1 common peer.
In this case our backend server has a connection to our EC2 server and a connection to our database server.
So Weave will automatically create a connection between those 2 as well.
<p>
    <img class="image" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/final_result_ec2.png" />
</p>
As you can see in the screenshot I browsed to the frontend application on the AWS server and it generated a correct response which means our setup works!

# Conclusion
In this blogpost we started off with a simple onprem Weave network.
After testing that the network works we deployed a distributed application on that network.
After this we extended our private Weave network with a peer on AWS in the cloud.
The end result we achieved was that our distributed application was running spread over a cloud and onprem environment.
In our final example we also enabled encryption on the Weave network so all traffic between your onprem environment and the cloud is encrypted.

This can be a huge benefit for enterprises who want to move their applications into the cloud. 
With Weave you can setup your network in a hybrid cloud/onprem model and be sure that all communication is safely encrypted.
This allows the enterprise to do a gradual move to the cloud instead of having to do a big bang approach.
