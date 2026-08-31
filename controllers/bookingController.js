const Tour = require('../models/tourModels');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// ==========================================================
// CREATE BOOKING DIRECTLY
// ==========================================================

exports.createBooking = catchAsync(async (req, res, next) => {
  // --------------------------------------------------------
  // Get tour ID from URL
  // --------------------------------------------------------

  const { tourId } = req.params;

  // --------------------------------------------------------
  // Check logged-in user
  // --------------------------------------------------------

  if (!req.user) {
    return next(new AppError('You must be logged in to book a tour', 401));
  }

  // Your protect middleware should attach the user to req.user
  const userId = req.user._id || req.user.id;

  if (!userId) {
    return next(new AppError('User information is missing', 401));
  }

  // --------------------------------------------------------
  // Check if tour exists
  // --------------------------------------------------------

  const tour = await Tour.findById(tourId);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  // --------------------------------------------------------
  // Check if user already booked this tour
  // --------------------------------------------------------

  const existingBooking = await Booking.findOne({
    tour: tourId,
    user: userId,
  });

  if (existingBooking) {
    return next(new AppError('You have already booked this tour', 400));
  }

  // --------------------------------------------------------
  // Create booking directly
  // --------------------------------------------------------

  const booking = await Booking.create({
    tour: tourId,
    user: userId,
    price: tour.price,
  });

  // --------------------------------------------------------
  // Send response
  // --------------------------------------------------------

  res.status(201).json({
    status: 'success',
    message: 'Tour booked successfully',
    data: {
      booking,
    },
  });
});

// ==========================================================
// GET ONE BOOKING
// ==========================================================

exports.getBooking = factory.getOne(Booking);

// ==========================================================
// GET ALL BOOKINGS
// ==========================================================

exports.getAllBookings = factory.getAll(Booking);

// ==========================================================
// UPDATE BOOKING
// ==========================================================

exports.updateBooking = factory.updateOne(Booking);

// ==========================================================
// DELETE BOOKING
// ==========================================================

exports.deleteBooking = factory.deleteOne(Booking);
