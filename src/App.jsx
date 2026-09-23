import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

import Dashboard from './pages/student/Dashboard.jsx';
import Courses from './pages/student/Courses.jsx';
import ApplicationDetail from './pages/student/ApplicationDetail.jsx';

import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ManageCourses from './pages/admin/ManageCourses.jsx';

import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/" element={<Landing />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRole="STUDENT">
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/courses"
                    element={
                        <ProtectedRoute allowedRole="STUDENT">
                            <Courses />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/applications/:id"
                    element={
                        <ProtectedRoute allowedRole="STUDENT">
                            <ApplicationDetail />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRole="ADMIN">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/courses"
                    element={
                        <ProtectedRoute allowedRole="ADMIN">
                            <ManageCourses />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </>
    );
}

export default App;