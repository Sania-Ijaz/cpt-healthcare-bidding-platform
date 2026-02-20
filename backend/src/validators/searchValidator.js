const AppError = require('../utils/errorHandler');

const validateSearch = (req, res, next) => {
  const { cpt, zip } = req.query;
  if (!cpt && !zip) {
    return next(new AppError('At least one search parameter (cpt or zip) is required.', 400));
  }
  if (zip && !/^\d{5}$/.test(zip)) {
    return next(new AppError('ZIP code must be exactly 5 digits.', 400));
  }
  next();
};

module.exports = { validateSearch };
