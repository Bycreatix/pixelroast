import React from 'react';
import { Navbar } from './Navbar';

export const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-brutalist-white font-sans text-brutalist-black selection:bg-brutalist-yellow selection:text-brutalist-black">
            <Navbar />
            <main className="pt-0">
                {children}
            </main>
        </div>
    );
};

