import axiosInstance from './axiosConfig';

export const getAllUsers = (params) => axiosInstance.get('/admin/users', { params });
export const getUserById = (id) => axiosInstance.get(`/admin/user/${id}`);
export const getUserBids = (id) => axiosInstance.get(`/admin/user/${id}/bids`);
export const getAllBids = (params) => axiosInstance.get('/admin/bids', { params });
export const updateBidStatus = (id, data) => axiosInstance.patch(`/admin/bid/${id}`, data);
