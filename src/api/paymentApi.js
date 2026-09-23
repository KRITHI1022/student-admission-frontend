import axiosInstance from './axiosInstance.js';

export const createPaymentOrder = (applicationId) => {
    return axiosInstance.post(`/payments/create-order/${applicationId}`);
};

export const verifyPayment = (verificationData) => {
    return axiosInstance.post('/payments/verify', verificationData);
};