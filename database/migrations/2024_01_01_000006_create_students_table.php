<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('nis')->unique(); // School ID
            $table->string('nisn', 10)->unique(); // National ID
            $table->string('name');
            $table->enum('gender', ['male', 'female']);
            $table->string('birth_place');
            $table->date('birth_date');
            $table->string('religion')->nullable();
            $table->string('phone')->nullable();
            $table->text('address');
            $table->string('photo')->nullable();
            $table->string('parent_name');
            $table->string('parent_phone');
            $table->string('parent_email')->nullable();
            $table->year('entry_year');
            $table->string('previous_school')->nullable();
            $table->enum('status', ['active', 'graduated', 'transferred', 'dropped'])->default('active');
            $table->timestamps();

            $table->index('nis');
            $table->index('nisn');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
