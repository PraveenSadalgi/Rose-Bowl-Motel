'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        // Detect mobile device for performance optimization
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();

        // Check if splash has been shown in this session
        const hasShownSplash = sessionStorage.getItem('splashShown');

        if (hasShownSplash) {
            setIsVisible(false);
            return;
        }

        const timer = setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem('splashShown', 'true');
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    // Don't render anything on server
    if (!isMounted) {
        return null;
    }

    // Get window dimensions safely
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

    // Reduce particles on mobile for better performance
    const particleCount = isMobile ? 8 : 20;

    return (
        <AnimatePresence mode="wait">
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-rose-950 via-rose-900 to-rose-800 overflow-hidden"
                    style={{
                        willChange: 'opacity, transform',
                        backfaceVisibility: 'hidden',
                        perspective: 1000,
                        WebkitFontSmoothing: 'antialiased',
                    }}
                >
                    {/* Animated background particles */}
                    <div className="absolute inset-0 overflow-hidden" style={{ willChange: 'transform' }}>
                        {[...Array(particleCount)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-white/20 rounded-full"
                                initial={{
                                    x: Math.random() * windowWidth,
                                    y: Math.random() * windowHeight,
                                    scale: 0,
                                }}
                                animate={{
                                    scale: [0, 1, 0],
                                    opacity: [0, 0.5, 0],
                                }}
                                transition={{
                                    duration: 2 + Math.random() * 2,
                                    repeat: Infinity,
                                    delay: Math.random() * 2,
                                }}
                                style={{
                                    willChange: 'transform, opacity',
                                    transform: 'translate3d(0, 0, 0)',
                                }}
                            />
                        ))}
                    </div>

                    {/* Logo and text animation */}
                    <div className="relative z-10 text-center px-4" style={{ willChange: 'transform' }}>
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                type: 'spring',
                                stiffness: 260,
                                damping: 20,
                                duration: 1,
                            }}
                            className="mb-8"
                            style={{
                                willChange: 'transform',
                                backfaceVisibility: 'hidden',
                                transform: 'translate3d(0, 0, 0)',
                            }}
                        >
                            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-2xl">
                                <span className="text-6xl font-bold text-white">R</span>
                            </div>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight"
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                willChange: 'transform, opacity',
                                transform: 'translate3d(0, 0, 0)',
                            }}
                        >
                            Rose Bowl Motel
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="text-xl md:text-2xl text-rose-100 font-light tracking-wide"
                            style={{
                                willChange: 'transform, opacity',
                                transform: 'translate3d(0, 0, 0)',
                            }}
                        >
                            Where Luxury Meets Comfort
                        </motion.p>

                        {/* Loading bar */}
                        <motion.div
                            className="mt-12 w-64 h-1 mx-auto bg-white/20 rounded-full overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            style={{
                                willChange: 'opacity',
                                transform: 'translate3d(0, 0, 0)',
                            }}
                        >
                            <motion.div
                                className="h-full bg-gradient-to-r from-rose-300 to-rose-500 rounded-full"
                                initial={{ width: '0%' }}
                                animate={{ width: '100%' }}
                                transition={{ delay: 1.2, duration: 1.5, ease: 'easeInOut' }}
                                style={{
                                    willChange: 'width',
                                    transform: 'translate3d(0, 0, 0)',
                                }}
                            />
                        </motion.div>
                    </div>

                    {/* Decorative elements - Optimized blur for mobile */}
                    <motion.div
                        className={`absolute top-20 left-20 w-40 h-40 bg-rose-500/10 rounded-full ${isMobile ? 'blur-xl' : 'blur-3xl'}`}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        style={{
                            willChange: 'transform, opacity',
                            transform: 'translate3d(0, 0, 0)',
                        }}
                    />
                    <motion.div
                        className={`absolute bottom-20 right-20 w-60 h-60 bg-rose-400/10 rounded-full ${isMobile ? 'blur-xl' : 'blur-3xl'}`}
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 1,
                        }}
                        style={{
                            willChange: 'transform, opacity',
                            transform: 'translate3d(0, 0, 0)',
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
