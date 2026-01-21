import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, ShieldCheck, Lock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/ui/AuthModal';

export const ResumeUpload = () => {
    const [file, setFile] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    const { user } = useAuth();

    // Handle file upload - requires auth
    const handleUpload = (e) => {
        if (!user) {
            setShowAuthModal(true);
            return;
        }
        e?.preventDefault?.();
        setIsDragOver(false);
        // In a real app, validating file type here
        setFile({ name: "john_doe_resume.pdf", size: "1.2 MB" });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (!user) {
            setShowAuthModal(true);
            return;
        }
        setIsDragOver(false);
        setFile({ name: "john_doe_resume.pdf", size: "1.2 MB" });
    };

    return (
        <>
            <section className="py-20 bg-brutalist-gray/20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">
                        Resume Reality Check
                    </h2>
                    <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                        We'll compare your "Expert" skills against your actual code.
                        <span className="bg-black text-white px-2 mx-1 font-mono text-sm">PDF ONLY</span>
                    </p>

                    <div className="max-w-xl mx-auto relative">
                        {/* Security Badge */}
                        <div className="absolute -top-6 -right-6 z-10 rotate-12">
                            <div className="bg-brutalist-white border-2 border-brutalist-black px-4 py-2 shadow-hard flex items-center gap-2">
                                <ShieldCheck className="text-green-600" size={20} />
                                <span className="font-bold text-xs uppercase">PII Redacted</span>
                            </div>
                        </div>

                        <Card className="relative overflow-hidden">
                            <AnimatePresence mode="wait">
                                {!file ? (
                                    <motion.div
                                        key="upload"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className={`
                                            border-4 border-dashed rounded-none p-12 transition-colors duration-300
                                            flex flex-col items-center justify-center gap-4
                                            ${isDragOver ? 'border-brutalist-red bg-red-50' : 'border-gray-300 hover:border-brutalist-black'}
                                        `}
                                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                                        onDragLeave={() => setIsDragOver(false)}
                                        onDrop={handleDrop}
                                        onClick={handleUpload}
                                    >
                                        {!user ? (
                                            <>
                                                <Lock size={48} className="text-gray-400" />
                                                <div className="space-y-2">
                                                    <p className="font-bold text-lg">Sign in to Upload</p>
                                                    <p className="text-sm font-mono text-gray-500">Click to sign in first</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={48} className={isDragOver ? "text-brutalist-red" : "text-gray-400"} />
                                                <div className="space-y-2">
                                                    <p className="font-bold text-lg">Drop your Resume here</p>
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
                                        className="bg-neutral-50 p-8 border-2 border-dashed border-brutalist-black"
                                    >
                                        <div className="flex items-center justify-between gap-4 mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-red-100 border-2 border-brutalist-black flex items-center justify-center">
                                                    <FileText size={32} className="text-brutalist-red" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-bold text-lg">{file.name}</p>
                                                    <p className="font-mono text-xs text-gray-500">1.2 MB • SCANNED</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setFile(null)}
                                                className="p-2 hover:bg-red-100 transition-colors border-2 border-transparent hover:border-red-200"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>

                                        <Button className="w-full bg-brutalist-red text-white hover:bg-neutral-900">
                                            EXPOSE MY LIES
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
