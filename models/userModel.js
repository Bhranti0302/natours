const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

// -----------------------------
// User Schema
// -----------------------------

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A user name must be less than or equal to 40 characters'],
    minlength: [8, 'A user name must be at least 8 characters'],
  },

  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },

  photo: {
    type: String,
    default: 'default.jpg',
  },

  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: [8, 'A password must be at least 8 characters'],
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords do not match!',
    },
  },

  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },

  passwordChangedAt: Date,

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// -----------------------------
// Hash Password Before Saving
// -----------------------------

userSchema.pre('save', async function () {
  // Only hash password if it was modified
  if (!this.isModified('password')) {
    return;
  }

  // Hash password
  this.password = await bcrypt.hash(this.password, 12);

  // Remove passwordConfirm
  this.passwordConfirm = undefined;
});

// -----------------------------
// Update passwordChangedAt
// -----------------------------

userSchema.pre('save', function () {
  // Don't update when creating a new user
  if (!this.isModified('password') || this.isNew) {
    return;
  }

  this.passwordChangedAt = Date.now() - 1000;
});

// -----------------------------
// Check Password
// -----------------------------

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// -----------------------------
// Check If Password Changed
// -----------------------------

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

// -----------------------------
// Exclude Inactive Users
// -----------------------------

userSchema.pre('find', function () {
  this.find({
    active: {
      $ne: false,
    },
  });
});

// -----------------------------
// User Model
// -----------------------------

const User = mongoose.model('User', userSchema);

module.exports = User;
