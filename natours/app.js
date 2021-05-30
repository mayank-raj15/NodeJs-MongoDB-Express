const fs = require('fs');

//requiring express
const express = require('express');

//calling express function and saving it to app
const app = express();

//this is a middleware, they basically are used to manipulate request and response object while sending data to server
app.use(express.json());

//this is our own middleware
//we have access to req, res and next
//next refers to the next middleware in the middleware stack
//it is necessary to call the next() function to continue the stack, otherwise the request would get stuck at this middleware
app.use((req, res, next) => {
  console.log('Hello from the middleware!');
  next();
});

//this is also our own middleware which adds requestTime to the request
app.use((req, res, next) => {
  req.reqeustTime = new Date().toISOString();
  next();
});

//we are saving all the tours as JS object after reading from the file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//this is the funciton to get all tours
const getAllTours = (req, res) => {
  console.log(req.reqeustTime);

  //this is the data format sent back, status code is 200(OK), and we send tours data in the data field
  res.status(200).json({
    status: 'success',
    requestedAt: req.reqeustTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

//this is the funciton for getting a single tour
const getSingleTour = (req, res) => {
  //req has certain paramaters that we can pass using the url
  //here id was given in the url so first we convert id from string to a number by multplying the string to a number
  const id = req.params.id * 1;

  //finding the tour with the given id
  const tour = tours.find((el) => el.id == id);

  //two ways to do it:
  //1. if id>=length of tours
  //2. if tour is empty
  //if (id >= tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  //sending back the tour
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

//function to add a new tour
const addNewTour = (req, res) => {
  //we create the new id by adding 1 to the id of last tour in the tour array
  const newId = tours[tours.length - 1].id + 1;

  //we use Object.assign() which basically adds two objects together
  const newTour = Object.assign({ id: newId }, req.body);

  //pusing the new tour in the tour array
  tours.push(newTour);

  //finally writing the updated tour array to the file as a string using JSON.stringify()
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          newTour,
        },
      });
    }
  );
};

//updating a tour using patch, patch takes in only the data to be updated, while put takes in the whole object and replace that
const updateTour = (req, res) => {
  //getting id
  const id = req.params.id * 1;

  //if no object found
  if (id >= tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  //format of sending back response
  //actual operations are not performed
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<updated tour>',
    },
  });
};

//function to delete a tour
const deleteTour = (req, res) => {
  //getting id
  const id = req.params.id * 1;

  //checking if object not present
  if (id >= tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  //format of sending back the response
  //acutally delete operation not performed
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

//way of defining routs

// app.get('/api/v1/tours', getAllTours);
//'/api/v1/tours/:id/:x/:y?' -> 'api/v1/tours/5/12' => id = 5, x = 12, y = undefined (since y has ?, it is optional)
//'/api/v1/tours/:id/:x/:y' -> 'api/v1/tours/5/12/23' => id = 5, x = 12, y = 23 (all manadatory in url)
// app.post('/api/v1/tours', addNewTour);
// app.get('/api/v1/tours/:id', getSingleTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//to avoid duplication, we write in the format given below

app.route('/api/v1/tours').get(getAllTours).post(addNewTour);

app
  .route('/api/v1/tours/:id')
  .get(getSingleTour)
  .patch(updateTour)
  .delete(deleteTour);

//we define a port variable
const port = 3000;

//app will accept requests at that port of localhost
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

//-------------------------OLD CODE------------------//

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this end point!');
// });
