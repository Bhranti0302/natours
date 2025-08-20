// controllers/adminController.js
exports.getAllTours = (req, res) => {
  res.status(200).render('admin/manageTours', {
    title: 'Manage Tours',
  });
};

exports.getAllUsers = (req, res) => {
  res.status(200).render('admin/manageUsers', {
    title: 'Manage Users',
  });
};

exports.getAllBookings = (req, res) => {
  res.status(200).render('admin/manageBookings', {
    title: 'Manage Bookings',
  });
};

exports.getAllReviews = (req, res) => {
  res.status(200).render('admin/manageReviews', {
    title: 'Manage Reviews',
  });
};
