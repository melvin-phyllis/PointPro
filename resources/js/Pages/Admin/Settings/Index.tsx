import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';

type Props = PageProps<{
    settings: {
        app_name: string;
        app_url: string;
        mail_from: string;
        cinetpay: string;
        fedapay: string;
        wave: string;
    };
}>;

export default function AdminSettings({ settings }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Paramètres plateforme" />
            <div className="mx-auto max-w-xl space-y-6">
                <h1 className="text-xl font-bold text-white">Paramètres de la plateforme</h1>

                {/* Informations générales */}
                <div className="rounded-xl border border-white/10 bg-[#0D1117] p-6 space-y-4">
                    <h2 className="text-sm font-semibold text-white">Informations générales</h2>
                    <div className="space-y-3">
                        {[
                            ['Nom de l\'application', settings.app_name],
                            ['URL', settings.app_url],
                            ['Email d\'envoi', settings.mail_from],
                        ].map(([label, value]) => (
                            <div key={label as string} className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2">
                                <span className="text-xs text-gray-500">{label}</span>
                                <span className="text-sm text-gray-200">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Intégrations paiement */}
                <div className="rounded-xl border border-white/10 bg-[#0D1117] p-6 space-y-4">
                    <h2 className="text-sm font-semibold text-white">Intégrations paiement</h2>
                    <div className="space-y-3">
                        {[
                            ['CinetPay', settings.cinetpay],
                            ['FedaPay', settings.fedapay],
                            ['Wave', settings.wave],
                        ].map(([name, status]) => (
                            <div key={name as string} className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2">
                                <span className="text-sm text-gray-200">{name}</span>
                                <span className={`text-xs font-medium ${(status as string).startsWith('✓') ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {status}
                                </span>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500">
                        Les clés API sont configurées dans le fichier <code className="rounded bg-white/10 px-1 py-0.5">.env</code> du serveur.
                    </p>
                </div>

                {/* Info système */}
                <div className="rounded-xl border border-white/10 bg-[#0D1117] p-6 space-y-4">
                    <h2 className="text-sm font-semibold text-white">Système</h2>
                    <div className="space-y-3">
                        {[
                            ['PHP', '8.2+'],
                            ['Laravel', '12.x'],
                            ['React', '18.x'],
                            ['Base de données', 'MySQL'],
                        ].map(([label, value]) => (
                            <div key={label} className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2">
                                <span className="text-xs text-gray-500">{label}</span>
                                <span className="text-sm text-gray-300">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
