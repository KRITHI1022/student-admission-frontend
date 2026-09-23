import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMyApplications } from '../../api/applicationApi.js';
import {
    uploadDocument,
    getDocumentsByApplication
} from '../../api/documentApi.js';
import {
    createPaymentOrder,
    verifyPayment
} from '../../api/paymentApi.js';

const pretty = (v = '') => v.replaceAll('_', ' ');

const statusClass = (s = '') =>
    `status-badge status-${s.toLowerCase().replaceAll('_', '-')}`;

const paymentLabel = (status) => {
    if (status === 'SUCCESS') return 'Paid';
    if (status === 'FAILED') return 'Failed';
    return 'Pending';
};

const paymentStatusClass = (status) => {
    if (status === 'SUCCESS') return 'status-approved';
    if (status === 'FAILED') return 'status-rejected';
    return 'status-pending';
};

export default function ApplicationDetail() {
    const { id } = useParams();

    const [application, setApplication] = useState(null);
    const [documents, setDocuments] = useState([]);

    const [documentType, setDocumentType] =
        useState('TENTH_MARKSHEET');

    const [file, setFile] = useState(null);

    const [uploading, setUploading] = useState(false);
    const [paying, setPaying] = useState(false);
    const [message, setMessage] = useState('');

    const loadData = async () => {
        try {
            const apps = await getMyApplications();

            const currentApplication = apps.data.find(
                (a) => a.id === parseInt(id)
            );

            setApplication(currentApplication);

            const docs = await getDocumentsByApplication(id);
            setDocuments(docs.data);
        } catch {
            setMessage('Could not load application details.');
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    // ============================================================
    // DOCUMENT UPLOAD
    // ============================================================

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) return;

        setUploading(true);
        setMessage('');

        try {
            await uploadDocument(
                id,
                documentType,
                file
            );

            setMessage(
                'Document uploaded successfully.'
            );

            setFile(null);

            await loadData();
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                'Upload failed.'
            );
        } finally {
            setUploading(false);
        }
    };

    // ============================================================
    // PAYMENT
    // ============================================================

    const handlePayment = async () => {
        setPaying(true);
        setMessage('');

        try {
            const orderResponse =
                await createPaymentOrder(id);

            const {
                razorpayOrderId,
                amount,
                currency,
                razorpayKeyId
            } = orderResponse.data;

            const razorpay = new window.Razorpay({
                key: razorpayKeyId,

                amount: amount * 100,

                currency,

                name: 'Student Admission System',

                description:
                    `Application Fee - ${application.courseName}`,

                order_id: razorpayOrderId,

                handler: async (response) => {
                    try {
                        await verifyPayment({
                            razorpayOrderId:
                                response.razorpay_order_id,

                            razorpayPaymentId:
                                response.razorpay_payment_id,

                            razorpaySignature:
                                response.razorpay_signature,

                            applicationId:
                                parseInt(id)
                        });

                        setMessage(
                            'Payment successful!'
                        );

                        // Reload application so paymentStatus
                        // changes from PENDING to SUCCESS.
                        await loadData();

                    } catch (err) {
                        setMessage(
                            err.response?.data?.message ||
                            'Payment verification failed.'
                        );
                    }
                }
            });

            razorpay.open();

        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                'Failed to initiate payment.'
            );
        } finally {
            setPaying(false);
        }
    };

    // ============================================================
    // LOADING
    // ============================================================

    if (!application) {
        return (
            <main className="app-page">
                <div className="empty-state">
                    <div className="spinner-border spinner-border-sm" />
                    <p>Loading application...</p>
                </div>
            </main>
        );
    }

    // ============================================================
    // PAYMENT STATUS
    // ============================================================

    const paymentStatus =
        application.paymentStatus || 'PENDING';

    const isPaid =
        paymentStatus === 'SUCCESS';

    return (
        <main className="app-page">

            <div className="page-container narrow-container">

                {/* BACK TO DASHBOARD */}

                <Link
                    to="/dashboard"
                    className="back-link"
                >
                    <i className="bi bi-arrow-left" />
                    Back to dashboard
                </Link>

                {/* APPLICATION HEADER */}

                <section className="application-hero">

                    <div>
                        <span className="page-eyebrow">
                            Application #{application.id}
                        </span>

                        <h1>
                            {application.courseName}
                        </h1>

                        <p>
                            Submitted admission application
                        </p>
                    </div>

                    <span
                        className={statusClass(
                            application.status
                        )}
                    >
                        <span className="status-dot" />

                        {pretty(application.status)}
                    </span>

                </section>

                {/* MESSAGE */}

                {message && (
                    <div
                        className={`app-alert ${
                            message
                                .toLowerCase()
                                .includes('success')
                                ? 'app-alert-success'
                                : 'app-alert-error'
                        }`}
                    >
                        <i
                            className={`bi ${
                                message
                                    .toLowerCase()
                                    .includes('success')
                                    ? 'bi-check-circle'
                                    : 'bi-exclamation-circle'
                            }`}
                        />

                        {message}
                    </div>
                )}

                {/* ACADEMIC + PAYMENT */}

                <div className="detail-grid">

                    {/* ACADEMIC DETAILS */}

                    <section className="panel">

                        <div className="panel-header">

                            <div>
                                <h2>
                                    Academic details
                                </h2>

                                <p>
                                    Scores submitted with this application.
                                </p>
                            </div>

                            <div className="panel-icon">
                                <i className="bi bi-bar-chart" />
                            </div>

                        </div>

                        <div className="score-grid">

                            <div>
                                <span>
                                    10th percentage
                                </span>

                                <strong>
                                    {application.tenthPercentage}%
                                </strong>
                            </div>

                            <div>
                                <span>
                                    12th percentage
                                </span>

                                <strong>
                                    {application.twelfthPercentage}%
                                </strong>
                            </div>

                        </div>

                        {application.remarks && (
                            <div className="remarks-box">

                                <i className="bi bi-chat-left-text" />

                                <div>
                                    <strong>
                                        Admission remarks
                                    </strong>

                                    <p>
                                        {application.remarks}
                                    </p>
                                </div>

                            </div>
                        )}

                    </section>

                    {/* PAYMENT */}

                    <section className="panel">

                        <div className="panel-header">

                            <div>
                                <h2>
                                    Application fee
                                </h2>

                                <p>
                                    Payment status for this application.
                                </p>
                            </div>

                            <div className="panel-icon">
                                <i className="bi bi-credit-card" />
                            </div>

                        </div>

                        {/* PAYMENT STATUS */}

                        <div className="payment-visual">

    <div className="payment-icon">
        <i
            className={`bi ${
                isPaid
                    ? 'bi-check-circle'
                    : paymentStatus === 'FAILED'
                        ? 'bi-exclamation-circle'
                        : 'bi-shield-check'
            }`}
        />
    </div>

    <div className="payment-status-content">
        <strong>Payment status</strong>

        <span
            className={`status-badge ${paymentStatusClass(
                paymentStatus
            )}`}
        >
            <span className="status-dot" />
            {paymentLabel(paymentStatus)}
        </span>
    </div>

</div>

                        {/* PAID */}

                        {isPaid && (
                            <div className="app-alert app-alert-success mb-0">

                                <i className="bi bi-check-circle" />

                                Application fee has been paid successfully.

                            </div>
                        )}

                        {/* PENDING / FAILED */}

                        {!isPaid && (
                            <button
                                className="btn btn-primary w-100"
                                onClick={handlePayment}
                                disabled={paying}
                            >
                                {paying
                                    ? 'Processing...'
                                    : paymentStatus === 'FAILED'
                                        ? 'Retry payment'
                                        : 'Pay application fee'
                                }

                                <i className="bi bi-arrow-right ms-2" />
                            </button>
                        )}

                    </section>

                </div>

                {/* DOCUMENTS */}

                <section className="panel documents-panel">

                    <div className="panel-header">

                        <div>
                            <h2>
                                Documents
                            </h2>

                            <p>
                                Upload and review documents attached to your application.
                            </p>
                        </div>

                        <span className="count-pill">
                            {documents.length} uploaded
                        </span>

                    </div>

                    {/* DOCUMENT LIST */}
<div className="document-list">

    {documents.length === 0 ? (

        <div className="mini-empty">
            <i className="bi bi-file-earmark" />
            <span>No documents uploaded yet.</span>
        </div>

    ) : (

        documents.map((doc) => (

            <div className="document-row" key={doc.id}>

                <div className="doc-icon">
                    <i className="bi bi-file-earmark-check" />
                </div>

                <div className="document-info">

                    <strong>
                        {pretty(doc.documentType)}
                    </strong>

                    <span>
                        {doc.fileName}
                    </span>

                    {doc.verificationStatus === 'REJECTED' &&
                        doc.verificationRemarks && (
                            <small className="document-rejection-reason">
                                {doc.verificationRemarks}
                            </small>
                        )}

                </div>


                <div className="document-verification-status">

                    {doc.verificationStatus === 'VERIFIED' ? (

                        <span className="student-document-status verified">
                            <i className="bi bi-check-circle-fill" />
                            Verified
                        </span>

                    ) : doc.verificationStatus === 'REJECTED' ? (

                        <span className="student-document-status rejected">
                            <i className="bi bi-x-circle-fill" />
                            Rejected
                        </span>

                    ) : (

                        <span className="student-document-status pending">
                            <i className="bi bi-clock-fill" />
                            Pending
                        </span>

                    )}

                </div>

            </div>

        ))

    )}

</div>

                    {/* UPLOAD */}

                    <form
                        className="upload-box"
                        onSubmit={handleUpload}
                    >

                        <div>

                            <label className="form-label">
                                Document type
                            </label>

                            <select
                                className="form-select"
                                value={documentType}
                                onChange={(e) =>
                                    setDocumentType(
                                        e.target.value
                                    )
                                }
                            >
                                <option value="TENTH_MARKSHEET">
                                    10th Marksheet
                                </option>

                                <option value="TWELFTH_MARKSHEET">
                                    12th Marksheet
                                </option>

                                <option value="AADHAR">
                                    Aadhar
                                </option>

                                <option value="PHOTO">
                                    Photo
                                </option>

                                <option value="SIGNATURE">
                                    Signature
                                </option>
                            </select>

                        </div>

                        <div>

                            <label className="form-label">
                                Choose file
                            </label>

                            <input
                                className="form-control"
                                type="file"
                                onChange={(e) =>
                                    setFile(
                                        e.target.files[0]
                                    )
                                }
                                required
                            />

                        </div>

                        <button
                            className="btn btn-outline-primary"
                            disabled={uploading}
                        >

                            <i className="bi bi-cloud-arrow-up me-2" />

                            {uploading
                                ? 'Uploading...'
                                : 'Upload'}

                        </button>

                    </form>

                </section>

            </div>

        </main>
    );
}