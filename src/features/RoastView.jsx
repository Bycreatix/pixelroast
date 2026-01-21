import React from 'react';
import { Scorecard } from '../components/ui/Scorecard';
import { Stamp } from '../components/ui/Stamp';
import { motion } from 'framer-motion';

// Demo content for non-signed-in users
const DEMO_DATA = {
    roast: "This portfolio looks like someone discovered gradients in 2010 and never recovered. The font choices? Bold move using Comic Sans's sophisticated cousin. And that hero section? It's giving 'I watched one YouTube tutorial.'",
    errors: [
        "Typography: Using 47 different font sizes is not 'dynamic design'",
        "Colors: Neon pink and dark brown together is a hate crime",
        "Layout: That grid system is having an identity crisis"
    ],
    tier: 'free',
    technology: 'REACT'
};

export const RoastView = ({ roastData, isDemo = false }) => {
    // Use demo data if no roastData and isDemo is true
    const displayData = roastData || (isDemo ? DEMO_DATA : null);

    if (!displayData) return null;

    const { roast, errors, tier, technology } = displayData;

    return (
        <section id="roast-view" className="py-12 bg-gray-50 border-y-4 border-brutalist-black">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* The Evidence (Website Screenshot) */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-black uppercase">EVIDENCE #402</h2>
                            <span className="font-mono text-xs bg-brutalist-yellow text-black px-3 py-1 border-2 border-brutalist-black font-bold">
                                DETECTED TECHNOLOGY: {technology || 'UNKNOWN'}
                            </span>
                        </div>

                        <div className="relative border-4 border-brutalist-black bg-white shadow-hard-lg min-h-[500px] overflow-hidden">
                            {/* Mock Screenshot Area */}
                            <div className="bg-gray-200 h-full min-h-[500px] relative">
                                {/* Skeleton placeholder blocks */}
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

                                {/* Overlay Stamps */}
                                <Stamp className="absolute top-8 left-8 -rotate-6">
                                    <p className="text-sm font-black">PADDING?</p>
                                    <p className="text-[10px] font-mono">NEVER HEARD OF HER</p>
                                </Stamp>

                                <Stamp className="absolute bottom-24 right-12 rotate-12">
                                    <p className="text-sm font-black">CONTRAST!</p>
                                    <p className="text-[10px] font-mono">MY EYES ARE BLEEDING</p>
                                </Stamp>
                            </div>
                        </div>
                    </div>

                    {/* The Verdict (Scorecard) */}
                    <div className="w-full lg:w-96">
                        <Scorecard
                            roast={roast}
                            errors={errors}
                            isDemo={isDemo}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
