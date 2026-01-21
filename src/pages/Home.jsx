import React, { useState } from 'react';
import { HeroSection } from '../features/HeroSection';
import { PersonalitySelector } from '../features/PersonalitySelector';
import { RoastView } from '../features/RoastView';
import { ResumeUpload } from '../features/ResumeUpload';
import { ClapbackChat } from '../features/ClapbackChat';
import { AboutSection } from '../features/AboutSection';
import { PricingSection } from '../features/PricingSection';
import { Footer } from '../features/Footer';
import { ScanHistory } from '../features/ScanHistory';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
    const [roastResult, setRoastResult] = useState(null);
    const { user } = useAuth();

    return (
        <div className="space-y-0">
            <HeroSection onRoastComplete={setRoastResult} />

            {/* History of Shame - right after Hero, only for logged in users */}
            {user && (
                <ScanHistory onSelectScan={(scan) => {
                    setRoastResult(scan.roast_data);
                    document.getElementById('roast-view')?.scrollIntoView({ behavior: 'smooth' });
                }} />
            )}

            {/* Roast Result - shows after a roast or when selecting from history */}
            <RoastView roastData={roastResult} />

            <PersonalitySelector />
            <AboutSection />
            <PricingSection />

            <section id="resume">
                <ResumeUpload />
            </section>

            <ClapbackChat />

            <Footer />
        </div>
    );
};

export default Home;
