const { stringify, parse } = JSON;

const setStorage = (key, value, { format } = {}) => {
  if (!window) return;
  window.localStorage.setItem(key, format ? stringify(value) : value);
};

const getStorage = (key, { format } = {}) => {
  if (!window) return;
  const value = window.localStorage.getItem(key);
  return format ? parse(window.localStorage.getItem(key)) : value;
};

const removeStorage = (key) => {
  if (!window) return;
  return localStorage.removeItem(key);
};

export { setStorage, getStorage, removeStorage };
