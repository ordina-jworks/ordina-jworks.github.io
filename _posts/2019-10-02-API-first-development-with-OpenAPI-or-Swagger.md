---
layout: post
authors: [nick_van_hoof]
title: 'API first development with OpenAPI/Swagger'
image: /img/2019-10-02-API-first-development-with-OpenAPI-or-Swagger/featured-image.png
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
7.[Integrating with your build process: maven or gradle plugin](#integrating-swaggeropenapi-with-your-build-process-maven-or-gradle-plugin)  
8.[Serverless on AWS: OpenAPI, API Gateway Lambda and SAM](#serverless-on-aws-openapi-api-gateway-lambda-and-sam)  
9.[Springfox](#code-first-with-springfox)   
10.[Conclusion](#conclusion)



# Intro
* I'll start of with a lecture about API first development and it's advantages.([Jump to section](#api-first-development---why-how-and-what))
* We will discover how to visualize our API specs. ([Jump to section](#api-first-development-with-openapiswagger))  
* Generate a postman collection from your OpenAPI definition. ([Jump to section](#integrating-with-postman))   
* Next I'll show you how to generate code that is completely compliant with your API specs. ([Jump to section](#openapi-generator-generate-api-compliant-code))
* We then dive into how to integrate this in your build process by using maven or gradle plugins. ([Jump to section](#integrating-with-your-build-process-maven-or-gradle-plugin))
* To finish it up I'll demonstrate how to use it in a cloud native serverless product with `AWS SAM` and `AWS Lambda`. ([Jump to section](#serverless-on-aws-openapi-api-gateway-lambda-and-sam))
* Wrapping it up with a conclusion.

> An API or Application Programming Interface is a way of exposing your company's digital services.

It is the layer through which your services communicate with other services.

# API first development - Why, how and what
> Great communication is key to great software engineering.

That also goes for applications and services.
If your applications cannot communicate properly, you'll never be able to expose the functionality that is key to a good product.


We also see the following trends in software engineering:
* **Shift towards the cloud.**  
Instead of big monolitic applications we are building lot's of smaller (micro)services.
All communication between those services goes through the API.

* **Multiple frontend applications use the same backend.**  
Often these applications are created by separate teams.

* **An API carry business value.**    
There is real money in your API.  
Defining APIs gives us the opportunity to expose our application's functionality and create bridges between our provider and consumers.
The easier it is to integrate with your API, the higher the acceptance rate of consumers for your product will be.

In all of the cases above, there is value in good communication between services.
And that's why you should practice API first development.
Put your communication first!

> The first priority in your API first development story is a clear API definition

***How do you practice API first development?***  
* *Design your API before implementing it.*  
This will allow teams to develop their applications separately because they both know and understand how communication between the services will happen.
The contract between services is set.
* *Understand that the API is the interface for your application.*  
It is the intersection where multiple services join hands to couple their functionality.
* *Visualize your API*  
An image says more then a thousand words. We'll see how OpenAPI can help you with this.

> API first development allows teams to develop separately against a common interface, the API.

Now that we understand the importance of and value of API first design let's see how the Swagger/OpenAPI spec can help you with that.

## Top-down vs bottom-up
> API first development implies a top-down approach to build your API.

Basically there are two approaches:
* Top-down aka Design First
* Bottom-up aka Code First

To quote `Swagger.io`:
> Design First: The plan is converted to a human and machine readable contract, such as a Swagger document, from which the code is built.  

> Code First: Based on the business plan, API is directly coded, from which a human or machine readable document, such as a Swagger document can be generated.

In this blog post I am using the Top-down Design First approach to facilitate API first development.
In the last paragraph of this blog I'll briefly show an example of a Code First approach with `Springfox`.

# API design: an example
Suppose that we, ***Ordina***, are hosting a conference where multiple technical and agile sessions will be given.
Users can check session information and register for sessions.
The backend service is accessed by a web application and two mobile apps.

<div style="text-align: center;">
  <img src="/img/2019-10-02-API-first-development-with-OpenAPI-or-Swagger/design.png" width="40%" height="40%" target="_blank">
</div>

The applications are created by different teams and they all embrace the **API first** approach.

They read this blog and realised that by agreeing on the common interface first, they could develop separately without impacting each other.
So hooray for API first development!

# API first development with OpenAPI/Swagger
Let's continue with creating the backend application.

The functional analysts and a couple of developers of the team are sitting together to agree on how the API should be defined.
* A client should be able to fetch all sessions via the API
* A client should be able to create a new session via the API

This is a crucial part of the API first mindset.
We need to clearly define and communicate the API before starting to implement.
Designing an API is easier when you can visualise the API.
Let's bring in the OpenAPI spec.

> The OpenAPI specification allows you to define your API in a descriptive language (JSON or Yaml) and nicely visualise it

Let's now use OAS to help us with our API First approach and design our API.
Note that by OAS I mean OpenAPI Specification.  

> OAS stands for OpenAPI Specification (formerly known as Swagger Specification)

If you are confused about the difference between OpenAPI and Swagger check out [this page](https://swagger.io/docs/specification/about/){:target="_blank"}.

Time to introduce you to [https://editor.swagger.io](https://editor.swagger.io){:target="_blank"}, a portal to visualise...
Easy to use and offering all the functionality we need for this example.

I'll keep it simple, we will create the OAS for exposing the endpoint to let consumers fetch the sessions of the conference.  
The OAS allows you to use JSON or Yaml to describe your API.

<div style="text-align: center;">
  <img src="/img/2019-10-02-API-first-development-with-OpenAPI-or-Swagger/swagger-layout.png" width="100%" height="100%">
</div>

Find the descriptive yaml via [this](https://gist.github.com/Nxtra/8ff9a7fd33186309e909df8f5a20cb28){:target="_blank"} gist.

As you can see from the example, the OpenAPI specification is very readable.
Even if it's new to you, you should be able to deduct what is written in the yaml.  
You like looking at raw yaml?
Sure you don't! 
There is a great visualisation to the right of it.
This clearly visualises what your API can do.
Clear visualisations mean clear communication. 

The API in the example is small.
When describing a whole real-world API, the file might become quite large.
But that's no problem.
The OpenAPI spec allows you to split your definitions over multiple files which you can reference from within other files.

> OpenAPI Takeaways: Easy descriptive language & great visualisations

You want to expose your beautiful visualisation to your clients.
They shouldn't have to paste a `yaml` file in a window of their browser all the time.
How do we do that? 
Let's find out next.

# Hosting your visualisations
The API specifications should be easily accessible for you and your clients.
The specification which you agreed upon, should be hosted somewhere for everyone to see.
Sometimes companies have there own in-house tools to visualise OAS.
If your company has no such tool there are plenty of other tools to visualize your API defined with OAS.

> Choose a visualisation solution that allows you to show a diff between versions of your API

A couple of hosted solutions:
* [swaggerhub.com](https://swagger.io/tools/swaggerhub/){:target="_blank"}: Platform for API design and hosting by `SMARTBEAR` itself

* [next.stoplight.io](https://next.stoplight.io/){:target="_blank"}
<div style="text-align: center;">
  <img src="/img/2019-10-02-API-first-development-with-OpenAPI-or-Swagger/next-stoplight.png" width="100%" height="100%">
</div>

* [readme.io](https://readme.com/){:target="_blank"}
<div style="text-align: center;">
  <img src="/img/2019-10-02-API-first-development-with-OpenAPI-or-Swagger/readme-io.png" width="100%" height="100%">
</div>

* [apiary](https://apiary.io/){:target="_blank"}

* Redocly:  Redoc allows you to host via github pages. 
You can also host locally and integrate with Github pages for publishing your API.
Use this [Generator](https://github.com/Redocly/create-openapi-repo){:target="_blank"} to create a repository for your API spec.

<div style="text-align: center;">
  <img src="/img/2019-10-02-API-first-development-with-OpenAPI-or-Swagger/redocly.gif" width="70%" height="70%">
</div>


# Integrating with Postman
> You can create a working Postman collection from the OpenAPI spec

You don't have to tell me how difficult it is to keep a Postman collection up to date with an evolving API!
More so, you have to make sure that every member of your team has the latest version of your API collection.

Good news!
Postman can import a collection directly from the OAS.
In the Postman UI go to `import` and import from `raw text`.
Just like I did in the image below.

<div style="text-align: center;">
  <img src="/img/2019-10-02-API-first-development-with-OpenAPI-or-Swagger/postman-oas.png" width="100%" height="100%">
</div>

As you can see on the background of the image above, the request was correctly imported from the Swagger file.

# OpenAPI Generator: generate API compliant code
> Generate code that is compliant with your API spec with OpenAPI Generator

When you've agreed upon the specification of your API it is time to start implementing it!
The specification is shared across the different teams and they can each start implementing separately.

Time to code!  
If I write code, I might make mistakes.
So let's generate code that is completely compliant with the specs.

OpenAPI Generator is a hugely popular [repository](https://github.com/OpenAPITools/openapi-generator){:target="_blank"} on github.
It allows you to generate code that is completely in line with your API specification.

On `mac` you can just install the `openapi-generator-cli` by installing it via brew.

```bash
brew install openapi-generator-cli
```

You can also checkout the github project, build it and use that jar.

You have the cli installed and created a directory which contains your api.yml file.

<div style="text-align: center;">
  <img src="/img/2019-10-02-API-first-development-with-OpenAPI-or-Swagger/repo-dir.png" width="100%" height="100%">
</div>

Let's generate the code!

You could generate a whole project.

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
Models here refer to your DTO's (Data Transfer Objects) or Resources.
These are different from your domain models or entity models.

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
These classes are used to transfer data in and out of the application (`Dto` aka Data Transfer Object).

<div style="text-align: center;">
  <img src="/img/2019-10-02-API-first-development-with-OpenAPI-or-Swagger/generate-dtos-in-package-with-beanvalidation.png" width="100%" height="100%">
</div>



  
### Bean Validation
> Keep your generated class files in sync with the requirements of the API specs by setting the useBeanValidation option to true.

In the last example I also specified a property `useBeanValidation=true`.  
Requirements specified in the API documentation like a required field are now translated to the code.
The `getter` on the  `speaker` field in the `SessionDto` class is now annotated with `@NotNull`.  
You can now use a framework like `JSR 380`, known as `Bean Validation 2.0.`, to validate input and output.  
This is a `Java` specific example, but the same will happen when you change to other languages by using eg. `-g python`.

<div style="text-align: center;">
  <img src="/img/2019-10-02-API-first-development-with-OpenAPI-or-Swagger/SessionDto.png" width="80%" height="80%">
</div>

Now that we got acquainted with code generation I am going to show you how to include it in your build process.

# Integrating Swagger/OpenAPI with your build process: maven or gradle plugin
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

Important to note:

* The generated models will appear in the current module under `/src/java/be/ordina/conference/api/model`
That is caused by the combination of multiple options:
  * `<output>${project.basedir}</output>`
  * `<sourceFolder>src/java</sourceFolder>` 
  * `<modelPackage>be.ordina.conference.api.model</modelPackage>`
    
    
* Only the API models will be generated, with markdown documentation and no test classes.
That's a combination of:
  * `<generateModels>true</generateModels>`
  * `<generateModelTests>false</generateModelTests>`
  * `<generateModelDocumentation>true</generateModelDocumentation>`
  * `<generateApis>false</generateApis>`
  * `<generateSupportingFiles>false</generateSupportingFiles>`

Check out [this gist](https://gist.github.com/Nxtra/4c92fa9a6c2fb62a8c606128ae8ca87f){:target="_blank"} for the xml.

# Testing your API
Testing you API would normally involve setting up a larger integration test.
In the case of AWS Lambda this means that you'd have to deploy your application since you cannot run it locally (Not that easily at least).
Luckily we have set the `useBeanValidation` property to true.
This allows us to write unit tests that validate the incoming and outgoing requests of our function.

After you deserialize the incoming request you can validate it against your API specs:
```java
Set<ConstraintViolation<SessionDto>> violations = Validation.buildDefaultValidatorFactory().getValidator().validate(sessionDto);
```

If some violations are detected you can return them wrapped in a 400 response.
You could easily check this functionality by writing a unit test that:
* checks that no violations are found in the case of a valid request body
* checks that violations are found in case a payload is sent which is not compliant with the API specs.

The same goes for the responses. 
In your code validate the response against your API specifications by using the `responseDto` that was generated from the specs:
```java
Set<ConstraintViolation<CreateSessionResponseDto>> violations = Validation.buildDefaultValidatorFactory().getValidator().validate(response);
```
If this finds any violations throw a `ConstraintValidationException`.

Again a unit test can validate that:
* no violations are found when the response is validated
* no exception is thrown


# Serverless on AWS: OpenAPI, API Gateway Lambda and SAM
It's fairly easy to create an API Gateway from an openAPI specification.
In the API Gateway console under *Create* select *Import from Swagger or Open API 3* and upload your specification.

<div style="text-align: center;">
  <img src="/img/2019-10-02-API-first-development-with-OpenAPI-or-Swagger/create-apigateway.gif" width="100%" height="100%">
</div>

Of course we want to use the specification programmatically.
Suppose we create our backend service with AWS Lambda (serverless).
I'll be using AWS native tools and use SAM to deploy the Lambda functions and my API.
SAM allows you to use an OpenAPI specification to create your API Gateway.

In your SAM template define the API Gateway resource by referencing your OAS.

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

In the Lambda function resource specify that the lambda should be triggered from this API Gateway.

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
            Path: /sessions
            Method: GET
```

Add the `x-amazon-apigateway-integration` extension in your `api.yml` to specify how the api has to integrate with the backend Lambda service.

```yaml
paths:
  "/sessions":
    get:
      ...
      x-amazon-apigateway-integration:
        type: "aws_proxy"
        httpMethod: "POST"
        uri:
          Fn::Sub: arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${GetAllSessionsFunction.Arn}/invocations
```

For a full template example including the Lambda resources, check out this [gist](https://gist.github.com/Nxtra/3600ccab85d92faebf3c465701ba7c21){:target="_blank"}.

# Code First with Springfox
I promised you an example of a code first approach.
Here I set up a Spring boot application with Springfox dependencies.

```xml
<dependencies>
    <dependency>
        <groupId>io.springfox</groupId>
        <artifactId>springfox-swagger2</artifactId>
        <version>${springfox.version}</version>
    </dependency>

    <dependency>
        <groupId>io.springfox</groupId>
        <artifactId>springfox-swagger-ui</artifactId>
        <version>${springfox.version}</version>
    </dependency>

    <dependency>
        <groupId>io.springfox</groupId>
        <artifactId>springfox-bean-validators</artifactId>
        <version>${springfox.version}</version>
    </dependency>
</dependencies>
```

Implementing the API and using the right annotations leads to an endpoint of your application on which your API spec is visualised: `/swagger-ui.html`
There is also an endpoint to download the Swagger / OpenAPI specification:  `api-docs`
<div style="text-align: center;">
  <img src="/img/2019-10-02-API-first-development-with-OpenAPI-or-Swagger/springfox.png" width="100%" height="100%">
</div>

# Conclusion
Here are some takeaways about API first development:
* Design the API before implementing it
* Visualize your API so that dependent teams can easily consult it
* API first development implies a top-down approach
* Swagger/OpenAPI can help you with API first development

Below the pros and cons of practising API first development using Swagger/OpenAPI.

**Pros** 
 * Strong tooling support — AWS, Postman, visualizing the API, generate skeleton classes, ... 
 * Strong consistency between API spec and Web layer of the code
 * Example support 
 * Documenting API descriptions separated from code (not really separated, because they’re added to the generated classes, but you won’t need to change them 
 * Functional analyst can assist with creating the API specs because it's a human readable format

**Cons** 
 * No support for complex/variable request/response scenarios
 * Little extra documentation can be added in the API specs
 * Development can only start after API is designed


# Resources
* [https://scratchpad.blog/serverless/howto/configure-aws-api-gateway-with-swagger/](https://scratchpad.blog/serverless/howto/configure-aws-api-gateway-with-swagger/)
* [https://github.com/jthomerson/cloudformation-template-for-lambda-backed-api-gateway-with-dynamodb](https://github.com/jthomerson/cloudformation-template-for-lambda-backed-api-gateway-with-dynamodb)
* [https://medium.com/capital-one-tech/how-to-make-swagger-codegen-work-for-your-team-32194f7d97e4](https://medium.com/capital-one-tech/how-to-make-swagger-codegen-work-for-your-team-32194f7d97e4)
* [https://github.com/OpenAPITools/openapi-generator](https://github.com/OpenAPITools/openapi-generator)
* [https://howtodoinjava.com/swagger2/code-generation-for-rest-api/](https://howtodoinjava.com/swagger2/code-generation-for-rest-api/)
* [https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#globals-section](https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#globals-section)
* [https://www.47northlabs.com/knowledge-base/generate-spring-boot-rest-api-using-swagger-openapi/](https://www.47northlabs.com/knowledge-base/generate-spring-boot-rest-api-using-swagger-openapi/)
* [https://swagger.io/blog/api-design/design-first-or-code-first-api-development/](https://swagger.io/blog/api-design/design-first-or-code-first-api-development/)

