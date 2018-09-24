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
3. [Basic example](#basic-example)
4. [Application example](#application-example)
5. [Onprem cloud application example](#onprem-cloud-application-example)
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
 
# Basic example
In this example I will be using ubuntu machines on which I have already installed docker. 
Following picture shows the setup that we will be build in this example.

<p>
    <img class="image fit" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/weave_basic_diagram.png" />
</p>

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

# Application example
For this example we will use the weave setup we created in the previous example. I will be running the application from the basic docker networking blogpost on our 2 hosts in the weave network.
You can checkout the code for this example on **[my github account](https://github.com/basmoorkens/docker-networking-demo "weave install page")**. For this example I will be using the branch **weave-basic-example**.

### Setup database
In the first step we will setup our database container on one of the weave hosts. I will be using my desktop to run the database container.
First we will run the **run_db.sh** script to start up a new mysql container and assign a root password to it.
When that container is up and running we can initialise it with a database and some data. To initialise the database run the **init-db.sh** script. 
We can run following commands to verify that our database is up and running in the weave network.
~~~~
docker ps
weave ps
~~~~
This should give you a similar output to the screenshot below.
<p>
    <img class="image" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/db_setup.png" />
</p>
As you can see the mydb container was automatically added to the weave network because of the **eval $(weave env)** command we ran earlier in this demo.
Note that the weave ps command shows you the container id and the ip address it has allocated to that container. Now that our database is up and running let's switch over to our other machine and start the other services over there.

### Setup backend application
Let's install our backend service on our 2nd host. In the folder **backend** we will run following commands to compile our application and startup our docker container.
Let's first start our backend container with the **test_run_backend.sh** script. This script runs the container and exposes it's webservice to the outside world through the 8080 port. 
We can then use our browser on our host to verify that the service is running correct.
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
This shows us that indeed the container has started ok and it has gotten an ip addresss within the weave network.
<p>
    <img class="image" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/backend_setup.png" />
</p>
Now that we know our backend and our database is running within the weave network we can query our rest service and see if everything works as expected.
<p>
    <img class="image" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/backend_verification.png" />
</p>
As you can see when I do a http GET to my rest backend it comes back with a greeting it got from the database container on the other host. 
Now that we have verified that our backend runs fine we will stop it and start it up again without exposing a port to the outside world.
~~~~
docker stop rest-backend
docker rm rest-backend
./run_backend.sh
~~~~
As you can see from the docker ps command the backend now runs without exposing a port. This is important because our frontend application will call our rest-backend through the weave network so we don't have to expose a port to the outside world for it.
<p>
    <img class="image" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/rest-backend-without-port-exposed.png" />
</p>

### Setup frontend application
Our frontend application is a bit different from the one I used in my previous demo. <br />
In the previous demo we used an angular frontend, this time I replaced it with a simple webserver I wrote in **Golang**.<br />
The reason for this is that I want to demonstrate that applications can access each other through the internal weave network by their container name. <br />
I could not demonstrate this last time with angular because angular code is rendered inside the browser on the client side. <br />
Our client's browser is not inside the weave network so it has no way to resolve the webservice call from our frontend application to our rest-service in the angular scenario.<br />
In this example our go frontend renders the html response on the server side. So the code that calls the rest-service is running inside the docker container and is thus a part of the weave network.<br />
That is also the reason why we can access our rest backend via following url:
<p>
    <img class="image" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/frontend-call-to-backend.png" />
</p>

The source code of the go program is on github under the **frontend** folder. Note, I also included a compiled binary so that you can still use the program even if you don't have a working Golang installation. 
To start our frontend container run following commands inside the frontend folder.
Only execute the first command if you wish to compile the Go program yourself.
~~~~
go build
docker build -t frontend .
./run_frontend.sh
~~~~
Our go frontend application should be up and running now so let's check if everything is workin as expected.
<p>
    <img class="image" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/final-result.png" />
</p>
As you can see from the screenshot we can access our frontend application through port 8080 ( which we exposed to the outside world with the docker run command).
In this example I gave the name "john" which has no entry in our database so our rest-backend returned the standard hardcoded message "hello friend".
<p>
    <img class="image" style="max-width:633px" alt="Weave install result" src="/img/2018-09-15-docker-networking-with-weave/final-result-2.png" />
</p>
In this example I gave the name "bas" as a parameter and we have a message in our database for this name so we got the message "hello master" as a result.<br />
Since no docker ports are exposed to the outside world ( except for our frontend application so we may access it from our host) this is definitive proof that our go application is accessing our rest-backend application through the weave network. 
Likewise, our rest-backend application is accessing our mydb container through the weave network as well.

Oh, and by the way. You can run your containers on any host which is connected to our weave network. Cool, huh?<br />
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