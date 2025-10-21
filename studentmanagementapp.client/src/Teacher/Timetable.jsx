import React, { useEffect, useRef, useState } from 'react';
import { MdCheckCircle, MdErrorOutline } from 'react-icons/md';
import { MdSchedule } from 'react-icons/md';
import axios from 'axios';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const Timetable = ({teacherData}) => {
    const topRef = useRef(null);
    const [timetable, setTimetable] = useState({
        "Monday": [],
        "Tuesday": [],
        "Wednesday": [],
        "Thursday": [],
        "Friday": [],
        "Saturday": []
    });
    const [periodTimes, setPeriodTimes] = useState([]);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('success');

    useEffect(() => {
        if(teacherData['assignedClass']){
            axios.get(`https://schoolapi.vsngroups.com/api/Class/${teacherData['assignedClass']}`)
            .then(response => {
                // setTimetable(response.data?.timeTable);
                if (response.data.timeTable) {
                    const fetchedSubjects = JSON.parse(response.data.timeTable) || []
                    const dummyData = weekdays.reduce((acc, day) => {
                        acc[day] = fetchedSubjects[day]?.map(item => item || '') || [];
                        return acc;
                    }, {});
                    const dummyData1 = fetchedSubjects['Period']?.map(item => ({
                        from: item.from || '',
                        to: item.to || '',
                        break: item?.break || false
                    })) || [];
                    
                    setTimetable(dummyData);
                    setPeriodTimes(dummyData1);}
            })
            .catch(error => {
                console.error('Classes fetching data:', error);
                showMessage("Error loading Timetable", 'error')
            });
        }
    }, [teacherData['assignedClass']]);

    const showMessage = (text, type = 'success') => {
        setMessage(text);
        setMessageType(type);
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div>
            <h2 className="relative text-2xl font-bold text-black mb-4 flex items-center gap-2 drop-shadow-lg">
                Timetable
                <span className="absolute -bottom-1 left-0 w-16 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded"></span>
            </h2>
            <div ref={topRef} className="p-6 space-y-6">
                {message && (
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-md shadow-md text-white text-sm font-medium ${messageType == 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {messageType == 'success' ? <MdCheckCircle className="text-xl" /> : <MdErrorOutline className="text-xl" />}
                        <span>{message}</span>
                    </div>
                )}
                {teacherData['assignedClass'] ? (
                    <div>
                        <div className="bg-white/90 backdrop-blur-md text-black rounded-2xl p-4 shadow-2xl hover:shadow-orange-200 hover:-translate-y-1 transition-all duration-300 w-full mx-auto hover:border-2 border border-orange-300">
                            <h3 className="text-lg font-semibold mb-4">
                                Class {teacherData.assignedClassName} Timetable
                            </h3>
                            <div className="overflow-x-auto border border-orange-300 rounded-lg">
                                <table className="min-w-full text-left rounded-lg overflow-hidden">
                                    <thead>
                                        <tr className="bg-orange-100">
                                            <th className="p-2">Day</th>
                                            {periodTimes.map((p, idx) => (
                                                <th key={idx} className="p-2 text-center">
                                                    {p.break
                                                        ? "Break"
                                                        : `Period ${periodTimes.filter((pt) => !pt.break).indexOf(p) + 1}`}
                                                    <div className="text-xs font-semibold text-black">
                                                        {p.from} - {p.to}
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {weekdays.map((day) => (
                                            <tr key={day} className="border-t border-orange-300">
                                                <td className="p-2 font-semibold">{day}</td>
                                                {periodTimes.map((_, i) => (
                                                    <td
                                                        key={i}
                                                        className={`p-2 text-center ${periodTimes[i].break ? "italic text-gray-400" : ""}`}
                                                    >
                                                        {timetable[day]?.[i] || (periodTimes[i].break ? "Break" : "–")}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-slate-400">Assigned class not available.</p>
                )}
            </div>
        </div>
    );
};

export default Timetable;