import React, { useEffect, useRef, useState } from 'react';
import { MdCheckCircle, MdErrorOutline, MdRemoveRedEye, MdDelete } from 'react-icons/md';
import { PlusCircle, Save, Trash2, Pencil, PlayCircle, StopCircle } from 'lucide-react';
import Pagination from '../Common/Pagination';
import axios from 'axios';
import { useAuth } from '../Auth/Authentication/AuthContext';

const QUESTIONS_PER_PAGE = 5;
const TESTS_PER_PAGE = 5;

const Mocktests = () => {
    
    const topRef = useRef(null);
    const [tests, setTests] = useState([]);
    const [creating, setCreating] = useState(false);
    const [viewing, setViewing] = useState(null);
    const [editingTestId, setEditingTestId] = useState(null);
    const [classList, setClassList] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [subjectList, setSubjectList] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [questions, setQuestions] = useState([]);
    const [testsPage, setTestsPage] = useState(1);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('success');
    const [totalTime, setTotalTime] = useState(0);
    // const [markPerQuestion, setMarkPerQuestion] = useState(1);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [page, setPage] = useState(1);
    const [viewPage, setViewPage] = useState(1);
    const { auth } = useAuth();

    const resetForm = () => {
        setEditingTestId(null);
        setSelectedClass('');
        setSelectedSubject('');
        setTotalTime(0);
        // setMarkPerQuestion(1);
        setTotalQuestions(0);
        setQuestions([]);
        setCreating(false);
    };

    useEffect(() => {
        axios.get('https://schoolapi.vsngroups.com/api/Class')
        .then(response => {
            const ClassList = response.data.map((cls) => (cls.name));
            setClassList(response.data);
        })
        .catch(error => {
            console.error('Classes fetching data:', error);
        });

        axios.get('https://schoolapi.vsngroups.com/api/MockTest')
        .then(response => {
            const MocktestList = response.data.map((cls) => ({...cls, questions: JSON.parse(cls.questions)}));
            setTests(MocktestList);
        })
        .catch(error => {
            console.error('Classes fetching data:', error);
        });
    }, []);

    useEffect(() => {
        if (selectedClass) {
            const ClassName = classList.find(cls => cls.name == selectedClass)?.classID;
            axios.get(`https://schoolapi.vsngroups.com/api/Syllabus/Class/${ClassName}`)
            .then(response => {
                setSubjectList(response.data);
            })
            .catch(error => {
                console.error('Subjects fetching data:', error);
            });
        } else {
            setSubjectList([])
        }
    }, [selectedClass]);

    useEffect(() => {
        if (editingTestId) return;
        if (totalQuestions > 0) {
            if (totalQuestions > questions.length) {
                // Add new questions
                setQuestions(prev =>
                    [
                        ...prev,
                        ...Array.from({ length: totalQuestions - prev.length }, () => ({
                            question: '',
                            options: ['', '', '', ''],
                            correctAnswer: 0,
                            mark: 1
                        }))
                    ]
                );
            } else if (totalQuestions < questions.length) {
                // Remove extra questions
                setQuestions(prev => prev.slice(0, totalQuestions));
            }
            setPage(1);
        } else {
            setQuestions([]);
        }
    }, [totalQuestions]);
    

    const showMessage = (txt, type = 'success') => {
        setMessage(txt);
        setMessageType(type);
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleSaveTest = () => {
        if (!selectedClass || !selectedSubject) return showMessage('Select class and subject first', 'error');
        const validateques = questions.every(
            ({ question, options }) =>
                question?.trim() &&
                Array.isArray(options) &&
                options.length === 4 &&
                options.every(opt => opt?.trim())
        );
        if (!validateques) return showMessage('Please fill all the Questions and Options', 'error');
        const newTest = {
            schoolID: 1,
            class: selectedClass,
            subject: selectedSubject,
            title: `${selectedClass}_${selectedSubject}`,
            description: `${selectedClass}_${selectedSubject}`,
            createdBy: auth.userId,
            createdAt: new Date().toISOString().slice(0, 10),
            duration: totalTime, questions
        };
        if(!editingTestId){
            axios.post('https://schoolapi.vsngroups.com/api/MockTest', {...newTest, questions: JSON.stringify(questions)})
            .then(response => {
                setTests(t => [...t, {...response.data, questions: questions}]);
                setCreating(false);
                showMessage('Mock test saved.');
                resetForm();
            })
            .catch(error => {
                console.error('MockTest Saving Failed:', error);
            });
        }
        else{
            const currentTest = tests.filter(x=> x.testID==editingTestId)
            axios.put(`https://schoolapi.vsngroups.com/api/MockTest/${editingTestId}`, {...currentTest[0], duration: totalTime, questions: JSON.stringify(questions)})
            .then(response => {
                setTests(t => t.map(x => x.testID === editingTestId ? {...currentTest[0], duration: totalTime, questions: questions} : x));
                setCreating(false);
                showMessage('Mock test saved.');
                resetForm();
            })
            .catch(error => {
                console.error('MockTest Saving Failed:', error);
            });
        }
    };

    const handleDeleteTest = (id) => {
        if (!window.confirm('Delete this test?')) return;
        axios.delete(`https://schoolapi.vsngroups.com/api/MockTest/${id}`)
        .then(response => {
            setTests(t => t.filter(x => x.testID != id));
            showMessage('Test deleted');
        })
        .catch(error => {
            console.error('Classes fetching data:', error);
        });
    };

    const handleRemoveQuestion = idx => {
        const arr = questions.filter((_, i) => i != idx);
        setTotalQuestions(totalQuestions-1)
        setQuestions(arr);
        if ((page - 1) * QUESTIONS_PER_PAGE >= arr.length && page > 1) setPage(page - 1);
    };
    
    const handleGoLive = (id) => {
        axios.put(`https://schoolapi.vsngroups.com/api/MockTest/status/${id}?status=true`)
        .then(response => {
            setTests(prev => prev.map(t => t.testID == id ? { ...t, status: true } : t));
            showMessage('Test is now live');
        })
        .catch(error => {
            console.error('Failed making the Test live', error);
        });
    };

    const handleEndTest = (id) => {
        axios.put(`https://schoolapi.vsngroups.com/api/MockTest/status/${id}?status=false`)
        .then(response => {
            setTests(prev => prev.map(t => t.testID == id ? { ...t, status: false } : t));
            showMessage('Test has ended');
        })
        .catch(error => {
            console.error('Failed Ending the Test', error);
        });
    };

    const paginatedQuestions = questions.slice((page - 1) * QUESTIONS_PER_PAGE, page * QUESTIONS_PER_PAGE);
    const viewPaginatedQuestions = viewing?.questions.slice((viewPage - 1) * QUESTIONS_PER_PAGE, viewPage * QUESTIONS_PER_PAGE) || [];

    // Tests pagination
    const totalTestPages = Math.ceil(tests.length / TESTS_PER_PAGE);
    const currentTests = tests.slice((testsPage - 1) * TESTS_PER_PAGE, testsPage * TESTS_PER_PAGE);

    useEffect(() => {
        const tp = Math.ceil(tests.length / TESTS_PER_PAGE) || 1;
        if (testsPage > tp) setTestsPage(tp);
    }, [tests, testsPage]);

    // AI Modal state and handlers (must be outside of JSX)
    const [showAIModal, setShowAIModal] = useState(false);
    const [aiNumQuestions, setAiNumQuestions] = useState(10);
    const [aiNumSets, setAiNumSets] = useState(1);
    const [aiTime, setAiTime] = useState(60);
    const [aiChapters, setAiChapters] = useState([""]);

    const handleAddChapter = () => {
        if (aiChapters.length < 20) setAiChapters([...aiChapters, ""]);
    };
    const handleChapterChange = (idx, val) => {
        setAiChapters(aiChapters.map((c, i) => i === idx ? val.slice(0, 2000) : c));
    };
    const handleRemoveChapter = (idx) => {
        setAiChapters(aiChapters.length > 1 ? aiChapters.filter((_, i) => i !== idx) : aiChapters);
    };

    return (
        <div>
            <h2 className="relative text-2xl font-bold text-black mb-4 flex items-center gap-2 drop-shadow-lg">
                Manage Mock Tests
                <span className="absolute -bottom-1 left-0 w-24 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded"></span>
            </h2>
            <div ref={topRef} className="p-6 space-y-6">
                {message && (
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-md shadow-md text-white text-sm font-medium ${messageType == 'success' ? 'bg-green-500' : 'bg-red-500'}`}> 
                        {messageType == 'success' ? <MdCheckCircle className="text-xl" /> : <MdErrorOutline className="text-xl" />}
                        <span>{message}</span>
                    </div>
                )}

                {!creating && <div className="flex justify-end gap-4">
                    <button
                        onClick={() => {
                            resetForm();
                            setViewing(null);
                            setCreating(true);
                        }}
                        className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:brightness-110 text-white px-4 py-2 rounded flex items-center gap-2 shadow cursor-pointer"
                    >
                        <PlusCircle size={18} /> Add Test
                    </button>
                    <button
                        onClick={() => setShowAIModal(true)}
                        className="bg-gradient-to-r from-cyan-500 to-blue-400 hover:brightness-110 text-white px-4 py-2 rounded flex items-center gap-2 shadow cursor-pointer"
                    >
                        <span role="img" aria-label="AI">🤖</span> Generate with AI
                    </button>
                </div>}
            {/* AI Mocktest Modal */}
            {showAIModal && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 shadow-2xl w-full max-w-2xl relative">
                        <button onClick={() => setShowAIModal(false)} className="absolute top-2 right-2 text-black hover:text-red-500 cursor-pointer text-xl">×</button>
                        <h3 className="text-xl font-bold mb-4 text-orange-500">Generate Mock Test with AI</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1">Class</label>
                                <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="w-full border border-orange-300 rounded px-3 py-2">
                                    <option value="">-- Select Class --</option>
                                    {classList.map(c => <option key={c.classID} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">Subject</label>
                                <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="w-full border border-orange-300 rounded px-3 py-2">
                                    <option value="">-- Select Subject --</option>
                                    {subjectList.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">No. of Questions</label>
                                <input type="number" min={1} max={200} value={aiNumQuestions} onChange={e => setAiNumQuestions(Number(e.target.value))} className="w-full border border-orange-300 rounded px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">No. of Sets</label>
                                <input type="number" min={1} max={10} value={aiNumSets} onChange={e => setAiNumSets(Number(e.target.value))} className="w-full border border-orange-300 rounded px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">Time Duration (min)</label>
                                <input type="number" min={1} max={500} value={aiTime} onChange={e => setAiTime(Number(e.target.value))} className="w-full border border-orange-300 rounded px-3 py-2" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-semibold mb-2">Chapter Content</label>
                            <div className="max-h-64 overflow-y-auto pr-2 space-y-2">
                                {aiChapters.map((ch, idx) => (
                                    <div key={idx} className="mb-3 flex gap-2 items-start">
                                        <textarea
                                            value={ch}
                                            onChange={e => handleChapterChange(idx, e.target.value)}
                                            maxLength={2000}
                                            rows={5}
                                            className="w-full border border-orange-300 rounded px-3 py-2 resize-y"
                                            placeholder={`Paste chapter content here (max 2000 chars)`}
                                        />
                                        <button type="button" onClick={() => handleRemoveChapter(idx)} className="text-red-500 hover:text-red-700 text-lg font-bold px-2">×</button>
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={handleAddChapter} className="bg-orange-400 hover:bg-orange-500 text-white px-3 py-1 rounded mt-2">+ Add Chapter</button>
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                            <button onClick={() => setShowAIModal(false)} className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded cursor-pointer">Cancel</button>
                            <button disabled className="bg-cyan-600 text-white px-4 py-2 rounded cursor-not-allowed opacity-60">Generate (Coming Soon)</button>
                        </div>
                    </div>
                </div>
            )}

                {!creating && !viewing && (
                    <div className="space-y-4">
                        {tests.length == 0 ? (
                            <div className="text-gray-400">No tests found.</div>
                        ) : currentTests.map(tst => (
                            <div key={tst.testID} className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl hover:shadow-orange-200 hover:-translate-y-1 transition-all duration-300 hover:border-2 border border-orange-300 text-black flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className={`h-3 w-3 rounded-full ${tst?.status ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        <strong>{tst.class} – {tst.subject}</strong>
                                    </div>
                                    <span className="text-sm text-gray-400">{tst.createdAt.split('T')[0]}</span>
                                </div>
                                <div className="flex gap-2">
                                    {tst?.status ? (
                                        <button onClick={() => handleEndTest(tst.testID)} className="bg-orange-400 hover:bg-orange-500 text-white px-3 py-1 rounded cursor-pointer" title="End Test">
                                            <StopCircle size={18} />
                                        </button>
                                    ) : (
                                        <button onClick={() => handleGoLive(tst.testID)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded cursor-pointer" title="Go Live">
                                            <PlayCircle size={18} />
                                        </button>
                                    )}
                                    <button onClick={() => { setViewing(tst); setViewPage(1); setCreating(false); }} className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1 rounded cursor-pointer" title="View">
                                        <MdRemoveRedEye />
                                    </button>
                                    <button onClick={() => handleDeleteTest(tst.testID)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded cursor-pointer" title="Delete">
                                        <MdDelete />
                                    </button>
                                    <button
                                        onClick={() => {
                                            const clonedQuestions = tst.questions.map(q => ({
                                                question: q.question,
                                                options: [...q.options],
                                                correctAnswer: q.correctAnswer,
                                                mark: q.mark
                                            }));
                                            setEditingTestId(tst.testID);
                                            setSelectedClass(tst.class);
                                            setSelectedSubject(tst.subject);
                                            setTotalTime(tst.duration);
                                            setQuestions(clonedQuestions);
                                            setTotalQuestions(tst.questions.length);
                                            setViewing(null);
                                            setCreating(true);
                                            setPage(1);
                                        }}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded cursor-pointer"
                                        title="Edit"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {tests.length > TESTS_PER_PAGE && (
                            <div className="flex justify-center mt-4">
                                <Pagination
                                    totalPages={totalTestPages}
                                    currentPage={testsPage}
                                    onPageChange={setTestsPage}
                                />
                            </div>
                        )}
                    </div>
                )}

                {viewing && (
                    <div className="space-y-4">
                        <h3 className="text-black font-semibold">Viewing: {viewing.class} - {viewing.subject}</h3>
                        {viewPaginatedQuestions.map((q, i) => (
                            <div key={i} className="bg-white rounded-lg p-4 text-black border border-orange-300">
                                <strong>Q{(viewPage - 1) * QUESTIONS_PER_PAGE + i + 1}:</strong> {q.question}
                                <div className="mt-1 space-y-1">
                                    {q.options.map((opt, oi) => (
                                        <div key={oi} className={`flex items-center gap-2 ${q.correctAnswer == oi ? 'text-green-600' : ''}`}>
                                            <input type="radio" checked={q.correctAnswer == oi} readOnly className="accent-orange-400" />
                                            <span>{opt}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-1 text-sm text-gray-400">Marks: {q.mark}</div>
                            </div>
                        ))}
                        <Pagination
                            totalPages={Math.ceil(viewing.questions.length / QUESTIONS_PER_PAGE)}
                            currentPage={viewPage}
                            onPageChange={setViewPage}
                        />
                        <button onClick={() => setViewing(null)} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded mt-4 cursor-pointer">Close</button>
                    </div>
                )}

                {creating && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-black font-medium">Class</label>
                                <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="bg-transparent text-black border border-orange-400 px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer">
                                    <option value="">-- Select Class --</option>
                                    {classList.map(c => <option key={c.name} value={c.name} className="bg-white text-black">{c.name}</option>)}
                                </select>
                            </div>
                            {selectedClass &&
                            <div>
                                <label className="text-black font-medium">Subject</label>
                                <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="bg-transparent text-black border border-orange-400 px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer">
                                    <option value="">-- Select Subject --</option>
                                    {subjectList.map(s => <option key={s.name} value={s.name} className="bg-white text-black">{s.name}</option>)}
                                </select>
                            </div>}
                        </div>

                        {selectedClass && selectedSubject &&
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                            <div>
                                <label className="text-black font-medium">Total Time (min)</label>
                                <input
                                    placeholder="Enter Duration of Exam"
                                    type="number"
                                    min="1"
                                    value={totalTime}
                                    onChange={e => setTotalTime(Math.max(1, Number(e.target.value)))}
                                    className="bg-orange-100 text-black border border-orange-300 px-3 py-2 rounded w-full"
                                />
                            </div>
                            <div>
                                <label className="text-black font-medium">Total Questions</label>
                                <input
                                    placeholder="Enter Total No.Of Questions"
                                    type="number"
                                    min="1"
                                    value={totalQuestions}
                                    onChange={e => setTotalQuestions(Math.max(1, Number(e.target.value)))}
                                    className="bg-orange-100 text-black border border-orange-300 px-3 py-2 rounded w-full"
                                />
                            </div>
                        </div>}

                        {questions.length > 0 && (
                            <>
                                <div className="space-y-4 mt-6">
                                    {paginatedQuestions.map((q, idx) => {
                                        const ai = (page - 1) * QUESTIONS_PER_PAGE + idx;
                                        return (
                                            <div key={ai} className="bg-white p-4 rounded-lg shadow border border-orange-300 relative space-y-2">
                                                <button title = "Remove" onClick={() => handleRemoveQuestion(ai)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer">
                                                    <Trash2 size={20} />
                                                </button>
                                                <h4 className="text-black font-semibold">Question {ai + 1}</h4>
                                                <input
                                                    placeholder="Enter the Question"
                                                    type="text"
                                                    value={q.question}
                                                    onChange={e => {
                                                        const arr = [...questions];
                                                        arr[ai] = { ...arr[ai], question: e.target.value };
                                                        setQuestions(arr);
                                                    }}
                                                    className="bg-orange-100 text-black border border-orange-300 px-3 py-2 rounded w-full"
                                                />
                                                <label className="text-black font-medium">Options</label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    {q.options.map((opt, oi) => (
                                                        <div key={oi} className="flex items-center gap-2 cursor-pointer">
                                                            <input type="radio" checked={q.correctAnswer == oi} onChange={() => {
                                                                const arr = [...questions];
                                                                arr[ai] = { ...arr[ai], correctAnswer: oi };
                                                                setQuestions(arr);
                                                            }} className="accent-orange-400 cursor-pointer" />
                                                            <input type="text" value={opt} 
                                                            placeholder="Enter the Options"
                                                            onChange={e => {
                                                                const arr = [...questions];
                                                                const newOptions = [...arr[ai].options];
                                                                newOptions[oi] = e.target.value;
                                                                arr[ai] = { ...arr[ai], options: newOptions };
                                                                setQuestions(arr);
                                                            }} className="bg-orange-100 text-black border border-orange-300 px-3 py-2 rounded w-full" />
                                                        </div>
                                                    ))}
                                                </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="text-black font-medium">Correct Answer</label>
                                                            <p className="text-sm text-gray-500">Option {q.correctAnswer + 1}</p>
                                                        </div>
                                                        <div>
                                                            <label className="text-black font-medium">Marks</label>
                                                <input
                                                    placeholder="Enter Marks for the question"
                                                    type="number"
                                                    value={q.mark}
                                                    onChange={e => {
                                                        const arr = [...questions];
                                                        arr[ai] = { ...arr[ai], mark: Number(e.target.value) };
                                                        setQuestions(arr);
                                                    }}
                                                    className="bg-orange-100 text-black border border-orange-300 px-3 py-2 rounded w-full"
                                                />
                                            </div>
                                            </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <Pagination
                                    totalPages={Math.ceil(questions.length / QUESTIONS_PER_PAGE)}
                                    currentPage={page}
                                    onPageChange={setPage}
                                />
                            </>
                        )}

                        <div className="flex justify-end gap-4 mt-6">
                            <button onClick={resetForm} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer">Cancel</button>
                            {totalQuestions>0 &&
                            <button onClick={handleSaveTest} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer">
                                <Save size={16} /> Save Test
                            </button>}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Mocktests;