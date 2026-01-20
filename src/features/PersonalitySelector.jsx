import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { cn } from '../utils';

const personalities = [
    {
        id: 'gen_z',
        title: 'The Zoomer',
        emoji: '🧢',
        desc: 'Slang-heavy. "This padding is giving depression, no cap."'
    },
    {
        id: 'boomer',
        title: 'The Boss',
        emoji: '👔',
        desc: 'Corporate jargon. "Let\'s circle back on why this is unusable."'
    },
    {
        id: 'ramsay',
        title: 'Chef Ramsay',
        emoji: '🤬',
        desc: 'Pure rage. "THIS CSS IS RAW! IT\'S FROZEN!"'
    }
];

export const PersonalitySelector = () => {
    const [selected, setSelected] = useState('gen_z'); // Default

    return (
        <section className="py-12">
            <h2 className="text-center text-3xl mb-8 uppercase">Choose Your Torment</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {personalities.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => setSelected(p.id)}
                        className="group text-left"
                    >
                        <Card className={cn(
                            "h-full transition-all duration-200 hover:-translate-y-2 hover:shadow-hard-lg",
                            selected === p.id
                                ? "bg-brutalist-black text-white ring-4 ring-brutalist-red ring-offset-4 ring-offset-white"
                                : "hover:border-brutalist-red"
                        )}>
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block origin-left">{p.emoji}</div>
                            <h3 className="text-xl mb-2">{p.title}</h3>
                            <p className={cn(
                                "font-mono text-sm leading-relaxed",
                                selected === p.id ? "text-gray-300" : "text-gray-600"
                            )}>
                                {p.desc}
                            </p>
                        </Card>
                    </button>
                ))}
            </div>
        </section>
    );
};
