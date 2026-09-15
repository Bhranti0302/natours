const express = require('express');

const tourControllers = require('../controllers/tourControllers');

const authController = require('../controllers/authController');

const reviewRouter = require('./reviewRoutes');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tours
 *   description: Tour management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Tour:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: The Sea Explorer
 *         duration:
 *           type: integer
 *           example: 7
 *         maxGroupSize:
 *           type: integer
 *           example: 15
 *         difficulty:
 *           type: string
 *           example: medium
 *         price:
 *           type: number
 *           example: 497
 *         summary:
 *           type: string
 *           example: Exploring the jaw-dropping US east coast
 *         description:
 *           type: string
 *           example: A beautiful coastal adventure
 */

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



router.route('/distances/:latlng/unit/:unit').get(tourControllers.getDistances);

/**
 * @swagger
 * /api/v1/tours:
 *   get:
 *     summary: Get all tours
 *     tags: [Tours]
 *     responses:
 *       200:
 *         description: Tours fetched successfully
 *
 *   post:
 *     summary: Create a new tour
 *     tags: [Tours]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tour'
 *     responses:
 *       201:
 *         description: Tour created successfully
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: Not authorized
 */

router
  .route('/')
  .get(tourControllers.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourControllers.createTour
  );

/**
 * @swagger
 * /api/v1/tours/{id}:
 *   get:
 *     summary: Get a tour by ID
 *     tags: [Tours]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 5c88fa8cf4afda39709c2955
 *     responses:
 *       200:
 *         description: Tour fetched successfully
 *       404:
 *         description: Tour not found
 *
 *   patch:
 *     summary: Update a tour
 *     tags: [Tours]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tour'
 *     responses:
 *       200:
 *         description: Tour updated successfully
 *
 *   delete:
 *     summary: Delete a tour
 *     tags: [Tours]
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
 *         description: Tour deleted successfully
 *       404:
 *         description: Tour not found
 */

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
    tourControllers.uploadTourImages,
    tourControllers.resizeTourImages,
    tourControllers.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourControllers.deleteTour
  );

module.exports = router;
