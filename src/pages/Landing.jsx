import { Link } from 'react-router-dom';
import universityBg from '../assets/university-bg.jpg';

export default function Landing() {
    return (
        <main className="landing-page">

            <div
                className="landing-background"
                style={{
                    backgroundImage: `url(${universityBg})`,
                }}
            />

            <div className="landing-overlay" />

            <div className="landing-content">

                <div className="landing-badge">
                    <i className="bi bi-mortarboard-fill"></i>
                    Student Admission Portal
                </div>

                <h1>
                    Shape your future
                    <span>with the right program.</span>
                </h1>

                <p className="landing-description">
                    A simple, transparent admission experience — explore programs, submit your application, upload documents, and track every update from one place.
                </p>

                <div className="landing-actions">

                    <Link
                        to="/register"
                        className="btn landing-primary-btn"
                    >
                        Start Your Application
                        <i className="bi bi-arrow-right"></i>
                    </Link>

                    <Link
                        to="/login"
                        className="btn landing-secondary-btn"
                    >
                        Sign In
                    </Link>

                </div>

                <div className="landing-features">
                    <span><i className="bi bi-check-circle-fill"></i> Online applications</span>
                    <span><i className="bi bi-check-circle-fill"></i> Document tracking</span>
                    <span><i className="bi bi-check-circle-fill"></i> Admission updates</span>
                </div>

            </div>

            <div className="landing-scroll">
                <i className="bi bi-chevron-down"></i>
            </div>

        </main>
    );
}