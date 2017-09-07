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
console.assert(a1.join('') === b.join(''));
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
console.assert(a2.join('') === b.join(''));

log('- - -');
var crypto = require("crypto");
var a = crypto.randomBytes(Math.ceil(times / 2)).toString('hex');
var b = crypto.randomBytes(Math.ceil(times / 2)).toString('hex');
console.time('C time');
var ls = require('child_process').spawnSync('./levenstein', [a, b]);
console.timeEnd('C time');
log('C distance: ' + ls.stdout.toString());
