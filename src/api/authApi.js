import axiosInstance from './axiosInstance.js';

export const loginUser = (credentials) => {
    return axiosInstance.post('/auth/login', credentials);
};

export const registerUser = (userData) => {
    return axiosInstance.post('/auth/register', userData);
};