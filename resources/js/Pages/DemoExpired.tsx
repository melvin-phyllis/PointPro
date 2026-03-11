import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, CreditCard, FileEdit } from 'lucide-react';

type Props = PageProps<{
    company: { name: string; trial_ends_at?: string };
}>;

export default function DemoExpired({ company }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Démo terminée" />
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12">
                <div className="w-full max-w-md rounded-2xl border border-amber-500/30 bg-amber-500/5 p-8 text-center shadow-xl">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 text-amber-500">
                        <AlertCircle className="h-8 w-8" strokeWidth={2} />
                    </div>
                    <h1 className="text-xl font-bold text-primary">
                        Votre démo a pris fin
                    </h1>
                    <p className="mt-2 text-sm text-muted">
                        La période d'essai de <strong className="text-primary">{company.name}</strong> est terminée.
                        Passez à une offre pour continuer à utiliser PointPro.
                    </p>
                    <p className="mt-4 text-sm font-medium text-amber-600 dark:text-amber-400">
                        Payer maintenant pour débloquer l'accès à votre espace.
                    </p>

                    <div className="mt-8 flex flex-col gap-3">
                        <Link
                            href={route('subscription.index')}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
                        >
                            <CreditCard size={20} />
                            Payer maintenant
                        </Link>
                        <Link
                            href={route('finalize-account')}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-theme bg-surface px-5 py-3 text-sm font-medium text-primary transition hover:bg-subtle"
                        >
                            <FileEdit size={18} />
                            Finaliser mon compte (confirmer les infos et choisir l'offre)
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
