---
layout: post
authors: [kevin_van_houtte]
title: 'Enabling User Feedback with WebSockets on RabbitMQ and Spring Cloud'
image: /img/sockets/feedback.jpeg
tags: [spring, queue, integration, websockets,  event-driven, cloud]
category: Event-Driven
comments: true
---

### Reading time: 7 minutes and 31 seconds

When working with event-driven applications, you tend to see this on the screen:

> We are processing your request and will notify you when it was treated successfully.

Let's chop the sentence down into processing the request...
This means that the server is processing your request, but the client is not sure if it was entirely successful because it got transformed into an event and published on a queue never to be seen again (fire and forget).  
The client wonders what has happened and needs a way to give his users the state of the request.  
The next statement tells the user it will notify him/her when the request was successful.  
This part can get complex because you want to give a rapid response as soon as possible.  

>The first thing that comes to mind is, can our client not poll the state of the data from the table until it's ready?   

When our client receives a high amount of load, and it's polling the database for the state of the data, it can put the database under unnecessary stress.  
Since polling is a periodically check, it is not real-time, and we want to bring feedback to our users as soon as possible.  
To let your client behave in real-time, we need push events.  
Push events can be enabled by the concept of WebSockets, this bilateral communication connects the server and the client in an open connection with each other.  
This tech post will explain how we enabled push events with RabbitMQ, MQTT, and Spring Cloud Stream.  

# Table Of Contents

