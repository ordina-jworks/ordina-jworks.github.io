---
layout: post
authors: [tim_vierbergen]
title: 'Mocking server sent events: Development and CI'
image: /img/2018-11-21-sse-spring-node-dev-ci/sse-front.png
tags: [sse,Spring,Nodejs,Angular,Node-RED,ci,mock]
category: Testing
comments: true
---

# Table of contents
1. [Intro](#intro)
2. [What are Server-Sent Events](#what-are-server-sent-events)
3. [Java](#java)
4. [Nodejs](#nodejs)
5. [Angular](#angular)
6. [Continuous Integration](#continuous-integration)
7. [Conclusion](#conclusion)

# Intro #

I came across this topic during some consultancy a few months ago, and again a few weeks ago.
As I stated in my previous blogpost about mocking a backend (<a target="_blank" href="https://github.com/thisandagain/sentiment/blob/master/README.md">Node-RED: Development and CI</a>), we don't live in an ideal world.
Backends are not always finished before frontend development starts and personally I hate it when I have to include mock data into my frontend code.
And again, even if that backend feature is finished and deployed somewhere so we don't need to run it locally, sometimes you have less control over messages sent from the backend that need to trigger events in the frontend.

For both of those projects, a use case arose where the system was in need of messages sent from the backend to the frontend, based on purely frontend and backend events.
On older technologies and systems, these problems were solved with a polling mechanism.
Every few seconds, the frontend is querying the backend for updates.
The first technology that comes to mind when reading the specifications are `Websockets`.
A websocket is a bidirectional TCP connection opened between 2 `entities`, in our case a frontend and our backend.
Messages can get sent by a client to the backend, or the other way around.
For more information about websockets a simple Google search will overload you with information and frameworks for Java, Javascript and others.
For Javascript, take a look at  <a target="_blank" href="https://socket.io/">Socket.io</a>.

In our use case, we were only in need of unidirectional streaming, `Server-Sent Events` or in short `SSE`.
Again, the goal was not to implement the backend, but to come up with an easy to implement mock that can be used during development by our frontend developers, and could get reused in testing the frontend against this mock backend.
Ideally, this demo code could get reused by our backend developers as an example.
Although Node-RED has add-ons for SSE, I decided to start writing one myself.

Note: In real systems, multiple clients can connect to the backend and open a channel.

# What are Server-Sent Events #

> Server-Sent Events is a technology for enabling unidirectional messaging over HTTP. The EventSource API is standardized and part of HTML5.

In our use case, the backend should be able to send messages to its clients at any time.
These messages can get triggered by client-side events (over REST) or even triggers from external resources and queues or database changes.

<div style="text-align: center;" >
  <img src="/img/2018-11-21-sse-spring-node-dev-ci/sse-setup.png" width="60%">
</div>

To make SSE work, we need to keep some things in mind.
The logical flow behind it is pretty straight forward.
A client requests a channel by `GET`-ting a resource over REST.
In Javascript you can make use of the <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/EventSource">`EventSource API`</a>.
A backend should respond with some specific headers:

* Content-Type -> 'text/event-stream'
* Cache-Control -> 'no-cache'
* Connection -> 'keep-alive'

This way, the connection between the client and backend is kept open.
At any time, the backend can send a message (event) through this tunnel to the client.
We will go a bit deeper into each section later.

You can read more about the specs on <a target="_blank" href="https://www.w3schools.com/html/html5_serversentevents.asp">W3schools</a> and <a target="_blank" href="https://www.w3.org/TR/2009/WD-eventsource-20090421/#processing-model">W3</a>.

# Java #

Around a year ago, <a href="https://ordina-jworks.github.io/author/dieter-hubau/" target="_blank">Dieter Hubau</a> wrote a <a target="_blank" href="https://ordina-jworks.github.io/spring/2017/10/04/Spring-Cloud-Stream-Rick-And-Morty-Adventure.html">blogpost</a> about Spring Cloud Stream and 'a' microverse of Rick and Morty. He implemented `SSE` using `org.springframework.web.servlet.mvc.method.annotation.SseEmitter`.
I figured, that's a place to start.

## Spring ##

Start by generating a Spring Boot application with some dependencies.
Navigate to <a href="https://start.spring.io/" target="_blank">Spring initializr</a>.
Add data-repository, flyway and h2.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

I've added the Flyway and H2 dependencies because I've generated test data online (sql).
I've created an easy model which represents a message (notification), and maps to a database table, which can be sent to the frontend.

```java
@Entity
@Table(name = "notification")
public class Notification {

	@Id
	@GeneratedValue
	@Column(name = "id")
	private Long id;
	@Column(name = "title")
	private String title;
	@Column(name = "message")
	private String message;

	public Long getId() {return id;}

	public void setId(Long id) {this.id = id;}

	public String getTitle() {return title;}

	public void setTitle(String title) {this.title = title;}

	public String getMessage() {return message;}

	public void setMessage(String message) {this.message = message;}
}
```

I've created a custom `CrudRepository<Notification, Long>`:

```java
public interface NotificationRepository extends CrudRepository<Notification, Long> {
    ArrayList<Notification> findAll();
    Optional<Notification> findById(Long id);
}
```

And a basic service:

```java
@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public ArrayList<Notification> getAll() {
        return this.notificationRepository.findAll();
    }

    public Notification get(Long id) throws EntityNotFoundException {
        Optional<Notification> notification = this.notificationRepository.findById(id);
        if (notification.isPresent()) {
            return notification.get();
        } else {
            throw new EntityNotFoundException();
        }
    }
}
```

Most logic is implemented in the Controller:

```java
@RestController
@RequestMapping("/notification")
public class NotificationController {

    private final List<SseEmitter> emitters = new ArrayList<>();

    @Autowired
    private NotificationService notificationService;

    @GetMapping(produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter events() {
        SseEmitter emitter = new SseEmitter();
        emitters.add(emitter);
        emitter.onCompletion(() -> {
            emitters.remove(emitter);
        });
        emitter.onError(throwable -> {
            emitters.remove(emitter);
        });
        emitter.onTimeout(() -> {
            emitters.remove(emitter);
        });
        return emitter;
    }

    private void handleNotification(Notification notification) {
        emitters.parallelStream().forEach(emitter -> {
            try {
                emitter.send(notification);
            } catch (IOException e) {
                emitter.complete();
            }
        });
    }

    @Scheduled(fixedDelay = 2000)
    public void receiveNotification() {
        this.handleNotification(this.notificationService.get((long) (Math.random() * (100 - 1)) + 1));
    }
}
```

The logic behind the code is again pretty straightforward.
Querying this resource will respond with the correct headers (Content-Type -> MediaType.TEXT_EVENT_STREAM_VALUE == 'text/event-stream') en open an `event stream`.
This resource will create an `SseEmitter` for each request and add that `emitter` to a list.
When an event needs to be sent out to the `clients`, you can then just loop over that list of emitters and send that event.
If you loop at the example code, you can see that the emitter itself has some callbacks (completion, error, timeout, ...).
You can use those function for implementing a specific error strategy, monitoring and logging.

For development purposes, I've added a `@Scheduled`-function that will fire every two seconds and send a random notification from the database through each emitter.

For one of my clients, it wasn't possible to work with Spring.
A Google search resulted in a lot of other solutions for Java implementations of `sse`.

* <a href="https://docs.jboss.org/resteasy/docs/3.5.1.Final/userguide/html/JAX-RS_2.1_additions.html" target="_blank">`SseEventSink, SseEventSource`</a>
* <a href="https://docs.huihoo.com/jersey/2.13/sse.html" target="_blank">`SseFeature`</a>
* <a href="http://www.eclipse.org/jetty/javadoc/9.4.8.v20171121/org/eclipse/jetty/servlets/EventSourceServlet.html" target="_blank">`EventSourceServlet`</a>
* ...

# Nodejs

Although the Java implementation wasn't finished yet, another problem arose.
Not all of our frontend developers where happy with this approach.
They still needed to run a simple Java backend, even if it was a simple Docker container.
So I switched to a `Nodejs` implementation using <a href="https://expressjs.com/" target="_blank">`Express`</a> as a `webserver`.
Express doesn't come with an `SSE`-feature out of the box, but there are `plugins` you can use:

* <a href="https://www.npmjs.com/package/sse-express" target="_blank">`sse-express`</a>
* <a href="https://www.npmjs.com/package/express-sse" target="_blank">`express-sse`</a>
* ...

But instead of using a library, I've implemented my own `middleware`.
Writing custom middleware is very easy and well documented in the <a href="https://expressjs.com/en/guide/writing-middleware.html" target="_blank">docs</a>.

sse-middleware.js:

```javascript
sse_middleware = function (req, res, next) {
    res.sseSetup = function() {
      req.socket.setTimeout(0);
      req.socket.setNoDelay(true);
      req.socket.setKeepAlive(true);
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.statusCode = 200;   
    }

    res.sseSend = function(data) {
      res.write(JSON.stringify(data));
    }

    res.sseOnClose = function(callback) {
      req.on("onClose", callback);
    }

    next()
}
module.exports = sse_middleware;
```

As mentioned before, to make SSE work, you need to set the right `headers` (cfr. MediaType.TEXT_EVENT_STREAM_VALUE).
I've implemented this in the setup of the custom middleware.
Besides this initialization, I've also implemented an `sseSend`-function, for sending messages over the channel, and an `onClose`-callback that will fire whenever the connection closes.

Instead of using an in-memory database, like I did in the Java part of this post, I decided to go with a basic Javascript file that I can switch later to a simple `json`-file with test data.

database.js:

```javascript
var database = {
    notifications: [
        {type: 'test', title: "TEST", message: "testmessage"},
        ...,
        {type: 'test', title: "TEST2", message: "testmessag2"}

    ],
    updates: [
        {  
            entity: 'contact',
            data: {
                id:'123456'
                email:'contact123456@gmail.com'
            }
         },
         ...,
         {  
             entity: 'company',
             data: {
                 id:'123456'
                 tel1:'+3234457645'
             }
         }
    ]
}
module.exports = database;
```

This time, I added different kinds of data lists to my mock data.
Depending on specific parameters, you can then choose to send back a different type of event.

Now, let us take a look at the server implementation.

server.js:

```javascript
var express = require('express');
var sse_middleware = require('./sse-middleware');
var database = require('./database');
var DATA_LENGTH = 10;

var app = express();
app.use(sse_middleware);

var channels = [];
var interval;

function start() {
  interval = setInterval(() => {
    let data = this.createMockEvent(); // to implement yourself
    for(let key in channels) {
      if(channels.hasOwnProperty(key)) {
        channels[key].sseSend(data); // console.log('Emitting to ' + key);
      }
    }
  }, 2000);
}

app.get('/stream', function(req, res) {
  console.log("New subscriber request");
  res.sseSetup();
  channels.push(res);
  res.sseSend("Connection open"); // if you want to send feedback for opening connection
  // res.sendStatus(200);
  res.sseOnClose(()=> {
     // implement your own strategy for removing a channel
  })
})

app.listen(8080, function() {
  console.log('Listening on port 8080...');
  start();
})
```

In the first lines, I just import my mock database and the middleware.
I then initialize the `express`-app and tell it to use the middleware, `app.use(sse_middleware);`.
When the server is started, the app also starts a simple `interval` that will produce a random (or fixed order for testing purposes) event each two seconds.

To start this service:

`$ node server.js`

To test it, you can just open your browser and navigate to `http://localhost:8080/stream`.
You should be able to see events appearing now.
However, there is a catch, and it took me some time to figure out what was going wrong.
In your browser you can see the content of the events, but if you run `$ curl -X GET http://localhost:8080/stream` you won't see anything.
However, if you would start the Java app, you'll see the events appearing in your browser, and during your `curl`-session.
The reason for this, lays in the specs of Server-Sent Events.

<div style="text-align: center;">
  <img src="/img/2018-11-21-sse-spring-node-dev-ci/event-spec.png" width="100%">
</div>

As you can see, a message expects a data field.
Adjusting the `send`-method in the middleware will fix this problem:
`res.write('data:' + JSON.stringify(data) + "\n\n"));`
You can also add the other fields, just separate them with `\n\n`;

For development purposes, it isn't a bad idea to add a start en stop action for managing the interval.
Just add the following to your server:

```javascript
app.get('/start', function(req, res) {
  console.log("Starting stream");
  start();
  res.sendStatus(200);
});

app.get('/stop', function(req, res) {
  console.log("Stopping stream");
  clearInterval(interval);
  res.sendStatus(200);
});
```

So you can start and stop the stream by triggering a `REST-endpoint`.

`$ curl -X GET http://localhost:8080/start` to start the stream of events.`

`$ curl -X GET http://localhost:8080/stop` to stop the stream of events.`

# Angular #

## Frontend SSE ##

The frontend is an Angular 7 app, created with the angular-cli.
Because of reusability the server-sent event receiver feature is bundled in a separate module that can get moved to a shared library later.
In the most simple implementation, you only need a service to handle the connection and forward events to other components.
In this service, you can make use of the <a href="https://developer.mozilla.org/en-US/docs/Web/API/EventSource" target="_blank">EventSource API</a> of plain javascript.

<div style="text-align: center;">
  <img src="/img/2018-11-21-sse-spring-node-dev-ci/event-source.png" width="100%">
</div>

The API comes with an easy constructor and 3 callbacks:

* EventSource.onerror
* EventSource.onmessage
* EventSource.onopen


sse.service.ts:

```javascript
import ...

@Injectable({
  providedIn: 'root'
})
export class SseService {

  readonly url = 'api/stream';

  private _eventSource: EventSource;
  private _open: boolean;

  constructor(private _http: HttpClient) {
    this.init();
  }

  public init(): void {
    this._eventSource = new EventSource(this.url);
    this._eventSource.onmessage = (evt) => this._onMessage(evt);
    this._eventSource.onerror   = (evt) => this._onError(evt);
    this._eventSource.onopen = (evt) => this._onOpen(evt);
  }

  private _onMessage(message: MessageEvent): void {
    this._handleEvent(JSON.parse(message.data));
  }

  private _onError(evt: MessageEvent): void {
    console.log("Error:");
    console.log(evt);
    // implement your own strategy for reconnection
  }

  private _onOpen(evt: MessageEvent): void {
    console.log("Open:");
    console.log(evt);
  }

  private _handleEvent(event: MessageEvent): void {
      // e.g. dispatch to ngrx store
  }
}
```

You'll notice that the `url` used is not mapping on the mock backend.
For local development and testing, this doesn't matter.
Even if both paths would match, the `user interface` and backend can't run both on the same port (http://localhost:8080 vs http://localhost:4200 (standard cli port for `$ ng serve`)).
Requesting resource cross domain will result in `CORS` issues. A proxy to the rescue!

## Proxy ##

To overcome the `CORS` problems, angular-cli, the `serve`-command to be more precise, comes with an optional parameter to add a proxy configuration.
In our production ready setup, all calls to `/api` to the same (sub)domain as where the `user interface` is getting served, get routed to the REST-API.
Because we don't want to add dev or test specific code in the app itself, we proxy the `/api` to our mock backend.

Example given:

proxy.config.json
```javascript
{

    "/api/*": {
        "target": "http://localhost:8080/",
        "secure": false,
        "logLevel": "debug",
        "changeOrigin": true,
        "pathRewrite": {"^/api": ""}
    }
}
```

To use this proxy, serve the app with:

`$ ng serve --proxy-config proxy.config.json`

If you take a look at the logs, you can see the system is logging the routes in the console.

## Frontend + Backend ##

If you want to run the mock backend (Nodejs) along with the frontend, you need to be able to run concurrent tasks.
You can do this in a node environment using the `concurrently`-package.
Just install it by running `$ npm i --save-dev concurrently`.
Add an entry in the `package.json` scripts section:

`"start:proxy": "concurrently \"ng serve --proxy-config proxy.config.json\" \"node path/to/your/server.js \""`

Because they are both starting at the same time, it might happen your backend is not ready while your frontend starts connecting to the stream.
A good `retry` strategy will help you overcome this problem, that can also happen in real life systems as well.

# Continuous Integration #

As mentioned before, this whole approach should result in a mock that can be used for testing as well.
In one of our systems, we have a lot of different event types.
Some only need to show a notification on screen, while others need to refresh data in a cached object, or even change permissions of the logged in user.
To mock this behavior, you can just put all these events in an array and just loop over it.
You can even define different delays for each event if that is what you need.

If you are using <a href="https://ordina-jworks.github.io/testing/2018/08/15/node-red-dev-ci.html" target="_blank">my Node-RED setup</a> from one of my previous posts you should give one of the add-ons a try, however, you can also run both mocks next to each other.
In most approaches, you don't run the application itself thought the dev environment (`$ ng serve --proxy-config proxy.config.json`).
You should run your packaged app like you would do in production.
In our case, we are running everything `Dockerized`.
This means, we build our frontend application and wrap it into a `Docker` image (tag it, and push it to our registry).
In a next stage, we run (deploy) an environment where we can run our tests against.
In this case we are also not going to use the proxy from our development setup.

An easy setup would be using a docker-compose (e.g.):

```yaml
version: "3"

services:
  nginx:
    image: "nginx:mainline-alpine"
    container_name: proxy
    restart: always
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    ports:
      - 80:80
    links:
      - your-web-app
      - node-red

  node-red:
    image: "nodered/node-red-docker"
    restart: always
    container_name: node-red
    volumes:
      - ${userDirPath}/node-red:/data
      - ${userDirPath}/data:/usr/src/node-red/data
    ports:
      - 1880:1880

  your-web-app:
    image: "registry.your-domain.com/your-web-app:${TAG}"
    container_name: your-web-app
    restart: always
    links:
      - node-red
    ports:
      - 9080:80
      - 9081:8080

  selenium:
    container_name: selenium-grid
    image: selenium/standalone-chrome-debug
    ports:
      - 4444:4444
      - 5900:5900
    volumes:
      - /dev/shm:/dev/shm
    network_mode: host
```

We now need to include our own ss-mock backend into this compose.
You can do this by easily adding a plain Nodejs service, map your folder to your `server.js` and overwrite the `CMD`.

```yaml
sse-service:
  image: "node"
  restart: always
  container_name: sse-mock
  volumes:
    - ${pathToYourServer}:/sse-mock
  ports:
    - 8080:8080
    command: node /sse-mock/service.js
```
Don't forget to add the service to the links section of your nginx and to add the proxy rules in the `nginx.conf`.
```
location /api/stream {
    proxy_pass http://sse-mock:8080/api/stream ;
}
```

<div style="text-align: center;">
  <img src="/img/2018-11-21-sse-spring-node-dev-ci/sse-ci-setup.png" width="100%">
</div>

As mentioned before, you could/should use the `/start` and `/stop` for the sse-mock.
In this setup, this means adding extra rules in your nginx config.
You want all your api calls to go to the other mock (Node-RED in this case) while proxying `/stream`, `/start` and `/stop` to your sse-mock.

The advantage of implementing the start/stop functionality, is that you can tell your test framework to start the sse-mock events stream and then start watching the response in the UI.

e.g. (protractor, jasmine):
```javascript
beforeAll(async () => {
    await browser.get('/api/start'); // depending on the host/address
});
```

If you've build your test data/setup in a specific order, you know what to expect and test for in the `user interface`.

# Conclusion #

Setting up Server-Sent Events is very easy.
It is a powerful tool for unidirectional streams to you clients.
The hardest part is defining a strategy for your connections and event type differentiation.
Setting up the `CI` part is easy as well.
Although you can test a lot in your unit tests, implementing End 2 End testing, mock and real, is recommended.
