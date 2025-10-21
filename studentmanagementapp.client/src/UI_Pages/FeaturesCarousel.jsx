// src/components/FeaturesCarousel.jsx
import React from 'react';
import { FaUserGraduate, FaChalkboardTeacher, FaClipboardList, FaChartLine } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const features = [
    {
        icon: <FaUserGraduate size={36} />,
        title: 'Student Registration',
        desc: 'Seamlessly enroll and manage student profiles.',
    },
    {
        icon: <FaChalkboardTeacher size={36} />,
        title: 'Interactive Dashboards',
        desc: 'Real-time analytics for teachers, students & parents.',
    },
    {
        icon: <FaClipboardList size={36} />,
        title: 'Mock Test Module',
        desc: 'Create, assign & grade mock exams online.',
    },
    {
        icon: <FaChartLine size={36} />,
        title: 'Performance Tracking',
        desc: 'Detailed reports to track progress over time.',
    },
    {
        icon: <FaUserGraduate size={36} />,
        title: 'Attendance Management',
        desc: 'Manage Attendance With our portal easily.',
    }
];

const FeaturesCarousel = () => (
    <section id = "features" className="py-16 bg-orange-100">
        <div className="max-w-5xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-bold">
                Core <span className="text-orange-600">Features</span>
            </h2>
            <p className="text-gray-600 mt-2">
                Explore what makes SMS stand out.
            </p>
        </div>
        <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
            }}
            className="px-4"
        >
            {features.map((f, idx) => (
                <SwiperSlide key={idx}>
                    <div className="bg-gradient-to-br to-orange-300 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:text-orange-800 transition-transform transform hover:-translate-y-1">
                        <div className="text-black mb-4">{f.icon}</div>
                        <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                        <p className="text-gray-600">{f.desc}</p>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    </section>
);

export default FeaturesCarousel;