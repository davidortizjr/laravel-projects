<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CustomWorkoutController;
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\ProgressController;
use App\Http\Controllers\Api\WorkoutController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    Route::get('/programs', [ProgramController::class, 'index']);
    Route::get('/exercises', [ProgramController::class, 'exercises']);

    Route::post('/workouts/batch', [WorkoutController::class, 'batch']);
    Route::get('/workouts/me', [WorkoutController::class, 'me']);
    Route::get('/workouts/stats', [WorkoutController::class, 'stats']);

    Route::post('/custom-workouts', [CustomWorkoutController::class, 'store']);
    Route::get('/custom-workouts/me', [CustomWorkoutController::class, 'index']);
    Route::get('/custom-workouts/{programId}', [CustomWorkoutController::class, 'show']);
    Route::delete('/custom-workouts/{programId}', [CustomWorkoutController::class, 'destroy']);

    Route::get('/progress', [ProgressController::class, 'index']);
});
