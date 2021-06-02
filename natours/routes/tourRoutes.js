const express = require('express');
const app = require('../app');
const tourController = require('./../controller/tourController');

const router = express.Router();

//it is a param middleware which allows us to manipulate or use the request parameters
// router.param('id', tourController.checkID);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.addNewTour);

router
  .route('/:id')
  .get(tourController.getSingleTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
