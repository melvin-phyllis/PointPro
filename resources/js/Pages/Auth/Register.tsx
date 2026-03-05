import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

const PLANS = [
    {
        id: 'starter',
        name: 'Starter',
        price: 'Gratuit',
        desc: "Jusqu'à 10 employés",
        features: ['Pointage de base', '1 site', 'Rapports mensuels'],
        highlight: false,
    },
    {
        id: 'business',
        name: 'Business',
        price: '25 000 FCFA/mois',
        desc: "Jusqu'à 50 employés",
        features: ['Géolocalisation', 'Multi-sites', 'Rapports complets', 'Export Excel/PDF'],
        highlight: true,
        badge: 'Recommandé',
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: '75 000 FCFA/mois',
        desc: 'Employés illimités',
        features: ['Tout Business', 'API accès', 'Support prioritaire', 'SSO'],
        highlight: false,
    },
] as const;

export default function Register() {
    const [step, setStep] = useState<1 | 2>(1);

    const { data, setData, post, processing, errors } = useForm({
        company_name:          '',
        plan:                  'starter' as string,
        first_name:            '',
        last_name:             '',
        email:                 '',
        password:              '',
        password_confirmation: '',
    });

    const goToStep2: FormEventHandler = (e) => {
        e.preventDefault();
        if (data.company_name.trim()) setStep(2);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Créer votre espace" />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">
                    {step === 1 ? 'Créer votre espace' : 'Votre compte administrateur'}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    {step === 1
                        ? "Choisissez votre plan et configurez votre entreprise"
                        : "Les identifiants pour accéder à PointPro"}
                </p>

                {/* Stepper */}
                <div className="mt-4 flex items-center gap-2">
                    {([1, 2] as const).map((s) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                                step >= s ? 'bg-emerald-500 text-white' : 'bg-white/10 text-gray-500'
                            }`}>
                                {step > s ? '✓' : s}
                            </div>
                            {s < 2 && (
                                <div className={`h-px w-8 transition-colors ${step > s ? 'bg-emerald-500' : 'bg-white/10'}`} />
                            )}
                        </div>
                    ))}
                    <span className="ml-2 text-xs text-gray-500">
                        {step === 1 ? 'Entreprise & plan' : 'Compte admin'}
                    </span>
                </div>
            </div>

            {/* ── Étape 1 ── */}
            {step === 1 && (
                <form onSubmit={goToStep2} className="space-y-6">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-300">
                            Nom de votre entreprise <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.company_name}
                            onChange={(e) => setData('company_name', e.target.value)}
                            placeholder="Ex: SARL Tech Abidjan"
                            required
                            autoFocus
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <InputError message={errors.company_name} className="mt-1" />
                    </div>

                    <div>
                        <label className="mb-3 block text-sm font-medium text-gray-300">
                            Choisissez votre plan
                        </label>
                        <div className="space-y-3">
                            {PLANS.map((plan) => (
                                <label
                                    key={plan.id}
                                    className={`relative flex cursor-pointer rounded-xl border p-4 transition-all ${
                                        data.plan === plan.id
                                            ? 'border-emerald-500 bg-emerald-500/10'
                                            : plan.highlight
                                            ? 'border-white/20 bg-white/[0.02] hover:bg-white/5'
                                            : 'border-white/10 bg-white/[0.02] hover:bg-white/5'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="plan"
                                        value={plan.id}
                                        checked={data.plan === plan.id}
                                        onChange={() => setData('plan', plan.id)}
                                        className="sr-only"
                                    />
                                    <div className="flex w-full items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-white">{plan.name}</span>
                                                {'badge' in plan && plan.badge && (
                                                    <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
                                                        {plan.badge}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-0.5 text-xs text-gray-500">{plan.desc}</p>
                                            <ul className="mt-2 space-y-0.5">
                                                {plan.features.map((f) => (
                                                    <li key={f} className="flex items-center gap-1.5 text-xs text-gray-400">
                                                        <span className="text-emerald-500">✓</span> {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <p className="shrink-0 text-right text-sm font-semibold text-white">
                                            {plan.price}
                                        </p>
                                    </div>
                                    {data.plan === plan.id && (
                                        <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
                                            ✓
                                        </div>
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
                    >
                        Continuer →
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        Déjà un compte ?{' '}
                        <Link href={route('login')} className="text-emerald-400 hover:text-emerald-300">
                            Se connecter
                        </Link>
                    </p>
                </form>
            )}

            {/* ── Étape 2 ── */}
            {step === 2 && (
                <form onSubmit={submit} className="space-y-5">
                    {/* Résumé */}
                    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
                        <div>
                            <span className="text-gray-500">Entreprise : </span>
                            <span className="font-medium text-white">{data.company_name}</span>
                        </div>
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs capitalize text-emerald-400">
                            {data.plan}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-300">
                                Prénom <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                                required
                                autoFocus
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                            <InputError message={errors.first_name} className="mt-1" />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-300">
                                Nom <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                                required
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                            <InputError message={errors.last_name} className="mt-1" />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-300">
                            Email professionnel <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <InputError message={errors.email} className="mt-1" />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-300">
                            Mot de passe <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            autoComplete="new-password"
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <InputError message={errors.password} className="mt-1" />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-300">
                            Confirmer le mot de passe <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                            autoComplete="new-password"
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm font-medium text-gray-400 transition hover:bg-white/5"
                        >
                            ← Retour
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
                        >
                            {processing ? 'Création…' : 'Créer mon espace'}
                        </button>
                    </div>
                </form>
            )}
        </GuestLayout>
    );
}
