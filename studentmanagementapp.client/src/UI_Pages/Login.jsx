import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Auth/Authentication/AuthContext';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('https://schoolapi.vsngroups.com/api/auth/login', {
                identifier,
                password
            });

            const { token, role, userId, name, email: returnedEmail } = response.data;
            const userEmail = returnedEmail || identifier;

            login({ token, role, userId, name, email: userEmail });
            setTimeout(() => {
                if (role == 'Student') navigate('/student');
                else if (role == 'Teacher') navigate('/teacher');
                else if (role == 'SysAdmin') navigate('/admin');
                else alert('Unknown role. Cannot redirect.');
            }, 500);
        } catch (error) {
            console.error("Login failed:", error);
            alert("❌ Invalid email/UserID or password.");
            setLoading(false);
        }
    };

    // 🔹 Spinner handlers for links:
    const handleNavigateWithSpinner = (route) => {
        setLoading(true);
        setTimeout(() => navigate(route), 500); // Show spinner for 0.5s
    };

    return (
        <div className="min-h-screen bg-orange-100 relative flex items-center justify-center px-4 sm:px-6 lg:px-8">

            {/* Spinner */}
            {loading && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded z-50">
                    <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin shadow-[0_0_10px_3px_rgba(255,165,0,0.5)]" />
                </div>
            )}

            {/* Logo */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 absolute top-4">
                <button
                    onClick={() => handleNavigateWithSpinner('/')}
                    className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-600 transition font-bold text-2xl bg-transparent border-0"
                    style={{ cursor: 'pointer', outline: 'none' }}
                >
                    <img src="/sms-logo.png" alt="Logo" className="h-8" />
                    <span>SMS</span>
                </button>
            </div>

            {/* Login Card */}
            <div className="backdrop-blur-md bg-white/90 border-orange-300 shadow-2xl hover:shadow-orange-400 rounded-2xl px-10 py-12 w-full max-w-md animate-fade-in">
                <h2 className="text-4xl font-bold text-black-500 text-center mb-8 tracking-wide">
                    <span className="typing-wrapper">
                        <span className="text-black-800">Welcome </span>
                        <span className="text-orange-400">Back</span>
                    </span>
                </h2>

                {/* ✅ Added form */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email or User ID</label>
                        <input
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="Enter your email or user ID"
                            className="w-full px-4 py-2 border border-orange-300 rounded-lg bg-white bg-opacity-50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500 transition duration-200"
                            required
                        />
                    </div>

                    <div className="mb-6 relative">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 border border-orange-300 rounded-lg bg-white bg-opacity-50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500 transition duration-200"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-orange-500 hover:text-orange-700 transition"
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>

                    {/* 🔹 Links (still outside submit flow) */}
                    <div className="flex justify-between text-sm text-orange-600 mb-6">
                        <button
                            onClick={() => handleNavigateWithSpinner('/forgot-password')}
                            type="button"
                            className="hover:underline bg-transparent border-0 p-0 m-0 text-orange-600 cursor-pointer"
                        >
                            Forgot password?
                        </button>
                        <button
                            onClick={() => handleNavigateWithSpinner('/register')}
                            type="button"
                            className="hover:underline bg-transparent border-0 p-0 m-0 text-orange-600 cursor-pointer"
                        >
                            Register
                        </button>
                    </div>

                    {/* ✅ Changed button type to submit */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white font-semibold py-2 rounded-lg shadow-lg transition duration-300 transform hover:scale-[1.02] cursor-pointer disabled:opacity-70"
                        disabled={loading}
                    >
                        Login
                    </button>
                    </form>
            </div>
        </div>
    );
};

export default Login;
