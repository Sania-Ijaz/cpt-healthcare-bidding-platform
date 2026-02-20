const bidService = require('../services/bidService');
const successResponse = require('../utils/successResponse');

/**
 * POST /api/bid
 */
const placeBid = async (req, res, next) => {
  try {
    const bid = await bidService.placeBid(req.user._id, req.body);
    return successResponse(res, 201, 'Bid placed successfully.', bid);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/bid/user
 */
const getUserBids = async (req, res, next) => {
  try {
    const bids = await bidService.getUserBids(req.user._id);
    return successResponse(res, 200, 'User bids retrieved.', bids);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/bid/:id
 */
const getBidById = async (req, res, next) => {
  try {
    const bid = await bidService.getBidById(req.params.id, req.user._id);
    return successResponse(res, 200, 'Bid retrieved.', bid);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/bid/:id
 */
const updateBid = async (req, res, next) => {
  try {
    const bid = await bidService.updateBid(req.params.id, req.user._id, req.body);
    return successResponse(res, 200, 'Bid updated.', bid);
  } catch (error) {
    next(error);
  }
};

module.exports = { placeBid, getUserBids, getBidById, updateBid };
