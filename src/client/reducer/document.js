import * as DocumentActions from '../action/document';
import * as UserActions from '../action/user';
import { loadFilter } from './load';

const loadReducer = loadFilter(DocumentActions);

export default function device(state = {
  load: undefined,
  loaded: false,
  list: []
}, action) {
  const load = loadReducer(state.load, action);
  const newState = Object.assign({}, state, {
    load
  });
  const { type, payload, error } = action;
  switch (type) {
  case DocumentActions.FETCH_LIST:
    return Object.assign({}, newState, {
      loaded: true,
      list: error ? null : payload.result
    });
  case DocumentActions.CREATE:
    if (error) return state;
    return Object.assign({}, newState, {
      list: (state.list || []).concat(payload.result)
    });
  case DocumentActions.DOCUMENT_DELETE:
    if (error) return state;
    return Object.assign({}, newState, {
      list: (state.list || []).filter(v => v !== payload.result)
    });
  case UserActions.LOGIN:
  case UserActions.REGISTER:
  case UserActions.LOGOUT:
    if (error) return state;
    return Object.assign({}, newState, {
      loaded: false,
      list: []
    });
  }
  return newState;
}
