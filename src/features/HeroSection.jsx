import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Flame, Target, Sparkles, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/ui/AuthModal';
import { UpgradeModal } from './UpgradeModal';
import { saveScanHistory } from '../services/api';

export const HeroSection = ({ onRoastComplete }) => {
    const [url, setUrl] = useState('');
    const [isHovering, setIsHovering] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const { user } = useAuth();
    // Get token for API calls
    const getToken = async () => {
        const { data } = await import('../lib/supabase').then(m => m.supabase.auth.getSession());
        return data.session?.access_token;
    };

    const handleRoast = async () => {
        if (!url.trim()) {
            setError('Please enter a URL');
            return;
        }

        if (!user) {
            setShowAuthModal(true);
            return;
        }

        // Add https:// if missing
        let targetUrl = url.trim();
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            targetUrl = 'https://' + targetUrl;
        }

        setIsLoading(true);
        setError(null);

        try {
            const token = await getToken();
            const result = await roastWebsite(targetUrl, 'gen_z', token);
            console.log('Roast result:', result);

            // Save to history
            try {
                await saveScanHistory({
                    url: targetUrl,
                    roast_data: result,
                    personality: 'gen_z'
                }, token);
            } catch (historyError) {
                if (historyError.message === 'STORAGE_LIMIT_REACHED') {
                    setShowUpgradeModal(true);
                } else {
                    console.error('Failed to save history:', historyError);
                }
            }

            if (onRoastComplete) {
                onRoastComplete(result);
            }
            // Scroll to roast view
            document.getElementById('roast-view')?.scrollIntoView({ behavior: 'smooth' });
        } catch (err) {
            console.error('Roast failed:', err);
            setError(err.message || 'Failed to roast website. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="hero" className="relative min-h-[90vh] flex flex-col items-center justify-center py-20 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-dots opacity-30" />

            {/* Floating Decorations */}
            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute top-20 left-10 hidden lg:block"
            >
                <div className="bg-brutalist-yellow border-2 border-brutalist-black p-4 shadow-hard rotate-12">
                    <span className="font-black text-2xl">💀</span>
                </div>
            </motion.div>

            <motion.div
                animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                className="absolute top-40 right-20 hidden lg:block"
            >
                <div className="bg-brutalist-red text-white border-2 border-brutalist-black p-3 shadow-hard -rotate-6">
                    <span className="font-mono text-sm">!important</span>
                </div>
            </motion.div>

            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute bottom-32 left-20 hidden lg:block"
            >
                <div className="bg-white border-2 border-brutalist-black p-4 shadow-hard rotate-6">
                    <span className="font-mono text-xs text-brutalist-red">padding: 0;</span>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="container mx-auto px-4 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotate: -2 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="inline-flex items-center gap-2 bg-brutalist-yellow px-4 py-2 font-mono text-sm font-bold text-brutalist-black uppercase tracking-wider mb-8 border-2 border-brutalist-black shadow-hard"
                    >
                        <Flame size={16} className="animate-pulse" />
                        Beta v1.0 — Now with Extra Shame
                        <Sparkles size={16} />
                    </motion.div>

                    {/* Main Headline */}
                    <h1 className="mb-6 text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tighter">
                        <span className="block">Emotional</span>
                        <span className="relative inline-block">
                            <span className="relative z-10 text-brutalist-red">Damage</span>
                            <motion.span
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="absolute bottom-2 left-0 h-4 bg-brutalist-yellow -z-0"
                            />
                        </span>
                        <span className="block">On Demand</span>
                    </h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mx-auto mb-12 max-w-2xl text-lg md:text-xl font-medium leading-relaxed text-gray-600"
                    >
                        Submit your portfolio or resume. Our AI Art Director will roast it with the
                        <span className="font-bold text-brutalist-black"> brutal honesty</span> your friends are too nice to give you.
                    </motion.p>
                </motion.div>

                {/* Input Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="w-full max-w-2xl mx-auto space-y-4"
                >
                    <div
                        className="relative group"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        {/* Shadow Layer */}
                        <motion.div
                            animate={{
                                x: isHovering ? 6 : 4,
                                y: isHovering ? 6 : 4
                            }}
                            className="absolute inset-0 bg-brutalist-black transition-transform"
                        />

                        {/* Input Container */}
                        <div className="relative border-4 border-brutalist-black bg-white p-2 flex flex-col md:flex-row gap-2">
                            <div className="flex-1 relative">
                                <Target size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    value={url}
                                    onChange={(e) => {
                                        setUrl(e.target.value);
                                        setError(null);
                                    }}
                                    placeholder="https://your-portfolio.com"
                                    className="border-none shadow-none text-lg md:text-2xl h-14 md:h-16 focus:ring-0 placeholder:text-gray-300 pl-12"
                                    onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleRoast()}
                                    disabled={isLoading}
                                />
                            </div>
                            <motion.div
                                whileHover={{ rotate: isLoading ? 0 : -2 }}
                                whileTap={{ scale: isLoading ? 1 : 0.95 }}
                            >
                                <Button
                                    onClick={handleRoast}
                                    disabled={isLoading}
                                    className="h-14 md:h-16 px-8 md:px-10 text-lg md:text-xl w-full md:w-auto border-2 border-brutalist-black bg-brutalist-black text-white hover:bg-brutalist-red font-black flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            ROASTING...
                                        </>
                                    ) : (
                                        <>
                                            <Zap size={20} className="group-hover:animate-pulse" />
                                            JUDGE ME
                                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center gap-2 text-brutalist-red font-bold"
                        >
                            <AlertCircle size={16} />
                            {error}
                        </motion.div>
                    )}

                    {/* Disclaimer */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-sm font-mono text-gray-400 flex items-center justify-center gap-2"
                    >
                        <span className="w-2 h-2 bg-brutalist-red rounded-full animate-pulse" />
                        By clicking this, you agree to cry. No refunds on emotional damage.
                    </motion.p>
                </motion.div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="mt-16 flex flex-wrap justify-center gap-4 md:gap-8"
                >
                    {[
                        { value: '10K+', label: 'Egos Destroyed' },
                        { value: '4.2', label: 'Avg Cry Rating' },
                        { value: '0', label: 'Refunds Given' },
                    ].map((stat, idx) => (
                        <div key={idx} className="flex items-center gap-3 px-4 py-2 bg-white border-2 border-brutalist-black shadow-hard-sm">
                            <span className="text-2xl md:text-3xl font-black text-brutalist-red">{stat.value}</span>
                            <span className="text-xs md:text-sm font-mono text-gray-500 uppercase">{stat.label}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
            {/* Modals */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSuccess={() => {
                    setShowAuthModal(false);
                    handleRoast(); // Retry roast after login
                }}
            />

            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
            />
        </section>
    );
};
