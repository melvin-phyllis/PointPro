import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

const FEATURES = [
    {
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        title: 'Pointage GPS',
        desc: 'Vérification par géolocalisation en temps réel. Définissez des zones autorisées et détectez automatiquement les pointages hors site.',
    },
    {
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        title: 'Tableau de bord',
        desc: "Statistiques en temps réel : présents, retards, absences, taux de présence. Graphiques hebdomadaires et analyse par département.",
    },
    {
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        title: 'Rapports automatiques',
        desc: "Export PDF et Excel en un clic. Rapport mensuel envoyé automatiquement par email à vos administrateurs chaque début de mois.",
    },
    {
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        title: 'Gestion des équipes',
        desc: "CRUD complet employés, départements et zones GPS. Rôles distincts : super admin, admin, manager, employé.",
    },
    {
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
        ),
        title: 'Notifications email',
        desc: "Rappels automatiques aux employés sans pointage. Alertes retard/absence au manager. Rapport mensuel en pièce jointe.",
    },
    {
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
        ),
        title: 'Multi-tenant SaaS',
        desc: "Chaque entreprise dispose d'un espace isolé et sécurisé. Architecture scalable pensée pour des milliers de tenants.",
    },
];

const PLANS = [
    {
        name: 'Starter',
        price: 'Gratuit',
        period: '',
        desc: "Pour démarrer sans engagement",
        features: [
            "Jusqu'à 10 employés",
            'Pointage de base',
            '1 site géographique',
            'Rapports mensuels',
            'Support communautaire',
        ],
        cta: 'Commencer gratuitement',
        highlight: false,
    },
    {
        name: 'Business',
        price: '25 000',
        period: 'FCFA / mois',
        desc: "Le choix des PME en croissance",
        features: [
            "Jusqu'à 50 employés",
            'Géolocalisation & géofencing',
            'Sites multiples',
            'Rapports complets PDF/Excel',
            'Notifications email automatiques',
            'Carte GPS interactive',
            'Support prioritaire',
        ],
        cta: 'Essayer Business',
        highlight: true,
        badge: 'Recommandé',
    },
    {
        name: 'Enterprise',
        price: '75 000',
        period: 'FCFA / mois',
        desc: "Pour les grandes organisations",
        features: [
            'Employés illimités',
            'Tout Business inclus',
            'Accès API',
            'SSO (authentification unique)',
            'Support dédié 24/7',
            'SLA garanti',
            'Déploiement dédié possible',
        ],
        cta: 'Contacter les ventes',
        highlight: false,
    },
];

const STATS = [
    { value: '500+', label: 'Entreprises' },
    { value: '25 000+', label: 'Employés gérés' },
    { value: '99.5%', label: 'Disponibilité' },
    { value: '< 200ms', label: 'Temps de réponse' },
];

