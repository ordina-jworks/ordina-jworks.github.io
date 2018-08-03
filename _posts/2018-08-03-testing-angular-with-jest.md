---
layout: post
authors: [yannick_vergeylen]
title: "Testing Angular with jest"
image: /img/2018-08-03-testing-angular-with-jest/jest.png
tags: [JWorks, culture]
category: Testing
comments: true
---

Last year I learned about Jest, a testing framework. 'Yet another one' was my first thought.
Later that year my colleague and I were looking to extend our test coverage. We where using Jasmine to write the tests we had and Karma to run them.
It worked for sure and we had a lot of tests but it was like a punishment to write them every time, repeating the same code to mock things and when it finally worked and we pushed them to the CI they would sometimes fail randomly.
So we were eager to find a better way to test.

Pretty quickly we started looking into Jest. It differentiated itself by not using Karma as a test runner.
We liked the idea because Karma actually has some points of failure which we encountered often.

## Karma vs Jest

### Karma

Let me quickly give you an overview of what it is that Karma does:

1. it spawns a webserver to serve your source and test code;
2. it starts a browser from your machine and connects to the webserver;
3. it spawns a reporter which has a socket connection with the webserver;
4. it runs every test, awaits its result and sends it to the reporter.

In the end we have 3 components communicating with each other. Which components exactly, dependends on the environment Karma is running on.
Our CI was a Linux machine, I had an Ubuntu to work on, my colleague was on MacOS, and other guys in the team were on Windows.
So we all had different Chrome versions which gave us some issues. And our CI used PhantomJS, which is outdated, so here we also had some issues.

### Jest

How are these issues fixed in Jest?
As I mentioned before Jest does not use Karma to run the tests, it will just start a single NodeJS process which does all the work by itself:

1. it compiles your code;
2. it runs your tests with NodeJs (or JSDOM for DOM testing);
3. it creates a report.

Just plain and simple without too many interconnected processes to break.
Also, no real browser is needed on the machine since NodeJs and JSDOM are used.
Therefore the only tool to keep up to date is Jest, which is managed automatically via the Yarn lockfile

## Set up

