import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import Badge from '@/Components/Badge';

export default function Team({ records, date }) {
    function changeDate(e) {
        router.get(route('attendance.team'), { date: e.target.value }, { preserveState: true });
    }

    return (
        <AuthenticatedLayout header="Team attendance">
            <Head title="Team attendance" />

            <div className="mb-4">
                <input type="date" value={date} onChange={changeDate}
                    className="rounded-md border-slate-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-left text-slate-500">
                        <tr>
                            <th className="px-4 py-3 font-medium">Employee</th>
                            <th className="px-4 py-3 font-medium">Clock in</th>
                            <th className="px-4 py-3 font-medium">Clock out</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {records.map((row) => (
                            <tr key={row.id}>
                                <td className="px-4 py-3 font-medium text-slate-800">{row.employee.user.name}</td>
                                <td className="px-4 py-3 text-slate-600">{row.clock_in ? new Date(row.clock_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                                <td className="px-4 py-3 text-slate-600">{row.clock_out ? new Date(row.clock_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                                <td className="px-4 py-3"><Badge status={row.status} /></td>
                            </tr>
                        ))}
                        {records.length === 0 && (
                            <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">No attendance recorded for this date.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
}
