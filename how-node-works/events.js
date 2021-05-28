//using the event module, we can create events in our code
const EventEmitter = require("events");

const http = require("http");

//sales class inherits all the functionalities of EventEmitter
class Sales extends EventEmitter {
  constructor() {
    //this super function should be called to to use all the functionalities of super class 'EventEmitter' in this case
    super();
  }
}

//here we are creating a new event
const myEmitter = new Sales();

//whenever the 'newSale' event will be emitted, all the listeners who are listening to this event will run their callback functions
myEmitter.on("newSale", () => {
  console.log("A new sale was done!");
});

//also we can pass data to the listeners
myEmitter.on("newSale", (qty) => {
  console.log(`Quantity of items sold is ${qty}`);
});

//here we are emitting a 'newSale' event
myEmitter.emit("newSale", 9);

//----------------------------------------------------------------

//Also this way we can listen to server requests too

const server = http.createServer();

//program listen to a request and run the callback function
server.on("request", (req, res) => {
  console.log("Request received");
  res.end("Request received");
});

//we can have more than one listeners
server.on("request", (req, res) => {
  console.log("Another request received");
});

//the close event of server will be triggered when the program will stop
server.on("close", () => {
  console.log("Server closed");
});

//the server will keep listening at the given port and address
server.listen(8000, "127.0.0.1", () => {
  console.log("Waiting for requests!");
});
