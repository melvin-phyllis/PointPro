import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
    const { asset_url } = usePage().props as { asset_url: string };
    const { data, setData, post, processing, errors, reset } = useForm({
        login: '',
        password: '',
        remember: false as boolean,
    });
    const [showPwd, setShowPwd] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <GuestLayout centered>
            <Head title="Connexion" />

            <div className="animate-fade-up w-full">
                {/* Header */}
                <div className="mb-8">
                    <img
                        src={`${asset_url}/Pointpro.png`}
                        alt="PointPro"
                        className="mb-4 h-12 w-auto object-contain"
                    />
                    <h1
                        className="text-2.5xl font-bold tracking-tight text-gray-900 sm:text-3xl"
                        style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.03em' }}
                    >
                        Bon retour
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Connectez-vous à votre espace PointPro pour gérer vos pointages.
                    </p>
                </div>

                {status && (
                    <div
                        className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-800"
                        role="alert"
                    >
                        <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
                    {/* Email / login */}
                    <div className="space-y-1.5">
                        <label htmlFor="login" className="block text-sm font-medium text-gray-700">
                            Email ou matricule
                        </label>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-gray-400">
                                <Mail size={18} strokeWidth={1.8} />
                            </span>
                            <input
                                id="login"
                                type="text"
                                value={data.login}
                                onChange={(e) => setData('login', e.target.value)}
                                required
                                autoFocus
                                autoComplete="username"
                                placeholder="email@exemple.com ou PPEMP-010"
                                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            />
                        </div>
                        <InputError message={errors.login} className="mt-1" />
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mot de passe
                            </label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-xs font-medium text-emerald-600 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-1 rounded"
                                >
                                    Mot de passe oublié ?
                                </Link>
                            )}
                        </div>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-gray-400">
                                <Lock size={18} strokeWidth={1.8} />
                            </span>
                            <input
                                id="password"
                                type={showPwd ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                autoComplete="current-password"
                                placeholder="••••••••"
                                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-12 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPwd((v) => !v)}
                                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:ring-inset rounded-r-xl"
                                tabIndex={-1}
                                aria-label={showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                            >
                                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <InputError message={errors.password} className="mt-1" />
                    </div>

                    {/* Remember me */}
                    <label className="flex cursor-pointer items-center gap-3 select-none">
                        <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked as false)}
                                className="peer sr-only"
                            />
                            <div
                                className={`h-5 w-5 rounded-md border-2 transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500/30 peer-focus-visible:ring-offset-1 ${
                                    data.remember
                                        ? 'border-emerald-500 bg-emerald-500'
                                        : 'border-gray-300 bg-white'
                                }`}
                            >
                                {data.remember && (
                                    <svg
                                        className="h-full w-full p-0.5 text-white"
                                        viewBox="0 0 14 14"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M3 7l3 3 5-6" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        <span className="text-sm text-gray-600">Se souvenir de moi</span>
                    </label>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="relative w-full overflow-hidden rounded-xl bg-gradient-to-b from-emerald-600 to-emerald-700 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:from-emerald-700 hover:to-emerald-800 hover:shadow-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {processing ? (
                            <span className="flex items-center justify-center gap-2">
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
                                Connexion…
                            </span>
                        ) : (
                            'Se connecter'
                        )}
                    </button>
                </form>

                <div className="mt-8 flex items-center gap-4">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-xs font-medium text-gray-400">ou</span>
                    <div className="h-px flex-1 bg-gray-200" />
                </div>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Pas encore client ?{' '}
                    <Link
                        href={route('quote.request')}
                        className="font-semibold text-emerald-600 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-1 rounded"
                    >
                        Demander un devis
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
