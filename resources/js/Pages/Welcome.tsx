import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const FEATURES = [
    {
        title: 'Pointage GPS Haute Précision',
        desc: 'Vérification par géolocalisation stricte. Définissez des zones autorisées (geofencing) et détectez instantanément les anomalies.',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        colSpan: 'md:col-span-2',
        pattern: 'pattern-1',
    },
    {
        title: 'Rapports Intelligents',
        desc: "Génération automatique PDF/Excel et envoi par email aux managers.",
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        colSpan: 'md:col-span-1',
        pattern: 'pattern-2',
    },
    {
        title: 'Multi-Tenant Sécurisé',
        desc: "Architecture SaaS moderne. Chaque entreprise dispose de son espace 100% isolé.",
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        ),
        colSpan: 'md:col-span-1',
        pattern: 'pattern-3',
    },
    {
        title: 'Tableau de bord Managérial',
        desc: "Suivez les présents, les retards et les absences en temps réel. Analysez les performances par département.",
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        colSpan: 'md:col-span-2',
        pattern: 'pattern-4',
    },
];

const PLANS = [
    {
        name: 'Starter',
        price: '0',
        period: 'CFA / mois',
        desc: "Idéal pour tester",
        features: ["Jusqu'à 10 employés", 'Pointage GPS basique', '1 Zone autorisée', 'Export mensuel'],
        cta: 'Démarrer gratuitement',
        highlight: false,
    },
    {
        name: 'Business',
        price: '25 000',
        period: 'CFA / mois',
        desc: "Pour les PME en croissance",
        features: ["Jusqu'à 50 employés", 'Zones GPS illimitées', 'Rapports automatisés', 'Support prioritaire 24/7', 'Marque blanche'],
        cta: 'Essayer Business',
        highlight: true,
        badge: 'Plus populaire',
    },
    {
        name: 'Enterprise',
        price: '75 000',
        period: 'CFA / mois',
        desc: "Pour les grandes structures",
        features: ['Employés illimités', 'API publique', 'Authentification SSO', 'Déploiement sur site possible', 'Gestionnaire de compte'],
        cta: 'Contacter les ventes',
        highlight: false,
    },
];

/** Hook: observe elements with data-animate and add .scroll-in-view when in viewport */
function useScrollAnimation() {
    useEffect(() => {
        const els = document.querySelectorAll<HTMLElement>('[data-animate]');
        if (!els.length) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('scroll-in-view');
                    }
                });
            },
            { rootMargin: '0px 0px -8% 0px', threshold: 0.1 }
        );
        els.forEach((el) => observer.observe(el));
        return () => els.forEach((el) => observer.unobserve(el));
    }, []);
}

