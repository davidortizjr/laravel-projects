<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Payroll;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PayrollController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Payroll::with('employee.user');

        if (! $user->isAdminOrHr()) {
            abort_if(! $user->employee, 403);
            $query->where('employee_id', $user->employee->id);
        }

        return Inertia::render('Payroll/Index', [
            'payrolls' => $query->orderByDesc('period_year')->orderByDesc('period_month')->get(),
            'canManage' => $user->isAdminOrHr(),
        ]);
    }

    public function generateForm(Request $request)
    {
        abort_if(! $request->user()->isAdminOrHr(), 403);

        return Inertia::render('Payroll/Generate', [
            'month' => now()->month,
            'year' => now()->year,
        ]);
    }

    /**
     * Generate (or refresh) draft payroll for every active employee for the given period.
     * Basic estimate: daily rate = basic_salary / 22 working days; each unexcused absence
     * beyond the allowance deducts one day's pay.
     */
    public function generate(Request $request)
    {
        abort_if(! $request->user()->isAdminOrHr(), 403);

        $data = $request->validate([
            'period_month' => 'required|integer|min:1|max:12',
            'period_year' => 'required|integer|min:2000|max:2100',
        ]);

        $start = sprintf('%04d-%02d-01', $data['period_year'], $data['period_month']);
        $end = date('Y-m-t', strtotime($start));

        $employees = Employee::where('status', 'active')->get();

        foreach ($employees as $employee) {
            $present = Attendance::where('employee_id', $employee->id)
                ->whereBetween('date', [$start, $end])
                ->whereIn('status', ['present', 'late', 'half_day', 'on_leave'])
                ->count();

            $absent = Attendance::where('employee_id', $employee->id)
                ->whereBetween('date', [$start, $end])
                ->where('status', 'absent')
                ->count();

            $dailyRate = $employee->basic_salary > 0 ? $employee->basic_salary / 22 : 0;
            $leaveDeductions = round($dailyRate * $absent, 2);
            $netSalary = max(0, $employee->basic_salary - $leaveDeductions);

            Payroll::updateOrCreate(
                [
                    'employee_id' => $employee->id,
                    'period_month' => $data['period_month'],
                    'period_year' => $data['period_year'],
                ],
                [
                    'basic_salary' => $employee->basic_salary,
                    'allowances' => 0,
                    'overtime_pay' => 0,
                    'deductions' => 0,
                    'leave_deductions' => $leaveDeductions,
                    'net_salary' => $netSalary,
                    'days_present' => $present,
                    'days_absent' => $absent,
                    'status' => 'processed',
                    'generated_by' => $request->user()->id,
                    'processed_at' => now(),
                ]
            );
        }

        return redirect()->route('payroll.index')
            ->with('success', "Payroll generated for {$employees->count()} employees.");
    }

    public function show(Request $request, Payroll $payroll)
    {
        $user = $request->user();

        if (! $user->isAdminOrHr()) {
            abort_if(! $user->employee || $user->employee->id !== $payroll->employee_id, 403);
        }

        $payroll->load('employee.user', 'employee.department', 'employee.position', 'generatedBy');

        return Inertia::render('Payroll/Payslip', [
            'payroll' => $payroll,
        ]);
    }

    public function markPaid(Request $request, Payroll $payroll)
    {
        abort_if(! $request->user()->isAdminOrHr(), 403);

        $payroll->update(['status' => 'paid']);

        return back()->with('success', 'Payslip marked as paid.');
    }
}
