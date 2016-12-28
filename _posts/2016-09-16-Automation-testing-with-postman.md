---
layout: post
authors: [greg_rinaldi]
title: 'API Testing with Postman and Newman'
image: /img/postman.png
tags: [Postman,Integration Testing,Newman,Automation,Testing]
category: Testing
comments: true
---

### Prerequisites

For the purpose of this tutorial it is mandatory to have [Postman](https://www.getpostman.com/apps){:target="_blank"} installed which is available has native apps for Windows, OS X and Linux.
It is also mandatory to create an account at [Algorithmia](https://www.algorithmia.com/){:target="_blank"}.

### Creating and selecting an environment

Postman's environment functionality makes it very easy to switch between different environments.
A set of variables can be configured per environment and when switching from one environment to another one these will be replaced accordingly.
For example let’s create an environment called "production".
Click the "No environment" dropdown in the header and select "Manage environments".

<img alt="Manage environment" src="{{ '/img/postman-2016/manage_environment.png' | prepend: site.baseurl }}" class="image fit">

Select the “Add” button on the popup that is presented to you.
Add `url https://api.algorithmia.com/v1/algo/` and `key simNz9pf7hfAQNifdA224K1GFhs1`.
Don't forget to replace the secret by your own key.

<img alt="Manage environment values" src="{{ '/img/postman-2016/manage_environment_values.jpg' | prepend: site.baseurl }}" class="image fit">

Finally select the "Production" environment in the environment dropdown and let's create our first request.

<img alt="Manage environment production" src="{{ '/img/postman-2016/manage_environment_production.png' | prepend: site.baseurl }}" class="image fit">

### Creating a POST request

Enter `{% raw %}{{url}}/WayneS/Calculator/0.1.0{% endraw %}` in the request field and change the method from GET to POST.
We need to add some additional headers as well so add `Content-Type application/json`, `Authorization {% raw %}Simple {{key}}{% endraw %}`.
As you can see,
we are using the environment variables `{% raw %}{{url}}{% endraw %}` and `{% raw %}{{key}}{% endraw %}` so when switching environments,
those variables will get replaced.
The `{% raw %}{{...}}{% endraw %}` format can only be used in the request URL/URL params/Header values/form-data/url-encoded values/Raw body content/Helper fields.

<img alt="Request headers" src="{{ '/img/postman-2016/request_headers.png' | prepend: site.baseurl }}" class="image fit">

Postman also has a few dynamic variables which you can use. For example, `{% raw %}{{$guid}}{% endraw %}` is generating a random v4 style guid,
`{% raw %}{{$timestamp}}{% endraw %}` is the current timestamp,
`{% raw %}{{$randomInt}}{% endraw %}` a random integer between 0 and 1000.
More of those will be added in future releases.
But for now,
let us just simply enter `"x=log(2)"` as the raw content of our request.

<img alt="Request body" src="{{ '/img/postman-2016/request_body.png' | prepend: site.baseurl }}" class="image fit">

Finally let's hit the "Send" button and if everything goes as expected,
we should receive the following response.

<img alt="Request send" src="{{ '/img/postman-2016/request_send.jpg' | prepend: site.baseurl }}" class="image fit">

Next we are going to write our test, but first let us save our request into a collection. By clicking on the create collection button on the collections tab, the following popup will be displayed.  Simply enter "Calculator" as the name of the collection and hit the create button.

<img alt="Create collection" src="{{ '/img/postman-2016/create_collection.jpg' | prepend: site.baseurl }}" class="image fit">

Now hit the "Save" button next to the request field. Enter "Log" as the name of the request and select "Calculator" from the dropdown menu.

<img alt="Save request" src="{{ '/img/postman-2016/request_save.jpg' | prepend: site.baseurl }}" class="image fit">

### Writing a test

A Postman test is essentially JavaScript code which sets values for the special 'tests' object. To know which other objects and libraries are available while writing your test cases, make sure you check the following [link](https://www.getpostman.com/docs/sandbox){:target="_blank"}. Let's copy following code snippet in the Tests sandbox.

{% highlight bash %}tests["Status code is 200"] = responseCode.code === 200;
var jsonData = JSON.parse(responseBody);
tests["Verify result"] = jsonData.result.x === "0.69314718056";{% endhighlight %}

<img alt="Test" src="{{ '/img/postman-2016/test.jpg' | prepend: site.baseurl }}" class="image fit">

The test will run each time you hit the "Send" button. Let's say we need a custom function to set some variables,
this can easily be achieved in the pre-request sandbox as shown below:

<img alt="Custom function" src="{{ '/img/postman-2016/custom_function.jpg' | prepend: site.baseurl }}" class="image fit">

Here we are using the ‘postman’ object and are calling the setEnvironmentVariable function on it,
this allows us to assign the result of our function to a variable on the environment scope for later use.

### Collection Runner

Let's assume we want to run several tests at once.
Postman has a Collection Runner utility that allows us to just do that,
even thousands of tests if we want.
To access the runner click on "Runner" in the top header then select "Calculator" as the collection and "Production" as the environment.
We want the runner to do that 2 times so enter 2 in the iteration inputfield like shown in the screenshot below.

<img alt="Runner full" src="{{ '/img/postman-2016/runner_full.jpg' | prepend: site.baseurl }}" class="image fit">

Scroll down and hit the blue "Start Test" button. Following test report will be presented to you.

<img alt="Runner result" src="{{ '/img/postman-2016/runner_result.jpg' | prepend: site.baseurl }}" class="image fit">

Writing a request and tests for each different permutation of data could get tiresome and tedious.
On the test runner screen we are given the option to choose a data file.
This data file can be either a CSV or a JSON file,
but will allow us to set up data in bulk to be run through the test runner.
Create a new csv file and copy following snippet into it.

~~~~
input,expected_result
2,"0.69314718056"
224,"5.41164605186"
3000,"8.00636756765"
388949,"12.8712035086"
~~~~

We need to rewrite the body of our request so it will use the variable of our csv as follows.

<img alt="Request CSV" src="{{ '/img/postman-2016/request_csv.jpg' | prepend: site.baseurl }}" class="image fit">

We also need to rewrite our test.
Like you can see we use the 'data' object to call our expected_result variable.

<img alt="Test CSV" src="{{ '/img/postman-2016/test_csv.jpg' | prepend: site.baseurl }}" class="image fit">

Back to the runner window.
Select the "Calculator" collection and the "Production" environment.
Click the "Choose Files" button and select the csv file you just created,
click the "Preview" button to check for any inconsistenties.
As there are 4 entries in our csv we want to use to feed our test enter 4 in the iteration inputfield.

<img alt="Runner CSV" src="{{ '/img/postman-2016/runner_csv.jpg' | prepend: site.baseurl }}" class="image fit">

Hit the "Start Test" button and you will now see 12 green tests.
Pretty neat, isn't it?

<img alt="Runner result CSV" src="{{ '/img/postman-2016/runner_result_csv.jpg' | prepend: site.baseurl }}" class="image fit">

### Newman

Integrating Postman tests with build systems can easily be accomplished with Newman. Newman is the command line tool companion for Postman. It can be installed through the Node.js package manager, npm. You'll find more information on how the install Newman [here](https://github.com/postmanlabs/newman){:target="_blank"}.

After Newman is installed we can export our previously created collection and environment.
Select the 'Calculator' collection and hit export and save as `my_collection.json`.

<img alt="Export collection" src="{{ '/img/postman-2016/export_collection.jpg' | prepend: site.baseurl }}" class="image fit">

To export the 'Production' environment select 'Manage Environment' and on the next popup hit export and save as 'prod_environment.json'.

<img alt="Export environment" src="{{ '/img/postman-2016/export_environment.jpg' | prepend: site.baseurl }}" class="image fit">

Now run you test with Newman using following command where `my_collection.json` is the exported collection,
`my_data.csv `the csv, `prod_environment.json` the environment and `-n` the number of lines from our csv.

~~~~
newman run my_collection.json -n 4 -d my_data.csv -e prod_environment.json
~~~~

### Summary

In this tutorial we saw how to create a request and a test.
We saw how to create a collection and how to run it with the collection runnner and Newman.
I hope you enjoyed this tutorial and if you have any question feel free to add these as a comment or to email me at <gregory.rinaldi@ordina.be>.

### Useful links

- [Importing Swagger files](https://www.getpostman.com/docs/importing_swagger){:target="_blank"}
- [Postman Slack invite](https://www.getpostman.com/slack-invite){:target="_blank"}
- [Importing cURL commands](https://www.getpostman.com/docs/importing_curl){:target="_blank"}
- [Creating cURL commands](https://www.getpostman.com/docs/creating_curl){:target="_blank"}
- [Making SOAP requests](https://www.getpostman.com/docs/soap_requests){:target="_blank"}
- [Running Newman in Docker](https://www.getpostman.com/docs/newman_in_docker){:target="_blank"}
- [Authentication helpers](https://www.getpostman.com/docs/helpers){:target="_blank"}
- [Publish Documentation for your Collections](https://www.getpostman.com/docs/creating_documentation){:target="_blank"}
- [Conditional Workflows in Postman](http://blog.getpostman.com/2016/03/23/conditional-workflows-in-postman/){:target="_blank"} (work in progress)
- [Newman](https://www.npmjs.com/package/newman/){:target="_blank"}
- [Integrating Newman with Jenkins ](integrating_with_jenkins/){:target="_blank"}
