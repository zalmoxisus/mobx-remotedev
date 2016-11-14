import mobx from 'mobx';
import spy from './spy';
import getDecorator from './getDecorator';

function dev(store, config) {
  if (
    (!config || !config.remote) && (typeof window === 'undefined' || !window.devToolsExtension)
  ) {
    return store;
  }

  if (mobx.isObservable(store)) {
    spy(store, config);
  } else if (typeof store === 'function') {
    /* eslint-disable no-param-reassign */
    if (!config) config = {};
    if (!config.name) config.name = store.name;
    store = class extends store {
      constructor(...args) {
        super(...args);
        spy(this, config);
      }
    };
    /* eslint-enable */
  } else {
    console.warn(`Passed ${typeof store} to mobx-remotedev, which is not an observable.`);
  }

  return store;
}

export default getDecorator(dev);
