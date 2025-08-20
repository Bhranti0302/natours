const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// GET all documents (JSON or render if options.view is provided)
exports.getAll = (Model, options = {}) =>
  catchAsync(async (req, res, next) => {
    let filter = {};

    // Nested filtering
    if (options.filterByParam && req.params[options.filterByParam]) {
      filter[options.filterField || options.filterByParam] = req.params[options.filterByParam];
    }

    // Select fields if provided
    const fields = options.fields || null;

    const query = Model.find(filter);
    if (fields) query.select(fields);

    const docs = await query;

    // If view is provided, render it
    if (options.view) {
      return res.status(200).render(options.view, {
        title: options.title || 'Manage',
        [options.dataVar || 'data']: docs,
        user: req.user, // 👈 always send logged-in user
        activePage: options.activePage || '',
      });
    }

    // Otherwise, send JSON
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: { data: docs },
    });
  });

// GET one document by ID
exports.getOne = (Model, popOptions, options = {}) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    if (options.view) {
      return res.status(200).render(options.view, {
        title: options.title || 'Detail',
        [options.dataVar || 'data']: doc,
        user: req.user,
        activePage: options.activePage || '',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { data: doc },
    });
  });

// CREATE one document
exports.createOne = (Model, options = {}) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    if (options.view) {
      return res.status(201).render(options.view, {
        title: options.title || 'Created',
        [options.dataVar || 'data']: doc,
        user: req.user,
        activePage: options.activePage || '',
      });
    }

    res.status(201).json({
      status: 'success',
      data: { data: doc },
    });
  });

// UPDATE one document
exports.updateOne = (Model, options = {}) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) return next(new AppError('No document found with that ID', 404));

    if (options.view) {
      return res.status(200).render(options.view, {
        title: options.title || 'Updated',
        [options.dataVar || 'data']: doc,
        user: req.user,
        activePage: options.activePage || '',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { data: doc },
    });
  });

// DELETE one document
exports.deleteOne = (Model, options = {}) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError('No document found with that ID', 404));

    if (options.view) {
      return res.status(200).render(options.view, {
        title: options.title || 'Deleted',
        user: req.user,
        activePage: options.activePage || '',
      });
    }

    res.status(204).json({ status: 'success', data: null });
  });
