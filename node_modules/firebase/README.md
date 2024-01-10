<!-- BADGES -->
![Build Status](https://img.shields.io/github/workflow/status/firebase/firebase-js-sdk/Run%20All%20Tests.svg)
[![Version](https://img.shields.io/npm/v/firebase.svg?label=version)](https://www.npmjs.com/package/firebase)
[![Coverage Status](https://coveralls.io/repos/github/firebase/firebase-js-sdk/badge.svg?branch=master)](https://coveralls.io/github/firebase/firebase-js-sdk?branch=master)
<!-- END BADGES -->

# Firebase - App success made simple

## Upgrade to Version 9
Version 9 has a redesigned API that supports tree-shaking. Read the [Upgrade Guide](https://firebase.google.com/docs/web/modular-upgrade) to learn more.

## Overview

[Firebase](https://firebase.google.com) provides the tools and infrastructure
you need to develop, grow, and earn money from your app. This package supports
web (browser), mobile-web, and server (Node.js) clients.

For more information, visit:

- [Firebase Realtime Database](https://firebase.google.com/docs/database/web/start) -
  The Firebase Realtime Database lets you store and query user data, and makes
  it available between users in realtime.
- [Cloud Firestore](https://firebase.google.com/docs/firestore/quickstart) -
  Cloud Firestore is a flexible, scalable database for mobile, web, and server
  development from Firebase and Google Cloud Platform.
- [Firebase Storage](https://firebase.google.com/docs/storage/web/start) -
  Firebase Storage lets you upload and store user generated content, such as
  files, and images.
- [Cloud Functions for Firebase](https://firebase.google.com/docs/functions) -
   Cloud Functions for Firebase is a serverless framework that lets you automatically run backend code in response to events triggered by Firebase features and HTTPS requests.
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging/js/client) -
  Firebase Cloud Messaging is a cross-platform messaging solution that lets you
  reliably deliver messages at no cost.
- [Firebase Performance Monitoring](https://firebase.google.com/docs/perf-mon/get-started-web) -
  Firebase Performance Monitoring helps you gain insight into your app's performance issues.
- [Google Analytics](https://firebase.google.com/docs/analytics/get-started?platform=web) -
  Google Analytics is a free app measurement solution that provides insight on app usage and user engagement.
- [Remote Config](https://firebase.google.com/docs/remote-config/get-started?platform=web) -
  Firebase Remote Config is a cloud service that lets you change the behavior and appearance of your 
  app without requiring users to reload your app.
- [App Check](https://firebase.google.com/docs/app-check/web/recaptcha-provider) -
  App Check helps protect your backend resources from abuse, such as billing fraud and phishing. It 
  works with both Firebase services and your own backends to keep your resources safe.
- [Create and setup your account](https://firebase.google.com/docs/web/setup) -
  Get started using Firebase for free.

This SDK is intended for end-user client access from environments such as the
Web, mobile Web (e.g. React Native, Ionic), Node.js desktop (e.g. Electron), or
IoT devices running Node.js. If you are instead interested in using a Node.js
SDK which grants you admin access from a privileged environment (like a server),
you should use the
[Firebase Admin Node.js SDK](https://firebase.google.com/docs/admin/setup/).

### Install the SDK

Install the Firebase NPM module:
```
$ npm init
$ npm install --save firebase
```

### Use Firebase in your app

1. Initialize Firebase in your app and create a Firebase App object:
```js
import { initializeApp } from 'firebase/app';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  //...
};

const app = initializeApp(firebaseConfig);
```

2. Access Firebase services in your app

Firebase services (like Cloud Firestore, Authentication, Realtime Database, Remote Config, and more) are available to import within individual sub-packages.

The example below shows how you could use the Cloud Firestore Lite SDK to retrieve a list of data.

```js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  //...
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get a list of cities from your database
async function getCities(db) {
  const citiesCol = collection(db, 'cities');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  return cityList;
}
```

### Use a module bundler for size reduction

The Firebase Web SDK is designed to work with module bundlers to remove any
unused code (tree-shaking). We strongly recommend using this approach for
production apps. Tools such as the [Angular CLI](//angular.io/cli),
[Next.js](//nextjs.org/), [Vue CLI](//cli.vuejs.org/), or [Create
React App](//reactjs.org/docs/create-a-new-react-app.html) automatically
handle module bundling for libraries installed through npm and imported into
your codebase.

See [Using module bundlers with Firebase](/docs/web/module-bundling) for more information.

### Script include
You can also load Firebase packages as script modules in browsers that support native ES modules.

```html
<!-- use script module by specifying type="module" -->
<script type="module">
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app.js';
    import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-firestore-lite.js';
    // Follow this pattern to import other Firebase services
    // import {} from "https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-analytics.js";
    // import {} from "https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app-check.js";
    // import {} from "https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-auth.js";
    // import {} from "https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-functions.js";
    // import {} from "https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-firestore.js";
    // import {} from "https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-storage.js";
    // import {} from "https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-performance.js";
    // import {} from "https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-remote-config.js";
    // import {} from "https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-messaging.js";
    // import {} from "https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-database.js";
    
    // TODO: Replace the following with your app's Firebase project configuration
    const firebaseConfig = {
    //...
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Get a list of cities from your database
    async function getCities(db) {
    const citiesCol = collection(db, 'cities');
    const citySnapshot = await getDocs(citiesCol);
    const cityList = citySnapshot.docs.map(doc => doc.data());
    return cityList;
    }
</script>
```

_Note: To get a filled in version of the above code snippet, go to the
[Firebase console](https://console.firebase.google.com/) for your app and click on "Add
Firebase to your web app"._

## Get the code (Node.js - server and command line)

### Install the SDK

While you can write entire Firebase applications without any backend code, many
developers want to write server applications or command-line utilities using the
Node.js JavaScript runtime.

You can use the same npm module to use Firebase in the Node.js runtime (on a
server or running from the command line):

```
$ npm init
$ npm install --save firebase
```

In your code, you can access Firebase using:

```js
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
// ...
```

If you are using native ES6 module with --experimental-modules flag (or Node 12+)
you should do:

```js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
// ...
```

Please see [Environment Support](https://firebase.google.com/support/guides/environments_js-sdk) for which packages
are available in Node.js.

## Compat packages
Version 9 provides a set of compat packages that are API compatible with Version 8. They are intended to
be used to make the upgrade to the modular API easier by allowing you to upgrade your app piece by piece.
See the [Upgrade Guide](https://firebase.google.com/docs/web/modular-upgrade) for more detail.

To access the compat packages, use the subpath `compat` like so:
```js
// v9 compat packages are API compatible with v8 code
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
```

## Changelog

The Firebase changelog can be found at
[firebase.google.com](https://firebase.google.com/support/release-notes/js).

## Browser/environment compatibility

Please see [Environment Support](https://firebase.google.com/support/guides/environments_js-sdk).