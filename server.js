const dotenv = require('dotenv');
dotenv.config({ path: './config.env' }); // Load env vars first

const mongoose = require('mongoose');
const app = require('./app');

// -----------------------------
// Handle uncaught exceptions
// -----------------------------
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// -----------------------------
// Database Connection
// -----------------------------
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify is no longer supported in latest mongoose
  })
  .then(() => console.log('✅ DB connection successful'))
  .catch((err) => {
    console.error('❌ DB connection error:', err.message);
    process.exit(1);
  });

// -----------------------------
// Start Server
// -----------------------------
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`🚀 App is running on port ${port}...`);
});

// -----------------------------
// Handle unhandled rejections
// -----------------------------
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION 💥 Shutting down...');
  console.error(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});

// -----------------------------
// Handle SIGTERM (Heroku / Docker)
// -----------------------------
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💤 Process terminated!');
  });
});
