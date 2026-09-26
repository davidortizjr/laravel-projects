<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Program;
use App\Models\ProgramExercise;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CustomWorkoutController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'exerciseIds' => ['required', 'array', 'min:1'],
            'exerciseIds.*' => ['integer', 'exists:exercises,exercise_id'],
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            $message = $errors->has('name')
                ? 'Workout name is required'
                : 'At least one exercise is required';

            return response()->json(['message' => $message], 400);
        }

        $userId = $request->user()->id;

        try {
            $programId = DB::transaction(function () use ($request, $userId) {
                $program = Program::create([
                    'program_name' => $request->input('name'),
                    'user_id' => $userId,
                ]);

                foreach (array_values($request->input('exerciseIds')) as $index => $exerciseId) {
                    ProgramExercise::create([
                        'program_id' => $program->program_id,
                        'exercise_id' => $exerciseId,
                        'order_index' => $index,
                    ]);
                }

                return $program->program_id;
            });
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to save custom workout',
                'error' => $e->getMessage(),
            ], 400);
        }

        return response()->json([
            'program_id' => $programId,
            'message' => 'Custom workout saved successfully',
        ]);
    }

    public function index(Request $request)
    {
        $workouts = Program::withCount('exercises')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('program_id')
            ->get()
            ->map(fn (Program $program) => [
                'program_id' => $program->program_id,
                'program_name' => $program->program_name,
                'exercise_count' => $program->exercises_count,
            ]);

        return response()->json($workouts);
    }

    public function show(Request $request, int $programId)
    {
        $program = Program::where('program_id', $programId)
            ->where('user_id', $request->user()->id)
            ->first();

        if (! $program) {
            return response()->json(['message' => 'Custom workout not found'], 404);
        }

        $exerciseIds = ProgramExercise::where('program_id', $programId)
            ->orderBy('order_index')
            ->pluck('exercise_id');

        return response()->json([
            'program_id' => $program->program_id,
            'name' => $program->program_name,
            'user_id' => $program->user_id,
            'exercise_ids' => $exerciseIds,
        ]);
    }

    public function destroy(Request $request, int $programId)
    {
        $deleted = Program::where('program_id', $programId)
            ->where('user_id', $request->user()->id)
            ->delete();

        if (! $deleted) {
            return response()->json(['message' => 'Custom workout not found or unauthorized'], 404);
        }

        // program_exercises rows are removed automatically via cascadeOnDelete()

        return response()->json(['message' => 'Custom workout deleted successfully']);
    }
}
