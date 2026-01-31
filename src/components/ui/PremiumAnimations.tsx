'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import React, { ReactNode } from 'react';

interface AnimatedButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost';
}

export function AnimatedButton({ children, variant = 'primary', className = '', ...props }: AnimatedButtonProps) {
    const variants = {
        primary: 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white',
        secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/20',
        ghost: 'bg-transparent hover:bg-white/10 text-white',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    );
}

interface AnimatedCardProps {
    children: ReactNode;
    className?: string;
    hoverScale?: number;
    delay?: number;
}

export function AnimatedCard({ children, className = '', hoverScale = 1.03, delay = 0 }: AnimatedCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ scale: hoverScale, y: -5 }}
            className={`transition-all duration-300 ${className}`}
        >
            {children}
        </motion.div>
    );
}

interface PulseGlowProps {
    children: ReactNode;
    className?: string;
    color?: string;
}

export function PulseGlow({ children, className = '', color = 'rose' }: PulseGlowProps) {
    return (
        <motion.div
            animate={{
                boxShadow: [
                    `0 0 20px rgba(244, 63, 94, 0.3)`,
                    `0 0 40px rgba(244, 63, 94, 0.6)`,
                    `0 0 20px rgba(244, 63, 94, 0.3)`,
                ],
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface FloatingElementProps {
    children: ReactNode;
    className?: string;
    duration?: number;
    yOffset?: number;
}

export function FloatingElement({ children, className = '', duration = 3, yOffset = 20 }: FloatingElementProps) {
    return (
        <motion.div
            animate={{
                y: [-yOffset, yOffset, -yOffset],
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface ShimmerProps {
    children: ReactNode;
    className?: string;
}

export function Shimmer({ children, className = '' }: ShimmerProps) {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            {children}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />
        </div>
    );
}

interface MagneticButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    children: ReactNode;
}

export function MagneticButton({ children, className = '', ...props }: MagneticButtonProps) {
    return (
        <motion.button
            whileHover={{
                scale: 1.1,
                rotate: [0, -5, 5, -5, 0],
            }}
            whileTap={{ scale: 0.9 }}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 10,
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.button>
    );
}

interface CounterAnimationProps {
    from: number;
    to: number;
    duration?: number;
    className?: string;
}

export function CounterAnimation({ from, to, duration = 2, className = '' }: CounterAnimationProps) {
    const [count, setCount] = React.useState(from);
    const [hasAnimated, setHasAnimated] = React.useState(false);

    React.useEffect(() => {
        if (hasAnimated) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setHasAnimated(true);
                    const startTime = Date.now();
                    const animate = () => {
                        const elapsed = Date.now() - startTime;
                        const progress = Math.min(elapsed / (duration * 1000), 1);
                        const easeOutProgress = 1 - Math.pow(1 - progress, 3);
                        const current = Math.floor(from + (to - from) * easeOutProgress);
                        setCount(current);

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    };
                    animate();
                }
            },
            { threshold: 0.1 }
        );

        const element = document.getElementById(`counter-${from}-${to}`);
        if (element) observer.observe(element);

        return () => observer.disconnect();
    }, [from, to, duration, hasAnimated]);

    return (
        <motion.span
            id={`counter-${from}-${to}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={className}
        >
            {count}
        </motion.span>
    );
}

interface TypewriterProps {
    text: string;
    delay?: number;
    className?: string;
}

export function Typewriter({ text, delay = 0, className = '' }: TypewriterProps) {
    const letters = text.split('');

    return (
        <motion.span className={className}>
            {letters.map((letter, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: 0.05,
                        delay: delay + index * 0.05,
                    }}
                >
                    {letter}
                </motion.span>
            ))}
        </motion.span>
    );
}
