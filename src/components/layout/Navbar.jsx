import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Menu, X, Zap, Flame } from 'lucide-react';

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMobileMenuOpen(false);
    };

    const navLinks = [
        { label: 'Scan', id: 'hero' },
        { label: 'About', id: 'about' },
        { label: 'Pricing', id: 'pricing' },
        { label: 'Resume', id: 'resume' },
    ];

    return (
        <header className={`border-b-4 border-brutalist-black bg-white sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'shadow-hard' : ''}`}>
            <div className="container mx-auto flex h-20 items-center justify-between px-4">
                {/* Logo */}
                <motion.div
                    className="flex items-center gap-2 cursor-pointer group"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => scrollToSection('hero')}
                >
                    <span className="bg-brutalist-black text-white px-3 py-1 font-black text-xl tracking-tighter group-hover:bg-brutalist-red transition-colors">
                        <Flame size={20} className="inline -mt-1" />
                    </span>
                    <span className="font-black text-2xl tracking-tighter">
                        Pixel<span className="text-brutalist-red">Roast</span>
                    </span>
                </motion.div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-8 font-bold uppercase tracking-tight">
                    {navLinks.map((link) => (
                        <button
                            key={link.id}
                            onClick={() => scrollToSection(link.id)}
                            className="relative hover:text-brutalist-red transition-colors group"
                        >
                            {link.label}
                            <span className="absolute bottom-0 left-0 w-0 h-1 bg-brutalist-yellow group-hover:w-full transition-all duration-300" />
                        </button>
                    ))}
                </nav>

                {/* CTA Button */}
                <div className="hidden md:flex items-center gap-4">
                    <a
                        href="https://github.com/goat1242/pixelroast"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 font-bold hover:text-brutalist-red transition-colors"
                    >
                        GITHUB <ExternalLink size={16} strokeWidth={3} />
                    </a>
                    <motion.button
                        className="btn-brutal-yellow flex items-center gap-2"
                        whileHover={{ rotate: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => scrollToSection('hero')}
                    >
                        <Zap size={18} strokeWidth={3} />
                        START ROAST
                    </motion.button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 border-2 border-brutalist-black"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden bg-brutalist-yellow border-t-4 border-brutalist-black overflow-hidden"
                    >
                        <nav className="flex flex-col p-4 gap-2">
                            {navLinks.map((link) => (
                                <button
                                    key={link.id}
                                    onClick={() => scrollToSection(link.id)}
                                    className="text-left font-bold uppercase py-3 px-4 hover:bg-brutalist-black hover:text-white transition-colors border-2 border-brutalist-black"
                                >
                                    {link.label}
                                </button>
                            ))}
                            <button
                                onClick={() => scrollToSection('hero')}
                                className="btn-brutal-primary mt-2 flex items-center justify-center gap-2"
                            >
                                <Zap size={18} /> START ROAST
                            </button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};
