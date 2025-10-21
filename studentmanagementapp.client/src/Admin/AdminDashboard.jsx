import React, { useState, useRef, useEffect } from "react";
import {
    MdDashboard,
    MdPeople,
    MdLibraryBooks,
    MdEventNote,
    MdSpeakerNotes,
    MdTimelapse,
    MdListAlt,
    MdOutlineClass,
    MdAssignment,
    MdQuiz,
    MdLocalHospital,
} from "react-icons/md";
import { PanelLeft, BusFront } from "lucide-react";
import { FaUserCircle, FaUser, FaLock, FaSignOutAlt } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";

import Dashboard from "./Dashboard";
import Classes from "./Classes";
import Teachers from "./Teachers";
import PendingTeachers from "./PendingTeachers";
import Students from "./Students";
import PendingStudents from "./PendingStudents";
import Syllabus from "./Syllabus";
import Subjects from "./Subjects";
import Attendance from "./Attendance";
import Timetable from "./Timetable";
import Mocktests from "./Mocktests";
import Noticeboard from "./Noticeboard";
import Marks from "./Marks";
import MedicalHistory from "./medicalHistory";
import BusService from "./BusService";
import { useAuth } from '../Auth/Authentication/AuthContext';
import { Link, Navigate, Route, Routes } from "react-router-dom";


const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);
    const [sidebarLocked, setSidebarLocked] = useState(true);
    const [sidebarHovered, setSidebarHovered] = useState(false);
    const isSidebarOpen = sidebarLocked || sidebarHovered;

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
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const tabs = [
        { id: "dashboard", label: "Dashboard", icon: <MdDashboard /> },
        { id: "teacher", label: "Teacher", icon: <GiTeacher /> },
        { id: "student", label: "Student", icon: <MdPeople /> },
        { id: "subjects", label: "Subjects", icon: <MdLibraryBooks /> },
        { id: "attendance", label: "Attendance", icon: <MdEventNote /> },
        { id: "notices", label: "Notice Board", icon: <MdSpeakerNotes /> },
        { id: "timetable", label: "Time Table", icon: <MdTimelapse /> },
        { id: "syllabus", label: "Syllabus", icon: <MdListAlt /> },
        { id: "classes", label: "Classes", icon: <MdOutlineClass /> },
        { id: "marks", label: "Marks", icon: <MdAssignment /> },
        { id: "mocktests", label: "Mocktests", icon: <MdQuiz /> },
        { id: "medical", label: "Medical History", icon: <MdLocalHospital /> },
        { id: "bus", label: "Bus Service", icon: <BusFront /> }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return (
                    <div className="p-6">
                        <Dashboard />
                    </div>
                );
            case "teacher":
                return (
                    <div className="p-6 text-black">
                        <Teachers />
                    </div>
                );
            case "student":
                return (
                    <div className="p-6 text-gray">
                        <Students />
                    </div>
                );
            case "subjects":
                return (
                    <div className="p-6 text-gray">
                        <Subjects />
                    </div>
                );
            case "attendance":
                return (
                    <div className="p-6 text-gray">
                        <Attendance />
                    </div>
                );
            case "notices":
                return (
                    <div className="p-6 text-gray">
                        <Noticeboard />
                    </div>
                );
            case "timetable":
                return (
                    <div className="p-6 text-gray">
                        <Timetable />
                    </div>
                );
            case "syllabus":
                return (
                    <div className="p-6 text-gray">
                        <Syllabus />
                    </div>
                );
            case "classes":
                return (
                    <div className="p-6 text-gray">
                        <Classes />
                    </div>
                );
            case "marks":
                return (
                    <div className="p-6 text-gray">
                        <Marks />
                    </div>
                );
            case "mocktests":
                return (
                    <div className="p-6 text-gray">
                        <Mocktests />
                    </div>
                );
            case "medical":
                return (
                    <div className="p-6 text-gray">
                        <MedicalHistory />
                    </div>
                );
            case "bus":
                return (
                    <div className="p-6 text-gray">
                        <BusService />
                    </div>
                );
            default:
                return null;
        }
    };
    const { auth, logout } = useAuth();

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
  className={`transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"} bg-white border-r border-orange-300 text-black shadow-md overflow-hidden backdrop-blur-md`}
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
      title = "Click to Stick the menu"
      onClick={() => setSidebarLocked(!sidebarLocked)}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-orange-400 focus:outline-none transition-all duration-200 cursor-pointer"
    >
      <PanelLeft size={22}/>
    </button>
  </div>
  <nav className="flex flex-col py-4 space-y-1">
    {tabs.map((tab) => (
      <Link
        key={tab.id}
        to={`/admin/${tab.id}`}
        onClick={() => setActiveTab(tab.id)}
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
        {isSidebarOpen && (
          <span className="transition-all duration-200 ease-in-out">
            {tab.label}
          </span>
        )}
      </Link>
    ))}
  </nav>
