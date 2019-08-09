import random from '../isomorphic/random.js';

export default (elem, selector) => {
  const unique = random(12);
  elem.classList.add(unique);
  const list = [...elem.parentElement.querySelectorAll(`.${unique} > ${selector}`)];
  elem.classList.remove(unique);
  return list;
};
