import mobx from 'mobx';

export function createAction(name, isNative) {
  return {
    type: isNative ? `@@${name}` : name
  };
}

export function getName(obj) {
  if (!obj) return '';
  let r = mobx.extras.getDebugName(obj);
  let end = r.indexOf('.');
  if (end === -1) end = undefined;
  return r.substr(0, end);
}

export const setValue = mobx.action(function setValue(store, state) {
  if (store.importState) {
    store.importState(state);
  } else {
    Object.keys(state).forEach((key) => {
      store[key] = state[key]; // eslint-disable-line no-param-reassign
    });
  }
});
