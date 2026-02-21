import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    status: 'success' | 'error' | null;
}

const MatchFeedback: React.FC<Props> = ({ status }) => {
return (
    <AnimatePresence>
        {status && (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
            {status === 'success' ? (
            <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="bg-green-500 rounded-full w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center shadow-2xl border-4 border-white text-white"
            >
                <svg className="w-14 h-14 sm:w-16 sm:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </motion.div>
            ) : (
            <motion.div
                animate={{ x: [-10, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 0.4 }}
                className="bg-red-500 rounded-full w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center shadow-2xl border-4 border-white text-white"
            >
                <svg className="w-14 h-14 sm:w-16 sm:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                </motion.div>
            )}
            </motion.div>
        )}
        </AnimatePresence>
    );
};

export default MatchFeedback;