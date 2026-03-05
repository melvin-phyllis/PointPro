import { AttendanceStatus } from '@/types';

/**
 * Formater une date en français.
 */
export function formatDate(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year:    'numeric',
        month:   'long',
        day:     'numeric',
    });
}

/**
 * Formater une heure (HH:mm).
 */
export function formatTime(datetime: string | null | undefined): string {
    if (!datetime) return '—';
    // Si c'est déjà au format HH:mm, retourner tel quel
    if (/^\d{2}:\d{2}$/.test(datetime)) return datetime;
    const d = new Date(datetime);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Formater les minutes en heures et minutes (ex: 75 → "1h 15min").
 */
export function formatMinutes(minutes: number): string {
    if (minutes <= 0) return '0 min';
    const h   = Math.floor(minutes / 60);
    const min = minutes % 60;
    if (h === 0) return `${min} min`;
    if (min === 0) return `${h}h`;
    return `${h}h ${min}min`;
}

/**
 * Obtenir la couleur et le label du statut de présence.
 */
export function getStatusConfig(status: AttendanceStatus): {
    label: string;
    color: string;
    bgColor: string;
    textColor: string;
} {
    const configs: Record<AttendanceStatus, { label: string; color: string; bgColor: string; textColor: string }> = {
        present:  { label: 'Présent',       color: '#10B981', bgColor: 'bg-emerald-500/20', textColor: 'text-emerald-400' },
        late:     { label: 'En retard',     color: '#F59E0B', bgColor: 'bg-amber-500/20',   textColor: 'text-amber-400'   },
        absent:   { label: 'Absent',        color: '#EF4444', bgColor: 'bg-red-500/20',      textColor: 'text-red-400'     },
        half_day: { label: 'Demi-journée',  color: '#8B5CF6', bgColor: 'bg-violet-500/20',  textColor: 'text-violet-400'  },
        excused:  { label: 'Excusé',        color: '#6B7280', bgColor: 'bg-gray-500/20',    textColor: 'text-gray-400'    },
    };
    return configs[status] ?? configs.absent;
}

/**
 * Obtenir les initiales d'un nom complet.
 */
export function getInitials(fullName: string): string {
    return fullName
        .split(' ')
        .map(n => n[0]?.toUpperCase() ?? '')
        .slice(0, 2)
        .join('');
}

/**
 * Tronquer un texte à une longueur maximale.
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '…';
}

/**
 * Formater un pourcentage.
 */
export function formatPercent(value: number): string {
    return `${value.toFixed(1)}%`;
}
