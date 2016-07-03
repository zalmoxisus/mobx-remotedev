import { observable, action, extras } from 'mobx';

const appState = observable({
  count: 0
});

appState.increment = action(function increment() { appState.count++; });
appState.decrement = action(function decrement() { appState.count--; });

export default appState;
