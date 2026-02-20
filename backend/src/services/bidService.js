const Bid = require('../models/Bid');
const CPTData = require('../models/CPTData');
const AppError = require('../utils/errorHandler');

/**
 * Place a new bid
 */
const placeBid = async (userId, { cptDataId, bidAmount }) => {
  const cptData = await CPTData.findById(cptDataId);
  if (!cptData) {
    throw new AppError('CPT data not found.', 404);
  }

  if (bidAmount <= cptData.reserveAmount) {
    throw new AppError(
      `Bid amount must be greater than the reserve amount of $${cptData.reserveAmount}.`,
      400
    );
  }

  const bid = await Bid.create({ userId, cptDataId, bidAmount });
  await bid.populate(['userId', 'cptDataId']);
  return bid;
};

/**
 * Get all bids for a specific user
 */
const getUserBids = async (userId) => {
  return Bid.find({ userId })
    .populate('cptDataId')
    .sort({ createdAt: -1 })
    .lean();
};

/**
 * Get a specific bid by ID
 */
const getBidById = async (bidId, userId) => {
  const bid = await Bid.findById(bidId).populate('cptDataId').lean();
  if (!bid) {
    throw new AppError('Bid not found.', 404);
  }
  if (bid.userId.toString() !== userId.toString()) {
    throw new AppError('Not authorized to view this bid.', 403);
  }
  return bid;
};

/**
 * Update a bid (only if still pending)
 */
const updateBid = async (bidId, userId, { bidAmount }) => {
  const bid = await Bid.findById(bidId);
  if (!bid) {
    throw new AppError('Bid not found.', 404);
  }
  if (bid.userId.toString() !== userId.toString()) {
    throw new AppError('Not authorized to update this bid.', 403);
  }
  if (bid.status !== 'pending') {
    throw new AppError('Cannot update a bid that has already been reviewed.', 400);
  }

  const cptData = await CPTData.findById(bid.cptDataId);
  if (bidAmount <= cptData.reserveAmount) {
    throw new AppError(
      `Bid amount must be greater than the reserve amount of $${cptData.reserveAmount}.`,
      400
    );
  }

  bid.bidAmount = bidAmount;
  await bid.save();
  await bid.populate('cptDataId');
  return bid;
};

module.exports = { placeBid, getUserBids, getBidById, updateBid };
