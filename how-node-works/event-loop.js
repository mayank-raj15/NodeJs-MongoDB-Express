const fs = require("fs");
const crypto = require("crypto");
const start = Date.now();

//default threadpool size is 4, we can also update the threadpool size
process.env.UV_THREADPOOL_SIZE = 1;

//whenever the timer runs out in the event loop, this function will print to terminal
setTimeout(() => console.log("Timer 1 finished!"), 0);

//this will print to terminal after one callback is completed in the event loop, here in this case, first callback is timer1
setImmediate(() => console.log("Immediate 1 finished!"));

//read file will also go in event loop
fs.readFile("text-file.txt", () => {
  //first this will get printed after file is read
  console.log("I/O finished");
  console.log("-----------");

  //timer 2 will go after immediate 2, because one callback is already completed, so immediate will be done next
  setTimeout(() => console.log("Timer 2 finished!"), 0);

  //this will be done once 3 seconds pass
  setTimeout(() => console.log("Timer 3 finished!"), 3000);

  setImmediate(() => console.log("Immediate 2 finished!"));

  //next tick will be completed before timer 2 and immediate 2 because it has more priority then timeout and immediate
  process.nextTick(() => console.log("Process.nextTick"));

  //here all the 4 encryptions will be offloaded to the threadpool and will be done simultaneously
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password Encrypted!");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password Encrypted!");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password Encrypted!");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password Encrypted!");
  });
});

//this will print to the terminal at first during the whole program
console.log("Hello from top-level code!");
