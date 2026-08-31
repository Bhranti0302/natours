const path = require('path');
const express = require('express');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');
const adminRouter = require('./routes/adminRoutes');

const app = express();

app.set('trust proxy', 1);

// ==========================================================
// VIEW ENGINE
// ==========================================================

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// ==========================================================
// GLOBAL MIDDLEWARES
// ==========================================================

// CORS
app.use(cors());
app.options('*', cors());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", '*'],
        styleSrc: ["'self'", "'unsafe-inline'", '*'],
        imgSrc: ["'self'", '*', 'data:', 'blob:'],
        fontSrc: ["'self'", '*'],
        connectSrc: ["'self'", '*'],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'", '*'],
        frameSrc: ["'self'", '*'],
      },
    },

    crossOriginEmbedderPolicy: false,

    crossOriginOpenerPolicy: {
      policy: 'unsafe-none',
    },

    crossOriginResourcePolicy: {
      policy: 'cross-origin',
    },
  })
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// ==========================================================
// BODY PARSERS
// ==========================================================

app.use(express.json({ limit: '10kb' }));

app.use(
  express.urlencoded({
    extended: true,
    limit: '10kb',
  })
);

app.use(cookieParser());

// ==========================================================
// COMPRESSION
// ==========================================================

app.use(compression());

// ==========================================================
// CUSTOM MIDDLEWARE
// ==========================================================

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ==========================================================
// SWAGGER DOCUMENTATION
// ==========================================================

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ==========================================================
// ROUTES
// ==========================================================

// View routes
app.use('/', viewRouter);

// Tour routes
app.use('/api/v1/tours', tourRouter);

// User routes
app.use('/api/v1/users', userRouter);

// Review routes
app.use('/api/v1/reviews', reviewRouter);

// Booking routes
app.use('/api/v1/bookings', bookingRouter);

// Admin routes
app.use('/admin', adminRouter);

// ==========================================================
// HANDLE UNKNOWN ROUTES
// ==========================================================

app.all('*', (req, res, next) => {
  if (req.originalUrl === '/.well-known/appspecific/com.chrome.devtools.json') {
    return res.status(204).send();
  }

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ==========================================================
// GLOBAL ERROR HANDLER
// ==========================================================

app.use(globalErrorHandler);

module.exports = app;
