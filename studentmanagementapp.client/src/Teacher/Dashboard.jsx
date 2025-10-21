// components/teacher/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { MdPeople } from 'react-icons/md';
import { BookOpen, CalendarDays, GraduationCap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const Dashboard = ({ teacherData }) => {
  const [teacherStats, setTeacherStats] = useState({});
  const [performanceData, setPerformanceData] = useState([
    { date: 'Jun 1', avg: 75 },
    { date: 'Jun 10', avg: 78 },
    { date: 'Jun 20', avg: 72 },
    { date: 'Jul 1', avg: 80 },
  ]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([
    'Evaluate Science mock test (Class VIII)',
    'Update attendance for July 2',
    'Prepare Math lesson plan - Chapter 4',
  ]);

  useEffect(() => {
    teacherData.teacherID &&
      axios
        .get(`https://schoolapi.vsngroups.com/api/Dashboard/TeacherDashboard/${teacherData.teacherID}`)
        .then((res) => {
          setUpcomingEvents(res.data.upcomingEvents);
          setTeacherStats({
            assignedClass: res.data.assignedClass?.name,
            totalStudents: res.data.studentsInClass,
          });
        });
  }, [teacherData.teacherID]);

  // Unified card style (white/orange/black, rounded, shadow, center content)
  const cardStyle =
    'bg-white/90 backdrop-blur-md text-black p-8 rounded-2xl shadow-2xl hover:shadow-orange-200 hover:-translate-y-1 transition-all duration-300 w-full max-w-2xl mx-auto hover:border-2 border border-orange-300 flex flex-col items-center justify-center text-center';

  return (
    <div>
      <h2 className="relative text-2xl font-bold text-black mb-4 flex items-center gap-2 drop-shadow-lg">
        Welcome, {teacherData.name}!
        <span className="absolute -bottom-1 left-0 w-25 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded"></span>
      </h2>

      {/* Teacher Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-6 gap-4 mb-6">
        <div className={cardStyle}>
          <GraduationCap size={28} className="text-blue-500 mb-2" />
          <p className="text-xs">Assigned Class</p>
          {teacherData.teacherID && teacherStats.assignedClass ? (
            <p className="text-xl font-bold text-black">{teacherStats.assignedClass}</p>
          ) : (
            <p className="text-sm font-bold text-gray-400">Not yet assigned</p>
          )}
        </div>
        <div className={cardStyle}>
          <BookOpen size={28} className="text-green-500 mb-2" />
          <p className="text-xs">Subjects</p>
          {teacherData.subjectSpecialization ? (
            <p className="text-xl font-bold text-black">{teacherData.subjectSpecialization}</p>
          ) : (
            <p className="text-sm font-bold text-gray-400">-</p>
          )}
        </div>
        <div className={cardStyle}>
          <MdPeople size={28} className="text-pink-500 mb-2" />
          <p className="text-xs">Students</p>
          {teacherData.teacherID && teacherStats.totalStudents ? (
            <p className="text-xl font-bold text-black">{teacherStats.totalStudents}</p>
          ) : (
            <p className="text-sm font-bold text-gray-400">-</p>
          )}
        </div>
      </div>

      {/* Line Chart for Performance */}
      <div className="bg-white border border-orange-300 p-4 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold text-black mb-4">
          Average Class Attendance (will be implemented once attendance storing is fixed)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#1e293b" tick={{ fontSize: 12, fill: '#1e293b' }} />
            <YAxis stroke="#1e293b" tick={{ fontSize: 12, fill: '#1e293b' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#f97316',
                color: '#1e293b',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
              labelStyle={{ color: '#1e293b', fontWeight: 'bold' }}
              itemStyle={{ color: '#f97316' }}
            />
            <Line type="monotone" dataKey="avg" stroke="#fb923c" strokeWidth={3} dot={{ r: 5, fill: '#fb923c' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Upcoming Events and Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/90 backdrop-blur-md shadow-2xl hover:shadow-orange-200 hover:-translate-y-1 transition-all duration-300 hover:border-2 border border-orange-300 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-black mb-3">Upcoming Events</h3>
          <ul className="list-disc list-inside text-black space-y-2">
            {upcomingEvents.map((task, index) => (
              <li key={index}>
                <span className="font-semibold text-orange-500">{task.date?.split('T')[0]}:</span> {task.eventName}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white/90 backdrop-blur-md shadow-2xl hover:shadow-orange-200 hover:-translate-y-1 transition-all duration-300 hover:border-2 border border-orange-300 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-black mb-3">Upcoming Tasks</h3>
          <ul className="list-disc list-inside text-black space-y-2">
            {upcomingTasks.map((task, idx) => (
              <li key={idx}>{task}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;