const express = require('express');
const viewController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all admin routes: user must be logged in
router.use(authController.protect);

// Only allow admin
router.use(authController.restrictTo('admin'));

router.get('/manage-tours', viewController.getAllTours);
router.get('/manage-users', viewController.getAllUsers);
router.get('/manage-bookings', viewController.getAllBookings);
router.get('/manage-reviews', viewController.getAllReviews);

module.exports = router;
