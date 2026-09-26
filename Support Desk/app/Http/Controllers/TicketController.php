<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function createTicket(Request $request)
    {
        $incomingTicketFields = $request->validate([
            'title' => ['required', 'unique:tickets,title'],
            'description' => ['required'],
            'priority' => ['required', 'in:low,medium,high'],
        ]);

        $incomingTicketFields['status'] = 'open';
        $incomingTicketFields['user_id'] = auth()->id();

        Ticket::create($incomingTicketFields);

        return redirect('/tickets')->with('success', 'Ticket created successfully!');
    }

}
