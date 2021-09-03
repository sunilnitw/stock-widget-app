/**
 * @param {Function} func
 * @param {number} delay
 */
export const debounce = (func, delay=500) => {
  let timerId = null, context = this;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
};
