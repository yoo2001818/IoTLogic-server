// import merge from 'lodash/object/merge';

export default function entities(state = {
  users: {},
  documents: {},
  devices: {}
}, action) {
  if (action.payload && action.payload.entities) {
    const newState = Object.assign({}, state);
    for (let key in action.payload.entities) {
      const original = Object.assign({}, newState[key]);
      newState[key] = original;
      const target = action.payload.entities[key];
      for (let entity in target) {
        if (target[entity] == null) {
          original[entity] = target[entity];
          continue;
        }
        if (target[entity].deleted) {
          original[entity] = null;
          continue;
        }
        original[entity] = Object.assign({}, original[entity], target[entity], {
          loadedAt: new Date().valueOf()
        });
      }
    }
    return newState;
  }
  return state;
}
