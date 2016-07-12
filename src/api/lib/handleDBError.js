import errorCode from '../../util/errorCode';
export default function handleDBError(error, req, res, next) {
  if (error.name === 'SequelizeValidationError' ||
    error.name === 'SequelizeUniqueConstraintError'
  ) {
    // Show a more friendly error message for validation failures
    let validation = error.errors[0];
    let field = validation.path;
    let type = validation.message;
    if (validation.type === 'notNull Violation') {
      type = 'FIELD_REQUIRED';
    } else if (validation.type === 'unique violation') {
      type = 'FIELD_CONFLICT';
    }
    if (type === 'FIELD_CONFLICT') {
      res.status(409);
    } else {
      res.status(400);
    }
    return res.json(Object.assign({}, errorCode.validation,
      { field, type }));
  } else {
    console.log(error);
    next(error);
  }
}
