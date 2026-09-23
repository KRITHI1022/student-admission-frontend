import { Link, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    if (!user || location.pathname === '/') {
        return null;
    }

    const isAdmin = user.role === 'ADMIN';

    const navClass = ({ isActive }) =>
        `app-nav-link ${isActive ? 'active' : ''}`;

    return (
        <nav className="app-navbar">
            <div className="app-navbar-inner">

                <Link
                    to={isAdmin ? '/admin' : '/dashboard'}
                    className="app-brand"
                >
                    <div className="app-brand-mark">
                        <i className="bi bi-mortarboard-fill"></i>
                    </div>

                    <div className="app-brand-text">
                        <strong>Admission Portal</strong>
                        <span>Student Services</span>
                    </div>
                </Link>

                <button
                    className="app-mobile-toggle"
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation"
                >
                    <i className={`bi ${menuOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
                </button>

                <div className={`app-nav-menu ${menuOpen ? 'open' : ''}`}>

                    {user.role === 'STUDENT' && (
                        <>
                            <NavLink
                                to="/dashboard"
                                className={navClass}
                                onClick={() => setMenuOpen(false)}
                            >
                                <i className="bi bi-grid-1x2"></i>
                                Dashboard
                            </NavLink>

                            <NavLink
                                to="/courses"
                                className={navClass}
                                onClick={() => setMenuOpen(false)}
                            >
                                <i className="bi bi-book"></i>
                                Programs
                            </NavLink>
                        </>
                    )}

                    {user.role === 'ADMIN' && (
                        <>
                            <NavLink
                                to="/admin"
                                className={navClass}
                                onClick={() => setMenuOpen(false)}
                            >
                                <i className="bi bi-grid-1x2"></i>
                                Applications
                            </NavLink>

                            <NavLink
                                to="/admin/courses"
                                className={navClass}
                                onClick={() => setMenuOpen(false)}
                            >
                                <i className="bi bi-journal-bookmark"></i>
                                Courses
                            </NavLink>
                        </>
                    )}

                    <div className="app-user-section">

                        <div className="app-user-avatar">
                            {(user.fullName || 'U')
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div className="app-user-info">
                            <span className="app-user-name">
                                {user.fullName}
                            </span>
                            <span className="app-user-role">
                                {isAdmin ? 'Administrator' : 'Student'}
                            </span>
                        </div>

                        <button
                            className="app-logout-btn"
                            onClick={logout}
                            title="Logout"
                        >
                            <i className="bi bi-box-arrow-right"></i>
                        </button>

                    </div>
                </div>
            </div>
        </nav>
    );
}