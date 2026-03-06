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

// ─── Super Admin — Facturation & Support ─────────────────────

export interface Plan {
    id: number;
    name: string;
    slug: string;
    price: number;
    currency: string;
    max_employees: number | null;
    max_locations: number;
    features: Record<string, boolean>;
    billing_cycle: 'monthly' | 'quarterly' | 'yearly';
    is_active: boolean;
    sort_order: number;
    formatted_price?: string;
    subscriptions_count?: number;
}

export interface Subscription {
    id: number;
    company_id: number;
    plan_id: number;
    status: 'active' | 'pending' | 'expired' | 'cancelled' | 'suspended';
    starts_at: string;
    ends_at: string;
    trial_ends_at?: string;
    cancelled_at?: string;
    cancellation_reason?: string;
    company?: Company;
    plan?: Plan;
    days_remaining?: number;
}

export interface Payment {
    id: number;
    company_id: number;
    subscription_id?: number;
    amount: number;
    currency: string;
    payment_method: 'mobile_money' | 'wave' | 'cinetpay' | 'fedapay' | 'bank_transfer' | 'cash' | 'other';
    payment_provider?: string;
    provider_transaction_id?: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
    paid_at?: string;
    metadata?: Record<string, unknown>;
    notes?: string;
    created_at: string;
    company?: Company;
    subscription?: Subscription;
    formatted_amount?: string;
}

export interface Invoice {
    id: number;
    company_id: number;
    payment_id?: number;
    invoice_number: string;
    amount: number;
    currency: string;
    tax_amount: number;
    total_amount: number;
    description?: string;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    due_date: string;
    paid_at?: string;
    sent_at?: string;
    billing_details: Record<string, unknown>;
    created_at: string;
    company?: Company;
    payment?: Payment;
}

export interface SupportTicket {
    id: number;
    company_id: number;
    user_id: number;
    ticket_number: string;
    subject: string;
    category: 'bug' | 'billing' | 'feature_request' | 'account' | 'general';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
    assigned_to?: number;
    resolved_at?: string;
    closed_at?: string;
    created_at: string;
    updated_at: string;
    company?: Company;
    user?: User;
    assigned_to_user?: User;
    messages?: TicketMessage[];
    messages_count?: number;
}

export interface TicketMessage {
    id: number;
    ticket_id: number;
    user_id: number;
    body: string;
    is_internal_note: boolean;
    attachments?: string[];
    created_at: string;
    user?: User;
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
