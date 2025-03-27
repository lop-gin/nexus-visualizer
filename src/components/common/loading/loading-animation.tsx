'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingAnimationProps {
  isLoading: boolean;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        {/* NexusForge logo animation */}
        <motion.div 
          className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 0, 0],
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          <span className="text-white text-2xl font-bold">NF</span>
        </motion.div>
        
        {/* Orbiting dots */}
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-blue-500"
              initial={{ 
                x: 0, 
                y: 0,
                opacity: 0.7
              }}
              animate={{ 
                x: [0, Math.cos(2 * Math.PI * (i / 3)) * 40, 0],
                y: [0, Math.sin(2 * Math.PI * (i / 3)) * 40, 0],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              style={{
                top: '50%',
                left: '50%',
                marginLeft: -4,
                marginTop: -4
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingAnimation;
