import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Skull, Heart, Coffee, Zap } from 'lucide-react';

export const AboutSection = () => {
    return (
        <section id="about" className="py-24 bg-brutalist-black text-white relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-4 bg-brutalist-yellow" />
            <div className="absolute bottom-0 left-0 w-full h-4 bg-brutalist-yellow" />

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 bg-dots-yellow" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-block bg-brutalist-yellow text-brutalist-black px-4 py-2 font-mono text-sm font-bold uppercase mb-6 rotate-2">
                        <AlertTriangle size={16} className="inline -mt-1 mr-1" />
                        Warning: Brutal Honesty Ahead
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black uppercase leading-none mb-6">
                        We Built This Because<br />
                        <span className="text-brutalist-yellow">Your Friends Are Lying To You.</span>
                    </h2>
                </motion.div>

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Quote Block */}
                    <div className="relative mb-12">
                        <div className="absolute -left-4 top-0 bottom-0 w-2 bg-brutalist-red" />
                        <blockquote className="pl-8 text-2xl md:text-3xl font-medium leading-relaxed text-gray-300">
                            "Nice portfolio!" is the most <span className="text-brutalist-yellow font-bold">dangerous phrase</span> in a designer's career. It's polite. It's safe. And it teaches you <span className="text-brutalist-red italic">absolutely nothing.</span>
                        </blockquote>
                    </div>

                    {/* Body Text */}
                    <div className="bg-white/5 border-2 border-white/20 p-8 backdrop-blur-sm mb-12">
                        <p className="text-lg md:text-xl leading-relaxed text-gray-300">
                            PixelRoast wasn't built to be nice. It was built to <span className="font-bold text-white">cure bad design</span> through the most effective teaching method known to man: <span className="bg-brutalist-red px-2 py-1 text-white font-bold">Shame.</span>
                        </p>

                        <div className="h-px bg-white/10 my-6" />

                        <p className="text-lg md:text-xl leading-relaxed text-gray-300">
                            We engineered a <span className="text-brutalist-yellow font-bold">multimodal AI stack</span> to do what your friends won't: look at your padding inconsistencies, your clashing typography, and your generic "About Me" section, and tell you exactly why you aren't getting hired.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-4">
                        <motion.div
                            whileHover={{ y: -5, rotate: -1 }}
                            className="bg-brutalist-yellow text-brutalist-black p-6 border-2 border-brutalist-black shadow-hard"
                        >
                            <Skull size={32} className="mb-4" />
                            <h3 className="font-black text-lg uppercase mb-2">Zero Mercy</h3>
                            <p className="text-sm font-medium">Our AI doesn't care about your feelings. Only your growth.</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5, rotate: 1 }}
                            className="bg-brutalist-red text-white p-6 border-2 border-brutalist-black shadow-hard"
                        >
                            <Zap size={32} className="mb-4" />
                            <h3 className="font-black text-lg uppercase mb-2">Instant Results</h3>
                            <p className="text-sm font-medium">Get roasted in seconds, not days. Powered by Groq's LPU.</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5, rotate: -1 }}
                            className="bg-white text-brutalist-black p-6 border-2 border-brutalist-black shadow-hard"
                        >
                            <Heart size={32} className="mb-4 text-brutalist-red" />
                            <h3 className="font-black text-lg uppercase mb-2">Tough Love</h3>
                            <p className="text-sm font-medium">We roast because we care. Every fix makes you better.</p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
