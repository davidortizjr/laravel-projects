import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Badge from '@/Components/Badge';

export default function Index({ payrolls, canManage }) {
    function markPaid(payroll) {
        router.patch(route('payroll.mark-paid', payroll.id));
    }

    return (
        <AuthenticatedLayout header={canManage ? 'Payroll' : 'My payslips'}>
            <Head title="Payroll" />

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-left text-slate-500">
                        <tr>
                            {canManage && <th className="px-4 py-3 font-medium">Employee</th>}
                            <th className="px-4 py-3 font-medium">Period</th>
                            <th className="px-4 py-3 font-medium">Net salary</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {payrolls.map((p) => (
                            <tr key={p.id}>
                                {canManage && <td className="px-4 py-3 font-medium text-slate-800">{p.employee.user.name}</td>}
                                <td className="px-4 py-3 text-slate-600">{p.period_month}/{p.period_year}</td>
                                <td className="px-4 py-3 text-slate-700">{Number(p.net_salary).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td className="px-4 py-3"><Badge status={p.status} /></td>
                                <td className="px-4 py-3 text-right">
                                    <Link href={route('payroll.show', p.id)} className="mr-3 text-sm font-medium text-indigo-600 hover:text-indigo-800">View</Link>
                                    {canManage && p.status !== 'paid' && (
                                        <button onClick={() => markPaid(p)} className="text-sm font-medium text-emerald-600 hover:text-emerald-800">Mark paid</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {payrolls.length === 0 && (
                            <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">No payroll records yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
}
