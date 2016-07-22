import './style/index.scss';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';

import { complete } from './action/init';

import routes from './view/routes';
import createStore from './store';
import { autoDetectLocale } from './lang';
import { superagentClient } from './util/apiClient';
import webSocketConnector from './middleware/webSocketConnector';
import webSocketHandler from './util/webSocketHandler';

import prefetch from './util/prefetch';

autoDetectLocale();

let store = createStore(undefined, superagentClient(), [
  routerMiddleware(browserHistory),
  webSocketConnector('ws://' + window.location.host + '/notifications',
    client => webSocketHandler(client, store)
  )
]);
const history = syncHistoryWithStore(browserHistory, store);

// If devTools is enabled, show popup.
if (__DEVTOOLS__) require('./utils/showDevTools').default(store);

// Create wrapper element...
let wrapper = document.createElement('div');
wrapper.className = 'appContainer';
document.body.appendChild(wrapper);

// Prefetch data..
function handleUpdate() {
  if (store.getState().init.loaded) {
    prefetch(store, this.state);
  } else {
    prefetch(store, this.state)
    .then(() => {
      store.dispatch(complete());
    });
  }
}

render(
  <Provider store={store}>
    <Router history={history} onUpdate={handleUpdate}>
      { routes }
    </Router>
  </Provider>,
  wrapper
);
