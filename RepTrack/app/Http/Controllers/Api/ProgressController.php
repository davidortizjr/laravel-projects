<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProgressController extends Controller
{
    /**
     * For each exercise, return the user's best set (highest weight, then
     * highest reps, then most recent), grouped by program. Mirrors the
     * ROW_NUMBER() OVER (PARTITION BY ...) query from the original .NET API.
     */
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $rows = DB::table('workout_logs as wl')
            ->join('exercises as e', 'e.exercise_id', '=', 'wl.exercise_id')
            ->join('programs as p', 'p.program_id', '=', 'e.program_id')
            ->where('wl.user_id', $userId)
            ->select([
                'p.program_name',
                'e.exercise_name',
                'e.exercise_id',
                'wl.weight',
                'wl.reps',
                'wl.logged_at',
            ])
            ->orderByDesc('wl.weight')
            ->orderByDesc('wl.reps')
            ->orderByDesc('wl.logged_at')
            ->get()
            ->unique('exercise_id') // first row per exercise_id after ordering = best set
            ->groupBy('program_name');

        $result = $rows->map(function ($exercises, $programName) {
            return [
                'program_name' => $programName,
                'exercises' => $exercises->map(fn ($row) => [
                    'exercise_name' => $row->exercise_name,
                    'weight' => (float) $row->weight,
                    'reps' => (int) $row->reps,
                ])->values(),
            ];
        })->values();

        return response()->json($result);
    }
}
