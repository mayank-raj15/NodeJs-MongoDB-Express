const Tour = require('./../models/tourModels');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

//-----------route functions-------------//

//this is the middleware used to add name, price, ratingsAverage, summary & difficulty to the query and also add sort and limit options in the query to retrieve top 5 best and cheap tours
exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

//this is the funciton to get all tours
exports.getAllTours = catchAsync(async (req, res, next) => {
  //EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  //SEND RESULT
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
});
//this is the funciton for getting a single tour
exports.getSingleTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  //Tour.findOne({_id: req.params.id})

  if (!tour) {
    next(new AppError('No tour found with that ID', 404));
    return;
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

//function to add a new tour
exports.addNewTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      newTour
    }
  });

  /* try {
    
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  } */
});

//updating a tour using patch, patch takes in only the data to be updated, while put takes in the whole object and replace that
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!tour) {
    next(new AppError('No tour found with that ID', 404));
    return;
  }

  //format of sending back response
  //actual operations are not performed
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

//function to delete a tour
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    next(new AppError('No tour found with that ID', 404));
    return;
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

//function to get the statistics using mongoDB functions
//aggreagate is used to refine and manipulate the data, it consists of an array of pipeline stages
//each stages makes some changes to the data using pipeline operators and sends it forward
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      //all the tours with rating average greater than equal to 4.5 will be selected
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      //with the help of grouping we group the documents based on a certain field(parameter) assigned to the ID
      //after we group the documents, for each group we can iterate thorugh the documents and get the required consisting of information of those documents
      $group: {
        _id: { $toUpper: '$difficulty' },
        numRatings: { $sum: '$ratingsQuantity' },
        numTours: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      //sorting the data on the basis of a field, 1 for ascending and -1 for descending
      $sort: { avgPrice: -1 }
    }
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      //it takes in a field that contains array of elements and create seperate complete document for each array element of that field
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      //it is used to add a field in the data
      $addFields: { month: '$_id' }
    },
    {
      //project is used to set the visibility of a field in data, 0 (not-visible),  1 (visible)
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      //it limits the number of entries in the data
      $limit: 12
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});
