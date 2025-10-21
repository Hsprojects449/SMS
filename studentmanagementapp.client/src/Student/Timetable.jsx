import React, { useEffect, useState } from "react";
import axios from 'axios';

const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const Timetable = ({studentData}) => {
    const [timetable, setTimetable] = useState({});
    const [periodTimes, setPeriodTimes] = useState([]);
    const [subjectList, setSubjectList] = useState([]);

    // useEffect(() => {
    //     axios.get(`https://schoolapi.vsngroups.com/api/Class/ClassName/${studentData['class']}`)
    //     .then(response => {
    //         if (response.data.timeTable) {
    //             const fetchedSubjects = JSON.parse(response.data.timeTable) || []
    //             const dummyData = weekdays.reduce((acc, day) => {
    //                 acc[day] = fetchedSubjects[day]?.map(item => item || '') || [];
    //                 return acc;
    //             }, {});
    //             const dummyData1 = fetchedSubjects['Period']?.map(item => ({
    //                 from: item.from || '',
    //                 to: item.to || '',
    //                 break: item?.break || false
    //             })) || [];
                
    //             setTimetable(dummyData);
    //             setPeriodTimes(dummyData1);}
    //     })
    //     .catch(error => {
    //         console.error('Classes fetching data:', error);
    //         showMessage("Error loading Timetable", 'error')
    //     });
    // }, []);
    useEffect(() => {
        if (!studentData['classID']) return;
        axios.get(`https://schoolapi.vsngroups.com/api/Syllabus/Class/${studentData['classID']}`)
            .then(response => {
                setSubjectList(response.data);
            })
            .catch(error => {
                console.error('Subjects fetching data:', error);
            });
        axios.get(`https://schoolapi.vsngroups.com/api/Timetable/${studentData['classID']}`)
            .then(response => {
                const data = response.data.timetables || []; // Direct access to the array
                const tempTimetable = weekdays.reduce((acc, day) => { acc[day] = []; return acc; }, {});

                const periodsMap = new Map();
                data.map(item => {
                    if (item.period && !periodsMap.has(item.periodID)) {
                        periodsMap.set(item.periodID, {
                            periodId: item.periodID,
                            from: item.period.startTime?.slice(0, 5) || '',
                            to: item.period.endTime?.slice(0, 5) || '',
                            break: false
                        });
                    }
                });

                const sortedPeriods = Array.from(periodsMap.values()).sort((a, b) => a.periodId - b.periodId);
                setPeriodTimes(sortedPeriods);

                data.map(item => {
                    const dayName = weekdays[item.dayOfWeek - 1];
                    if (dayName && item.syllabus) {
                        tempTimetable[dayName].push(item.syllabus?.syllabusID || '');
                    }
                });

                setTimetable(tempTimetable);
            })
            .catch(error => {
                console.error('Failed to fetch timetable:', error);
                setTimetable(weekdays.reduce((acc, day) => { acc[day] = ['']; return acc; }, {}));
                setPeriodTimes([{ from: '', to: '', break: false }]);
            });
    }, [studentData['classID']]);

    return (
        <div>
            <h2 className="relative text-2xl font-bold text-black mb-4 flex items-center gap-2 drop-shadow-lg">
                Timetable
                <span className="absolute -bottom-1 left-0 w-16 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded"></span>
            </h2>
            <div className="p-6 space-y-6">
                {studentData['class'] ? (
                    <div>
                        <div className="bg-white/90 backdrop-blur-md text-black rounded-2xl p-4 shadow-2xl hover:shadow-orange-200 hover:-translate-y-1 transition-all duration-300 w-full mx-auto hover:border-2 border border-orange-300">
                            <h3 className="text-lg font-semibold mb-4">
                                Class {studentData['class']} Timetable
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
                                                        {(() => {
                                                            const syllabusId = timetable[day]?.[i];
                                                            if (syllabusId) {
                                                                const syllabus = subjectList.find(s => s.syllabusID === syllabusId);
                                                                return syllabus?.name || syllabusId;
                                                            }
                                                            return periodTimes[i].break ? "Break" : "–";
                                                        })()}
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
