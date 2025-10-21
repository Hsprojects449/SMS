import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './UI_Pages/Home';
import Login from './UI_Pages/Login';
import StudentDashboard from './Student/StudentDashboard';
import AdminDashboard from './Admin/AdminDashboard';
import TeacherDashboard from './Teacher/TeacherDashboard';
import Register from './UI_Pages/Register';
import { AuthProvider } from './Auth/Authentication/AuthContext';
import ProtectedRoute from './Auth/Authentication/ProtectedRoute';
import ForgotPassword from "./Auth/PasswordReset/ForgotPassword";
import ResetPassword from "./Auth/PasswordReset/ResetPassword";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* ✅ Protected Routes */}
                    <Route
                        path="/student/*"
                        element={
                            <ProtectedRoute role="Student">
                                <StudentDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/teacher/*"
                        element={
                            <ProtectedRoute role="Teacher">
                                <TeacherDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/*"
                        element={
                            
                            <ProtectedRoute role="SysAdmin">
                                <AdminDashboard />
                            </ProtectedRoute>
                     
                        }
                    />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
