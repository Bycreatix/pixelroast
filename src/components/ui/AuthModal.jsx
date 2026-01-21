import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2, Mail, Lock, AlertCircle } from 'lucide-react';
import { Modal } from './Modal';

export const AuthModal = ({ isOpen, onClose, onSuccess }) => {
    const [isSignIn, setIsSignIn] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const { signIn, signUp, signInWithGoogle } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: authError } = isSignIn
                ? await signIn(email, password)
                : await signUp(email, password);

            if (authError) throw authError;

            // Success handling
            if (isSignIn) {
                if (onSuccess) onSuccess();
                onClose();
            } else {
                setShowSuccess(true);
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const { error } = await signInWithGoogle();
            if (error) throw error;
        } catch (err) {
            console.error('Google Auth error:', err);
            setError(err.message);
        }
    };

    if (showSuccess) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="Check Your Inbox!">
                <div className="text-center py-4 space-y-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <Mail className="text-blue-600" size={32} />
                    </div>
                    <div>
                        <p className="font-bold text-lg mb-2">Verification Link Sent</p>
                        <p className="text-gray-600 mb-4">
                            We sent a confirmation link to <span className="font-bold">{email}</span>.
                            Click it to activate your account and start roasting!
                        </p>
                        <p className="text-xs text-gray-400">
                            Check your spam folder if you don't see it.
                        </p>
                    </div>
                    <Button onClick={onClose} className="w-full btn-brutal-primary justify-center">
                        Got it!
                    </Button>
                </div>
            </Modal>
        );
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isSignIn ? "Sign In to Roast" : "Join the Roast Club"}
        >
            <div className="space-y-4">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 text-sm border-l-4 border-red-500 flex items-start gap-2">
                        <AlertCircle size={16} className="mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Google Login */}
                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center gap-2 bg-white border-2 border-brutalist-black p-2 font-bold hover:bg-gray-50 transition-colors"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                    Continue with Google
                </button>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase font-bold">Or with Email</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-brutal-primary justify-center"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (isSignIn ? 'Sign In' : 'Sign Up')}
                        </Button>
                    </div>

                    <div className="text-center text-sm pt-2">
                        <span className="text-gray-500">
                            {isSignIn ? "Don't have an account? " : "Already have an account? "}
                        </span>
                        <button
                            type="button"
                            onClick={() => setIsSignIn(!isSignIn)}
                            className="font-bold underline hover:text-brutalist-red"
                        >
                            {isSignIn ? 'Sign Up' : 'Sign In'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};
