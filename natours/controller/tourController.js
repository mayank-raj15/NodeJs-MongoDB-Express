const fs = require('fs');

//we are saving all the tours as JS object after reading from the file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//-----------route functions-------------//

exports.checkID = (req, res, next, val) => {
  console.log(`ID is: ${val}`);
  //if no object found
  if (val >= tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  const el = req.body;
  if (!el.name || !el.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};

//this is the funciton to get all tours
exports.getAllTours = (req, res) => {
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
exports.getSingleTour = (req, res) => {
  //req has certain paramaters that we can pass using the url
  //here id was given in the url so first we convert id from string to a number by multplying the string to a number
  const id = req.params.id * 1;

  //finding the tour with the given id
  const tour = tours.find((el) => el.id == id);

  //sending back the tour
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

//function to add a new tour
exports.addNewTour = (req, res) => {
  //we create the new id by adding 1 to the id of last tour in the tour array
  const newId = tours[tours.length - 1].id + 1;

  //we use Object.assign() which basically adds two objects together
  const newTour = Object.assign({ id: newId }, req.body);

  //pusing the new tour in the tour array
  tours.push(newTour);

  //finally writing the updated tour array to the file as a string using JSON.stringify()
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
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
exports.updateTour = (req, res) => {
  //getting id
  const id = req.params.id * 1;

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
exports.deleteTour = (req, res) => {
  //getting id
  const id = req.params.id * 1;

  //format of sending back the response
  //acutally delete operation not performed
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
