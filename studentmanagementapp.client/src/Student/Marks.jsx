import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Marks = ({studentData}) => {
    const [tableData, setTableData] = useState([]);
    const [marksJson, setMarksJson] = useState('');
    const [examHeaders, setExamHeaders] = useState([]);

    useEffect(() => {
        if (!studentData['studentID']) return;
        axios.get(`https://schoolapi.vsngroups.com/api/Marks/student/${studentData['studentID']}`)
            .then(response => {
                setMarksJson(response.data) 
            })
            .catch(error => {
                console.error('Classes fetching data:', error);
            });
    }, [studentData['studentID']]);

    useEffect(() => {
        if (!marksJson) return;
        try {
            if (!marksJson || marksJson.length === 0) return;
            const examHeaders = [...new Set(marksJson.map(item => item.examName))];
            setExamHeaders(examHeaders);
            const studentsMap = {};
            marksJson.forEach(item => {
                const key = item.studentID + "_" + item.syllabus;
                if (!studentsMap[key]) {
                    studentsMap[key] = {
                        studentName: item.name,
                        class: item.class,
                        subject: item.syllabus
                    };
                }
                studentsMap[key][item.examName] = item.marksObtained;
            });

            setTableData(Object.values(studentsMap));
        } catch (error) {
            console.error('Error parsing marks JSON:', error);
        }
    }, [marksJson]);

    return (
        <div>
            <h2 className="relative text-2xl font-bold text-black mb-4 flex items-center gap-2 drop-shadow-lg">
                Your Marks
                <span className="absolute -bottom-1 left-0 w-20 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded"></span>
            </h2>
            <div className="px-8 py-10">
                <div className="max-w-5xl mx-auto space-y-8">
                    <div>
                        <div className="rounded-2xl shadow-2xl p-4 hover:border-2 border border-orange-300 bg-white/90 text-black backdrop-blur-md hover:shadow-orange-200 hover:-translate-y-1 transition-all duration-200">
                            <table className="min-w-full text-left rounded-lg overflow-hidden">
                                <thead>
                                    <tr className="bg-orange-100">
                                        <th className="p-3 text-sm font-medium rounded-tl-lg">Subject</th>
                                        {examHeaders.map((exam, idx) => (
                                            <th key={idx} className="p-3 text-sm font-medium text-center">{exam}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map((row, idx) => (
                                        <tr key={idx} className="border-t border-orange-300">
                                            <td className="p-3 font-medium">{row.subject}</td>
                                            {examHeaders.map((exam, i) => (
                                                <td key={i} className="p-3 text-center">{row[exam] || '-'}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Marks;
