import { COMPLETE } from '../action/init';

export default function init(state = {
  loaded: false
}, action) {
  const { type } = action;
  switch (type) {
  case COMPLETE:
    return Object.assign({}, state, {
      loaded: true
    });
  }
  return state;
}
