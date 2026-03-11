import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function QuoteRequestThankYou() {
    return (
        <GuestLayout centered>
            <Head title="Demande envoyée" />

            <div className="animate-fade-up text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-8 w-8" strokeWidth={2} />
                </div>
                <h1
                    className="text-2.5xl font-bold tracking-tight text-gray-900 sm:text-3xl"
                    style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.03em' }}
                >
                    Demande bien reçue
                </h1>
                <p className="mt-4 max-w-sm mx-auto text-sm leading-relaxed text-gray-600">
                    Vos informations ont bien été prises en compte. Un conseiller PointPro vous contactera bientôt pour vous proposer une offre adaptée à vos besoins.
                </p>
                <p className="mt-2 text-xs text-gray-500">
                    Pensez à vérifier votre boîte de réception et vos spams si nous vous envoyons un email.
                </p>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:ring-offset-2"
                    >
                        Retour à l'accueil
                    </Link>
                    <Link
                        href={route('login')}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-emerald-600 to-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                        Se connecter
                        <ArrowRight size={18} strokeWidth={2} />
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
