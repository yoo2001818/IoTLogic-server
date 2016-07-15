// Load related actions come here
import { createAction } from 'redux-actions';

export const LOAD = 'load/load';
export const COMPLETE = 'load/complete';
export const ERROR_DISMISS = 'load/errorDismiss';

export const load = createAction(LOAD);
export const complete = createAction(COMPLETE);
export const errorDismiss = createAction(ERROR_DISMISS);
