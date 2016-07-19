import { createAction } from 'redux-actions';

export const OPEN = 'modal/open';
export const CLOSE = 'modal/close';

export const open = createAction(OPEN,
  data => data
);

export const close = createAction(CLOSE);

export function answer(choice) {
  return (dispatch, getState) => {
    const { modal } = getState();
    let action = modal.choices[choice].action;
    if (action) {
      if (Array.isArray(action)) {
        action.forEach(a => dispatch(a));
      } else {
        dispatch(action);
      }
    }
    dispatch(close());
  };
}
