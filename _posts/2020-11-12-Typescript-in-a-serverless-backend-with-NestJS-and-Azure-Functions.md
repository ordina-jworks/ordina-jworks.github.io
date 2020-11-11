---
layout: post
authors: [jasper_rosiers]
title: "TypeScript in a serverless backend with NestJS and Azure Functions"
image: /img/2020-11-12-Typescript-in-the-backend-with-NestJS-and-Azure-Functions/banner.png
tags: [TypeScript, Backend, NestJS, Azure, Serverless]
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
3. [ParametersModule](#parametersmodule)
4. [Authorization Guards](#authorization-guards)
5. [Azure Function and CosmosDB](#azure-function-and-cosmosdb)
6. [Conclusion](#conclusion)
7. [Resources](#resources)

## Introduction

When I asked a colleague to validate my code structure for this blog, he asked me "Why would one use TypeScript in the backend at all?". 
He's a Java programmer and didn't know TypeScript's properties very well. 
An introduction: TypeScript is an asynchronous, functional programming language which compiles down to plain JavaScript. 
It supports interfaces, classes and access modifiers like private, protected and public.

When first using TypeScript, it felt less easy than using Spring Boot, which I had used prior during Java programming.
This is where NestJS comes in, a NodeJS framework built for the backend with Object Oriented Programming in mind.
If you have worked with a framework like Spring before, NestJS will be quite easy for you to understand.
It requires a modular way of working, which makes sure the application stays well organised. 

In this blog, we take a dive into using NestJS in a serverless application hosted in an Azure Function and connect it with a CosmosDB.
Of course, NestJS can be integrated with other serverless services like [AWS Lambda](https://blog.theodo.com/2019/06/deploy-a-nestjs-app-in-5-minutes-with-serverless-framework/){:target="_blank" rel="noopener noreferrer"} and [Cognito](https://jacob-do.medium.com/token-validation-with-aws-cognito-and-nestjs-6f9e4088393c){:target="_blank" rel="noopener noreferrer"}.
However, I found the process of converting this application to a serverless function to be a very smooth solution requiring only one(!) command.

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
The `ConfigModule` is used to be able to access environment variables from a `.env` file or from the configuration of the Azure Function. 
Note that this is also possible with a package such as `dotenv`, however this isn't very ideal as we would have to access `process.env` directly every time.
Of course, pushing those environment files to Git is bad practice. 
You can find a `.env-sample` file in the repository, which is used to show which variables need to be filled in the `.env` file.

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
- Make a check for the type of incoming request and divide the traffic accordingly. This is similar to the way annotations work in the Spring Framework (eg. `@PostMapping`).
- Customise which HTTP code you want to return on successful calls, as I did with the `createParameters` method.
- Use the `@Res()` from `express` to send a completely customised response, however I did not use that here.
- Execute Guards before being able to activate the method

Let's focus on the `Post()` method. 
It first asks the `parametersService` to check if there is an object with the given `userName` present in the database.
We could ask the `parametersRepository` for this information directly, however, having this layer of abstraction is essential for having cleaner code.
If there is no object present yet, it will create a new one, otherwise, it will update the existing one. 
For this update, it will map the new info to the existing object. 
Again, we use the `parametersService` for its abstraction layer, the controller should only be used for methods capturing HTTP calls.

```js
@Controller('parameters')
export class ParametersController {
    constructor(private readonly parametersService: ParametersService, private readonly loggerSerivce: LoggerService) {
        this.loggerService.setContext('ParametersController');
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard)
    async createParameters(@Body() parametersDto: ParametersDto): Promise<ParametersEntity> {
        if(!parametersDto || parametersDto.userName || (!parametersDto.bodyWeight && !parametersDto.fatPercentage && !parametersDto.musclePercentage)) {
            // could implement @Res() from express to send a proper response to say it should at least contain one of the parameters or a userName
            return;
        }

        const existingParams: ParametersEntity = await this.parametersService.getParametersEntityByUserName(parametersDto.userName);

        if (existingParams) {
            const updatedParams: ParametersEntity = this.parametersService.mapDtoToEntity(parametersDto, existingParams);
            return this.parametersService.update(updatedParams);
        } else {
            return this.parametersService.create(parametersDto)
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
The parameters will then be put into a `ParametersEntity` (Discussed in [Azure Function and CosmosDB](#azure-function-and-cosmosdb)) and added to the database using the `parametersRepository`.

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

The `create()` function in the `ParametersRepository` adds the date the object was created and adds it to the database.
We see a good example of the `loggerService` here too.
First, we set the context to 'ParametersRepository', so that, when it logs something, it will show that the log came from this class.
This way, logs can easily be retraced to its origin.

```js
@Injectable()
export class ParametersRepository {

    constructor(@InjectModel(ParametersEntity) private readonly container: Container, private loggerService: LoggerService) {
        this.loggerService.setContext('ParametersRepository');
    }

    async create(item: ParametersEntity): Promise<ParametersEntity> {
        item.createdAt = new Date();
        const response = await this.container.items.create(item);
        this.loggerService.verbose(`Create RUs: ${response.requestCharge}`);
        return response.resource;
    }
```

## Authorization Guards

The project uses two guards, an `AuthGuard` for the authorization, and a `RolesGuard` to check which roles can access certain resources.
A good explanation of both can be found in the [NestJS documentation](https://docs.nestjs.com/guards){:target="_blank" rel="noopener noreferrer"}.
The `RolesGuard` is almost an exact copy from the documentation, so let's take a look at the `AuthGuard` which doesn't need to be provided from a module.

The `canActivate()` method is called before executing the method in the controller.
It needs to return `true`, or the method won't execute and the application will return a 401 Unauthorized code.
In this case, we check if the authorization header has the correct value as configured in the environment variables.
Other setups, like OAuth, Cognito or JWT tokens are also possible.

```js
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly configService: ConfigService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        if (!req.headers.authorization) {
            return false;
        }
        if (req.headers.authorization.split(' ')[0] !== 'Bearer') {
            throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
        }
        const token = req.headers.authorization.split(' ')[1];

        return token === this.configService.get<string>('BEARER_TOKEN');
    }
}
```

## Azure Function and CosmosDB

To convert this app into an Azure Function and make it serverless, we only need a single command:

`nest add @nestjs/azure-func-http`

This will add some files and folders, including a `main.azure.ts` through which your app can be started.
It will set a global prefix 'api' to all your controllers, the standard for Azure Functions.

```js
export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, new AzureHttpRouter());
  app.setGlobalPrefix('api');

  await app.init();
  return app;
}
```

Now, you can choose to either run your app as a normal Web App or a serverless Azure Function.
The only thing left to do is [create an Azure Function](https://portal.azure.com/#create/Microsoft.FunctionApp){:target="_blank" rel="noopener noreferrer"} in the Portal and set up a pipeline, which is also an automatic process (on Azure DevOps).
This will generate an `azure-pipelines.yml` file containing all necessary information and connect it with the function automatically.
On every push to the master branch (pull request), it will automatically start a build and deploy process.
For the environment variables, they need to be set up within the 'configuration' tab of your function, and then, you're all set.'

<img alt="Azure Function Creation" src="/img/2020-11-12-Typescript-in-the-backend-with-NestJS-and-Azure-Functions/Azure-pipeline.png" width="auto" height="auto" target="_blank" class="image fit">

Congratulations! 
You converted your app to a serverless Function!
Quite an easy conversion, wasn't it?

The database connection is just as easy.
Again, in the portal, you can [create a CosmosDB Account](https://portal.azure.com/#create/Microsoft.DocumentDB){:target="_blank" rel="noopener noreferrer"}.
In that account, go to 'Data Explorer' and create a new database and add the necessary variables to the configuration of the Function.

In the end, your `app.module.ts` should look like this.
Notice that we can't use the `ConfigService` in this `@Module()`, as it needs to be initialised before usage.

```js
@Module({
  imports: [
      ConfigModule.forRoot(),
      ParametersModule,
      LoggerModule,
      AzureCosmosDbModule.forRoot({
          dbName: process.env.DATABASE_NAME,
          endpoint: process.env.DATABASE_ENDPOINT,
          key: process.env.DATABASE_KEY,
      })
  ],
  controllers: [
      AppController
  ],
  providers: [
      AppService,
  ],
})
export class AppModule {}
```

That's it!
Your app is now fully functional!

## Conclusion

In this blog post, we made a small application to discover how NestJS can be used in the backend with some of its neat features.
Of course, this was a very basic program to show some of the possibilities.
For more information on NestJS and its features, check out the very thorough [documentation](https://docs.nestjs.com/){:target="_blank" rel="noopener noreferrer"}.

## Resources

- [The body parameter tracker project](https://github.com/jasperrosiers/body-parameter-tracker){:target="_blank" rel="noopener noreferrer"}
- [NestJS docs](https://docs.nestjs.com/){:target="_blank" rel="noopener noreferrer"}
- [AWS Lambda integration](https://blog.theodo.com/2019/06/deploy-a-nestjs-app-in-5-minutes-with-serverless-framework/){:target="_blank" rel="noopener noreferrer"} 
- [AWS Cognito integration](https://jacob-do.medium.com/token-validation-with-aws-cognito-and-nestjs-6f9e4088393c){:target="_blank" rel="noopener noreferrer"}
