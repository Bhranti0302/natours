const Review = require('../models/reviewModels');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

// Get All Reviews (with optional filtering for a tour)
exports.getAllReviews = factory.getAll(Review, {
  filterByParam: 'tourId',
  filterField: 'tour',
});

// ✅ Create Review (supports API + Form submissions)
exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const review = await Review.create(req.body);

  // If request is from browser form → redirect back to the tour page
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    return res.redirect(`/tour/${req.body.tour}`);
  }

  // Otherwise respond with JSON (API usage)
  res.status(201).json({
    status: 'success',
    data: { review },
  });
});

exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
