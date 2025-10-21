import React, { useEffect, useState } from "react";
import {
    MdClose,
    MdCheckCircle,
    MdErrorOutline,
    MdRemoveRedEye,
} from "react-icons/md";
import axios from 'axios';

const Syllabus = ({studentData}) => {
    const [studentClass, setStudentClass] = useState("02");
    const [syllabusList, setSyllabusList] = useState([]);
    const [activeFile, setActiveFile] = useState(null);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState("success");

    useEffect(() => {
        axios.get(`https://schoolapi.vsngroups.com/api/Syllabus/Class/${studentData['classID']}`)
            .then(response => {
                setSyllabusList(response.data);
            })
            .catch(error => {
                console.error('Subjects fetching data:', error);
            });
    }, []);

    const handleView = (fileUrl) => {
        if (!fileUrl) {
            setMessage("Syllabus Not Added Yet.");
            setMessageType("error");
            setTimeout(() => setMessage(null), 3000);
            return;
        }
        setActiveFile(fileUrl);
    };

    const handleClose = () => {
        setActiveFile(null);
    };

    return (
        <div>
            <h2 className="relative text-2xl font-bold text-black mb-4 flex items-center gap-2 drop-shadow-lg">
                Syllabus for Class {studentData['class']}
                <span className="absolute -bottom-1 left-0 w-23 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded"></span>
            </h2>
            <div className="px-8 py-10">
                <div className="max-w-5xl mx-auto space-y-8">
                    {message && (
                        <div
                            className={`flex items-center gap-3 px-4 py-3 rounded-md shadow text-white text-sm font-medium ${messageType == "success" ? "bg-green-500" : "bg-red-500"}`}
                        >
                            {messageType == "success" ? <MdCheckCircle /> : <MdErrorOutline />}
                            <span>{message}</span>
                        </div>
                    )}

                    <div>
                        <div className="rounded-2xl shadow-2xl p-4 hover:border-2 border border-orange-300 bg-white/90 text-black backdrop-blur-md hover:shadow-orange-200 hover:-translate-y-1 transition-all duration-200">
                            <table className="min-w-full text-left rounded-lg overflow-hidden">
                                <thead>
                                    <tr className="bg-orange-100">
                                        <th className="p-3 text-sm font-medium rounded-tl-lg">
                                            Subject
                                        </th>
                                        <th className="p-3 text-sm font-medium text-center rounded-tr-lg">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {syllabusList.length == 0 ? (
                                        <tr>
                                            <td colSpan={2} className="p-4 text-center text-gray-400">
                                                No syllabus available.
                                            </td>
                                        </tr>
                                    ) : (
                                        syllabusList.map((subj) => (
                                            <tr key={subj.syllabusID} className="border-t border-orange-300">
                                                <td className="p-3">{subj.name}</td>
                                                <td className="p-3 text-center">
                                                    <button
                                                        title="View"
                                                        onClick={() => handleView(subj?.subjectSyllabus)}
                                                        className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1 rounded cursor-pointer"
                                                        aria-label="View"
                                                    >
                                                        <MdRemoveRedEye className="text-xl" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {activeFile && (
                        <div className="border border-orange-300 rounded-xl shadow-lg bg-white p-4">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-semibold text-black">
                                    Syllabus Preview
                                </h3>
                                <button
                                    onClick={handleClose}
                                    className="text-red-400 hover:text-red-600 flex items-center gap-1 font-medium"
                                >
                                    <MdClose className="text-xl" /> Close Preview
                                </button>
                            </div>
                            <iframe
                                title="Syllabus Viewer"
                                src={`https://schoolapi.vsngroups.com/files/syllabus/${activeFile}`}
                                className="w-full h-[600px] rounded-lg bg-white"
                                frameBorder="0"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Syllabus;