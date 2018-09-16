---
layout: post
authors: [bas-moorkens]
title: 'Docker multihost networking with weave'
image: /img/docker-basic-networking/docker-basic-networking.png
tags: [Docker, Weave, Networking, Kubernetes]
category: docker
comments: true
---


> In my last blogpost we talked about setting up a docker network on a single host. We talked about a very basic 3 tier application which was packaged into 3 containers.
An angular frontend, a spring boot backend and a mysql database container. 

> No person in their right mind would ever run an application on a single host in production. ( If you are doing this please give us a call and we will gladly come help you out ;-) )
So today I will talk you through the process of setting up multi host networks with the help of weave.

# Table of contents
1. [Why multihost networking?](#why-multihost-networking)
2. [Weave](#weave)
3. [Example](#example)
4. [REST Backend container](#backend-container)
5. [Frontend container](#frontend-container)
6. [Conclusion](#conclusion)

# Why multihost networking?

In my last blogpost we ran our 3 containers on 1 single host network. This has a few obvious disadvantages which I will address first.

* If you would run all your applications as docker containers on 1 machine your environment would still be very prone to outages. If something happens to the physical machine that you use
then you are pretty much done for and you have an outage. Depending on how critical your applications are this could have disastrous results. 
That's why in practice you want to spread your applications over several hosts and connect them to each other over a network.

* Not every application that you package in a docker container is the same. In our example we have a web frontend, a spring boot backend and a mysql database server. 
A database server has fundamental different needs than a weberver. For example you want to make sure that your database container is running on a system with large hard disks that are very fast to access.
On the other side a webserver has litle use for large hard drives and has much more benefit of more RAM to allow lot's of concurrent connections to the system.

* If you use a microservice architecture and you want to scale up a certain microservice it is recommended to make sure that the new instance of that microservice runs on a different machine then the first instance. This is done for resilience of the application but also to make sure to spread the application workload over several different physical machines. This improves the scalability of your application.

So in short multihost networking is pretty important to build **resilient**, **robust** applications that **scale well**. It also allows you to deploy your containers on hardware that makes most sense for your container. 

Now that you are convinced that we do need multi host networks for atleast our production environments let's talk about what we can do to set this up with docker and weave.

# Weave
There are several options to do multihost networking with docker. Nowadays docker itself even supports a basic form of this but we want to use all the good stuff like DNS lookups and service discovery.
That's why we are going to use weave.NET.

Now, what is weave.NET?
Weave.NET is software that is build by the company **[Weaveworks](https://weave.works "Weaveworks")**. It provides you with the ability to create a virtual network accross multiple hosts and enables automatic discovery of hosts and containers within the network. For me these are the most important and useful features: 

* It's **easy** to setup. As I will show in the handson part of this post the setup of weave is done within minutes and is pretty straightforward. 

* It provides a **virtual network** on top of your existing network. In big organisations the network setup can be quite complex with multiple vlans and firewalls. With weave you need your network people to open 1 port for the weave network and that's all. Everything that stays within the weave virtual network can communicate over that same port. 

* The virtual network is very **flexible**. You can use weave to build 1 virtual network between your onprem and cloud environment. Within this network all your containers can communicate with each other as if they were living on the same machine. 

* An added benefit of the virtual network is that it's pretty easy to **secure**. You can encrypt all the traffic on the weave virtual network which adds a layer of security ontop of the existing security you have in place. This is especially useful if you wish to build a network which spans your onprem and cloud environment. Because all traffic is encrypted you are not at risk when containers in the cloud communicate with containers in your onprem environment.

* The weave network comes with its own DNS server. This allows you to do **service discovery** within the weave network. This has huge benefits over addressing applications with their IP addresses. 
Service discovery allows you to do easy **loadbalancing** and provides your applications with **high availablity**. 

* Last but not least I feel obligated to point out that weave works very well with **kubernetes**. For those of you who don't know kubernetes it is basicly the tool you want to be using to run your containers. A deeper tour of kubernetes is for another time, for now I'd like to point out that the default network provider within kubernets is flanel but you can replace that with weave if you want. You then get all the benefits of weave plus the added value that you can make a virtual network that spans several kubernetes clusters and/or your regular docker applications. 

The main point that I'm trying to make here is that weave.NET takes care of a lot of low level networking stuff for you. This allows you to build a more robust and scalable environment to run your applications on without having to worry much about the lower levels in the networking stack.
 
# Example
In this example I will be using ubuntu machines on which I have already installed docker. 
Following picture shows the setup that we will be build in this example.

### Installing weave
To install weave on an ubuntu system you can run following command:

~~~~
sudo curl -L git.io/weave -o /usr/local/bin/weave
sudo chmod a+x /usr/local/bin/weave
~~~~

If you want to install weave on another system take a look on the **[weave install page](https://www.weave.works/docs/net/latest/install/installing-weave/ "weave install page")**. On systems which don't support native docker you will have to setup something like docker-machine in order to get everything to work.

We will need to run the weave install on both of the machines that we are going to use in this example.

### Launching weave
Now that we have installed weave on both machines let's start it up.

#### Setting up host 1
On the first host type following commands.

~~~~
weave launch
eval $(weave env)
~~~~

The first command launches weave. Weave runs as a set of docker containers on your system, you can see this when you run the launch command.
<p>
    <img class="image fit" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/install_weave_result.png" />
</p>
If you run the docker images command you can take a look at all the images that weave downloaded.
<p>
    <img class="image fit" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/weave_images.png" />
</p>

The 2nd command configures the weave environment so that containers that get launched will automatically attach to the weave network.
This means that you have to provide no additional arguments to your docker run commands to use the weave network. 
Behind the scenes weave has setup a docker network for you on your machine, you can take a look at this with the command

~~~~
docker network ls 
~~~~
<p>
    <img class="image fit" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/docker_network.png" />
</p>
You can recognise the weave network by the name **weave** and as you can see it uses the **weavemesh** driver instead of one of the standard docker network options.
When our network setup is done we will test it out with a test container. So for now let's start this container on the first host.

~~~~
docker run -d --name app_on_host1 weaveworks/ubuntu
~~~~
This is just a stripped down ubuntu docker image. We will use it later to test our network setup.


If you look at your machine's network stack you will see that weave has setup several different networks on your host machine in order to make it's magic work.
When I run the 
~~~~
ifconfig
~~~~
command on my machine I can see that weave added following network stacks to my machine:
<p>
    <img class="image fit" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/weave_network_stack.png" />
</p>
What all these networks do is out of scope for this post as that operates on a pretty low level in the tcp/ip stack and we are not really interested in it in our usecase. We just want it to work, right?

#### Setting up host 2
In the last screenshot of the previous section we looked at the network stack of host 1. This is important because we need the **physical ip address** from that host to tell our 2nd host to connect to host 1. In my physical network my host 1 has the ip address 192.168.1.18. This gives us following command to run on host 2.

~~~~
weave launch 192.168.1.18
eval $(weave env)
~~~~

The syntax of this command is pretty straightforward. You tell weave to launch and to connect to every ip you supply as an argument to the launch command.
We will also setup a test container on this host.

~~~~
docker run -d --name app_on_host2 weaveworks/ubuntu
~~~~
These are all the setup steps you need to do in order to setup a simple weave network. Now let's see how we can verify that everything is working.

#### Verifying our setup

There are a few things we can do to verify that our setup is working. To start off let's look at the status off our weave service.
~~~~
weave status
~~~~

This produces following result:
<p>
    <img class="image fit" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/weave_status.png" />
</p>
You can run this command on either host 1, it will provide you with the basically the same results. All sorts of useful stuff is available in the status overview including the range of your weave subnet, the connected peers, the connections. 
As a first step to verify that our network is working let us examine the connections and peers in more detail with following commands.

~~~~
weave status peers
weave status connections
~~~~
<p>
    <img class="image fit" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/weave_status_details.png" />
</p>
As you can see from the output of the commands there are now 2 hosts in our network and there is 1 connection between them. So far everything is looking good!
Now let's do the real test and see if the containers can find each other by the name we gave each container.
On host exec into the container and ping the application on the other host.

~~~~
docker exec -ti app_on_host1 bash
ping app_on_host2
~~~~
<p>
    <img class="image fit" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/ping_test_app_1.png" />
</p>
As we can see from the results our container was able to resolve the other container over the weave network by making use of the weave dns service and the weavemesh network.
If we reverse our test and run it on host 2 we get this result.
~~~~
docker exec -ti app_on_host2 bash
ping app_on_host1
~~~~
As you can see from the example outputs both hosts are now connected and thanks to the weave network and dns service they are able to resolve each other by hostname.
Another noteworthy thing is that weave has setup a class A network (10.xxx.xxx.xxx) range for us. These are all ip addresses within the weave network so you don't have to worry about any ip conflicts with your existing network. If you would have the need for a specific subnet you can force weave to use whatever subnet you like (192,168.1.XXX for example).