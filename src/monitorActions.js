import { parse } from 'jsan';
import { setValue } from './utils';

export const isMonitorAction = (store) => store.__isRemotedevAction === true;

/* eslint-disable no-param-reassign */
export const dispatchMonitorAction = (store) => (message) => {
  if (message.type === 'DISPATCH') {
    if (message.payload.type === 'JUMP_TO_STATE') {
      store.__isRemotedevAction = true;
      setValue(store, parse(message.state));
      store.__isRemotedevAction = false;
    }
  }
};
/* eslint-enable */
