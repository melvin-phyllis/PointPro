import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Company, PageProps, Plan } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type Props = PageProps<{
    company?: Company;
    plans: Plan[];
    companies: { id: number; name: string; plan: string }[];
}>;

function fmt(n: number) { return new Intl.NumberFormat('fr-FR').format(n); }

export default function PaymentCreate({ company, plans, companies }: Props) {
    const { data, setData, post, errors, processing } = useForm({
        company_id: company?.id ?? '',
        plan_id: '' as string | number,
        amount: 0,
        payment_method: 'mobile_money',
        metadata: { phone: '', operator: '', bank: '', reference: '' },
        notes: '',
    });

    const selectedPlan = plans.find(p => p.id === Number(data.plan_id));

    function selectPlan(planId: number) {
        const plan = plans.find(p => p.id === planId);
        setData(prev => ({ ...prev, plan_id: planId, amount: plan?.price ?? 0 }));
    }

    function submit(e: FormEvent) {
        e.preventDefault();
        post(route('admin.payments.store'));
    }

    return (
        <AuthenticatedLayout>
            <Head title="Enregistrer un paiement" />
            <div className="mx-auto max-w-xl space-y-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Link href={route('admin.payments.index')} className="hover:text-emerald-400">Paiements</Link>
                    <span>/</span><span className="text-gray-200">Nouveau</span>
                </div>
                <h1 className="text-xl font-bold text-white">Enregistrer un paiement manuel</h1>

                <form onSubmit={submit} className="space-y-5 rounded-xl border border-white/10 bg-[#0D1117] p-6">

                    {/* Entreprise */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Entreprise *</label>
                        {company ? (
                            <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200">
                                {company.name}
                                <input type="hidden" value={company.id} />
                            </div>
                        ) : (
                            <select value={data.company_id} onChange={e => setData('company_id', e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-[#0D1117] px-3 py-2 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none">
                                <option value="">Sélectionner une entreprise</option>
                                {companies.map(c => (
                                    <option key={c.id} value={c.id}>{c.name} ({c.plan})</option>
                                ))}
                            </select>
                        )}
                        {errors.company_id && <p className="mt-1 text-xs text-red-400">{errors.company_id}</p>}
                    </div>

                    {/* Plan */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-2">Plan *</label>
                        <div className="grid gap-2 sm:grid-cols-2">
                            {plans.map(plan => (
                                <button key={plan.id} type="button" onClick={() => selectPlan(plan.id)}
                                    className={`rounded-lg border p-3 text-left transition ${data.plan_id === plan.id
                                            ? 'border-emerald-500 bg-emerald-500/10'
                                            : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                                        }`}>
                                    <p className="text-sm font-medium text-white">{plan.name}</p>
                                    <p className="text-xs text-emerald-400">{plan.price === 0 ? 'Gratuit' : `${fmt(plan.price)} FCFA`}</p>
                                </button>
                            ))}
                        </div>
                        {errors.plan_id && <p className="mt-1 text-xs text-red-400">{errors.plan_id}</p>}
                    </div>

                    {/* Montant */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Montant (FCFA) *</label>
                        <input type="number" value={data.amount} onChange={e => setData('amount', +e.target.value)} min={0}
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none" />
                        {selectedPlan && data.amount !== selectedPlan.price && (
                            <p className="mt-1 text-xs text-amber-400">⚠ Montant différent du prix du plan ({fmt(selectedPlan.price)} FCFA)</p>
                        )}
                        {errors.amount && <p className="mt-1 text-xs text-red-400">{errors.amount}</p>}
                    </div>

                    {/* Méthode de paiement */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Méthode de paiement *</label>
                        <select value={data.payment_method} onChange={e => setData('payment_method', e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-[#0D1117] px-3 py-2 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none">
                            <option value="mobile_money">Mobile Money</option>
                            <option value="wave">Wave</option>
                            <option value="bank_transfer">Virement bancaire</option>
                            <option value="cash">Espèces</option>
                            <option value="other">Autre</option>
                        </select>
                    </div>

                    {/* Métadonnées conditionnelles */}
                    {data.payment_method === 'mobile_money' && (
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Numéro de téléphone</label>
                                <input value={data.metadata.phone} onChange={e => setData('metadata', { ...data.metadata, phone: e.target.value })}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Opérateur</label>
                                <select value={data.metadata.operator} onChange={e => setData('metadata', { ...data.metadata, operator: e.target.value })}
                                    className="w-full rounded-lg border border-white/10 bg-[#0D1117] px-3 py-2 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none">
                                    <option value="">—</option>
                                    <option value="orange">Orange Money</option>
                                    <option value="mtn">MTN MoMo</option>
                                    <option value="moov">Moov Money</option>
                                </select>
                            </div>
                        </div>
                    )}
                    {data.payment_method === 'bank_transfer' && (
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Banque</label>
                                <input value={data.metadata.bank} onChange={e => setData('metadata', { ...data.metadata, bank: e.target.value })}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Réf. transaction</label>
                                <input value={data.metadata.reference} onChange={e => setData('metadata', { ...data.metadata, reference: e.target.value })}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none" />
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Notes</label>
                        <textarea value={data.notes} onChange={e => setData('notes', e.target.value)} rows={2}
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-emerald-500 focus:outline-none resize-none" />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Link href={route('admin.payments.index')} className="rounded-lg px-4 py-2 text-sm text-gray-400 hover:text-gray-200">Annuler</Link>
                        <button type="submit" disabled={processing}
                            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-50 transition">
                            {processing ? 'Enregistrement...' : 'Enregistrer le paiement'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
