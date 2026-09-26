import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatCard from '@/Components/StatCard';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ stats }) {
    const { auth } = usePage().props;
    const role = auth.user.role;

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            <p className="mb-6 text-slate-500">Welcome back, {auth.user.name.split(' ')[0]}.</p>

            {(role === 'admin' || role === 'hr') && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard label="Active employees" value={stats.total_employees} />
                    <StatCard label="Departments" value={stats.total_departments} />
                    <StatCard label="Present today" value={stats.present_today} />
                    <StatCard label="Pending leave requests" value={stats.pending_leave_requests} />
                </div>
            )}

            {role === 'manager' && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard label="Team size" value={stats.team_size} />
                    <StatCard label="Present today" value={stats.present_today} />
                    <StatCard label="Pending approvals" value={stats.pending_leave_requests} />
                </div>
            )}

            {role === 'employee' && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard
                        label="Today"
                        value={stats.clocked_in_today ? (stats.clocked_out_today ? 'Clocked out' : 'Clocked in') : 'Not clocked in'}
                    />
                    <StatCard label="Pending leave requests" value={stats.pending_leave_requests} />
                    <StatCard
                        label="Latest payslip"
                        value={stats.latest_payslip ? `${stats.latest_payslip.period_month}/${stats.latest_payslip.period_year}` : '—'}
                        hint={stats.latest_payslip ? undefined : 'No payroll has been generated yet'}
                    />
                </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
                <Link href={route('attendance.index')} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    Go to attendance
                </Link>
                <Link href={route('leave.index')} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    Request leave
                </Link>
                <Link href={route('payroll.index')} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    {role === 'admin' || role === 'hr' ? 'Manage payroll' : 'View payslips'}
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}
