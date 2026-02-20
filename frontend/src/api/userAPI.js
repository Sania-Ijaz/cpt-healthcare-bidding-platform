import axiosInstance from './axiosConfig';

export const getProfile = () => axiosInstance.get('/user/profile');
export const updateProfile = (data) => axiosInstance.patch('/user/profile', data);
export const getDashboard = () => axiosInstance.get('/user/dashboard');
