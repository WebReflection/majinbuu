var times = process.argv.length < 3 ? 10 : parseFloat(process.argv[2]);

var log = require('tressa').log;
var majinbuu = require('./index.js');
var a1 = Array(times + 1).join('.').split('.').map(Math.random);
var a2 = a1.slice();
var b = Array(times + 1).join('.').split('.').map(Math.random);

log('');
log('# Majin Buu');
log('size: **' + times + '**');
console.time('time');
majinbuu(a1, b);
console.timeEnd('time');
console.time('aura time');
majinbuu(
  majinbuu.aura(
    {
      splice: function () {
        a2.splice.apply(a2, arguments);
      }
    },
    a2
  ),
  b
);
console.timeEnd('aura time');
console.assert(a.join('') === b.join(''));
log('');