import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, LogOut } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    const linkSent = status === 'verification-link-sent';

    return (
        <GuestLayout>
            <Head title="Vérification de l'email" />

            <div className="animate-fade-up">
                {/* Header */}
                <div className="mb-8">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
                        <Mail className="h-6 w-6" strokeWidth={2} />
                    </div>
                    <h1
                        className="text-2.5xl font-bold tracking-tight text-gray-900 sm:text-3xl"
                        style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.03em' }}
                    >
                        Vérifiez votre email
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Avant de continuer, merci de confirmer votre adresse email en cliquant sur le lien que nous venons de vous envoyer. Si vous n'avez rien reçu, nous pouvons vous en renvoyer un.
                    </p>
                </div>

                {linkSent && (
                    <div
                        className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-800"
                        role="alert"
                    >
                        <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                        Un nouveau lien de vérification a été envoyé à l'adresse email que vous avez indiquée lors de l'inscription.
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-emerald-600 to-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:from-emerald-700 hover:to-emerald-800 hover:shadow-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed sm:w-auto"
                        >
                            {processing ? (
                                <>
                                    <svg
                                        className="h-4 w-4 animate-spin"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        aria-hidden
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        />
                                    </svg>
                                    Envoi en cours…
                                </>
                            ) : (
                                <>
                                    <Mail size={18} strokeWidth={2} />
                                    Renvoyer l'email de vérification
                                </>
                            )}
                        </button>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:ring-offset-2 sm:w-auto"
                        >
                            <LogOut size={18} strokeWidth={2} />
                            Se déconnecter
                        </Link>
                    </div>
                </form>

                <p className="mt-6 text-center text-xs text-gray-400">
                    Vérifiez aussi votre dossier spam si vous ne voyez pas notre email.
                </p>
            </div>
        </GuestLayout>
    );
}
