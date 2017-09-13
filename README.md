# Metisa JS

_JS sdk for Metisa API_

You can find our official documentation [here](https://altitudelabs.github.io/metisa-js/)

**Supports:**
- Browser

**Upcoming features**
- Support for Node.js
- Support for React Native

### For Developers

**Folder structure**

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
├── sample
|   Sample environments for demo test
|   ├── node
|   |   sample node express server that imports metisa for node
|   ├── browser
|   |   sample static html files
|   |   imports metisa for browser via script tag
├── dist
|   contains generated files
|   ├── browser.js
|   |   content for script tag
├── builders
|   contains scripts to build files into /dist
├── deploy
|   deploy scripts
├── doc
|   Documentation for Metisa javascript sdk.
|   This directory will be used to deploy documentation to Github pages
```

**Run it locally**

first run `npm install`

*Browser SDK*
1. open sample/browser/index.html from a browser
2. run build scripts
```
npm run build-browser:watch
```
this will watch for changes in `src` directory and rebuild `dist/browser.js`.
Refresh the browser to see the reflected change

*Nodejs SDK*

`npm run node-sample`

*Documentation*

`npm run build-doc:watch`


**Deploying Documentation**

Prerequisite for this is [Gitbook CLI](https://www.npmjs.com/package/gitbook-cli)

After updating documentation under `/doc`, you can deploy by simply running
```
npm run deploy-doc
```
You will be able to see the reflected changes [here](https://altitudelabs.github.io/metisa-js/).
