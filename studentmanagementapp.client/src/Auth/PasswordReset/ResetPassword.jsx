import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [done, setDone] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const tokenParam = searchParams.get("token");
        if (!tokenParam) {
            alert("Password reset token missing or expired.");
            navigate("/forgot-password");
        }
        setToken(tokenParam);
        if (tokenParam) {
            window.history.replaceState({}, document.title, "/reset-password");
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setError("");
        setLoading(true);
        try {
            await axios.post("https://schoolapi.vsngroups.com/api/auth/reset-password", {
                token,
                newPassword: password,
            });
            setDone(true);
            setLoading(false);
            setTimeout(() => navigate("/login"), 2000);
        } catch {
            alert("Invalid or expired token.");
            setLoading(false);
        }
    };

    const Spinner = (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded z-50">
            <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin shadow-[0_0_10px_3px_rgba(255,165,0,0.5)]" />
        </div>
    );

    if (done) {
        return (
            <div className="min-h-screen bg-orange-100 flex items-center justify-center px-4 sm:px-6 lg:px-8" style={{ position: "relative" }}>
                {loading && Spinner}

                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 absolute top-4">
                    <button
                        onClick={() => {
                            setLoading(true);
                            setTimeout(() => navigate("/"), 500);
                        }}
                        className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-600 transition font-bold text-2xl bg-transparent border-0 cursor-pointer"
                        type="button"
                    >
                        <img src="/sms-logo.png" alt="Logo" className="h-8" />
                        <span>SMS</span>
                    </button>
                </div>
                <div className="backdrop-blur-md bg-white/90 border border-orange-300 shadow-2xl rounded-2xl px-10 py-12 w-full max-w-md text-center animate-fade-in">
                    <h2 className="text-2xl font-bold text-orange-500 mb-4">
                        Password Reset
                    </h2>
                    <p className="text-gray-700 mb-6">
                        Your password has been updated! Redirecting to login…
                    </p>
                    <button
                        onClick={() => {
                            setLoading(true);
                            setTimeout(() => navigate("/login"), 500);
                        }}
                        className="inline-block bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-[1.02] cursor-pointer"
                        type="button"
                    >
                        Go to Login Now
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-orange-100 flex items-center justify-center px-4 sm:px-6 lg:px-8" style={{ position: "relative" }}>
            {loading && Spinner}

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 absolute top-4">
                <button
                    onClick={() => {
                        setLoading(true);
                        setTimeout(() => navigate("/"), 500);
                    }}
                    className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-600 transition font-bold text-2xl bg-transparent border-0 cursor-pointer"
                    type="button"
                >
                    <img src="/sms-logo.png" alt="Logo" className="h-8" />
                    <span>SMS</span>
                </button>
            </div>
            <div className="backdrop-blur-md bg-white/90 border-orange-300 shadow-2xl hover:shadow-orange-400 rounded-2xl px-10 py-12 w-full max-w-md animate-fade-in">
                <h2 className="text-4xl font-bold text-center mb-8 tracking-wide
                    bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                    <span className="typing-wrapper p-2">
                        <span className="text-black">Password </span>
                        <span className="text-orange-400">Recovery</span>
                    </span>
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                minLength={10}
                                pattern="(?=.{10,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).*"
                                title="Must be ≥10 chars, include uppercase, lowercase, number & symbol"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your new password"
                                className="w-full px-4 py-2 border border-orange-300 rounded-lg bg-white bg-opacity-50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500 transition duration-200"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter your password"
                                className="w-full px-4 py-2 border border-orange-300 rounded-lg bg-white bg-opacity-50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500 transition duration-200"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                            >
                                {showConfirmPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <p className="text-red-500 text-sm font-medium text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white font-semibold py-2 rounded-lg shadow-lg transition duration-300 transform hover:scale-[1.02] cursor-pointer"
                        disabled={loading}
                    >
                        Reset Password
                    </button>

                    <div className="text-center text-sm text-orange-600">
                        <button
                            type="button"
                            className="hover:underline text-orange-600 bg-transparent border-0 p-0 m-0 text-sm cursor-pointer"
                            onClick={() => {
                                setLoading(true);
                                setTimeout(() => navigate("/login"), 500);
                            }}
                            disabled={loading}
                        >
                            Back to Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
