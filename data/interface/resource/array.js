Array.prototype.max = function () {
  let i = 0;
  let s = 0;
  let l = this.length;
  //
  for (i = 0; i < l; i++) {
    s = this[i] > s ? this[i] : s;
  }
  //
  return s;
};

Array.prototype.average = function () {
  let i = 0;
  let s = 0;
  let l = this.length;
  //
  for (i = 0; i < l; i++) {
    s += this[i];
  }
  //
  return s / l;
};
