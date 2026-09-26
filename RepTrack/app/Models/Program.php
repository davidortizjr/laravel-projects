<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    use HasFactory;

    protected $primaryKey = 'program_id';

    protected $fillable = [
        'program_name',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function exercises()
    {
        return $this->hasMany(Exercise::class, 'program_id');
    }

    public function programExercises()
    {
        return $this->hasMany(ProgramExercise::class, 'program_id')->orderBy('order_index');
    }
}
