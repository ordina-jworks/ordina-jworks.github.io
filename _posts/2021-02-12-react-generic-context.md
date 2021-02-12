---
layout: post
authors: [orjan_de_smet]
title: "Making a generic Context in React"
image: /img/react-generic-context/banner.jpg
tags: [React]
category: Architecture
comments: true
---

## A background
<img class="image fit center" alt="A picture of the Windows XP background" src="/img/react-generic-context/a-background.jpg">

I have been mostly working with Angular for the past 4 years.
I am, however, a firm believer that no one framework or library is better than all others and I love a sporadic challenging dive into the unknown.

Those who know a little bit about React will know that, like Angular, Vue and others, it’s a JavaScript library to create web applications by means of components.
These components are considered building blocks and can consist themselves of smaller components.
These components have properties, being passed by their parents and these properties can influence the rendered view and logic of the components.

Those with a bit more React experience, will know that in a larger tree of components, it’s a nuisance to get a property from a component near the root of the tree to a component near the leafs of the tree by simple property binding.
It also muddies intermediary components with irrelevant code.

Fortunately React includes **Context** [Docs](https://reactjs.org/docs/context.html){:target="_blank" rel="noopener noreferrer"}.
It provides a way to share value like preferences/themes and authentication data without having to explicitly set those values in each component’s properties.

The developer basically creates a `Context` variable which is provided by a container component (e.g. App) using a `Provider`, and can be consumed by other components  using either a `Consumer` or a `useContext` hook.

## The Challenge
<img class="image fit center" alt="A man reading a scroll with a quest on it" src="/img/react-generic-context/reading-a-scroll.jpg">

The official React documentation mentions that Context is a great use for keeping data about the authenticated user, so it looked like this was the way to go.

But we ran into a problem quite soon.
We currently use an Nx Workspace with multiple applications.
Some of these applications still use Basic Auth for authentication, while others use OpenID Connect.
Of course sooner or later, the Basic Auth applications will be converted to use OIDC too.
In the meantime, I wanted developers for these applications to be able to have the same structure, with the same basic components.
Knowing how it goes in the world of IT, and also as a challenge to myself I did an effort to make the eventual switch from Basic to OIDC as easy as possible for our developers and created an `authentication-core` library which would house the `AuthContext` and expose a `AuthProvider` and `AuthConsumer` components and a `useAuth` hook.
The libraries `authentication-basic` and `authentication-oidc` would have specific implementation of the service being used by the provider.
This way, it’s also future-proof for a crazy decision that would have us switch to another authentication system.

And this worked like a charm.
The developer only had to create an instance of the required service, and pass it to the `AuthProvider`component.

```typescript
// App.tsx
import React from 'react';
import { AuthProvider } from '@our-scope/authentication-core';
import { OidcProps, createOidcAuthService } from '@our-scope/authentication-oidc';
import { MyFirstComponent, MySecondComponent } from './Components';

const props: OidcProps = { ... };
const myAuthService = createOidcAuthService(props);

const App = () => {
  return (
    <AuthProvider authService={myAuthService}>
      <MyFirstComponent />
      <MySecondComponent />
    </AuthProvider>
  )
}

export default App;
```

He could then use `AuthConsumer` to wrap around the components where there was need for the authenticated user data.
Or use the `useAuth` hook to get the user data directly.

```typescript
// Components.tsx
import React from 'react';
import { AuthConsumer, useAuth } from '@our-scope/authentication-core';

export const MyFirstComponent = () => {
  return (
    <AuthConsumer>
    {(authData) => (
      <div>{authData.username}</div>
    )}
    </AuthConsumer>
  )
}

export const MySecondComponent = () => {
  const { authData } = useAuth();
  return (
    <div>{authData.displayName}</div>
  )
}
```
 
However, we noticed that the `AuthConsumer` and `useAuth` hook couldn’t infer the type of the user data.
Not all developers like TypeScript, but I love having it around, especially when creating libraries that are meant to be used by other developers.
No type on the authentication data could lead to bugs when switching implementations.

So back to the drawing board.
I did several attempts at making the functional component `AuthProvider` generic, but I was unable to get the `AuthContext` generic.
Mostly because the `AuthConsumer` and the `AuthProvider`  exposed by the core library had to point to a specific context object, so a function creating this context didn’t make sense.
My knowledge of React is still limited and I decided to call it a day and submit the merge request for review.

As I feared, type safety was a concern and had to be taken care of.
Luckily we have a team with members with a lot more React experience and they guided me to a solution.

## The Solution
<img class="image fit center" alt="A picture of the holy grail" src="/img/react-generic-context/the-grail.jpg">

When looking back, the solution is fairly simple, but elegant.
Instead of letting the core library expose actual components, we let it expose a factory function.
This factory function would create a context and in its turn call factory functions of each component and pass the context to it.
Finally the function would just return the created components.

```typescript
// authentication-core/context/AuthContext.tsx
import React from 'react';
import { AuthContextProps } from '../domain/auth-context';

interface AuthContextProps<T = unknown> {
  signIn: (args?: unknown) => Promise<void>;
  signOut: (args?: unknown) => Promise<void>;
  userData?: T | null;
  isExpired?: boolean;
  status: 'loading' | 'idle';
}

export function createAuthContext<T = unknown>() {
  return React.createContext<AuthContextProps<T> | null>(null);
}
```

```typescript
// authentication-core/factory.ts
import { createAuthConsumer } from './components/AuthConsumer';
import { createProtectedRoute } from './components/ProtectedRoute';
import { createWithAuth } from './components/withAuth';
import { createAuthContext } from './context/AuthContext';
import { createUseAuth } from './hooks/useAuth';
import { createAuthProvider } from './providers/AuthProvider';
import { AuthService } from './services/auth.service';

export function createAuthentication<T = unknown>(authService: AuthService<T>) {
  const AuthContext = createAuthContext<T>(); // We type the Context based on the generic AuthService
  const useAuth = createUseAuth(AuthContext);
  const AuthProvider = createAuthProvider(AuthContext, authService);
  const AuthConsumer = createAuthConsumer(AuthContext);
  return {
    AuthContext,
    AuthProvider,
    AuthConsumer,
    useAuth,
  };
}
```

The implementation libraries had to be adapted as well.
They too expose a factory function, calling the core factory function with some pre-setup data and their respective service.

```typescript
// authentication-oidc/factory.ts
import { createAuthentication } from '@our-scope/authentication-core';
import { OidcProps } from './domain/oidc-props';
import { OidcAuthService } from './services/oidc-auth.service';

export function createOidcAuthentication(oidcProps: OidcProps) {
  const oidcService = new OidcAuthService(oidcProps);
  return createAuthentication(oidcService);
}

```

Due to TypeScript's type inference, the resulting Authentication and its components will have the same type as OidcAuthService's implementation of AuthService.
Now the implementation for applications can use the factored and typed components instead of static components and the eventual switch from one implementation to another is as easy as ever.
The only changes which might have to be made to components, are for those components that actually consume an implementation-specific part of the user data.

```typescript
// auth.ts
// This is the only file to change when switching auth providers
import { createOidcAuthentication, OidcProps } from '@our-scope/authentication-oidc';

const config: OidcProps = { ... };

const { AuthProvider, AuthConsumer, useAuth } = createOidcAuthentication(config);
// const { AuthProvider, AuthConsumer, useAuth } = createBasicAuthentication();

export { AuthProvider, AuthConsumer, useAuth };
```

```typescript
// App.tsx
import React from 'react';
import { AuthProvider } from './auth';
import { MyFirstComponent, MySecondComponent } from './Components';

const App = () => {
  return (
    <AuthProvider>
      <MyFirstComponent />
      <MySecondComponent />
    </AuthProvider>
  )
}

export default App;
```

```typescript
// Components.tsx
import React from 'react';
import { AuthConsumer, useAuth } from './auth';

export const MyFirstComponent = () => {
  return (
    <AuthConsumer>
    {(authData) => ( // Now authData's type is inferred
      <div>{authData.username}</div>
    )}
    </AuthConsumer>
  )
}

export const MySecondComponent = () => {
  const { authData } = useAuth(); // Now authData's type is inferred
  return (
    <div>{authData.displayName}</div>
  )
}
```

## Conclusion
It’s great to not focus on one framework at the time, but this can confuse too.
Because of my background in Angular, I was trying to solve this problem like I would with Angular’s dependency injection.
Because components are just functions in React, they can be generic by themselves and typed using factory functions.
