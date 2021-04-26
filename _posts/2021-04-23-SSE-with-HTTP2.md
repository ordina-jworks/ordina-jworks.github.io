---
layout: post
authors: [jago_staes]
title: 'SSE with HTTP2'
image: /img/2021-04-23-SSE-HTTP2/SSE-HTTP2.png
tags: [spring, event-driven, server-sent-events, cloud-native, http]
category: Event-Driven
comments: true
---


# Table Of Contents

* [What are Server-Sent Events?](#what-are-server-sent-events)
* [Why SSE over Websockets?](#why-sse-over-websockets)
* [HTTP/1.1 vs HTTP/2](#http11-vs-http2)
* [Summary](#summary)
* [Demo application](#demo-application)

# What are Server-Sent Events?
Server-Sent Events is a technology where the client receives data (events) pushed by a server over HTTP.
This data can be a random update (for example a tweet). Or a constant stream of data (stock market price updates).
The main point is that the client does not need to poll for this data. There is no communication required from client to server.
This technology may have been overshadowed by WebSockets because of SSE limitations in the past, 
but as you will see and learn in this blogpost, you have nothing to worry about anymore!


# Why SSE over WebSockets?
While it is true that WebSockets have more capabilities than SSE, when these capabilities are not part of your use-case SSE in my opinion is a much better choice. 
for example with Websockets you have the ability to communicate from your client to the server.
But you are going to have to take care of this connection yourself,
One of the implications this brings is that the connection between server and client is a **stateful connection** which is a pretty important thing to take into consideration when you are trying to build cloud-native applications.
WebSockets are also more supported by older browsers than SSE but this is easily solved by using the **JavaScript EventSource interface** to create your own connection to the server and receive the data that way.
I will demonstrate how easy it is to use this interface and solve this issue while building the demo application at the end of the blogpost.

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2021-04-23-SSE-HTTP2/SSE-vs-WS.png' | prepend: site.baseurl }}" alt="Workspace" class="image" style="margin:0px auto; max-width:70%">
{: refdef}

# But then why use SSE?
One of the key differences between SSE and WS is that SSE uses simple HTTP to send data to the clients.
This means it does not require a special protocol like STOMP or MQTT which in turn requires server implementation to get it working making SSE a lot easier to set up.
SSE also has built in support for reestablishing connections and event IDs which WS lacks by design.

So the main question you have to ask yourself is whether your use-case fits into the whole SSE story.
Is there no communication from client to server required?
Is the application you are trying to build supposed to be cloud-native?

If the answer to these questions is no and there is no it might save you a lot of work going for SSE over WS.

# HTTP/1.1 vs HTTP/2
HTTP/1.1 is an old protocol, it loads requests one-by-one over a single TCP connection or in parallel over multiple TCP connections in an effort to decrease loading times while requiring more resources.
This was fine when this protocol was new, about 23 years ago, but as time goes by and webpages become more advanced, the limitations of this protocol are really starting to show.
This is why HTTP/2 was made, it aims to tackle the limitations set by HTTP/1.1 and be more future-proof.

With HTTP/2 multiple requests can be sent over the same TCP connection with responses arriving out of order.
HTTP/2 is a binary protocol, removing security issues and error-proneness that come with text-based protocols.
It is backwards compatible with earlier versions of the protocol and is compatible with almost all browsers.
HTTP/2 also avoids the round trip to the server by having the server intuitively sending resources that will be required to render the page.
All these advantages eliminate the need for developers to write best practice workarounds to deal with the limitations of older versions of the protocol,
they decrease loading times and improve the website infrastructure.
This on top of full backwards compatibility make the choice between HTTP/1.1 and HTTP/2 for Server-sent events a no-brainer.

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2021-04-23-SSE-HTTP2/HTTP1-vs-HTTP2.png' | prepend: site.baseurl }}" alt="Workspace" class="image" style="margin:0px auto; max-width:70%">
{: refdef}

# Summary
The key takeaways from this post are that the choice between SSE and Websocket is entirely dependent on the use-case of the application you are trying to develop.
If you are looking for a stateless approach, or you don't have a need for client to server communication, SSE might be the solution for you!
The other takeaway is that you should definitely use HTTP/2 to get the most out of your application and not run into the limitations that HTTP/1.1 lays upon SSE.

If after reading this blogpost you have come to the conclusion that you would be better off building a Websocket application to fit your use-case you can read through a blogpost on websockets made by my colleague Kevin Van Houtte [here](https://ordina-jworks.github.io/event-driven/2020/06/30/user-feedback-websockets.html){:target="_blank" rel="noopener noreferrer"}.

# Demo application
In this part of the blogpost I am going to show you how easy it is to develop your own SSE application.

### The use-case
For the application we are going to build we are going to build a Spring Boot application that consumes a Chuck Norris joke REST API and then use a Flux to push joke data from the server using Server-Sent events to any clients that are subscribed.

# The SSE server

### pom.xml
To start off we are going to make a Spring Boot application and add the following Maven dependencies:

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-webflux</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <scope>runtime</scope>
        <optional>true</optional>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### ChuckNorrisJoke.java
Now we are going to add our data model, as explained in the use-case this will be a simple Chuck Norris joke object containing a String value.

```java
public class ChuckNorrisJoke {

    private String value;

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
```


### JokeService.java
The next step is to get the joke data by consuming a public [Chuck Norris joke API](https://api.chucknorris.io/){:target="_blank" rel="noopener noreferrer"}.
First we create a `JokeService` interface and implementation:

```java
import org.springframework.stereotype.Service;

@Service
public interface JokeService {
    ChuckNorrisJoke getRandomChuckNorrisJoke();
}
```

```java
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class JokeServiceImpl  implements JokeService{

    private RestTemplate restTemplate;
    private HttpHeaders httpHeaders;

    private final String chuckNorrisJokeUrl = "https://api.chucknorris.io/jokes/random";

    JokeServiceImpl(RestTemplate restTemplate, HttpHeaders httpHeaders){
        this.restTemplate = restTemplate;
        this.httpHeaders = httpHeaders;
    }

    @Override
    public ChuckNorrisJoke getRandomChuckNorrisJoke() {
        ChuckNorrisJoke joke = new ChuckNorrisJoke();
        ResponseEntity<ChuckNorrisJoke> response = restTemplate.exchange(chuckNorrisJokeUrl,
                HttpMethod.GET,
                new HttpEntity<>(httpHeaders),
                ChuckNorrisJoke.class);
        if (response.hasBody()) {
            joke.setValue(response.getBody().getValue());
        }
        return joke;
    }
}
```

### ServerConfig.java
The `RestTemplate` and `HttpHeaders` beans are defined in the ServerConfig class as follows:

```java
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;

import org.springframework.http.HttpHeaders;
import java.time.Duration;

@Configuration
public class ServerConfig {
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder
                .setConnectTimeout(Duration.ofMillis(10000))
                .setReadTimeout(Duration.ofMillis(10000))
                .build();
    }

    @Bean
    HttpHeaders httpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE);
        headers.set(HttpHeaders.CACHE_CONTROL, CacheControl.noCache().cachePrivate().mustRevalidate().getHeaderValue());
        return headers;
    }
}
```

### JokeController
Now for the final part of the Java code, all we have to do is create an endpoint for clients to subscribe to and push the joke data to this endpoint.
For this we are going to create a JokeController and use a Flux which is a Reactive Stream publisher to periodically emit Server-Sent events containing ChuckNorrisJokes to this endpoint.

```java
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.time.Duration;

@RestController
@RequestMapping("sse-server")
public class JokeController {

    private final JokeService jokeService;

    JokeController(JokeService jokeService){
        this.jokeService = jokeService;
    }

    @GetMapping("/chuck-norris-joke-stream")
    public Flux<ServerSentEvent<ChuckNorrisJoke>> streamJokes() {
        return Flux.interval(Duration.ofSeconds(5))
                .map(sequence -> ServerSentEvent.<ChuckNorrisJoke>builder()
                .data(jokeService.getRandomChuckNorrisJoke())
                .build());
    }
}
```

When we run our application and go to [http://localhost:8080/sse-server/chuck-norris-joke-stream](http://localhost:8080/sse-server/chuck-norris-joke-stream){:target="_blank" rel="noopener noreferrer"} you can see data coming in every 5 seconds.

# The web client
Now all that's left to do is use the [JavaScript EventSource interface](https://developer.mozilla.org/en-US/docs/Web/API/EventSource){:target="_blank" rel="noopener noreferrer"} to open a connection to our SSE server and transform the events into text to display in our basic HTML demo page.

### index.html

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Server-sent events app</title>
        <script src="/app.js"></script>
    </head>
    <body>
        <div id="main-content" class="container">
            <div class="row">
                <table id="jokes" class="table table-striped">
                    <tr>
                        <th>Chuck Norris Jokes</th>
                    </tr>
                </table>
            </div>
        </div>
    </body>
</html>
```

### app.js

```javascript
const eventSource = new EventSource('sse-server/chuck-norris-joke-stream')

eventSource.onmessage = function (e) {
    const joke = JSON.parse(e.data);
    showJoke(joke.value);
}

function showJoke(joke) {
    var table = document.getElementById("jokes");
    var row = table.insertRow(-1);
    var cell = row.insertCell(0);
    cell.innerHTML = joke;
}
```

## Result
I will leave the styling up to you but you should now have a working SSE server and client that receives data in the form of Server-Sent events.
All that is left to do for you is to enable HTTP2 by adding `server.http2.enabled=true` to your application.properties file and to enable HTTPS the way you would do it in any Spring Boot application.

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2021-04-23-SSE-HTTP2/jokes.gif' | prepend: site.baseurl }}" alt="Workspace" class="image" style="margin:0px auto; max-width:100%">
{: refdef}

# One final note
You can find the code for this application using HTTP/1.1 and HTTP/2 as well as an example to achieve the same thing using Websockets on my [github](https://github.com/jagostaes/sse-servers){:target="_blank" rel="noopener noreferrer"}.
If you have any questions regarding this topic you can reach out to me on my [Twitter](https://twitter.com/jagostaes){:target="_blank" rel="noopener noreferrer"} and I will try my best to help you out.
