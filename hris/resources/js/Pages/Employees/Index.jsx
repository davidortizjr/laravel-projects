import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Badge from '@/Components/Badge';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Index({ employees, filters, canManage }) {
    function search(e) {
        e.preventDefault();
        router.get(route('employees.index'), { search: e.target.search.value }, { preserveState: true });
    }

    return (
        <AuthenticatedLayout header="Employees">
            <Head title="Employees" />

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <form onSubmit={search} className="flex gap-2">
                    <TextInput name="search" defaultValue={filters.search ?? ''} placeholder="Search by name…" className="w-64" />
                    <button type="submit" className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
                        Search
                    </button>
                </form>
                {canManage && <PrimaryButton onClick={() => router.get(route('employees.create'))}>Add employee</PrimaryButton>}
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-left text-slate-500">
                        <tr>
                            <th className="px-4 py-3 font-medium">Employee</th>
                            <th className="px-4 py-3 font-medium">Department</th>
                            <th className="px-4 py-3 font-medium">Position</th>
                            <th className="px-4 py-3 font-medium">Manager</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {employees.data.map((emp) => (
                            <tr key={emp.id}>
                                <td className="px-4 py-3">
                                    <p className="font-medium text-slate-800">{emp.user.name}</p>
                                    <p className="text-xs text-slate-400">{emp.employee_number} · {emp.user.email}</p>
                                </td>
                                <td className="px-4 py-3 text-slate-600">{emp.department?.name ?? '—'}</td>
                                <td className="px-4 py-3 text-slate-600">{emp.position?.title ?? '—'}</td>
                                <td className="px-4 py-3 text-slate-600">{emp.manager?.user?.name ?? '—'}</td>
                                <td className="px-4 py-3"><Badge status={emp.status} /></td>
                                <td className="px-4 py-3 text-right">
                                    <Link href={route('employees.show', emp.id)} className="mr-3 text-sm font-medium text-indigo-600 hover:text-indigo-800">
                                        View
                                    </Link>
                                    {canManage && (
                                        <Link href={route('employees.edit', emp.id)} className="text-sm font-medium text-slate-600 hover:text-slate-800">
                                            Edit
                                        </Link>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {employees.data.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">No employees found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {employees.links.length > 3 && (
                <div className="mt-4 flex flex-wrap gap-1">
                    {employees.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? '#'}
                            preserveState
                            className={
                                'rounded-md px-3 py-1.5 text-sm ' +
                                (link.active ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50') +
                                (!link.url ? ' pointer-events-none opacity-40' : '')
                            }
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </AuthenticatedLayout>
    );
}
