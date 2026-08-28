const dotenv = require('dotenv');

dotenv.config();

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

const DB = process.env.DATABASE;

if (!DB) {
  console.error('❌ DATABASE environment variable is missing');
  process.exit(1);
}

mongoose
  .connect(DB)
  .then(() => {
    console.log('✅ DB connection successful');

    // -----------------------------
    // Start Server
    // -----------------------------

    const port = process.env.PORT || 3000;

    const server = app.listen(port, '0.0.0.0', () => {
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
    // Handle SIGTERM
    // -----------------------------

    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');

      server.close(() => {
        console.log('💤 Process terminated!');
      });
    });
  })
  .catch((err) => {
    console.error('❌ DB connection error:', err.message);
    process.exit(1);
  });
