import React, { useEffect, useRef, useState } from 'react';
import { MdCheckCircle, MdErrorOutline } from 'react-icons/md';
import axios from 'axios';

const Noticeboard = () => {
    const [notices, setNotices] = useState([]);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('success');
    const topRef = useRef(null);

    useEffect(() => {
        axios.get(`https://schoolapi.vsngroups.com/api/Notice`)
        .then(response => {
            Array.isArray(response.data) ? setNotices(response.data) : setNotices([response.data]);
        })
        .catch(error => {
            console.error('Error fetching Notice data:', error);
            setMessage('Error loading Notices')
            setMessageType('Error')
        });
    }, []);

    return (
        <div>
            <h2 className="relative text-2xl font-bold text-black mb-4 flex items-center gap-2 drop-shadow-lg">
                Noticeboard
                <span className="absolute -bottom-1 left-0 w-24 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded"></span>
            </h2>
            <div ref={topRef} className="p-6 space-y-6">
                {message && (
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-md shadow-md text-white text-sm font-medium ${messageType == 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {messageType == 'success' ? <MdCheckCircle className="text-xl" /> : <MdErrorOutline className="text-xl" />}
                        <span>{message}</span>
                    </div>
                )}

                {notices.length == 0 ? (
                    <p className="text-gray-400">No notices available.</p>
                ) : (
                    <div className="space-y-4">
                        {notices.map((notice) => (
                            <div key={notice.noticeID} className="flex bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl hover:shadow-orange-200 hover:-translate-y-1 transition-all duration-300 overflow-hidden hover:border-2 border border-orange-300">
                                <div className="w-1 bg-gradient-to-b from-orange-400 to-yellow-400"></div>
                                <div className="flex-1 p-4">
                                    <p className="text-black text-md font-semibold">{notice.description}</p>
                                    {notice.noticeContent && (
                                        <p className="text-xs text-black mt-2">
                                            Document: <a href={`https://schoolapi.vsngroups.com/files/notices/${notice.noticeContent}`} target="_blank" rel="noreferrer" className="underline text-sm text-orange-400 font-semibold hover:text-black">{notice.title}</a>
                                        </p>
                                    )}
                                    {notice.occurance && (<p className="text-xs text-black mt-2">Occuring on: {notice.occurance.split('T')[0]}</p>)}
                                    <p className="text-xs text-black mt-2">Posted on: {notice.createdAt.split('T')[0]}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Noticeboard;