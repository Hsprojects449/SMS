import React, { useEffect, useRef, useState } from 'react';
import { MdCheckCircle, MdErrorOutline } from 'react-icons/md';
import { Pencil, Save, Trash2, PlusCircle, BookOpen } from 'lucide-react';
import axios from 'axios';

const Subjects = () => {
    const topRef = useRef(null);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [removedSubjects, setRemovedSubjects] = useState([]);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('success');
    const [editMode, setEditMode] = useState({});
    const [editedSubjects, setEditedSubjects] = useState([]);

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
            const ClassName = classes.find(cls => cls.name == selectedClass)?.classID;
            axios.get(`https://schoolapi.vsngroups.com/api/Syllabus/Class/${ClassName}`)
            .then(response => {
                const SubjectList = response.data.map((sub) => sub.name);
                setSubjects(response.data);
                setEditedSubjects(SubjectList.map(name => ({ name })));
                setEditMode({});
            })
            .catch(error => {
                console.error('Classes fetching data:', error);
            });
        } else {
            setSubjects([])
            setEditedSubjects([]);
        }
    }, [selectedClass]);

    const showMessage = (text, type = 'success') => {
        setMessage(text);
        setMessageType(type);
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleAddSubject = () => {
        const newSub = { name: '' };
        setEditedSubjects(prev => [...prev, newSub]);
        setSubjects(prev => [...prev, {name: newSub.name, mode: 'new'}])
        setEditMode(prev => ({ ...prev, [editedSubjects.length]: true }));
    };

    const handleEditChange = (index, value) => {
        const updated = [...editedSubjects];
        updated[index].name = value;
        setEditedSubjects(updated);
        setSubjects(subjects.map((item, i) => i == index ? { ...item, name: value, ...(item.mode == 'new' ? {} : { mode: 'edit' }) } : item));
    };

    const handleToggleEdit = (index) => {
        setEditMode(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const handleDeleteSubject = (index) => {
        const updated = [...editedSubjects];
        updated.splice(index, 1);
        setEditedSubjects(updated);
        setRemovedSubjects(prev => [...prev, subjects[index]]);
        setSubjects(subjects.filter((_, i) => i != index));
        showMessage('Subject removed');
    };

    const hasDuplicateNames = () => {
        const seen = new Set();
        return subjects
            .map(s => s.name?.trim()?.toLowerCase())
            .filter(Boolean)
            .some(name => {
                if (seen.has(name)) return true;
                seen.add(name);
                return false;
            });
    };

    const hasEmptyOrNullNames = () => {
        return subjects.some(s => !s.name?.trim());
    };

    const handleSaveSubjects = () => {
        if (hasDuplicateNames()) {
            showMessage(`Duplicate subject names found!`, 'error');
            return;
        }
        if (hasEmptyOrNullNames()) {
            showMessage(`Empty subject names found!`, 'error');
            return;
        }
        subjects.map(x => {
            if (x.mode == 'edit'){
                axios.put(`https://schoolapi.vsngroups.com/api/Syllabus/${x.syllabusID}`,x)
                .then(response => {
                })
                .catch(error => {
                    console.error('Error Saving the subjects', error);
                    showMessage(`Error Saving Subjects ${error}`,'error');
                    return
                });}
            if (x.mode == 'new'){
                const classID = classes.find(x => x.name == selectedClass)?.classID;
                const newSubject = {
                    classID: classID,
                    name: x.name,
                    subjectSyllabus: null,
                    createdAt: new Date().toISOString()
                };
                axios.post(`https://schoolapi.vsngroups.com/api/Syllabus`, newSubject)
                    .then(response => {
                        const updatedSubjects = subjects.map(subject =>
                            subject.name == newSubject.name ? response.data : subject
                        );
                        setSubjects(updatedSubjects);
                    })
                    .catch(error => {
                        console.error('Error Saving the subjects', error);
                        showMessage(`Error Saving Subjects ${error}`, 'error');
                    });
                ;
            }
        }
          );
        removedSubjects.map(y => {
            if (!y.mode || y.mode == 'edit'){
                axios.delete(`https://schoolapi.vsngroups.com/api/Syllabus/${y.syllabusID}`)
                .then(response => {
                    setRemovedSubjects([])
                })
                .catch(error => {
                    console.error('Error Saving the subjects', error);
                    showMessage(`Error Saving Subjects ${error}`,'error');
                    return
                });}
        })
        setEditMode({});
        showMessage(`Subjects for the Class - ${selectedClass} saved successfully`);
    };

    return (
        <div>
        <h2 className="relative text-2xl font-bold text-black mb-4 flex items-center gap-2 drop-shadow-lg">
            Manage Subjects
            <span className="absolute -bottom-1 left-0 w-24 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded"></span>
        </h2>
        <div ref={topRef} className="p-6 space-y-6">
            {message && (
                <div className={`flex items-center gap-3 px-4 py-3 rounded-md shadow-md text-white text-sm font-medium ${messageType == 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {messageType == 'success' ? <MdCheckCircle className="text-xl" /> : <MdErrorOutline className="text-xl" />}
                    <span>{message}</span>
                </div>
            )}

            {/* Dropdown + Add Button */}
            <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <label className="font-medium text-black">Select Class:</label>
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="bg-transparent text-black border border-orange-400 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
                    >
                            <option value="" disabled className="bg-white text-black">
                                -- Select Class --
                            </option>
                        {classes.map(cls => (
                            <option key={cls.name} value={cls.name} className="bg-white text-black">
                                {cls.name}
                            </option>
                        ))}
                    </select>
                </div>
                {selectedClass && (
                    <button
                        onClick={handleAddSubject}
                        className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:brightness-110 text-white px-4 py-2 rounded flex items-center gap-2 shadow cursor-pointer"
                    >
                        <PlusCircle size={18} /> Add Subject
                    </button>
                )}
            </div>

            {/* Subjects Table */}
            <div className="bg-white text-black border border-orange-300 rounded-lg p-4 shadow mt-4">
                <h3 className="text-lg font-semibold mb-2">Subjects for the Class - {selectedClass || "..."}</h3>
                <div className="overflow-x-auto border border-orange-300 rounded-lg">
                    <table className="min-w-full text-left rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-orange-100">
                            <th className="p-2">Subject Name</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {editedSubjects.length == 0 ? (
                            <tr className="border-t border-orange-300">
                                <td colSpan="2" className="p-2 text-gray-400">No subjects available</td>
                            </tr>
                        ) : (
                            editedSubjects.map((subj, index) => (
                                <tr key={index} className="border-t border-orange-300">
                                    <td className="p-2">
                                        {editMode[index] ? (
                                            <input
                                                placeholder="Enter Subject Name"
                                                className="bg-orange-100 text-black border border-orange-300 px-2 py-1 rounded w-full"
                                                value={subj.name}
                                                onChange={e => handleEditChange(index, e.target.value)}
                                            />
                                        ) : (
                                                <span className="text-black">{subj.name}</span>
                                        )}
                                    </td>
                                    <td className="p-2 flex gap-2">
                                        {editMode[index] ? (
                                            <button
                                                title = "Save" 
                                                onClick={() => handleToggleEdit(index)}
                                                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded cursor-pointer"
                                            >
                                                <Save size={16} />
                                            </button>
                                        ) : (
                                            <button
                                                title = "Edit" 
                                                onClick={() => handleToggleEdit(index)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded cursor-pointer"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                        )}
                                        <button
                                            title = "Delete" 
                                            onClick={() => handleDeleteSubject(index)}
                                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded cursor-pointer"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                </div>

                {selectedClass && (
                    <div className="text-right mt-4">
                        <button
                            onClick={handleSaveSubjects}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
                        >
                            <Save size={16} /> Save Subjects
                        </button>
                    </div>
                )}
            </div>
            </div>
        </div>
    );
};

export default Subjects;