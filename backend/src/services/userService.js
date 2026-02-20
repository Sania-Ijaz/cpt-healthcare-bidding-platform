const User = require('../models/User');
const Bid = require('../models/Bid');
const AppError = require('../utils/errorHandler');

/**
 * Get user profile
 */
const getProfile = async (userId) => {
  const user = await User.findById(userId).select('-password').lean();
  if (!user) throw new AppError('User not found.', 404);
  return user;
};

/**
 * Update user profile
 */
const updateProfile = async (userId, updates) => {
  const allowedUpdates = ['firstName', 'lastName', 'phone', 'zipCode', 'numberOfEmployees', 'planType'];
  const filteredUpdates = {};
  for (const key of allowedUpdates) {
    if (updates[key] !== undefined) filteredUpdates[key] = updates[key];
  }

  const user = await User.findByIdAndUpdate(userId, filteredUpdates, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!user) throw new AppError('User not found.', 404);
  return user;
};

/**
 * Get dashboard data (profile + bids summary)
 */
const getDashboardData = async (userId) => {
  const [user, bids] = await Promise.all([
    User.findById(userId).select('-password').lean(),
    Bid.find({ userId }).populate('cptDataId').sort({ createdAt: -1 }).lean(),
  ]);

  if (!user) throw new AppError('User not found.', 404);

  return { user, bids, totalBids: bids.length };
};

module.exports = { getProfile, updateProfile, getDashboardData };
