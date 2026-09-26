<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /** Own attendance log + today's clock in/out control */
    public function index(Request $request)
    {
        $employee = $request->user()->employee;

        if (! $employee) {
            abort(403, 'No employee record is linked to this account.');
        }

        $today = Attendance::where('employee_id', $employee->id)
            ->whereDate('date', now()->toDateString())
            ->first();

        $history = Attendance::where('employee_id', $employee->id)
            ->orderByDesc('date')
            ->paginate(15);

        return Inertia::render('Attendance/Index', [
            'today' => $today,
            'history' => $history,
        ]);
    }

    public function clockIn(Request $request)
    {
        $employee = $request->user()->employee;
        abort_if(! $employee, 403);

        $attendance = Attendance::firstOrNew([
            'employee_id' => $employee->id,
            'date' => now()->toDateString(),
        ]);

        if ($attendance->exists && $attendance->clock_in) {
            return back()->with('error', 'You already clocked in today.');
        }

        $attendance->clock_in = now();
        $attendance->status = now()->format('H:i') > '09:15' ? 'late' : 'present';
        $attendance->save();

        return back()->with('success', 'Clocked in at ' . now()->format('h:i A') . '.');
    }

    public function clockOut(Request $request)
    {
        $employee = $request->user()->employee;
        abort_if(! $employee, 403);

        $attendance = Attendance::where('employee_id', $employee->id)
            ->whereDate('date', now()->toDateString())
            ->first();

        if (! $attendance || ! $attendance->clock_in) {
            return back()->with('error', 'Clock in first before clocking out.');
        }
        if ($attendance->clock_out) {
            return back()->with('error', 'You already clocked out today.');
        }

        $attendance->clock_out = now();
        $attendance->save();

        return back()->with('success', 'Clocked out at ' . now()->format('h:i A') . '.');
    }

    /** Manager: attendance of direct reports */
    public function team(Request $request)
    {
        $user = $request->user();
        abort_if(! $user->isManager() || ! $user->employee, 403);

        $teamIds = Employee::where('manager_id', $user->employee->id)->pluck('id');

        $records = Attendance::with('employee.user')
            ->whereIn('employee_id', $teamIds)
            ->whereDate('date', $request->get('date', now()->toDateString()))
            ->get();

        return Inertia::render('Attendance/Team', [
            'records' => $records,
            'date' => $request->get('date', now()->toDateString()),
        ]);
    }

    /** Admin/HR: company-wide attendance with date filter and manual corrections */
    public function all(Request $request)
    {
        abort_if(! $request->user()->isAdminOrHr(), 403);

        $date = $request->get('date', now()->toDateString());

        $records = Attendance::with('employee.user')
            ->whereDate('date', $date)
            ->get();

        return Inertia::render('Attendance/All', [
            'records' => $records,
            'date' => $date,
        ]);
    }

    public function update(Request $request, Attendance $attendance)
    {
        abort_if(! $request->user()->isAdminOrHr(), 403);

        $data = $request->validate([
            'status' => 'required|in:present,late,half_day,absent,on_leave',
            'clock_in' => 'nullable|date_format:H:i',
            'clock_out' => 'nullable|date_format:H:i',
            'notes' => 'nullable|string|max:255',
        ]);

        $attendance->update([
            'status' => $data['status'],
            'clock_in' => $data['clock_in'] ? $attendance->date->format('Y-m-d') . ' ' . $data['clock_in'] : null,
            'clock_out' => $data['clock_out'] ? $attendance->date->format('Y-m-d') . ' ' . $data['clock_out'] : null,
            'notes' => $data['notes'] ?? null,
        ]);

        return back()->with('success', 'Attendance record updated.');
    }
}
