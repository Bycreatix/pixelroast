import React from 'react';
import { Stamp } from '../components/ui/Stamp';
import { Scorecard } from '../components/ui/Scorecard';
import { FixItButton } from './FixItButton';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Zap } from 'lucide-react';

// Demo content for non-signed-in users
const DEMO_DATA = {
    roast: "This portfolio looks like someone discovered gradients in 2010 and never recovered. The font choices? Bold move using Comic Sans's sophisticated cousin. And that hero section? It's giving 'I watched one YouTube tutorial.'",
    errors: [
        "Typography: Using 47 different font sizes is not 'dynamic design'",
        "Colors: Neon pink and dark brown together is a hate crime",
        "Layout: That grid system is having an identity crisis"
    ],
    fixes: [
        "text-base md:text-lg font-sans leading-relaxed",
        "bg-gradient-to-r from-slate-900 to-slate-700 text-white",
        "grid grid-cols-1 md:grid-cols-3 gap-6"
    ],
    tier: 'free',
    technology: 'REACT',
    scans_used: 1,
    scans_limit: 5
};

export const RoastView = ({ roastData, isDemo = false }) => {
    // Use demo data if no roastData and isDemo is true
    const displayData = roastData || (isDemo ? DEMO_DATA : null);

    if (!displayData) return null;

    const { roast, errors = [], fixes = [], tier, url, scans_used, scans_limit } = displayData;

    // Calculate damage score based on number of errors
    const damageScore = Math.min(99, 50 + (errors.length * 12));

    // Categorize errors
    const typographyCrimes = errors.filter(e =>
        e.toLowerCase().includes('font') ||
        e.toLowerCase().includes('text') ||
        e.toLowerCase().includes('typography')
    ).length || Math.ceil(errors.length * 0.4);

    const colorClashes = errors.filter(e =>
        e.toLowerCase().includes('color') ||
        e.toLowerCase().includes('contrast') ||
        e.toLowerCase().includes('palette')
    ).length || Math.ceil(errors.length * 0.3);

    const alignmentErrors = errors.filter(e =>
        e.toLowerCase().includes('align') ||
        e.toLowerCase().includes('layout') ||
        e.toLowerCase().includes('spacing') ||
        e.toLowerCase().includes('grid')
    ).length || Math.ceil(errors.length * 0.3);

    // Get detected technology from roast text
    const detectTechnology = () => {
        const roastLower = (roast || '').toLowerCase();
        if (roastLower.includes('react')) return 'REACT';
        if (roastLower.includes('vue')) return 'VUE';
        if (roastLower.includes('angular')) return 'ANGULAR';
        if (roastLower.includes('wordpress')) return 'WORDPRESS';
        if (roastLower.includes('bootstrap')) return 'BOOTSTRAP';
        if (roastLower.includes('tailwind')) return 'TAILWIND';
        return 'UNKNOWN STACK';
    };

    return (
        <section id="roast-view" className="py-12 bg-gray-50 border-y-4 border-brutalist-black">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* The Evidence (Website Analysis) */}
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                            <h2 className="text-2xl font-black uppercase">EVIDENCE #402</h2>
                            <span className="font-mono text-xs bg-brutalist-yellow text-black px-3 py-1 border-2 border-brutalist-black font-bold">
                                DETECTED TECHNOLOGY: {detectTechnology()}
                            </span>
                        </div>

                        <div className="relative border-4 border-brutalist-black bg-white shadow-hard-lg overflow-hidden">
                            {/* Mock Screenshot Area with stamps */}
                            <div className="bg-gray-200 min-h-[400px] relative p-6">
                                {/* Skeleton placeholder blocks */}
                                <div className="space-y-4">
                                    <div className="bg-gray-300 h-8 w-1/3 rounded"></div>
                                    <div className="bg-gray-300 h-4 w-2/3 rounded"></div>
                                    <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
                                    <div className="mt-8 grid grid-cols-3 gap-4">
                                        <div className="bg-gray-300 h-24 rounded"></div>
                                        <div className="bg-gray-300 h-24 rounded"></div>
                                        <div className="bg-gray-300 h-24 rounded"></div>
                                    </div>
                                </div>

                                {/* Overlay Stamps based on errors */}
                                {typographyCrimes > 0 && (
                                    <Stamp className="absolute top-8 left-8 -rotate-6">
                                        <p className="text-sm font-black">PADDING?</p>
                                        <p className="text-[10px] font-mono">NEVER HEARD OF HER</p>
                                    </Stamp>
                                )}

                                {colorClashes > 0 && (
                                    <Stamp className="absolute bottom-24 right-12 rotate-12">
                                        <p className="text-sm font-black">CONTRAST!</p>
                                        <p className="text-[10px] font-mono">MY EYES ARE BLEEDING</p>
                                    </Stamp>
                                )}
                            </div>

                            {/* Issues List with Fix Buttons */}
                            <div className="p-6 border-t-4 border-brutalist-black bg-white">
                                <h3 className="font-black text-lg uppercase mb-4 flex items-center gap-2">
                                    <AlertTriangle className="text-brutalist-red" size={20} />
                                    Issues Detected ({errors.length})
                                </h3>

                                <div className="space-y-4">
                                    {errors.map((error, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-red-50 border-l-4 border-brutalist-red p-4"
                                        >
                                            <div className="flex-1">
                                                <p className="font-bold text-brutalist-red text-xs mb-1">ISSUE #{idx + 1}</p>
                                                <p className="text-gray-800 text-sm">{error}</p>
                                            </div>
                                            {fixes[idx] && (
                                                <FixItButton code={fixes[idx]} />
                                            )}
                                        </motion.div>
                                    ))}

                                    {errors.length === 0 && (
                                        <div className="flex items-center gap-2 text-green-600 p-4 bg-green-50 border-l-4 border-green-500">
                                            <CheckCircle size={20} />
                                            <span className="font-bold">No major issues detected. Somehow.</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* The Verdict (Scorecard) */}
                    <div className="w-full lg:w-96">
                        <Scorecard
                            damageScore={damageScore}
                            typographyCrimes={typographyCrimes}
                            colorClashes={colorClashes}
                            alignmentErrors={alignmentErrors}
                            roast={roast}
                            tier={tier}
                            scansUsed={scans_used}
                            scansLimit={scans_limit}
                            errors={errors}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
