import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function Generate({ month, year }) {
    const { data, setData, post, processing } = useForm({
        period_month: month,
        period_year: year,
    });

    function submit(e) {
        e.preventDefault();
        post(route('payroll.generate'));
    }

    return (
        <AuthenticatedLayout header="Generate payroll">
            <Head title="Generate payroll" />

            <form onSubmit={submit} className="max-w-md rounded-xl border border-slate-200 bg-white p-6">
                <p className="mb-4 text-sm text-slate-500">
                    Basic salary minus a per-day deduction for unexcused absences, based on attendance records for the selected month. Running this again for the same period recalculates existing records.
                </p>

                <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="period_month" value="Month" />
                        <select id="period_month" className="mt-1 block w-full rounded-md border-slate-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.period_month} onChange={(e) => setData('period_month', e.target.value)}>
                            {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                        </select>
                    </div>
                    <div>
                        <InputLabel htmlFor="period_year" value="Year" />
                        <select id="period_year" className="mt-1 block w-full rounded-md border-slate-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.period_year} onChange={(e) => setData('period_year', e.target.value)}>
                            {[year - 1, year, year + 1].map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>

                <PrimaryButton disabled={processing} className="w-full justify-center">Generate payroll</PrimaryButton>
            </form>
        </AuthenticatedLayout>
    );
}
