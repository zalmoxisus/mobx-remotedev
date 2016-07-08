import mobx from 'mobx';
import { createAction, getName } from './utils';

let devTools;
let isSpyEnabled = false;
const stores = {};
const scheduled = {};

function init(store, config) {
  const name = mobx.extras.getDebugName(store);
  stores[name] = store;
  scheduled[name] = [];

  devTools = window.devToolsExtension.connect({ ...config, shouldStringify: true });
  devTools.init(mobx.toJS(store));
}

function schedule(name, action) {
  if (!scheduled[name]) return;
  scheduled[name].push(() => {
    devTools.send(action, mobx.toJS(stores[name]));
  });
}

function send(name) {
  const toSend = scheduled[name];
  if (!toSend) return;
  while(toSend.length) {
    toSend.shift()();
  }
}

export default function spy(store, config) {
  init(store, config);
  if (isSpyEnabled) return;
  isSpyEnabled = true;
  let objName;

  mobx.spy((change) => {
    if (change.spyReportStart) {
      if (change.type === 'reaction') return; // TODO: show reactions
      objName = getName(change.object || change.target);
      if (change.type === 'action') {
        if (change.target !== store) return;
        const action = createAction(change.name);
        if (change.arguments && change.arguments.length) action.arguments = change.arguments;
        schedule(objName, action);
      } else if (change.type && mobx.isObservable(change.object)) {
        schedule(objName, createAction(change.type, true));
      }
    } else if (change.spyReportEnd) {
      send(objName);
    }
  });
};
