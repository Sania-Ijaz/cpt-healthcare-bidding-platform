import axiosInstance from './axiosConfig';

export const placeBid = (bidData) => axiosInstance.post('/bid', bidData);
export const getUserBids = () => axiosInstance.get('/bid/user');
export const getBidById = (id) => axiosInstance.get(`/bid/${id}`);
export const updateBid = (id, data) => axiosInstance.patch(`/bid/${id}`, data);
