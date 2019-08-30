---
layout: post
authors: [orjan_de_smet]
title: "Include library assets into applications inside an Angular workspace"
image: /img/2019-09-09-angular-include-assets-libraries/tpryd.jpg
tags: [Angular, Builders, Assets, Library, Monorepo]
category: Architecture
comments: true
---

With Angular 6, which has now been released ages ago, workspaces were introduced.
This meant that a repository could include multiple applications and libraries, eventually building a monorepository.
I welcomed this change, as it meant that all applications in one repository could be kept up to date easily and more.
But I'm not here to talk about all the advantages and disadvantages of a monorepo.
Instead I'd like to talk about one specific challenge with this type of repository.

## How to include assets used by libraries

There are multiple solutions to this problem.
But not all solutions match all criteria for a good architecture.
These criteria are:

- Assets should exist only once, preferably in the project that utilizes them.
- An update on an asset should trigger the rebuild of all those applications depending on the library using the asset, and only those.
- A dependency on another library should be added with minimal change and with minimal affected projects.

I haven't worked with many monorepo tools, other than Nrwl/nx, so I will base my definition of affected projects on that.
Nrwl/nx uses a dependency graph to determine the affected projects.
In short: if a library has a changed file, then all projects that import this library (either directly or lazy-loaded) are affected.
This works recursively, so the projects that import those projectes are also affected and so on.
Some files, like package.json and angular.json have implicitDependencies set to "*", which means a change in those files will regard all projects in the workspace as affected.

These are the solutions (in order) I've gone through to tackle this exact problem for a monorepo I'm currently managing.

*Note: In that monorepo the focus was on json-files with translations used for @ngx-translate, but in my examples here I will use images.*
*In the example the application, my-app, only depends on the library neighbourhood-dogs-lib and should only display a picture of my dog and Pete's dog, but not of Karen's cat.*

### Solution 1 - Assets in the application source

```
├─ 📂apps
│  └─ 📂my-app
│     ├─ 📂src
│     │  ├─ 📂assets
│     │  │  └─ 📂images
│     │  │     ├─ 🖼my-dog.jpg
│     │  │     └─ 🖼pete-dog.jpg
│     │  ├─ 📂app
│     │  │  └─ ...
│     │  ├─ 📄index.html
│     │  └─ ...
│     └─ ...
└─ 📂libs
   ├─ 📂neighbourhood-dogs-lib
   │  ├─ 📂src
   │  │  ├─ 📂lib
   │  │  │  ├─ 📄dog-list.component.ts
   │  │  │  └─ 📄dog.component.ts
   │  │  └─ ...
   │  └─ ...
   └─ 📂neighbourhood-cats-lib
      ├─ 📂src
      │  ├─ 📂lib
      │  │  ├─ 📄cat-list.component.ts
      │  │  └─ 📄cat.component.ts
      │  └─ ...
      └─ ...
```

