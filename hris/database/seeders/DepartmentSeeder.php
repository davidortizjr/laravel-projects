<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Position;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            'Human Resources' => ['HR Manager', 'HR Officer'],
            'Engineering' => ['Engineering Manager', 'Software Engineer', 'QA Engineer'],
            'Sales' => ['Sales Manager', 'Sales Executive'],
            'Finance' => ['Finance Manager', 'Accountant'],
        ];

        foreach ($departments as $name => $positions) {
            $department = Department::create(['name' => $name]);

            foreach ($positions as $title) {
                Position::create([
                    'title' => $title,
                    'department_id' => $department->id,
                ]);
            }
        }
    }
}
