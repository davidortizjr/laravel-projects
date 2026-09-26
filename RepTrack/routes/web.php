<?php

use Illuminate\Support\Facades\Route;

// Every non-API route serves the same Blade shell; React Router takes it
// from there (/login, /home, /workouts, /progress, /custom-workout, etc.).
Route::get('/{any}', function () {
    return view('app');
})->where('any', '^(?!api).*$');
