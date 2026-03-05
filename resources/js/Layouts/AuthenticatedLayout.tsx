import Toast from '@/Components/Toast';
import { useClock } from '@/hooks/useClock';
import { PageProps } from '@/types';
import { getInitials } from '@/utils/helpers';
import { Link, router, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

// ─── Icônes SVG inline ──────────────────────────────────────
const icons = {
    dashboard: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    pointage:  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    equipe:    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
    employes:  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    depts:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
    zones:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />,
    presence:  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />,
    rapports:  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    settings:  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
    logout:    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />,
};

interface NavItem {
    label: string;
    href: string;
    routeName: string | string[];
    icon: ReactNode;
    roles: string[];
}

function SidebarLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
    return (
        <Link
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
            }`}
        >
            <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {item.icon}
            </svg>
            <span>{item.label}</span>
            {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />}
        </Link>
    );
}

export default function AuthenticatedLayout({ children }: PropsWithChildren) {
    const { auth, company, asset_url } = usePage<PageProps>().props;
    const { user } = auth;
    const { time, date } = useClock();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isSuperAdmin = user.role === 'super_admin';

    const navItems: NavItem[] = isSuperAdmin
        ? [
            {
                label: 'Dashboard',
                href: route('admin.dashboard'),
                routeName: 'admin.dashboard',
                icon: icons.dashboard,
                roles: ['super_admin'],
            },
            {
                label: 'Entreprises',
                href: route('admin.companies.index'),
                routeName: 'admin.companies.*',
                icon: icons.depts,
                roles: ['super_admin'],
            },
        ]
        : [
            {
                label: 'Tableau de bord',
                href: route('dashboard'),
                routeName: 'dashboard',
                icon: icons.dashboard,
                roles: ['admin', 'manager', 'employee'],
            },
            {
                label: 'Mon pointage',
                href: route('attendance.index'),
                routeName: ['attendance.index', 'attendance.history'],
                icon: icons.pointage,
                roles: ['manager', 'employee'],
            },
            {
                label: 'Mon équipe',
                href: route('team.index'),
                routeName: ['team.index', 'team.today'],
                icon: icons.equipe,
                roles: ['manager'],
            },
            {
                label: 'Présences',
                href: route('team.today'),
                routeName: ['team.today', 'team.index'],
                icon: icons.presence,
                roles: ['admin'],
            },
            {
                label: 'Employés',
                href: route('employes.index'),
                routeName: 'employes.*',
                icon: icons.employes,
                roles: ['admin'],
            },
            {
                label: 'Départements',
                href: route('departements.index'),
                routeName: 'departements.*',
                icon: icons.depts,
                roles: ['admin'],
            },
            {
                label: 'Zones GPS',
                href: route('zones.index'),
                routeName: 'zones.*',
                icon: icons.zones,
                roles: ['admin'],
            },
            {
                label: 'Rapports',
                href: route('reports.index'),
                routeName: ['reports.*'],
                icon: icons.rapports,
                roles: ['admin'],
            },
            {
                label: 'Paramètres',
                href: route('settings.index'),
                routeName: 'settings.*',
                icon: icons.settings,
                roles: ['admin'],
            },
        ];

    const visibleItems = isSuperAdmin
        ? navItems
        : navItems.filter(item => item.roles.includes(user.role));

    function isActiveRoute(routeName: string | string[]): boolean {
        const names = Array.isArray(routeName) ? routeName : [routeName];
        return names.some(name => route().current(name));
    }

    function handleLogout() {
        router.post(route('logout'));
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[#0A0E1A]">

            {/* ─── Sidebar (desktop) ───────────────────────── */}
            <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#0D1117] transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                {/* Logo */}
                <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
                    <img src={`${asset_url}/Pointpro.png`} alt="PointPro" className="h-8 w-auto object-contain" />
                    <p className="text-xs text-gray-500">{company?.name ?? 'Système'}</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 py-4">
                    <div className="space-y-1">
                        {visibleItems.map(item => (
                            <SidebarLink
                                key={item.label}
                                item={item}
                                isActive={isActiveRoute(item.routeName)}
                            />
                        ))}
                    </div>
                </nav>

                {/* Profil utilisateur */}
                <div className="border-t border-white/10 p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                            {getInitials(user.full_name)}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-200">{user.full_name}</p>
                            <p className="truncate text-xs text-gray-500 capitalize">{user.role}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            title="Déconnexion"
                            className="flex-shrink-0 rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-gray-200"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {icons.logout}
                            </svg>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ─── Contenu principal ────────────────────────── */}
            <div className="flex flex-1 flex-col overflow-hidden">

                {/* Header */}
                <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#0D1117] px-4 lg:px-6">
                    {/* Bouton menu mobile */}
                    <button
                        className="lg:hidden rounded-lg p-2 text-gray-400 hover:bg-white/10"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Horloge en temps réel */}
                    <div className="hidden sm:flex flex-col items-start">
                        <span className="font-mono text-xl font-bold tracking-wider text-white">{time}</span>
                        <span className="text-xs text-gray-500 capitalize">{date}</span>
                    </div>

                    <div className="ml-auto flex items-center gap-4">
                        <Link
                            href={route('profile.edit')}
                            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-gray-400 transition hover:bg-white/10 hover:text-gray-200"
                        >
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                                {getInitials(user.full_name)}
                            </div>
                            <span className="hidden sm:block">{user.first_name}</span>
                        </Link>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    {children}
                </main>
            </div>

            <Toast />
        </div>
    );
}
