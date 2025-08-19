const Tour = require('../models/tourModels');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModels');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Overview page
exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

// Single tour page
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug })
    .populate({
      path: 'reviews',
      fields: 'review rating user',
    })
    .populate({
      path: 'locations', // Only works if 'locations' is a referenced model
    });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  const locations = tour.locations || [];

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
    locations,
  });
});

// Login form
exports.getLoginForm = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
});

// Sign up form
exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Create your account',
  });
};

// Account page
exports.getAccount = catchAsync(async (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
    user: req.user, // assuming req.user is set by protect middleware
  });
});

// Update user data (profile)
exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    { new: true, runValidators: true }
  );

  // If request is AJAX (fetch/axios), respond with JSON
  if (req.xhr || req.headers.accept.indexOf('application/json') > -1) {
    return res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  }

  // Otherwise re-render account page with updated data
  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});

// Account page
exports.getAccount = catchAsync(async (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
    user: req.user,
    activePage: 'settings',
  });
});

// ------------------------------
// Manage Tours
// ------------------------------
exports.getAllTours = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('manageTours', {
    title: 'Manage Tours',
    tours,
    activePage: 'manage-tours',
  });
});

// ------------------------------
// Manage Users
// ------------------------------
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).render('manageUsers', {
    title: 'Manage Users',
    users,
    activePage: 'manage-user',
  });
});

// ------------------------------
// Manage Bookings
// ------------------------------
exports.getAllBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find()
    .populate('user', 'name email') // populate user name & email
    .populate('tour', 'name'); // populate tour name & price

  res.status(200).render('manageBooking', {
    title: 'Manage Bookings',
    bookings,
    activePage: 'manage-booking',
  });
});

// ------------------------------
// Manage Reviews
// ------------------------------
exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find().populate('user', 'name email').populate('tour', 'name');

  res.status(200).render('manageReviews', {
    title: 'Manage Reviews',
    reviews,
    activePage: 'manage-reviews',
  });
});

// ------------------------------
// Manage Reviews
// ------------------------------

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings for the current user
  const bookings = await Booking.find({ user: req.user.id }).populate('tour');

  // 2) Extract the tours (if you just want tour info)
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  // 3) Render the bookings page
  res.status(200).render('bookings', {
    title: 'My Tours',
    tours,
  });
});

exports.getMyBilling = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id }).populate(
    'tour', // field in Booking schema that references Tour
    'name price imageCover' // fields to select from Tour
  );

  // Debug: check what’s coming
  console.log(bookings);

  res.status(200).render('billing', {
    title: 'My Billing',
    bookings,
    activePage: 'billing',
  });
});

exports.getMyReviews = catchAsync(async (req, res, next) => {
  // Find all reviews created by the logged-in user
  const reviews = await Review.find({ user: req.user.id }).populate('tour', 'name imageCover');

  // Render the reviews page
  res.status(200).render('reviews', {
    title: 'My Reviews',
    reviews,
    activePage: 'reviews',
  });
});
