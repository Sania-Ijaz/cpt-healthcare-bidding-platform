const adminService = require('../services/adminService');
const successResponse = require('../utils/successResponse');

/**
 * GET /api/admin/users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { type, page, limit } = req.query;
    const data = await adminService.getAllUsers({ type, page, limit });
    return successResponse(res, 200, 'Users retrieved.', data);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/user/:id
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await adminService.getUserById(req.params.id);
    return successResponse(res, 200, 'User retrieved.', user);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/user/:id/bids
 */
const getUserBids = async (req, res, next) => {
  try {
    const data = await adminService.getUserBids(req.params.id);
    return successResponse(res, 200, "User's bids retrieved.", data);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/bids
 */
const getAllBids = async (req, res, next) => {
  try {
    const { page, limit, status } = req.query;
    const data = await adminService.getAllBids({ page, limit, status });
    return successResponse(res, 200, 'All bids retrieved.', data);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/bid/:id
 */
const updateBidStatus = async (req, res, next) => {
  try {
    const bid = await adminService.updateBidStatus(req.params.id, req.body);
    return successResponse(res, 200, 'Bid status updated.', bid);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, getUserById, getUserBids, getAllBids, updateBidStatus };
