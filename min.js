var majinbuu=function(t,n){function e(n){return t[n]||i(n)}function i(i){var o={},r={exports:o};return n[i].call(o,window,e,r,o),t[i]=r.exports}e.E=function(t){return Object.defineProperty(t,"__esModule",{value:!0})};var o=e(0);return o.__esModule?o.default:o}([],[function(t,n,e,i){"use strict";/*! Copyright (c) 2017, Andrea Giammarchi, @WebReflection */
var o="function"==typeof Int32Array?Int32Array:Array,r=Math.min,u=Math.sqrt,c=function(t,n,e,i,o,c,a,l,v){if(t!==n){arguments.length<4?(v=e||1/0,e=0,i=o=t.length,c=0,a=l=n.length):v=v||1/0;var d=v!==1/0&&v<u((i-e||1)*(a-c||1));if(d||o<1)(d||l)&&t.splice.apply(t,[0,o].concat(n));else if(l<1)t.splice(0);else{for(var y=r(o,l),m=e;m<y&&t[m]===n[m];)m+=1;if(m!=o||o!=l){for(var h=0,g=i-1,x=a-1;m<y+h&&t[g+h]===n[x+h];)h--;p(t,s(f(t,m,o,n,h,l),t,m,o,n,h,l))}}}},a=function(t,n){function e(){n.splice=i;var o=t.splice.apply(t,arguments);return n.splice=e,o}var i=n.splice;return n.splice=e,n},f=function(t,n,e,i,r,u){var c=e+1-n+r,a=u+1-n+r,f=new o(c*a),l=0,s=0,p=0,v=0,d=0,y=0,m=void 0,h=void 0,g=void 0;for(f[0]=0;++l<a;)f[l]=l;for(;++s<c;){for(p=l=0,y=d,f[(d=s*a)+l]=s;++l<a;)m=f[y+l]+1,h=f[d+p]+1,g=f[y+p]+(t[v+n]==i[p+n]?0:1),f[d+l]=m<h?m<g?m:g:h<g?h:g,++p;v=s}return f},l=function(t,n,e,i,o,r){t.unshift({type:n,x:e,y:i,count:o,items:r})},s=function(t,n,e,i,o,r,u){for(var c=[],a=u+1-e+r,f=i+1-e+r-1,s=a-1,p=void 0,v=void 0,d=void 0,y=void 0,m=void 0,h=void 0;s&&f;)h=(m=f*a+s)-a,p=t[m],v=t[h],d=t[m-1],(y=t[h-1])<=d&&y<=v&&y<=p?(s--,f--,y<p&&l(c,"sub",s+e,f+e,1,[o[s+e]])):d<=v&&d<=p?l(c,"ins",--s+e,f+e,0,[o[s+e]]):l(c,"del",s+e,--f+e,1,[]);for(;s--;)l(c,"ins",s+e,f+e,0,[o[s+e]]);for(;f--;)l(c,"del",s+e,f+e,1,[]);return c},p=function(t,n){var e=n.length,i=0,o=1,r=void 0,u=void 0,c=void 0;for(c=u=n[0];o<e;)r=n[o++],u.type===r.type&&r.x-u.x<=1&&r.y-u.y<=1?(c.count+=r.count,c.items=c.items.concat(r.items)):(t.splice.apply(t,[c.y+i,c.count].concat(c.items)),i+="ins"===c.type?c.items.length:"del"===c.type?-c.count:0,c=r),u=r;t.splice.apply(t,[c.y+i,c.count].concat(c.items))};c.aura=a,n.E(i).default=c,i.aura=a,i.majinbuu=c}]);