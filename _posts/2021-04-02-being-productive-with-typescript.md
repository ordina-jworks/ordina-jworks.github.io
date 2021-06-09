---
layout: post
authors: [yannick_vergeylen]
title: 'Being productive with Typescript'
image: /img/2021-04-02-being-productive-with-typescript/banner.jpg
tags: [Typescript, Best practices]
category: development
comments: true
---

# Table of contents
{:.no_toc}

- TOC
{:toc}

----

# Introduction
Many a frontend project is nowadays being developed in Typescript.
There are a lot of alternatives, but the common language for browsers is still mainly Javascript. 
As a Javascript developer, it is pretty easy to switch to Typescript.
Why would you go with Typescript and therefore adding an extra build step?
'Because of the type safety' is the usual answer.

While I completely agree with that statement, I often see code where Typescript has no additional value.
Even worse, it adds negative value by getting in the way of a developer and by being unreadable.
How can that be? Well, let's have a look.

In my opinion these are the main features that Typescript adds to Javascript:

**Readability:**
As a Javascript developer you need to master 'naming', because it is the only information you can provide with variables.
Functions are even harder, in Javascript your contract is nothing but the function name.
Using Typescript you can enrich variables with types, giving them more meaning.
Functions in a typed language have contracts existing of a name, the parameter types and a return type.

**Code hinting:**
While a good IDE can help you out with Javascript, it will rock your world using Typescript.
Instead of guessing, it knows which properties are on an item, which functions are (publicly) available, and gives you the power to create a clean public API that does not rely on conventions.
As an added bonus it allows your IDE to generate code that is actually better than yours.

**Compile-time errors:**
Javascript does not care if you are passing numbers, strings or Objects in functions, but it breaks when you do not handle them wel.
Typescript checks if you are passing the right types in the right places while it is transpiling your code.
As a developer you should embrace the errors it throws, for they save you much time on debugging.

In the following post I will share some code snippets I gathered, and I will gradually add improvements that use the full potential of Typescript.
I will evaluate each snippet using the 3 features listed above.

# Interfaces or classes
It is a common topic during discussions between developers. 
I have a pretty straight forward opinion about this, and I rather get it out of the way sooner than later in this post.
When working in a classic frontend/backend setup, the frontend its job is to display data in a conceivable way for a user.
This means that frontend receives its data in a predefined format from a source and should not add more functionality to it.
For me this means an interface will do. 
Also, interfaces do not get transpiled to Javascript, while classes do.
They give code hinting, they give compilation errors and they are not in your production code, which is an ideal scenario to me.
When do I prefer classes? For everything that needs added functionality. 
Frankly for everything not coming from an external source, I would probably use a class.
Yet there are still exceptions to this, and every case should be handled pragmatically.
For this post I am working with interfaces.
Without any further ado, let's dive into some code.

# Literal narrowing
```typescript
interface AgendaItem {
  status: string;
}

function pickColor(status: string) {
  switch (status){
    case 'OPEN':
      return '#2266FF'
    case 'CLOSED':
      return '#888888'
    case 'IN PROGRESS':
      return '#FF8800'
    }
}
```

The code above seems okay. 
I used to write like this all the time. 
But the question is: **What is the added value of Typescript?** 
Let's make a list of what Typescript does for us here:

- ~~Readability~~
- ~~Code hinting~~
- ~~Compile-time errors~~

Needless to say, this code isn't any better than its Javascript counterpart. 
Let's have a look at an improved version.

