---
layout: post
authors: [tim_vierbergen]
title: '3 Stages of API testing'
image: /img/3-stages-api-testing/overview.png
tags: [Node-RED,angular,nestjs,jest,GoCD,docker,ci]
category: Testing
comments: true
---


> Continuous Integration with automated testing is more and more incorporated in the culture of software delivery companies.
Running tests in different stages is a big part of it.
In this post, we'll have a look at our three stages of API testing we are promoting at Ordina.

# Table of contents
1. [About the setup](#setup)
2. [Stage 1: Unit testing](#unit)
3. [Stage 2: Testing against a mock-end](#mock-end)
4. [Stage 3: Testing full environment](#full-end)
6. [Conclusion](#conclusion)

# Setup

The example we are going to use is part of a bigger microfrontend/microservice setup.
The front-end part of this example is the actual header of this microfrontend setup. It's the top bar, developed as a separate front-end application.
This header provides the user with a search input field, where the user can search our database of competence centers.
This part is written in Angular (5).
The app gets dockerized after the unit tests (and build) are successfully completed.
It is served by a simple Express server inside a Docker container.
The back-end part provides the data of the competence centers.
It's nothing more than a simple REST API written in TypeScript using the Nest.js framework.
The data provided by this service is a JSON file.
Its content is parsed into memory and is exposed through this REST API.

<p>
    <img class="image fit" style="margin:0px auto; max-width:575px;" alt="Easy client server setup" src="/img/3-stages-api-testing/setup.png" />
</p>

The front-end (header) is providing the user with an input field.
This field allows the user to perform a search on our back-end service.
It also provides a `clear` button, so the user can remove the content from the input field and reset the local cache of search results.
A second button is the `filter` button.
When pressed, it will emit an event that can be listened to by other microfrontends.

```javascript
public filterCCs(): void {
  if(isPlatformBrowser(this.platformId)) {
    const event = new CustomEvent('filterCCs', { detail: { needle: this.needle} });
    window.dispatchEvent(event);
  }
}

public filterStats() {
  if ( this.needle === '' ) {
    this.data = [];
  } else {
    this._updateData();
  }
}

private _updateData() {
  this._ccService.getStats(this.needle).subscribe((response) => {
      this.data = response;
  });
}

public resetSearch(): void {
  this.needle = "";
  this.data = [];
}
```

When resetting the content with the `clear` button, we're not sending a request.
When there's nothing to search for, the result would be an empty array.
So we're just resetting our local data to an empty array.

<p>
    <img class="image fit" style="margin:0px auto; max-width:925px;" alt="Easy client server setup" src="/img/3-stages-api-testing/header.png" />
</p>

The back-end API is exposing three endpoints:

```javascript
@Get()
async getAllCCs(@Response() res) {
    const ccs = await this._ccsService.getAllCCs();
    res.status(HttpStatus.OK).json(ccs);
}

@Get('/search')
async searchCCs(@Response() res, @Query('needle') searchString) {
    let filtered = this._ccsService.searchCCs(searchString);
    res.status(HttpStatus.OK).json(filtered);
}

@Get('/:id')
async getCC(@Response() res, @Param('id') id) {
    const cc = await this._ccsService.getCC(+id);
    res.status(HttpStatus.OK).json(cc);
}
```

The header will always trigger the endpoint at `search` with a needle.
When the needle is undefined (or an empty string), the search endpoint will return an empty list.

# Stage 1: Unit testing the communication layer (front and back-end)

<p>
    <img class="image fit" style="margin:0px auto; max-width:575px;" alt="decoupled" src="/img/3-stages-api-testing/unit.png" />
</p>

The first stage is unit testing each component. This step is almost always part of the component's build. Let's take a quick look at each component.

### Unit testing the communication part of the UI

<p>
    <img class="image fit" style="margin:0px auto; max-width:325px;" alt="Easy client server setup" src="/img/3-stages-api-testing/unit-client.png" />
</p>

For unit testing our front-end Angular 5 application, we are going to use the `import { MockBackend } from '@angular/http/testing';` from Angular itself to mock our back-end.

```javascript
...
beforeEach(async(() => {
    TestBed.configureTestingModule({
        ...
      providers: [
        CCService, // our service that is handling the communication
        {provide: XHRBackend, useClass: MockBackend} // our mock
      ]
    })
    .compileComponents();
  }));
...
```

```javascript
describe('Should query ccs with an observable', () =>
    it('Should return data', inject([CCService, XHRBackend], (ccService, mockBackend) => {
      mockBackend.connections.subscribe((connection) => {
        const ccs: Array<CC> = [
          {
              ...
          },
          {
              ...
          }
        ];
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(ccs)
        })));
      });
      ccService.getStats('tim').subscribe((ccs: Array<CC>) => {
        expect(ccs.length).toBe(2);
        expect(ccs[0].clEmail).toBe('tim.vierbergen@ordina.be');
       });
      })
    )
  );
```

The Angular framework handles the communication part.
We want to mock the `$http` call and see how we are handling the result.
The `mockBackend` is working inbetween our own code and the provided `$http` part.
Every call is triggering the `mockBackend.connections`, so the subscribers are triggered.
We are providing our own data and returning it as the response of the `$http` call.

### Unit testing the communication layer of the service

<p>
    <img class="image fit" style="margin:0px auto; max-width:325px" alt="Easy client server setup" src="/img/3-stages-api-testing/unit-service.png" />
</p>

For unit testing our back-end, we are using Jest.
<a href="https://facebook.github.io/jest/" target="_blank">Jest</a> is a testing framework by Facebook.
If you are interested in Jest, make sure to watch this blog, as a post around this topic is in the making.
Just as with our front-end, we trust the framework to correctly handle the communication itself.

Our unit tests will start at the controller level of our API.

```javascript
describe('searchCCs', () => {
    it('should return a filtered array of competence centers', async () => {
      await ccsController.searchCCs(mockResponse, 'tim');
      let data = JSON.parse(mockResponse.data);
      expect(data.length).toBe(2);
      expect(data[0].clEmail).toBe('tim.vierbergen@ordina.be');
    });
});
```

Where mockResponse is exactly that.
A simple mock of the response object.

### Purpose of these unit tests

The goal of these unit tests is to make sure that the functions inside the components are working as expected.
This way the next stage of testing can only fail due to errors from outside this component.
However, to make sure this is the case, the mock data should be as close to production data when it comes to data specific characteristics.
This is more important for your front-end because you have less control over the data itself.
Your back-end API is only responding to request params that are defined in the specs.
So it's easier to control them, or ignore unknowns.

# Stage 2: Testing against a mock-end

<p>
    <img class="image fit" style="margin:0px auto; max-width:575px" alt="Easy client server setup" src="/img/3-stages-api-testing/mock-end.png" />
</p>

In our second stage we are going to use a mock service to test against.
This means that we are going to mock 'the other' component by replacing it with an easy to use solution.
Although we are mocking some parts, this can be seen as an end-to-end test for each component itself.
We want to test our component by means of external services, just as it is supposed to work in a complete environment.

### Mocking our back-end to test our front-end.

<p>
    <img class="image fit" style="margin:0px auto; max-width:575px" alt="Mocking the back-end" src="/img/3-stages-api-testing/front-end-mock.png" />
</p>

For our front-end component (user interface), we are going to mock the back-end.
Some front-ends are performing calls even without human interaction.
However, in most cases, front-end communication is depending on human interaction.
To end-to-end test this part, we are also in need of a framework to mock this user interaction.
<a href="https://getgauge.io/" target="_blank">Gauge</a>, <a href="http://www.protractortest.org/" target="_blank">Protractor</a> and <a href="http://nightwatchjs.org/" target="_blank">Nightwatch.js</a> are some examples of these frameworks.
Most of them depend on 'Selenium WebDriver'.

#### Node-RED for back-end mocking

We are using Node-RED for our back-end mock because it's so easy to setup and dockerize.

> <a href="https://nodered.org" target="_blank">Node-RED</a> is a programming tool for wiring together hardware devices, APIs and online services in new and interesting ways.

Node-RED is much more than just a tool to mock a back-end or any other service.
It comes with a great User Interface to define your flows and to deploy them on your server.

For this example we will mock our three endpoints and return test data.
This test data can come from different sources.
Node-RED provides multiple ways of working with data.
You can include a simple MongoDB in your setup and read (even write) data from it.
Or you can just use functions where you hard code your data.
To keep it simple, we will use the latter in our setup.

<p>
    <img class="image fit" style="margin:0px auto; max-width:875px" alt="Mocking the back-end" src="/img/3-stages-api-testing/node-red-flow.png" />
</p>

A simple mock for a http-call consists out of three parts:

1. The entry point definition itself (input)
2. The function that handles the data (can be static or database or ...)
3. The response definition

<p>
    <img class="image fit" style="margin:0px auto; max-width:425px;" alt="Data function config" src="/img/3-stages-api-testing/node-red-data.png" />
</p>

#### User interface automation

In this setup we are using Protractor for the e2e tests.
The user input is limited to an input field to trigger the search REST-call and two buttons, one button for clearing the input and one for sending the search string to other microfrontend components.

Some of the use cases, such as 'clearing' the input, are already covered in the unit tests.
Depending on the effort you can always retest them in these e2e tests, but for this example, those are not important.
We want to trigger the search REST call by sending the search string `tim` to the input field, and testing the outcome in the user interface.

<p>
    <img class="image fit" style="margin:0px auto; max-width:925px;" alt="Data function config" src="/img/3-stages-api-testing/search-e2e.png" />
</p>


```javascript
...
describe('Searching with Tim should show 2 results', () => {
    page.setSeachText('mySearchString').then(function() {
        it("Input field should contain 'tim'", function() {
            expect(page.getSearchText()).toBe('tim');
        });
        describe("Result should show 2 entries", function() {
    	    it("will show the number 2", function() {
                expect(page.getResultNumber()).toBe('2');
            });
            it("will show a dropdown with 2 results", function() {
                expect(page.getResultList().length).toBe(2);
            });
        });
    });
});
...
```

#### Conclusion for our front-end

This mock e2e test is depending on a mock back-end and a user input automation system.
We are running these tests on our <a href="https://www.gocd.org/" target="_blank">GoCD</a> setup with dockerized elastic agents.
To run these tests, we are in need of a go-agent that can run these e2e test with Protractor, but we also need an environment where we can serve this front-end and the mocked service.
We are doing this with a go-agent that first spins up a docker-compose (for our front-end and mock-end), runs the protractor tests to this new environment and then brings down the environment when tests are finished.

### Mocking our front-end to test our back-end.

<p>
    <img class="image fit" style="margin:0px auto; max-width:500px;" alt="Mocking the back-end" src="/img/3-stages-api-testing/back-end-mock.png" />
</p>

For testing our back-end service, we only need one other service.
This service will need to fire REST calls to our back-end service and analyse the response.
We can use <a href="https://www.getpostman.com/" target="_blank">Postman</a> to set this up.

> Postman is the complete toolchain for API developers, used by more than 3 million developers and 30000 companies worldwide.
Postman makes working with APIs faster and easier by supporting developers at every stage of their workflow.
It's available for Mac OS X, Windows, Linux and Chrome users.

You can use Postman for more than just API testing.
In our setup, we need to create a testing scenario and just run it against our back-end service.
Postman provides a user interface to do so.
However, because we are running our tests on a cloud elastic go-agent, we need to find a way to automate this step.
Luckily, Postman also provides a command-line tool called <a href="https://github.com/postmanlabs/newman" target="_blank">Newman</a>.
Newman let's you run your test scenarios from your command line.
You can first configure everything through the user interface and then just export the scenario so you can use it through the CLI.

> You can read more about Postman and Newman in our blogpost <a href="https://ordina-jworks.github.io/testing/2016/09/16/Automation-testing-with-postman.html" target="_blank">API Testing with Postman and Newman</a>

Below, you can find a part of the exported JSON configuration.
This part will send a GET request to the search endpoint, providing the search string `tim`.
It will then analyse the response and check if the resulting array contains 2 entries and verifies the data.

```javascript
...
    {
	"name": "Search existing ccs",
	"event": [
		{
			"listen": "test",
			"script": {
				"type": "text/javascript",
				"exec": [
					"var jsonData = JSON.parse(responseBody);",
					"var firstResult = jsonData[0];",
					"",
					"tests[\"Status code is 200\"] = responseCode.code === 200;",
					"tests[\"4 results returned\"] = jsonData.length === 2;",
					"tests[\"First result contains id \"] ='id' in firstResult;",
					"tests[\"Cl name contains tim vierbergen\"] = firstResult.cl === \"Tim Vierbergen\";"
				]
			}
		}
	],
	"request": {
		"url": {
			"raw": "{{url}}:{{port}}/ccs/search?needle=tim",
			"host": [
				"{{url}}"
			],
			"port": "{{port}}",
			"path": [
				"ccs",
				"search"
			],
			"query": [
				{
					"key": "needle",
					"value": "tim",
					"equals": true,
					"description": ""
				}
			],
			"variable": []
		},
		"method": "GET",
		"header": [
			{
				"key": "Content-Type",
				"value": "application/json",
				"description": ""
			}
		],
		"body": {},
		"description": ""
	},
	"response": []
}
...        
```

In our continuous integration system, we are running these tests on a simple go-agent that can run these Newman tests.
This agent spins up our service container, runs these tests and bring down that container.

#### Conclusion for our back-end

Testing this back-end service with a mock front-end is pretty easy.
Since our data is included in this service and it is limited to a simple JSON file, we are not running performance tests.
However, when your back-end needs to communicate with a database and/or make calculations, you can and should already include some performance tests in this stage.
You can, for example, include some <a href="https://gatling.io/" target="_blank">Gatling</a> tests in this stage and put some load on this service to check response times.

The goal of this stage is to test the whole component, including the frameworks we are using for the communication.
It is still a decoupled system.
Failures in this stage will show you that some integrations are failing and you know exactly where to look for the errors.

# Stage 3: Testing full environment

<p>
    <img class="image fit" style="margin:0px auto; max-width:575px;" alt="No more mocking" src="/img/3-stages-api-testing/full-env.png" />
</p>

We now want to end-to-end test the whole system.
We can use docker-compose to spin up this environment and then again run tests against the user interface.
It will communicate with the real back-end to query its data and show the results in the user interface.
Again, we want to run those tests on an elastic go-agent, so we are in need of an automated system.
Right, we already used this in the previous stage where we were testing the user interface against a mocked back-end.

<p>
    <img class="image fit" style="margin:0px auto; max-width:575px;" alt="No more mocking" src="/img/3-stages-api-testing/full-env-ui.png" />
</p>


This elastic go-agent must be able to run the Protractor tests (obviously). It will first need to spin up this environment, run the tests and tear down the environment. Same goes for performance tests in this stage.
You can use some frameworks to put extra load on your front-end to see how it's behaving when it needs to handle more REST-calls for different parts.
Or you can run more instances of the user interface, resulting in more load on the back-end service.

# Conclusion

Decoupling your system and running tests in different stages will make it easier to debug when something is going wrong.
Finding errors earlier will also save you some time and resources.
It will lower the cost of your system (cloud) if you'd be able to find bugs before taking it to the next stage and spinning up complete environments.

Yes, writing tests can be more expensive in time and resources in the short run, but it will save you a lot more time and resources in the long run.
