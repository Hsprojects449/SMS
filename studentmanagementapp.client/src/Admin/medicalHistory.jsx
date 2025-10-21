import React, { useState, useEffect } from "react";
import Pagination from "../Common/Pagination";
import { FiUpload, FiDownload, FiEye } from "react-icons/fi";
import axios from 'axios';

const MedicalHistory = () => {
    const [selectedClass, setSelectedClass] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [classList, setClassList] = useState([]);
    const [students, setStudents] = useState([]);
    const itemsPerPage = 5;

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
            axios.get(`https://schoolapi.vsngroups.com/api/Student/class/${selectedClass}`)
                .then(response => {
                    Array.isArray(response.data) ? setStudents(response.data) : setStudents([response.data]);
                    const ClassMarks = classList.find(cls => cls.classID == selectedClass)?.marks;
                    setMarks(JSON.parse(ClassMarks))
                })
                .catch(error => {
                    console.error('Error fetching Students data:', error);
            });
        }
    }, [selectedClass]);

    const handleClassChange = (e) => {
        setSelectedClass(e.target.value);
        setCurrentPage(1);
    };

    const handleUpload = (e, studentID) => {
        const file = e.target.files[0];
        if (!file) return;

        const maxSizeInMB = 2;
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

        if (file != null && file.size > maxSizeInBytes) {
            alert("File size exceeds 2MB limit.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        axios.put(`https://schoolapi.vsngroups.com/api/Student/MedicalRecord/${studentID}`, formData)
        .then(res => {
            setStudents(prev =>
                prev.map(s =>
                  s.studentID == studentID ? { ...s, medicalRecordPath: res.data } : s
                )
              );
            alert(`Succesfully uploaded file: ${file.name} for Roll No ${studentID}`);
        })
    };

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentStudents = students.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(students.length / itemsPerPage);

    return (
        <div>
            <h2 className="relative text-2xl font-bold text-black mb-4 flex items-center gap-2 drop-shadow-lg">
                Medical History
                <span className="absolute -bottom-1 left-0 w-24 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded"></span>
            </h2>

            <div className="p-6 space-y-6 text-black">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="classSelect" className="block font-medium mb-1 text-black">
                            Select Class:
                        </label>
                        <select
                            id="classSelect"
                            value={selectedClass}
                            onChange={handleClassChange}
                            className="bg-transparent text-black border border-orange-400 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
                        >
                            <option value="">-- Select Class --</option>
                            {classList.map((cls) => (
                                <option
                                    key={cls.classID}
                                    value={cls.classID}
                                    className="bg-white text-black"
                                >
                                    {cls.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="bg-white text-black border border-orange-300 rounded-lg p-4 shadow mt-4">
                    <h3 className="text-lg font-semibold mb-4">
                        {selectedClass
                            ? `Class ${selectedClass} Medical History`
                            : "Medical History Records"}
                    </h3>
                    <div className="overflow-x-auto border border-orange-300 rounded-lg">
                        <table className="min-w-full text-left rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-orange-100">
                                    <th className="p-2">Roll No</th>
                                    <th className="p-2">Student Name</th>
                                    <th className="p-2">Medical History</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentStudents.length > 0 ? (
                                    currentStudents.map((student, index) => (
                                        <tr key={index} className="border-t border-orange-300">
                                            <td className="p-2">{student.studentID}</td>
                                            <td className="p-2">{student.name}</td>
                                            <td className="p-2">
                                                {student.medicalRecordPath && student.medicalRecordPath != 'NA' ? (
                                                    <div className="flex gap-2 items-center">
                                                        <a
                                                            href={`https://schoolapi.vsngroups.com/files/medicalRecord/${student.medicalRecordPath}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-1 text-sm cursor-pointer"
                                                        >
                                                            <FiEye /> View
                                                        </a>
                                                        <label className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm cursor-pointer">
                                                            <FiUpload /> Update
                                                            <input
                                                                type="file"
                                                                accept=".pdf"
                                                                onChange={(e) => handleUpload(e, student.studentID)}
                                                                className="hidden"
                                                            />
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <label className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-1 text-sm cursor-pointer w-fit">
                                                        <FiUpload />
                                                        <span className="text-sm">Upload</span>
                                                        <input
                                                            type="file"
                                                            accept=".pdf"
                                                            className="hidden"
                                                            onChange={(e) => handleUpload(e, student.studentID)}
                                                        />
                                                    </label>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="3"
                                            className="text-center text-gray-400 text-lg py-4 italic"
                                        >
                                            {selectedClass
                                                ? "No medical records found for this class."
                                                : "Please select a class to view the medical history."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination below the table */}
                    {students.length > itemsPerPage && (
                        <div className="mt-4 flex justify-center">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MedicalHistory;