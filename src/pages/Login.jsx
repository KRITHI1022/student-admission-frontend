import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/authApi.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        try {
            const response = await loginUser({
                email,
                password,
            });

            const {
                token,
                userId,
                email: userEmail,
                fullName,
                role,
            } = response.data;

            login(
                {
                    userId,
                    email: userEmail,
                    fullName,
                    role,
                },
                token
            );

            navigate(role === 'ADMIN' ? '/admin' : '/dashboard');

        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Login failed. Please check your credentials.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">

            <div className="auth-card">

                <div className="auth-logo">
                    <i className="bi bi-mortarboard-fill"></i>
                </div>

                <h1 className="auth-title">
                    Welcome back
                </h1>

                <p className="auth-subtitle">
                    Sign in to continue your admission journey.
                </p>

                {error && (
                    <div className="app-alert app-alert-error">
                        <i className="bi bi-exclamation-circle"></i>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} autoComplete="off">

                    <div className="mb-3">
                        <label className="form-label">
                            Email address
                        </label>

                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                                <i className="bi bi-envelope text-muted"></i>
                            </span>

                            <input
                                type="email"
                                className="form-control border-start-0"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="off"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label">
                            Password
                        </label>

                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                                <i className="bi bi-lock text-muted"></i>
                            </span>

                            <input
                                type="password"
                                className="form-control border-start-0"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 py-2"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                />
                                Signing in...
                            </>
                        ) : (
                            <>
                                Sign In
                                <i className="bi bi-arrow-right ms-2"></i>
                            </>
                        )}
                    </button>

                </form>

                <div className="text-center mt-4">
                    <span className="text-muted small">
                        Don't have an account?
                    </span>{' '}
                    <Link
                        to="/register"
                        className="fw-semibold small"
                    >
                        Create one
                    </Link>
                </div>

            </div>

        </main>
    );
}