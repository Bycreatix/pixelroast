import React from 'react';
import { Stamp } from '../components/ui/Stamp';
import { Scorecard } from '../components/ui/Scorecard';
import { FixItButton } from './FixItButton';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle } from 'lucide-react';

// Demo content for non-signed-in users
const DEMO_DATA = {
    roast: "This portfolio looks like someone discovered gradients in 2010 and never recovered. The font choices? Bold move using Comic Sans's sophisticated cousin.",
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
    scans_used: 1,
    scans_limit: 20
};

// Helper to clean markdown code blocks from text
const cleanMarkdown = (text) => {
    if (!text) return '';
    // Remove ```json and ``` markers
    let cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    // Try to parse as JSON if it looks like JSON
    if (cleaned.startsWith('{') || cleaned.startsWith('[')) {
        try {
            const parsed = JSON.parse(cleaned);
            // Return critique if it exists
            if (parsed.critique) return parsed.critique;
            if (parsed.message) return parsed.message;
            if (parsed.text) return parsed.text;
        } catch (e) {
            // Not valid JSON, return as is
        }
    }
    return cleaned;
};

// Helper to extract text from roast field (could be string or object)
const parseRoastText = (roast) => {
    if (!roast) return '';
    if (typeof roast === 'string') return cleanMarkdown(roast);
    // If roast is an object, try common field names
    if (typeof roast === 'object') {
        const text = roast.critique || roast.message || roast.text || roast.content;
        if (text) return cleanMarkdown(text);
        return cleanMarkdown(JSON.stringify(roast));
    }
    return cleanMarkdown(String(roast));
};

// Helper to extract errors array
const parseErrors = (data) => {
    if (Array.isArray(data.errors)) return data.errors;
    if (typeof data.errors === 'string') return [data.errors];
    // Check if roast object contains errors
    if (data.roast && typeof data.roast === 'object' && Array.isArray(data.roast.errors)) {
        return data.roast.errors;
    }
    return [];
};

// Helper to extract fixes array
const parseFixes = (data) => {
    if (Array.isArray(data.fixes)) return data.fixes;
    if (typeof data.fixes === 'string') return [data.fixes];
    // Check if roast object contains fixes
    if (data.roast && typeof data.roast === 'object' && Array.isArray(data.roast.fixes)) {
        return data.roast.fixes;
    }
    return [];
};

export const RoastView = ({ roastData, isDemo = false }) => {
    // Use demo data if no roastData and isDemo is true
    const displayData = roastData || (isDemo ? DEMO_DATA : null);

    if (!displayData) return null;

    // Parse data with fallbacks
    const roastText = parseRoastText(displayData.roast);
    const errors = parseErrors(displayData);
    const fixes = parseFixes(displayData);
    const { tier, url, scans_used, scans_limit, screenshot } = displayData;

    // Calculate damage score based on number of errors
    const damageScore = Math.min(99, 50 + (errors.length * 12));

    // Categorize errors
    const typographyCrimes = errors.filter(e =>
        String(e).toLowerCase().includes('font') ||
        String(e).toLowerCase().includes('text') ||
        String(e).toLowerCase().includes('typography')
    ).length || Math.max(1, Math.ceil(errors.length * 0.4));

    const colorClashes = errors.filter(e =>
        String(e).toLowerCase().includes('color') ||
        String(e).toLowerCase().includes('contrast') ||
        String(e).toLowerCase().includes('palette')
    ).length || Math.max(1, Math.ceil(errors.length * 0.3));

    const alignmentErrors = errors.filter(e =>
        String(e).toLowerCase().includes('align') ||
        String(e).toLowerCase().includes('layout') ||
        String(e).toLowerCase().includes('spacing') ||
        String(e).toLowerCase().includes('grid')
    ).length || Math.max(1, Math.ceil(errors.length * 0.3));

    // Get detected technology from roast text
    const detectTechnology = () => {
        const roastLower = roastText.toLowerCase();
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
                            {/* Screenshot Area */}
                            <div className="bg-gray-200 min-h-[300px] relative">
                                {screenshot ? (
                                    <img
                                        src={`data:image/jpeg;base64,${screenshot}`}
                                        alt="Website screenshot"
                                        className="w-full h-auto"
                                    />
                                ) : (
                                    <div className="p-6 space-y-4">
                                        <div className="bg-gray-300 h-8 w-1/3 rounded"></div>
                                        <div className="bg-gray-300 h-4 w-2/3 rounded"></div>
                                        <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
                                        <div className="mt-8 grid grid-cols-3 gap-4">
                                            <div className="bg-gray-300 h-24 rounded"></div>
                                            <div className="bg-gray-300 h-24 rounded"></div>
                                            <div className="bg-gray-300 h-24 rounded"></div>
                                        </div>
                                    </div>
                                )}

                                {/* Overlay Stamps */}
                                {errors.length > 0 && (
                                    <>
                                        <Stamp className="absolute top-8 left-8 -rotate-6">
                                            <p className="text-sm font-black">PADDING?</p>
                                            <p className="text-[10px] font-mono">NEVER HEARD OF HER</p>
                                        </Stamp>

                                        <Stamp className="absolute bottom-24 right-12 rotate-12">
                                            <p className="text-sm font-black">CONTRAST!</p>
                                            <p className="text-[10px] font-mono">MY EYES ARE BLEEDING</p>
                                        </Stamp>
                                    </>
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
                                                <p className="text-gray-800 text-sm">{String(error)}</p>
                                            </div>
                                            {fixes[idx] && (
                                                <FixItButton code={String(fixes[idx])} />
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
                            roast={roastText}
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
