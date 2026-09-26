<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProgramExercise extends Model
{
    protected $primaryKey = 'program_exercise_id';

    protected $fillable = [
        'program_id',
        'exercise_id',
        'order_index',
    ];

    public function program()
    {
        return $this->belongsTo(Program::class, 'program_id');
    }

    public function exercise()
    {
        return $this->belongsTo(Exercise::class, 'exercise_id');
    }
}
