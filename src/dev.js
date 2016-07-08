import mobx from 'mobx';
import spy from './spy';

export default function dev(store, config) {
  if (typeof window === 'undefined' || !window.devToolsExtension) return store;

  if (mobx.isObservable(store)) {
    spy(store, config);
  } else if (typeof store === 'function') {
    store = class extends store {
      constructor(...args) {
        super(...args);
        spy(this, config);
      }
    };
  } else {
    console.warn(`Passed ${typeof store} to mobx-remotedev, which is not an observable.`);
  }
  
  return store;
}
