import React, { useState, useRef, useEffect } from "react";
import {
    MdDashboard,
    MdPeople,
    MdEventNote,
    MdSpeakerNotes,
    MdTimelapse,
    MdListAlt,
    MdAssignment,
    MdQuiz,
} from "react-icons/md";
import { PanelLeft, BusFront } from "lucide-react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { FaUserCircle, FaUser, FaLock, FaSignOutAlt } from "react-icons/fa";

import Students from "./Students";
import Attendance from "./Attendance";
import Noticeboard from "./Noticeboard";
import Timetable from "./Timetable";
import Syllabus from "./Syllabus";
import Marks from "./Marks";
import Mocktests from "./Mocktests";
import PersonalDetails from "./PersonalDetails";
import Dashboard from "./Dashboard";
import BusService from "./BusService";
import { useAuth } from '../Auth/Authentication/AuthContext';
import axios from 'axios';

const TeacherDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [teacherData, setTeacherData] = useState([]);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [showPersonalDetails, setShowPersonalDetails] = useState(false);
    const [sidebarLocked, setSidebarLocked] = useState(true);
    const [sidebarHovered, setSidebarHovered] = useState(false);
    const isSidebarOpen = sidebarLocked || sidebarHovered;
    const profileMenuRef = useRef(null);
    const lastSegment = location.pathname.split("/").filter(Boolean).pop();
    const [activeTab, setActiveTab] = useState(lastSegment);
    const navigate = useNavigate();

    const tabs = [
        { id: "dashboard", label: "Dashboard", icon: <MdDashboard /> },
        { id: "students", label: "Students", icon: <MdPeople /> },
        { id: "attendance", label: "Attendance", icon: <MdEventNote /> },
        { id: "notices", label: "Notice Board", icon: <MdSpeakerNotes /> },
        { id: "timetable", label: "Time Table", icon: <MdTimelapse /> },
        { id: "syllabus", label: "Syllabus", icon: <MdListAlt /> },
        { id: "marks", label: "Marks", icon: <MdAssignment /> },
        { id: "mocktests", label: "Mocktests", icon: <MdQuiz /> },
        { id: "bus", label: "Buses", icon: <BusFront /> }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileMenuRef.current &&
                !profileMenuRef.current.contains(event.target)
            ) {
                setProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    //1. const { logout } = useAuth();
    const { auth, logout } = useAuth();
    
    useEffect(() => {
        axios.get(`https://schoolapi.vsngroups.com/api/Teacher/UserID/${auth.userId}`)
        .then(res => {setTeacherData(res.data)})
    },[auth])

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        setShowPersonalDetails(false);
    };

    return (
        <div className="flex h-screen bg-[#0F172A] text-white font-sans">
            {/* Sidebar */}
            <aside
                onMouseEnter={() => setSidebarHovered(true)}
                onMouseLeave={() => setSidebarHovered(false)}
                // className={`transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"} bg-white border-r border-orange-300 text-black shadow-md overflow-hidden backdrop-blur-md`}
                className={`transition-all duration-300 bg-white border-r border-orange-300 text-black overflow-hidden`}
            >
                <div className="relative h-16 flex items-center justify-center bg-gradient-to-r from-orange-400 to-yellow-400 text-black">
                    {isSidebarOpen && (
                        <img
                            src="/sms-logo.png"
                            alt="logo"
                            className="h-8 transition-opacity duration-300"
                        />
                    )}
                    <button
                        title="Click to Stick the menu"
                        onClick={() => setSidebarLocked(!sidebarLocked)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-orange-400 focus:outline-none transition-all duration-200 cursor-pointer"
                    >
                        <PanelLeft size={22} />
                    </button>
                </div>
                <nav className="flex flex-col py-4 space-y-1">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.id}
                            to={`/teacher/${tab.id}`}
                            onClick={() => handleTabClick(tab.id)}
                            className={`flex items-center gap-4 px-4 py-2 text-left rounded-md mx-2 transition-all duration-200 ease-in-out cursor-pointer ${
                                activeTab === tab.id
                                    ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-semibold shadow-md"
                                    : "text-black hover:bg-orange-100"
                            }`}
                        >
                            <span
                                className={`text-xl transition-all duration-200 ease-in-out ${
                                    activeTab === tab.id ? "text-white" : "text-orange-400"
                                }`}
                            >
                                {tab.icon}
                            </span>
                            {isSidebarOpen && <span className="transition-all duration-200 ease-in-out">{tab.label}</span>}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-16 bg-white border-b border-orange-300 text-black flex items-center px-4 shadow-md justify-between">
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-xl hidden sm:inline">
                            Teacher Panel
                        </span>
                    </div>
                    <div className="relative" ref={profileMenuRef}>
                        <button
                            title = "User Prorfile" 
                            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                            className="text-gray hover:text-gray-300 focus:outline-none flex items-center cursor-pointer"
                        >
                            {/* <FaUserCircle size={24} className="text-orange-400" /> */}
                            {!teacherData?.profilePicture ? <FaUserCircle size={30} /> :
                                <img
                                    src={`https://schoolapi.vsngroups.com/files/profile/${teacherData?.profilePicture}`}
                                    alt="Profile"
                                    className="w-9 h-9 rounded-full flex items-center object-cover"
                                />}
                        </button>

                        {/* Animated Dropdown */}
                        <div
                            className={`absolute right-0 mt-2 w-64 bg-white/90 backdrop-blur-md text-gray-800 rounded-2xl shadow-2xl hover:shadow-orange-200 hover:-translate-y-1 transition-all hover:border-2 border border-orange-200 duration-300 z-50 transform origin-top-right ${profileMenuOpen
                                ? "scale-100 opacity-100 visible"
                                : "scale-95 opacity-0 invisible"
                                }`}
                        >
                            <div className="px-4 py-3 border-b bg-gradient-to-r from-yellow-400 to-orange-400 text-gray">
                                <p className="font-semibold text-sm">{teacherData.name}</p>
                                <p className="text-xs opacity-90">{teacherData.userID}</p>
                            </div>
                            <ul className="py-2">
                                <li>
                                    <button
                                        onClick={() => {
                                            setProfileMenuOpen(false);
                                            setShowPersonalDetails(true);
                                            navigate("/teacher/profile");
                                        }}
                                        className="w-full px-4 py-2 flex items-center hover:bg-orange-100 transition cursor-pointer"
                                    >
                                        <FaUser className="mr-2" /> Personal Details
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => alert("Navigate to change password")}
                                        className="w-full px-4 py-2 flex items-center hover:bg-orange-100 transition cursor-pointer"
                                    >
                                        <FaLock className="mr-2" /> Change Password
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2 flex items-center text-red-500 hover:bg-red-100 transition cursor-pointer"
                                    >
                                        <FaSignOutAlt className="mr-2" /> Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto bg-yellow-50 text-gray-800">
                    <Routes>
                        <Route index element={<Navigate to="dashboard" />} /> {/* ✅ default route */}
                        <Route path="dashboard" element={<div className="p-6"><Dashboard teacherData={teacherData}/></div>} />
                        <Route path="students" element={<div className="p-6"><Students teacherData={teacherData}/></div>} />
                        <Route path="attendance" element={<div className="p-6"><Attendance teacherData={teacherData}/></div>} />
                        <Route path="notices" element={<div className="p-6"><Noticeboard teacherData={teacherData}/></div>} />
                        <Route path="timetable" element={<div className="p-6"><Timetable teacherData={teacherData}/></div>} />
                        <Route path="syllabus" element={<div className="p-6"><Syllabus teacherData={teacherData}/></div>} />
                        <Route path="marks" element={<div className="p-6"><Marks teacherData={teacherData}/></div>} />
                        <Route path="mocktests" element={<div className="p-6"><Mocktests teacherData={teacherData}/></div>} />
                        <Route path="bus" element={<div className="p-6"><BusService teacherData={teacherData}/></div>} />
                        <Route path="profile" element={<PersonalDetails teacherData={teacherData}/>} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default TeacherDashboard;