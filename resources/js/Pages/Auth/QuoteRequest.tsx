import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, Building2, Mail, MessageSquare, Phone, User } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const PLANS = [
    { id: 'starter', name: 'Starter', price: 'Gratuit', desc: "Jusqu'à 10 employés", highlight: false },
    { id: 'business', name: 'Business', price: '25 000 FCFA/mois', desc: "Jusqu'à 50 employés", highlight: true, badge: 'Recommandé' },
    { id: 'enterprise', name: 'Enterprise', price: '75 000 FCFA/mois', desc: 'Employés illimités', highlight: false },
] as const;

const STEPS = [
    { num: 1, title: 'Entreprise & forfait' },
    { num: 2, title: 'Coordonnées' },
    { num: 3, title: 'Message' },
];

export default function QuoteRequest() {
    const [step, setStep] = useState(1);
    const { data, setData, post, processing, errors } = useForm({
        company_name: '',
        plan: 'business' as string,
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        message: '',
    });

    const canGoStep2 = data.company_name.trim() !== '';
    const canGoStep3 = data.first_name.trim() !== '' && data.last_name.trim() !== '' && data.email.trim() !== '';

    const goNext: FormEventHandler = (e) => {
        e.preventDefault();
        if (step === 1 && canGoStep2) setStep(2);
        else if (step === 2 && canGoStep3) setStep(3);
    };

    const goBack = () => {
        if (step === 2) setStep(1);
        if (step === 3) setStep(2);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('quote.request.store'));
    };

    return (
        <GuestLayout centered>
            <Head title="Demande de devis" />

            <div className="animate-fade-up w-full">
                {/* Stepper */}
                <div className="mb-8 flex items-center justify-center gap-2">
                    {STEPS.map((s, i) => (
                        <div key={s.num} className="flex items-center">
                            <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                                    step >= s.num ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
                                }`}
                            >
                                {step > s.num ? '✓' : s.num}
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`mx-1 h-0.5 w-6 sm:w-10 ${step > s.num ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="mb-6 text-center">
                    <h1
                        className="text-2xl font-bold tracking-tight text-gray-900 sm:text-2.5xl"
                        style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.03em' }}
                    >
                        {step === 1 && 'Votre entreprise'}
                        {step === 2 && 'Vos coordonnées'}
                        {step === 3 && 'Un dernier détail'}
                    </h1>
                    <p className="mt-1.5 text-sm text-gray-500">
                        {step === 1 && 'Choisissez votre forfait. Un conseiller vous contactera pour personnaliser l\'offre.'}
                        {step === 2 && 'Comment vous joindre pour la suite.'}
                        {step === 3 && 'Optionnel : précisez vos besoins ou questions.'}
                    </p>
                </div>

                {/* ─── Étape 1 : Entreprise + Forfait ─── */}
                {step === 1 && (
                    <form onSubmit={goNext} className="space-y-5">
                        <div>
                            <label htmlFor="company_name" className="mb-1.5 block text-sm font-medium text-gray-700">
                                Nom de l'entreprise <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-gray-400">
                                    <Building2 size={18} strokeWidth={1.8} />
                                </span>
                                <input
                                    id="company_name"
                                    type="text"
                                    value={data.company_name}
                                    onChange={(e) => setData('company_name', e.target.value)}
                                    required
                                    autoFocus
                                    placeholder="Ex : SARL Tech Abidjan"
                                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                />
                            </div>
                            <InputError message={errors.company_name} className="mt-1" />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Forfait souhaité <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-2">
                                {PLANS.map((plan) => (
                                    <label
                                        key={plan.id}
                                        className={`relative flex cursor-pointer rounded-xl border p-3.5 transition-all ${
                                            data.plan === plan.id ? 'border-emerald-500 bg-emerald-50/80' : 'border-gray-200 bg-white hover:border-gray-300'
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
                                        <div className="flex w-full items-center justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <span className="font-semibold text-gray-900">{plan.name}</span>
                                                {'badge' in plan && plan.badge && (
                                                    <span className="ml-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
                                                        {plan.badge}
                                                    </span>
                                                )}
                                                <p className="mt-0.5 text-xs text-gray-500">{plan.desc}</p>
                                            </div>
                                            <span className="shrink-0 text-sm font-semibold text-gray-700">{plan.price}</span>
                                        </div>
                                        {data.plan === plan.id && (
                                            <div className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
                                                ✓
                                            </div>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={!canGoStep2}
                            className="w-full rounded-xl bg-gradient-to-b from-emerald-600 to-emerald-700 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            Continuer <ArrowRight size={18} strokeWidth={2} />
                        </button>
                    </form>
                )}

                {/* ─── Étape 2 : Coordonnées ─── */}
                {step === 2 && (
                    <form onSubmit={goNext} className="space-y-5">
                        <div className="rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-sm">
                            <span className="text-gray-500">Entreprise : </span>
                            <span className="font-medium text-gray-900">{data.company_name}</span>
                            <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium capitalize text-emerald-700">
                                {data.plan}
                            </span>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">Prénom <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-gray-400">
                                        <User size={18} strokeWidth={1.8} />
                                    </span>
                                    <input
                                        id="first_name"
                                        type="text"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        required
                                        autoFocus
                                        className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 shadow-sm transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                </div>
                                <InputError message={errors.first_name} className="mt-1" />
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Nom <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-gray-400">
                                        <User size={18} strokeWidth={1.8} />
                                    </span>
                                    <input
                                        id="last_name"
                                        type="text"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        required
                                        className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 shadow-sm transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                </div>
                                <InputError message={errors.last_name} className="mt-1" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email professionnel <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-gray-400">
                                    <Mail size={18} strokeWidth={1.8} />
                                </span>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    placeholder="contact@entreprise.com"
                                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                />
                            </div>
                            <InputError message={errors.email} className="mt-1" />
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Téléphone</label>
                            <div className="relative">
                                <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-gray-400">
                                    <Phone size={18} strokeWidth={1.8} />
                                </span>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="+225 07 00 00 00 00"
                                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={goBack}
                                className="flex-1 rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            >
                                Retour
                            </button>
                            <button
                                type="submit"
                                disabled={!canGoStep3}
                                className="flex-1 rounded-xl bg-gradient-to-b from-emerald-600 to-emerald-700 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                Continuer <ArrowRight size={18} strokeWidth={2} />
                            </button>
                        </div>
                    </form>
                )}

                {/* ─── Étape 3 : Message + Envoi ─── */}
                {step === 3 && (
                    <form onSubmit={submit} className="space-y-5">
                        <div className="rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-sm">
                            <span className="text-gray-500">Entreprise : </span>
                            <span className="font-medium text-gray-900">{data.company_name}</span>
                            <span className="mx-2 text-gray-300">·</span>
                            <span className="text-gray-500">Forfait : </span>
                            <span className="font-medium capitalize text-emerald-700">{data.plan}</span>
                            <span className="mx-2 text-gray-300">·</span>
                            <span className="text-gray-600">{data.first_name} {data.last_name}</span>
                            <span className="mx-2 text-gray-300">·</span>
                            <span className="text-gray-600">{data.email}</span>
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                Message (optionnel)
                            </label>
                            <div className="relative">
                                <span className="pointer-events-none absolute left-3 top-3 text-gray-400">
                                    <MessageSquare size={18} strokeWidth={1.8} />
                                </span>
                                <textarea
                                    id="message"
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    rows={3}
                                    placeholder="Précisez vos besoins ou questions..."
                                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                />
                            </div>
                            <InputError message={errors.message} className="mt-1" />
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={goBack}
                                className="flex-1 rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            >
                                Retour
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 rounded-xl bg-gradient-to-b from-emerald-600 to-emerald-700 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                        </svg>
                                        Envoi…
                                    </span>
                                ) : (
                                    'Envoyer ma demande'
                                )}
                            </button>
                        </div>
                    </form>
                )}

                <p className="mt-6 text-center text-sm text-gray-500">
                    Déjà client ?{' '}
                    <Link href={route('login')} className="font-semibold text-emerald-600 hover:text-emerald-700">
                        Se connecter
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}