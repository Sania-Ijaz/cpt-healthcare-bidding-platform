const AppError = require('../utils/errorHandler');

const validateBid = (req, res, next) => {
  const { bidAmount, cptDataId } = req.body;
  if (!bidAmount || !cptDataId) {
    return next(new AppError('Bid amount and CPT data ID are required.', 400));
  }
  if (typeof bidAmount !== 'number' || bidAmount <= 0) {
    return next(new AppError('Bid amount must be a positive number.', 400));
  }
  next();
};

module.exports = { validateBid };
