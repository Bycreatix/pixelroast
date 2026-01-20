import React from 'react';
import { Crown, Sparkles, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';

export const UpgradeModal = ({ isOpen, onClose }) => {
    const handleUpgrade = () => {
        onClose();
        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Storage Full! 😱">
            <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brutalist-yellow border-2 border-brutalist-black shadow-hard rounded-full mb-2">
                    <Crown size={32} />
                </div>

                <h2 className="text-2xl font-black uppercase leading-tight">
                    You've reached your <br />
                    <span className="text-brutalist-red">5-scan limit</span>
                </h2>

                <p className="text-gray-600">
                    Your history is full. To roast more sites without deleting your precious memories (and trauma), you need to upgrade.
                </p>

                <div className="bg-gray-50 p-4 border-2 border-dashed border-gray-300 text-left">
                    <h4 className="font-bold mb-2 uppercase text-sm text-gray-500">Premium Benefits:</h4>
                    <ul className="space-y-2 text-sm">
                        <li className="flex gap-2 items-center">
                            <span className="bg-green-100 text-green-700 p-0.5"><Check size={12} /></span>
                            <span>Store up to <strong>30 scans</strong></span>
                        </li>
                        <li className="flex gap-2 items-center">
                            <span className="bg-green-100 text-green-700 p-0.5"><Check size={12} /></span>
                            <span>Uncap unlimited Clapback Chat</span>
                        </li>
                        <li className="flex gap-2 items-center">
                            <span className="bg-green-100 text-green-700 p-0.5"><Check size={12} /></span>
                            <span>Access Gordon Ramsay Mode</span>
                        </li>
                    </ul>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Button
                        onClick={onClose}
                        className="bg-white text-black border-2 border-black hover:bg-gray-100 justify-center h-12"
                    >
                        Delete Old Scans
                    </Button>
                    <Button
                        onClick={handleUpgrade}
                        className="flex items-center justify-center gap-2 bg-brutalist-yellow text-black border-2 border-black hover:bg-brutalist-red hover:text-white h-12"
                    >
                        <Sparkles size={16} />
                        Upgrade Now
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
