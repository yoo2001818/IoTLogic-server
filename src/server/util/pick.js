export default function pick(original, fields, ignoreNull = false) {
  let output = {};
  fields.forEach(key => {
    if (original[key] == null && ignoreNull) return;
    output[key] = original[key];
  });
  return output;
}
