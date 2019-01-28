---
layout: post
authors: [tim_vierbergen]
title: 'Observables: The right way'
image: /img/2018-11-21-sse-spring-node-dev-ci/sse-front.png
tags: [Angular,rxjs,Observables,Nodejs]
category: Frontend
comments: true
---

# Table of contents
1. [Intro](#intro)
2. [Setup](#setup)
3. [Refactorin](#refactoring)
4. [Example](#example)

# Intro #

During my consultancy projects, I often come across the same implementations and problems when colleagues are trying to implement an observable strategy.
A lot of frameworks are offering observables out of the box for their communication layer.
Almost all `Promises` are replace by `Observables` nowadays.
Angular 2+ HttpModule, for example, is using the `rxjs` library.
Each \_http.get() is returning an `Observable<HttpResponse>`.

Almost always the setup is the same.
A (visual) component needs to render some data.
So next to the component (html/template for view, and a javascript(typescript) component as the controller), a service gets created.
This service's purpose is to provide data to the component's controller by calling the HttpClients functions (POST, GET, DELETE, PATCH, ...) and returning that `Observable` to the component.
Sometimes they are remapping the `Observable<HttpReponse>`to a more defined type, for example `Observable<MyData>`, by using one of the `rxjs` operators such as `flatmap`, `map`, ... .
All of this works pretty well, as long as only one component is in need of that data, and its changes.
By changes, I refer to refreshing the data, or requerying it with another filter.

<div style="text-align: center;" >
  <img src="/img/observables-the-right-way/first-step.png" width="60%">
</div>

Every time the query parameters change, the component is just executing the same call in the service, which is again calling the right `HttpClient`-function.
Again an (new) `Observable` is returned.
Again the result can get remapped before throttling it back.
The subscriber, the component controller in this case (or the html if you are using Angular's async pipe), is then receiving this remapped data.
What happens when we have another component that is in need of this data (or maybe a part of it).
Lets say we have a header and a datatable.
And we are NOT using push events, but simple rest calls.
The datatable is the component we were talking about earlier.
It needs to display messages in a simple datatable.
The header is the second component that needs this data.
It needs to display the number of unread or critical messages.

datatable.component.ts:
```javascript
this._dataService.get(this.filter).subscribe((page:Page) => {
	this.data = page.data;
})
```

header.component.ts:
```javascript
this._dataService.get(this.filter).subscribe((page:Page) => {
	this.count = page.number;
});
```
data.service.ts:
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

# Setup #

In our new setup, we want both, header and datatable, to subscribe to the same Observable, so a call for new data will result in an update in the datatable and the header.
To make this happen, we will use some kind of layer in between.
The layer will provide our components with one and only one and the same `Observable`.
Both components will subscribe to this component, so they both get updated by the same result.
We can do this by creating a simple `Subject` in our service and return that Subject as an Observable to our components.
We can then implement other calls for this service that will trigger an update of the data, and send it through this subject to both components.
Because we are not providing a filter when we call the getter for the `Observable` (Subject) we should also find a way of providing the filter to the service, before requerying the data.
This means we can/are going to use one shared filter, for both components, which makes sense in this case.

<div style="text-align: center;" >
  <img src="/img/observables-the-right-way/second-step.png" width="60%">
</div>


# Refactoring #

We actually don't need to refactor any of our components.
They will still subscribe to an `Observable` of the service, and react on the incomming data.
The service however will get refactored.
Start by defining the Subject as a local property, and because we are going to implement a getter, we can make it private.

data.service.ts
```javascript

private _data$: Subject<Page> = new BehavioralSubject<>({});
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
	); // and maybe unsubscribe or throw it way or make a Promise out of it
}

```

This way every component or service, that is subscribing on this subject, is getting data when some other component or service triggers the `reload`.
There are even a lot more options to this setup like:
* clearing
* resetting a default filter
* refreshing current filter
* caching data.
* manipulating data through other services or components
* ...


# Example #

<a target="_blank" href="https://gitlab.com/VeeTeeDev/observables-demo">Link to gitlab</a>

To run front and backend
`$ npm run start`

Don't mind the backend server, it's a quick and dirty nodejs express server.
