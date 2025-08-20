const Tour = require('../models/tourModels');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModels');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking')
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediatly, please come back later.";
  next();
};

// ------------------------------
// Overview
// ------------------------------
exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

// ------------------------------
// Single Tour
// ------------------------------
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug })
    .populate({ path: 'reviews', fields: 'review rating user' })
    .populate({ path: 'locations' });

  if (!tour) return next(new AppError('There is no tour with that name.', 404));

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
    locations: tour.locations || [],
  });
});

// ------------------------------
// Auth Views
// ------------------------------
exports.getLoginForm = (req, res) => {
  res.status(200).render('login', { title: 'Log into your account' });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', { title: 'Create your account' });
};

// ------------------------------
// Account
// ------------------------------
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
    user: req.user,
    activePage: 'settings',
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { name: req.body.name, email: req.body.email },
    { new: true, runValidators: true }
  );

  if (req.xhr || req.headers.accept.indexOf('application/json') > -1) {
    return res.status(200).json({
      status: 'success',
      data: { user: updatedUser },
    });
  }

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
    activePage: 'settings',
  });
});

// ------------------------------
// Admin Panels
// ------------------------------

exports.getAllTours = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('manageTours', {
    title: 'Manage Tours',
    tours: tours.length ? tours : null, // fallback if empty
    activePage: 'manage-tours',
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).render('manageUsers', {
    title: 'Manage Users',
    users: users.length ? users : null,
    activePage: 'manage-users',
  });
});

exports.getAllBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find().populate('user', 'name email').populate('tour', 'name');

  res.status(200).render('manageBooking', {
    title: 'Manage Bookings',
    bookings: bookings.length ? bookings : null,
    activePage: 'manage-bookings',
  });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find().populate('user', 'name email').populate('tour', 'name');

  res.status(200).render('manageReviews', {
    title: 'Manage Reviews',
    reviews: reviews.length ? reviews : null,
    activePage: 'manage-reviews',
  });
});
// ------------------------------
// My Pages
// ------------------------------
exports.getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id }).populate('tour');
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('bookings', {
    title: 'My Tours',
    tours,
  });
});

exports.getMyBilling = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id }).populate(
    'tour',
    'name price imageCover'
  );

  res.status(200).render('billing', {
    title: 'My Billing',
    bookings,
    activePage: 'billing',
  });
});

exports.getMyReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id }).populate('tour', 'name imageCover');

  res.status(200).render('reviews', {
    title: 'My Reviews',
    reviews,
    activePage: 'reviews',
  });
});
