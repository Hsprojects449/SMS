import React, { useState, useRef, useEffect } from 'react';
import { exportCSV } from '../Common/exportCSV';
import {
    MdCheckCircle,
    MdErrorOutline,
    MdRemoveRedEye
} from 'react-icons/md';
import {
    PlusCircle,
    Users,
    UserX2,
    UserCheck,
    UserPlus,
    Save,
    Filter,
    Trash2,
    X,
    Download
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';   
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import './../Common/datagrid.css';

const Students = () => {
    const topRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('success');
    const [visibleDetails, setVisibleDetails] = useState(null);
    const [studentList, setStudentList] = useState([]);
    const [filteredStudentList, setFilteredStudentList] = useState([]);
    const [classes, setClasses] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [filterModel, setFilterModel] = useState({ items: [] });
    const [sortModel, setSortModel] = useState([]);
    const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth' });
    const apiRef = useGridApiRef(); 

    const formatPhone = (num) => {
    if (!num) return "";
    let digits = num.toString().replace(/\D/g, "");
    if (digits.length === 10) {
        return `="${digits}"`;
    }
    return `="${digits}"`; 
};

    const handleDownloadCSV = () => {
  exportCSV(
    searchQuery ? filteredStudentList : studentList,
    filterModel,
    sortModel,
    "students.csv",
    showMessage,
    ({ studentID, name, contactEmail, parentPhone, class: className, parentName, status }) => ({
      StudentID: studentID,
      Name: name,
      Email: contactEmail,
      Phone: formatPhone(parentPhone),
      Class: className,
      Guardian: parentName,
      Status: status
    })
  );
};

    const handleNavigate = () => {
        setLoading(true);
        setTimeout(() =>{ 
          navigate("/register");
          setLoading(false);
        }, 500);
    };

    useEffect(() => {
        axios.get('https://schoolapi.vsngroups.com/api/Student')
            .then(response => {
                setStudentList(response.data);
                setFilteredStudentList(response.data);
            })
            .catch(error => {
                console.error('Error fetching Students data:', error);
            });

        axios.get('https://schoolapi.vsngroups.com/api/Class')
            .then(response => {
                setClasses(response.data);
            })
            .catch(error => {
                console.error('Error fetching class data:', error);
            });
        fetchPendingRequests();
    }, []);

    const showMessage = (text, type = 'success') => {
        setMessage(text);
        setMessageType(type);
        scrollToTop();
        setTimeout(() => setMessage(null), 3000);
    };

    const fetchPendingRequests = async () => {
        try {
            setLoading(true);
            const res = await axios.get('https://schoolapi.vsngroups.com/api/StudentApplicant');
            setPendingRequests(res.data || []);
        } catch (err) {
            console.error('Error fetching Student Requests:', err);
            showMessage('Failed to load pending requests.', 'error');
        } finally {
            setLoading(false);
        }
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
        const Class = classes.find((item) => item.name === updatedStudent.class);
        axios.put(`https://schoolapi.vsngroups.com/api/Student/${updatedStudent.studentID}`, { ...updatedStudent, classID: Class.classID })
            .then(response => {
                setStudentList(prev => prev.map(s => s.studentID == updatedStudent.studentID ? { ...updatedStudent, edited: false, classID: Class.classID } : s));
                setFilteredStudentList(prev => prev.map(s => s.studentID == updatedStudent.studentID ? { ...updatedStudent, edited: false, classID: Class.classID } : s));
                showMessage("Student details updated successfully");
            })
            .catch(error => {
                showMessage('Failed to save student details.', 'error');
            });
    };

    const handleDelete = (id) => {
        const toDelete = studentList.find(s => s.studentID == id);
        const confirmDelete = window.confirm(`Are you sure you want to delete student "${toDelete.name}"?`);
        if (confirmDelete) {
            axios.delete(`https://schoolapi.vsngroups.com/api/Student/${id}`)
                .then(response => {
                    showMessage(`Deleted student ${toDelete.name}`, 'success');
                    setStudentList(prev => prev.filter(s => s.studentID != id));
                })
                .catch(error => {
                    showMessage(`Failed to delete Student "${toDelete.name}".`, 'error');
                });
        }
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
                                {params.row.name}
                        </div>
                    )
            },
        { field: 'contactEmail', headerName: 'Email', flex: 2, editable: true, headerClassName: "boldHeaderCell" },
        { field: 'parentPhone', headerName: 'Phone', flex: 1, editable: true, headerClassName: "boldHeaderCell" },
        {
            field: 'class',
            headerName: 'Class',
            flex: 0.6,
            editable: true,
            headerClassName: "boldHeaderCell",
            renderEditCell: (params) => {
                const { id, field, value } = params;
                const handleChange = (event) => {
                    const newValue = event.target.value;
                    params.api.setEditCellValue({ id, field, value: newValue }, event);
                };
                return (
                    <Select
                        value={value || ''}
                        onChange={handleChange}
                        fullWidth
                        autoFocus
                    >
                        {classes.map((option) => (
                            <MenuItem key={option.classID} value={option.name}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </Select>
                );
            }
        },
        { field: 'parentName', headerName: 'Guardian', editable: true, flex: 1.5, headerClassName: "boldHeaderCell" },
        {
            field: 'status',
            headerName: 'Status',
            flex: 0.5,
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
            flex: 0.8,
            sortable: false,
            filterable: false,
            headerClassName: "boldHeaderCell",
            renderCell: params => (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',   // vertical centering
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
            {loading && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded z-50">
                    <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin shadow-[0_0_10px_3px_rgba(255,165,0,0.5)]" />
                </div>
            )}
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

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white/90 backdrop-blur-md text-black hover:border-2 border border-orange-300 rounded-2xl p-4 shadow-2xl hover:shadow-orange-200 hover:-translate-y-1 transition-all duration-200 flex items-center gap-4">
                        <UserPlus className="w-6 h-6 text-purple-500" />
                        <div>
                            <p className="text-sm">Pending Requests</p>
                            <p className="text-xl font-bold">{pendingRequests.length}</p>
                        </div>
                    </div>
                    <div className="bg-white/90 backdrop-blur-md text-black hover:border-2 border border-orange-300 rounded-2xl p-4 shadow-2xl hover:shadow-orange-200 hover:-translate-y-1 transition-all duration-200 flex items-center gap-4">
                        <UserCheck className="w-6 h-6 text-green-500" />
                        <div>
                            <p className="text-sm">Active Students</p>
                            <p className="text-xl font-bold">{studentList.length}</p>
                        </div>
                    </div>
                    <div className="bg-white/90 backdrop-blur-md text-black hover:border-2 border border-orange-300 rounded-2xl p-4 shadow-2xl hover:shadow-orange-200 hover:-translate-y-1 transition-all duration-200 flex items-center gap-4">
                        <UserX2 className="w-6 h-6 text-yellow-500" />
                        <div>
                            <p className="text-sm">On Leave</p>
                            <p className="text-xl font-bold">0</p>
                        </div>
                    </div>
                    <div className="bg-white/90 backdrop-blur-md text-black hover:border-2 border border-orange-300 rounded-2xl p-4 shadow-2xl hover:shadow-orange-200 hover:-translate-y-1 transition-all duration-200 flex items-center gap-4">
                        <Users className="w-6 h-6 text-cyan-500" />
                        <div>
                            <p className="text-sm">Total Students</p>
                            <p className="text-xl font-bold">{studentList.length}</p>
                        </div>
                    </div>
                </div>

                {/* Search & Add */}
                <div className="flex justify-between items-center mt-6">
                    <div className="flex gap-4">
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow cursor-pointer"
                            onClick={() => navigate("/admin/pending-students")}
                        >
                            View Pending Approvals
                        </button>
                    </div>

                    <div className="relative w-full max-w-md mr-4">
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setFilteredStudentList(
                                        studentList.filter(student =>
                                            student.name.toLowerCase().includes(searchQuery.toLowerCase())
                                        )
                                    );
                                }
                            }}
                            className="w-full px-4 py-2 border border-orange-300 rounded bg-white text-black shadow focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                        <button
                            title="Filter Students"
                            onClick={() => {
                                setFilteredStudentList(prev =>
                                    studentList.filter(student =>
                                    student.name.toLowerCase().includes(searchQuery.toLowerCase())
                                  )
                                );
                              }}
                            className="absolute right-2 top-2 text-orange-300 hover:text-orange-600 cursor-pointer"
                        >
                            <Filter size={18} />
                        </button>
                    </div>

                    <button
                        className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:brightness-110 text-white px-4 py-2 rounded flex items-center gap-2 shadow cursor-pointer"
                        disabled={loading}
                        onClick={handleNavigate}
                    >
                        <PlusCircle size={18} /> Add Student
                    </button>
                </div>

                {/* Accepted Students Table */}
                <div className="bg-white text-black border border-orange-200 rounded-lg p-4 shadow mx-auto">
                <h3 className="text-lg font-semibold mb-2 flex items-center justify-between text-black pl-[30px]">
                    <span className="flex items-center gap-2">
                        <UserCheck /> Students
                    </span>
                    <button
                        onClick={handleDownloadCSV}
                        className="p-2 rounded-full hover:bg-green-100 text-green-600 transition"
                        title="Export students as CSV"
                    >
                        <Download size={18} />
                    </button>
                </h3>

                <div className="overflow-x-auto border border-orange-300 rounded-lg max-w-[90%] mx-auto block">
                    <DataGrid
                        apiRef={apiRef}
                        rows={searchQuery ? filteredStudentList : studentList}
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

                        // ✅ Capture filtering and sorting
                        filterModel={filterModel}
                        onFilterModelChange={(newModel) => setFilterModel(newModel)}
                        sortModel={sortModel}
                        onSortModelChange={(newModel) => setSortModel(newModel)}
                        />
                </div>
                </div>
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
                        {visibleDetails?.profilePicture && <div className="flex flex-col items-center mb-3">
                                <img
                                    src={`https://schoolapi.vsngroups.com/files/profile/${visibleDetails?.profilePicture}`}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover shadow-md"
                                />
                            </div>}
                            <p><strong>Phone:</strong> {visibleDetails.parentPhone}</p>
                            <p><strong>Date of Birth:</strong> {visibleDetails.dob?.split('T')[0]}</p>
                            <p><strong>Address:</strong> {visibleDetails.address}</p>
                            <p><strong>Class:</strong> {visibleDetails.class}</p>
                            <p><strong>Email:</strong> {visibleDetails.contactEmail}</p>
                            <p><strong>Gender:</strong> {visibleDetails.gender}</p>
                            <p><strong>Parent/Guardian:</strong> {visibleDetails.parentName}</p>
                            <p><strong>Religion:</strong> {visibleDetails.religion}</p>
                            <p><strong>Nationality:</strong> {visibleDetails.nationality}</p>
                            <p><strong>Caste:</strong> {visibleDetails.caste}</p>
                            <p><strong>Blood Group:</strong> {visibleDetails.bloodGroup}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Students;
