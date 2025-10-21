// components/admin/Timetable.jsx
import React, { useEffect, useState, useRef } from 'react';
import { MdCheckCircle, MdErrorOutline } from 'react-icons/md';
import { PlusCircle, Save } from 'lucide-react';
import axios from 'axios';

const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const Timetable = () => {
    const topRef = useRef(null);
    const [classList, setClassList] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [timetable, setTimetable] = useState(
        weekdays.reduce((acc, day) => { acc[day] = ['']; return acc; }, {})
    );
    const [periodTimes, setPeriodTimes] = useState([]);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState("success");
    const [highlightedPeriods, setHighlightedPeriods] = useState([]);
    const [highlightedSubjectCells, setHighlightedSubjectCells] = useState([]);
    const [subjectList, setSubjectList] = useState([]);
    const [timetableChange, setTimetableChange] = useState([]);
    const [counter, setCounter] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get('https://schoolapi.vsngroups.com/api/Class')
            .then(response => setClassList(response.data))
            .catch(error => console.error('Classes fetching error:', error));
    }, []);

    useEffect(() => {
        if (!selectedClass) return;
        setLoading(true);
        axios.get(`https://schoolapi.vsngroups.com/api/Syllabus/Class/${selectedClass}`)
            .then(response => {
                setLoading(false);
                setSubjectList(response.data);
            })
            .catch(error => {
                console.error('Subjects fetching data:', error);
            });
            axios.get(`https://schoolapi.vsngroups.com/api/Timetable/${selectedClass}`)
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
                // setPeriodTimes([{ from: '', to: '', break: false }]);
            });
    }, [selectedClass, counter]);

    const showMessage = (text, type = "success") => {
        setMessage(text);
        setMessageType(type);
        topRef.current?.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleChange = (day, index, value) => {
        setTimetableChange((prev) => {
            const exists = prev.some(x => x.periodID == periodTimes[index].periodId && x.dayOfWeek == (weekdays.indexOf(day)+1))
            if (exists) {
                return prev.map((row) => {
                    return row.PeriodId == periodTimes[index].periodId && row.DayOfWeek == (weekdays.indexOf(day)+1)
                        ? {
                            ...row,
                            SyllabusID: parseInt(value, 10)
                        }
                        : row;
                });
            } else {
                return [
                    ...prev,
                    {
                        classID: parseInt(selectedClass, 10),
                        dayOfWeek: weekdays.indexOf(day)+1,
                        periodID: periodTimes[index].periodId.toString(),
                        from: periodTimes[index].from,
                        to: periodTimes[index].to,
                        syllabusID: parseInt(value, 10)
                    }
                ]
            }
            })
        setTimetable((prev) => {
            const updated = [...(prev[day] || [])];
            updated[index] = value;
            return { ...prev, [day]: updated };
        });
        setHighlightedSubjectCells((prev) => prev.filter((cell) => !(cell.day === day && cell.i === index)));
    };

    const handleTimeChange = (index, field, value) => {
        const updated = [...periodTimes];
        updated[index] = { ...updated[index], [field]: value };
        setPeriodTimes(updated);
        setTimetableChange((prev) =>
            prev?.map((x) =>
                x.periodId == periodTimes[index].periodId
                    ? { ...x, [field]: value }
                    : x
            )
        );
        if (field === "from" || field === "to") {
            const period = updated[index];
            if (period.from && period.to) {
                setHighlightedPeriods((prev) => prev.filter((i) => i !== index));
            }
        }
    };

    const handleAddPeriod = () => {
        setPeriodTimes((prev) => {
          const newId = prev.length + 1;
          return [...prev, { periodId: `new-${newId}`, from: "", to: "", break: false }];
        });
      
        setTimetable((prev) => {
          const updated = { ...prev };
          weekdays.forEach((day) => {
            updated[day] = [...(updated[day] || []), ""];
          });
          return updated;
        });
      };

    const handleInsertBreak = (index) => {
        setPeriodTimes((prev) => {
            const updated = [...prev];
            updated.splice(index + 1, 0, { from: "", to: "", break: true });
            return updated;
        });
        setTimetable((prev) => {
            const updated = {};
            weekdays.forEach((day) => {
                const dayPeriods = [...(prev[day] || [])];
                dayPeriods.splice(index + 1, 0, "Break");
                updated[day] = dayPeriods;
            });
            return updated;
        });
    };

    const handleRemovePeriod = (index) => {
        setPeriodTimes((prev) => prev.filter((_, i) => i !== index));
        setTimetable((prev) => {
            const updated = {};
            weekdays.forEach((day) => {
                updated[day] = [...(prev[day] || [])].filter((_, i) => i !== index);
            });
            return updated;
        });
    };

    const handleSave = () => {
        timetableChange.length && axios.post(`https://schoolapi.vsngroups.com/api/TimeTable`, timetableChange )
            .then(() => showMessage(`TimeTable for saved successfully.`), setTimetableChange([]), setCounter(prev => prev+1))
            .catch((error) => showMessage('Failed to save the TimeTable', error));
    };

    return (
        <div ref={topRef}>
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded z-50">
            <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin shadow-[0_0_10px_3px_rgba(255,165,0,0.5)]" />
          </div>
        )}
            <h2 className="relative text-2xl font-bold text-black mb-4 drop-shadow-lg">
                Manage Timetable
                <span className="absolute -bottom-1 left-0 w-24 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded"></span>
            </h2>
            <div ref={topRef} className="p-6 space-y-6">
                {message && (
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-md shadow text-white text-sm font-medium ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {messageType === 'success' ? <MdCheckCircle className="text-xl" /> : <MdErrorOutline className="text-xl" />}
                        <span>{message}</span>
                    </div>
                )}

                <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <label className="text-black font-medium">Select Class:</label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="bg-transparent text-black border border-orange-400 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
                        >
                            <option value="" disabled className="bg-white text-black">-- Select Class --</option>
                            {classList.map(cls => (
                                <option key={cls.name} value={cls.classID} className="bg-white text-black">{cls.name}</option>
                            ))}
                        </select>
                    </div>
                    {selectedClass && (
                        <button
                            onClick={handleAddPeriod}
                            className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:brightness-110 text-white px-4 py-2 rounded flex items-center gap-2 shadow cursor-pointer"
                        >
                            <PlusCircle size={18} /> Add Period
                        </button>
                    )}
                </div>

                {selectedClass && (
                    <div className="overflow-x-auto">
                        <div className="bg-white text-black rounded-lg p-4 shadow mt-6 border border-orange-300">
                            <h3 className="text-lg font-semibold mb-2">Timetable for the Class - {classList.find(c => c.classID === selectedClass)?.name}</h3>
                            <div className="overflow-x-auto border border-orange-300 rounded-lg">
                                <table className="min-w-full text-left rounded-lg overflow-hidden">
                                    <thead>
                                        <tr className="bg-orange-100">
                                            <th className="p-2">Day</th>
                                            {periodTimes.map((period, i) => (
                                                <th key={i} className="p-2 text-center">
                                                    {period.break ? 'Break' : `Period ${periodTimes.filter(p => !p.break).indexOf(period) + 1}`}
                                                    {/* {!period.break && ( */}
                                                        <div className="mt-1 text-xs text-gray-300">
                                                            <input
                                                                type="time"
                                                                value={period.from}
                                                                onChange={(e) => handleTimeChange(i, 'from', e.target.value)}
                                                                className="bg-white text-black border px-2 py-1 rounded w-20 mr-1 cursor-pointer"
                                                            /> -
                                                            <input
                                                                type="time"
                                                                value={period.to}
                                                                onChange={(e) => handleTimeChange(i, 'to', e.target.value)}
                                                                className="bg-white text-black border px-2 py-1 rounded w-20 mr-1 cursor-pointer"
                                                            />
                                                        </div>
                                                    {/* )} */}
                                                    <div className="mt-2 flex justify-center gap-2">
                                                        <button
                                                            onClick={() => handleInsertBreak(i)}
                                                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded shadow cursor-pointer"
                                                        >
                                                            + Break
                                                        </button>
                                                        <button
                                                            onClick={() => handleRemovePeriod(i)}
                                                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded shadow cursor-pointer"
                                                        >
                                                            - Remove
                                                        </button>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {weekdays.map(day => (
                                            <tr key={day} className="border-t border-orange-300">
                                                <td className="p-2 text-black">{day}</td>
                                                {periodTimes.map((_, i) => (
                                                    <td key={i} className="p-2">
                                                        <select
                                                            className="bg-orange-100 text-black px-2 py-1 rounded w-full cursor-pointer"
                                                            value={timetable[day]?.[i] || ''}
                                                            onChange={(e) => handleChange(day, i, e.target.value)}
                                                            disabled={periodTimes[i]?.break}
                                                        >
                                                            <option value="">
                                                                {periodTimes[i]?.break ? 'Break' : 'Select Subject'}
                                                            </option>
                                                            {subjectList.map((subject) => (
                                                                <option key={subject.syllabusID} value={subject.syllabusID}>
                                                                    {subject.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="text-left mt-4">
                                <button
                                    onClick={handleSave}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
                                >
                                    <Save size={16} /> Save Timetable
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Timetable;