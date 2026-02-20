import axiosInstance from './axiosConfig';

export const searchCPT = (params) => axiosInstance.get('/search', { params });
