const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// ---------------------
// Public Routes
// ---------------------

// Signup with photo upload (multer parses both file + text fields)
router.post(
  '/signup',
  userController.uploadUserPhoto, // handles `req.file` + `req.body` for multipart form
  authController.signup
);

router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// ---------------------
// Protect routes below this line
// ---------------------
router.use(authController.protect);

// Logged-in user routes
router.get('/me', userController.getMe, userController.getUser);

router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

router.delete('/deleteMe', userController.deleteMe);
router.patch('/updateMyPassword', authController.updatePassword);

// ---------------------
// Admin-only routes
// ---------------------
router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers).post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
