<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkoutLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class WorkoutController extends Controller
{
    public function batch(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'workouts' => ['required', 'array', 'min:1'],
            'workouts.*.exerciseId' => ['required', 'integer', 'exists:exercises,exercise_id'],
            'workouts.*.sets' => ['required', 'integer', 'min:0'],
            'workouts.*.reps' => ['required', 'integer', 'min:0'],
            'workouts.*.weight' => ['required', 'numeric', 'min:0'],
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'No workouts provided'], 400);
        }

        $userId = $request->user()->id;
        $workoutIds = [];

        DB::transaction(function () use ($request, $userId, &$workoutIds) {
            foreach ($request->input('workouts') as $workout) {
                $log = WorkoutLog::create([
                    'user_id' => $userId,
                    'exercise_id' => $workout['exerciseId'],
                    'sets' => $workout['sets'],
                    'reps' => $workout['reps'],
                    'weight' => $workout['weight'],
                    'logged_at' => now(),
                ]);

                $workoutIds[] = $log->workout_id;
            }
        });

        return response()->json([
            'total_logged' => count($workoutIds),
            'workout_ids' => $workoutIds,
            // convenience field for the current frontend, which reads workout_id
            // off a single created record
            'workout_id' => $workoutIds[0] ?? null,
        ]);
    }

    public function me(Request $request)
    {
        $workouts = WorkoutLog::where('user_id', $request->user()->id)
            ->orderByDesc('logged_at')
            ->get()
            ->map(fn (WorkoutLog $log) => [
                'workout_id' => $log->workout_id,
                'user_id' => $log->user_id,
                'exercise_id' => $log->exercise_id,
                'sets' => $log->sets,
                'reps' => $log->reps,
                'weight' => (float) $log->weight,
                'date' => optional($log->logged_at)->toIso8601String(),
            ]);

        return response()->json($workouts);
    }

    public function stats(Request $request)
    {
        $userId = $request->user()->id;

        $latest = WorkoutLog::with('exercise.program')
            ->where('user_id', $userId)
            ->orderByDesc('logged_at')
            ->first();

        $totalWorkouts = WorkoutLog::where('user_id', $userId)->count();

        return response()->json([
            'last_workout' => $latest?->exercise?->program?->program_name,
            'total_workouts' => $totalWorkouts,
        ]);
    }
}
