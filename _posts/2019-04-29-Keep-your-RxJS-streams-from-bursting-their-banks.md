---
layout: post
authors: [orjan_de_smet]
title: "How to keep your RxJS streams from bursting their banks"
image: /img/2019-04-15-Keep-your-RxJS-streams-from-bursting-their-banks/speedlimit.jpg
tags: [RxJS, Angular]
category: Development
comments: true
---

In my current role as Angular coach I try to help my colleagues as much as possible to make their applications in a logical and comprehensible way.
I’m a huge supporter of RxJS for reactive programming and I ask others to consider using the technology to help them create declarative code and prevent them from going to Callback Hell.
But as people start to embrace RxJS streams, the difficulties paired with using reactive programming start to surface and I’ve concluded that there also exists something I’d like to call *Observable Purgatory*.

At the moment of writing this, I’m staring at an Angular component file having 548 lines - no inline template or styles - of which 64 lines are imports and 411 lines either are a declaration or instantiation of a stream or are a function in which a stream is used.
Some of these functions are more than 20 lines, and 3 are even more than 40 lines.
Holy nightmare, Batman!
Imagine the unit tests needed to test all possible cases.
Apparently those aren’t needed, because the biggest function - 48 lines - is tested in 2 unit tests and of course “everything works, doesn’t it?”

So without further ado, here are the most common bad practices and their solutions.

**Note: Unless explicitly mentioned, these are NOT Angular specific.**

## Consuming all the RAM

<p style="text-align: center;">
  <img alt="Jack Sparrow: But why is the RAM gone" src="{{ '/img/2019-04-15-Keep-your-RxJS-streams-from-bursting-their-banks/2y7g2l.jpg' | prepend: site.baseurl }}" class="image fit-contain">
</p>

Developers who are new to RxJS will often forget that a subscription can live on during the whole life time of your application.
Most of the time they have only worked with simple XHR requests and those will by default emit only one value and then complete.
But reactive programming allows to create streams that emit multiple values and might never complete.
This will cause memory leaks, unexpected behaviour and therefor bugs.
The solution is quite simple: just unsubscribe or take only the needed events!

