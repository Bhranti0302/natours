const express = require('express');
const tourControllers = require('../controllers/tourControllers');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// Nested reviews route
router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(tourControllers.aliasTopTours, tourControllers.getAllTours);

router
  .route('/tour-stats')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourControllers.getTourStats
  );

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourControllers.getMonthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourControllers.getToursWithin);
// /tours-distance/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(tourControllers.getDistances);

router
  .route('/')
  .get(tourControllers.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourControllers.createTour
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourControllers.getTour
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourControllers.uploadTourImages, // optional images
    tourControllers.resizeTourImages, // optional resizing
    tourControllers.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourControllers.deleteTour
  );

module.exports = router;
