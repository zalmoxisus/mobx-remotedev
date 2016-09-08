import { observable, action, extras, useStrict, runInAction } from 'mobx';
import remotedev from '../../../src/dev'; // import remotedev from 'mobx-remotedev/lib/dev';

useStrict(true);

const appState = observable({
  count: 0
});

appState.increment = action(function increment() { appState.count++; });
appState.decrement = action(function decrement() { appState.count--; })
appState.incrementAsync = action(function incrementAsync() {
  setTimeout(() => {
    runInAction('Timeout increment', () => { appState.count++; }, this);
  }, 1000);
});


export default remotedev(appState);
