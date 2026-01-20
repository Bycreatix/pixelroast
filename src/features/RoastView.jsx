import React from 'react';
import { Scorecard } from '../components/ui/Scorecard';
import { Stamp } from '../components/ui/Stamp';
import { FixItButton } from './FixItButton';

export const RoastView = () => {
    return (
        <section className="py-12 bg-gray-50 border-y-4 border-brutalist-black">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* The Evidence (Website Screenshot) */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-black uppercase">Evidence #402</h2>
                            <span className="font-mono text-sm bg-red-100 text-brutalist-red px-2 py-1 border border-brutalist-red font-bold">
                                DETECTED TECHNOLOGY: REACT
                            </span>
                        </div>

                        <div className="relative border-4 border-brutalist-black bg-white shadow-hard-lg min-h-[600px] overflow-hidden group">
                            {/* Mock Website Content */}
                            <div className="p-8 opacity-50 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0">
                                <div className="h-12 w-32 bg-gray-300 mb-8" />
                                <div className="h-64 w-full bg-gray-200 mb-8" />
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="h-32 bg-gray-200" />
                                    <div className="h-32 bg-gray-200" />
                                    <div className="h-32 bg-gray-200" />
                                </div>
                            </div>

                            {/* Overlay Stamps */}
                            <Stamp className="top-20 left-10 rotate-12" angle={12}>
                                <p className="text-xl">PADDING?</p>
                                <p className="text-xs font-mono">NEVER HEARD OF HER</p>
                                <div className="mt-2">
                                    <FixItButton code="p-8 space-y-4" />
                                </div>
                            </Stamp>

                            <Stamp className="top-1/2 right-20 -rotate-6" angle={-6}>
                                <p className="text-lg">CONTRAST!</p>
                                <p className="text-xs font-mono">MY EYES ARE BLEEDING</p>
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
