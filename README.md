Remote debugging for MobX with [Redux DevTools extension](https://github.com/zalmoxisus/redux-devtools-extension) (and [remotedev](https://github.com/zalmoxisus/remotedev) coming soon) 

![Demo](demo.gif) 

## Installation

#### 1. Get the extension
##### 1.1 For Chrome
 - from [Chrome Web Store](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
 - or build it with `npm i & npm run build:extension` and [load the extension's folder](https://developer.chrome.com/extensions/getstarted#unpacked) `./build/extension`
 - or run it in dev mode with `npm i & npm start` and [load the extension's folder](https://developer.chrome.com/extensions/getstarted#unpacked) `./dev`.

##### 1.2 For Firefox
 - from [AMO](https://addons.mozilla.org/en-US/firefox/addon/remotedev/)
 - or build it with `npm i & npm run build:firefox` and [load the extension's folder](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Temporary_Installation_in_Firefox) `./build/firefox`.

##### 1.3 For Electron
  - just specify `REDUX_DEVTOOLS` in [`electron-devtools-installer`](https://github.com/GPMDP/electron-devtools-installer).

##### 1.4 For other browsers, for React Native, hybrid, desktop and server side apps
  - Use [remotedev.io](http://remotedev.io/local/) or if you have the extension select `Remote DevTools` from the context menu. Just specify `remote` parameter, and optionally `hostname` and `port`. [See the API](https://github.com/zalmoxisus/mobx-remotedev#remotedevstore-config) for details. 

#### 2. Install the library

```
npm install --save mobx-remotedev
```

## Usage

```js
import remotedev from 'mobx-remotedev';
// or import remotedev from 'mobx-remotedev/lib/dev'
// in case you want to use it in production or don't have process.env.NODE_ENV === 'development'

const appStore = observable({
  // ...
});

// Or
class appStore {
	// ...
}

export default remotedev(appStore);
```

Or as ES decorator:

```js
import remotedev from 'mobx-remotedev';

@remotedev(/*{ config }*/)
export default class appStore {
	// ...
}
```

See [counter](https://github.com/zalmoxisus/mobx-remotedev/blob/master/examples/counter/stores/appState.js), [simple-todo](https://github.com/zalmoxisus/mobx-remotedev/blob/master/examples/simple-todo/index.js) and [todomvc](https://github.com/zalmoxisus/mobx-remotedev/tree/master/examples/todomvc/src/stores) examples.

## API
#### `remotedev(store, [config])`
  - arguments
    - **store** *observable or class* to be monitored. In case you want to change its values (to time travel or cancel actions), you should export its result as in the example above (so we can extend the class). 
    - **config** *object* (optional as the parameters bellow)
      - **name** *string* - the instance name to be showed on the monitor page. Default value is document.title.
      - **onlyActions** *boolean* - set it to `true` to have a clear log only with actions. If MobX is in strict mode, it is `true` by default. Don't forget about [async actions](https://github.com/zalmoxisus/mobx-remotedev#how-to-handle-async-actions).
      - **global** *boolean* - set it to `true` in order to assign dispatching of all unhandled actions to this store. Useful for nested classes / observables or when having async actions without specifying the `scope` explicitly. 
      - **filters** *object* - map of arrays named `whitelist` or `blacklist` to filter action types. You can also set it globally in the extension settings.
        - **blacklist** *array of (regex as string)* - actions to be hidden in DevTools.
        - **whitelist** *array of (regex as string)* - all other actions will be hidden in DevTools (the `blacklist` parameter will be ignored).
      - **remote** *boolean* - set it to `true` to have remote monitoring via the local or `remotedev.io` server. `remote: false` is used for [the extension](https://github.com/zalmoxisus/redux-devtools-extension) or [react-native-debugger](https://github.com/jhen0409/react-native-debugger)
      - **hostname** *string* - use to specify host for [`remotedev-server`](https://github.com/zalmoxisus/remotedev-server). If `port` is specified, default value is `localhost`.
      - **port** *number* - use to specify host's port for [`remotedev-server`](https://github.com/zalmoxisus/remotedev-server).

Also see [the extension API](https://github.com/zalmoxisus/redux-devtools-extension#documentation) and [my presentation at React Europe](https://youtu.be/YU8jQ2HtqH4).

## Exclude / include DevTools in production builds

By default use
```js
import remotedev from 'mobx-remotedev';
```

It will work only when `process.env.NODE_ENV === 'development'`, otherwise the code will be stripped.

In case you want to use it in production or cannot set `process.env.NODE_ENV`, use
```js
import remotedev from 'mobx-remotedev/lib/dev';
```
So, the code will not be stripped from production bundle and you can use the extension even in production. It wouldn't affect the performance for end-users who don't have the extension installed. 

## FAQ

### How to monitor (show changes) for inner items

Use `remotedev` function for them as well. [Example](https://github.com/zalmoxisus/mobx-remotedev/blob/master/examples/simple-todo/index.js#L22) 

### How to set data correctly when time traveling

By default it will try to set the properties of the class or observable object, but, if you have an `importState` method, it will be used. [Example](https://github.com/zalmoxisus/mobx-remotedev/blob/master/examples/todomvc/src/stores/TodoStore.js#L56)

### How to disable computations when time traveling

Check `__isRemotedevAction` of your class or observable object, which will be set to true when it's a monitor action. [Example](https://github.com/zalmoxisus/mobx-remotedev/blob/master/examples/todomvc/src/stores/TodoStore.js#L22)  

### How to handle async actions

Use `runInAction` and don't forget about the second / third parameter which will be `this` if you're using arrow functions. If you don't want to specify it, set the `global` parameter to `true`. [Example](https://github.com/zalmoxisus/mobx-remotedev/blob/master/examples/counter/stores/appState.js#L14)  

### How to show actions for nested classes / observables

Just set the `global` parameter to `true` like `remotedev(store, { global: true })`. If you want more details about the nested tree, see [#5](https://github.com/zalmoxisus/mobx-remotedev/pull/5).  

## LICENSE

[MIT](LICENSE)

## Created By

If you like this, follow [@mdiordiev](https://twitter.com/mdiordiev) on twitter.