</aside>
            {/* Main content */}
            <main className="flex-1 flex flex-col">
                {/* Navbar */}
                <header className="h-16 bg-white border-b border-orange-300 shadow-2xl text-black flex items-center px-4 shadow-md justify-between">
                    <span className="font-bold text-xl hidden sm:inline">
                        Admin Panel
                    </span>
                    <div className="relative" ref={profileMenuRef}>
                        <button
                            title = "User Profile" 
                            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                            className="text-gray hover:text-gray-300 focus:outline-none cursor-pointer"
                        >
                            <FaUserCircle size={30} className="text-orange-400"/>
                        </button>

                        {/* Animated Dropdown */}
                        <div
                            className={`absolute right-0 mt-2 w-64 bg-white/90 backdrop-blur-md text-gray-800 rounded-2xl shadow-2xl hover:shadow-orange-200 hover:-translate-y-1 transition-all hover:border-2 border border-orange-200 duration-300 z-50 transform origin-top-right ${profileMenuOpen
                                ? "scale-100 opacity-100 visible"
                                : "scale-95 opacity-0 invisible"
                                }`}
                        >
                            <div className="px-4 py-3 border-b bg-gradient-to-r from-yellow-400 to-orange-400 text-gray">
                                <p className="font-semibold text-sm">{auth.name}</p>
                                <p className="text-xs opacity-90">{auth.userId}</p>
                            </div>
                            <ul className="py-2">
                                {/* <li>
                                    <button
                                        onClick={() => alert("Navigate to change password")}
                                        className="w-full px-4 py-2 flex items-center hover:bg-gray-100 transition"
                                    >
                                        <FaLock className="mr-2" /> Change Password
                                    </button>
                                </li> */}
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
                        <Route path="dashboard" element={<div className="p-6"><Dashboard /></div>} />
                        <Route path="teacher" element={<div className="p-6"><Teachers /></div>} />
                        <Route path="pending-teachers" element={<div className="p-6"><PendingTeachers /></div>} />
                        <Route path="student" element={<div className="p-6"><Students /></div>} />
                        <Route path="pending-students" element={<div className="p-6"><PendingStudents /></div>} />
                        <Route path="subjects" element={<div className="p-6"><Subjects /></div>} />
                        <Route path="attendance" element={<div className="p-6"><Attendance /></div>} />
                        <Route path="notices" element={<div className="p-6"><Noticeboard /></div>} />
                        <Route path="timetable" element={<div className="p-6"><Timetable /></div>} />
                        <Route path="syllabus" element={<div className="p-6"><Syllabus /></div>} />
                        <Route path="classes" element={<div className="p-6"><Classes /></div>} />
                        <Route path="marks" element={<div className="p-6"><Marks /></div>} />
                        <Route path="mocktests" element={<div className="p-6"><Mocktests /></div>} />
                        <Route path="medical" element={<div className="p-6"><MedicalHistory /></div>} />
                        <Route path="bus" element={<div className="p-6"><BusService /></div>} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;