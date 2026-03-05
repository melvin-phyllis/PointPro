import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        login: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <GuestLayout>
            <Head title="Connexion" />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Connexion</h1>
                <p className="mt-1 text-sm text-gray-500">Accédez à votre espace PointPro</p>
            </div>

            {status && (
                <div className="mb-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-300">
                        Email ou matricule
                    </label>
                    <input
                        type="text"
                        value={data.login}
                        onChange={(e) => setData('login', e.target.value)}
                        required
                        autoFocus
                        autoComplete="username"
                        placeholder="ex: PPEMP-010 ou email@exemple.com"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <InputError message={errors.login} className="mt-1" />
                </div>

                <div>
                    <div className="mb-1.5 flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-300">Mot de passe</label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs text-emerald-400 hover:text-emerald-300"
                            >
                                Mot de passe oublié ?
                            </Link>
                        )}
                    </div>
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        autoComplete="current-password"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <InputError message={errors.password} className="mt-1" />
                </div>

                <label className="flex cursor-pointer items-center gap-2.5">
                    <input
                        type="checkbox"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked as false)}
                        className="h-4 w-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
                    />
                    <span className="text-sm text-gray-400">Se souvenir de moi</span>
                </label>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
                >
                    {processing ? 'Connexion…' : 'Se connecter'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
                Pas encore de compte ?{' '}
                <Link href={route('register')} className="text-emerald-400 hover:text-emerald-300">
                    Créer un espace gratuitement
                </Link>
            </p>
        </GuestLayout>
    );
}
