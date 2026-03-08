import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
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
        <GuestLayout>
            <Head title="Connexion" />

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em' }}>
                    Bon retour !
                </h1>
                <p className="mt-1.5 text-sm text-gray-500">Connectez-vous a votre espace PointPro</p>
            </div>

            {status && (
                <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                {/* Email / login */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Email ou matricule
                    </label>
                    <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-muted">
                            <Mail size={16} />
                        </span>
                        <input
                            type="text"
                            value={data.login}
                            onChange={(e) => setData('login', e.target.value)}
                            required
                            autoFocus
                            autoComplete="username"
                            placeholder="email@exemple.com ou PPEMP-010"
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                    </div>
                    <InputError message={errors.login} className="mt-1.5" />
                </div>

                {/* Password */}
                <div>
                    <div className="mb-1.5 flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Mot de passe</label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
                            >
                                Mot de passe oublie ?
                            </Link>
                        )}
                    </div>
                    <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-muted">
                            <Lock size={16} />
                        </span>
                        <input
                            type={showPwd ? 'text' : 'password'}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            autoComplete="current-password"
                            placeholder="••••••••"
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-11 text-sm text-gray-900 placeholder-gray-400 transition focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPwd(v => !v)}
                            className="absolute inset-y-0 right-3.5 flex items-center text-muted hover:text-gray-600"
                            tabIndex={-1}
                        >
                            {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                {/* Remember me */}
                <label className="flex cursor-pointer items-center gap-2.5 select-none">
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked as false)}
                            className="sr-only"
                        />
                        <div className={`h-4.5 w-4.5 h-[18px] w-[18px] rounded-[5px] border-2 transition-all ${
                            data.remember
                                ? 'border-emerald-500 bg-emerald-500'
                                : 'border-gray-300 bg-white'
                        }`}>
                            {data.remember && (
                                <svg className="h-full w-full p-[2px] text-white" viewBox="0 0 12 12" fill="none">
                                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                    className="w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-60"
                    style={{ background: processing ? '#6ee7b7' : 'linear-gradient(135deg, #059669 0%, #10B981 100%)' }}
                >
                    {processing ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                            Connexion…
                        </span>
                    ) : 'Se connecter'}
                </button>
            </form>

            <div className="mt-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-100" />
                <span className="text-xs text-muted">ou</span>
                <div className="h-px flex-1 bg-gray-100" />
            </div>

            <p className="mt-5 text-center text-sm text-gray-500">
                Pas encore de compte ?{' '}
                <Link href={route('register')} className="font-medium text-emerald-600 hover:text-emerald-700">
                    Creer un espace gratuitement
                </Link>
            </p>
        </GuestLayout>
    );
}
