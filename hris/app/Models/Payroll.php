<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'period_month',
        'period_year',
        'basic_salary',
        'allowances',
        'overtime_pay',
        'deductions',
        'leave_deductions',
        'net_salary',
        'days_present',
        'days_absent',
        'status',
        'generated_by',
        'processed_at',
    ];

    protected function casts(): array
    {
        return [
            'processed_at' => 'datetime',
            'basic_salary' => 'decimal:2',
            'allowances' => 'decimal:2',
            'overtime_pay' => 'decimal:2',
            'deductions' => 'decimal:2',
            'leave_deductions' => 'decimal:2',
            'net_salary' => 'decimal:2',
        ];
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function generatedBy()
    {
        return $this->belongsTo(User::class, 'generated_by');
    }

    public function periodLabel(): string
    {
        return date('F', mktime(0, 0, 0, $this->period_month, 1)) . ' ' . $this->period_year;
    }
}
