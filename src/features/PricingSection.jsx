import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Zap, Crown, Flame, Sparkles, AlertTriangle, Construction, Hammer } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/ui/AuthModal';

// Under Construction Modal
const UnderConstructionModal = ({ isOpen, onClose, tier }) => {
    if (!isOpen) return null;

    const messages = {
        Premium: {
            title: "🔥 PREMIUM IS COOKING",
            subtitle: "Our payment system is getting roasted too",
            description: "The devs are working overtime (unpaid, obviously) to bring you premium emotional damage. Check back soon!",
        },
        Team: {
            title: "👔 ENTERPRISE THINGS",
            subtitle: "Let's circle back on this one",
            description: "Our sales team is still learning what 'synergy' means. We'll reach out when we figure it out. Maybe.",
        }
    };

    const content = messages[tier] || messages.Premium;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, rotate: -2 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0.9, rotate: 2 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white border-4 border-brutalist-black shadow-hard-xl max-w-md w-full p-8"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-brutalist-yellow p-3 border-2 border-brutalist-black">
                            <Construction size={32} className="text-brutalist-black animate-bounce" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black uppercase">{content.title}</h3>
                            <p className="text-sm font-mono text-gray-500">{content.subtitle}</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 border-2 border-dashed border-brutalist-black p-4 mb-6">
                        <p className="text-gray-700">{content.description}</p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-gray-500 mb-6">
                        <Hammer size={14} className="animate-pulse" />
                        <span>ETA: When we stop procrastinating</span>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onClose}
                        className="w-full py-3 bg-brutalist-black text-white font-black uppercase border-2 border-brutalist-black hover:bg-brutalist-red transition-colors"
                    >
                        Back to Free Roasts
                    </motion.button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const PricingCard = ({ tier, price, period, features, notIncluded, popular, cta, icon: Icon, accentColor, onCtaClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            whileHover={{ y: -8, rotate: popular ? 0 : (tier === 'Free' ? -1 : 1) }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={`relative ${popular ? 'md:-mt-4 md:mb-4' : ''}`}
        >
            {/* Popular Badge */}
            {popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-brutalist-yellow text-brutalist-black px-4 py-1 font-black text-xs uppercase border-2 border-brutalist-black shadow-hard-sm animate-pulse-glow">
                        <Sparkles size={12} className="inline -mt-0.5 mr-1" />
                        Most Popular
                    </div>
                </div>
            )}

            <div className={`
                h-full flex flex-col p-8 border-4 border-brutalist-black transition-all duration-300
                ${popular ? 'bg-brutalist-black text-white shadow-hard-xl' : 'bg-white shadow-hard'}
                ${isHovered && popular ? 'shadow-hard-yellow' : ''}
            `}>
                {/* Header */}
                <div className="mb-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 mb-4 font-mono text-xs font-bold uppercase ${popular ? 'bg-brutalist-yellow text-brutalist-black' : 'bg-gray-100 text-gray-600'}`}>
                        <Icon size={14} />
                        {tier}
                    </div>

                    <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-black">{price}</span>
                        {period && <span className={`font-mono text-sm ${popular ? 'text-gray-400' : 'text-gray-500'}`}>/{period}</span>}
                    </div>
                </div>

                {/* Divider */}
                <div className={`h-1 w-16 mb-6 ${accentColor}`} />

                {/* Features */}
                <ul className="flex-1 space-y-3 mb-8">
                    {features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                            <Check size={18} className={`mt-0.5 flex-shrink-0 ${popular ? 'text-brutalist-yellow' : 'text-green-500'}`} />
                            <span className={`text-sm ${popular ? 'text-gray-300' : 'text-gray-600'}`}>{feature}</span>
                        </li>
                    ))}
                    {notIncluded?.map((feature, idx) => (
                        <li key={`no-${idx}`} className="flex items-start gap-3 opacity-50">
                            <X size={18} className="mt-0.5 flex-shrink-0 text-gray-400" />
                            <span className="text-sm text-gray-400 line-through">{feature}</span>
                        </li>
                    ))}
                </ul>

                {/* CTA */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onCtaClick}
                    className={`w-full py-4 font-black uppercase tracking-tight border-2 transition-all
                        ${popular
                            ? 'bg-brutalist-yellow text-brutalist-black border-brutalist-yellow hover:bg-brutalist-red hover:text-white hover:border-brutalist-black'
                            : 'bg-white text-brutalist-black border-brutalist-black hover:bg-brutalist-black hover:text-white'
                        }
                    `}
                >
                    {cta}
                </motion.button>
            </div>
        </motion.div>
    );
};

