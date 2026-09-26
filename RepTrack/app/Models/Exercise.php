<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exercise extends Model
{
    use HasFactory;

    protected $primaryKey = 'exercise_id';

    protected $fillable = [
        'exercise_name',
        'program_id',
    ];

    public function program()
    {
        return $this->belongsTo(Program::class, 'program_id');
    }

    public function workoutLogs()
    {
        return $this->hasMany(WorkoutLog::class, 'exercise_id');
    }
}
