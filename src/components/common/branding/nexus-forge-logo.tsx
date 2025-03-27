import React from 'react';
import { motion } from 'framer-motion';

export const NexusForgeLogo = ({ size = 'md' }) => {
  // Size variants
  const sizes = {
    sm: {
      container: 'w-8 h-8',
      text: 'text-lg'
    },
    md: {
      container: 'w-10 h-10',
      text: 'text-xl'
    },
    lg: {
      container: 'w-12 h-12',
      text: 'text-2xl'
    }
  };

  const logoVariants = {
    initial: { scale: 0.5, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 200, 
        damping: 10,
        duration: 0.5 
      }
    },
    hover: { scale: 1.05 }
  };

  return (
    <motion.div 
      className="flex items-center space-x-2"
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={logoVariants}
    >
      <div className={`${sizes[size].container} bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center`}>
        <span className={`text-white ${sizes[size].text} font-bold`}>NF</span>
      </div>
      <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
        NexusForge
      </span>
    </motion.div>
  );
};

export default NexusForgeLogo;
