import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function Types({ leaveTypes }) {
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const form = useForm({ name: '', days_allowed: 0, description: '' });

    function openCreate() {
        form.reset();
        form.clearErrors();
        setEditing('new');
    }

    function openEdit(type) {
        form.setData({ name: type.name, days_allowed: type.days_allowed, description: type.description ?? '' });
        form.clearErrors();
        setEditing(type);
    }

    function submit(e) {
        e.preventDefault();
        const options = { onSuccess: () => setEditing(null) };
        editing === 'new'
            ? form.post(route('leave-types.store'), options)
            : form.put(route('leave-types.update', editing.id), options);
    }

    function confirmDelete() {
        form.delete(route('leave-types.destroy', deleting.id), { onSuccess: () => setDeleting(null) });
    }

    return (
        <AuthenticatedLayout header="Leave types">
            <Head title="Leave types" />

            <div className="mb-4 flex items-center justify-between">
                <p className="text-slate-500">The leave categories employees can request against.</p>
                <PrimaryButton onClick={openCreate}>Add leave type</PrimaryButton>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-left text-slate-500">
                        <tr>
                            <th className="px-4 py-3 font-medium">Name</th>
                            <th className="px-4 py-3 font-medium">Days per year</th>
                            <th className="px-4 py-3 font-medium"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {leaveTypes.map((t) => (
                            <tr key={t.id}>
                                <td className="px-4 py-3">
                                    <p className="font-medium text-slate-800">{t.name}</p>
                                    {t.description && <p className="text-xs text-slate-400">{t.description}</p>}
                                </td>
                                <td className="px-4 py-3 text-slate-600">{t.days_allowed}</td>
                                <td className="px-4 py-3 text-right">
                                    <button onClick={() => openEdit(t)} className="mr-3 text-sm font-medium text-indigo-600 hover:text-indigo-800">Edit</button>
                                    <button onClick={() => setDeleting(t)} className="text-sm font-medium text-rose-600 hover:text-rose-800">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal show={editing !== null} onClose={() => setEditing(null)} maxWidth="sm">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-semibold text-slate-800">{editing === 'new' ? 'Add leave type' : 'Edit leave type'}</h2>

                    <div className="mt-4">
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput id="name" className="mt-1 block w-full" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                        <InputError message={form.errors.name} className="mt-1" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="days_allowed" value="Days allowed per year" />
                        <TextInput id="days_allowed" type="number" className="mt-1 block w-full" value={form.data.days_allowed} onChange={(e) => form.setData('days_allowed', e.target.value)} />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="description" value="Description (optional)" />
                        <textarea id="description" rows={2} className="mt-1 block w-full rounded-md border-slate-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setEditing(null)}>Cancel</SecondaryButton>
                        <PrimaryButton disabled={form.processing}>Save</PrimaryButton>
                    </div>
                </form>
            </Modal>

            <Modal show={deleting !== null} onClose={() => setDeleting(null)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-slate-800">Delete leave type?</h2>
                    <p className="mt-2 text-sm text-slate-500">This removes "{deleting?.name}". Existing requests keep their record.</p>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setDeleting(null)}>Cancel</SecondaryButton>
                        <DangerButton onClick={confirmDelete}>Delete</DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
