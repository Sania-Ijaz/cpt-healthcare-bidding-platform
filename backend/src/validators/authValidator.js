const AppError = require('../utils/errorHandler');

const validateRegistration = (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    zipCode,
    type,
    numberOfEmployees,
    planType,
  } = req.body;

  if (!firstName || !lastName || !email || !password || !phone || !zipCode || !type) {
    return next(new AppError('All required fields must be provided.', 400));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new AppError('Invalid email format.', 400));
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  if (!passwordRegex.test(password)) {
    return next(
      new AppError(
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.',
        400
      )
    );
  }

  if (!/^\d{10}$/.test(phone)) {
    return next(new AppError('Phone number must be exactly 10 digits.', 400));
  }

  if (!/^\d{5}$/.test(zipCode)) {
    return next(new AppError('ZIP code must be exactly 5 digits.', 400));
  }

  const validTypes = ['patient', 'broker', 'employer'];
  if (!validTypes.includes(type)) {
    return next(new AppError('User type must be patient, broker, or employer.', 400));
  }

  if (type === 'broker' || type === 'employer') {
    if (!numberOfEmployees) {
      return next(new AppError('Number of employees is required for broker/employer.', 400));
    }
    const validPlans = ['PPO', 'HMO', 'EPO', 'HDHP', 'Custom'];
    if (!planType || !validPlans.includes(planType)) {
      return next(new AppError('Valid plan type is required for broker/employer.', 400));
    }
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Email and password are required.', 400));
  }
  next();
};

module.exports = { validateRegistration, validateLogin };
