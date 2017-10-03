# Metisa: Personalization engine for websites

_Web Browser (Javascript) SDK for Metisa_

Metisa allows any website to implement personalization with a few lines of client side Javascript code.

This package is intended for use on the client side (i.e. web browser environment) and works with a Metisa account which can be created for free [here](https://askmetisa.com/create).

Features include:

* 'Things You May Like' widget
* 'Trending Items' widget
* 'New Items' widget
* 'Related Items' widget
* Send personalized emails to your customers
* Customer analytics including predictive CLV, predictive churn and customer personas
* Customer segmentation

This SDK is currently in Beta! Your feedback and comments are most welcome at hello@askmetisa.com.

## Demo

[Demo movie recommendations app](https://altitudelabs.github.io/metisa-js/demo-movie-app/)

The code that implements the movie recommendations app can be found in this repository in the [demo-movie-app folder](https://github.com/altitudelabs/metisa-js/tree/master/gh-page/demo-movie-app).

## Installation

Refer to articles in the Metisa Help Center:
* [Custom E-Commerce store](https://askmetisa.com/docs/integrations/custom-ecommerce.html)
* [Custom Media app (eg. Spotify or movie recommendations app)](https://askmetisa.com/docs/integrations/custom-media-app.html)

## Upcoming features

- Support for Node.js
- Support for React Native

## Development (for contributors only)

### Run it locally

1. Install packages

```
npm install
```

2. Run a local version with http-server

```
npm install -g http-server
cd gh-page/demo-movie-app
http-server .
```

### Updating all items

If you would like to update all items in Metisa (without visiting each `item.html` page), you can open the interactive console in `index.html` and run the function `updateAllItems()`.

### Browser SDK

1. open sample/browser/index.html from a browser
2. run build scripts
```
npm run build-browser:watch
```
this will watch for changes in `src` directory and rebuild `dist/browser.js`.
Refresh the browser to see the reflected change

### Nodejs SDK

`npm run node-sample`

### Documentation

`npm run build-doc:watch`

### Deploying Documentation

Prerequisite for this is [Gitbook CLI](https://www.npmjs.com/package/gitbook-cli)

After updating contents inside `/gh-page`, you can deploy by simply running
```
npm run deploy-gh-page
```

You will be able to see the documentation [here](https://altitudelabs.github.io/metisa-js/doc/), and the demo store [here](https://altitudelabs.github.io/metisa-js/demo-movie-app/)

### Folder structure

```
├── src
|   Source files for the SDK.
|   Development will mostly happen here
|   ├── Metisa
|   |   contains SDK files
|   |   ├── core.js
|   |   |   core API
|   |   ├── dom.js
|   |   |   extension of core.js
|   |   |   has dom specific apis
|   |   ├── index.js
|   |   |   entry file to import core api
|   ├── browser.js
|   |   entry file for browser sdk (script tag)
|   ├── node.js
|   |   entry file for node sdk
|   ├── util.js
├── dist
|   contains generated files
|   ├── browser.js
|   |   content for script tag
├── builders
|   contains scripts to build files into /dist
├── doc
|   Documentation for Metisa javascript sdk.
|   This directory will be used to deploy documentation to Github pages
├── gh-page
|   Directory deployed to Github Pages
|   contains `/doc` and `/demo-movie-app`
```
