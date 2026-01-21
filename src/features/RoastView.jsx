import React from 'react';
import { Scorecard } from '../components/ui/Scorecard';
import { Stamp } from '../components/ui/Stamp';
import { motion } from 'framer-motion';
import { Download, Share2 } from 'lucide-react';

export const RoastView = ({ roastData }) => {
    if (!roastData) return null;

    const { roast, errors, tier, screenshot } = roastData;

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'My PixelRoast Result',
                text: roast?.substring(0, 100) + '...',
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied!');
        }
    };

    return (
        <section id="roast-view" className="py-12 bg-gray-50 border-y-4 border-brutalist-black">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* The Evidence (Website Screenshot / Roast) */}
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                            <h2 className="text-2xl font-black uppercase">The Verdict</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-2 px-3 py-2 text-sm font-bold border-2 border-brutalist-black bg-white hover:bg-brutalist-yellow transition-colors"
                                >
                                    <Share2 size={16} />
                                    SHARE
                                </button>
                            </div>
                        </div>

                        <div className="relative border-4 border-brutalist-black bg-white shadow-hard-lg overflow-hidden">
                            {/* Roast Content */}
                            <div className="p-6 md:p-8">
                                <div className="prose prose-lg font-medium text-gray-800 mb-6 whitespace-pre-wrap">
                                    {roast}
                                </div>

                                {/* Issues List */}
                                {errors && errors.length > 0 && (
                                    <div className="space-y-3 mt-6">
                                        <h4 className="font-black text-sm uppercase text-gray-500">Issues Found:</h4>
                                        {errors.map((error, idx) => (
                                            <div key={idx} className="bg-red-50 border-l-4 border-brutalist-red p-3">
                                                <p className="font-bold text-brutalist-red text-xs mb-1">#{idx + 1}</p>
                                                <p className="text-gray-800 text-sm">{error}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Overlay Stamp */}
                            <Stamp className="top-4 right-4 rotate-12" angle={12}>
                                <p className="text-lg">ROASTED</p>
                            </Stamp>
                        </div>
                    </div>

                    {/* The Scorecard */}
                    <div className="w-full lg:w-80">
                        <Scorecard />
                    </div>
                </div>
            </div>
        </section>
    );
};