export default function Welcome() {
    const { asset_url } = usePage<PageProps>().props;
    const [scrolled, setScrolled] = useState(false);
    useScrollAnimation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <Head title="PointPro — Présence maîtrisée">
                <meta name="description" content="Solution SaaS africaine de pointage par géolocalisation. Gérez vos équipes de terrain avec précision, sans papier ni fraude." />
            </Head>

            {/* Base Background: Very deep slate/black */}
            <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-emerald-500/30 font-sans overflow-x-hidden">

                {/* ─── Ambient Glow Effects ─── */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-500/10 blur-[120px]" />
                </div>

                {/* ─── Navbar (animations en opacity uniquement pour rester compositor-only) ─── */}
                <nav className="fixed top-0 inset-x-0 z-50">
                    {/* Fond et bordure animés par opacity pour éviter les animations non composées */}
                    <div
                        className="absolute inset-0 bg-[#030712]/80 backdrop-blur-md transition-opacity duration-300"
                        style={{ opacity: scrolled ? 1 : 0 }}
                        aria-hidden
                    />
                    <div
                        className="absolute inset-x-0 bottom-0 h-px bg-white/10 transition-opacity duration-300"
                        style={{ opacity: scrolled ? 1 : 0 }}
                        aria-hidden
                    />
                    <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="flex h-20 items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold tracking-tight text-white">Point<span className="text-emerald-400">Pro</span></span>
                            </div>

                            <div className="hidden md:flex items-center gap-8">
                                <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Fonctionnalités</a>
                                <a href="#pricing" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Tarifs</a>
                                <a href="#about" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">À propos</a>
                                <a href="#how-it-works" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Comment ça marche</a>
                            </div>

                            <div className="flex items-center gap-3 sm:gap-4">
                                <Link href={route('login')} className="hidden sm:block text-sm font-medium text-slate-300 hover:text-white transition-colors">
                                    Connexion
                                </Link>
                                <Link
                                    href={route('quote.request')}
                                    className="hidden sm:inline-flex relative group items-center justify-center px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 bg-emerald-500/10 border border-emerald-500/30 rounded-full hover:bg-emerald-500 hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                                >
                                    Demander un devis
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => setMobileMenuOpen(o => !o)}
                                    className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                                    aria-label="Menu"
                                >
                                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Mobile menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden border-t border-white/10 bg-[#030712]/95 backdrop-blur-md px-6 py-4">
                            <div className="flex flex-col gap-1">
                                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-2 text-sm font-medium text-slate-300 hover:text-white">Fonctionnalités</a>
                                <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="py-2 text-sm font-medium text-slate-300 hover:text-white">Tarifs</a>
                                <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-2 text-sm font-medium text-slate-300 hover:text-white">À propos</a>
                                <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-2 text-sm font-medium text-slate-300 hover:text-white">Comment ça marche</a>
                                <Link href={route('login')} onClick={() => setMobileMenuOpen(false)} className="py-2 text-sm font-medium text-slate-300 hover:text-white">Connexion</Link>
                                <Link href={route('quote.request')} onClick={() => setMobileMenuOpen(false)} className="mt-2 py-3 text-center text-sm font-semibold text-white bg-emerald-500 rounded-full">Demander un devis</Link>
                            </div>
                        </div>
                    )}
                </nav>

                {/* ─── Hero Section ─── */}
                <section className="relative z-10 pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pb-32 px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl text-center">

                       
                       

                        <h1 className="max-w-4xl mx-auto text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl animate-slide-up" style={{ animationDelay: '200ms' }}>
                            Gérez vos équipes de terrain avec <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">précision</span>.
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-slate-400 leading-relaxed animate-slide-up" style={{ animationDelay: '300ms' }}>
                            La solution SaaS africaine de pointage par géolocalisation. Dites adieu aux feuilles de présence papier et aux fraudes.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '400ms' }}>
                            <Link
                                href={route('quote.request')}
                                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-black bg-emerald-400 rounded-full hover:bg-emerald-300 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transform hover:-translate-y-1"
                            >
                                Demander un devis
                            </Link>
                            <a
                                href="#features"
                                className="w-full sm:w-auto px-8 py-4 text-base font-medium text-white bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all"
                            >
                                Découvrir la plateforme
                            </a>
                        </div>

                        {/* App Preview Mockup */}
                        <div className="mt-20 relative mx-auto max-w-5xl animate-slide-up" style={{ animationDelay: '600ms' }}>
                            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-emerald-500/20 to-transparent blur-md"></div>
                            <div className="relative rounded-2xl bg-[#0B1120] border border-white/10 shadow-2xl overflow-hidden">
                                {/* Fake Mac Window Header */}
                                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/5">
                                    <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                                </div>
                                {/* Dashboard Abstract UI */}
                                <div className="p-6 grid grid-cols-4 gap-6 opacity-80 pointer-events-none">
                                    <div className="col-span-1 space-y-4">
                                        <div className="h-8 w-3/4 rounded-md bg-white/5"></div>
                                        <div className="h-4 w-1/2 rounded-md bg-white/5"></div>
                                        <div className="h-4 w-2/3 rounded-md bg-white/5"></div>
                                        <div className="h-4 w-1/2 rounded-md bg-emerald-500/20"></div>
                                    </div>
                                    <div className="col-span-3 space-y-6">
                                        <div className="grid grid-cols-3 gap-4">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="h-24 rounded-xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent p-4 flex flex-col justify-between">
                                                    <div className="h-4 w-8 rounded bg-white/10"></div>
                                                    <div className="h-6 w-16 rounded bg-white/20"></div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="h-64 rounded-xl border border-white/5 bg-white/[0.02] flex items-end p-6 gap-4">
                                            {[40, 70, 45, 90, 65, 85, 30].map((h, i) => (
                                                <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-md relative" style={{ height: `${h}%` }}>
                                                    <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500 rounded-t-md"></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {/* Gradient overlay bottom */}
                                <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#0B1120] to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── Social Proof / Stats ─── */}
                <section className="relative z-10 py-12 border-y border-white/5 bg-white/[0.01]">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center text-slate-400">
                        <p className="scroll-animate text-sm font-semibold uppercase tracking-wider mb-8 text-slate-500" data-animate="fade-up">Ils nous font confiance</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5 items-center justify-center">
                            {[
                                { value: '500+', label: 'Entreprises', emerald: false },
                                { value: '25k+', label: 'Employés gérés', emerald: false },
                                { value: '99.9%', label: 'Uptime SLA', emerald: false },
                                { value: '0', label: 'Fraudes de pointage', emerald: true },
                            ].map((stat, i) => (
                                <div key={i} className="scroll-animate flex flex-col items-center" data-animate="fade-up" data-delay={i}>
                                    <span className={`text-4xl font-bold ${stat.emerald ? 'text-emerald-400' : 'text-white'}`}>{stat.value}</span>
                                    <span className="text-sm mt-1">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── Features Bento Grid ─── */}
                <section id="features" className="relative z-10 py-32 px-6 lg:px-8">
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-16 scroll-animate" data-animate="fade-up">
                            <h2 className="text-3xl font-bold tracking-tight text-white mb-4 sm:text-4xl">La puissance au service de la simplicité</h2>
                            <p className="text-lg text-slate-400 max-w-2xl">
                                Tout ce dont vous avez besoin pour structurer vos RH, depuis une seule interface moderne et ultra-rapide.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {FEATURES.map((feature, i) => (
                                <div key={i} className={`scroll-animate relative group rounded-3xl border border-white/10 bg-white/[0.02] p-8 overflow-hidden hover:bg-white/[0.04] transition-colors ${feature.colSpan}`} data-animate="fade-up" data-delay={i}>
                                    {/* Subtle glowing orb inside card */}
                                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-3xl rounded-full group-hover:bg-emerald-500/20 transition-all duration-500"></div>

                                    <div className="relative z-10">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 group-hover:bg-emerald-500/10 transition-transform duration-300">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                        <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── Comment ça marche ─── */}
                <section id="how-it-works" className="relative z-10 py-24 px-6 lg:px-8 border-t border-white/5">
                    <div className="mx-auto max-w-4xl">
                        <div className="text-center mb-16 scroll-animate" data-animate="fade-up">
                            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Comment ça marche</h2>
                            <p className="mt-3 text-lg text-slate-400">En trois étapes, votre entreprise est opérationnelle.</p>
                        </div>
                        <div className="grid sm:grid-cols-3 gap-8 sm:gap-6">
                            {[
                                { step: '1', title: 'Demandez un devis', desc: 'Remplissez le formulaire en quelques clics. Indiquez votre entreprise, l’offre qui vous intéresse et vos coordonnées.', cta: 'Formulaire gratuit' },
                                { step: '2', title: 'On vous configure', desc: 'Un conseiller vous contacte et prépare votre espace : démo ou abonnement direct. Vous recevez vos accès par email.', cta: 'Sans engagement' },
                                { step: '3', title: 'Gérez vos équipes', desc: 'Connectez-vous à la plateforme, définissez vos zones de pointage et suivez les présences en temps réel.', cta: 'Dashboard inclus' },
                            ].map((item, i) => (
                                <div key={i} className="scroll-animate relative text-center group" data-animate="fade-up" data-delay={i}>
                                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 font-bold text-lg border border-emerald-500/30 mb-6 group-hover:scale-110 transition-transform">
                                        {item.step}
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                                    <p className="mt-2 text-xs font-medium text-emerald-400/90">{item.cta}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-12 text-center">
                            <Link href={route('quote.request')} className="inline-flex items-center gap-2 text-emerald-400 font-medium hover:text-emerald-300 transition-colors">
                                Démarrer maintenant
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ─── Pricing ─── */}
                <section id="pricing" className="relative z-10 py-32 px-6 lg:px-8 bg-black/50">
                    <div className="mx-auto max-w-5xl">
                        <div className="text-center mb-20 scroll-animate" data-animate="fade-up">
                            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">Un tarif juste et transparent</h2>
                            <p className="mt-4 text-lg text-slate-400">Réglez en monnaie locale. Sans frais cachés.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 items-center">
                            {PLANS.map((plan, i) => (
                                <div key={i} className={`scroll-animate relative p-8 rounded-3xl backdrop-blur-xl ${plan.highlight ? 'bg-gradient-to-b from-white/10 to-white/5 border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/10 md:-translate-y-4' : 'bg-white/5 border border-white/10'}`} data-animate="scale" data-delay={i}>

                                    {plan.highlight && (
                                        <div className="absolute top-0 inset-x-0 transform -translate-y-1/2 flex justify-center">
                                            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 text-black text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/30">
                                                {plan.badge}
                                            </span>
                                        </div>
                                    )}

                                    <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                                    <p className="mt-2 text-sm text-slate-400">{plan.desc}</p>

                                    <div className="mt-6 mb-8">
                                        <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                                        <span className="text-slate-400 ml-2">{plan.period}</span>
                                    </div>

                                    <ul className="space-y-4 mb-8">
                                        {plan.features.map((feat, j) => (
                                            <li key={j} className="flex items-start gap-3 text-slate-300 text-sm">
                                                <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        href={route('quote.request')}
                                        className={`block w-full py-3 px-4 rounded-xl text-center text-sm font-semibold transition-all ${plan.highlight ? 'bg-emerald-400 text-black hover:bg-emerald-300 hover:shadow-lg hover:shadow-emerald-500/25' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                    >
                                        {plan.cta}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── À propos (min-height pour limiter le CLS au chargement de la police) ─── */}
                <section id="about" className="relative z-10 py-24 px-6 lg:px-8 border-t border-white/5 min-h-[320px]">
                    <div className="mx-auto max-w-3xl text-center scroll-animate" data-animate="fade-up">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">À propos de PointPro</h2>
                        <p className="mt-6 text-lg text-slate-400 leading-relaxed">
                            PointPro est une solution SaaS pensée pour les entreprises africaines qui veulent maîtriser les présences sur le terrain. 
                            Plus de feuilles papier, plus de doutes : le pointage GPS garantit une traçabilité fiable et des rapports prêts pour la paie et le management.
                        </p>
                        <p className="mt-4 text-slate-500">
                            Paiement en FCFA, support local et infrastructure fiable. Nous nous engageons sur la simplicité et la transparence.
                        </p>
                    </div>
                </section>

                {/* ─── CTA finale ─── */}
                <section className="relative z-10 py-24 px-6 lg:px-8">
                    <div className="scroll-animate mx-auto max-w-3xl text-center rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/10 to-transparent p-12 sm:p-16" data-animate="scale">
                        <h2 className="text-2xl font-bold text-white sm:text-3xl">Prêt à simplifier vos pointages ?</h2>
                        <p className="mt-3 text-slate-400">Demandez un devis gratuit. Un conseiller vous recontacte sous 24 h.</p>
                        <div className="mt-8">
                            <Link
                                href={route('quote.request')}
                                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-black bg-emerald-400 rounded-full hover:bg-emerald-300 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]"
                            >
                                Demander un devis
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ─── Footer ─── */}
                <footer className="relative z-10 border-t border-white/10 bg-[#030712] pt-16 pb-8 px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="md:flex md:items-center md:justify-between">
                            <div className="flex justify-center md:justify-start mb-6 md:mb-0">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-lg font-bold text-white">Point<span className="text-emerald-400">Pro</span></span>
                                </div>
                            </div>
                            <div className="flex justify-center flex-wrap gap-x-6 gap-y-2">
                                <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">Conditions d&apos;utilisation</a>
                                <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">Politique de confidentialité</a>
                                <Link href={route('quote.request')} className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">Nous contacter</Link>
                            </div>
                        </div>
                        <div className="mt-8 border-t border-white/5 pt-8 flex items-center justify-center">
                            <p className="text-sm text-slate-500">
                                &copy; {new Date().getFullYear()} PointPro SaaS. Tous droits réservés.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Animations: hero + scroll-triggered */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up {
                    animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out both;
                }
                /* Scroll-triggered animations */
                .scroll-animate {
                    transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .scroll-animate[data-animate="fade-up"] {
                    opacity: 0;
                    transform: translateY(32px);
                }
                .scroll-animate[data-animate="fade-up"].scroll-in-view {
                    opacity: 1;
                    transform: translateY(0);
                }
                .scroll-animate[data-animate="fade-in"] {
                    opacity: 0;
                }
                .scroll-animate[data-animate="fade-in"].scroll-in-view {
                    opacity: 1;
                }
                .scroll-animate[data-animate="fade-left"] {
                    opacity: 0;
                    transform: translateX(24px);
                }
                .scroll-animate[data-animate="fade-left"].scroll-in-view {
                    opacity: 1;
                    transform: translateX(0);
                }
                .scroll-animate[data-animate="fade-right"] {
                    opacity: 0;
                    transform: translateX(-24px);
                }
                .scroll-animate[data-animate="fade-right"].scroll-in-view {
                    opacity: 1;
                    transform: translateX(0);
                }
                .scroll-animate[data-animate="scale"] {
                    opacity: 0;
                    transform: scale(0.96);
                }
                .scroll-animate[data-animate="scale"].scroll-in-view {
                    opacity: 1;
                    transform: scale(1);
                }
                .scroll-animate[data-delay="0"].scroll-in-view { transition-delay: 0s; }
                .scroll-animate[data-delay="1"].scroll-in-view { transition-delay: 0.08s; }
                .scroll-animate[data-delay="2"].scroll-in-view { transition-delay: 0.16s; }
                .scroll-animate[data-delay="3"].scroll-in-view { transition-delay: 0.24s; }
                .scroll-animate[data-delay="4"].scroll-in-view { transition-delay: 0.32s; }
            `}} />
        </>
    );
}
