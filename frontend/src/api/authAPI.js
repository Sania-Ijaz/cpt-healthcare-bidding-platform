import axiosInstance from './axiosConfig';

export const register = (userData) => axiosInstance.post('/auth/register', userData);
export const login = (credentials) => axiosInstance.post('/auth/login', credentials);
export const logout = () => axiosInstance.post('/auth/logout');
export const refreshToken = (token) => axiosInstance.post('/auth/refresh-token', { token });
