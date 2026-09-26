import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import Badge from '@/Components/Badge';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Index({ today, history }) {
    const { flash } = usePage().props;

    function clockIn() {
        router.post(route('attendance.clock-in'));
    }
    function clockOut() {
        router.post(route('attendance.clock-out'));
    }

    return (
        <AuthenticatedLayout header="My attendance">
            <Head title="My attendance" />

            {flash?.success && <div className="mb-4 rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{flash.success}</div>}
            {flash?.error && <div className="mb-4 rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-700">{flash.error}</div>}

            <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6">
                <p className="text-sm text-slate-500">Today, {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                    <div>
                        <p className="text-xs text-slate-400">Clock in</p>
                        <p className="text-lg font-semibold text-slate-800">
                            {today?.clock_in ? new Date(today.clock_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400">Clock out</p>
                        <p className="text-lg font-semibold text-slate-800">
                            {today?.clock_out ? new Date(today.clock_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </p>
                    </div>
                    <div className="ml-auto flex gap-3">
                        {!today?.clock_in && <PrimaryButton onClick={clockIn}>Clock in</PrimaryButton>}
                        {today?.clock_in && !today?.clock_out && <PrimaryButton onClick={clockOut}>Clock out</PrimaryButton>}
                        {today?.clock_in && today?.clock_out && <Badge status="present" />}
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-left text-slate-500">
                        <tr>
                            <th className="px-4 py-3 font-medium">Date</th>
                            <th className="px-4 py-3 font-medium">Clock in</th>
                            <th className="px-4 py-3 font-medium">Clock out</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {history.data.map((row) => (
                            <tr key={row.id}>
                                <td className="px-4 py-3 text-slate-700">{row.date}</td>
                                <td className="px-4 py-3 text-slate-600">{row.clock_in ? new Date(row.clock_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                                <td className="px-4 py-3 text-slate-600">{row.clock_out ? new Date(row.clock_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                                <td className="px-4 py-3"><Badge status={row.status} /></td>
                            </tr>
                        ))}
                        {history.data.length === 0 && (
                            <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">No attendance recorded yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {history.links.length > 3 && (
                <div className="mt-4 flex flex-wrap gap-1">
                    {history.links.map((link, i) => (
                        <Link key={i} href={link.url ?? '#'} preserveState
                            className={'rounded-md px-3 py-1.5 text-sm ' + (link.active ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50') + (!link.url ? ' pointer-events-none opacity-40' : '')}
                            dangerouslySetInnerHTML={{ __html: link.label }} />
                    ))}
                </div>
            )}
        </AuthenticatedLayout>
    );
}
