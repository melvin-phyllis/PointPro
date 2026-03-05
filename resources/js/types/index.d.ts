import { Config } from 'ziggy-js';

// ─── Modèles de base ─────────────────────────────────────────

export interface Company {
    id: number;
    name: string;
    slug: string;
    email: string;
    phone?: string;
    address?: string;
    logo_path?: string;
    plan: 'starter' | 'business' | 'enterprise' | 'custom';
    settings?: CompanySettings;
    is_active: boolean;
    subscription_ends_at?: string;
}

export interface CompanySettings {
    work_start: string;
    work_end: string;
    late_tolerance_minutes: number;
    early_check_in_minutes: number;
    auto_absent_after_minutes: number;
    lunch_break_minutes: number;
    timezone: string;
    working_days: string[];
}

export interface User {
    id: number;
    company_id: number;
    department_id?: number;
    location_id?: number;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    phone?: string;
    role: 'super_admin' | 'admin' | 'manager' | 'employee';
    employee_id_number?: string;
    avatar_path?: string;
    is_active: boolean;
    email_verified_at?: string;
    department?: Department;
    assigned_location?: Location;
}

export interface Department {
    id: number;
    company_id: number;
    name: string;
    manager_id?: number;
    manager?: User;
    employee_count?: number;
}

export interface Location {
    id: number;
    company_id: number;
    name: string;
    address?: string;
    latitude: number;
    longitude: number;
    radius_meters: number;
    is_active: boolean;
}

export type AttendanceStatus = 'present' | 'late' | 'absent' | 'half_day' | 'excused';

export interface Attendance {
    id: number;
    user_id: number;
    company_id: number;
    date: string;
    check_in?: string;
    check_out?: string;
    check_in_latitude?: number;
    check_in_longitude?: number;
    check_out_latitude?: number;
    check_out_longitude?: number;
    check_in_location_id?: number;
    check_out_location_id?: number;
    status: AttendanceStatus;
    late_minutes: number;
    worked_hours?: number;
    overtime_hours: number;
    is_geo_verified: boolean;
    notes?: string;
    user?: User;
    check_in_location?: Location;
    check_out_location?: Location;
    // Accessors sérialisés
    worked_duration?: string;
    location_name?: string;
}

export interface DashboardStats {
    total_employees: number;
    present: number;
    late: number;
    absent: number;
    excused: number;
    attendance_rate: number;
    date: string;
}

export interface WeeklyStat extends DashboardStats {
    day_name: string;
}

export interface DeptStat {
    id: number;
    name: string;
    total_employees: number;
    present: number;
    absent: number;
    attendance_rate: number;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

// ─── Props Inertia globales ──────────────────────────────────

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    company?: Company;
    flash: {
        success?: string;
        error?: string;
        info?: string;
    };
    ziggy: Config & { location: string };
    asset_url: string;
};
