var majinbuu=function(t,n){function e(n){return t[n]||i(n)}function i(i){var o={},r={exports:o};return n[i].call(o,window,e,r,o),t[i]=r.exports}e.E=function(t){return Object.defineProperty(t,"__esModule",{value:!0})};var o=e(0);return o.__esModule?o.default:o}([],[function(t,n,e,i){"use strict";/*! Copyright (c) 2017, Andrea Giammarchi, @WebReflection */
var o="function"==typeof Int32Array?Int32Array:Array,r=Math.min,u=Math.sqrt,c=function(t,n,e){if(t!==n){var i=t.length,o=n.length,c=e||1/0,a=c!==1/0&&c<u((i||1)*(o||1));if(a||i<1)(a||o)&&t.splice.apply(t,[0,i].concat(n));else if(o<1)t.splice(0);else{for(var f=r(i,o),v=0;v<f&&t[v]===n[v];)v+=1;if(v!=i||i!=o){for(var d=0,y=i-1,h=o-1;v<f+d&&t[y+d]===n[h+d];)d--;p(t,s(t,n,l(t,n,v,d),v,d))}}}},a=function(t,n){function e(){n.splice=i;var o=t.splice.apply(t,arguments);return n.splice=e,o}var i=n.splice;return n.splice=e,n},l=function(t,n,e,i){var r=t.length+1-e+i,u=n.length+1-e+i,c=new o(r*u),a=0,l=0,f=0,s=0,p=0,v=0,d=void 0,y=void 0,h=void 0;for(c[0]=0;++a<u;)c[a]=a;for(;++l<r;){for(f=a=0,v=p,c[(p=l*u)+a]=l;++a<u;)d=c[v+a]+1,y=c[p+f]+1,h=c[v+f]+(t[s+e]==n[f+e]?0:1),c[p+a]=d<y?d<h?d:h:y<h?y:h,++f;s=l}return c},f=function(t,n,e,i,o,r){t.unshift({type:n,x:e,y:i,count:o,items:r})},s=function(t,n,e,i,o){for(var r=[],u=t.length+1-i+o,c=n.length+1-i+o,a=u-1,l=c-1,s=void 0,p=void 0,v=void 0,d=void 0,y=void 0,h=void 0;l&&a;)h=(y=a*c+l)-c,s=e[y],p=e[h],v=e[y-1],(d=e[h-1])<=v&&d<=p&&d<=s?(l--,a--,d<s&&f(r,"sub",l+i,a+i,1,[n[l+i]])):v<=p&&v<=s?f(r,"ins",--l+i,a+i,0,[n[l+i]]):f(r,"del",l+i,--a+i,1,[]);for(;l--;)f(r,"ins",l+i,a+i,0,[n[l+i]]);for(;a--;)f(r,"del",l+i,a+i,1,[]);return r},p=function(t,n){var e=n.length,i=0,o=1,r=void 0,u=void 0,c=void 0;for(c=u=n[0];o<e;)r=n[o++],u.type===r.type&&r.x-u.x<=1&&r.y-u.y<=1?(c.count+=r.count,c.items=c.items.concat(r.items)):(t.splice.apply(t,[c.y+i,c.count].concat(c.items)),i+="ins"===c.type?c.items.length:"del"===c.type?-c.count:0,c=r),u=r;t.splice.apply(t,[c.y+i,c.count].concat(c.items))};c.aura=a,n.E(i).default=c,i.aura=a,i.majinbuu=c}]);