import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Badge from '@/Components/Badge';

function Field({ label, value }) {
    return (
        <div>
            <p className="text-xs text-slate-400">{label}</p>
            <p className="mt-0.5 text-sm text-slate-700">{value ?? '—'}</p>
        </div>
    );
}

export default function Show({ employee, canManage }) {
    return (
        <AuthenticatedLayout header="Employee profile">
            <Head title={employee.user.name} />

            <div className="max-w-3xl space-y-6">
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800">{employee.user.name}</h2>
                            <p className="text-sm text-slate-500">{employee.position?.title ?? 'No position set'} · {employee.department?.name ?? 'No department'}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge status={employee.status} />
                            {canManage && (
                                <Link href={route('employees.edit', employee.id)} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                                    Edit
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3">
                        <Field label="Employee number" value={employee.employee_number} />
                        <Field label="Email" value={employee.user.email} />
                        <Field label="Phone" value={employee.phone} />
                        <Field label="Hire date" value={employee.hire_date} />
                        <Field label="Reports to" value={employee.manager?.user?.name} />
                        <Field label="Date of birth" value={employee.date_of_birth} />
                        <Field label="Gender" value={employee.gender} />
                        <Field label="Address" value={employee.address} />
                        {canManage && <Field label="Basic salary" value={employee.basic_salary} />}
                    </div>
                </div>

                {employee.direct_reports && employee.direct_reports.length > 0 && (
                    <div className="rounded-xl border border-slate-200 bg-white p-6">
                        <h3 className="mb-3 text-sm font-semibold text-slate-700">Direct reports</h3>
                        <ul className="divide-y divide-slate-100">
                            {employee.direct_reports.map((report) => (
                                <li key={report.id} className="py-2 text-sm">
                                    <Link href={route('employees.show', report.id)} className="text-indigo-600 hover:text-indigo-800">
                                        {report.user.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
