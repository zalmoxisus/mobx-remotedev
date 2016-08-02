import mobx from 'mobx';
import { createAction, getName } from './utils';
import { isFiltered } from './filters';
import { dispatchMonitorAction } from './monitorActions';

let isSpyEnabled = false;
const stores = {};
const onlyActions = {};
const filters = {};
const monitors = {};
const scheduled = [];
const children = {};

function configure(name, config) {
  if (!config) return;
  onlyActions[name] = config.onlyActions;
  filters[name] = config.filters;
}

function init(store, config) {
  const name = mobx.extras.getDebugName(store);
  configure(name, config);
  stores[name] = store;

  const devTools = window.devToolsExtension.connect(config);
  devTools.subscribe(dispatchMonitorAction(store, devTools, onlyActions[name]));
  monitors[name] = devTools;
}

function track(change) {
  if (change.type === 'splice') {
    const path = mobx.extras.getDebugName(change.object).split('.');
    const parent = path.shift();
    const { added } = change;
    if (Array.isArray(added)) {
      added.forEach((el, i) => {
        children[mobx.extras.getDebugName(el)] = {
          parent,
          path: [...path, i].join('.')
        };
      });
    }
  }
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
  let objPath;

  mobx.spy((change) => {
    if (change.spyReportStart) {
      objName = getName(change.object || change.target);
      if (change.type === 'reaction') {
        // TODO: show reactions
        schedule(objName);
        return;
      }
      if (!stores[objName] && children[objName]) {
        objPath = children[objName].path;
        objName = children[objName].parent;
      }
      if (!stores[objName] || stores[objName].__isRemotedevAction) {
        schedule(objName);
        return;
      }
      if (change.type === 'action') {
        const action = createAction(change.name, objPath);
        if (change.arguments && change.arguments.length) action.arguments = change.arguments;
        if (!onlyActions[objName]) {
          schedule(objName, { ...action, type: `┏ ${action.type}` });
          send();
          schedule(objName, { ...action, type: `┗ ${action.type}` });
        } else {
          schedule(objName, action);
        }
      } else if (change.type && mobx.isObservable(change.object)) {
        track(change);
        schedule(objName, !onlyActions[objName] && createAction(change.type, objPath, change));
      }
    } else if (change.spyReportEnd) {
      send();
    }
  });
}
