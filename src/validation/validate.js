import validator from 'validator';

function normalizeValidation(validation) {
  if (validation.value) return validation;
  return {
    key: true,
    value: validation
  };
}

function runValidation(key, args, value) {
  // currently only supports:
  // is, isURL, isEmail, len, notEmpty, notIn
  switch (key) {
  case 'is':
    if (!validator.matches(value, args.value)) return args.key;
    break;
  case 'isURL':
    if (!validator.isURL(value) && !validator.isNull(value)) return args.key;
    break;
  case 'isEmail':
    if (!validator.isEmail(value) && !validator.isNull(value)) return args.key;
    break;
  case 'len': {
    const [min, max] = args.value;
    if (!validator.isLength(value, min, max)) return args.key;
    break;
  }
  case 'notEmpty':
    if (validator.isNull(value)) return args.key;
    break;
  case 'notIn':
    if (validator.isIn(value, args.value)) return args.key;
    if (typeof value === 'string' &&
      validator.isIn(value.toLowerCase(), args.value)) return args.key;
    break;
  case 'isInt':
    if (!validator.isInt(value) && !validator.isNull(value)) return args.key;
  }
  return null;
}

// Run validations from the data
export default function validate(data, schema, detailed = false) {
  if (schema == null) return {};
  let errors = {};
  for (let key in schema) {
    let validation = schema[key];
    let value = data[key];
    for (let check in validation) {
      if (validation[check] == null) continue;
      let args = normalizeValidation(validation[check]);
      const result = runValidation(check, args, value || '');
      if (result !== null) {
        if (detailed) {
          errors[key] = {
            name: result,
            value: args.value
          };
        } else {
          errors[key] = result;
        }
      }
    }
  }
  return errors;
}

// Run validation, return only one error.
export function validateSingle(data, schema) {
  let result = validate(data, schema);
  for (let key in result) {
    if (result[key] !== false) {
      return {
        field: key,
        type: result[key]
      };
    }
  }
  return null;
}
