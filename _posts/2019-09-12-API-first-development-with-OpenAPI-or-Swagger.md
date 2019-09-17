---
layout: post
authors: [nick_van_hoof]
title: 'API first development with OpenAPI or Swagger'
image: /img/2019-09-12-API-first-development-with-OpenAPI-or-Swagger/featured-image.png
tags: [API, cloud]
category: Cloud
comments: true
---

# Table of content

1.[API first development - Why, how and what](#api-first-development---why-how-and-what)  
2.[API design: an example](#api-design-an-example)  
3.[API first development with OpenAPI/Swagger](#api-first-development-with-openapiswagger)  
4.[Hosting your visualisations](#hosting-your-visualisations)  
5.[Integrating with Postman](#integrating-with-postman)  
6.[OpenAPI Generator: generate API compliant code](#openapi-generator-generate-api-compliant-code)  
7.[Integrating with your build process: maven or gradle plugin](#integrating-with-your-build-process-maven-or-gradle-plugin)  
8.[Serverless on AWS: OpenAPI, API Gateway Lambda and Sam](#serverless-on-aws-openapi-api-gateway-lambda-and-sam)  
9.[Generate consumer driven contract testing](#generate-consumer-driven-contract-testing)  
10.[Resources](#resources)  


# Intro
* I'll start of with a lecture about API first development and it's advantages.
* We will discover how to visualize our API specs. [Jump to section](#api-first-development---why-how-and-what)  
* Next I'll show you how to generate code that is completely compliant with your API specs. [Jump to section](#openapi-generator-generate-api-compliant-code)
* We then dive into how to integrate this in your build process by using maven or gradle plugins. [Jump to section](#integrating-with-your-build-process-maven-or-gradle-plugin)
* To finish it up I'll demonstrate how to use it in a cloud native serverless product. [Jump to section](#serverless-on-aws-openapi-api-gateway-lambda-and-sam)

# API first development - Why, how and what
> Great communication is key to great software engineering.

Not only between people.
Also between application or services.
If your applications cannot communicate properly, you'll never be able to expose the functionality that is key to a good product.


We also see the following trends in software engineering:
* **Shift towards the cloud.**  
Instead of big monolitic applications we are building lot's of smaller (micro)services.
All communication between those services goes through the API.
* **Multiple frontend applications use the same backend.**  
And often these applications are created by separate teams.
* **API's carry business value.**  
Yes, there is money in your API.
An API exposes the functionality of your product.
A good API allows user to integrate with your product with ease.
Thus making your product a great choice.

In all of the cases a above there is value (even money!) in good communication between services.
And that's why you should practice API first development.
Put your communication first!

> API first development makes a clear API definition the first priority

***How can I practice API first development?***
* Understand that the API is the interface for your application.  
It is the intersection where multiple services join hands to couple there functionality.
* First design your API.  
The implementation comes next.
This will allow teams to develop their applications separately because they both know and understand how communication between the services will happen.
The contract between services is set.

Now that we understand the importance of and value of API first design let's see how the Swagger/OpenAPI spec can help you with that.

# API design: an example
Suppose that we ***Ordina*** are hosting a conference where multiple technical and agile sessions will be given.
Users can check session information and register for sessions.
A backend service maintains this information.
The website is exposing the information.
There is also an app for `Android` and one for `IOS`.
The API endpoint that gives you all the sessions is also publicly exposed to allow developers to have some fun with it.
So we have multiple services interacting with the backend.

<div style="text-align: center;">
  <img src="/img/2019-09-12-API-first-development-with-OpenAPI-or-Swagger/design.png" width="50%" height="50%" target="_blank">
</div>

The applications are created by different teams and they all embrace the **API first** approach.

They read this blog and realised that by agreeing on the common interface first they could develop separately without impacting each other.
So hooray for API first development!

# API first development with OpenAPI/Swagger
The functional analysts and a couple of developers of the team are sitting together to agree on how the API should be defined.
* A client should be able to fetch all sessions via the API
* A client should be able to create a new session via the API

This is a crucial part of the API first mindset.
We need to clearly define and communicate the API before starting to implement.
Designing an API is easier when you can visualise the API.
Let's bring in the OpenAPI spec.

> The OpenAPI specification allows you to define your API in a descriptive language (json or yaml) and nicely visualise it

Note: If I speak about OAS (OpenAPI Specification) instead of OpenAPI/Swagger specification.
Let's now use OAS to help us with our API First approach and design our API.

Let me introduce you to [https://editor.swagger.io](https://editor.swagger.io){:target="_blank"}.
A portal to visualise your OAS.
Easy to use and offering all the functionality we need for this example.

I'll keep it simple and create the OAS for the API exposing the endpoint where consumers of the API can fetch all sessions of the conference.
The OAS allows you to use JSON or Yaml to describe your API.

<div style="text-align: center;">
  <img src="/img/2019-09-12-API-first-development-with-OpenAPI-or-Swagger/editor-swagger-io.png" width="100%" height="100%">
</div>

  
Find the descriptive yaml via [this](https://gist.github.com/Nxtra/8ff9a7fd33186309e909df8f5a20cb28){:target="_blank"} gist.

As you can see from the example the OpenAPI specification is very readable.
Even if it's new to you, you should be able to deduct what is written in the yaml.
You like looking in the yaml?
Sure you don't! 
There is this great visualisation to the right of it.
This very clearly visualises what your API can do.
Clear visualisations mean clear communication. 

The API in the example is small.
Describing a whole real-world API, the file might become quite large.
But that's no problem.
The OpenAPI spec allows you to split your definitions over multiple files which you can reference from within other files.

> Takeaways: Easy descriptive language & great visualisations

You want to expose your beautiful visualisation to your clients.
They shouldn't have to past a `yaml` file in a window of there browser all the time.
How do we do that? 
Let's find out next.

# Hosting your visualisations
The API specifications should be easily accessible for you and your clients.
The specification on which you agreed should be hosted somewhere for everyone to see.
Sometimes companies have there own in house tools to visualise OAS.
If your company hasn't there are plenty of tools to visualize your API defined with OAS.

A couple of hosted solutions:
* swaggerhub.com: Platform for API design and hosting by `SMARTBEAR` itself

* next.stoplight.io
<div style="text-align: center;">
  <img src="/img/2019-09-12-API-first-development-with-OpenAPI-or-Swagger/next-stoplight.png" width="100%" height="100%">
</div>

* readme.io
<div style="text-align: center;">
  <img src="/img/2019-09-12-API-first-development-with-OpenAPI-or-Swagger/readme-io.png" width="100%" height="100%">
</div>

* Redocly: [Generator](https://github.com/Redocly/create-openapi-repo){:target="_blank"} for a github repo that allows you to host via github pages. 
It allows you to host locally and integrate with github pages for publishing your api.

<div style="text-align: center;">
  <img src="/img/2019-09-12-API-first-development-with-OpenAPI-or-Swagger/redocly.gif" width="70%" height="70%">
</div>


# Integrating with Postman
> You can create a working Postman collection from the OpenAPI spec

How difficult is it to keep a Postman collection up to date with an evolving API.
Not only that.
You also have to make sure that every member of your team always has the latest version of your API collection.

Good news!
Postman can import a collection directly from the OAS.
In the Postman UI go to `import` and import from `raw text`.
Just like I did in the image below.

<div style="text-align: center;">
  <img src="/img/2019-09-12-API-first-development-with-OpenAPI-or-Swagger/postman-oas.png" width="100%" height="100%">
</div>

As you can see on the background of the image above, the request wat correctly imported from the Swagger file.

# OpenAPI Generator: generate API compliant code
> Generate code that is compliant with your API spec with OpenAPI Generator

You are maintaining the API first approach.
The teams have agreed on the API specs.
It's time to start implementing our API!
No dependencies on other teams.
We already defined the interface of our application.
Let's go ahead with the implementation.

Time to code!
If I write code, I might make mistakes.
Let's generate it.

OpenAPI Generator is a hugely popular [repository](https://github.com/OpenAPITools/openapi-generator){:target="_blank"} on github.
It allows you to generate code that is completely in line with your API spec since you create it automatically from this specification.

On `mac` you can just install the `openapi-generator-cli` by installing it via brew.

```bash
brew install openapi-generator-cli
```

You can also checkout the github project, build it and use that jar.

You have the cli installed and created a directory which contains your api.yml file.

<div style="text-align: center;">
  <img src="/img/2019-09-12-API-first-development-with-OpenAPI-or-Swagger/repo-dir.png" width="100%" height="100%">
</div>

Let's generate the code!

You could generate a whole projec.

```bash
openapi-generator generate -i api.yml -g java
```

That would generate a whole Java project with a bunch of files.
Let's start a little smaller.

If you followed along clear the directory with
```bash
find . ! -name api.yml -delete
```

For starters we only want to generate the model classes:
```bash
openapi-generator generate -i api.yml -g java -Dmodels
```

Let's see what we did here:
```bash
generate
```

Generate is the command that we give to the openapi-generator cli to instruct it to generate the code.

```bash
-i api.yml
```

The input file that contains our API specifications.

```bash
-g java
```

The generator to use.
Here we specify that we want Java as output language.

```bash
-Dmodels
```

We are telling the generator to only generate the models for our API.

If you want help or you forgot one of the options you can look [here](https://github.com/OpenAPITools/openapi-generator/blob/master/README.md#3---usage){:target="_blank"} or execute:

```bash
openapi-generator help generate
```

If you execute this command you'll see that there are a lot more options.
We could for example do the following

```bash
openapi-generator generate \
-i api.yml \
-g java \
-Dmodels \
-DmodelTests=false \
--model-name-suffix Dto \
--model-package "com.ordina.conference_app.model"  \
-p useBeanValidation=true
```

This generates the `java` models without creating test classes and puts them in a package `com.ordina.conference_app.model`.
It suffixes them with `Dto` since that's what they are.
These classes are uses to transfer data in and out of the application (`Dto` aka Data Transfer Object).

<div style="text-align: center;">
  <img src="/img/2019-09-12-API-first-development-with-OpenAPI-or-Swagger/generate-dtos-in-package-with-beanvalidation.png" width="100%" height="100%">
</div>

### Bean Validation
> Keep your generated class files in sync with the requirements from the API specs by setting the useBeanValidation option to true.

In the last example I also specified a property `useBeanValidation=true`.
Requirements specified in the API documentation like a required field are now translated to the code.
The `getter` on the  `speaker` field in the `SessionDto` class is now annotated with `@NotNull`.
You can now use a framework like JSR 380, known as Bean Validation 2.0., to validate input and output.
This is a `Java` specific example, but the same will happen when you change to other languages by using eg. `-g python`.

<div style="text-align: center;">
  <img src="/img/2019-09-12-API-first-development-with-OpenAPI-or-Swagger/SessionDto.png" width="80%" height="80%">
</div>

Now that we got acquainted with code generation I am going to show you how to include it in your build process.

# Integrating with your build process: maven or gradle plugin
There are maven and gradle plugins that support the `openapi-generator` project. 
([maven](https://github.com/OpenAPITools/openapi-generator/tree/master/modules/openapi-generator-maven-plugin){:target="_blank"} and [gradle](https://github.com/OpenAPITools/openapi-generator/tree/master/modules/openapi-generator-gradle-plugin){:target="_blank"})

I started a maven project and included our `api.yml` on the classpath.
Now it is a matter of configuring the `openapi-generator-build-plugin` in our maven `pom.xml`.

I want to configure it to behave the same way as the example above.

```xml
<plugin>
    <groupId>org.openapitools</groupId>
    <artifactId>openapi-generator-maven-plugin</artifactId>
    <executions>
        <execution>
            <goals>
                <goal>generate</goal>
            </goals>
            <configuration>
                <inputSpec>openapi.yaml</inputSpec>
                <output>${project.basedir}</output>
                <generatorName>java</generatorName>
                <addCompileSourceRoot>true</addCompileSourceRoot>
                <skipOverwrite>false</skipOverwrite>

                <modelNameSuffix>Dto</modelNameSuffix>
                <modelPackage>be.ordina.conference.api.model</modelPackage>
                <generateModels>true</generateModels>
                <generateModelTests>false</generateModelTests>
                <generateModelDocumentation>true</generateModelDocumentation>

                <generateApis>false</generateApis>
                <generateSupportingFiles>false</generateSupportingFiles>

                <library>jersey2</library>

                <configOptions>
                    <dateLibrary>java8-localdatetime</dateLibrary>
                    <java8>true</java8>
                    <useBeanValidation>true</useBeanValidation>
                    <sourceFolder>src/java</sourceFolder>
                </configOptions>
            </configuration>
        </execution>
    </executions>
</plugin>
```

Important to note here are the following points:

* The generated models will appear in the current module under `/src/java/be/ordina/conference/api/model`
That is caused by the combination of multiple options:
  * `<output>${project.basedir}</output>`
  * `<sourceFolder>src/java</sourceFolder>` 
  * `<modelPackage>be.ordina.conference.api.model</modelPackage>`
    
    
* only the API models will be generated, with markdown documentation and no test classes.
That's a combination of:
  * `<generateModels>true</generateModels>`
  * `<generateModelTests>false</generateModelTests>`
  * `<generateModelDocumentation>true</generateModelDocumentation>`
  * `<generateApis>false</generateApis>`
  * `<generateSupportingFiles>false</generateSupportingFiles>`

Check out [this gist](https://gist.github.com/Nxtra/4c92fa9a6c2fb62a8c606128ae8ca87f){:target="_blank"} for the code.

# Serverless on AWS: OpenAPI, API Gateway Lambda and Sam
It's fairly easy to create an API Gateway from a openAPI specification.
In the API Gateway console under *Create* select * Import from Swagger or Open API 3* and upload your specification.

<div style="text-align: center;">
  <img src="/img/2019-09-12-API-first-development-with-OpenAPI-or-Swagger/create-apigateway-via-ui.gif" width="100%" height="100%">
</div>

Of course we want to use the specification programmatically.
Suppose we create our backend service with AWS Lambda (serverless).
I stay with AWS native tools and will use SAM to deploy the Lambda functions and my API.
SAM allows you to use an OpenAPI specification to create your API Gateway.

In your SAM template define the API Gateway resource by referencing you OAS.

```yaml
  ConferenceApiGateway: 
    Type: AWS::Serverless::Api
    Properties:
      StageName: dev
      DefinitionBody:
        Fn::Transform:
          Name: AWS::Include
          Parameters:
            Location: ./openapi.yaml
```

In the lambda function resource specify that the lambda should be triggered from this API Gateway.

```yaml
  GetAllSessionsFunction:
    Type: AWS::Serverless::Function
    Properties:
      ...
      Events:
        CreateSessionApi:
          Type: Api
          Properties:
            RestApiId: !Ref "ConferenceApiGateway"
            Path: /session/all
            Method: GET
```

And add the `x-amazon-apigateway-integration` extension in your `api.yml` to specify how the api has to integrate with the backend Lambda service.

```yaml
paths:
  "/session/all":
    get:
      ...
      x-amazon-apigateway-integration:
        type: "aws_proxy"
        httpMethod: "POST"
        uri:
          Fn::Sub: arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${GetAllSessionsFunction.Arn}/invocations
```

For a the full template including the Lambda resources look in this [gist](){:target="_blank"}. //TODO
Checkout the application here: //TODO

# Generate consumer driven contract testing




# Resources
https://scratchpad.blog/serverless/howto/configure-aws-api-gateway-with-swagger/
https://github.com/jthomerson/cloudformation-template-for-lambda-backed-api-gateway-with-dynamodb
https://medium.com/capital-one-tech/how-to-make-swagger-codegen-work-for-your-team-32194f7d97e4
https://github.com/OpenAPITools/openapi-generator
https://howtodoinjava.com/swagger2/code-generation-for-rest-api/
https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#globals-section
https://www.47northlabs.com/knowledge-base/generate-spring-boot-rest-api-using-swagger-openapi/

