const express = require('express');

const reviewController = require('../controllers/reviewController');

const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management APIs
 */

// Protect all review routes
router.use(authController.protect);

/**
 * @swagger
 * /api/v1/reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reviews fetched successfully
 *       401:
 *         description: User is not authenticated
 *
 *   post:
 *     summary: Create a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - review
 *               - rating
 *             properties:
 *               review:
 *                 type: string
 *                 example: Amazing tour experience!
 *               rating:
 *                 type: number
 *                 example: 5
 *     responses:
 *       201:
 *         description: Review created successfully
 *       401:
 *         description: User is not authenticated
 *       403:
 *         description: Only users can create reviews
 */

// GET all reviews
// POST create a review
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(authController.restrictTo('user'), reviewController.createReview);

/**
 * @swagger
 * /api/v1/reviews/{id}:
 *   patch:
 *     summary: Update a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               review:
 *                 type: string
 *                 example: Updated review text
 *               rating:
 *                 type: number
 *                 example: 4
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Review not found
 *
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       204:
 *         description: Review deleted successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Review not found
 */

// Update and delete review
router
  .route('/:id')
  .patch(authController.restrictTo('user', 'admin'), reviewController.updateReview)
  .delete(authController.restrictTo('user', 'admin'), reviewController.deleteReview);

module.exports = router;
