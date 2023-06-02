---
layout: post
authors: [otte_fieremans, fe_dekeyser] 
title: 'Vuzix And How To Use It'
image:
tags: [Java, Terraform, PostgreSQL, Android, Docker, Postman, AWS, Vuzix Blade, JUnit, DynamoDB, Git, Spring, RestAPI, IAM, ECR, App Runner, RDS, Gradle, Maven, Swagger]
category: Internship
comments: true
---



# TABLE OF CONTENTS

* [Introduction](#introduction)
* [What needed to be done](#what-needed-to-be-done)
* [About those glasses](#about-those-glasses)
* [Android App](#android-app)
  * [Enhancing user experience](#enhancing-the-user-experience)
  * [Hands-free experience](#hands-free-experience)
  * [User inputs](#user-inputs)
  * [Optimization and testing](#optimization-and-testing)
* [Spring Boot API](#spring-boot-api) 
  * [REST](#rest)
  * [Postgres database](#postgres-database)
  * [API integration](#api-integration)
* [Infrastructure as code](#infrastructure-as-code)
  * [Setting up the S3 backend, the tip of the iceberg](#setting-up-the-s3-backend-the-tip-of-the-iceberg)
  * [Setting up the repository](#setting-up-the-repository)
  * [Pushing to the repository](#pushing-to-the-repository)
    * [The trigger](#the-trigger)
    * [Jobs](#jobs)
    * [CI](#ci)
    * [CD](#cd)
  * [Now for the database](#now-for-the-database)
  * [Let's finally run the API](#lets-finally-run-the-api)
  * [Terraform workflow](#terraform-workflow)
  * [Visual Representation](#visual-representation)
* [Summary](#summary)

# INTRODUCTION

In today's world, there are numerous navigation options available, with every mobile phone equipped with GPS functionality.
However, what if there was an even easier way? Our project offers a solution where you can embark on a seamless walk, bike ride, or any other journey without the need to constantly retrieve your phone from your pocket.
By following our app, you can effortlessly navigate your chosen route while remaining informed of crucial information such as direction, speed, distance and potentially more.
The beauty lies in our app's ability to project all this data onto your eyewear, enhancing your overall experience.

Simply upload your routes using GPX files, select the desired route, and you're ready to begin your adventure!

# WHAT NEEDED TO BE DONE

The project we were about to embark on described building an Android application which runs on the Vuzix Blade AR-glasses and communicates with an API that runs in a Cloud environment.

- Build the Android application for the Blade
- Set up an API with Spring Boot to read and write data to a database
- Connecting the Android application and API locally
- Expand the Android application with extra features
- Expand the API with Terraform configurations
- Setting up AWS Cloud infrastructure for API with Terraform
- Setting up a CI/CD pipeline to build to image to the Cloud
- Expand the pipeline to setup Cloud infrastructure
- Go for a walk

# ABOUT THOSE GLASSES

In today's market, there is a considerable variety of "smart glasses" available.
However, when compared to other smart eyewear options, the Vuzix Blade stands out due to its subtle design, making it particularly well-suited for outdoor use.
Consequently, our app is specifically tailored to function seamlessly with this particular eyewear.
The only drawback worth mentioning is its limited battery life, which lasts for approximately one hour.
As a result, extended excursions would require the use of a power bank to ensure uninterrupted functionality.

If you desire to use these glasses for yourself here are some introductory steps to get you started on utilizing the full potential of the Vuzix Blade.

[User Manual](https://files.vuzix.com/Content/pdfs/Vuzix-Blade-User-Manual.pdf)

# ANDROID APP

The Vuzix Blade uses the Android 5 OS, so we developed our app using Android, utilizing the Java programming language.
While both of us were new to Android development, we already had experience working with mobile applications and Java, which allowed us to quickly grasp the necessary concepts and tools.
There were some difficulties since we were limited to features from Android API 22 but we still managed to bring the application to a desirable outcome.

### Enhancing the user experience

Throughout the development process, we explored various features and functionalities that could enhance the user experience.
For instance, we implemented real-time GPS tracking to accurately monitor the user's location and provide precise navigational instructions.
This way we could also show a user what speed they were traveling.
We use the magnetic field sensor in the glasses to determine the user's direction and make sure they are always being directed in the right direction.


<img class="p-image" src="{{ '/img/2023-06-01-vuzix-and-how-to-use-it/Vuzix-App-main.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 30%;">
<img class="p-image" src="{{ '/img/2023-06-01-vuzix-and-how-to-use-it/Vuzix-App-routes.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 30%;">
<img class="p-image" src="{{ '/img/2023-06-01-vuzix-and-how-to-use-it/Vuzix-app-stats.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 30%;">

### Hands-free experience

By utilising the Vuzix Blade's display, we successfully projected relevant data, such as distance, speed and direction directly onto the user's field of view, ensuring an intuitive and hands-free experience.
With a simplistic interface the user can easily select the route he wants to traverse and since it is displayed on smart glasses the black background makes it transparent, so the user has optimal visibility while traversing his path.
Furthermore, after having selected a route, the user will see information about the previous times he travelled the route as you can see on the image on the right.

### User inputs

A user also has multiple inputs he can use to enhance the user experience.
They can go forward or back a point since most GPX-files' coordinates are rounded which can make the points that are marked sometimes appear inside of buildings.
Even when they are user generated routes, and the user never came in a 10-meter radius of the building.
To further help with this but also for people wo don’t want to begin at the start of their route or people who just got lost.
There is a rebase function that just puts you on the point closest to where you are regardless of where in your route you were.
The user can also at any point reload his statistics for the route he is traveling or start a new route.

### Optimization and testing

* To ensure optimal performance, we employed efficient coding practices and utilized compatible libraries and frameworks for the Android platform.
* Rigorous testing was conducted to identify and address any potential issues or bugs, enhancing the overall app experience.

By incorporating these enhancements, we have created an Android app that provides users with a seamless and intuitive navigation experience on the Vuzix Blade, leveraging real-time GPS tracking, user-friendly inputs, and optimized performance.

# SPRING BOOT API

Our application leverages the power of a Spring Boot API integrated with a Postgres database.
This robust combination enables us to effortlessly retrieve routes from the cloud, providing users with easy access to their desired routes anytime, anywhere.

### REST

By utilizing Spring Boot as a middleware, our API serves as a bridge between our application and the Postgres database.
Spring Boot's extensive set of modules and libraries provide a cohesive framework for building RESTful services, ensuring smooth and reliable communication between the application and the database.

### Postgres Database

The Postgres database acts as a centralized repository, storing and managing all the route data and statistics.
With this centralized approach, we ensure data integrity and efficient querying capabilities, allowing users to access and analyze their route information effectively.
We save our GPX files as a String in a SQL Database with a Unique name, So the user won’t confuse their files and the API can query by name.
Route statistics are saved in the database, establishing a many-to-one relation with the GPX model.
These statistics capture essential information such as start and end times, enabling our application to calculate the duration of routes and average speeds accurately.

<img class="p-image" src="{{ '/img/2023-06-01-vuzix-and-how-to-use-it/Swagger.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 100%;">

*The GPX object*
```json
{
  "id": 0,
  "name": "string",
  "gpx": "string"
}
```
*The RouteStatistic object*
```json
{
  "id": 0,
  "startDate": "string",
  "endDate": "string",
  "gpx": {}
}
```

### API integration

Experience hassle-free route management with our integrated API and Postgres database solution.
Seamlessly retrieve and manage routes with ease, enhancing your navigation experience.
Our user-friendly approach prioritizes data integrity, delivering a streamlined and intuitive route management solution.

# INFRASTRUCTURE AS CODE

As the API took shape it was time to start thinking about how our infrastructure in the cloud would look like.
To manage and provision our infrastructure we used a little nifty tool called Terraform.

Terraform is an open-source infrastructure as code (IaC) tool developed by HashiCorp.
It enables the automation of provisioning and managing infrastructure resources across various cloud providers and on-premises environments.
With Terraform, you define your desired infrastructure configuration using a declarative language called HashiCorp Configuration Language (HCL).
These configurations, known as Terraform code, describe the desired state of your infrastructure, specifying the resources, dependencies, and configurations needed.
By executing Terraform commands, it compares the current state of the infrastructure with the desired state and determines the necessary actions to bring the infrastructure into the desired state.
Terraform's ability to manage infrastructure as code allows for version control, collaboration, and reproducibility, making it an efficient and scalable solution for infrastructure management.

### Setting up the S3 backend, the tip of the iceberg

To begin our quest for provisioned infrastructure we needed a place to store the state of our configuration.
In Terraform x AWS an S3 bucket is used for exactly this.
Another necessary resource to setting up the S3 backend is a DynamoDB table.
This single table stores the lock of the state so that it cannot be accessed by multiple persons at a time, which could otherwise lead to configuration drift.
```HCL
backend "s3" {
    bucket = "vuzix-blade-intership-tfstate"
    key    = "terraform/terraform.tfstate"
    region = "eu-west-1"
    profile = "vuzix-blade-internship"
    dynamodb_table = "vuzix-blade-internship-state-lock"
}
```
`backend "s3" {}` provides the bucket to store the state, this block resides inside the main `terraform {}` block inside the `main.tf` file.
U can also see the `dynamodb_table` parameter which references to the table for the state lock.

### Setting up the repository

To start deploying our API to the cloud we’re going to need a place to store our built images, which the runner is going to use to launch the API.
Remember that we don’t even have a database and runner in the cloud yet.
The repository also has a lifecycle policy, this implies that the repository should only keep the 5 latest images, to keep it from overcrowding.
```HCL
resource "aws_ecr_repository" "vuzix-blade-internship-container-repository" {
    name = "vuzix-blade-internship-container-repository"
    image_scanning_configuration {
        scan_on_push = true
    }
    tags = var.resource_tags
}
```

### Pushing to the repository
To push an image to the repository we could manually push it with a couple docker commands, but it seemed more efficient to use GitHub Actions for this.
We can make a workflow file in our project which is going to run whenever we merge into main from a pull-request.
For now, we’ll take a break from Terraform to focus on the workflow which is written in YAML.

#### The trigger

This is the first and probably most important part of the workflow: defining a trigger.
In our application the trigger is pulling into the main branch.
```YAML
name: build/push workflow vuzix-blade-internship

on:
    push:
        branches:
            - main
```
#### Jobs

When the trigger is set, we’re ready to start defining jobs.
In our case we have 2 jobs, the deploy has been split into CI and CD respectively.

#### CI
Inside this CI job we are going to run our integration tests of the API to make sure that all the logic works to our liking before we build and push the image to the repository.

```YAML
  ci:
    name: CI
    runs-on: [self-hosted, Linux]
    steps:
      - uses: actions/checkout@v2

      - name: Set up Java
        uses: actions/setup-java@v2
        with:
          distribution: "zulu"
          java-version: "17"

      - name: "Run tests"
        run: |
          chmod +x mvnw
          ./mvnw test
```
#### CD
Only when the CI job is ran successfully will the CD job be able to start.
Inside the CD job we need to set up a couple preparations before we can build and push to the repository.
We need permission to push to AWS, to get this permission we made a custom IAM role (this role was manually created) that we can assume in the runner.

```YAML
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v2
  with:
    role-to-assume: ${{ env.AWS_ROLE }}
    aws-region: eu-west-1

- name: Login To Amazon ECR
  id: login-ecr
  uses: aws-actions/amazon-ecr-login@v1
```
`role-to-assume` lets us specify a role to assume with its ARN, this role must have the necessary permissions to perform all the actions inside the workflow.
If the login attempt is successfull the role logs into the ECR.

```YAML
- name: Build Docker image
  env:
    ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
  run: |
    chmod +x mvnw
    ./mvnw spring-boot:build-image -Dspring-boot.build-image.imageName=$ECR_REGISTRY/$ECR_REPO_NAME:latest -DskipTests

- name: Push docker image
  env:
    ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
  run: |
    docker push $ECR_REGISTRY/$ECR_REPO_NAME:latest
```
We make use of the built-in Spring Boot plugin named Paketo, the `spring-boot:build-image` command above names the image as per the naming convention for pushing to an AWS repository.
The `docker push` command automatically recognizes that it needs to push to the specified repository, hens the naming convention.

If done correctly we can see that the repository in AWS recieves and stores our image.

<img class="p-image" src="{{ '/img/2023-06-01-vuzix-and-how-to-use-it/ECR-screenshot.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 100%;">

### Now for the database

The database consists of an RDS resource in AWS which is running a Postgres 15 engine.
Before we can begin setting up our RDS instance we have to decide how we’re going to handle the network situation.
We want to put our RDS in a VPC (Virtual Private Cloud)to keep it secure inside our public Cloud, we can specify this using an `aws_db_subnet_group`.
We also need a couple other resources to optimally setup the RDS like an `aws_db_parameter_group` and an `aws_security_group`.

In the `aws_db_subnet_group` we just need to define our subnets and AWS will automatically recognize the correct VPC.

The `aws_db_parameter_group` is a default parameter group for RDS with the corresponding engine (Postgres 15).

Our `aws_security_group` that is specifically for our RDS will open the necessary ports in the VPC for inbound and outbound traffic from and to our App Runner (more on the App Runner later).

```HCL
resource "aws_db_instance" "dev-vuzix-blade-internship-db" {
    allocated_storage = 10
    instance_class = "db.t3.micro"
    db_name = "blade"
    identifier = "dev-vuzix-blade-internship-db"
    engine = "postgres"
    engine_version = "15.2"
    username = var.db_username
    password = var.db_password
    
    parameter_group_name = "dev-vuzix-blade-internship-db"
    vpc_security_group_ids = [aws_security_group.vuzix-blade-internship-security-group.id]
    db_subnet_group_name = aws_db_subnet_group.vuzix-blade-internship-db-subnet-group.name

    skip_final_snapshot = true
    tags = var.resource_tags
    depends_on = [aws_db_parameter_group.dev-vuzix-blade-internship-db, aws_db_subnet_group.vuzix-blade-internship-db-subnet-group]
}
```
U can see in our `aws_db_instance` where we have defined the security group, vpc and parameter group in the parameters `vpc_security_group_ids`, `db_subnet_group_name` and `parameter_group_name`.

### Let's finally run the API

Now for the fun part: finally running our API in the cloud.
To achieve this, we’re using the App Runner resource.
There are a couple of things you need to take care of before trying to run your app in an App Runner.
Firstly, it needs to sit in the same VPC as the RDS so that they can connect to each other.
Secondly, there needs to be a custom role for the runner that has permissions to retrieve the image from the ECR.
And lastly, the runner also needs a security group to connect to the RDS.

In our `aws_security_group` that is specifically for our App Runner we specify the ports in the VPC for inbound and outbound traffic from and to the RDS.
The endpoint of our App Runner however is public, because of this the endpoint of the App Runner needs to be handled like a secret.

Similar to the `aws_db_subnet_group`, the `aws_apprunner_vpc_connector` which puts the App Runner in the desired VPC takes an Array of subnets as a parameter and automatically recognizes the VPC.

In the `aws_apprunner_service` you have to specify a role that has access to the image repository for pulling the image into the App Runner.
The role needs the permissions to be assumed by the App Runner and to perform actions on our image repository.
The specifying of a role is mandatory if the App Runner needs to access a private image repository.

```HCL
resource "aws_apprunner_service" "vuzix-blade-internship-apprunner-service" {
    service_name = "vuzix-blade-internship-apprunner-service"
    tags = var.resource_tags
    network_configuration {
        egress_configuration {
            egress_type = "VPC"
            vpc_connector_arn = aws_apprunner_vpc_connector.vuzix-blade-internship-vpc-connector.arn
        }
    }
    source_configuration {
        authentication_configuration {
            access_role_arn = aws_iam_role.vuzix-blade-internship-apprunner-service-role.arn
        }
        image_repository {
            image_identifier      = "930970667460.dkr.ecr.eu-west-1.amazonaws.com/vuzix-blade-internship-container-repository:latest"
            image_repository_type = "ECR"
            image_configuration {
                port = 8080
                runtime_environment_variables = {
                    ENV = "prod"
                    DATABASE_ENDPOINT=aws_db_instance.dev-vuzix-blade-internship-db.endpoint
                    DATABASE_NAME=aws_db_instance.dev-vuzix-blade-internship-db.db_name
                    POSTGRES_USER=var.db_username
                    POSTGRES_PASSWORD=aws_secretsmanager_secret_version.vuziz-blade-internship-db-pwd-v1.secret_string
                }
            }
        }
    }
    depends_on = [aws_iam_role.vuzix-blade-internship-apprunner-service-role]
}
```
In the `aws_apprunner_service` above you can see the `network_configuration {}` block where the`aws_apprunner_vpc_connector` is specified and the `source_configuration {}` block where we specify the role for access to the ECR, what the image identifier is and how we want to configure the application.

### Terraform workflow

After the App Runner was set up we wanted a way to automatically apply and destroy our Terraform configuration.
Because we do not want to lose any previously built images or data inside the database, the only resource being automatically destroyed and set up again is the App Runner.

```YAML
name: Terraform Apply On Schedule

on:
  schedule:
    - cron: '0 6 * * 1-5'
```
The trigger for our Terraform Apply workflow.
This workflow runs every day from Monday till Friday at 6am (UTC), the Terraform Destroy workflow runs at 4pm (UTC).

```YAML
- name: Terraform Init
  run: |
    terraform init -input=false
    
- name: Terraform Apply
  env:
    DB_USERNAME: ${{ secrets.POSTGRES_USER }}
    DB_PASSWORD: ${{ secrets.POSTGRES_PASSWORD }}
  run: |
    terraform apply -var="db_username=$DB_USERNAME" -var="db_password=$DB_PASSWORD" --auto-approve
```
We initialize our Terraform and apply the configuration, the `terraform destroy` is very similar except for the fact that in the destroy we use the `-target` tag to target our App Runner resource.

### VISUAL REPRESENTATION

Displayed below you will find two images, one representing the project as a whole and how it intertwines with our cloud infrastructure.
The second picture represents the entire Terraform state and the dependencies of each resource.

*Project Visual*


<img class="p-image" src="{{ '/img/2023-06-01-vuzix-and-how-to-use-it/infrastructure-graphical.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 75%;">

*Terraform Graphical*

<img class="p-image" src="{{ '/img/2023-06-01-vuzix-and-how-to-use-it/Terraform-graphical.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 100%;">

# SUMMARY







