import { parse } from 'jsan';
import { setValue } from './utils';

export const isMonitorAction = (store) => store.__isRemotedevAction === true;

export const dispatchMonitorAction = (store) => {
  return (message) => {
    if (message.type === 'DISPATCH') {
      if (message.payload.type === 'JUMP_TO_STATE') {
        store.__isRemotedevAction = true;
        setValue(store, parse(message.state));
        store.__isRemotedevAction = false;
      }
    }
  };
};
