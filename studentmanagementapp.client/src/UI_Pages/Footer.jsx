import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="backdrop-blur-[7px] bg-slate-900/85 border-t border-orange-200 shadow-[0_-1px_3px_rgba(249,115,22,0.6)] text-white py-10 mt-10">
            <div className="text-center mb-4">
                <div className="text-2xl font-bold mb-2">🎓SMS</div>
                <p>
                    Empowering education through innovative technology. Connecting students,
                    teachers, and parents.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-sm text-gray-400 text-center sm:text-left">
                <div className="text-center">
                    <h4 className="text-white font-semibold mb-2">Quick Links</h4>
                    <ul className="space-y-1">
                        <li><a href="#" className="hover:underline">Home</a></li>
                        <li><a href="#" className="hover:underline">Contact Us</a></li>
                        <li><a href="#" className="hover:underline">About</a></li>
                    </ul>
                </div>

                <div className="text-center">
                    <h4 className="text-white font-semibold mb-2">Access Portal</h4>
                    <ul className="space-y-1">
                        <li>
                            <Link to="/student" className="hover:underline">Student Login</Link>
                        </li>
                        <li>
                            <Link to="/teacher" className="hover:underline">Teacher Login</Link>
                        </li>
                        <li>
                            <Link to="/admin" className="hover:underline">Admin Login</Link>
                        </li>
                    </ul>
                </div>

                <div className="text-center">
                    <h4 className="text-white font-semibold mb-2">Support</h4>
                    <ul className="space-y-1">
                        <li><a href="#" className="hover:underline">Help Center</a></li>
                        <li><a href="#" className="hover:underline">Documentation</a></li>
                        <li><a href="#" className="hover:underline">Contact Support</a></li>
                    </ul>
                </div>
            </div>

            <div className="text-center text-gray-500 mt-6">
                © 2025 SMS. All rights reserved. | School Management System
            </div>
        </footer>
    );
};

export default Footer;
