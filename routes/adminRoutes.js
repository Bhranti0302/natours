const express = require('express');

const viewController = require('../controllers/viewsController');

const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management APIs
 */

// Protect all admin routes: user must be logged in
router.use(authController.protect);

// Only allow admin
router.use(authController.restrictTo('admin'));

/**
 * @swagger
 * /admin/manage-tours:
 *   get:
 *     summary: Get all tours for admin management
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Tours fetched successfully
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: Admin access required
 */

router.get('/manage-tours', viewController.getAllTours);

/**
 * @swagger
 * /admin/manage-users:
 *   get:
 *     summary: Get all users for admin management
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: Admin access required
 */

router.get('/manage-users', viewController.getAllUsers);

/**
 * @swagger
 * /admin/manage-bookings:
 *   get:
 *     summary: Get all bookings for admin management
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Bookings fetched successfully
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: Admin access required
 */

router.get('/manage-bookings', viewController.getAllBookings);

/**
 * @swagger
 * /admin/manage-reviews:
 *   get:
 *     summary: Get all reviews for admin management
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Reviews fetched successfully
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: Admin access required
 */

router.get('/manage-reviews', viewController.getAllReviews);

module.exports = router;
