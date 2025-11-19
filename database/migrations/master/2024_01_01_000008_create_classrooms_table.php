<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('classrooms', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "X IPA 1"
            $table->string('code');
            $table->foreignId('level_id')->constrained()->cascadeOnDelete();
            $table->foreignId('major_id')->nullable()->constrained()->nullOnDelete();
            $table->integer('capacity')->default(30);
            $table->foreignId('homeroom_teacher_id')->nullable()->constrained('teachers')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('classrooms');
    }
};
