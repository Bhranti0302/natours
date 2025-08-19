const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const Review = require('./reviewModels');

// Define the Tour Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must be less than or equal to 40 characters'],
      minlength: [10, 'A tour name must be at least 10 characters'],
      validate: {
        validator: function (val) {
          return /^[a-zA-Z\s]+$/.test(val); // Optional: Use Unicode-safe regex
        },
        message: 'Tour name must only contain letters and spaces',
      },
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at least 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, // Round to 1 decimal place
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
        validate: {
          validator: (val) => val.length === 2,
          message: 'Coordinates must be [longitude, latitude]',
        },
      },
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: {
          type: [Number],
          validate: {
            validator: (val) => val.length === 2,
            message: 'Coordinates must be [longitude, latitude]',
          },
        },
        address: String,
        description: String,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],

    // reviews: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: Review,
    //   },
    // ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    // timestamps: true // Optional: Uncomment to auto-manage createdAt and updatedAt
  }
);

// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// Indexes
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

// Virtual property
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Document middleware: create slug
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Query middleware: hide secret tours and populate guides
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

// Aggregation middleware: hide secret tours unless using $geoNear
tourSchema.pre('aggregate', function (next) {
  const firstStage = this.pipeline()[0];
  if (firstStage && firstStage.$geoNear) return next();
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

// Export the model
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
