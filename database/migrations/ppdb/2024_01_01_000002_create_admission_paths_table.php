<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admission_paths', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admission_period_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->enum('type', ['zonasi', 'prestasi', 'afirmasi', 'perpindahan', 'reguler'])->default('reguler');
            $table->integer('quota')->default(0);
            $table->decimal('min_score', 5, 2)->nullable();
            $table->decimal('max_distance', 10, 2)->nullable()->comment('in kilometers');
            $table->boolean('requires_test')->default(false);
            $table->boolean('requires_documents')->default(true);
            $table->json('selection_criteria')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admission_paths');
    }
};
