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

// ==========================================================
// GET / UPDATE / DELETE ONE BOOKING
// ==========================================================

/**
 * @swagger
 * /api/v1/bookings/{id}:
 *   get:
 *     summary: Get a booking by ID
 *     tags: [Bookings]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking fetched successfully
 *       404:
 *         description: Booking not found
 *
 *   patch:
 *     summary: Update a booking
 *     tags: [Bookings]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *
 *   delete:
 *     summary: Delete a booking
 *     tags: [Bookings]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Booking deleted successfully
 */

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
