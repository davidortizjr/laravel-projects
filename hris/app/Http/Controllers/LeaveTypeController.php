<?php

namespace App\Http\Controllers;

use App\Models\LeaveType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaveTypeController extends Controller
{
    public function index()
    {
        return Inertia::render('Leave/Types', [
            'leaveTypes' => LeaveType::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'days_allowed' => 'required|integer|min:0',
            'description' => 'nullable|string',
        ]);

        LeaveType::create($data);

        return back()->with('success', 'Leave type created.');
    }

    public function update(Request $request, LeaveType $leaveType)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'days_allowed' => 'required|integer|min:0',
            'description' => 'nullable|string',
        ]);

        $leaveType->update($data);

        return back()->with('success', 'Leave type updated.');
    }

    public function destroy(LeaveType $leaveType)
    {
        $leaveType->delete();

        return back()->with('success', 'Leave type removed.');
    }
}
