import React, { useEffect, useRef, useState } from 'react';
import {
    MdCheckCircle, MdErrorOutline, MdEdit, MdDelete,
    MdSave, MdClose, MdAttachFile
} from 'react-icons/md';
import axios from 'axios';

const Noticeboard = () => {
    const [notices, setNotices] = useState([]);
    const [newNotice, setNewNotice] = useState('');
    const [editOccuring, setEditOccuring] = useState('');
    const [newOccuring, setNewOccuring] = useState('');
    const [newFile, setNewFile] = useState(null);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('success');
    const [editId, setEditId] = useState(null);
    const [editText, setEditText] = useState('');
    const [editFile, setEditFile] = useState(null);
    const [editFileName, setEditFileName] = useState('');
    const topRef = useRef(null);
    const maxSizeInMB = 2;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    useEffect(() => {
        axios.get(`https://schoolapi.vsngroups.com/api/Notice`)
        .then(response => {
            Array.isArray(response.data) ? setNotices(response.data) : setNotices([response.data]);
        })
        .catch(error => {
            console.error('Error fetching Notice data:', error);
        });
    }, []);

    const showMessage = (text, type = 'success') => {
        setMessage(text);
        setMessageType(type);
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => setMessage(null), 3000);
    };
    
    const handlePostNotice = () => {
        if (newFile != null && newFile.size > maxSizeInBytes) {
            alert("File size exceeds 2MB limit.");
            return;
        }

        if (!newNotice.trim()) {
            showMessage('Notice cannot be empty.', 'error');
            return;
        }
        const today = new Date().toISOString().split('T')[0];
        const formData = new FormData();
        formData.append('file', newFile);
        formData.append('title', newNotice.trim());
        formData.append('description', newNotice.trim());
        formData.append('occurance', newOccuring);
        formData.append('createdAt', today); // if `today` is Date, convert to string

        axios.post('https://schoolapi.vsngroups.com/api/Notice', formData)
        .then(response => {
            setNotices([{...response.data}, ...notices]);
            setNewNotice('');
            showMessage('Notice posted successfully.');
            setNewFile(null);
            setNewOccuring('')
        })
        .catch(error => {
            console.error('Error Posting Notice data:', error);
        });
    };

    const handleEdit = (id, description, fileName, fileUrl, occurance) => {
        setEditId(id);
        setEditText(description);
        fileUrl && setEditFileName(fileUrl);
        setEditFile(null);
        setEditOccuring(occurance?.split('T')[0] || '');
    };

    const handleDelete = (id) => {
        axios.delete(`https://schoolapi.vsngroups.com/api/Notice/${id}`)
        .then(response => {
            setNotices(notices.filter(n => n.noticeID != id));
            showMessage('Notice deleted successfully.');
        })
        .catch(error => {
            console.error('Error Deleting Notice data:', error);
        });
    };

    const handleSaveEdit = (id) => {
        if (editFile != null && editFile.size > maxSizeInBytes) {
            alert("File size exceeds 2MB limit.");
            return;
        }
        if (!editText.trim()) {
            showMessage('Notice cannot be empty.', 'error');
            return;
        }
        const today = new Date().toISOString().split('T')[0];
        const formData = new FormData();
        formData.append('noticeID', id);
        formData.append('file', editFile);
        formData.append('title', editText);
        formData.append('description', editText);
        formData.append('occurance', editOccuring);
        formData.append('noticeContent', editFileName);
        formData.append('createdAt', today);
        axios.put(`https://schoolapi.vsngroups.com/api/Notice/${id}`, formData)
        .then(response => {
            setNotices(notices.map(n => n.noticeID == id ? { ...n, description: editText, noticeContent: response.data.noticeContent, occurance: editOccuring } : n));
            setEditId(null);
            setEditText('');
            showMessage('Notice updated successfully.');
        })
        .catch(error => {
            console.error('Error Editing Notice data:', error);
        });
    };

    return (
        <div>
            <h2 className="relative text-2xl font-bold text-black mb-4 flex items-center gap-2 drop-shadow-lg">
                Manage Noticeboard
                <span className="absolute -bottom-1 left-0 w-24 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded"></span>
            </h2>
            <div ref={topRef} className="p-6 space-y-6">
                {message && (
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-md shadow-md text-white text-sm font-medium ${messageType == 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {messageType == 'success' ? <MdCheckCircle className="text-xl" /> : <MdErrorOutline className="text-xl" />}
                        <span>{message}</span>
                    </div>
                )}

                <div className="bg-white text-black p-6 border border-orange-300 rounded-lg shadow">
                    <textarea
                        rows="4"
                        value={newNotice}
                        onChange={(e) => setNewNotice(e.target.value)}
                        placeholder="Write your notice here..."
                        className="bg-white border border-orange-300 rounded px-4 py-2 w-full resize-none text-black placeholder-gray-400"
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <label className="text-sm text-black">Occuring Date:</label>
                        <input
                            type="date"
                            className="bg-transparent border border-orange-300 rounded px-1 py-1 text-black cursor-pointer"
                            value={newOccuring}
                            onChange={(e) => setNewOccuring(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                    <label className="w-fit hover:text-black flex items-center gap-2 cursor-pointer underline text-orange-400 transition">
                        <MdAttachFile />
                        <input
                            type="file"
                            accept=".pdf, .jpeg, .jpg, .png"
                            onChange={(e) => setNewFile(e.target.files[0])}
                            className="hidden"
                        />
                        {newFile ? newFile.name : 'Attach a document (optional)'}
                    </label>
                    <div className="text-right">
                        <button
                            onClick={handlePostNotice}
                            className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:brightness-110 text-white px-6 py-2 rounded shadow font-medium cursor-pointer"
                        >
                            Post Notice
                        </button>
                    </div>
                </div>

                <h2 className="text-xl font-semibold text-black mt-6">Latest Notices</h2>
                <div className="space-y-4">
                    {notices.map((notice) => (
                        <div key={notice.noticeID} className="flex bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl hover:shadow-orange-200 hover:-translate-y-1 transition-all duration-300 overflow-hidden hover:border-2 border border-orange-300">
                            {/* Gradient left border */}
                            <div className="w-1 bg-gradient-to-b from-orange-400 to-yellow-400"></div>
                            <div className="flex-1 p-4 relative">
                                {editId == notice.noticeID ? (
                                    <>
                                        <textarea
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            rows="3"
                                            className="bg-white border border-orange-300 rounded px-3 py-2 w-full resize-none text-black"
                                        />
                                        <div className="flex justify-between mt-3 items-center gap-2">
                                          <label className="text-sm text-black flex items-center gap-2">Occuring Date:
                                            <input
                                              type="date"
                                              className="bg-transparent border border-orange-300 rounded px-1 py-1 text-black cursor-pointer"
                                              value={editOccuring}
                                              min={new Date().toISOString().split('T')[0]}
                                              onChange={(e) => setEditOccuring(e.target.value)}
                                            />
                                          </label>
                                            <label className="text-orange-400 flex items-center gap-2 cursor-pointer underline hover:text-black transition">
                                                <MdAttachFile />
                                                <input
                                                    type="file"
                                                    accept=".pdf, .jpeg, .jpg, .png"
                                                    className="hidden"
                                                    onChange={(e) => setEditFile(e.target.files[0])}
                                                />
                                                {editFile ? editFile.name : editFileName || 'Attach file'}
                                                <button
                                                    title = "Remove" 
                                                    onClick={() => { setEditFile(null), setEditFileName('') }}
                                                    className="text-red-400 hover:text-red-600"
                                                >
                                                    <MdClose className="text-xl" />
                                                </button>
                                            </label>
                                            <div className="flex gap-3">
                                                <button
                                                    title = "Save" 
                                                    onClick={() => handleSaveEdit(notice.noticeID)}
                                                    className="text-green-400 hover:text-green-600 cursor-pointer"
                                                >
                                                    <MdSave className="text-xl" />
                                                </button>
                                                <button
                                                    title = "Exit Editing" 
                                                    onClick={() => {
                                                        setEditId(null);
                                                        setEditText('');
                                                        setEditFile(null);
                                                        setEditFileName('');
                                                    }}
                                                    className="text-red-400 hover:text-red-600 cursor-pointer"
                                                >
                                                    <MdClose className="text-xl" />
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-black text-md font-semibold">{notice.description}</p>
                                        {notice.noticeContent && (
                                            <p className="text-xs text-black mt-2">
                                                Document: <a href={`https://schoolapi.vsngroups.com/files/notices/${notice.noticeContent}`} target="_blank" rel="noreferrer" className="underline text-sm text-orange-400 font-semibold hover:text-black">{notice.title}</a>
                                            </p>
                                        )}
                                        {notice.occurance && (<p className="text-xs text-black mt-2">Occuring on: {notice.occurance.split('T')[0]}</p>)}
                                        <p className="text-xs text-black mt-2">Posted on: {notice.createdAt.split('T')[0]}</p>
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            <button
                                                title = "Edit" 
                                                onClick={() =>
                                                    handleEdit(
                                                        notice.noticeID,
                                                        notice.description,
                                                        notice.title,
                                                        notice.noticeContent,
                                                        notice.occurance,
                                                    )
                                                }
                                                className="text-blue-400 hover:text-blue-600 cursor-pointer"
                                            >
                                                <MdEdit />
                                            </button>
                                            <button
                                                title = "Delete" 
                                                onClick={() => handleDelete(notice.noticeID)}
                                                className="text-red-500 hover:text-red-700 cursor-pointer"
                                            >
                                                <MdDelete />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Noticeboard;