You can cancel a subscription by calling its **unsubscribe** function, but then you're skimming the power of reactive programming.
Operators like - but not limited to - [**first**](https://rxmarbles.com/#first){:target="_blank" rel="noopener noreferrer"}, [**take**](https://rxmarbles.com/#take){:target="_blank" rel="noopener noreferrer"}, [**takeWhile**](https://rxmarbles.com/#takeWhile){:target="_blank" rel="noopener noreferrer"} and [**takeUntil**](https://rxmarbles.com/#takeUntil){:target="_blank" rel="noopener noreferrer"} will close a subscription as soon as the condition is met.

```typescript
interval(1000)       // --0--1--2--3--4--5--6--7--8--9--...-->
  .pipe(take(5))     // --0--1--2--3--(4|)
  .subscribe(tick => console.log(tick));
```

**Note: When using mergeMap or another variant in combination with takeUntil, make sure you add the takeUntil pipe at the end.**

> RULE: CANCEL SUBSCRIPTIONS THAT DO NOT COMPLETE BY THEMSELVES

### Angular specific: Use the AsyncPipe

Angular provides an [AsyncPipe](https://angular.io/api/common/AsyncPipe){:target="_blank" rel="noopener noreferrer"}, which lets you subscribe to a stream from inside your component’s template.
The great advantage is that this subscription will automatically be openend when the component or the element in which it's used is created and cancelled when the component is destroyed.
A quick example of a counter of seconds:

```typescript
@Component({
  selector: 'my-app',
  template: `<p>
      Tick: {% raw %}{{ tick }}{% endraw %}
    </p>`
})
export class AppComponent implements OnInit, OnDestroy {
  myStream$ = interval(1000);
  subscription: Subscription;
  tick: number;

  ngOnInit() {
    this.subscription = this.myStream$.subscribe(tick => {this.tick = tick})
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
```

This can be written a lot shorter and maintainable using the AsyncPipe:

```typescript
@Component({
  selector: 'my-app',
  template: `<p>
      Tick: {% raw %}{{ myStream$ | async }}{% endraw %}
    </p>`
})
export class AppComponent  {
  myStream$ = interval(1000);
}
```

> RULE: USE ANGULAR’S ASYNCPIPE WHERE POSSIBLE

## Yo dawg, I heard you like Subscriptions

<p style="text-align: center;">
  <img alt="Xzibit: I put a subscription inside your subscription" src="{{ '/img/2019-04-15-Keep-your-RxJS-streams-from-bursting-their-banks/2y7avi.jpg' | prepend: site.baseurl }}" class="image fit-contain">
</p>

This should be basic knowledge by anyone using the Observable pattern.
Apart from being extremely ugly to look at, it’s near impossible to keep track of what subscription is open at which moment.
Consider the following example:

```typescript
subscription1 = param$.subscribe(param => {
  subscription2 = apiService.getObject(param).subscribe(obj => {
    this.obj = obj;
    subscription3 = anotherApiService.getEvents(obj.busId).subscribe(events => {
      this.events = events;
    });
  });
});

onDestroy() {
  subscription1.unsubscribe();
  if (subscription2 && !subscription2.closed) subscription2.unsubscribe();
  if (subscription3 && !subscription3.closed) subscription3.unsubscribe();
}
```

In this case, when the `param$` stream emits a value, the `obj` is requested from an API endpoint and when received, it will in its turn request events occurring on a specific `busId`.
But what happens when `param$` emits a new value? The `obj`property will be replaced eventually, but the event stream for the first object will still exist.
So you could start keeping track of subscriptions and cancel them at the ‘right’ moment:

```typescript
subscription1 = param$.subscribe(param => {
  if (subscription2 && !subscription2.closed) subscription2.unsubscribe();
  subscription2 = apiService.getObject(param).subscribe(obj => {
    this.obj = obj;
    if (subscription3 && !subscription3.closed) subscription3.unsubscribe();
    subscription3 = anotherApiService.getEvents(obj.busId).subscribe(events => {
      this.events = events;
    });
  });
});

onDestroy() {
  subscription1.unsubscribe();
  if (subscription2 && !subscription2.closed) subscription2.unsubscribe();
  if (subscription3 && !subscription3.closed) subscription3.unsubscribe();
}
```

Wow! That’s amazing!
Except it isn’t.
There are still 3 subscriptions, while it could be done with just 1 when using the correct operators:

```typescript
subscription1 = param$.pipe(
  switchMap(param => apiService.getObject(param)),
  tap(obj => this.obj = obj),
  switchMap(obj => anotherApiService.getEvents(obj.busId))
).subscribe(events => {
  this.events = events;
});

onDestroy() {
  subscription1.unsubscribe();
}
```

This way, only 1 subscription will exist, canceling it will automatically cancel any inner streams.
And when `param$` would emit a new value, the `switchMap` operator will automatically cancel its inner stream and create a new one.

> RULE: NEVER SUBSCRIBE WITHIN A SUBSCRIPTION<br/>
This also applies for calling a function inside a subscription when that function has a subscription.

## Sharing is caring

<p style="text-align: center;">
  <img alt="Cat with big bowl of food: What do you mean, I have to share?" src="{{ '/img/2019-04-15-Keep-your-RxJS-streams-from-bursting-their-banks/2y7xld.jpg' | prepend: site.baseurl }}" class="image fit-contain">
</p>

When using a stream on multiple locations, remember that there is a difference between a cold and a hot Observable.
In short: a cold Observable will restart its stream for each subscription, while a hot Observable will reuse an existing stream when a subscription is added.
Think of a cold Observable as a HTTP request, which fires each time again, and a hot Observable as a keyPress stream which emits the same event no matter how many subscriptions exist on the stream.
If you need more details, you can read this article by Ben Lesh [Hot vs Cold Observables](https://medium.com/@benlesh/hot-vs-cold-observables-f8094ed53339){:target="_blank" rel="noopener noreferrer"}.

Sometimes you'll need to react on a cold Observable in multiple separate streams.
For example, you need to display the response, but you also need to initiate a new stream to get other data.
So you'll create two subscriptions and use a **mergeMap**, because subscriptions inside subscriptions are not allowed:

```typescript
stream1 = httpGet('userCarMake');
stream2 = stream1.pipe(mergeMap(make => httpGet('userCarMake', make)));
stream1.subscribe(make => console.log('The car make is', make));
stream2.subscribe(models => console.log('The models for this make are', models.join()));
```

But in your developer tools' network tab, you notice that **userCarMake** has been requested twice.
The answer to why should be obvious by now: there are two subscriptions.
To solve this with minimal changes, make the source stream a hot Observable using [**shareReplay**](https://www.learnrxjs.io/operators/multicasting/sharereplay.html){:target="_blank" rel="noopener noreferrer"}.

```typescript
stream1 = httpGet('userCarMake').pipe(shareReplay(1));
stream2 = stream1.pipe(mergeMap(make => httpGet('userCarMake', make)));
stream1.subscribe(make => console.log('The car make is', make));
stream2.subscribe(models => console.log('The models for this make are', models.join()));
```

> RULE: MAKE YOUR OBSERVABLES HOT WHEN NECESSARY

Though be careful when using this operator.
If the source doesn't complete by itself, it will keep emitting values.
To prevent this behaviour, use an options object in the `shareReplay` operator and set the required property **refCount** to true:

```typescript
sharedStream = source.pipe(shareReplay({bufferSize: 1, refCount: true}));
```

See [this stackblitz](https://stackblitz.com/edit/using-sharereplay){:target="_blank" rel="noopener noreferrer"} for an example of the difference.
You can set a tslint rule to make sure you always use `shareReplay` with options.
Here you can find the configuration: [rxjs-tslint-rules: rxjs-no-sharereplay](https://github.com/cartant/rxjs-tslint-rules#rxjs-no-sharereplay){:target="_blank" rel="noopener noreferrer"}.

### Angular specific: use shareReplay with AsyncPipe

A point of note for Angular's AsyncPipe is that each AsyncPipe will create a new subscription.
Use **shareReplay** when multiple AsyncPipes are used on the same stream or a stream depending on it.

```typescript
@Component({
  selector: 'my-app',
  template: `<ng-container *ngIf="hasItems$ | async">
    <p *ngFor="let item of items$ | async">
      Tick: {% raw %}{{ item }}{% endraw %}
    </p>
    </ng-container>`
})
export class AppComponent  {
  items$ = getItems().pipe(shareReplay(1));
  hasItems$ = items$.pipe(map(items => items.length > 0));
}
```

## My stream is too big

<p style="text-align: center;">
  <img alt="Boy with a giant spoon: My stream is too big" src="{{ '/img/2019-04-15-Keep-your-RxJS-streams-from-bursting-their-banks/2y7st6.jpg' | prepend: site.baseurl }}" class="image fit-contain">
</p>

One of the major advantages of using streams is that you can write declarative code.
Declarative code means that the code can explain itself without the need of comments.
Great!
Now developers don't need to worry about writing comments anymore.
RxJS provides a lot of operators that are self-explanatory: `map`, `filter`, `withLatestFrom`, `catchError`, ...
So what's the problem?
It's something what I've noticed a lot lately.
A stream with so many piped operators that it isn't even funny anymore.
Let's look at the following stream: (*Note: this is a slightly modified stream from the file spoken of earlier, because I just can't come up with this stuff.*)

```typescript
this.childObject$ = merge(
    this.startFetch$.pipe(
        switchMap(_ => this.parentObject$),
        withLatestFrom(this.cancelled$),
        filter(([parentObject, cancelled]) => cancelled !== true),
        map(([parentObject, _]) => parentObject),
        filter(
            parentObject =>
            !isNullOrUndefined(parentObject) &&
            parentObject.subObjects.length > 0 &&
            parentObject.errors.findIndex(
                (error: parentObjectError) =>
                error.errorCause === parentObjectErrorCauseEnum.HEIGHT_EXCEEDED
            ) === -1
        ),
        withLatestFrom(this.collectionId$),
        switchMap(([parentObject, collectionId]) =>
            this.service.getChildObjectList(parentObject.subObjects[0].id, collectionId).pipe(
                catchError(error => {
                    console.log('error while retrieving second object list', error);
                    return EMPTY;
                }),
                take(1)
            )
        ),
        switchMap(childObjectList => {
            if (childObjectList && childObjectList.length > 0) {
                this.isLastChildObject$.next(childObjectList[0].isLast);
                if (isValidChildObject(childObjectList[0])) {
                    this.isFormValid$.next(true);
                } else {
                    this.isFormValid$.next(false);
                }
                return of(childObjectList);
            } else {
                this.startFetch$.next(null);
                return EMPTY;
            }
        }),
        map(childObjectList => childObjectList[0])
    ),
    this.startFetch$.pipe(mapTo(null))
).pipe(shareReplay({bufferSize: 1, refCount: true}));

this.childObject$.subscribe(childObject => console.log('Second object is', childObject);
this.isFormValid$.subscribe(isFormValid => console.log('Form valid?', isFormValid);
this.isLastChildObject$.subscribe(lastChildObject => console.log('Second object is last from list', lastChildObject);
```

Can anyone explain what is going on here?
If you're reading this blog than you probably have some experience with RxJS and probably understand the meaning of the operators used in this example.
And while it might be readable for an insightful developer, try to imagine a newbie getting thrown into a project where this is presented.
I bet they won't be very inspired or motivated to work on this.
When that happens, you have to split up the stream, just like you'd split up functions that get too big.
This might mean a bit more lines, but it would make the code a lot more readable.

```typescript
isParentObjectValid(parentObject) {
    return !isNullOrUndefined(parentObject) &&
        parentObject.subObjects.length > 0 &&
        parentObject.errors.findIndex(
            (error: parentObjectError) =>
            error.errorCause === parentObjectErrorCauseEnum.HEIGHT_EXCEEDED
        ) === -1;
}

getChildObjectList(subObjectId) {
    return this.collectionId$.pipe(
        take(1),
        switchMap(collectionId => this.service.getChildObjectList(subObjectId, collectionId)),
        catchError(error => {
            console.log('error while retrieving second object list', error);
            return EMPTY;
        }),
    )
}

getFirstItemFromChildObjectList(childObjectList) {
    if (childObjectList && childObjectList.length > 0) {
        this.isLastChildObject$.next(childObjectList[0].isLast);
        if (isValidChildObject(childObjectList[0])) {
            this.isFormValid$.next(true);
        } else {
            this.isFormValid$.next(false);
        }
        return of(childObjectList[0]);
    } else {
        this.startFetch$.next(null);
        return EMPTY;
    }
}

this.childObject$ = merge(
    this.startFetch$.pipe(
        switchMap(_ => this.parentObject$),
        withLatestFrom(this.cancelled$),
        filter(([parentObject, cancelled]) => !cancelled && isParentObjectValid(parentObject)),
        switchMap(([parentObject]) => getChildObjectList(parentObject.subObjects[0].id)),
        switchMap(childObjectList => getFirstItemFromChildObjectList(childObjectList))
    ),
    this.startFetch$.pipe(mapTo(null))
).pipe(shareReplay({bufferSize: 1, refCount: true}));

this.childObject$.subscribe(childObject => console.log('Second object is', childObject);
this.isFormValid$.subscribe(isFormValid => console.log('Form valid?', isFormValid);
this.isLastChildObject$.subscribe(lastChildObject => console.log('Second object is last from list', lastChildObject);
```

Now it's more possible to test various situations for each inner stream and mock the individual outcomes to be used in a test for the outer stream.
We can even move parts to separate files or classes, but for the sake of this example we'll keep everything together.
It's not yet perfect, but it gives some room to breathe.
At least we can now read quickly what the outer stream is supposed to do.
Notice that there are no longer pipe functions within other pipe functions.
This makes a stream more streamlined (pun intended, really).

> RULE: SPLIT UP YOUR STREAMS AND USE DECLARATIVE FUNCTIONS INSIDE THE OPERATORS

> RULE: TRY TO REDUCE THE USE OF PIPE INSIDE PIPE, UNLESS IT'S IN A SEPARATE FUNCTION

## Impurity and side effects

<p style="text-align: center;">
  <img alt="Boromir: One does not simply set a subject's next value inside a stream" src="{{ '/img/2019-04-15-Keep-your-RxJS-streams-from-bursting-their-banks/2y84y7.jpg' | prepend: site.baseurl }}" class="image fit-contain">
</p>

Pure functions are functions that will always return the same value for the same input parameters, keep state local and do not alter the input parameters.
In the previous example the created function **isParentObjectValid** is pure, but **getChildObjectList** and **getFirstItemFromChildObjectList** aren't.
Of course not everything can be written in only pure functions, but we should at least try as much as possible.
The same can apply for streams.
A "pure" stream is a stream which produces the same value for the same source, does not alter the source and produces no side effects.
This means that it should not set events on a different stream and should not set or read a value from outside its scope.
For example, the following blocks will do the same, but one keeps its state inside the Observable scope, which is safer.

```typescript
let _score = 0
const score$ = goals$.pipe(
    map(goalPoints => {
        _score += goalPoints;
        return _score;
    })
);

// Keeping state within the stream is better:

const betterScore$ = goals$.pipe(
    scan((totalScore, goalPoints) => totalScore + goalPoints, 0)
);
```

Notice the use of the `scan` operator instead of a `map`.
If you have side effects, you might be using the wrong operators.
More about that a bit later in this post.

I believe that a stream should always be a constant and never be reinitialized.
Luckily it's possible to create [custom pipe operators](https://github.com/ReactiveX/rxjs/blob/master/doc/pipeable-operators.md#build-your-own-operators-easily){:target="_blank" rel="noopener noreferrer"} for these situations.

Let's continue based on the example from the previous chapter:

```typescript
this.nonCancelledParentObject$ = this.parentObject$.pipe(this.onlyNonCancelledParentObject(this.cancelled$));
this.childObjectList$ = this.nonCancelledParentObject$.pipe(this.childObjectListForCollection(this.collectionId$));
this.firstItemOfChildObjectList$ = this.childObjectList$.pipe(this.selectFirstItemOfList);
this.isLastChildObject$ = this.firstItemOfChildObjectList$.pipe(this.isChildObjectLastInList);
this.isFormValid$ = this.firstItemOfChildObjectList$.pipe(this.isChildObjectValid);
this.startFetch$ = this.childObjectList$.pipe(this.isListEmpty);
this.childObject$ = this.firstItemOfChildObjectList$.pipe(this.createStreamOnTrigger(this.startFetch$));

onlyNonCancelledParentObject = (cancelled$) => (parentObject$) => {
    return parentObject$.pipe(
        withLatestFrom(cancelled$),
        filter(([parentObject, cancelled]) => !cancelled && isParentObjectValid(parentObject)),
        map(([parentObject]) => parentObject)
    );
}

childObjectListForCollection = (collectionId$) => (nonCancelledParentObject$) => {
    return nonCancelledParentObject$.pipe(
        take(1),
        map(parentObject => parentObject.subObjects[0].id),
        withLatestFrom(collectionId$)
        switchMap(([subObjectId, collectionId]) => this.service.getChildObjectList(subObjectId, collectionId)),
        catchError(error => {
            console.log('error while retrieving second object list', error);
            return EMPTY;
        })
    );
}

isListEmpty = filter(list => list && list.length > 0);

selectFirstItemOfList = (childObjectList$) => {
    return childObjectList$.pipe(
        filter(childObjectList => childObjectList && childObjectList.length > 0),
        map(childObjectList => childObjectList[0]),
        shareReplay({bufferSize: 1, refCount: true})
    );
}

isChildObjectLastInList = map(childObject => childObject.isLast);

isChildObjectValid = map(childObject => isValidChildObject(childObject));

createStreamOnTrigger = (trigger$) => (source$) => {
    return trigger$.pipe(
        switchMap(_ => source$.pipe(
            take(1),
            startWith(null))
        ),
        shareReplay({bufferSize: 1, refCount: true})
    );
}

this.childObject$.subscribe(childObject => console.log('Second object is', childObject);
this.isFormValid$.subscribe(isFormValid => console.log('Form valid?', isFormValid);
this.isLastChildObject$.subscribe(lastChildObject => console.log('Second object is last from list', lastChildObject);
```

Now almost every part of the stream is created using a pure function as pipe operator.
Just count the number of times the keyword **this** is used inside the functions (hint: we went from 10 times to only 1).
This could get even better if we pass the service's function as a parameter too.
Each of these custom operators can easily be tested with [marble testing](https://github.com/ReactiveX/rxjs/blob/master/docs_app/content/guide/testing/marble-testing.md){:target="_blank" rel="noopener noreferrer"}.
It's more readable, because now you can know for each stream how its values are determined.
For example, in line 5, we can already read that the **isFormValid** will be changed by a change of the first item in the list of ChildObjects and that it will react on the validity of that object.
We no longer need to sift through the code to find that out.

You'll notice that there are a lot of streams now.
Most of them are intermediary, so they could be scoped inside a different block.
Or they can be moved to separate files to keep the main file clean and the streams grouped by logical unit, but always keep subscriptions in your main file.
For the sake of this example I kept all streams together.

> RULE: INSTANTIATE YOUR STREAMS WITH PURE FUNCTIONS SO THEY CAN BE TESTED AND MOVED EASILY

> RULE: TRY TO ELIMINATE THE USE OF SUBJECTS

### Angular specific: handling @Input() properties

A common question I get with this approach is that some streams can not be defined until an **@Input()** property is set.
Ridiculous, there is no such thing as a "can not" in programming!
Consider this example:

```typescript
@Component({
  selector: 'greet',
  template: `<h1>{% raw %}{{ message }}{% endraw %}</h1>`
})
export class GreetingComponent implements OnInit, OnChanges {
  @Input() name: string;

  message: string;

  constructor(private service: APIService) { }

  ngOnInit() {
      this.service.getMessage(name)).subscribe(name => this.message = name);
  }

  ngOnChanges(changes: SimpleChanges) {
      if (changes['name'] && changes['name'].previousValue !== changes['name'].currentValue) {
          this.service.getMessage(changes['name'].currentValue).subscribe(name => this.message = name);
      }
  }
}
```

This can be also be written as following:

```typescript
@Component({
  selector: 'greet',
  template: `<h1>{% raw %}{{ message$ | async }}{% endraw %}</h1>`
})
export class GreetingComponent  {
  private name$ = new ReplaySubject<string>(1);
  @Input() set name(name: string) {
    this.name$.next(name);
  };

  message$ = this.createMessageStream(this.name$);

  constructor(private service: APIService) { }

  private createMessageStream(name$: Observable<string>) {
      return name$.pipe(
        distinctUntilChanged(),
        switchMap(name => this.service.getMessage(name))
      );
  }
}
```

> RULE: EVERYTHING CAN BE A STREAM

Though it doesn't always have to.

## I have no idea what I'm doing

<p style="text-align: center;">
  <img alt="Dog on computer: I have no idea what I'm doing" src="{{ '/img/2019-04-15-Keep-your-RxJS-streams-from-bursting-their-banks/dog.jpg' | prepend: site.baseurl }}" class="image fit-contain">
</p>

Last but not least, make sure you understand the flow of your streams.
If it gets too confusing, it will be a pain in the behind to find bugs or make changes without breaking something.
Before creating a stream, like anything in programming, analyse what your stream should exactly be doing.
Do this by drawing marble diagrams.
If multiple streams are needed, make a diagram for each stream and place them under each other.
Use marble testing to write easy to understand unit tests for streams.
In my experience, the package [rxjs-marbles](https://cartant.github.io/rxjs-marbles/){:target="_blank" rel="noopener noreferrer"} can help a lot with that.

```typescript
it('should emit parentObject only if not cancelled', marbles((m) => {
    isParentObjectValidSpy.mockImplementation((parentObj) => parentObj !== 'd');

    const parentObject  = m.hot('--^-a--b--c--d-|');
    const cancelled  =    m.hot('--^f-t---f-----|', {t: true, f: false});
    const subs =                  '^------------!';
    const expected  =             '--a-----c----|';

    const result = onlyNonCancelledParentObject(parentObject, cancelled);

    m.expect(result).toBeObservable(expected);
    m.expect(parentObject).toHaveSubscriptions(subs);
    m.expect(cancelled).toHaveSubscriptions(subs);
}));
```

> RULE: ANALYSE THE NEEDS OF YOUR STREAMS USING MARBLE DIAGRAMS

When you know what your stream should do, then it's time to build it.
There is a big amount of operators available in RxJS.
The most common are displayed in an interactive diagram at [rxmarbles.com](https://rxmarbles.com/){:target="_blank" rel="noopener noreferrer"}.

It's important that you know the differences between them.
Some examples:
There's a difference between using **mergeMap**, **switchMap**, **concatMap** and **exhaustMap** when making substreams.
There is a difference between using **combineLatest**, **withLatestFrom**, **zip** and **forkJoin** when combining streams.
There is also a subtle difference between **first** and **take(1)** when a stream would never emit a value and just complete:

```typescript
// This will output 'error: no elements in sequence'
EMPTY.pipe(first())
  .subscribe(
    event => console.log('event', event),
    error => console.log('error:', error.message),
    () => console.log('completed')
  );

// This will output 'completed'
EMPTY.pipe(take(1))
  .subscribe(
    event => console.log('event', event),
    error => console.log('error:', error.message),
    () => console.log('completed')
  );
```

The following guides can help to find which operators to use:

- [Which Operator to Use? - Creation Operators](http://xgrommx.github.io/rx-book/content/which_operator_do_i_use/creation_operators.html){:target="_blank" rel="noopener noreferrer"}
- [Which Operator to Use? - Instance Operators](http://xgrommx.github.io/rx-book/content/which_operator_do_i_use/instance_operators.html){:target="_blank" rel="noopener noreferrer"}

Once you know which operators to use, you can easily try out your stream using [StackBlitz](https://stackblitz.com/){:target="_blank" rel="noopener noreferrer"} or [Rx Visualizer](https://rxviz.com/){:target="_blank" rel="noopener noreferrer"}.

Don't forget you can [build your own operators easily](https://github.com/ReactiveX/rxjs/blob/master/doc/pipeable-operators.md#build-your-own-operators-easily){:target="_blank" rel="noopener noreferrer"} to combine or quickhand other operators.

> RULE: USE THE CORRECT PIPE OPERATORS

## Ending

That's all folks.
Some of these rules are opinionated, but I hope they will help some of you to write better RxJS streams.
Just remember: It's not because you know what you're doing that everyone knows what you're doing.
