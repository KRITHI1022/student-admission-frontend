import { useEffect, useState } from 'react';

import {
    getAllApplicationsAdmin,
    updateApplicationStatus
} from '../../api/applicationApi.js';

import {
    getDocumentsByApplication,
    viewDocument,
    verifyDocument
} from '../../api/documentApi.js';


// ============================================================
// HELPERS
// ============================================================

const label = (s) =>
    (s || '').replaceAll('_', ' ');


const badge = (s) => ({
    SUBMITTED: 'status-submitted',
    UNDER_REVIEW: 'status-review',
    APPROVED: 'status-approved',
    REJECTED: 'status-rejected',
    ADMITTED: 'status-admitted'
}[s] || 'status-pending');


const paymentLabel = (status) => {
    if (status === 'SUCCESS') return 'Paid';
    if (status === 'FAILED') return 'Failed';

    return 'Pending';
};


const paymentBadge = (status) => {
    if (status === 'SUCCESS') return 'status-approved';
    if (status === 'FAILED') return 'status-rejected';

    return 'status-pending';
};


// ============================================================
// VALID APPLICATION STATUS TRANSITIONS
// ============================================================

const getAllowedStatuses = (currentStatus) => {

    switch (currentStatus) {

        case 'SUBMITTED':
            return [
                'SUBMITTED',
                'UNDER_REVIEW',
                'REJECTED'
            ];

        case 'UNDER_REVIEW':
            return [
                'UNDER_REVIEW',
                'APPROVED',
                'REJECTED'
            ];

        case 'APPROVED':
            return [
                'APPROVED',
                'ADMITTED'
            ];

        case 'REJECTED':
            return [
                'REJECTED'
            ];

        case 'ADMITTED':
            return [
                'ADMITTED'
            ];

        default:
            return [currentStatus];
    }
};


const statusLabel = (status) => {

    const labels = {
        SUBMITTED: 'Submitted',
        UNDER_REVIEW: 'Under review',
        APPROVED: 'Approved',
        REJECTED: 'Rejected',
        ADMITTED: 'Admitted'
    };

    return labels[status] || label(status);
};


