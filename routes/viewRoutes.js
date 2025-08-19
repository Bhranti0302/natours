const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const Tour = require('../models/tourModels');
const Review = require('../models/reviewModels');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

router.use(authController.isLoggedIn);

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview
);

router.get('/tour/:slug', viewsController.getTour);
router.get('/login', viewsController.getLoginForm);
router.get('/signup', viewsController.getSignupForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.post('/submit-user-data', authController.protect, viewsController.updateUserData);
router.get('/account/billing', authController.protect, viewsController.getMyBilling);
router.get('/account/reviews', authController.protect, viewsController.getMyReviews);

router.get('/my-tours', authController.protect, viewsController.getMyTours);

// ------------------------------
// Handle review form submission
// ------------------------------
router.post(
  '/tour/:tourId/reviews',
  authController.protect,
  catchAsync(async (req, res, next) => {
    // 1) Create review
    await Review.create({
      review: req.body.review,
      rating: req.body.rating,
      tour: req.params.tourId,
      user: req.user.id,
    });

    // 2) Find the tour to get its slug
    const tour = await Tour.findById(req.params.tourId);

    // 3) Redirect back to the tour page
    res.redirect(`/tour/${tour.slug}`);
  })
);

module.exports = router;
