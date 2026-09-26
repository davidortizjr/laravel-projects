<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Department;
use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Models\Payroll;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $employee = $user->employee;
        $today = now()->toDateString();

        $stats = [];

        if ($user->isAdminOrHr()) {
            $stats = [
                'total_employees' => Employee::where('status', 'active')->count(),
                'total_departments' => Department::count(),
                'present_today' => Attendance::whereDate('date', $today)
                    ->whereIn('status', ['present', 'late'])->count(),
                'pending_leave_requests' => LeaveRequest::where('status', 'pending')->count(),
                'payrolls_this_month' => Payroll::where('period_month', now()->month)
                    ->where('period_year', now()->year)->count(),
            ];
        } elseif ($user->isManager() && $employee) {
            $teamIds = Employee::where('manager_id', $employee->id)->pluck('id');
            $stats = [
                'team_size' => $teamIds->count(),
                'present_today' => Attendance::whereIn('employee_id', $teamIds)
                    ->whereDate('date', $today)->whereIn('status', ['present', 'late'])->count(),
                'pending_leave_requests' => LeaveRequest::whereIn('employee_id', $teamIds)
                    ->where('status', 'pending')->count(),
            ];
        } elseif ($employee) {
            $todayAttendance = Attendance::where('employee_id', $employee->id)
                ->whereDate('date', $today)->first();
            $stats = [
                'clocked_in_today' => (bool) ($todayAttendance?->clock_in),
                'clocked_out_today' => (bool) ($todayAttendance?->clock_out),
                'pending_leave_requests' => LeaveRequest::where('employee_id', $employee->id)
                    ->where('status', 'pending')->count(),
                'latest_payslip' => Payroll::where('employee_id', $employee->id)
                    ->latest('period_year')->latest('period_month')->first(),
            ];
        }

        return Inertia::render('Dashboard/Index', [
            'stats' => $stats,
        ]);
    }
}
