import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Spinner state
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true); // Show spinner

        try {
            await axios.post(
                "https://schoolapi.vsngroups.com/api/auth/forgot-password",
                { email }
            );
            setSent(true);
            setLoading(false);
        } catch (err) {
            if (err.response?.status == 400) {
                setError(err.response.data);
            } else {
                setError("Something went wrong. Try again later.");
            }
            setLoading(false); // Hide spinner
        }
    };

    // Spinner overlay JSX fragment
    const Spinner = (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded z-50">
            <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin shadow-[0_0_10px_3px_rgba(255,165,0,0.5)]" />
        </div>
    );

    // Success screen
    if (sent) {
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
                        Reset Link Sent
                    </h2>
                    <p className="text-gray-700 mb-6">
                        If that email exists, you’ll receive a password reset link shortly.
                    </p>
                    <button
                        onClick={() => {
                            setLoading(true);
                            setTimeout(() => navigate("/login"), 500);
                        }}
                        className="inline-block bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-[1.02] cursor-pointer"
                        type="button"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    // Main reset form screen
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
                <h2 className="text-4xl font-bold text-center mb-4 tracking-wide
                     bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                    <span className="typing-wrapper p-2">
                        <span className="text-black">Password </span>
                        <span className="text-orange-400">Recovery</span>
                    </span>
                </h2>

                {/* Instructions */}
                <div className="mb-6 text-gray-700">
                    <p className="font-semibold mb-2">Instructions:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                        <li>
                            If your email is valid, you will receive a reset link shortly. Please click that link in your email to change your password.
                        </li>
                        <li>
                            The reset link expires in 1 hour. After successfully resetting your password, you can log in with your new credentials.
                        </li>
                    </ul>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <p className="text-red-600 text-sm text-center">{error}</p>
                    )}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Your Email
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full pl-4 pr-4 py-2 border border-orange-300 rounded-lg bg-white bg-opacity-50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500 transition duration-200"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white font-semibold py-2 rounded-lg shadow-lg transition duration-300 transform hover:scale-[1.02] cursor-pointer"
                        disabled={loading}
                    >
                        Send Reset Link
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
