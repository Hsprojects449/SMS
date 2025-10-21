import React, { useState, useEffect, useRef } from 'react';
import { MdDelete, MdSave, MdCheckCircle, MdErrorOutline, MdClose } from 'react-icons/md';
import { PlusCircle } from 'lucide-react';
import axios from 'axios';

const defaultClasses = [
    'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'
];

const Classes = () => {
    const topRef = useRef(null);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('success');
    const [classes, setClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [showAddBox, setShowAddBox] = useState(false);
    const [newClassName, setNewClassName] = useState('');
    const [teacherList, setTeacherList] = useState([]);
    const [selectedTeacherId, setSelectedTeacherId] = useState();

    useEffect(() => {
        axios.get('https://schoolapi.vsngroups.com/api/Class')
        .then(response => {
            setClasses(response.data);
        })
        .catch(error => {
            console.error('Error fetching class data:', error);
        });

        axios.get('https://schoolapi.vsngroups.com/api/Teacher')
        .then(response => {
            setTeacherList(response.data);
        })
        .catch(error => {
            console.error('Error fetching Teachers data:', error);
        });
    }, []);

    const scrollToTop = () => {
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const showMessage = (text, type = 'success') => {
        setMessage(text);
        setMessageType(type);
        scrollToTop();
        setTimeout(() => setMessage(null), 3000);
    };

    const handleAddClass = async () => {
        if (!newClassName.trim()) {
            showMessage('Class name is required', 'error');
            return;
        }
        const newClass = {
            // schoolID: 1,
            name: newClassName.trim(),
            // section: "",
            createdAt: new Date().toISOString()
        };
        axios.post('https://schoolapi.vsngroups.com/api/Class', newClass)
        .then(response => {
            setClasses([...classes, response.data]);
        })
        .catch(error => {
            console.error('Error fetching class data:', error);
        });
        setClasses([...classes, newClass]);
        setShowAddBox(false);
        setNewClassName('');
        showMessage(`Class "${newClass.name}" added successfully!`);
    };

    const handleSave = async (id) => {
        const updatedClass = classes.find(cls => cls.classID == id);
        axios.put(`https://schoolapi.vsngroups.com/api/Class/${id}`, {...updatedClass, teacherID:selectedTeacherId ? selectedTeacherId : null})
        .then(response => {
            setClasses(prev => prev.map(cls => cls.classID == id ? { ...cls, ...updatedClass } : cls));
            showMessage(`Class "${updatedClass.name}" saved successfully!`, 'success');
        })
        .catch(error => {
            showMessage(`Failed to save class "${updatedClass.name}".`, 'error');
        });
    };

    const handleDelete = async (id) => {
        const classToDelete = classes.find(cls => cls.classID == id);
        const confirmDelete = window.confirm(`Are you sure you want to delete class "${classToDelete.name}"?`);
        if (!confirmDelete) return;
        axios.delete(`https://schoolapi.vsngroups.com/api/Class/${id}`)
        .then(response => {
            setClasses(classes.filter(cls => cls.classID != id));
            showMessage(`Class "${classToDelete.name}" deleted successfully!`, 'success');
            if (id == selectedClassId) setSelectedClassId(0)
        })
        .catch(error => {
            showMessage(`Failed to delete class "${classToDelete.name}".`, 'error');
        });
    };

    const handleFieldChange = (id, field, value) => {
        setClasses(classes.map(cls =>
            cls.classID == id ? { ...cls, [field]: value } : cls
            // cls.id == id ? { ...cls, [field]: field == 'totalStudents' ? parseInt(value) || 0 : value } : cls
        ));
    };

    const sortedClasses = [...classes].sort((a, b) => defaultClasses.indexOf(a.name) - defaultClasses.indexOf(b.name));

    return (
        <div>
        <h2 className="relative text-2xl font-bold text-black mb-4 flex items-center gap-2 drop-shadow-lg">
    Manage Classes
    <span className="absolute -bottom-1 left-0 w-24 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded"></span>
</h2>
<div ref={topRef} className="p-6 space-y-6">
    {message && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-md shadow-md text-white text-sm font-medium ${messageType == 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            {messageType == 'success' ? <MdCheckCircle className="text-xl" /> : <MdErrorOutline className="text-xl" />}
            <span>{message}</span>
        </div>
    )}
    <div className="flex justify-end">
        <button
            onClick={() => {
                setShowAddBox(true);
                setSelectedClassId(null);
            }}
            className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:brightness-110 text-white px-4 py-2 rounded flex items-center gap-2 shadow cursor-pointer"
        >
            <PlusCircle size={18} /> Add Class
        </button>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
        {sortedClasses.map((cls) => (
            <div
                key={cls.classID}
                onClick={() => {
                    setSelectedClassId(cls.classID);
                    setShowAddBox(false);
                }}
                className="cursor-pointer bg-white/90 backdrop-blur-md text-black hover:border-2 border border-orange-300 rounded-2xl p-6 text-center shadow-2xl hover:shadow-orange-200 hover:-translate-y-1 transition-all duration-200 relative"
            >
                <span className="text-2xl font-bold">
                    {cls.name}
                </span>
                <button
                    title="Delete Class"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(cls.classID);
                    }}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                    <MdDelete />
                </button>
            </div>
        ))}
    </div>
    {showAddBox && (
        <div className="bg-white text-black p-6 border border-orange-300 rounded shadow-md space-y-4 mt-4 relative">
            <button
                title="Exit Addition of class"
                onClick={() => setShowAddBox(false)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-600 cursor-pointer"
            >
                <MdClose size={20} />
            </button>
            <h3 className="text-lg font-bold border-b border-orange-300 pb-2">Add New Class</h3>
            <div>
                <label className="block font-medium">Class Name</label>
                <input
                    placeholder="Enter Class Name"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    className="bg-white text-black border border-orange-300 px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
            </div>
            <div className="text-right">
                <button
                    title="Add the Class"
                    onClick={handleAddClass}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded flex items-center gap-2 cursor-pointer"
                >
                    <MdSave /> Save
                </button>
            </div>
        </div>
    )}
    {selectedClassId && (
        <div className="bg-white text-black p-6 border border-orange-300 rounded shadow-md space-y-4 mt-4 relative">
            <button
                title="Close"
                onClick={() => setSelectedClassId(null)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-600 cursor-pointer"
            >
                <MdClose size={20} />
            </button>
            <h3 className="text-lg font-bold border-b border-orange-300 pb-2">Edit Class Details</h3>
            {classes.filter(cls => cls.classID == selectedClassId).map(cls => (
                <div key={cls.classID} className="space-y-4">
                    <div>
                        <label className="block font-medium">Class Name</label>
                        <input
                            placeholder="Enter Class Name"
                            value={cls.name}
                            onChange={(e) => handleFieldChange(cls.classID, 'name', e.target.value)}
                            className="bg-white text-black border border-orange-300 px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Assigned Teacher</label>
                            <select
                                value={cls.teacherID || ""}
                                onChange={(e) => {
                                    const selectedId = e.target.value;
                                    // Check if teacher is already assigned to another class
                                    const alreadyAssigned = classes.some(c => c.teacherID == selectedId && c.classID != cls.classID);
                                    if (selectedId && alreadyAssigned) {
                                        showMessage('This teacher is already assigned to another class.', 'error');
                                        // Reset the value to blank
                                        setClasses(prev => prev.map(c => c.classID == cls.classID ? { ...c, teacherID: "" } : c));
                                        setSelectedTeacherId("");
                                        return;
                                    }
                                    setSelectedTeacherId(selectedId);
                                    setClasses(prev =>
                                      prev.map(c => c.classID == cls.classID ? { ...c, teacherID: selectedId } : c)
                                    );
                                  }}
                                className="bg-white text-black border border-orange-300 px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                            >
                                <option value="">-- Select Teacher --</option>
                                {teacherList.map((teach) => (
                                <option
                                    key={teach.teacherID}
                                    value={teach.teacherID}
                                    className="bg-white text-black"
                                >
                                    {teach.name}
                                </option>
                                ))}
                            </select>
                    </div>
                    {/* <div>
                        <label className="block font-medium">Total Students</label>
                        <input
                            type="number"
                            value={cls.totalStudents}
                            readOnly
                            className="bg-gray-100 text-black border border-orange-300 px-4 py-2 rounded w-full cursor-not-allowed"
                        />
                    </div> */}
                    <div className="text-right">
                        <button
                            onClick={() => handleSave(cls.classID)}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded flex items-center gap-2 cursor-pointer"
                        >
                            <MdSave /> Save
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )}
    </div>
</div>
    );
};

export default Classes;