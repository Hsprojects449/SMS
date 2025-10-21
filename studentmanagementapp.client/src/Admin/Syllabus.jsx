import React, { useEffect, useRef, useState } from 'react';
import {
    MdCloudUpload,
    MdDownload,
    MdRemoveRedEye,
    MdCheckCircle,
    MdErrorOutline
} from 'react-icons/md';
import axios from 'axios';

const Syllabus = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('success');
    const topRef = useRef(null);
    
    useEffect(() => {
        axios.get('https://schoolapi.vsngroups.com/api/Class')
        .then(response => {
            const ClassList = response.data.map((cls) => (cls.name));
            setClasses(response.data);
        })
        .catch(error => {
            console.error('Classes fetching data:', error);
        });
    }, []);

    useEffect(() => {
        if (selectedClass) {
            const ClassID = classes.find(cls => cls.name == selectedClass)?.classID;
            axios.get(`https://schoolapi.vsngroups.com/api/Syllabus/Class/${ClassID}`)
            .then(response => {
                setSubjects(response.data);
            })
            .catch(error => {
                console.error('Subjects fetching data:', error);
            });
        } else {
            setSubjects([])
        }
    }, [selectedClass]);

    const showMessage = (text, type = 'success') => {
        setMessage(text);
        setMessageType(type);
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleUpload = (id, file) => {
        const maxSizeInMB = 2;
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

        if (file != null && file.size > maxSizeInBytes) {
            alert("File size exceeds 2MB limit.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        axios.put(`https://schoolapi.vsngroups.com/api/Syllabus/SyllabusFile/${id}`, formData)
        .then(response => {
            showMessage(`Uploaded syllabus for Class - ${selectedClass}`);
            setSubjects(prev => prev.map(
                item => item.syllabusID == id ? { ...item, subjectSyllabus: response.data?.['uploadedFilePath'] } : item
              ));              
        })
        .catch(error => {
            console.error('Error Editing Notice data:', error);
        });
    };

    const handleDownload = (filename) => {
        const link = document.createElement('a');
        link.href = `https://schoolapi.vsngroups.com/files/syllabus/${filename}`;
        link.download = filename;
        link.click();
      };

    const handleView = (subjectName) => {
        showMessage(`Opened syllabus for ${subjectName} - ${selectedClass}`);
    };

    return (
        <div>
        <h2 className="relative text-2xl font-bold text-black mb-4 flex items-center gap-2 drop-shadow-lg">
            Manage Syllabus
            <span className="absolute -bottom-1 left-0 w-24 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded"></span>
        </h2>
        <div className="p-6 space-y-6" ref={topRef}>

            {message && (
                <div className={`flex items-center gap-3 px-4 py-3 rounded-md shadow-md text-white text-sm font-medium ${messageType == 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {messageType == 'success' ? <MdCheckCircle className="text-xl" /> : <MdErrorOutline className="text-xl" />}
                    <span>{message}</span>
                </div>
            )}
            <div className="flex gap-4 items-center">
                <label className="font-medium text-black">Select Class:</label>
                <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="bg-transparent text-black border border-orange-400 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
                >
                    <option value="" disabled className="bg-white text-black">-- Select Class --</option>
                    {classes.map(cls => (
                        <option key={cls.name} value={cls.name} className="bg-white text-black">
                            {cls.name}
                        </option>
                    ))}
                </select>
            </div>
            {selectedClass && subjects.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {subjects.map(subj => (
                        <div
                            key={subj.name} 
                            className="bg-white/90 backdrop-blur-md text-black p-6 space-y-4 rounded-2xl shadow-2xl hover:shadow-orange-200 hover:-translate-y-1 transition-all duration-300 w-full max-w-2xl mx-auto hover:border-2 border border-orange-300"
                        >
                            <h3 className="text-xl font-semibold border-b border-orange-300 pb-2">
                                {subj.name}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                <label
                                    className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded flex items-center gap-2"
                                >
                                    <MdCloudUpload /> Upload
                                    <input
                                        id={`upload-${subj.syllabusID}`}
                                        type="file"
                                        accept=".pdf"
                                        className="hidden"
                                        onChange={(e) => handleUpload(subj.syllabusID, e.target.files[0])}
                                    />
                                </label>
                                {subj.subjectSyllabus && (
                                    <button
                                        onClick={() => window.open(`https://schoolapi.vsngroups.com/files/syllabus/${subj.subjectSyllabus}`, '_blank', 'noreferrer')}
                                        className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-1 rounded flex items-center gap-2 cursor-pointer"
                                    >
                                        <MdRemoveRedEye /> View
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {!selectedClass && (
                <div className="text-gray-400 text-center mt-8">
                    Please select a class to view or manage syllabus.
                </div>
            )}
        </div>
        </div>
    );
};

export default Syllabus;