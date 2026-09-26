<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\LeaveTypeController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect(Auth::check() ? '/dashboard' : '/login');
});

Route::middleware('auth')->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile (from Breeze)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Employees: admin + hr manage, manager views their team, employee views self via /employees/{id}
    Route::middleware('role:admin,hr,manager')->group(function () {
        Route::get('/employees', [EmployeeController::class, 'index'])->name('employees.index');
    });
    Route::get('/employees/{employee}', [EmployeeController::class, 'show'])->name('employees.show');
    Route::middleware('role:admin,hr')->group(function () {
        Route::get('/employees-create', [EmployeeController::class, 'create'])->name('employees.create');
        Route::post('/employees', [EmployeeController::class, 'store'])->name('employees.store');
        Route::get('/employees/{employee}/edit', [EmployeeController::class, 'edit'])->name('employees.edit');
        Route::put('/employees/{employee}', [EmployeeController::class, 'update'])->name('employees.update');
        Route::delete('/employees/{employee}', [EmployeeController::class, 'destroy'])->name('employees.destroy');
    });

    // Departments & positions: admin + hr only
    Route::middleware('role:admin,hr')->group(function () {
        Route::get('/departments', [DepartmentController::class, 'index'])->name('departments.index');
        Route::post('/departments', [DepartmentController::class, 'store'])->name('departments.store');
        Route::put('/departments/{department}', [DepartmentController::class, 'update'])->name('departments.update');
        Route::delete('/departments/{department}', [DepartmentController::class, 'destroy'])->name('departments.destroy');

        Route::post('/positions', [PositionController::class, 'store'])->name('positions.store');
        Route::put('/positions/{position}', [PositionController::class, 'update'])->name('positions.update');
        Route::delete('/positions/{position}', [PositionController::class, 'destroy'])->name('positions.destroy');
    });

    // Attendance: everyone with an employee record clocks in/out and sees their own history
    Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance.index');
    Route::post('/attendance/clock-in', [AttendanceController::class, 'clockIn'])->name('attendance.clock-in');
    Route::post('/attendance/clock-out', [AttendanceController::class, 'clockOut'])->name('attendance.clock-out');
    Route::get('/attendance/team', [AttendanceController::class, 'team'])->name('attendance.team');
    Route::middleware('role:admin,hr')->group(function () {
        Route::get('/attendance/all', [AttendanceController::class, 'all'])->name('attendance.all');
        Route::put('/attendance/{attendance}', [AttendanceController::class, 'update'])->name('attendance.update');
    });

    // Leave: everyone applies and views their own requests
    Route::get('/leave', [LeaveRequestController::class, 'index'])->name('leave.index');
    Route::post('/leave', [LeaveRequestController::class, 'store'])->name('leave.store');
    Route::get('/leave/approvals', [LeaveRequestController::class, 'approvals'])->name('leave.approvals');
    Route::patch('/leave/{leaveRequest}/approve', [LeaveRequestController::class, 'approve'])->name('leave.approve');
    Route::patch('/leave/{leaveRequest}/reject', [LeaveRequestController::class, 'reject'])->name('leave.reject');
    Route::middleware('role:admin,hr')->group(function () {
        Route::get('/leave-types', [LeaveTypeController::class, 'index'])->name('leave-types.index');
        Route::post('/leave-types', [LeaveTypeController::class, 'store'])->name('leave-types.store');
        Route::put('/leave-types/{leaveType}', [LeaveTypeController::class, 'update'])->name('leave-types.update');
        Route::delete('/leave-types/{leaveType}', [LeaveTypeController::class, 'destroy'])->name('leave-types.destroy');
    });

    // Payroll: admin/hr generate for everyone, each user views their own payslips
    Route::get('/payroll', [PayrollController::class, 'index'])->name('payroll.index');
    Route::get('/payroll/{payroll}', [PayrollController::class, 'show'])->name('payroll.show');
    Route::middleware('role:admin,hr')->group(function () {
        Route::get('/payroll-generate', [PayrollController::class, 'generateForm'])->name('payroll.generate-form');
        Route::post('/payroll-generate', [PayrollController::class, 'generate'])->name('payroll.generate');
        Route::patch('/payroll/{payroll}/mark-paid', [PayrollController::class, 'markPaid'])->name('payroll.mark-paid');
    });
});

require __DIR__.'/auth.php';
