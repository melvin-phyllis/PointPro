import ConfirmModal from '@/Components/ConfirmModal';
import Toast from '@/Components/Toast';
import { useTheme } from '@/Contexts/ThemeContext';
import { useClock } from '@/hooks/useClock';
import { PageProps } from '@/types';
import { getInitials } from '@/utils/helpers';
import { Link, router, usePage } from '@inertiajs/react';
import {
    AlertCircle, BarChart3, Building2, ChevronDown, ChevronLeft, ChevronRight,
    CreditCard, FileText, LayoutDashboard, LogOut,
    MapPin, Menu, Moon, ClipboardList, Settings, Sun, Tag,
    Ticket, Timer, User, Users, X,
} from 'lucide-react';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';

interface NavItem {
    label: string;
    href: string;
    routeName: string | string[];
    icon: React.ReactNode;
    roles: string[];
}

function ThemeToggle() {
    const { isDark, toggle } = useTheme();
    return (
        <button
            onClick={(e) => toggle(e)}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:bg-black/5 dark:hover:bg-subtle"
            title={isDark ? 'Mode clair' : 'Mode sombre'}
        >
            {isDark
                ? <Sun size={16} className="text-amber-400" />
                : <Moon size={16} className="text-slate-500" />
            }
        </button>
    );
}

