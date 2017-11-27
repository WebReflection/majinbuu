/*! Copyright (c) 2017, Andrea Giammarchi, @WebReflection */

// grid operations
const DELETE = 'del';
const INSERT = 'ins';
const SUBSTITUTE = 'sub';

// typed Array
const TypedArray = typeof Int32Array === 'function' ? Int32Array : Array;

// shortcuts
const { min, sqrt } = Math;

const majinbuu = (from, to, MAX_SIZE) => {

  if(from === to) {
    //# same arrays. Do nothing
    return;
  }

  const fromLength = from.length;
  const toLength = to.length;
  const SIZE = MAX_SIZE || Infinity;
  const TOO_MANY =  SIZE !== Infinity &&
                    SIZE < sqrt((fromLength || 1) * (toLength || 1));

  if (TOO_MANY || fromLength < 1) {
    if (TOO_MANY || toLength) {
      from.splice.apply(from, [0, fromLength].concat(to));
    }
    return;
  }
  if (toLength < 1) {
    from.splice(0);
    return;
  }
  const minLength = min(fromLength, toLength);
  let beginIndex = 0;
  while(beginIndex < minLength && from[beginIndex] === to[beginIndex]) {
    beginIndex += 1;
  }
  if(beginIndex == fromLength && fromLength == toLength) {
    // content of { from } and { to } are equal. Do nothing
    return;
  }
  else {
    // relative from both ends { from } and { to }. { -1 } is last element,
    // { -2 } is { to[to.length - 2] } and { from[fromLength - 2] } etc
    let endRelIndex = 0;
    const fromLengthMinus1 = fromLength - 1;
    const toLengthMinus1 = toLength - 1;  
    while(
      beginIndex < (minLength + endRelIndex) &&
      from[fromLengthMinus1 + endRelIndex] === to[toLengthMinus1 + endRelIndex]
    ) {
      endRelIndex--;
    }
    performOperations(
      from,
      getOperations(
        from, to,
        levenstein(from, to, beginIndex, endRelIndex),
        beginIndex, endRelIndex
      )
    );
  }
}; 

// given an object that would like to intercept
// all splice operations performed through a list,
// wraps the list.splice method to delegate such object
// and it puts back original splice right before every invocation.
// Note: do not use the same list in two different aura
const aura = (splicer, list) => {
  const splice = list.splice;
  function $splice() {
    list.splice = splice;
    const result = splicer.splice.apply(splicer, arguments);
    list.splice = $splice;
    return result;
  }
  list.splice = $splice;
  return list;
};

// Helpers - - - - - - - - - - - - - - - - - - - - - -

// originally readapted from:
// http://webreflection.blogspot.co.uk/2009/02/levenshtein-algorithm-revisited-25.html
// then rewritten in C for Emscripten (see levenstein.c)
// then "screw you ASM" due no much gain but very bloated code
const levenstein = (from, to, beginIndex, endRelIndex) => {
  const fromLength = from.length + 1 - beginIndex + endRelIndex;
  const toLength = to.length + 1 - beginIndex + endRelIndex;
  const size = fromLength * toLength;
  const grid = new TypedArray(size);
  let x = 0;
  let y = 0;
  let X = 0;
  let Y = 0;
  let crow = 0;
  let prow = 0;
  let del, ins, sub;
  grid[0] = 0;
  while (++x < toLength) grid[x] = x;
  while (++y < fromLength) {
    X = x = 0;
    prow = crow;
    crow = y * toLength;
    grid[crow + x] = y;
    while (++x < toLength) {
      del = grid[prow + x] + 1;
      ins = grid[crow + X] + 1;
      sub = grid[prow + X] + (from[Y + beginIndex] == to[X + beginIndex] ? 0 : 1);
      grid[crow + x] = del < ins ?
                        (del < sub ?
                          del : sub) :
                        (ins < sub ?
                          ins : sub);
      ++X;
    };
    Y = y;
  }
  return grid;
};

// add operations (in reversed order)
const addOperation = (list, type, x, y, count, items) => {
  list.unshift({type, x, y, count, items});
};

// walk the Levenshtein grid bottom -> up
const getOperations = (Y, X, grid, beginIndex, endRelIndex) => {
  const list = [];
  const YL = Y.length + 1 - beginIndex + endRelIndex;
  const XL = X.length + 1 - beginIndex + endRelIndex;
  let y = YL - 1;
  let x = XL - 1;
  let cell,
      top, left, diagonal,
      crow, prow;
  while (x && y) {
    crow = y * XL + x;
    prow = crow - XL;
    cell = grid[crow];
    top = grid[prow];
    left = grid[crow - 1];
    diagonal = grid[prow - 1];
    if (diagonal <= left && diagonal <= top && diagonal <= cell) {
      x--;
      y--;
      if (diagonal < cell) {
        addOperation(list, SUBSTITUTE, x + beginIndex, y + beginIndex, 1, [X[x + beginIndex]]);
      }
    }
    else if (left <= top && left <= cell) {
      x--;
      addOperation(list, INSERT, x + beginIndex, y + beginIndex, 0, [X[x + beginIndex]]);
    }
    else {
      y--;
      addOperation(list, DELETE, x + beginIndex, y + beginIndex, 1, []);
    }
  }
  while (x--) {
    addOperation(list, INSERT, x + beginIndex, y + beginIndex, 0, [X[x + beginIndex]]);
  }
  while (y--) {
    addOperation(list, DELETE, x + beginIndex, y + beginIndex, 1, []);
  }
  return list;
};

/* grouped operations */
const performOperations = (target, operations) => {
  const length = operations.length;
  let diff = 0;
  let i = 1;
  let curr, prev, op;
  op = (prev = operations[0]);
  while (i < length) {
    curr = operations[i++];
    if (prev.type === curr.type && (curr.x - prev.x) <= 1 && (curr.y - prev.y) <= 1) {
      op.count += curr.count;
      op.items = op.items.concat(curr.items);
    } else {
      target.splice.apply(target, [op.y + diff, op.count].concat(op.items));
      diff += op.type === INSERT ?
        op.items.length : (op.type === DELETE ?
          -op.count : 0);
      op = curr;
    }
    prev = curr;
  }
  target.splice.apply(target, [op.y + diff, op.count].concat(op.items));
};

majinbuu.aura = aura;

export default majinbuu;
export {aura, majinbuu};
