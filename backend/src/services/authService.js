const User = require('../models/User');
const AppError = require('../utils/errorHandler');
const { generateToken, generateRefreshToken, verifyToken } = require('../utils/jwtUtils');

/**
 * Register a new user
 */
const register = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
  if (existingUser) {
    throw new AppError('Email is already registered.', 409);
  }

  const user = await User.create(userData);
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  return { user, token, refreshToken };
};

/**
 * Login user with email and password
 */
const login = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  return { user, token, refreshToken };
};

/**
 * Refresh access token using refresh token
 */
const refreshToken = async (token) => {
  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      throw new AppError('User not found.', 401);
    }
    const newToken = generateToken(user._id);
    return { user, token: newToken };
  } catch {
    throw new AppError('Invalid refresh token.', 401);
  }
};

module.exports = { register, login, refreshToken };
