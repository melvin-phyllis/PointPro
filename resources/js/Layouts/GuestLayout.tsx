import Toast from '@/Components/Toast';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BarChart3, MapPin, Shield } from 'lucide-react';
import { PropsWithChildren } from 'react';

interface GuestLayoutProps extends PropsWithChildren {
    /** Masque le panneau droit et centre le contenu (ex: page Demande de devis) */
    centered?: boolean;
}

export default function GuestLayout({ children, centered = false }: GuestLayoutProps) {
    const { asset_url } = usePage<PageProps>().props;

    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* ─── Zone formulaire (pleine largeur si centered, sinon moitié) ─── */}
            <div className={`force-light flex w-full flex-col bg-gray-50/95 px-6 py-8 sm:px-10 sm:py-10 md:px-14 ${centered ? 'lg:px-16 items-center' : 'lg:w-[48%] lg:px-16'}`}>
                

                {/* Contenu formulaire */}
                <div className={`flex flex-1 flex-col justify-center ${centered ? 'w-full max-w-[420px]' : ''}`}>
                    <div className={centered ? 'w-full' : 'w-full max-w-[380px]'}>
                        {children}
                    </div>
                </div>

                {/* Footer */}
                <p className={`mt-8 text-xs text-gray-400 ${centered ? 'w-full max-w-[420px] text-center' : ''}`}>
                    © {new Date().getFullYear()} PointPro — Tous droits réservés
                </p>
            </div>

            {/* ─── RIGHT — Panneau marque (caché si centered) ─── */}
            {!centered && (
            <div
                className="relative hidden overflow-hidden lg:flex lg:flex-1"
                style={{
                    background: 'linear-gradient(160deg, #064e3b 0%, #065f46 35%, #047857 70%, #059669 100%)',
                }}
            >
                {/* Formes décoratives */}
                <div
                    className="absolute -top-40 -right-40 h-80 w-80 rounded-full opacity-20"
                    style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }}
                />
                <div
                    className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }}
                />
                <div
                    className="absolute top-1/2 right-12 h-32 w-32 -translate-y-1/2 rounded-2xl opacity-10"
                    style={{ background: '#fff', transform: 'rotate(12deg) translateY(-50%)' }}
                />

                <div className="relative z-10 flex flex-col justify-between p-12 xl:p-14 w-full">
                    {/* En-tête */}
                    <div>
                        <span
                            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium"
                            style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.95)' }}
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                            Solution SaaS de pointage
                        </span>
                        <h2
                            className="mt-8 text-3xl font-bold leading-tight tracking-tight xl:text-4xl"
                            style={{
                                fontFamily: "'Outfit', sans-serif",
                                letterSpacing: '-0.03em',
                                color: 'rgba(255,255,255,0.98)',
                            }}
                        >
                            Gérez la présence
                            <br />
                            de votre équipe
                            <br />
                            <span style={{ color: 'rgba(255,255,255,0.7)' }}>en temps réel.</span>
                        </h2>
                        <p
                            className="mt-4 max-w-sm text-sm leading-relaxed"
                            style={{ color: 'rgba(255,255,255,0.6)' }}
                        >
                            Pointage GPS, calcul des heures, rapports et exports — tout depuis votre téléphone ou le web.
                        </p>
                    </div>

                    {/* Carte aperçu */}
                    <div
                        className="my-8 rounded-2xl p-5 xl:p-6"
                        style={{
                            background: 'rgba(0,0,0,0.18)',
                            backdropFilter: 'blur(14px)',
                            border: '1px solid rgba(255,255,255,0.08)',
                        }}
                    >
                        <div className="mb-4 grid grid-cols-3 gap-3">
                            {[
                                { label: 'Présents', value: '47', color: '#6ee7b7' },
                                { label: 'En retard', value: '5', color: '#fde047' },
                                { label: 'Absents', value: '3', color: '#fca5a5' },
                            ].map((s) => (
                                <div
                                    key={s.label}
                                    className="rounded-xl px-3 py-2.5 text-center"
                                    style={{ background: 'rgba(255,255,255,0.06)' }}
                                >
                                    <p
                                        className="text-lg font-bold font-tabular"
                                        style={{ fontFamily: "'Outfit', sans-serif", color: s.color }}
                                    >
                                        {s.value}
                                    </p>
                                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                        {s.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            Taux de présence aujourd'hui
                        </p>
                        <div
                            className="h-2 w-full overflow-hidden rounded-full"
                            style={{ background: 'rgba(255,255,255,0.1)' }}
                        >
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: '86%',
                                    background: 'linear-gradient(90deg, #34d399, #10b981)',
                                }}
                            />
                        </div>
                        <p className="mt-1.5 text-right text-xs font-semibold" style={{ color: '#6ee7b7' }}>
                            86%
                        </p>
                    </div>

                    {/* Points clés */}
                    <div className="space-y-3.5">
                        {[
                            { icon: MapPin, text: 'Pointage géolocalisé par GPS' },
                            { icon: BarChart3, text: 'Rapports et exports automatiques' },
                            { icon: Shield, text: 'Données isolées par entreprise' },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-3">
                                <div
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                                    style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)' }}
                                >
                                    <Icon size={16} strokeWidth={2} />
                                </div>
                                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                                    {text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            )}

            <Toast />
        </div>
    );
}
