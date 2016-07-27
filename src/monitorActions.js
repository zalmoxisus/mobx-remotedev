import mobx from 'mobx';
import { stringify, parse } from 'jsan';
import { silently, setValue } from './utils';

export const isMonitorAction = (store) => store.__isRemotedevAction === true;

function dispatchRemotely(store, { type, arguments: args }) {
  if (!store[type]) {
    console.error(`Function '${type}' doesn't exist`);
    return;
  }
  store[type](...args);
}

function toggleAction(store, id, strState) {
  const liftedState = parse(strState);
  const idx = liftedState.skippedActionIds.indexOf(id);
  const skipped = idx !== -1;
  const start = liftedState.stagedActionIds.indexOf(id);
  if (start === -1) return liftedState;

  setValue(store, liftedState.computedStates[start - 1].state);
  for (let i = (skipped ? start : start + 1); i < liftedState.stagedActionIds.length; i++) {
    if (
      i !== start && liftedState.skippedActionIds.indexOf(liftedState.stagedActionIds[i]) !== -1
    ) continue; // it's already skipped
    silently(() => {
      dispatchRemotely(store, liftedState.actionsById[liftedState.stagedActionIds[i]].action);
    }, store);
    liftedState.computedStates[i].state = mobx.toJS(store);
  }

  if (skipped) {
    liftedState.skippedActionIds.splice(idx, 1);
  } else {
    liftedState.skippedActionIds.push(id);
  }
  return liftedState;
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
        case 'TOGGLE_ACTION':
          devTools.send(null, toggleAction(store, message.payload.id, message.state));
          return;
      }
    } else if (message.type === 'ACTION') {
      dispatchRemotely(store, message.payload);
    }
  };
};
