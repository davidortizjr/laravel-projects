<?php

use App\Http\Controllers\listController;
use App\Http\Controllers\userController;
use App\Models\Item;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $items = [];
    if (auth()->check()) {
        $items = auth()->user()->notes()->latest()->get();
    }
    return view('home', ['items' => $items]);
});

// register and login
Route::post('/register', [userController::class, 'register']);
Route::post('/login', [userController::class, 'login']);
Route::post('/logout', [userController::class, 'logout']);

// item
Route::post('/add-item', [listController::class, 'addItem']);
Route::post('/complete-item', [listController::class, 'completeItem']);
Route::post('/delete-item', [listController::class, 'deleteItem']);
Route::post('/edit-item', [listController::class, 'editItem']);
