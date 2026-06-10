const Tour = require('../models/tourModels');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

//////////////////////////////////////////////////////////////////
// 1) CREATE STRIPE CHECKOUT SESSION
//////////////////////////////////////////////////////////////////
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],

    success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,

    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,

    customer_email: req.user.email,

    // 🔥 IMPORTANT DATA
    client_reference_id: req.params.tourId.toString(),
    metadata: {
      userId: req.user.id,
    },

    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
        },
        quantity: 1,
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    sessionId: session.id,
  });
});

//////////////////////////////////////////////////////////////////
// 2) TEMP BOOKING USING QUERY (ONLY FOR DEV)
//////////////////////////////////////////////////////////////////
exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;

  if (!tour || !user || !price) return next();

  // Prevent duplicate bookings
  const existingBooking = await Booking.findOne({ tour, user });
  if (existingBooking) {
    return res.redirect('/my-tours');
  }

  await Booking.create({ tour, user, price });

  // Clean URL
  res.redirect('/my-tours');
});

//////////////////////////////////////////////////////////////////
// 3) CREATE BOOKING FROM WEBHOOK (PRODUCTION)
//////////////////////////////////////////////////////////////////
const createBookingFromWebhook = async (session) => {
  const tour = session.client_reference_id;
  const user = session.metadata?.userId;
  const price = session.amount_total / 100;

  if (!tour || !user) {
    throw new Error('Missing tour or user data in session');
  }

  // Prevent duplicate booking
  const existingBooking = await Booking.findOne({ tour, user });
  if (existingBooking) return;

  await Booking.create({ tour, user, price });
};

//////////////////////////////////////////////////////////////////
// 4) STRIPE WEBHOOK HANDLER
//////////////////////////////////////////////////////////////////
exports.webhookCheckout = (req, res) => {
  console.log('🔥 WEBHOOK ROUTE HIT');

  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('❌ Webhook signature failed:', err.message);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    createBookingFromWebhook(event.data.object)
      .then(() => console.log('✅ Booking created from webhook'))
      .catch((err) => console.error('❌ Booking creation failed:', err.message));
  }

  res.status(200).json({ received: true });
};

//////////////////////////////////////////////////////////////////
// 5) CRUD HANDLERS
//////////////////////////////////////////////////////////////////
exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