```typescript
type AgendaItemStatus = 'OPEN' | 'CLOSED' | 'IN PROGRESS';

interface AgendaItem {
 status: AgendaItemStatus;
}

function pickColor(status: AgendaItemStatus) {
 switch (status){
   case 'OPEN':
     return '#2266FF'
   case 'CLOSED':
     return '#888888'
   case 'IN PROGRESS':
     return '#FF8800'
   case 'TODO':
     return '#FF8800'
 }
}
```
Consider the new type: `AgendaItemStatus`. 
It is called a [string literal](https://www.typescriptlang.org/docs/handbook/literal-types.html#string-literal-types){:target="_blank" rel="noopener noreferrer"} and should have all possible statuses listed.
This makes my code more typesafe and gives the code hinting we would expect from Typescript.
In the example above there is a case for `'TODO'`, but thanks to Typescript your IDE knows `'TODO'` is not a possible status.
It gets even better, some IDEs allow you to autogenerate the switch case.

Personally I use a [string literal](https://www.typescriptlang.org/docs/handbook/literal-types.html#string-literal-types){:target="_blank" rel="noopener noreferrer"} when I can easily remember the statuses without looking it up in a database. 
On average I can remember around 7 different statuses.

Let us have a look at our list of added Typescript values retrospectively:
- Readability
- Code hinting
- ~~Compile-time errors~~

How are we missing out on the compile-time errors?
Imagine my data source adds a new status. 
I will add the new status to the list, but no mechanism is forcing me to alter the `pickColor` function.
Code hinting will not always help me out here, so I need a compile-time error to catch this as soon as possible.

```typescript
type AgendaItemStatus = 'OPEN' | 'CLOSED' | 'IN PROGRESS' | 'DELETED';

interface AgendaItem {
 status: AgendaItemStatus;
}

type AgendaItemStatusMap<T> = Record<AgendaItemStatus, T>;
    
function pickColor(status: AgendaItemStatus) {
 const map: AgendaItemStatusMap<Color> = {
   OPEN: '#2266FF',
   CLOSED: '#888888',
   'IN PROGRESS': '#FF8800'
 }
 return map[status];
}
```
This is more than just adding Typescript, we refactored the [switch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch){:target="_blank" rel="noopener noreferrer"} into a _lookup map_.
For the [switch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch){:target="_blank" rel="noopener noreferrer"} we had in our example, this can be done. But that is not always the case.
The _lookup map_ has a type which is generated entirely within Typescript.
[Record](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeystype){:target="_blank" rel="noopener noreferrer"} is the utility type to be used.
So how does it help us? Reimagine that a new status 'DELETED' is added. 
I adapt the type `AgendaItemStatus`, and hit ctrl-s (it starts a build).
In a matter of seconds I will be informed that property 'DELETED' is missing on line _x_ of file _y_.
Now we are using the potential of Typescript

- Readability
- Code hinting
- Compile-time errors

# Type aliases, DTO's and Utility Types

```typescript
interface CalenderItem {
 duration?: number,
 startTime: string | Date, // yyyy-MM-ddThh:mm:ss.sssZ
 dueDate?: string | Date // yyyy-MM-dd
}


export function mapCalenderItem(dto: CalenderItem) {
 return {
   ...dto,
   startTime: new Date(dto.startTime),
   dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined
 }
}


export function remapCalenderItem(item: CalenderItem) {
 return {
   ...item,
   startTime: (item.startTime as Date).toISOString(),
   dueDate: item.dueDate 
     ? (item.dueDate as Date).toISOString() 
     : undefined
 }
}
```
The above code might need some explanation (so much for self-explanatory). 
My datasource is a REST API, therefore it communicates dates as string.
But as a developer you do not want to pass strings around and convert them every time you need them to be a Date.
So as soon as I receive the dates, I change them into Date objects (`mapCalenderItem`). 
And when I post them back to backend, I parse them back to strings (`remapCalenderItem`).

The first thing to notice here, is that the interface is unstable. 
`startTime` and `dueDate` are using a [union type](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#union-types){:target="_blank" rel="noopener noreferrer"}, this means it can be either a string or a Date.
Then there is also the fact that we're working with a date and a timestamp, having a ymd-string or a isoString respectively.
Finally there is the [type assertion](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions){:target="_blank" rel="noopener noreferrer"}, where we are telling typescript to interpret `startTime` and `dueDate` `as Date`.
Type assertions happen when Typescript is getting in your way. 
It is adding negative value at this point.

- ~~Readability~~
- ~~Code hinting~~
- ~~Compile-time errors~~

```typescript
type DateTimeString = string; //yyyy-MM-ddThh:mm:ss.sssZ
type DateString = string; //yyyy-MM-dd
type Seconds = number;

interface CalenderItemDTO {
 duration?: Seconds,
 startTime: DateTimeString,
 dueDate?: DateString,
}

interface CalenderItem {
 duration?: Seconds,
 startTime: Date,
 dueDate?: Date,
}

function mapCalenderItemFromDTO(item: CalenderItemDTO): CalenderItemDTO {
 return { ...item,
   startTime: new Date(item.startTime),
   dueDate: item.dueDate 
     ? new Date(item.dueDate) 
     : undefined
 }
}

function mapCalenderItemToDTO(item: CalenderItem): CalenderItem {
 return { ...item,
   startTime: item.startTime.toISOString(),
   dueDate: item.dueDate
     ? format(item.dueDate, 'yyyy-MM-dd') 
     : undefined
 }
}
```
The code became a lot bigger. 
Some people grade code on the amount of lines written to achieve a goal.
While it is fun to think about shorter code, I would always argue that maintainability is key in production code.

Let's begin with the types. 
Typescript allows us to create [Type Aliases](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-aliases){:target="_blank" rel="noopener noreferrer"}. 
Its only purpose, is making your code more readable. 
It does not improve error descriptions, neither does it add typesafety, but it improves your variable declarations.
The next developer will know immediately that `duration` is in seconds, for example. The same goes for `startTime` and `dueDate`.

Next significant change is the DTO type. 
A [Data Transfer Object](https://en.wikipedia.org/wiki/Data_transfer_object){:target="_blank" rel="noopener noreferrer"} can be used for communication between systems.
It can be seen as a tiny anti-corruption layer, because the internal code does not need to know about communication with an external system.
The direct benefit is that we always know which types we are using and do not need explicit typecasting.
A keen eye might also notice the absence of [union types](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#union-types){:target="_blank" rel="noopener noreferrer"}.
[Union types](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#union-types){:target="_blank" rel="noopener noreferrer"} tend to break the code hinting. 
It is better to avoid them when possible.

Let's evaluate the code using the Typescript features:
- Readability
- Code hinting
- Compile-time errors

It seems perfect, but we are violating the DRY principle now.
Every time the contract changes, we will have to adapt 2 interfaces. 
Even when there is no functional impact.
Remember that Typescript interfaces are not transpiled, so I gave myself some extra work for _undefined_.
Puns aside, there is an easy improvement we can do.

```typescript
interface CalenderItemDTO {
 title: string,
 location?: Location,
 duration?: Seconds,
 startTime: DateTimeString,
 dueDate?: DateString
}


interface CalenderItem extends Omit<CalenderItemDTO, 'startTime'| 'dueDate'> {
 startTime: Date,
 dueDate?: Date
}
```
I focused on the interfaces, because the other code should stay untouched (even the transpiled result should be identical).
Typescript provides some [utility types](https://www.typescriptlang.org/docs/handbook/utility-types.html){:target="_blank" rel="noopener noreferrer"}, and one of them is used here to create our `calenderItem` interface.
[Omit](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys){:target="_blank" rel="noopener noreferrer"} just takes an interface (or class) and drops the properties you pass as second argument. 
This allows us to redeclare these properties with the Type we will be using internally.
When the DTO changes, we only need to change the `CalendarItem` when we need to map something.
Now we are sure that a change in the interface will always be accompanied by a functional change (in the transpiled code that is).
In the example above this means we only had to add `title` and `location` to the DTO, not to `CalenderItem` itself.
Also take note that this change has no influence on the mapping functions.

# Typeguards

```typescript
interface Item {
 dueDate: Date;
 estimatedTime?: Seconds; //only if unplanned
 startTime?: Date; //only if planned
 duration?: Seconds; //only if planned
}

function pickColor(item: Item): Color {
 if (item.estimatedTime) {
   return canFinishOnTime(item) ? `#00FF00` : `#FF0000`;
 } else if (item.duration) {
   return willFinishOnTime(item) ? `#00FF00` : `#FF0000`;
 }
}

function canFinishOnTime(item: Item): boolean {
 const endTime = addSeconds(new Date(), item.estimatedTime);
 return isBefore(endTime, item.dueDate);
}

function willFinishOnTime(item: Item): boolean {
 const endTime = addSeconds(item.startTime, item.duration);
 return isBefore(endTime, item.dueDate);
}
```
The code above became unreadable.
This typically happens when code evolves. 
Using Typescript in a better way could greatly improve its readability.

Also, there are potential issues when values are undefined that will not be caught during compile-time.
Nothing indicates to the next developer that we need a planned item in the `willFinishOnTime` function. 
If he passes an unplanned item, things will go wrong at runtime.

- ~~Readability~~
- ~~Code hinting~~
- ~~Compile-time errors~~

So le's fix this error prone code with some nice Typescript features.

```typescript
interface Item {
 dueDate: Date;
 estimatedTime?: Seconds; //only if unplanned
 startTime?: Date; //only if planned
 duration?: Seconds; //only if planned
}
type UnPlanned = Required<Omit<Item, 'startTime' | 'duration'>>;
type Planned = Required<Omit<Item, 'estimatedTime'>> ;

function isPlanned(item: Planned | UnPlanned): item is Planned {
 return hasOwnProperty(item, 'startTime');
}

function pickColor(item: Planned | UnPlanned): Color {
 if (isPlanned(item)) {
   return willFinishOnTime(item) ? `#00FF00` : `#FF0000`;
 } else {
   return canFinishOnTime(item) ? `#00FF00` : `#FF0000`;
 }
}

function willFinishOnTime(item: Planned): boolean {
    const endTime = addSeconds(item.startTime, item.duration);
    return isBefore(endTime, item.dueDate);
}

function canFinishOnTime(item: UnPlanned): boolean {
    const endTime = addSeconds(new Date(), item.estimatedTime);
    return isBefore(endTime, item.dueDate);
}
```
The first notable change is that we use [utility types](https://www.typescriptlang.org/docs/handbook/utility-types.html){:target="_blank" rel="noopener noreferrer"} to form an `UnPlanned` and a `Planned` item.
The second notable change is the [typeguard](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards){:target="_blank" rel="noopener noreferrer"} we added.
It is just a pure function which wraps a statement that returns true or false, indicating that the parameter you passed is of the expected type.
You decide how to deduce the type: in the example above we look at the `startTime` property, because we know it indicates that an item is planned or not.
The special part is the return type 'item is Planned'. 
This informs Typescript that we are working with a Planned type now.
Because I passed a union of just 2 types in the guard, Typescript also knows that the _else_ statement will be working with an `Unplanned` item.
Thanks to the [typeguard](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards){:target="_blank" rel="noopener noreferrer"} we now have a very readable _if_ statement.
But it gets better, the parameters for `willFinishOnTime` and `canFinishOnTime` can be narrowed down to `Planned` and `Unplanned`, which solves the potential runtime issue.

Let's run trough the Typescript features once more:
- Readability
- Code hinting
- Compile-time errors 

Again a code example that seems perfect, but imagine that `startTime` also becomes available on an unplanned item.
You could resolve to use `duration` as an indicator but that still seems a bit off to me.

```typescript
interface Item {
 status: 'PLANNED' | 'UNPLANNED'
 dueDate: Date;
 estimatedTime?: Seconds; //only if unplanned
 startTime: Date;
 duration?: Seconds; //only if planned
}

type UnPlanned = Required<Omit<Item, 'startTime' | 'duration'>>;
type Planned = Required<Omit<Item, 'estimatedTime'>> ;

function isPlanned(item: Item): item is Planned {
 return item.status === 'PLANNED';
}

function isUnPlanned(item: Item): item is UnPlanned {
 return item.status === 'UNPLANNED';
}
```
To address this last potential issue we should use a stable property. 
Sadly we depend on the external system for this. 
Personally, I would advise to use a status for this, but there are many other ways.
One could simply use a _boolean_: _isPlanned_,
but you can bet your bottom dollar on business coming up with an 'neither planned nor unplanned item'.
Statuses tend to be more flexible in the long run.

# Utility types
There are plenty of utility types you can use. 
To finish the article, I searched for some really useful examples.

```typescript
interface ItemDTO {
 id: string,
 duration?: Seconds,
 dueDate?: DateString,
 startTime: DateTimeString,
}

function create(item: Omit<ItemDTO, 'id'>) {
 // post new item
}

function read(item: Pick<ItemDTO, 'id'>): ItemDTO {
 // send data to backend
}

function update(item: Partial<ItemDTO>) {
 // patch new item
}
```
When communicating to an external system we often use CRUD. 
I find myself using the [Omit](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys){:target="_blank" rel="noopener noreferrer"} utility to ignore the required `id` property of an item, 
because the ID should be generated by another system.
For a read operation, an ID is sufficient, but you might consider [Pick](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys){:target="_blank" rel="noopener noreferrer"} to keep track of all itemDTO usages. 
In the next example this becomes even more important.
To update using a patch statement you just want to send the changed properties, so [Partial](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype){:target="_blank" rel="noopener noreferrer"} is the ideal operator in this case.

```typescript
interface Todo {
 id: string,
 duration: Seconds,
 startTime: Date,
}


interface Task {
 id: string,
 duration: Seconds,
 startTime: Date,
 assignee: string
}


function getEndTime(item: 
	Pick<Todo | Task, 'startTime' | 'duration'>): Date {
 return addSeconds(item.startTime, item.duration);
}
```
In this example the [Pick](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys){:target="_blank" rel="noopener noreferrer"} utility really shines. 
I could have used an interface with `startTime` and `duration`, but then I lose track of where I use properties from `Todo` and `Task` types.
This is especially interesting when working with [Pipes](https://angular.io/guide/pipes){:target="_blank" rel="noopener noreferrer"} in Angular.

So to wrap it up, I suggest you start using Typescript today if you don't do it already. 
And if you use Typescript, try to honestly evaluate if it actually adds value. 
If it is not adding value, you might be doing something wrong.
A good place to start is where you are using Union types, often this can be done better (via Generics).
Another indicator is the use of _any_. 
personally, I wouldn't start a project without using Typescript.
It makes me more productive and improves my code quality without effortlessly.
And a big bonus is that there is less need to test every function because typescript already limits the possible in and outputs.