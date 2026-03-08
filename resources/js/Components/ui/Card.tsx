import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Carte avec fond sombre et bordure subtile.
 */
export default function Card({ children, className = '', padding = 'md' }: CardProps) {
    const paddingClasses = {
        none: '',
        sm:   'p-4',
        md:   'p-6',
        lg:   'p-8',
    };

    return (
        <div
            className={`rounded-xl border border-theme bg-surface shadow-lg ${paddingClasses[padding]} ${className}`}
        >
            {children}
        </div>
    );
}
