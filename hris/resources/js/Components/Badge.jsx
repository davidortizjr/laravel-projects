const STYLES = {
    // attendance
    present: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    late: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    half_day: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    absent: 'bg-rose-50 text-rose-700 ring-rose-600/20',
    on_leave: 'bg-sky-50 text-sky-700 ring-sky-600/20',
    // leave / payroll
    pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    approved: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    rejected: 'bg-rose-50 text-rose-700 ring-rose-600/20',
    draft: 'bg-slate-100 text-slate-600 ring-slate-500/20',
    processed: 'bg-sky-50 text-sky-700 ring-sky-600/20',
    paid: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    // employee status
    active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    inactive: 'bg-slate-100 text-slate-600 ring-slate-500/20',
};

export default function Badge({ status }) {
    const style = STYLES[status] ?? 'bg-slate-100 text-slate-600 ring-slate-500/20';
    const label = (status ?? '').replace('_', ' ');

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${style}`}>
            {label}
        </span>
    );
}
