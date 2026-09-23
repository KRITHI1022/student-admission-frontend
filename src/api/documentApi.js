import axiosInstance from './axiosInstance.js';

export const uploadDocument = (
    applicationId,
    documentType,
    file
) => {

    const formData = new FormData();

    formData.append(
        'documentType',
        documentType
    );

    formData.append(
        'file',
        file
    );

    return axiosInstance.post(
        `/documents/upload/${applicationId}`,
        formData,
        {
            headers: {
                'Content-Type':
                    'multipart/form-data'
            }
        }
    );
};

export const getDocumentsByApplication =
    (applicationId) =>
        axiosInstance.get(
            `/documents/application/${applicationId}`
        );

export const viewDocument =
    (documentId) =>
        axiosInstance.get(
            `/documents/view/${documentId}`,
            {
                responseType: 'blob'
            }
        );

export const verifyDocument = (
    documentId,
    verificationData
) =>
    axiosInstance.put(
        `/documents/admin/${documentId}/verify`,
        verificationData
    );