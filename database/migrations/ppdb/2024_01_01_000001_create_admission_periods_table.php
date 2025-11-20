<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admission_periods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->date('registration_start');
            $table->date('registration_end');
            $table->date('selection_date')->nullable();
            $table->date('announcement_date')->nullable();
            $table->date('enrollment_start')->nullable();
            $table->date('enrollment_end')->nullable();
            $table->integer('quota')->default(0);
            $table->enum('status', ['draft', 'open', 'closed', 'selection', 'announced', 'enrollment', 'completed'])->default('draft');
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admission_periods');
    }
};