I call this solution the "I'll figure it out later"-solution.
The main idea was to set aside this problem because other tasks had higher priority, the monorepo wasn't nearly as big as it is now.
Basically the assets used by a library were put in the assets folder of the application's source directory.
This meant that the build of an application would simply include these assets out of the box.
This is fine for a single application, but as soon as a second application (let's say, neighbourhood-animals-app) was to use this library, it, too, would need a copy of those assets in its source directory.
A change to one of the assets would also mean that two applications would need this change, which is prone to being forgotten.
Moreover the image of Karen's cat is nowhere to be found because at this time, no application needs it.

As for the criteria:

<table>
    <tbody>
        <tr>
            <td>Assets should exist only once, preferably in the project that utilizes them.</td>
            <td style="width: 70px">❌</td>
        </tr>
        <tr>
            <td>An update on an asset should trigger the rebuild of all those applications depending on the library using the asset, and only those.</td>
            <td style="width: 70px">⚠️*</td>
        </tr>
        <tr>
            <td>A dependency on another library should be added with minimal change and with minimal affected projects.</td>
            <td style="width: 70px">⚠️**</td>
        </tr>
    </tbody>
</table>

*Kind of, if I don't forget to copy our assets
**Depends on the amount applications that need these extra assets

### Solution 2 - Shared assets directory

```
├─ 📂apps
│  └─ 📂my-app
│     ├─ 📂src
│     │  ├─ 📂app
│     │  │  └─ ...
│     │  ├─ 📄index.html
│     │  └─ ...
│     └─ ...
├─ 📂libs
│  ├─ 📂neighbourhood-dogs-lib
│  │  ├─ 📂src
│  │  │  ├─ 📂lib
│  │  │  │  ├─ 📄dog-list.component.ts
│  │  │  │  └─ 📄dog.component.ts
│  │  │  └─ ...
│  │  └─ ...
│  └─ 📂neighbourhood-cats-lib
│     ├─ 📂src
│     │  ├─ 📂lib
│     │  │  ├─ 📄cat-list.component.ts
│     │  │  └─ 📄cat.component.ts
│     │  └─ ...
│     └─ ...
└─ 📂shared-assets
   └─ 📂images
      ├─ 🖼my-dog.jpg
      ├─ 🖼pete-dog.jpg
      └─ 🖼karen-cat.jpg
```

This is the "Share everything"-solution. It was created to solve the main fault of the previous, namely that assets could exist twice.
Another important aspect here was to reduce the amount of times that angular.json would be changed when more assets from another library would be added.
Because angular.json implicitly affects all projects, this file should be kept untouched as much as possible.
So a one-time change was made to let the projects in angular.json include these shared assets:

```json
{
    "glob": "**/*",
    "input": "./shared-assets/images",
    "output": "./assets/images"
}
```

Unfortunately this meant that all assets from all libraries would be added to those applications, which increases the bundle size significantly.
Another disadvantage is that the Nx dependency graph could not link changes in this directory with their corresponding libraries, unless every single file was mentioned in nx.json with an implicit dependency for that library.
Ironically, this solves criteria 3 perfectly, because nothing is affected, so that's the bare minimum.

Going back through the criteria:

<table>
    <tbody>
        <tr>
            <td>Assets should exist only once, preferably in the project that utilizes them.</td>
            <td style="width: 70px">⚠️*</td>
        </tr>
        <tr>
            <td>An update on an asset should trigger the rebuild of all those applications depending on the library using the asset, and only those.</td>
            <td style="width: 70px">❌</td>
        </tr>
        <tr>
            <td>A dependency on another library should be added with minimal change and with minimal affected projects.</td>
            <td style="width: 70px">✅</td>
        </tr>
    </tbody>
</table>

*There are no longer duplicate assets, but they're not part of the project that utilizes them

### Solution 3 - Custom Angular builders

A solution I came across was to copy the assets after a build into the dist-folder using a script in the package.json file, but for obvious reasons that wouldn't work easily when managing different apps.
Neither would it work with the dev-server, so I didn't even go there.
Including assets by adding them to the build target's assets array is how Angular itself prescribes to solve this problem, so let's keep that.
However, I still wanted to change the angular.json file (and other files) as minimally as possible.

Enter Angular 8 and the stable version of the CLI Builder API!

```
├─ 📂apps
│  └─ 📂my-app
│     ├─ 📂src
│     │  ├─ 📂assets
│     │  │  └─ 📄include.json
│     │  ├─ 📂app
│     │  │  └─ ...
│     │  ├─ 📄index.html
│     │  └─ ...
│     └─ ...
└─ 📂libs
   ├─ 📂neighbourhood-dogs-lib
   │  ├─ 📂src
   │  │  ├─ 📂assets
   │  │  │  └─ 📂images
   │  │  │     ├─ 🖼my-dog.jpg
   │  │  │     └─ 🖼pete-dog.jpg
   │  │  ├─ 📂lib
   │  │  │  ├─ 📄dog-list.component.ts
   │  │  │  └─ 📄dog.component.ts
   │  │  └─ ...
   │  └─ ...
   └─ 📂neighbourhood-cats-lib
      ├─ 📂src
      │  ├─ 📂assets
      │  │  └─ 📂images
      │  │     └─ 🖼karen-cat.jpg
      │  ├─ 📂lib
      │  │  ├─ 📄cat-list.component.ts
      │  │  └─ 📄cat.component.ts
      │  └─ ...
      └─ ...
```

Using this new API, I was able to construct 2 new builders to replace the default `@angular-devkit/build-angular:browser` and `@angular-devkit/build-angular:dev-server` while still utilizing them.
These custom builders take the same options as the ones they replace and work more like a hook than a new builder.
The idea is to update the build target in the in-memory workspace before the default builder is actually executed.
Simply put, the custom builders read angular.json, update the assets array and pass the updated version to the original builders.
A single configuration file (include.json in the application's assets directory) lets the custom builder read which libraries the application depends on.
It then determines its source directory using the workspace configuration file (angular.json) and adds the following to the assets array:

```json
{
    "glob": "**/*",
    "input": "./libs/neighbourhood-dogs-lib/src/assets",
    "output": "./assets"
}
```

If I wanted my-app to also include the neighbourhood's cats, then I could change include.json to also include `neighbourhood-cats-lib` and the next build would add the follow to the assets array:

```json
{
    "glob": "**/*",
    "input": "./libs/neighbourhood-dogs-lib/src/assets",
    "output": "./assets"
},
{
    "glob": "**/*",
    "input": "./libs/neighbourhood-cats-lib/src/assets",
    "output": "./assets"
}
```

Though I'd rather set the option that these assets are placed in subFolders, so I added that into the builders too.
That made the assets array into the following, which prevents libs from overwriting other assets:

```json
{
    "glob": "**/*",
    "input": "./libs/neighbourhood-dogs-lib/src/assets",
    "output": "./assets/neighbourhood-dogs-lib"
},
{
    "glob": "**/*",
    "input": "./libs/neighbourhood-cats-lib/src/assets",
    "output": "./assets/neighbourhood-cats-lib"
}
```

*Note: The reason this include.json file is in the assets directory was to make a custom HttpTranslateLoader (using a simple RxJS mergeMap and forkJoin) read that same file to determine which translation assets to download.*

Let's go through the criteria 1 more time:

<table>
    <tbody>
        <tr>
            <td>Assets should exist only once, preferably in the project that utilizes them.</td>
            <td style="width: 70px">✅</td>
        </tr>
        <tr>
            <td>An update on an asset should trigger the rebuild of all those applications depending on the library using the asset, and only those.</td>
            <td style="width: 70px">✅*</td>
        </tr>
        <tr>
            <td>A dependency on another library should be added with minimal change and with minimal affected projects.</td>
            <td style="width: 70px">✅</td>
        </tr>
    </tbody>
</table>

*Because the assets are inside the library's directory, the dependency graph can detect a change and determine the affected applications

There is one caveat though: the dependency graph will only detect dependencies if the library is also imported in the code of the application, which would be the case mostly.
If that's not the case (for example if the library containing assets has no components/services/modules/...), simply create an empty module in it and import it in the applications that depend on these assets.

## Sharing is caring

Because I care about the community I packaged this solution and published it to npm.
It's called `ngx-library-assets` and is available at [https://www.npmjs.com/package/ngx-library-assets](https://www.npmjs.com/package/ngx-library-assets).
Install it as a devDependency.

*Disclaimer: I do not actually own a dog, or a cat. Neither do Pete and Karen. I don't even have any neighbours named Pete or Karen.*
