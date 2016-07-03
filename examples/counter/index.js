import React from 'react';
import { render } from 'react-dom';
import Counter from './components/Counter';
import appState from './stores/appState';

render(
  <Counter store={appState} />,
  document.getElementById('root')
);
