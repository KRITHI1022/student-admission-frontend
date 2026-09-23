import axiosInstance from './axiosInstance.js';

export const getMyApplications = () => {
    return axiosInstance.get('/applications/my');
};

export const applyForCourse = (applicationData) => {
    return axiosInstance.post('/applications', applicationData);
};

export const getAllApplicationsAdmin = (status) => {
    const params = status ? { status } : {};
    return axiosInstance.get('/applications/admin/all', { params });
};

export const updateApplicationStatus = (applicationId, statusData) => {
    return axiosInstance.put(`/applications/admin/${applicationId}/status`, statusData);
};