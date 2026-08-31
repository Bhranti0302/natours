const mongoose = require('mongoose');

// -----------------------------
// Review Schema
// -----------------------------

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
      maxlength: [500, 'Review must be less than or equal to 500 characters'],
      minlength: [2, 'Review must be at least 2 characters'],
      trim: true,
    },

    rating: {
      type: Number,
      required: [true, 'A rating is required'],
      min: [1, 'Rating must be at least 1.0'],
      max: [5, 'Rating must be at most 5.0'],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: {
      virtuals: true,
    },

    toObject: {
      virtuals: true,
    },

    timestamps: true,
  }
);

// -----------------------------
// Prevent Duplicate Reviews
// Same user cannot review
// same tour more than once
// -----------------------------

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// -----------------------------
// Auto Populate User
// -----------------------------

reviewSchema.pre(/^find/, function () {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
});

// -----------------------------
// Calculate Average Ratings
// -----------------------------

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: {
        tour: tourId,
      },
    },

    {
      $group: {
        _id: '$tour',
        nRating: {
          $sum: 1,
        },
        avgRating: {
          $avg: '$rating',
        },
      },
    },
  ]);

  const Tour = require('./tourModels');

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// -----------------------------
// Calculate Ratings After Create
// -----------------------------

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});

// -----------------------------
// Calculate Ratings After
// Update/Delete
// -----------------------------

reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRatings(doc.tour);
  }
});

// -----------------------------
// Review Model
// -----------------------------

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
