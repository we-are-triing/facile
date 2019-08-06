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

// let start;
// let imm;

// export default (func, wait = 300, immediate = true) => function(...args) {
//   const context = this;
//   imm = immediate;
//   const step = ts => {
//     if(!start) start = ts;
//     const delta = ts - start;
//     if(delta < wait){
//       window.requestAnimationFrame(step);
//     }
//   }
// };
