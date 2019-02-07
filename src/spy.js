import * as mobx from 'mobx';
import { connectViaExtension } from 'remotedev';
import { createAction, getName } from './utils';
import { isFiltered } from './filters';
import { dispatchMonitorAction } from './monitorActions';

let isSpyEnabled = false;
let fallbackStoreName;
const stores = {};
const onlyActions = {};
const filters = {};
const monitors = {};
const scheduled = [];

function configure(name, config = {}) {
  if (typeof config.onlyActions === 'undefined') {
    onlyActions[name] = mobx._getGlobalState && mobx._getGlobalState().enforceActions;
  } else {
    onlyActions[name] = config.onlyActions;
  }
  if (config.filters) filters[name] = config.filters;
  if (config.global) {
    if (fallbackStoreName) throw Error('You\'ve already defined a global store');
    fallbackStoreName = name;
  }
}

function init(store, config) {
  const name = mobx.getDebugName(store);
  configure(name, config);
  stores[name] = store;

  const devTools = connectViaExtension(config);
  devTools.subscribe(dispatchMonitorAction(store, devTools, onlyActions[name]));
  monitors[name] = devTools;
}

function schedule(name, action) {
  let toSend;
  if (action && !isFiltered(action, filters[name])) {
    toSend = () => { monitors[name].send(action, mobx.toJS(stores[name])); };
  }
  scheduled.push(toSend);
}

function send() {
  if (scheduled.length) {
    const toSend = scheduled.pop();
    if (toSend) toSend();
  }
}

export default function spy(store, config) {
  init(store, config);
  if (isSpyEnabled) return;
  isSpyEnabled = true;
  let objName;

  mobx.spy((change) => {
    if (change.spyReportStart) {
      objName = getName(change.object || change.target);
      if (change.type === 'reaction') {
        // TODO: show reactions
        schedule(objName);
        return;
      }
      if (!stores[objName]) objName = fallbackStoreName;
      if (!stores[objName] || stores[objName].__isRemotedevAction) {
        schedule(objName);
        return;
      }
      if (change.fn && change.fn.__isRemotedevAction) {
        schedule(objName);
        return;
      }
      if (change.type === 'action') {
        const action = createAction(change.name);
        if (change.arguments && change.arguments.length) action.arguments = change.arguments;
        if (!onlyActions[objName]) {
          schedule(objName, { ...action, type: `┏ ${action.type}` });
          send();
          schedule(objName, { ...action, type: `┗ ${action.type}` });
        } else {
          schedule(objName, action);
        }
      } else if (change.type && mobx.isObservable(change.object)) {
        schedule(objName, !onlyActions[objName] && createAction(change.type, change));
      }
    } else if (change.spyReportEnd) {
      send();
    }
  });
}
