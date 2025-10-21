import React, { useEffect, useState, useRef, useCallback } from "react";
import { MdCheckCircle, MdErrorOutline } from "react-icons/md";
import axios from 'axios';

const Mocktests = ({studentData}) => {
    const topRef = useRef(null);
    const [subjectList, setSubjectList] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [tests, setTests] = useState([]);
    const [selectedExam, setSelectedExam] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [duration, setDuration] = useState(null);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState("success");
    const [timeLeft, setTimeLeft] = useState(0);

    // Fetch subjects list once component mounts
    useEffect(() => {
        studentData['classID'] && axios.get(`https://schoolapi.vsngroups.com/api/Syllabus/Class/${studentData['classID']}`)
        .then(response => {
            setSubjectList(response.data);
            setScore(null);
            setSelectedExam(false);
            setQuestions([]);
            setTests([]);
            setAnswers({});
        })
        .catch(error => {
            console.error('Subjects fetching data:', error);
        });
    }, [studentData['classID']]);

    // Fetch mock tests when subject changes
    useEffect(() => {
        if (selectedSubject) {
            axios.get(`https://schoolapi.vsngroups.com/api/MockTest/Student/${studentData['class']}/${selectedSubject}`)
            .then(response => {
                const MocktestList = response.data.map((cls) => ({...cls, questions: JSON.parse(cls.questions)}));
                setTests(MocktestList);
                setScore(null);
                setSelectedExam(false);
                setQuestions([]);
                setAnswers({});
            })
            .catch(error => {
                console.error('Classes fetching data:', error);
            });
        }
    }, [selectedSubject, studentData['class']]);

    // Ensure handleSubmit function is stable
    const handleSubmit = useCallback(() => {
        let calculatedScore = 0;
        let totalScore = 0;
        questions.forEach((q) => {
            totalScore += q.mark || 1;
            if (answers[q.question] === q.correctAnswer) calculatedScore += q.mark || 1;
        });
        setScore({ calculatedScore, totalScore });
        topRef.current?.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => setMessage(null), 4000);
    }, [answers, questions]);

    // Manage timer when the exam is selected
    useEffect(() => {
        let timerInterval;
    
        if (selectedExam && duration) {
            setTimeLeft(duration * 60);
    
            timerInterval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerInterval);
                        handleSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    
        return () => clearInterval(timerInterval);
    }, [selectedExam, duration, handleSubmit]);

    const handleOptionChange = (qid, optIndex) => {
        setAnswers(prevAnswers => ({ ...prevAnswers, [qid]: optIndex }));
    };

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60).toString().padStart(2, '0');
        const sec = (seconds % 60).toString().padStart(2, '0');
        return `${min}:${sec}`;
    };

    return (
        <div>
            {score == null && !selectedExam && <h2 className="relative text-2xl font-bold text-black mb-4 flex items-center gap-2 drop-shadow-lg">
                Mock Tests
                <span className="absolute -bottom-1 left-0 w-17 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded"></span>
            </h2>}
            <div ref={topRef} className="p-6 space-y-6">
                {message && (
                    <div
                        className={`flex items-center gap-3 px-4 py-3 rounded-md shadow text-white text-sm font-medium ${messageType === "success" ? "bg-green-500" : "bg-red-500"}`}
                    >
                        {messageType === "success" ? (
                            <MdCheckCircle className="text-xl" />
                        ) : (
                            <MdErrorOutline className="text-xl" />
                        )}
                        <span>{message}</span>
                    </div>
                )}

                {score == null && !selectedExam && (
                    <div className="mb-4 flex items-center gap-4">
                        <label className="font-medium text-black">Select Subject:</label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="bg-white border border-orange-300 rounded px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-orange-400"
                        >
                            <option value="" disabled> -- Select -- </option>
                            {subjectList.map((sub) => (
                                <option key={sub.syllabusID} value={sub.name} className="bg-white text-black">
                                    {sub.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {score == null && !selectedExam && tests.map((test, index) => {
                    if(test.status)  {
                        return (
                            <div key={test.testID} className="bg-white/90 hover:border-2 border border-orange-300 rounded-2xl p-4 text-black space-y-2 relative shadow-2xl hover:shadow-orange-200 hover:-translate-y-1 transition-all duration-200 backdrop-blur-md">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold">{test.title}</h3>
                                        <p className="text-sm text-gray-400">Description: {test.description}</p>
                                        {test.duration != null && test.duration !== 0 && (<p className="text-sm text-gray-400">Duration: {test.duration} mins</p>)}
                                    </div>
                                    <button
                                        onClick={() => {
                                            setQuestions(test.questions);
                                            setSelectedExam(true);
                                            setDuration(test.duration ? test.duration : null);
                                        }}
                                        className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:brightness-110 text-white px-4 py-2 rounded shadow cursor-pointer"
                                    >
                                        Take Test
                                    </button>
                                </div>
                            </div>
                        );
                    }
                    return null;
                })}

                {score == null && selectedExam && (
                    <div>
                        {duration && <div className="text-black text-xl font-bold mb-4">
                            Time Left: {formatTime(timeLeft)}
                        </div>}

                        {questions.map((q, index) => (
                            <div
                                key={q.question}
                                className="p-5 rounded-xl shadow bg-white border border-orange-300 mb-6"
                            >
                                <p className="font-semibold text-lg text-black">
                                    Q{index + 1}. {q.question}
                                </p>
                                {q.options.map((opt, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name={`q-${q.question}`}
                                            checked={answers[q.question] === i}
                                            onChange={() => handleOptionChange(q.question, i)}
                                            className="accent-orange-400 cursor-pointer"
                                        />
                                        <label className="text-black">{opt}</label>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}

                {score !== null && (
                    <div className="bg-white py-10 px-4 text-black border border-orange-300 rounded-xl shadow">
                        <div className="max-w-2xl mx-auto text-center mb-10">
                            <h2 className="text-3xl font-bold mb-4">Your Score is {score.calculatedScore}/{score.totalScore}</h2>
                            <button
                                onClick={() => {
                                    setScore(null);
                                    setQuestions([]);
                                    setSelectedExam(false);
                                    setAnswers({});
                                }}
                                className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:brightness-110 text-white px-6 py-2 rounded shadow cursor-pointer"
                            >
                                OK
                            </button>
                        </div>
                        <div className="p-6 space-y-6 max-w-xl mx-auto text-black">
                            <h1 className="text-black text-xl font-bold mb-4">Review</h1>
                            {questions.map((q, index) => {
                                const selected = answers[q.question];
                                return (
                                    <div key={index} className="bg-orange-50 p-4 rounded-lg shadow border border-orange-300">
                                        <h2 className="text-xl font-semibold mb-4">{q.question}</h2>
                                        <div className="space-y-2">
                                            {q.options.map((option, idx) => {
                                                const isCorrect = idx === q.correctAnswer;
                                                const isSelected = idx === selected;
                                                const baseStyle =
                                                    "w-full px-4 py-2 rounded border text-left";
                                                const getStyle = () => {
                                                    if (isSelected && isCorrect) return baseStyle + " bg-green-500 border-green-700 text-white";
                                                    if (isSelected && !isCorrect) return baseStyle + " bg-red-500 border-red-700 text-white";
                                                    if (isCorrect) return baseStyle + " bg-green-500 border-green-700 text-white";
                                                    return baseStyle + " bg-white border-orange-300 text-black";
                                                };

                                                return (
                                                    <label key={idx} className={getStyle()}>
                                                        <input
                                                            type="radio"
                                                            name={`question-${index}`}
                                                            value={idx}
                                                            checked={isSelected}
                                                            disabled
                                                            className="mr-2"
                                                        />
                                                        {option}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {score == null && selectedExam && questions.length > 0 && (
                    <div className="flex space-x-4">
                        <button
                            onClick={handleSubmit}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded shadow flex items-center justify-center  cursor-pointer"
                        >
                            Submit Test
                        </button>
                        <button
                            onClick={() => {
                                setQuestions([]);
                                setSelectedExam(false);
                                setAnswers({});
                                setScore(null);
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded shadow flex items-center justify-center cursor-pointer"
                        >
                            Close Test
                        </button>
                    </div>            
                )}
            </div>
        </div>
    );
};

export default Mocktests;