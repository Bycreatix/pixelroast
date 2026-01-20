import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            checkPremiumStatus(session?.user);
            setLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            checkPremiumStatus(session?.user);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const checkPremiumStatus = async (currentUser) => {
        if (!currentUser) {
            setIsPremium(false);
            return;
        }
        // In a real app, you'd check a 'subscriptions' table or 'is_premium' metadata
        // For now, we'll check user_metadata or default to false
        setIsPremium(currentUser.user_metadata?.is_premium || false);
    };

    const signUp = (email, password) => {
        return supabase.auth.signUp({ email, password });
    };

    const signIn = (email, password) => {
        return supabase.auth.signInWithPassword({ email, password });
    };

    const signOut = () => {
        return supabase.auth.signOut();
    };

    const value = {
        user,
        isPremium,
        signUp,
        signIn,
        signOut,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
