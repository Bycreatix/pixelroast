import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Check, Copy, X } from 'lucide-react';
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
        <div className="relative">
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className={`h-8 px-3 text-xs bg-brutalist-black text-white shrink-0 ${isOpen ? 'bg-brutalist-red hover:bg-red-700' : ''}`}
            >
                <Wrench size={12} />
                FIX IT
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop to close on click outside */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Popup - opens ABOVE the button to avoid cut-off */}
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            className="fixed sm:absolute z-50 left-4 right-4 sm:left-auto sm:right-0 bottom-20 sm:bottom-full sm:mb-2 sm:w-72 p-4 bg-white border-2 border-brutalist-black shadow-hard-lg"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-bold text-sm uppercase text-brutalist-black flex items-center gap-2">
                                    <Wrench size={14} />
                                    Tailwind Fix
                                </span>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-gray-100 rounded"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Code block */}
                            <div className="bg-gray-900 text-green-400 p-3 font-mono text-xs break-all rounded mb-3 max-h-32 overflow-y-auto">
                                {code}
                            </div>

                            {/* Copy button */}
                            <button
                                onClick={handleCopy}
                                className={`w-full py-2 font-bold text-sm flex items-center justify-center gap-2 border-2 border-brutalist-black transition-colors ${copied
                                    ? 'bg-green-500 text-white'
                                    : 'bg-brutalist-yellow hover:bg-brutalist-black hover:text-white'
                                    }`}
                            >
                                {copied ? (
                                    <>
                                        <Check size={16} />
                                        COPIED!
                                    </>
                                ) : (
                                    <>
                                        <Copy size={16} />
                                        COPY CLASSES
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
