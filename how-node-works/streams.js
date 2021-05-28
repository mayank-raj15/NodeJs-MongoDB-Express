const fs = require("fs");
const server = require("http").createServer();

//ways to read data from a file and send it to the user
server.on("request", (req, res) => {
  //solution 1:
  //first we can just read the text from the file, save it in a variable and then send that data to the user
  //this is a time taking process because, first the whole data will be read from the file and it would be send in bulk to the user
  // fs.readFile("test-file.txt", (err, data) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     res.end(data);
  //   }
  // });

  //Solution 2:
  //Here, we are using the read stream to read the file and write stream to write the data to the user side in the form of small chunks
  //this is also not efficient because the reading speed is much faster than wrtiting speed
  //this creates backlash problem
  // const readable = fs.createReadStream("test-file.txt");
  // readable.on("data", (chunk) => {
  //   res.write(chunk);
  // });
  // readable.on("end", () => {
  //   res.end();
  // });
  // readable.on("error", (err) => {
  //   console.log(err);
  //   res.statusCode = 500;
  //   res.end("File not found");
  // });

  //Solution 3:
  //Here we read the file using read stream and pipe the data to the writable destination using pipe() method
  //this eliminates the backlash error
  const readable = fs.createReadStream("test-file.txt");
  readable.pipe(res);
  //readableSource.pipe(writable destination)
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server has started!");
});
