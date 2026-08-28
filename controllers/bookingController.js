const Tour = require('../models/tourModels');
const Booking = require('../models/bookingModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

//////////////////////////////////////////////////////////////////

// 1) CREATE BOOKING DIRECTLY

//////////////////////////////////////////////////////////////////

exports.createBooking = catchAsync(async (req, res, next) => {
  // Get tour ID from URL
  const tourId = req.params.tourId;

  // Get logged-in user from protect middleware
  const userId = req.user.id;

  // Find the tour
  const tour = await Tour.findById(tourId);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  // Prevent duplicate bookings
  const existingBooking = await Booking.findOne({
    tour: tourId,
    user: userId,
  });

  if (existingBooking) {
    return next(new AppError('You have already booked this tour', 400));
  }

  // Create booking directly
  const booking = await Booking.create({
    tour: tourId,
    user: userId,
    price: tour.price,
  });

  // Send response
  res.status(201).json({
    status: 'success',
    message: 'Tour booked successfully',
    data: {
      booking,
    },
  });
});

//////////////////////////////////////////////////////////////////

// 2) GET ONE BOOKING

//////////////////////////////////////////////////////////////////

exports.getBooking = factory.getOne(Booking);

//////////////////////////////////////////////////////////////////

// 3) GET ALL BOOKINGS

//////////////////////////////////////////////////////////////////

exports.getAllBookings = factory.getAll(Booking);

//////////////////////////////////////////////////////////////////

// 4) UPDATE BOOKING

//////////////////////////////////////////////////////////////////

exports.updateBooking = factory.updateOne(Booking);

//////////////////////////////////////////////////////////////////

// 5) DELETE BOOKING

//////////////////////////////////////////////////////////////////

exports.deleteBooking = factory.deleteOne(Booking);
