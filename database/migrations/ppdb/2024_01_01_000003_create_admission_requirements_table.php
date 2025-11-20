<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admission_requirements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admission_path_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('type', ['document', 'score', 'achievement', 'other'])->default('document');
            $table->boolean('is_required')->default(true);
            $table->string('file_types')->nullable()->comment('e.g., pdf,jpg,png');
            $table->integer('max_file_size')->nullable()->comment('in KB');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admission_requirements');
    }
};
