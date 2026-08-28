const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// ======================================================
// HELPER FUNCTIONS
// ======================================================

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: 'lax',
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  };

  res.cookie('jwt', token, cookieOptions);

  // Don't send password to client
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// ======================================================
// SIGNUP
// ======================================================

exports.signup = catchAsync(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  };

  // If photo uploaded, save Cloudinary URL
  if (req.file) {
    newUserData.photo = req.file.path;
  }

  const newUser = await User.create(newUserData);

  createSendToken(newUser, 201, req, res);
});

// ======================================================
// LOGIN
// ======================================================

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check email and password
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // Find user and include password
  const user = await User.findOne({ email }).select('+password');

  // Check user and password
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, req, res);
});

// ======================================================
// LOGOUT
// ======================================================

exports.logout = (req, res) => {
  res.clearCookie('jwt');

  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    sameSite: 'lax',
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  res.redirect('/');
};

// ======================================================
// PROTECT ROUTES
// ======================================================

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // 1. Get token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. Otherwise get token from cookie
  else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // 3. No token
  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 4. Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 5. Find current user
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  // 6. Store user in request
  req.user = currentUser;

  // 7. Make user available to Pug views
  res.locals.user = currentUser;

  next();
});

// ======================================================
// CHECK LOGIN FOR RENDERED PAGES
// ======================================================

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // Verify token
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

      // Find user
      const currentUser = await User.findById(decoded.id);

      if (!currentUser) {
        return next();
      }

      // Make user available to Pug
      res.locals.user = currentUser;

      return next();
    } catch (err) {
      return next();
    }
  }

  next();
};

// ======================================================
// RESTRICT TO CERTAIN ROLES
// ======================================================

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
};
