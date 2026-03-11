import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Building2, Mail, Phone, MapPin, Tag } from 'lucide-react';

type PlanSlug = 'starter' | 'business' | 'enterprise' | 'custom';

type CompanyShape = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    plan: PlanSlug;
};

type PlanShape = {
    id: number;
    name: string;
    slug: PlanSlug;
    price: number;
    formatted_price: string;
    max_employees: number | null;
    billing_cycle: string;
};

type Props = PageProps<{
    company: CompanyShape;
    plans: PlanShape[];
}>;

export default function FinalizeAccount({ company, plans }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        email: string;
        phone: string;
        address: string;
        plan: PlanSlug;
    }>({
        name: company.name,
        email: company.email,
        phone: company.phone ?? '',
        address: company.address ?? '',
        plan: company.plan,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('finalize-account.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Finaliser mon compte" />
            <div className="mx-auto max-w-xl space-y-6">
                <div>
                    <h1 className="text-xl font-bold text-primary">Finaliser mon compte</h1>
                    <p className="mt-1 text-sm text-muted">
                        Confirmez ou modifiez les informations de votre entreprise, choisissez votre offre, puis finalisez le paiement pour activer l'accès.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-5 rounded-xl border border-theme bg-surface p-6">
                    <div>
                        <label htmlFor="name" className="mb-1 block text-sm font-medium text-muted">Nom de l'entreprise</label>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-muted">
                                <Building2 size={18} />
                            </span>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                className="w-full rounded-lg border border-theme bg-subtle py-2.5 pl-10 pr-4 text-sm text-primary focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                        </div>
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium text-muted">Email</label>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-muted">
                                <Mail size={18} />
                            </span>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                className="w-full rounded-lg border border-theme bg-subtle py-2.5 pl-10 pr-4 text-sm text-primary focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                        </div>
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="phone" className="mb-1 block text-sm font-medium text-muted">Téléphone</label>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-muted">
                                <Phone size={18} />
                            </span>
                            <input
                                id="phone"
                                type="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="w-full rounded-lg border border-theme bg-subtle py-2.5 pl-10 pr-4 text-sm text-primary focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="address" className="mb-1 block text-sm font-medium text-muted">Adresse</label>
                        <div className="relative">
                            <span className="pointer-events-none absolute left-3 top-3 text-muted">
                                <MapPin size={18} />
                            </span>
                            <textarea
                                id="address"
                                rows={2}
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className="w-full rounded-lg border border-theme bg-subtle py-2.5 pl-10 pr-4 text-sm text-primary focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-muted">Choisir l'offre</label>
                        <div className="space-y-2">
                            {plans.map((plan) => (
                                <label
                                    key={plan.id}
                                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                                        data.plan === plan.slug ? 'border-emerald-500 bg-emerald-500/10' : 'border-theme bg-subtle/30 hover:border-theme'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="plan"
                                            value={plan.slug}
                                            checked={data.plan === plan.slug}
                                            onChange={() => setData('plan', plan.slug)}
                                            className="sr-only"
                                        />
                                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-muted">
                                            <Tag size={18} />
                                        </span>
                                        <div>
                                            <p className="font-semibold text-primary">{plan.name}</p>
                                            <p className="text-xs text-muted">
                                                {plan.formatted_price}
                                                {plan.max_employees ? ` · ${plan.max_employees} employés max` : ' · Illimité'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                        {plan.formatted_price}
                                    </span>
                                </label>
                            ))}
                        </div>
                        {errors.plan && <p className="mt-1 text-xs text-red-500">{errors.plan}</p>}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Link
                            href={route('demo.expired')}
                            className="rounded-lg border border-theme px-4 py-2.5 text-sm font-medium text-muted transition hover:bg-subtle"
                        >
                            Retour
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
                        >
                            {processing ? 'Enregistrement…' : 'Enregistrer et aller au paiement'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
