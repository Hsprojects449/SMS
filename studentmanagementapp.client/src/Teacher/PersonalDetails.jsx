import React, { useEffect, useState } from "react";

const TeacherDetails = ({teacherData}) => {
    const [details, setDetails] = useState();

    useEffect(() => {
        setDetails(teacherData);
    }, [teacherData]);

    return (
        <div className="p-6">
            <h2 className="relative text-2xl font-bold text-black mb-4 flex items-center gap-2 drop-shadow-lg">
                Your details
                <span className="absolute -bottom-1 left-0 w-24 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded"></span>
            </h2>
            <div className="bg-white/90 backdrop-blur-md text-black p-8 rounded-2xl shadow-2xl hover:shadow-orange-200 hover:-translate-y-1 transition-all duration-300 w-full max-w-2xl mx-auto hover:border-2 border border-orange-300">
                {details && (
                    <div className="space-y-3">
                        {Object.entries(details).map(([key, val]) => (
                            <div key={key} className="text-sm flex flex-wrap gap-2 items-center">
                                <span className="font-semibold capitalize text-orange-600">
                                    {key.replace(/([A-Z])/g, " $1")}: 
                                </span>
                                <span className="text-slate-700">{val}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherDetails;