import React from 'react';
import { Card } from './Card';

export const Scorecard = () => {
    return (
        <Card className="h-full bg-brutalist-black text-white p-0 overflow-hidden sticky top-24">
            <div className="p-6 border-b-2 border-white/20 bg-neutral-900">
                <h3 className="text-2xl uppercase tracking-widest text-brutalist-red font-black">
                    Damage Report
                </h3>
            </div>

            <div className="p-6 space-y-8">
                <div className="text-center">
                    <p className="text-sm font-mono text-gray-400 mb-2 uppercase">Emotional Damage</p>
                    <div className="relative inline-block">
                        <span className="text-6xl font-black text-brutalist-red">92%</span>
                        <span className="absolute -top-2 -right-6 text-2xl animate-pulse">💔</span>
                    </div>
                    <p className="text-xs font-mono text-red-500 mt-2">CRITICAL LEVELS DETECTED</p>
                </div>

                <div className="space-y-4 font-mono text-sm">
                    <div className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-gray-400">Typography Crimes</span>
                        <span className="text-white font-bold">14</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-gray-400">Color Clashes</span>
                        <span className="text-white font-bold">8</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-gray-400">Alignment Errors</span>
                        <span className="text-white font-bold">Over 9000</span>
                    </div>
                </div>

                <div className="bg-white/5 p-4 border border-white/10">
                    <p className="text-brutalist-red font-bold text-xs uppercase mb-2">Verdict</p>
                    <p className="text-lg font-bold leading-tight">
                        "It looks like a wireframe that started drinking at noon."
                    </p>
                </div>
            </div>

            <div className="p-4 bg-red-900/20 border-t border-white/10">
                <button className="w-full py-3 bg-white text-black font-black uppercase tracking-tight hover:bg-brutalist-red hover:text-white transition-colors">
                    Download Shame.pdf
                </button>
            </div>
        </Card>
    );
};
