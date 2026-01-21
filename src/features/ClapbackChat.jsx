import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Sparkles, Loader2, Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { cn } from '../utils';
import { sendChatMessage } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/ui/AuthModal';

// Premium 3-State Toggle Switch
const PersonalityToggle = ({ value, onChange }) => {
    const personalities = [
        { id: 'gen_z', emoji: '🧢', label: 'Zoomer', color: 'bg-blue-500' },
        { id: 'boomer', emoji: '👔', label: 'Boss', color: 'bg-gray-600' },
        { id: 'ramsay', emoji: '🔥', label: 'Ramsay', color: 'bg-brutalist-red' }
    ];

    const currentIndex = personalities.findIndex(p => p.id === value);

    return (
        <div className="relative">
            {/* Labels */}
            <div className="flex justify-between mb-2 px-1">
                {personalities.map((p) => (
                    <span
                        key={p.id}
                        className={cn(
                            "text-xs font-bold uppercase transition-all",
                            value === p.id ? "text-brutalist-black" : "text-gray-400"
                        )}
                    >
                        {p.label}
                    </span>
                ))}
            </div>

            {/* Switch Track */}
            <div className="relative bg-gray-200 p-1 h-12 border-2 border-brutalist-black w-full flex shadow-inner">
                {/* Sliding Background */}
                <motion.div
                    className={cn(
                        "absolute top-1 bottom-1 w-1/3 border-2 border-brutalist-black shadow-md z-10",
                        personalities[currentIndex]?.color || 'bg-blue-500'
                    )}
                    animate={{
                        left: `calc(${currentIndex * 33.33}% + 4px)`,
                    }}
                    transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
                    style={{ width: 'calc(33.33% - 8px)' }}
                />

                {/* Buttons */}
                {personalities.map((p, idx) => (
                    <button
                        key={p.id}
                        onClick={() => onChange(p.id)}
                        className={cn(
                            "flex-1 relative z-20 flex flex-col items-center justify-center gap-0.5 transition-all",
                            value === p.id ? "text-white" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <motion.span
                            className="text-lg"
                            animate={{ scale: value === p.id ? 1.2 : 1 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                        >
                            {p.emoji}
                        </motion.span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export const ClapbackChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [personality, setPersonality] = useState('gen_z');
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'You call that a button? My grandma uses more padding than that. 💀', personality: 'gen_z' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    const { user } = useAuth();

    const handleSend = async () => {
        if (!input.trim()) return;

        // Check auth before sending
        if (!user) {
            setShowAuthModal(true);
            return;
        }

        const userMessage = input;
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInput('');
        setIsTyping(true);

        try {
            // Build history for context
            const history = messages.map(m => ({
                role: m.role === 'ai' ? 'assistant' : 'user',
                content: m.content
            }));

            const response = await sendChatMessage(userMessage, history, {}, personality);

            setMessages(prev => [...prev, {
                role: 'ai',
                content: response.reply || response.response || response.message || "I'm speechless... for once.",
                personality
            }]);
        } catch (error) {
            console.error('Chat error:', error);
            // Fallback to personality-based response on error
            const fallbacks = {
                gen_z: "bestie the vibes are off rn, try again 💀",
                boomer: "Let's take this offline and circle back later.",
                ramsay: "THE SERVER IS RAW! Try again, you donut!"
            };
            setMessages(prev => [...prev, {
                role: 'ai',
                content: fallbacks[personality],
                personality
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const getAvatarEmoji = (msgPersonality) => {
        const emojis = { gen_z: '🧢', boomer: '👔', ramsay: '🔥' };
        return emojis[msgPersonality] || '🤖';
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <motion.button
                    layoutId="chat-bubble"
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-4 right-4 z-50 h-14 w-14 md:h-16 md:w-16 rounded-full bg-brutalist-black text-white hover:bg-brutalist-red p-0 flex items-center justify-center border-4 border-brutalist-black shadow-hard-lg"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <MessageCircle size={24} />
                </motion.button>
            )}

            {/* Chat Panel - Mobile responsive */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        layoutId="chat-bubble"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-0 right-0 md:bottom-4 md:right-4 z-50 w-full md:max-w-sm"
                    >
                        <div className="bg-white border-4 border-brutalist-black shadow-hard-xl flex flex-col h-[80vh] md:h-[500px] max-h-[600px] overflow-hidden">
                            {/* Header */}
                            <div className="bg-brutalist-black p-3 flex items-center justify-between text-white border-b-4 border-brutalist-yellow shrink-0">
                                <div>
                                    <h3 className="font-black uppercase tracking-tight text-base flex items-center gap-2">
                                        <span className="text-brutalist-yellow">⚡</span>
                                        Clapback Engine
                                    </h3>
                                    <p className="text-xs font-mono text-gray-400">Defend your trash design</p>
                                </div>
                                <motion.button
                                    onClick={() => setIsOpen(false)}
                                    className="hover:text-brutalist-red transition-colors p-1 hover:bg-white/10 rounded"
                                    whileHover={{ rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X size={24} />
                                </motion.button>
                            </div>

                            {/* Personality Toggle - Compact */}
                            <div className="bg-gray-50 p-3 border-b-2 border-brutalist-black shrink-0">
                                <PersonalityToggle value={personality} onChange={setPersonality} />
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-dots min-h-0">
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "flex gap-2",
                                            msg.role === 'user' ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        {msg.role === 'ai' && (
                                            <div className="w-8 h-8 bg-brutalist-black text-white flex items-center justify-center border-2 border-brutalist-black text-sm shrink-0">
                                                {getAvatarEmoji(msg.personality)}
                                            </div>
                                        )}
                                        <div className={cn(
                                            "max-w-[75%] p-3 border-2 border-brutalist-black text-sm",
                                            msg.role === 'user'
                                                ? "bg-brutalist-yellow"
                                                : "bg-white shadow-hard"
                                        )}>
                                            {msg.content}
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Typing indicator */}
                                {isTyping && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex gap-2"
                                    >
                                        <div className="w-8 h-8 bg-brutalist-black text-white flex items-center justify-center border-2 border-brutalist-black text-sm">
                                            {getAvatarEmoji(personality)}
                                        </div>
                                        <div className="bg-white p-3 border-2 border-brutalist-black shadow-hard flex items-center gap-1">
                                            <Loader2 size={14} className="animate-spin" />
                                            <span className="text-xs font-mono text-gray-500">thinking...</span>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Auth Required Message */}
                            {!user && (
                                <div className="bg-yellow-50 border-t-2 border-brutalist-black p-3 shrink-0">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Lock size={16} className="text-brutalist-red" />
                                        <span className="font-bold">Sign in to use the chat</span>
                                    </div>
                                </div>
                            )}

                            {/* Input */}
                            <div className="p-3 bg-gray-100 border-t-2 border-brutalist-black flex gap-2 shrink-0">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={user ? "Defend yourself..." : "Sign in to chat..."}
                                    className="flex-1 px-3 py-2 border-2 border-brutalist-black font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brutalist-yellow"
                                    disabled={!user}
                                />
                                <motion.button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isTyping}
                                    className="bg-brutalist-black text-white p-2 border-2 border-brutalist-black hover:bg-brutalist-red disabled:opacity-50 disabled:cursor-not-allowed"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Send size={18} />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSuccess={() => setShowAuthModal(false)}
            />
        </>
    );
};
