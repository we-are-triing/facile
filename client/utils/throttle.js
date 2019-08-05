export default (func, wait = 100) => {
  let allow = true,
    first = true;
  return function() {
    if (allow) {
      const args = arguments,
        context = arguments[0] ? arguments[0].target : this;

      const setAllow = () => {
        allow = true;
        func.apply(context, args);
      };
      if (first) func.apply(context, args);
      first = allow = false;
      setTimeout(setAllow, wait);
    }
  };
};
