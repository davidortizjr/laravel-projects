<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workout_logs', function (Blueprint $table) {
            $table->id('workout_id');
            $table->foreignId('user_id')
                ->constrained('users', 'id')
                ->cascadeOnDelete();
            $table->foreignId('exercise_id')
                ->constrained('exercises', 'exercise_id')
                ->cascadeOnDelete();
            $table->unsignedInteger('sets');
            $table->unsignedInteger('reps');
            $table->decimal('weight', 6, 2);
            $table->timestamp('logged_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workout_logs');
    }
};
