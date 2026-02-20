const authService = require('../services/authService');
const successResponse = require('../utils/successResponse');

/**
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { user, token, refreshToken } = await authService.register(req.body);
    return successResponse(res, 201, 'Registration successful.', { user, token, refreshToken });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token, refreshToken } = await authService.login(email, password);
    return successResponse(res, 200, 'Login successful.', { user, token, refreshToken });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 */
const logout = (req, res) => {
  return successResponse(res, 200, 'Logged out successfully.');
};

/**
 * POST /api/auth/refresh-token
 */
const refreshToken = async (req, res, next) => {
  try {
    const { token: refreshTkn } = req.body;
    if (!refreshTkn) {
      return res.status(400).json({ success: false, message: 'Refresh token required.' });
    }
    const { user, token } = await authService.refreshToken(refreshTkn);
    return successResponse(res, 200, 'Token refreshed.', { user, token });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout, refreshToken };
