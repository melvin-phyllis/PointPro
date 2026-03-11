import GuestLayout from '@/Layouts/GuestLayout';
import { PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';

export default function SubscriptionExpired() {
    const { flash } = usePage<PageProps>().props;
    const message = flash?.error ?? "Votre abonnement a expiré. Veuillez renouveler votre abonnement.";

    return (
        <GuestLayout centered>
            <Head title="Accès suspendu" />
            <div className="animate-fade-up w-full text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 text-amber-500">
                    <AlertCircle size={32} strokeWidth={2} />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    Accès suspendu
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                    {message}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Link
                        href={route('home')}
                        className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                    >
                        Retour à l&apos;accueil
                    </Link>
                    <Link
                        href={route('login')}
                        className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-emerald-700"
                    >
                        Se connecter
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
