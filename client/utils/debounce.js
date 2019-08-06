export default (func, wait = 300, immediate = false) =>
  function(...args) {
    f = () => func.apply(this, args);
    imm = immediate;
    if (immediate && !timeout) f();
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };

let timeout;
let imm;
let f;

const later = () => {
  timeout = null;
  if (!imm) f();
};
