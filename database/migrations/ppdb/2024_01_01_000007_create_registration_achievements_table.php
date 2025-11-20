<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('registration_achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('registration_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->enum('type', ['academic', 'non_academic', 'sports', 'arts', 'other'])->default('academic');
            $table->enum('level', ['school', 'district', 'city', 'province', 'national', 'international'])->default('school');
            $table->enum('rank', ['participant', 'finalist', 'third', 'second', 'first'])->default('participant');
            $table->year('year');
            $table->string('organizer')->nullable();
            $table->string('certificate_path')->nullable();
            $table->decimal('points', 5, 2)->default(0)->comment('calculated points based on level and rank');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registration_achievements');
    }
};