export default function AdminDashboard() {

    const [applications, setApplications] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true);

    const [selectedApp, setSelectedApp] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [remarks, setRemarks] = useState('');
    const [message, setMessage] = useState('');

    const [documents, setDocuments] = useState([]);
    const [documentsLoading, setDocumentsLoading] = useState(false);
    const [verifyingDocument, setVerifyingDocument] = useState(null);


    // ============================================================
    // FETCH APPLICATIONS
    // ============================================================

    const fetchApplications = async () => {

        setLoading(true);

        try {

            const response =
                await getAllApplicationsAdmin(
                    statusFilter || null
                );

            setApplications(response.data);

        } catch {

            setMessage(
                'Failed to load applications'
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        fetchApplications();

    }, [statusFilter]);


    // ============================================================
    // OPEN REVIEW MODAL
    // ============================================================

    const openReview = async (app) => {

        setSelectedApp(app);

        setNewStatus(app.status);

        setRemarks(app.remarks || '');

        setMessage('');

        setDocuments([]);

        setDocumentsLoading(true);

        try {

            const response =
                await getDocumentsByApplication(app.id);

            setDocuments(response.data);

        } catch (err) {

            setMessage(
                err.response?.data?.message ||
                'Failed to load documents'
            );

        } finally {

            setDocumentsLoading(false);
        }
    };


    // ============================================================
    // VIEW DOCUMENT
    // ============================================================

    const handleViewDocument = async (documentId) => {

        try {

            const response =
                await viewDocument(documentId);

            const blob = new Blob(
                [response.data],
                {
                    type:
                        response.headers['content-type'] ||
                        'application/octet-stream'
                }
            );

            const url =
                window.URL.createObjectURL(blob);

            window.open(
                url,
                '_blank',
                'noopener,noreferrer'
            );

            setTimeout(() => {

                window.URL.revokeObjectURL(url);

            }, 60000);

        } catch (err) {

            setMessage(
                'Unable to open document.'
            );
        }
    };


    // ============================================================
    // VERIFY / REJECT DOCUMENT
    // ============================================================

    const handleVerifyDocument = async (
        documentId,
        verificationStatus
    ) => {

        let verificationRemarks = '';

        if (verificationStatus === 'REJECTED') {

            verificationRemarks =
                window.prompt(
                    'Enter the reason for rejecting this document:'
                );

            if (verificationRemarks === null) {
                return;
            }

            if (!verificationRemarks.trim()) {

                setMessage(
                    'Please provide a rejection reason.'
                );

                return;
            }
        }


        if (verificationStatus === 'VERIFIED') {

            verificationRemarks =
                'Document verified successfully.';
        }


        try {

            setVerifyingDocument(documentId);

            await verifyDocument(
                documentId,
                {
                    verificationStatus,
                    verificationRemarks
                }
            );


            /*
             * Reload documents so the updated
             * verification status appears immediately.
             */

            const response =
                await getDocumentsByApplication(
                    selectedApp.id
                );

            setDocuments(response.data);

            setMessage(
                verificationStatus === 'VERIFIED'
                    ? 'Document verified successfully.'
                    : 'Document rejected successfully.'
            );

        } catch (err) {

            setMessage(
                err.response?.data?.message ||
                'Failed to update document verification.'
            );

        } finally {

            setVerifyingDocument(null);
        }
    };


    // ============================================================
    // UPDATE APPLICATION STATUS
    // ============================================================

    const handleUpdateStatus = async (e) => {

        e.preventDefault();

        if (!selectedApp) {
            return;
        }


        /*
         * Prevent the frontend from sending an invalid
         * transition even if something unexpected happens.
         */

        const allowedStatuses =
            getAllowedStatuses(selectedApp.status);

        if (!allowedStatuses.includes(newStatus)) {

            setMessage(
                `Invalid status transition from ${statusLabel(
                    selectedApp.status
                )} to ${statusLabel(newStatus)}`
            );

            return;
        }


        /*
         * If the status has not changed, there is
         * nothing to update.
         */

        if (
            newStatus === selectedApp.status &&
            remarks === (selectedApp.remarks || '')
        ) {

            setSelectedApp(null);

            return;
        }


        try {

            await updateApplicationStatus(
                selectedApp.id,
                {
                    status: newStatus,
                    remarks
                }
            );


            /*
             * Close the modal immediately after a
             * successful update.
             */

            setSelectedApp(null);

            /*
             * Refresh the application table.
             */

            await fetchApplications();

            /*
             * Show success message after the modal
             * has disappeared.
             */

            setMessage(
                'Status updated successfully'
            );

        } catch (err) {

            setMessage(
                err.response?.data?.message ||
                'Update failed'
            );
        }
    };


    // ============================================================
    // STATISTICS
    // ============================================================

    const count = (status) =>
        applications.filter(
            (application) =>
                application.status === status
        ).length;


    // ============================================================
    // RENDER
    // ============================================================

    return (

        <main className="app-page">

            <div className="page-container">


                {/* =====================================================
                    PAGE HEADER
                ===================================================== */}

                <section className="dashboard-hero">

                    <div>

                        <span className="page-eyebrow">
                            Administration
                        </span>

                        <h1 className="page-title">
                            Admission applications
                        </h1>

                        <p className="page-subtitle">
                            Review student applications and update admission decisions.
                        </p>

                    </div>

                </section>


                {/* =====================================================
                    MESSAGE
                ===================================================== */}

                {message && (

                    <div
                        className={`app-alert ${
                            message.includes('success')
                                ? 'app-alert-success'
                                : 'app-alert-error'
                        }`}
                    >

                        <i
                            className={`bi ${
                                message.includes('success')
                                    ? 'bi-check-circle'
                                    : 'bi-exclamation-circle'
                            }`}
                        />

                        {message}

                    </div>

                )}


                {/* =====================================================
                    STATISTICS
                ===================================================== */}

                <section className="stats-grid admin-stats">

                    <div className="stat-card">

                        <div className="stat-icon">
                            <i className="bi bi-files" />
                        </div>

                        <div>

                            <span>
                                Visible applications
                            </span>

                            <strong>
                                {applications.length}
                            </strong>

                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon">
                            <i className="bi bi-hourglass-split" />
                        </div>

                        <div>

                            <span>
                                Under review
                            </span>

                            <strong>
                                {count('UNDER_REVIEW')}
                            </strong>

                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon">
                            <i className="bi bi-check2-circle" />
                        </div>

                        <div>

                            <span>
                                Approved
                            </span>

                            <strong>
                                {count('APPROVED') +
                                    count('ADMITTED')}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =====================================================
                    APPLICATION TOOLBAR
                ===================================================== */}

                <div className="section-heading admin-toolbar">

                    <div>

                        <h2>
                            Applications
                        </h2>

                        <p>
                            Review academic details and change application status.
                        </p>

                    </div>


                    <div className="filter-control">

                        <i className="bi bi-funnel" />

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                All statuses
                            </option>

                            <option value="SUBMITTED">
                                Submitted
                            </option>

                            <option value="UNDER_REVIEW">
                                Under review
                            </option>

                            <option value="APPROVED">
                                Approved
                            </option>

                            <option value="REJECTED">
                                Rejected
                            </option>

                            <option value="ADMITTED">
                                Admitted
                            </option>

                        </select>

                    </div>

                </div>


                {/* =====================================================
                    APPLICATION TABLE
                ===================================================== */}

                {loading ? (

                    <div className="page-loader small-loader">

                        <div className="spinner-border text-primary" />

                    </div>

                ) : (

                    <div className="table-card admin-applications-table">

                        <div className="table-responsive">

                            <table className="table align-middle">

                                <thead>

                                    <tr>

                                        <th>
                                            Student
                                        </th>

                                        <th>
                                            Course
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Payment
                                        </th>

                                        <th>
                                            10th %
                                        </th>

                                        <th>
                                            12th %
                                        </th>

                                        <th className="admin-action-heading">
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {applications.map(
                                        (app) => (

                                            <tr key={app.id}>

                                                {/* STUDENT */}

                                                <td>

                                                    <div className="student-cell">

                                                        <div className="mini-avatar">

                                                            {(app.studentName ||
                                                                'S')[0]}

                                                        </div>

                                                        <div>

                                                            <div className="table-primary-text">

                                                                {app.studentName}

                                                            </div>

                                                            <div className="table-secondary-text">

                                                                Application #{app.id}

                                                            </div>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* COURSE */}

                                                <td>

                                                    {app.courseName}

                                                </td>


                                                {/* STATUS */}

                                                <td>

                                                    <span
                                                        className={`status-badge ${badge(
                                                            app.status
                                                        )}`}
                                                    >

                                                        <span className="status-dot" />

                                                        {label(
                                                            app.status
                                                        )}

                                                    </span>

                                                </td>


                                                {/* PAYMENT */}

                                                <td>

                                                    <span
                                                        className={`status-badge ${paymentBadge(
                                                            app.paymentStatus
                                                        )}`}
                                                    >

                                                        <span className="status-dot" />

                                                        {paymentLabel(
                                                            app.paymentStatus
                                                        )}

                                                    </span>

                                                </td>


                                                {/* 10TH */}

                                                <td>

                                                    <strong>
                                                        {app.tenthPercentage}%
                                                    </strong>

                                                </td>


                                                {/* 12TH */}

                                                <td>

                                                    <strong>
                                                        {app.twelfthPercentage}%
                                                    </strong>

                                                </td>


                                                {/* ACTION */}

                                                <td className="admin-action-cell">

                                                    <button
                                                        type="button"
                                                        className="review-btn"
                                                        onClick={() =>
                                                            openReview(app)
                                                        }
                                                    >

                                                        Review

                                                        <i className="bi bi-chevron-right" />

                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>


                        {!applications.length && (

                            <div className="empty-table">

                                No applications found for this status.

                            </div>

                        )}

                    </div>

                )}


                {/* =====================================================
                    REVIEW MODAL
                ===================================================== */}

                {selectedApp && (

                    <div
                        className="app-modal-backdrop"
                        onMouseDown={() =>
                            setSelectedApp(null)
                        }
                    >

                        <div
                            className="app-modal"
                            onMouseDown={(e) =>
                                e.stopPropagation()
                            }
                        >

                            {/* MODAL HEADER */}

                            <div className="app-modal-head">

                                <div>

                                    <span className="page-eyebrow">
                                        Application #{selectedApp.id}
                                    </span>

                                    <h2>
                                        Review application
                                    </h2>

                                    <p>
                                        {selectedApp.studentName}
                                        {' · '}
                                        {selectedApp.courseName}
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    className="modal-close"
                                    onClick={() =>
                                        setSelectedApp(null)
                                    }
                                >

                                    <i className="bi bi-x-lg" />

                                </button>

                            </div>


                            {/* REVIEW SUMMARY */}

                            <div className="review-summary">

                                <div>

                                    <span>
                                        10th
                                    </span>

                                    <strong>
                                        {selectedApp.tenthPercentage}%
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        12th
                                    </span>

                                    <strong>
                                        {selectedApp.twelfthPercentage}%
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Payment
                                    </span>

                                    <strong>
                                        {paymentLabel(
                                            selectedApp.paymentStatus
                                        )}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Current status
                                    </span>

                                    <strong>
                                        {label(
                                            selectedApp.status
                                        )}
                                    </strong>

                                </div>

                            </div>


                            {/* =====================================================
                                DOCUMENT VERIFICATION
                            ===================================================== */}

                            <div className="admin-documents-section">

                                <div className="admin-documents-header">

                                    <div>

                                        <h3>
                                            Student documents
                                        </h3>

                                        <p>
                                            Review documents uploaded with this application.
                                        </p>

                                    </div>

                                    <span className="count-pill">
                                        {documents.length} uploaded
                                    </span>

                                </div>


                                {documentsLoading ? (

                                    <div className="admin-documents-loading">

                                        <div className="spinner-border spinner-border-sm text-primary" />

                                        <span>
                                            Loading documents...
                                        </span>

                                    </div>

                                ) : documents.length === 0 ? (

                                    <div className="admin-no-documents">

                                        <i className="bi bi-file-earmark" />

                                        <span>
                                            No documents uploaded yet.
                                        </span>

                                    </div>

                                ) : (

                                    <div className="admin-document-list">

                                        {documents.map((doc) => (

                                            <div
                                                className="admin-document-row"
                                                key={doc.id}
                                            >

                                                {/* DOCUMENT INFO */}

                                                <div className="admin-document-info">

                                                    <div className="admin-document-icon">

                                                        <i className="bi bi-file-earmark-check" />

                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {label(doc.documentType)}
                                                        </strong>

                                                        <span>
                                                            {doc.fileName}
                                                        </span>

                                                    </div>

                                                </div>


                                                {/* DOCUMENT STATUS */}

                                                <div className="admin-document-status">

                                                    <span
                                                        className={`document-verification-badge ${
                                                            doc.verificationStatus === 'VERIFIED'
                                                                ? 'document-verified'
                                                                : doc.verificationStatus === 'REJECTED'
                                                                    ? 'document-rejected'
                                                                    : 'document-pending'
                                                        }`}
                                                    >

                                                        <span className="status-dot" />

                                                        {doc.verificationStatus === 'VERIFIED'
                                                            ? 'Verified'
                                                            : doc.verificationStatus === 'REJECTED'
                                                                ? 'Rejected'
                                                                : 'Pending'}

                                                    </span>

                                                </div>


                                                {/* ACTIONS */}

                                                <div className="admin-document-actions">

                                                    <button
                                                        type="button"
                                                        className="admin-document-view"
                                                        onClick={() =>
                                                            handleViewDocument(doc.id)
                                                        }
                                                    >

                                                        <i className="bi bi-eye" />

                                                        View

                                                    </button>


                                                    {doc.verificationStatus !== 'VERIFIED' && (

                                                        <button
                                                            type="button"
                                                            className="admin-document-verify"
                                                            disabled={
                                                                verifyingDocument === doc.id
                                                            }
                                                            onClick={() =>
                                                                handleVerifyDocument(
                                                                    doc.id,
                                                                    'VERIFIED'
                                                                )
                                                            }
                                                        >

                                                            {verifyingDocument === doc.id
                                                                ? '...'
                                                                : 'Verify'}

                                                        </button>

                                                    )}


                                                    {doc.verificationStatus !== 'REJECTED' && (

                                                        <button
                                                            type="button"
                                                            className="admin-document-reject"
                                                            disabled={
                                                                verifyingDocument === doc.id
                                                            }
                                                            onClick={() =>
                                                                handleVerifyDocument(
                                                                    doc.id,
                                                                    'REJECTED'
                                                                )
                                                            }
                                                        >

                                                            Reject

                                                        </button>

                                                    )}

                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                )}

                            </div>


                            {/* =====================================================
                                REVIEW FORM
                            ===================================================== */}

                            <form
                                onSubmit={handleUpdateStatus}
                            >

                                <label className="form-label">
                                    Decision / status
                                </label>


                                <select
                                    className="form-select mb-3"
                                    value={newStatus}
                                    onChange={(e) =>
                                        setNewStatus(
                                            e.target.value
                                        )
                                    }
                                    disabled={
                                        selectedApp.status === 'REJECTED' ||
                                        selectedApp.status === 'ADMITTED'
                                    }
                                >

                                    {getAllowedStatuses(
                                        selectedApp.status
                                    ).map((status) => (

                                        <option
                                            key={status}
                                            value={status}
                                        >
                                            {statusLabel(status)}
                                        </option>

                                    ))}

                                </select>


                                <label className="form-label">
                                    Remarks
                                </label>

                                <textarea
                                    className="form-control"
                                    rows="4"
                                    placeholder="Add remarks for the student..."
                                    value={remarks}
                                    onChange={(e) =>
                                        setRemarks(
                                            e.target.value
                                        )
                                    }
                                />


                                <div className="form-actions">

                                    <button
                                        type="button"
                                        className="btn btn-light"
                                        onClick={() =>
                                            setSelectedApp(null)
                                        }
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        className="btn btn-primary"
                                        type="submit"
                                        disabled={
                                            selectedApp.status === 'REJECTED' ||
                                            selectedApp.status === 'ADMITTED'
                                        }
                                    >
                                        Save decision
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}

            </div>

        </main>
    );
}