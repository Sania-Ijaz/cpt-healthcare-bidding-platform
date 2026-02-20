export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const USER_TYPES = {
  PATIENT: 'patient',
  BROKER: 'broker',
  EMPLOYER: 'employer',
};

export const PLAN_TYPES = ['PPO', 'HMO', 'EPO', 'HDHP', 'Custom'];

export const BID_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  DENIED: 'denied',
};

export const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  denied: 'bg-red-100 text-red-800',
};

export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};
