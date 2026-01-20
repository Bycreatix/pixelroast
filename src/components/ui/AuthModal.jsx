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

    const { signIn, signUp } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: authError } = isSignIn
                ? await signIn(email, password)
                : await signUp(email, password);

            if (authError) throw authError;

            // Success
            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            console.error('Auth error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isSignIn ? "Sign In to Roast" : "Join the Roast Club"}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 text-sm border-l-4 border-red-500 flex items-start gap-2">
                        <AlertCircle size={16} className="mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

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
        </Modal>
    );
};
