<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Employee;
use App\Models\Position;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Employee::with(['user', 'department', 'position', 'manager.user']);

        if ($user->isManager() && $user->employee) {
            $query->where('manager_id', $user->employee->id);
        } elseif (! $user->isAdminOrHr()) {
            abort(403);
        }

        if ($search = $request->get('search')) {
            $query->whereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%"));
        }

        return Inertia::render('Employees/Index', [
            'employees' => $query->orderBy('id')->paginate(15)->withQueryString(),
            'filters' => $request->only('search'),
            'canManage' => $user->isAdminOrHr(),
        ]);
    }

    public function create()
    {
        $this->authorizeAdminHr();

        return Inertia::render('Employees/Create', [
            'departments' => Department::orderBy('name')->get(['id', 'name']),
            'positions' => Position::orderBy('title')->get(['id', 'title', 'department_id']),
            'managers' => Employee::with('user')->where('status', 'active')->get()
                ->map(fn ($e) => ['id' => $e->id, 'name' => $e->user->name]),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeAdminHr();

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => ['required', Rule::in(['admin', 'hr', 'manager', 'employee'])],
            'employee_number' => 'required|string|unique:employees,employee_number',
            'department_id' => 'nullable|exists:departments,id',
            'position_id' => 'nullable|exists:positions,id',
            'manager_id' => 'nullable|exists:employees,id',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'hire_date' => 'required|date',
            'basic_salary' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => $data['role'],
            ]);

            Employee::create([
                'user_id' => $user->id,
                'employee_number' => $data['employee_number'],
                'department_id' => $data['department_id'] ?? null,
                'position_id' => $data['position_id'] ?? null,
                'manager_id' => $data['manager_id'] ?? null,
                'phone' => $data['phone'] ?? null,
                'address' => $data['address'] ?? null,
                'date_of_birth' => $data['date_of_birth'] ?? null,
                'gender' => $data['gender'] ?? null,
                'hire_date' => $data['hire_date'],
                'basic_salary' => $data['basic_salary'],
            ]);
        });

        return redirect()->route('employees.index')->with('success', 'Employee added.');
    }

    public function show(Request $request, Employee $employee)
    {
        $this->authorizeView($request, $employee);

        $employee->load(['user', 'department', 'position', 'manager.user', 'directReports.user']);

        return Inertia::render('Employees/Show', [
            'employee' => $employee,
            'canManage' => $request->user()->isAdminOrHr(),
        ]);
    }

    public function edit(Employee $employee)
    {
        $this->authorizeAdminHr();

        $employee->load('user');

        return Inertia::render('Employees/Edit', [
            'employee' => $employee,
            'departments' => Department::orderBy('name')->get(['id', 'name']),
            'positions' => Position::orderBy('title')->get(['id', 'title', 'department_id']),
            'managers' => Employee::with('user')->where('id', '!=', $employee->id)
                ->where('status', 'active')->get()
                ->map(fn ($e) => ['id' => $e->id, 'name' => $e->user->name]),
        ]);
    }

    public function update(Request $request, Employee $employee)
    {
        $this->authorizeAdminHr();

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($employee->user_id)],
            'role' => ['required', Rule::in(['admin', 'hr', 'manager', 'employee'])],
            'employee_number' => ['required', 'string', Rule::unique('employees', 'employee_number')->ignore($employee->id)],
            'department_id' => 'nullable|exists:departments,id',
            'position_id' => 'nullable|exists:positions,id',
            'manager_id' => 'nullable|exists:employees,id',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'hire_date' => 'required|date',
            'basic_salary' => 'required|numeric|min:0',
            'status' => 'required|in:active,inactive',
        ]);

        DB::transaction(function () use ($data, $employee) {
            $employee->user->update([
                'name' => $data['name'],
                'email' => $data['email'],
                'role' => $data['role'],
            ]);

            $employee->update([
                'employee_number' => $data['employee_number'],
                'department_id' => $data['department_id'] ?? null,
                'position_id' => $data['position_id'] ?? null,
                'manager_id' => $data['manager_id'] ?? null,
                'phone' => $data['phone'] ?? null,
                'address' => $data['address'] ?? null,
                'date_of_birth' => $data['date_of_birth'] ?? null,
                'gender' => $data['gender'] ?? null,
                'hire_date' => $data['hire_date'],
                'basic_salary' => $data['basic_salary'],
                'status' => $data['status'],
            ]);
        });

        return redirect()->route('employees.index')->with('success', 'Employee updated.');
    }

    public function destroy(Employee $employee)
    {
        $this->authorizeAdminHr();

        $employee->user()->delete(); // cascades to the employee row

        return back()->with('success', 'Employee removed.');
    }

    private function authorizeAdminHr(): void
    {
        if (! request()->user()->isAdminOrHr()) {
            abort(403);
        }
    }

    private function authorizeView(Request $request, Employee $employee): void
    {
        $user = $request->user();

        if ($user->isAdminOrHr()) {
            return;
        }
        if ($user->isManager() && $user->employee && $employee->manager_id === $user->employee->id) {
            return;
        }
        if ($user->employee && $user->employee->id === $employee->id) {
            return;
        }

        abort(403);
    }
}
