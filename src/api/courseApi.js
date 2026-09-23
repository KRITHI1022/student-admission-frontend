import axiosInstance from './axiosInstance.js';

export const getAllCourses = () => {
    return axiosInstance.get('/courses');
};

export const createCourse = (courseData) => {
    return axiosInstance.post('/courses/admin/create', courseData);
};