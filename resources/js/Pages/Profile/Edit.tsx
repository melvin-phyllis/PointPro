import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEvent, ReactNode, useState } from 'react';

// ─── Design tokens ────────────────────────────────────────────
const C = {
    bg:          '#0A0E1A',
    surface:     '#111827',
    surfaceLight:'#1F2937',
    border:      '#374151',
    borderFocus: '#10B981',
    primary:     '#10B981',
    primaryDark: '#059669',
    primaryGlow: 'rgba(16,185,129,0.12)',
    accent:      '#F59E0B',
    danger:      '#EF4444',
    text:        '#F9FAFB',
    textMuted:   '#9CA3AF',
    textDim:     '#6B7280',
    inputBg:     '#0D1220',
};

// ─── InputField ───────────────────────────────────────────────
function InputField({
    label, value, onChange, type = 'text',
    placeholder = '', disabled = false, error = '',
}: {
    label: string; value: string;
    onChange: (v: string) => void;
    type?: string; placeholder?: string;
    disabled?: boolean; error?: string;
}) {
    const [focused, setFocused] = useState(false);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: C.textMuted, letterSpacing: '0.02em' }}>
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                    width: '100%', padding: '12px 16px',
                    background: disabled ? C.surfaceLight : C.inputBg,
                    border: `1.5px solid ${error ? C.danger : focused ? C.borderFocus : C.border}`,
                    borderRadius: 10, color: disabled ? C.textDim : C.text,
                    fontSize: 14, outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxShadow: focused && !disabled ? `0 0 0 3px ${C.primaryGlow}` : 'none',
                    cursor: disabled ? 'not-allowed' : 'text',
                }}
            />
            {error && <span style={{ fontSize: 12, color: C.danger }}>{error}</span>}
        </div>
    );
}

// ─── PasswordInput ────────────────────────────────────────────
function PasswordInput({ label, value, onChange, error = '', placeholder = '' }: {
    label: string; value: string; onChange: (v: string) => void;
    error?: string; placeholder?: string;
}) {
    const [show, setShow] = useState(false);
    const [focused, setFocused] = useState(false);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: C.textMuted, letterSpacing: '0.02em' }}>
                {label}
            </label>
            <div style={{ position: 'relative' }}>
                <input
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{
                        width: '100%', padding: '12px 44px 12px 16px',
                        background: C.inputBg,
                        border: `1.5px solid ${error ? C.danger : focused ? C.borderFocus : C.border}`,
                        borderRadius: 10, color: C.text, fontSize: 14, outline: 'none',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                        boxShadow: focused ? `0 0 0 3px ${C.primaryGlow}` : 'none',
                    }}
                />
                <button
                    type="button"
                    onClick={() => setShow(s => !s)}
                    style={{
                        position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: 15, color: C.textDim, padding: 0, lineHeight: 1,
                    }}
                >
                    {show ? '🙈' : '👁'}
                </button>
            </div>
            {error && <span style={{ fontSize: 12, color: C.danger }}>{error}</span>}
        </div>
    );
}

// ─── SectionCard ──────────────────────────────────────────────
function SectionCard({ title, subtitle, icon, children }: {
    title: string; subtitle?: string; icon: string; children: ReactNode;
}) {
    return (
        <div style={{
            background: C.surface, borderRadius: 16,
            border: `1px solid ${C.border}`, overflow: 'hidden',
        }}>
            <div style={{
                padding: '20px 28px', borderBottom: `1px solid ${C.border}`,
                display: 'flex', alignItems: 'center', gap: 12,
            }}>
                <div style={{
                    width: 36, height: 36, borderRadius: 10, background: C.primaryGlow,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}>{icon}</div>
                <div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: 0 }}>{title}</h3>
                    {subtitle && <p style={{ fontSize: 13, color: C.textDim, margin: '2px 0 0' }}>{subtitle}</p>}
                </div>
            </div>
            <div style={{ padding: '24px 28px' }}>{children}</div>
        </div>
    );
}

