const express = require('express');
const viewsController = require('../controllers/viewsController'); // ✅ keep plural
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const Tour = require('../models/tourModels');
const Review = require('../models/reviewModels');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

// ------------------------------
// Routes
// ------------------------------

// Homepage (overview)
router.get(
  '/',
  bookingController.createBookingCheckout, // TEMP booking creation
  authController.isLoggedIn, // navbar login logic
  viewsController.getOverview
);

// Tour details
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);

// ------------------------------
// Auth pages
// ------------------------------
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', viewsController.getSignupForm);

// ------------------------------
// User account pages
// ------------------------------
router.get('/me', authController.protect, viewsController.getAccount);
router.post('/submit-user-data', authController.protect, viewsController.updateUserData);

router.get('/account/billing', authController.protect, viewsController.getMyBilling);
router.get('/account/reviews', authController.protect, viewsController.getMyReviews);

router.get(
  '/my-tours',
  authController.protect,
  bookingController.createBookingCheckout,
  viewsController.getMyTours // ✅ fixed name
);

// ------------------------------
// Handle review form submission
// ------------------------------
router.post(
  '/tour/:tourId/reviews',
  authController.protect,
  catchAsync(async (req, res, next) => {
    await Review.create({
      review: req.body.review,
      rating: req.body.rating,
      tour: req.params.tourId,
      user: req.user.id,
    });

    const tour = await Tour.findById(req.params.tourId);
    res.redirect(`/tour/${tour.slug}`);
  })
);

module.exports = router;
