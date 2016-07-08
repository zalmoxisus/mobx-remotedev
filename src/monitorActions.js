import { parse } from 'jsan';

export const isMonitorAction = (store) => store.__isRemotedevAction === true;

export const dispatchMonitorAction = (store) => {
  return (message) => {
    if (message.type === 'DISPATCH') {
      if (message.payload.type === 'JUMP_TO_STATE') {
        const state = parse(message.state);
        store.__isRemotedevAction = true;
        Object.keys(state).forEach((key) => {
          store[key] = state[key]; // eslint-disable-line no-param-reassign
        });
        store.__isRemotedevAction = false;
      }
    }
  };
};
