import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function Approvals({ requests }) {
    const { flash } = usePage().props;
    const [rejecting, setRejecting] = useState(null);
    const form = useForm({ remarks: '' });

    function approve(request) {
        router.patch(route('leave.approve', request.id));
    }

    function submitReject(e) {
        e.preventDefault();
        form.patch(route('leave.reject', rejecting.id), { onSuccess: () => setRejecting(null) });
    }

    return (
        <AuthenticatedLayout header="Leave approvals">
            <Head title="Leave approvals" />

            {flash?.success && <div className="mb-4 rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{flash.success}</div>}

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-left text-slate-500">
                        <tr>
                            <th className="px-4 py-3 font-medium">Employee</th>
                            <th className="px-4 py-3 font-medium">Type</th>
                            <th className="px-4 py-3 font-medium">Dates</th>
                            <th className="px-4 py-3 font-medium">Reason</th>
                            <th className="px-4 py-3 font-medium"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {requests.map((r) => (
                            <tr key={r.id}>
                                <td className="px-4 py-3 font-medium text-slate-800">{r.employee.user.name}</td>
                                <td className="px-4 py-3 text-slate-600">{r.leave_type.name}</td>
                                <td className="px-4 py-3 text-slate-600">{r.start_date} → {r.end_date} ({r.total_days}d)</td>
                                <td className="px-4 py-3 text-slate-500">{r.reason ?? '—'}</td>
                                <td className="px-4 py-3 text-right">
                                    <button onClick={() => approve(r)} className="mr-3 text-sm font-medium text-emerald-600 hover:text-emerald-800">Approve</button>
                                    <button onClick={() => setRejecting(r)} className="text-sm font-medium text-rose-600 hover:text-rose-800">Reject</button>
                                </td>
                            </tr>
                        ))}
                        {requests.length === 0 && (
                            <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">No pending leave requests.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal show={rejecting !== null} onClose={() => setRejecting(null)} maxWidth="sm">
                <form onSubmit={submitReject} className="p-6">
                    <h2 className="text-lg font-semibold text-slate-800">Reject leave request</h2>
                    <p className="mt-1 text-sm text-slate-500">{rejecting?.employee.user.name} · {rejecting?.start_date} → {rejecting?.end_date}</p>

                    <div className="mt-4">
                        <InputLabel htmlFor="remarks" value="Reason for rejection (optional)" />
                        <TextInput id="remarks" className="mt-1 block w-full" value={form.data.remarks} onChange={(e) => form.setData('remarks', e.target.value)} />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setRejecting(null)}>Cancel</SecondaryButton>
                        <DangerButton disabled={form.processing}>Reject</DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
