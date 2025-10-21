// components/student/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { ClipboardList, GraduationCap, UserCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const Dashboard = ({studentData}) => {

    const [mockTests, setMockTests] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([])

    const [recentMarks, setRecentMarks] = useState([])

    useEffect(() => {
        studentData['studentID'] && axios.get(`https://schoolapi.vsngroups.com/api/Dashboard/StudentDashboard/${studentData['studentID']}`)
        .then(res => {
            setMockTests(res.data.liveMocks)
            setUpcomingEvents(res.data.upcomingEvents)
            setRecentMarks(res.data.recentMarks)
        })
    },[studentData['studentID']])

    const cardStyle =
        'bg-white/90 hover:border-2 border border-orange-300 text-black rounded-2xl p-5 flex flex-col items-center justify-center gap-2 shadow-2xl hover:shadow-orange-200 hover:-translate-y-1 transition-all duration-200 backdrop-blur-md';

    return (
        <div>
            <h2 className="relative text-2xl font-bold text-black mb-4 flex items-center gap-2 drop-shadow-lg">
                Welcome, {studentData.name}
                <span className="absolute -bottom-1 left-0 w-25 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded"></span>
            </h2>
            <div className="space-y-6 p-6">
                {/* Quick Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className={cardStyle}>
                        <GraduationCap size={28} className="text-indigo-600" />
                        <p className="text-sm">Class</p>
                        <p className="text-xl font-bold">{studentData.class}</p>
                    </div>
                    <div className={cardStyle}>
                        <ClipboardList size={28} className="text-pink-600" />
                        <p className="text-sm">Attendance</p>
                        <p className="text-xl font-bold">100%</p>
                    </div>
                    <div className={cardStyle}>
                        <UserCircle size={28} className="text-green-600" />
                        <p className="text-sm">Roll number</p>
                        <p className="text-xl font-bold">{studentData.studentID ? studentData.studentID.split('-')[0] : 0}</p>
                    </div>
                </div>

                {/* Recent Marks Line Chart */}
                <div className="bg-white border border-orange-300 rounded-xl p-4 shadow mb-6">
                    <h3 className="text-lg font-semibold text-black mb-4">Marks Report Graph</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={recentMarks}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" stroke="#1e293b" tick={{ fontSize: 12, fill: '#1e293b' }} />
                            <YAxis stroke="#1e293b" tick={{ fontSize: 12, fill: '#1e293b' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#f97316', color: '#1e293b', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }} labelStyle={{ color: '#1e293b', fontWeight: 'bold' }} itemStyle={{ color: '#f97316' }} />
                            <Line type="monotone" dataKey="marks" stroke="#fb923c" strokeWidth={2} dot={{ r: 5, fill: '#fb923c' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Events and Notices */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/90 hover:border-2 border border-orange-300 rounded-2xl p-4 shadow-2xl hover:shadow-orange-200 hover:-translate-y-1 transition-all duration-200 backdrop-blur-md">
                        <h3 className="text-lg font-semibold text-black mb-3">Mock Tests</h3>
                        <ul className="list-disc list-inside text-black space-y-2">
                            {mockTests.map((test, index) => (
                                <li key={index}>
                                    <span className="font-semibold text-orange-500">{test.subject}:</span> {test.description}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white/90 hover:border-2 border border-orange-300 rounded-2xl p-4 shadow-2xl hover:shadow-orange-200 hover:-translate-y-1 transition-all duration-200 backdrop-blur-md">
                        <h3 className="text-lg font-semibold text-black mb-3">Upcoming Events</h3>
                        <ul className="list-disc list-inside text-black space-y-2">
                            {upcomingEvents.map((note, index) => (
                                <li key={index}>
                                    <span className="font-semibold text-orange-500">{note.eventName}:</span> {note.date?.split('T')[0]}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;