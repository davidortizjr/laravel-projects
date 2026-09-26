<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('program_exercises', function (Blueprint $table) {
            $table->id('program_exercise_id');
            $table->foreignId('program_id')
                ->constrained('programs', 'program_id')
                ->cascadeOnDelete();
            $table->foreignId('exercise_id')
                ->constrained('exercises', 'exercise_id')
                ->cascadeOnDelete();
            $table->unsignedInteger('order_index')->default(0);
            $table->timestamps();

            $table->unique(['program_id', 'exercise_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('program_exercises');
    }
};
