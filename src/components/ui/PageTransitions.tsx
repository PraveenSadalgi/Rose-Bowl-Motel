'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface PageTransitionProps {
    children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                    duration: 0.4,
                    ease: [0.25, 0.4, 0.25, 1],
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

interface FadeTransitionProps {
    children: ReactNode;
}

export function FadeTransition({ children }: FadeTransitionProps) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

interface SlideTransitionProps {
    children: ReactNode;
    direction?: 'left' | 'right' | 'up' | 'down';
}

export function SlideTransition({ children, direction = 'right' }: SlideTransitionProps) {
    const pathname = usePathname();

    const directions = {
        left: { initial: { x: -100 }, exit: { x: 100 } },
        right: { initial: { x: 100 }, exit: { x: -100 } },
        up: { initial: { y: -100 }, exit: { y: 100 } },
        down: { initial: { y: 100 }, exit: { y: -100 } },
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ opacity: 0, ...directions[direction].initial }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, ...directions[direction].exit }}
                transition={{
                    duration: 0.4,
                    ease: [0.25, 0.4, 0.25, 1],
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

interface ScaleTransitionProps {
    children: ReactNode;
}

export function ScaleTransition({ children }: ScaleTransitionProps) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{
                    duration: 0.4,
                    ease: [0.25, 0.4, 0.25, 1],
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

interface LoadingTransitionProps {
    isLoading: boolean;
    children: ReactNode;
}

export function LoadingTransition({ isLoading, children }: LoadingTransitionProps) {
    return (
        <AnimatePresence mode="wait">
            {isLoading ? (
                <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center min-h-[400px]"
                >
                    <motion.div
                        className="w-16 h-16 border-4 border-rose-500/30 border-t-rose-500 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />
                </motion.div>
            ) : (
                <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
