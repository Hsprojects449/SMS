// components/admin/Marks.jsx
import React, { useEffect, useRef, useState } from 'react';
import { MdCheckCircle, MdErrorOutline } from 'react-icons/md';
import { Filter, PlusCircle, Save } from 'lucide-react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';

const Marks = () => {
    const [classList, setClassList] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [subjectList, setSubjectList] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('success');
    const topRef = useRef(null);
    const [newExam, setNewExam] = useState("");
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const [postExamList, setPostExamList] = useState([]);
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
        if (selectedClass) {
            const ClassName = classList.find(cls => cls.name == selectedClass)?.classID;
            axios.get(`https://schoolapi.vsngroups.com/api/Syllabus/Class/${ClassName}`)
                .then(response => {
                    setSubjectList(response.data);
                })
                .catch(error => {
                    console.error('Subjects fetching data:', error);
                });
        } else {
            setSubjectList([])
        }
    }, [selectedClass]);

    useEffect(() => {
        if (selectedClass && selectedSubject) {
            axios.get(`https://schoolapi.vsngroups.com/api/Marks/class-subject-marks/${selectedClass}/${selectedSubject}`)
                .then(response => {
                    setRows(response.data.rows)
                    setFilteredRows(response.data.rows)
                    setColumns(response.data.columns)
                })
        }
    }, [selectedSubject]);

    const showMessage = (text, type = 'success') => {
        setMessage(text);
        setMessageType(type);
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleRowEdit = (updatedRow) => {
        setRows(prevData =>
            prevData.map(student =>
                student.studentID == updatedRow.studentID ? updatedRow : student
            )
        );
        setFilteredRows(prevData =>
            prevData.map(student =>
                student.studentID == updatedRow.studentID ? updatedRow : student
            )
        );
    };
    const renderOfflineTable = () => (
        <>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold pl-[30px]">Offline Exam Marks</h3>
                {selectedClass && selectedSubject && (
                    <div className="relative w-full max-w-md mr-4">
                        <input
                            type="text"
                            placeholder="Enter exam name"
                            value={newExam}
                            onChange={e => setNewExam(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    if (!e.target.value.trim()) return;
                                    setColumns(prev => [...prev, { field: newExam, headerName: newExam, flex: 1, editable: true }])
                                    setNewExam("");
                                }
                            }}
                            className="w-full px-4 py-2 border border-orange-300 rounded bg-white text-black shadow focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                        <button
                            title="Add Exam"
                            onClick={() => {
                                if (!newExam.trim()) return;
                                setColumns(prev => [...prev, { field: newExam, headerName: newExam, flex: 1, editable: true }])
                                setNewExam("");
                            }}
                            className="absolute right-2 top-2 text-orange-300 hover:text-orange-600 cursor-pointer"
                        >
                            <PlusCircle size={18} />
                        </button>
                    </div>
                )}
            </div>
            <div className="overflow-x-auto border border-orange-300 rounded-lg max-w-[90%] mx-auto block">
                {selectedClass && selectedSubject ? (
                    <DataGrid
                        rows={filteredRows || rows || []}
                        columns={columns || []}
                        getRowId={(row) => row.studentID}
                        pageSize={10}
                        rowsPerPageOptions={[5, 10, 20]}
                        disableRowSelectionOnClick
                        processRowUpdate={(newRow, oldRow) => {
                            handleRowEdit(newRow)
                            let updated = null;
                            Object.keys(newRow).forEach((key) => {
                                if (key !== "studentID" && key !== "name" && newRow[key] !== oldRow[key]) {
                                    updated = {
                                        studentID: newRow.studentID,
                                        name: newRow.name,
                                        examName: key,
                                        marksObtained: newRow[key] ? newRow[key] : null,
                                        class: selectedClass,
                                        syllabus: selectedSubject
                                    };
                                    setPostExamList(prev => [...prev, updated])
                                }
                            });
                            return newRow;
                        }}
                        onProcessRowUpdateError={(error) => {
                            console.error("Row update failed:", error);
                        }}
                        experimentalFeatures={{ newEditingApi: true }}
                    />
                ) : (
                    <p
                        colSpan={4}
                        className="text-center text-gray-400 text-lg py-4 italic"
                    >
                        Please select class and subject to manage the marks.
                    </p>
                )}
            </div>

            {selectedClass && selectedSubject && postExamList.length > 0 && (
                <>
                    <div className="mt-4 flex justify-end w-full mt-[10px] pr-[30px]">
                        <button
                            onClick={() => {
                                axios.post(`https://schoolapi.vsngroups.com/api/Marks/${selectedClass}/${selectedSubject}`, postExamList)
                                    .then(response => {
                                        setPostExamList([])
                                        showMessage(` Marks saved successfully.`);
                                })
                                    .catch(error => {
                                        console.error(error.response?.data);
                                        showMessage('Failed to save the attendance', 'error');
                                    });

                                showMessage('Marks saved successfully.');
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 shadow"
                        >
                            <Save size={18} /> Save Marks
                        </button>
                    </div>
                </>
            )}
        </>
    );
    return (
        <div>
            <h2 className="relative text-2xl font-bold text-black mb-4 flex items-center gap-2 drop-shadow-lg">
                Manage Marks
                <span className="absolute -bottom-1 left-0 w-24 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded"></span>
            </h2>
            <div ref={topRef} className="p-6 space-y-6">
                {message && (
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-md shadow-md text-white text-sm font-medium ${messageType == 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {messageType == 'success' ? <MdCheckCircle className="text-xl" /> : <MdErrorOutline className="text-xl" />}
                        <span>{message}</span>
                    </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium text-black">Select Class:</label>
                        <select
                            value={selectedClass}
                            onChange={(e) => { setSelectedClass(e.target.value), setSelectedSubject('') }}
                            className="bg-transparent text-black border border-orange-400 px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
                        >
                            <option value="">-- Select Class --</option>
                            {classList.map(cls => (
                                <option key={cls.classID} value={cls.name} className="bg-white text-black">{cls.name}</option>
                            ))}
                        </select>
                    </div>
                    {selectedClass && (
                        <div>
                            <label className="block font-medium text-black">Select Subject:</label>
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="bg-transparent text-black border border-orange-400 px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
                            >
                                <option value="">-- Select Subject --</option>
                                {subjectList.map(sub => (
                                    <option key={sub.syllabusID} value={sub.name} className="bg-white text-black">{sub.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
                {selectedClass && selectedSubject && <div className="relative w-full max-w-md mr-4">
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setFilteredRows(
                                    rows.filter(row =>
                                        row.name.toLowerCase().includes(searchQuery.toLowerCase())
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
                <div className="bg-white text-black rounded-lg p-4 shadow mt-4 border border-orange-300">
                    {renderOfflineTable()}
                </div>
            </div>
        </div>
    );
};

export default Marks;