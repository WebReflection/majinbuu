var majinbuu = function () {'use strict';

  /*! Copyright (c) 2017, Andrea Giammarchi, @WebReflection */

  // grid operations
  var
    DELETE = 'del',
    INSERT = 'ins',
    SUBSTITUTE = 'sub',
    AuraPrototype = Aura.prototype
  ;

  // readapted from:
  // http://webreflection.blogspot.co.uk/2009/02/levenshtein-algorithm-revisited-25.html
  function majinbuu(from, to) {
    var
      min = Math.min,
      fromLength = from.length,
      toLength = to.length,
      X = 0,
      Y = 0,
      y = 0,
      x = 0,
      grid, tmp;
    ;
    if (fromLength < 1) {
      if (toLength) from.splice.apply(from, [0, 0].concat(to));
      return;
    }
    if (toLength < 1) {
      from.splice(0);
      return;
    }
    grid = [[0]];
    while(x++ < toLength) grid[0][x] = x;
    while(y++ < fromLength){
      X = x = 0;
      tmp = from[Y];
      grid[y] = [y];
      while(x++ < toLength){
        grid[y][x] = min(
          grid[Y][x] + 1,
          grid[y][X] + 1,
          grid[Y][X] + (tmp === to[X] ? 0 : 1)
        );
        X++;
      };
      Y++;
    };
    performOperations(
      from,
      getOperations(from, to, grid)
    );
  }

  // given an object that would like to intercept
  // all splice operations performed through a list,
  // return a list "aura" that will delegate all splices
  majinbuu.aura = function aura(interceptor, list) {
    Aura.prototype = list;
    return new Aura(interceptor);
  };

  return majinbuu;

  // Helpers - - - - - - - - - - - - - - - - - - - - - -

  // Aura instances are just Array bridges
  function Aura(interceptor) {
    Aura.prototype = AuraPrototype;
    this._ = interceptor;
    this.splice = splice;
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
      cell, top, left, diagonal
    ;
    while (x && y) {
      cell = grid[y][x];
      top = grid[y - 1][x];
      left = grid[y][x - 1];
      diagonal = grid[y - 1][x - 1];
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

  // delegate all splice operations through an aura
  function splice() {
    return this._.splice.apply(this._, arguments);
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