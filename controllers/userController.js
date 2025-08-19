const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const sharp = require('sharp');

// --------------------
// Multer Storage Configuration
// --------------------
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now();
//     // Use 'newuser' if no logged-in user yet (signup case)
//     const userId = req.user?.id || 'newuser';
//     cb(null, `user-${userId}-${uniqueSuffix}.jpeg`);
//   },
// });

// --------------------
// Multer Storage Configuration (Memory for Sharp)

// --------------------
const multerStorage = multer.memoryStorage();

// --------------------
// Multer File Filter - allow only images
// --------------------
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

// --------------------
// Create upload middleware
// --------------------
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// Middleware to handle single photo upload
exports.uploadUserPhoto = upload.single('photo');

// --------------------
// Resize uploaded photo & save to disk
// --------------------
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  const uniqueSuffix = Date.now();
  const userId = req.user?.id || 'newuser';
  req.file.filename = `user-${userId}-${uniqueSuffix}.jpeg`;

  // Process image from buffer
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

// --------------------
// Utility: filter only allowed fields
// --------------------
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// --------------------
// Get current user's data
// --------------------
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// --------------------
// Update logged-in user's own data (name, email, photo)
// --------------------
exports.updateMe = catchAsync(async (req, res, next) => {
  console.log('Uploaded file:', req.file);

  // 1) Prevent password updates here
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('This route is not for password updates. Please use /updateMyPassword.', 400)
    );
  }

  // 2) Filter allowed fields
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) {
    // Delete old photo if exists
    const oldUser = await User.findById(req.user.id);
    if (oldUser && oldUser.photo && fs.existsSync(`public/img/users/${oldUser.photo}`)) {
      fs.unlinkSync(`public/img/users/${oldUser.photo}`);
    }
    filteredBody.photo = req.file.filename;
  }

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser },
  });
});

// --------------------
// Deactivate logged-in user's account
// --------------------
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

// --------------------
// Admin-only CRUD routes
// --------------------
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.createUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
