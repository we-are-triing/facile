export const cookie = str =>
  str.split(';').reduce((a, n) => {
    const [prop, val] = n.trim().split('=');
    a[prop] = val;
    return a;
  }, {});
