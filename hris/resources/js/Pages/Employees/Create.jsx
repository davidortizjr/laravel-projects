import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ departments, positions, managers }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        employee_number: '',
        department_id: '',
        position_id: '',
        manager_id: '',
        phone: '',
        address: '',
        date_of_birth: '',
        gender: '',
        hire_date: '',
        basic_salary: '',
    });

    const filteredPositions = positions.filter((p) => !data.department_id || String(p.department_id) === String(data.department_id));

    function submit(e) {
        e.preventDefault();
        post(route('employees.store'));
    }

    return (
        <AuthenticatedLayout header="Add employee">
            <Head title="Add employee" />

            <form onSubmit={submit} className="max-w-3xl space-y-8">
                <section className="rounded-xl border border-slate-200 bg-white p-6">
                    <h2 className="mb-4 text-sm font-semibold text-slate-700">Account</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="name" value="Full name" />
                            <TextInput id="name" className="mt-1 block w-full" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            <InputError message={errors.name} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput id="email" type="email" className="mt-1 block w-full" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            <InputError message={errors.email} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="password" value="Temporary password" />
                            <TextInput id="password" type="password" className="mt-1 block w-full" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                            <InputError message={errors.password} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="role" value="System role" />
                            <select id="role" className="mt-1 block w-full rounded-md border-slate-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.role} onChange={(e) => setData('role', e.target.value)}>
                                <option value="employee">Employee</option>
                                <option value="manager">Manager</option>
                                <option value="hr">HR staff</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-6">
                    <h2 className="mb-4 text-sm font-semibold text-slate-700">Job details</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="employee_number" value="Employee number" />
                            <TextInput id="employee_number" className="mt-1 block w-full" value={data.employee_number} onChange={(e) => setData('employee_number', e.target.value)} />
                            <InputError message={errors.employee_number} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="hire_date" value="Hire date" />
                            <TextInput id="hire_date" type="date" className="mt-1 block w-full" value={data.hire_date} onChange={(e) => setData('hire_date', e.target.value)} />
                            <InputError message={errors.hire_date} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="department_id" value="Department" />
                            <select id="department_id" className="mt-1 block w-full rounded-md border-slate-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.department_id} onChange={(e) => setData('department_id', e.target.value)}>
                                <option value="">None</option>
                                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <InputLabel htmlFor="position_id" value="Position" />
                            <select id="position_id" className="mt-1 block w-full rounded-md border-slate-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.position_id} onChange={(e) => setData('position_id', e.target.value)}>
                                <option value="">None</option>
                                {filteredPositions.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
                            </select>
                        </div>
                        <div>
                            <InputLabel htmlFor="manager_id" value="Reports to" />
                            <select id="manager_id" className="mt-1 block w-full rounded-md border-slate-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.manager_id} onChange={(e) => setData('manager_id', e.target.value)}>
                                <option value="">None</option>
                                {managers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <InputLabel htmlFor="basic_salary" value="Basic monthly salary" />
                            <TextInput id="basic_salary" type="number" step="0.01" className="mt-1 block w-full" value={data.basic_salary} onChange={(e) => setData('basic_salary', e.target.value)} />
                            <InputError message={errors.basic_salary} className="mt-1" />
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-6">
                    <h2 className="mb-4 text-sm font-semibold text-slate-700">Personal details (optional)</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="phone" value="Phone" />
                            <TextInput id="phone" className="mt-1 block w-full" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                        </div>
                        <div>
                            <InputLabel htmlFor="date_of_birth" value="Date of birth" />
                            <TextInput id="date_of_birth" type="date" className="mt-1 block w-full" value={data.date_of_birth} onChange={(e) => setData('date_of_birth', e.target.value)} />
                        </div>
                        <div>
                            <InputLabel htmlFor="gender" value="Gender" />
                            <select id="gender" className="mt-1 block w-full rounded-md border-slate-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.gender} onChange={(e) => setData('gender', e.target.value)}>
                                <option value="">Prefer not to say</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <InputLabel htmlFor="address" value="Address" />
                            <textarea id="address" rows={2} className="mt-1 block w-full rounded-md border-slate-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.address} onChange={(e) => setData('address', e.target.value)} />
                        </div>
                    </div>
                </section>

                <div className="flex justify-end">
                    <PrimaryButton disabled={processing}>Create employee</PrimaryButton>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
