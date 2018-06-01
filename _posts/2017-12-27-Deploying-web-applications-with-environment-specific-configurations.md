---
layout: post
authors: [tim_ysewyn]
title: 'Deploying web applications with environment-specific configurations'
image: /img/2017-12-27-Deploying-web-applications-with-environment-specific-configurations/post-image.jpg
tags: [Angular, Automation]
category: architecture
comments: true
---

# The problem

Recently one of my colleagues came across a problem when he wanted to create an Angular application which needed to have different configuration values between environments.

In 2016, Jurgen Van de Moere wrote a [blogpost](https://www.jvandemo.com/how-to-configure-your-angularjs-application-using-environment-variables/){:target="_blank"} which explained how to create environment-agnostic applications with AngularJS.
A year later, Rich Franzmeier explained in his [blogpost](https://www.intertech.com/Blog/deploying-angular-4-apps-with-environment-specific-info/){:target="_blank"} a solution for Angular applications which was based on Jurgen’s post.
Although both solutions work perfectly, they both have some downsides to it.

Nowadays we want to push devops to all teams.
This implies that our applications should be immutable, and that everything should be automated (as much as possible).
If we want to deploy our application we have to overwrite our configuration file manually, so this was the main disadvantage of the solution they proposed.

# The solution

Our solution is build on top of theirs, and should be able to work for all kinds of frameworks (AngularJS, Angular, React, Vue,...).
<br />Here is how we did it.

## Code setup

We started with an `env.js` file which contains all environment-specific configuration.
This file will expose the data as global variables.
One could set the URL where our API is hosted like this:

``` javascript
(function (window) {
  window.__env = window.__env || {};

  // API url
  window.__env.apiUrl = 'http://dev.your-api.com';
}(this));
```

Next up is to expose this variable to our web application, which in our case is an Angular app.
We created an injectable `Configuration` class, which will have a getter to retrieve our API URL.

``` typescript
import {Injectable} from '@angular/core';

function _env(): any {
  // return the native window obj
  return window.__env;
}

@Injectable()
export class Configuration {
  
  get apiUrl(): any {
    return _env().apiUrl;
  }
  
}
```

All we need to do now is to inject an instance of the `Configuration` class in the class where we need the info.

## Deployment setup

After building our Angular app, we need to package everything together.
Since we want to make everything immutable, the obvious choice here is to use Docker.
While starting a container, we can specify environment variables.
This is where the second part of our solution starts.

Using the `envsubst` bash command we're going to convert a template file into an `env.js` file which contains all our data.
Our `env.js.tpl` file looks like this:

``` javascript
(function (window) {
  window.__env = window.__env || {};

  // API url
  window.__env.apiUrl = '$API_URL';
}(this));
```

To perform this conversion we need to create a `startup.sh` script which will actually execute the `envsubst` command.

``` bash
envsubst < /usr/share/nginx/env.js.tpl > /usr/share/nginx/html/env.js

nginx -g 'daemon off;'
```

Now we need to create a `Dockerfile` which in turn will be used to create our Docker image.

``` docker
FROM nginx:1.13-alpine

COPY dist /usr/share/nginx/html

COPY env.js.tpl /usr/share/nginx/env.js.tpl
COPY startup.sh /usr/local/bin/startup.sh

ENTRYPOINT ["/bin/tini", "--", "/usr/local/bin/startup.sh"]
```

# Conclusion

This is how we managed to build our application only once, and deploy across numerous environments.
Although it is not as immutable as we want it to be, at least we have automated the process to get rid of most human errors.
And this way we can easily create a separate environment if there is a bug in production.