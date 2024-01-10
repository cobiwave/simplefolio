"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BitSet = void 0;
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32#implementing_count_leading_ones_and_beyond
function ctz32(n) {
  if (n === 0) {
    return 32;
  }
  return 31 - Math.clz32(n & -n);
}
class BitSet {
  constructor(maxBits) {
    this.bits = new Uint32Array(Math.ceil(maxBits / 32));
  }
  clone() {
    let res = new BitSet(this.capacity);
    res.bits.set(this.bits);
    return res;
  }
  static union(a, b) {
    let res = a.clone();
    res.union(b);
    return res;
  }
  get capacity() {
    return this.bits.length * 32;
  }
  add(bit) {
    this.bits[bit >>> 5] |= 1 << (bit & 31);
  }
  delete(bit) {
    this.bits[bit >>> 5] &= ~(1 << (bit & 31));
  }
  has(bit) {
    return Boolean(this.bits[bit >>> 5] & 1 << (bit & 31));
  }
  empty() {
    for (let k = 0; k < this.bits.length; k++) {
      if (this.bits[k] !== 0) {
        return false;
      }
    }
    return true;
  }
  clear() {
    this.bits.fill(0);
  }
  intersect(other) {
    for (let i = 0; i < this.bits.length; i++) {
      this.bits[i] &= other.bits[i];
    }
  }
  union(other) {
    for (let i = 0; i < this.bits.length; i++) {
      this.bits[i] |= other.bits[i];
    }
  }
  remove(other) {
    for (let i = 0; i < this.bits.length; i++) {
      this.bits[i] &= ~other.bits[i];
    }
  }
  forEach(fn) {
    // https://lemire.me/blog/2018/02/21/iterating-over-set-bits-quickly/
    let bits = this.bits;
    for (let k = 0; k < bits.length; k++) {
      let v = bits[k];
      while (v !== 0) {
        let t = (v & -v) >>> 0;
        // $FlowFixMe
        fn((k << 5) + ctz32(v));
        v ^= t;
      }
    }
  }
}
exports.BitSet = BitSet;