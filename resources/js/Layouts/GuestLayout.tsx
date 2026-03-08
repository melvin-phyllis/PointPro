import Toast from '@/Components/Toast';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { CheckCircle2, MapPin, BarChart3, Shield } from 'lucide-react';
import { PropsWithChildren } from 'react';

export default function GuestLayout({ children }: PropsWithChildren) {
    const { asset_url } = usePage<PageProps>().props;

    return (
        <div className="flex min-h-screen bg-white">

            {/* ─── LEFT — Form panel (always light) ─── */}
            <div className="force-light flex w-full lg:w-[45%] flex-col bg-white px-8 py-10 sm:px-12 md:px-16">
                {/* Logo */}
                <div className="mb-10">
                    <Link href="/">
                        <img src={`${asset_url}/Pointpro.png`} alt="PointPro" className="h-9 w-auto object-contain" />
                    </Link>
                </div>

                {/* Form content */}
                <div className="flex flex-1 items-center">
                    <div className="w-full max-w-[400px]">
                        {children}
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-8 text-xs text-muted">
                    &copy; {new Date().getFullYear()} PointPro &mdash; Tous droits réservés
                </p>
            </div>

            {/* ─── RIGHT — Brand panel ─── */}
            <div className="hidden lg:flex lg:flex-1 relative overflow-hidden"
                style={{ background: 'linear-gradient(145deg, #064E3B 0%, #047857 40%, #10B981 100%)' }}
            >
                {/* Decorative blobs */}
                <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.04)' }} />
                <div className="absolute top-1/2 right-16 w-40 h-40 rounded-3xl"
                    style={{ background: 'rgba(255,255,255,0.05)', transform: 'rotate(20deg) translateY(-50%)' }} />

                <div className="relative z-10 flex flex-col justify-between p-14 w-full">
                    {/* Top: headline */}
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8"
                            style={{ background: 'rgba(255,255,255,0.12)' }}>
                            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                            <span className="text-sm font-medium text-primary/80">Plateforme SaaS de pointage</span>
                        </div>

                        <h2 className="text-4xl font-bold text-primary leading-tight"
                            style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.03em' }}>
                            Gérez la présence<br />de votre équipe<br />
                            <span style={{ color: 'rgba(255,255,255,0.6)' }}>simplement.</span>
                        </h2>
                        <p className="mt-4 text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                            Pointage GPS, calcul automatique des heures, rapports détaillés — tout en temps réel.
                        </p>
                    </div>

                    {/* Middle: App preview card */}
                    <div className="my-10 rounded-2xl p-5"
                        style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' }}>

                        {/* Mini stats row */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            {[
                                { label: 'Présents', value: '47', color: '#34D399' },
                                { label: 'En retard', value: '5',  color: '#FBBF24' },
                                { label: 'Absents',  value: '3',  color: '#F87171' },
                            ].map(s => (
                                <div key={s.label} className="rounded-xl p-3 text-center"
                                    style={{ background: 'rgba(255,255,255,0.06)' }}>
                                    <p className="text-xl font-bold" style={{ color: s.color, fontFamily: "'Outfit', sans-serif" }}>{s.value}</p>
                                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Presence bar */}
                        <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Taux de présence aujourd'hui</p>
                        <div className="h-2 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                            <div className="h-2 rounded-full" style={{ width: '86%', background: 'linear-gradient(90deg, #34D399, #10B981)' }} />
                        </div>
                        <p className="text-right text-xs mt-1.5 font-semibold" style={{ color: '#34D399' }}>86%</p>

                        {/* Mini chart bars */}
                        <div className="mt-4 flex items-end gap-1.5 h-16">
                            {[55, 80, 65, 90, 72, 88, 76].map((h, i) => (
                                <div key={i} className="flex-1 rounded-t-sm" style={{
                                    height: `${h}%`,
                                    background: i === 5 ? '#10B981' : 'rgba(255,255,255,0.12)',
                                }} />
                            ))}
                        </div>
                        <div className="flex justify-between mt-1">
                            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                                <span key={i} className="flex-1 text-center text-xs" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>{d}</span>
                            ))}
                        </div>
                    </div>

                    {/* Bottom: features */}
                    <div className="space-y-4">
                        {[
                            { icon: <MapPin size={15} />, text: 'Pointage géolocalisé par GPS' },
                            { icon: <BarChart3 size={15} />, text: 'Rapports et exports automatiques' },
                            { icon: <Shield size={15} />, text: 'Données isolées par entreprise' },
                        ].map((f, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg flex-shrink-0"
                                    style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)' }}>
                                    {f.icon}
                                </div>
                                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{f.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Stat badges */}
                    <div className="mt-8 flex gap-6">
                        {[
                            { value: '200+', label: 'Entreprises' },
                            { value: '12k+', label: 'Employés' },
                            { value: '99.5%', label: 'Dispo' },
                        ].map(s => (
                            <div key={s.label}>
                                <p className="text-2xl font-bold text-primary" style={{ fontFamily: "'Outfit', sans-serif" }}>{s.value}</p>
                                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Toast />
        </div>
    );
}
