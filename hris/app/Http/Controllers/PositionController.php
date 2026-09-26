<?php

namespace App\Http\Controllers;

use App\Models\Position;
use Illuminate\Http\Request;

class PositionController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'department_id' => 'nullable|exists:departments,id',
        ]);

        Position::create($data);

        return back()->with('success', 'Position created.');
    }

    public function update(Request $request, Position $position)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'department_id' => 'nullable|exists:departments,id',
        ]);

        $position->update($data);

        return back()->with('success', 'Position updated.');
    }

    public function destroy(Position $position)
    {
        $position->delete();

        return back()->with('success', 'Position removed.');
    }
}
