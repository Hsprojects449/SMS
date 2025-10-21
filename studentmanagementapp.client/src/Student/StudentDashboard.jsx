import React, { useState, useEffect, useRef } from 'react';
import {
    MdHome, MdQuiz, MdSchedule, MdAssessment, MdListAlt, MdSpeakerNotes
} from 'react-icons/md';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { PanelLeft, BusFront } from 'lucide-react';

import Mocktests from './Mocktests';
import Syllabus from './Syllabus';
import Marks from './Marks';
import Timetable from './Timetable';
import Dashboard from './Dashboard';
import Noticeboard from './Noticeboard';
import BusService from './BusService';
import { useAuth } from '../Auth/Authentication/AuthContext';
import axios from 'axios';
import { Link, Navigate, Route, Routes } from "react-router-dom";

const StudentDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [showProfileDetails, setShowProfileDetails] = useState(false);
    const [studentData, setstudentData] = useState(false);
    const [sidebarLocked, setSidebarLocked] = useState(true);
    const [sidebarHovered, setSidebarHovered] = useState(false);
    const isSidebarOpen = sidebarLocked || sidebarHovered;
    const lastSegment = location.pathname.split("/").filter(Boolean).pop();
    const [activeTab, setActiveTab] = useState(lastSegment);

    const profileMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setProfileMenuOpen(false);
                //setShowProfileDetails(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const tabs = [
        { id: 'home', label: 'Home', icon: <MdHome /> },
        { id: 'mocktest', label: 'Mocktest', icon: <MdQuiz /> },
        { id: 'timetable', label: 'Timetable', icon: <MdSchedule /> },
        { id: 'marks', label: 'Marks', icon: <MdAssessment /> },
        { id: 'syllabus', label: 'Syllabus', icon: <MdListAlt /> },
        { id: 'notices', label: 'Notices', icon: <MdSpeakerNotes /> },
        { id: 'bus', label: 'Buses', icon: <BusFront /> }
    ];

    const renderContent = () => {
        if (showProfileDetails) {
            return (
                <div className="p-6">
                    <PersonalDetails />
                </div>
            );
        }

        switch (activeTab) {
            case 'home':
                return (
                    <div className="p-6">
                        <Dashboard studentData = {studentData}/>
                    </div>
                );
            case 'mocktest':
                return (
                    <div className="p-6">
                        <Mocktests studentData = {studentData}/>
                    </div>
                );
            case 'timetable':
                return (
                    <div className="p-6">
                        <Timetable studentData = {studentData}/>
                    </div>
                );
            case 'marks':
                return (
                    <div className="p-6">
                        <Marks studentData = {studentData}/>
                    </div>
                );
            case 'syllabus':
                return (
                    <div className="p-6">
                        <Syllabus studentData = {studentData}/>
                    </div>
                );
            case 'notices':
                return (
                    <div className="p-6">
                        <Noticeboard />
                    </div>
                );
            case 'buses':
                return (
                    <div className="p-6">
                        <BusService studentData = {studentData}/>
                    </div>
                );
            default:
                return null;
        }
    };
    //1. const { logout } = useAuth();
    const { auth, logout } = useAuth();

    useEffect(() => {
        axios.get(`https://schoolapi.vsngroups.com/api/Student/UserID/${auth.userId}`)
        .then(res => {setstudentData(res.data)})
    },[auth])

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    return (
        <div className="flex h-screen bg-[#0F172A] text-white font-sans">
            {/* Sidebar */}
            <aside
                onMouseEnter={() => setSidebarHovered(true)}
                onMouseLeave={() => setSidebarHovered(false)}
                className={`transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-orange-300 text-black shadow-md overflow-hidden backdrop-blur-md`}
            >
                <div className="relative h-16 flex items-center justify-center bg-gradient-to-r from-orange-400 to-yellow-400 text-black">
                    {isSidebarOpen && <img src="/sms-logo.png" alt="logo" className="h-8 transition-opacity duration-300" />}
                    <button
                        title = "Click to Stick the menu"
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
                            to={`/student/${tab.id}`}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setShowProfileDetails(false);
                            }}
                            className={`flex items-center gap-4 px-4 py-2 text-left rounded-md mx-2 transition-all duration-200 ease-in-out cursor-pointer ${
                                activeTab === tab.id && !showProfileDetails
                                    ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-semibold shadow-md"
                                    : "text-black hover:bg-orange-100"
                            }`}
                        >
                            <span
                                className={`text-xl transition-all duration-200 ease-in-out ${
                                    activeTab === tab.id && !showProfileDetails ? "text-white" : "text-orange-400"
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
                        <span className="font-bold text-xl hidden sm:inline">Student Panel</span>
                    </div>

                    <div className="relative" ref={profileMenuRef}>
                        <button
                            title = "User Prorfile" 
                            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                            className="text-gray hover:text-gray-300 focus:outline-none flex items-center cursor-pointer"
                        >
                            {!studentData?.profilePicture ? <FaUserCircle size={30} /> :
                            <img
                                src={`https://schoolapi.vsngroups.com/files/profile/${studentData?.profilePicture}`}
                                alt="Profile"
                                className="w-9 h-9 rounded-full object-cover flex items-center"
                            />}
                        </button>

                        <div
                            className={`absolute right-0 mt-2 w-64 bg-white/90 backdrop-blur-md text-gray-800 rounded-2xl shadow-2xl hover:shadow-orange-200 hover:-translate-y-1 transition-all hover:border-2 border border-orange-200 duration-300 z-50 transform origin-top-right ${profileMenuOpen
                                ? "scale-100 opacity-100 visible"
                                : "scale-95 opacity-0 invisible"
                                }`}
                        >
                            <div className="px-4 py-3 border-b bg-gradient-to-r from-yellow-400 to-orange-400 text-gray">
                                <p className="font-semibold text-sm">{studentData.name}</p>
                                <p className="text-xs opacity-90"> {studentData.userID}</p>
                            </div>
                            <ul className="py-2">
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
                        <Route index element={<Navigate to="home" />} /> {/* ✅ default route */}
                        <Route path="home" element={<div className="p-6"><Dashboard studentData={studentData}/></div>} />
                        <Route path="mocktest" element={<div className="p-6"><Mocktests studentData={studentData}/></div>} />
                        <Route path="timetable" element={<div className="p-6"><Timetable studentData={studentData}/></div>} />
                        <Route path="marks" element={<div className="p-6"><Marks studentData={studentData}/></div>} />
                        <Route path="syllabus" element={<div className="p-6"><Syllabus studentData={studentData}/></div>} />
                        <Route path="notices" element={<div className="p-6"><Noticeboard studentData={studentData}/></div>} />
                        <Route path="bus" element={<div className="p-6"><BusService studentData={studentData}/></div>} />
                        {/* <Route path="profile" element={<PersonalDetails />} /> */}
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;