// ─── Btn ──────────────────────────────────────────────────────
function Btn({ children, variant = 'primary', onClick, type = 'button', disabled = false }: {
    children: ReactNode; variant?: 'primary' | 'ghost';
    onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean;
}) {
    const [hover, setHover] = useState(false);
    const styles = {
        primary: { background: hover && !disabled ? C.primaryDark : C.primary, color: '#fff', border: 'none' },
        ghost:   { background: hover ? C.surfaceLight : 'transparent', color: C.textMuted, border: `1.5px solid ${C.border}` },
    };
    return (
        <button
            type={type} onClick={onClick} disabled={disabled}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                ...styles[variant],
                padding: '10px 22px', borderRadius: 10, fontSize: 14, fontWeight: 600,
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                opacity: disabled ? 0.6 : 1,
            }}
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

    // Password strength
    function getStrength(pwd: string) {
        if (!pwd) return { level: 0, label: '', color: C.textDim };
        let s = 0;
        if (pwd.length >= 8) s++;
        if (/[A-Z]/.test(pwd)) s++;
        if (/[0-9]/.test(pwd)) s++;
        if (/[^A-Za-z0-9]/.test(pwd)) s++;
        if (pwd.length >= 12) s++;
        if (s <= 1) return { level: 1, label: 'Faible',    color: C.danger };
        if (s <= 2) return { level: 2, label: 'Moyen',     color: C.accent };
        if (s <= 3) return { level: 3, label: 'Bon',       color: '#3B82F6' };
        return       { level: 4, label: 'Excellent', color: C.primary };
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

            <div className="profile-page" style={{ maxWidth: 860, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ marginBottom: 28 }}>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: C.text, letterSpacing: '-0.02em' }}>
                        Mon profil
                    </h1>
                    <p style={{ fontSize: 14, color: C.textDim, marginTop: 4 }}>
                        Gérez vos informations personnelles et la sécurité de votre compte
                    </p>
                </div>

                {/* Hero card */}
                <div style={{
                    background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`,
                    padding: '24px 28px', marginBottom: 20,
                    display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
                }}>
                    <div style={{
                        width: 80, height: 80, borderRadius: 18, flexShrink: 0,
                        background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 28, fontWeight: 700, color: '#fff', textTransform: 'uppercase',
                        boxShadow: '0 8px 24px rgba(16,185,129,0.25)',
                    }}>
                        {initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: 0 }}>
                            {profileForm.data.first_name} {profileForm.data.last_name}
                        </h2>
                        <p style={{ fontSize: 14, color: C.textMuted, marginTop: 3 }}>{user.email}</p>
                        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                            <span style={{
                                padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                                background: C.primaryGlow, color: C.primary,
                            }}>{roleLabels[user.role] ?? user.role}</span>
                            {company && (
                                <span style={{
                                    padding: '4px 12px', borderRadius: 20, fontSize: 12,
                                    background: C.surfaceLight, color: C.textMuted,
                                }}>{company.name}</span>
                            )}
                            {user.employee_id_number && (
                                <span style={{
                                    padding: '4px 12px', borderRadius: 20, fontSize: 12,
                                    background: C.surfaceLight, color: C.textDim,
                                }}>Matricule : {user.employee_id_number}</span>
                            )}
                            {user.department && (
                                <span style={{
                                    padding: '4px 12px', borderRadius: 20, fontSize: 12,
                                    background: C.surfaceLight, color: C.textDim,
                                }}>{user.department.name}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Informations personnelles */}
                <div style={{ marginBottom: 20 }}>
                    <SectionCard
                        title="Informations personnelles"
                        subtitle="Mettez à jour vos informations de profil"
                        icon="👤"
                    >
                        <form onSubmit={submitProfile}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
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
                                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
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
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 4 }}>
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                            <PasswordInput
                                label="Mot de passe actuel"
                                value={passwordForm.data.current_password}
                                onChange={v => passwordForm.setData('current_password', v)}
                                error={passwordForm.errors.current_password}
                                placeholder="Entrez votre mot de passe actuel"
                            />
                            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <PasswordInput
                                        label="Nouveau mot de passe"
                                        value={passwordForm.data.password}
                                        onChange={v => passwordForm.setData('password', v)}
                                        error={passwordForm.errors.password}
                                        placeholder="Minimum 8 caractères"
                                    />
                                    {passwordForm.data.password && (
                                        <div style={{ marginTop: 4 }}>
                                            <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                                                {[1, 2, 3, 4].map(i => (
                                                    <div key={i} style={{
                                                        flex: 1, height: 4, borderRadius: 2,
                                                        background: i <= strength.level ? strength.color : C.surfaceLight,
                                                        transition: 'background 0.3s',
                                                    }} />
                                                ))}
                                            </div>
                                            <span style={{ fontSize: 12, color: strength.color, fontWeight: 500 }}>
                                                {strength.label}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <PasswordInput
                                        label="Confirmer le mot de passe"
                                        value={passwordForm.data.password_confirmation}
                                        onChange={v => passwordForm.setData('password_confirmation', v)}
                                        error={passwordForm.errors.password_confirmation}
                                        placeholder="Retapez le nouveau mot de passe"
                                    />
                                    {passwordForm.data.password_confirmation && passwordForm.data.password && (
                                        <span style={{
                                            fontSize: 12, marginTop: 4,
                                            color: passwordForm.data.password_confirmation === passwordForm.data.password
                                                ? C.primary : C.danger,
                                        }}>
                                            {passwordForm.data.password_confirmation === passwordForm.data.password
                                                ? '✓ Les mots de passe correspondent'
                                                : 'Les mots de passe ne correspondent pas'}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 4 }}>
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

                <div style={{ height: 40 }} />
            </div>
        </AuthenticatedLayout>
    );
}