* [WebSockets for communication](#websockets-for-communication)
* [Spinning up a RabbitMQ](#spinning-up-a-rabbitmq)
* [Subscribing with a JavaScript client](#subscribing-with-a-javascript-client)
* [Publishing events with Spring Cloud Stream](#publishing-events-with-spring-cloud-stream)
* [Result](#result)

## WebSockets for communication
We chose WebSockets because it provides a bilateral open connection between the client and the server.  
Because handling data becomes complex over TCP and requires hard work to do it yourself, WebSockets offer support for subprotocols.  
These solutions offer us easy ways to transmit data over the wire.   
First, let's talk about opening a WebSocket connection.  
To establish one, we need the client to send a WebSocket handshake request, for which the server returns a WebSocket handshake response.  

The handshake starts with an HTTP request/response.  
Once the connection is established, communication switches to a bidirectional binary protocol which does not conform to the HTTP protocol. 
The switch happens with the [HTTP Upgrade Negotiation](https://en.wikipedia.org/wiki/HTTP/1.1_Upgrade_header){:target="_blank" rel="noopener noreferrer"}, this header allows us to tell the server to switch to the protocol the client desires and open up two-way communication between a client and server.  

At a minimum, a successful WebSocket handshake must contain the protocol version, and an auto-generated challenge value sent by the client, followed by a 101 HTTP response code (Switching Protocols) from the server with a hashed challenge-response to confirm the selected protocol version:  
* Client must send `Sec-WebSocket-Version` and `Sec-WebSocket-Key`.
* Server must confirm the protocol by returning `Sec-WebSocket-Accept`.
* Client may send a list of application subprotocols via `Sec-WebSocket-Protocol`.
* Server must select one of the advertised subprotocols and return it via `Sec-WebSocket-Protocol`. If the server does not support any, then the connection is aborted.
* Client may send a list of protocol extensions in `Sec-WebSocket-Extensions`.
* Server may confirm one or more selected extensions via `Sec-WebSocket-Extensions`. If no extensions are provided, then the connection proceeds without them.

### Choosing a subprotocol  
When I was searching for a suitable subprotocol for handling the data, I first experimented with [STOMP](https://stomp.github.io/){:target="_blank" rel="noopener noreferrer"}.  
STOMP has a rich messaging mechanism for handling data and great support for [Spring](https://docs.spring.io/spring-integration/reference/html/stomp.html){:target="_blank" rel="noopener noreferrer"} and [RabbitMQ](https://www.rabbitmq.com/stomp.html){:target="_blank" rel="noopener noreferrer"}.  
I stumbled against an issue with our API gateway.
To do a security scan, the API gateway had to parse it to XML, which didn't go well with the UTF-8 text-based messages of STOMP.  
Some further research brought us to our next candidate: MQTT.  
MQTT, designed as an extremely lightweight pub/sub messaging transport for IoT and mobile devices, could offer us a way to enable WebSockets.  

When experimenting, I stumbled on support with [RabbitMQ MQTT plugin](https://www.rabbitmq.com/mqtt.html){:target="_blank" rel="noopener noreferrer"} and [RabbitMQ Web MQTT plugin](https://www.rabbitmq.com/web-mqtt.html){:target="_blank" rel="noopener noreferrer"}.
In MQTT over WebSockets, the MQTT messages are transferred over the network and encapsulated by one or more WebSocket frames.  
To communicate with an MQTT broker over WebSockets, the broker must be able to handle native WebSockets.  
To provide such support, we decided to use our own managed RabbitMQ  
The plugin enables the possibility to use MQTT over a WebSocket connection.  
To enable this easily in your broker, you just enable an internal plugin from RabbitMQ itself.  

```shell
rabbitmq-plugins enable rabbitmq_web_mqtt
```
## Spinning up a RabbitMQ
To try it out you can just run RabbitMQ in a Docker container.  
Define the commands in a Dockerfile and off you go!  

```dockerfile
FROM rabbitmq:3.7-management
RUN rabbitmq-plugins enable --offline rabbitmq_web_mqtt
EXPOSE 4369 5671 5672 25672 15671 15672 15675 1883
```

### Configuration
When accessing RabbitMQ via MQTT, credentials have to be given to authenticate yourself.  
Because we are accessing from a JS client, we do not want to expose our credentials to our client because it can be exploited.  
To avoid giving credentials, MQTT supports us to connect anonymously.  

Add these to your `rabbitmq.config file`, and you're good to go:  

```properties
mqtt.default_user = $RABBITMQ_DEFAULT_USER  
mqtt.default_pass = $RABBITMQ_DEFAULT_PASS  
mqtt.allow_anonymous  = true  
```

## Subscribing with a JavaScript client

[Eclipse](https://www.eclipse.org/paho/clients/js/){:target="_blank" rel="noopener noreferrer"} offers us a JavaScript client library to use for opening a WebSocket over MQTT.

With some basic setup, we can fix ourselves a quick WebSocket to the Rabbit to test the handshake.  
As the JavaScript client, we will be subscribing to a queue and listen for any notifications from the backend.   
To configure our client, we need to know what properties we need.  
A list of properties can be found in the [documentation](https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html){:target="_blank" rel="noopener noreferrer"}.  
The most important ones are enabling SSL and using the keep-alive period as described above.  

```javascript
var wsbroker = '{rabbitmq_hostname/ws}'
var wsport = 443; // port for above
// you can use randomizer to be unique "myclientid_" + parseInt(Math.random() * 100, 10));
var client = new Paho.MQTT.Client(wsbroker,wsport, "?access_token={token}","{client}"); 
    
client.onConnectionLost = function (responseObject) {
    console.log("CONNECTION LOST - " + responseObject.errorMessage);
};
client.onMessageArrived = function (message) {
    console.log("RECEIVE ON " + message.destinationName + " PAYLOAD " + message.payloadString);
};
  
  
client.connect({
    useSSL: true,
    onSuccess: function () {
        console.log("CONNECTION SUCCESS");
        client.subscribe('events', {qos: 0});
    },
    onFailure: function (message) {
        debug("CONNECTION FAILURE - " + message.errorMessage);
    }
});
```
### Keeping the heartbeat alive
At any point after the handshake, either the client or the server can choose to send a ping to the other party.  
When the ping is received, the recipient must send back a pong as soon as possible.  
You can use this to make sure the client is still connected.  
A best practice is to set the heartbeat between 20-30 seconds, see [https://tools.ietf.org/html/rfc6202#page-13](https://tools.ietf.org/html/rfc6202#page-13){:target="_blank" rel="noopener noreferrer"}.
The client sends a ping every 10 seconds, and the server waits 10 seconds to send back a pong.  


#### MQTT keep-alive period
The keep-alive period is the answer from the MQTT protocol to the WebSocket heartbeat.  
The keep-alive is a time interval measured in seconds.
It is the maximum time interval that is permitted to elapse between the point at which the client finishes transmitting one control package and the point it starts sending the next.  
It is the responsibility of the client to ensure the interval between the control packets being sent does not exceed the keep-alive value.  
The client can send a ping at any time, irrespective of the keep-alive value, and use the pong to determine that the network and the server are working.  

To configure the keep-alive period, the client can add the property to enable the feature.  
```javascript
client.connect({
        keepAliveInterval: 20
})
```
### TLS over WebSockets
To achieve a secure connection, we need to enable TLS.  
Like HTTP, WebSockets supports TLS with using the prefix `wss://` instead of `ws://` and port `443` instead of `80`.

The client can enable TLS by adding a property.   
```javascript
client.connect({
        useSSL: true
})
```
### Authorization token
The best practice for securing your resources is to propagate your token via the query parameter.  
If you are targeting a backend, the backend can handle this token but for this use-case, we need a reverse proxy/API gateway to validate this token for us.  

```javascript
var client = new Paho.MQTT.Client(wsbroker,wsport, "?access_token={token}","{client}");
```

### Clean Session
Clean session in the MQTT protocol means that if turned on, the server does not know on what topic the client has subscribed to.  
When turned off, the client just needs to reconnect to its session that is stored on the server.  

>Default is true

### Quality Of Service
In combination with the clean session property set to false, the QoS makes your messages durable.  
When the client is offline, the server holds these messages until the client reconnects.  

>Default is 0

### MQTT Client
When opening the WebSocket on RabbitMQ, the broker will create a new queue on the default topic `amq.topic` with a routingKey as the subscriber endpoint.  
{:refdef: style="text-align: center;"}
<img src="{{ '/img/sockets/mqttclient.png' | prepend: site.baseurl }}" alt="Workspace" class="image" style="margin:0px auto; max-width:100%">
{: refdef}

## Publishing Events with Spring Cloud Stream
So now we have our RabbitMQ up with the enabled plugin for MQTT over WebSockets, Spring Cloud Stream offers an abstraction for messaging with RabbitMQ as a binder.  
Because RabbitMQ is our MQTT broker, we do not need any special configuration to handle MQTT messages. 
You can just set up a Spring Boot application with the [https://start.spring.io](Spring Initialzr){:target="_blank" rel="noopener noreferrer"}.  

We start by adding both the dependency for Spring Cloud Stream and the binder of choice.  
This indicates that auto-configuration and abstraction are done for RabbitMQ.  

### Dependencies
```xml
<dependency>
 <groupId>org.springframework.cloud</groupId>
 <artifactId>spring-cloud-stream</artifactId>
</dependency>
<dependency>
 <groupId>org.springframework.cloud</groupId>
 <artifactId>spring-cloud-starter-stream-rabbit</artifactId>
</dependency>
```

### Message Channel
Following up, we need a channel to publish our messages on, so we create an interface to define our channels.  
You can have two kinds of channels, one for everyone (broadcast) or one-to-one (private).  

```java
public interface UserFeedbackChannel {

    String NOTIFICATION_EVERYONE = "globalNotificationChannel";
    String NOTIFICATION_USER = "specificNotificationChannel";

    @Output(NOTIFICATION_EVERYONE)
    MessageChannel globalNotificationChannel();

    @Output(NOTIFICATION_USER)
    MessageChannel specificNotificationChannel();
}
```

To let Spring know it is a custom channel, we need to annotate our configuration class with `@EnableBinding({UserFeedbackChannel.class})`.  

### Configuration
With RabbitMQ, some custom configuration needs to be taken care of.  
Since MQTT takes the topic `amq.topic` as default, we need to target this as our destination for our messages.  
The `routingKeyExpression` enables us to broadcast or privately send the message.  
The `headers.routingKey` is bound to the user we want to message to.  
Our pojo event consists of audit fields that we know of whom the message belongs to.  
This way, we can give feedback to the user who did the transaction.  
If the header is filled with `events`, it broadcasts the message.  

```yaml
spring:
  application:
    name: notifications
  cloud:
    stream:
      bindings:
        globalNotificationChannel:
          destination: amq.topic
        specificNotificationChannel:
          destination: amq.topic
      rabbit:
        bindings:
          globalNotificationChannel:
            producer:
              routingKeyExpression: '''events'''
              declareExchange: false
          specificNotificationChannel:
            producer:
              routingKeyExpression: headers.routingKey
              declareExchange: false
```


### Publisher
Create the pojo you need, so we can start publishing!  
Be aware, before pushing the pojo, it needs to be converted to a String for MQTT to understand the format.  

```java
@Component
public class NotificationSocketPublisher {
    private final UserFeedbackChannel channel;
    private final ObjectMapper objectMapper;

    public NotificationSocketPublisher(UserFeedbackChannel channel, ObjectMapper objectMapper) {
        this.channel = channel;
        this.objectMapper = objectMapper;
    }

    public void sendPrivateNotificationToUser(NotificationSocketEvent event) {
        String object = convertToString(event);
        var notification = MessageBuilder.withPayload(object).setHeader("routingKey", "events." + event.getCreatedBy().toUpperCase());;

        channel.specificNotificationChannel().send(notification.build());
    }
    
}
```

## Result
When the JS client, RabbitMQ, and Spring Cloud backend are running, you can try ìt out by triggering messages from the backend onto the RabbitMQ.  
This will result in communication to the correct subscriber.  
The JS subscriber will interpret these messages and parse readable content from it.  

{:refdef: style="text-align: center;"}
<img src="{{ '/img/sockets/messages.png' | prepend: site.baseurl }}" alt="Workspace" class="image" style="margin:0px auto; max-width:100%">
{: refdef}
