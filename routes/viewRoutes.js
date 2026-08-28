const express = require('express');

const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const Tour = require('../models/tourModels');
const Review = require('../models/reviewModels');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

////////////////////////////////////////////////////////////
// ALERTS MIDDLEWARE
////////////////////////////////////////////////////////////

router.use(viewsController.alerts);

////////////////////////////////////////////////////////////
// HOMEPAGE
////////////////////////////////////////////////////////////

router.get('/', authController.isLoggedIn, viewsController.getOverview);

////////////////////////////////////////////////////////////
// TOUR DETAILS
////////////////////////////////////////////////////////////

router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);

////////////////////////////////////////////////////////////
// AUTH PAGES
////////////////////////////////////////////////////////////

router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);

router.get('/signup', viewsController.getSignupForm);

////////////////////////////////////////////////////////////
// USER ACCOUNT PAGES
////////////////////////////////////////////////////////////

router.get('/me', authController.protect, viewsController.getAccount);

router.post('/submit-user-data', authController.protect, viewsController.updateUserData);

router.get('/account/billing', authController.protect, viewsController.getMyBilling);

router.get('/account/reviews', authController.protect, viewsController.getMyReviews);

////////////////////////////////////////////////////////////
// MY TOURS
////////////////////////////////////////////////////////////

router.get('/my-tours', authController.protect, viewsController.getMyTours);

////////////////////////////////////////////////////////////
// CREATE REVIEW
////////////////////////////////////////////////////////////

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
