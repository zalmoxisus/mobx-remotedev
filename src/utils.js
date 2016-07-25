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
    action = { [change.name]: mobx.toJS(change.newValue) };
  } else {
    action = getPayload(change);
  }
  action.type = `┃ ${name}`;

  return action;
}

export function getName(obj) {
  if (!obj) return '';
  let r = mobx.extras.getDebugName(obj);
  let end = r.indexOf('.');
  if (end === -1) end = undefined;
  return r.substr(0, end);
}

/* eslint-disable no-param-reassign */
function setValueAction(store, state) {
  store.__isRemotedevAction = true;
  if (store.importState) {
    store.importState(state);
  } else {
    Object.keys(state).forEach((key) => {
      store[key] = state[key];
    });
  }
  delete store.__isRemotedevAction;
}
setValueAction.__isRemotedevAction = true;
export const setValue = mobx.action(setValueAction);
/* eslint-enable */
