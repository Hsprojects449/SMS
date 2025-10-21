// src/components/Contact.jsx
import React from 'react';
import {
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaClock
} from 'react-icons/fa';

const infoBlocks = [
    {
        icon: <FaMapMarkerAlt className="text-black" />,
        heading: 'Address',
        content: '123 Education Avenue, Learning City, LC 12345',
    },
    {
        icon: <FaPhoneAlt className="text-black" />,
        heading: 'Phone',
        content: '+1 (555) 123-4567',
    },
    {
        icon: <FaEnvelope className="text-black" />,
        heading: 'Email',
        content: 'info@edusphere.edu',
    },
    {
        icon: <FaClock className="text-black" />,
        heading: 'Office Hours',
        content: 'Mon–Fri: 8:00 AM–5:00 PM\nSat: 9:00 AM–2:00 PM',
    },
];

const Contact = () => (
    <section id="contact" className="py-20 px-6 bg-orange-100 text-black">
        <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
                Contact <span className="text-orange-400">Us</span>
            </h2>
            <p className="mb-10 text-gray-500">
                Ready to join SMS? Get in touch with us today.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {infoBlocks.map((block, i) => (
                    <div
                        key={i}
                        className="
              p-6
              bg-gradient-to-br to-orange-300
              rounded-2xl shadow-lg
              hover:shadow-4xl hover:text-orange-800 transition transform hover:-translate-y-1
              text-black
            "
                    >
                        <div className="flex items-center gap-4 mb-3 text-2xl">
                            {block.icon}
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{block.heading}</h3>
                        <p className="whitespace-pre-line leading-relaxed text-black/80">
                            {block.content}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default Contact;