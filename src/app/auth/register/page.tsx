'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Logo component that will be used across auth pages
export const NexusForgeLogoLink = () => (
  <Link href="/" className="inline-block">
    <motion.div 
      className="flex items-center space-x-2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: 'spring', 
        stiffness: 200, 
        damping: 10,
        duration: 0.5 
      }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
        <span className="text-white text-xl font-bold">NF</span>
      </div>
      <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
        NexusForge
      </span>
    </motion.div>
  </Link>
);

// Multi-step signup component
export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    companyType: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };
  
  const buttonVariants = {
    hover: { 
      scale: 1.03,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
      transition: { type: 'spring', stiffness: 400 }
    },
    tap: { scale: 0.97 }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 3) {
      // Validate current step
      if (step === 1) {
        if (!formData.companyName || !formData.companyType) {
          setError('Please fill in all fields');
          return;
        }
      } else if (step === 2) {
        if (!formData.fullName || !formData.email) {
          setError('Please fill in all fields');
          return;
        }
      }
      
      // Move to next step
      setError('');
      setStep(prev => prev + 1);
      return;
    }
    
    // Final step validation
    if (!formData.password) {
      setError('Please enter a password');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!formData.agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }
    
    // Submit the form
    setLoading(true);
    setError('');
    
    try {
      // Here you would normally call your registration API
      // For now, we'll simulate a successful registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to dashboard or confirmation page
      router.push('/auth/login?registered=true');
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Progress indicator
  const ProgressIndicator = () => (
    <div className="flex justify-center mb-8">
      {[1, 2, 3].map(i => (
        <motion.div 
          key={i}
          className="flex flex-col items-center mx-4"
          initial={{ opacity: 0.5 }}
          animate={{ 
            opacity: i <= step ? 1 : 0.5,
            scale: i === step ? 1.1 : 1
          }}
          transition={{ duration: 0.3 }}
        >
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
              i < step 
                ? 'bg-green-500 text-white' 
                : i === step 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}
          >
            {i < step ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              i
            )}
          </div>
          <span className={`text-sm ${i === step ? 'font-medium text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {i === 1 ? 'Company' : i === 2 ? 'Profile' : 'Security'}
          </span>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      {/* Header with logo */}
      <header className="w-full py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <NexusForgeLogoLink />
        </div>
      </header>
      
      <div className="flex-grow flex items-center justify-center p-6">
        <motion.div 
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden max-w-md w-full p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <motion.h1 
              className="text-2xl font-bold text-gray-900 dark:text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Create Your Account
            </motion.h1>
            <motion.p 
              className="text-gray-600 dark:text-gray-300 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Join NexusForge to streamline your manufacturing
            </motion.p>
          </div>
          
          <ProgressIndicator />
          
          <form onSubmit={handleSubmit}>
            {/* Step 1: Company Information */}
            {step === 1 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="companyName">
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder="Enter your company name"
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="companyType">
                    Company Type
                  </label>
                  <select
                    id="companyType"
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select company type</option>
                    <option value="manufacturer">Manufacturer</option>
                    <option value="distributor">Distributor</option>
                    <option value="both">Both Manufacturer & Distributor</option>
                  </select>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  className="pt-4"
                >
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2 px-4 rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow"
                  >
                    Continue
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
            
            {/* Step 2: Personal Information */}
            {step === 2 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="fullName">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder="Enter your full name"
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder="Enter your email address"
                  />
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  className="pt-4 flex space-x-4"
                >
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 bg-white dark:bg-slate-700 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 py-2 px-4 rounded-lg font-medium"
                  >
                    Back
                  </motion.button>
                  
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    type="submit"
                    className="w-2/3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2 px-4 rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow"
                  >
                    Continue
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
            
            {/* Step 3: Security Information */}
            {step === 3 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder="Create a password"
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder="Confirm your password"
                  />
                </motion.div>
                
                <motion.div variants={itemVariants} className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-slate-700 focus:ring-3 focus:ring-blue-300"
                    />
                  </div>
                  <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                    I agree to the <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a>
                  </label>
                </motion.div>
                
                {error && (
                  <motion.div 
                    variants={itemVariants}
                    className="text-red-500 text-sm"
                  >
                    {error}
                  </motion.div>
                )}
                
                <motion.div 
                  variants={itemVariants}
                  className="pt-4 flex space-x-4"
                >
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-1/3 bg-white dark:bg-slate-700 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 py-2 px-4 rounded-lg font-medium"
                  >
                    Back
                  </motion.button>
                  
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    type="submit"
                    disabled={loading}
                    className="w-2/3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2 px-4 rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow disabled:opacity-70"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </form>
          
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Footer */}
      <footer className="w-full py-6 px-6 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} NexusForge. All rights reserved.</p>
      </footer>
    </div>
  );
}
