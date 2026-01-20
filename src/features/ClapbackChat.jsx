import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { cn } from '../utils';
import { sendChatMessage } from '../services/api';

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
            <div className="relative bg-gray-200 p-1 h-14 border-2 border-brutalist-black w-full flex shadow-inner">
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
                            className="text-xl"
                            animate={{ scale: value === p.id ? 1.2 : 1 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                        >
                            {p.emoji}
                        </motion.span>
                    </button>
                ))}
            </div>

            {/* Current Mode Indicator */}
            <motion.div
                key={value}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-center"
            >
                <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 text-xs font-bold uppercase border-2 border-brutalist-black",
                    value === 'gen_z' && "bg-blue-100 text-blue-700",
                    value === 'boomer' && "bg-gray-100 text-gray-700",
                    value === 'ramsay' && "bg-red-100 text-brutalist-red"
                )}>
                    <Sparkles size={10} />
                    {value === 'gen_z' && "no cap mode activated"}
                    {value === 'boomer' && "corporate synergy mode"}
                    {value === 'ramsay' && "ABSOLUTE CHAOS MODE"}
                </span>
            </motion.div>
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

    const handleSend = async () => {
        if (!input.trim()) return;

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
                content: response.response || response.message || "I'm speechless... for once.",
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
                    className="fixed bottom-8 right-8 z-50 h-16 w-16 rounded-full bg-brutalist-black text-white hover:bg-brutalist-red p-0 flex items-center justify-center border-4 border-brutalist-black shadow-hard-lg animate-pulse-glow"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <MessageCircle size={28} />
                </motion.button>
            )}

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        layoutId="chat-bubble"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-8 right-8 z-50 w-full max-w-sm"
                    >
                        <div className="bg-white border-4 border-brutalist-black shadow-hard-xl flex flex-col h-[600px] overflow-hidden">
                            {/* Header */}
                            <div className="bg-brutalist-black p-4 flex items-center justify-between text-white border-b-4 border-brutalist-yellow">
                                <div>
                                    <h3 className="font-black uppercase tracking-tight text-lg flex items-center gap-2">
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

                            {/* Personality Toggle */}
                            <div className="bg-gray-50 p-4 border-b-2 border-brutalist-black">
                                <PersonalityToggle value={personality} onChange={setPersonality} />
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dots">
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {msg.role === 'ai' && (
                                            <div className="w-8 h-8 bg-brutalist-yellow border-2 border-brutalist-black flex items-center justify-center mr-2 flex-shrink-0">
                                                <span className="text-sm">{getAvatarEmoji(msg.personality)}</span>
                                            </div>
                                        )}
                                        <div className={cn(
                                            "max-w-[75%] p-3 border-2 border-brutalist-black text-sm",
                                            msg.role === 'user'
                                                ? "bg-brutalist-black text-white shadow-hard-sm"
                                                : "bg-white text-black shadow-hard-sm"
                                        )}>
                                            {msg.content}
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Typing Indicator */}
                                {isTyping && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex justify-start"
                                    >
                                        <div className="w-8 h-8 bg-brutalist-yellow border-2 border-brutalist-black flex items-center justify-center mr-2">
                                            <span className="text-sm">{getAvatarEmoji(personality)}</span>
                                        </div>
                                        <div className="bg-white border-2 border-brutalist-black p-3 shadow-hard-sm">
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 bg-brutalist-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <span className="w-2 h-2 bg-brutalist-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <span className="w-2 h-2 bg-brutalist-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Input */}
                            <div className="p-4 bg-white border-t-4 border-brutalist-black">
                                <div className="flex gap-2">
                                    <Input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Fight back..."
                                        className="h-12 text-sm py-2 border-2"
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    />
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            onClick={handleSend}
                                            className="h-12 w-12 bg-brutalist-yellow text-brutalist-black border-2 border-brutalist-black hover:bg-brutalist-red hover:text-white p-0 flex items-center justify-center"
                                        >
                                            <Send size={18} />
                                        </Button>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
