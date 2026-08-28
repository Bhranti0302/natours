const express = require('express');

const bookingController = require('../controllers/bookingController');

const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management APIs
 */

/**
 * @swagger
 * /api/v1/bookings/tour/{tourId}:
 *   post:
 *     summary: Create a booking for a tour
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: User is not authenticated
 *       404:
 *         description: Tour not found
 */

// Protect all booking routes
router.use(authController.protect);

// Create booking
router.post('/tour/:tourId', bookingController.createBooking);

/**
 * @swagger
 * /api/v1/bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bookings fetched successfully
 *       401:
 *         description: User is not authenticated
 */

// Get all bookings
router.get('/', bookingController.getAllBookings);

/**
 * @swagger
 * /api/v1/bookings/{id}:
 *   get:
 *     summary: Get a booking by ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
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
 *       - bearerAuth: []
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
 *       - bearerAuth: []
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

// Get, update, delete one booking
router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
