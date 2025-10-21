// components/admin/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { GiTeacher } from 'react-icons/gi';
import { MdPeople, MdOutlineClass, MdLibraryBooks } from 'react-icons/md';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [liveMocks, setLiveMocks] = useState([]);
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    axios
      .get(`https://schoolapi.vsngroups.com/api/Dashboard/AdminDashboard`)
      .then((res) => {
        setStats({
          totalTeachers: res.data.totalTeachers,
          totalStudents: res.data.totalStudents,
          totalSubjects: res.data.totalSubjects,
          totalClasses: res.data.totalClasses,
        });
        setUpcomingEvents(res.data.upcomingEvents);
        setLiveMocks(res.data.liveMocks);
        setBarData(res.data.barData);
      });
  }, []);

  const cardStyle =
    'bg-white/90 backdrop-blur-md text-black p-4 rounded-2xl shadow-2xl hover:shadow-orange-200 hover:-translate-y-1 transition-all duration-300 w-full max-w-2xl mx-auto hover:border-2 border border-orange-300 flex flex-col items-center justify-center text-center';

  return (
    <div>
      <h2 className="relative text-2xl font-bold text-black mb-4 flex items-center gap-2 drop-shadow-lg">
        Admin Dashboard
        <span className="absolute -bottom-1 left-0 w-20 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded"></span>
      </h2>

      {/* Top Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-6 gap-4 mb-6">
        <div className={cardStyle}>
          <GiTeacher size={28} className="text-indigo-600" />
          <p className="text-sm">Total Teachers</p>
          <p className="text-xl font-bold">{stats.totalTeachers}</p>
        </div>
        <div className={cardStyle}>
          <MdPeople size={28} className="text-pink-600" />
          <p className="text-sm">Total Students</p>
          <p className="text-xl font-bold">{stats.totalStudents}</p>
        </div>
        <div className={cardStyle}>
          <MdLibraryBooks size={28} className="text-green-600" />
          <p className="text-sm">Total Subjects</p>
          <p className="text-xl font-bold">{stats.totalSubjects}</p>
        </div>
        <div className={cardStyle}>
          <MdOutlineClass size={28} className="text-yellow-700" />
          <p className="text-sm">Total Classes</p>
          <p className="text-xl font-bold">{stats.totalClasses}</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white border border-orange-300 p-4 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold text-black mb-4">
          Class-wise Student Strength ({new Date().toISOString().split('T')[0]})
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            {/* Grid */}
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

            {/* Axes */}
            <XAxis dataKey="name" stroke="#1e293b" tick={{ fontSize: 12, fill: '#1e293b' }} />
            <YAxis stroke="#1e293b" tick={{ fontSize: 12, fill: '#1e293b' }} />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#f97316',
                color: '#1e293b',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
              labelStyle={{ color: '#1e293b', fontWeight: 'bold' }}
              itemStyle={{ color: '#f97316' }}
            />

            {/* Bar */}
            <Bar
              dataKey="students"
              fill="#fb923c" // Tailwind orange-400
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

      </div>

      {/* Upcoming Events and Live Mocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl hover:shadow-orange-200 hover:-translate-y-1 transition-all duration-200 hover:border-2 border border-orange-300 p-4">
          <h3 className="text-lg font-semibold text-black mb-3">Upcoming Events</h3>
          <ul className="list-disc list-inside text-black space-y-2">
            {upcomingEvents.map((event, index) => (
              <li key={index}>
                <span className="font-semibold text-orange-500">{event.date?.split('T')[0]}:</span> {event.eventName}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl hover:shadow-orange-200 hover:-translate-y-1 transition-all duration-200 hover:border-2 border border-orange-300 p-4">
          <h3 className="text-lg font-semibold text-black mb-3">Live Mocktests</h3>
          <ul className="list-none space-y-2 text-black">
            {liveMocks.map((test, index) => (
              <li key={index} className="border-b border-gray-200 pb-2">
                {test}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;