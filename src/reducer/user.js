import * as UserActions from '../action/user';
import { loadFilter } from './load';

const loadReducer = loadFilter(UserActions);

export default function user(state = {
  load: undefined,
  loaded: false,
  username: null
}, action) {
  const load = loadReducer(state.load, action);
  const newState = Object.assign({}, state, {
    load
  });
  const { type, payload, meta, error } = action;
  let username;
  if (payload) username = payload.result;
  switch (type) {
  case UserActions.FETCH:
    // If we have an error in this, we should consider this a fatal error
    if (error && payload.status !== 401) {
      return Object.assign({}, state, {error: true, loaded: true});
    }
    return Object.assign({}, newState, {
      loaded: true,
      username: error ? null : username
    });
  case UserActions.LOGIN:
    if (error) return state;
    return Object.assign({}, newState, {
      username
    });
  case UserActions.REGISTER:
    if (error) return state;
    return Object.assign({}, newState, {
      username
    });
  case UserActions.LOGOUT:
    if (error) return state;
    return { load, loaded: true, username: null };
  /*case SessionActions.SIGNUP_FINALIZE:
    if (error) return state;
    return Object.assign({}, newState, {
      login
    });
  case SessionActions.LOCAL_SIGNUP:
    if (error) return state;
    return Object.assign({}, newState, {
      login, method: Object.assign({}, state.method, {
        [meta.method]: Object.assign({}, state.method[meta.method], {
          inUse: true
        })
      })
    });
  case SessionActions.METHOD_FETCH:
    if (error) return state;
    return Object.assign({}, newState, {
      method: payload.body
    });
  case SessionActions.METHOD_DELETE:
    if (error) return state;
    return Object.assign({}, newState, {
      method: Object.assign({}, state.method, {
        [meta.method]: Object.assign({}, state.method[meta.method], {
          inUse: false
        })
      })
    });*/
  }
  return newState;
}
