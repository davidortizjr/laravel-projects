import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import Badge from '@/Components/Badge';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

function toTime(dt) {
    if (!dt) return '';
    return new Date(dt).toTimeString().slice(0, 5);
}

export default function All({ records, date }) {
    const [editing, setEditing] = useState(null);
    const form = useForm({ status: 'present', clock_in: '', clock_out: '', notes: '' });

    function changeDate(e) {
        router.get(route('attendance.all'), { date: e.target.value }, { preserveState: true });
    }

    function openEdit(row) {
        form.setData({
            status: row.status,
            clock_in: toTime(row.clock_in),
            clock_out: toTime(row.clock_out),
            notes: row.notes ?? '',
        });
        setEditing(row);
    }

    function submit(e) {
        e.preventDefault();
        form.put(route('attendance.update', editing.id), { onSuccess: () => setEditing(null) });
    }

    return (
        <AuthenticatedLayout header="All attendance">
            <Head title="All attendance" />

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
                            <th className="px-4 py-3 font-medium"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {records.map((row) => (
                            <tr key={row.id}>
                                <td className="px-4 py-3 font-medium text-slate-800">{row.employee.user.name}</td>
                                <td className="px-4 py-3 text-slate-600">{row.clock_in ? new Date(row.clock_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                                <td className="px-4 py-3 text-slate-600">{row.clock_out ? new Date(row.clock_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                                <td className="px-4 py-3"><Badge status={row.status} /></td>
                                <td className="px-4 py-3 text-right">
                                    <button onClick={() => openEdit(row)} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">Edit</button>
                                </td>
                            </tr>
                        ))}
                        {records.length === 0 && (
                            <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">No attendance recorded for this date.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal show={editing !== null} onClose={() => setEditing(null)} maxWidth="sm">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-semibold text-slate-800">Correct attendance — {editing?.employee.user.name}</h2>

                    <div className="mt-4">
                        <InputLabel htmlFor="status" value="Status" />
                        <select id="status" className="mt-1 block w-full rounded-md border-slate-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={form.data.status} onChange={(e) => form.setData('status', e.target.value)}>
                            <option value="present">Present</option>
                            <option value="late">Late</option>
                            <option value="half_day">Half day</option>
                            <option value="absent">Absent</option>
                            <option value="on_leave">On leave</option>
                        </select>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="clock_in" value="Clock in" />
                            <TextInput id="clock_in" type="time" className="mt-1 block w-full" value={form.data.clock_in} onChange={(e) => form.setData('clock_in', e.target.value)} />
                        </div>
                        <div>
                            <InputLabel htmlFor="clock_out" value="Clock out" />
                            <TextInput id="clock_out" type="time" className="mt-1 block w-full" value={form.data.clock_out} onChange={(e) => form.setData('clock_out', e.target.value)} />
                        </div>
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="notes" value="Notes (optional)" />
                        <TextInput id="notes" className="mt-1 block w-full" value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setEditing(null)}>Cancel</SecondaryButton>
                        <PrimaryButton disabled={form.processing}>Save</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
