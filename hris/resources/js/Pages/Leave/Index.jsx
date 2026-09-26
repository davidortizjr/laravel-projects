import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import Badge from '@/Components/Badge';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Index({ requests, leaveTypes }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        leave_type_id: leaveTypes[0]?.id ?? '',
        start_date: '',
        end_date: '',
        reason: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('leave.store'), { onSuccess: () => reset('start_date', 'end_date', 'reason') });
    }

    return (
        <AuthenticatedLayout header="My leave">
            <Head title="My leave" />

            {flash?.success && <div className="mb-4 rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{flash.success}</div>}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-1">
                    <h2 className="mb-4 text-sm font-semibold text-slate-700">Apply for leave</h2>

                    <div className="mb-4">
                        <InputLabel htmlFor="leave_type_id" value="Leave type" />
                        <select id="leave_type_id" className="mt-1 block w-full rounded-md border-slate-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.leave_type_id} onChange={(e) => setData('leave_type_id', e.target.value)}>
                            {leaveTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-3">
                        <div>
                            <InputLabel htmlFor="start_date" value="From" />
                            <TextInput id="start_date" type="date" className="mt-1 block w-full" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} />
                            <InputError message={errors.start_date} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="end_date" value="To" />
                            <TextInput id="end_date" type="date" className="mt-1 block w-full" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} />
                            <InputError message={errors.end_date} className="mt-1" />
                        </div>
                    </div>

                    <div className="mb-4">
                        <InputLabel htmlFor="reason" value="Reason (optional)" />
                        <textarea id="reason" rows={3} className="mt-1 block w-full rounded-md border-slate-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.reason} onChange={(e) => setData('reason', e.target.value)} />
                    </div>

                    <PrimaryButton disabled={processing} className="w-full justify-center">Submit request</PrimaryButton>
                </form>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white lg:col-span-2">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                        <thead className="bg-slate-50 text-left text-slate-500">
                            <tr>
                                <th className="px-4 py-3 font-medium">Type</th>
                                <th className="px-4 py-3 font-medium">Dates</th>
                                <th className="px-4 py-3 font-medium">Days</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {requests.map((r) => (
                                <tr key={r.id}>
                                    <td className="px-4 py-3 text-slate-700">{r.leave_type.name}</td>
                                    <td className="px-4 py-3 text-slate-600">{r.start_date} → {r.end_date}</td>
                                    <td className="px-4 py-3 text-slate-600">{r.total_days}</td>
                                    <td className="px-4 py-3"><Badge status={r.status} /></td>
                                </tr>
                            ))}
                            {requests.length === 0 && (
                                <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">No leave requests yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
