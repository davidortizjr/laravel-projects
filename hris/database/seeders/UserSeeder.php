<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Employee;
use App\Models\Position;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $engineering = Department::where('name', 'Engineering')->first();
        $hrDept = Department::where('name', 'Human Resources')->first();

        $engManagerPosition = Position::where('title', 'Engineering Manager')->first();
        $softwareEngineerPosition = Position::where('title', 'Software Engineer')->first();
        $hrManagerPosition = Position::where('title', 'HR Manager')->first();

        // --- Admin ---
        $admin = User::create([
            'name' => 'System Administrator',
            'email' => 'admin@hris.test',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);
        $adminEmployee = Employee::create([
            'user_id' => $admin->id,
            'employee_number' => 'EMP-0001',
            'department_id' => $hrDept->id,
            'position_id' => $hrManagerPosition->id,
            'hire_date' => now()->subYears(3),
            'basic_salary' => 60000,
        ]);

        // --- HR ---
        $hr = User::create([
            'name' => 'Hannah Reyes',
            'email' => 'hr@hris.test',
            'password' => Hash::make('password'),
            'role' => 'hr',
        ]);
        Employee::create([
            'user_id' => $hr->id,
            'employee_number' => 'EMP-0002',
            'department_id' => $hrDept->id,
            'position_id' => $hrManagerPosition->id,
            'manager_id' => $adminEmployee->id,
            'hire_date' => now()->subYears(2),
            'basic_salary' => 45000,
        ]);

        // --- Manager ---
        $manager = User::create([
            'name' => 'Miguel Santos',
            'email' => 'manager@hris.test',
            'password' => Hash::make('password'),
            'role' => 'manager',
        ]);
        $managerEmployee = Employee::create([
            'user_id' => $manager->id,
            'employee_number' => 'EMP-0003',
            'department_id' => $engineering->id,
            'position_id' => $engManagerPosition->id,
            'manager_id' => $adminEmployee->id,
            'hire_date' => now()->subYears(2),
            'basic_salary' => 55000,
        ]);

        Department::where('id', $engineering->id)->update(['manager_id' => $managerEmployee->id]);

        // --- Employee ---
        $employee = User::create([
            'name' => 'Elena Cruz',
            'email' => 'employee@hris.test',
            'password' => Hash::make('password'),
            'role' => 'employee',
        ]);
        Employee::create([
            'user_id' => $employee->id,
            'employee_number' => 'EMP-0004',
            'department_id' => $engineering->id,
            'position_id' => $softwareEngineerPosition->id,
            'manager_id' => $managerEmployee->id,
            'hire_date' => now()->subMonths(8),
            'basic_salary' => 32000,
        ]);
    }
}
