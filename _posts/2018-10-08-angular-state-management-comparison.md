---
layout: post
authors: [orjan_de_smet]
title: 'NGRX vs. NGXS vs. Akita vs. RxJS: Fight!'
image: /img/2018-10-08-battle-of-the-state-managers/battle-of-the-state-managers.jpg
tags: [Angular,State Management,NGRX,NGXS,Akita,RxJS]
category: Angular
comments: true
---

# Reason for comparing

When creating a web application, one of the questions to ask is how data should be managed.
If the application must be reactive, it's best to use [ReactiveX](http://reactivex.io) (or Rx for short) to create streams of data.
The next question is how this could work performant and reliable.

The current trend is to use a [Redux](https://redux.js.org/)-based storage solution, which consists of a Store, Selectors to get data from the store in the form of Observables and Actions to modify the store.
This allows for a single source of truth, a read-only state and the flow of data going in one direction.
There are a couple of different solutions for Angular.
NGRX is by far the most popular, leaving the new kids in town, NGXS and Akita, far behind in popularity.

It is, however, not always needed to have a storage framework solution.
Very small applications are easy to create with plain RxJS, if you are quite skilled.
In this post, I've stacked each of these solutions against each other to see what can be learned.

# Table of content

1. [The fighting ring](#the-fighting-ring)
2. [The competitors](#the-competitors)
3. [Fight](#fight)
    1. [Available Tooling](#1-available-tooling)
    2. [Features](#2-features)
    3. [Boilerplate code](#3-boilerplate-code)
    4. [Community](#4-community)
    5. [Dependencies and size](#5-dependencies-and-size)
4. [Final score](#final-score)

# The fighting ring

To compare the four competitors, I've set up a simple To Do-application ([GitHub](https://github.com/orjandesmet/angular-state-management-comparison)) with **Angular CLI**.

The master branch holds a base of the application, which cannot run on its own.
It needs a state management solution from one of the other branches.
To make the comparison easier, the base application is written in such a way that each solution only adds files to a *statemanagement* folder and loads a service and zero or more modules into the **AppModule**.
No other files (except *package.json*, *package-lock.json* and *logo.png*) are to be changed.
From an end-user perspective, the application would appear and behave the exact same, no matter which state management solution is used.
The logo is added to be able to differentiate which solution is running.

A To Do-application is perfect to demonstrate CRUD.
A **FakeBackendService** is provided to simulate a RESTful API backend.
The idea is to load the list only once in the application's lifetime and then update the state, without needing to fetch everything from the backend again.
As such, the **FakeBackendService** logs its calls to the console for monitoring.

# The competitors

### NGRX

(v6.1.x) [Docs](https://github.com/ngrx/platform/blob/master/README.md)

> RxJS powered state management for Angular applications, inspired by Redux
>
> @ngrx/store is a controlled state container designed to help write performant, consistent applications on top of Angular.

### NGXS

(v3.2.x) [Docs](https://ngxs.gitbook.io/ngxs/)

> NGXS is modeled after the CQRS pattern popularly implemented in libraries like Redux and NGRX but reduces boilerplate by using modern TypeScript features such as classes and decorators.

### Akita

(v1.7.x) [Docs](https://netbasal.gitbook.io/akita/)

> Akita is a state management pattern, built on top of RxJS, which takes the idea of multiple data stores from Flux and the immutable updates from Redux, along with the concept of streaming data, to create the Observable Data Stores model.
>
> Akita encourages simplicity. It saves you the hassle of creating boilerplate code and offers powerful tools with a moderate learning curve, suitable for both experienced and inexperienced developers alike.

### Plain RxJS

(v6.0.x) [Docs](https://rxjs-dev.firebaseapp.com)

One of the aims of a (progressive) web application is to minimize loading time by reducing the package size.
In that light, some developers opt to not use a framework, but instead use plain RxJS.
To simulate a store as much as possible, I've used **BehaviorSubject**s to hold the state and **pipeable operators** to modify the state.

# Fight

## 1. Available tooling

Since this post is aimed at developers, it might be best to first evaluate the tools available for developers.

A [Redux Devtools](http://extension.remotedev.io/) plugin exists for Chrome and Firefox, or it can be run as a standalone application.
It allows developers to see the impact of a Redux action and time travel between these actions.
Another useful feature available to Angular developers is [Angular Schematics](https://blog.angular.io/schematics-an-introduction-dc1dfbc2a2b2), which allow to create pieces of code through Angular CLI.
None of the solutions have these tools in their default packages and they need to be installed separately.

### Redux DevTools

#### DevTools in NGRX

NGRX provides [*@ngrx/store-devtools*](https://github.com/ngrx/platform/blob/master/docs/store-devtools/README.md) for DevTools.
It works as expected, displaying the latest actions with their impact and the resulting state of the store.
It's possible to jump to specific actions and even skip actions.
It also allows devs to dispatch an action directly from the DevTools itself, but does not verify that action's payload.
Implementing the tools is as easy as importing the following line to the **AppModule**:

```typescript
StoreDevToolsModule.instrument()
```

NGRX DevTools provide options for displaying a maximum age of actions, displaying a name, logging only to console, sanitizing state and actions and serializing the state.

#### DevTools in NGXS

Although NGXS is also modeled after CQRS, it behaves a bit differently.
It provides [*@ngxs/devtools-plugin*](https://ngxs.gitbook.io/ngxs/plugins/devtools) for DevTools.
It does, however, not support all functionalities.
The latest actions can be viewed with their impact and resulting state.
But while it's possible to jump to specific actions, it's not possible to skip actions or dispatch new ones using the DevTools.
Implementing the tools is just as easy as with NGRX, importing the following line to the **AppModule**:

```typescript
NgxsReduxDevtoolsPluginModule.forRoot()
```

NGXS also provides some options for displaying a maximum age of actions, displaying a name and sanitizing state and actions.

#### DevTools in Akita

Akita is the only solution not powered by a Redux-like pattern.
That is why it also has limited functionality in the DevTools.
The DevTools are available through [*@datorama/akita-ngdevtools*](https://netbasal.gitbook.io/akita/enhancers/devtools).
Similar to NGXS, the latest actions can be viewed with their impact and the resulting state.
And similar to NGXS, it's possible to jump to specific actions in the timeline, but impossible to skip actions or dispatch new ones using the DevTools.
What's more is that the raw action does not present the actual payload.
When adding custom actions, you also have to name them with the `@action` decorator.
Implementing the tools is, as ever, possiblie by importing the following line to the **AppModule**:

```typescript
AkitaNgDevtools.forRoot()
```

Akita's DevTools plugin also provides some options for displaying a maximum age of actions, a blacklist and a whitelist.

#### DevTools in plain RxJS

Since RxJS itself is no Redux-based storage solution, it obviously does not provide any support for Redux DevTools at all.

### Schematics

#### Schematics in NGRX

NGRX has quite a lot of schematics available through [*@ngrx/schematics*](https://github.com/ngrx/platform/blob/master/docs/schematics/README.md).
It allows to create stores, feature stores, reducers, actions, container components, effects, entity stores all with a lot of options.
In my To Do-applications, most of the work was done using two simple commands:

```bash
ng g @ngrx/schematics:store AppState --module app.module.ts --root --statePath statemanagement
ng g @ngrx/schematics:entity statemanagement/TodoItem --reducers index.ts
```

The first command added the StoreModule and StoreDevToolsModule into **AppModule** and created a reducer in *statemanegement/index.ts*.
The latter command created the following files:

+ *statemanagement/todo-item.actions.ts*, with a lot of premade actions for inserting, updating, upserting, removing one or multiple entities.
+ *statemanagement/todo-item.model.ts*, with a premade model interface I changed to just export the **TodoItem** interface which I created for the base application.
+ *statemanagement/todo-item.reducer.ts*, and its corresponding spec file handling the generated actions (the spec file did however only test 'unknown action') and providing several basic selectors, though I had to modify the following code for the selectors to work:

```typescript
export const selectTodoItemState = createFeatureSelector<State>('todoItem');

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(selectTodoItemState);
```

The attempt to create extra actions using the following command was not as easy as it seemed.

```bash
ng g @ngrx/schematics:action statemanagement/Filter
```

Only one action was created called **LoadFilters**, with the type `[Filter] Load Filters`.
It would've been easier if one could specify the name of the action some more.

I ended up extending the generated Entity store with the filter and sorting properties for which I had to add extra reducers and selectors manually.
These properties could have been part of a separate state, but I opted to keep the store as simple as possible.

#### Schematics in NGXS

NGXS does not offer any schematics extensions.
It does, however, offer a CLI through [*ngxs-cli*](https://ngxs.gitbook.io/ngxs/plugins/cli).
Although the documentation makes mention of the package *@ngxs/ngxs-cli*, this package was at the time of writing not available.

Using the CLI, a state file *todo-items.state* is created, along with *todo-items.actions.ts* with 1 example action (add), to add an item to an array.
Other than that, everything must be done by yourself, including adding importing the module into *AppModule*.
The CLI offers some options for a name, whether or not to create a spec-file, the path and the name of the folder to create.

#### Schematics in Akita

Akita does offer schematics through [*akita-schematics*](https://github.com/datorama/akita-schematics).
It allows to separately create a store, model, query and service (meant for http), or everything together in what they call a feature.
I used the following command to create a feature store:

```bash
ng g akita-schematics:feature statemanagement/todoItems
```

This created the following files:

+ *statemanagement/state/todo-item.query.ts*, which is used for selecting items from the state.
+ *statemanagement/state/todo-item.model.ts*, with a premade model interface I changed to just export the **TodoItem** interface which I created for the base application.
+ *statemanagement/state/todo-item.store.ts*, which contains the actions that can be performed.

Since I didn't use the `--plain` option, the state created by that command was an extension of **EntityState**, and already has some actions available for setting, inserting, updating and removing entities.

Similar to NGRX, it was easy to extend the state with a filter and a sort property.

Akita also provides a [CLI tool](https://netbasal.gitbook.io/akita/entity-store/akita-cli), but I didn't test this.

#### Schematics in plain RxJS

Since RxJS is based on operator functions, it's nearly impossible to have useful schematics for this use case.
This means that a developer must write everything by hand.

### Tooling summary

Tooling|Redux DevTools|Schematics
-|:-:|:-:
**NGRX**|**Yes**|**Yes**
NGXS|Yes, limited|No, but limited CLI
Akita|Yes, limited|Yes, also CLI
Plain RxJS|No|No

## 2. Features

This is a tough one.
I didn't have use cases in a To Do-application to research every possible feature.
But, nevertheless, let's cover the most useful features and their solutions.

### Feature: Asynchronous actions

What is meant with asynchronous actions, is that an action is dispatched to the store and the store is updated in an asynchronous way.
An example of this is the use of a **FetchItems** action, which performs a request to the backend and dispatches one or multiple different actions when that request completes.
This is especially useful when using a realtime database or Google Cloud Firestore, which opens a socket and can emit multiple events.
In the example application, I've implemented this for a one-time fetch of items where possible.

NGRX can handle this with [*@ngrx/effects*](https://github.com/ngrx/platform/blob/master/docs/effects/README.md), a separate package to be installed.
Effects can be added to the root module or to a feature module for lazy loading.
They can react on any Observable (not only emitted actions) and must emit a new action.
If multiple actions should be emitted, these must be *flatMap*ped.
There is also a schematics extension available to generate an Effects class.

NGXS allows actions to be handled [asynchronously](https://ngxs.gitbook.io/ngxs/concepts/state#async-actions) out-of-the-box.
These actions can dispatch different actions, but can also modify the state directly.
An Observable or Promise must be returned to notify the dispatcher that the action has been completed.

Akita does not have support for asynchronous actions.
The subscription to an asynchronous stream of data must be handled by yourself.

While RxJS is effectively the reason asynchronous actions can exist in Angular, it is quite difficult for novices to update the store from a stream.

### Feature: Memoized Selectors

NGRX offers support for [Selectors](https://github.com/ngrx/platform/blob/master/docs/store/selectors.md) as constants.
These can be easily chained in other selectors, making them ideal when the store is being refactored.

NGXS works similar, but uses [functions](https://ngxs.gitbook.io/ngxs/concepts/select) inside the **State** class.
They can be chained, but it's not as clear to understand as the NGRX solution.
A neat feature within NGXS, is the so-called *shared selector*, which allows to create a selector that can be used with different states.

Akita takes a different approach.
A [**Query**](https://netbasal.gitbook.io/akita/core-concepts/the-query) class is created, in which functions and constants can be defined.
These return Observables, which can be used to obtain a part of the store and can be combined using RxJS operators.
Unlike NGRX and NGXS, Akita does not easily offer selecting queries across different states in the store, without creating substates.

As ever, RxJS, must throw in the towel for this. When you need something from the store, you'll need to use some operators to get that specific item.

### Feature: Persistence

NGRX does not offer any persistence logic itself.
There is however a 3rd party package available, [*ngrx-store-localstorage*](https://github.com/btroncone/ngrx-store-localstorage), which works through a meta reducer.
It offers some options, one of which is setting the Storage interface and which keys to sync and how to (de)serialize those items.

NGXS does have its official plugin, [*@ngxs/storage-plugin*](https://ngxs.gitbook.io/ngxs/plugins/storage), a separate module that can be imported into the **AppModule**.
It also has options for setting the Storage interface and which keys to sync and how to (de)serialize those items, but also offers **migration strategies**.
This allows for a version with a radically changed store to not meet with synchronization errors.

Akita's main package includes a [*persistState()*](https://netbasal.gitbook.io/akita/enhancers/persist-state) function.
Including this function in the *main.ts* file allows the state to be stored in either localStorage or sessionStorage.
Other options include, setting the key by which the state is saved, and including/excluding several aspects of the store and how to (de)serialize those items.

When using plain RxJS, you're on your own again.

### Other features

The frameworks offer even more features.
I'm not going into detail for each of them.
Most of them are included in the following summary.

### Features summary

Features|NGRX|**NGXS**|Akita|Plain RxJS
-|:-:|:-:|:-:|:-:
Async actions|Yes, through effects|**Yes**|No|No
(Memoized) selectors|Yes|**Yes**|Yes, as queries|No
Cross-state selectors|Yes|**Yes**|No|No
Offline persistence|3rd party package|**1st party package**|Main package|No
Snapshot selection without *first()*|No|**Yes**|Yes|No
Forms synchronization|[3rd party packages](https://github.com/MrWolfZ/ngrx-forms)|[**1st party package**](https://ngxs.gitbook.io/ngxs/plugins/form)|[Main package](https://netbasal.gitbook.io/akita/plugins/persist-form)|No
Router synchronization|[1st party package](https://github.com/ngrx/platform/blob/master/docs/router-store/README.md)|[**1st party package**](https://ngxs.gitbook.io/ngxs/plugins/router)|No|No
WebSocket|[3rd party package](https://github.com/avatsaev/angular-ngrx-socket-frontend)|[**1st party package**](https://ngxs.gitbook.io/ngxs/plugins/websocket)|No|No
Angular ErrorHandler|No|[**Yes**](https://ngxs.gitbook.io/ngxs/advanced/errors)|No|No
Meta Reducers|[Yes](https://github.com/ngrx/platform/blob/master/docs/store/api.md#meta-reducers)|[**Yes**](https://ngxs.gitbook.io/ngxs/advanced/meta-reducer)|No|No
Lazy loading|[Yes](https://github.com/ngrx/platform/blob/master/docs/store/api.md#feature-module-state-composition)|[**Yes**](https://ngxs.gitbook.io/ngxs/advanced/lazy)|Yes|No
Cancellation|No|[**Yes**](https://ngxs.gitbook.io/ngxs/advanced/cancellation)|No|No
Side effects|[Yes](https://github.com/ngrx/platform/blob/master/docs/effects/README.md)|[**Yes**](https://ngxs.gitbook.io/ngxs/advanced/action-handlers)|No|No
Web workers|No|**No**|[Yes](https://netbasal.gitbook.io/akita/entity-store/additional-functionality/web-workers)|No
Transactions|No|**No**|[Yes](https://netbasal.gitbook.io/akita/entity-store/transactions)|No

## 3. Boilerplate code

In this round the boilerplate code is evaluated.
This is code that is needed for each part of the state, but differs only a little per state.
I opted not to use [*immer*](https://github.com/mweststrate/immer) for immutable state changes to give each competitor the same chances.

Also within this section, there is the amount of files needed or generated for the To Do-application.

Starting with NGRX, which generated **9** files through schematics.
These files include the reducer file.
Even though I created an Entity store, to ease the use of an entity collection, the reducer file still contained a lot of code through the adapter.
A lot of which were the reducer cases for all the adapter's actions, like set, insert, upsert and delete one or many items.
Even though these cases only call the adapter's functions, most of these methods won't change and it would be nicer if these could have been part of the *@ngrx/entity* package, like the generated selectors.
The same argument holds for the actions created in *todo-item.actions.ts*

NGXS fairs a little better in this aspect.
It generated only **3** files, though each action had to be written out myself and I created extra files for other actions.
And even though the action functions can refer to Generic functions, it's a shame an Entity State with specialized functions is not included in the package.

Akita generated just **4** files using the schematics.
Because I used an EntityState, a lot of Query functions and Actions were readily available, without them taking extra space.

With RxJS I managed to create an operator function for each 'action' very simply.
The application is quite simple, but the method is scalable enough without much overhead.

### Summary

Boilerplate|Files generated|Total files (*)|Boilerplate code
-|:-:|:-:|:-:
NGRX|9|12|Heavy
NGXS|3|7|Medium
**Akita**|**4**|**6**|**Low**
Plain RxJS|0|6|Medium

## 4. Community

Based on Google Trends of the past [12 months](https://trends.google.com/trends/explore?q=ngrx,ngxs,akita%20store), NGRX is obviously the most searched for state manager.
The reason is likely that it was the first Redux implementation available for Angular.

When looking at the GitHub repositories, NGRX has the most stars (at over 3.5K), followed by NGXS (at 1.4K) and Akita (at around 480).
Again this indicates NGRX is the most popular framework.

But what about contributors?
Looking at the repositories' insights, it's clear that the same sequence is followed.
NGRX takes the lead, NGXS a solid second and Akita last.
There it's also visible that NGRX is still under very active development, looking at the commits.
NGXS meanwhile stagnated and Akita has a steady pace.

### Community summary

feat.|Google Trends|GitHub stars|Contributors|Commits
-|:-:|:-:|:-:|:-:
**NGRX**|**1st**|**1st**|**1st**|**1st**
NGXS|2nd|2nd|2nd|3rd
Akita|3rd|3rd|3rd|2nd

## 5. Dependencies and size

State management does not come out-of-the-box with Angular. There is a need to install extra dependencies.
Luckily all these dependencies are available through npm.
To make the different implementations as feature-equal as possible, I've decided to create entity stores where possible and include dev-tools if available.

Furthermore, all implementations were built with and without production mode.
For comparison purposes, the base application measured in at **14.6MB** without production mode, and a mere **754KB** with production mode.

NGRX is a heavy hitter.
It included multiple dependencies for different features. *@ngrx/store* is the basis.
*@ngrx/store-devtools*, *@ngrx/entity*, *@ngrx/effects* and *@ngrx/schematics* complement this, although the schematics are dev-only.
All this gives the packages a weight of **14.9MB** without production mode and **786KB** with production mode.

NGXS fairs a little better.
It only includes *@ngxs/store* and *@ngxs/devtools-plugin*.
This makes the packages weigh in at **14.8MB** without production mode and **778KB** with production mode.

Akita also has an all-in-one package for the store.
*@datorama/akita* holds all functionality, while *@datorama/akita-ngdevtools* and *akita-schematics* provide some development tools.
Despite this, Akita overthrows NGRX with **15.4MB** without production mode and matches NGXS with **778KB** with production mode.
The difference between NGXS and Akita in production mode was a mere **24B**.

RxJS is the clear winner here.
It needs no extra dependencies whatsoever as RxJS already is a dependency of Angular, making the packages **14.6MB** without production mode and **762KB** with production mode.

### Dependencies and size summary

Size|Non-production (MB)|Production (KB)
-|-:|-:
*Base*|*14.6*|*754*
NGRX|14.9|786
NGXS|14.8|778
Akita|15.4|778
**Plain RxJS**|**14.6**|**762**

# Final score

It's not easy to just say which solution is the all-time champion.
Each of the competitors has its advantages and disadvantages.
These are the podium places for each round:

Round | NGRX | NGXS | Akita | Plain RxJS
:-|:-:|:-:|:-:|:-:
Tooling|**1st**|3rd|2nd|
Features|2nd|**1st**|3rd|
Boilerplate code|3rd|2nd|**1st**|2nd
Community|**1st**|2nd|3rd|
Dependencies and size|3rd|2nd|2nd|**1st**