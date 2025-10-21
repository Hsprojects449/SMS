// src/components/AboutSplit.jsx
import React from "react";

const aboutPoints = [
    "Student registration and ID management",
    "Interactive dashboards for all users",
    "Online mock test creation and delivery",
    "Performance tracking",
    "Parent communication via SMS/email",
    "Secure data management",
];

const About = () => (
    <section id="about" className="py-16 bg-orange-100">
        <div className="max-w-4xl mx-auto px-6">
            <div className="rounded-2xl overflow-hidden shadow-2xl hover:-translate-y-1 transition-all duration-300 transition">
                {/* Top colored half */}
                <div className="backdrop-blur-[7px] bg-slate-900/85 p-8 text-white text-center">
                    <h2 className="text-3xl font-bold">
                        <span className="text-white">About </span>
                        <span className="text-orange-400">SMS</span>
                    </h2>
                    <p className="mt-2">
                        SMS is a comprehensive school management system designed to streamline
                        educational operations and enhance learning experiences.
                    </p>
                </div>
                {/* Bottom white half */}
                <div className="bg-white/90 p-8">
                    <ul className="list-disc list-inside space-y-2 text-black">
                        {aboutPoints.map((pt, i) => (
                            <li key={i}>{pt}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </section>
);

export default About;