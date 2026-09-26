<?php

namespace Database\Seeders;

use App\Models\Exercise;
use App\Models\Program;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'demo@reptrack.test'],
            ['name' => 'Demo User', 'password' => Hash::make('password')]
        );

        $programs = [
            'PUSH PROGRAM' => ['Bench Press', 'Overhead Press', 'Incline Dumbbell Press', 'Tricep Pushdown'],
            'PULL PROGRAM' => ['Deadlift', 'Barbell Row', 'Lat Pulldown', 'Bicep Curl'],
            'LEGS PROGRAM' => ['Squat', 'Romanian Deadlift', 'Leg Press', 'Calf Raise'],
        ];

        foreach ($programs as $programName => $exercises) {
            $program = Program::firstOrCreate(
                ['program_name' => $programName, 'user_id' => null]
            );

            foreach ($exercises as $exerciseName) {
                Exercise::firstOrCreate([
                    'exercise_name' => $exerciseName,
                    'program_id' => $program->program_id,
                ]);
            }
        }
    }
}
