import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const FixItButton = ({ code = "p-4 bg-red-500 rounded-lg" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative inline-block">
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className={`h-8 px-3 text-xs bg-brutalist-black text-white ${isOpen ? 'bg-brutalist-red hover:bg-red-700' : ''}`}
            >
                <Wrench size={12} />
                FIX IT
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute z-50 left-0 top-full mt-2 w-64 p-3 bg-white border-2 border-brutalist-black shadow-hard"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-xs uppercase text-gray-500">Tailwind Solution</span>
                            <button onClick={handleCopy} className="text-xs font-bold text-brutalist-red hover:underline">
                                {copied ? 'COPIED!' : 'COPY CLASS'}
                            </button>
                        </div>
                        <div className="bg-gray-100 p-2 font-mono text-xs break-all border border-gray-200">
                            {code}
                        </div>
                        <div className="absolute -top-1 left-4 w-3 h-3 bg-white border-t-2 border-l-2 border-brutalist-black transform rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
