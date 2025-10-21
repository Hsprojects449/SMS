// src/components/Home.jsx
import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import FeaturesCarousel from './FeaturesCarousel';
import About from './About';
import Contact from './Contact';
import Footer from './Footer';

const Home = () => (
    <div className="bg-orange-100 overflow-x-hidden">
        <Navbar />
        <Hero />
        <FeaturesCarousel />
        <About />          {/* ← new About section */}
        <Contact />        {/* ← now comes after About */}
        <Footer />
    </div>
);

export default Home;