export default function(func, wait = 100, immediate = false) {
  let timeout;
  return function(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    if (immediate && !timeout) {
      func.apply(this, args);
    }
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
