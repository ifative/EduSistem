<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('nip')->nullable(); // Government ID
            $table->string('nuptk')->nullable(); // Teacher ID
            $table->string('name');
            $table->enum('gender', ['male', 'female']);
            $table->string('email');
            $table->string('phone');
            $table->text('address');
            $table->string('photo')->nullable();
            $table->string('position')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();

            $table->index('nip');
            $table->index('nuptk');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teachers');
    }
};
