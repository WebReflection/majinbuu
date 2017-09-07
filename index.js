var majinbuu = function () {'use strict';

  /*! Copyright (c) 2017, Andrea Giammarchi, @WebReflection */

  // grid operations
  var
    DELETE = 'del',
    INSERT = 'ins',
    SUBSTITUTE = 'sub',
    TypedArray = /^u/.test(typeof Int32Array) ? Array : Int32Array
  ;

  // readapted from:
  // http://webreflection.blogspot.co.uk/2009/02/levenshtein-algorithm-revisited-25.html
  function majinbuu(from, to, MAX_SIZE) {
    var
      fromLength = from.length,
      toLength = to.length,
      TOO_MANY = (MAX_SIZE || Infinity) < Math.sqrt(fromLength * toLength)
    ;
    if (fromLength < 1 || TOO_MANY) {
      if (toLength || TOO_MANY) {
        from.splice.apply(from, [0, fromLength].concat(to));
      }
      return;
    }
    if (toLength < 1) {
      from.splice(0);
      return;
    }
    performOperations(
      from,
      getOperations(from, to, levenstein(from, to))
    );
  }

  // given an object that would like to intercept
  // all splice operations performed through a list,
  // wraps the list.splice method to delegate such object
  // and it puts back original splice right before
  // every invocation.
  // Note: do not use the same list in two different aura
  majinbuu.aura = function aura(splicer, list) {
    var splice = list.splice;
    list.splice = function hodor() {
      list.splice = splice;
      var result = splicer.splice.apply(splicer, arguments);
      list.splice = hodor;
      return result;
    };
    return list;
  };

  return majinbuu;

  // Helpers - - - - - - - - - - - - - - - - - - - - - -

  // originally readapted from:
  // http://webreflection.blogspot.co.uk/2009/02/levenshtein-algorithm-revisited-25.html
  // then rewritten in C for Emscripten (see levenstein.c)
  // then "screw you ASM" due no much gain but very bloated code
  function levenstein(from, to) {
    var fromLength = from.length + 1;
    var toLength = to.length + 1;
    var size = fromLength * toLength;
    var x = 0;
    var y = 0;
    var X = 0;
    var Y = 0;
    var crow = 0;
    var prow = 0;
    var del, ins, sub;
    var grid = new TypedArray(size);
    grid[0] = 0;
    while (++x < toLength) grid[x] = x;
    while (++y < fromLength) {
      X = x = 0;
      crow = y * toLength;
      prow = Y * toLength;
      grid[crow + x] = y;
      while (++x < toLength) {
        del = grid[prow + x] + 1;
        ins = grid[crow + X] + 1;
        sub = grid[prow + X] + (from[Y] == to[X] ? 0 : 1);
        grid[crow + x] = del < ins ?
                          (del < sub ?
                            del : sub) :
                          (ins < sub ?
                            ins : sub);
        ++X;
      };
      ++Y;
    }
    return grid;
  }

  // add operations (in reversed order)
  function addOperation(list, type, x, y, count, items) {
    list.unshift({
      type: type,
      x: x,
      y: y,
      count: count,
      items: items
    });
  }

  // walk the Levenshtein grid bottom -> up
  function getOperations(Y, X, grid) {
    var
      list = [],
      YL = Y.length + 1,
      XL = X.length + 1,
      y = YL - 1,
      x = XL - 1,
      cell, top, left, diagonal,
      crow, prow
    ;
    while (x && y) {
      crow = y * XL;
      prow = (y - 1) * XL;
      cell = grid[crow + x];
      top = grid[prow + x];
      left = grid[crow + x - 1];
      diagonal = grid[prow + x - 1];
      if (diagonal <= left && diagonal <= top && diagonal <= cell) {
        x--;
        y--;
        if (diagonal < cell) {
          addOperation(list, SUBSTITUTE, x, y, 1, [X[x]]);
        }
      }
      else if (left <= top && left <= cell) {
        x--;
        addOperation(list, INSERT, x, y, 0, [X[x]]);
      }
      else {
        y--;
        addOperation(list, DELETE, x, y, 1, []);
      }
    }
    while (x--) {
      addOperation(list, INSERT, x, y, 0, [X[x]]);
    }
    while (y--) {
      addOperation(list, DELETE, x, y, 1, []);
    }
    return list;
  }

  /* grouped operations */
  function performOperations(target, operations) {
    var
      diff = 0,
      i = 1,
      length = operations.length,
      curr, prev, op
    ;
    if (length) {
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
    }
  }

  /* one-by-one operation (testing purpose)
  function performOperations(target, operations) {
    for (var op, diff = 0, i = 0, length = operations.length; i < length; i++) {
      op = operations[i];
      target.splice.apply(target, [op.y + diff, op.count].concat(op.items));
      diff += op.type === INSERT ?
                op.items.length : (op.type === DELETE ?
                  -op.count : 0);
    }
  }
  // */

}();

try { module.exports = majinbuu; } catch(o_O) {}