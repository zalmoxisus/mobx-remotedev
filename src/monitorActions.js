import mobx from 'mobx';
import { stringify, parse } from 'jsan';
import { setValue } from './utils';

export const isMonitorAction = (store) => store.__isRemotedevAction === true;

function dispatchRemotely(store, { type, arguments: args }) {
  if (!store[type]) {
    console.error(`Function '${type}' doesn't exist`);
    return;
  }
  store[type](...args);
}

export const dispatchMonitorAction = (store, devTools) => {
  const initValue = mobx.toJS(store);
  devTools.init(initValue);

  return (message) => {
    if (message.type === 'DISPATCH') {
      switch (message.payload.type) {
        case 'RESET':
          devTools.init(setValue(store, initValue));
          return;
        case 'COMMIT':
          devTools.init(mobx.toJS(store));
          return;
        case 'ROLLBACK':
          devTools.init(setValue(store, parse(message.state)));
          return;
        case 'JUMP_TO_STATE':
          setValue(store, parse(message.state));
          return;
      }
    } else if (message.type === 'ACTION') {
      dispatchRemotely(store, message.payload);
    }
  };
};
