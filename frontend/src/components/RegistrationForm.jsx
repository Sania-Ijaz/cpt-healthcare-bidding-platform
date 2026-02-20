import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import { validateEmail, validatePassword, validatePhone, validateZip } from '../utils/validators';
import { USER_TYPES, PLAN_TYPES } from '../utils/constants';
import { fadeInUp } from '../animations/framerMotion';

const RegistrationForm = ({ prefillCpt = '', prefillZip = '' }) => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    zipCode: prefillZip || '',
    type: '',
    numberOfEmployees: '',
    planType: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!validateEmail(form.email)) newErrors.email = 'Invalid email address.';
    if (!validatePassword(form.password))
      newErrors.password =
        'Password must be 8+ chars with uppercase, lowercase, number, and special char.';
    if (!validatePhone(form.phone)) newErrors.phone = 'Phone must be exactly 10 digits.';
    if (!validateZip(form.zipCode)) newErrors.zipCode = 'ZIP code must be exactly 5 digits.';
    if (!form.type) newErrors.type = 'Please select a user type.';
    if (form.type === USER_TYPES.BROKER || form.type === USER_TYPES.EMPLOYER) {
      if (!form.numberOfEmployees) newErrors.numberOfEmployees = 'Number of employees is required.';
      if (!form.planType) newErrors.planType = 'Plan type is required.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setServerError('');
    try {
      const payload = { ...form };
      if (form.numberOfEmployees) payload.numberOfEmployees = parseInt(form.numberOfEmployees);
      if (!payload.planType) delete payload.planType;
      if (!payload.numberOfEmployees) delete payload.numberOfEmployees;

      await register(payload);

      if (prefillCpt || prefillZip) {
        navigate('/results');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showConditional =
    form.type === USER_TYPES.BROKER || form.type === USER_TYPES.EMPLOYER;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="input-field"
              placeholder="John"
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="input-field"
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="input-field"
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="input-field"
            placeholder="Min 8 chars, upper/lower/number/special"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        {/* Phone & ZIP */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="input-field"
              placeholder="10 digits"
              maxLength={10}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
            <input
              type="text"
              name="zipCode"
              value={form.zipCode}
              onChange={handleChange}
              className="input-field"
              placeholder="5 digits"
              maxLength={5}
            />
            {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
          </div>
        </div>

        {/* User Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">User Type *</label>
          <select name="type" value={form.type} onChange={handleChange} className="input-field">
            <option value="">Select user type</option>
            <option value={USER_TYPES.PATIENT}>Patient</option>
            <option value={USER_TYPES.BROKER}>Broker</option>
            <option value={USER_TYPES.EMPLOYER}>Employer</option>
          </select>
          {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
        </div>

        {/* Conditional Fields */}
        {showConditional && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Employees *
              </label>
              <input
                type="number"
                name="numberOfEmployees"
                value={form.numberOfEmployees}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g. 100"
                min="1"
              />
              {errors.numberOfEmployees && (
                <p className="text-red-500 text-xs mt-1">{errors.numberOfEmployees}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan Type *</label>
              <select
                name="planType"
                value={form.planType}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select plan type</option>
                {PLAN_TYPES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              {errors.planType && <p className="text-red-500 text-xs mt-1">{errors.planType}</p>}
            </div>
          </motion.div>
        )}

        {serverError && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{serverError}</div>
        )}

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </motion.button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
            Sign in
          </Link>
        </p>
      </form>
    </motion.div>
  );
};

export default RegistrationForm;
