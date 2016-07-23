import { createAction } from 'redux-actions';

export const REGISTER = 'console/register';
export const UNREGISTER = 'console/unregister';

export const register = createAction(REGISTER);
export const unregister = createAction(UNREGISTER);
