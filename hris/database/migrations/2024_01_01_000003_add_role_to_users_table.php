<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // admin      - full access, system configuration
            // hr         - manages employees, leave types, payroll, approvals for everyone
            // manager    - approves leave/attendance for their own team, views team reports
            // employee   - manages their own attendance, leave requests, payslips
            $table->enum('role', ['admin', 'hr', 'manager', 'employee'])
                ->default('employee')
                ->after('email');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
};
