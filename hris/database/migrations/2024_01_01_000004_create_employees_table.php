<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('employee_number')->unique();
            $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('position_id')->nullable()->constrained()->nullOnDelete();
            // Self-referencing: the employee record of this person's manager
            $table->foreignId('manager_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->date('hire_date');
            $table->decimal('basic_salary', 12, 2)->default(0);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });

        // Now that employees exists, let a department have a head (manager)
        Schema::table('departments', function (Blueprint $table) {
            $table->foreignId('manager_id')->nullable()->after('description')
                ->constrained('employees')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->dropConstrainedForeignId('manager_id');
        });
        Schema::dropIfExists('employees');
    }
};
