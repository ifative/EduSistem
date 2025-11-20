<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('selections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('registration_id')->constrained()->cascadeOnDelete();
            $table->decimal('final_score', 8, 2)->default(0);
            $table->integer('rank')->nullable();
            $table->enum('status', ['pending', 'passed', 'failed', 'reserve'])->default('pending');
            $table->json('score_breakdown')->nullable()->comment('detailed scoring components');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('selections');
    }
};
