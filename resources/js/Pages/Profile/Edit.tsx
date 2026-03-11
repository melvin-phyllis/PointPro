import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEvent, ReactNode, useState } from 'react';

// ─── InputField (thème via CSS variables) ─────────────────────
function InputField({
    label, value, onChange, type = 'text',
    placeholder = '', disabled = false, error = '',
}: {
    label: string; value: string;
    onChange: (v: string) => void;
    type?: string; placeholder?: string;
    disabled?: boolean; error?: string;
}) {
    return (
        <div className="flex flex-1 min-w-[200px] flex-col gap-1.5">
            <label className="text-[13px] font-medium tracking-wide text-muted">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className={`field w-full rounded-lg px-4 py-3 text-sm transition disabled:opacity-60 disabled:cursor-not-allowed ${
                    error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                }`}
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}

// ─── PasswordInput ────────────────────────────────────────────
function PasswordInput({ label, value, onChange, error = '', placeholder = '' }: {
    label: string; value: string; onChange: (v: string) => void;
    error?: string; placeholder?: string;
}) {
    const [show, setShow] = useState(false);
    return (
        <div className="flex flex-1 min-w-[200px] flex-col gap-1.5">
            <label className="text-[13px] font-medium tracking-wide text-muted">
                {label}
            </label>
            <div className="relative">
                <input
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`field w-full rounded-lg py-3 pl-4 pr-12 text-sm transition ${
                        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                    }`}
                />
                <button
                    type="button"
                    onClick={() => setShow(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-secondary hover:text-primary"
                >
                    {show ? '🙈' : '👁'}
                </button>
            </div>
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}

// ─── SectionCard ──────────────────────────────────────────────
function SectionCard({ title, subtitle, icon, children }: {
    title: string; subtitle?: string; icon: string; children: ReactNode;
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-theme bg-surface">
            <div className="flex items-center gap-3 border-b border-theme px-6 py-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-base">
                    {icon}
                </div>
                <div>
                    <h3 className="text-base font-semibold text-primary m-0">{title}</h3>
                    {subtitle && <p className="mt-0.5 text-[13px] text-secondary">{subtitle}</p>}
                </div>
            </div>
            <div className="p-6 pt-6">{children}</div>
        </div>
    );
}

// ─── Btn ──────────────────────────────────────────────────────
function Btn({ children, variant = 'primary', onClick, type = 'button', disabled = false }: {
    children: ReactNode; variant?: 'primary' | 'ghost';
    onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean;
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed ${
                variant === 'primary'
                    ? 'bg-brand-500 text-white hover:bg-brand-600 focus:ring-2 focus:ring-brand-500/30'
                    : 'border border-theme bg-transparent text-muted hover:bg-subtle focus:ring-2 focus:ring-brand-500/20'
            }`}
        >
            {children}
        </button>
    );
}

const roleLabels: Record<string, string> = {
    admin: 'Admin', manager: 'Manager', employee: 'Employé', super_admin: 'Super Admin',
};

// ─── Page ─────────────────────────────────────────────────────
export default function ProfileEdit() {
    const { auth, company } = usePage<PageProps>().props;
    const user = auth.user;

    // Profile form
    const profileForm = useForm({
        first_name: user.first_name,
        last_name:  user.last_name,
        email:      user.email,
        phone:      user.phone ?? '',
    });

    function submitProfile(e: FormEvent) {
        e.preventDefault();
        profileForm.patch(route('profile.update'), { preserveScroll: true });
    }

    // Password form
    const passwordForm = useForm({
        current_password:      '',
        password:              '',
        password_confirmation: '',
    });

    function submitPassword(e: FormEvent) {
        e.preventDefault();
        passwordForm.put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    }

    // Password strength (classes Tailwind pour respect du thème)
    function getStrength(pwd: string): { level: number; label: string; barClass: string; textClass: string } {
        if (!pwd) return { level: 0, label: '', barClass: 'bg-subtle', textClass: 'text-secondary' };
        let s = 0;
        if (pwd.length >= 8) s++;
        if (/[A-Z]/.test(pwd)) s++;
        if (/[0-9]/.test(pwd)) s++;
        if (/[^A-Za-z0-9]/.test(pwd)) s++;
        if (pwd.length >= 12) s++;
        if (s <= 1) return { level: 1, label: 'Faible',    barClass: 'bg-red-500', textClass: 'text-red-500' };
        if (s <= 2) return { level: 2, label: 'Moyen',     barClass: 'bg-amber-500', textClass: 'text-amber-500' };
        if (s <= 3) return { level: 3, label: 'Bon',       barClass: 'bg-blue-500', textClass: 'text-blue-500' };
        return       { level: 4, label: 'Excellent', barClass: 'bg-brand-500', textClass: 'text-brand-500' };
    }
    const strength = getStrength(passwordForm.data.password);

    const initials = (user.first_name[0] ?? '') + (user.last_name[0] ?? '');

    return (
        <AuthenticatedLayout>
            <Head title="Mon profil" />

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .profile-page { animation: fadeUp 0.4s ease both; }
            `}</style>

            <div className="profile-page mx-auto max-w-[860px]">

                {/* Header */}
                <div className="mb-7">
                    <h1 className="text-[26px] font-bold tracking-tight text-primary">
                        Mon profil
                    </h1>
                    <p className="mt-1 text-sm text-secondary">
                        Gérez vos informations personnelles et la sécurité de votre compte
                    </p>
                </div>

                {/* Hero card */}
                <div className="mb-5 flex flex-wrap items-center gap-6 rounded-2xl border border-theme bg-surface p-6">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-2xl font-bold uppercase text-white shadow-lg shadow-brand-500/25">
                        {initials}
                    </div>
                    <div className="min-w-[200px] flex-1">
                        <h2 className="text-xl font-bold text-primary m-0">
                            {profileForm.data.first_name} {profileForm.data.last_name}
                        </h2>
                        <p className="mt-1 text-sm text-muted">{user.email}</p>
                        <div className="mt-2.5 flex flex-wrap gap-2">
                            <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">
                                {roleLabels[user.role] ?? user.role}
                            </span>
                            {company && (
                                <span className="rounded-full bg-subtle px-3 py-1 text-xs text-muted">
                                    {company.name}
                                </span>
                            )}
                            {user.employee_id_number && (
                                <span className="rounded-full bg-subtle px-3 py-1 text-xs text-secondary">
                                    Matricule : {user.employee_id_number}
                                </span>
                            )}
                            {user.department && (
                                <span className="rounded-full bg-subtle px-3 py-1 text-xs text-secondary">
                                    {user.department.name}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Informations personnelles */}
                <div className="mb-5">
                    <SectionCard
                        title="Informations personnelles"
                        subtitle="Mettez à jour vos informations de profil"
                        icon="👤"
                    >
                        <form onSubmit={submitProfile}>
                            <div className="flex flex-col gap-5">
                                <div className="flex flex-wrap gap-4">
                                    <InputField
                                        label="Prénom"
                                        value={profileForm.data.first_name}
                                        onChange={v => profileForm.setData('first_name', v)}
                                        error={profileForm.errors.first_name}
                                    />
                                    <InputField
                                        label="Nom"
                                        value={profileForm.data.last_name}
                                        onChange={v => profileForm.setData('last_name', v)}
                                        error={profileForm.errors.last_name}
                                    />
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <InputField
                                        label="Adresse e-mail"
                                        value={profileForm.data.email}
                                        onChange={v => profileForm.setData('email', v)}
                                        type="email"
                                        error={profileForm.errors.email}
                                    />
                                    <InputField
                                        label="Téléphone"
                                        value={profileForm.data.phone}
                                        onChange={v => profileForm.setData('phone', v)}
                                        placeholder="+225 07 00 00 00 00"
                                        error={profileForm.errors.phone}
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-1">
                                    <Btn variant="ghost" onClick={() => profileForm.reset()}>
                                        Annuler
                                    </Btn>
                                    <Btn type="submit" disabled={profileForm.processing}>
                                        {profileForm.processing ? 'Enregistrement…' : 'Enregistrer les modifications'}
                                    </Btn>
                                </div>
                            </div>
                        </form>
                    </SectionCard>
                </div>

                {/* Mot de passe */}
                <SectionCard
                    title="Mot de passe"
                    subtitle="Utilisez un mot de passe long et unique pour sécuriser votre compte"
                    icon="🔒"
                >
                    <form onSubmit={submitPassword}>
                        <div className="flex flex-col gap-5">
                            <PasswordInput
                                label="Mot de passe actuel"
                                value={passwordForm.data.current_password}
                                onChange={v => passwordForm.setData('current_password', v)}
                                error={passwordForm.errors.current_password}
                                placeholder="Entrez votre mot de passe actuel"
                            />
                            <div className="flex flex-wrap gap-4">
                                <div className="flex min-w-[200px] flex-1 flex-col gap-1">
                                    <PasswordInput
                                        label="Nouveau mot de passe"
                                        value={passwordForm.data.password}
                                        onChange={v => passwordForm.setData('password', v)}
                                        error={passwordForm.errors.password}
                                        placeholder="Minimum 8 caractères"
                                    />
                                    {passwordForm.data.password && (
                                        <div className="mt-1">
                                            <div className="mb-1 flex gap-1">
                                                {[1, 2, 3, 4].map(i => (
                                                    <div
                                                        key={i}
                                                        className={`h-1 flex-1 rounded-sm transition-colors ${
                                                            i <= strength.level ? strength.barClass : 'bg-subtle'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className={`text-xs font-medium ${strength.textClass}`}>
                                                {strength.label}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex min-w-[200px] flex-1 flex-col gap-1">
                                    <PasswordInput
                                        label="Confirmer le mot de passe"
                                        value={passwordForm.data.password_confirmation}
                                        onChange={v => passwordForm.setData('password_confirmation', v)}
                                        error={passwordForm.errors.password_confirmation}
                                        placeholder="Retapez le nouveau mot de passe"
                                    />
                                    {passwordForm.data.password_confirmation && passwordForm.data.password && (
                                        <span
                                            className={`mt-1 text-xs ${
                                                passwordForm.data.password_confirmation === passwordForm.data.password
                                                    ? 'text-brand-500' : 'text-red-500'
                                            }`}
                                        >
                                            {passwordForm.data.password_confirmation === passwordForm.data.password
                                                ? '✓ Les mots de passe correspondent'
                                                : 'Les mots de passe ne correspondent pas'}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-1">
                                <Btn variant="ghost" onClick={() => passwordForm.reset()}>
                                    Annuler
                                </Btn>
                                <Btn type="submit" disabled={passwordForm.processing}>
                                    {passwordForm.processing ? 'Modification…' : 'Modifier le mot de passe'}
                                </Btn>
                            </div>
                        </div>
                    </form>
                </SectionCard>

                <div className="h-10" />
            </div>
        </AuthenticatedLayout>
    );
}
