// Session related actions come here
import { createAction } from 'redux-actions';
import { User } from '../schema/index';
import { api, GET, POST, DELETE } from '../middleware/api';

export const FETCH = 'user/fetch';
export const REGISTER = 'user/register';
export const LOGIN = 'user/login';
export const LOGOUT = 'user/logout';
export const SET_PROFILE = 'user/setProfile';
export const CHANGE_PASSWORD = 'user/changePassword';

export const fetch = createAction(FETCH,
  () => api(GET, '/user', {}),
  () => ({
    errors: [401],
    schema: User
  }));
export const register = createAction(REGISTER,
  credentials => api(POST, '/user/register', {
    body: credentials
  }),
  (_, meta) => Object.assign({}, meta, {
    schema: User
  }));
export const login = createAction(LOGIN,
  credentials => api(POST, '/user/login', {
    body: credentials
  }),
  (_, meta) => Object.assign({}, meta, {
    schema: User
  }));
export const logout = createAction(LOGOUT,
  () => api(DELETE, '/user', {}),
  (_, meta) => meta);

export const setProfile = createAction(SET_PROFILE,
  credentials => api(POST, '/user', {
    body: credentials
  }),
  (_, meta) => Object.assign({}, meta, {
    schema: User
  })
);
export const changePassword = createAction(CHANGE_PASSWORD,
  credentials => api(POST, '/user/password', {
    body: credentials
  }),
  (_, meta) => meta
);

export function load() {
  return (dispatch, getState) => {
    const user = getState().user;
    if (!user.loaded) return dispatch(fetch());
    return Promise.resolve();
  };
}
