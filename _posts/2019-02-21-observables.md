---
layout: post
authors: [tim_vierbergen]
title: 'Observables: The right way'
image: /img/observables-the-right-way/cover.png
tags: [Angular, RxJS, Observables, Node.js]
category: Frontend
comments: true
---

# Table of contents
1. [Intro](#intro)
2. [Setup](#setup)
3. [Refactoring](#refactoring)
4. [Example](#example)
4. [Conclusion](#conclusion)

# Intro

During my consultancy projects, I often come across the same implementations and problems when colleagues are trying to implement an observable strategy.
A lot of frameworks are offering observables out of the box for their communication layer.
Almost all `Promises` are replaced by `Observables` nowadays.
Angular 2+ `HttpModule` for example, is using the `rxjs` library.
Each `http.get()` is returning an `Observable<HttpResponse>`.

The setup is almost always the same.
A (visual) component needs to render some data.
So next to the component (HTML/template for view, and a JavaScript(TypeScript) component as the controller), a service gets created.
This service's purpose is to provide data to the component's controller by calling the `HttpClient`'s functions (POST, GET, DELETE, PATCH, ...) and returning the `Observable` to the component.
Sometimes they are remapping the `Observable<HttpReponse>`to a more defined type, for example `Observable<MyData>`, by using one of the `rxjs` operators such as `flatmap`, `map`, ... .
All of this works pretty well, as long as only one component is in need of the data and its changes.
With changes, I refer to refreshing the data, or requerying it with another filter, paging, or ...

<div style="text-align: center;" >
  <img src="/img/observables-the-right-way/first-step.png" width="75%">
</div>

Every time the query parameters change, the component is just executing the same call in the service, which in turn is calling the right `HttpClient`-function.
Again an (new) `Observable` is returned.
Again the result can get remapped before throttling it back.
The subscriber, the component controller in this case (or the HTML if you are using Angular's async pipe), receives the remapped data.

What happens when we have another component that is in need of this data (or maybe just a part of it)?
Let's say we have a header and a datatable.
And we are NOT using push events, but simple REST calls (for the sake of this explanation).
The datatable is the component we were talking about earlier.
It needs to display messages in a simple datatable.
The header is the second component that needs this data.
It needs to display the number of unread or critical messages.

`datatable.component.ts`
```javascript
this._dataService.get(this.filter).subscribe((page:Page) => {
	this.data = page.data;
})
```

`header.component.ts`
```javascript
this._dataService.get(this.filter).subscribe((page:Page) => {
	this.count = page.number;
});
```

`data.service.ts`
```javascript
public get(filter?: Filter): Observable<Page> {
	return this._http.get('urlToData' + this.parseFilterToString(filter)).pipe(
		tap((data) => this.logService.log(data)),
		map((response) => {
			let page: Page = new Page();
			page.data = response.body;
			page.number = response.headers.get('x-count');
		})
	);
}
```

In the setup we have so far, both components will use the same service for requesting the data.
They will both subscribe to an `Observable`, however, it will be a different one.
When you refresh the data in the datatable, the header will not receive a new value in its subscription and therefore will still show the old number of messages.

In some use cases this might be the desired outcome, but in most cases you want more components to be able to subscribe to the same `Observable`.

# Setup

In our new setup, we want both, header and datatable, to subscribe to the same Observable, so a call for new data will result in an update in the datatable and the header.
To make this happen, we will use some kind of layer in between them.
This new layer will provide our components with one and only one and the same `Observable` and will mask the communication layer from the view's controller.
Both components will subscribe to this service, so they both get updated with the same result.
We can do this by creating a simple `Subject` in our service and returning it as an `Observable` to our components.
We can then implement other calls for this service that will trigger an update of the data, and send it through the subject to both components.
Because we are not providing a filter when we call the getter for the `Observable` (`Subject`) we should also find a way of providing the filter to the service, before requerying the data.
This means we are going to use one shared filter, for both components, which makes sense in this case, but not in all use cases.

<div style="text-align: center;" >
  <img src="/img/observables-the-right-way/second-step.png" width="75%">
</div>


# Refactoring

We actually don't need to refactor any of our components.
They will still subscribe to an `Observable` of the service, and react on the incoming data.
The service however will get refactored.
Start by defining the `Subject` as a local property, and because we are going to implement a getter, we can make it private.

`data.service.ts`
```javascript

private _data$: Subject<Page> = new BehaviorSubject<>({});
...

public data(): Observable<Page> {
	return this._data$ as Observable<Page>;
}

...

public reload(): void {
	this._http.get('urlToData' + this.parseFilterToString(this._filter)).pipe(
		tap((data) => this.logService.log(data)),
		map((response) => {
			let page: Page = new Page();
			page.data = response.body;
			page.number = response.headers.get('x-count');
		}).subscribe((page: Page) => {
			this._data$.next(page);
		})
	);
}

```

This way, every component or service that is subscribing on this subject, is getting data when some other component or service triggers the `reload`.
There are even a lot more options to this setup:
* Clearing data
* Resetting to default filter
* Refreshing the current filter
* Caching data
* Manipulating data through other services or components
* Adding an event consumer that also updates the datatable
* ...


# Example

I've build a simple example to demonstrate this behaviour.
A header that is displaying an alert icon when there are unread, critical messages.
A sidebar that is displaying the amount of unread messages next to its navigation link, and an overview of the messages, with a basic paging implementation.

<div style="text-align: center;" >
  <img src="/img/observables-the-right-way/example.png" width="100%">
</div>

A simple backend that is written in Node.js with Express provides a few endpoints:
* `api/message` (with paging and filter, although the filter isn't implemented in the frontend example.)
* `api/message/:id` (not used in the example)
* `api/stream`
* `api/refresh`

The service is not reloading data as long as the `page` or the `filter` hasn't changed.
While the service is still loading the data, a new reload will not fetch again the data.
You can find the code on <a target="_blank" href="https://gitlab.com/VeeTeeDev/observables-demo">GitLab</a>.

<div style="text-align: center;" >
  <img src="/img/observables-the-right-way/example-setup.png" width="75%">
</div>


Server-Sent Events are added to update the `read` status of a message when the envelope gets clicked.
This will also trigger the observable.

To run front- and backend together, execute the following command in the root of the project:

```$ npm run start```
This way, a proxy is added to the `serve` command to overcome `CORS` blocking going from localhost:4200 to localhost:3000


Don't mind the backend server, it's a quick and dirty solution and is not implemented as it should.

# Conclusion

Although observables are a great feature, and are easy to use, it's always better to have your own layer of control.
Especially when it comes to using observables from frameworks.
I can accept, for simple applications, that you don't want to 'over-architect'.
But in most cases, you want to control the distribution yourself.
For those of you that know `Redux` (RxJS), you can compare this implementation with effects and `store`-subscriptions.
If you trigger an effect, you will only see the result when you have subscribed to the 'key' that is responsible for providing you with the data,
and not to the 'key' that is responsible for triggering the effect.
