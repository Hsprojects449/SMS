// components/admin/Attendance.jsx
import React, { useEffect, useRef, useState } from 'react';
import {
    MdCheckCircle,
    MdErrorOutline,
} from 'react-icons/md';
import { Filter, Save } from 'lucide-react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import Checkbox from '@mui/material/Checkbox';
import { useAuth } from '../Auth/Authentication/AuthContext';

const Attendance = () => {
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedClassName, setSelectedClassName] = useState('');
    const [classList, setClassList] = useState([]);
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('success');
    const [isViewOnly, setIsViewOnly] = useState(false);
    const topRef = useRef(null);
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const [changes, setChanges] = useState([]);
    const { auth } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRows, setFilteredRows] = useState([]);

    useEffect(() => {
        axios.get('https://schoolapi.vsngroups.com/api/Class')
            .then(response => {
                setClassList(response.data);
            })
            .catch(error => {
                console.error('Classes fetching data:', error);
            });
    }, []);

    useEffect(() => {
        {selectedDate && selectedClass && axios.get(`https://schoolapi.vsngroups.com/api/Attendance/date/${selectedDate}/class/${selectedClass}`)
            .then(response => {
                setChanges([])
                setRows(response.data.rows)
                setFilteredRows(response.data.rows)
                setColumns(response.data.columns)
            })}
    }, [selectedDate, selectedClass]);
    // const fetchStudentsForClass = (Class) => {
    //     axios.get(`https://schoolapi.vsngroups.com/api/Attendance/date/${selectedDate}/class/${Class}`)
    //         .then(response => {
    //             setRows(response.data.rows)
    //             setColumns(response.data.columns)
    //             console.log('attendance', response.data)
    //         })
    // };

    const showMessage = (text, type = 'success') => {
        setMessage(text);
        setMessageType(type);
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleSaveAttendance = (who) => {
        axios.post(`https://schoolapi.vsngroups.com/api/Attendance/${selectedClassName}/${selectedDate}`, changes)
            .then(response => {
                showMessage(`${who} attendance saved successfully.`);
            })
            .catch(error => {
                console.error(error.response?.data);
                showMessage('Failed to save the attendance', 'error');
            });
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const isPast = new Date(date) < new Date(new Date().toDateString());
        setIsViewOnly(isPast);
    };

    const enhancedColumns = columns.map((col) =>
        col.type === "boolean"
            ? {
                ...col,
                sortable: false,
                renderCell: (params) => (
                    <Checkbox
                        checked={!!params.value}
                        onChange={(e) => {
                            const newVal = e.target.checked;
                            setRows((prev) =>
                                prev.map((row) =>
                                    row.studentId === params.id
                                        ? { ...row, [params.field]: newVal }
                                        : row
                                )
                            );
                            setFilteredRows((prev) =>
                                prev.map((row) =>
                                    row.studentId === params.id
                                        ? { ...row, [params.field]: newVal }
                                        : row
                                )
                            );
                            const currentStudent = rows.find(x => x.studentId == params.id);
                            setChanges((prev) => {
                                const exists = prev.some(row => row.StudentID == params.id && row.TimetableID == [params.field][0][0]);
                                if (exists) {
                                    return prev.map((row) =>
                                        row.StudentID === params.id
                                            ? {
                                                ...row,
                                                Status: newVal ? "Present" : "Absent",
                                            }
                                            : row
                                    );
                                } else {
                                    return [
                                        ...prev,
                                        {
                                            StudentID: currentStudent.studentId,
                                            Name: currentStudent.studentName,
                                            Class: currentStudent.class,
                                            Date: selectedDate,
                                            Status: newVal ? "Present" : "Absent",
                                            TimetableID: [params.field][0][0],
                                            MarkedUser: auth.userId,
                                        },
                                    ];
                                }
                            });
                        }}
                    />
                ),
            }
            : col
    );

    return (
        <div>
            <h2 className="relative text-2xl font-bold text-black mb-4 flex items-center gap-2 drop-shadow-lg">
                Manage Attendance
                <span className="absolute -bottom-1 left-0 w-24 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded"></span>
            </h2>
            <div ref={topRef} className="p-6 space-y-6">
                {message && (
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-md shadow-md text-white text-sm font-medium ${messageType == 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {messageType == 'success' ? <MdCheckCircle className="text-xl" /> : <MdErrorOutline className="text-xl" />}
                        <span>{message}</span>
                    </div>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex flex-col">
                        <label className="block font-medium text-black">Select Date:</label>
                        <input
                            type="date"
                            className="bg-transparent border border-orange-300 rounded px-3 py-2 text-black cursor-pointer"
                            value={selectedDate}
                            max={new Date().toISOString().split('T')[0]}
                            onChange={(e) => handleDateChange(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="block font-medium text-black">Select Class:</label>
                        <select
                            value={selectedClass}
                            onChange={(e) => {
                                setSelectedClass(e.target.value);
                                const selectedClassObj = classList.find(cls => cls.classID == e.target.value);
                                setSelectedClassName(selectedClassObj['name']);
                            }}
                            className="bg-transparent text-black border border-orange-300 px-4 py-2 rounded cursor-pointer"
                        >
                            <option value="" disabled className="bg-white text-black">
                                -- Select Class --
                            </option>
                            {classList.map((cls) => (
                                <option key={cls.classID} value={cls.classID} className="bg-white text-black">
                                    {cls.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {selectedClass && <div className="relative w-full max-w-md mr-4">
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setFilteredRows(
                                    rows.filter(row =>
                                        row.studentName.toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                );
                            }
                        }}
                        className="w-full px-4 py-2 border border-orange-300 rounded bg-white text-black shadow focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <button
                        title="Filter Students"
                        onClick={() => {
                            setFilteredRows(
                                rows.filter(row =>
                                    row.name.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                            );
                        }}
                        className="absolute right-2 top-2 text-orange-300 hover:text-orange-600 cursor-pointer"
                    >
                        <Filter size={18} />
                    </button>
                </div>}
                {selectedClass ? (<div className="bg-white text-black p-6 rounded-lg shadow space-y-4 border border-orange-300">
                    <h3 className="text-lg font-semibold pl-[30px]">
                        Student Attendance for Class {selectedClassName || '...'} on ${selectedDate}
                    </h3>
                    <div className="overflow-x-auto border border-orange-300 rounded-lg max-w-[90%] mx-auto block">
                        <DataGrid
                            rows={filteredRows || rows || []}
                            columns={enhancedColumns || []}
                            getRowId={(row) => row.studentId}
                            pageSize={10}
                            rowsPerPageOptions={[5, 10, 20]}
                            disableRowSelectionOnClick
                        />
                    </div>
                    {!isViewOnly && (
                        <div className="text-right flex justify-end w-full mt-[10px] pr-[30px]">
                            <button
                                onClick={() =>
                                    handleSaveAttendance('Student')
                                }
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded flex items-center gap-2 mt-2 cursor-pointer"
                            >
                                <Save size={16} /> Save Attendance
                            </button>
                        </div>
                    )}
                </div>) : (
                    <p
                        colSpan={4}
                        className="text-center text-gray-400 text-lg py-4 italic"
                    >
                        Please select class to manage the Attendance.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Attendance;