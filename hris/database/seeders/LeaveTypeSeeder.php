<?php

namespace Database\Seeders;

use App\Models\LeaveType;
use Illuminate\Database\Seeder;

class LeaveTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            ['name' => 'Annual Leave', 'days_allowed' => 15, 'description' => 'Paid yearly vacation leave.'],
            ['name' => 'Sick Leave', 'days_allowed' => 10, 'description' => 'Paid leave for illness.'],
            ['name' => 'Emergency Leave', 'days_allowed' => 3, 'description' => 'Short-notice personal emergencies.'],
            ['name' => 'Unpaid Leave', 'days_allowed' => 0, 'description' => 'Leave without pay, subject to approval.'],
        ];

        foreach ($types as $type) {
            LeaveType::create($type);
        }
    }
}
