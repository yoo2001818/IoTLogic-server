// Initialization related actions come here
import { createAction } from 'redux-actions';

export const COMPLETE = 'init/complete';

export const complete = createAction(COMPLETE);
