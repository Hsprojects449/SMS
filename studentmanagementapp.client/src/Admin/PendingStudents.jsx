// components/admin/PendingStudents.jsx
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Pagination from '../Common/Pagination';
import {
  Eye,
  Check,
  X,
  UserPlus,
  ArrowLeft,
  RotateCcw,
  Filter,
  Trash2
} from 'lucide-react';
import { MdCheckCircle, MdErrorOutline, MdRemoveRedEye } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

const PendingStudents = () => {
  const topRef = useRef(null);
  const navigate = useNavigate();

  // UI state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');
  const [visibleDetails, setVisibleDetails] = useState(null);

  // Data
  const [pendingRequests, setPendingRequests] = useState([]);
  const [filteredPendingRequests, setFilteredPendingRequests] = useState([]);

  // Search & Pagination
  const [searchQuery, setSearchQuery] = useState('');

  const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth' });

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
      setFilteredPendingRequests(res.data || [])
    } catch (err) {
      console.error('Error fetching Student Requests:', err);
      showMessage('Failed to load pending requests.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const toggleDetails = (pendingStudent) => {
    setVisibleDetails(pendingStudent);
  };

  const handleAccept = async (id) => {
    const acceptedUser = pendingRequests.find((s) => s.studentApplicantID == id);
    try {
      setLoading(true);
        await axios.post(`https://schoolapi.vsngroups.com/api/StudentApplicant/${id}/approve`);
      setPendingRequests((prev) => prev.filter((s) => s.studentApplicantID != id));
      setFilteredPendingRequests((prev) => prev.filter((s) => s.studentApplicantID != id));
      showMessage(`Accepted registration for ${acceptedUser?.name || 'student'}`, 'success');
    } catch (err) {
      console.error(err);
      showMessage('Failed to accept the student.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    const rejectedUser = pendingRequests.find((s) => s.studentApplicantID == id);
    const ok = window.confirm(`Reject registration for "${rejectedUser?.name || 'student'}"?`);
    if (!ok) return;

    try {
      setLoading(true);
      await axios.delete(`https://schoolapi.vsngroups.com/api/StudentApplicant/${id}/reject`);
      setPendingRequests((prev) => prev.filter((s) => s.studentApplicantID != id));
      setFilteredPendingRequests((prev) => prev.filter((s) => s.studentApplicantID != id));
      showMessage(`Rejected registration for ${rejectedUser?.name || 'student'}`, 'success');
    } catch (err) {
      console.error(err);
      showMessage('Failed to reject the student.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
        field: 'name',
        headerName: 'Name',
        flex: 2,
        headerClassName: "boldHeaderCell",
        renderCell: params => (
            <div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>{params.row.name}</div>
            </div>
        )
    },
    {
        field: 'class',
        headerName: 'Class',
        flex: 2,
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
        flex: 1,
        headerClassName: "boldHeaderCell",
    },
    {
        field: 'Applied',
        headerName: 'requestedAt',
        flex: 1,
        headerClassName: "boldHeaderCell",
        renderCell: params => (
            <div>
                <div>{params.row.requestedAt.split('T')[0]}</div>
            </div>
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
                alignItems: 'center',   // vertical centering
                gap: '8px',
                width: '100%',
                height: '100%'
            }}>
                <button className="p-1 text-blue-500 hover:text-blue-600 cursor-pointer" title='View Details' onClick={() => toggleDetails(params.row)}><MdRemoveRedEye size={14} /></button>
                <button className="p-1 text-blue-500 hover:text-blue-600 cursor-pointer" title='Accept' onClick={() => handleAccept(params.row.studentApplicantID)}><Check size={16} /></button>
                <button className="p-1 text-red-500 hover:text-red-600 cursor-pointer" title='Reject'  onClick={() => handleReject(params.row.studentApplicantID)}><Trash2 size={16} /></button>
            </div>
        )
    }
  ];

  return (
    <div ref={topRef}>
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded z-50">
          <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin shadow-[0_0_10px_3px_rgba(255,165,0,0.5)]" />
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="relative text-2xl font-bold text-black flex items-center gap-2">
            Pending Student Approvals
            <span className="absolute -bottom-1 left-0 w-40 h-1 bg-gradient-to-r from-red-400 to-orange-400 rounded"></span>
          </h2>
        </div>
  
        {/* Buttons aligned to right */}
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-gray-300 text-black px-3 py-2 rounded shadow cursor-pointer flex items-center gap-2"
            title="Back"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <button
            onClick={fetchPendingRequests}
            className="bg-white hover:bg-gray-50 border border-orange-300 text-black px-3 py-2 rounded shadow cursor-pointer flex items-center gap-2"
            title="Reload"
          >
            <RotateCcw size={16} />
            Reload
          </button>
        </div>
      </div>
  
      {/* Message */}
      {message && (
        <div
          className={`mb-4 px-4 py-2 rounded text-sm font-medium flex items-center gap-2 shadow-md ${
            messageType === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {messageType === "success" ? (
            <MdCheckCircle className="text-xl" />
          ) : (
            <MdErrorOutline className="text-xl" />
          )}
          <span>{message}</span>
        </div>
      )}
  
      {/* Conditional Content */}
      {pendingRequests.length === 0 ? (
        <p className="text-gray-500 italic">No pending requests.</p>
      ) : (
        <>
          {/* Search */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-2 flex items-center">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        setFilteredPendingRequests(
                            pendingRequests.filter(req =>
                                req.name.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                        );
                    }
                  }}
                  placeholder="Search by name"
                  className="w-full px-4 py-2 border border-orange-300 rounded bg-white text-black shadow focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <button
                  title="Filter Pending Students"
                  onClick={() => {
                    setFilteredPendingRequests(prev =>
                      pendingRequests.filter(req =>
                        req.name.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                    );
                  }}
                  className="absolute right-2 top-2 text-orange-300 hover:text-orange-600 cursor-pointer"
                >
                  <Filter size={18} />
                </button>
              </div>
            </div>
          </div>
  
          {/* Pending Table */}
          <div className="bg-white text-black border border-orange-300 rounded-lg p-4 shadow mx-auto">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-black pl-[30px]">
              <UserPlus /> Pending Requests
            </h3>
            <div className="overflow-x-auto border border-orange-300 rounded-lg max-w-[90%] mx-auto block">
              <DataGrid
                rows={filteredPendingRequests || pendingRequests}
                columns={columns}
                getRowId={(row) => row.studentApplicantID}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 20]}
                disableSelectionOnClick
                processRowUpdate={(newRow) => {
                  handleRowEdit(newRow);
                  return newRow;
                }}
                onProcessRowUpdateError={(error) => {
                  console.error("Row update failed:", error);
                }}
                experimentalFeatures={{ newEditingApi: true }}
              />
            </div>
          </div>
        </>
      )}
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
              <p><strong>Email:</strong> {visibleDetails.contactEmail}</p>
              <p><strong>Parent/Guardian:</strong> {visibleDetails.parentName}</p>
              <p><strong>Class:</strong> {visibleDetails.class}</p>
              <p><strong>Phone:</strong> {visibleDetails.parentPhone}</p>
              <p><strong>Date of Birth:</strong> {visibleDetails.dob?.split('T')[0]}</p>
              <p><strong>Address:</strong> {visibleDetails.address}</p>
              <p><strong>Gender:</strong> {visibleDetails.gender}</p>
              <p><strong>Religion:</strong> {visibleDetails.religion}</p>
              <p><strong>Nationality:</strong> {visibleDetails.nationality}</p>
              <p><strong>Caste:</strong> {visibleDetails.caste}</p>
              <p><strong>Blood Group:</strong> {visibleDetails.bloodGroup}</p>
              <p>
                <strong>Applied On:</strong>{' '}
                {visibleDetails.appliedDate?.split?.('T')?.[0] ||
                  visibleDetails.requestedAt?.split?.('T')?.[0] ||
                  '-'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingStudents;
