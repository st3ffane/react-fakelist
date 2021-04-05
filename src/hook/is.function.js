// simple check for function type, inspired by lodash
const isFunction = (obj) => {
  return !!(obj && obj.constructor && obj.call && obj.apply);
}
export default isFunction;