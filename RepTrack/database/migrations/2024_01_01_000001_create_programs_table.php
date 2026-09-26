<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('programs', function (Blueprint $table) {
            $table->id('program_id');
            $table->string('program_name');
            // Nullable: built-in programs (Push/Pull/Legs) have no owner,
            // user-created "custom workouts" are owned via this column.
            $table->foreignId('user_id')->nullable()
                ->constrained('users', 'id')
                ->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('programs');
    }
};
