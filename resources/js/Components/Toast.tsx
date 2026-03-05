import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
    id: number;
    type: ToastType;
    message: string;
    exiting: boolean;
}

let nextId = 1;

const config: Record<ToastType, { border: string; icon: string; text: string; bg: string; svg: JSX.Element }> = {
    success: {
        border: 'border-emerald-500/40',
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        icon: 'text-emerald-400',
        svg: (
            <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    error: {
        border: 'border-red-500/40',
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        icon: 'text-red-400',
        svg: (
            <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    info: {
        border: 'border-blue-500/40',
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        icon: 'text-blue-400',
        svg: (
            <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
};

export default function Toast() {
    const { flash } = usePage<PageProps>().props;
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    function dismiss(id: number) {
        setToasts(prev =>
            prev.map(t => t.id === id ? { ...t, exiting: true } : t)
        );
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 300);
    }

    function addToast(type: ToastType, message: string) {
        const id = nextId++;
        setToasts(prev => [...prev, { id, type, message, exiting: false }]);
        setTimeout(() => dismiss(id), 4500);
    }

    useEffect(() => {
        if (flash.success) addToast('success', flash.success);
    }, [flash.success]);

    useEffect(() => {
        if (flash.error) addToast('error', flash.error);
    }, [flash.error]);

    useEffect(() => {
        if (flash.info) addToast('info', flash.info);
    }, [flash.info]);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 w-80">
            {toasts.map(toast => {
                const c = config[toast.type];
                return (
                    <div
                        key={toast.id}
                        className={`flex items-start gap-3 rounded-xl border ${c.border} ${c.bg} px-4 py-3 shadow-xl backdrop-blur-sm transition-all duration-300 ${toast.exiting ? 'opacity-0 translate-y-2 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}
                    >
                        <span className={c.icon}>{c.svg}</span>
                        <p className={`flex-1 text-sm leading-snug ${c.text}`}>{toast.message}</p>
                        <button
                            onClick={() => dismiss(toast.id)}
                            className={`flex-shrink-0 ${c.text} opacity-60 hover:opacity-100 transition-opacity`}
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
