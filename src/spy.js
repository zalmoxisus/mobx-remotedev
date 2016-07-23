import mobx from 'mobx';
import { createAction, getName } from './utils';
import { dispatchMonitorAction } from './monitorActions';

let isSpyEnabled = false;
const stores = {};
const monitors = {};
const scheduled = [];

function init(store, config) {
  const name = mobx.extras.getDebugName(store);
  stores[name] = store;

  const devTools = window.devToolsExtension.connect(config);
  devTools.init(mobx.toJS(store));
  devTools.subscribe(dispatchMonitorAction(store));
  monitors[name] = devTools;
}

function schedule(name, action) {
  scheduled.push(() => {
    monitors[name].send(action, mobx.toJS(stores[name]));
  });
}

function send() {
  if (scheduled.length) {
    scheduled.pop()();
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
      if (!stores[objName] || stores[objName].__isRemotedevAction) return;
      if (change.type === 'action') {
        const action = createAction(change.name);
        if (change.arguments && change.arguments.length) action.arguments = change.arguments;
        schedule(objName, action);
      } else if (change.type && mobx.isObservable(change.object)) {
        schedule(objName, createAction(change.type, change));
      }
    } else if (change.spyReportEnd && stores[objName]) {
      send();
    }
  });
}
