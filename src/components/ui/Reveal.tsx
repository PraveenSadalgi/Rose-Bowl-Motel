'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation, Variant } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  width?: 'fit-content' | '100%';
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

export const Reveal = ({ 
  children, 
  width = 'fit-content', 
  delay = 0.25, 
  duration = 0.5,
  direction = 'up',
  className = ""
}: Props) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start('visible');
    }
  }, [isInView, mainControls]);

  const getVariants = (): { hidden: Variant; visible: Variant } => {
    // Default hidden state
    let hiddenState: any = { opacity: 0 };
    
    switch (direction) {
      case 'up':
        hiddenState.y = 50;
        break;
      case 'down':
        hiddenState.y = -50;
        break;
      case 'left':
        hiddenState.x = 50;
        break;
      case 'right':
        hiddenState.x = -50;
        break;
      case 'none':
        break;
    }

    return {
      hidden: hiddenState,
      visible: { 
        opacity: 1, 
        x: 0, 
        y: 0,
        transition: {
          duration,
          delay,
          type: "spring",
          damping: 25,
          stiffness: 100
        }
      },
    };
  };

  return (
    <div ref={ref} style={{ position: 'relative', width }} className={className}>
      <motion.div
        variants={getVariants()}
        initial="hidden"
        animate={mainControls}
      >
        {children}
      </motion.div>
    </div>
  );
};
