# Majin Buu

[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC) [![Build Status](https://travis-ci.org/WebReflection/majinbuu.svg?branch=master)](https://travis-ci.org/WebReflection/majinbuu) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/majinbuu/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/majinbuu?branch=master) [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/WebReflection/donate)


Apply the [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) to transform / morph an Array into another, performing the least amount of needed `.splice(...)` operations.

```js
const abra = ['a', 'b', 'r', 'a'];
majinbuu(abra, ['c', 'a', 'd', 'a', 'b', 'r', 'a']);

abra; // now ['c', 'a', 'd', 'a', 'b', 'r', 'a']
```

It is also possible to intercept all splice calls using an `aura`.
```js
const abra = ['a', 'b', 'r', 'a'];
const interceptor = {
  splice(index, removal, ...items) {
    console.log(index, removal, ...items);
    abra.splice.apply(abra, arguments);
  }
};
const aura = majinbuu.aura(interceptor, abra);

majinbuu(aura, ['c', 'a', 'd', 'a', 'b', 'r', 'a']);
// 0 0 "c"
// 2 0 "d" "a"
```

The optional third argument avoid processing grids that are too big (comparing lists with too many items).
```js
const noMoreThan1K = 1000;
majinbuu(list1, list2, noMoreThan1K);
```
If the square of the `list1` and `list2` product is higher than `noMoreThan1K`,
the splice operation will remove all `list1` items and push all `list2`.

### Compatibility

Every. JavaScript. Engine.