export default function Welcome() {
    const { asset_url } = usePage<PageProps>().props;
    return (
        <>
            <Head title="PointPro — Gestion de présence GPS" />

            <div className="min-h-screen bg-[#0A0E1A] text-white">

                {/* ─── Navbar ─── */}
                <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0E1A]/90 backdrop-blur">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                            <img src={`${asset_url}/Pointpro.png`} alt="PointPro" className="h-8 w-auto object-contain" />
                        </div>

                        <div className="hidden items-center gap-8 text-sm text-gray-400 md:flex">
                            <a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a>
                            <a href="#pricing" className="hover:text-white transition-colors">Tarifs</a>
                            <a href="#about" className="hover:text-white transition-colors">À propos</a>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link href={route('login')} className="text-sm text-gray-400 hover:text-white transition-colors">
                                Connexion
                            </Link>
                            <Link
                                href={route('register')}
                                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                            >
                                Démarrer gratuitement
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* ─── Hero ─── */}
                <section className="relative overflow-hidden px-6 pb-24 pt-20 text-center">
                    {/* Glow background */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="h-[500px] w-[800px] rounded-full bg-emerald-500/5 blur-3xl" />
                    </div>

                    <div className="relative mx-auto max-w-4xl">
                       

                        <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                            La présence de votre équipe,{' '}
                            <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                                enfin maîtrisée
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
                            PointPro remplace les feuilles de présence papier par un système de pointage GPS intelligent.
                            Zéro fraude, rapports automatiques, visibilité en temps réel.
                        </p>

                        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                            <Link
                                href={route('register')}
                                className="rounded-xl bg-emerald-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600"
                            >
                                Créer mon espace gratuit →
                            </Link>
                            <Link
                                href={route('login')}
                                className="rounded-xl border border-white/10 px-8 py-3.5 text-base font-medium text-gray-300 transition hover:bg-white/5"
                            >
                                Se connecter
                            </Link>
                        </div>

                        <p className="mt-4 text-xs text-gray-600">
                            Aucune carte bancaire requise · Plan Starter 100% gratuit
                        </p>
                    </div>
                </section>

                {/* ─── Stats ─── */}
                <section className="border-y border-white/5 bg-white/[0.02] px-6 py-12">
                    <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
                        {STATS.map((s) => (
                            <div key={s.label} className="text-center">
                                <p className="text-3xl font-extrabold text-emerald-400">{s.value}</p>
                                <p className="mt-1 text-sm text-gray-500">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ─── Features ─── */}
                <section id="features" className="px-6 py-24">
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-16 text-center">
                            <h2 className="text-3xl font-bold sm:text-4xl">Tout ce dont vous avez besoin</h2>
                            <p className="mt-4 text-gray-500">Une plateforme complète, conçue pour les PME africaines</p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {FEATURES.map((f) => (
                                <div
                                    key={f.title}
                                    className="rounded-2xl border border-white/10 bg-[#111827] p-6 transition hover:border-emerald-500/30 hover:bg-[#0d1422]"
                                >
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                                        {f.icon}
                                    </div>
                                    <h3 className="mb-2 font-semibold text-white">{f.title}</h3>
                                    <p className="text-sm leading-relaxed text-gray-500">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── Pricing ─── */}
                <section id="pricing" className="bg-white/[0.01] px-6 py-24">
                    <div className="mx-auto max-w-5xl">
                        <div className="mb-16 text-center">
                            <h2 className="text-3xl font-bold sm:text-4xl">Des tarifs transparents</h2>
                            <p className="mt-4 text-gray-500">En FCFA, sans surprise ni engagement</p>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-3">
                            {PLANS.map((plan) => (
                                <div
                                    key={plan.name}
                                    className={`relative rounded-2xl border p-8 ${
                                        plan.highlight
                                            ? 'border-emerald-500 bg-gradient-to-b from-emerald-500/10 to-transparent'
                                            : 'border-white/10 bg-[#111827]'
                                    }`}
                                >
                                    {plan.highlight && 'badge' in plan && (
                                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                                            <span className="rounded-full bg-emerald-500 px-4 py-1 text-xs font-bold text-white shadow-lg">
                                                {plan.badge}
                                            </span>
                                        </div>
                                    )}

                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                                        <p className="mt-1 text-xs text-gray-500">{plan.desc}</p>
                                        <div className="mt-4 flex items-end gap-1">
                                            <span className={`text-4xl font-extrabold ${plan.highlight ? 'text-emerald-400' : 'text-white'}`}>
                                                {plan.price}
                                            </span>
                                            {plan.period && (
                                                <span className="mb-1 text-sm text-gray-500">{plan.period}</span>
                                            )}
                                        </div>
                                    </div>

                                    <ul className="mb-8 space-y-3">
                                        {plan.features.map((f) => (
                                            <li key={f} className="flex items-center gap-3 text-sm text-gray-400">
                                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-400">
                                                    ✓
                                                </span>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        href={route('register')}
                                        className={`block w-full rounded-xl py-3 text-center text-sm font-semibold transition ${
                                            plan.highlight
                                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600'
                                                : 'border border-white/10 text-gray-300 hover:bg-white/5'
                                        }`}
                                    >
                                        {plan.cta}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── CTA Final ─── */}
                <section className="px-6 py-24 text-center">
                    <div className="mx-auto max-w-2xl">
                        <h2 className="text-3xl font-bold sm:text-4xl">
                            Prêt à moderniser votre gestion de présence ?
                        </h2>
                        <p className="mt-4 text-gray-500">
                            Rejoignez des centaines d'entreprises en Afrique de l'Ouest qui font confiance à PointPro.
                        </p>
                        <Link
                            href={route('register')}
                            className="mt-8 inline-block rounded-xl bg-emerald-500 px-10 py-4 text-base font-semibold text-white shadow-xl shadow-emerald-500/20 transition hover:bg-emerald-600"
                        >
                            Créer mon espace gratuitement →
                        </Link>
                    </div>
                </section>

                {/* ─── Footer ─── */}
                <footer id="about" className="border-t border-white/5 px-6 py-12">
                    <div className="mx-auto max-w-6xl">
                        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
                                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-bold text-white">PointPro</p>
                                    <p className="text-xs text-gray-600">Solution SaaS de gestion de présence</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-gray-500">
                                <a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a>
                                <a href="#pricing" className="hover:text-white transition-colors">Tarifs</a>
                                <Link href={route('login')} className="hover:text-white transition-colors">Connexion</Link>
                                <Link href={route('register')} className="text-emerald-400 hover:text-emerald-300 transition-colors">Inscription</Link>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-white/5 pt-8 text-center text-xs text-gray-600">
                            © {new Date().getFullYear()} PointPro — Confidentiel · Tous droits réservés
                        </div>
                    </div>
                </footer>

            </div>
        </>
    );
}
