<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'employee_number',
        'department_id',
        'position_id',
        'manager_id',
        'phone',
        'address',
        'date_of_birth',
        'gender',
        'hire_date',
        'basic_salary',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'hire_date' => 'date',
            'basic_salary' => 'decimal:2',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function position()
    {
        return $this->belongsTo(Position::class);
    }

    /** This employee's manager (another employee record) */
    public function manager()
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }

    /** Direct reports of this employee, when they are someone's manager */
    public function directReports()
    {
        return $this->hasMany(Employee::class, 'manager_id');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function leaveRequests()
    {
        return $this->hasMany(LeaveRequest::class);
    }

    public function payrolls()
    {
        return $this->hasMany(Payroll::class);
    }

    public function fullName(): string
    {
        return $this->user->name;
    }
}
