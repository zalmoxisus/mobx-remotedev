import { observable, action, extras } from 'mobx';
import remotedev from 'mobx-remotedev';

const appState = observable({
  count: 0
});

appState.increment = action(function increment() { appState.count++; });
appState.decrement = action(function decrement() { appState.count--; });

export default remotedev(appState);
