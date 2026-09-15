const express = require('express');

const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

// ==========================================================
// SWAGGER
// ==========================================================

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management APIs
 */

// ==========================================================
// PROTECT ALL BOOKING ROUTES
// ==========================================================

router.use(authController.protect);

// ==========================================================
// CREATE BOOKING
// ==========================================================

/**
 * @swagger
 * /api/v1/bookings/tour/{tourId}:
 *   post:
 *     summary: Create a booking for a tour
 *     tags: [Bookings]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: tourId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the tour
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: User already booked this tour
 *       401:
 *         description: User is not authenticated
 *       404:
 *         description: Tour not found
 */

router.post('/tour/:tourId', bookingController.createBooking);

// ==========================================================
// GET ALL BOOKINGS
// ==========================================================

/**
 * @swagger
 * /api/v1/bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Bookings fetched successfully
 *       401:
 *         description: User is not authenticated
 */

router.get('/', bookingController.getAllBookings);


router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

// ==========================================================
// EXPORT ROUTER
// ==========================================================

module.exports = router;
