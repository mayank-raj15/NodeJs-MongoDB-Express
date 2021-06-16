//requiring express
const express = require('express');
const morgan = require('morgan');

//calling express function and saving it to app
const app = express();

//using the routers created for different routes
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//error class
const AppError = require('./utils/appError');

//global error handler
const globalErrorHandler = require('./controller/errorController');

//-------middleware--------//

//this is a middleware, they basically are used to manipulate request and response object while sending data to server

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

//this is our own middleware
//we have access to req, res and next
//next refers to the next middleware in the middleware stack
//it is necessary to call the next() function to continue the stack, otherwise the request would get stuck at this middleware
/* app.use((req, res, next) => {
  console.log('Hello from the middleware!');
  next();
}); */

//this is also our own middleware which adds requestTime to the request
app.use((req, res, next) => {
  req.reqeustTime = new Date().toISOString();
  next();
});

//---------------routes----------------//

//way of defining routs

// app.get('/api/v1/tours', getAllTours);
//'/api/v1/tours/:id/:x/:y?' -> 'api/v1/tours/5/12' => id = 5, x = 12, y = undefined (since y has ?, it is optional)
//'/api/v1/tours/:id/:x/:y' -> 'api/v1/tours/5/12/23' => id = 5, x = 12, y = 23 (all manadatory in url)
// app.post('/api/v1/tours', addNewTour);
// app.get('/api/v1/tours/:id', getSingleTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  /* res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  }); */

  //while creating a new error, we pass in the err.message as a string
  /* const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.statusCode = 404;
  err.status = 'fail'; */

  const err = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404
  );

  //whenever we pass an argument to the next function, it will automatically assume there is an error and will straight-away go to the global error handling middleware that accepts the err argument
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;

//-------------------------OLD CODE------------------//

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this end point!');
// });