/** Affiche le rôle en libellé lisible (ex. super_admin → "Super Admin"). */
function formatRoleLabel(role: string): string {
    return role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function SidebarLink({ item, isActive, collapsed }: { item: NavItem; isActive: boolean; collapsed: boolean }) {
    return (
        <Link
            href={item.href}
            title={collapsed ? item.label : undefined}
            className={[
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                collapsed ? 'justify-center' : '',
                isActive
                    ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
                    : 'text-gray-500 dark:text-muted hover:bg-gray-100 dark:hover:bg-subtle hover:text-gray-900 dark:hover:text-primary',
            ].join(' ')}
        >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="truncate">{item.label}</span>}
            {!collapsed && isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500" />}
        </Link>
    );
}

export default function Authenticated({ children }: PropsWithChildren) {
    const { auth: { user }, company, asset_url, subscription_expired = false } = usePage<PageProps>().props;
    const { time, date } = useClock();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('sidebar_collapsed') === 'true';
        }
        return false;
    });

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!userMenuOpen) return;
        const close = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('click', close);
        return () => document.removeEventListener('click', close);
    }, [userMenuOpen]);

    const handleLogout = () => {
        router.post(route('logout'));
        setShowLogoutModal(false);
    };

    const isSuperAdmin = user.role === 'super_admin';

    const navItems: NavItem[] = isSuperAdmin
        ? [
            { label: 'Dashboard', href: route('admin.dashboard'), routeName: 'admin.dashboard', icon: <LayoutDashboard size={18} />, roles: ['super_admin'] },
            { label: 'Entreprises', href: route('admin.companies.index'), routeName: 'admin.companies.*', icon: <Building2 size={18} />, roles: ['super_admin'] },
            { label: 'Demandes de devis', href: route('admin.quote-requests.index'), routeName: 'admin.quote-requests.*', icon: <ClipboardList size={18} />, roles: ['super_admin'] },
            { label: 'Paiements', href: route('admin.payments.index'), routeName: 'admin.payments.*', icon: <CreditCard size={18} />, roles: ['super_admin'] },
            { label: 'Factures', href: route('admin.invoices.index'), routeName: 'admin.invoices.*', icon: <FileText size={18} />, roles: ['super_admin'] },
            { label: 'Plans', href: route('admin.plans.index'), routeName: 'admin.plans.*', icon: <Tag size={18} />, roles: ['super_admin'] },
            { label: 'Support', href: route('admin.tickets.index'), routeName: 'admin.tickets.*', icon: <Ticket size={18} />, roles: ['super_admin'] },
            { label: 'Params', href: route('admin.settings.index'), routeName: 'admin.settings.*', icon: <Settings size={18} />, roles: ['super_admin'] },
        ]
        : [
            { label: 'Tableau de bord', href: route('dashboard'), routeName: 'dashboard', icon: <LayoutDashboard size={18} />, roles: ['admin', 'manager', 'employee'] },
            { label: 'Mon pointage', href: route('attendance.index'), routeName: ['attendance.index', 'attendance.history'], icon: <Timer size={18} />, roles: ['manager', 'employee'] },
            { label: 'Mon equipe', href: route('team.index'), routeName: ['team.index', 'team.today'], icon: <Users size={18} />, roles: ['manager'] },
            { label: 'Presences', href: route('team.today'), routeName: ['team.today', 'team.index'], icon: <Users size={18} />, roles: ['admin'] },
            { label: 'Employes', href: route('employes.index'), routeName: 'employes.*', icon: <Users size={18} />, roles: ['admin'] },
            { label: 'Departements', href: route('departements.index'), routeName: 'departements.*', icon: <Building2 size={18} />, roles: ['admin'] },
            { label: 'Zones GPS', href: route('zones.index'), routeName: 'zones.*', icon: <MapPin size={18} />, roles: ['admin'] },
            { label: 'Rapports', href: route('reports.index'), routeName: ['reports.*'], icon: <BarChart3 size={18} />, roles: ['admin'] },
            { label: 'Abonnement', href: route('subscription.index'), routeName: 'subscription.*', icon: <Tag size={18} />, roles: ['admin'] },
            { label: 'Support', href: route('client.tickets.index'), routeName: 'client.tickets.*', icon: <Ticket size={18} />, roles: ['admin'] },
            { label: 'Parametres', href: route('settings.index'), routeName: 'settings.*', icon: <Settings size={18} />, roles: ['admin'] },
        ];

    const visibleItems = isSuperAdmin ? navItems : navItems.filter(i => i.roles.includes(user.role));

    function isActiveRoute(routeName: string | string[]): boolean {
        const names = Array.isArray(routeName) ? routeName : [routeName];
        return names.some(n => route().current(n));
    }

    const sidebarW = collapsed ? 'w-16' : 'w-64';

    return (
        <div className="flex h-screen overflow-hidden bg-page">

            {/* ── Desktop sidebar ─── */}
            <aside className={`hidden lg:flex flex-col flex-shrink-0 ${sidebarW} border-r border-theme bg-surface transition-all duration-300`}>
                <div className={`flex h-16 items-center border-b border-theme px-4 gap-3 ${collapsed ? 'justify-center' : ''}`}>
                    <img src={`${asset_url}/Pointpro.png`} alt="PointPro" className="h-12 w-auto object-contain flex-shrink-0" />
                    {!collapsed && <p className="text-xs text-secondary truncate">{company?.name ?? 'Systeme'}</p>}
                </div>

                <nav className="flex-1 overflow-y-auto px-2 py-4">
                    <div className="space-y-0.5">
                        {visibleItems.map(item => (
                            <SidebarLink key={item.label} item={item} isActive={isActiveRoute(item.routeName)} collapsed={collapsed} />
                        ))}
                    </div>
                </nav>

                <div className="border-t border-theme p-3">
                    <button
                        onClick={() => setCollapsed(c => !c)}
                        className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-secondary hover:bg-gray-100 dark:hover:bg-subtle transition-all ${collapsed ? 'justify-center' : ''}`}
                    >
                        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                        {!collapsed && <span>Réduire</span>}
                    </button>
                </div>
            </aside>

            {/* ── Mobile overlay ─── */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* ── Mobile sidebar ─── */}
            <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-theme bg-surface transition-transform duration-300 lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex h-16 items-center justify-between border-b border-theme px-4">
                    <div className="flex items-center gap-3">
                        <img src={`${asset_url}/Pointpro.png`} alt="PointPro" className="h-12 w-auto" />
                        <p className="text-xs text-secondary truncate">{company?.name ?? 'Systeme'}</p>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-1.5 text-secondary hover:bg-gray-100 dark:hover:bg-subtle transition">
                        <X size={18} />
                    </button>
                </div>
                <nav className="flex-1 overflow-y-auto px-3 py-4">
                    <div className="space-y-0.5">
                        {visibleItems.map(item => (
                            <SidebarLink key={item.label} item={item} isActive={isActiveRoute(item.routeName)} collapsed={false} />
                        ))}
                    </div>
                </nav>
            </aside>

            {/* ── Main ─── */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="relative flex h-16 items-center justify-between border-b border-theme bg-surface px-4 lg:px-6">
                    <div className="flex items-center gap-3">
                        <button className="lg:hidden rounded-lg p-2 text-secondary hover:bg-gray-100 dark:hover:bg-subtle transition" onClick={() => setSidebarOpen(true)}>
                            <Menu size={20} />
                        </button>
                        <div className="hidden sm:flex flex-col">
                            <span className="font-display font-bold text-lg tabular-nums tracking-tight text-primary">{time}</span>
                            <span className="text-xs text-secondary capitalize">{date}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2" ref={userMenuRef}>
                        <ThemeToggle />
                        <button
                            type="button"
                            onClick={() => setUserMenuOpen(o => !o)}
                            className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm text-secondary transition hover:bg-gray-100 dark:hover:bg-subtle hover:text-primary"
                            aria-expanded={userMenuOpen}
                            aria-haspopup="true"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/15 text-xs font-bold text-brand-600 dark:text-brand-400">
                                {getInitials(user.full_name)}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="font-medium text-primary leading-tight">{user.full_name}</p>
                                <p className="text-xs text-secondary leading-tight">{formatRoleLabel(user.role)}</p>
                            </div>
                            <ChevronDown size={16} className={`text-muted transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {userMenuOpen && (
                            <div className="absolute right-4 top-14 z-50 min-w-[180px] rounded-xl border border-theme bg-surface py-1 shadow-lg">
                                <Link
                                    href={route('profile.edit')}
                                    onClick={() => setUserMenuOpen(false)}
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-primary hover:bg-subtle transition"
                                >
                                    <User size={16} className="text-muted" />
                                    Mon profil
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => { setShowLogoutModal(true); setUserMenuOpen(false); }}
                                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-primary hover:bg-subtle hover:text-red-500 transition text-left"
                                >
                                    <LogOut size={16} className="text-muted" />
                                    Déconnexion
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                <main className="relative flex-1 overflow-y-auto p-4 lg:p-6">
                    {children}

                    {/* Overlay abonnement expiré : bloque l'usage, invite à renouveler */}
                    {subscription_expired && (
                        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                            <div className="w-full max-w-md rounded-2xl border border-theme bg-surface p-6 shadow-xl text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/20 text-amber-500 mb-4">
                                    <AlertCircle size={28} />
                                </div>
                                <h2 className="text-xl font-bold text-primary mb-2">
                                    Votre abonnement a expiré
                                </h2>
                                <p className="text-sm text-secondary mb-6">
                                    Renouvelez-le pour continuer à utiliser le service.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Link
                                        href={route('subscription.index')}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-600"
                                    >
                                        Renouveler
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setShowLogoutModal(true)}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-theme bg-transparent px-5 py-3 text-sm font-medium text-muted transition hover:bg-subtle"
                                    >
                                        Se déconnecter
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            <Toast />

            <ConfirmModal
                show={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
                title="Déconnexion"
                description="Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à l'application."
                confirmText="Se déconnecter"
                variant="danger"
            />
        </div>
    );
}
