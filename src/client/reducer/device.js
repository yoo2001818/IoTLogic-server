import * as DeviceActions from '../action/device';
import * as UserActions from '../action/user';
import { loadFilter } from './load';

const loadReducer = loadFilter(DeviceActions);

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
  if (action.error) return newState;
  switch (type) {
  case DeviceActions.FETCH_LIST:
    return Object.assign({}, newState, {
      loaded: true,
      list: error ? null : payload.result
    });
  case DeviceActions.DELETE_DEVICE:
    if (error) return state;
    return Object.assign({}, newState, {
      list: (state.list || []).filter(v => v.id !== payload.result.id)
    });
  case UserActions.LOGIN:
  case UserActions.REGISTER:
  case UserActions.LOGOUT:
    return Object.assign({}, newState, {
      loaded: false,
      list: []
    });
  }
  return newState;
}
