---
layout: post
authors: [jasper_rosiers]
title: "Typescript in the backend with NestJS and Azure Functions: a deep dive"
image: /img/2020-11-15-Typescript-in-the-backend-with-NestJS-and-Azure-Functions/banner.png
tags: [Typescript, Backend, NestJS, Azure, Serverless]
category: Backend
comments: true
---
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.9.0/css/lightbox.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-grid-only@1.0.0/bootstrap.css" />

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.9.0/js/lightbox.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap-grid-only@1.0.0/index.min.js"></script>

## Table of Contents

1. [Introduction](#introduction)
2. [Setup](#setup)
3. [ParametersModule](#parameters-module)
4. [Authorization Guards](#authorization-guards)
5. [Azure Function and CosmosDB](#azure-function-and-cosmosdb)
6. [Conclusion](#conclusion)
7. [Resources](#resources)

## Introduction

When I asked a colleague to validate my code structure for this blog, he asked me "Why would one use Typescript in the backend at all?". 
He's a Java programmer and didn't know Typescript's properties very well. 
An introduction: Typescript is an asynchronous, functional programming language which compiles down to plain Javascript. 
It supports interfaces, classes and access modifiers like private, protected and public.

When first using Typescript, it felt less easy than using with Spring Boot, which I had used prior during Java programming.
This is where NestJS comes in, a NodeJS framework built for the backend with Object Oriented Programming in mind.
If you have worked with a framework like Spring before, NestJS will be quite easy for you to understand.
It requires a modular way of working, which makes sure the application stays well organised. 

In this blog, we take a dive into using NestJS in a serverless application hosted in an Azure Function and connect it with a CosmosDB.
Of course, NestJS can be integrated with other serverless services like [AWS Lambda](https://blog.theodo.com/2019/06/deploy-a-nestjs-app-in-5-minutes-with-serverless-framework/){:target="_blank" rel="noopener noreferrer"} and [Cognito](https://jacob-do.medium.com/token-validation-with-aws-cognito-and-nestjs-6f9e4088393c){:target="_blank" rel="noopener noreferrer"}.

## Setup

I made a little application which can save and return three parameters of your body: weight, fat percentage and muscle percentage.
The app is automatically deployed to an Azure function using Azure Pipelines and saves those parameters to a CosmosDB.
I made the code available on [GitHub](https://github.com/jasperrosiers/body-parameter-tracker){:target="_blank" rel="noopener noreferrer"} for you to learn from, as we won't touch on everything in the repository in this blog post.

The user can send new data to the application, which will keep the history of the three parameters in a CosmosDB.
Apart from the main `AppModule`, I only added two modules, the `ParametersModule` and the `LoggerModule` to the application.
This blog post won't explain building the `LoggerModule`, as it only serves to create a custom logger.
The [NestJS documentation](https://docs.nestjs.com/techniques/logger){:target="_blank" rel="noopener noreferrer"} provides a very clear explanation of how to use a custom logger.

The application has two (basic) guards set up for the HTTP calls, one for authorization and one for role-based access. 
For this guard, we use a simple bearer token, however, integration with eg. Cognito or JWT tokens is available.

## ParametersModule

A Module in NestJS provides a clear way of organizing the project and enabling clear dependency injection.
There are four important things you can mark within a module: 
- `controllers`: classes which capture incoming HTTP calls
- `providers`: classes marked with NestJS's `@Injectable()`, made available for dependency injection
- `imports`: modules that need to be imported, again for dependency injection
- `exports`: subset of the providers that need to be exported for use in other modules

The `ParametersModule` imports three other modules: the previously explained `LoggerModule`, the `ConfigModule` and the `AzureCosmosDBModule`.
The `ConfigModule` is used to be able to access environment variables from a .env file. 
Note that this is also possible with a package such as `dotenv`, however this isn't very ideal as we would have to access `process.env` directly every time.

```js
@Module({
  controllers: [ParametersController],
  providers: [
      ParametersService, 
      ParametersRepository,
      {
        provide: APP_GUARD,
        useClass: RolesGuard,
      },
  ],
  imports: [
      LoggerModule,
      ConfigModule,
      AzureCosmosDbModule.forFeature([{dto: ParametersEntity}])
  ]
})
export class ParametersModule {}
```

The first step when receiving an HTTP request to the application is the `ParametersController` as shown below.
This controller will catch all requests on the 'parameters' endpoint.
Using annotations, you can:
- make a check for the type of incoming request and divide the traffic accordingly. This is similar to the way annotations work in the spring framework (eg. `@PostMapping()`).
- customise which Http code you want to return on successful calls, as I did with the `createParameters` method.
- use the `@Res()` from `express` to send a completely customised response, however I did not use that here.
- Execute Guards before being able to activate the method

Let's focus on the `Post()` method. 
It first asks the `parametersService` to check if there is an object with the given `userName` present in the database.
We could ask the `parametersRepository` for this information directly, however, having this layer of abstraction is essential for having cleaner code.
If there is no object present yet, it will create a new one, otherwise, it will update the existing one. 
For this update, it will map the new info to the existing object. 
Again, we use the `parametersService` for it's abstraction layer, the controller should only be used for methods capturing HTTP calls.

```js
@Controller('parameters')
export class ParametersController {
    constructor(private readonly parametersService: ParametersService, private readonly loggerSerivce: LoggerService) {
        this.loggerSerivce.setContext('ParametersController');
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard)
    async createParameters(@Body() parametersDto: ParametersDto): Promise<void> {
        if(parametersDto && parametersDto.userName && (parametersDto.bodyWeight || parametersDto.fatPercentage || parametersDto.musclePercentage)) {
            const existingParams: ParametersEntity = await this.parametersService.getParametersEntityByUserName(parametersDto.userName);
    
            if (existingParams) {
                const updatedParams: ParametersEntity = this.parametersService.mapDtoToEntity(parametersDto, existingParams);
                this.parametersService.update(updatedParams);
            } else {
                this.parametersService.create(parametersDto)
            }
        } else {
            // could implement @Res() from express to send a proper response to say it should at least contain one of the parameters or a userName
            return;
        }
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    @Roles('user')
    async findOne(@Param('userName') userName: string): Promise<ParametersEntity> {
        return this.parametersService.getParametersEntityByUserName(userName);
    }

    @Get()
    @UseGuards(AuthGuard)
    @Roles('admin')
    async findAll(): Promise<ParametersEntity[]> {
        return this.parametersService.getAll();
    }
}
```

Moving on to the `ParametersService`, we'll only take a glance at the `create()` function.
When receiving an HTTP call, it will contain values for at least one of our three parameters.
In this method, we just check the values and add them to the respective array. 
The `update` field contains the moment that the value gets updated to track the user's progress over time.
The parameters will then be put into a `ParametersEntity` (Discussed in [Azure Function and CosmosDB](#azure-function-and-cosmosdb)) and created in the repository.

```js
@Injectable()
export class ParametersService {
    constructor(private readonly parametersRepository: ParametersRepository) {
    }

    async create(parametersDto: ParametersDto): Promise<ParametersEntity> {
        let bodyweight: BodyweightDto;
        let fatPercentage: PercentageDto;
        let musclePercentage: PercentageDto;

        if (parametersDto.bodyWeight) {
            bodyweight = {
                weight: Array.from([parametersDto.bodyWeight]),
                update: [new Date()]
            }
        }
        if (parametersDto.fatPercentage) {
            fatPercentage = {
                percentage: Array.from([parametersDto.fatPercentage]),
                update: [new Date()]
            }
        }
        if (parametersDto.musclePercentage) {
            musclePercentage = {
                percentage: Array.from([parametersDto.musclePercentage]),
                update: [new Date()]
            }
        }

        return this.parametersRepository.create(new ParametersEntity(parametersDto.userName, bodyweight, fatPercentage, musclePercentage));
    }

    // More code
}
```

## Authorization Guards

## Azure Function and CosmosDB

## Conclusion

## Resources

- [JOIN 2020 website](https://ordina-jworks.github.io/join/){:target="_blank" rel="noopener noreferrer"}
- [Tech Track playlist](https://www.youtube.com/playlist?list=PLgWyY-g33NlWg7rStHmTYPiN_0yJd4PxQ){:target="_blank" rel="noopener noreferrer"}
- [Agile & Business playlist](https://www.youtube.com/playlist?list=PLgWyY-g33NlUR9F2PJ1h3bkd0cxSr4xab){:target="_blank" rel="noopener noreferrer"}
- [Ordina Belgium](https://www.ordina.be/){:target="_blank" rel="noopener noreferrer"}
- [Practical Agile](https://www.practical-agile.com/){:target="_blank" rel="noopener noreferrer"}
- [Amazon Web Services](https://aws.amazon.com/local/benelux/){:target="_blank" rel="noopener noreferrer"}
- [Smals Research](https://www.smalsresearch.be/){:target="_blank" rel="noopener noreferrer"}
- [Agile & Learning Beyond Borders](https://www.francislaleman.com/){:target="_blank" rel="noopener noreferrer"}
