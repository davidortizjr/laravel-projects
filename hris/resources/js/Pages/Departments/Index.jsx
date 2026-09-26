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

export default function Index({ departments, managers }) {
    const [editing, setEditing] = useState(null); // department being edited, or 'new'
    const [deleting, setDeleting] = useState(null);

    const form = useForm({ name: '', description: '', manager_id: '' });

    function openCreate() {
        form.reset();
        form.clearErrors();
        setEditing('new');
    }

    function openEdit(department) {
        form.setData({
            name: department.name,
            description: department.description ?? '',
            manager_id: department.manager_id ?? '',
        });
        form.clearErrors();
        setEditing(department);
    }

    function submit(e) {
        e.preventDefault();
        const options = { onSuccess: () => setEditing(null) };
        if (editing === 'new') {
            form.post(route('departments.store'), options);
        } else {
            form.put(route('departments.update', editing.id), options);
        }
    }

    function confirmDelete() {
        form.delete(route('departments.destroy', deleting.id), {
            onSuccess: () => setDeleting(null),
        });
    }

    return (
        <AuthenticatedLayout header="Departments">
            <Head title="Departments" />

            <div className="mb-4 flex items-center justify-between">
                <p className="text-slate-500">Organize employees into departments and assign a department head.</p>
                <PrimaryButton onClick={openCreate}>Add department</PrimaryButton>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-left text-slate-500">
                        <tr>
                            <th className="px-4 py-3 font-medium">Name</th>
                            <th className="px-4 py-3 font-medium">Head</th>
                            <th className="px-4 py-3 font-medium">Employees</th>
                            <th className="px-4 py-3 font-medium"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {departments.map((dept) => (
                            <tr key={dept.id}>
                                <td className="px-4 py-3">
                                    <p className="font-medium text-slate-800">{dept.name}</p>
                                    {dept.description && <p className="text-xs text-slate-400">{dept.description}</p>}
                                </td>
                                <td className="px-4 py-3 text-slate-600">{dept.manager?.user?.name ?? '—'}</td>
                                <td className="px-4 py-3 text-slate-600">{dept.employees_count}</td>
                                <td className="px-4 py-3 text-right">
                                    <button onClick={() => openEdit(dept)} className="mr-3 text-sm font-medium text-indigo-600 hover:text-indigo-800">
                                        Edit
                                    </button>
                                    <button onClick={() => setDeleting(dept)} className="text-sm font-medium text-rose-600 hover:text-rose-800">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {departments.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                                    No departments yet. Add your first one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal show={editing !== null} onClose={() => setEditing(null)}>
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-semibold text-slate-800">
                        {editing === 'new' ? 'Add department' : 'Edit department'}
                    </h2>

                    <div className="mt-4">
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput id="name" className="mt-1 block w-full" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                        <InputError message={form.errors.name} className="mt-1" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="description" value="Description (optional)" />
                        <textarea
                            id="description"
                            className="mt-1 block w-full rounded-md border-slate-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            rows={2}
                            value={form.data.description}
                            onChange={(e) => form.setData('description', e.target.value)}
                        />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="manager_id" value="Department head (optional)" />
                        <select
                            id="manager_id"
                            className="mt-1 block w-full rounded-md border-slate-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={form.data.manager_id}
                            onChange={(e) => form.setData('manager_id', e.target.value)}
                        >
                            <option value="">None</option>
                            {managers.map((m) => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setEditing(null)}>Cancel</SecondaryButton>
                        <PrimaryButton disabled={form.processing}>Save</PrimaryButton>
                    </div>
                </form>
            </Modal>

            <Modal show={deleting !== null} onClose={() => setDeleting(null)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-slate-800">Delete department?</h2>
                    <p className="mt-2 text-sm text-slate-500">
                        This removes "{deleting?.name}". Employees in it will keep their record but lose their department link.
                    </p>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setDeleting(null)}>Cancel</SecondaryButton>
                        <DangerButton onClick={confirmDelete}>Delete</DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
