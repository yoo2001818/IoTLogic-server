/**
 * Builds the relation data from payload.body and meta
 */
export const injectRelationMiddleware = () => next => action => {
  if (action == null) return next(action);
  if (action.error) return next(action);
  const { payload, meta } = action;
  if (meta == null) return next(action);
  if (meta.relation == null) return next(action);
  if (meta.errors && Array.isArray(meta.errors) &&
    meta.errors.indexOf(payload.status) !== -1
  ) {
    return next(action);
  }
  const { relation } = meta;
  // Welcome to hard-coded hell??
  return next(Object.assign({}, action, {
    payload: {
      entities: {
        [relation[0]]: {
          [relation[1]]: {
            [relation[2]]: payload.body
          }
        }
      },
      result: relation[1]
    }
  }));
};

export default injectRelationMiddleware;
