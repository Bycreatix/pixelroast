import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, ShieldCheck, Lock, Loader2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/ui/AuthModal';

export const ResumeUpload = () => {
    const [file, setFile] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const fileInputRef = useRef(null);

    const { user } = useAuth();

    // Handle click on upload area
    const handleClick = () => {
        if (!user) {
            setShowAuthModal(true);
            return;
        }
        // Trigger file input
        fileInputRef.current?.click();
    };

    // Handle file selection from input
    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile({
                name: selectedFile.name,
                size: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
                rawFile: selectedFile
            });
        }
    };

    // Handle drag and drop
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);

        if (!user) {
            setShowAuthModal(true);
            return;
        }

        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile && droppedFile.type === 'application/pdf') {
            setFile({
                name: droppedFile.name,
                size: `${(droppedFile.size / 1024 / 1024).toFixed(2)} MB`,
                rawFile: droppedFile
            });
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setIsAnalyzing(true);
        // TODO: Implement actual resume analysis API call
        setTimeout(() => {
            setIsAnalyzing(false);
            alert('Resume analysis coming soon!');
        }, 2000);
    };

    return (
        <>
            <section className="py-16 bg-brutalist-gray/20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-black uppercase mb-3">
                        Resume Reality Check
                    </h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
                        We'll compare your "Expert" skills against your actual code.
                        <span className="bg-black text-white px-2 mx-1 font-mono text-xs">PDF ONLY</span>
                    </p>

                    <div className="max-w-md mx-auto relative">
                        {/* Security Badge */}
                        <div className="absolute -top-4 -right-4 z-10 rotate-12">
                            <div className="bg-white border-2 border-brutalist-black px-3 py-1 shadow-hard flex items-center gap-2">
                                <ShieldCheck className="text-green-600" size={16} />
                                <span className="font-bold text-xs uppercase">PII Redacted</span>
                            </div>
                        </div>

                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        <Card className="relative overflow-hidden">
                            <AnimatePresence mode="wait">
                                {!file ? (
                                    <motion.div
                                        key="upload"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className={`
                                            border-4 border-dashed rounded-none p-8 transition-colors duration-300 cursor-pointer
                                            flex flex-col items-center justify-center gap-3
                                            ${isDragOver ? 'border-brutalist-red bg-red-50' : 'border-gray-300 hover:border-brutalist-black'}
                                        `}
                                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                                        onDragLeave={() => setIsDragOver(false)}
                                        onDrop={handleDrop}
                                        onClick={handleClick}
                                    >
                                        {!user ? (
                                            <>
                                                <Lock size={40} className="text-gray-400" />
                                                <div className="space-y-1">
                                                    <p className="font-bold">Sign in to Upload</p>
                                                    <p className="text-sm font-mono text-gray-500">Click to sign in first</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={40} className={isDragOver ? "text-brutalist-red" : "text-gray-400"} />
                                                <div className="space-y-1">
                                                    <p className="font-bold">Drop your Resume here</p>
                                                    <p className="text-sm font-mono text-gray-500">or click to browse</p>
                                                </div>
                                            </>
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="file"
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="bg-neutral-50 p-6 border-2 border-dashed border-brutalist-black"
                                    >
                                        <div className="flex items-center justify-between gap-4 mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-red-100 border-2 border-brutalist-black flex items-center justify-center">
                                                    <FileText size={24} className="text-brutalist-red" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-bold text-sm truncate max-w-[150px]">{file.name}</p>
                                                    <p className="font-mono text-xs text-gray-500">{file.size}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setFile(null)}
                                                className="p-2 hover:bg-red-100 transition-colors rounded"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>

                                        <Button
                                            onClick={handleAnalyze}
                                            disabled={isAnalyzing}
                                            className="w-full bg-brutalist-red text-white hover:bg-neutral-900 justify-center"
                                        >
                                            {isAnalyzing ? (
                                                <>
                                                    <Loader2 size={18} className="animate-spin mr-2" />
                                                    ANALYZING...
                                                </>
                                            ) : (
                                                'EXPOSE MY LIES'
                                            )}
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSuccess={() => setShowAuthModal(false)}
            />
        </>
    );
};
