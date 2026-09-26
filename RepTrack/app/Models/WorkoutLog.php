<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkoutLog extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'workout_logs';
    protected $primaryKey = 'workout_id';

    protected $fillable = [
        'user_id',
        'exercise_id',
        'sets',
        'reps',
        'weight',
        'logged_at',
    ];

    protected function casts(): array
    {
        return [
            'logged_at' => 'datetime',
            'weight' => 'decimal:2',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function exercise()
    {
        return $this->belongsTo(Exercise::class, 'exercise_id');
    }
}
