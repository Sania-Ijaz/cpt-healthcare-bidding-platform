const userService = require('../services/userService');
const successResponse = require('../utils/successResponse');

/**
 * GET /api/user/profile
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user._id);
    return successResponse(res, 200, 'Profile retrieved.', user);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/user/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user._id, req.body);
    return successResponse(res, 200, 'Profile updated.', user);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/user/dashboard
 */
const getDashboard = async (req, res, next) => {
  try {
    const data = await userService.getDashboardData(req.user._id);
    return successResponse(res, 200, 'Dashboard data retrieved.', data);
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, getDashboard };
