<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use App\Models\Program;
use Illuminate\Http\Request;

class ProgramController extends Controller
{
    public function index()
    {
        $programs = Program::orderBy('program_id')
            ->get(['program_id', 'program_name']);

        return response()->json($programs);
    }

    public function exercises(Request $request)
    {
        $programId = $request->query('programId');

        $query = Exercise::orderBy('exercise_id');

        if ($programId !== null) {
            $query->where('program_id', $programId);
        }

        $exercises = $query->get(['exercise_id', 'exercise_name', 'program_id']);

        return response()->json($exercises);
    }
}
