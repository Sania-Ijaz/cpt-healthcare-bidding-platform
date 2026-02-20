const User = require('../models/User');
const Bid = require('../models/Bid');
const AppError = require('../utils/errorHandler');

/**
 * Get all users with optional filtering and pagination
 */
const getAllUsers = async ({ type, page = 1, limit = 20 }) => {
  const query = {};
  if (type) query.type = type;

  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find(query).select('-password').skip(skip).limit(limit).lean(),
    User.countDocuments(query),
  ]);

  // Attach bid counts
  const userIds = users.map((u) => u._id);
  const bidCounts = await Bid.aggregate([
    { $match: { userId: { $in: userIds } } },
    { $group: { _id: '$userId', count: { $sum: 1 } } },
  ]);
  const bidCountMap = {};
  bidCounts.forEach((b) => { bidCountMap[b._id.toString()] = b.count; });

  const usersWithBids = users.map((u) => ({
    ...u,
    bidCount: bidCountMap[u._id.toString()] || 0,
  }));

  return {
    users: usersWithBids,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get a specific user by ID
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password').lean();
  if (!user) throw new AppError('User not found.', 404);
  return user;
};

/**
 * Get all bids for a specific user (admin view)
 */
const getUserBids = async (userId) => {
  const user = await User.findById(userId).select('-password').lean();
  if (!user) throw new AppError('User not found.', 404);

  const bids = await Bid.find({ userId })
    .populate('userId', '-password')
    .populate('cptDataId')
    .sort({ createdAt: -1 })
    .lean();

  return { user, bids };
};

/**
 * Get all bids in the system
 */
const getAllBids = async ({ page = 1, limit = 20, status }) => {
  const query = {};
  if (status) query.status = status;

  const skip = (page - 1) * limit;
  const [bids, total] = await Promise.all([
    Bid.find(query)
      .populate('userId', '-password')
      .populate('cptDataId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Bid.countDocuments(query),
  ]);

  return {
    bids,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Approve or deny a bid
 */
const updateBidStatus = async (bidId, { status, adminComments }) => {
  const validStatuses = ['approved', 'denied'];
  if (!validStatuses.includes(status)) {
    throw new AppError('Status must be approved or denied.', 400);
  }

  const bid = await Bid.findById(bidId);
  if (!bid) throw new AppError('Bid not found.', 404);

  bid.status = status;
  if (adminComments) bid.adminComments = adminComments;
  await bid.save();

  await bid.populate(['userId', 'cptDataId']);
  return bid;
};

module.exports = { getAllUsers, getUserById, getUserBids, getAllBids, updateBidStatus };
