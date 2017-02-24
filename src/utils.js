import mobx from 'mobx';

const getPayload = (change) => {
  const { added, addedCount, index, removed, removedCount } = change;
  return {
    index,
    added: added && mobx.toJS(added),
    addedCount,
    removed: removed && mobx.toJS(removed),
    removedCount
  };
};

export function createAction(name, change) {
  if (!change) { // is action
    return { type: name };
  }

  let action;
  if (typeof change.newValue !== 'undefined') {
    const key = typeof change.index !== 'undefined' ? change.index : change.name;
    action = { [key]: mobx.toJS(change.newValue) };
  } else {
    action = getPayload(change);
  }
  action.type = `┃ ${name}`;

  return action;
}

export function getName(obj) {
  if (!obj || !mobx.isObservable(obj)) return '';
  let r = mobx.extras.getDebugName(obj);
  let end = r.indexOf('.');
  if (end === -1) end = undefined;
  return r.substr(0, end);
}

/* eslint-disable no-param-reassign */
export const silently = (fn, store) => {
  store.__isRemotedevAction = true;
  fn();
  delete store.__isRemotedevAction;
};

function setValueAction(store, state) {
  silently(() => {
    if (store.importState) {
      store.importState(state);
    } else {
      Object.keys(state).forEach((key) => {
        store[key] = state[key];
      });
    }
  }, store);
  return state;
}
setValueAction.__isRemotedevAction = true;
export const setValue = mobx.action('@@remotedev', setValueAction);
/* eslint-enable */
