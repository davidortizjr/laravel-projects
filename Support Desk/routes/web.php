<?php

use App\Http\Controllers\TicketController;
use App\Http\Controllers\UserController;
use App\Models\Ticket;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/dashboard');
});

// Login and Registration Routes
Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);
Route::post('/logout', [UserController::class, 'logout']);

// Page Routes
Route::get('/dashboard', function () {
    $page = 'dashboard';
    return view('home', compact('page'));
});

Route::get('/profile', function () {
    $page = 'profile';
    return view('home', compact('page'));
});

Route::get('/tickets', function () {
    $page = 'tickets';
    $tickets = Ticket::all();
    return view('home', compact('page', 'tickets'));
});

Route::get('/users', function () {
    $page = 'users';
    return view('home', compact('page'));
});

//ticket creation route
Route::post('/create-tickets', [TicketController::class, 'createTicket']);
