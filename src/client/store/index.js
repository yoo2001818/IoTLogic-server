import { compose, createStore, applyMiddleware, combineReducers } from 'redux';

import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from '../middleware/promise';
import createLogger from 'redux-logger';
import apiMiddleware from '../middleware/api';
import normalizeMiddleware from '../middleware/normalize';
import injectReplaceMiddleware from '../middleware/injectReplace';
import injectAppendMiddleware from '../middleware/injectAppend';
import injectRelationMiddleware from '../middleware/injectRelation';

import reducers from '../reducer';

let logger;
if (__SERVER__ || !__DEVELOPMENT__) {
  logger = () => next => action => next(action);
} else {
  logger = createLogger();
}

export default function configureStore(initialState, client, appendage = []) {
  const reducer = combineReducers(reducers);
  const middlewares = applyMiddleware.apply(null, [
    thunkMiddleware,
    apiMiddleware(client),
    promiseMiddleware,
    normalizeMiddleware,
    injectReplaceMiddleware,
    injectAppendMiddleware,
    injectRelationMiddleware,
    logger
  ].concat(appendage));

  let createStoreWithMiddleware = middlewares(createStore);

  if (__CLIENT__ && __DEVELOPMENT__ && __DEVTOOLS__) {
    const { devTools, persistState } = require('redux-devtools');
    createStoreWithMiddleware = compose(
      middlewares,
      devTools(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(createStore);
  }

  return createStoreWithMiddleware(reducer, initialState);
}
