import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/authApi.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        city: '',
        state: '',
        country: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        try {
            const response = await registerUser(formData);

            const {
                token,
                userId,
                email,
                fullName,
                role,
            } = response.data;

            login(
                {
                    userId,
                    email,
                    fullName,
                    role,
                },
                token
            );

            navigate('/dashboard');

        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Registration failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">

            <div className="auth-card auth-card-wide">

                <div className="auth-logo">
                    <i className="bi bi-person-plus-fill"></i>
                </div>

                <h1 className="auth-title">
                    Create your account
                </h1>

                <p className="auth-subtitle">
                    Register to begin your admission application.
                </p>

                {error && (
                    <div className="app-alert app-alert-error">
                        <i className="bi bi-exclamation-circle"></i>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="mb-4">
                        <div className="page-eyebrow mb-2">
                            Personal Information
                        </div>

                        <div className="row g-3">

                            <div className="col-md-6">
                                <label className="form-label">
                                    Full Name
                                </label>

                                <input
                                    name="fullName"
                                    className="form-control"
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">
                                    Email
                                </label>

                                <input
                                    name="email"
                                    type="email"
                                    className="form-control"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">
                                    Phone Number
                                </label>

                                <input
                                    name="phoneNumber"
                                    className="form-control"
                                    placeholder="Enter phone number"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">
                                    Date of Birth
                                </label>

                                <input
                                    name="dateOfBirth"
                                    type="date"
                                    className="form-control"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-12">
                                <label className="form-label">
                                    Gender
                                </label>

                                <select
                                    name="gender"
                                    className="form-select"
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
                                    <option value="">
                                        Select gender
                                    </option>
                                    <option value="MALE">
                                        Male
                                    </option>
                                    <option value="FEMALE">
                                        Female
                                    </option>
                                    <option value="OTHER">
                                        Other
                                    </option>
                                </select>
                            </div>

                        </div>
                    </div>

                    <div className="mb-4">

                        <div className="page-eyebrow mb-2">
                            Address
                        </div>

                        <div className="row g-3">

                            <div className="col-12">
                                <label className="form-label">
                                    Address
                                </label>

                                <input
                                    name="address"
                                    className="form-control"
                                    placeholder="Street address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">
                                    City
                                </label>

                                <input
                                    name="city"
                                    className="form-control"
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">
                                    State
                                </label>

                                <input
                                    name="state"
                                    className="form-control"
                                    placeholder="State"
                                    value={formData.state}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">
                                    Country
                                </label>

                                <input
                                    name="country"
                                    className="form-control"
                                    placeholder="Country"
                                    value={formData.country}
                                    onChange={handleChange}
                                />
                            </div>

                        </div>

                    </div>

                    <div className="mb-4">

                        <div className="page-eyebrow mb-2">
                            Account Security
                        </div>

                        <label className="form-label">
                            Password
                        </label>

                        <input
                            name="password"
                            type="password"
                            className="form-control"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <div className="form-text mt-2">
                            Password must contain at least 6 characters.
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
                                />
                                Creating account...
                            </>
                        ) : (
                            <>
                                Create Account
                                <i className="bi bi-arrow-right ms-2"></i>
                            </>
                        )}
                    </button>

                </form>

                <div className="text-center mt-4">
                    <span className="text-muted small">
                        Already have an account?
                    </span>{' '}
                    <Link
                        to="/login"
                        className="fw-semibold small"
                    >
                        Sign in
                    </Link>
                </div>

            </div>

        </main>
    );
}