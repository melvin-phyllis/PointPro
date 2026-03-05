import { AttendanceStatus } from '@/types';
import { getStatusConfig } from '@/utils/helpers';
import React from 'react';

interface BadgeProps {
    status: AttendanceStatus;
    showDot?: boolean;
    className?: string;
}

/**
 * Badge de statut de présence coloré.
 */
export default function Badge({ status, showDot = true, className = '' }: BadgeProps) {
    const config = getStatusConfig(status);

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bgColor} ${config.textColor} ${className}`}
        >
            {showDot && (
                <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: config.color }}
                />
            )}
            {config.label}
        </span>
    );
}
