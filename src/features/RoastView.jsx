import React from 'react';
import { Scorecard } from '../components/ui/Scorecard';
import { Stamp } from '../components/ui/Stamp';
import { FixItButton } from './FixItButton';
import { motion } from 'framer-motion';

export const RoastView = ({ roastData }) => {
    if (!roastData) return null;

    const { roast, errors, tier } = roastData;
    const isPremium = tier === 'premium';

    return (
        <section id="roast-view" className="py-12 bg-gray-50 border-y-4 border-brutalist-black">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* The Evidence (Website Screenshot) */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-black uppercase">Evidence #402</h2>
                            <span className="font-mono text-sm bg-red-100 text-brutalist-red px-2 py-1 border border-brutalist-red font-bold">
                                DETECTED TECHNOLOGY: TRASH 🗑️
                            </span>
                        </div>

                        <div className="relative border-4 border-brutalist-black bg-white shadow-hard-lg min-h-[600px] overflow-hidden group">
                            {/* Roast Content */}
                            <div className="p-8">
                                <h3 className="font-black text-2xl mb-4">THE VERDICT:</h3>
                                <div className="prose prose-lg font-medium text-gray-800 mb-8 whitespace-pre-wrap">
                                    {roast}
                                </div>

                                {/* Fixes List */}
                                <div className="space-y-4">
                                    {errors?.map((error, idx) => (
                                        <div key={idx} className="bg-red-50 border-l-4 border-brutalist-red p-4">
                                            <p className="font-bold text-brutalist-red text-sm mb-1">ISSUE #{idx + 1}</p>
                                            <p className="text-gray-800">{error}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Overlay Stamps */}
                            <Stamp className="top-20 right-10 rotate-12" angle={12}>
                                <p className="text-xl">ROASTED</p>
                                <p className="text-xs font-mono">EMOTIONAL DAMAGE: 100%</p>
                            </Stamp>
                        </div>
                    </div>

                    {/* The Verdict (Scorecard) */}
                    <div className="w-full lg:w-96">
                        <Scorecard />
                    </div>
                </div>
            </div>
        </section>
    );
};
