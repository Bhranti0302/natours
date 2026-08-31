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

// Safe debugging
// DO NOT print the full DATABASE value

console.log('DATABASE exists:', !!DB);
console.log('DATABASE length:', DB ? DB.length : 0);

if (DB) {
  console.log('DATABASE starts:', DB.substring(0, 30));

  console.log('DATABASE ends:', DB.substring(DB.length - 20));

  console.log('Contains backslash:', DB.includes('\\'));

  console.log('Contains quote:', DB.includes('"') || DB.includes("'"));

  console.log('Contains space:', DB.includes(' '));

  console.log('Contains newline:', DB.includes('\n') || DB.includes('\r'));
}

if (!DB) {
  console.error('❌ DATABASE environment variable is missing');

  process.exit(1);
}

// -----------------------------
// Connect to MongoDB
// -----------------------------

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
