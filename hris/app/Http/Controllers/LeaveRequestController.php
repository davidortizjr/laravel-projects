<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaveRequestController extends Controller
{
    /** Own leave requests + the "apply for leave" form */
    public function index(Request $request)
    {
        $employee = $request->user()->employee;
        abort_if(! $employee, 403);

        return Inertia::render('Leave/Index', [
            'requests' => LeaveRequest::with('leaveType', 'approver')
                ->where('employee_id', $employee->id)
                ->orderByDesc('created_at')
                ->get(),
            'leaveTypes' => LeaveType::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $employee = $request->user()->employee;
        abort_if(! $employee, 403);

        $data = $request->validate([
            'leave_type_id' => 'required|exists:leave_types,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'nullable|string|max:1000',
        ]);

        $days = 0;
        foreach (Carbon::parse($data['start_date'])->toPeriod($data['end_date']) as $date) {
            if (! $date->isWeekend()) {
                $days++;
            }
        }

        LeaveRequest::create([
            'employee_id' => $employee->id,
            'leave_type_id' => $data['leave_type_id'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'total_days' => max(1, $days),
            'reason' => $data['reason'] ?? null,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Leave request submitted.');
    }

    /** Requests waiting on this user's approval: manager sees their team, admin/hr sees everyone */
    public function approvals(Request $request)
    {
        $user = $request->user();
        abort_if(! $user->isManager() && ! $user->isAdminOrHr(), 403);

        $query = LeaveRequest::with('employee.user', 'leaveType')->where('status', 'pending');

        if ($user->isManager() && ! $user->isAdminOrHr()) {
            $teamIds = Employee::where('manager_id', $user->employee->id)->pluck('id');
            $query->whereIn('employee_id', $teamIds);
        }

        return Inertia::render('Leave/Approvals', [
            'requests' => $query->orderBy('start_date')->get(),
        ]);
    }

    public function approve(Request $request, LeaveRequest $leaveRequest)
    {
        $this->authorizeDecision($request, $leaveRequest);

        $leaveRequest->update([
            'status' => 'approved',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        // Mark each working day in range as "on_leave" in the attendance log
        $period = Carbon::parse($leaveRequest->start_date)->toPeriod($leaveRequest->end_date);
        foreach ($period as $date) {
            if ($date->isWeekend()) {
                continue;
            }
            Attendance::updateOrCreate(
                ['employee_id' => $leaveRequest->employee_id, 'date' => $date->toDateString()],
                ['status' => 'on_leave']
            );
        }

        return back()->with('success', 'Leave request approved.');
    }

    public function reject(Request $request, LeaveRequest $leaveRequest)
    {
        $this->authorizeDecision($request, $leaveRequest);

        $data = $request->validate(['remarks' => 'nullable|string|max:255']);

        $leaveRequest->update([
            'status' => 'rejected',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
            'remarks' => $data['remarks'] ?? null,
        ]);

        return back()->with('success', 'Leave request rejected.');
    }

    private function authorizeDecision(Request $request, LeaveRequest $leaveRequest): void
    {
        $user = $request->user();

        if ($user->isAdminOrHr()) {
            return;
        }
        if ($user->isManager() && $user->employee && $leaveRequest->employee->manager_id === $user->employee->id) {
            return;
        }

        abort(403);
    }
}
