import mobx from 'mobx';

export default function getDecorator(func) {
  return (storeOrConfig, config) => {
    if (typeof storeOrConfig === 'object' && !mobx.isObservable(storeOrConfig)) {
      return store => func(store, storeOrConfig);
    }
    return func(storeOrConfig, config);
  };
}
