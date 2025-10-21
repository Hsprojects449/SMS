import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";

const navLinks = [
    { label: "Home", id: "hero" },
    { label: "Contact Us", id: "contact" },
    // { label: "Gallery", link: "#gallery" } // Placeholder or use scroll/id if supported
];

const Navbar = () => {
    const location = useLocation();

    const scrollTo = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <nav className="fixed top-0 w-full z-50 backdrop-blur-[7px] bg-slate-900/85 shadow-md border-b border-orange-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center font-bold text-2xl gap-2 group">
                        <img src="/sms-logo.png" alt="Logo" className="h-8" />
                        <span className="text-white tracking-tight group-hover:text-orange-400 transition cursor-pointer">SMS</span>
                    </Link>

                    <div className="flex-1"></div>

                    {/* Main nav links */}
                    <div className="hidden md:flex space-x-4 items-center">
                        {navLinks.map((nav) =>
                            nav.link ? (
                                // Placeholder: change if you use scroll/id!
                                <a
                                    key={nav.label}
                                    href={nav.link}
                                    className="text-white hover:text-orange-300 px-2 py-1 rounded transition font-medium cursor-pointer"
                                >
                                    {nav.label}
                                </a>
                            ) : (
                                <button
                                    key={nav.label}
                                    onClick={() => scrollTo(nav.id)}
                                        className="text-white hover:text-orange-300 px-2 py-1 rounded transition font-medium bg-transparent cursor-pointer"
                                >
                                    {nav.label}
                                </button>
                            )
                        )}
                    </div>

                    {/* Spacer between links and buttons */}
                    <div className="w-6"></div>

                    {/* Action buttons */}
                    <div className="flex space-x-2 items-center">
                        <Link to="/login">
                            <button
                                className={`
                                    flex items-center gap-2 px-4 py-2
                                    rounded-full transition font-semibold 
                                    shadow hover:shadow-orange-400
                                    bg-slate-800/90 hover:bg-orange-500 
                                    text-orange-300 hover:text-white
                                    border border-orange-400 cursor-pointer
                                `}
                            >
                                <LogIn className="w-4 h-4" />
                                <span>Sign In</span>
                            </button>
                        </Link>
                        <Link to="/register">
                            <button
                                className={`
                                    flex items-center gap-2 px-4 py-2
                                    rounded-full transition font-semibold 
                                    shadow hover:shadow-yellow-500
                                    bg-gradient-to-r from-orange-400 to-yellow-400  
                                    hover:from-orange-500 hover:to-yellow-500
                                    text-white
                                    border border-yellow-300 cursor-pointer
                                `}
                            >
                                <UserPlus className="w-4 h-4" />
                                <span>Sign Up</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
