import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyApplications } from '../../api/applicationApi.js';
import { useAuth } from '../../context/AuthContext.jsx';

const statusClass = (status = '') => ({
    SUBMITTED: 'status-submitted',
    UNDER_REVIEW: 'status-review',
    APPROVED: 'status-approved',
    REJECTED: 'status-rejected',
    ADMITTED: 'status-admitted'
}[status] || 'status-pending');

const statusLabel = (status = '') =>
    status.replaceAll('_', ' ');

const paymentLabel = (status = '') => {
    if (status === 'SUCCESS') return 'Paid';
    if (status === 'FAILED') return 'Failed';
    return 'Pending';
};

const paymentClass = (status = '') => {
    if (status === 'SUCCESS') return 'status-approved';
    if (status === 'FAILED') return 'status-rejected';
    return 'status-pending';
};

export default function Dashboard() {

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { user } = useAuth();

    useEffect(() => {

        getMyApplications()
            .then((response) => {
                setApplications(response.data);
            })
            .catch(() => {
                setError('Failed to load applications');
            })
            .finally(() => {
                setLoading(false);
            });

    }, []);

    const active = applications.filter(
        (application) =>
            ['SUBMITTED', 'UNDER_REVIEW'].includes(
                application.status
            )
    ).length;

    const accepted = applications.filter(
        (application) =>
            ['APPROVED', 'ADMITTED'].includes(
                application.status
            )
    ).length;

    if (loading) {
        return (
            <div className="page-loader">
                <div className="spinner-border text-primary" />
            </div>
        );
    }

    return (
        <main className="app-page">

            <div className="page-container">

                {/* =====================================================
                    DASHBOARD HERO
                ===================================================== */}

                <section className="dashboard-hero">

                    <div>

                        <span className="page-eyebrow">
                            Student portal
                        </span>

                        <h1 className="page-title">
                            Good to see you,{' '}
                            {user?.fullName?.split(' ')[0] ||
                                'Student'}.
                        </h1>

                        <p className="page-subtitle">
                            Track your applications and continue
                            your admission journey.
                        </p>

                    </div>

                    <Link
                        className="btn btn-primary"
                        to="/courses"
                    >
                        <i className="bi bi-plus-lg me-2" />
                        New application
                    </Link>

                </section>

                {/* =====================================================
                    ERROR MESSAGE
                ===================================================== */}

                {error && (
                    <div className="app-alert app-alert-error">

                        <i className="bi bi-exclamation-circle" />

                        {error}

                    </div>
                )}

                {/* =====================================================
                    STATISTICS
                ===================================================== */}

                <section className="stats-grid">

                    <div className="stat-card">

                        <div className="stat-icon">
                            <i className="bi bi-files" />
                        </div>

                        <div>

                            <span>
                                Total applications
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
                                In progress
                            </span>

                            <strong>
                                {active}
                            </strong>

                        </div>

                    </div>

                    <div className="stat-card">

                        <div className="stat-icon">
                            <i className="bi bi-check2-circle" />
                        </div>

                        <div>

                            <span>
                                Approved / admitted
                            </span>

                            <strong>
                                {accepted}
                            </strong>

                        </div>

                    </div>

                </section>

                {/* =====================================================
                    APPLICATION SECTION HEADER
                ===================================================== */}

                <div className="section-heading">

                    <div>

                        <h2>
                            My applications
                        </h2>

                        <p>
                            All admission applications submitted
                            from your account.
                        </p>

                    </div>

                    <Link to="/courses">
                        Browse programs
                        <i className="bi bi-arrow-right ms-1" />
                    </Link>

                </div>

                {/* =====================================================
                    EMPTY STATE
                ===================================================== */}

                {applications.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-state-icon">
                            <i className="bi bi-file-earmark-text" />
                        </div>

                        <h3>
                            No applications yet
                        </h3>

                        <p className="text-muted">
                            Explore available programs and submit
                            your first application.
                        </p>

                        <Link
                            className="btn btn-primary mt-2"
                            to="/courses"
                        >
                            Explore programs
                        </Link>

                    </div>

                ) : (

                    /* =================================================
                       APPLICATION TABLE
                    ================================================= */

                    <div className="table-card">

                        <div className="table-responsive">

                            <table className="table align-middle applications-table">

                                <thead>

                                    <tr>

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
                                            Submitted
                                        </th>

                                        <th>
                                            Action
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {applications.map((app) => (

                                        <tr key={app.id}>

                                            {/* COURSE */}

                                            <td>

                                                <div className="application-course-cell">

                                                    <div className="table-primary-text">
                                                        {app.courseName}
                                                    </div>

                                                    <div className="table-secondary-text">
                                                        Application #{app.id}
                                                    </div>

                                                </div>

                                            </td>

                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={`status-badge ${statusClass(
                                                        app.status
                                                    )}`}
                                                >

                                                    <span className="status-dot" />

                                                    {statusLabel(
                                                        app.status
                                                    )}

                                                </span>

                                            </td>

                                            {/* PAYMENT */}

                                            <td>

                                                <span
                                                    className={`status-badge ${paymentClass(
                                                        app.paymentStatus
                                                    )}`}
                                                >

                                                    <span className="status-dot" />

                                                    {paymentLabel(
                                                        app.paymentStatus
                                                    )}

                                                </span>

                                            </td>

                                            {/* SUBMITTED */}

                                            <td>

                                                <span className="submitted-date">

                                                    {app.submittedAt
                                                        ? new Date(
                                                              app.submittedAt
                                                          ).toLocaleDateString(
                                                              'en-IN',
                                                              {
                                                                  day: '2-digit',
                                                                  month: 'short',
                                                                  year: 'numeric'
                                                              }
                                                          )
                                                        : '—'}

                                                </span>

                                            </td>

                                            {/* ACTION */}

                                            <td className="application-action-cell">

                                                <Link
                                                    className="application-view-link"
                                                    to={`/applications/${app.id}`}
                                                >

                                                    View application

                                                    <i className="bi bi-chevron-right" />

                                                </Link>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </div>

                )}

            </div>

        </main>
    );
}