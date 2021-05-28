//it prints the information about the arguments of the module in case the current file is imported as a module
console.log(arguments);

//it gives the function header containing the function as a function declaration
console.log(require("module").wrapper);

//modules.exports
const C = require("./test-module1");
const calc1 = new C();
console.log(calc1.add(2, 5));

//exports
// const calc2 = require("./test-module2");
// console.log(calc2.add(2, 5));

//we can directly get the required functionality from the module as variable names as given in the module file
const { add, multiply, divide } = require("./test-module2");
console.log(multiply(2, 5));

//caching
//here we require the module 3 times but the code inside the module will be executed once at first
//then the module will be cached in the memory
//and whenever we call the function exported from the module, only the code in that function will get executed, module won't be executed ever again for current run of program
require("./test-module3")();
require("./test-module3")();
require("./test-module3")();
