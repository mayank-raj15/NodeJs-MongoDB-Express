const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

//mongoose.schema() accepts two objects, first is the schema object and second is the options object which defines various options for visibility and working of virtual fields, etc
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour must have a name'], //it marks this field as required
      unique: true, //it makes sure that each document has a unique name
      trim: true, //if the name is big, it trims the name before sending it back as retrieved data
      maxlength: [40, 'Tour name must have less or equal to 40 characters'],
      minlength: [10, 'Tour name must be at least 10 characters']
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: {
      type: String
    },
    duration: {
      type: Number,
      required: [true, 'Tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'Tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5, //if the field value is not assigned, 4.5 will be assigned automatically
      min: [1, 'Rating must be at least 1.0'],
      max: [5, 'Rating must not exceed 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'Tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          //this only points to the current doc of the NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) must be less than actual price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'Tour must have a summary']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'Tour must have an image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false //it sets the data to not be visible while all the fields are retrieved
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    //when data is asked as particular format, virtuals fields will also be sent
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//we add a virtual field this way, it takes in a actual function as we need to use this object which points the the schema object;
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

//if we have more than one middlewares, we have next passed as parameter to all the middlewares, and it is called at the end, just like express middlwares

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function(next) {
//   console.log('Will save document');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE

tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

// AGGREGATION MIDDLEWARE

tourSchema.pre('aggregate', function(next) {
  //this.pipeline() is an array, so unshift is used to add the element which is a match stage here, at the front of the array
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
