import Toast from '@/Components/Toast';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function GuestLayout({ children }: PropsWithChildren) {
    const { asset_url } = usePage<PageProps>().props;
    return (
        <div className="flex min-h-screen bg-[#0A0E1A]">
            {/* ─── Colonne gauche : branding ─── */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-[#0D1117] to-[#0a1628] border-r border-white/5">
                <div>
                    <div className="flex items-center gap-3">
                        <img src={`${asset_url}/Pointpro.png`} alt="PointPro" className="h-10 w-auto object-contain" />
                    </div>
                    <p className="mt-3 text-sm text-gray-500">Solution SaaS de gestion de présence</p>
                </div>

                <div className="space-y-8">
                    {[
                        { icon: '📍', title: 'Pointage GPS', desc: 'Vérification de présence par géolocalisation en temps réel' },
                        { icon: '📊', title: 'Tableaux de bord', desc: 'Statistiques et rapports automatiques pour vos managers' },
                        { icon: '🏢', title: 'Multi-tenant', desc: 'Un espace isolé et sécurisé pour chaque entreprise' },
                    ].map(f => (
                        <div key={f.title} className="flex items-start gap-4">
                            <span className="text-2xl">{f.icon}</span>
                            <div>
                                <p className="font-semibold text-white">{f.title}</p>
                                <p className="mt-0.5 text-sm text-gray-500">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="text-xs text-gray-600">© {new Date().getFullYear()} PointPro — Confidentiel</p>
            </div>

            {/* ─── Colonne droite : formulaire ─── */}
            <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-6 sm:p-12">
                {/* Logo mobile */}
                <div className="mb-8 flex items-center gap-3 lg:hidden">
                    <img src={`${asset_url}/Pointpro.png`} alt="PointPro" className="h-9 w-auto object-contain" />
                </div>

                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>

            <Toast />
        </div>
    );
}
