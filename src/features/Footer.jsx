import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Heart, Coffee, Github, Twitter, Linkedin, Zap } from 'lucide-react';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { label: 'Scan', id: 'hero' },
        { label: 'About', id: 'about' },
        { label: 'Pricing', id: 'pricing' },
        { label: 'Resume', id: 'resume' },
    ];

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer className="bg-brutalist-black text-white overflow-hidden">
            {/* Top Marquee */}
            <div className="border-y-4 border-brutalist-yellow bg-brutalist-yellow overflow-hidden">
                <div className="flex animate-marquee whitespace-nowrap py-3">
                    {[...Array(12)].map((_, i) => (
                        <span key={i} className="font-black text-brutalist-black mx-6 text-sm uppercase flex items-center gap-2">
                            <Flame size={14} /> ROAST • IMPROVE • REPEAT <Zap size={14} />
                        </span>
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <motion.div
                            className="flex items-center gap-2 mb-6"
                            whileHover={{ x: 5 }}
                        >
                            <span className="bg-brutalist-red text-white px-3 py-1 font-black text-xl tracking-tighter">
                                <Flame size={20} className="inline -mt-1" />
                            </span>
                            <span className="font-black text-3xl tracking-tighter">
                                Pixel<span className="text-brutalist-yellow">Roast</span>
                            </span>
                        </motion.div>

                        <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
                            A High-Performance Ego Destruction Engine. Powered by <span className="text-brutalist-yellow font-bold">Llama 4 Vision</span> & <span className="text-brutalist-red font-bold">Groq</span>. Frontend by React. <span className="italic">Trauma by Design.</span>
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {[
                                { icon: Github, href: 'https://github.com/goat1242/pixelroast' },
                                { icon: Twitter, href: '#' },
                                { icon: Linkedin, href: '#' },
                            ].map((social, idx) => (
                                <motion.a
                                    key={idx}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -3, rotate: -5 }}
                                    className="w-10 h-10 bg-white/10 border border-white/20 flex items-center justify-center hover:bg-brutalist-yellow hover:text-brutalist-black transition-colors"
                                >
                                    <social.icon size={18} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-black uppercase text-sm mb-4 text-brutalist-yellow">Quick Links</h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.id}>
                                    <button
                                        onClick={() => scrollToSection(link.id)}
                                        className="text-gray-400 hover:text-white hover:translate-x-2 transition-all inline-flex items-center gap-2 text-sm"
                                    >
                                        <span className="w-1 h-1 bg-brutalist-red rounded-full" />
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-black uppercase text-sm mb-4 text-brutalist-yellow">Legal</h3>
                        <ul className="space-y-2">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/10 my-12" />

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm font-mono flex items-center gap-2 flex-wrap justify-center">
                        <span>Made with</span>
                        <Heart size={14} className="text-brutalist-red fill-brutalist-red" />
                        <span>,</span>
                        <Coffee size={14} className="text-amber-500" />
                        <span>, and pure anxiety</span>
                    </p>

                    <p className="text-gray-600 text-xs font-mono">
                        © {currentYear} PixelRoast. No feelings were spared.
                    </p>
                </div>
            </div>
        </footer>
    );
};
