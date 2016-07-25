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
const remotedevId = '__Remotedev';

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
  devTools.subscribe(dispatchMonitorAction(store, devTools));
  monitors[name] = devTools;
}

function schedule(action) {
  function toSend(name) {
    if (!action || isFiltered(action, filters[name])) return;
    monitors[name].send(action, mobx.toJS(stores[name]));
  }
  scheduled.push(toSend);
}

function send(name) {
  while (scheduled.length) {
    let toSend = scheduled.shift();
    toSend(name);
  }
}

export default function spy(store, config) {
  init(store, config);
  mobx.reaction(getName(store)+remotedevId, () => mobx.toJS(store), () => {});
  if (isSpyEnabled) return;
  isSpyEnabled = true;
  let objName;

  mobx.spy((change) => {
    if (!change.spyReportStart) return;
    objName = getName(change.object || change.target);
    if (stores[objName] && stores[objName].__isRemotedevAction) return;
    if (change.fn && change.fn.__isRemotedevAction) return;
    if (change.type === 'reaction') {
      objName = objName.replace(remotedevId, '');
      if (stores[objName]) send(objName);
      return; // TODO: show reactions
    }
    if (change.type === 'action') {
      const action = createAction(change.name);
      if (change.arguments && change.arguments.length) action.arguments = change.arguments;
      schedule(action);
    } else if (change.type && mobx.isObservable(change.object)) {
      schedule(!onlyActions[objName] && createAction(change.type, change));
    }
  });
}
