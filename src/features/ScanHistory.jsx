import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ExternalLink, Calendar, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getScanHistory, deleteScan } from '../services/api'; // We'll add these
import { cn } from '../utils';

export const ScanHistory = ({ onSelectScan }) => {
    const { user, isPremium } = useAuth();
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    const limit = isPremium ? 30 : 5;
    const usage = scans.length;
    const isOverLimit = usage >= limit;

    useEffect(() => {
        if (user) {
            loadHistory();
        }
    }, [user]);

    const loadHistory = async () => {
        try {
            setLoading(true);
            const data = await getScanHistory();
            setScans(data || []);
        } catch (err) {
            console.error('Failed to load history', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this scan?')) return;

        try {
            setDeletingId(id);
            await deleteScan(id);
            setScans(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            console.error('Failed to delete', err);
            alert('Failed to delete scan');
        } finally {
            setDeletingId(null);
        }
    };

    if (!user) return null;

    return (
        <section id="history" className="py-16 bg-white border-t-4 border-brutalist-black">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-black uppercase mb-2">History of Shame</h2>
                        <p className="text-gray-600">Your past roasts. Relive the trauma.</p>
                    </div>

                    {/* Usage Meter */}
                    <div className="bg-gray-100 p-3 border-2 border-brutalist-black">
                        <div className="flex justify-between text-xs font-bold mb-1 uppercase">
                            <span>Storage Usage</span>
                            <span className={isOverLimit ? "text-brutalist-red" : ""}>{usage} / {limit}</span>
                        </div>
                        <div className="w-48 h-3 bg-gray-300 border border-black relative overflow-hidden">
                            <div
                                className={cn(
                                    "h-full transition-all duration-500",
                                    isOverLimit ? "bg-brutalist-red" : "bg-brutalist-black"
                                )}
                                style={{ width: `${Math.min((usage / limit) * 100, 100)}%` }}
                            />
                        </div>
                        {isOverLimit && (
                            <div className="text-[10px] text-brutalist-red font-bold mt-1">
                                Storage limit reached!
                            </div>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin text-brutalist-black" size={40} />
                    </div>
                ) : scans.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300">
                        <p className="text-gray-500 font-medium">No roasts yet. Go judge something!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {scans.map((scan) => (
                            <motion.div
                                key={scan.id}
                                layout
                                onClick={() => onSelectScan(scan)}
                                className="group cursor-pointer relative bg-white border-2 border-brutalist-black p-4 shadow-hard-sm hover:shadow-hard-lg transition-all"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className={cn(
                                        "text-xs font-bold px-2 py-1 uppercase border border-black",
                                        scan.personality === 'gen_z' ? "bg-blue-100" :
                                            scan.personality === 'boomer' ? "bg-gray-100" : "bg-red-100"
                                    )}>
                                        {scan.personality}
                                    </span>
                                    <button
                                        onClick={(e) => handleDelete(e, scan.id)}
                                        disabled={deletingId === scan.id}
                                        className="text-gray-400 hover:text-brutalist-red p-1 transition-colors"
                                    >
                                        {deletingId === scan.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                    </button>
                                </div>

                                <h3 className="font-bold truncate mb-1" title={scan.url}>
                                    {scan.url.replace(/^https?:\/\/(www\.)?/, '')}
                                </h3>

                                <div className="flex items-center text-xs text-gray-500 mb-4 gap-2">
                                    <Calendar size={12} />
                                    {new Date(scan.created_at).toLocaleDateString()}
                                </div>

                                <div className="text-sm line-clamp-2 text-gray-600 italic border-l-2 border-gray-300 pl-2">
                                    "{scan.roast_data?.critique?.substring(0, 100)}..."
                                </div>

                                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                                    <span className="text-xs font-bold uppercase flex items-center gap-1 group-hover:text-brutalist-red transition-colors">
                                        View Report <ExternalLink size={12} />
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
