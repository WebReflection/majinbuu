var {title, assert, log} = require('tressa');
var majinbuu = require('./cjs/main.js').default;

title('Majin Buu');

function test(a, b) {
  var count;
  function splice() {
    count++;
    return brr.splice.apply(arr, arguments);
  }
  var arr = a.split('');
  var brr = b.split('');
  count = 0;
  arr.splice = splice;
  majinbuu(arr, brr);
  assert(arr.join('') === brr.join(''), `\x1b[2m[${count}]\x1b[22m ${a || '<empty>'} => ${b || '<empty>'}`);
  if (a !== b) {
    arr = b.split('');
    brr = a.split('');
    count = 0;
    arr.splice = splice;
    majinbuu(arr, brr);
    assert(arr.join('') === brr.join(''), `\x1b[2m[${count}]\x1b[22m ${b || '<empty>'} => ${a}`);
  }
}

test('', '');
test('same', 'same');
test('democrat', 'republican');
test('kitten', 'sitting');
test('abc', '');
test('roar', 'meow');
test('abra', 'cadabra');
test('matrix', 'xxxmatr');

delete global.Int32Array;
delete require.cache[require.resolve('./cjs/main.js')];
var majinbuu = require('./cjs/main.js').default;

log('## majinbuu.aura');
var list = 'abra'.split('');
var wrap = {
  spliced: false,
  splice: function () {
    this.spliced = true;
    this.result = list.splice.apply(list, arguments);
  }
};

var aura = majinbuu.aura(wrap, list);

majinbuu(aura, 'cadabra'.split(''));
assert(wrap.spliced, 'aura invoked the wrapper instead');
assert(list.join('') === 'cadabra', 'aura modified the list');
assert(aura.join('') === 'cadabra', 'aura inherits list');

list = ['12'];
aura = majinbuu.aura(wrap, list);
majinbuu(aura, ['a', 'b']);
assert(aura.join('') === 'ab', 'single to double is OK');

list = '0123456789'.split('');
log('## grid limit');
majinbuu(
  majinbuu.aura({
    splice: function (index, many) {
      assert(
        index === 0 &&
        many === list.length &&
        list.slice.call(arguments, 2).join('') === 'OK',
        'max grid limit respected'
      );
    }
  }, list),
  'OK'.split(''),
  3
);