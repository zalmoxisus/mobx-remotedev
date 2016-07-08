import mobx from 'mobx';

export function createAction(name, isNative) {
  return {
    type: isNative ? `@@${name}` : name
  };
}

export function getName(obj) {
  let r = mobx.extras.getDebugName(obj);
  let end = r.indexOf('.');
  if (end === -1) end = undefined;
  return r.substr(0, end);
}
