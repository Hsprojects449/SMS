import React, { useEffect, useRef, useState } from "react";
import {
    MdRemoveRedEye,
    MdCheckCircle,
    MdErrorOutline,
} from "react-icons/md";
import axios from 'axios';

const Syllabus = ({ teacherData }) => {
    const [assignedSubjects, setAssignedSubjects] = useState([]);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState("success");
    const topRef = useRef(null);

    useEffect(() => {
        if (teacherData['assignedClass']) {
            axios.get(`https://schoolapi.vsngroups.com/api/Syllabus/Class/${teacherData['assignedClass']}`)
                .then(response => {
                    setAssignedSubjects(response.data);
                })
                .catch(error => {
                    console.error('Subjects fetching data:', error);
                });
        }
    }, []);

    const showMessage = (text, type = "success") => {
        setMessage(text);
        setMessageType(type);
        topRef.current?.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div>
            <h2 className="relative text-2xl font-bold text-black mb-4 flex items-center gap-2 drop-shadow-lg">
                Syllabus of Class {teacherData.assignedClassName}
                <span className="absolute -bottom-1 left-0 w-24 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded"></span>
            </h2>
            <div className="p-6 space-y-6" ref={topRef}>
                {message && (
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-md shadow-md text-white text-sm font-medium ${messageType == "success" ? "bg-green-500" : "bg-red-500"}`}>
                        {messageType == "success" ? (
                            <MdCheckCircle className="text-xl" />
                        ) : (
                            <MdErrorOutline className="text-xl" />
                        )}
                        <span>{message}</span>
                    </div>
                )}
                {teacherData['assignedClass'] && assignedSubjects.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {assignedSubjects.map((subject) => (
                            <div
                                key={subject.name}
                                className="bg-white/90 backdrop-blur-md text-black hover:border-2 border border-orange-300 rounded-2xl p-6 space-y-4 shadow-2xl hover:shadow-orange-200 hover:-translate-y-1 transition-all duration-300"
                            >
                                <h3 className="text-xl font-semibold border-b border-orange-300 pb-2">
                                    {subject.name}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {subject.subjectSyllabus && (
                                        <button
                                            onClick={() => window.open(`https://schoolapi.vsngroups.com/files/syllabus/${subject.subjectSyllabus}`, '_blank', 'noreferrer')}
                                            className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-1 rounded flex items-center gap-2 cursor-pointer"
                                        >
                                            <MdRemoveRedEye /> View
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    teacherData['assignedClass'] ? (
                        <div className="text-gray-400 text-center mt-8">
                            No subjects assigned.
                        </div>
                    ) : (
                        <div className="text-gray-400 text-center mt-8">No class assigned yet.</div>
                    )
                )}
            </div>
        </div>
    );
};

export default Syllabus;
