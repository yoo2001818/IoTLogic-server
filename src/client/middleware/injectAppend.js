import merge from 'lodash.merge';
/**
 * Replaces 'payload.entities' to 'meta.append' if it has succeded.
 */
export const injectAppendMiddleware = () => next => action => {
  if (action == null) return next(action);
  if (action.error) return next(action);
  const { payload, meta } = action;
  if (meta == null) return next(action);
  if (meta.append == null) return next(action);
  if (meta.errors && Array.isArray(meta.errors) &&
    meta.errors.indexOf(payload.status) !== -1
  ) {
    return next(action);
  }
  return next(Object.assign({}, action, {
    payload: Object.assign({}, payload, {
      entities: merge(Object.assign({}, payload.entities), meta.append)
    })
  }));
};

export default injectAppendMiddleware;
