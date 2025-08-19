const express = require('express');
const viewController = require('../controllers/viewsController');

const router = express.Router();

router.get('/manage-tours', viewController.getAllTours);
router.get('/manage-users', viewController.getAllUsers);
router.get('/manage-bookings', viewController.getAllBookings);
router.get('/manage-reviews', viewController.getAllReviews);

module.exports = router;
