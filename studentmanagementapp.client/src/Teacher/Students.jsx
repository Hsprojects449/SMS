// components/teacher/Students.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
    MdCheckCircle,
    MdErrorOutline,
    MdRemoveRedEye
} from 'react-icons/md';
import {
    Save,
    Trash2,
    X
} from 'lucide-react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';

const Students = ({teacherData}) => {
    const topRef = useRef(null);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('success');
    const [visibleDetails, setVisibleDetails] = useState(null);
    const [studentList, setStudentList] = useState([]);
    const [filteredStudentList, setFilteredStudentList] = useState([]);

    const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth' });

    useEffect(() => {
        if(teacherData['assignedClass']){
            axios.get(`https://schoolapi.vsngroups.com/api/Student/class/${teacherData['assignedClass']}`)
            .then(response => {
                setStudentList(response.data);
                setFilteredStudentList(response.data)
            })
            .catch(error => {
                console.error('Students fetching data:', error);
            });
        }
    }, [teacherData['assignedClass']]);

    const showMessage = (text, type = 'success') => {
        setMessage(text);
        setMessageType(type);
        scrollToTop();
        setTimeout(() => setMessage(null), 3000);
    };

    const toggleDetails = (student) => {
        setVisibleDetails(student);
    };

    const handleRowEdit = (updatedRow) => {
        setStudentList(prevData =>
            prevData.map(student =>
                student.studentID === updatedRow.studentID ? { ...updatedRow, edited: true } : student
            )
        );
        setFilteredStudentList(prevData =>
            prevData.map(student =>
                student.studentID === updatedRow.studentID ? { ...updatedRow, edited: true } : student
            )
        );
    };

    const handleRowSave = async (updatedStudent) => {
        axios.put(`https://schoolapi.vsngroups.com/api/Student/${updatedStudent.studentID}`, updatedStudent)
            .then(response => {
                setStudentList(prev => prev.map(s => s.studentID == updatedStudent.studentID ? { ...updatedStudent, edited: false} : s));
                setFilteredStudentList(prev => prev.map(s => s.studentID == updatedStudent.studentID ? { ...updatedStudent, edited: false} : s));
                showMessage("Student details updated successfully");
            })
            .catch(error => {
                showMessage('Failed to save student details.', 'error');
            });
    };

    const columns = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 2,
            editable: true,
            headerClassName: "boldHeaderCell",
            renderCell: params => (
                <div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{params.row.name}</div>
                </div>
            )
        },
        {
            field: 'contactEmail',
            headerName: 'Email',
            flex: 2,
            editable: true,
            headerClassName: "boldHeaderCell",
            renderCell: params => (
                <div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{params.row.contactEmail}</div>
                </div>
            )
        },
        {
            field: 'class',
            headerName: 'Class',
            flex: 1,
            headerClassName: "boldHeaderCell",
            renderCell: params => (
                <div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{params.row.class}</div>
                </div>
            )
        },
        {
            field: 'parentName',
            headerName: 'Guardian',
            editable: true,
            flex: 1,
            headerClassName: "boldHeaderCell",
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            headerClassName: "boldHeaderCell",
            renderCell: params => (
                <span style={{
                    backgroundColor: '#16a34a',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '999px',
                    fontSize: '0.75rem'
                }}>
                    {params.value}
                </span>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            sortable: false,
            filterable: false,
            headerClassName: "boldHeaderCell",
            renderCell: params => (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    height: '100%'
                }}>
                    <button className="p-1 text-blue-500 hover:text-blue-600 cursor-pointer" title='View Details' onClick={() => toggleDetails(params.row)}><MdRemoveRedEye size={14} /></button>
                    {params.row?.edited && <button className="p-1 text-green-500 hover:text-green-600 cursor-pointer" title='Save Changes' onClick={() => handleRowSave(params.row)}><Save size={16} /></button>}
                    <button className="p-1 text-red-500 hover:text-red-600 cursor-pointer" title='Delete' onClick={() => handleDelete(params.row.studentID)}><Trash2 size={16} /></button>
                </div>
            )
        }
    ];

    return (
        <div>
            <h2 className="relative text-2xl font-bold text-black mb-4 flex items-center gap-2 drop-shadow-lg">
                Manage Students
                <span className="absolute -bottom-1 left-0 w-24 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded"></span>
            </h2>
            <div className="p-6 space-y-8" ref={topRef}>

                {message && (
                    <div className={`px-4 py-2 rounded text-sm font-medium flex items-center gap-2 shadow-md ${messageType == 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}> 
                        {messageType == 'success' ? <MdCheckCircle className="text-xl" /> : <MdErrorOutline className="text-xl" />}
                        <span>{message}</span>
                    </div>
                )}
                {!teacherData['assignedClass'] ? (
                    <p className="text-gray-500 text-sm">No class assigned yet</p>
                ) :
                    (<div className="bg-white text-black rounded-lg p-4 border border-orange-300 shadow">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 pl-[30px]">
                        Students of Class {teacherData.assignedClassName}
                    </h3>
                        <div className="overflow-x-auto border border-orange-300 rounded-lg max-w-[90%] mx-auto block">
                            <DataGrid
                                rows={filteredStudentList || studentList}
                                columns={columns}
                                getRowId={(row) => row.studentID}
                                pageSize={10}
                                rowsPerPageOptions={[5, 10, 20]}
                                disableSelectionOnClick
                                processRowUpdate={(newRow) => {
                                    handleRowEdit(newRow);
                                    return newRow;
                                }}
                                onProcessRowUpdateError={(error) => {
                                    console.error('Row update failed:', error);
                                }}
                                experimentalFeatures={{ newEditingApi: true }}
                            />
                        </div>
                    </div>)}
            </div>
            {visibleDetails != null && (
                <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center">
                    <div className="relative bg-white text-black border border-orange-300 p-6 rounded-xl shadow-2xl w-96 max-h-[80vh] overflow-y-auto">
                        <button
                            onClick={() => setVisibleDetails(null)}
                            className="absolute top-2 right-2 text-black hover:text-red-500 cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                        <h3 className="text-lg font-semibold mb-4 text-orange-500">
                            Details of {visibleDetails.name}
                        </h3>
                        <div className="bg-orange-100 text-sm text-gray-700 p-3 col-span-7">
                            <p><strong>Phone:</strong> {visibleDetails.parentPhone}</p>
                            <p><strong>Date of Birth:</strong> {visibleDetails.dob?.split('T')[0]}</p>
                            <p><strong>Address:</strong> {visibleDetails.address}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Students;