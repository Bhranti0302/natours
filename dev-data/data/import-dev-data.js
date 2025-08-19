const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Models
const Tour = require('../../models/tourModels');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModels');

// Load environment variables
dotenv.config({ path: './config.env' });

// Replace <PASSWORD> in DB string and connect
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ DB connection successful'));

// Read JSON files
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

// Import data into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false }); // skip password encryption
    await Review.create(reviews);
    console.log('✅ Data successfully loaded!');
    process.exit();
  } catch (err) {
    console.error('❌ Error loading data:', err);
    process.exit(1);
  }
};

// Delete all data from DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('🗑️ Data successfully deleted!');
    process.exit();
  } catch (err) {
    console.error('❌ Error deleting data:', err);
    process.exit(1);
  }
};

// Command line control
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
} else {
  console.log('⚠️ Please provide a valid argument: --import or --delete');
  process.exit();
}
