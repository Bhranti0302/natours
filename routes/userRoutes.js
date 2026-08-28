const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const { signupValidation, loginValidation } = require('../validators/authValidator');

const { validationResult } = require('express-validator');

const router = express.Router();

////////////////////////////////////////////////////////////
// VALIDATION ERROR HANDLER
////////////////////////////////////////////////////////////

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed',
      errors: errors.array(),
    });
  }

  next();
};

////////////////////////////////////////////////////////////
// SWAGGER SCHEMAS
////////////////////////////////////////////////////////////

/**
 * @swagger
 * components:
 *   schemas:
 *     UserSignup:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - passwordConfirm
 *       properties:
 *         name:
 *           type: string
 *           example: Bhranti Tamboli
 *         email:
 *           type: string
 *           format: email
 *           example: bhranti@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: password123
 *         passwordConfirm:
 *           type: string
 *           format: password
 *           example: password123
 *
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: admin@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: password123
 *
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 5c8a1d5b0190b214360dc057
 *         name:
 *           type: string
 *           example: Bhranti Tamboli
 *         email:
 *           type: string
 *           example: bhranti@example.com
 *         role:
 *           type: string
 *           enum:
 *             - user
 *             - admin
 *             - lead-guide
 *           example: user
 *         active:
 *           type: boolean
 *           example: true
 */

////////////////////////////////////////////////////////////
// PUBLIC ROUTES
////////////////////////////////////////////////////////////

/**
 * @swagger
 * /api/v1/users/signup:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSignup'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Server error
 */
router.post(
  '/signup',
  signupValidation,
  validate,
  userController.uploadUserPhoto,
  authController.signup
);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Incorrect email or password
 */
router.post('/login', loginValidation, validate, authController.login);

/**
 * @swagger
 * /api/v1/users/logout:
 *   get:
 *     summary: Logout current user
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.get('/logout', authController.logout);

////////////////////////////////////////////////////////////
// LOGGED-IN USER ROUTES
////////////////////////////////////////////////////////////

/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     summary: Get current logged-in user
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user information
 *       401:
 *         description: Not authenticated
 */
router.get('/me', authController.protect, userController.getMe, userController.getUser);

/**
 * @swagger
 * /api/v1/users/updateMe:
 *   patch:
 *     summary: Update current user's information
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Bhranti Tamboli
 *               email:
 *                 type: string
 *                 format: email
 *                 example: bhranti@example.com
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Not authenticated
 */
router.patch('/updateMe', userController.uploadUserPhoto, userController.updateMe);

/**
 * @swagger
 * /api/v1/users/deleteMe:
 *   delete:
 *     summary: Deactivate current user
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       401:
 *         description: Not authenticated
 */
router.delete('/deleteMe', userController.deleteMe);

////////////////////////////////////////////////////////////
// ADMIN-ONLY ROUTES
////////////////////////////////////////////////////////////

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Admin - Users
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin access required
 */
router.route('/').get(userController.getAllUsers).post(userController.createUser);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags:
 *       - Admin - Users
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 5c8a1d5b0190b214360dc057
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 *
 *   patch:
 *     summary: Update user by ID
 *     tags:
 *       - Admin - Users
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 5c8a1d5b0190b214360dc057
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum:
 *                   - user
 *                   - admin
 *                   - lead-guide
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *
 *   delete:
 *     summary: Delete user by ID
 *     tags:
 *       - Admin - Users
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 5c8a1d5b0190b214360dc057
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
