// console.log(arguments);
// console.log(require('module').wrapper);

//module.exports
const C = require('./test-modules-1');
const calc1 = new C();
console.log(calc1.add(1, 2));

//exports
// const calc2 = require('./test-modules-2');
const {add, multiply} = require('./test-modules-2');
console.log(calc2.add(2, 5));

//caching
require('./test-modules-3')();