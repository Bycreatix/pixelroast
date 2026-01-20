import React from 'react';
import { cn } from '../../utils';

export const Input = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <input
            ref={ref}
            className={cn(
                'input-brutal',
                className
            )}
            {...props}
        />
    );
});

Input.displayName = 'Input';