export const PricingSection = () => {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showConstructionModal, setShowConstructionModal] = useState(false);
    const [constructionTier, setConstructionTier] = useState('Premium');
    const { user } = useAuth();

    const handleFreeCTA = () => {
        if (user) {
            // Scroll to hero section
            document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Show auth modal
            setShowAuthModal(true);
        }
    };

    const handlePremiumCTA = () => {
        setConstructionTier('Premium');
        setShowConstructionModal(true);
    };

    const handleTeamCTA = () => {
        setConstructionTier('Team');
        setShowConstructionModal(true);
    };

    const plans = [
        {
            tier: 'Free',
            price: '$0',
            period: 'forever',
            icon: Flame,
            accentColor: 'bg-brutalist-red',
            features: [
                '20 Website Roasts (Lifetime)',
                'Gen Z & Boomer Personas',
                'Basic Tailwind CSS Fixes',
                'Clapback Chat (10 msgs/min)',
                'Standard AI Models'
            ],
            notIncluded: [
                'Gordon Ramsay Mode',
                'Resume Analysis',
                'Priority Processing'
            ],
            cta: 'Start Free',
            popular: false,
            onCtaClick: handleFreeCTA
        },
        {
            tier: 'Premium',
            price: '$9',
            period: 'month',
            icon: Crown,
            accentColor: 'bg-brutalist-yellow',
            features: [
                '50 Website Roasts / Day',
                'ALL Personas (Inc. Ramsay)',
                'Advanced AI Models (Maverick)',
                'Resume Reality Check',
                'Priority Processing',
                'Unlimited Clapback Chat',
                'Export Roast Reports'
            ],
            cta: 'Go Premium',
            popular: true,
            onCtaClick: handlePremiumCTA
        },
        {
            tier: 'Team',
            price: '$29',
            period: 'month',
            icon: Zap,
            accentColor: 'bg-brutalist-yellow',
            features: [
                'Everything in Premium',
                '5 Team Members',
                'Shared Roast History',
                'Team Leaderboard',
                'Slack Integration',
                'API Access',
                'Custom Personas'
            ],
            cta: 'Contact Sales',
            popular: false,
            onCtaClick: handleTeamCTA
        }
    ];

    return (
        <>
            <section id="pricing" className="py-24 bg-gray-50 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-grid opacity-50" />

                {/* Top Decoration - Marquee */}
                <div className="absolute top-0 left-0 w-full overflow-hidden bg-brutalist-yellow border-y-2 border-brutalist-black">
                    <div className="relative flex">
                        <div className="flex shrink-0 animate-marquee items-center py-2">
                            {[...Array(10)].map((_, i) => (
                                <span key={i} className="font-black text-brutalist-black mx-8 text-sm uppercase whitespace-nowrap">
                                    💀 CHOOSE YOUR DESTRUCTION LEVEL 💀
                                </span>
                            ))}
                        </div>
                        <div className="flex shrink-0 animate-marquee items-center py-2" aria-hidden="true">
                            {[...Array(10)].map((_, i) => (
                                <span key={`dup-${i}`} className="font-black text-brutalist-black mx-8 text-sm uppercase whitespace-nowrap">
                                    💀 CHOOSE YOUR DESTRUCTION LEVEL 💀
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 pt-16 relative z-10">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-6xl font-black uppercase mb-4">
                            <span className="highlight-yellow">Pricing</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Pay for emotional damage. Cancel anytime (but you won't).
                        </p>
                    </motion.div>

                    {/* Pricing Cards */}
                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {plans.map((plan, idx) => (
                            <motion.div
                                key={plan.tier}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <PricingCard {...plan} />
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom Note */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                    >
                        <div className="inline-flex items-center gap-2 bg-white border-2 border-brutalist-black px-4 py-2 shadow-hard-sm font-mono text-sm">
                            <AlertTriangle size={16} className="text-brutalist-yellow" />
                            <span>All plans include <strong>unlimited shame</strong> and <strong>zero refunds</strong></span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSuccess={() => {
                    setShowAuthModal(false);
                    // Scroll to hero after login
                    setTimeout(() => {
                        document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }}
            />

            {/* Under Construction Modal */}
            <UnderConstructionModal
                isOpen={showConstructionModal}
                onClose={() => setShowConstructionModal(false)}
                tier={constructionTier}
            />
        </>
    );
};

