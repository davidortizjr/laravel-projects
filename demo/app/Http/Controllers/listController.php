<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;

class listController extends Controller
{
    public function addItem(Request $request)
    {
        $item = $request->validate([
            'title' => ['required', 'max:255', 'min:3'],
            'priority' => ['required', 'in:low,medium,high']
        ]);

        $item['title'] = strip_tags($item['title']);
        $item['priority'] = strip_tags($item['priority']);
        $item['completed'] = false;
        $item['user_id'] = auth()->id();

        Item::create($item);
        // Logic to add the item to the list (e.g., save to database)
        return redirect('./') ->with('success', 'Item added successfully!');
    }

    public function completeItem (Request $request) 
    {
        $validated = $request->validate([
            'item_id' => ['required', 'exists:items,id'],
        ]);

        Item::whereKey($validated['item_id'])->update(['completed' => true]);

        return redirect('./')->with('success', 'Item marked as completed!');
    }

    public function deleteItem(Request $request)
    {
        $validated = $request->validate([
            'item_id' => ['required', 'exists:items,id'],
        ]);

        Item::whereKey($validated['item_id'])->delete();

        return redirect('./')->with('success', 'Item deleted successfully!');
    }

    public function editItem(Request $request)
    {
        $validated = $request->validate([
            'item_id' => ['required', 'exists:items,id'],
            'title' => ['required', 'max:255', 'min:3'],
            'priority' => ['required', 'in:low,medium,high']
        ]);

        $validated['title'] = strip_tags($validated['title']);
        $validated['priority'] = strip_tags($validated['priority']);

        Item::whereKey($validated['item_id'])->update([
            'title' => $validated['title'],
            'priority' => $validated['priority']
        ]);

        return redirect('./')->with('success', 'Item updated successfully!');
    }
}
