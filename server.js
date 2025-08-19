const dotenv = require('dotenv'); // 1) require dotenv first
dotenv.config({ path: './config.env' }); // 2) load env vars

const mongoose = require('mongoose');
const app = require('./app'); // 3) only now require app
const Tour = require('./models/tourModels');

// console.log('Stripe Secret:', process.env.STRIPE_SECRET_KEY ? '✅ Loaded' : '❌ Missing');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successful (Atlas)');
  })
  .catch((err) => console.error('❌ DB connection error:', err.message));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => process.exit(1));
});