So how can you set it up and quickly replace all your tests (if you're coming from Jasmine)?
To make Jest available in an Angular project, you first need to install Jest and [jest-preset-angular](https://www.npmjs.com/package/jest-preset-angular){:target="_blank"}.
Since Jest is made for React (backed by Facebook, remember) we need jest-preset-angular to fix some things for us.

```text
$ yarn add -D @types/jest jest jest-preset-angular
```

Some configuration is always needed so let's add some lines to the package.json (or export the config in a jest.config.js).
First we point to the preset that we will use. Next we provide a setup-jest.ts script in which we import some necessary files (we'll create it later on).
Then we provide information about how Jest should transpile our code under the transform property. Therefore we point to the preprocessor from jest-preset-angular for our typescript and html files.
And for the Javascript files we'll point to babel-jest (which ships with Jest).
The transformIgnorePatterns point to some libraries that don't need to be transpiled for our tests. (If you get `Unexpected token import` issues, you might need to add some packages here)

```json
"jest": {
  "preset": "jest-preset-angular",
  "setupTestFrameworkScriptFile": "<rootDir>/src/setup-jest.ts",
  "transform": {
     '^.+\\.(ts|html)$': '<rootDir>/node_modules/jest-preset-angular/preprocessor.js',
     '^.+\\.js$': 'babel-jest'
   },
  "transformIgnorePatterns": ['node_modules/(?!@ngrx|ng2-translate|@ionic|lodash|ionic-angular)'],
}
```

As mentioned previously, we create a setup-jest.ts file in which we import some code from jest-preset-angular and a global mocks file.

```typescript
import 'jest-preset-angular';  
import './jest-global-mocks';  
```

In the jest-global-mocks.ts we provide functionality that is not found in JSDOM but that we use in our code (and thus is found in our preferred browser).
So we mock things that are globally accessible, if you use certain browser API's you should also mock them here.
For our example we needed the following code:

```typescript
const mock = () => {
  let storage = {};
  return {
    getItem: key => key in storage ? storage[key] : null,
    setItem: (key, value) => storage[key] = value || '',
    removeItem: key => delete storage[key],
    clear: () => storage = {},
  };
};

Object.defineProperty(window, 'localStorage', {value: mock()});
Object.defineProperty(window, 'sessionStorage', {value: mock()});
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ['-webkit-appearance']
});

Object.defineProperty(window, '__env', {value: {env: {backendUrl: 'mocked URl'}}});
```

As you can see, our tests use localStorage, sessionStorage, getComputedStyle and an environment property (__env) on the window.

With everything set up we could run our test by running the Jest command

```text
jest
```

Of course not much is running yet since all our tests use Jasmine, and 'jasmine' (as a keyword) is unknown to Jest.
To fix this we need to replace some Jasmine specific code by Jest specific code.

## Jasmine to jest

In Jasmine we would create a mock object using Jasmine's createSpyObj-function and passing some parameters in it.

```typescript
// Jasmine
const serviceMock = createSpyObj('service', ['methods', 'you', 'want', 'to', 'mock']);
```

In Jest we just create an object with the expected properties, and jest.fn() creates a mock function for us.
This is a great improvement since you get better code hints and you can easily create more advanced mocks.

```typescript
// Jest
const serviceMock = {
 methods: jest.fn(),
 you: jest.fn(),
 want: jest.fn(),
 to: jest.fn(),
 mock: jest.fn()
};
```

Also to mock return values it is a bit different (for the better):

```typescript
// Jasmine
serviceMock.you.mockReturnValue(serviceMock.you as Spy).and.returnValue('yannick vergeylen');
```

```typescript
// Jest
serviceMock.you.mockReturnValueOnce('yannick vergeylen');

// And you can chain multiple return values if you need it
serviceMock.you.mockReturnValueOnce('yannick vergeylen')
               .mockReturnValueOnce('bob')
               .mockReturnValue('everyone');

// Or even with a function which can execute simple logic.
// But you shouldn't be implementing to much logic, since you don't want to test the tests.
serviceMock.you.mockImplementation((firstname,lastname) => `${firstname} ${lastname}`);

// Or provide it at initialisation which saves you a line of code
const serviceMock = {
 methods: jest.fn(),
 you: jest.fn((firstname,lastname) => `${firstname} ${lastname}`),
 want: jest.fn(),
 to: jest.fn(),
 mock: jest.fn()
};
```

For the assertions you shouldn't have to change much, since Jest uses almost the same assertion functions as Jasmine.

```typescript
expect(serviceMock.methods).toHaveBeenCalled();
expect(serviceMock.methods).toHaveBeenCalledWith('value');

// Jasmine
(serviceMock.you as Spy).calls.mostRecent()[0]

// Jest
serviceMock.you.mock.calls[0][0] // to get the first argument of the first call (firstname)
serviceMock.you.mock.calls[0][1] // to get the second argument of the first call (lastname)
```

I changed all our tests with some regexes, it is possible with some creativity, but today there are codemods which should do the hard work for you.
[Checkout the jest documentation](https://jestjs.io/docs/en/migration-guide){:target="_blank"} to find out more.

Jest really gets interesting when you use libraries and need to mock them:

```typescript
// Jest
import {HttpClient} from '@angular/common/http';
import {CompaniesService} from './companies.service';
import {Observable} from 'rxjs/Observable';

jest.mock('@angular/common/http');

const httpClient = new HttpClient(null);
let companiesService= new CompaniesService(httpClient);

test('the service should map the return value to an array of companies', () => {
  httpClient.get.mockReturnValueOnce(Observable.of({companies:[{name:'C1',code:'C1'}],page:6,total:51}))
  companiesService.getPage(6)
    .subscribe((value)=>expect(value).toEqual([{name:'C1',code:'C1'}]));
  expect(httpClient.get.mock.calls[0][0]).toEqual('backendUrl/companies?page=6')
});
```

Instead of mocking HttpClient we can just import it, provide the return value we know backend will give and focus on testing the output of our getPage method.
In the above example you see I have to create a instance of httpClient to get around dependency injection in Angular, but other imports can also be mocked in the same way.

## Conclusion

So one year later we are still using Jest and testing is still a lot more enjoyable than it was before.
Not painless as Jest claims it to be, but that's just the nature of testing I guess.
