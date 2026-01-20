import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils';

export const Stamp = ({ children, className, angle = -5, ...props }) => {
    return (
        <motion.div
            initial={{ scale: 2, opacity: 0, rotate: angle }}
            animate={{ scale: 1, opacity: 1, rotate: angle }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            className={cn(
                'absolute z-10 border-4 border-brutalist-red bg-brutalist-red/10 px-4 py-2 font-black text-brutalist-red backdrop-blur-sm',
                className
            )}
            style={{
                boxShadow: '4px 4px 0px 0px #FF0033',
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
};
