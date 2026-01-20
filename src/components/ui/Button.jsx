import React from 'react';
import { cn } from '../../utils';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {'primary' | 'secondary' | 'accent' | 'ghost'} [props.variant='primary']
 * @param {React.ComponentProps<'button'>} props
 */
export const Button = React.forwardRef(({ className, variant = 'primary', ...props }, ref) => {
    const variants = {
        primary: 'bg-white text-brutalist-black hover:bg-brutalist-gray',
        secondary: 'bg-brutalist-black text-white hover:bg-neutral-800',
        accent: 'bg-brutalist-red text-white hover:bg-red-700',
        ghost: 'bg-transparent shadow-none border-transparent hover:bg-brutalist-gray/20',
    };

    return (
        <button
            ref={ref}
            className={cn(
                'btn-brutal inline-flex items-center justify-center gap-2',
                variants[variant],
                className
            )}
            {...props}
        />
    );
});

Button.displayName = 'Button';
