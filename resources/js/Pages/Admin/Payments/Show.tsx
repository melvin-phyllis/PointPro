import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, Payment } from '@/types';
import { Head, Link } from '@inertiajs/react';

type Props = PageProps<{ payment: Payment & { created_by_user?: { full_name: string } } }>;

const statusBadge: Record<string, string> = {
    completed: 'bg-emerald-500/20 text-emerald-400', pending: 'bg-amber-500/20 text-amber-400',
    failed: 'bg-red-500/20 text-red-400', refunded: 'bg-blue-500/20 text-blue-400',
};
const methodLabels: Record<string, string> = {
    mobile_money: 'Mobile Money', wave: 'Wave', cinetpay: 'CinetPay', fedapay: 'FedaPay',
    bank_transfer: 'Virement bancaire', cash: 'Espèces', other: 'Autre',
};

function fmt(n: number) { return new Intl.NumberFormat('fr-FR').format(n); }

export default function PaymentShow({ payment }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title={`Paiement #${payment.id}`} />
            <div className="mx-auto max-w-xl space-y-6">

                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Link href={route('admin.payments.index')} className="hover:text-emerald-400">Paiements</Link>
                    <span>/</span><span className="text-gray-200">#{payment.id}</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#0D1117] p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-white">Paiement #{payment.id}</h1>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge[payment.status] ?? 'bg-gray-500/20 text-gray-400'}`}>
                            {payment.status}
                        </span>
                    </div>

                    <div className="text-center py-4 border-b border-t border-white/10">
                        <p className="text-3xl font-bold text-emerald-400">{fmt(payment.amount)} FCFA</p>
                        <p className="mt-1 text-sm text-gray-500">{methodLabels[payment.payment_method] ?? payment.payment_method}</p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {[
                            ['Entreprise', payment.company?.name ?? '—'],
                            ['Plan', payment.subscription?.plan?.name ?? '—'],
                            ['Date de paiement', payment.paid_at ? new Date(payment.paid_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'],
                            ['Date de création', new Date(payment.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })],
                            ['Réf. fournisseur', payment.provider_transaction_id ?? '—'],
                            ['Créé par', (payment as any).created_by_user?.full_name ?? 'Système'],
                        ].map(([label, value]) => (
                            <div key={label as string}>
                                <p className="text-xs text-gray-500">{label}</p>
                                <p className="text-sm text-gray-200">{value}</p>
                            </div>
                        ))}
                    </div>

                    {payment.metadata && Object.keys(payment.metadata).length > 0 && (
                        <div>
                            <p className="text-xs font-medium text-gray-500 mb-2">Métadonnées</p>
                            <div className="rounded-lg bg-white/[0.02] border border-white/5 p-3 space-y-1">
                                {Object.entries(payment.metadata).filter(([, v]) => v).map(([k, v]) => (
                                    <div key={k} className="flex justify-between text-xs">
                                        <span className="text-gray-500">{k}</span>
                                        <span className="text-gray-300">{String(v)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {payment.notes && (
                        <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Notes</p>
                            <p className="text-sm text-gray-300">{payment.notes}</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-between">
                    <Link href={route('admin.payments.index')} className="text-sm text-gray-400 hover:text-emerald-400">← Retour aux paiements</Link>
                    {payment.company && (
                        <Link href={route('admin.companies.show', payment.company_id)} className="text-sm text-emerald-400 hover:underline">Voir l'entreprise →</Link>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
