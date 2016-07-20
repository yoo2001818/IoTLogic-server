export default function capitalize(str) {
  if (str == null || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}
