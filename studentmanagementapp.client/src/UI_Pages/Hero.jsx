import React from 'react';
import { motion } from 'framer-motion';
import { InteractiveHoverButton } from "../components/ui/interactive-hover-button";

const Hero = () => (
    <section
        id="hero"
        className="h-screen bg-[#0F172A] bg-cover bg-center relative flex flex-col items-center justify-center text-center px-4"
        style={{ backgroundImage: "url('/bg-image.jpg')" }}
    >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-0"></div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl text-white space-y-6 font-poppins">
            {/* Headline */}
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="
          text-4xl sm:text-5xl lg:text-6xl 
          font-extrabold 
          tracking-tight 
          bg-clip-text text-transparent 
          bg-gradient-to-r from-orange-300 to-yellow-400
        "
            >
                Empower Your School with <span className="text-white">SMS</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg sm:text-xl md:text-2xl font-medium text-yellow-200 tracking-wide"
            >
                The All-in-One Digital Education Platform
            </motion.h2>

            {/* Body */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-gray-300 font-normal leading-relaxed text-base sm:text-lg"
            >
                Streamline student management, track performance, and foster collaboration-all in one place.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
            >
                <a href="#features">
                    <InteractiveHoverButton

                        className="
            bg-gradient-to-r from-orange-400 to-yellow-400 
            hover:brightness-110 
            text-white 
            px-4 py-2 
            rounded 
            flex items-center gap-2 
            shadow
          "
                    >
                        Get Started
                    </InteractiveHoverButton>
                </a>
            </motion.div>
        </div>
    </section>
);

export default Hero;