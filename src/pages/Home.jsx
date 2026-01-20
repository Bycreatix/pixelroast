import React from 'react';
import { HeroSection } from '../features/HeroSection';
import { PersonalitySelector } from '../features/PersonalitySelector';
import { RoastView } from '../features/RoastView';
import { ResumeUpload } from '../features/ResumeUpload';
import { ClapbackChat } from '../features/ClapbackChat';
import { AboutSection } from '../features/AboutSection';
import { PricingSection } from '../features/PricingSection';
import { Footer } from '../features/Footer';

const Home = () => {
    return (
        <>
            <div className="space-y-0">
                <HeroSection />
                <PersonalitySelector />
                <AboutSection />
                <PricingSection />

                {/* Divider */}
                <div className="h-4 bg-brutalist-black border-y-4 border-white my-0" />

                <RoastView />
                <section id="resume">
                    <ResumeUpload />
                </section>

                <ClapbackChat />
            </div>
            <Footer />
        </>
    );
};

export default Home;
