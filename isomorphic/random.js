export default (length, isAlphaNumeric) => {
  if (typeof length !== 'number' || length < 1) {
    throw new Error('length should be a valid number greater than or equal to 1');
  }

  const randomchar = i => {
    const rn = Math.random();
    const gn = Math.floor(rn * 122);
    //i > 0 so that the first char is always a letter
    if (gn > 0 && gn < 10 && isAlphaNumeric && i > 0) {
      return gn;
    } else if (gn < 91) {
      return String.fromCharCode(gn > 64 ? gn : 65 + Math.floor(rn * 26));
    } else if (gn > 90) {
      return String.fromCharCode(gn > 96 && gn < 123 ? gn : 97 + Math.floor(rn * 26));
    }
  };

  let s = '';
  for (let i = 0; i < length; i++) {
    s += randomchar(i);
  }

  return s;
};
