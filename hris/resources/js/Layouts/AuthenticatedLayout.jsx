import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';

function NavItem({ href, active, children }) {
    return (
        <Link
            href={href}
            className={
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ' +
                (active
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900')
            }
        >
            {children}
        </Link>
    );
}

function SectionLabel({ children }) {
    return (
        <p className="px-3 pt-5 pb-1 text-xs font-semibold text-slate-400">{children}</p>
    );
}

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const url = usePage().url;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const is = (path) => url.startsWith(path);
    const isAdminOrHr = user.role === 'admin' || user.role === 'hr';
    const isManager = user.role === 'manager';

    const nav = (
        <nav className="flex h-full flex-col px-3 py-4">
            <Link href={route('dashboard')} className="flex items-center gap-2 px-3 py-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
                    H
                </span>
                <span className="text-lg font-semibold text-slate-800">HRIS</span>
            </Link>

            <div className="mt-4 flex-1 overflow-y-auto">
                <NavItem href={route('dashboard')} active={is('/dashboard')}>
                    Dashboard
                </NavItem>

                <SectionLabel>People</SectionLabel>
                {(isAdminOrHr || isManager) && (
                    <NavItem href={route('employees.index')} active={is('/employees') && !is('/employees-create')}>
                        Employees
                    </NavItem>
                )}
                {isAdminOrHr && (
                    <NavItem href={route('departments.index')} active={is('/departments')}>
                        Departments
                    </NavItem>
                )}

                <SectionLabel>Attendance</SectionLabel>
                <NavItem href={route('attendance.index')} active={url === '/attendance'}>
                    My attendance
                </NavItem>
                {isManager && (
                    <NavItem href={route('attendance.team')} active={is('/attendance/team')}>
                        Team attendance
                    </NavItem>
                )}
                {isAdminOrHr && (
                    <NavItem href={route('attendance.all')} active={is('/attendance/all')}>
                        All attendance
                    </NavItem>
                )}

                <SectionLabel>Leave</SectionLabel>
                <NavItem href={route('leave.index')} active={url === '/leave'}>
                    My leave
                </NavItem>
                {(isAdminOrHr || isManager) && (
                    <NavItem href={route('leave.approvals')} active={is('/leave/approvals')}>
                        Approvals
                    </NavItem>
                )}
                {isAdminOrHr && (
                    <NavItem href={route('leave-types.index')} active={is('/leave-types')}>
                        Leave types
                    </NavItem>
                )}

                <SectionLabel>Payroll</SectionLabel>
                <NavItem href={route('payroll.index')} active={url === '/payroll'}>
                    {isAdminOrHr ? 'Payroll' : 'My payslips'}
                </NavItem>
                {isAdminOrHr && (
                    <NavItem href={route('payroll.generate-form')} active={is('/payroll-generate')}>
                        Generate payroll
                    </NavItem>
                )}
            </div>

            <div className="border-t border-slate-200 pt-3">
                <p className="px-3 text-xs text-slate-400">Signed in as</p>
                <p className="truncate px-3 text-sm font-medium text-slate-700">{user.name}</p>
                <p className="px-3 text-xs capitalize text-slate-400">{user.role}</p>
            </div>
        </nav>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Desktop sidebar */}
            <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white lg:block">
                {nav}
            </aside>

            {/* Mobile sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="fixed inset-0 bg-slate-900/40" onClick={() => setSidebarOpen(false)} />
                    <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">{nav}</aside>
                </div>
            )}

            <div className="lg:pl-64">
                <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur sm:px-6">
                    <div className="flex items-center gap-3">
                        <button
                            className="rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            ☰
                        </button>
                        {header && <h1 className="text-lg font-semibold text-slate-800">{header}</h1>}
                    </div>

                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
                                {user.name}
                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content>
                            <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                Log out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </header>

                <main className="p-4 sm:p-6">{children}</main>
            </div>
        </div>
    );
}
